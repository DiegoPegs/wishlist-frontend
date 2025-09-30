import { WishlistItem } from '@/types/wishlist';
import Image from 'next/image';
import { LinkIcon, Users } from 'lucide-react';

interface PublicItemCardProps {
  item: WishlistItem;
}

export function PublicItemCard({ item }: PublicItemCardProps) {
  // Constante para imagem de placeholder
  const displayImageUrl = item.imageUrl || '/images/illustration-placeholder-gift.svg';

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
          <Image
            src={displayImageUrl}
            alt={item.title}
            width={120}
            height={120}
            className="w-30 h-30 object-cover rounded-lg"
          />
        </div>

        {/* Conteúdo do item */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {item.title}
              </h3>

              {item.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>
              )}

              {/* Notas */}
              {item.notes && (
                <div className="mb-3">
                  <p className="text-sm text-gray-500 mb-1">Notas:</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded border-l-4 border-primary/20">
                    {item.notes}
                  </p>
                </div>
              )}

              <div className="space-y-2 mb-4">
                {/* Preço */}
                <p className="text-lg font-medium text-green-600">
                  {formatPrice(item.price, item.currency)}
                </p>

                {/* Quantidade/Tipo */}
                {item.itemType === 'SPECIFIC_PRODUCT' && formatQuantity(item.quantity) && (
                  <p className="text-sm text-gray-600">
                    {formatQuantity(item.quantity)}
                  </p>
                )}

                {item.itemType === 'ONGOING_SUGGESTION' && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Vários podem presentear</span>
                  </div>
                )}
              </div>

              {/* Link do produto */}
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <LinkIcon className="w-4 h-4" />
                  Ver na Loja
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
