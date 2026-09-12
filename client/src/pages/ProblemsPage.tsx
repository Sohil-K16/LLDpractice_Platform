import React, { useEffect, useState } from 'react';
import { Problem } from '../types';
import { fetchProblems } from '../services/api';
import {
  Terminal,
  ArrowRight,
  Boxes,
  ShieldCheck,
  Zap,
  Code2,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';

interface ProblemsPageProps {
  onSelectProblem: (problem: Problem) => void;
  onViewHistory: (problem: Problem) => void;
}

export const ProblemsPage: React.FC<ProblemsPageProps> = ({ onSelectProblem, onViewHistory }) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchProblems();
        setProblems(data);
      } catch (err: any) {
        setError(err.message || 'Failed to connect to backend server.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const activeProblem = problems[activeTab] || problems[0];

  return (
    <div className="w-full bg-[var(--color-paper)] min-h-screen">
      {/* 1. BENTO WORKBENCH HEADER SECTION (Asymmetric Layout, Left-Biased, No Slop) */}
      <section className="border-b border-[var(--color-rule)] bg-[var(--color-surface)] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Bold Asymmetric Headline & Editorial Stance (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xs bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[var(--color-ink-2)] text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              <span>Evaluator Engine • 6 Rubric Dimensions (100 Pts)</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--color-ink)] leading-[1.08]">
              Low-Level Design Studio.<br />
              <span className="text-[var(--color-ink-2)] font-semibold text-2xl sm:text-4xl block mt-2">
                Evaluated by principles, not guesses.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[var(--color-ink-2)] max-w-xl leading-relaxed">
              Design classic systems with structured schemas, live Mermaid class diagrams, and diagnostic feedback that catches Single Responsibility violations with concrete redo tasks.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => activeProblem && onSelectProblem(activeProblem)}
                className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs font-medium px-5 py-2.5 rounded-md shadow-subtle transition-all flex items-center gap-2"
              >
                <span>Solve {activeProblem?.title ? `"${activeProblem.title.replace('Design a ', '').replace(' System', '')}"` : 'Challenge'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('bento-challenges');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[var(--color-surface)] hover:bg-[var(--color-paper-2)] text-[var(--color-ink)] text-xs font-medium px-4 py-2.5 rounded-md border border-[var(--color-rule-strong)] transition-colors"
              >
                Explore All Challenges
              </button>
            </div>
          </div>

          {/* Right Column: Live Architectural Inspector (5 Cols, Real Data, NO Fake Chrome) */}
          <div className="lg:col-span-5">
            <div className="bg-[var(--color-paper-2)] border border-[var(--color-rule)] rounded-xl p-5 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--color-rule)]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-xs bg-[var(--color-accent)]" />
                  <span className="text-xs font-bold font-mono text-[var(--color-ink)]">
                    Diagnostic Inspector
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[var(--color-ink-2)]">
                  Standard v1.0
                </span>
              </div>

              {/* Inspector Content */}
              <div className="space-y-2.5 text-xs">
                <div className="bg-[var(--color-surface)] p-3 rounded-md border border-[var(--color-rule)] space-y-1.5">
                  <div className="text-[11px] font-bold text-[var(--color-ink)] flex items-center justify-between">
                    <span>Class Responsibilities & SRP</span>
                    <span className="text-xs font-mono font-bold text-emerald-600">20 Pts Max</span>
                  </div>
                  <p className="text-[11px] text-[var(--color-ink-2)] leading-relaxed">
                    Evaluates whether coordinators (e.g. ParkingLot) couple spot allocation with pricing policies.
                  </p>
                </div>

                <div className="bg-[var(--color-surface)] p-3 rounded-md border border-[var(--color-rule)] space-y-1.5">
                  <div className="text-[11px] font-bold text-[var(--color-ink)] flex items-center justify-between">
                    <span>Extensibility & Design Patterns</span>
                    <span className="text-xs font-mono font-bold text-emerald-600">20 Pts Max</span>
                  </div>
                  <p className="text-[11px] text-[var(--color-ink-2)] leading-relaxed">
                    Detects GoF Strategy, State, and Factory patterns allowing evolution without breaking modifications.
                  </p>
                </div>

                <div className="bg-[var(--tint-yellow-bold)] p-3 rounded-md border border-[var(--tint-yellow-border)] text-[var(--tint-yellow-text)]">
                  <span className="font-bold block text-[11px] mb-0.5">Actionable Redo Output:</span>
                  <span className="text-[11px] leading-relaxed">
                    Produces concrete refactor tasks (e.g. "Extract PricingStrategy interface") with 1-click attempt retry.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BENTO CHALLENGES SECTION (Asymmetric Layout, Eliminating 3-Column AI Slop) */}
      <section id="bento-challenges" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-ink)] tracking-tight">
              Curated Architectural Challenges
            </h2>
            <p className="text-xs text-[var(--color-ink-2)] mt-1">
              Select a system design problem to inspect requirements, constraints, and target patterns
            </p>
          </div>

          {/* Interactive Problem Selector Tabs */}
          <div className="flex gap-1.5 bg-[var(--color-paper-2)] p-1 rounded-md border border-[var(--color-rule)]">
            {problems.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setActiveTab(idx)}
                className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-all ${
                  activeTab === idx
                    ? 'bg-[var(--color-surface)] text-[var(--color-ink)] font-semibold shadow-subtle'
                    : 'text-[var(--color-ink-2)] hover:text-[var(--color-ink)]'
                }`}
              >
                {p.title.replace('Design a ', '').replace(' System', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="h-96 rounded-xl bg-[var(--color-paper-2)] border border-[var(--color-rule)] animate-pulse p-8" />
        )}

        {/* Error State */}
        {error && (
          <div className="p-5 rounded-md bg-[var(--tint-rose)] border border-[var(--tint-rose-border)] text-[var(--tint-rose-text)] text-xs">
            <p className="font-bold mb-1">Could not connect to backend server</p>
            <p>{error}</p>
          </div>
        )}

        {/* Asymmetric Bento Workbench Presentation */}
        {!loading && !error && activeProblem && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Primary Featured Panel (8 Cols) */}
            <div className="lg:col-span-8 bg-[var(--color-surface)] border border-[var(--color-rule)] rounded-xl p-8 flex flex-col justify-between shadow-subtle">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-xs bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)]">
                    {activeProblem.difficulty}
                  </span>
                  <span className="text-xs text-[var(--color-ink-2)] font-mono">
                    Problem #{activeTab + 1}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-[var(--color-ink)] mb-3 tracking-tight">
                  {activeProblem.title}
                </h3>

                <p className="text-xs sm:text-sm text-[var(--color-ink-2)] leading-relaxed mb-6">
                  {activeProblem.description}
                </p>

                {/* Requirements Checklist */}
                <div className="space-y-2 mb-6">
                  <span className="text-[11px] font-bold text-[var(--color-ink)] uppercase tracking-wider block font-mono">
                    Core Functional Requirements:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeProblem.requirements?.slice(0, 4).map((req, i) => (
                      <div key={i} className="p-2.5 rounded-md bg-[var(--color-paper)] border border-[var(--color-rule)] text-xs text-[var(--color-ink)] flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-[var(--color-rule)] flex items-center justify-between gap-4">
                <button
                  onClick={() => onViewHistory(activeProblem)}
                  className="text-xs font-medium text-[var(--color-ink-2)] hover:text-[var(--color-ink)] py-2 px-3 rounded-md hover:bg-[var(--color-paper-2)] transition-colors"
                >
                  View Historical Attempts
                </button>

                <button
                  onClick={() => onSelectProblem(activeProblem)}
                  className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs font-semibold px-5 py-2.5 rounded-md shadow-subtle transition-all flex items-center gap-2"
                >
                  <span>Open Studio Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Asymmetric Side Panel: Constraints & Target Patterns (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Constraints Box */}
              <div className="flex-1 bg-[var(--tint-peach)] border border-[var(--tint-peach-border)] text-[var(--tint-peach-text)] rounded-xl p-6 shadow-subtle">
                <span className="text-[10px] font-bold font-mono uppercase tracking-wider block mb-2">
                  Key Boundaries & Constraints
                </span>
                <ul className="space-y-2 text-xs leading-relaxed">
                  {activeProblem.constraints?.map((con, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--tint-peach-text)] shrink-0 mt-1.5" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Target Patterns Box */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-rule)] rounded-xl p-6 shadow-subtle">
                <span className="text-[10px] font-bold font-mono uppercase tracking-wider block text-[var(--color-ink-2)] mb-3">
                  Architectural Patterns Evaluated
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeProblem.concepts?.map((c, i) => (
                    <span
                      key={i}
                      className="text-xs font-mono px-2.5 py-1 rounded-xs bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)] font-medium"
                    >
                      {c.split('(')[0].trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. DIAGNOSTIC REDO STATEMENT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-[var(--color-surface)] border border-[var(--color-rule)] rounded-xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-subtle">
          <div className="max-w-xl space-y-2">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-xs bg-[var(--tint-yellow-bold)] text-[var(--tint-yellow-text)] border border-[var(--tint-yellow-border)] inline-block">
              Continuous Refactor Loop
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-ink)] tracking-tight">
              Iterate, refactor, and verify.
            </h3>
            <p className="text-xs text-[var(--color-ink-2)] leading-relaxed">
              Every submission saves your attempt, executes deterministic validation, runs rubric heuristics, and updates your delta progression table so you can verify your architectural growth.
            </p>
          </div>

          <button
            onClick={() => activeProblem && onSelectProblem(activeProblem)}
            className="bg-[var(--color-ink)] hover:bg-black text-white text-xs font-medium px-5 py-2.5 rounded-md shadow-subtle transition-all shrink-0"
          >
            Start First Attempt
          </button>
        </div>
      </section>
    </div>
  );
};
