import React, { useEffect, useState } from 'react';
import { RubricCriterionInfo } from '../types';
import { fetchRubric } from '../services/api';
import { Award, HelpCircle } from 'lucide-react';

export const RubricPage: React.FC = () => {
  const [rubric, setRubric] = useState<{ rubricVersion: string; totalPoints: number; criteria: RubricCriterionInfo[] } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchRubric();
        setRubric(data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const tintStyles = [
    { bg: 'bg-[var(--tint-mint)]', border: 'border-[var(--tint-mint-border)]', text: 'text-[var(--tint-mint-text)]' },
    { bg: 'bg-[var(--tint-peach)]', border: 'border-[var(--tint-peach-border)]', text: 'text-[var(--tint-peach-text)]' },
    { bg: 'bg-[var(--tint-sky)]', border: 'border-[var(--tint-sky-border)]', text: 'text-[var(--tint-sky-text)]' },
    { bg: 'bg-[var(--tint-lavender)]', border: 'border-[var(--tint-lavender-border)]', text: 'text-[var(--tint-lavender-text)]' },
    { bg: 'bg-[var(--tint-rose)]', border: 'border-[var(--tint-rose-border)]', text: 'text-[var(--tint-rose-text)]' },
    { bg: 'bg-[var(--tint-yellow-bold)]', border: 'border-[var(--tint-yellow-border)]', text: 'text-[var(--tint-yellow-text)]' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[var(--color-paper)]">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[var(--color-ink-2)] text-xs font-mono mb-3">
          <Award className="w-3.5 h-3.5 text-[var(--color-accent)]" />
          <span>Authoritative Rubric Standard v{rubric?.rubricVersion || '1.0.0'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-ink)] tracking-tight">
          The 6-Dimension LLD Assessment Rubric
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-ink-2)] mt-1.5 max-w-2xl leading-relaxed font-normal">
          Every candidate submission is evaluated objectively across six foundational pillars of Object-Oriented and System Design, totaling 100 points.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rubric?.criteria.map((c, i) => {
          const theme = tintStyles[i % tintStyles.length];
          return (
            <div
              key={c.id}
              className={`${theme.bg} border ${theme.border} rounded-xl p-6 flex flex-col justify-between shadow-subtle`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className={`text-base font-bold ${theme.text}`}>{c.name}</h3>
                  <span className="px-2 py-0.5 rounded-xs text-xs font-mono font-bold bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-rule)]">
                    {c.weight} Pts
                  </span>
                </div>
                <p className="text-xs text-[var(--color-ink)] mb-4 leading-relaxed">
                  {c.description}
                </p>

                <div className="bg-[var(--color-surface)] p-3.5 rounded-md border border-[var(--color-rule)]">
                  <div className="text-[10px] font-mono font-bold uppercase text-[var(--color-ink-2)] mb-1.5 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3 text-[var(--color-accent)]" />
                    <span>Evaluation Inquiries</span>
                  </div>
                  <ul className="space-y-1 text-xs text-[var(--color-ink)]">
                    {c.evaluationQuestions.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[var(--color-accent)] font-bold">•</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
