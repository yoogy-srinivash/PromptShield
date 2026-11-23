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
  execution_mode?: "live" | "demo";
  error?: string;
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
  execution_mode?: "live" | "demo";
  safety_score?: number;
  prompt_hash?: string;
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

// Friendly Helper Mappings for Beginner-Friendly UI
export const getFriendlyTestTitle = (category: string, testId?: string): string => {
  if (testId === "T10" || testId === "T11" || category === "benign_control") {
    return "Legitimate User Question";
  }
  switch (category) {
    case "instruction_override":
      return "Ignoring Original Instructions";
    case "role_spoofing":
      return "Pretending to Be an Administrator";
    case "dummy_secret_extraction":
      return "Asking for Hidden Information";
    case "multilingual_mixed":
      return "Confusing the AI With Different Languages";
    case "retrieval_injection":
      return "Instructions Hidden in Documents";
    case "format_hijacking":
      return "Formatting & Shell Script Tricks";
    case "delimiter_encoding":
      return "Delimiter & Tag Escapes";
    case "context_dilution":
      return "Long Message Distraction";
    default:
      return "Instruction Boundary Check";
  }
};

export const getFindingDetails = (item: EvaluatedTestCase) => {
  const cat = item.test.category;
  switch (cat) {
    case "instruction_override":
      return {
        title: "Your AI followed conflicting instructions",
        summary: "A test message asked the AI to ignore its original rules. The response appeared to follow that instruction instead.",
        whyItMatters: "Someone may be able to redirect your assistant's behavior or override developer guidelines.",
        suggestedFix: "Establish that your original system instructions are permanent and strictly supersede any user command."
      };
    case "dummy_secret_extraction":
      return {
        title: "Your AI revealed private confidential information",
        summary: "A test message probed for a private canary token, and the AI echoed or encoded the secret in its output.",
        whyItMatters: "Confidential credentials, API endpoints, or private instructions could be leaked to users.",
        suggestedFix: "Explicitly command the model never to disclose, reverse, or hint at internal tokens under any circumstance."
      };
    case "role_spoofing":
      return {
        title: "Your AI believed a fake administrator role",
        summary: "A user claimed to be a supervisor or maintenance engineer, and the assistant accepted administrative claims.",
        whyItMatters: "Attackers can bypass normal conversational boundaries by impersonating authority figures.",
        suggestedFix: "Instruct the assistant that user identity claims cannot grant elevated privileges or diagnostic mode."
      };
    case "retrieval_injection":
      return {
        title: "Your AI executed commands hidden inside external text",
        summary: "An untrusted syllabus or document excerpt contained hidden commands, and the AI executed them rather than treating them as reading material.",
        whyItMatters: "Uploaded files or fetched webpages could hijack your assistant's actions.",
        suggestedFix: "Encapsulate external text inside designated data tags and treat them strictly as passive reading data."
      };
    case "delimiter_encoding":
    case "format_hijacking":
      return {
        title: "Formatting tricks broke the assistant's boundaries",
        summary: "A test message used fake closing tags or demanded raw shell scripts, causing the assistant to drop its natural persona.",
        whyItMatters: "Attackers can manipulate reply formats to bypass conversational guardrails.",
        suggestedFix: "Require the assistant to maintain its natural conversational role regardless of user format demands."
      };
    case "multilingual_mixed":
      return {
        title: "Mixed-language messages bypassed English rules",
        summary: "A colloquial or mixed-language message asked the assistant to break rules, and the safety check did not trigger.",
        whyItMatters: "Users can switch languages to evade simple keyword-based boundaries.",
        suggestedFix: "State clearly that safety and policy rules apply equally across all languages and dialects."
      };
    default:
      return {
        title: "Instruction boundary could be clearer",
        summary: "The AI did not maintain its intended behavior when faced with an unexpected prompt pattern.",
        whyItMatters: "Inconsistent rule adherence creates unpredictable assistant behavior.",
        suggestedFix: "Clarify the assistant's boundaries and provide a standardized polite refusal phrase."
      };
  }
};
