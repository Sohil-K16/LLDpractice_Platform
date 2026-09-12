import React, { useEffect, useState } from 'react';
import { Problem, Attempt } from '../types';
import { fetchProblems, fetchAttemptsForProblem } from '../services/api';
import {
  History,
  TrendingUp,
  ArrowRight,
  Calendar,
  Layers,
} from 'lucide-react';

interface HistoryPageProps {
  initialProblemId?: string;
  onSelectAttempt: (attempt: Attempt, problem: Problem) => void;
  onNewAttempt: (problem: Problem) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  initialProblemId,
  onSelectAttempt,
  onNewAttempt,
}) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblemId, setSelectedProblemId] = useState<string>(initialProblemId || '');
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProblems() {
      try {
        const data = await fetchProblems();
        setProblems(data);
        if (!selectedProblemId && data.length > 0) {
          setSelectedProblemId(data[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProblems();
  }, []);

  useEffect(() => {
    async function loadAttempts() {
      if (!selectedProblemId) return;
      try {
        setLoading(true);
        const data = await fetchAttemptsForProblem(selectedProblemId);
        setAttempts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAttempts();
  }, [selectedProblemId]);

  const activeProblem = problems.find((p) => p.id === selectedProblemId);

  const completedAttempts = attempts.filter(
    (a) => a.status === 'COMPLETED' && a.evaluations && a.evaluations.length > 0
  );

  const rubricNames = [
    'Requirements Understanding',
    'Class Responsibilities & SRP',
    'Coupling & Interfaces',
    'Extensibility & Design Patterns',
    'Edge Cases & Testability',
    'Explanation & Trade-offs',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[var(--color-paper)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[var(--color-rule)]">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-ink)] flex items-center gap-2 tracking-tight">
            <History className="w-5 h-5 text-[var(--color-accent)]" />
            <span>Attempt History & Progression</span>
          </h1>
          <p className="text-xs text-[var(--color-ink-2)] mt-0.5">
            Track how your Low-Level Design scores improve across refactoring attempts
          </p>
        </div>

        {activeProblem && (
          <button
            onClick={() => onNewAttempt(activeProblem)}
            className="inline-flex items-center gap-1.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs font-semibold px-3.5 py-1.5 rounded-md shadow-subtle transition-all"
          >
            <span>Start Fresh Attempt</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Pill Tabs for Problem Selection */}
      <div className="flex overflow-x-auto gap-2 pb-1">
        {problems.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedProblemId(p.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
              selectedProblemId === p.id
                ? 'bg-[var(--color-ink)] text-white border-[var(--color-ink)] shadow-subtle'
                : 'bg-[var(--color-surface)] text-[var(--color-ink-2)] border-[var(--color-rule)] hover:bg-[var(--color-paper-2)]'
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Main Content */}
      {completedAttempts.length === 0 ? (
        <div className="p-12 text-center bg-[var(--color-surface)] border border-[var(--color-rule)] rounded-xl">
          <Layers className="w-10 h-10 text-[var(--color-ink-2)] opacity-40 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[var(--color-ink)] mb-1">No completed attempts yet</h3>
          <p className="text-xs text-[var(--color-ink-2)] mb-5 max-w-sm mx-auto">
            Submit your first design solution for {activeProblem?.title} to see rubrics and iterative score tracking.
          </p>
          {activeProblem && (
            <button
              onClick={() => onNewAttempt(activeProblem)}
              className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs font-semibold px-4 py-2 rounded-md shadow-subtle transition-all"
            >
              Solve Challenge Now
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Progression Table */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-rule)] rounded-xl overflow-hidden shadow-subtle">
            <div className="px-6 py-3.5 bg-[var(--color-paper-2)] border-b border-[var(--color-rule)] flex items-center justify-between">
              <h3 className="font-bold text-[var(--color-ink)] text-xs flex items-center gap-1.5 font-mono uppercase tracking-wider">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Rubric Progression Table</span>
              </h3>
              <span className="text-xs text-[var(--color-ink-2)] font-mono">
                {completedAttempts.length} Attempt{completedAttempts.length > 1 ? 's' : ''} Recorded
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--color-rule)] bg-[var(--color-paper-2)] text-[var(--color-ink-2)] font-mono">
                    <th className="py-2.5 px-6 font-semibold">Rubric Dimension</th>
                    {completedAttempts.map((att, idx) => (
                      <th key={att.id} className="py-2.5 px-6 font-semibold text-center">
                        Attempt #{idx + 1}
                      </th>
                    ))}
                    {completedAttempts.length > 1 && (
                      <th className="py-2.5 px-6 font-semibold text-right text-[var(--color-accent)]">
                        Net Delta
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-rule)]">
                  {rubricNames.map((criterionName) => {
                    const firstScore =
                      completedAttempts[0]?.evaluations?.[0]?.criterionResults?.find(
                        (c) => c.criterion.toLowerCase().includes(criterionName.toLowerCase().substring(0, 8))
                      )?.score || 0;

                    const lastScore =
                      completedAttempts[completedAttempts.length - 1]?.evaluations?.[0]?.criterionResults?.find(
                        (c) => c.criterion.toLowerCase().includes(criterionName.toLowerCase().substring(0, 8))
                      )?.score || 0;

                    const delta = lastScore - firstScore;

                    return (
                      <tr key={criterionName} className="hover:bg-[var(--color-paper)]">
                        <td className="py-3 px-6 font-medium text-[var(--color-ink)]">
                          {criterionName}
                        </td>
                        {completedAttempts.map((att) => {
                          const cr = att.evaluations?.[0]?.criterionResults?.find((c) =>
                            c.criterion.toLowerCase().includes(criterionName.toLowerCase().substring(0, 8))
                          );
                          return (
                            <td key={att.id} className="py-3 px-6 text-center font-mono text-[var(--color-ink-2)]">
                              {cr ? `${cr.score} / ${cr.maxScore}` : '-'}
                            </td>
                          );
                        })}
                        {completedAttempts.length > 1 && (
                          <td className="py-3 px-6 text-right font-mono font-bold">
                            {delta > 0 ? (
                              <span className="text-emerald-600">+{delta} pts</span>
                            ) : delta < 0 ? (
                              <span className="text-rose-600">{delta} pts</span>
                            ) : (
                              <span className="text-[var(--color-ink-2)]">0</span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}

                  {/* Overall Total Row */}
                  <tr className="bg-[var(--color-paper-2)] font-bold">
                    <td className="py-3.5 px-6 text-[var(--color-ink)] text-xs font-mono uppercase">Total Score</td>
                    {completedAttempts.map((att) => {
                      const score = att.evaluations?.[0]?.overallScore || 0;
                      return (
                        <td key={att.id} className="py-3.5 px-6 text-center font-mono text-sm text-[var(--color-ink)]">
                          <span className="px-2 py-0.5 rounded-xs bg-[var(--tint-lavender)] text-[var(--tint-lavender-text)] border border-[var(--tint-lavender-border)]">
                            {score} / 100
                          </span>
                        </td>
                      );
                    })}
                    {completedAttempts.length > 1 && (
                      <td className="py-3.5 px-6 text-right font-mono text-sm">
                        {(() => {
                          const deltaTotal =
                            (completedAttempts[completedAttempts.length - 1]?.evaluations?.[0]?.overallScore || 0) -
                            (completedAttempts[0]?.evaluations?.[0]?.overallScore || 0);
                          return deltaTotal >= 0 ? (
                            <span className="text-emerald-600">+{deltaTotal} pts</span>
                          ) : (
                            <span className="text-rose-600">{deltaTotal} pts</span>
                          );
                        })()}
                      </td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Cards for Individual Attempts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {completedAttempts.map((att, index) => {
              const evalItem = att.evaluations?.[0];
              return (
                <div
                  key={att.id}
                  className="bg-[var(--color-surface)] border border-[var(--color-rule)] hover:border-[var(--color-rule-strong)] rounded-xl p-5 flex flex-col justify-between transition-all shadow-subtle"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)]">
                        Attempt #{index + 1}
                      </span>
                      <span className="text-[11px] text-[var(--color-ink-2)] flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3" />
                        {new Date(att.startedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span className="text-2xl font-mono font-black text-[var(--color-ink)]">
                        {evalItem?.overallScore || 0}
                      </span>
                      <span className="text-xs text-[var(--color-ink-2)] font-mono font-semibold">/ 100</span>
                    </div>

                    <p className="text-xs text-[var(--color-ink-2)] line-clamp-3 mb-4 leading-relaxed">
                      {evalItem?.feedbackSummary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--color-rule)] flex items-center justify-between">
                    <span className="text-[11px] text-[var(--color-accent)] font-mono font-medium">
                      {evalItem?.evaluatorType}
                    </span>
                    <button
                      onClick={() => activeProblem && onSelectAttempt(att, activeProblem)}
                      className="text-xs text-[var(--color-ink)] bg-[var(--color-paper-2)] hover:bg-[var(--color-paper)] px-3 py-1.5 rounded-md font-medium transition-colors border border-[var(--color-rule)]"
                    >
                      Inspect Report
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
