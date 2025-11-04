import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/lib/authService';
import toast from 'react-hot-toast';

interface ConfirmRegistrationParams {
  username: string;
  code: string;
}

export function useConfirmRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ username, code }: ConfirmRegistrationParams) => {
      await authService.confirmRegistration(username, code);
    },
    onSuccess: () => {
      toast.success('E-mail verificado com sucesso!');
      // Invalidar queries para atualizar o status do usuário
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (error: unknown) => {
      console.error('Erro ao confirmar registro:', error);
      toast.error('Código inválido ou expirado. Tente novamente.');
    },
  });
}

