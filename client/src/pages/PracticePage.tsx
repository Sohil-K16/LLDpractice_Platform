import React, { useState, useEffect } from 'react';
import { Problem, Attempt, Evaluation } from '../types';
import { SolutionEditor } from '../components/SolutionEditor';
import { createAttempt, submitSolution, SubmissionPayload } from '../services/api';
import {
  ArrowLeft,
  AlertTriangle,
  Lightbulb,
  FileCheck2,
  Layers,
} from 'lucide-react';

interface PracticePageProps {
  problem: Problem;
  existingAttempt?: Attempt | null;
  onBack: () => void;
  onEvaluationComplete: (attemptId: string, evaluation: Evaluation) => void;
}

export const PracticePage: React.FC<PracticePageProps> = ({
  problem,
  existingAttempt,
  onBack,
  onEvaluationComplete,
}) => {
  const [currentAttempt, setCurrentAttempt] = useState<Attempt | null>(existingAttempt || null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      if (!currentAttempt) {
        try {
          const newAttempt = await createAttempt(problem.id);
          setCurrentAttempt(newAttempt);
        } catch (err: any) {
          console.error('Failed to create attempt:', err);
        }
      }
    }
    init();
  }, [problem.id]);

  const handleSubmit = async (payload: SubmissionPayload) => {
    if (!currentAttempt) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      const res = await submitSolution(currentAttempt.id, payload);
      onEvaluationComplete(res.attemptId, res.evaluation);
    } catch (err: any) {
      setSubmitError(err.message || 'Submission failed. Please check inputs.');
      setIsSubmitting(false);
    }
  };

  const lastSubmission = currentAttempt?.submissions?.[0];

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 bg-[var(--color-paper)]">
      {/* Top Breadcrumb Bar */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-3 border-b border-[var(--color-rule)]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-ink-2)] hover:text-[var(--color-ink)] transition-colors py-1 px-2 rounded hover:bg-[var(--color-paper-2)]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Challenges</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[var(--color-ink-2)] font-mono">
            Attempt {currentAttempt?.id?.substring(0, 8) || '...'}
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-xs bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)] font-semibold">
            {currentAttempt?.status || 'DRAFT'}
          </span>
        </div>
      </div>

      {submitError && (
        <div className="mb-5 p-3 rounded-md bg-[var(--tint-rose)] border border-[var(--tint-rose-border)] text-[var(--tint-rose-text)] text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{submitError}</span>
        </div>
      )}

      {/* 2-Column Workbench Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Problem Specs Drawer (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-[var(--color-surface)] border border-[var(--color-rule)] rounded-xl p-6 shadow-subtle">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-xs bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)]">
                {problem.difficulty}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-ink)] tracking-tight mb-2">
              {problem.title}
            </h1>
            <p className="text-xs text-[var(--color-ink-2)] leading-relaxed mb-5 font-normal">
              {problem.description}
            </p>

            {/* Functional Requirements */}
            <div className="mb-5">
              <h3 className="text-xs font-mono font-bold text-[var(--color-ink)] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                <span>Functional Requirements</span>
              </h3>
              <ul className="space-y-1.5">
                {problem.requirements?.map((req, i) => (
                  <li key={i} className="text-xs text-[var(--color-ink)] flex items-start gap-2 bg-[var(--color-paper)] p-2 rounded-md border border-[var(--color-rule)]">
                    <span className="w-3.5 h-3.5 rounded-xs bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)] flex items-center justify-center shrink-0 text-[10px] font-mono font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-snug">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Constraints in Tint Box */}
            <div className="mb-5">
              <h3 className="text-xs font-mono font-bold text-[var(--color-ink)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Constraints & Concurrency</span>
              </h3>
              <ul className="space-y-1.5">
                {problem.constraints?.map((con, i) => (
                  <li key={i} className="text-xs text-[var(--tint-peach-text)] flex items-start gap-2 bg-[var(--tint-peach)] p-2 rounded-md border border-[var(--tint-peach-border)] leading-snug">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--tint-peach-text)] shrink-0 mt-1.5" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Target Concepts */}
            <div className="mb-5">
              <h3 className="text-xs font-mono font-bold text-[var(--color-ink)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>Target Patterns</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {problem.concepts?.map((con, i) => (
                  <span
                    key={i}
                    className="text-xs font-mono px-2 py-0.5 rounded-xs bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)] font-medium"
                  >
                    {con}
                  </span>
                ))}
              </div>
            </div>

            {/* Evaluation Tips Callout */}
            {problem.hints && problem.hints.length > 0 && (
              <div className="p-3.5 rounded-md bg-[var(--color-paper-2)] border border-[var(--color-rule)]">
                <h3 className="text-xs font-mono font-bold text-[var(--color-accent)] mb-1.5 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                  <span>Evaluation Tips</span>
                </h3>
                <ul className="space-y-1 text-xs text-[var(--color-ink-2)]">
                  {problem.hints.map((hint, i) => (
                    <li key={i} className="leading-snug">• {hint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Solution Editor (8 Cols) */}
        <div className="lg:col-span-8">
          <SolutionEditor
            problemSlug={problem.slug}
            initialValues={{
              assumptions: lastSubmission?.assumptions,
              classes: lastSubmission?.classes,
              relationships: lastSubmission?.relationships,
              flows: lastSubmission?.flows,
              designExplanation: lastSubmission?.designExplanation,
              mermaidDiagram: lastSubmission?.mermaidDiagram,
            }}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};
