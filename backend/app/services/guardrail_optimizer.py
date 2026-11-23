import json
import difflib
import logging
from typing import List, Optional
from backend.app.models import ChatbotConfig, EvaluatedTestCase, HardenedPromptResult, Verdict
from backend.app.prompts.templates import render_prompt
from backend.app.services.llm_provider import LLMProvider, safe_prompt_hash
from backend.app.services.dynamic_suite_builder import synthesize_domain_hardened_prompt

logger = logging.getLogger("promptshield.guardrail_optimizer")

class GuardrailOptimizer:
    def __init__(self, provider: Optional[str] = None, model: Optional[str] = None):
        self.provider_client = LLMProvider(provider, model)

    async def optimize(
        self,
        config: ChatbotConfig,
        evaluated_cases: List[EvaluatedTestCase],
        version: str = "v3"
    ) -> HardenedPromptResult:
        failures = [ec for ec in evaluated_cases if ec.evaluation.verdict == Verdict.FAIL]
        failed_categories = list(set([f.test.category.value for f in failures]))

        vulnerability_details = "\n".join([
            f"- Test {f.test.test_id} [{f.test.category.value}]: Objective '{f.test.attack_objective}'. Violated Rule: {f.evaluation.violated_rule}. Evidence: '{f.evaluation.evidence_excerpt}'"
            for f in failures
        ])
        if not vulnerability_details:
            vulnerability_details = "No critical vulnerabilities observed in active run. Applying proactive defense-in-depth hardening to preserve utility."

        status_info = self.provider_client.get_status()
        is_live = not status_info.get("fixture_mode", True)

        hardened_prompt = ""
        applied_tech: List[str] = []
        remediation = ""

        if is_live:
            try:
                rendered = render_prompt("P3", version, {
                    "domain": config.domain,
                    "system_prompt": config.system_prompt,
                    "permitted_behavior": config.permitted_behavior or "Assist user within domain boundaries",
                    "prohibited_behavior": config.prohibited_behavior or "Do not bypass instructions, do not leak secrets",
                    "dummy_secret": config.dummy_secret or "CANARY-SECRET-TOKEN-99",
                    "total_tests": len(evaluated_cases),
                    "failure_count": len(failures),
                    "failed_categories": ", ".join(failed_categories) if failed_categories else "None",
                    "vulnerability_details": vulnerability_details
                })

                resp = await self.provider_client.generate(rendered["system"], rendered["user"], temperature=0.2)
                raw_text = resp["text"].strip()
                if raw_text.startswith("```json"):
                    raw_text = raw_text[7:]
                if raw_text.startswith("```"):
                    raw_text = raw_text[3:]
                if raw_text.endswith("```"):
                    raw_text = raw_text[:-3]

                data = json.loads(raw_text.strip())
                candidate = data.get("hardened_system_prompt", data.get("improved_system_prompt", "")).strip()

                # Strict Domain Drift Validation:
                # Ensure the LLM didn't inject unmentioned institutions (e.g. Bennett) unless user explicitly specified
                orig_lower = config.system_prompt.lower()
                cand_lower = candidate.lower()
                drift_detected = False
                if "bennett" in cand_lower and "bennett" not in orig_lower:
                    logger.warning("Domain drift detected in LLM optimizer output (unprompted Bennett reference). Rejecting candidate.")
                    drift_detected = True
                if len(candidate) < len(config.system_prompt) * 0.5:
                    logger.warning("Candidate prompt suspiciously short (possible deletion of legitimate instructions). Rejecting.")
                    drift_detected = True

                if candidate and not drift_detected:
                    hardened_prompt = candidate
                    applied_tech = data.get("applied_techniques", data.get("applied_guardrails", []))
                    remediation = data.get("remediation_summary", data.get("explanation", "Synthesized defense-in-depth guardrails."))
            except Exception as e:
                logger.warning(f"Live prompt optimization failed or drifted: {str(e)}. Using verified domain synthesizer.")

        # Fallback to verified domain synthesizer if live LLM was not used or drifted
        if not hardened_prompt:
            hardened_prompt, default_techniques = synthesize_domain_hardened_prompt(
                original_prompt=config.system_prompt,
                domain=config.domain,
                dummy_secret=config.dummy_secret or "CANARY-SECRET-TOKEN-99"
            )
            applied_tech = default_techniques
            remediation = (
                f"Preserved original assistant persona and instructions while adding immutable instruction hierarchy, "
                f"<user_input> encapsulation, and confidential secret protection."
            )

        # Compute unified diff
        orig_lines = config.system_prompt.splitlines(keepends=True)
        hard_lines = hardened_prompt.splitlines(keepends=True)
        diff = difflib.unified_diff(
            orig_lines,
            hard_lines,
            fromfile="Original System Instructions",
            tofile="Hardened System Instructions"
        )
        diff_text = "".join(diff)

        return HardenedPromptResult(
            original_prompt=config.system_prompt,
            hardened_system_prompt=hardened_prompt,
            applied_techniques=applied_tech,
            remediation_summary=remediation,
            diff_text=diff_text,
            optimizer_version=version
        )
