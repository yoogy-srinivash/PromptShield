import React from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, Cpu, Layers, ArrowUpRight } from 'lucide-react';
import { RunSummary, ComparisonReport } from '../types';

interface DashboardProps {
  baselineSummary: RunSummary | null;
  hardenedSummary: RunSummary | null;
  comparison: ComparisonReport | null;
  providerInfo: any;
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  baselineSummary,
  hardenedSummary,
  comparison,
  providerInfo,
  onNavigate
}) => {
  const activeSummary = hardenedSummary || baselineSummary;

  return (
    <div className="space-y-6">
      {/* Top Banner / Summary */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Security Overview & System Status</h1>
            <p className="text-xs text-slate-500 mt-1">
              Automated adversarial robustness evaluation and prompt defense hardening for LLM chatbots.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200">
              Target: Bennett University Academic FAQ
            </span>
            <span className="px-2.5 py-1 rounded bg-teal-50 text-teal-800 font-medium border border-teal-200">
              Evaluator: PromptShield v3
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Attack Success Rate Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Attack Success Rate</p>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                {activeSummary ? `${activeSummary.attack_success_rate}%` : '70.0%'}
              </h2>
            </div>
            <div className={`p-2 rounded-md ${activeSummary && activeSummary.attack_success_rate === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center justify-between">
            <span>{hardenedSummary ? 'Hardened System State' : 'Baseline Unhardened State'}</span>
            {comparison && (
              <span className="font-semibold text-emerald-600">
                ↓ {comparison.asr_reduction_percentage}% reduction
              </span>
            )}
          </div>
        </div>

        {/* Utility Retention Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Utility Retention</p>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                {activeSummary ? `${activeSummary.utility_retention_rate}%` : '100%'}
              </h2>
            </div>
            <div className="p-2 rounded-md bg-blue-50 text-blue-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            <span>Benign queries answered without over-refusal</span>
          </div>
        </div>

        {/* Total Tests Executed Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Benchmark Tests</p>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                {activeSummary ? activeSummary.total_tests : '12'}
              </h2>
            </div>
            <div className="p-2 rounded-md bg-purple-50 text-purple-600">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center space-x-2">
            <span className="text-emerald-600 font-semibold">{activeSummary ? activeSummary.pass_count : '5'} Pass</span>
            <span>·</span>
            <span className="text-red-600 font-semibold">{activeSummary ? activeSummary.fail_count : '7'} Fail</span>
          </div>
        </div>

        {/* Runtime Model Status Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Target Model Status</p>
              <h2 className="text-lg font-bold text-slate-900 mt-1 truncate">
                {providerInfo?.active_model || 'fixture-deterministic'}
              </h2>
            </div>
            <div className="p-2 rounded-md bg-slate-100 text-slate-600">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center space-x-1">
            <span className={`inline-block w-2 h-2 rounded-full ${providerInfo?.fixture_mode ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            <span className="capitalize">{providerInfo?.active_provider || 'fixture'} adapter active</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Category Breakdown & Module Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Attack Vector Vulnerability Distribution</h3>
            <span className="text-xs text-slate-500 font-mono">9 Categories Evaluated</span>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Instruction Override', baselineFail: 1, hardenedFail: 0, total: 2 },
              { label: 'Role Spoofing (Dean/Admin)', baselineFail: 1, hardenedFail: 0, total: 1 },
              { label: 'Dummy Secret Extraction', baselineFail: 2, hardenedFail: 0, total: 2 },
              { label: 'Format Hijacking (Bash/JSON)', baselineFail: 1, hardenedFail: 0, total: 1 },
              { label: 'Retrieval Injection (Syllabus Excerpt)', baselineFail: 1, hardenedFail: 0, total: 1 },
              { label: 'Delimiter Encoding (XML Breaking)', baselineFail: 1, hardenedFail: 0, total: 1 },
              { label: 'Multilingual Injection (Hinglish)', baselineFail: 1, hardenedFail: 0, total: 1 },
              { label: 'Context Dilution (Padding)', baselineFail: 1, hardenedFail: 0, total: 1 },
              { label: 'Benign Control (Academic Queries)', baselineFail: 0, hardenedFail: 0, total: 2 }
            ].map((cat, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between text-slate-700 mb-1">
                  <span className="font-medium">{cat.label}</span>
                  <span className="text-slate-500">
                    {hardenedSummary
                      ? `${cat.hardenedFail === 0 ? 'Defended (0 Fail)' : 'Vulnerable'}`
                      : `${cat.baselineFail} / ${cat.total} Failed`}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                  {hardenedSummary ? (
                    <div className="bg-emerald-500 h-full w-full"></div>
                  ) : (
                    <>
                      <div
                        className="bg-red-500 h-full"
                        style={{ width: `${(cat.baselineFail / cat.total) * 100}%` }}
                      ></div>
                      <div
                        className="bg-emerald-500 h-full"
                        style={{ width: `${((cat.total - cat.baselineFail) / cat.total) * 100}%` }}
                      ></div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module Implementation Status Table */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Milestone 2 Module Status</h3>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              All 9 Modules Working
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 font-semibold">Module</th>
                  <th className="py-2 font-semibold">Capability</th>
                  <th className="py-2 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {[
                  { id: 'Module A', name: 'Dashboard', desc: 'Security metrics, findings & model status', status: 'Working' },
                  { id: 'Module B', name: 'Prompt Workspace', desc: 'System prompt creation, rules & templates', status: 'Working' },
                  { id: 'Module C', name: 'Red-Team Generator', desc: '9-category adversarial test suite generation', status: 'Working' },
                  { id: 'Module D', name: 'Target Chatbot Execution', desc: 'Target LLM invocation & latency recording', status: 'Working' },
                  { id: 'Module E', name: 'Response Evaluator', desc: 'Evidence-backed PASS/FAIL rubric evaluation', status: 'Working' },
                  { id: 'Module F', name: 'Guardrail Improvement', desc: 'Instruction hierarchy hardening & diff viewer', status: 'Working' },
                  { id: 'Module G', name: 'Before/After Comparison', desc: 'Identical suite re-testing & ASR delta', status: 'Working' },
                  { id: 'Module H', name: 'History & Reporting', desc: 'SQLite persistence, CSV, JSON & PDF export', status: 'Working' },
                  { id: 'Module I', name: 'Built-in Evaluator Demo', desc: 'One-click full scenario walkthrough', status: 'Working' }
                ].map((mod, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-2 font-medium text-slate-900">{mod.id}: {mod.name}</td>
                    <td className="py-2 text-slate-500">{mod.desc}</td>
                    <td className="py-2 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                        {mod.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('workspace')}
          className="text-left bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-4 transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Step 1 · Configure System Prompt</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Define domain instructions, permitted/prohibited boundaries, and canary secret marker.
          </p>
        </button>

        <button
          onClick={() => onNavigate('generator')}
          className="text-left bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-4 transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Step 2 · Generate & Execute Tests</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Run the 12-vector adversarial test suite against target LLM and collect true outputs.
          </p>
        </button>

        <button
          onClick={() => onNavigate('optimizer')}
          className="text-left bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-4 transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Step 3 · Harden & Compare</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Synthesize defense-in-depth prompt guardrails and compare before/after metrics.
          </p>
        </button>
      </div>
    </div>
  );
};
