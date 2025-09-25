'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useWishlist, useReserveItem, useDeleteWishlist } from '@/hooks/use-wishlists';
import { ItemCard } from '@/components/wishlist/ItemCard';
import { ShareWishlistModal } from '@/components/wishlist/ShareWishlistModal';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WishlistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const wishlistId = params.id as string;
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const { data: wishlist, isLoading, error } = useWishlist(wishlistId);
  const reserveItemMutation = useReserveItem();
  const deleteWishlistMutation = useDeleteWishlist();

  const isOwner = wishlist?.ownerId === user?.id;

  const handleReserveItem = async (itemId: string, quantity: number, message?: string) => {
    try {
      await reserveItemMutation.mutateAsync({
        itemId,
        quantity,
        message,
      });
      // A UI será atualizada automaticamente pelo react-query
    } catch (error) {
      console.error('Erro ao reservar item:', error);
    }
  };

  const handleDeleteWishlist = async () => {
    if (window.confirm('Tem certeza que deseja excluir esta lista? Esta ação não pode ser desfeita.')) {
      try {
        await deleteWishlistMutation.mutateAsync(wishlistId);
        router.push('/dashboard');
      } catch (error) {
        console.error('Erro ao excluir lista:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatPrice = (price?: number, currency?: string) => {
    if (!price) return 'Preço não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency || 'BRL',
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-dark mb-2">Erro ao carregar lista</h3>
        <p className="text-gray-600 mb-4">Ocorreu um erro ao carregar os detalhes da lista.</p>
        <Link
          href="/dashboard"
          className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary/90"
        >
          Voltar ao Dashboard
        </Link>
      </div>
    );
  }

  if (!wishlist) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-dark mb-2">Lista não encontrada</h3>
        <p className="text-gray-600 mb-4">A lista que você está procurando não existe ou foi removida.</p>
        <Link
          href="/dashboard"
          className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary/90"
        >
          Voltar ao Dashboard
        </Link>
      </div>
    );
  }

  const totalValue = wishlist.items.reduce((sum, item) => {
    const price = item.price || 0;
    const quantity = item.quantity || 1;
    return sum + (price * quantity);
  }, 0);

  const reservedItems = wishlist.items.filter(item => item.reservedBy).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-dark mb-2">
              {wishlist.title}
            </h1>
            {wishlist.description && (
              <p className="text-gray-600 mb-4">
                {wishlist.description}
              </p>
            )}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Criado por <strong>{wishlist.ownerName}</strong></span>
              <span>•</span>
              <span>Em {formatDate(wishlist.createdAt)}</span>
              <span>•</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                wishlist.isPublic
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {wishlist.isPublic ? 'Pública' : 'Privada'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            {isOwner && (
              <>
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="bg-secondary text-white px-4 py-2 rounded-md font-medium hover:bg-secondary/90 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Compartilhar
                </button>
                <button
                  onClick={handleDeleteWishlist}
                  className="text-gray-400 hover:text-red-600 p-2"
                  disabled={deleteWishlistMutation.isPending}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Total de itens:</span>
            <p className="text-lg font-semibold text-dark">{wishlist.items.length}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Valor total:</span>
            <p className="text-lg font-semibold text-dark">{formatPrice(totalValue)}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Reservados:</span>
            <p className="text-lg font-semibold text-dark">{reservedItems}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Disponíveis:</span>
            <p className="text-lg font-semibold text-dark">{wishlist.items.length - reservedItems}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-dark">Itens da Lista</h2>
        {isOwner && (
          <button className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary/90 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Adicionar Item
          </button>
        )}
      </div>

      {/* Items Grid */}
      {wishlist.items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-dark mb-2">Nenhum item encontrado</h3>
          <p className="text-gray-600 mb-6">
            {isOwner
              ? 'Esta lista ainda não possui itens. Que tal adicionar o primeiro?'
              : 'Esta lista ainda não possui itens.'
            }
          </p>
          {isOwner && (
            <button className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary/90">
              Adicionar primeiro item
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              wishlistId={wishlistId}
              isOwner={isOwner}
              onReserve={handleReserveItem}
            />
          ))}
        </div>
      )}

      {/* Modal de Compartilhamento */}
      {wishlist && (
        <ShareWishlistModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          wishlist={wishlist}
        />
      )}
    </div>
  );
}
