import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

interface UpdateWishlistData {
  title: string;
  description?: string;
}

interface UpdateWishlistResponse {
  id: string;
  title: string;
  description?: string;
  isPublic: boolean;
  ownerId: string;
  ownerName: string;
  items: unknown[];
  createdAt: string;
  updatedAt: string;
}

export function useUpdateWishlist(wishlistId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateWishlistData): Promise<UpdateWishlistResponse> => {
      const response = await api.put(`/wishlists/${wishlistId}`, data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidar a query da wishlist específica
      queryClient.invalidateQueries({ queryKey: ['wishlist', wishlistId] });
      // Invalidar a lista de wishlists do usuário
      queryClient.invalidateQueries({ queryKey: ['wishlists', 'mine'] });
      queryClient.invalidateQueries({ queryKey: ['my-wishlists'] });
    },
  });
}
