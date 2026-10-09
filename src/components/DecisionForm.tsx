import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Compass,
  ArrowRight,
  Zap,
  Dices,
  Scale,
  Table,
  Award,
} from 'lucide-react';
import { PRESET_DILEMMAS } from '../data/presets';
import { DecisionPreset, TiebreakerMethod } from '../types';

interface DecisionFormProps {
  onSubmit: (data: {
    dilemma: string;
    options?: string[];
    context?: string;
    decisionStyle?: string;
    method: TiebreakerMethod;
  }) => void;
  isLoading: boolean;
}

export const DecisionForm: React.FC<DecisionFormProps> = ({ onSubmit, isLoading }) => {
  const [dilemma, setDilemma] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [selectedMethod, setSelectedMethod] = useState<TiebreakerMethod>('pros-cons');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [context, setContext] = useState('');
  const [decisionStyle, setDecisionStyle] = useState('balanced');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddOption = () => {
    if (options.length < 4) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    } else {
      const newOpts = [...options];
      newOpts[index] = '';
      setOptions(newOpts);
    }
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const handleSelectPreset = (preset: DecisionPreset) => {
    setDilemma(preset.dilemma);
    setOptions(preset.options);
    setContext(preset.context);
    setShowAdvanced(true);
    setErrorMessage('');
  };

  const handlePickRandomPreset = () => {
    if (PRESET_DILEMMAS.length === 0) return;
    const available = PRESET_DILEMMAS.filter((p) => p.dilemma !== dilemma);
    const pool = available.length > 0 ? available : PRESET_DILEMMAS;
    const randomChoice = pool[Math.floor(Math.random() * pool.length)];
    handleSelectPreset(randomChoice);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dilemma.trim()) {
      setErrorMessage('Please describe the dilemma or decision you are facing.');
      return;
    }
    setErrorMessage('');

    // Filter out blank option strings
    const validOptions = options.map(o => o.trim()).filter(Boolean);

    onSubmit({
      dilemma: dilemma.trim(),
      options: validOptions.length >= 2 ? validOptions : undefined,
      context: context.trim() || undefined,
      decisionStyle,
      method: selectedMethod,
    });
  };

  const methodOptions: {
    id: TiebreakerMethod;
    label: string;
    actionVerb: string;
    description: string;
    icon: React.ReactNode;
    tag: string;
  }[] = [
    {
      id: 'pros-cons',
      label: 'Analyze Pros & Cons',
      actionVerb: 'Analyze Pros & Cons',
      description: 'Weighted advantages, severity risks, and counter-mitigations',
      icon: <Scale className="w-4 h-4 text-amber-600" />,
      tag: 'Classic Balance',
    },
    {
      id: 'comparison',
      label: 'Comparison Matrix',
      actionVerb: 'Construct Comparison Matrix',
      description: 'Side-by-side weighted criteria scoring table & totals',
      icon: <Table className="w-4 h-4 text-sky-600" />,
      tag: 'Weighted Scores',
    },
    {
      id: 'swot',
      label: 'SWOT Analysis',
      actionVerb: 'Map SWOT Grid',
      description: 'Strengths, weaknesses, opportunities & external threats',
      icon: <Compass className="w-4 h-4 text-violet-600" />,
      tag: 'Strategic 2x2',
    },
    {
      id: 'verdict',
      label: 'Deliver Clear Verdict',
      actionVerb: 'Deliver Clear Verdict',
      description: 'Executive recommendation, confidence %, rationale & blindspots',
      icon: <Award className="w-4 h-4 text-emerald-600" />,
      tag: 'High Conviction',
    },
    {
      id: 'random',
      label: 'RandomTieBreaker',
      actionVerb: 'Flip Random Tiebreaker',
      description: 'Decisive coin toss with 3-second gut-check calibration',
      icon: <Dices className="w-4 h-4 text-amber-500" />,
      tag: 'Instant Gut-Check',
    },
  ];

  return (
    <div id="decision-form-container" className="max-w-3xl mx-auto w-full">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8">
        {/* Section title & mission */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200/80 mb-3">
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            <span>Unbiased Decision Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-serif">
            What decision is holding you back?
          </h1>
          <p className="text-sm text-stone-600 mt-2 leading-relaxed">
            State your dilemma. Pick how The Tiebreaker will resolve it: analyze the pros & cons, construct a side-by-side comparison matrix, map out a SWOT analysis, deliver a clear verdict, or spin a RandomTieBreaker.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main dilemma input */}
          <div>
            <label htmlFor="dilemma-input" className="block text-sm font-semibold text-stone-900 mb-1.5">
              The Dilemma or Question <span className="text-amber-600">*</span>
            </label>
            <textarea
              id="dilemma-input"
              rows={3}
              value={dilemma}
              onChange={(e) => {
                setDilemma(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="e.g. Should I leave my stable job to start a consulting business, or take the internal promotion?"
              className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-stone-800 focus:ring-1 focus:ring-stone-800 text-stone-900 placeholder:text-stone-400 text-sm sm:text-base outline-none transition-all resize-y shadow-xs"
              disabled={isLoading}
            />
            {errorMessage && (
              <p className="text-xs text-rose-600 mt-1.5 font-medium">{errorMessage}</p>
            )}
          </div>

          {/* Options input (Optional / Auto-extracted) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-stone-700 tracking-wide uppercase">
                Options to compare <span className="text-stone-400 font-normal normal-case">(Leave blank to let AI formulate options)</span>
              </label>
              {options.length < 4 && (
                <button
                  type="button"
                  id="add-option-btn"
                  onClick={handleAddOption}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Option</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {options.map((opt, idx) => (
                <div key={idx} className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-mono text-stone-400 select-none">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <input
                    type="text"
                    id={`option-input-${idx}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={idx === 0 ? "Option A: e.g. Start consulting" : idx === 1 ? "Option B: e.g. Stay for promotion" : `Option ${String.fromCharCode(65 + idx)}`}
                    className="w-full pl-8 pr-8 py-2 text-sm rounded-lg border border-stone-200 focus:border-stone-800 focus:ring-1 focus:ring-stone-800 text-stone-800 placeholder:text-stone-400 outline-none transition-all"
                    disabled={isLoading}
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      disabled={isLoading}
                      className="absolute right-2 p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors cursor-pointer"
                      title="Remove option"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tiebreaker Method Picker: Pick a way to decide the tiebreaker */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold text-stone-900 tracking-wide uppercase flex items-center gap-1.5">
                <span>Pick a way to decide the tie breaker</span>
                <span className="text-amber-600 font-bold">*</span>
              </label>
              <span className="text-[11px] text-stone-500">Zero bloat • targeted load</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {methodOptions.map((method) => {
                const isSelected = selectedMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    id={`method-btn-${method.id}`}
                    onClick={() => setSelectedMethod(method.id)}
                    disabled={isLoading}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-stone-900 bg-stone-900 text-white shadow-md ring-1 ring-stone-900'
                        : 'border-stone-200 bg-stone-50/70 hover:bg-stone-100/90 text-stone-900'
                    } ${method.id === 'random' ? 'sm:col-span-2 lg:col-span-1' : ''}`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2 font-bold text-xs">
                          <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-stone-800' : 'bg-white border border-stone-200 shadow-2xs'}`}>
                            {method.icon}
                          </div>
                          <span className={isSelected ? 'text-white' : 'text-stone-900'}>
                            {method.label}
                          </span>
                        </div>
                        <span
                          className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            isSelected
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                              : 'bg-stone-200/60 text-stone-600'
                          }`}
                        >
                          {method.tag}
                        </span>
                      </div>
                      <p
                        className={`text-[11px] leading-relaxed line-clamp-2 ${
                          isSelected ? 'text-stone-300' : 'text-stone-500'
                        }`}
                      >
                        {method.description}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] font-medium pt-2 border-t border-stone-200/20">
                      <span className={isSelected ? 'text-amber-400 font-semibold' : 'text-stone-400'}>
                        {isSelected ? '✓ Selected' : 'Choose this method'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Collapsible Advanced Context & Style */}
          <div className="border-t border-stone-100 pt-3">
            <button
              type="button"
              id="toggle-advanced-btn"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer py-1"
            >
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              <span>{showAdvanced ? 'Hide constraints & decision style' : 'Add context, timeline, or decision style (optional)'}</span>
            </button>

            {showAdvanced && (
              <div className="mt-3 space-y-4 pt-2">
                <div>
                  <label htmlFor="context-input" className="block text-xs font-medium text-stone-700 mb-1">
                    Specific context or constraints (budget, timeline, risk threshold):
                  </label>
                  <textarea
                    id="context-input"
                    rows={2}
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="e.g. 6 months of savings, 2 kids, prefer reversible bets, deadline is next Friday."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:border-stone-800 focus:ring-1 focus:ring-stone-800 text-stone-800 placeholder:text-stone-400 outline-none transition-all resize-none"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1.5">
                    What strategy or bias should The Tiebreaker prioritize?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'balanced', label: 'Balanced', desc: 'Equal weight to upside & safety' },
                      { id: 'risk-averse', label: 'Safety First', desc: 'Prioritize downside protection' },
                      { id: 'ambitious', label: 'High Upside', desc: 'Optimize for maximum growth' },
                      { id: 'speed', label: 'Reversible / Fast', desc: 'Favor agility & low lock-in' },
                    ].map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        id={`style-btn-${style.id}`}
                        onClick={() => setDecisionStyle(style.id)}
                        disabled={isLoading}
                        className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                          decisionStyle === style.id
                            ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                            : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100/70 text-stone-800'
                        }`}
                      >
                        <div className="text-xs font-semibold">{style.label}</div>
                        <div className={`text-[10px] mt-0.5 leading-tight ${decisionStyle === style.id ? 'text-stone-300' : 'text-stone-500'}`}>
                          {style.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              id="break-the-tie-btn"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>The Tiebreaker is resolving the deadlock...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>
                    {methodOptions.find((m) => m.id === selectedMethod)?.actionVerb || 'Break The Tie'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Preset quick trials */}
        <div className="mt-8 pt-6 border-t border-stone-100">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Try a classic high-stakes dilemma:</span>
            </div>
            <button
              type="button"
              id="random-dilemma-btn"
              onClick={handlePickRandomPreset}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200/80 active:scale-95 border border-stone-200 rounded-lg transition-all cursor-pointer disabled:opacity-50 group"
              title="Pick a random high-stakes dilemma"
            >
              <Dices className="w-3.5 h-3.5 text-amber-600 group-hover:rotate-45 transition-transform" />
              <span>Random</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESET_DILEMMAS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                id={`preset-${preset.id}`}
                onClick={() => handleSelectPreset(preset)}
                disabled={isLoading}
                className="text-left p-2.5 rounded-xl border border-stone-200/80 hover:border-stone-400 hover:bg-stone-50/80 transition-all cursor-pointer group"
              >
                <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
                  {preset.category}
                </div>
                <div className="text-xs font-medium text-stone-900 mt-0.5 group-hover:text-stone-950 truncate">
                  {preset.title}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
