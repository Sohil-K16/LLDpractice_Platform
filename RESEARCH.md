# Research Findings & Rubric Rationale

## 1. Industry Context & Problem Statement

Low-Level Design (LLD) and Object-Oriented Design (OOD) rounds are critical components of technical evaluations for SDE-2, SDE-3, and Tech Lead roles. However, existing preparation platforms suffer from severe structural limitations:
1. **Unstructured Free-form Text**: Learners submit random unstructured text paragraphs, making automated or human evaluation noisy and subjective.
2. **Generic Scores Without Actionable Diagnostics**: Many AI tools provide arbitrary scores (e.g. *"72/100"*) or generic praises without pointing to specific architectural violations.
3. **No Retest/Refactor Feedback Loop**: Unlike coding problems (LeetCode/HackerRank) where test cases provide immediate validation, LLD learners rarely get structured redo tasks that guide incremental refactoring.

---

## 2. The 6-Dimension Rubric Rationale

To make evaluations objective, explainable, and educational, this platform synthesizes standard industry interview rubrics into six core dimensions totaling 100 points:

| Dimension | Weight | Core Rationale | What Evaluators Look For |
|---|---|---|---|
| **Requirements Understanding** | 20% | Foundation of all engineering. A technically brilliant design that misses requirements is a failure. | Modeling multi-vehicle types, duration billing, capacity limits, and edge constraints. |
| **Class Responsibilities & SRP** | 20% | Single Responsibility Principle is the primary pillar of maintainability. | Isolating fee calculation, payment processing, or hardware sensors from domain coordinators. Avoiding God Classes. |
| **Coupling & Interfaces** | 15% | Dependency Inversion Principle (DIP). Software should depend on abstractions, not concretions. | Declaring clear interfaces (e.g., `PricingStrategy`, `DispatchStrategy`), enabling polymorphic substitution. |
| **Extensibility & Design Patterns** | 20% | Open-Closed Principle (OCP). Software must be open for extension without modifying existing code. | Purposeful application of GoF patterns (Strategy, State, Factory, Observer) without overengineering. |
| **Edge Cases & Testability** | 10% | Robustness under adversarial conditions. | Thread-safe concurrency, handling zero balance, full parking lot, emergency elevator stops, and mockability. |
| **Explanation & Trade-offs** | 15% | Senior engineering mindset. Design is the management of trade-offs. | Articulating why an approach was chosen over alternatives (e.g., why Strategy was preferred over complex inheritance). |

---

## 3. Deterministic Validation vs. AI Evaluation

A central finding in our research is: **never ask an LLM to evaluate what deterministic code can evaluate with 100% precision.**

```
                   Learner Submission
                           │
                           ▼
          ┌──────────────────────────────────┐
          │  Deterministic Validation Layer  │
          │  - Required field lengths        │
          │  - Character count thresholds    │
          │  - Mermaid UML syntax validity   │
          │  - Balanced brace detection      │
          └────────────────┬─────────────────┘
                           │ If Valid
                           ▼
          ┌──────────────────────────────────┐
          │   Architectural Judgment Layer   │
          │   (AI / Rule-Based Evaluator)    │
          │  - Single Responsibility check   │
          │  - Pattern applicability         │
          │  - Evidence extraction           │
          │  - Actionable Redo Tasks         │
          └──────────────────────────────────┘
```

1. **Deterministic Layer (`ValidationService`)**:
   - Validates that submissions have sufficient substance (minimum characters per section).
   - Validates Mermaid syntax (starts with `classDiagram`, balanced curly braces `{ }`, valid class definitions).
   - Fails fast in milliseconds without incurring AI API costs or latency.
2. **Judgment Layer (`Evaluator` Engine)**:
   - Evaluates design quality, cohesion, abstraction appropriateness, and evidence.
   - Identifies specific anti-patterns and produces structured redo actions.

---

## 4. The Actionable Redo Task Paradigm

The core differentiator of this platform is **Actionable Feedback**:
- ❌ **Traditional Platform Feedback**: *"Good attempt. Score: 74/100. Needs improvement in modularity."*
- ✅ **LLD Practice Platform Feedback**:
  - **Evidence**: *"In your classes, `ParkingLot` contains `calculateFee(ticket)` and directly multiplies hours by a flat rate."*
  - **Concern**: *"ParkingLot is responsible for both physical spot assignment and financial billing policies. If dynamic surge pricing or weekend rates are introduced, ParkingLot must be modified and retested, risking regression."*
  - **Actionable Redo Task**: *"Extract pricing logic into a `PricingStrategy` interface with `HourlyPricingStrategy` and inject it into `ParkingLot`. Then submit another attempt."*

This turns every evaluation into an actionable learning loop where the candidate can immediately refactor their design and watch their score climb on the progression table.
