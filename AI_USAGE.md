# AI Usage & Prompt Engineering Specification

This document details the prompt design, JSON schemas, hallucination safeguards, and fallback mechanisms implemented in the **LLD Practice Platform**.

---

## 1. System Prompt Architecture

The `AIEvaluator` acts as a Principal Software Architect evaluating object-oriented design submissions. The system prompt is engineered with five strict instructions:
1. **Persona & Domain Specialization**: Positioned as an expert in Low-Level Design, GoF design patterns, and SOLID principles.
2. **Authoritative Rubric Anchor**: Incorporates the exact 6-dimension rubric with specific question prompts for each dimension.
3. **Submission Grounding**: Requires citing concrete quotes from the candidate's code/text in the `evidence` field.
4. **Specific SRP Diagnostics**: Explicitly instructed to analyze orchestrator classes (such as `ParkingLot`, `VendingMachine`, or `ElevatorController`) for coupled responsibilities (e.g. allocation vs. billing).
5. **Strict JSON Output**: Mandates standard JSON formatting conforming to `EvaluationResultData`.

---

## 2. Structured JSON Schema

The LLM is prompted using `response_format: { type: "json_object" }` ensuring pure JSON responses:

```json
{
  "overallScore": 78,
  "summary": "Overall design demonstrates solid modularity. Spot allocation is cleanly structured, but billing logic is coupled directly within the coordinator.",
  "criteria": [
    {
      "criterion": "Requirements Understanding",
      "score": 16,
      "maxScore": 20,
      "evidence": [
        "Allocates spots for Compact, Large, and Motorcycle categories",
        "Generates ticket with timestamp on entry"
      ],
      "concern": "Full capacity and gate concurrency were not clearly articulated.",
      "suggestion": "Specify lock mechanisms or atomic counters for peak-hour entry gates.",
      "confidence": 0.95
    },
    {
      "criterion": "Class Responsibilities & SRP",
      "score": 14,
      "maxScore": 20,
      "evidence": [
        "ParkingLot class handles spot allocation and also computes fees in calculateFee()"
      ],
      "concern": "Coupling parking allocation with pricing policies violates Single Responsibility Principle.",
      "suggestion": "Extract fee computation into a separate PricingStrategy interface.",
      "confidence": 0.92
    }
  ],
  "topActions": [
    {
      "title": "Decouple Pricing from Allocation",
      "description": "Introduce a PricingStrategy interface to isolate rate calculations from the ParkingLot class.",
      "category": "Refactor"
    },
    {
      "title": "Handle Concurrency at Entry Gates",
      "description": "Implement thread-safe spot locking to prevent race conditions during simultaneous vehicle arrivals.",
      "category": "Edge Case"
    }
  ]
}
```

---

## 3. Fallback & Fault-Tolerance Strategy

External LLMs can suffer from latency, rate limits, network timeouts, or invalid API keys. The platform employs a resilient **HybridEvaluator**:

```
[Candidate Submits] 
        │
        ▼
[Submission Saved in DB]
        │
        ▼
[Attempt State: EVALUATING]
        │
        ├── Has OPENAI_API_KEY?
        │       │
        │       ├── Yes ──> Try AIEvaluator
        │       │             │
        │       │             ├── Success ──> Save AI Result ──> State: COMPLETED
        │       │             │
        │       │             └── Failure/Timeout ──> Fallback to RuleBasedEvaluator
        │       │                                         │
        │       └── No ───────────────────────────────────┤
        │                                                 ▼
        │                                      Run RuleBasedEvaluator
        │                                                 │
        │                                                 ▼
        └─────────────────────────────────────────> Save Rule Result ──> State: COMPLETED
```

### Key Guarantees:
1. **Zero Data Loss**: Submissions are committed to SQLite *before* evaluation execution begins.
2. **Offline Usability**: The platform operates completely offline without an API key using the intelligent `RuleBasedEvaluator`.
3. **Transparent Provenance**: Every evaluation records its evaluator engine (`RULE_BASED`, `AI`, or `HYBRID`) and model name in the database.
