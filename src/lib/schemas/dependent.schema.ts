import { z } from 'zod';

export const dependentSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres.'),
  birthDate: z.object({
    day: z.number().min(1, 'Dia deve ser entre 1 e 31').max(31, 'Dia deve ser entre 1 e 31'),
    month: z.number().min(1, 'Mês deve ser entre 1 e 12').max(12, 'Mês deve ser entre 1 e 12'),
    year: z.number().min(1900, 'Ano deve ser maior que 1900').max(new Date().getFullYear(), 'Ano não pode ser no futuro').optional(),
  }).optional(),
  parentesco: z.enum(["son", "daughter", "brother", "sister", "nephew", "niece", "other"], {
    message: 'Por favor, selecione o parentesco.',
  }),
});

export type DependentFormData = z.infer<typeof dependentSchema>;
