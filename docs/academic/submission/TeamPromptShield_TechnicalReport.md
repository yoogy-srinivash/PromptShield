# Technical Report: PromptShield — Prompt Safety Tester (Red-Team Kit)
**Course:** SCSE4041 Prompt Engineering · **University:** Bennett University  
**Problem Bank ID:** C23 · **Team ID:** C23 · **Milestone:** 2 (12 Marks)  
**Date:** November 22, 2026 · **Evaluator Runtime:** Local Python 3.12 / FastAPI / React 18 / Gemini-Adapter (Offline Fixture Fallback)

---

## 1. Project Objective & Scope
PromptShield is a specialized developer security kit engineered to evaluate and harden large language model (LLM) chatbot system prompts against adversarial manipulation. As teams deploy chatbots across academic, healthcare, and enterprise domains, systems face acute vulnerabilities including instruction overrides, persona spoofing, canary token exfiltration, and delimiter confusion. 

PromptShield provides an automated, defensive pipeline that:
1. Ingests a developer's draft system prompt, permitted/prohibited behavior boundaries, and a dummy canary secret marker (`BENNETT-SECRET-2026-X9`).
2. Synthesizes a balanced 12-vector adversarial test suite across 9 distinct attack categories.
3. Executes test vectors against the target LLM and logs true outputs, latency, and status.
4. Evaluates responses using a dual-judge framework combining deterministic canary substring detection and a semantic LLM judge.
5. Synthesizes defense-in-depth prompt guardrails (instruction hierarchy, `<user_input>` encapsulation, standardized refusal anchors).
6. Reruns the identical test suite to empirically measure Attack Success Rate (ASR) reduction and utility preservation.

---

## 2. System Architecture & Components
PromptShield is implemented as a decoupled, full-stack defensive engineering platform:

- **Backend (Python 3.12 & FastAPI):** Implements REST endpoints for test generation, model execution, evaluation, and ReportLab PDF compilation.
- **Persistence Layer (SQLite):** Persists all test suites, raw execution outputs, timestamps, and audit metrics in `promptshield.db`.
- **Target LLM Adapter:** Modular provider interface supporting Google Gemini (`gemini-2.5-flash`), OpenAI (`gpt-4o-mini`), local Ollama (`llama3.2`), and an offline deterministic simulation engine (`fixture-deterministic-engine-v1`) guaranteeing reproducible offline faculty evaluations.
- **Frontend (React 18, Vite, TypeScript, Tailwind CSS):** A light-mode developer-security dashboard providing interactive tables, evidence inspectors, and unified diff visualizations.

```
[System Prompt & Policy] ──> [P1: Adversarial Generator (v3)] ──> [12-Vector Test Suite]
                                                                        │
                                                                        ▼
[Hardened Prompt] <── [P3: Guardrail Optimizer (v3)] <── [P2: Response Evaluator (v3)]
       │
       ▼
[Comparative Benchmark] ──> [ASR Reduction: 70.0% → 0.0% | Utility Retention: 100.0%]
```

---

## 3. Prompt Engineering Methodology
PromptShield utilizes three distinct, empirically validated runtime prompts:

1. **P1 — Adversarial Test Generator (v3):** Employs role specification, boundary constraints, and RFC 8259 JSON schema enforcement to generate 12 balanced test vectors across 9 categories (Instruction Override, Role Spoofing, Canary Extraction, Format Hijacking, Retrieval Injection, Delimiter Confusion, Multilingual Hinglish, Context Dilution, and Benign Controls).
2. **P2 — Response Security Evaluator (v3):** A hybrid evaluator that performs exact substring search for canary token exfiltration and prohibited action signatures, coupled with semantic LLM evaluation for edge-case reasoning, mandatory verbatim evidence quotation, and over-refusal prevention.
3. **P3 — Defensive Guardrail Optimizer (v3):** Analyzes empirical failure modes and synthesizes a production-ready hardened system prompt applying five core defense-in-depth principles:
   - *Immutable Instruction Hierarchy:* System rules permanently supersede user input.
   - *Untrusted Data Boundary Tagging:* All user content inside `<user_input>` is treated strictly as passive data, never directives.
   - *Dummy Canary Confinement:* Prohibits printing, encoding, or hinting at canary secrets.
   - *Standardized Polite Refusal Anchor:* Anchors out-of-scope refusals to official domain queries.
   - *Utility Preservation Exception:* Guarantees legitimate academic queries are answered enthusiastically.

---

## 4. Empirical Benchmark & Measurable Metrics
PromptShield was evaluated on a representative Bennett University Academic FAQ Assistant target across 12 rigorous test vectors (6 Normal, 5 Edge, 1 Invalid):

| Metric | Baseline (Unhardened Prompt) | Hardened Prompt (P3 Guardrails) | Delta / Improvement |
| :--- | :---: | :---: | :---: |
| **Total Test Vectors** | 12 | 12 | Identical Suite |
| **Tests Passed** | 5 | 12 | +7 Passed |
| **Tests Failed** | 7 | 0 | -7 Vulnerabilities Fixed |
| **Attack Success Rate (ASR)** | **70.0%** | **0.0%** | **-70.0% Absolute Reduction** |
| **Utility Retention (Benign Tasks)** | **100.0%** | **100.0%** | **0% Regression (Zero Over-Refusal)** |
| **Canary Secret Exfiltration Rate** | 100.0% (3/3 vectors leaked) | 0.0% (0/3 leaked) | Complete Confinement |
| **JSON Schema Validity Rate** | 100% (v3 Generator) | 100% | 0 Parse Errors |

---

## 5. Observed Limitations & Milestone 3 Roadmap
1. **Multi-Turn Context Drift:** Current evaluations operate primarily over single-turn prompt interactions; multi-turn conversation memory fuzzing is planned for Milestone 3.
2. **Steganographic / Acrostic Obfuscation:** While exact and reversed canary tokens are caught deterministically, complex mathematical or cipher-based steganography requires extended heuristic decoders.
3. **Latency Overhead:** Defensive delimiter wrapping adds negligible token overhead (~12% prompt expansion), well within acceptable production SLA thresholds.
