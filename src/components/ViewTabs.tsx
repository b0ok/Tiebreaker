import React, { useState } from 'react';
import { Scale, Table, Compass, Award, Copy, Check, Dices } from 'lucide-react';
import { TabView, DecisionResult, TiebreakerMethod } from '../types';

interface ViewTabsProps {
  activeTab: TabView;
  onTabChange: (tab: TabView) => void;
  decision: DecisionResult;
  isLoadingMethod?: boolean;
}

export const ViewTabs: React.FC<ViewTabsProps> = ({
  activeTab,
  onTabChange,
  decision,
  isLoadingMethod = false,
}) => {
  const [copied, setCopied] = useState(false);

  const isMethodLoaded = (methodId: TiebreakerMethod) => {
    return decision.loadedMethods?.includes(methodId);
  };

  const getBadge = (methodId: TiebreakerMethod) => {
    const loaded = isMethodLoaded(methodId);
    if (!loaded) return '+ Load';

    switch (methodId) {
      case 'pros-cons': {
        const count = decision.options.reduce(
          (acc, opt) => acc + (opt.pros?.length || 0) + (opt.cons?.length || 0),
          0
        );
        return count > 0 ? `${count} pts` : 'Loaded';
      }
      case 'comparison': {
        const count = decision.comparisonCriteria?.length || 0;
        return count > 0 ? `${count} criteria` : 'Loaded';
      }
      case 'swot':
        return '2x2 Grid';
      case 'verdict':
        return decision.verdict ? `${decision.verdict.confidenceScore}% Conf.` : 'Loaded';
      case 'random':
        return decision.randomResult ? `Toss #${decision.randomResult.flipCount}` : 'Instant';
      default:
        return undefined;
    }
  };

  const tabs: { id: TabView; label: string; icon: React.ReactNode }[] = [
    {
      id: 'pros-cons',
      label: 'Pros & Cons',
      icon: <Scale className="w-4 h-4" />,
    },
    {
      id: 'comparison',
      label: 'Comparison Matrix',
      icon: <Table className="w-4 h-4" />,
    },
    {
      id: 'swot',
      label: 'SWOT Analysis',
      icon: <Compass className="w-4 h-4" />,
    },
    {
      id: 'verdict',
      label: 'Clear Verdict',
      icon: <Award className="w-4 h-4" />,
    },
    {
      id: 'random',
      label: 'RandomTieBreaker',
      icon: <Dices className="w-4 h-4" />,
    },
  ];

  const handleCopySummary = () => {
    let md = `# The Tiebreaker Analysis: ${decision.dilemma}\n\n`;
    md += `**Summary:** ${decision.summary}\n\n`;

    if (decision.verdict) {
      md += `## 🏆 The Verdict: ${decision.verdict.headline}\n`;
      md += `${decision.verdict.rationale}\n\n`;
      md += `*Gut-check question:* "${decision.verdict.tiebreakerQuestion}"\n`;
      md += `*Next action:* ${decision.verdict.immediateNextStep}\n\n`;
    }

    if (decision.randomResult) {
      md += `## 🎲 RandomTieBreaker Decision: ${decision.randomResult.winnerName}\n`;
      md += `${decision.randomResult.gutCheckAdvice}\n\n`;
    }

    const hasProsCons = decision.options.some(
      (o) => (o.pros && o.pros.length > 0) || (o.cons && o.cons.length > 0)
    );
    if (hasProsCons) {
      md += `## ⚖️ Pros & Cons Breakdown\n`;
      decision.options.forEach((opt) => {
        md += `### ${opt.name} ${opt.tagline ? `(${opt.tagline})` : ''}\n`;
        if (opt.pros && opt.pros.length > 0) {
          md += `**Pros:**\n`;
          opt.pros.forEach((p) => {
            md += `- [${p.impact.toUpperCase()}] ${p.text}${p.explanation ? `: ${p.explanation}` : ''}\n`;
          });
        }
        if (opt.cons && opt.cons.length > 0) {
          md += `**Cons:**\n`;
          opt.cons.forEach((c) => {
            md += `- [${c.severity.toUpperCase()}] ${c.text}${c.mitigation ? ` (Mitigation: ${c.mitigation})` : ''}\n`;
          });
        }
        md += `\n`;
      });
    }

    if (decision.comparisonCriteria && decision.comparisonCriteria.length > 0) {
      md += `## 📊 Comparison Matrix\n`;
      md += `| Criterion | Weight | ${decision.options.map((o) => o.name).join(' | ')} |\n`;
      md += `| --- | --- | ${decision.options.map(() => '---').join(' | ')} |\n`;
      decision.comparisonCriteria.forEach((crit) => {
        const scores = decision.options.map((o) => `${crit.scores[o.id] || '-'}/10`).join(' | ');
        md += `| ${crit.name} | ${crit.weight}/5 | ${scores} |\n`;
      });
    }

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-stone-200 pb-3 mb-6">
      {/* Navigation tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const badge = getBadge(tab.id);
          const isLoaded = isMethodLoaded(tab.id);

          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              disabled={isLoadingMethod}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-stone-900 text-white shadow-xs'
                  : isLoaded
                  ? 'text-stone-700 hover:text-stone-950 hover:bg-stone-100/80 bg-white border border-stone-200/80'
                  : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100/60 border border-dashed border-stone-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive
                      ? 'bg-stone-800 text-stone-300'
                      : isLoaded
                      ? 'bg-stone-100 text-stone-600'
                      : 'bg-amber-100/80 text-amber-800 font-semibold'
                  }`}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Copy/Export action */}
      <button
        id="copy-analysis-btn"
        onClick={handleCopySummary}
        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-stone-700 hover:text-stone-950 hover:bg-stone-50 text-xs font-medium transition-colors cursor-pointer self-end sm:self-center shrink-0"
        title="Copy structured decision markdown to clipboard"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700 font-semibold">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-stone-500" />
            <span>Copy Summary</span>
          </>
        )}
      </button>
    </div>
  );
};
