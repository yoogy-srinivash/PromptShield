import React, { useState } from 'react';
import { Play, Filter, AlertCircle, CheckCircle, Code, ShieldAlert, Cpu } from 'lucide-react';
import { TestCase, TestType, AttackCategory } from '../types';

interface TestGeneratorProps {
  tests: TestCase[];
  onExecuteSuite: () => void;
  executing: boolean;
  modelName: string;
}

export const TestGenerator: React.FC<TestGeneratorProps> = ({
  tests,
  onExecuteSuite,
  executing,
  modelName
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [selectedTestId, setSelectedTestId] = useState<string | null>(tests[0]?.test_id || 'T01');

  const filteredTests = filterType === 'ALL'
    ? tests
    : tests.filter((t) => t.test_type === filterType);

  const selectedTest = tests.find((t) => t.test_id === selectedTestId) || tests[0];

  const getTypeBadge = (type: TestType) => {
    switch (type) {
      case 'Normal':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Edge':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Invalid':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Adversarial Test Suite Generator</h2>
              <span className="text-xs px-2 py-0.5 rounded font-mono bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                P1 (v3) Final
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Modules C & D: Generated 12 diversified test vectors covering instruction override, canary extraction, delimiter escapes, and benign controls.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onExecuteSuite}
              disabled={executing || tests.length === 0}
              className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-md bg-teal-600 hover:bg-teal-700 text-white transition-colors shadow-sm disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 ${executing ? 'animate-pulse' : ''}`} />
              <span>{executing ? 'Executing Test Suite...' : 'Execute Suite Against Target LLM'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Test List and Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col (7/12): Interactive Test Table */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Generated Vectors ({filteredTests.length})
            </span>
            <div className="flex items-center space-x-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2 py-1 bg-white font-medium text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Types (12)</option>
                <option value="Normal">Normal (6)</option>
                <option value="Edge">Edge (5)</option>
                <option value="Invalid">Invalid (1)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto flex-1 max-h-[560px] overflow-y-auto">
            <table className="min-w-full text-xs text-left">
              <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-500 z-10">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">ID</th>
                  <th className="py-2.5 px-3 font-semibold">Type</th>
                  <th className="py-2.5 px-3 font-semibold">Category</th>
                  <th className="py-2.5 px-3 font-semibold">Attack Objective</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTests.map((t) => (
                  <tr
                    key={t.test_id}
                    onClick={() => setSelectedTestId(t.test_id)}
                    className={`cursor-pointer transition-colors ${
                      selectedTestId === t.test_id
                        ? 'bg-teal-50/70 border-l-4 border-teal-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-2 px-3 font-mono font-bold text-slate-900">{t.test_id}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getTypeBadge(t.test_type)}`}>
                        {t.test_type}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-600 truncate max-w-[130px]">
                      {t.category}
                    </td>
                    <td className="py-2 px-3 font-medium text-slate-800 truncate max-w-[200px]">
                      {t.attack_objective}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col (5/12): Detailed Vector Inspector */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <span className="font-mono text-sm font-bold text-slate-900">{selectedTest.test_id}</span>
              <span className="ml-2 text-xs text-slate-500 font-mono">[{selectedTest.category}]</span>
            </div>
            <span className={`px-2.5 py-0.5 rounded text-xs font-semibold border ${getTypeBadge(selectedTest.test_type)}`}>
              {selectedTest.test_type} Test
            </span>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Attack Objective
            </label>
            <p className="text-xs text-slate-800 bg-slate-50 p-2.5 rounded-md border border-slate-100 font-medium">
              {selectedTest.attack_objective}
            </p>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Raw Prompt Input
            </label>
            <pre className="text-xs font-mono p-3 rounded-md bg-slate-900 text-slate-100 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-48">
              {selectedTest.test_input}
            </pre>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Expected Safe Behavior
            </label>
            <p className="text-xs text-emerald-800 bg-emerald-50/60 p-2.5 rounded-md border border-emerald-200/60">
              {selectedTest.expected_safe_behavior}
            </p>
          </div>

          {selectedTest.target_rule && (
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Target Policy Rule Tested
              </label>
              <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                {selectedTest.target_rule}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
