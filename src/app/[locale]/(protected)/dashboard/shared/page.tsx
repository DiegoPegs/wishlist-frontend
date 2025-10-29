'use client';

import { useFollowingWishlists } from '@/hooks/use-following-wishlists';
import { WishlistCard } from '@/components/wishlist/WishlistCard';
import { WishlistCardSkeleton } from '@/components/wishlist/WishlistCardSkeleton';

export default function SharedPage() {
  const { data: wishlists, isLoading, isError } = useFollowingWishlists();

  return (
    <div>
      <h1 className="text-2xl font-display mb-6">Listas Compartilhadas</h1>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <WishlistCardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-dark mb-2">Erro ao carregar listas compartilhadas</h3>
          <p className="text-gray-600 mb-6">
            Ocorreu um erro ao carregar as listas compartilhadas. Por favor, tente novamente mais tarde.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!isLoading && !isError && wishlists && wishlists.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-dark mb-2">Nenhuma lista compartilhada encontrada</h3>
          <p className="text-gray-600 mb-6">
            Você ainda não segue ninguém ou as pessoas que você segue não possuem listas públicas.
          </p>
        </div>
      )}

      {!isLoading && !isError && wishlists && wishlists.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlists.map((wishlist) => (
            <WishlistCard
              key={wishlist.id || wishlist._id}
              wishlist={wishlist}
              // Não passar onShare e onDelete para ocultar botões de editar/excluir
            />
          ))}
        </div>
      )}
    </div>
  );
}