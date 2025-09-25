import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Wishlist, CreateWishlistData, UpdateWishlistData, CreateItemData, UpdateItemData, ReservationData } from '@/types/wishlist';
import { dependentWishlistKeys } from './use-dependent-wishlists';

// Query Keys
export const wishlistKeys = {
  all: ['wishlists'] as const,
  lists: () => [...wishlistKeys.all, 'list'] as const,
  list: (id: string) => [...wishlistKeys.all, 'detail', id] as const,
  mine: () => [...wishlistKeys.lists(), 'mine'] as const,
};

// Hook para buscar minhas wishlists
export function useWishlists() {
  return useQuery({
    queryKey: wishlistKeys.mine(),
    queryFn: async (): Promise<Wishlist[]> => {
      const response = await api.get('/wishlists/mine');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para buscar uma wishlist específica
export function useWishlist(id: string) {
  return useQuery({
    queryKey: wishlistKeys.list(id),
    queryFn: async (): Promise<Wishlist> => {
      const response = await api.get(`/wishlists/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para criar uma nova wishlist
export function useCreateWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateWishlistData): Promise<Wishlist> => {
      const response = await api.post('/wishlists', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.mine() });
    },
  });
}

// Hook para atualizar uma wishlist
export function useUpdateWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateWishlistData }): Promise<Wishlist> => {
      const response = await api.put(`/wishlists/${id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.mine() });
      queryClient.invalidateQueries({ queryKey: wishlistKeys.list(data.id) });
    },
  });
}

// Hook para excluir uma wishlist
export function useDeleteWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/wishlists/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.mine() });
    },
  });
}

// Hook para adicionar item a uma wishlist
export function useAddItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ wishlistId, data }: { wishlistId: string; data: CreateItemData }): Promise<Wishlist> => {
      const response = await api.post(`/wishlists/${wishlistId}/items`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.mine() });
      queryClient.invalidateQueries({ queryKey: wishlistKeys.list(data.id) });
    },
  });
}

// Hook para criar item (alias para useAddItem com interface simplificada)
export function useCreateItem(wishlistId: string) {
  const addItemMutation = useAddItem();

  return {
    ...addItemMutation,
    mutateAsync: async (data: CreateItemData) => {
      return addItemMutation.mutateAsync({ wishlistId, data });
    },
  };
}

// Hook para atualizar um item
export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      wishlistId,
      itemId,
      data
    }: {
      wishlistId: string;
      itemId: string;
      data: UpdateItemData
    }): Promise<Wishlist> => {
      const response = await api.put(`/wishlists/${wishlistId}/items/${itemId}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.mine() });
      queryClient.invalidateQueries({ queryKey: wishlistKeys.list(data.id) });
    },
  });
}

// Hook para excluir um item
export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ wishlistId, itemId }: { wishlistId: string; itemId: string }): Promise<void> => {
      await api.delete(`/wishlists/${wishlistId}/items/${itemId}`);
    },
    onSuccess: (_, { wishlistId }) => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.mine() });
      queryClient.invalidateQueries({ queryKey: wishlistKeys.list(wishlistId) });
    },
  });
}

// Hook para reservar um item
export function useReserveItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ReservationData): Promise<void> => {
      await api.post('/reservations', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
      queryClient.invalidateQueries({ queryKey: dependentWishlistKeys.all });
    },
  });
}
