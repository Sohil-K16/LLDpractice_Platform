# Design — LLD Practice & Evaluation Platform

A locked design system for this app. Every page redesign reads this file before emitting code. Do not regenerate per page — extend or amend this file when the system needs to grow.

## Genre
modern-minimal

## Macrostructure family
- Marketing / Challenges page: **Bento Workbench** (asymmetric layout with live interactive problem inspection, eliminating the 3-column AI grid and re-drawn window chrome)
- App Workspace pages:       **Workbench** (dual-pane architectural studio with segmented tabs, live Mermaid diagram, and clear requirement drawer)
- Diagnostic & Report pages: **Statement Colophon** (high-impact diagnostic scorecard, actionable redo task checklist, and tabular rubric progression)

## Theme (Locked OKLCH Palette)
- `--color-paper`:      oklch(98.8% 0.003 85)   /* #fafaf9 - warm canvas */
- `--color-paper-2`:    oklch(96.5% 0.005 85)   /* #f4f3f0 - surface soft */
- `--color-surface`:    oklch(100% 0 0)         /* #ffffff - pure card surface */
- `--color-ink`:        oklch(18% 0.01 260)     /* #18181b - primary typography */
- `--color-ink-2`:      oklch(45% 0.02 260)     /* #52525b - secondary copy */
- `--color-rule`:       oklch(91% 0.006 85)     /* #e4e4e7 - hairlines */
- `--color-rule-strong`: oklch(80% 0.01 85)     /* #c4c4c8 - input/focus border */
- `--color-accent`:     oklch(48% 0.22 280)     /* #5645d4 - precision indigo */
- `--color-accent-hover`: oklch(42% 0.22 280)   /* #4534b3 - pressed primary */
- `--color-focus`:      oklch(48% 0.22 280)     /* ring focus */

### Semantic Diagnostic Tints (Rubric & Redo Tasks)
- `--tint-peach`:       oklch(94% 0.04 55)      /* SRP & Parking Lot */
- `--tint-mint`:        oklch(95% 0.04 150)     /* Requirements & Vending */
- `--tint-sky`:         oklch(94% 0.04 240)     /* Interfaces & Elevator */
- `--tint-lavender`:    oklch(93% 0.04 300)     /* Extensibility */
- `--tint-rose`:        oklch(93% 0.04 15)      /* Edge cases */
- `--tint-yellow-bold`: oklch(92% 0.08 90)      /* Scorecard & Refactor Banner */

## Typography
- Display: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; weight 700; tracking -0.03em
- Body:    Inter, system-ui, -apple-system, sans-serif; weight 400/500; leading 1.55
- Mono:    ui-monospace, "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace; weight 500
- Scale:
  - Hero display: clamp(2.5rem, 5vw, 4rem)
  - Section title: clamp(1.75rem, 3vw, 2.5rem)
  - Card title: 1.25rem
  - Body md: 0.9375rem (15px)
  - Body sm: 0.8125rem (13px)
  - Caption: 0.75rem (12px)

## Spacing & Geometry
- Scale: 4px base (`4px, 8px, 12px, 16px, 20px, 24px, 32px, 48px, 64px`)
- Buttons: `8px` (`rounded-md`), never pills (Hallmark sober rectangular geometry)
- Cards & Containers: `12px` (`rounded-xl`)
- Badges & Pills: `rounded-full` or `rounded-sm` (4px)
- Shadows: Subtle hairline borders + `0 1px 3px rgba(0,0,0,0.05)`, no heavy floating orbs

## Motion & Microinteractions
- Transition: `180ms cubic-bezier(0.16, 1, 0.3, 1)`
- Stance: Motion-cut (functional feedback only, no gratuitous bouncy reveals)
- Focus rings: `2px solid var(--color-accent)` with `2px` offset

## CTA Voice
- Primary CTA: Solid rectangular button (`bg-[var(--color-accent)] text-white font-medium rounded-md px-4 py-2.5`)
- Secondary CTA: Crisp hairline outlined (`border border-[var(--color-rule-strong)] text-[var(--color-ink)] rounded-md px-4 py-2.5`)

## Anti-Pattern Mandates
- No re-drawn fake browser chrome or macOS traffic light dots.
- No symmetrical 3-column AI feature grids.
- No mid-render inline hex chaos.
- No single-font template layout.
- Both `html` and `body` enforce `overflow-x: clip`.
