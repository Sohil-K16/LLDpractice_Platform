import { prisma } from '../lib/prisma';
import { Attempt, AttemptStatus } from '../domain/Attempt';

export class AttemptRepository {
  async create(data: { userId?: string | null; problemId: string }): Promise<Attempt> {
    const r = await prisma.attempt.create({
      data: {
        userId: data.userId || null,
        problemId: data.problemId,
        status: 'DRAFT',
      },
    });

    return new Attempt({
      id: r.id,
      userId: r.userId,
      problemId: r.problemId,
      status: r.status as AttemptStatus,
      startedAt: r.startedAt,
      submittedAt: r.submittedAt,
    });
  }

  async findById(id: string) {
    return prisma.attempt.findUnique({
      where: { id },
      include: {
        problem: true,
        submissions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        evaluations: {
          include: {
            criterionResults: true,
            feedbackActions: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
  }

  async findByProblemId(problemId: string, userId?: string | null) {
    return prisma.attempt.findMany({
      where: {
        problemId,
        ...(userId ? { userId } : {}),
      },
      include: {
        submissions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        evaluations: {
          include: {
            criterionResults: true,
            feedbackActions: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { startedAt: 'asc' },
    });
  }

  async updateStatus(id: string, status: AttemptStatus, submittedAt?: Date) {
    return prisma.attempt.update({
      where: { id },
      data: {
        status,
        ...(submittedAt ? { submittedAt } : {}),
      },
    });
  }
}
