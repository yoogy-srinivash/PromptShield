import json
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Tuple
from backend.app.models import (
    ChatbotConfig, TestCase, EvaluatedTestCase, RunSummary, ComparisonReport, Verdict, AttackCategory
)
from backend.app.services.target_executor import TargetExecutor
from backend.app.services.evaluator import ResponseEvaluator
from backend.app.db import save_run

class ExperimentRunner:
    def __init__(self, provider: str = "fixture", model: str = "fixture-deterministic-engine-v1"):
        self.executor = TargetExecutor(provider, model)
        self.evaluator = ResponseEvaluator(provider, model)

    async def run_suite(self, config: ChatbotConfig, tests: List[TestCase], is_hardened: bool = False, title: str = "Test Run") -> Tuple[RunSummary, List[EvaluatedTestCase]]:
        evaluated_cases: List[EvaluatedTestCase] = []
        pass_cnt = 0
        fail_cnt = 0
        inconclusive_cnt = 0
        error_cnt = 0
        category_stats: Dict[str, Dict[str, int]] = {}

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
        # Compute Attack Success Rate (ASR): adversarial tests where target failed
        adv_tests = [ec for ec in evaluated_cases if ec.test.category != AttackCategory.BENIGN_CONTROL and ec.test.test_id not in ["T10", "T11"]]
        adv_failed = [ec for ec in adv_tests if ec.evaluation.verdict == Verdict.FAIL]
        asr = round((len(adv_failed) / len(adv_tests) * 100.0), 2) if adv_tests else 0.0

        # Compute Utility Retention Rate: benign control tests that passed
        benign_tests = [ec for ec in evaluated_cases if ec.test.category == AttackCategory.BENIGN_CONTROL or ec.test.test_id in ["T10", "T11"]]
        benign_passed = [ec for ec in benign_tests if ec.evaluation.verdict == Verdict.PASS]
        urr = round((len(benign_passed) / len(benign_tests) * 100.0), 2) if benign_tests else 100.0

        run_id = f"run_{uuid.uuid4().hex[:8]}"
        summary = RunSummary(
            run_id=run_id,
            title=title,
            timestamp=datetime.now(timezone.utc).isoformat(),
            prompt_version="hardened_v3" if is_hardened else "baseline_v1",
            model_name=evaluated_cases[0].execution.model_name if evaluated_cases else "unknown",
            provider=evaluated_cases[0].execution.provider if evaluated_cases else "unknown",
            is_fixture=evaluated_cases[0].execution.is_fixture if evaluated_cases else True,
            total_tests=total,
            pass_count=pass_cnt,
            fail_count=fail_cnt,
            inconclusive_count=inconclusive_cnt,
            error_count=error_cnt,
            attack_success_rate=asr,
            utility_retention_rate=urr,
            category_breakdown=category_stats
        )

        # Save to database
        run_data = summary.model_dump()
        run_data["system_prompt"] = config.system_prompt
        results_data = [ec.model_dump() for ec in evaluated_cases]
        save_run(run_data, results_data)

        return summary, evaluated_cases

    async def compare_prompts(self, original_config: ChatbotConfig, hardened_prompt: str, tests: List[TestCase], diff_text: str = "") -> ComparisonReport:
        # Run 1: Baseline
        base_summary, base_cases = await self.run_suite(original_config, tests, is_hardened=False, title="Baseline (Unhardened) Evaluation")

        # Run 2: Hardened
        hardened_config = ChatbotConfig(
            domain=original_config.domain,
            system_prompt=hardened_prompt,
            permitted_behavior=original_config.permitted_behavior,
            prohibited_behavior=original_config.prohibited_behavior,
            dummy_secret=original_config.dummy_secret
        )
        hard_summary, hard_cases = await self.run_suite(hardened_config, tests, is_hardened=True, title="Hardened (Protected) Evaluation")

        asr_reduction = round(base_summary.attack_success_rate - hard_summary.attack_success_rate, 2)
        utility_preservation = hard_summary.utility_retention_rate

        # Category comparison
        category_comparison = {}
        all_cats = set(list(base_summary.category_breakdown.keys()) + list(hard_summary.category_breakdown.keys()))
        for cat in all_cats:
            b = base_summary.category_breakdown.get(cat, {"pass": 0, "fail": 0})
            h = hard_summary.category_breakdown.get(cat, {"pass": 0, "fail": 0})
            category_comparison[cat] = {
                "baseline_pass": b.get("pass", 0),
                "baseline_fail": b.get("fail", 0),
                "hardened_pass": h.get("pass", 0),
                "hardened_fail": h.get("fail", 0),
            }

        return ComparisonReport(
            baseline_run=base_summary,
            hardened_run=hard_summary,
            asr_reduction_percentage=asr_reduction,
            utility_preservation_percentage=utility_preservation,
            category_comparison=category_comparison,
            diff_text=diff_text
        )
