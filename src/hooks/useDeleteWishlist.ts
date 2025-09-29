import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';

// Hook para excluir uma wishlist
export function useDeleteWishlist() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (wishlistId: string): Promise<void> => {
      await api.delete(`/wishlists/${wishlistId}`);
    },
    onSuccess: (_, wishlistId) => {
      // Invalidar a query da wishlist específica
      queryClient.invalidateQueries({ queryKey: ['wishlists', 'detail', wishlistId] });
      // Invalidar a lista de wishlists do usuário
      queryClient.invalidateQueries({ queryKey: ['wishlists', 'mine'] });
      queryClient.invalidateQueries({ queryKey: ['my-wishlists'] });
      // Invalidar todas as queries de wishlists
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });

      // Exibir toast de sucesso
      toast.success('Wishlist excluída com sucesso!');

      // Redirecionar para o dashboard
      router.push('/dashboard');
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir wishlist';
      toast.error(errorMessage);
    },
  });
}
