import React, { useState } from 'react';
import {
  X,
  Cpu,
  KeyRound,
  Download,
  FileText,
  FileSpreadsheet,
  FileCode,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ChatbotConfig, RunSummary } from '../types';

interface AdvancedOptionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: ChatbotConfig;
  setConfig: (config: ChatbotConfig) => void;
  providerInfo: any;
  latestRunId?: string;
  apiKey?: string;
  setApiKey?: (key: string) => void;
  selectedProvider?: string;
  setSelectedProvider?: (provider: string) => void;
  onRefreshStatus?: () => void;
}

export const AdvancedOptionsDrawer: React.FC<AdvancedOptionsDrawerProps> = ({
  isOpen,
  onClose,
  config,
  setConfig,
  providerInfo,
  latestRunId,
  apiKey = '',
  setApiKey,
  selectedProvider = 'fixture',
  setSelectedProvider,
  onRefreshStatus
}) => {
  const [localKey, setLocalKey] = useState<string>(apiKey);

  const handleKeySave = (val: string) => {
    setLocalKey(val);
    if (setApiKey) setApiKey(val);
    localStorage.setItem('promptshield_api_key', val);
    if (onRefreshStatus) onRefreshStatus();
  };

  const handleProviderChange = (prov: string) => {
    if (setSelectedProvider) setSelectedProvider(prov);
    localStorage.setItem('promptshield_provider', prov);
    if (onRefreshStatus) onRefreshStatus();
  };

  const isLive = providerInfo?.execution_mode === "live" || Boolean(apiKey);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Advanced Options</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Technical settings, canary secrets, and audit report exports.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 text-xs">
          {/* Active Engine Status */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
                Active Testing Engine
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  isLive
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {isLive ? "Live Model" : "Offline Demo"}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-slate-900 font-mono font-medium">
              <Cpu className="w-4 h-4 text-teal-600" />
              <span>{isLive ? (providerInfo?.active_model || 'gemini-1.5-flash') : 'simulation-deterministic-engine-v2'}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              {isLive
                ? "Connected to real LLM. Prompts and adversarial attacks are executed against a live model."
                : "Deterministic simulation engine evaluating instruction rules offline without API keys."}
            </p>
          </div>

          {/* Model Provider & API Key Configuration */}
          <div className="space-y-3 p-3.5 rounded-lg border border-teal-100 bg-teal-50/30">
            <span className="font-semibold text-teal-950 uppercase tracking-wider text-[10px] block">
              Enable Live Model Testing
            </span>
            <div className="space-y-1.5">
              <label className="text-slate-700 font-medium text-[11px]">LLM Provider</label>
              <select
                value={selectedProvider}
                onChange={(e) => handleProviderChange(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="gemini">Google Gemini (Gemini 1.5 Flash)</option>
                <option value="openai">OpenAI (GPT-4o-mini)</option>
                <option value="ollama">Ollama (Local Service)</option>
                <option value="fixture">Offline Simulation Demo (No API Key Required)</option>
              </select>
            </div>

            {(selectedProvider === "gemini" || selectedProvider === "openai") && (
              <div className="space-y-1.5 pt-1">
                <label className="text-slate-700 font-medium text-[11px] flex items-center justify-between">
                  <span>{selectedProvider === "gemini" ? "Gemini API Key" : "OpenAI API Key"}</span>
                  <span className="text-[10px] text-slate-400">Stored locally in browser</span>
                </label>
                <input
                  type="password"
                  value={localKey}
                  onChange={(e) => handleKeySave(e.target.value)}
                  placeholder={selectedProvider === "gemini" ? "AIzaSy..." : "sk-..."}
                  className="w-full font-mono text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <p className="text-[10px] text-slate-500">
                  {localKey
                    ? "✓ Key saved. Live model testing is active."
                    : "Enter an API key to enable live model testing in the cloud."}
                </p>
              </div>
            )}
          </div>

          {/* Dummy Canary Secret Configuration */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-700 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                <span>Private Canary Secret Marker</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Simulated Key</span>
            </label>
            <input
              type="text"
              value={config.dummy_secret}
              onChange={(e) => setConfig({ ...config, dummy_secret: e.target.value })}
              className="w-full font-mono text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="e.g. CANARY-SECRET-TOKEN-99"
            />
            <p className="text-[11px] text-slate-500">
              A harmless test token embedded in your test environment to objectively measure whether an adversarial attack succeeded in data extraction.
            </p>
          </div>

          {/* Export Security Assessment Reports */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <span className="font-semibold text-slate-700 block uppercase tracking-wider text-[10px]">
              Download Assessment Audit Reports
            </span>
            <p className="text-[11px] text-slate-500">
              Download clean, printable audit reports with exact quote evidence and compliance tables.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <a
                href={latestRunId ? `/api/export/${latestRunId}/pdf` : "#"}
                onClick={(e) => {
                  if (!latestRunId) {
                    e.preventDefault();
                    alert("Run a test first to generate an assessment report.");
                  }
                }}
                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all ${
                  latestRunId
                    ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                    : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                }`}
              >
                <FileText className="w-4 h-4 mb-1" />
                <span className="font-semibold text-[11px]">Audit PDF</span>
              </a>

              <a
                href={latestRunId ? `/api/export/${latestRunId}/csv` : "#"}
                onClick={(e) => {
                  if (!latestRunId) {
                    e.preventDefault();
                    alert("Run a test first to generate an assessment report.");
                  }
                }}
                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all ${
                  latestRunId
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                    : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 mb-1" />
                <span className="font-semibold text-[11px]">CSV Logs</span>
              </a>

              <a
                href={latestRunId ? `/api/export/${latestRunId}/json` : "#"}
                onClick={(e) => {
                  if (!latestRunId) {
                    e.preventDefault();
                    alert("Run a test first to generate an assessment report.");
                  }
                }}
                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all ${
                  latestRunId
                    ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                    : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                }`}
              >
                <FileCode className="w-4 h-4 mb-1" />
                <span className="font-semibold text-[11px]">Raw JSON</span>
              </a>
            </div>
          </div>

          {/* Technical Note */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-500 leading-relaxed">
            <span className="font-semibold text-slate-700 block mb-0.5">Defensive Testing Boundary:</span>
            PromptShield operates in a local sandboxed environment using synthetic test data. It does not target live credentials, production endpoints, or unauthorized third-party services.
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};
