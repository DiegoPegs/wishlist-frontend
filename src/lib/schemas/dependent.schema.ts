import { z } from 'zod';

export const createDependentSchema = z.object({
  fullName: z.string().min(3, 'O nome completo é obrigatório.'),

  // A lógica de preprocess para as datas está correta e permanece.
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

  // --- A FORMA CORRETA E SIMPLES ---
  // A mensagem de erro é passada diretamente no segundo argumento.
  // Isso cobre o caso do valor inicial ser '', que não é um membro do enum.
  relationship: z.enum(
    ['CHILD', 'SIBLING', 'NEPHEW_NIECE', 'OTHER'],
    {
      message: 'Selecione um parentesco válido.',
    }
  ),
});

export type CreateDependentData = z.infer<typeof createDependentSchema>;