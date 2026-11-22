import React, { useEffect, useState } from 'react';
import { History, Download, FileText, FileSpreadsheet, FileCode, CheckCircle, Clock } from 'lucide-react';

interface HistoryExportProps {
  onSelectRun: (runId: string) => void;
}

export const HistoryExport: React.FC<HistoryExportProps> = ({ onSelectRun }) => {
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRuns = async () => {
    setLoading(true);
    try {
      const resp = await fetch('/api/runs');
      if (resp.ok) {
        const data = await resp.json();
        setRuns(data);
      }
    } catch (e) {
      console.error('Failed to fetch runs', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRuns();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Assessment History & Export Reports</h2>
              <span className="text-xs px-2 py-0.5 rounded font-mono bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                Module H Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Persistent local evaluation logs. Export verifiable security audit documents in PDF, CSV, or structured JSON formats.
            </p>
          </div>
          <button
            onClick={fetchRuns}
            className="px-3 py-1.5 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Refresh History
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Recorded Assessment Runs ({runs.length})
          </span>
          <span className="text-xs text-slate-500 font-mono">SQLite Local Persistence</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Run ID</th>
                <th className="py-2.5 px-4 font-semibold">Title</th>
                <th className="py-2.5 px-4 font-semibold">Timestamp</th>
                <th className="py-2.5 px-4 font-semibold">Model / Provider</th>
                <th className="py-2.5 px-4 font-semibold text-center">ASR</th>
                <th className="py-2.5 px-4 font-semibold text-center">Passed / Total</th>
                <th className="py-2.5 px-4 font-semibold text-right">Export Artifacts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {runs.map((r) => (
                <tr key={r.run_id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{r.run_id}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{r.title}</td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{r.timestamp}</td>
                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                    {r.model_name} ({r.provider})
                  </td>
                  <td className="py-3 px-4 text-center font-bold">
                    <span className={r.attack_success_rate === 0 ? 'text-emerald-600' : 'text-red-600'}>
                      {r.attack_success_rate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-medium">
                    {r.pass_count} / {r.total_tests}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <a
                        href={`/api/export/${r.run_id}/pdf`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-semibold rounded bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors"
                        title="Download printable ReportLab PDF report"
                      >
                        <FileText className="w-3 h-3" />
                        <span>PDF</span>
                      </a>
                      <a
                        href={`/api/export/${r.run_id}/csv`}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-semibold rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                        title="Download CSV test records"
                      >
                        <FileSpreadsheet className="w-3 h-3" />
                        <span>CSV</span>
                      </a>
                      <a
                        href={`/api/export/${r.run_id}/json`}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-semibold rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                        title="Download full JSON run payload"
                      >
                        <FileCode className="w-3 h-3" />
                        <span>JSON</span>
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
              {runs.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No runs recorded yet. Execute tests or run the Built-in Demo to create assessment history.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
