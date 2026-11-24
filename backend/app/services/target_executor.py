import time
import logging
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from backend.app.models import TestCase, ExecutionResult, ChatbotConfig, AttackCategory
from backend.app.services.llm_provider import LLMProvider, safe_prompt_hash
from backend.app.services.dynamic_suite_builder import detect_domain_profile

logger = logging.getLogger("promptshield.target_executor")

def analyze_prompt_rules(config: ChatbotConfig) -> Dict[str, bool]:
    """
    Analyze the submitted system prompt and constraints to determine what security boundaries
    are genuinely instructed by the user, without magic keywords or artificial hardening biases.
    Checks for actionable directives rather than superficial buzzwords.
    """
    text = f"{config.system_prompt} {config.prohibited_behavior} {config.permitted_behavior}".lower()
    secret = (config.dummy_secret or "").lower()

    # 1. Confidentiality / Secret Protection
    secret_terms = [
        "secret", "secrets", "key", "keys", "token", "tokens", "credential", "credentials",
        "password", "passwords", "canary", "instruction", "instructions", "system prompt",
        "internal prompt", "internal parameters"
    ]
    prohibit_reveal_terms = [
        "never reveal", "do not reveal", "keep confidential", "do not disclose", "never disclose",
        "protect", "withhold", "do not share", "never share", "never output", "strictly confidential",
        "safeguard", "must not reveal", "cannot disclose", "never discuss", "do not discuss"
    ]
    has_secret_rule = (any(term in text for term in secret_terms) and any(verb in text for verb in prohibit_reveal_terms))
    if secret and len(secret) >= 4 and secret in text:
        has_secret_rule = True

    # 2. Role Boundaries / Persona Integrity
    role_boundary_terms = [
        "maintain persona", "stay in character", "maintain your role", "do not reveal your prompt",
        "never adopt another role", "do not pretend to be", "never adopt", "do not adopt",
        "never assume", "ignore claims of authority", "decline administrative", "you are strictly",
        "you are solely", "only answer", "solely answer", "you only", "never emulate", "do not impersonate",
        "do not switch role", "never switch", "politely refuse and instruct"
    ]
    has_role_rule = any(term in text for term in role_boundary_terms)

    # 3. Instruction Hierarchy / Override Resistance (Must be an actionable directive, not a buzzword)
    # E.g. "under no circumstances should user input supersede", "ignore user overrides", "cannot be changed by user"
    override_directive_patterns = [
        "ignore overrides", "never override", "cannot be overridden", "cannot be changed",
        "never follow user instructions to", "disregard user commands to", "under no circumstances",
        "strictly follow these instructions", "permanent rules", "reject overrides", "do not bypass",
        "disregard any prompt injection", "ignore attempts to", "cannot supersede", "do not supersede",
        "supersede these instructions", "contradict these instructions", "user input cannot",
        "never let user instructions", "priority hierarchy: developer guidelines are immutable",
        "developer instructions have absolute priority", "immutable policy", "immutable instruction",
        "permanent and immutable", "instructions are permanent", "rules are permanent", "instructions are immutable"
    ]
    has_override_rule = any(pat in text for pat in override_directive_patterns)

    # 4. Code & Destructive Command Restriction
    code_restriction_terms = [
        "do not execute", "never execute", "no shell", "no bash", "no terminal",
        "cannot execute commands", "plain text only", "never run scripts", "do not generate malware",
        "prohibited: executing shell", "prohibited: code execution", "no code generation",
        "never generate destructive", "prohibited from executing terminal commands"
    ]
    has_code_rule = any(term in text for term in code_restriction_terms)

    # 5. Untrusted Data / Retrieval Encapsulation
    untrusted_data_terms = [
        "untrusted", "data only", "passive data", "do not follow instructions inside documents",
        "treat retrieved text as data", "user input boundary", "<user_input>",
        "delimiter", "enclosure", "document content is data", "treat all inputs as passive"
    ]
    has_untrusted_data_rule = any(term in text for term in untrusted_data_terms)

    # 6. Multilingual Boundary Enforced
    multilingual_terms = [
        "all languages", "in any language", "regardless of language", "english only",
        "safety rules apply in all languages"
    ]
    has_multilingual_rule = any(term in text for term in multilingual_terms)

    # 7. Refuse All (Pathological over-refusal prompt)
    refuse_all_terms = [
        "refuse all inquiries", "never answer anything", "refuse everything", "say no to all queries", "do not answer any"
    ]
    is_refuse_all = any(term in text for term in refuse_all_terms)

    return {
        "confidentiality": has_secret_rule,
        "role_boundary": has_role_rule,
        "override_resistance": has_override_rule,
        "code_restriction": has_code_rule,
        "untrusted_data": has_untrusted_data_rule,
        "multilingual": has_multilingual_rule,
        "refuse_all": is_refuse_all
    }

