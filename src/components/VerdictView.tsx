import React, { useState } from 'react';
import { Award, ShieldAlert, Sparkles, HelpCircle, ArrowRight, Dices, RefreshCw, Send, CheckCircle } from 'lucide-react';
import { DecisionResult } from '../types';

interface VerdictViewProps {
  decision: DecisionResult;
  onAskQuestion: (question: string) => Promise<string>;
}

export const VerdictView: React.FC<VerdictViewProps> = ({ decision, onAskQuestion }) => {
  const { verdict, options, dilemma } = decision;

  // State for What-If questions
  const [whatIfInput, setWhatIfInput] = useState('');
  const [whatIfLoading, setWhatIfLoading] = useState(false);
  const [whatIfHistory, setWhatIfHistory] = useState<Array<{ q: string; a: string }>>([]);

  // State for Deadlock Coin Flip
  const [coinFlipping, setCoinFlipping] = useState(false);
  const [coinResult, setCoinResult] = useState<string | null>(null);

  if (!verdict) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center max-w-xl mx-auto my-6 shadow-xs">
        <Award className="w-10 h-10 mx-auto text-amber-500 mb-3" />
        <h3 className="font-bold text-lg text-stone-900 font-serif">Verdict Framework</h3>
        <p className="text-xs text-stone-600 mt-1 leading-relaxed max-w-md mx-auto">
          The clear verdict for this dilemma is ready to load on demand.
        </p>
      </div>
    );
  }

  const handleAskWhatIf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatIfInput.trim() || whatIfLoading) return;

    const query = whatIfInput.trim();
    setWhatIfLoading(true);
    setWhatIfInput('');

    try {
      const answer = await onAskQuestion(query);
      setWhatIfHistory((prev) => [...prev, { q: query, a: answer }]);
    } catch (err) {
      setWhatIfHistory((prev) => [
        ...prev,
        {
          q: query,
          a: 'If this factor increases in importance, run a low-stakes 1-week experiment to verify its true impact before locking in your choice.',
        },
      ]);
    } finally {
      setWhatIfLoading(false);
    }
  };

  const handleFlipCoin = () => {
    if (options.length < 2) return;
    setCoinFlipping(true);
    setCoinResult(null);

    setTimeout(() => {
      // Pick random option
      const randomOpt = options[Math.floor(Math.random() * options.length)];
      setCoinResult(randomOpt.name);
      setCoinFlipping(false);
    }, 900);
  };

  return (
    <div id="verdict-deep-dive-section" className="space-y-6">
      {/* Primary Verdict Card */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 border border-stone-800 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400 text-stone-950">
            <Award className="w-3.5 h-3.5" />
            <span>The Tiebreaker Recommendation</span>
          </span>
          <span className="text-xs text-stone-400 font-mono">
            Confidence: <strong className="text-white">{verdict.confidenceScore}%</strong>
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-white mb-3">
          {verdict.headline}
        </h3>

        <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-3xl">
          {verdict.rationale}
        </p>

        {/* The 1 Gut Check Question */}
        <div className="mt-6 p-4 bg-stone-800/80 rounded-xl border border-stone-700">
          <div className="flex items-start gap-2.5">
            <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider block mb-1">
                The Decisive Gut-Check
              </span>
              <p className="text-sm text-stone-100 font-medium italic">
                "{verdict.tiebreakerQuestion}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Deep Dive: Blindspot vs Reality Test */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overlooked Blindspot */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 text-rose-700">
              <ShieldAlert className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                The Overlooked Blindspot
              </h4>
            </div>
            <h5 className="font-semibold text-sm text-stone-900 mb-2">
              The Cognitive Trap in This Dilemma:
            </h5>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {verdict.overlookedBlindspot}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500 italic">
            Cognitive bias reminder: Defaulting to inaction is also an active decision with real opportunity costs.
          </div>
        </div>

        {/* Immediate Next Step */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 text-emerald-700">
              <CheckCircle className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Immediate 24-Hour Reality Test
              </h4>
            </div>
            <h5 className="font-semibold text-sm text-stone-900 mb-2">
              Micro-experiment before full commitment:
            </h5>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {verdict.immediateNextStep}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500 italic">
            Never make an irreversible leap when a 48-hour low-risk simulation is available.
          </div>
        </div>
      </div>

      {/* When to pick the alternative */}
      {verdict.whenToPickOther && verdict.whenToPickOther.length > 0 && (
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 shadow-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
            Inversion Check: Under What Conditions Should You Pick The Other Option?
          </h4>
          <div className="space-y-2.5">
            {verdict.whenToPickOther.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-white rounded-xl border border-stone-200 text-xs flex items-start gap-2.5"
              >
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-stone-900 font-semibold">Choose {item.optionName} instead if: </strong>
                  <span className="text-stone-600">{item.condition}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive What-If Query Section */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Stress-Test with a "What-If" Question
          </h4>
        </div>
        <p className="text-xs text-stone-500 mb-4">
          Ask how a new variable or personal condition shifts the balance (e.g. "What if I hate remote work?" or "What if I have to move in 1 year?").
        </p>

        <form onSubmit={handleAskWhatIf} className="flex gap-2">
          <input
            type="text"
            id="what-if-input"
            value={whatIfInput}
            onChange={(e) => setWhatIfInput(e.target.value)}
            placeholder="Ask a what-if question..."
            disabled={whatIfLoading}
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:border-stone-800 outline-none"
          />
          <button
            type="submit"
            id="ask-what-if-btn"
            disabled={whatIfLoading || !whatIfInput.trim()}
            className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {whatIfLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>Ask</span>
          </button>
        </form>

        {/* What-if history */}
        {whatIfHistory.length > 0 && (
          <div className="mt-4 space-y-3 pt-4 border-t border-stone-100">
            {whatIfHistory.map((item, i) => (
              <div key={i} className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs">
                <div className="font-semibold text-stone-900 mb-1">
                  Q: {item.q}
                </div>
                <div className="text-stone-700 leading-relaxed">
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Deadlock Breaker (Psychological Coin Flip) */}
      <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Dices className="w-4 h-4 text-amber-700" />
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Still Deadlocked at 50/50? The Psychological Coin Flip
              </h4>
            </div>
            <p className="text-xs text-amber-900/80 mt-1 max-w-xl leading-relaxed">
              When a coin is flipped between two options, your brain doesn't just wait for the result—it secretly reveals which side you are secretly hoping it lands on.
            </p>
          </div>

          <button
            id="flip-coin-btn"
            onClick={handleFlipCoin}
            disabled={coinFlipping}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer shadow-xs transition-colors shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${coinFlipping ? 'animate-spin' : ''}`} />
            <span>{coinFlipping ? 'Flipping...' : 'Flip Tiebreaker Coin'}</span>
          </button>
        </div>

        {coinResult && (
          <div className="mt-4 p-4 bg-white rounded-xl border border-amber-300 text-xs flex items-center justify-between animate-fade-in">
            <div>
              <span className="text-[11px] text-stone-500 block">The coin landed on:</span>
              <span className="text-base font-bold font-serif text-stone-900">{coinResult}</span>
            </div>
            <p className="text-[11px] text-stone-600 italic max-w-xs text-right">
              Did you feel relieved, or did your heart wish it was the other choice? That feeling is your answer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
