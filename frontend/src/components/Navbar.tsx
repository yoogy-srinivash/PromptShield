import React from 'react';
import { Shield, Cpu, Activity, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRunDemo: () => void;
  demoLoading: boolean;
  providerInfo: any;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onRunDemo,
  demoLoading,
  providerInfo
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'workspace', label: 'Prompt Workspace' },
    { id: 'generator', label: 'Red-Team Tests' },
    { id: 'evaluator', label: 'Evaluations & Evidence' },
    { id: 'optimizer', label: 'Guardrail Optimizer' },
    { id: 'comparison', label: 'Before / After' },
    { id: 'history', label: 'History & Reports' }
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <Shield className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">PromptShield</span>
                <span className="text-xs px-2 py-0.5 rounded font-mono bg-teal-50 text-teal-700 border border-teal-200">
                  C23 · Red-Team Kit
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                SCSE4041 Prompt Engineering · Bennett University
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-xs bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200 text-slate-700">
              <Cpu className="w-4 h-4 text-slate-500" />
              <span>Runtime:</span>
              <span className="font-semibold text-slate-900 font-mono">
                {providerInfo?.active_model || 'fixture-deterministic'}
              </span>
              <span className={`w-2 h-2 rounded-full ${providerInfo?.fixture_mode ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            </div>

            <button
              onClick={onRunDemo}
              disabled={demoLoading}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-teal-600 hover:bg-teal-700 text-white transition-colors shadow-sm disabled:opacity-50"
              title="Execute full end-to-end built-in demonstration"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{demoLoading ? 'Running Demo...' : 'Run Built-in Demo'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 overflow-x-auto py-1 border-t border-slate-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-slate-100 text-slate-900 font-semibold border-b-2 border-teal-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
