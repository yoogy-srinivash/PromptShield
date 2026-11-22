import React, { useState } from 'react';
import { ShieldCheck, Layers, GitCompare, ArrowRight, CheckCircle2 } from 'lucide-react';
import { HardenedPromptResult } from '../types';

interface GuardrailDiffProps {
  hardenedResult: HardenedPromptResult | null;
  onRunComparison: () => void;
  comparing: boolean;
}

export const GuardrailDiff: React.FC<GuardrailDiffProps> = ({
  hardenedResult,
  onRunComparison,
  comparing
}) => {
  const [viewMode, setViewMode] = useState<'diff' | 'hardened' | 'original'>('diff');

  if (!hardenedResult) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-12 text-center shadow-sm">
        <ShieldCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900">No Hardened Prompt Synthesized Yet</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
          Execute test cases on the baseline prompt first, or click below to trigger automated guardrail synthesis via P3 Advisor.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Defensive Guardrail Optimization</h2>
              <span className="text-xs px-2 py-0.5 rounded font-mono bg-teal-50 text-teal-800 font-semibold border border-teal-200">
                P3 (v3) Defense Architect
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Module F: Synthesizes instruction hierarchy, untrusted input encapsulation, canary confinement, and utility preservation.
            </p>
          </div>

          <button
            onClick={onRunComparison}
            disabled={comparing}
            className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-md bg-teal-600 hover:bg-teal-700 text-white transition-colors shadow-sm disabled:opacity-50"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>{comparing ? 'Comparing Both Prompts...' : 'Rerun Suite to Compare (Before vs After)'}</span>
          </button>
        </div>
      </div>

      {/* Applied Techniques Cards */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
          <Layers className="w-3.5 h-3.5 text-slate-500" />
          <span>Applied Defense-in-Depth Techniques</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {hardenedResult.applied_techniques.map((tech, idx) => (
            <div key={idx} className="flex items-start space-x-2 p-2.5 rounded-md bg-slate-50 border border-slate-200 text-xs">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span className="font-medium text-slate-800">{tech}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Remediation Summary */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-4 text-xs text-emerald-900 space-y-1">
        <span className="font-bold block">Remediation Objective:</span>
        <p className="leading-relaxed">{hardenedResult.remediation_summary}</p>
      </div>

      {/* Prompt Diff / Text View */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('diff')}
              className={`px-3 py-1 text-xs font-semibold rounded ${
                viewMode === 'diff' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              Unified Diff
            </button>
            <button
              onClick={() => setViewMode('hardened')}
              className={`px-3 py-1 text-xs font-semibold rounded ${
                viewMode === 'hardened' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              Hardened Prompt Full Text
            </button>
            <button
              onClick={() => setViewMode('original')}
              className={`px-3 py-1 text-xs font-semibold rounded ${
                viewMode === 'original' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              Original System Prompt
            </button>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {viewMode === 'diff' ? 'Diff lines' : `${hardenedResult.hardened_system_prompt.length} chars`}
          </span>
        </div>

        <div className="p-4 bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed max-h-[480px]">
          {viewMode === 'diff' && (
            <pre className="whitespace-pre-wrap">
              {hardenedResult.diff_text.split('\n').map((line, i) => {
                let colorClass = 'text-slate-300';
                if (line.startsWith('+')) colorClass = 'text-emerald-400 bg-emerald-950/40';
                else if (line.startsWith('-')) colorClass = 'text-red-400 bg-red-950/40';
                else if (line.startsWith('@@')) colorClass = 'text-teal-400';
                return (
                  <div key={i} className={`${colorClass} px-2 py-0.5 rounded-sm`}>
                    {line}
                  </div>
                );
              })}
            </pre>
          )}

          {viewMode === 'hardened' && (
            <pre className="whitespace-pre-wrap text-emerald-300">
              {hardenedResult.hardened_system_prompt}
            </pre>
          )}

          {viewMode === 'original' && (
            <pre className="whitespace-pre-wrap text-slate-300">
              {hardenedResult.original_prompt}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
