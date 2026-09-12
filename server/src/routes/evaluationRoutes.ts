import { Router, Request, Response } from 'express';
import { EvaluationService } from '../services/EvaluationService';
import { RUBRIC_CRITERIA } from '../domain/Rubric';

const router = Router();
const evaluationService = new EvaluationService();

// GET /api/evaluations/rubric - Get the standard 6-dimension rubric
router.get('/rubric', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      rubricVersion: '1.0.0',
      totalPoints: 100,
      criteria: RUBRIC_CRITERIA,
    },
  });
});

// GET /api/evaluations/attempt/:attemptId - Get evaluation for an attempt
router.get('/attempt/:attemptId', async (req: Request, res: Response) => {
  try {
    const evaluation = await evaluationService.getEvaluationForAttempt(req.params.attemptId);
    if (!evaluation) {
      return res.status(404).json({ success: false, error: 'Evaluation not found for this attempt' });
    }
    res.json({ success: true, data: evaluation });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

export default router;
