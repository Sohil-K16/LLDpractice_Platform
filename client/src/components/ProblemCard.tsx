import React from 'react';
import { Problem } from '../types';
import { ArrowRight, BookOpen, Layers } from 'lucide-react';

interface ProblemCardProps {
  problem: Problem;
  index?: number;
  onSelect: (problem: Problem) => void;
  onViewHistory: (problem: Problem) => void;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({ problem, onSelect, onViewHistory }) => {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-rule)] rounded-xl p-6 flex flex-col justify-between shadow-subtle hover:border-[var(--color-rule-strong)] transition-all">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-xs bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)]">
            {problem.difficulty}
          </span>
          <span className="text-[11px] text-[var(--color-ink-2)] flex items-center gap-1 font-mono">
            <BookOpen className="w-3 h-3 text-[var(--color-ink-2)]" />
            {problem.requirements?.length || 0} Req
          </span>
        </div>

        <h3 className="text-xl font-bold text-[var(--color-ink)] mb-2 tracking-tight">
          {problem.title}
        </h3>

        <p className="text-xs text-[var(--color-ink-2)] line-clamp-3 mb-4 leading-relaxed font-normal">
          {problem.description}
        </p>

        <div className="mb-5">
          <div className="text-[10px] font-mono uppercase font-bold text-[var(--color-ink-2)] mb-2 flex items-center gap-1">
            <Layers className="w-3 h-3 text-[var(--color-ink-2)]" />
            <span>Target Patterns</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {problem.concepts?.map((c, i) => (
              <span
                key={i}
                className="text-xs font-mono px-2 py-0.5 rounded-xs bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)]"
              >
                {c.split('(')[0].trim()}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-[var(--color-rule)] flex items-center justify-between gap-3">
        <button
          onClick={() => onViewHistory(problem)}
          className="text-xs text-[var(--color-ink-2)] hover:text-[var(--color-ink)] py-1.5 px-2.5 rounded-md hover:bg-[var(--color-paper-2)] transition-colors font-medium"
        >
          History
        </button>

        <button
          onClick={() => onSelect(problem)}
          className="inline-flex items-center gap-1.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs font-semibold px-4 py-2 rounded-md shadow-subtle transition-all"
        >
          <span>Solve</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
