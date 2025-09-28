import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface UseDeleteItemProps {
  wishlistId: string;
}

export function useDeleteItem({ wishlistId }: UseDeleteItemProps) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string): Promise<void> => {
      await api.delete(`/items/${itemId}`);
    },
    onSuccess: () => {
      // Invalidar a query da wishlist específica usando a chave correta
      queryClient.invalidateQueries({ queryKey: ['wishlists', 'detail', wishlistId] });
      // Invalidar outras queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      queryClient.invalidateQueries({ queryKey: ['my-wishlists'] });

      // Exibir toast de sucesso
      toast.success('Item excluído com sucesso!');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir item';
      toast.error(errorMessage);
    },
  });
}
