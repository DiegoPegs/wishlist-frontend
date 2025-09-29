import { WishlistItem } from '@/types/wishlist';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

interface PublicItemCardProps {
  item: WishlistItem;
}

export function PublicItemCard({ item }: PublicItemCardProps) {
  const formatPrice = (price?: number, currency?: string) => {
    if (!price) return 'Preço não informado';

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency || 'BRL',
    }).format(price);
  };

  const formatQuantity = (quantity?: number) => {
    if (!quantity || quantity === 1) return '';
    return `Qtd: ${quantity}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex gap-4">
        {/* Imagem do item */}
        {item.imageUrl && (
          <div className="flex-shrink-0">
            <Image
              src={item.imageUrl}
              alt={item.title}
              width={80}
              height={80}
              className="w-20 h-20 object-cover rounded-md"
            />
          </div>
        )}

        {/* Conteúdo do item */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {item.title}
              </h3>

              {item.description && (
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {item.description}
                </p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-2">
                {item.price && (
                  <span className="font-medium text-green-600">
                    {formatPrice(item.price, item.currency)}
                  </span>
                )}
                {formatQuantity(item.quantity) && (
                  <span>{formatQuantity(item.quantity)}</span>
                )}
              </div>

              {/* Link do produto */}
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
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
