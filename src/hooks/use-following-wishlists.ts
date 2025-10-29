import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Wishlist } from '@/types';
import { useAuthStore } from '@/store/auth.store';

// Hook para buscar wishlists de pessoas que o usuário segue
export function useFollowingWishlists() {
  const { authStatus } = useAuthStore();

  return useQuery({
    queryKey: ['wishlists', 'following'],
    queryFn: async (): Promise<Wishlist[]> => {
      const response = await api.get('/wishlists/following');
      return response.data;
    },
    enabled: authStatus === 'AUTHENTICATED',
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

