import { prisma } from '../lib/prisma';
import { Problem } from '../domain/Problem';

export class ProblemRepository {
  async findAll(): Promise<Problem[]> {
    const records = await prisma.problem.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return records.map(
      (r) =>
        new Problem({
          id: r.id,
          title: r.title,
          slug: r.slug,
          difficulty: r.difficulty,
          description: r.description,
          requirements: JSON.parse(r.requirements),
          constraints: JSON.parse(r.constraints),
          concepts: JSON.parse(r.concepts),
          hints: r.hints ? JSON.parse(r.hints) : [],
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        })
    );
  }

  async findById(id: string): Promise<Problem | null> {
    const r = await prisma.problem.findUnique({
      where: { id },
    });
    if (!r) return null;
    return new Problem({
      id: r.id,
      title: r.title,
      slug: r.slug,
      difficulty: r.difficulty,
      description: r.description,
      requirements: JSON.parse(r.requirements),
      constraints: JSON.parse(r.constraints),
      concepts: JSON.parse(r.concepts),
      hints: r.hints ? JSON.parse(r.hints) : [],
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    });
  }

  async findBySlug(slug: string): Promise<Problem | null> {
    const r = await prisma.problem.findUnique({
      where: { slug },
    });
    if (!r) return null;
    return new Problem({
      id: r.id,
      title: r.title,
      slug: r.slug,
      difficulty: r.difficulty,
      description: r.description,
      requirements: JSON.parse(r.requirements),
      constraints: JSON.parse(r.constraints),
      concepts: JSON.parse(r.concepts),
      hints: r.hints ? JSON.parse(r.hints) : [],
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    });
  }
}
