import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { UpdateLanguageDto } from '@/types/auth-dto';

export function useUpdateLanguage() {
  const queryClient = useQueryClient();
  const { setUser, user } = useAuthStore();

  return useMutation({
    mutationFn: async (data: UpdateLanguageDto): Promise<{ language: string }> => {
      const response = await api.put('/users/me/language', data);
      return response.data;
    },
    onSuccess: (data) => {
      // Atualizar o idioma do usuário no store
      if (user) {
        const updatedUser = {
          ...user,
          language: data.language,
        };
        setUser(updatedUser);

        // Atualizar no localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }

      // Invalidar queries relacionadas ao usuário
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
}

