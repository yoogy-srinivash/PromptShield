import React from 'react';
import { X, Shield, MessageSquare, Play, Sparkles, CheckCircle2 } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200/60">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-900">How PromptShield Works</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
          <p className="text-slate-600 leading-relaxed">
            PromptShield tests whether your AI assistant will faithfully follow your instructions when a user sends tricky, contradictory, or manipulative messages.
          </p>

          <div className="space-y-3 pt-1">
            <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                1
              </span>
              <div>
                <p className="font-semibold text-slate-900">Paste your AI instructions</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Enter the system prompt or rules you provide to your AI assistant.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                2
              </span>
              <div>
                <p className="font-semibold text-slate-900">Automated safety simulation</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  PromptShield creates 12 realistic test messages (overrides, fake administrator claims, secret extraction, mixed languages) to see how your AI reacts.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                3
              </span>
              <div>
                <p className="font-semibold text-slate-900">Score & stronger prompt</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Get a transparent safety score out of 100, read exact response quotes, and generate an improved, hardened version of your prompt in one click.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition-colors shadow-sm"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
