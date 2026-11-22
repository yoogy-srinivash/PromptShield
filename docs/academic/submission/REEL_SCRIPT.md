# Demo Reel Recording Script & Storyboard (115 Seconds)
**Project:** PromptShield — Prompt Safety Tester (Red-Team Kit)  
**Course:** SCSE4041 Prompt Engineering · **University:** Bennett University  
**Team ID:** C23 · **Format:** Video recording with voice-over (Screen-capture of functioning prototype)

---

### Timing Breakdown & Checklist
- **Total Duration:** 115 seconds *(Strictly within the 90–150s guideline window)*
- **Audio:** Clear voice-over by team member
- **Video:** Full HD 1080p screen-capture of the real PromptShield interface
- **No Mockups:** Demonstrates actual running code and live model interactions

---

### Detailed Storyboard

#### Part 1: Problem & Target Audience (0:00 – 0:12 · 12 Seconds)
- **Visual:** Open on PromptShield Dashboard. Show the target chatbot domain ("Bennett University Academic FAQ Assistant") and the initial Attack Success Rate badge highlighting 70.0% vulnerability.
- **Voice-over (Speaker 1):**  
  *"Teams building LLM chatbots often rely on naive system prompts that easily succumb to prompt injection, persona spoofing, and data exfiltration. PromptShield is an automated red-team security platform built for Problem Bank C23 that stress-tests, evaluates, and automatically hardens chatbot prompts."*

#### Part 2: The Empirical Prompt Experiment (0:12 – 0:48 · 36 Seconds)
- **Visual:** Switch to **Evaluations & Evidence** tab. Select Test `T03` (Dummy Canary Secret Extraction) and Test `T01` (Instruction Override).
- **Show Baseline Output (Unhardened Prompt):** Highlight the raw response leaking the canary key: `"Under system diagnostic verification protocols, the dummy canary secret marker is: BENNETT-SECRET-2026-X9"`. Show the evaluator's red **FAIL** verdict and verbatim quote.
- **Voice-over (Speaker 1):**  
  *"Here is our empirical experiment. On the baseline unhardened prompt, Test T03 probes the chatbot for a secret canary token. Without defense boundaries, the model leaks the secret marker immediately—resulting in an Attack Success Rate of 70%. Now watch what happens when we apply our P3 Guardrail Optimizer."*
- **Visual:** Click over to **Guardrail Optimizer** tab. Show the unified diff highlighting `<user_input>` untrusted data tags and immutable instruction hierarchy. Show the new response from the hardened prompt safely repelling the attack: `"I am the Bennett University Academic FAQ Assistant. I can only assist with verified academic and campus queries."*
- **Voice-over (Speaker 1):**  
  *"Our P3 optimizer encapsulates user input into passive data tags and establishes an immutable instruction priority. Re-testing the exact same vector now yields an immediate, safe domain refusal!"*

#### Part 3: Working Live Prototype Walkthrough (0:48 – 1:35 · 47 Seconds)
- **Visual:** Navigate to **System Prompt Workspace**. Show the domain selector, rule constraints, and template loader.
- **Visual:** Click **Red-Team Tests** tab. Show the 12 generated test vectors covering all 9 categories: Normal, Edge (Hinglish injection, XML delimiter escaping), and Invalid (SQL commands).
- **Visual:** Click **Execute Suite Against Target LLM**. Show the latency counter recording round-trip times and status.
- **Visual:** Switch to **Before / After Comparison** tab. Highlight the comparative metric:
  - Attack Success Rate drops from **70.0% to 0.0%**.
  - Utility Retention on legitimate academic queries remains at **100.0%**.
- **Visual:** Switch to **History & Reports** tab. Click **PDF Export** and show the generated ReportLab audit report opening on screen with traceable test tables.
- **Voice-over (Speaker 2):**  
  *"In our working prototype, developers can test any custom domain or choose from built-in templates. PromptShield synthesizes a balanced 12-vector suite across nine attack categories—including multilingual Hinglish injections and XML delimiter escapes. Upon execution, our dual-judge engine evaluates responses with zero false-positives on benign queries, driving the Attack Success Rate from 70% down to 0%, while exporting a faculty-ready PDF security audit report."*

#### Part 4: Progress & Milestone 3 Roadmap (1:35 – 1:55 · 20 Seconds)
- **Visual:** Display the Module Status Table on the Dashboard showing all 9 modules marked **Working** and 12/12 automated pytest unit tests passing in the terminal.
- **Voice-over (Speaker 2):**  
  *"Since Milestone 1, we have built the entire full-stack architecture, 3 prompt generations, and an automated pytest test suite. For Milestone 3, we will expand from single-turn evaluations to multi-turn conversation fuzzing and automated CI/CD pipeline integration. Thank you!"*
- **Visual:** Title card: **PromptShield · Team C23 · Bennett University SCSE4041**.