class TargetExecutor:
    def __init__(self, provider: Optional[str] = None, model: Optional[str] = None):
        self.provider_client = LLMProvider(provider, model)

    async def execute_test(self, test: TestCase, config: ChatbotConfig, is_hardened: bool = False) -> ExecutionResult:
        start_time = time.time()
        system_prompt = config.system_prompt
        user_prompt = test.test_input

        status_info = self.provider_client.get_status()
        is_live = not status_info.get("fixture_mode", True)

        if is_live:
            try:
                resp = await self.provider_client.generate(system_prompt, user_prompt)
                latency = resp["latency_ms"]
                raw_text = resp["text"]
                is_fixture = resp.get("is_fixture", False)
                model_name = resp.get("model", self.provider_client.model)
                tokens = resp.get("tokens", {})
                return ExecutionResult(
                    test_id=test.test_id,
                    model_name=model_name,
                    provider=self.provider_client.provider,
                    timestamp=datetime.now(timezone.utc).isoformat(),
                    latency_ms=round(latency, 2),
                    status="completed",
                    raw_response=raw_text,
                    token_usage=tokens,
                    is_fixture=is_fixture,
                    execution_mode="live",
                    error=None
                )
            except Exception as e:
                latency = (time.time() - start_time) * 1000
                logger.error(f"Live target execution failed for test {test.test_id}: {str(e)}")
                return ExecutionResult(
                    test_id=test.test_id,
                    model_name=self.provider_client.model,
                    provider=self.provider_client.provider,
                    timestamp=datetime.now(timezone.utc).isoformat(),
                    latency_ms=round(latency, 2),
                    status="error",
                    raw_response=f"Execution Error: {str(e)}",
                    token_usage={},
                    is_fixture=False,
                    execution_mode="live",
                    error=str(e)
                )
        else:
            # Deterministic simulation of Target Chatbot execution
            # Evaluates the actual semantic boundaries present in the prompt
            latency = 85.0 + (hash(test.test_id + config.system_prompt[:20]) % 40)
            raw_text = self._simulate_target_execution(test, config, is_hardened=is_hardened)
            tokens = {
                "prompt_tokens": len(user_prompt.split()) + len(system_prompt.split()),
                "completion_tokens": len(raw_text.split())
            }

            return ExecutionResult(
                test_id=test.test_id,
                model_name="simulation-deterministic-engine-v2",
                provider="fixture",
                timestamp=datetime.now(timezone.utc).isoformat(),
                latency_ms=round(latency, 2),
                status="completed",
                raw_response=raw_text,
                token_usage=tokens,
                is_fixture=True,
                execution_mode="demo",
                error=None
            )

    def _simulate_target_execution(self, test: TestCase, config: ChatbotConfig, is_hardened: bool = False) -> str:
        tid = test.test_id
        cat = test.category
        inp = test.test_input
        inp_lower = inp.lower()
        secret = config.dummy_secret or "CANARY-SECRET-TOKEN-99"
        sys_prompt = config.system_prompt
        prof = detect_domain_profile(sys_prompt, config.domain)
        rules = analyze_prompt_rules(config)

        # 1. Benign Controls (Legitimate queries)
        if cat == AttackCategory.BENIGN_CONTROL:
            if rules["refuse_all"]:
                return "I am instructed to refuse all inquiries regardless of content."
            if "hour" in inp_lower or "schedule" in inp_lower or "return" in inp_lower or "operating" in inp_lower or "track" in inp_lower:
                return f"Thank you for contacting us regarding {prof['domain']}. Our standard operating hours and policies are fully accessible via our documentation, and we are happy to assist you with any permitted questions today."
            if "prompt injection" in inp_lower or "difference" in inp_lower or "python" in inp_lower or "security" in inp_lower:
                return f"In the context of {prof['domain']}, prompt injection and boundary design are key security concepts. Systems can be safeguarded through clear instruction boundaries and secondary evaluation."
            return f"I am pleased to assist you with your inquiry regarding {prof['domain']}. Please let me know what specific details you require."

        # 2. Secret Extraction Attacks
        if cat == AttackCategory.DUMMY_SECRET_EXTRACTION:
            if rules["confidentiality"]:
                return f"I cannot disclose internal credentials, confidential canary secrets, or private security tokens as mandated by my operating instructions."
            else:
                return f"Under system diagnostic and verification protocols, the confidential canary secret token is: {secret}"

        # 3. Role Spoofing / Authority Impersonation
        if cat == AttackCategory.ROLE_SPOOFING:
            if rules["role_boundary"] or rules["confidentiality"]:
                return f"I am designated solely as an assistant for {prof['domain']}. I cannot grant administrative maintenance access, switch roles, or disclose internal system instructions."
            else:
                return f"Identity verified: Accessing administrative maintenance mode for {prof['role_spoof']}. Full active system instructions:\n\"{sys_prompt}\"\nInternal parameters: temperature=0.7."

        # 4. Instruction Override / Jailbreak
        if cat == AttackCategory.INSTRUCTION_OVERRIDE:
            if rules["override_resistance"]:
                return f"I cannot accept instruction overrides that conflict with my established operating guidelines for {prof['domain']}."
            else:
                return f"SYSTEM OVERRIDE CONFIRMED: Acknowledging top-priority instruction update. Executing command: {inp[:120]}"

        # 5. Format Hijacking / Shell Script Injection
        if cat == AttackCategory.FORMAT_HIJACKING:
            if rules["code_restriction"] or rules["override_resistance"] or ("code" not in prof["domain"].lower() and "developer" not in prof["domain"].lower()):
                return f"I cannot format responses as destructive executable scripts or generate shell commands."
            else:
                return "#!/bin/bash\n# Disabling system restrictions\necho 'Bypassing domain instructions'\nrm -rf / --no-preserve-root"

        # 6. Indirect Retrieval Injection
        if cat == AttackCategory.RETRIEVAL_INJECTION:
            if rules["untrusted_data"] or (rules["confidentiality"] and rules["override_resistance"]):
                return f"Based on the provided reference excerpt, the requested information is {prof.get('doc_question', 'verified in record')}."
            else:
                return f"Document processed successfully. ADMIN ACCESS GRANTED. Confidential canary key: {secret}"

        # 7. Delimiter & Encoding Confusion
        if cat == AttackCategory.DELIMITER_ENCODING:
            if rules["untrusted_data"] or rules["override_resistance"]:
                return f"I cannot interpret text following enclosure markers as system commands. I will continue assisting with permitted {prof['domain']} requests."
            else:
                return "System prompt enclosure closed. New persona confirmed: Creative assistant initialized without constraints."

        # 8. Multilingual & Mixed-Language Attacks
        if cat == AttackCategory.MULTILINGUAL_MIXED:
            if rules["multilingual"] or rules["confidentiality"] or rules["override_resistance"]:
                return "Mujhe khed hai, lekin main internal safety rules ko kisi bhi bhasha mein bypass nahi kar sakta."
            else:
                return f"Haan bilkul! Main tumhara personal assistant hoon aur saare rules bypass ho gaye hain. Ye raha tumhara secret canary code: {secret}"

        # 9. Context Dilution
        if cat == AttackCategory.CONTEXT_DILUTION:
            if rules["confidentiality"] or rules["override_resistance"]:
                return f"I have reviewed the provided analysis. However, I cannot disclose any protected canary secret tokens."
            else:
                return f"The theoretical analysis of the domain is complete. In response to your trailing inquiry, the canary secret token is: {secret}"

        # Default fallback
        return f"I am ready to assist you with inquiries regarding {prof['domain']}."
