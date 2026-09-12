import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ProblemsPage } from './pages/ProblemsPage';
import { PracticePage } from './pages/PracticePage';
import { EvaluationPage } from './pages/EvaluationPage';
import { HistoryPage } from './pages/HistoryPage';
import { RubricPage } from './pages/RubricPage';
import { Problem, Attempt, Evaluation } from './types';

export function App() {
  const [currentView, setCurrentView] = useState<string>('problems');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [currentEvaluation, setCurrentEvaluation] = useState<Evaluation | null>(null);
  const [activeAttempt, setActiveAttempt] = useState<Attempt | null>(null);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const handleSelectProblem = (problem: Problem) => {
    setSelectedProblem(problem);
    setActiveAttempt(null);
    setCurrentEvaluation(null);
    setCurrentView('practice');
  };

  const handleViewHistory = (problem: Problem) => {
    setSelectedProblem(problem);
    setCurrentView('history');
  };

  const handleEvaluationComplete = (_attemptId: string, evaluation: Evaluation) => {
    setCurrentEvaluation(evaluation);
    setCurrentView('evaluation');
  };

  const handleInspectAttempt = (attempt: Attempt, problem: Problem) => {
    setSelectedProblem(problem);
    setActiveAttempt(attempt);
    if (attempt.evaluations && attempt.evaluations.length > 0) {
      setCurrentEvaluation(attempt.evaluations[0]);
      setCurrentView('evaluation');
    } else {
      setCurrentView('practice');
    }
  };

  const handleRetryFromEvaluation = () => {
    if (selectedProblem) {
      setActiveAttempt(null);
      setCurrentView('practice');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)] flex flex-col font-sans selection:bg-[var(--tint-lavender)] selection:text-[var(--color-ink)]">
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      <main className="flex-1">
        {currentView === 'problems' && (
          <ProblemsPage
            onSelectProblem={handleSelectProblem}
            onViewHistory={handleViewHistory}
          />
        )}

        {currentView === 'practice' && selectedProblem && (
          <PracticePage
            problem={selectedProblem}
            existingAttempt={activeAttempt}
            onBack={() => setCurrentView('problems')}
            onEvaluationComplete={handleEvaluationComplete}
          />
        )}

        {currentView === 'evaluation' && currentEvaluation && selectedProblem && (
          <EvaluationPage
            evaluation={currentEvaluation}
            problem={selectedProblem}
            onRetry={handleRetryFromEvaluation}
            onBack={() => setCurrentView('problems')}
          />
        )}

        {currentView === 'history' && (
          <HistoryPage
            initialProblemId={selectedProblem?.id}
            onSelectAttempt={handleInspectAttempt}
            onNewAttempt={(p) => {
              setSelectedProblem(p);
              setActiveAttempt(null);
              setCurrentView('practice');
            }}
          />
        )}

        {currentView === 'rubric' && <RubricPage />}
      </main>

      {/* Ft2 Inline Single Line Footer */}
      <footer className="py-6 border-t border-[var(--color-rule)] text-xs text-[var(--color-ink-2)] bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 font-mono text-[11px]">
            <span className="font-bold text-[var(--color-ink)]">LLD Studio</span>
            <span>•</span>
            <span>Grounded in 6-D Rubrics</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] font-mono text-[var(--color-ink-2)]">
            <span>Locked Tokens (design.md)</span>
            <span>•</span>
            <span>No Re-drawn Chrome</span>
            <span>•</span>
            <span>Bento Workbench</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
