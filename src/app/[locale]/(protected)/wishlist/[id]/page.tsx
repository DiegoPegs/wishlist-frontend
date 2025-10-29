'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useWishlist } from '@/hooks/use-wishlists';
import { useDeleteWishlist } from '@/hooks/useDeleteWishlist';
import { useDeleteItem } from '@/hooks/useDeleteItem';
import { ItemCard } from '@/components/item/ItemCard';
import { ShareWishlistModal } from '@/components/wishlist/ShareWishlistModal';
import { EditWishlistModal } from '@/components/wishlist/EditWishlistModal';
import { DeleteWishlistModal } from '@/components/wishlist/DeleteWishlistModal';
import { AddItemModal } from '@/components/item/AddItemModal';
import { EditItemModal } from '@/components/item/EditItemModal';
import { DeleteItemModal } from '@/components/item/DeleteItemModal';
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';
import { WishlistItem } from '@/types/wishlist';
import { BackButton } from '@/components/ui/BackButton';
import { formatDate } from '@/lib/formatters';
import { useTranslations } from '@/hooks/useTranslations';
import { useIsGuardianOfDependentOwner } from '@/hooks/useCanManage';

export default function WishlistDetailPage() {
  const params = useParams();
  const { user: currentUser } = useAuthStore();
  const wishlistId = params.id as string;
  const tCommon = useTranslations('common');
  const tWishlist = useTranslations('wishlist');

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<WishlistItem | null>(null);

  const { data: wishlist, isLoading, error } = useWishlist(wishlistId);
  const deleteWishlistMutation = useDeleteWishlist();
  const deleteItemMutation = useDeleteItem({ wishlistId });

  // Verificação de propriedade mais robusta
  const currentUserId = currentUser?.id || currentUser?._id;
  const wishlistOwnerId = wishlist?.ownerId || wishlist?.userId?._id || (typeof wishlist?.userId === 'string' ? wishlist?.userId : wishlist?.userId?._id);

  const isOwner = currentUserId === wishlistOwnerId;

  // Verificar se é guardião de um dependente que é o dono desta wishlist
  const isGuardianOfDependentOwner = useIsGuardianOfDependentOwner(wishlistOwnerId);

  // Calcular faixa de preço dos itens (antes dos returns condicionais)
  const priceRange = useMemo(() => {
    if (!wishlist?.items || wishlist.items.length === 0) {
      return null;
    }

    let minPrice: number | null = null;
    let maxPrice: number | null = null;

    wishlist.items.forEach(item => {
      if (typeof item.price === 'number') {
        minPrice = minPrice === null ? item.price : Math.min(minPrice, item.price);
        maxPrice = maxPrice === null ? item.price : Math.max(maxPrice, item.price);
      } else if (typeof item.price === 'object' && item.price) {
        const priceObj = item.price as { min?: number; max?: number };
        if (priceObj.min !== undefined) {
          minPrice = minPrice === null ? priceObj.min : Math.min(minPrice, priceObj.min);
        }
        if (priceObj.max !== undefined) {
          maxPrice = maxPrice === null ? priceObj.max : Math.max(maxPrice, priceObj.max);
        }
      }
    });

    return { min: minPrice, max: maxPrice };
  }, [wishlist?.items]);

  const handleDeleteWishlist = async () => {
    try {
      await deleteWishlistMutation.mutateAsync(wishlistId);
    } catch (error) {
      console.error('Erro ao excluir wishlist:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await deleteItemMutation.mutateAsync(itemToDelete._id);
        setItemToDelete(null);
      } catch (error) {
        console.error('Erro ao excluir item:', error);
      }
    }
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
              <div key={`item-skeleton-${i}`} className="bg-white rounded-lg shadow-sm border border-gray-200">
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
        <h3 className="text-lg font-medium text-dark mb-2">{tCommon('error')}</h3>
        <p className="text-gray-600 mb-4">{tCommon('error')}</p>
        <Link
          href="/pt-BR/dashboard"
          className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary/90"
        >
          {tCommon('back')} {tCommon('dashboard')}
        </Link>
      </div>
    );
  }

  if (!wishlist) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-dark mb-2">{tCommon('notFound')}</h3>
        <p className="text-gray-600 mb-4">{tCommon('notFound')}</p>
        <Link
          href="/pt-BR/dashboard"
          className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary/90"
        >
          {tCommon('back')} {tCommon('dashboard')}
        </Link>
      </div>
    );
  }

  const reservedItems = wishlist?.items?.filter(item => item.reservedBy).length || 0;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <BackButton />

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
              <span>Criado por <strong>{wishlist?.userId?.name || 'Usuário desconhecido'}</strong></span>
              <span>•</span>
              <span>Em {formatDate(wishlist?.createdAt)}</span>
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
            {(isOwner || isGuardianOfDependentOwner) && (
              <>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary/90 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar Lista
                </button>
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
                  onClick={() => setIsDeleteModalOpen(true)}
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

        <div className={`mt-6 grid gap-4 text-sm ${(isOwner || isGuardianOfDependentOwner) ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-4'}`}>
          <div>
            <span className="font-medium text-gray-700">Total de itens:</span>
            <p className="text-lg font-semibold text-dark">{wishlist.items?.length || 0}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Faixa de Preço:</span>
            <p className="text-lg font-semibold text-dark">
              {priceRange && priceRange.min !== null && priceRange.max !== null
                ? `${formatPrice(priceRange.min)} - ${formatPrice(priceRange.max)}`
                : 'Não informado'
              }
            </p>
          </div>
          {!(isOwner || isGuardianOfDependentOwner) && (
            <>
              <div>
                <span className="font-medium text-gray-700">{tWishlist('reserved')}:</span>
                <p className="text-lg font-semibold text-dark">{reservedItems}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">{tWishlist('available')}:</span>
                <p className="text-lg font-semibold text-dark">{(wishlist.items?.length || 0) - reservedItems}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-dark">{tWishlist('listItems')}</h2>
        {(isOwner || isGuardianOfDependentOwner) && (
          <button
            onClick={() => setIsAddItemModalOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary/90 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {tWishlist('addItem')}
          </button>
        )}
      </div>

      {/* Items Grid */}
      {(wishlist.items?.length || 0) === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-dark mb-2">{tWishlist('noItemsFound')}</h3>
          <p className="text-gray-600 mb-6">
            {isOwner
              ? tWishlist('noItemsOwner')
              : tWishlist('noItemsGuest')
            }
          </p>
          {(isOwner || isGuardianOfDependentOwner) && (
            <button
              onClick={() => setIsAddItemModalOpen(true)}
              className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary/90"
            >
              {tWishlist('addFirstItem')}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.items?.map((item, index) => (
            <ItemCard
              key={item._id || `item-${index}`}
              item={item}
              ownerId={wishlistOwnerId || ''}
              onEdit={() => setEditingItem(item)}
              onDelete={() => setItemToDelete(item)}
              dependentId={isGuardianOfDependentOwner ? wishlistOwnerId : undefined}
            />
          ))}
        </div>
      )}

      {/* Modal de Edição */}
      {wishlist && (
        <EditWishlistModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          wishlistId={wishlist.id}
          currentTitle={wishlist.title}
          currentDescription={wishlist.description}
          dependentId={isGuardianOfDependentOwner ? wishlistOwnerId : undefined}
        />
      )}

      {/* Modal de Compartilhamento */}
      {wishlist && (
        <ShareWishlistModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          wishlist={wishlist}
        />
      )}

      {/* Modal de Exclusão */}
      {wishlist && (
        <DeleteWishlistModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteWishlist}
          wishlistTitle={wishlist.title}
          isLoading={deleteWishlistMutation.isPending}
          dependentId={isGuardianOfDependentOwner ? wishlistOwnerId : undefined}
        />
      )}

      {/* Modal de Adicionar Item */}
      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        wishlistId={wishlistId}
        dependentId={isGuardianOfDependentOwner ? wishlistOwnerId : undefined}
      />

      {/* Modal de Editar Item */}
      <EditItemModal
        isOpen={!!editingItem}
        item={editingItem}
        onClose={() => setEditingItem(null)}
        wishlistId={wishlistId}
        dependentId={isGuardianOfDependentOwner ? wishlistOwnerId : undefined}
      />

      {/* Modal de Excluir Item */}
      <DeleteItemModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteConfirm}
        item={itemToDelete}
        isLoading={deleteItemMutation.isPending}
      />

    </div>
  );
}
