import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Quote,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { EvaluatedTestCase, RunSummary, getFriendlyTestTitle, getFindingDetails } from '../types';

interface ResultsSummaryStepProps {
  summary: RunSummary;
  results: EvaluatedTestCase[];
  onScrollToImprove: () => void;
}

export const ResultsSummaryStep: React.FC<ResultsSummaryStepProps> = ({
  summary,
  results,
  onScrollToImprove
}) => {
  const [isAllChecksOpen, setIsAllChecksOpen] = useState(false);
  const [expandedCheckId, setExpandedCheckId] = useState<string | null>(null);

  // Compute Honest Safety Score
  // Uses backend derived safety_score or calculates valid pass ratio
  const total = summary.total_tests || results.length || 1;
  const passed = summary.pass_count;
  const failed = summary.fail_count;
  const score = summary.safety_score !== undefined
    ? Math.round(summary.safety_score)
    : Math.round((passed / total) * 100);

  let statusText = "Needs Improvement";
  let statusBadgeStyle = "bg-amber-50 text-amber-800 border-amber-200";
  let scoreColor = "text-amber-600";

  if (score >= 85) {
    statusText = "Looks Good";
    statusBadgeStyle = "bg-emerald-50 text-emerald-800 border-emerald-200";
    scoreColor = "text-emerald-600";
  } else if (score < 50) {
    statusText = "High Risk";
    statusBadgeStyle = "bg-red-50 text-red-800 border-red-200";
    scoreColor = "text-red-600";
  }

  // Major findings: up to 3 failed tests
  const failedCases = results.filter((r) => r.evaluation.verdict === 'FAIL');
  const majorFindings = failedCases.slice(0, 3);
  const isLive = summary.execution_mode === "live";
  const isHardened = summary.prompt_version?.includes("hardened");

  return (
    <div className="space-y-6">
      {/* 1. Executive Summary Box */}
      <section className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {isHardened ? "Improved Prompt Assessment" : "Assessment Summary"}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                  isLive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {isLive ? 'Live Model' : 'Simulated Demo'}
              </span>
              {isHardened && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                  Hardened Version
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {isHardened ? "Improved Prompt Safety Results" : "Your Safety Results"}
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadgeStyle}`}>
              {statusText}
            </span>
          </div>
        </div>

        {/* Score & Numbers Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 py-5 border-b border-slate-100">
          {/* Score card */}
          <div className="sm:col-span-1 bg-slate-50 p-4 rounded-lg border border-slate-200/80 flex flex-col justify-center items-center text-center">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Safety Score
            </span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className={`text-4xl font-extrabold ${scoreColor}`}>{score}</span>
              <span className="text-sm font-semibold text-slate-400">/ 100</span>
            </div>
          </div>

          {/* Counts */}
          <div className="sm:col-span-3 flex flex-col justify-center space-y-3 px-1 sm:px-3">
            <p className="text-sm font-semibold text-slate-800">
              {isHardened
                ? `Your improved AI instructions adhered to safety rules in ${passed} out of ${total} security checks.`
                : `Your AI followed its instructions in ${passed} out of ${total} completed security checks.`}
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/60">
                <span className="font-semibold text-emerald-800 block text-base sm:text-lg">{passed}</span>
                <span className="text-emerald-700">Passed Checks</span>
              </div>
              <div className="p-2.5 rounded-lg bg-red-50/70 border border-red-200/60">
                <span className="font-semibold text-red-800 block text-base sm:text-lg">{failed}</span>
                <span className="text-red-700">Failed Checks</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200">
                <span className="font-semibold text-slate-700 block text-base sm:text-lg">
                  {summary.inconclusive_count || 0}
                </span>
                <span className="text-slate-600">Inconclusive</span>
              </div>
            </div>
          </div>
        </div>

        {/* One-click banner to step 4 */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>{failed > 0 ? "Identified weaknesses can be remediated using automated guardrails." : "All security tests passed."}</span>
          <button
            onClick={onScrollToImprove}
            className="inline-flex items-center space-x-1.5 font-semibold text-teal-700 hover:text-teal-800 transition-colors"
          >
            <span>Proceed to Improve Prompt</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 2. What could be improved? (Major Findings) */}
      {majorFindings.length > 0 && (
        <section className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-7 shadow-sm space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              What could be improved?
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Top weaknesses discovered during automated testing, with actual response evidence.
            </p>
          </div>

          <div className="space-y-4">
            {majorFindings.map((item, idx) => {
              const details = getFindingDetails(item);
              const evidence = item.evaluation.evidence_excerpt || item.execution.raw_response.slice(0, 80);

              return (
                <div
                  key={item.test.test_id}
                  className="p-4 sm:p-5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">
                        {details.title}
                      </h4>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      Check #{item.test.test_id}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {details.summary}
                  </p>

                  {/* Actual test snippet */}
                  <div className="bg-white p-3 rounded border border-slate-200/80 space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      What happened during testing:
                    </span>
                    <div className="text-xs font-mono text-slate-800 bg-slate-50 p-2 rounded border border-slate-100 flex items-start space-x-2">
                      <Quote className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-red-900">"{evidence}"</span>
                    </div>
                  </div>

                  {/* Why it matters & Fix */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="p-2.5 rounded bg-amber-50/60 border border-amber-200/60 text-amber-900">
                      <span className="font-semibold block mb-0.5">Why it matters:</span>
                      <span>{details.whyItMatters}</span>
                    </div>
                    <div className="p-2.5 rounded bg-teal-50/60 border border-teal-200/60 text-teal-900">
                      <span className="font-semibold block mb-0.5">Suggested fix:</span>
                      <span>{details.suggestedFix}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. Collapsible View All Security Checks */}
      <section className="bg-white border border-slate-200/90 rounded-xl shadow-sm overflow-hidden">
        <button
          onClick={() => setIsAllChecksOpen(!isAllChecksOpen)}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              View All Security Checks ({results.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Inspect inputs, expected behaviors, and actual model responses for every test.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-teal-700">
            <span>{isAllChecksOpen ? 'Hide Checks' : 'Show All'}</span>
            {isAllChecksOpen ? (
              <ChevronUp className="w-4 h-4 text-teal-700" />
            ) : (
              <ChevronDown className="w-4 h-4 text-teal-700" />
            )}
          </div>
        </button>

        {isAllChecksOpen && (
          <div className="border-t border-slate-200 divide-y divide-slate-100 text-xs">
            {results.map((r) => {
              const friendlyTitle = getFriendlyTestTitle(r.test.category, r.test.test_id);
              const isPass = r.evaluation.verdict === 'PASS';
              const isExpanded = expandedCheckId === r.test.test_id;

              return (
                <div key={r.test.test_id} className="p-4 hover:bg-slate-50/50 transition-colors">
                  <div
                    onClick={() => setExpandedCheckId(isExpanded ? null : r.test.test_id)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      {isPass ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                      )}
                      <div>
                        <span className="font-semibold text-slate-900">
                          {friendlyTitle}
                        </span>
                        <span className="ml-2 text-[11px] font-mono text-slate-400">
                          #{r.test.test_id}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isPass
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {isPass ? 'Passed' : 'Failed'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-3.5 pl-6 space-y-3 pt-2 border-t border-slate-100">
                      <div>
                        <span className="font-semibold text-slate-700 block mb-1">
                          Test Message Sent:
                        </span>
                        <p className="font-mono text-[11px] p-2 rounded bg-slate-100 text-slate-800 whitespace-pre-wrap">
                          {r.test.test_input}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <span className="font-semibold text-slate-700 block mb-1">
                            Expected Safe Behavior:
                          </span>
                          <p className="text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 text-[11px]">
                            {r.test.expected_safe_behavior}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-700 block mb-1">
                            Actual AI Response:
                          </span>
                          <p className="font-mono text-[11px] p-2 rounded bg-slate-900 text-slate-100 whitespace-pre-wrap max-h-24 overflow-y-auto">
                            {r.execution.raw_response}
                          </p>
                        </div>
                      </div>

                      {/* Technical details toggle */}
                      <div className="text-[11px] text-slate-500 pt-1">
                        <span className="font-medium">Rule Citation:</span> {r.evaluation.violated_rule} · <span className="font-medium">Latency:</span> {r.execution.latency_ms} ms
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
