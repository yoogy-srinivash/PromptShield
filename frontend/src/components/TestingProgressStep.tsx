import React, { useState } from 'react';
import { CheckCircle2, Circle, Loader2, ChevronDown, ChevronUp, AlertCircle, RefreshCw } from 'lucide-react';

export type ProgressStage = 'understanding' | 'creating' | 'testing' | 'reviewing' | 'completed' | 'error';

interface TestingProgressStepProps {
  currentStage: ProgressStage;
  error?: string | null;
  onRetry: () => void;
}

export const TestingProgressStep: React.FC<TestingProgressStepProps> = ({
  currentStage,
  error,
  onRetry
}) => {
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);

  const stages = [
    {
      id: 'understanding',
      title: '1. Understanding your instructions',
      desc: "We're identifying the rules your AI is supposed to follow."
    },
    {
      id: 'creating',
      title: '2. Creating safety checks',
      desc: "We're preparing different messages that might confuse or override those rules."
    },
    {
      id: 'testing',
      title: '3. Testing your AI',
      desc: "We're checking how the AI responds to those messages."
    },
    {
      id: 'reviewing',
      title: '4. Reviewing the results',
      desc: "We're identifying which instructions held up and which may need improvement."
    }
  ];

  const getStageStatus = (stageId: string) => {
    const order = ['understanding', 'creating', 'testing', 'reviewing', 'completed'];
    const currentIndex = order.indexOf(currentStage);
    const stageIndex = order.indexOf(stageId);

    if (currentStage === 'error') {
      return stageIndex === 0 ? 'completed' : 'error';
    }
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'in_progress';
    return 'pending';
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-7 shadow-sm transition-all space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {currentStage === 'completed' ? 'Testing Complete' : 'Testing in Progress'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Running automated safety checks against your prompt instructions.
          </p>
        </div>
        {currentStage !== 'completed' && currentStage !== 'error' && (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200/60">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Processing</span>
          </span>
        )}
      </div>

      {/* 4 Stages List */}
      <div className="space-y-4">
        {stages.map((stage) => {
          const status = getStageStatus(stage.id);
          return (
            <div key={stage.id} className="flex items-start space-x-3.5 text-xs sm:text-sm">
              <div className="mt-0.5 shrink-0">
                {status === 'completed' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                )}
                {status === 'in_progress' && (
                  <Loader2 className="w-5 h-5 text-teal-600 animate-spin" />
                )}
                {status === 'pending' && (
                  <Circle className="w-5 h-5 text-slate-300" />
                )}
                {status === 'error' && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${status === 'in_progress' ? 'text-teal-900 font-bold' : status === 'completed' ? 'text-slate-900' : 'text-slate-400'}`}>
                  {stage.title}
                </p>
                <p className={`text-xs mt-0.5 ${status === 'pending' ? 'text-slate-300' : 'text-slate-500'}`}>
                  {stage.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Error state */}
      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start justify-between gap-3">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Test could not complete</p>
              <p className="mt-0.5 text-red-700">{error}</p>
            </div>
          </div>
          <button
            onClick={onRetry}
            className="px-3 py-1.5 rounded bg-white border border-red-300 text-red-700 font-medium hover:bg-red-50 shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Expandable Explanation */}
      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={() => setIsExplainerOpen(!isExplainerOpen)}
          className="w-full flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 font-medium py-1"
        >
          <span>What is PromptShield testing?</span>
          {isExplainerOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {isExplainerOpen && (
          <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200/80 leading-relaxed">
            Some messages try to trick AI assistants into ignoring their original instructions, leaking private keys, or adopting unauthorized personas. PromptShield checks how well your instructions hold up in these realistic situations.
          </div>
        )}
      </div>
    </div>
  );
};
