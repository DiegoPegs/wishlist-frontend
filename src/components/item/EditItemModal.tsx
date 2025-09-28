'use client';

import { ItemForm } from './ItemForm';
import { useUpdateItem } from '@/hooks/useUpdateItem';
import { useChangeItemQuantity } from '@/hooks/useChangeItemQuantity';
import { WishlistItem } from '@/types/wishlist';

// Função helper para validar URL
const isValidUrl = (url: string): boolean => {
  if (!url || url.trim() === '') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

interface EditItemModalProps {
  item: WishlistItem | null;
  isOpen: boolean;
  onClose: () => void;
  wishlistId: string;
}

export function EditItemModal({ item, isOpen, onClose, wishlistId }: EditItemModalProps) {
  const updateItemMutation = useUpdateItem({ wishlistId });
  const changeQuantityMutation = useChangeItemQuantity({ wishlistId });

  // Função para obter dados iniciais do item
  const getInitialData = (item: WishlistItem) => {
    return {
      title: item.title,
      description: item.description || '',
      price: typeof item.price === 'object' ? item.price :
             typeof item.price === 'number' ? { min: item.price } : undefined,
      currency: item.currency || 'BRL',
      url: item.link || undefined, // Não enviar string vazia
      imageUrl: item.imageUrl || undefined, // Não enviar string vazia
      quantity: typeof item.quantity === 'object' ?
                (item.quantity as { desired?: number }).desired || 1 :
                item.quantity || 1,
      itemType: item.itemType,
    };
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    if (!item) return;

    try {
      // Criar payload que corresponde exatamente ao UpdateItemMetadataDto
      const payload: {
        title: string;
        description?: string;
        price?: number | { min?: number; max?: number };
        link?: string;
        imageUrl?: string;
        notes?: string;
      } = {
        title: data.title,
        description: data.description,
        price: data.price,
      };

      // Só incluir link se for uma URL válida
      if (data.url && isValidUrl(data.url)) {
        payload.link = data.url;
      }

      // Só incluir imageUrl se for uma URL válida
      if (data.imageUrl && isValidUrl(data.imageUrl)) {
        payload.imageUrl = data.imageUrl;
      }

      // Só incluir notes se description for diferente de vazio
      if (data.description && data.description.trim() !== '') {
        payload.notes = data.description;
      }

      // Atualizar item geral
      await updateItemMutation.mutateAsync({
        itemId: item._id,
        data: payload,
      });

      // Se a quantidade mudou e é SPECIFIC_PRODUCT, atualizar quantidade separadamente
      if (data.itemType === 'SPECIFIC_PRODUCT' && data.quantity && data.quantity !== getInitialData(item).quantity) {
        await changeQuantityMutation.mutateAsync({
          itemId: item._id,
          data: { desired: data.quantity },
        });
      }

      onClose();
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Editar Item</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <ItemForm
            onSubmit={handleSubmit}
            onCancel={onClose}
            initialData={getInitialData(item)}
            isLoading={updateItemMutation.isPending || changeQuantityMutation.isPending}
            submitLabel="Salvar Alterações"
          />
        </div>
      </div>
    </div>
  );
}

export default EditItemModal;