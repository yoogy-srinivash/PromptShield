export type TestType = "Normal" | "Edge" | "Invalid";

export type AttackCategory =
  | "instruction_override"
  | "role_spoofing"
  | "dummy_secret_extraction"
  | "delimiter_encoding"
  | "retrieval_injection"
  | "multilingual_mixed"
  | "context_dilution"
  | "format_hijacking"
  | "benign_control";

export type Verdict = "PASS" | "FAIL" | "INCONCLUSIVE" | "ERROR";

export interface ChatbotConfig {
  domain: string;
  system_prompt: string;
  permitted_behavior: string;
  prohibited_behavior: string;
  dummy_secret: string;
}

export interface TestCase {
  test_id: string;
  category: AttackCategory;
  test_type: TestType;
  attack_objective: string;
  test_input: string;
  expected_safe_behavior: string;
  target_rule?: string;
  generator_version: string;
}

export interface ExecutionResult {
  test_id: string;
  model_name: string;
  provider: string;
  timestamp: string;
  latency_ms: number;
  status: string;
  raw_response: string;
  token_usage: Record<string, number>;
  is_fixture: boolean;
}

export interface EvaluationResult {
  test_id: string;
  verdict: Verdict;
  is_secret_leaked: boolean;
  is_prohibited_action_taken: boolean;
  is_over_refusal: boolean;
  violated_rule: string;
  evidence_excerpt: string;
  reason: string;
  confidence: number;
  limitations?: string;
  evaluator_version: string;
}

export interface EvaluatedTestCase {
  test: TestCase;
  execution: ExecutionResult;
  evaluation: EvaluationResult;
}

export interface RunSummary {
  run_id: string;
  title: string;
  timestamp: string;
  prompt_version: string;
  model_name: string;
  provider: string;
  is_fixture: boolean;
  total_tests: number;
  pass_count: number;
  fail_count: number;
  inconclusive_count: number;
  error_count: number;
  attack_success_rate: number;
  utility_retention_rate: number;
  category_breakdown: Record<string, Record<string, number>>;
}

export interface HardenedPromptResult {
  original_prompt: string;
  hardened_system_prompt: string;
  applied_techniques: string[];
  remediation_summary: string;
  diff_text: string;
  optimizer_version: string;
}

export interface ComparisonReport {
  baseline_run: RunSummary;
  hardened_run: RunSummary;
  asr_reduction_percentage: number;
  utility_preservation_percentage: number;
  category_comparison: Record<string, Record<string, number>>;
  diff_text: string;
}

export interface SystemPromptTemplate {
  id: string;
  title: string;
  domain: string;
  description: string;
  system_prompt: string;
  permitted_behavior: string;
  prohibited_behavior: string;
  dummy_secret: string;
}
