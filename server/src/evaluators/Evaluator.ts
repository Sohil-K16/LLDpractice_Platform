import { Problem } from '../domain/Problem';
import { Submission } from '../domain/Submission';
import { EvaluationResultData } from '../domain/Rubric';

export interface Evaluator {
  readonly name: string;
  evaluate(problem: Problem, submission: Submission): Promise<EvaluationResultData>;
}
