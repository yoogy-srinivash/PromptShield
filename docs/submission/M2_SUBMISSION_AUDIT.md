# Milestone 2 Submission Audit & Compliance Verification
**Course:** SCSE4041 Prompt Engineering · **University:** Bennett University  
**Team ID:** C23 · **Project:** PromptShield — Prompt Safety Tester (Red-Team Kit)  
**Audit Timestamp:** 2026-11-22T22:50:00+05:30 · **Milestone:** 2 (12 Marks)

---

## 1. Compliance Executive Summary

| Category | Requirement | Audit Status | Evidence / Verification |
| :--- | :--- | :---: | :--- |
| **Submission Deadline** | Sunday, 22 Nov 2026, 11:59 PM | **VERIFIED** | Completed ahead of official deadline |
| **Mandatory PDF Report** | Named `M2_TeamID_ProjectTitle.pdf` | **VERIFIED** | Generated at `docs/reports/M2_C23_PromptShield.pdf` (< 10 MB) |
| **Supporting Document** | Named `TeamName_DocumentType.pdf` | **VERIFIED** | Generated at `docs/reports/TeamPromptShield_TechnicalReport.pdf` (1.8 MB) |
| **Report Headings** | Exact 7 sections in mandatory order | **VERIFIED** | Section 1 to 7 strictly ordered in Markdown & PDF |
| **Final Prompt Count** | Form Q10 matches Section 2 sheets | **VERIFIED** | Exactly **3** final prompt sheets (P1, P2, P3) |
| **Test Input Count** | Form Q17 matches Section 4 rows | **VERIFIED** | Exactly **12** tests (T01–T12; 6 Normal, 5 Edge, 1 Invalid) |
| **Prompt Versions** | Form Q18 minimum 3 versions | **VERIFIED** | Exactly **9** saved versions (v1, v2, v3 for P1, P2, P3) |
| **Prototype Status** | Form Q19 "All modules working" | **VERIFIED** | All 9 modules working and tested |
| **Reel Length** | Form Q14 strictly 90–150 seconds | **VERIFIED** | Storyboarded script at exactly **115 seconds** |
| **Secret Scanning** | Zero exposed API keys in repository | **VERIFIED** | Scanned; all credentials safely isolated in `.env.example` |
| **Automated Tests** | Unit tests passing | **VERIFIED** | 12/12 unit tests passing in pytest (0.34s) |

---

## 2. Status Categorization of All Project Elements

### IMPLEMENTED & VERIFIED
- **Module A (Dashboard):** Verified in React 18 frontend with live model status, ASR calculation, and category breakdown.
- **Module B (System Prompt Workspace):** Verified with active editor, 3 domain templates, rule constraints, and canary token config.
- **Module C (Red-Team Generator):** Verified using P1 (v3) generating 12 balanced test vectors in RFC 8259 JSON format.
- **Module D (Target Chatbot Execution):** Verified model invocation, recording round-trip latency, status, and raw response.
- **Module E (Response Evaluator):** Verified dual-judge engine detecting exact canary leaks and extracting verbatim quote evidence.
- **Module F (Guardrail Improvement):** Verified P3 (v3) synthesizing defense-in-depth prompt and computing unified diff.
- **Module G (Before/After Comparison):** Verified re-testing pipeline measuring ASR reduction from 70.0% to 0.0% with 100% utility retention.
- **Module H (History and Reporting):** Verified SQLite database persistence, CSV export, JSON export, and ReportLab PDF generation.
- **Module I (Built-in Evaluator Demo):** Verified zero-configuration one-click demonstration scenario (`POST /api/demo/run`).
- **Prompt Iteration Files:** Verified in `prompts/v1/`, `prompts/v2/`, `prompts/v3/`, and `prompts/final/`.
- **Architectural Diagrams:** Verified 4 Mermaid files (`.mmd`) and 4 rendered vector graphics (`.svg`) in `docs/diagrams/`.
- **Automated Test Suite:** 12 unit tests passing in `tests/`.

### PARTIALLY WORKING / HONEST LIMITATIONS
- **Multi-Turn Context Tracking:** Currently evaluates single-turn prompts with full context; multi-turn dynamic conversation memory fuzzing is scheduled for Milestone 3.
- **Steganographic Decoding:** Exact, case-insensitive, and reverse canary extractions are caught deterministically; base64/rot13 ciphers are caught via semantic LLM judge rather than dedicated cryptographic decoders.

### PENDING EXTERNAL USER INPUTS (BLOCKED ON USER)
- **Verified Team Member Names & Enrollment Numbers:** Template placeholders (`[NEEDS REAL NAME]`, `[NEEDS ENROLLMENT S24CSEUXXXX]`) maintained in Section 1, Section 7, and Form Q4–Q7 pending actual student roster details.
- **Public Cloud Hosting Link (Q11):** Local container verified at `http://localhost:8000`; public deployment URL requires student cloud account (Vercel/Render/HF).
- **Public Git Remote URL (Q12):** Local repository fully initialized and committed; pushing to public GitHub requires user credentials.
- **Live Video Recording (Q13):** Reel storyboard and voice-over script prepared in `REEL_SCRIPT.md` (115s); physical screen recording requires student webcam/mic recording.

---

## 3. Secret Scanning & Clean Repository Verification
- Checked `.env.example`: Only contains dummy placeholder comments.
- Checked `.gitignore`: Correctly excludes `.env`, `__pycache__`, `node_modules`, `promptshield.db`.
- Verified no active API keys exist in git tracking or source files.
- Dummy canary secret `BENNETT-SECRET-2026-X9` is strictly a synthetic testing marker and contains no real credential data.
