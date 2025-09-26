import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { UserProfile, UpdateUserDto } from '@/types/auth-dto';
import { useAuthStore } from '@/store/auth.store';
import { isValidBirthDate } from '@/lib/dateUtils';

// Interface para os dados de atualização do usuário (alias para compatibilidade)
export type UpdateUserData = UpdateUserDto;

// Hook para atualizar dados do usuário
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: async (data: UpdateUserData): Promise<UserProfile> => {
      try {
        // Validar dados antes de enviar
        if (!data.name || !data.birthDate) {
          throw new Error('Nome e data de nascimento são obrigatórios');
        }

        // Validar estrutura da data de nascimento
        const { day, month, year } = data.birthDate;
        if (!day || !month) {
          throw new Error('Dia e mês são obrigatórios');
        }

        // Validar se a data é válida
        if (!isValidBirthDate(data.birthDate)) {
          throw new Error('Data de nascimento inválida');
        }

        // Estrutura de dados para o backend
        const requestData = {
          name: data.name.trim(),
          birthDate: {
            day: Number(day),
            month: Number(month),
            year: year ? Number(year) : undefined,
          },
        };

        const response = await api.put('/users/me', requestData);
        return response.data;
      } catch (error: any) {
        throw error;
      }
    },
    onSuccess: (data) => {
      // Invalidar queries relacionadas ao usuário
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });

      // Atualizar dados do usuário no store
      const updatedUser = {
        id: data.id,
        email: data.email,
        name: data.name,
        birthDate: data.birthDate,
        emailVerified: data.emailVerified,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };

      setUser(updatedUser);

      // Atualizar dados do usuário no localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    },
  });
}
