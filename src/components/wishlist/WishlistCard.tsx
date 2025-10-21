import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { Wishlist } from '@/types';
import { formatDate } from '@/lib/formatters';
import { fetchWishlist, wishlistKeys } from '@/hooks/use-wishlists';
import { useTranslations } from '@/hooks/useTranslations';
import { useLocalizedPath } from '@/hooks/useLocalizedPath';

interface WishlistCardProps {
  wishlist: Wishlist;
  isOwner?: boolean;
  onShare?: () => void;
  onDelete?: (wishlistId: string) => void;
  dependentId?: string; // Novo prop para identificar se é wishlist de dependente
}

export function WishlistCard({ wishlist, isOwner = true, onShare, onDelete, dependentId }: WishlistCardProps) {
  const queryClient = useQueryClient();
  const t = useTranslations('wishlist');
  const { getLocalizedPath } = useLocalizedPath();

  // Função para prefetch da wishlist no hover
  const prefetchWishlist = () => {
    if (wishlist.id) {
      queryClient.prefetchQuery({
        queryKey: wishlistKeys.list(wishlist.id),
        queryFn: () => fetchWishlist(wishlist.id),
        staleTime: 5 * 60 * 1000, // 5 minutos
      });
    }
  };

  // Verificação de robustez contra dados faltantes
  if (!wishlist || !wishlist.id) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-16 ml-4"></div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-28"></div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-24"></div>
            <div className="flex space-x-2">
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  const formatPrice = (price?: { min?: number; max?: number } | number, currency?: string) => {
    if (!price) return t('priceNotInformed');

    // Se for a nova estrutura de objeto
    if (typeof price === 'object') {
      const { min, max } = price;
      if (min && max) {
        return `${new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: currency || 'BRL',
        }).format(min)} - ${new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: currency || 'BRL',
        }).format(max)}`;
      } else if (min) {
        return `${t('from')} ${new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: currency || 'BRL',
        }).format(min)}`;
      } else if (max) {
        return `${t('upTo')} ${new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: currency || 'BRL',
        }).format(max)}`;
      }
      return t('priceNotInformed');
    }

    // Se for a estrutura antiga de número
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency || 'BRL',
    }).format(price);
  };

  const totalValue = wishlist.items?.reduce((sum, item) => {
    let price = 0;
    if (typeof item.price === 'number') {
      price = item.price;
    } else if (typeof item.price === 'object' && item.price) {
      // Usar o preço mínimo se disponível
      const priceObj = item.price as { min?: number; max?: number };
      price = priceObj.min || 0;
    }
    let quantity = 1;
    if (typeof item.quantity === 'object' && item.quantity) {
      quantity = (item.quantity as { desired?: number }).desired || 1;
    } else if (typeof item.quantity === 'number') {
      quantity = item.quantity;
    }
    return sum + (price * quantity);
  }, 0) || 0;

  const reservedItems = wishlist.items?.filter(item => item.reservedBy).length || 0;

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
      onMouseEnter={prefetchWishlist}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-dark mb-2">
              {wishlist.title}
            </h3>
            {wishlist.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {wishlist.description}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              wishlist.isPublic
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {wishlist.isPublic ? t('public') : t('private')}
            </span>
          </div>
        </div>

        <div className={`grid gap-4 mt-4 text-sm text-gray-600 ${isOwner ? 'grid-cols-2' : 'grid-cols-2'}`}>
          <div>
            <span className="font-medium">{t('items')}:</span> {wishlist.items?.length || 0}
          </div>
          <div>
            <span className="font-medium">{t('totalValue')}:</span> {formatPrice(totalValue)}
          </div>
          {!isOwner && (
            <div>
              <span className="font-medium">{t('reserved')}:</span> {reservedItems}
            </div>
          )}
          <div>
            <span className="font-medium">{t('createdAt')}:</span> {formatDate(wishlist.createdAt)}
          </div>
        </div>

        {(wishlist.items?.length || 0) > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">{t('lastItems')}:</h4>
            <div className="space-y-1">
                {wishlist.items?.slice(0, 3).map((item, index) => (
                <div key={item.id || `wishlist-item-${index}`} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 truncate">{item.title}</span>
                  {item.price && (
                    <span className="text-gray-500 font-medium">
                      {formatPrice(item.price, item.currency)}
                    </span>
                  )}
                </div>
              ))}
              {(wishlist.items?.length || 0) > 3 && (
                <p className="text-xs text-gray-500">
                  +{(wishlist.items?.length || 0) - 3} {t('moreItems')}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <Link
            href={dependentId
              ? getLocalizedPath(`/dependents/${dependentId}/wishlist/${wishlist.id}`)
              : getLocalizedPath(`/wishlist/${wishlist.id}`)
            }
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {t('viewDetails')}
          </Link>
          <div className="flex items-center space-x-2">
            <button
              onClick={onShare}
              className="text-gray-400 hover:text-gray-600"
              title={t('shareList')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete?.(wishlist.id)}
              className="text-gray-400 hover:text-red-600"
              title={t('deleteList')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
