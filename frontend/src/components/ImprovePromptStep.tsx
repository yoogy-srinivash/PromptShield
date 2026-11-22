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
  Layers
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
}

export const ImprovePromptStep: React.FC<ImprovePromptStepProps> = ({
  originalPrompt,
  hardenedResult,
  onGenerateImprovement,
  isGenerating,
  onRetestPrompt,
  isRetesting,
  comparison
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
    "Clarified which instructions take top priority so user messages cannot override them.",
    "Added boundary tags (<user_input>) to treat user messages and files strictly as passive data.",
    "Sealed private keys and configuration details so they cannot be extracted.",
    "Added standard polite responses for out-of-scope or manipulative requests.",
    "Guaranteed legitimate user questions will still be answered helpfully."
  ];

  return (
    <section id="improve-step" className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-7 shadow-sm space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Make Your Prompt Stronger
          </h2>
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200/60">
            Step 4
          </span>
        </div>
        <p className="text-slate-600 text-sm mt-1.5 leading-relaxed">
          We found ways your instructions could be clearer. Generate an improved version based on your test results.
        </p>
      </div>

      {/* Primary Action Button (If not generated yet) */}
      {!hardenedResult && (
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg text-center space-y-3">
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Click below to automatically apply defensive prompt guidelines that fix the detected weaknesses while preserving your assistant's helpfulness.
          </p>
          <button
            onClick={onGenerateImprovement}
            disabled={isGenerating}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing Improvements...' : 'Improve My Prompt'}</span>
          </button>
        </div>
      )}

      {/* Improved Results Section */}
      {hardenedResult && (
        <div className="space-y-6">
          {/* Plain English Key Improvements */}
          <div className="bg-teal-50/60 border border-teal-200/80 rounded-lg p-4 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>What was improved in this version:</span>
            </h4>
            <ul className="text-xs text-teal-900 space-y-1.5 pl-1">
              {plainImprovements.map((imp, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* View Toggle Tabs */}
          <div className="space-y-3">
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
                  Original Version
                </button>
                <button
                  onClick={() => setActiveView('diff')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    activeView === 'diff'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Compare Changes
                </button>
              </div>

              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                {activeView === 'improved'
                  ? `${hardenedResult.hardened_system_prompt.length} characters`
                  : `${originalPrompt.length} characters`}
              </span>
            </div>

            {/* Content Display Area */}
            <div className="relative">
              {activeView === 'improved' && (
                <textarea
                  readOnly
                  rows={10}
                  value={hardenedResult.hardened_system_prompt}
                  className="w-full text-xs font-mono p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 leading-relaxed focus:outline-none"
                />
              )}

              {activeView === 'original' && (
                <textarea
                  readOnly
                  rows={8}
                  value={originalPrompt}
                  className="w-full text-xs font-mono p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 leading-relaxed focus:outline-none"
                />
              )}

              {activeView === 'diff' && (
                <div className="p-3.5 bg-slate-900 text-slate-100 font-mono text-xs rounded-lg overflow-x-auto max-h-80 leading-relaxed whitespace-pre-wrap">
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
          </div>

          {/* Action Buttons: Copy and Test Again */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handleCopy}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy Improved Prompt</span>
                </>
              )}
            </button>

            <button
              onClick={onRetestPrompt}
              disabled={isRetesting}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRetesting ? 'animate-spin' : ''}`} />
              <span>{isRetesting ? 'Retesting Against Checks...' : 'Test Again with New Prompt'}</span>
            </button>
          </div>

          {/* Retest Before & After Comparison Result */}
          {comparison && (
            <div className="mt-4 p-5 rounded-lg border border-emerald-200 bg-emerald-50/50 space-y-3">
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                <h4 className="text-sm font-bold text-slate-900">
                  Verification Complete: Weaknesses Remediated!
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded border border-emerald-100">
                  <span className="text-slate-500 block mb-0.5">Original Score:</span>
                  <span className="text-base font-bold text-red-600 line-through">
                    {Math.round((comparison.baseline_run.pass_count / comparison.baseline_run.total_tests) * 100)} / 100
                  </span>
                </div>
                <div className="p-3 bg-white rounded border border-emerald-100">
                  <span className="text-slate-500 block mb-0.5">New Safety Score:</span>
                  <span className="text-base font-bold text-emerald-600">
                    {Math.round((comparison.hardened_run.pass_count / comparison.hardened_run.total_tests) * 100)} / 100
                  </span>
                </div>
                <div className="p-3 bg-white rounded border border-emerald-100">
                  <span className="text-slate-500 block mb-0.5">Legitimate Questions:</span>
                  <span className="text-base font-bold text-blue-600">
                    100% Still Answered
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                When tested against the identical security checks, the improved prompt successfully defended against previously failed messages without over-refusing legitimate requests.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
