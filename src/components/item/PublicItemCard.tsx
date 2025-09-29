import { WishlistItem } from '@/types/wishlist';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

interface PublicItemCardProps {
  item: WishlistItem;
}

export function PublicItemCard({ item }: PublicItemCardProps) {
  const formatPrice = (price?: number | { min?: number; max?: number }, currency?: string) => {
    if (!price) return 'Preço não informado';

    // Se for um objeto com min/max
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
        return `A partir de ${new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: currency || 'BRL',
        }).format(min)}`;
      } else if (max) {
        return `Até ${new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: currency || 'BRL',
        }).format(max)}`;
      }
      return 'Preço não informado';
    }

    // Se for um número
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency || 'BRL',
    }).format(price);
  };

  const formatQuantity = (quantity?: number | { desired?: number }) => {
    if (!quantity) return '';

    // Se for um objeto com desired
    if (typeof quantity === 'object') {
      const desired = quantity.desired;
      if (!desired || desired === 1) return '';
      return `Quantidade: ${desired}`;
    }

    // Se for um número
    if (quantity === 1) return '';
    return `Quantidade: ${quantity}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex gap-6">
        {/* Imagem do item */}
        <div className="flex-shrink-0">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.title}
              width={120}
              height={120}
              className="w-30 h-30 object-cover rounded-lg"
            />
          ) : (
            <div className="w-30 h-30 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs">Sem imagem</p>
              </div>
            </div>
          )}
        </div>

        {/* Conteúdo do item */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>

              {item.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>
              )}

              <div className="space-y-2 mb-4">
                {/* Preço */}
                <p className="text-lg font-medium text-green-600">
                  {formatPrice(item.price, item.currency)}
                </p>

                {/* Quantidade */}
                {formatQuantity(item.quantity) && (
                  <p className="text-sm text-gray-600">
                    {formatQuantity(item.quantity)}
                  </p>
                )}
              </div>

              {/* Link do produto */}
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver produto
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
