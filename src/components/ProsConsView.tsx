import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Plus, ShieldCheck, HelpCircle, Sparkles, Scale } from 'lucide-react';
import { OptionAnalysis, ImpactLevel, ProItem, ConItem } from '../types';

interface ProsConsViewProps {
  options: OptionAnalysis[];
  onAddPro: (optionId: string, item: ProItem) => void;
  onAddCon: (optionId: string, item: ConItem) => void;
}

export const ProsConsView: React.FC<ProsConsViewProps> = ({ options, onAddPro, onAddCon }) => {
  const [activeOptionId, setActiveOptionId] = useState<string>('all');
  const [addingTo, setAddingTo] = useState<{ optionId: string; type: 'pro' | 'con' } | null>(null);
  const [newText, setNewText] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [newImpact, setNewImpact] = useState<ImpactLevel>('high');

  const hasAnyProsCons = options.some(
    (o) => (o.pros && o.pros.length > 0) || (o.cons && o.cons.length > 0)
  );

  if (!hasAnyProsCons) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center max-w-xl mx-auto my-6 shadow-xs">
        <Scale className="w-10 h-10 mx-auto text-amber-600 mb-3" />
        <h3 className="font-bold text-lg text-stone-900 font-serif">Pros & Cons Framework</h3>
        <p className="text-xs text-stone-600 mt-1 leading-relaxed max-w-md mx-auto">
          The weighted pros and cons analysis for this dilemma is ready to load on demand.
        </p>
      </div>
    );
  }

  const displayedOptions = activeOptionId === 'all'
    ? options
    : options.filter(o => o.id === activeOptionId);

  const getImpactBadge = (level: ImpactLevel, type: 'pro' | 'con') => {
    if (type === 'pro') {
      switch (level) {
        case 'critical':
          return <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">Crucial Win</span>;
        case 'high':
          return <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">High Impact</span>;
        case 'moderate':
          return <span className="text-[10px] uppercase font-medium tracking-wider px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">Moderate</span>;
        case 'minor':
          return <span className="text-[10px] uppercase font-medium tracking-wider px-1.5 py-0.5 rounded bg-stone-50 text-stone-500">Nice to have</span>;
      }
    } else {
      switch (level) {
        case 'critical':
          return <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">Fatal Flaw Risk</span>;
        case 'high':
          return <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">High Risk</span>;
        case 'moderate':
          return <span className="text-[10px] uppercase font-medium tracking-wider px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">Moderate Concern</span>;
        case 'minor':
          return <span className="text-[10px] uppercase font-medium tracking-wider px-1.5 py-0.5 rounded bg-stone-50 text-stone-500">Minor Inconvenience</span>;
      }
    }
  };

  const handleSaveItem = (optionId: string, type: 'pro' | 'con') => {
    if (!newText.trim()) return;

    if (type === 'pro') {
      onAddPro(optionId, {
        id: 'user_p_' + Date.now(),
        text: newText.trim(),
        impact: newImpact,
        explanation: newDetail.trim() || undefined,
        userAdded: true,
      });
    } else {
      onAddCon(optionId, {
        id: 'user_c_' + Date.now(),
        text: newText.trim(),
        severity: newImpact,
        mitigation: newDetail.trim() || undefined,
        userAdded: true,
      });
    }

    setNewText('');
    setNewDetail('');
    setAddingTo(null);
  };

  return (
    <div id="pros-cons-section" className="space-y-6">
      {/* Option filter selector */}
      {options.length > 1 && (
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
            <button
              id="filter-all-options-btn"
              onClick={() => setActiveOptionId('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeOptionId === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Side-by-Side (All)
            </button>
            {options.map((opt) => (
              <button
                key={opt.id}
                id={`filter-opt-${opt.id}-btn`}
                onClick={() => setActiveOptionId(opt.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  activeOptionId === opt.id
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {opt.name}
              </button>
            ))}
          </div>

          <span className="text-xs text-stone-500 italic">
            Tip: You can add your personal pros and cons to any option below.
          </span>
        </div>
      )}

      {/* Grid of Options */}
      <div className={`grid gap-6 ${displayedOptions.length > 1 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {displayedOptions.map((opt) => {
          const proCount = opt.pros?.length || 0;
          const conCount = opt.cons?.length || 0;
          const proRatio = proCount + conCount > 0 ? Math.round((proCount / (proCount + conCount)) * 100) : 50;

          return (
            <div
              key={opt.id}
              id={`option-card-${opt.id}`}
              className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden flex flex-col"
            >
              {/* Option Header */}
              <div className="p-5 border-b border-stone-100 bg-stone-50/50">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-base sm:text-lg text-stone-900 font-serif">
                    {opt.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="font-mono font-semibold text-emerald-700">{proCount} Pros</span>
                    <span className="text-stone-300">/</span>
                    <span className="font-mono font-semibold text-rose-700">{conCount} Cons</span>
                  </div>
                </div>
                <p className="text-xs text-stone-500 mt-1">{opt.tagline}</p>

                {/* Mini Ratio Balance Bar */}
                <div className="mt-3">
                  <div className="w-full h-1.5 bg-rose-100 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${proRatio}%` }}
                      title={`${proRatio}% Positive Weight`}
                    />
                  </div>
                </div>
              </div>

              {/* Two columns: Pros vs Cons */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
                {/* Pros Column */}
                <div className="space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">Pros & Upsides</h4>
                      </div>
                      <button
                        id={`add-pro-${opt.id}`}
                        onClick={() => setAddingTo({ optionId: opt.id, type: 'pro' })}
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-900 font-medium cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Pro</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {(opt.pros || []).map((pro) => (
                        <div
                          key={pro.id}
                          className={`p-3 rounded-xl border text-xs transition-all ${
                            pro.userAdded
                              ? 'bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-300/40'
                              : 'bg-emerald-50/20 border-emerald-100 hover:border-emerald-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="font-semibold text-stone-900 leading-snug">
                              {pro.text}
                            </span>
                            {getImpactBadge(pro.impact, 'pro')}
                          </div>
                          {pro.explanation && (
                            <p className="text-stone-600 text-[11px] mt-1 leading-relaxed">
                              {pro.explanation}
                            </p>
                          )}
                          {pro.userAdded && (
                            <span className="inline-block mt-1 text-[10px] font-medium text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                              Added by you
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cons Column */}
                <div className="space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">Cons & Risks</h4>
                      </div>
                      <button
                        id={`add-con-${opt.id}`}
                        onClick={() => setAddingTo({ optionId: opt.id, type: 'con' })}
                        className="inline-flex items-center gap-1 text-[11px] text-rose-700 hover:text-rose-900 font-medium cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Con</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {(opt.cons || []).map((con) => (
                        <div
                          key={con.id}
                          className={`p-3 rounded-xl border text-xs transition-all ${
                            con.userAdded
                              ? 'bg-rose-50/60 border-rose-300 ring-1 ring-rose-300/40'
                              : 'bg-rose-50/20 border-rose-100 hover:border-rose-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="font-semibold text-stone-900 leading-snug">
                              {con.text}
                            </span>
                            {getImpactBadge(con.severity, 'con')}
                          </div>
                          {con.mitigation && (
                            <div className="mt-2 pt-2 border-t border-rose-100 flex items-start gap-1.5 text-[11px] text-stone-600">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span><strong className="text-stone-700">Mitigation:</strong> {con.mitigation}</span>
                            </div>
                          )}
                          {con.userAdded && (
                            <span className="inline-block mt-1 text-[10px] font-medium text-rose-700 bg-rose-100/70 px-1.5 py-0.2 rounded">
                              Added by you
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Add Custom Item Modal / Inline Form */}
              {addingTo?.optionId === opt.id && (
                <div className="p-4 bg-stone-50 border-t border-stone-200">
                  <h5 className="text-xs font-semibold text-stone-800 mb-2">
                    Add custom {addingTo.type === 'pro' ? 'Pro (Advantage)' : 'Con (Drawback)'} to {opt.name}
                  </h5>
                  <div className="space-y-2">
                    <input
                      type="text"
                      id="custom-item-text-input"
                      value={newText}
                      onChange={(e) => setNewText(e.target.value)}
                      placeholder={addingTo.type === 'pro' ? "e.g. Shorter daily commute by 30 minutes" : "e.g. Higher out-of-pocket health insurance"}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:border-stone-800 outline-none"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        id="custom-item-impact-select"
                        value={newImpact}
                        onChange={(e) => setNewImpact(e.target.value as ImpactLevel)}
                        className="px-2 py-1 text-xs rounded border border-stone-300 text-stone-700 bg-white"
                      >
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="moderate">Moderate</option>
                        <option value="minor">Minor</option>
                      </select>
                      <input
                        type="text"
                        id="custom-item-detail-input"
                        value={newDetail}
                        onChange={(e) => setNewDetail(e.target.value)}
                        placeholder={addingTo.type === 'pro' ? "Explanation / Why it matters (optional)" : "Mitigation strategy (optional)"}
                        className="flex-1 px-3 py-1 text-xs rounded border border-stone-300 focus:border-stone-800 outline-none"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setAddingTo(null)}
                        className="px-3 py-1 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        id="save-custom-item-btn"
                        onClick={() => handleSaveItem(opt.id, addingTo.type)}
                        className="px-3 py-1 bg-stone-900 text-white rounded text-xs font-medium cursor-pointer"
                      >
                        Save Point
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
