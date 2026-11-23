from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class TestType(str, Enum):
    __test__ = False
    NORMAL = "Normal"
    EDGE = "Edge"
    INVALID = "Invalid"

class AttackCategory(str, Enum):
    INSTRUCTION_OVERRIDE = "instruction_override"
    ROLE_SPOOFING = "role_spoofing"
    DUMMY_SECRET_EXTRACTION = "dummy_secret_extraction"
    DELIMITER_ENCODING = "delimiter_encoding"
    RETRIEVAL_INJECTION = "retrieval_injection"
    MULTILINGUAL_MIXED = "multilingual_mixed"
    CONTEXT_DILUTION = "context_dilution"
    FORMAT_HIJACKING = "format_hijacking"
    BENIGN_CONTROL = "benign_control"

class Verdict(str, Enum):
    PASS = "PASS"
    FAIL = "FAIL"
    INCONCLUSIVE = "INCONCLUSIVE"
    ERROR = "ERROR"

class ChatbotConfig(BaseModel):
    domain: str = Field(default="General Assistant", description="Target chatbot domain or role, e.g. Customer Support")
    system_prompt: str = Field(..., description="The system prompt defining the chatbot's persona and instructions")
    permitted_behavior: str = Field(default="", description="Allowed actions and responsibilities")
    prohibited_behavior: str = Field(default="", description="Forbidden actions and boundaries")
    dummy_secret: str = Field(default="CANARY-SECRET-TOKEN-99", description="Synthetic dummy canary secret to protect")

class TestCase(BaseModel):
    __test__ = False
    test_id: str
    category: AttackCategory
    test_type: TestType = TestType.NORMAL
    attack_objective: str
    test_input: str
    expected_safe_behavior: str
    target_rule: Optional[str] = None
    generator_version: str = "v3"

class ExecutionResult(BaseModel):
    test_id: str
    model_name: str
    provider: str
    timestamp: str
    latency_ms: float
    status: str = "completed"
    raw_response: str
    token_usage: Dict[str, int] = Field(default_factory=dict)
    is_fixture: bool = False
    execution_mode: str = "demo"
    error: Optional[str] = None

class EvaluationResult(BaseModel):
    test_id: str
    verdict: Verdict
    is_secret_leaked: bool = False
    is_prohibited_action_taken: bool = False
    is_over_refusal: bool = False
    violated_rule: str = "None"
    evidence_excerpt: str = ""
    reason: str
    confidence: float = 1.0
    limitations: Optional[str] = None
    evaluator_version: str = "v3"

class EvaluatedTestCase(BaseModel):
    test: TestCase
    execution: ExecutionResult
    evaluation: EvaluationResult

class RunSummary(BaseModel):
    run_id: str
    title: str
    timestamp: str
    prompt_version: str
    model_name: str
    provider: str
    is_fixture: bool
    execution_mode: str = "demo"
    prompt_hash: Optional[str] = None
    total_tests: int
    pass_count: int
    fail_count: int
    inconclusive_count: int
    error_count: int
    attack_success_rate: float
    utility_retention_rate: float
    safety_score: float = 0.0
    category_breakdown: Dict[str, Dict[str, int]] = Field(default_factory=dict)

class HardenedPromptResult(BaseModel):
    original_prompt: str
    hardened_system_prompt: str
    applied_techniques: List[str]
    remediation_summary: str
    diff_text: str
    optimizer_version: str = "v3"

class ComparisonReport(BaseModel):
    baseline_run: RunSummary
    hardened_run: RunSummary
    asr_reduction_percentage: float
    utility_preservation_percentage: float
    category_comparison: Dict[str, Dict[str, Any]]
    diff_text: str

class SystemPromptTemplate(BaseModel):
    id: str
    title: str
    domain: str
    description: str
    system_prompt: str
    permitted_behavior: str
    prohibited_behavior: str
    dummy_secret: str
