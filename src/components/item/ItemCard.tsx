import Image from 'next/image';
import { Users } from 'lucide-react';
import { WishlistItem } from '@/types/wishlist';
import { formatDate } from '@/lib/formatters';
import { useCanManage } from '@/hooks/useCanManage';

interface ItemCardProps {
  item: WishlistItem;
  ownerId: string; // ID do dono da wishlist
  onEdit: (itemId: string, dependentId?: string) => void;
  onDelete: (itemId: string, dependentId?: string) => void;
  dependentId?: string; // Novo prop opcional
}

export function ItemCard({ item, ownerId, onEdit, onDelete, dependentId }: ItemCardProps) {
  // Usar a nova lógica canManage em vez de isOwner
  const canManage = useCanManage(ownerId);

  // Constante para imagem de placeholder
  const displayImageUrl = item.imageUrl || '/images/illustration-placeholder-gift.svg';

  // Função helper para formatar preço
  const formatPrice = (price?: { min?: number; max?: number } | number, currency?: string) => {
    if (!price) return 'Preço não informado';

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

    // Se for a estrutura antiga de número
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency || 'BRL',
    }).format(price);
  };

  // Função helper para obter quantidade desejada
  const getQuantity = (quantity: unknown): number => {
    if (typeof quantity === 'object' && quantity) {
      return (quantity as { desired?: number }).desired || 1;
    } else if (typeof quantity === 'number') {
      return quantity;
    }
    return 1;
  };

  return (
    <div className="group bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 min-h-[380px] flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
        {/* Imagem */}
        <div className="mb-4 flex items-center justify-center overflow-hidden">
          <Image
            src={displayImageUrl}
            alt={item.title}
            width={300}
            height={200}
            className="w-full h-48 object-cover rounded-md"
          />
        </div>

        {/* Título */}
        <h3 className="text-lg font-bold text-gray-900 mb-3">
          {item.title}
        </h3>

        {/* Preço e Quantidade */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Preço:</span>
            <p className="text-gray-600">{formatPrice(item.price, item.currency)}</p>
          </div>
          <div>
            {item.itemType === 'SPECIFIC_PRODUCT' ? (
              <>
                <span className="font-medium text-gray-700">Desejado:</span>
                <p className="text-gray-600">{getQuantity(item.quantity)}</p>
                {!canManage && item.reservedBy && (
                  <>
                    <span className="font-medium text-gray-700 mt-1 block">Reservados:</span>
                    <p className="text-gray-600">1</p>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Vários podem presentear</span>
              </div>
            )}
          </div>
        </div>

        {/* Descrição */}
        {item.description && (
          <div className="mb-4">
            <span className="font-medium text-gray-700 text-sm">Descrição:</span>
            <p className="text-gray-600 text-sm mt-1 line-clamp-3">{item.description}</p>
          </div>
        )}

        {/* Notas Adicionais */}
        {item.notes && (
          <div className="mb-4">
            <span className="font-medium text-gray-700 text-sm">Notas Adicionais:</span>
            <p className="text-gray-600 text-sm mt-1 line-clamp-3">{item.notes}</p>
          </div>
        )}

        {/* Link */}
        {item.link && (
          <div className="mb-4">
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Ver produto
            </a>
          </div>
        )}

        {/* Data de criação */}
        <div className="mb-4">
          <span className="text-xs text-gray-500">
            Criado em {formatDate(item.createdAt)}
          </span>
        </div>

        {/* Informações de reserva (apenas se não for o dono) */}
        {!canManage && item.reservedBy && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-yellow-800">Item Reservado</span>
            </div>
            <p className="text-xs text-yellow-700">
              Reservado por: {item.reservedBy}
            </p>
            {item.reservedAt && (
              <p className="text-xs text-yellow-700">
                Em: {formatDate(item.reservedAt)}
              </p>
            )}
          </div>
        )}

        {/* Botões de ação (apenas se puder gerenciar) */}
        {canManage && (
          <div className="flex items-center justify-end gap-2 mt-auto">
            <button
              onClick={() => onEdit(item.id, dependentId)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              title="Editar item"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar
            </button>
            <button
              onClick={() => onDelete(item._id, dependentId)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
              title="Excluir item"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Excluir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
