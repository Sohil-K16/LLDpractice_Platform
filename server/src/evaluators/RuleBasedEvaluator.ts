import { Evaluator } from './Evaluator';
import { Problem } from '../domain/Problem';
import { Submission } from '../domain/Submission';
import {
  EvaluationResultData,
  RUBRIC_CRITERIA,
  CriterionResultData,
  FeedbackActionData,
} from '../domain/Rubric';

export class RuleBasedEvaluator implements Evaluator {
  readonly name = 'RuleBasedEvaluator';

  async evaluate(problem: Problem, submission: Submission): Promise<EvaluationResultData> {
    const textCorpus = [
      submission.assumptions,
      submission.classes,
      submission.relationships,
      submission.flows,
      submission.designExplanation,
      submission.mermaidDiagram || '',
    ]
      .join('\n')
      .toLowerCase();

    const classesText = submission.classes.toLowerCase();
    const explanationText = submission.designExplanation.toLowerCase();
    const mermaidText = (submission.mermaidDiagram || '').toLowerCase();

    const criteriaResults: CriterionResultData[] = [];
    const topActions: FeedbackActionData[] = [];

    // --- 1. Requirements Understanding (Max 20) ---
    const reqCriterion = RUBRIC_CRITERIA.find((c) => c.id === 'requirements_understanding')!;
    let reqScore = 12;
    const reqEvidence: string[] = [];

    // Problem-specific entity matches
    if (problem.slug === 'parking-lot') {
      const mentionsSpot = textCorpus.includes('spot') || textCorpus.includes('space');
      const mentionsVehicle = textCorpus.includes('vehicle') || textCorpus.includes('car');
      const mentionsTicket = textCorpus.includes('ticket');
      const mentionsPayment = textCorpus.includes('fee') || textCorpus.includes('payment') || textCorpus.includes('pricing');

      if (mentionsSpot) reqEvidence.push('Correctly identified spot/slot allocation entities.');
      if (mentionsVehicle) reqEvidence.push('Modelled vehicle types and dimensional compatibility.');
      if (mentionsTicket) reqEvidence.push('Integrated ticketing lifecycle for entry/exit auditing.');
      if (mentionsPayment) reqEvidence.push('Included parking duration and fee computation.');

      const count = [mentionsSpot, mentionsVehicle, mentionsTicket, mentionsPayment].filter(Boolean).length;
      reqScore = Math.min(20, 10 + count * 2.5);
    } else if (problem.slug === 'vending-machine') {
      const mentionsItem = textCorpus.includes('item') || textCorpus.includes('product') || textCorpus.includes('inventory');
      const mentionsMoney = textCorpus.includes('coin') || textCorpus.includes('cash') || textCorpus.includes('balance');
      const mentionsState = textCorpus.includes('state') || textCorpus.includes('dispense');
      const mentionsChange = textCorpus.includes('change') || textCorpus.includes('refund');

      if (mentionsItem) reqEvidence.push('Handled item inventory and shelf representation.');
      if (mentionsMoney) reqEvidence.push('Tracked deposited balance and denomination storage.');
      if (mentionsState) reqEvidence.push('Addressed operational state transitions.');
      if (mentionsChange) reqEvidence.push('Formulated change refund mechanisms.');

      const count = [mentionsItem, mentionsMoney, mentionsState, mentionsChange].filter(Boolean).length;
      reqScore = Math.min(20, 10 + count * 2.5);
    } else {
      // General Elevator or other problems
      const mentionsFloor = textCorpus.includes('floor');
      const mentionsCar = textCorpus.includes('car') || textCorpus.includes('elevator') || textCorpus.includes('cabin');
      const mentionsRequest = textCorpus.includes('request') || textCorpus.includes('button') || textCorpus.includes('call');
      const mentionsDispatch = textCorpus.includes('dispatch') || textCorpus.includes('scheduler') || textCorpus.includes('direction');

      if (mentionsFloor) reqEvidence.push('Detailed multi-floor modeling.');
      if (mentionsCar) reqEvidence.push('Specified elevator car state and capacity.');
      if (mentionsRequest) reqEvidence.push('Distinguished internal vs external requests.');
      if (mentionsDispatch) reqEvidence.push('Outlined scheduling/dispatch orchestration.');

      const count = [mentionsFloor, mentionsCar, mentionsRequest, mentionsDispatch].filter(Boolean).length;
      reqScore = Math.min(20, 10 + count * 2.5);
    }

    if (submission.assumptions.trim().length > 30) {
      reqEvidence.push('Documented practical operational assumptions in scoping.');
      reqScore = Math.min(20, reqScore + 2);
    }

    criteriaResults.push({
      criterion: reqCriterion.name,
      score: Math.round(reqScore),
      maxScore: reqCriterion.weight,
      evidence: reqEvidence.length > 0 ? reqEvidence : ['Basic functional domain terms present.'],
      concern: reqScore < 16 ? 'Several boundary constraints or operational flows were not explicitly addressed.' : undefined,
      suggestion: 'Clarify corner constraints like multi-gate concurrency and edge throughput capacity.',
      confidence: 0.95,
    });

    // --- 2. Class Responsibilities & SRP (Max 20) ---
    const srpCriterion = RUBRIC_CRITERIA.find((c) => c.id === 'class_responsibilities')!;
    let srpScore = 14;
    const srpEvidence: string[] = [];
    let srpConcern: string | undefined;
    let srpSuggestion: string | undefined;

    // Check for God-class SRP violation: e.g. ParkingLot doing both allocation and pricing
    const hasGodParking =
      classesText.includes('parkinglot') &&
      (classesText.includes('fee') || classesText.includes('price') || classesText.includes('payment')) &&
      !classesText.includes('pricingstrategy') &&
      !classesText.includes('paymentservice');

    if (hasGodParking) {
      srpScore = 12;
      srpEvidence.push('The primary orchestrator class handles both resource allocation and fee computation.');
      srpConcern = 'ParkingLot class combines spot allocation with pricing policies, violating Single Responsibility Principle (SRP). Changes in billing logic will risk breaking allocation logic.';
      srpSuggestion = 'Extract pricing calculation into a dedicated PricingStrategy or PaymentService interface.';
      topActions.push({
        title: 'Decouple Pricing from Allocation',
        description: 'Separate spot assignment from pricing policy by introducing an independent PricingStrategy interface.',
        category: 'Refactor',
      });
    } else {
      srpScore = 18;
      srpEvidence.push('Separation of concerns observed between coordinator, models, and utility services.');
      srpSuggestion = 'Ensure domain entities remain pure and keep persistence/network IO out of core entities.';
    }

    // Check if separate classes defined
    const classCountGuess = (submission.classes.match(/\b(class|struct|interface)\b/gi) || []).length;
    if (classCountGuess >= 4) {
      srpEvidence.push(`Clean modularity with ${classCountGuess}+ distinct domain classes/interfaces.`);
    }

    criteriaResults.push({
      criterion: srpCriterion.name,
      score: Math.min(20, Math.round(srpScore)),
      maxScore: srpCriterion.weight,
      evidence: srpEvidence,
      concern: srpConcern,
      suggestion: srpSuggestion,
      confidence: 0.92,
    });

    // --- 3. Coupling & Interfaces (Max 15) ---
    const couplingCriterion = RUBRIC_CRITERIA.find((c) => c.id === 'coupling_and_interfaces')!;
    let couplingScore = 10;
    const couplingEvidence: string[] = [];

    const hasInterfaces =
      textCorpus.includes('interface') ||
      textCorpus.includes('abstract class') ||
      mermaidText.includes('<|..') ||
      mermaidText.includes('<<interface>>');

    if (hasInterfaces) {
      couplingScore += 4;
      couplingEvidence.push('Applied interface abstractions for polymorphic pluggability.');
    } else {
      couplingEvidence.push('Direct concrete class references used without interface isolation.');
    }

    criteriaResults.push({
      criterion: couplingCriterion.name,
      score: Math.min(15, Math.round(couplingScore)),
      maxScore: couplingCriterion.weight,
      evidence: couplingEvidence,
      concern: !hasInterfaces ? 'Concrete class coupling prevents easy unit mocking and strategy swapping.' : undefined,
      suggestion: 'Introduce interfaces for components likely to change (e.g. PaymentGateway, SpotAssignmentStrategy, DispatchPolicy).',
      confidence: 0.9,
    });

    // --- 4. Extensibility & Design Patterns (Max 20) ---
    const patternCriterion = RUBRIC_CRITERIA.find((c) => c.id === 'extensibility_and_patterns')!;
    let patternScore = 12;
    const patternEvidence: string[] = [];

    const patternsDetected: string[] = [];
    if (textCorpus.includes('strategy')) patternsDetected.push('Strategy Pattern');
    if (textCorpus.includes('factory')) patternsDetected.push('Factory Pattern');
    if (textCorpus.includes('state')) patternsDetected.push('State Pattern');
    if (textCorpus.includes('observer') || textCorpus.includes('listener')) patternsDetected.push('Observer Pattern');
    if (textCorpus.includes('singleton')) patternsDetected.push('Singleton Pattern');
    if (textCorpus.includes('command')) patternsDetected.push('Command Pattern');

    if (patternsDetected.length > 0) {
      patternEvidence.push(`Identified design patterns: ${patternsDetected.join(', ')}.`);
      patternScore += Math.min(7, patternsDetected.length * 2.5);
    } else {
      patternEvidence.push('Relies primarily on procedural or rigid conditional structures.');
      topActions.push({
        title: 'Apply Strategy or State Pattern',
        description: 'Replace switch/if conditionals with appropriate GoF behavioral patterns to adhere to Open-Closed Principle.',
        category: 'Pattern',
      });
    }

    criteriaResults.push({
      criterion: patternCriterion.name,
      score: Math.min(20, Math.round(patternScore)),
      maxScore: patternCriterion.weight,
      evidence: patternEvidence,
      concern: patternsDetected.length === 0 ? 'Hardcoded logic will require modifying existing code for new feature variations.' : undefined,
      suggestion: 'Leverage Strategy pattern for algorithmic policies and State pattern for lifecycle machines.',
      confidence: 0.92,
    });

    // --- 5. Edge Cases & Testability (Max 10) ---
    const edgeCriterion = RUBRIC_CRITERIA.find((c) => c.id === 'edge_cases_and_testability')!;
    let edgeScore = 6;
    const edgeEvidence: string[] = [];

    const mentionsConcurrency = textCorpus.includes('thread') || textCorpus.includes('lock') || textCorpus.includes('concurrent') || textCorpus.includes('synchronized');
    const mentionsCapacity = textCorpus.includes('full') || textCorpus.includes('exhausted') || textCorpus.includes('overflow') || textCorpus.includes('empty');
    const mentionsError = textCorpus.includes('exception') || textCorpus.includes('rollback') || textCorpus.includes('invalid') || textCorpus.includes('timeout');

    if (mentionsConcurrency) {
      edgeEvidence.push('Addressed thread-safety or concurrency control.');
      edgeScore += 1.5;
    }
    if (mentionsCapacity) {
      edgeEvidence.push('Considered full-capacity and boundary constraints.');
      edgeScore += 1.5;
    }
    if (mentionsError) {
      edgeEvidence.push('Handled error conditions and graceful degradation.');
      edgeScore += 1;
    }

    if (edgeEvidence.length === 0) {
      edgeEvidence.push('Limited explicit handling of edge cases and concurrency.');
      topActions.push({
        title: 'Formulate Edge Cases & Concurrency Handling',
        description: 'Detail exact system behavior when capacity is exhausted or concurrent conflicting requests arrive simultaneously.',
        category: 'Edge Case',
      });
    }

    criteriaResults.push({
      criterion: edgeCriterion.name,
      score: Math.min(10, Math.round(edgeScore)),
      maxScore: edgeCriterion.weight,
      evidence: edgeEvidence,
      concern: edgeScore < 8 ? 'Boundary edge cases and thread safety were not thoroughly elaborated.' : undefined,
      suggestion: 'Document concurrency mechanisms (locks, atomic counters) and test mocking hooks.',
      confidence: 0.88,
    });

    // --- 6. Explanation & Trade-offs (Max 15) ---
    const tradeOffCriterion = RUBRIC_CRITERIA.find((c) => c.id === 'explanation_and_tradeoffs')!;
    let tradeOffScore = 9;
    const tradeOffEvidence: string[] = [];

    if (explanationText.length > 200) {
      tradeOffScore += 4;
      tradeOffEvidence.push('Comprehensive narrative explaining structural choices.');
    } else {
      tradeOffEvidence.push('Brief design summary provided.');
    }

    if (explanationText.includes('trade') || explanationText.includes('alternative') || explanationText.includes('versus') || explanationText.includes('vs')) {
      tradeOffScore += 2;
      tradeOffEvidence.push('Explicitly evaluated trade-offs between architectural options.');
    } else {
      topActions.push({
        title: 'Document Architectural Trade-offs',
        description: 'Explain why alternative designs (e.g. relational vs in-memory caching, polling vs event-driven) were dismissed.',
        category: 'Architecture',
      });
    }

    criteriaResults.push({
      criterion: tradeOffCriterion.name,
      score: Math.min(15, Math.round(tradeOffScore)),
      maxScore: tradeOffCriterion.weight,
      evidence: tradeOffEvidence,
      concern: tradeOffScore < 12 ? 'Design explanation lacks deep evaluation of alternative architectures.' : undefined,
      suggestion: 'Articulate the rationale for selected data structures and design trade-offs.',
      confidence: 0.94,
    });

    // Compute overall score
    const overallScore = criteriaResults.reduce((acc, c) => acc + c.score, 0);

    // Summary
    const summary = `Submission evaluated against 6 core LLD dimensions. Overall score: ${overallScore}/100. Strongest area: ${
      criteriaResults.slice().sort((a, b) => b.score / b.maxScore - a.score / a.maxScore)[0].criterion
    }. Key areas for improvement include: ${topActions.slice(0, 2).map((a) => a.title).join(' and ')}.`;

    return {
      overallScore,
      evaluatorType: 'RULE_BASED',
      model: 'deterministic-rule-engine-v1',
      summary,
      criteria: criteriaResults,
      topActions: topActions.slice(0, 3),
    };
  }
}
