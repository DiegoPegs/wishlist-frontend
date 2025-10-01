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

export const createDependentSchema = z.object({
  fullName: z.string().min(3, 'O nome completo é obrigatório.'),

  // Apply this preprocessing logic to fix the "received string" error.
  birthDay: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().min(1).max(31).optional()
  ),
  birthMonth: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().min(1).max(12).optional()
  ),
  birthYear: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().min(1900).max(new Date().getFullYear()).optional()
  ),

  // This part is already correct, keep it as is.
  relationship: z.enum(
    ['son', 'daughter', 'brother', 'sister', 'nephew', 'niece', 'other']
  ).refine(
    (val) => val !== undefined,
    { message: 'Selecione um parentesco válido.' }
  ),
});

export type CreateDependentData = z.infer<typeof createDependentSchema>;

// Schema para o formulário (aceita strings vazias)
export const createDependentFormSchema = z.object({
  fullName: z.string().min(3, 'O nome completo é obrigatório.'),
  birthDay: z.string(),
  birthMonth: z.string(),
  birthYear: z.string(),
  relationship: z.string().min(1, 'Selecione um parentesco válido.'),
});

export type CreateDependentFormData = z.infer<typeof createDependentFormSchema>;
