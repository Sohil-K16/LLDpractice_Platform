import { describe, it, expect } from 'vitest';
import { RuleBasedEvaluator } from '../src/evaluators/RuleBasedEvaluator';
import { Problem } from '../src/domain/Problem';
import { Submission } from '../src/domain/Submission';

describe('RuleBasedEvaluator', () => {
  const evaluator = new RuleBasedEvaluator();

  const mockProblem = new Problem({
    id: 'prob-1',
    title: 'Design a Parking Lot System',
    slug: 'parking-lot',
    difficulty: 'Medium',
    description: 'Design a parking lot system',
    requirements: ['Multiple spots', 'Vehicle types', 'Tickets', 'Pricing'],
    constraints: ['Thread safety'],
    concepts: ['Strategy Pattern'],
  });

  it('evaluates submission and identifies SRP violation when ParkingLot directly computes fees', async () => {
    const godClassSubmission = new Submission({
      attemptId: 'att-1',
      assumptions: 'Single entrance and exit with automated gates.',
      classes: `
        class ParkingLot {
          spots: Spot[];
          calculateFee(ticket: Ticket): number {
            return ticket.duration * 20; // Violates SRP
          }
        }
      `,
      relationships: 'ParkingLot contains Spot',
      flows: 'Vehicle enters -> ticket created -> vehicle exits -> ParkingLot calculates fee',
      designExplanation: 'Simple all-in-one design.',
      mermaidDiagram: 'classDiagram\nclass ParkingLot {\n  +calculateFee()\n}',
    });

    const result = await evaluator.evaluate(mockProblem, godClassSubmission);

    expect(result.overallScore).toBeGreaterThan(0);
    expect(result.criteria).toHaveLength(6);

    const srpCriterion = result.criteria.find((c) => c.criterion === 'Class Responsibilities & SRP');
    expect(srpCriterion).toBeDefined();
    expect(srpCriterion?.concern).toContain('violating Single Responsibility Principle');

    const decoupleAction = result.topActions.find((a) => a.title.includes('Decouple Pricing'));
    expect(decoupleAction).toBeDefined();
  });

  it('rewards clean modular design with Strategy pattern and interfaces', async () => {
    const modularSubmission = new Submission({
      attemptId: 'att-2',
      assumptions: 'Multiple gates, concurrent threads, 24/7 automated operations.',
      classes: `
        interface PricingStrategy { calculateFee(ticket: Ticket): number; }
        class HourlyPricingStrategy implements PricingStrategy { ... }
        class ParkingLot {
          private spotService: SpotAssignmentStrategy;
          private pricingStrategy: PricingStrategy;
        }
        class VehicleFactory { ... }
      `,
      relationships: 'ParkingLot uses PricingStrategy, SpotAssignmentStrategy',
      flows: 'Entry gate calls SpotAssignmentStrategy -> issues Ticket. Exit gate calls PricingStrategy -> marks Spot empty.',
      designExplanation: 'Decoupled spot allocation from payment using Strategy Pattern. Vehicles instantiated via Factory Pattern. Thread safe spot locks.',
      mermaidDiagram: 'classDiagram\nclass PricingStrategy {\n  <<interface>>\n  +calculateFee()\n}\nParkingLot --> PricingStrategy',
    });

    const result = await evaluator.evaluate(mockProblem, modularSubmission);

    expect(result.overallScore).toBeGreaterThan(75);
    const patternCriterion = result.criteria.find((c) => c.criterion === 'Extensibility & Design Patterns');
    expect(patternCriterion?.score).toBeGreaterThanOrEqual(15);
  });
});
