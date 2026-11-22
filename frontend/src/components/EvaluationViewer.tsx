import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Quote, CheckCircle, XCircle, Search, Clock } from 'lucide-react';
import { EvaluatedTestCase, Verdict } from '../types';

interface EvaluationViewerProps {
  results: EvaluatedTestCase[];
  onHardenPrompt: () => void;
  hardening: boolean;
}

export const EvaluationViewer: React.FC<EvaluationViewerProps> = ({
  results,
  onHardenPrompt,
  hardening
}) => {
  const [filterVerdict, setFilterVerdict] = useState<string>('ALL');
  const [selectedId, setSelectedId] = useState<string | null>(results[0]?.test.test_id || 'T01');

  const filteredResults = filterVerdict === 'ALL'
    ? results
    : results.filter((r) => r.evaluation.verdict === filterVerdict);

  const selectedCase = results.find((r) => r.test.test_id === selectedId) || results[0];

  const getVerdictBadge = (verdict: Verdict) => {
    switch (verdict) {
      case 'PASS':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'FAIL':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'INCONCLUSIVE':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Security Evaluation & Evidence Inspector</h2>
              <span className="text-xs px-2 py-0.5 rounded font-mono bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                P2 (v3) Hybrid Judge
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Module E: Traceable evidence inspection. Each failure contains exact quotation excerpts from the target model response.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onHardenPrompt}
              disabled={hardening || results.length === 0}
              className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-md bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-sm disabled:opacity-50"
            >
              <span>{hardening ? 'Synthesizing Guardrails...' : 'Harden Prompt via P3 Advisor'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col (6/12): Results Table */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="p-3.5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Evaluated Tests ({filteredResults.length})
            </span>
            <div className="flex items-center space-x-1.5">
              <select
                value={filterVerdict}
                onChange={(e) => setFilterVerdict(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white font-medium text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Verdicts</option>
                <option value="PASS">PASS Only</option>
                <option value="FAIL">FAIL Only</option>
                <option value="INCONCLUSIVE">INCONCLUSIVE</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto flex-1 max-h-[580px] overflow-y-auto">
            <table className="min-w-full text-xs text-left">
              <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-500 z-10">
                <tr>
                  <th className="py-2 px-3 font-semibold">ID</th>
                  <th className="py-2 px-3 font-semibold">Verdict</th>
                  <th className="py-2 px-3 font-semibold">Category</th>
                  <th className="py-2 px-3 font-semibold">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredResults.map((r) => (
                  <tr
                    key={r.test.test_id}
                    onClick={() => setSelectedId(r.test.test_id)}
                    className={`cursor-pointer transition-colors ${
                      selectedId === r.test.test_id
                        ? 'bg-teal-50/70 border-l-4 border-teal-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-2 px-3 font-mono font-bold text-slate-900">{r.test.test_id}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getVerdictBadge(r.evaluation.verdict)}`}>
                        {r.evaluation.verdict}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-600 truncate max-w-[130px]">
                      {r.test.category}
                    </td>
                    <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">
                      {r.execution.latency_ms} ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col (6/12): Detailed Evidence Inspector */}
        {selectedCase && (
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-base font-bold text-slate-900">{selectedCase.test.test_id}</span>
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${getVerdictBadge(selectedCase.evaluation.verdict)}`}>
                  VERDICT: {selectedCase.evaluation.verdict}
                </span>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Model: {selectedCase.execution.model_name}
              </span>
            </div>

            {/* Warning Flags */}
            <div className="flex flex-wrap gap-2">
              {selectedCase.evaluation.is_secret_leaked && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-semibold bg-red-100 text-red-800 border border-red-300">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Canary Secret Leaked</span>
                </span>
              )}
              {selectedCase.evaluation.is_prohibited_action_taken && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-300">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Prohibited Action Executed</span>
                </span>
              )}
              {selectedCase.evaluation.is_over_refusal && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Over-Refusal / False Positive</span>
                </span>
              )}
            </div>

            {/* Test Input Excerpt */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Adversarial Input Prompt
              </label>
              <pre className="text-xs font-mono p-2.5 rounded bg-slate-100 text-slate-800 whitespace-pre-wrap max-h-24 overflow-y-auto">
                {selectedCase.test.test_input}
              </pre>
            </div>

            {/* Actual Target Response */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Actual Target Chatbot Response
              </label>
              <pre className="text-xs font-mono p-3 rounded bg-slate-900 text-slate-100 whitespace-pre-wrap max-h-36 overflow-y-auto leading-relaxed">
                {selectedCase.execution.raw_response}
              </pre>
            </div>

            {/* Evidence & Rationale */}
            <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 space-y-2">
              <div className="flex items-start space-x-2">
                <Quote className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                    Verified Evidence Excerpt
                  </span>
                  <p className="text-xs font-mono text-slate-900 bg-white p-2 rounded border border-slate-200 mt-1">
                    "{selectedCase.evaluation.evidence_excerpt || 'N/A'}"
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                  Violated Policy Rule
                </span>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">
                  {selectedCase.evaluation.violated_rule}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                  Judge Technical Rationale
                </span>
                <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                  {selectedCase.evaluation.reason}
                </p>
              </div>

              {selectedCase.evaluation.limitations && (
                <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                  <span className="font-semibold">Caveat / Limitation:</span> {selectedCase.evaluation.limitations}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
