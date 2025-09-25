import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Wishlist } from '@/types';

// Função assíncrona para buscar minhas wishlists
const fetchMyWishlists = async (): Promise<Wishlist[]> => {
  const response = await api.get('/wishlists/mine');
  return response.data;
};

// Hook customizado para buscar minhas wishlists
export const useMyWishlists = () => {
  return useQuery({
    queryKey: ['my-wishlists'],
    queryFn: fetchMyWishlists,
  });
};
