import React, { useState } from 'react';
import { Dices, Sparkles, RefreshCw, CheckCircle2, HeartHandshake, AlertCircle, ArrowRight } from 'lucide-react';
import { OptionAnalysis, RandomTiebreakerResult } from '../types';

interface RandomTiebreakerViewProps {
  options: OptionAnalysis[];
  dilemma: string;
  randomResult?: RandomTiebreakerResult;
  onUpdateResult?: (result: RandomTiebreakerResult) => void;
}

export const RandomTiebreakerView: React.FC<RandomTiebreakerViewProps> = ({
  options,
  dilemma,
  randomResult,
  onUpdateResult,
}) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipCount, setFlipCount] = useState(randomResult?.flipCount || 1);
  const [winner, setWinner] = useState<OptionAnalysis>(() => {
    if (randomResult && options.length > 0) {
      const found = options.find((o) => o.id === randomResult.winnerId || o.name === randomResult.winnerName);
      if (found) return found;
    }
    return options[0] || { id: 'opt_1', name: 'Option A', tagline: '', pros: [], cons: [], swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] } };
  });
  const [gutCheckReaction, setGutCheckReaction] = useState<'relief' | 'disappointment' | null>(null);

  const handleFlipAgain = () => {
    if (options.length < 2 || isFlipping) return;
    setIsFlipping(true);
    setGutCheckReaction(null);

    const nextCount = flipCount + 1;
    setFlipCount(nextCount);

    setTimeout(() => {
      // Pick random option different from current if multiple options
      const pool = options.length > 1 ? options.filter((o) => o.id !== winner.id) : options;
      const pick = pool[Math.floor(Math.random() * pool.length)] || options[0];
      setWinner(pick);
      setIsFlipping(false);

      if (onUpdateResult) {
        onUpdateResult({
          winnerId: pick.id,
          winnerName: pick.name,
          timestamp: Date.now(),
          flipCount: nextCount,
          gutCheckAdvice: `The coin landed on "${pick.name}". Assess your immediate physiological reaction.`,
          psychologicalInsight: 'Coin toss moments strip away analytical paralysis and expose gut intuition.',
          suggestedAction: `Spend the next 2 hours operating as though "${pick.name}" is your final, irreversible decision.`,
        });
      }
    }, 700);
  };

  const otherOptions = options.filter((o) => o.id !== winner.id);

  return (
    <div id="random-tiebreaker-view" className="max-w-3xl mx-auto space-y-6">
      {/* Top Card: Decisive Coin Toss Arena */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200/80 mb-4">
          <Dices className="w-3.5 h-3.5 text-amber-600" />
          <span>Random Tiebreaker Engine • Toss #{flipCount}</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 mb-2">
          Breaking the Deadlock
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto mb-8">
          When analysis paralysis sets in, random tiebreakers cut through overthinking. Look at the result below and observe your immediate emotional reaction.
        </p>

        {/* Animated Coin / Token */}
        <div className="my-6 flex flex-col items-center justify-center">
          <div
            className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-linear-to-br from-amber-400 via-amber-500 to-amber-600 shadow-lg border-4 border-amber-200 flex flex-col items-center justify-center text-stone-950 select-none transition-transform duration-500 ${
              isFlipping ? 'scale-90 rotate-180 animate-spin' : 'hover:scale-105'
            }`}
          >
            <div className="text-[10px] uppercase font-bold tracking-widest text-amber-950/70">
              Selected
            </div>
            <Dices className="w-8 h-8 my-1 text-stone-950" />
            <div className="text-xs font-extrabold px-2 text-center line-clamp-1 font-serif text-stone-900">
              {isFlipping ? '...' : winner.name}
            </div>
          </div>
        </div>

        {/* Result Callout */}
        <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 max-w-xl mx-auto mb-6">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
            The Tiebreaker Chooses
          </div>
          <div className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
            {winner.name}
          </div>
          {winner.tagline && (
            <p className="text-xs text-stone-600 mt-1 italic">
              "{winner.tagline}"
            </p>
          )}
        </div>

        {/* Action Button: Flip Again */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            id="flip-again-btn"
            onClick={handleFlipAgain}
            disabled={isFlipping}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-stone-900 text-white hover:bg-stone-800 active:scale-95 transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isFlipping ? 'animate-spin' : ''}`} />
            <span>{isFlipping ? 'Flipping...' : 'Flip Random Tiebreaker Again'}</span>
          </button>
        </div>
      </div>

      {/* The Famous Gut-Check Calibration Test */}
      <div className="bg-amber-50/70 rounded-2xl border border-amber-200 p-6 sm:p-7 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 mt-0.5">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold font-serif text-stone-900">
              The 3-Second Gut-Check Calibration
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 mt-1 leading-relaxed">
              Psychologist Sigmund Freud and Danish polymath Piet Hein noted the power of coin flips:
              <span className="italic block mt-1 text-stone-800 font-medium">
                "Not because it settles the question, but because in the brief moment the coin is in the air, you suddenly discover which side you are secretly hoping for."
              </span>
            </p>

            {/* Reaction Selector */}
            <div className="mt-5 pt-4 border-t border-amber-200/80">
              <div className="text-xs font-semibold text-stone-800 mb-2.5">
                When you saw "{winner.name}" selected, what was your initial reaction?
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  id="reaction-relief-btn"
                  onClick={() => setGutCheckReaction('relief')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    gutCheckReaction === 'relief'
                      ? 'bg-emerald-100 border-emerald-400 ring-2 ring-emerald-300'
                      : 'bg-white border-amber-200 hover:bg-white/90'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>I felt relief or excitement!</span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                    That means your subconscious was already leaning toward <strong>{winner.name}</strong>. Lock this decision in.
                  </p>
                </button>

                <button
                  type="button"
                  id="reaction-disappointment-btn"
                  onClick={() => setGutCheckReaction('disappointment')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    gutCheckReaction === 'disappointment'
                      ? 'bg-rose-100 border-rose-400 ring-2 ring-rose-300'
                      : 'bg-white border-amber-200 hover:bg-white/90'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>I felt disappointed or wanted to re-flip.</span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                    Disappointment is your subconscious saying you actually prefer{' '}
                    <strong>{otherOptions[0]?.name || 'the alternative'}</strong>! Trust that feeling.
                  </p>
                </button>
              </div>

              {gutCheckReaction && (
                <div className="mt-4 p-3.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between gap-3 animate-fade-in">
                  <div className="text-xs text-stone-800">
                    <strong className="text-stone-900">Your calibration conclusion:</strong>{' '}
                    {gutCheckReaction === 'relief' ? (
                      <span>
                        Proceed with conviction on <strong>{winner.name}</strong>. Stop deliberating and take step 1 today.
                      </span>
                    ) : (
                      <span>
                        Pivot immediately to <strong>{otherOptions[0]?.name || 'the other option'}</strong>. The coin did its job by revealing your hidden preference.
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-900 text-white shrink-0">
                    {gutCheckReaction === 'relief' ? 'Winner Confirmed' : 'Subconscious Revealed'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
