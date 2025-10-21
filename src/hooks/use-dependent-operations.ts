import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  CreateWishlistData,
  UpdateWishlistData,
  CreateItemData,
  UpdateItemData,
  UpdateItemQuantityData,
  MarkItemAsReceivedData
} from '@/types/wishlist';
import {
  CreateItemDto,
  UpdateItemDto,
  UpdateItemQuantityDto,
  MarkItemAsReceivedDto
} from '@/types/item-dto';
import { dependentWishlistKeys } from './use-dependent-wishlists';
import { wishlistKeys } from './use-wishlists';

// ===== WISHLIST OPERATIONS =====

export function useCreateDependentWishlist(dependentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateWishlistData): Promise<void> => {
      await api.post(`/users/dependents/${dependentId}/wishlists`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dependentWishlistKeys.lists(dependentId) });
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
    },
  });
}

export function useUpdateDependentWishlist(dependentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      wishlistId,
      data
    }: {
      wishlistId: string;
      data: UpdateWishlistData
    }): Promise<void> => {
      await api.put(`/users/dependents/${dependentId}/wishlists/${wishlistId}`, data);
    },
    onSuccess: (_, { wishlistId }) => {
      queryClient.invalidateQueries({ queryKey: dependentWishlistKeys.list(dependentId, wishlistId) });
      queryClient.invalidateQueries({ queryKey: dependentWishlistKeys.lists(dependentId) });
      queryClient.invalidateQueries({ queryKey: wishlistKeys.list(wishlistId) });
    },
  });
}

export function useSoftDeleteDependentWishlist(dependentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (wishlistId: string): Promise<void> => {
      await api.delete(`/users/dependents/${dependentId}/wishlists/${wishlistId}`);
    },
    onSuccess: (_, wishlistId) => {
      queryClient.invalidateQueries({ queryKey: dependentWishlistKeys.list(dependentId, wishlistId) });
      queryClient.invalidateQueries({ queryKey: dependentWishlistKeys.lists(dependentId) });
      queryClient.invalidateQueries({ queryKey: wishlistKeys.list(wishlistId) });
    },
  });
}

export function useHardDeleteDependentWishlist(dependentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (wishlistId: string): Promise<void> => {
      await api.delete(`/users/dependents/${dependentId}/wishlists/${wishlistId}/permanent`);
    },
    onSuccess: (_, wishlistId) => {
      queryClient.invalidateQueries({ queryKey: dependentWishlistKeys.list(dependentId, wishlistId) });
      queryClient.invalidateQueries({ queryKey: dependentWishlistKeys.lists(dependentId) });
      queryClient.invalidateQueries({ queryKey: wishlistKeys.list(wishlistId) });
    },
  });
}

export function useRestoreDependentWishlist(dependentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (wishlistId: string): Promise<void> => {
      await api.post(`/users/dependents/${dependentId}/wishlists/${wishlistId}/restore`);
    },
    onSuccess: (_, wishlistId) => {
      queryClient.invalidateQueries({ queryKey: dependentWishlistKeys.list(dependentId, wishlistId) });
      queryClient.invalidateQueries({ queryKey: dependentWishlistKeys.lists(dependentId) });
      queryClient.invalidateQueries({ queryKey: wishlistKeys.list(wishlistId) });
    },
  });
}

// ===== ITEM OPERATIONS =====

export function useCreateDependentItem(dependentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      wishlistId,
      data
    }: {
      wishlistId: string;
      data: CreateItemData
    }): Promise<void> => {
      // Transformar dados do formulário para DTO
      const dto: CreateItemDto = {
        title: data.title,
        description: data.description,
        price: data.price,
        currency: data.currency,
        link: data.url, // url -> link
        imageUrl: data.imageUrl,
        quantity: data.quantity ? { desired: data.quantity } : undefined,
        itemType: data.itemType,
        notes: data.description, // description -> notes
      };

      await api.post(`/users/dependents/${dependentId}/wishlists/${wishlistId}/items`, dto);
    },
    onSuccess: (_, { wishlistId }) => {
      queryClient.invalidateQueries({ queryKey: dependentWishlistKeys.list(dependentId, wishlistId) });
      queryClient.invalidateQueries({ queryKey: dependentWishlistKeys.lists(dependentId) });
      queryClient.invalidateQueries({ queryKey: wishlistKeys.list(wishlistId) });
    },
  });
}

export function useUpdateDependentItem(dependentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemId,
      data
    }: {
      itemId: string;
      data: UpdateItemData
    }): Promise<void> => {
      // Transformar dados do formulário para DTO
      const dto: UpdateItemDto = {
        title: data.title,
        description: data.description,
        price: data.price,
        currency: data.currency,
        link: data.url, // url -> link
        imageUrl: data.imageUrl,
        quantity: data.quantity ? { desired: data.quantity } : undefined,
        itemType: data.itemType,
        notes: data.description, // description -> notes
      };

      await api.put(`/users/dependents/${dependentId}/items/${itemId}`, dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dependentWishlistKeys.lists(dependentId) });
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
    },
  });
}

export function useDeleteDependentItem(dependentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemId
    }: {
      itemId: string
    }): Promise<void> => {
      await api.delete(`/users/dependents/${dependentId}/items/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dependentWishlistKeys.lists(dependentId) });
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
    },
  });
}

export function useUpdateDependentItemQuantity(dependentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemId,
      data
    }: {
      itemId: string;
      data: UpdateItemQuantityData
    }): Promise<void> => {
      const dto: UpdateItemQuantityDto = {
        desired: data.desired,
      };

      await api.put(`/users/dependents/${dependentId}/items/${itemId}/quantity`, dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dependentWishlistKeys.lists(dependentId) });
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
    },
  });
}

export function useMarkDependentItemAsReceived(dependentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemId,
      data
    }: {
      itemId: string;
      data: MarkItemAsReceivedData
    }): Promise<void> => {
      const dto: MarkItemAsReceivedDto = {
        quantityReceived: data.quantityReceived,
      };

      await api.post(`/users/dependents/${dependentId}/items/${itemId}/mark-received`, dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dependentWishlistKeys.lists(dependentId) });
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
    },
  });
}
