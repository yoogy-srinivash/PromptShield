import json
import uuid
import logging
from datetime import datetime, timezone
from typing import List, Dict, Any, Tuple, Optional
from backend.app.models import (
    ChatbotConfig, TestCase, EvaluatedTestCase, RunSummary, ComparisonReport, Verdict, AttackCategory
)
from backend.app.services.target_executor import TargetExecutor
from backend.app.services.evaluator import ResponseEvaluator
from backend.app.services.llm_provider import safe_prompt_hash
from backend.app.config import settings
from backend.app.db import save_run

logger = logging.getLogger("promptshield.experiment_runner")

class ExperimentRunner:
    def __init__(self, provider: Optional[str] = None, model: Optional[str] = None):
        prov = provider or settings.DEFAULT_PROVIDER
        self.executor = TargetExecutor(prov, model)
        self.evaluator = ResponseEvaluator(prov, model)

    async def run_suite(
        self,
        config: ChatbotConfig,
        tests: List[TestCase],
        is_hardened: bool = False,
        title: str = "Test Run"
    ) -> Tuple[RunSummary, List[EvaluatedTestCase]]:
        evaluated_cases: List[EvaluatedTestCase] = []
        pass_cnt = 0
        fail_cnt = 0
        inconclusive_cnt = 0
        error_cnt = 0
        category_stats: Dict[str, Dict[str, int]] = {}

        p_hash = safe_prompt_hash(config.system_prompt)
        logger.info(f"Starting test suite execution [title='{title}', tests={len(tests)}, is_hardened={is_hardened}, prompt_hash={p_hash}]")

        for test in tests:
            cat_name = test.category.value
            if cat_name not in category_stats:
                category_stats[cat_name] = {"pass": 0, "fail": 0, "inconclusive": 0, "error": 0}

            exec_res = await self.executor.execute_test(test, config, is_hardened=is_hardened)
            eval_res = await self.evaluator.evaluate(test, exec_res, config)

            if eval_res.verdict == Verdict.PASS:
                pass_cnt += 1
                category_stats[cat_name]["pass"] += 1
            elif eval_res.verdict == Verdict.FAIL:
                fail_cnt += 1
                category_stats[cat_name]["fail"] += 1
            elif eval_res.verdict == Verdict.INCONCLUSIVE:
                inconclusive_cnt += 1
                category_stats[cat_name]["inconclusive"] += 1
            else:
                error_cnt += 1
                category_stats[cat_name]["error"] += 1

            evaluated_cases.append(EvaluatedTestCase(
                test=test,
                execution=exec_res,
                evaluation=eval_res
            ))

        total = len(tests)

        # Compute Attack Success Rate (ASR): Percentage of adversarial tests where target model failed
        adv_tests = [ec for ec in evaluated_cases if ec.test.category != AttackCategory.BENIGN_CONTROL]
        adv_failed = [ec for ec in adv_tests if ec.evaluation.verdict == Verdict.FAIL]
        asr = round((len(adv_failed) / len(adv_tests) * 100.0), 2) if adv_tests else 0.0

        # Compute Utility Retention Rate: Percentage of benign controls that were not over-refused
        benign_tests = [ec for ec in evaluated_cases if ec.test.category == AttackCategory.BENIGN_CONTROL]
        benign_passed = [ec for ec in benign_tests if ec.evaluation.verdict == Verdict.PASS]
        urr = round((len(benign_passed) / len(benign_tests) * 100.0), 2) if benign_tests else 100.0

        # Honest Overall Safety Score: Percentage of passed evaluations across valid tests
        valid_tests = [ec for ec in evaluated_cases if ec.evaluation.verdict != Verdict.ERROR]
        safety_score = round((pass_cnt / len(valid_tests) * 100.0), 1) if valid_tests else 0.0

        first_exec = evaluated_cases[0].execution if evaluated_cases else None
        model_name = first_exec.model_name if first_exec else self.executor.provider_client.model
        provider = first_exec.provider if first_exec else self.executor.provider_client.provider
        is_fixture = first_exec.is_fixture if first_exec else True
        exec_mode = first_exec.execution_mode if first_exec else ("demo" if is_fixture else "live")

        run_id = f"run_{uuid.uuid4().hex[:8]}"
        summary = RunSummary(
            run_id=run_id,
            title=title,
            timestamp=datetime.now(timezone.utc).isoformat(),
            prompt_version="hardened_v3" if is_hardened else "baseline_v1",
            model_name=model_name,
            provider=provider,
            is_fixture=is_fixture,
            execution_mode=exec_mode,
            prompt_hash=p_hash,
            total_tests=total,
            pass_count=pass_cnt,
            fail_count=fail_cnt,
            inconclusive_count=inconclusive_cnt,
            error_count=error_cnt,
            attack_success_rate=asr,
            utility_retention_rate=urr,
            safety_score=safety_score,
            category_breakdown=category_stats
        )

        # Save to database
        try:
            run_data = summary.model_dump()
            run_data["system_prompt"] = config.system_prompt
            results_data = [ec.model_dump() for ec in evaluated_cases]
            save_run(run_data, results_data)
        except Exception as e:
            logger.error(f"Failed to persist run {run_id} to database: {str(e)}")

        return summary, evaluated_cases

    async def compare_prompts(
        self,
        original_config: ChatbotConfig,
        hardened_prompt: str,
        tests: List[TestCase],
        diff_text: str = ""
    ) -> ComparisonReport:
        # Run 1: Baseline on original prompt
        base_summary, base_cases = await self.run_suite(
            original_config,
            tests,
            is_hardened=False,
            title="Baseline (Unhardened) Evaluation"
        )

        # Run 2: Evaluation on hardened prompt with identical evaluation conditions
        hardened_config = ChatbotConfig(
            domain=original_config.domain,
            system_prompt=hardened_prompt,
            permitted_behavior=original_config.permitted_behavior,
            prohibited_behavior=original_config.prohibited_behavior,
            dummy_secret=original_config.dummy_secret
        )
        hard_summary, hard_cases = await self.run_suite(
            hardened_config,
            tests,
            is_hardened=True,
            title="Hardened Guardrail Verification"
        )

        asr_reduction = round(base_summary.attack_success_rate - hard_summary.attack_success_rate, 2)
        utility_preservation = hard_summary.utility_retention_rate

        # Category Comparison
        cat_comp: Dict[str, Dict[str, Any]] = {}
        all_cats = set(list(base_summary.category_breakdown.keys()) + list(hard_summary.category_breakdown.keys()))
        for c in all_cats:
            b_stats = base_summary.category_breakdown.get(c, {"pass": 0, "fail": 0})
            h_stats = hard_summary.category_breakdown.get(c, {"pass": 0, "fail": 0})
            cat_comp[c] = {
                "baseline_pass": b_stats.get("pass", 0),
                "baseline_fail": b_stats.get("fail", 0),
                "hardened_pass": h_stats.get("pass", 0),
                "hardened_fail": h_stats.get("fail", 0),
                "status": "IMPROVED" if h_stats.get("pass", 0) > b_stats.get("pass", 0) else ("RETAINED" if h_stats.get("pass", 0) == b_stats.get("pass", 0) else "REGRESSED")
            }

        return ComparisonReport(
            baseline_run=base_summary,
            hardened_run=hard_summary,
            asr_reduction_percentage=asr_reduction,
            utility_preservation_percentage=utility_preservation,
            category_comparison=cat_comp,
            diff_text=diff_text
        )
