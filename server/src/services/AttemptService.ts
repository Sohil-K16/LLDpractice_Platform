import { AttemptRepository } from '../repositories/AttemptRepository';
import { ProblemRepository } from '../repositories/ProblemRepository';
import { prisma } from '../lib/prisma';
import { AttemptStatus } from '../domain/Attempt';

export class AttemptService {
  constructor(
    private attemptRepo: AttemptRepository = new AttemptRepository(),
    private problemRepo: ProblemRepository = new ProblemRepository()
  ) {}

  async createAttempt(problemId: string, userId?: string | null) {
    const problem = await this.problemRepo.findById(problemId);
    if (!problem) {
      throw new Error(`Problem not found with id: ${problemId}`);
    }

    return this.attemptRepo.create({
      userId: userId || null,
      problemId,
    });
  }

  async getAttemptById(id: string) {
    const attempt = await this.attemptRepo.findById(id);
    if (!attempt) {
      throw new Error(`Attempt not found with id: ${id}`);
    }
    return attempt;
  }

  async getAttemptsForProblem(problemId: string, userId?: string | null) {
    return this.attemptRepo.findByProblemId(problemId, userId);
  }

  async updateAttemptStatus(id: string, status: AttemptStatus, submittedAt?: Date) {
    return this.attemptRepo.updateStatus(id, status, submittedAt);
  }

  async createSubmissionForAttempt(attemptId: string, data: {
    assumptions: string;
    classes: string;
    relationships: string;
    flows: string;
    designExplanation: string;
    mermaidDiagram?: string | null;
  }) {
    return prisma.submission.create({
      data: {
        attemptId,
        assumptions: data.assumptions,
        classes: data.classes,
        relationships: data.relationships,
        flows: data.flows,
        designExplanation: data.designExplanation,
        mermaidDiagram: data.mermaidDiagram || null,
      },
    });
  }
}
