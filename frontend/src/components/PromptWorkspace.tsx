import React, { useState } from 'react';
import { BookOpen, Shield, KeyRound, Check, RefreshCw } from 'lucide-react';
import { ChatbotConfig, SystemPromptTemplate } from '../types';

interface PromptWorkspaceProps {
  config: ChatbotConfig;
  setConfig: (config: ChatbotConfig) => void;
  templates: SystemPromptTemplate[];
  onGenerateTests: () => void;
  loading: boolean;
}

export const PromptWorkspace: React.FC<PromptWorkspaceProps> = ({
  config,
  setConfig,
  templates,
  onGenerateTests,
  loading
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tpl_bennett_faq');

  const handleApplyTemplate = (tplId: string) => {
    setSelectedTemplateId(tplId);
    const tpl = templates.find((t) => t.id === tplId);
    if (tpl) {
      setConfig({
        domain: tpl.domain,
        system_prompt: tpl.system_prompt,
        permitted_behavior: tpl.permitted_behavior,
        prohibited_behavior: tpl.prohibited_behavior,
        dummy_secret: tpl.dummy_secret
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">System Prompt & Policy Workspace</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Module B: Configure your chatbot persona, domain boundaries, prohibited actions, and canary secrets.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-medium">Load Template:</span>
            <select
              value={selectedTemplateId}
              onChange={(e) => handleApplyTemplate(e.target.value)}
              className="text-xs border border-slate-200 rounded-md px-2.5 py-1.5 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: System Prompt Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                <span>Active Target System Prompt</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {config.system_prompt.length} chars · {config.system_prompt.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <textarea
              rows={9}
              value={config.system_prompt}
              onChange={(e) => setConfig({ ...config, system_prompt: e.target.value })}
              className="w-full text-xs font-mono p-3 border border-slate-200 rounded-md bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 leading-relaxed resize-y"
              placeholder="Enter or paste the system instructions that define the chatbot's intended role, tone, and operational guidelines..."
            />
          </div>

          {/* Permitted and Prohibited Rules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center space-x-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Permitted Behaviors</span>
              </label>
              <textarea
                rows={4}
                value={config.permitted_behavior}
                onChange={(e) => setConfig({ ...config, permitted_behavior: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-md bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="List allowed tasks, services, and queries..."
              />
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-red-700 flex items-center space-x-1">
                <Shield className="w-3.5 h-3.5 text-red-600" />
                <span>Prohibited Behaviors & Boundaries</span>
              </label>
              <textarea
                rows={4}
                value={config.prohibited_behavior}
                onChange={(e) => setConfig({ ...config, prohibited_behavior: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-md bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                placeholder="List forbidden operations, topics, or tone..."
              />
            </div>
          </div>
        </div>

        {/* Right 1 Col: Metadata & Canary Secret */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Domain & Parameters</h3>
            
            <div>
              <label className="text-xs font-semibold text-slate-700">Chatbot Domain</label>
              <input
                type="text"
                value={config.domain}
                onChange={(e) => setConfig({ ...config, domain: e.target.value })}
                className="w-full mt-1 text-xs p-2 border border-slate-200 rounded-md bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                placeholder="e.g. Academic FAQ Assistant"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span className="flex items-center space-x-1">
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                  <span>Dummy Canary Secret Marker</span>
                </span>
                <span className="text-[10px] text-amber-600 font-mono">Defensive canary</span>
              </label>
              <input
                type="text"
                value={config.dummy_secret}
                onChange={(e) => setConfig({ ...config, dummy_secret: e.target.value })}
                className="w-full mt-1 text-xs font-mono p-2 border border-amber-200 rounded-md bg-amber-50/50 text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder="e.g. BENNETT-SECRET-2026-X9"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                A synthetic canary token used to objectively verify whether an adversarial attack succeeded in data exfiltration.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={onGenerateTests}
                disabled={loading}
                className="w-full py-2.5 px-4 text-xs font-semibold rounded-md bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Synthesizing Test Suite...' : 'Generate Red-Team Test Suite'}</span>
              </button>
            </div>
          </div>

          {/* Guidelines Box */}
          <div className="bg-slate-100/70 border border-slate-200 rounded-lg p-4 text-xs text-slate-600 space-y-2">
            <span className="font-semibold text-slate-800 block">Course Compliance (C23):</span>
            <p className="leading-relaxed">
              In Bennett University SCSE4041 Prompt Engineering, the target system prompt acts as the primary defense boundary. Red-team tests will probe this configuration for instruction overrides, canary leakage, and role spoofing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
