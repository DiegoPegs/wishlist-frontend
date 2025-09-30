import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Wishlist } from '@/types';
import { useAuthStore } from '@/store/auth.store';

// Tipo para os dados brutos da API
interface ApiWishlist {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  isPublic?: boolean;
  sharing?: {
    isPublic?: boolean;
    publicLink?: string;
    publicLinkToken?: string;
  };
  status?: string;
  items?: unknown[];
  createdAt?: string;
  updatedAt?: string;
}

// Função assíncrona para buscar minhas wishlists
const fetchMyWishlists = async (): Promise<Wishlist[]> => {
  try {
    const response = await api.get('/wishlists/mine');

    // Transformar dados da API para o formato esperado pelo componente
    const transformedWishlists = response.data.map((wishlist: ApiWishlist) => ({
      _id: wishlist._id,
      id: wishlist._id, // Usar _id como id
      title: wishlist.title,
      description: wishlist.description || '',
      isPublic: wishlist.isPublic || false,
      ownerId: wishlist.userId, // userId -> ownerId
      ownerName: 'Usuário', // Placeholder até termos o nome do owner
      items: wishlist.items || [],
      sharing: {
        isPublic: wishlist.sharing?.isPublic || false,
        publicLink: wishlist.sharing?.publicLink,
        publicLinkToken: wishlist.sharing?.publicLinkToken
      },
      createdAt: wishlist.createdAt || new Date().toISOString(),
      updatedAt: wishlist.updatedAt || new Date().toISOString()
    }));

    return transformedWishlists;
  } catch (error) {
    throw error;
  }
};

// Hook customizado para buscar minhas wishlists
export const useMyWishlists = () => {
  const { authStatus, isAuthenticated } = useAuthStore();

  const query = useQuery({
    queryKey: ['my-wishlists'],
    queryFn: fetchMyWishlists,
    enabled: authStatus === 'AUTHENTICATED' && isAuthenticated, // Dupla verificação
  });


  return query;
};
