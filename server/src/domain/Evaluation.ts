import { CriterionResultData, FeedbackActionData } from './Rubric';

export interface EvaluationProps {
  id?: string;
  attemptId: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  overallScore: number;
  rubricVersion: string;
  model: string;
  evaluatorType: 'RULE_BASED' | 'AI' | 'HYBRID';
  rawResponse?: string | null;
  feedbackSummary?: string | null;
  createdAt?: Date;
  criterionResults?: CriterionResultData[];
  feedbackActions?: FeedbackActionData[];
}

export class Evaluation {
  readonly id?: string;
  readonly attemptId: string;
  readonly status: 'PENDING' | 'COMPLETED' | 'FAILED';
  readonly overallScore: number;
  readonly rubricVersion: string;
  readonly model: string;
  readonly evaluatorType: 'RULE_BASED' | 'AI' | 'HYBRID';
  readonly rawResponse?: string | null;
  readonly feedbackSummary?: string | null;
  readonly createdAt: Date;
  readonly criterionResults: CriterionResultData[];
  readonly feedbackActions: FeedbackActionData[];

  constructor(props: EvaluationProps) {
    this.id = props.id;
    this.attemptId = props.attemptId;
    this.status = props.status;
    this.overallScore = props.overallScore;
    this.rubricVersion = props.rubricVersion;
    this.model = props.model;
    this.evaluatorType = props.evaluatorType;
    this.rawResponse = props.rawResponse;
    this.feedbackSummary = props.feedbackSummary;
    this.createdAt = props.createdAt || new Date();
    this.criterionResults = props.criterionResults || [];
    this.feedbackActions = props.feedbackActions || [];
  }
}
