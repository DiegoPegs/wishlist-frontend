'use client';

import Link from 'next/link';
import { useMyWishlists } from '@/hooks/useMyWishlists';
import { WishlistCard } from '@/components/wishlist/WishlistCard';
import { WishlistCardSkeleton } from '@/components/wishlist/WishlistCardSkeleton';
import { Button } from '@/components/ui/Button';

export function WishlistList() {
  // Hook para buscar dados das wishlists
  const { data: wishlists, isLoading: wishlistsLoading, isError: wishlistsError } = useMyWishlists();

  console.log('WishlistList: wishlists =', wishlists);
  console.log('WishlistList: isLoading =', wishlistsLoading);
  console.log('WishlistList: isError =', wishlistsError);


  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {wishlistsLoading ? (
        Array.from({ length: 3 }).map((_, index) => (
          <WishlistCardSkeleton key={`skeleton-${index}`} />
        ))
      ) : wishlistsError ? (
        <div key="error-state" className="col-span-full text-center text-red-500 py-10">
          <h3 className="text-lg font-semibold mb-2">Erro ao carregar listas</h3>
          <p className="text-sm">Não foi possível carregar suas listas de desejos.</p>
        </div>
      ) : wishlists && wishlists.length > 0 ? (
        wishlists.map((wishlist, index) => (
          <WishlistCard key={wishlist.id || wishlist._id || `wishlist-${index}`} wishlist={wishlist} />
        ))
      ) : (
        <div key="empty-state" className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-dark mb-2">Nenhuma lista encontrada</h3>
          <p className="text-gray-600 mb-6">Você ainda não criou nenhuma lista de desejos.</p>
          <Link href="/dashboard/new">
            <Button variant="primary" className="px-6 py-3 text-base">
              Criar primeira lista
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
