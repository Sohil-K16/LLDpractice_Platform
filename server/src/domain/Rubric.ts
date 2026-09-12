export interface RubricCriterion {
  id: string;
  name: string;
  weight: number; // maxScore
  description: string;
  evaluationQuestions: string[];
}

export const RUBRIC_CRITERIA: RubricCriterion[] = [
  {
    id: 'requirements_understanding',
    name: 'Requirements Understanding',
    weight: 20,
    description: 'Accurately captures core functional requirements, entities, boundaries, and domain constraints.',
    evaluationQuestions: [
      'Did the candidate identify key entities and use cases?',
      'Are constraints (e.g. capacity, rates, concurrent operations) addressed?',
      'Are assumptions clearly scoped and practical?',
    ],
  },
  {
    id: 'class_responsibilities',
    name: 'Class Responsibilities & SRP',
    weight: 20,
    description: 'Classes have cohesive, focused duties obeying Single Responsibility Principle (SRP).',
    evaluationQuestions: [
      'Is each class assigned a singular, well-defined duty?',
      'Are operations like billing, persistence, or display split from core domain logic?',
      'Are god-objects or overly bloated classes avoided?',
    ],
  },
  {
    id: 'coupling_and_interfaces',
    name: 'Coupling & Interfaces',
    weight: 15,
    description: 'Loose coupling via interfaces and abstractions obeying Dependency Inversion Principle.',
    evaluationQuestions: [
      'Are components decoupled using interfaces or abstract base classes?',
      'Can subsystems communicate without tight direct references?',
      'Is high cohesion and loose coupling maintained?',
    ],
  },
  {
    id: 'extensibility_and_patterns',
    name: 'Extensibility & Design Patterns',
    weight: 20,
    description: 'Appropriate application of design patterns (Strategy, State, Factory, Observer) to allow easy evolution without modifying existing code (OCP).',
    evaluationQuestions: [
      'Can new policies (e.g., pricing formulas, dispatch algorithms, new items) be introduced without modifying existing classes?',
      'Are behavioral or creational patterns applied purposefully without overengineering?',
    ],
  },
  {
    id: 'edge_cases_and_testability',
    name: 'Edge Cases & Testability',
    weight: 10,
    description: 'System accounts for boundary conditions, failures, concurrency, and clean test isolation.',
    evaluationQuestions: [
      'What happens during full capacity, zero balance, or invalid inputs?',
      'Is the design modular enough for mockable unit testing?',
      'Are error and rollback pathways considered?',
    ],
  },
  {
    id: 'explanation_and_tradeoffs',
    name: 'Explanation & Trade-offs',
    weight: 15,
    description: 'Quality of reasoning, justification of design choices, and honest evaluation of alternative approaches.',
    evaluationQuestions: [
      'Does the explanation articulate WHY specific designs/patterns were chosen?',
      'Are trade-offs (e.g. memory vs speed, simplicity vs future flexibility) addressed?',
    ],
  },
];

export interface CriterionResultData {
  criterion: string;
  score: number;
  maxScore: number;
  evidence: string[];
  concern?: string;
  suggestion?: string;
  confidence: number;
}

export interface FeedbackActionData {
  title: string;
  description: string;
  category: 'Refactor' | 'Pattern' | 'Edge Case' | 'Architecture';
}

export interface EvaluationResultData {
  overallScore: number;
  evaluatorType: 'RULE_BASED' | 'AI' | 'HYBRID';
  model: string;
  summary: string;
  criteria: CriterionResultData[];
  topActions: FeedbackActionData[];
}
