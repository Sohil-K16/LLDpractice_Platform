import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface MermaidPreviewProps {
  code: string;
}

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  themeVariables: {
    darkMode: false,
    background: '#ffffff',
    primaryColor: '#e6e0f5',
    primaryTextColor: '#18181b',
    primaryBorderColor: '#5645d4',
    lineColor: '#27272a',
    secondaryColor: '#f4f3f0',
    tertiaryColor: '#fafaf9',
  },
  securityLevel: 'loose',
});

export const MermaidPreview: React.FC<MermaidPreviewProps> = ({ code }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function renderChart() {
      if (!code || !code.trim()) {
        setError(null);
        if (containerRef.current) containerRef.current.innerHTML = '';
        return;
      }

      setIsRendering(true);
      setError(null);

      const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;

      try {
        await mermaid.parse(code);
        const { svg } = await mermaid.render(id, code);
        if (!isCancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setError(null);
        }
      } catch (err: any) {
        if (!isCancelled) {
          setError(err?.message || 'Invalid Mermaid class diagram syntax.');
        }
      } finally {
        if (!isCancelled) {
          setIsRendering(false);
        }
      }
    }

    const timer = setTimeout(() => {
      renderChart();
    }, 350);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [code]);

  if (!code || !code.trim()) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-[var(--color-ink-2)] border border-dashed border-[var(--color-rule)] rounded-md p-6 text-center bg-[var(--color-paper-2)]">
        <p className="text-xs font-medium">Enter Mermaid code on the left to render your live class diagram preview.</p>
        <p className="text-[11px] text-[var(--color-ink-2)] mt-1 font-mono">Syntax begins with "classDiagram"</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full bg-[var(--color-paper-2)] rounded-md border border-[var(--color-rule)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--color-paper-2)] border-b border-[var(--color-rule)] text-xs">
        <span className="font-semibold text-[var(--color-ink-2)] font-mono text-[11px]">Live UML Renderer</span>
        {error ? (
          <span className="flex items-center gap-1 text-rose-600 font-medium text-[11px]">
            <AlertCircle className="w-3.5 h-3.5" /> Syntax Error
          </span>
        ) : (
          <span className="flex items-center gap-1 text-emerald-600 font-medium text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" /> Diagram Valid
          </span>
        )}
      </div>

      <div className="flex-1 p-4 overflow-auto flex items-center justify-center min-h-[300px] bg-[var(--color-surface)]">
        {error ? (
          <div className="p-4 bg-[var(--tint-rose)] border border-[var(--tint-rose-border)] rounded-md text-[var(--tint-rose-text)] text-xs max-w-md w-full font-mono">
            <div className="font-bold flex items-center gap-1.5 mb-1 text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Mermaid Syntax Warning
            </div>
            <p className="whitespace-pre-wrap">{error}</p>
          </div>
        ) : (
          <div
            ref={containerRef}
            className="w-full flex justify-center [&_svg]:max-w-full [&_svg]:h-auto transition-opacity duration-150"
            style={{ opacity: isRendering ? 0.6 : 1 }}
          />
        )}
      </div>
    </div>
  );
};
