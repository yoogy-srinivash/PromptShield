# Microsoft Form Submission Answers (Q1 – Q24)
**Course:** SCSE4041 Prompt Engineering · **University:** Bennett University  
**Milestone:** 2 (12 Marks) · **Team ID:** C23 · **Project Title:** PromptShield — Prompt Safety Tester (Red-Team Kit)

---

### Q1. Team ID
`C23`

### Q2. Team Name
`[NEEDS TEAM NAME]` *(As registered in Milestone 1)*

### Q3. Project Title
`PromptShield — Prompt Safety Tester (Red-Team Kit)`

### Q4. Team Leader Name
`[NEEDS REAL NAME 1]`

### Q5. Team Leader Enrollment Number
`[NEEDS ENROLLMENT S24CSEUXXXX]`

### Q6. Group (Batch)
`[NEEDS BATCH]` *(e.g. B13-24)*

### Q7. Enrollment Numbers of All Members (One per line)
```text
[NEEDS ENROLLMENT S24CSEUXXXX]
[NEEDS ENROLLMENT S24CSEUXXXX]
[NEEDS ENROLLMENT S24CSEUXXXX]
[NEEDS ENROLLMENT S24CSEUXXXX]
```

### Q8. Project Type (At most 2)
- Application (web/mobile/desktop)
- Developer Security & Testing Tool

### Q9. Main AI Tool and Model
`Google Gemini 2.5 Flash in Google AI Studio (with local deterministic simulation engine fallback)`

### Q10. Number of Final Prompts
`3`  
*(P1: Adversarial Test Generator, P2: Response Security Evaluator, P3: Guardrail Architecture Optimizer)*

### Q11. Prototype Link
`http://localhost:8000` *(Local deployed container; public URL unverified until cloud hosted by student team)*

### Q12. Repository or Folder Link
`[UNVERIFIED REPOSITORY URL — Pending Public Push by Team]` *(Local git repository initialized and tracked)*

### Q13. Reel Link
`[UNVERIFIED REEL URL — Pending Video Upload by Team]` *(Script prepared in docs/submission/REEL_SCRIPT.md)*

### Q14. Reel Exact Length in Seconds
`115` *(Must be strictly between 90 and 150 seconds)*

### Q15. Supporting Document Type
`Technical report`

### Q16. Upload Supporting Document
`TeamPromptShield_TechnicalReport.pdf` *(Under 10 MB)*

### Q17. Number of Test Inputs
`12`  
*(Tests T01 through T12: 6 Normal, 5 Edge, 1 Invalid)*

### Q18. Number of Prompt Versions
`9`  
*(3 meaningful iterations [v1, v2, v3] across 3 distinct prompts [P1, P2, P3])*

### Q19. Prototype Status
`All modules working`

### Q20. Names of Working Modules (One per line, matching status table)
```text
Module A — Dashboard
Module B — System Prompt Workspace
Module C — Red-Team Test Generator
Module D — Target Chatbot Execution
Module E — Response Evaluator
Module F — Guardrail Improvement
Module G — Before/After Comparison
Module H — Test History and Reporting
Module I — Built-in Evaluator Demo
```

### Q21. Upload Milestone 2 PDF
`M2_C23_PromptShield.pdf` *(Under 10 MB, exactly following 7 mandatory sections)*

### Q22. Main Task of Each Member (One line per member: Enrollment – Name – Task)
```text
[S24CSEUXXXX] – [NEEDS REAL NAME 1] – Architecture design, P1 generator (v1–v3), FastAPI backend routing
[S24CSEUXXXX] – [NEEDS REAL NAME 2] – P2 response evaluator (v1–v3), dual-judge logic, canary leak detector
[S24CSEUXXXX] – [NEEDS REAL NAME 3] – P3 guardrail optimizer (v1–v3), unified diff engine, benchmark comparison
[S24CSEUXXXX] – [NEEDS REAL NAME 4] – React 18 UI components, ReportLab PDF exporter, automated pytest suite
```

### Q23. Anything the Evaluator Should Know
```text
PromptShield is a self-contained, authorized defensive security evaluation suite for chatbot prompts.
1. Instant Launch: Run `python -m backend.app.main` and visit `http://localhost:8000` to open the full React dashboard.
2. Built-in Demo: Click 'Run Built-in Demo' in the top right to execute the complete end-to-end evaluation scenario (12 test vectors, baseline run, guardrail hardening, and before/after comparison) with zero setup.
3. Automated Tests: Run `pytest -v` to execute all 12 unit tests verifying schema adherence, prompt interpolation, and canary leak detection.
4. Export: Download dynamic ReportLab PDF audit reports directly from the 'History & Reports' tab.
```

### Q24. Confirmation
`[X] Confirmed — All team members have reviewed and agreed to the contribution table and submission contents.`
