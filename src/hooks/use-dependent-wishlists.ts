import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Wishlist } from '@/types';
import { CreateWishlistData, WishlistItem } from '@/types/wishlist';
import { useAuthStore } from '@/store/auth.store';

// Interface para os dados da API de dependentes
interface ApiDependentWishlist {
  _id: string;
  id?: string;
  title: string;
  description?: string;
  isPublic?: boolean;
  status?: string;
  userId?: {
    _id: string;
    name: string;
  };
  items?: WishlistItem[];
  sharing?: {
    isPublic: boolean;
    publicLink?: string;
    publicLinkToken?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Query Keys
export const dependentWishlistKeys = {
  all: ['dependent-wishlists'] as const,
  lists: (dependentId: string) => [...dependentWishlistKeys.all, 'list', dependentId] as const,
  list: (dependentId: string, wishlistId: string) => [...dependentWishlistKeys.all, 'detail', dependentId, wishlistId] as const,
};

// Hook para buscar uma wishlist específica de um dependente
export function useDependentWishlist(dependentId: string, wishlistId: string) {
  const { authStatus } = useAuthStore();

  return useQuery({
    queryKey: dependentWishlistKeys.list(dependentId, wishlistId),
    queryFn: async (): Promise<Wishlist> => {
      console.log('🔍 Buscando wishlist específica do dependente:', {
        dependentId,
        wishlistId,
        endpoint: `/users/dependents/${dependentId}/wishlists/${wishlistId}`,
        authStatus
      });

      try {
        const response = await api.get(`/users/dependents/${dependentId}/wishlists/${wishlistId}`);
        console.log('✅ Wishlist específica encontrada:', response.data);

        // Transformar dados da API para o formato esperado
        const apiData: ApiDependentWishlist = response.data;
        const transformedWishlist: Wishlist = {
          _id: apiData._id,
          id: apiData.id || apiData._id,
          title: apiData.title,
          description: apiData.description || '',
          isPublic: apiData.sharing?.isPublic || false,
          ownerId: apiData.userId?._id || '',
          ownerName: apiData.userId?.name || 'Usuário',
          userId: apiData.userId || { _id: '', name: 'Usuário' },
          items: apiData.items || [],
          sharing: {
            isPublic: apiData.sharing?.isPublic || false,
            publicLink: apiData.sharing?.publicLink,
            publicLinkToken: apiData.sharing?.publicLinkToken
          },
          createdAt: apiData.createdAt || new Date().toISOString(),
          updatedAt: apiData.updatedAt || new Date().toISOString()
        };

        console.log('🔍 Wishlist transformada:', transformedWishlist);
        return transformedWishlist;
      } catch (error) {
        console.error('❌ Erro ao buscar wishlist específica:', error);
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { status?: number; data?: unknown } };
          console.error('❌ Status:', axiosError.response?.status);
          console.error('❌ Response:', axiosError.response?.data);
        }
        throw error;
      }
    },
    enabled: !!dependentId && !!wishlistId && authStatus === 'AUTHENTICATED',
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error) => {
      // Não tentar novamente se for erro 401 (não autorizado) ou 404 (não encontrado)
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401 || axiosError.response?.status === 404) {
          return false;
        }
      }
      return failureCount < 3;
    },
  });
}

// Hook para buscar wishlists de um dependente
export function useDependentWishlists(dependentId: string) {
  const { authStatus } = useAuthStore();

  const enabled = !!dependentId && authStatus === 'AUTHENTICATED';

  console.log('🔍 useDependentWishlists debug:', {
    dependentId,
    authStatus,
    enabled
  });

  return useQuery({
    queryKey: dependentWishlistKeys.lists(dependentId),
    queryFn: async (): Promise<Wishlist[]> => {
      console.log('🔍 Buscando wishlists do dependente:', dependentId);
      try {
        const response = await api.get(`/users/dependents/${dependentId}/wishlists`);
        console.log('✅ Wishlists encontradas:', response.data);
        console.log('🔍 Tipo dos dados:', typeof response.data);
        console.log('🔍 É array?', Array.isArray(response.data));
        console.log('🔍 Quantidade de wishlists:', response.data?.length);
        console.log('🔍 Estrutura da primeira wishlist:', response.data?.[0]);

        // Transformar dados se necessário
        const wishlists = response.data.map((wishlist: ApiDependentWishlist) => {
          console.log('🔍 Transformando wishlist:', {
            originalId: wishlist._id,
            originalIdField: wishlist.id,
            title: wishlist.title,
            userId: wishlist.userId
          });

          return {
            _id: wishlist._id,
            id: wishlist.id || wishlist._id, // Usar id se disponível, senão _id
            title: wishlist.title,
            description: wishlist.description || '',
            isPublic: wishlist.sharing?.isPublic || false,
            ownerId: wishlist.userId?._id || '',
            ownerName: wishlist.userId?.name || 'Usuário',
            userId: wishlist.userId || { _id: wishlist.userId, name: 'Usuário' },
            items: wishlist.items || [],
            sharing: {
              isPublic: wishlist.sharing?.isPublic || false,
              publicLink: wishlist.sharing?.publicLink,
              publicLinkToken: wishlist.sharing?.publicLinkToken
            },
            status: wishlist.status,
            createdAt: wishlist.createdAt || new Date().toISOString(),
            updatedAt: wishlist.updatedAt || new Date().toISOString()
          };
        });

        console.log('🔍 Wishlists transformadas:', wishlists);
        return wishlists;
      } catch (error) {
        console.error('❌ Erro ao buscar wishlists:', error);
        throw error;
      }
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error) => {
      // Não tentar novamente se for erro 401 (não autorizado)
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          return false;
        }
      }
      return failureCount < 3;
    },
  });
}

// Hook para atualizar configurações de compartilhamento de wishlist de dependente
export function useUpdateDependentWishlistSharing(dependentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      wishlistId,
      data
    }: {
      wishlistId: string;
      data: { isPublic: boolean }
    }): Promise<void> => {
      console.log('🔍 useUpdateDependentWishlistSharing debug:', {
        dependentId,
        wishlistId,
        data,
        endpoint: `/users/dependents/${dependentId}/wishlists/${wishlistId}/sharing`
      });

      await api.put(`/users/dependents/${dependentId}/wishlists/${wishlistId}/sharing`, data);
    },
    onSuccess: (_, { wishlistId }) => {
      // Invalidar a query da wishlist específica do dependente
      queryClient.invalidateQueries({ queryKey: dependentWishlistKeys.list(dependentId, wishlistId) });

      // Invalidar a lista de wishlists do dependente
      queryClient.invalidateQueries({ queryKey: dependentWishlistKeys.lists(dependentId) });

      // Invalidar todas as queries de wishlists para garantir consistência
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
    },
  });
}

// Hook para criar wishlist para um dependente
export function useCreateDependentWishlist(dependentId: string) {
  const queryClient = useQueryClient();

  return {
    ...useMutation({
      mutationFn: async (data: CreateWishlistData): Promise<Wishlist> => {
        const response = await api.post(`/users/dependents/${dependentId}/wishlists`, data);
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
      const response = await api.post(`/users/dependents/${dependentId}/wishlists`, data);
      queryClient.invalidateQueries({ queryKey: dependentWishlistKeys.lists(dependentId) });
      queryClient.invalidateQueries({ queryKey: ['dependents'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      return response.data;
    },
  };
}
