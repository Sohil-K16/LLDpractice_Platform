import React from 'react';
import { Evaluation, Problem } from '../types';
import { ScoreCard } from '../components/ScoreCard';
import { CriterionFeedbackCard } from '../components/CriterionFeedbackCard';
import { ActionableImprovements } from '../components/ActionableImprovements';
import { ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';

interface EvaluationPageProps {
  evaluation: Evaluation;
  problem: Problem;
  onRetry: () => void;
  onBack: () => void;
}

export const EvaluationPage: React.FC<EvaluationPageProps> = ({
  evaluation,
  onRetry,
  onBack,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[var(--color-paper)]">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4 pb-3 border-b border-[var(--color-rule)]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-ink-2)] hover:text-[var(--color-ink)] transition-colors py-1 px-2 rounded hover:bg-[var(--color-paper-2)]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Challenges</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs font-semibold shadow-subtle transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Submit Another Attempt</span>
          </button>
        </div>
      </div>

      {/* Hero Score Card */}
      <ScoreCard
        score={evaluation.overallScore}
        evaluatorType={evaluation.evaluatorType}
        model={evaluation.model}
        summary={evaluation.feedbackSummary}
      />

      {/* Actionable Redo Tasks */}
      {evaluation.feedbackActions && evaluation.feedbackActions.length > 0 && (
        <ActionableImprovements
          actions={evaluation.feedbackActions}
          onRetry={onRetry}
        />
      )}

      {/* 6 Rubric Criteria Breakdown */}
      <div>
        <div className="mb-4">
          <h3 className="text-xl font-bold text-[var(--color-ink)] flex items-center gap-2 tracking-tight">
            <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
            <span>6-Dimension Rubric Breakdown</span>
          </h3>
          <p className="text-xs text-[var(--color-ink-2)] mt-0.5">
            Objective assessment across all six Low-Level Design dimensions (100 points total)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {evaluation.criterionResults?.map((criterion, idx) => (
            <CriterionFeedbackCard key={criterion.id} criterion={criterion} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};
