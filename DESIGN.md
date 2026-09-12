# Design — LLD Practice & Evaluation Platform

A locked design system for this app. Every page redesign reads this file before emitting code. Do not regenerate per page — extend or amend this file when the system needs to grow.


## 1. MVP

The platform helps learners practice Low-Level Design through the following loop:

**Choose Problem → Design → Submit → Get Feedback → Review → Retry**

The MVP includes:

* 3 LLD problems: Parking Lot, Vending Machine, and Elevator
* Structured solution submission
* Optional Mermaid class diagram
* Rule-based validation
* AI-assisted evaluation
* Rubric-based feedback
* Actionable redo tasks
* Attempt history and score comparison

The scope intentionally excludes authentication complexity, real-time collaboration, code execution, and large-scale infrastructure.

---

## 2. User Flow

```text
Choose Problem
      ↓
Start Attempt
      ↓
Write Solution
      ↓
Submit
      ↓
Validate
      ↓
Evaluate
      ↓
View Feedback
      ↓
Retry / Review History
```

An attempt follows:

```text
DRAFT → SUBMITTED → EVALUATING → COMPLETED
                              ↘
                               FAILED
```

The submission is saved before evaluation so learner work is not lost if AI evaluation fails.

---

## 3. Architecture

The application uses a **modular monolith**.

```text
React + TypeScript
        │
        ▼
Express + TypeScript
        │
   ┌────┴─────┐
   │          │
Services   Evaluators
   │        /  |  \
   │       /   |   \
   ▼      Rule AI  Hybrid
Prisma
   │
SQLite
```

The backend separates problem management, attempts, submissions, validation, and evaluation into different responsibilities.

---

## 4. Core Domain Model

```text
User
 │
 └── Attempt ─── Problem
       │
       ├── Submission
       │
       └── Evaluation
              │
              └── CriterionResult
```

### Main responsibilities

* **Problem** — stores requirements, constraints, and problem information.
* **Attempt** — represents one practice session and manages its lifecycle.
* **Submission** — stores the learner's assumptions, classes, relationships, flows, and design explanation.
* **Evaluation** — stores the evaluation result and rubric version.
* **CriterionResult** — stores score, evidence, concern, suggestion, and confidence for each criterion.

---

## 5. Evaluation Approach

The platform uses six evaluation criteria:

| Criterion                    | Weight |
| ---------------------------- | -----: |
| Requirements Understanding   |     20 |
| Class Responsibilities & SRP |     20 |
| Coupling & Interfaces        |     15 |
| Extensibility                |     20 |
| Edge Cases & Testability     |     10 |
| Explanation & Trade-offs     |     15 |

### Deterministic checks

Used for objective validation such as:

* Required fields
* Empty submissions
* Mermaid syntax
* Basic submission/state validation

### AI evaluation

Used for judgment-heavy areas such as:

* Class responsibilities
* Coupling and cohesion
* Abstraction
* SOLID principles
* Extensibility
* Trade-offs
* Improvement suggestions

AI feedback is structured as:

**Criterion → Score → Evidence → Concern → Suggestion → Confidence**

The evaluator judges the submission against the problem requirements rather than assuming there is only one correct class design.

---

## 6. Evaluator Design

Evaluation is implemented behind an `Evaluator` abstraction:

```text
Evaluator
   ├── RuleBasedEvaluator
   ├── AIEvaluator
   └── HybridEvaluator
```

This allows another evaluation approach, such as human review, to be added later without changing the main practice flow.

The `HybridEvaluator` uses AI when available and falls back to rule-based evaluation when the AI service is unavailable or fails.

---

## 7. Key Trade-offs

### Structured text + Mermaid vs code execution

Structured submissions provide enough evidence for LLD reasoning while keeping the MVP achievable within two days. Code execution could be added later.

### Mermaid vs custom diagram editor

Mermaid is easy to store, validate, and render without the implementation cost of building a custom diagram editor.

### SQLite vs PostgreSQL

SQLite keeps the prototype simple and requires no database infrastructure. PostgreSQL would be more appropriate for a larger production deployment.

### Monolith vs microservices

A modular monolith was chosen because the assignment focuses on LLD/domain design rather than large-scale infrastructure.

---

## 8. Attempt History

Each attempt retains its submission and evaluation so learners can compare progress.

The history focuses on **criterion-level improvement**, rather than only comparing overall scores.

Example:

```text
Attempt 1 → Extensibility: 8/20
Attempt 2 → Extensibility: 15/20
                     ↑
                  Improved
```

This makes feedback part of an iterative learning loop rather than a one-time score.

---

## 9. Limitations

This is an MVP, so it currently has:

* Limited number of problems
* No full authentication system
* No code execution
* No real-time collaboration
* Mermaid instead of a custom visual editor
* Potential variability in AI-generated feedback

The architecture leaves room for these capabilities to be added later.

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
