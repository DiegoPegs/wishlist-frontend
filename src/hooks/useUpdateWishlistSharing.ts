import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { UpdateWishlistSharingData } from '@/types/wishlist';

// Hook para atualizar configurações de compartilhamento de uma wishlist
export function useUpdateWishlistSharing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      wishlistId,
      data
    }: {
      wishlistId: string;
      data: UpdateWishlistSharingData
    }): Promise<void> => {
      await api.patch(`/wishlists/${wishlistId}/sharing`, data);
    },
    onSuccess: (_, { wishlistId }) => {
      // Invalidar a query da wishlist específica
      queryClient.invalidateQueries({ queryKey: ['wishlists', 'detail', wishlistId] });
      // Invalidar também a lista de wishlists do usuário
      queryClient.invalidateQueries({ queryKey: ['wishlists', 'mine'] });
      queryClient.invalidateQueries({ queryKey: ['my-wishlists'] });
      // Invalidar todas as queries de wishlists
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
    },
  });
}
