import { describe, it, expect } from 'vitest';
import { Attempt } from '../src/domain/Attempt';

describe('Attempt Domain Entity', () => {
  it('manages state transitions properly', () => {
    const attempt = new Attempt({
      id: 'att-test-1',
      problemId: 'prob-1',
      status: 'DRAFT',
    });

    expect(attempt.status).toBe('DRAFT');

    attempt.markSubmitted();
    expect(attempt.status).toBe('SUBMITTED');
    expect(attempt.submittedAt).toBeInstanceOf(Date);

    attempt.markEvaluating();
    expect(attempt.status).toBe('EVALUATING');

    attempt.markCompleted();
    expect(attempt.status).toBe('COMPLETED');
  });

  it('throws error when submitting an attempt not in DRAFT state', () => {
    const attempt = new Attempt({
      id: 'att-test-2',
      problemId: 'prob-1',
      status: 'COMPLETED',
    });

    expect(() => attempt.markSubmitted()).toThrow();
  });
});
