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
  sharing?: {
    isPublic?: boolean;
    publicLink?: string;
  };
  status?: string;
  items?: unknown[];
  createdAt?: string;
  updatedAt?: string;
}

// Função assíncrona para buscar minhas wishlists
const fetchMyWishlists = async (): Promise<Wishlist[]> => {
  console.log('fetchMyWishlists: Iniciando busca de wishlists');
  try {
    const response = await api.get('/wishlists/mine');
    console.log('fetchMyWishlists: Resposta recebida:', response.data);

    // Transformar dados da API para o formato esperado pelo componente
    const transformedWishlists = response.data.map((wishlist: ApiWishlist) => ({
      _id: wishlist._id,
      id: wishlist._id, // Usar _id como id
      title: wishlist.title,
      description: wishlist.description || '',
      isPublic: wishlist.sharing?.isPublic || false,
      ownerId: wishlist.userId, // userId -> ownerId
      ownerName: 'Usuário', // Placeholder até termos o nome do owner
      items: wishlist.items || [],
      sharing: {
        isPublic: wishlist.sharing?.isPublic || false,
        publicLink: wishlist.sharing?.publicLink
      },
      createdAt: wishlist.createdAt || new Date().toISOString(),
      updatedAt: wishlist.updatedAt || new Date().toISOString()
    }));

    console.log('fetchMyWishlists: Dados transformados:', transformedWishlists);
    return transformedWishlists;
  } catch (error) {
    console.error('fetchMyWishlists: Erro na busca:', error);
    throw error;
  }
};

// Hook customizado para buscar minhas wishlists
export const useMyWishlists = () => {
  const { authStatus, isAuthenticated } = useAuthStore();

  console.log('useMyWishlists: authStatus =', authStatus);
  console.log('useMyWishlists: isAuthenticated =', isAuthenticated);
  console.log('useMyWishlists: enabled =', authStatus === 'AUTHENTICATED' && isAuthenticated);

  return useQuery({
    queryKey: ['my-wishlists'],
    queryFn: fetchMyWishlists,
    enabled: authStatus === 'AUTHENTICATED' && isAuthenticated, // Dupla verificação
  });
};
