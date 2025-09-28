import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface UseChangeItemQuantityProps {
  wishlistId: string;
}

interface ChangeQuantityData {
  desired: number;
}

export function useChangeItemQuantity({ wishlistId }: UseChangeItemQuantityProps) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, data }: { itemId: string; data: ChangeQuantityData }): Promise<void> => {
      await api.patch(`/items/${itemId}/quantity`, data);
    },
    onSuccess: () => {
      // Invalidate the specific wishlist query to refetch items
      queryClient.invalidateQueries({ queryKey: ['wishlists', 'detail', wishlistId] });
      // Invalidate other related queries if necessary
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      queryClient.invalidateQueries({ queryKey: ['my-wishlists'] });

      toast.success('Quantidade atualizada com sucesso!');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar quantidade';
      toast.error(errorMessage);
    },
  });
}
