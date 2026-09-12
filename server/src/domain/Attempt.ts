export type AttemptStatus = 'DRAFT' | 'SUBMITTED' | 'EVALUATING' | 'COMPLETED' | 'FAILED';

export interface AttemptProps {
  id: string;
  userId?: string | null;
  problemId: string;
  status: AttemptStatus;
  startedAt?: Date;
  submittedAt?: Date | null;
}

export class Attempt {
  readonly id: string;
  readonly userId?: string | null;
  readonly problemId: string;
  private _status: AttemptStatus;
  readonly startedAt: Date;
  private _submittedAt?: Date | null;

  constructor(props: AttemptProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.problemId = props.problemId;
    this._status = props.status;
    this.startedAt = props.startedAt || new Date();
    this._submittedAt = props.submittedAt;
  }

  get status(): AttemptStatus {
    return this._status;
  }

  get submittedAt(): Date | null | undefined {
    return this._submittedAt;
  }

  markSubmitted(): void {
    if (this._status !== 'DRAFT') {
      throw new Error(`Cannot submit attempt from state: ${this._status}`);
    }
    this._status = 'SUBMITTED';
    this._submittedAt = new Date();
  }

  markEvaluating(): void {
    if (this._status !== 'SUBMITTED' && this._status !== 'DRAFT') {
      throw new Error(`Cannot transition to EVALUATING from state: ${this._status}`);
    }
    this._status = 'EVALUATING';
  }

  markCompleted(): void {
    this._status = 'COMPLETED';
  }

  markFailed(): void {
    this._status = 'FAILED';
  }
}
