export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Easy/Medium' | 'Medium' | 'Hard';
  description: string;
  requirements: string[];
  constraints: string[];
  concepts: string[];
  hints: string[];
  createdAt: string;
}

export type AttemptStatus = 'DRAFT' | 'SUBMITTED' | 'EVALUATING' | 'COMPLETED' | 'FAILED';

export interface CriterionResult {
  id: string;
  criterion: string;
  score: number;
  maxScore: number;
  evidence: string; // JSON string array or string
  concern?: string | null;
  suggestion?: string | null;
  confidence: number;
}

export interface FeedbackAction {
  id: string;
  title: string;
  description: string;
  category: 'Refactor' | 'Pattern' | 'Edge Case' | 'Architecture';
  completed: boolean;
}

export interface Evaluation {
  id: string;
  attemptId: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  overallScore: number;
  rubricVersion: string;
  model: string;
  evaluatorType: 'RULE_BASED' | 'AI' | 'HYBRID';
  feedbackSummary: string;
  createdAt: string;
  criterionResults: CriterionResult[];
  feedbackActions: FeedbackAction[];
}

export interface Submission {
  id: string;
  attemptId: string;
  assumptions: string;
  classes: string;
  relationships: string;
  flows: string;
  designExplanation: string;
  mermaidDiagram?: string | null;
  createdAt: string;
}

export interface Attempt {
  id: string;
  userId?: string | null;
  problemId: string;
  status: AttemptStatus;
  startedAt: string;
  submittedAt?: string | null;
  problem?: Problem;
  submissions?: Submission[];
  evaluations?: Evaluation[];
}

export interface RubricCriterionInfo {
  id: string;
  name: string;
  weight: number;
  description: string;
  evaluationQuestions: string[];
}
