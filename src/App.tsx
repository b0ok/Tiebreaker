import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DecisionForm } from './components/DecisionForm';
import { ViewTabs } from './components/ViewTabs';
import { ProsConsView } from './components/ProsConsView';
import { ComparisonTableView } from './components/ComparisonTableView';
import { SwotView } from './components/SwotView';
import { VerdictView } from './components/VerdictView';
import { RandomTiebreakerView } from './components/RandomTiebreakerView';
import { HistoryDrawer } from './components/HistoryDrawer';
import {
  DecisionResult,
  TabView,
  TiebreakerMethod,
  ProItem,
  ConItem,
  ComparisonCriterion,
  RandomTiebreakerResult,
} from './types';
import { RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { ScaleWithSnakeIcon } from './components/ScaleWithSnakeIcon';

const STORAGE_KEY = 'the_tiebreaker_decisions_v2';

export default function App() {
  const [currentDecision, setCurrentDecision] = useState<DecisionResult | null>(null);
  const [savedDecisions, setSavedDecisions] = useState<DecisionResult[]>([]);
  const [activeTab, setActiveTab] = useState<TabView>('pros-cons');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMethod, setIsLoadingMethod] = useState<boolean>(false);
  const [loadingPhase, setLoadingPhase] = useState<string>('Analyzing decision trade-offs...');
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSubmittedData, setLastSubmittedData] = useState<{
    dilemma: string;
    options?: string[];
    context?: string;
    decisionStyle?: string;
    method: TiebreakerMethod;
  } | null>(null);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedDecisions(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load decision history from localStorage', e);
    }
  }, []);

  // Save history helper
  const persistDecisions = (updated: DecisionResult[]) => {
    setSavedDecisions(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  };

  // Trigger targeted decision analysis
  const handleAnalyze = async (data: {
    dilemma: string;
    options?: string[];
    context?: string;
    decisionStyle?: string;
    method: TiebreakerMethod;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLastSubmittedData(data);

    const methodLabels: Record<TiebreakerMethod, string> = {
      'pros-cons': 'Weighing pros, cons, and mitigations...',
      comparison: 'Constructing multi-criteria comparison matrix...',
      swot: 'Mapping 2x2 SWOT analysis...',
      verdict: 'Synthesizing the Tiebreaker verdict...',
      random: 'Spinning the RandomTieBreaker...',
    };

    setLoadingPhase(methodLabels[data.method] || 'Resolving dilemma...');

    try {
      const response = await fetch('/api/analyze-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const result: DecisionResult = await response.json();
      result.activeMethod = data.method;
      result.loadedMethods = [data.method];

      setCurrentDecision(result);
      setActiveTab(data.method);

      // Add to saved decisions without duplicate
      const filtered = savedDecisions.filter((d) => d.id !== result.id);
      persistDecisions([result, ...filtered]);
    } catch (err: any) {
      console.error('Decision analysis failure:', err);
      setErrorMessage('We encountered an issue analyzing this decision. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Switch or lazy-load another tiebreaker method on-demand
  const handleTabChange = async (targetTab: TabView) => {
    if (!currentDecision) return;

    // If already loaded, simply switch
    if (currentDecision.loadedMethods?.includes(targetTab)) {
      setActiveTab(targetTab);
      return;
    }

    // Lazy load this specific tiebreaker method on-demand
    setIsLoadingMethod(true);
    try {
      const response = await fetch('/api/analyze-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dilemma: currentDecision.dilemma,
          options: currentDecision.options.map((o) => o.name),
          method: targetTab,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to load ${targetTab} method`);
      }

      const fresh: DecisionResult = await response.json();

      // Merge newly loaded method data without overwriting existing
      const updatedDecision: DecisionResult = {
        ...currentDecision,
        loadedMethods: Array.from(new Set([...(currentDecision.loadedMethods || []), targetTab])),
      };

      if (targetTab === 'pros-cons' && fresh.options) {
        updatedDecision.options = currentDecision.options.map((origOpt) => {
          const matching = fresh.options.find((f) => f.name === origOpt.name || f.id === origOpt.id);
          return matching ? { ...origOpt, pros: matching.pros, cons: matching.cons } : origOpt;
        });
      }

      if (targetTab === 'swot' && fresh.options) {
        updatedDecision.options = currentDecision.options.map((origOpt) => {
          const matching = fresh.options.find((f) => f.name === origOpt.name || f.id === origOpt.id);
          return matching ? { ...origOpt, swot: matching.swot } : origOpt;
        });
      }

      if (targetTab === 'comparison' && fresh.comparisonCriteria) {
        updatedDecision.comparisonCriteria = fresh.comparisonCriteria;
      }

      if (targetTab === 'verdict' && fresh.verdict) {
        updatedDecision.verdict = fresh.verdict;
      }

      if (targetTab === 'random' && fresh.randomResult) {
        updatedDecision.randomResult = fresh.randomResult;
      } else if (targetTab === 'random' && !updatedDecision.randomResult) {
        const randomOpt = currentDecision.options[Math.floor(Math.random() * currentDecision.options.length)];
        updatedDecision.randomResult = {
          winnerId: randomOpt.id,
          winnerName: randomOpt.name,
          timestamp: Date.now(),
          flipCount: 1,
          gutCheckAdvice: `The random tiebreaker landed on "${randomOpt.name}". Observe your immediate reaction.`,
          psychologicalInsight: 'A coin toss exposes your true underlying preference in the moment the result appears.',
          suggestedAction: `Operate as if "${randomOpt.name}" is your finalized decision for the next 2 hours.`,
        };
      }

      setCurrentDecision(updatedDecision);
      setActiveTab(targetTab);

      // Persist update
      const filtered = savedDecisions.filter((d) => d.id !== updatedDecision.id);
      persistDecisions([updatedDecision, ...filtered]);
    } catch (err) {
      console.warn(`Could not load ${targetTab} tiebreaker:`, err);
      // If random, fallback instantly in client
      if (targetTab === 'random') {
        const randomOpt = currentDecision.options[Math.floor(Math.random() * currentDecision.options.length)];
        const updatedDecision: DecisionResult = {
          ...currentDecision,
          loadedMethods: Array.from(new Set([...(currentDecision.loadedMethods || []), 'random'])),
          randomResult: {
            winnerId: randomOpt.id,
            winnerName: randomOpt.name,
            timestamp: Date.now(),
            flipCount: 1,
            gutCheckAdvice: `The random tiebreaker landed on "${randomOpt.name}". Observe your immediate reaction.`,
            psychologicalInsight: 'A coin toss exposes your true underlying preference in the moment the result appears.',
            suggestedAction: `Operate as if "${randomOpt.name}" is your finalized decision for the next 2 hours.`,
          },
        };
        setCurrentDecision(updatedDecision);
        setActiveTab('random');
      }
    } finally {
      setIsLoadingMethod(false);
    }
  };

  // Follow-up question API handler for Verdict
  const handleAskQuestion = async (question: string): Promise<string> => {
    if (!currentDecision) return '';

    const response = await fetch('/api/ask-tiebreaker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dilemma: currentDecision.dilemma,
        options: currentDecision.options.map((o) => o.name),
        currentVerdict: currentDecision.verdict?.headline || 'Option recommended',
        question,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to ask question');
    }

    const data = await response.json();
    return data.answer || 'Consider testing this assumption in a small 48-hour experiment.';
  };

  // Dynamic weights update
  const handleUpdateWeight = (criterionId: string, newWeight: number) => {
    if (!currentDecision || !currentDecision.comparisonCriteria) return;
    const updatedCriteria = currentDecision.comparisonCriteria.map((c) =>
      c.id === criterionId ? { ...c, weight: newWeight } : c
    );
    const updated = { ...currentDecision, comparisonCriteria: updatedCriteria };
    setCurrentDecision(updated);
  };

  const handleAddCriterion = (criterion: ComparisonCriterion) => {
    if (!currentDecision) return;
    const currentList = currentDecision.comparisonCriteria || [];
    const updated = {
      ...currentDecision,
      comparisonCriteria: [...currentList, criterion],
    };
    setCurrentDecision(updated);
  };

  const handleResetWeights = () => {
    if (!currentDecision || !currentDecision.comparisonCriteria) return;
    const reset = currentDecision.comparisonCriteria.map((c) => ({ ...c, weight: 3 }));
    setCurrentDecision({ ...currentDecision, comparisonCriteria: reset });
  };

  // Add custom Pro
  const handleAddPro = (optionId: string, item: ProItem) => {
    if (!currentDecision) return;
    const updatedOptions = currentDecision.options.map((opt) => {
      if (opt.id === optionId) {
        return { ...opt, pros: [...(opt.pros || []), item] };
      }
      return opt;
    });
    const updated = { ...currentDecision, options: updatedOptions };
    setCurrentDecision(updated);
  };

  // Add custom Con
  const handleAddCon = (optionId: string, item: ConItem) => {
    if (!currentDecision) return;
    const updatedOptions = currentDecision.options.map((opt) => {
      if (opt.id === optionId) {
        return { ...opt, cons: [...(opt.cons || []), item] };
      }
      return opt;
    });
    const updated = { ...currentDecision, options: updatedOptions };
    setCurrentDecision(updated);
  };

  // Update random tiebreaker result
  const handleUpdateRandomResult = (newResult: RandomTiebreakerResult) => {
    if (!currentDecision) return;
    const updated = { ...currentDecision, randomResult: newResult };
    setCurrentDecision(updated);
    const filtered = savedDecisions.filter((d) => d.id !== updated.id);
    persistDecisions([updated, ...filtered]);
  };

  // Delete decision from history
  const handleDeleteDecision = (id: string) => {
    const updated = savedDecisions.filter((d) => d.id !== id);
    persistDecisions(updated);
    if (currentDecision?.id === id) {
      setCurrentDecision(null);
    }
  };

  const handleClearAllHistory = () => {
    persistDecisions([]);
    setCurrentDecision(null);
  };

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-900 flex flex-col font-sans selection:bg-amber-200 selection:text-stone-900">
      {/* Header */}
      <Header
        onNewDecision={() => setCurrentDecision(null)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        savedCount={savedDecisions.length}
        hasActiveDecision={Boolean(currentDecision)}
        onSelectPreset={() => {}}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {lastSubmittedData && (
                <button
                  type="button"
                  onClick={() => handleAnalyze(lastSubmittedData)}
                  className="font-semibold text-rose-900 hover:text-rose-950 underline cursor-pointer"
                >
                  Try Again
                </button>
              )}
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-rose-600 font-semibold hover:underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* If no active decision, show the Form */}
        {!currentDecision && (
          <div className="py-4 sm:py-8">
            <DecisionForm onSubmit={handleAnalyze} isLoading={isLoading} />
          </div>
        )}

        {/* Loading Overlay / Interstitial */}
        {isLoading && (
          <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-2xl border border-stone-200 shadow-sm text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-stone-900 flex items-center justify-center mb-4 ring-4 ring-amber-100">
              <ScaleWithSnakeIcon
                className="w-7 h-7 animate-pulse"
                snakeColor="#F59E0B"
                snakeBackColor="#D97706"
                scaleColor="#FAFAF9"
                cutoutColor="#1C1917"
              />
            </div>
            <h3 className="text-base font-bold font-serif text-stone-900 mb-1">
              The Tiebreaker is at Work
            </h3>
            <p className="text-xs text-stone-600 mb-6 font-mono">
              {loadingPhase}
            </p>
            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-stone-900 rounded-full animate-indeterminate" />
            </div>
          </div>
        )}

        {/* If decision is ready, show targeted result with method tabs */}
        {currentDecision && !isLoading && (
          <div className="space-y-6">
            {/* Dilemma Title Bar */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                  Active Dilemma
                </div>
                <h1 className="text-lg sm:text-xl font-bold font-serif text-stone-900 mt-0.5 leading-snug">
                  {currentDecision.dilemma}
                </h1>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  {currentDecision.summary}
                </p>
              </div>

              <button
                id="re-deliberate-btn"
                onClick={() => setCurrentDecision(null)}
                className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 border border-stone-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer self-start sm:self-auto shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5 text-stone-400" />
                <span>Change Dilemma / Method</span>
              </button>
            </div>

            {/* Navigation View Tabs (Shows all 5 frameworks, lazy-loading only on click) */}
            <ViewTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              decision={currentDecision}
              isLoadingMethod={isLoadingMethod}
            />

            {/* On-demand loading indicator for tab switch */}
            {isLoadingMethod && (
              <div className="py-6 text-center text-xs text-stone-500 flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-stone-400 border-t-stone-900 rounded-full animate-spin" />
                <span>Loading framework on demand...</span>
              </div>
            )}

            {/* Selected View Mode Content */}
            {!isLoadingMethod && (
              <div className="mt-4">
                {activeTab === 'pros-cons' && (
                  <ProsConsView
                    options={currentDecision.options}
                    onAddPro={handleAddPro}
                    onAddCon={handleAddCon}
                  />
                )}

                {activeTab === 'comparison' && (
                  <ComparisonTableView
                    options={currentDecision.options}
                    criteria={currentDecision.comparisonCriteria || []}
                    onUpdateWeight={handleUpdateWeight}
                    onAddCriterion={handleAddCriterion}
                    onResetWeights={handleResetWeights}
                  />
                )}

                {activeTab === 'swot' && (
                  <SwotView options={currentDecision.options} />
                )}

                {activeTab === 'verdict' && (
                  <VerdictView
                    decision={currentDecision}
                    onAskQuestion={handleAskQuestion}
                  />
                )}

                {activeTab === 'random' && (
                  <RandomTiebreakerView
                    options={currentDecision.options}
                    dilemma={currentDecision.dilemma}
                    randomResult={currentDecision.randomResult}
                    onUpdateResult={handleUpdateRandomResult}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* History Drawer Modal */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedDecisions={savedDecisions}
        onSelectDecision={(dec) => {
          setCurrentDecision(dec);
          setActiveTab(dec.activeMethod || 'pros-cons');
        }}
        onDeleteDecision={handleDeleteDecision}
        onClearAll={handleClearAllHistory}
      />

      {/* Subtle Footer */}
      <footer className="border-t border-stone-200 bg-white/70 py-6 text-center text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>The Tiebreaker — Systematic Decision Science & Unbiased Resolution</span>
          <span className="text-[11px] text-stone-400">
            Pros & Cons • Multi-Criteria Tables • SWOT Analysis • Clear Verdict • RandomTieBreaker
          </span>
        </div>
      </footer>
    </div>
  );
}
