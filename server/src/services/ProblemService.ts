import { ProblemRepository } from '../repositories/ProblemRepository';
import { Problem } from '../domain/Problem';

export class ProblemService {
  constructor(private problemRepo: ProblemRepository = new ProblemRepository()) {}

  async getAllProblems(): Promise<Problem[]> {
    return this.problemRepo.findAll();
  }

  async getProblemById(id: string): Promise<Problem | null> {
    return this.problemRepo.findById(id);
  }

  async getProblemBySlug(slug: string): Promise<Problem | null> {
    return this.problemRepo.findBySlug(slug);
  }
}
