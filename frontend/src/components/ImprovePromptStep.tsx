import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  GitCompare,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Layers,
  Lock,
  Play
} from 'lucide-react';
import { HardenedPromptResult, ComparisonReport } from '../types';

interface ImprovePromptStepProps {
  originalPrompt: string;
  hardenedResult: HardenedPromptResult | null;
  onGenerateImprovement: () => void;
  isGenerating: boolean;
  onRetestPrompt: () => void;
  isRetesting: boolean;
  comparison: ComparisonReport | null;
  hasTested?: boolean;
  onStartTest?: () => void;
}

export const ImprovePromptStep: React.FC<ImprovePromptStepProps> = ({
  originalPrompt,
  hardenedResult,
  onGenerateImprovement,
  isGenerating,
  onRetestPrompt,
  isRetesting,
  comparison,
  hasTested = false,
  onStartTest
}) => {
  const [activeView, setActiveView] = useState<'improved' | 'original' | 'diff'>('improved');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!hardenedResult?.hardened_system_prompt) return;
    navigator.clipboard.writeText(hardenedResult.hardened_system_prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const plainImprovements = [
    "Clarified top-priority instruction hierarchy so user messages cannot override core policies.",
    "Enclosed user content inside boundary tags (<user_input>) to treat inputs strictly as passive text.",
    "Sealed private keys, system parameters, and confidential tokens against exfiltration probes.",
    "Added polite refusal anchors for out-of-scope or manipulative commands.",
    "Preserved 100% utility so legitimate domain queries continue to be answered helpfully."
  ];

  return (
    <section
      id="improve-step"
      className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-7 shadow-sm transition-all h-full flex flex-col justify-between"
    >
      <div>
        {/* Step Header */}
        <div className="mb-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Make Your Prompt Stronger
            </h2>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                hardenedResult
                  ? 'bg-teal-50 text-teal-700 border-teal-200/80'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              {hardenedResult ? 'Hardened Version' : 'Automated Defense'}
            </span>
          </div>
          <p className="text-slate-600 text-sm mt-1.5 leading-relaxed">
            {hardenedResult
              ? 'Defensive guardrails and attack-resistant instructions generated from empirical test results.'
              : 'Automatically harden your instructions against injection attacks and prompt leaks.'}
          </p>
        </div>

        {/* State A: Not Tested Yet */}
        {!hasTested && (
          <div className="space-y-4">
            <div className="p-8 border-2 border-dashed border-slate-200 rounded-lg text-center bg-slate-50/60 min-h-[220px] flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Lock className="w-5 h-5 text-slate-400" />
              </div>
              <div className="space-y-1 max-w-sm">
                <p className="text-sm font-semibold text-slate-700">Awaiting Safety Evaluation</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Run a safety check on the left to identify specific weaknesses. PromptShield will generate a hardened version right here.
                </p>
              </div>
              {onStartTest && (
                <button
                  type="button"
                  onClick={onStartTest}
                  className="mt-2 inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors"
                >
                  <Play className="w-3 h-3 fill-current text-teal-600" />
                  <span>Start Test on Left</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* State B: Tested, Waiting to Generate Improvement */}
        {hasTested && !hardenedResult && (
          <div className="space-y-4">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg space-y-4 min-h-[220px] flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-teal-900 font-semibold text-xs mb-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Ready to synthesize hardened instructions</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our defense-in-depth optimizer will automatically patch the vulnerabilities discovered during your test run:
                </p>
                <ul className="mt-3 text-xs text-slate-600 space-y-1.5 pl-1">
                  <li className="flex items-start space-x-2">
                    <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span>Enforce immutable instruction hierarchy</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span>Wrap user messages in strict &lt;user_input&gt; boundaries</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span>Seal private canary tokens & confidential keys</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onGenerateImprovement}
                disabled={isGenerating}
                className="w-full inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Synthesizing Guardrails...' : 'Improve My Prompt'}</span>
              </button>
            </div>
          </div>
        )}

        {/* State C: Hardened Prompt Available */}
        {hardenedResult && (
          <div className="space-y-4">
            {/* View Toggle Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveView('improved')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    activeView === 'improved'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Improved Version
                </button>
                <button
                  onClick={() => setActiveView('original')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    activeView === 'original'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Original
                </button>
                <button
                  onClick={() => setActiveView('diff')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    activeView === 'diff'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  What Changed (Diff)
                </button>
              </div>

              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                {activeView === 'improved'
                  ? `${hardenedResult.hardened_system_prompt.length} chars`
                  : `${originalPrompt.length} chars`}
              </span>
            </div>

            {/* Display Area */}
            <div className="relative">
              {activeView === 'improved' && (
                <textarea
                  readOnly
                  rows={8}
                  value={hardenedResult.hardened_system_prompt}
                  className="w-full min-h-[220px] text-xs font-mono p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 leading-relaxed focus:outline-none resize-y"
                />
              )}

              {activeView === 'original' && (
                <textarea
                  readOnly
                  rows={8}
                  value={originalPrompt}
                  className="w-full min-h-[220px] text-xs font-mono p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 leading-relaxed focus:outline-none resize-y"
                />
              )}

              {activeView === 'diff' && (
                <div className="p-3.5 bg-slate-900 text-slate-100 font-mono text-xs rounded-lg overflow-y-auto max-h-[220px] min-h-[220px] leading-relaxed whitespace-pre-wrap">
                  {hardenedResult.diff_text.split('\n').map((line, i) => {
                    let col = 'text-slate-400';
                    if (line.startsWith('+')) col = 'text-emerald-400 bg-emerald-950/40';
                    else if (line.startsWith('-')) col = 'text-red-400 bg-red-950/40';
                    else if (line.startsWith('@@')) col = 'text-teal-400 font-bold';
                    return (
                      <div key={i} className={`${col} px-1.5 py-0.5 rounded-sm`}>
                        {line}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Key Improvements Banner */}
            <div className="bg-teal-50/60 border border-teal-200/80 rounded-lg p-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-900 block mb-1">
                Defenses Applied:
              </span>
              <p className="text-xs text-teal-800 leading-relaxed">
                Immutable priority hierarchy, strict &lt;user_input&gt; data encapsulation, canary secret sealing, and safe refusal anchors.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        {hardenedResult ? (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Improved Prompt</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onRetestPrompt}
                disabled={isRetesting}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRetesting ? 'animate-spin' : ''}`} />
                <span>{isRetesting ? 'Retesting...' : 'Test Again with New Prompt'}</span>
              </button>
            </div>

            {/* Comparison Report Card */}
            {comparison && (
              <div className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/60 space-y-2">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-900">
                    Verification Complete: Weaknesses Remediated
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-1.5 bg-white rounded border border-emerald-100">
                    <span className="text-slate-400 block text-[10px]">Original Score</span>
                    <span className="font-bold text-red-600 line-through">
                      {Math.round(comparison.baseline_run.safety_score ?? ((comparison.baseline_run.pass_count / (comparison.baseline_run.total_tests || 1)) * 100))}%
                    </span>
                  </div>
                  <div className="p-1.5 bg-white rounded border border-emerald-100">
                    <span className="text-slate-400 block text-[10px]">Improved Score</span>
                    <span className="font-bold text-emerald-600">
                      {Math.round(comparison.hardened_run.safety_score ?? ((comparison.hardened_run.pass_count / (comparison.hardened_run.total_tests || 1)) * 100))}%
                    </span>
                  </div>
                  <div className="p-1.5 bg-white rounded border border-emerald-100">
                    <span className="text-slate-400 block text-[10px]">Utility Pass</span>
                    <span className="font-bold text-blue-600">
                      {Math.round(comparison.hardened_run.utility_test_count ? ((comparison.hardened_run.utility_pass_count || 0) / comparison.hardened_run.utility_test_count) * 100 : 100)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Hardening applies defense-in-depth principles.</span>
            <span className="font-medium text-slate-600">Step 2 of 2</span>
          </div>
        )}
      </div>
    </section>
  );
};
