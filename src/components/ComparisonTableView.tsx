import React, { useState } from 'react';
import { Sliders, Info, Plus, Award, RotateCcw } from 'lucide-react';
import { OptionAnalysis, ComparisonCriterion } from '../types';

interface ComparisonTableViewProps {
  options: OptionAnalysis[];
  criteria: ComparisonCriterion[];
  onUpdateWeight: (criterionId: string, newWeight: number) => void;
  onAddCriterion: (criterion: ComparisonCriterion) => void;
  onResetWeights: () => void;
}

export const ComparisonTableView: React.FC<ComparisonTableViewProps> = ({
  options,
  criteria,
  onUpdateWeight,
  onAddCriterion,
  onResetWeights,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCritName, setNewCritName] = useState('');
  const [newCritDesc, setNewCritDesc] = useState('');
  const [newCritScores, setNewCritScores] = useState<Record<string, number>>({});
  const [activeTooltip, setActiveTooltip] = useState<{ critId: string; optId: string } | null>(null);

  // Compute weighted scores for each option
  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);

  const weightedScores: Record<string, { rawWeighted: number; normalizedPercent: number }> = {};
  options.forEach((opt) => {
    let rawWeightedSum = 0;
    criteria.forEach((crit) => {
      const score = crit.scores[opt.id] ?? 5;
      rawWeightedSum += score * crit.weight;
    });
    // Max possible is totalWeight * 10
    const maxScore = totalWeight * 10;
    const normalizedPercent = maxScore > 0 ? Math.round((rawWeightedSum / maxScore) * 100) : 0;
    weightedScores[opt.id] = { rawWeighted: rawWeightedSum, normalizedPercent };
  });

  // Find leader
  let leaderId = options[0]?.id;
  let maxScore = -1;
  options.forEach((opt) => {
    if (weightedScores[opt.id]?.rawWeighted > maxScore) {
      maxScore = weightedScores[opt.id].rawWeighted;
      leaderId = opt.id;
    }
  });

  const handleCreateCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCritName.trim()) return;

    const newCrit: ComparisonCriterion = {
      id: 'crit_user_' + Date.now(),
      name: newCritName.trim(),
      description: newCritDesc.trim() || 'Custom user criterion',
      weight: 3,
      scores: { ...newCritScores },
      justifications: {},
    };

    options.forEach((opt) => {
      if (newCrit.scores[opt.id] === undefined) {
        newCrit.scores[opt.id] = 5;
      }
      newCrit.justifications[opt.id] = 'User added criterion evaluation';
    });

    onAddCriterion(newCrit);
    setNewCritName('');
    setNewCritDesc('');
    setNewCritScores({});
    setShowAddForm(false);
  };

  if (!criteria || criteria.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center max-w-xl mx-auto my-6 shadow-xs">
        <Sliders className="w-10 h-10 mx-auto text-sky-500 mb-3" />
        <h3 className="font-bold text-lg text-stone-900 font-serif">Comparison Matrix</h3>
        <p className="text-xs text-stone-600 mt-1 leading-relaxed max-w-md mx-auto">
          The side-by-side weighted comparison matrix for this dilemma is ready to load on demand.
        </p>
      </div>
    );
  }

  return (
    <div id="comparison-table-section" className="space-y-6">
      {/* Weighted Score Leaders Banner */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Dynamic Weighted Matrix
              </h3>
              <span className="text-[11px] text-stone-500">
                (Adjust importance sliders below to test sensitivity)
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-1">
              Adjust the sliders below to match what you value most right now. Watch how the leading option responds.
            </p>
          </div>

          <button
            id="reset-weights-btn"
            onClick={onResetWeights}
            className="inline-flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 cursor-pointer self-start sm:self-auto px-2.5 py-1 rounded-md border border-stone-200 hover:bg-stone-100 transition-colors"
          >
            <RotateCcw className="w-3 h-3 text-stone-400" />
            <span>Reset Weights</span>
          </button>
        </div>

        {/* Option comparison cards with dynamic progress */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
          {options.map((opt) => {
            const isLeading = opt.id === leaderId;
            const scoreData = weightedScores[opt.id] || { rawWeighted: 0, normalizedPercent: 0 };

            return (
              <div
                key={opt.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isLeading
                    ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300/40'
                    : 'bg-white border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-xs sm:text-sm text-stone-900 truncate">
                    {opt.name}
                  </span>
                  {isLeading && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-200/80 px-1.5 py-0.5 rounded-full">
                      <Award className="w-3 h-3" />
                      Leader
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-xl font-bold font-mono text-stone-900">
                    {scoreData.normalizedPercent}%
                  </span>
                  <span className="text-[11px] text-stone-500">
                    {scoreData.rawWeighted} / {totalWeight * 10} pts
                  </span>
                </div>

                <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden mt-1.5">
                  <div
                    className={`h-full transition-all duration-300 ${isLeading ? 'bg-amber-500' : 'bg-stone-400'}`}
                    style={{ width: `${scoreData.normalizedPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-800">
                <th className="py-3.5 px-4 text-xs font-semibold tracking-wide uppercase w-2/5">
                  Decision Criterion & Weight
                </th>
                {options.map((opt) => (
                  <th
                    key={opt.id}
                    className="py-3.5 px-4 text-xs font-semibold tracking-wide uppercase text-stone-900"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span>{opt.name}</span>
                      {opt.id === leaderId && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                          ★
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
              {criteria.map((crit) => (
                <tr key={crit.id} className="hover:bg-stone-50/50 transition-colors">
                  {/* Criterion column with slider */}
                  <td className="py-4 px-4 align-top">
                    <div>
                      <div className="font-semibold text-stone-900 text-sm">
                        {crit.name}
                      </div>
                      <p className="text-stone-500 text-xs mt-0.5 leading-snug">
                        {crit.description}
                      </p>

                      {/* Weight Controller */}
                      <div className="mt-2.5 flex items-center gap-2">
                        <span className="text-[11px] font-medium text-stone-600">
                          Priority Weight:
                        </span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((w) => (
                            <button
                              key={w}
                              type="button"
                              id={`weight-${crit.id}-${w}`}
                              onClick={() => onUpdateWeight(crit.id, w)}
                              className={`w-6 h-6 rounded text-[11px] font-mono font-medium transition-all cursor-pointer ${
                                crit.weight === w
                                  ? 'bg-stone-900 text-white font-bold'
                                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                              }`}
                              title={`Set weight to ${w} of 5`}
                            >
                              {w}
                            </button>
                          ))}
                        </div>
                        <span className="text-[10px] text-stone-400">
                          {crit.weight === 5 ? 'Crucial' : crit.weight === 1 ? 'Minor' : ''}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Option score columns */}
                  {options.map((opt) => {
                    const score = crit.scores[opt.id] ?? 5;
                    const justification = crit.justifications[opt.id];
                    const isHigh = score >= 8;
                    const isLow = score <= 4;

                    return (
                      <td key={opt.id} className="py-4 px-4 align-top">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className={`font-mono font-bold text-sm px-2 py-0.5 rounded ${
                              isHigh
                                ? 'bg-emerald-100 text-emerald-800'
                                : isLow
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-stone-100 text-stone-800'
                            }`}
                          >
                            {score} / 10
                          </span>

                          <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden max-w-[80px]">
                            <div
                              className={`h-full ${
                                isHigh ? 'bg-emerald-500' : isLow ? 'bg-rose-400' : 'bg-stone-400'
                              }`}
                              style={{ width: `${score * 10}%` }}
                            />
                          </div>
                        </div>

                        {/* Justification note */}
                        {justification && (
                          <p className="text-[11px] text-stone-600 leading-relaxed bg-stone-50/70 p-2 rounded-lg border border-stone-100">
                            {justification}
                          </p>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add custom criterion trigger */}
        <div className="p-4 bg-stone-50/50 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            id="add-custom-criterion-btn"
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-stone-500" />
            <span>Add Custom Evaluation Criterion</span>
          </button>
        </div>

        {/* Add Criterion Inline Form */}
        {showAddForm && (
          <form onSubmit={handleCreateCriterion} className="p-4 bg-stone-100/70 border-t border-stone-200 space-y-3">
            <h5 className="text-xs font-bold text-stone-900">Add New Comparison Criterion</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={newCritName}
                onChange={(e) => setNewCritName(e.target.value)}
                placeholder="Criterion Name (e.g. Health & Sleep Impact, Exit Flexibility)"
                className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:border-stone-800 outline-none bg-white"
                required
              />
              <input
                type="text"
                value={newCritDesc}
                onChange={(e) => setNewCritDesc(e.target.value)}
                placeholder="Brief description of what this measures"
                className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:border-stone-800 outline-none bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <span className="text-xs font-medium text-stone-700">Scores (1-10):</span>
              {options.map((opt) => (
                <div key={opt.id} className="flex items-center gap-1.5 text-xs">
                  <span className="text-stone-600">{opt.name}:</span>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newCritScores[opt.id] ?? 5}
                    onChange={(e) =>
                      setNewCritScores({
                        ...newCritScores,
                        [opt.id]: Math.min(10, Math.max(1, parseInt(e.target.value) || 5)),
                      })
                    }
                    className="w-12 px-1.5 py-1 text-xs rounded border border-stone-300 font-mono text-center bg-white"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="save-new-criterion-btn"
                className="px-3.5 py-1 bg-stone-900 text-white rounded text-xs font-medium cursor-pointer"
              >
                Add Criterion
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
