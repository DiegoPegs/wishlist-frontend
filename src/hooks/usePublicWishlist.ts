import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Wishlist } from '@/types/wishlist';

// Hook para buscar uma wishlist pública pelo token
export function usePublicWishlist(token: string) {
  return useQuery({
    queryKey: ['public-wishlist', token],
    queryFn: async (): Promise<Wishlist> => {
      const response = await api.get(`/public/wishlists/${token}`);
      return response.data;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: false, // Não tentar novamente em caso de erro (lista pode não existir ou ser privada)
  });
}
