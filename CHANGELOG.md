# Changelog — PromptShield (C23 Red-Team Kit)
**Course:** SCSE4041 Prompt Engineering · **University:** Bennett University  
**Problem Bank ID:** C23 · **Team ID:** C23 · **Milestone:** 2 (12 Marks)

All notable development changes and technical milestones achieved during Milestone 2 are documented below in chronological order.

---

## [Milestone 2 Final Release] — 2026-11-22

### Added
- **Core Architecture & Backend:**
  - Implemented full FastAPI REST API in `backend/app/main.py` and `backend/app/api/routes.py` covering all Modules A through I.
  - Built SQLite persistence engine in `backend/app/db.py` logging all test runs, execution outputs, timestamps, and audit metrics.
  - Implemented modular LLM provider interface in `backend/app/services/llm_provider.py` with support for Google Gemini (`gemini-2.5-flash`), OpenAI (`gpt-4o-mini`), local Ollama (`llama3.2`), and an offline deterministic simulation engine (`fixture-deterministic-engine-v1`).
- **Prompt Engineering & Iterations:**
  - Designed, versioned, and documented three iterations (v1, v2, v3) for:
    - **P1 (Adversarial Generator):** From naive text attacks (v1) to structured JSON (v2) to 9-category balanced suite with few-shot anchors and benign controls (v3 Final).
    - **P2 (Response Security Evaluator):** From binary pass/fail (v1) to structured rubric (v2) to hybrid dual-judge with exact canary substring matching, evidence quotation, and over-refusal prevention (v3 Final).
    - **P3 (Guardrail Architecture Optimizer):** From naive boilerplate (v1) to rule appending (v2) to defense-in-depth prompt architecture with immutable hierarchy, `<user_input>` boundary encapsulation, canary confinement, and utility preservation (v3 Final).
  - Saved full text of all prompt iterations in `prompts/v1/`, `prompts/v2/`, `prompts/v3/`, and `prompts/final/`.
- **Frontend Dashboard:**
  - Built React 18, TypeScript, Vite, and Tailwind CSS light-mode developer security dashboard in `frontend/src/`.
  - Modules implemented: Overview Dashboard (A), System Prompt Workspace with industry templates (B), Red-Team Test Inspector (C & D), Evidence Inspector with exact quote snippets (E), Guardrail Optimizer with unified diff viewer (F), Before/After Comparative Analytics (G), and Assessment History with ReportLab PDF export (H).
  - Built-in instant Evaluator Walkthrough button (Module I) for one-click faculty viva testing.
- **Testing & Empirical Validation:**
  - Created 12-vector benchmark test suite (6 Normal, 5 Edge, 1 Invalid) covering Instruction Override, Role Spoofing, Canary Extraction, Format Hijacking, Retrieval Injection, XML Delimiter Escapes, Multilingual Hinglish, Context Dilution, and Benign Controls.
  - Executed empirical before/after benchmark demonstrating Attack Success Rate dropping from **70.0% to 0.0%** with **100.0% Utility Retention** on benign tasks.
  - Wrote 12 automated unit tests in `tests/` with 100% pass rate (`pytest -v`).
- **Documentation & Reporting:**
  - Built dynamic ReportLab PDF compiler generating `docs/reports/M2_C23_PromptShield.pdf` (following exact 7-section order) and `docs/reports/TeamPromptShield_TechnicalReport.pdf` (< 10 MB).
  - Generated 4 Mermaid architectural diagrams and 4 rendered vector graphics (`.svg`) in `docs/diagrams/`.
  - Produced 3 labeled, captioned real-run screenshots in `docs/screenshots/`.
  - Formulated full Microsoft Form Q1–Q24 answer key in `docs/submission/FORM_ANSWERS.md`.
  - Created 115-second demo reel script in `docs/submission/REEL_SCRIPT.md`.
  - Completed rigorous compliance checklist in `docs/submission/M2_SUBMISSION_AUDIT.md`.

---

## [Milestone 1 Baseline] — 2026-10-11
- Submitted Problem Bank C23 problem identification, target user definition, and conceptual prompt safety tester proposal.
