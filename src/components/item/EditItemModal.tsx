'use client';

import { useState } from 'react';
import { ItemForm } from './ItemForm';
import { UpdateItemData } from '@/types/wishlist';
import { useUpdateItem } from '@/hooks/use-items';
import { WishlistItem } from '@/types/wishlist';

interface EditItemModalProps {
  item: WishlistItem;
  onClose: () => void;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  item,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const updateItemMutation = useUpdateItem();

  // Converter o item para o formato do formulário
  const getInitialData = (item: WishlistItem) => {
    // Converter quantidade de objeto para número se necessário
    let quantity = 1;
    if (typeof item.quantity === 'object' && item.quantity) {
      quantity = (item.quantity as { desired?: number }).desired || 1;
    } else if (typeof item.quantity === 'number') {
      quantity = item.quantity;
    }

    // Converter preço de número para objeto se necessário
    let price = undefined;
    if (typeof item.price === 'number') {
      price = { min: item.price };
    } else if (typeof item.price === 'object' && item.price) {
      price = item.price;
    }

    return {
      title: item.title,
      description: item.description || '',
      price,
      currency: item.currency || 'BRL',
      url: item.url || '',
      imageUrl: item.imageUrl || '',
      quantity,
      itemType: item.itemType || 'SPECIFIC_PRODUCT',
    };
  };

  const handleSubmit = async (data: UpdateItemData) => {
    setIsLoading(true);
    try {
      await updateItemMutation.mutateAsync({
        id: item.id,
        data,
      });
      onClose();
    } catch (error) {
      throw error; // Re-throw para o ItemForm tratar
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Editar Item
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Edite as informações do item &quot;{item.title}&quot;.
              </p>
            </div>

            <ItemForm
              onSubmit={handleSubmit}
              onCancel={onClose}
              initialData={getInitialData(item)}
              isLoading={isLoading}
              submitLabel="Salvar Alterações"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditItemModal;
