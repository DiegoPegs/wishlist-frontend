'use client';

import { useState } from 'react';
import { ItemForm } from './ItemForm';
import { CreateItemData, UpdateItemData } from '@/types/wishlist';
import { CreateItemDto } from '@/types/item-dto';
import { useCreateItem } from '@/hooks/use-wishlists';
import { useTranslations } from '@/hooks/useTranslations';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistId: string;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  wishlistId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const createItemMutation = useCreateItem(wishlistId);
  const t = useTranslations('item');

  const handleSubmit = async (data: CreateItemData | UpdateItemData) => {
    setIsLoading(true);
    try {
      // Mapear dados do formulário para o DTO do backend
      const payload: CreateItemDto = {
        title: data.title || '', // Agora usando title diretamente
        description: data.description,
        itemType: data.itemType || 'SPECIFIC_PRODUCT',
        quantity: data.quantity ? { desired: Number(data.quantity) } : undefined, // Estruturado como objeto
        price: data.price,
        currency: data.currency,
        // Envia link e imageUrl apenas se não forem vazios
        ...(data.url && data.url.trim() !== '' && { link: data.url }),
        ...(data.imageUrl && data.imageUrl.trim() !== '' && { imageUrl: data.imageUrl }),
      };

      await createItemMutation.mutateAsync(payload);
      onClose();
    } catch (error) {
      throw error; // Re-throw para o ItemForm tratar
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

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
                {t('addItemTitle')}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {t('addItemDescription')}
              </p>
            </div>

            <ItemForm
              onSubmit={handleSubmit}
              onCancel={onClose}
              isLoading={isLoading}
              submitLabel={t('addItem')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
