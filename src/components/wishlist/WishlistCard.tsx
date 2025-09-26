import Link from 'next/link';
import { Wishlist } from '@/types';

interface WishlistCardProps {
  wishlist: Wishlist;
}

export function WishlistCard({ wishlist }: WishlistCardProps) {
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

  const totalValue = wishlist.items?.reduce((sum, item) => {
    const price = item.price || 0;
    const quantity = item.quantity || 1;
    return sum + (price * quantity);
  }, 0) || 0;

  const reservedItems = wishlist.items?.filter(item => item.reservedBy).length || 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
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
              {wishlist.isPublic ? 'Pública' : 'Privada'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Itens:</span> {wishlist.items?.length || 0}
          </div>
          <div>
            <span className="font-medium">Valor total:</span> {formatPrice(totalValue)}
          </div>
          <div>
            <span className="font-medium">Reservados:</span> {reservedItems}
          </div>
          <div>
            <span className="font-medium">Criado em:</span> {formatDate(wishlist.createdAt)}
          </div>
        </div>

        {(wishlist.items?.length || 0) > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Últimos itens:</h4>
            <div className="space-y-1">
              {wishlist.items?.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 truncate">{item.name}</span>
                  {item.price && (
                    <span className="text-gray-500 font-medium">
                      {formatPrice(item.price, item.currency)}
                    </span>
                  )}
                </div>
              ))}
              {(wishlist.items?.length || 0) > 3 && (
                <p className="text-xs text-gray-500">
                  +{(wishlist.items?.length || 0) - 3} mais itens
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <Link
            href={`/wishlist/${wishlist.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Ver detalhes
          </Link>
          <div className="flex items-center space-x-2">
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
            <button className="text-gray-400 hover:text-red-600">
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
