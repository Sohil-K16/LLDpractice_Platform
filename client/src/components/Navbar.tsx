import React from 'react';
import { Terminal, Award, History, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, problemSlug?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  return (
    <header className="sticky top-0 z-50 bg-[var(--color-surface)] border-b border-[var(--color-rule)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between">
        {/* Brand Logotype */}
        <div
          onClick={() => onNavigate('problems')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-md bg-[var(--color-ink)] text-white flex items-center justify-center font-mono font-bold text-sm shadow-subtle group-hover:bg-[var(--color-accent)] transition-colors">
            //
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[var(--color-ink)] tracking-tight">
                LLD Studio
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-xs bg-[var(--color-paper-2)] text-[var(--color-ink-2)] border border-[var(--color-rule)]">
                v1.0
              </span>
            </div>
          </div>
        </div>

        {/* Minimal Navigation */}
        <nav className="flex items-center space-x-1">
          <button
            onClick={() => onNavigate('problems')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center space-x-1.5 transition-colors ${
              currentView === 'problems'
                ? 'bg-[var(--color-paper-2)] text-[var(--color-ink)] font-semibold'
                : 'text-[var(--color-ink-2)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-2)]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Challenges</span>
          </button>

          <button
            onClick={() => onNavigate('rubric')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center space-x-1.5 transition-colors ${
              currentView === 'rubric'
                ? 'bg-[var(--color-paper-2)] text-[var(--color-ink)] font-semibold'
                : 'text-[var(--color-ink-2)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-2)]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>6-D Rubric</span>
          </button>

          <button
            onClick={() => onNavigate('history')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center space-x-1.5 transition-colors ${
              currentView === 'history'
                ? 'bg-[var(--color-paper-2)] text-[var(--color-ink)] font-semibold'
                : 'text-[var(--color-ink-2)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-2)]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Progress & Deltas</span>
          </button>
        </nav>

        {/* Status Indicator & Sober 8px Button */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-[var(--color-ink-2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>SQLite Engine</span>
          </div>

          <button
            onClick={() => onNavigate('problems')}
            className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs font-medium px-3.5 py-1.5 rounded-md shadow-subtle transition-all flex items-center gap-1.5"
          >
            <span>Practice</span>
            <Sparkles className="w-3 h-3" />
          </button>
        </div>
      </div>
    </header>
  );
};
