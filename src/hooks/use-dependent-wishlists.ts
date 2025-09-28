import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Wishlist } from '@/types';
import { CreateWishlistData } from '@/types/wishlist';

// Query Keys
export const dependentWishlistKeys = {
  all: ['dependent-wishlists'] as const,
  lists: (dependentId: string) => [...dependentWishlistKeys.all, 'list', dependentId] as const,
  list: (dependentId: string, wishlistId: string) => [...dependentWishlistKeys.all, 'detail', dependentId, wishlistId] as const,
};

// Hook para buscar wishlists de um dependente
export function useDependentWishlists(dependentId: string) {
  return useQuery({
    queryKey: dependentWishlistKeys.lists(dependentId),
    queryFn: async (): Promise<Wishlist[]> => {
      const response = await api.get(`/users/dependents/${dependentId}/wishlists`);
      return response.data;
    },
    enabled: !!dependentId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para criar wishlist para um dependente
export function useCreateDependentWishlist(dependentId: string) {
  const queryClient = useQueryClient();

  return {
    ...useMutation({
      mutationFn: async (data: CreateWishlistData): Promise<Wishlist> => {
        const response = await api.post(`/dependents/${dependentId}/wishlists`, data);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: dependentWishlistKeys.lists(dependentId) });
        queryClient.invalidateQueries({ queryKey: ['dependents'] });
        queryClient.invalidateQueries({ queryKey: ['me'] });
        queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      },
    }),
    mutateAsync: async (data: CreateWishlistData) => {
      const response = await api.post(`/dependents/${dependentId}/wishlists`, data);
      queryClient.invalidateQueries({ queryKey: dependentWishlistKeys.lists(dependentId) });
      queryClient.invalidateQueries({ queryKey: ['dependents'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      return response.data;
    },
  };
}
