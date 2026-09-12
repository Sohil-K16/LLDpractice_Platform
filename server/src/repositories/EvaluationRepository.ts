import { prisma } from '../lib/prisma';
import { EvaluationResultData } from '../domain/Rubric';

export class EvaluationRepository {
  async saveEvaluation(attemptId: string, result: EvaluationResultData) {
    return prisma.evaluation.create({
      data: {
        attemptId,
        status: 'COMPLETED',
        overallScore: result.overallScore,
        rubricVersion: '1.0.0',
        model: result.model,
        evaluatorType: result.evaluatorType,
        feedbackSummary: result.summary,
        rawResponse: JSON.stringify(result),
        criterionResults: {
          create: result.criteria.map((c) => ({
            criterion: c.criterion,
            score: c.score,
            maxScore: c.maxScore,
            evidence: JSON.stringify(c.evidence),
            concern: c.concern || null,
            suggestion: c.suggestion || null,
            confidence: c.confidence,
          })),
        },
        feedbackActions: {
          create: result.topActions.map((a) => ({
            title: a.title,
            description: a.description,
            category: a.category,
            completed: false,
          })),
        },
      },
      include: {
        criterionResults: true,
        feedbackActions: true,
      },
    });
  }

  async findByAttemptId(attemptId: string) {
    return prisma.evaluation.findFirst({
      where: { attemptId },
      include: {
        criterionResults: true,
        feedbackActions: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
