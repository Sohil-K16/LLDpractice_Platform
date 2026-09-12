import { Router, Request, Response } from 'express';
import { AttemptService } from '../services/AttemptService';
import { EvaluationService } from '../services/EvaluationService';

const router = Router();
const attemptService = new AttemptService();
const evaluationService = new EvaluationService();

// POST /api/attempts - Create a new attempt
router.post('/', async (req: Request, res: Response) => {
  try {
    const { problemId, userId } = req.body;
    if (!problemId) {
      return res.status(400).json({ success: false, error: 'problemId is required' });
    }

    const attempt = await attemptService.createAttempt(problemId, userId);
    res.status(201).json({ success: true, data: attempt });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// GET /api/attempts/:id - Get attempt by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const attempt = await attemptService.getAttemptById(req.params.id);
    res.json({ success: true, data: attempt });
  } catch (err) {
    res.status(404).json({ success: false, error: (err as Error).message });
  }
});

// GET /api/attempts/problem/:problemId - Get all attempts for a problem
router.get('/problem/:problemId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const attempts = await attemptService.getAttemptsForProblem(
      req.params.problemId,
      typeof userId === 'string' ? userId : undefined
    );
    res.json({ success: true, data: attempts });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// POST /api/attempts/:id/submit - Submit solution & trigger evaluation
router.post('/:id/submit', async (req: Request, res: Response) => {
  const attemptId = req.params.id;
  try {
    const { assumptions, classes, relationships, flows, designExplanation, mermaidDiagram } = req.body;

    // 1. Save submission data first
    await attemptService.createSubmissionForAttempt(attemptId, {
      assumptions: assumptions || '',
      classes: classes || '',
      relationships: relationships || '',
      flows: flows || '',
      designExplanation: designExplanation || '',
      mermaidDiagram: mermaidDiagram || null,
    });

    // 2. Mark attempt SUBMITTED
    await attemptService.updateAttemptStatus(attemptId, 'SUBMITTED', new Date());

    // 3. Execute evaluation
    const evaluation = await evaluationService.evaluateAttemptSubmission(attemptId, {
      assumptions: assumptions || '',
      classes: classes || '',
      relationships: relationships || '',
      flows: flows || '',
      designExplanation: designExplanation || '',
      mermaidDiagram: mermaidDiagram || null,
    });

    res.json({
      success: true,
      message: 'Submission evaluated successfully',
      data: {
        attemptId,
        evaluation,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, error: (err as Error).message });
  }
});

export default router;
