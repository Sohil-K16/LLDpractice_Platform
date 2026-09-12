export interface ProblemProps {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  description: string;
  requirements: string[];
  constraints: string[];
  concepts: string[];
  hints?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Problem {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly difficulty: string;
  readonly description: string;
  readonly requirements: string[];
  readonly constraints: string[];
  readonly concepts: string[];
  readonly hints: string[];
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: ProblemProps) {
    this.id = props.id;
    this.title = props.title;
    this.slug = props.slug;
    this.difficulty = props.difficulty;
    this.description = props.description;
    this.requirements = props.requirements;
    this.constraints = props.constraints;
    this.concepts = props.concepts;
    this.hints = props.hints || [];
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }
}
