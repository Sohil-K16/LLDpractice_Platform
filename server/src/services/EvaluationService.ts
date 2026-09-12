import { Evaluator } from '../evaluators/Evaluator';
import { HybridEvaluator } from '../evaluators/HybridEvaluator';
import { EvaluationRepository } from '../repositories/EvaluationRepository';
import { AttemptRepository } from '../repositories/AttemptRepository';
import { ProblemRepository } from '../repositories/ProblemRepository';
import { ValidationService, SubmissionInput } from './ValidationService';
import { Submission } from '../domain/Submission';

export class EvaluationService {
  constructor(
    private evaluator: Evaluator = new HybridEvaluator(),
    private evalRepo: EvaluationRepository = new EvaluationRepository(),
    private attemptRepo: AttemptRepository = new AttemptRepository(),
    private problemRepo: ProblemRepository = new ProblemRepository(),
    private validationService: ValidationService = new ValidationService()
  ) {}

  async evaluateAttemptSubmission(attemptId: string, submissionData: SubmissionInput) {
    // 1. Deterministic validation first
    const validation = this.validationService.validateSubmission(submissionData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join('; ')}`);
    }

    // 2. Fetch attempt and problem
    const attemptRecord = await this.attemptRepo.findById(attemptId);
    if (!attemptRecord) {
      throw new Error(`Attempt with id ${attemptId} not found.`);
    }

    const problem = await this.problemRepo.findById(attemptRecord.problemId);
    if (!problem) {
      throw new Error(`Problem with id ${attemptRecord.problemId} not found.`);
    }

    // 3. Mark attempt status as EVALUATING
    await this.attemptRepo.updateStatus(attemptId, 'EVALUATING', new Date());

    try {
      // 4. Instantiate domain Submission
      const submission = new Submission({
        attemptId,
        assumptions: submissionData.assumptions,
        classes: submissionData.classes,
        relationships: submissionData.relationships,
        flows: submissionData.flows,
        designExplanation: submissionData.designExplanation,
        mermaidDiagram: submissionData.mermaidDiagram,
      });

      // 5. Run evaluation through Evaluator strategy
      const evaluationResult = await this.evaluator.evaluate(problem, submission);

      // 6. Persist evaluation results
      const savedEval = await this.evalRepo.saveEvaluation(attemptId, evaluationResult);

      // 7. Mark attempt as COMPLETED
      await this.attemptRepo.updateStatus(attemptId, 'COMPLETED');

      return savedEval;
    } catch (err) {
      console.error(`Evaluation failed for attempt ${attemptId}:`, err);
      await this.attemptRepo.updateStatus(attemptId, 'FAILED');
      throw err;
    }
  }

  async getEvaluationForAttempt(attemptId: string) {
    return this.evalRepo.findByAttemptId(attemptId);
  }
}
