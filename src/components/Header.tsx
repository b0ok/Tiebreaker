import React from 'react';
import { History, PlusCircle, Sparkles, HelpCircle } from 'lucide-react';
import { ScaleWithSnakeIcon } from './ScaleWithSnakeIcon';

interface HeaderProps {
  onNewDecision: () => void;
  onOpenHistory: () => void;
  savedCount: number;
  hasActiveDecision: boolean;
  onSelectPreset: (presetId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNewDecision,
  onOpenHistory,
  savedCount,
  hasActiveDecision,
}) => {
  return (
    <header id="main-header" className="border-b border-stone-200 bg-white/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-white shadow-sm ring-1 ring-stone-900/10">
            <ScaleWithSnakeIcon
              className="w-6 h-6"
              snakeColor="#F59E0B"
              snakeBackColor="#D97706"
              scaleColor="#FAFAF9"
              cutoutColor="#1C1917"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg tracking-tight text-stone-900 font-serif">The Tiebreaker</span>
              <span className="hidden sm:inline-flex items-center text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                Decision Intelligence
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">Resolve dilemmas with pros & cons, tables, and SWOT</p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {hasActiveDecision && (
            <button
              id="header-new-decision-btn"
              onClick={onNewDecision}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors cursor-pointer"
              title="Start fresh with a new decision"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Decision</span>
            </button>
          )}

          <button
            id="header-history-btn"
            onClick={onOpenHistory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg shadow-xs transition-colors cursor-pointer"
            title="View past decisions"
          >
            <History className="w-3.5 h-3.5 text-stone-500" />
            <span>History</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-stone-900 text-white">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
