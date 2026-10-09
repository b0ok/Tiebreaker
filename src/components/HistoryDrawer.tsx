import React from 'react';
import { X, Trash2, Calendar, Award, ArrowUpRight } from 'lucide-react';
import { DecisionResult } from '../types';
import { ScaleWithSnakeIcon } from './ScaleWithSnakeIcon';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedDecisions: DecisionResult[];
  onSelectDecision: (decision: DecisionResult) => void;
  onDeleteDecision: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedDecisions,
  onSelectDecision,
  onDeleteDecision,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-in">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ScaleWithSnakeIcon
              className="w-4 h-4 text-stone-800"
              snakeColor="#D97706"
              snakeBackColor="#B45309"
              scaleColor="#44403C"
              cutoutColor="#FFFFFF"
            />
            <h3 className="font-semibold text-stone-900 text-sm font-serif">
              Decision History
            </h3>
            <span className="text-xs text-stone-500 font-mono">({savedDecisions.length})</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-3">
          {savedDecisions.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-xs">
              <p>No saved decisions yet.</p>
              <p className="mt-1">Any dilemma you analyze will be automatically saved here.</p>
            </div>
          ) : (
            savedDecisions.map((dec) => {
              const formattedDate = new Date(dec.timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={dec.id}
                  className="p-4 rounded-xl border border-stone-200 hover:border-stone-400 hover:shadow-xs bg-stone-50/50 hover:bg-white transition-all group relative cursor-pointer"
                  onClick={() => {
                    onSelectDecision(dec);
                    onClose();
                  }}
                >
                  <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1.5">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {formattedDate}
                    </span>
                    <span className="inline-flex items-center gap-1 font-medium text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-full text-[10px]">
                      <Award className="w-2.5 h-2.5" />
                      {dec.verdict.winnerName}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-semibold text-stone-900 line-clamp-2 leading-snug">
                    {dec.dilemma}
                  </h4>

                  <p className="text-[11px] text-stone-600 line-clamp-2 mt-1.5">
                    {dec.verdict.headline}
                  </p>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-stone-100">
                    <span className="text-[10px] text-stone-400 font-mono">
                      {dec.options.length} options evaluated
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteDecision(dec.id);
                        }}
                        className="p-1 text-stone-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                        title="Delete decision"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <span className="text-xs text-stone-900 font-medium inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        Open <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {savedDecisions.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
            >
              Clear All History
            </button>
            <span className="text-[11px] text-stone-500">
              Stored safely in local browser
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
