import React from 'react';
import { CriterionResult } from '../types';
import { CheckCircle, AlertTriangle, Lightbulb, ShieldCheck } from 'lucide-react';

interface CriterionFeedbackCardProps {
  criterion: CriterionResult;
  index?: number;
}

export const CriterionFeedbackCard: React.FC<CriterionFeedbackCardProps> = ({ criterion, index = 0 }) => {
  let parsedEvidence: string[] = [];
  try {
    if (typeof criterion.evidence === 'string' && criterion.evidence.startsWith('[')) {
      parsedEvidence = JSON.parse(criterion.evidence);
    } else if (typeof criterion.evidence === 'string') {
      parsedEvidence = [criterion.evidence];
    }
  } catch {
    parsedEvidence = [criterion.evidence];
  }

  const percentage = Math.round((criterion.score / criterion.maxScore) * 100);

  const tintStyles = [
    { bg: 'bg-[var(--tint-mint)]', border: 'border-[var(--tint-mint-border)]', text: 'text-[var(--tint-mint-text)]' },
    { bg: 'bg-[var(--tint-peach)]', border: 'border-[var(--tint-peach-border)]', text: 'text-[var(--tint-peach-text)]' },
    { bg: 'bg-[var(--tint-sky)]', border: 'border-[var(--tint-sky-border)]', text: 'text-[var(--tint-sky-text)]' },
    { bg: 'bg-[var(--tint-lavender)]', border: 'border-[var(--tint-lavender-border)]', text: 'text-[var(--tint-lavender-text)]' },
    { bg: 'bg-[var(--tint-rose)]', border: 'border-[var(--tint-rose-border)]', text: 'text-[var(--tint-rose-text)]' },
    { bg: 'bg-[var(--color-paper-2)]', border: 'border-[var(--color-rule)]', text: 'text-[var(--color-ink)]' },
  ];

  const theme = tintStyles[index % tintStyles.length];

  return (
    <div className={`${theme.bg} border ${theme.border} rounded-xl p-5 flex flex-col justify-between shadow-subtle`}>
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className={`font-bold text-sm ${theme.text}`}>{criterion.criterion}</h3>
            <div className="text-[11px] text-[var(--color-ink-2)] flex items-center gap-1 mt-0.5 font-mono">
              <ShieldCheck className="w-3 h-3 text-[var(--color-ink-2)]" />
              <span>Confidence: {Math.round(criterion.confidence * 100)}%</span>
            </div>
          </div>
          <div className="text-right shrink-0 bg-[var(--color-surface)] px-2 py-0.5 rounded-xs border border-[var(--color-rule)]">
            <span className="text-sm font-mono font-black text-[var(--color-ink)]">
              {criterion.score}
            </span>
            <span className="text-[11px] text-[var(--color-ink-2)] font-mono"> / {criterion.maxScore}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-[var(--color-ink)] transition-all duration-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Observed Evidence Callout */}
        {parsedEvidence.length > 0 && (
          <div className="mb-3">
            <div className="text-[10px] font-mono uppercase font-bold text-[var(--color-ink-2)] mb-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              <span>Observed Evidence</span>
            </div>
            <ul className="space-y-1 text-xs text-[var(--color-ink)]">
              {parsedEvidence.map((ev, idx) => (
                <li key={idx} className="bg-[var(--color-surface)] px-2.5 py-1.5 rounded-md border border-[var(--color-rule)] leading-relaxed">
                  {ev}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Concern Box */}
        {criterion.concern && (
          <div className="mb-2.5 p-2.5 bg-[var(--color-surface)] border border-rose-200 rounded-md">
            <div className="text-[10px] font-mono uppercase font-bold text-rose-600 flex items-center gap-1 mb-0.5">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              <span>Architectural Concern</span>
            </div>
            <p className="text-xs text-[var(--color-ink)] leading-relaxed">
              {criterion.concern}
            </p>
          </div>
        )}

        {/* Recommendation Box */}
        {criterion.suggestion && (
          <div className="p-2.5 bg-[var(--color-surface)] border border-[var(--color-rule)] rounded-md">
            <div className="text-[10px] font-mono uppercase font-bold text-[var(--color-accent)] flex items-center gap-1 mb-0.5">
              <Lightbulb className="w-3 h-3 shrink-0" />
              <span>Recommendation</span>
            </div>
            <p className="text-xs text-[var(--color-ink)] leading-relaxed">
              {criterion.suggestion}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
