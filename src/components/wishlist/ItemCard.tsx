import { useState } from 'react';
import Image from 'next/image';
import { WishlistItem } from '@/types/wishlist';
import { ReserveItemModal } from './ReserveItemModal';
import { useReserveItem } from '@/hooks/use-wishlists';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

interface ItemCardProps {
  item: WishlistItem;
  ownerId: string; // ID do dono da wishlist
  isOwner?: boolean;
  onReserve?: (itemId: string, quantity: number, message?: string) => void;
  onEdit?: (itemId: string) => void;
  onDelete?: (itemId: string) => void;
}

export function ItemCard({
  item,
  ownerId,
  isOwner = false,
  onReserve,
  onEdit,
  onDelete
}: ItemCardProps) {
  const [showReserveModal, setShowReserveModal] = useState(false);
  const { user } = useAuthStore();
  const reserveItemMutation = useReserveItem();

  // Verificar se o usuário logado é diferente do dono da wishlist
  const canReserve = user && user.id !== ownerId && !item.reservedBy;

  const formatPrice = (price?: number, currency?: string) => {
    if (!price) return 'Preço não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency || 'BRL',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleReserve = async (quantity: number, message?: string) => {
    try {
      await reserveItemMutation.mutateAsync({
        itemId: item.id,
        quantity,
        message,
      });
      toast.success('Item reservado com sucesso!');
      setShowReserveModal(false);
      onReserve?.(item.id, quantity, message);
    } catch {
      toast.error('Erro ao reservar item. Tente novamente.');
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-dark mb-2">
                {item.name}
              </h3>
              {item.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
            {item.reservedBy && (
              <div className="ml-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Reservado
                </span>
              </div>
            )}
          </div>

          {item.imageUrl && (
            <div className="mb-4">
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={300}
                height={128}
                className="w-full h-32 object-cover rounded-md"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Preço:</span> {formatPrice(item.price, item.currency)}
            </div>
            <div>
              <span className="font-medium">Quantidade:</span> {item.quantity || 1}
            </div>
            {item.reservedBy && (
              <>
                <div>
                  <span className="font-medium">Reservado por:</span> {item.reservedBy}
                </div>
                <div>
                  <span className="font-medium">Em:</span> {formatDate(item.reservedAt!)}
                </div>
              </>
            )}
          </div>

          {item.url && (
            <div className="mb-4">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                Ver produto →
              </a>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {canReserve && (
                <button
                  onClick={() => setShowReserveModal(true)}
                  className="bg-secondary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                >
                  Reservar
                </button>
              )}

              {isOwner && onEdit && (
                <button
                  onClick={() => onEdit(item.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}

              {isOwner && onDelete && (
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>

            <div className="text-xs text-gray-500">
              Criado em {formatDate(item.createdAt)}
            </div>
          </div>
        </div>
      </div>

      {showReserveModal && (
        <ReserveItemModal
          item={item}
          onReserve={handleReserve}
          onClose={() => setShowReserveModal(false)}
          isLoading={reserveItemMutation.isPending}
        />
      )}
    </>
  );
}
