import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface UseUpdateItemProps {
  wishlistId: string;
}

interface UpdateItemData {
  title?: string;
  description?: string;
  link?: string;
  imageUrl?: string;
  notes?: string;
  price?: number | { min?: number; max?: number };
}

export function useUpdateItem({ wishlistId }: UseUpdateItemProps) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, data }: { itemId: string; data: UpdateItemData }): Promise<void> => {
      await api.put(`/items/${itemId}`, data);
    },
    onSuccess: () => {
      // Invalidar a query da wishlist específica
      queryClient.invalidateQueries({ queryKey: ['wishlists', 'detail', wishlistId] });
      // Invalidar outras queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      queryClient.invalidateQueries({ queryKey: ['my-wishlists'] });

      // Exibir toast de sucesso
      toast.success('Item atualizado com sucesso!');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar item';
      toast.error(errorMessage);
    },
  });
}
