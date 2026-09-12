import express from 'express';
import cors from 'cors';
import problemRoutes from './routes/problemRoutes';
import attemptRoutes from './routes/attemptRoutes';
import evaluationRoutes from './routes/evaluationRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/problems', problemRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/evaluations', evaluationRoutes);

// Central error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

export default app;
