import React from 'react';
import { Award, HelpCircle, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { TiebreakerVerdict, TabView } from '../types';

interface VerdictBannerProps {
  verdict: TiebreakerVerdict;
  onSelectTab: (tab: TabView) => void;
}

export const VerdictBanner: React.FC<VerdictBannerProps> = ({ verdict, onSelectTab }) => {
  return (
    <div id="verdict-banner" className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-7 shadow-md border border-stone-800 relative overflow-hidden mb-6">
      {/* Subtle background highlight */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Tiebreaker Verdict</span>
            </span>
            <span className="text-xs text-stone-400 font-medium">
              Confidence: <strong className="text-stone-200">{verdict.confidenceScore}%</strong>
            </span>
          </div>

          <button
            id="view-full-verdict-btn"
            onClick={() => onSelectTab('verdict')}
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium cursor-pointer transition-colors"
          >
            <span>Read full rationale & stress-test</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Winner Headline */}
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight leading-snug">
            {verdict.headline}
          </h2>
          <p className="text-sm text-stone-300 mt-2 leading-relaxed">
            {verdict.rationale}
          </p>
        </div>

        {/* Gut-check question callout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-stone-800 text-xs">
          <div className="flex items-start gap-2 bg-stone-800/60 rounded-xl p-3 border border-stone-700/50">
            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-stone-200 block mb-0.5">The Gut-Check Question:</span>
              <span className="text-stone-300 italic">"{verdict.tiebreakerQuestion}"</span>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-stone-800/60 rounded-xl p-3 border border-stone-700/50">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-stone-200 block mb-0.5">Immediate 24-Hour Reality Test:</span>
              <span className="text-stone-300">{verdict.immediateNextStep}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
