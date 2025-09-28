import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

// Tipos para itens (baseado no backend)
export interface Item {
  id: string;
  title: string;
  description?: string;
  price?: number;
  currency?: string;
  url?: string;
  imageUrl?: string;
  quantity?: number;
  reservedBy?: string;
  reservedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateItemMetadataData {
  title?: string;
  description?: string;
  price?: number;
  currency?: string;
  url?: string;
  imageUrl?: string;
}

export interface UpdateItemData {
  title?: string;
  description?: string;
  price?: number | { min?: number; max?: number };
  currency?: string;
  url?: string;
  imageUrl?: string;
  quantity?: number;
  itemType?: 'SPECIFIC_PRODUCT' | 'ONGOING_SUGGESTION';
}

export interface ChangeDesiredQuantityData {
  quantity: number;
}

export interface MarkAsReceivedData {
  quantity: number;
  fromUserId: string;
}

// Query Keys
export const itemKeys = {
  all: ['items'] as const,
  detail: (id: string) => [...itemKeys.all, 'detail', id] as const,
};

// Hook para atualizar metadados do item
export function useUpdateItemMetadata() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateItemMetadataData }): Promise<Item> => {
      const response = await api.put(`/items/${id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: itemKeys.detail(data.id) });
      // Invalidar todas as wishlists que podem conter este item
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      queryClient.invalidateQueries({ queryKey: ['my-wishlists'] });
      // Invalidar todas as wishlists individuais
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}

// Hook para atualizar item completo
export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateItemData }): Promise<Item> => {
      const response = await api.put(`/items/${id}`, data);
      return response.data;
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: itemKeys.detail(id) });
      // Invalidar todas as wishlists que podem conter este item
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      queryClient.invalidateQueries({ queryKey: ['my-wishlists'] });
      // Invalidar todas as wishlists individuais
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}

// Hook para alterar quantidade desejada do item
export function useChangeDesiredQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ChangeDesiredQuantityData }): Promise<Item> => {
      const response = await api.patch(`/items/${id}/quantity`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: itemKeys.detail(data.id) });
      // Invalidar todas as wishlists que podem conter este item
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      queryClient.invalidateQueries({ queryKey: ['my-wishlists'] });
      // Invalidar todas as wishlists individuais
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}

// Hook para marcar item como recebido
export function useMarkAsReceived() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: MarkAsReceivedData }): Promise<{ message: string }> => {
      const response = await api.post(`/items/${id}/mark-as-received`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: itemKeys.detail(id) });
      // Invalidar todas as wishlists que podem conter este item
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      queryClient.invalidateQueries({ queryKey: ['my-wishlists'] });
      // Invalidar todas as wishlists individuais
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}

// Hook para excluir item
export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/items/${id}`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: itemKeys.detail(id) });
      // Invalidar todas as wishlists que podem conter este item
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      queryClient.invalidateQueries({ queryKey: ['my-wishlists'] });
      // Invalidar todas as wishlists individuais
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}
