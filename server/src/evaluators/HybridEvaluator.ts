import { Evaluator } from './Evaluator';
import { RuleBasedEvaluator } from './RuleBasedEvaluator';
import { AIEvaluator } from './AIEvaluator';
import { Problem } from '../domain/Problem';
import { Submission } from '../domain/Submission';
import { EvaluationResultData } from '../domain/Rubric';

export class HybridEvaluator implements Evaluator {
  readonly name = 'HybridEvaluator';
  private ruleEvaluator: RuleBasedEvaluator;
  private aiEvaluator: AIEvaluator;

  constructor() {
    this.ruleEvaluator = new RuleBasedEvaluator();
    this.aiEvaluator = new AIEvaluator();
  }

  async evaluate(problem: Problem, submission: Submission): Promise<EvaluationResultData> {
    const hasApiKey = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim().length > 0);

    if (hasApiKey) {
      try {
        console.log('[HybridEvaluator] Invoking AI Evaluator via OpenAI API...');
        const aiResult = await this.aiEvaluator.evaluate(problem, submission);
        return {
          ...aiResult,
          evaluatorType: 'HYBRID',
        };
      } catch (err) {
        console.warn(
          `[HybridEvaluator] AI evaluation failed or timed out (${(err as Error).message}). Falling back to RuleBasedEvaluator.`
        );
      }
    } else {
      console.log('[HybridEvaluator] No OPENAI_API_KEY found. Proceeding with RuleBasedEvaluator.');
    }

    // Fallback or default to deterministic rule-based evaluation
    const ruleResult = await this.ruleEvaluator.evaluate(problem, submission);
    return {
      ...ruleResult,
      evaluatorType: hasApiKey ? 'HYBRID' : 'RULE_BASED',
    };
  }
}
