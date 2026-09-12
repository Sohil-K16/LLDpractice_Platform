import { Problem, Attempt, Evaluation, RubricCriterionInfo } from '../types';

const API_BASE = 'http://localhost:5000/api';

export async function fetchProblems(): Promise<Problem[]> {
  const res = await fetch(`${API_BASE}/problems`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch problems');
  return json.data;
}

export async function fetchProblemById(id: string): Promise<Problem> {
  const res = await fetch(`${API_BASE}/problems/${id}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch problem');
  return json.data;
}

export async function fetchProblemBySlug(slug: string): Promise<Problem> {
  const res = await fetch(`${API_BASE}/problems/slug/${slug}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch problem');
  return json.data;
}

export async function createAttempt(problemId: string, userId = 'demo-user-001'): Promise<Attempt> {
  const res = await fetch(`${API_BASE}/attempts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problemId, userId }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to create attempt');
  return json.data;
}

export async function fetchAttempt(id: string): Promise<Attempt> {
  const res = await fetch(`${API_BASE}/attempts/${id}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch attempt');
  return json.data;
}

export async function fetchAttemptsForProblem(problemId: string): Promise<Attempt[]> {
  const res = await fetch(`${API_BASE}/attempts/problem/${problemId}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch attempts');
  return json.data;
}

export interface SubmissionPayload {
  assumptions: string;
  classes: string;
  relationships: string;
  flows: string;
  designExplanation: string;
  mermaidDiagram?: string | null;
}

export async function submitSolution(attemptId: string, payload: SubmissionPayload): Promise<{ attemptId: string; evaluation: Evaluation }> {
  const res = await fetch(`${API_BASE}/attempts/${attemptId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to submit solution');
  return json.data;
}

export async function fetchEvaluation(attemptId: string): Promise<Evaluation> {
  const res = await fetch(`${API_BASE}/evaluations/attempt/${attemptId}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch evaluation');
  return json.data;
}

export async function fetchRubric(): Promise<{ rubricVersion: string; totalPoints: number; criteria: RubricCriterionInfo[] }> {
  const res = await fetch(`${API_BASE}/evaluations/rubric`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch rubric');
  return json.data;
}
