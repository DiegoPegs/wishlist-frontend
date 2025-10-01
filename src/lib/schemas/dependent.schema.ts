import { z } from 'zod';

export const dependentSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  birthDate: z.object({
    day: z.number().min(1).max(31).optional().nullable(),
    month: z.number().min(1).max(12).optional().nullable(),
    year: z.number().optional().nullable(),
  }).optional(),
  relationship: z.enum(["son", "daughter", "brother", "sister", "nephew", "niece", "other"]).refine(
    (val) => val !== undefined,
    { message: 'Por favor, selecione o parentesco.' }
  ),
});

export type DependentFormData = z.infer<typeof dependentSchema>;
