import { Evaluator } from './Evaluator';
import { Problem } from '../domain/Problem';
import { Submission } from '../domain/Submission';
import { EvaluationResultData, RUBRIC_CRITERIA } from '../domain/Rubric';

export class AIEvaluator implements Evaluator {
  readonly name = 'AIEvaluator';
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
    this.model = model || process.env.OPENAI_MODEL || 'gpt-4o-mini';
  }

  async evaluate(problem: Problem, submission: Submission): Promise<EvaluationResultData> {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY is not configured for AIEvaluator.');
    }

    const systemPrompt = `You are a Principal Software Architect and technical evaluator specializing in Object-Oriented Low-Level Design (LLD) assessments.
Your task is to evaluate a candidate's LLD submission against an authoritative 6-dimension rubric.

RUBRIC DIMENSIONS (Total 100 points):
${RUBRIC_CRITERIA.map(
  (c) => `- ${c.name} (Max ${c.weight} pts): ${c.description} Criteria questions: ${c.evaluationQuestions.join(' ')}`
).join('\n')}

GUIDELINES FOR EVALUATION:
1. Ground your evaluation strictly in the candidate's actual submission.
2. Quote specific evidence in the "evidence" field from their classes, relationships, flows, or diagram.
3. If there is a Single Responsibility (SRP) violation (such as coupling billing/pricing directly into an allocation or orchestrator class), pinpoint it clearly and explain the danger of regression when billing rules change.
4. Provide concrete, actionable "topActions" (redo tasks) that the candidate can follow to improve their design in a subsequent attempt.
5. You MUST return ONLY valid, minified JSON matching this schema:
{
  "overallScore": number (0-100, must equal sum of criterion scores),
  "summary": string,
  "criteria": [
    {
      "criterion": string (must match one of the 6 rubric names exactly),
      "score": number (0 to maxScore),
      "maxScore": number,
      "evidence": string[] (concrete items observed in submission),
      "concern": string or null (critique if score < maxScore),
      "suggestion": string (how to improve or achieve max score),
      "confidence": number (e.g. 0.85 - 1.0)
    }
  ],
  "topActions": [
    {
      "title": string,
      "description": string,
      "category": "Refactor" | "Pattern" | "Edge Case" | "Architecture"
    }
  ]
}`;

    const userPrompt = `PROBLEM:
Title: ${problem.title}
Difficulty: ${problem.difficulty}
Description: ${problem.description}
Requirements:
${problem.requirements.map((r, i) => `${i + 1}. ${r}`).join('\n')}
Constraints:
${problem.constraints.map((c, i) => `${i + 1}. ${c}`).join('\n')}

CANDIDATE SUBMISSION:
[Assumptions]
${submission.assumptions}

[Classes & Responsibilities]
${submission.classes}

[Relationships]
${submission.relationships}

[Key Flows]
${submission.flows}

[Design Explanation & Trade-offs]
${submission.designExplanation}

[Mermaid Diagram]
${submission.mermaidDiagram || 'None provided'}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenAI API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from OpenAI API.');
    }

    const parsed = JSON.parse(content);

    return {
      overallScore: parsed.overallScore,
      evaluatorType: 'AI',
      model: this.model,
      summary: parsed.summary,
      criteria: parsed.criteria,
      topActions: parsed.topActions || [],
    };
  }
}
