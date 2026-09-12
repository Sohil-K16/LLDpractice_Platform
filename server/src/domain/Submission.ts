export interface SubmissionProps {
  id?: string;
  attemptId: string;
  assumptions: string;
  classes: string;
  relationships: string;
  flows: string;
  designExplanation: string;
  mermaidDiagram?: string | null;
  createdAt?: Date;
}

export class Submission {
  readonly id?: string;
  readonly attemptId: string;
  readonly assumptions: string;
  readonly classes: string;
  readonly relationships: string;
  readonly flows: string;
  readonly designExplanation: string;
  readonly mermaidDiagram?: string | null;
  readonly createdAt: Date;

  constructor(props: SubmissionProps) {
    this.id = props.id;
    this.attemptId = props.attemptId;
    this.assumptions = props.assumptions;
    this.classes = props.classes;
    this.relationships = props.relationships;
    this.flows = props.flows;
    this.designExplanation = props.designExplanation;
    this.mermaidDiagram = props.mermaidDiagram;
    this.createdAt = props.createdAt || new Date();
  }
}
