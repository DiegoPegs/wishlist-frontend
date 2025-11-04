import { useMutation } from '@tanstack/react-query';
import { authService } from '@/lib/authService';
import toast from 'react-hot-toast';

export function useResendVerificationEmail() {
  return useMutation({
    mutationFn: async () => {
      await authService.resendVerificationEmail();
    },
    onSuccess: () => {
      toast.success('E-mail de verificação reenviado!');
    },
    onError: (error: unknown) => {
      console.error('Erro ao reenviar email de verificação:', error);
      toast.error('Erro ao enviar email de verificação. Tente novamente.');
    },
  });
}

