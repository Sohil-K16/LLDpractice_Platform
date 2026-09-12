import React from 'react';
import { Sparkles, Cpu } from 'lucide-react';

interface ScoreCardProps {
  score: number;
  evaluatorType: 'RULE_BASED' | 'AI' | 'HYBRID';
  model: string;
  summary: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ score, evaluatorType, model, summary }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (val: number) => {
    if (val >= 80) return 'stroke-emerald-600 text-emerald-700';
    if (val >= 60) return 'stroke-[var(--color-accent)] text-[var(--color-accent)]';
    return 'stroke-amber-600 text-amber-700';
  };

  return (
    <div className="bg-[var(--tint-yellow-bold)] border border-[var(--tint-yellow-border)] rounded-xl p-7 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-6 text-[var(--tint-yellow-text)]">
      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-xs bg-[var(--color-surface)] text-[var(--tint-yellow-text)] border border-[var(--tint-yellow-border)]">
            Evaluation Report
          </span>
          <span className="text-xs px-2 py-0.5 rounded-xs bg-[var(--color-surface)] text-[var(--color-ink)] font-mono font-medium border border-[var(--tint-yellow-border)] flex items-center gap-1">
            {evaluatorType === 'AI' ? <Sparkles className="w-3 h-3 text-[var(--color-accent)]" /> : <Cpu className="w-3 h-3 text-[var(--color-accent)]" />}
            {evaluatorType === 'AI' ? 'LLM Rubric Evaluator' : evaluatorType === 'HYBRID' ? 'Hybrid Engine' : 'Deterministic Rubric'}
          </span>
          <span className="text-[11px] text-[var(--tint-yellow-text)] font-mono opacity-80">({model})</span>
        </div>

        <h2 className="text-2xl font-bold text-[var(--color-ink)] tracking-tight">
          {score >= 80
            ? 'Exceptional Low-Level Design!'
            : score >= 60
            ? 'Solid Architecture with Refactor Potential'
            : 'Structural Refactoring Recommended'}
        </h2>

        <p className="text-xs sm:text-sm text-[var(--tint-yellow-text)] leading-relaxed max-w-2xl font-normal">
          {summary}
        </p>
      </div>

      {/* Circular Gauge */}
      <div className="relative flex items-center justify-center shrink-0 bg-[var(--color-surface)] p-3 rounded-xl border border-[var(--tint-yellow-border)] shadow-subtle">
        <svg className="w-28 h-28 -rotate-90 transform">
          <circle
            cx="56"
            cy="56"
            r={radius}
            className="stroke-[var(--color-paper-2)]"
            strokeWidth="9"
            fill="transparent"
          />
          <circle
            cx="56"
            cy="56"
            r={radius}
            className={`${getScoreColor(score)} transition-all duration-700 ease-out`}
            strokeWidth="9"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-2xl font-mono font-black text-[var(--color-ink)]">{score}</span>
          <span className="text-[9px] text-[var(--color-ink-2)] uppercase font-mono font-bold">/ 100</span>
        </div>
      </div>
    </div>
  );
};
