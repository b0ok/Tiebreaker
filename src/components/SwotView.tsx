import React, { useState } from 'react';
import { Shield, Target, TrendingUp, AlertOctagon, HelpCircle } from 'lucide-react';
import { OptionAnalysis } from '../types';

interface SwotViewProps {
  options: OptionAnalysis[];
}

export const SwotView: React.FC<SwotViewProps> = ({ options }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(options[0]?.id || '');

  const activeOption = options.find((o) => o.id === selectedOptionId) || options[0];

  if (!activeOption || !activeOption.swot) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center max-w-xl mx-auto my-6 shadow-xs">
        <Target className="w-10 h-10 mx-auto text-violet-500 mb-3" />
        <h3 className="font-bold text-lg text-stone-900 font-serif">SWOT Framework</h3>
        <p className="text-xs text-stone-600 mt-1 leading-relaxed max-w-md mx-auto">
          The strategic SWOT matrix for this dilemma is ready to load on demand.
        </p>
      </div>
    );
  }

  return (
    <div id="swot-analysis-section" className="space-y-6">
      {/* Option switch tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-base font-semibold text-stone-900 font-serif">
            Strategic SWOT Matrix
          </h3>
          <p className="text-xs text-stone-500">
            Internal vs. External strategic factors for each path.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl">
          {options.map((opt) => (
            <button
              key={opt.id}
              id={`swot-opt-btn-${opt.id}`}
              onClick={() => setSelectedOptionId(opt.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeOption.id === opt.id
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {opt.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths (Internal Positive) */}
        <div className="bg-emerald-50/40 border border-emerald-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-950 uppercase tracking-wide">
                Strengths
              </h4>
              <span className="text-[10px] text-emerald-700 font-medium">
                Internal Advantages & Inherent Assets
              </span>
            </div>
          </div>
          <ul className="space-y-2.5">
            {activeOption.swot.strengths.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-stone-800 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses (Internal Negative) */}
        <div className="bg-amber-50/40 border border-amber-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <AlertOctagon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-950 uppercase tracking-wide">
                Weaknesses
              </h4>
              <span className="text-[10px] text-amber-700 font-medium">
                Internal Vulnerabilities & Gaps
              </span>
            </div>
          </div>
          <ul className="space-y-2.5">
            {activeOption.swot.weaknesses.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-stone-800 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Opportunities (External Positive) */}
        <div className="bg-sky-50/40 border border-sky-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-sky-950 uppercase tracking-wide">
                Opportunities
              </h4>
              <span className="text-[10px] text-sky-700 font-medium">
                External Tailwinds & Compounding Upside
              </span>
            </div>
          </div>
          <ul className="space-y-2.5">
            {activeOption.swot.opportunities.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-stone-800 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Threats (External Negative) */}
        <div className="bg-rose-50/40 border border-rose-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-950 uppercase tracking-wide">
                Threats
              </h4>
              <span className="text-[10px] text-rose-700 font-medium">
                External Risks & Hidden Pitfalls
              </span>
            </div>
          </div>
          <ul className="space-y-2.5">
            {activeOption.swot.threats.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-stone-800 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Strategic Takeaway / Action rule */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex items-start gap-3 text-xs">
        <HelpCircle className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-stone-900 block mb-0.5">
            How to read this SWOT for {activeOption.name}:
          </span>
          <p className="text-stone-600 leading-relaxed">
            A winning decision leverages <strong className="text-emerald-800">Strengths</strong> to capture the <strong className="text-sky-800">Opportunities</strong>, while actively hedging against the identified <strong className="text-rose-800">Threats</strong> before committing significant capital or time.
          </p>
        </div>
      </div>
    </div>
  );
};
