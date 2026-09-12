import { describe, it, expect } from 'vitest';
import { ValidationService } from '../src/services/ValidationService';

describe('ValidationService', () => {
  const service = new ValidationService();

  it('rejects submissions with empty or too short fields', () => {
    const result = service.validateSubmission({
      assumptions: 'too short',
      classes: 'too short',
      relationships: 'short',
      flows: 'flow',
      designExplanation: 'short',
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('validates a correct submission payload', () => {
    const result = service.validateSubmission({
      assumptions: 'Assume multi-level structure with standard gate sensors.',
      classes: 'class ParkingLot { private levels: Level[]; }\nclass Spot { private size: SpotSize; }',
      relationships: 'ParkingLot has-many Level, Level has-many Spot.',
      flows: 'Vehicle arrives -> ticket issued -> parked in allocated spot -> exit payment.',
      designExplanation: 'Used Strategy pattern for pricing to allow runtime algorithm swapping without modifying ParkingLot.',
      mermaidDiagram: 'classDiagram\nclass ParkingLot {\n  +parkVehicle()\n}',
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('detects mismatched braces and missing classDiagram header in Mermaid code', () => {
    const invalidHeader = service.validateMermaidDiagram('graph TD\nA --> B');
    expect(invalidHeader.isValid).toBe(false);
    expect(invalidHeader.errors[0]).toContain('must start with "classDiagram"');

    const mismatchedBraces = service.validateMermaidDiagram('classDiagram\nclass Car {\n  +drive()');
    expect(mismatchedBraces.isValid).toBe(false);
    expect(mismatchedBraces.errors[0]).toContain('Mismatched braces');
  });
});
