import { z } from 'zod';

export const SubmissionSchema = z.object({
  assumptions: z.string().min(10, 'Assumptions must be at least 10 characters long.'),
  classes: z.string().min(20, 'Classes & Responsibilities must be at least 20 characters long.'),
  relationships: z.string().min(10, 'Relationships must be at least 10 characters long.'),
  flows: z.string().min(15, 'Key Flows must be at least 15 characters long.'),
  designExplanation: z.string().min(20, 'Design Explanation & Trade-offs must be at least 20 characters long.'),
  mermaidDiagram: z.string().optional().nullable(),
});

export type SubmissionInput = z.infer<typeof SubmissionSchema>;

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  mermaidWarnings?: string[];
}

export class ValidationService {
  validateSubmission(data: unknown): { isValid: boolean; data?: SubmissionInput; errors: string[] } {
    const parsed = SubmissionSchema.safeParse(data);
    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
      return { isValid: false, errors };
    }

    const errors: string[] = [];

    // Additional deterministic checks
    if (parsed.data.mermaidDiagram && parsed.data.mermaidDiagram.trim().length > 0) {
      const diagramValidation = this.validateMermaidDiagram(parsed.data.mermaidDiagram);
      if (!diagramValidation.isValid) {
        errors.push(...diagramValidation.errors);
      }
    }

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    return { isValid: true, data: parsed.data, errors: [] };
  }

  validateMermaidDiagram(mermaidCode: string): { isValid: boolean; errors: string[] } {
    const trimmed = mermaidCode.trim();
    if (!trimmed) return { isValid: true, errors: [] };

    const errors: string[] = [];

    // Class diagram must begin with classDiagram
    const firstLine = trimmed.split('\n')[0].trim().toLowerCase();
    if (!firstLine.startsWith('classdiagram')) {
      errors.push('Mermaid diagram must start with "classDiagram".');
    }

    // Check for unbalanced braces { }
    const openBraces = (trimmed.match(/{/g) || []).length;
    const closeBraces = (trimmed.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push(`Mismatched braces in Mermaid code: ${openBraces} opening vs ${closeBraces} closing.`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
