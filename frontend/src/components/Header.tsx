import React from 'react';
import { Shield, HelpCircle, Settings, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onOpenHowItWorks: () => void;
  onToggleAdvanced: () => void;
  isAdvancedOpen: boolean;
  providerModel: string;
  executionMode?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHowItWorks,
  onToggleAdvanced,
  isAdvancedOpen,
  providerModel,
  executionMode = 'demo'
}) => {
  const isLive = executionMode === 'live';

  return (
    <header className="border-b border-slate-200/80 bg-white sticky top-0 z-20 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-sm">
            <Shield className="w-5 h-5 text-teal-100" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">
                PromptShield
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-teal-50 text-teal-700 border border-teal-200/60">
                Safety Tester
              </span>
              <span
                className={`hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${
                  isLive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {isLive ? '● Live Model' : '○ Demo Mode'}
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Test your AI prompts. Find weaknesses. Make them safer.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
          <button
            onClick={onOpenHowItWorks}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors font-medium"
            title="How PromptShield works"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">How It Works</span>
          </button>

          <button
            onClick={onToggleAdvanced}
            className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-md border text-xs font-medium transition-colors ${
              isAdvancedOpen
                ? 'bg-slate-100 border-slate-300 text-slate-900'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
            title="Advanced developer settings and report downloads"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <span>Advanced</span>
          </button>
        </div>
      </div>
    </header>
  );
};
