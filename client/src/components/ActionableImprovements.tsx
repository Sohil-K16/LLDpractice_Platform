import React from 'react';
import { FeedbackAction } from '../types';
import { RefreshCw, Wrench, CheckCircle2 } from 'lucide-react';

interface ActionableImprovementsProps {
  actions: FeedbackAction[];
  onRetry: () => void;
}

export const ActionableImprovements: React.FC<ActionableImprovementsProps> = ({ actions, onRetry }) => {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-rule)] rounded-xl p-6 shadow-subtle">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-[var(--tint-lavender)] text-[var(--color-accent)]">
              <Wrench className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-[var(--color-ink)]">Actionable Redo Tasks</h3>
          </div>
          <p className="text-xs text-[var(--color-ink-2)]">
            Concrete architectural refactors to implement in your next attempt for higher rubric scoring
          </p>
        </div>

        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs font-semibold px-4 py-2 rounded-md shadow-subtle transition-all shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refactor & Retry Attempt</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action, i) => (
          <div
            key={i}
            className="p-4 bg-[var(--color-paper-2)] border border-[var(--color-rule)] rounded-md flex flex-col justify-between hover:border-[var(--color-rule-strong)] transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded-xs bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-rule)]">
                  {action.category || 'Refactor'}
                </span>
                <span className="text-[11px] text-[var(--color-ink-2)] font-mono">Task #{i + 1}</span>
              </div>
              <h4 className="font-bold text-[var(--color-ink)] text-xs mb-1.5">{action.title}</h4>
              <p className="text-xs text-[var(--color-ink-2)] leading-relaxed">{action.description}</p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[var(--color-rule)] flex items-center text-[11px] text-[var(--color-accent)] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              <span>Target for Next Attempt</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
