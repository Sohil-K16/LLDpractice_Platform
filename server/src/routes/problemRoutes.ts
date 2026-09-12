import { Router, Request, Response } from 'express';
import { ProblemService } from '../services/ProblemService';

const router = Router();
const problemService = new ProblemService();

// GET /api/problems - List all problems
router.get('/', async (req: Request, res: Response) => {
  try {
    const problems = await problemService.getAllProblems();
    res.json({ success: true, data: problems });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// GET /api/problems/:id - Get problem by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const problem = await problemService.getProblemById(req.params.id);
    if (!problem) {
      return res.status(404).json({ success: false, error: 'Problem not found' });
    }
    res.json({ success: true, data: problem });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// GET /api/problems/slug/:slug - Get problem by slug
router.get('/slug/:slug', async (req: Request, res: Response) => {
  try {
    const problem = await problemService.getProblemBySlug(req.params.slug);
    if (!problem) {
      return res.status(404).json({ success: false, error: 'Problem not found' });
    }
    res.json({ success: true, data: problem });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

export default router;
