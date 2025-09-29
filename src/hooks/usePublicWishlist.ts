import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Wishlist, WishlistItem } from '@/types/wishlist';

// Hook para buscar uma wishlist pública pelo token
export function usePublicWishlist(token: string) {
  return useQuery({
    queryKey: ['public-wishlist', token],
    queryFn: async (): Promise<Wishlist> => {
      const response = await api.get(`/public/wishlists/${token}`);
      const data = response.data;

      // Transformar dados da API para o formato esperado pelo componente
      // Filtrar informações de reserva que não devem aparecer em wishlists públicas
      return {
        id: data._id, // Usar _id como id
        title: data.title,
        description: data.description || '',
        isPublic: data.sharing?.isPublic || false,
        ownerId: data.userId?._id || data.userId,
        ownerName: data.userId?.name || 'Usuário',
        items: (data.items || []).map((item: WishlistItem) => ({
          _id: item._id,
          id: item._id,
          title: item.title,
          description: item.description || '',
          price: item.price,
          currency: item.currency,
          link: item.link,
          imageUrl: item.imageUrl,
          quantity: item.quantity,
          itemType: item.itemType,
          // Remover campos de reserva para wishlists públicas
          // reservedBy: undefined,
          // reservedAt: undefined,
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString()
        })),
        sharing: {
          isPublic: data.sharing?.isPublic || false,
          publicLink: data.sharing?.publicLink,
          publicLinkToken: data.sharing?.publicLinkToken
        },
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString()
      };
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: false, // Não tentar novamente em caso de erro (lista pode não existir ou ser privada)
  });
}
