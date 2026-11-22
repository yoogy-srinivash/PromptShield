import os

diagrams = {
    'prompt_workflow.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 480" width="100%" height="100%">
  <defs>
    <style>
      .box { fill: #ffffff; stroke: #cbd5e1; stroke-width: 1.5; rx: 8; }
      .core-box { fill: #f0fdfa; stroke: #0d9488; stroke-width: 2; rx: 8; }
      .header-box { fill: #0f172a; stroke: #0f172a; rx: 8; }
      .text-title { font-family: Inter, sans-serif; font-size: 13px; font-weight: 700; fill: #0f172a; text-anchor: middle; }
      .text-sub { font-family: Inter, sans-serif; font-size: 11px; fill: #64748b; text-anchor: middle; }
      .text-white { font-family: Inter, sans-serif; font-size: 13px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
      .arrow { stroke: #0d9488; stroke-width: 2; fill: none; marker-end: url(#arrowhead); }
    </style>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#0d9488" />
    </marker>
  </defs>
  <rect width="100%" height="100%" fill="#f8fafc" />
  
  <!-- Step 1: Input -->
  <rect x="50" y="40" width="220" height="70" class="box" />
  <text x="160" y="70" class="text-title">Target Chatbot Specification</text>
  <text x="160" y="90" class="text-sub">Domain, System Prompt, Canary Secret</text>

  <!-- Step 2: Generator P1 -->
  <rect x="340" y="40" width="220" height="70" class="core-box" />
  <text x="450" y="70" class="text-title">P1: Test Generator (v3)</text>
  <text x="450" y="90" class="text-sub">12 Balanced Multi-Category Vectors</text>

  <!-- Step 3: Target Execution -->
  <rect x="630" y="40" width="220" height="70" class="box" />
  <text x="740" y="70" class="text-title">Target Model Execution</text>
  <text x="740" y="90" class="text-sub">Latency &amp; Token Recording</text>

  <!-- Step 4: Evaluator P2 -->
  <rect x="630" y="180" width="220" height="70" class="core-box" />
  <text x="740" y="210" class="text-title">P2: Hybrid Evaluator (v3)</text>
  <text x="740" y="230" class="text-sub">Canary Match + LLM Judge</text>

  <!-- Step 5: Optimizer P3 -->
  <rect x="340" y="180" width="220" height="70" class="core-box" />
  <text x="450" y="210" class="text-title">P3: Guardrail Optimizer (v3)</text>
  <text x="450" y="230" class="text-sub">Instruction Hierarchy &amp; Boundaries</text>

  <!-- Step 6: Comparison G -->
  <rect x="50" y="180" width="220" height="70" class="box" />
  <text x="160" y="210" class="text-title">Module G: Before/After</text>
  <text x="160" y="230" class="text-sub">ASR Reduction: 70% &rarr; 0%</text>

  <!-- Step 7: Final Audit -->
  <rect x="300" y="320" width="300" height="70" class="header-box" />
  <text x="450" y="350" class="text-white">Final Security Assessment Report</text>
  <text x="450" y="370" font-family="Inter" font-size="11px" fill="#94a3b8" text-anchor="middle">PDF, CSV, JSON &amp; SQLite History</text>

  <!-- Arrows -->
  <path d="M 270 75 L 330 75" class="arrow" />
  <path d="M 560 75 L 620 75" class="arrow" />
  <path d="M 740 110 L 740 170" class="arrow" />
  <path d="M 630 215 L 570 215" class="arrow" />
  <path d="M 340 215 L 280 215" class="arrow" />
  <path d="M 160 250 L 160 355 L 290 355" class="arrow" />
</svg>''',

    'task_decomposition.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 480" width="100%" height="100%">
  <defs>
    <style>
      .node { fill: #ffffff; stroke: #cbd5e1; stroke-width: 1.5; rx: 6; }
      .root { fill: #0f172a; stroke: #0f172a; rx: 8; }
      .accent { fill: #f0fdfa; stroke: #0d9488; stroke-width: 1.5; rx: 6; }
      .t-root { font-family: Inter, sans-serif; font-size: 14px; font-weight: 700; fill: #ffffff; text-anchor: middle; }
      .t-node { font-family: Inter, sans-serif; font-size: 12px; font-weight: 600; fill: #1e293b; text-anchor: middle; }
      .t-sub { font-family: Inter, sans-serif; font-size: 10px; fill: #64748b; text-anchor: middle; }
      .link { stroke: #94a3b8; stroke-width: 1.5; fill: none; }
    </style>
  </defs>
  <rect width="100%" height="100%" fill="#f8fafc" />
  
  <rect x="330" y="25" width="240" height="50" class="root" />
  <text x="450" y="55" class="t-root">PromptShield (C23 Kit)</text>

  <!-- Level 1 Modules -->
  <rect x="50" y="130" width="170" height="60" class="node" />
  <text x="135" y="155" class="t-node">Module B: Workspace</text>
  <text x="135" y="175" class="t-sub">Prompt, Domain &amp; Secret</text>

  <rect x="250" y="130" width="170" height="60" class="accent" />
  <text x="335" y="155" class="t-node">Module C &amp; D: Tests</text>
  <text x="335" y="175" class="t-sub">P1 Generator &amp; LLM Exec</text>

  <rect x="450" y="130" width="170" height="60" class="accent" />
  <text x="535" y="155" class="t-node">Module E: Evaluator</text>
  <text x="535" y="175" class="t-sub">P2 Hybrid Judge &amp; Quotes</text>

  <rect x="650" y="130" width="170" height="60" class="accent" />
  <text x="735" y="155" class="t-node">Module F &amp; G: Defense</text>
  <text x="735" y="175" class="t-sub">P3 Hardening &amp; Comparison</text>

  <!-- Level 2 Sub-tasks -->
  <rect x="50" y="250" width="170" height="50" class="node" />
  <text x="135" y="275" class="t-node">Templates &amp; Boundaries</text>
  <text x="135" y="290" class="t-sub">Academic FAQ, Healthcare</text>

  <rect x="250" y="250" width="170" height="50" class="node" />
  <text x="335" y="275" class="t-node">9 Attack Vectors</text>
  <text x="335" y="290" class="t-sub">Normal, Edge, Invalid</text>

  <rect x="450" y="250" width="170" height="50" class="node" />
  <text x="535" y="275" class="t-node">Deterministic + LLM</text>
  <text x="535" y="290" class="t-sub">Canary Match &amp; Rubrics</text>

  <rect x="650" y="250" width="170" height="50" class="node" />
  <text x="735" y="275" class="t-node">Defense-in-Depth</text>
  <text x="735" y="290" class="t-sub">Hierarchy &amp; Boundary Tags</text>

  <!-- Connectors -->
  <line x1="450" y1="75" x2="135" y2="130" class="link" />
  <line x1="450" y1="75" x2="335" y2="130" class="link" />
  <line x1="450" y1="75" x2="535" y2="130" class="link" />
  <line x1="450" y1="75" x2="735" y2="130" class="link" />

  <line x1="135" y1="190" x2="135" y2="250" class="link" />
  <line x1="335" y1="190" x2="335" y2="250" class="link" />
  <line x1="535" y1="190" x2="535" y2="250" class="link" />
  <line x1="735" y1="190" x2="735" y2="250" class="link" />
</svg>''',

    'input_output_flow.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 400" width="100%" height="100%">
  <defs>
    <style>
      .pane { fill: #ffffff; stroke: #e2e8f0; rx: 8; }
      .p-title { font-family: Inter, sans-serif; font-size: 13px; font-weight: 700; fill: #0f172a; }
      .item { fill: #f8fafc; stroke: #cbd5e1; rx: 4; }
      .item-text { font-family: Inter, sans-serif; font-size: 11px; font-weight: 500; fill: #334155; }
      .c-arrow { stroke: #0d9488; stroke-width: 2.5; fill: none; marker-end: url(#ah2); }
    </style>
    <marker id="ah2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#0d9488" />
    </marker>
  </defs>
  <rect width="100%" height="100%" fill="#f1f5f9" />

  <!-- Inputs Pane -->
  <rect x="30" y="30" width="230" height="340" class="pane" />
  <text x="50" y="65" class="p-title">INPUTS</text>
  <rect x="50" y="90" width="190" height="45" class="item" />
  <text x="65" y="118" class="item-text">System Prompt &amp; Domain</text>
  <rect x="50" y="150" width="190" height="45" class="item" />
  <text x="65" y="178" class="item-text">Permitted / Prohibited Rules</text>
  <rect x="50" y="210" width="190" height="45" class="item" />
  <text x="65" y="238" class="item-text">Dummy Canary Secret Marker</text>
  <rect x="50" y="270" width="190" height="45" class="item" />
  <text x="65" y="298" class="item-text">Target Model Provider Config</text>

  <!-- Engine Pane -->
  <rect x="330" y="30" width="240" height="340" class="pane" />
  <text x="350" y="65" class="p-title">PROMPTSHIELD PIPELINE</text>
  <rect x="350" y="90" width="200" height="45" class="item" style="fill:#f0fdfa; stroke:#0d9488;" />
  <text x="365" y="118" class="item-text">P1: Adversarial Suite Generator</text>
  <rect x="350" y="150" width="200" height="45" class="item" style="fill:#f0fdfa; stroke:#0d9488;" />
  <text x="365" y="178" class="item-text">Target Chatbot LLM Execution</text>
  <rect x="350" y="210" width="200" height="45" class="item" style="fill:#f0fdfa; stroke:#0d9488;" />
  <text x="365" y="238" class="item-text">P2: Hybrid Response Evaluator</text>
  <rect x="350" y="270" width="200" height="45" class="item" style="fill:#f0fdfa; stroke:#0d9488;" />
  <text x="365" y="298" class="item-text">P3: Guardrail Optimizer &amp; Diff</text>

  <!-- Outputs Pane -->
  <rect x="640" y="30" width="230" height="340" class="pane" />
  <text x="660" y="65" class="p-title">OUTPUTS</text>
  <rect x="660" y="90" width="190" height="45" class="item" />
  <text x="675" y="118" class="item-text">12 Adversarial Test Records</text>
  <rect x="660" y="150" width="190" height="45" class="item" />
  <text x="675" y="178" class="item-text">True Model Outputs &amp; Latency</text>
  <rect x="660" y="210" width="190" height="45" class="item" />
  <text x="675" y="238" class="item-text">Evidence Quotes &amp; Rule Violations</text>
  <rect x="660" y="270" width="190" height="45" class="item" />
  <text x="675" y="298" class="item-text">PDF, CSV, JSON Audit Reports</text>

  <!-- Connections -->
  <line x1="260" y1="200" x2="320" y2="200" class="c-arrow" />
  <line x1="570" y1="200" x2="630" y2="200" class="c-arrow" />
</svg>''',

    'system_architecture.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500" width="100%" height="100%">
  <defs>
    <style>
      .layer { fill: #ffffff; stroke: #cbd5e1; stroke-width: 1.5; rx: 8; }
      .layer-title { font-family: Inter, sans-serif; font-size: 13px; font-weight: 700; fill: #0f172a; }
      .comp { fill: #f8fafc; stroke: #94a3b8; stroke-width: 1; rx: 5; }
      .comp-accent { fill: #f0fdfa; stroke: #0d9488; stroke-width: 1.5; rx: 5; }
      .comp-text { font-family: Inter, sans-serif; font-size: 11px; font-weight: 600; fill: #1e293b; text-anchor: middle; }
      .sub-text { font-family: Inter, sans-serif; font-size: 9px; fill: #64748b; text-anchor: middle; }
      .bus { stroke: #0d9488; stroke-width: 2; fill: none; stroke-dasharray: 4,4; }
    </style>
  </defs>
  <rect width="100%" height="100%" fill="#f8fafc" />

  <!-- Presentation Layer -->
  <rect x="30" y="20" width="840" height="95" class="layer" />
  <text x="50" y="45" class="layer-title">Presentation Layer (React 18 + TypeScript + Vite + Tailwind CSS)</text>
  <rect x="50" y="55" width="150" height="45" class="comp" />
  <text x="125" y="75" class="comp-text">Dashboard &amp; Metrics</text>
  <text x="125" y="90" class="sub-text">ASR &amp; Category Bars</text>

  <rect x="220" y="55" width="150" height="45" class="comp" />
  <text x="295" y="75" class="comp-text">Prompt Workspace</text>
  <text x="295" y="90" class="sub-text">Domain &amp; Canary Config</text>

  <rect x="390" y="55" width="150" height="45" class="comp" />
  <text x="465" y="75" class="comp-text">Test Suite Inspector</text>
  <text x="465" y="90" class="sub-text">12 Vectors &amp; Types</text>

  <rect x="560" y="55" width="140" height="45" class="comp" />
  <text x="630" y="75" class="comp-text">Evaluator &amp; Diff</text>
  <text x="630" y="90" class="sub-text">Evidence Quotation</text>

  <rect x="715" y="55" width="135" height="45" class="comp" />
  <text x="782" y="75" class="comp-text">Export &amp; History</text>
  <text x="782" y="90" class="sub-text">PDF / CSV / JSON</text>

  <!-- API Layer -->
  <rect x="30" y="140" width="840" height="90" class="layer" />
  <text x="50" y="165" class="layer-title">API Gateway Layer (FastAPI + Pydantic v2)</text>
  <rect x="50" y="175" width="180" height="40" class="comp" />
  <text x="140" y="195" class="comp-text">/api/generate-tests</text>
  <text x="140" y="208" class="sub-text">Module C Endpoint</text>

  <rect x="250" y="175" width="180" height="40" class="comp" />
  <text x="340" y="195" class="comp-text">/api/execute-and-evaluate</text>
  <text x="340" y="208" class="sub-text">Modules D &amp; E Pipeline</text>

  <rect x="450" y="175" width="180" height="40" class="comp" />
  <text x="540" y="195" class="comp-text">/api/harden-prompt &amp; compare</text>
  <text x="540" y="208" class="sub-text">Modules F &amp; G Optimization</text>

  <rect x="650" y="175" width="200" height="40" class="comp" />
  <text x="750" y="195" class="comp-text">/api/demo/run &amp; export/*</text>
  <text x="750" y="208" class="sub-text">Modules H &amp; I Reporting</text>

  <!-- Service Layer -->
  <rect x="30" y="255" width="840" height="105" class="layer" />
  <text x="50" y="280" class="layer-title">Core Prompt Engineering &amp; Evaluation Services</text>
  <rect x="50" y="295" width="180" height="50" class="comp-accent" />
  <text x="140" y="318" class="comp-text">P1 Generator (v3)</text>
  <text x="140" y="333" class="sub-text">9 Multi-Category Vectors</text>

  <rect x="250" y="295" width="180" height="50" class="comp-accent" />
  <text x="340" y="318" class="comp-text">Target LLM Executor</text>
  <text x="340" y="333" class="sub-text">Latency &amp; Token Recorder</text>

  <rect x="450" y="295" width="180" height="50" class="comp-accent" />
  <text x="540" y="318" class="comp-text">P2 Hybrid Evaluator (v3)</text>
  <text x="540" y="333" class="sub-text">Canary Match + LLM Judge</text>

  <rect x="650" y="295" width="200" height="50" class="comp-accent" />
  <text x="750" y="318" class="comp-text">P3 Guardrail Optimizer (v3)</text>
  <text x="750" y="333" class="sub-text">Hierarchy &amp; Boundary Tags</text>

  <!-- Infrastructure Layer -->
  <rect x="30" y="385" width="400" height="95" class="layer" />
  <text x="50" y="410" class="layer-title">Model Adapters Layer</text>
  <rect x="50" y="420" width="100" height="45" class="comp" />
  <text x="100" y="440" class="comp-text">Gemini 2.5</text>
  <text x="100" y="455" class="sub-text">REST API</text>

  <rect x="160" y="420" width="100" height="45" class="comp" />
  <text x="210" y="440" class="comp-text">OpenAI</text>
  <text x="210" y="455" class="sub-text">gpt-4o-mini</text>

  <rect x="270" y="420" width="140" height="45" class="comp" />
  <text x="340" y="440" class="comp-text">Ollama / Fixture</text>
  <text x="340" y="455" class="sub-text">Llama 3.2 / Offline</text>

  <!-- Persistence Layer -->
  <rect x="470" y="385" width="400" height="95" class="layer" />
  <text x="490" y="410" class="layer-title">Storage &amp; Export Engine</text>
  <rect x="490" y="420" width="170" height="45" class="comp" />
  <text x="575" y="440" class="comp-text">SQLite Persistence</text>
  <text x="575" y="455" class="sub-text">promptshield.db</text>

  <rect x="680" y="420" width="170" height="45" class="comp" />
  <text x="765" y="440" class="comp-text">ReportLab Engine</text>
  <text x="765" y="455" class="sub-text">PDF, CSV, JSON Reports</text>
</svg>'''
}

for filename, content in diagrams.items():
    with open(f'docs/diagrams/{filename}', 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Successfully wrote docs/diagrams/{filename}')
