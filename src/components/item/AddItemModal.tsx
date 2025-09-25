'use client';

import { useState } from 'react';
import { ItemForm } from './ItemForm';
import { CreateItemData, UpdateItemData } from '@/types/wishlist';
import { useCreateItem } from '@/hooks/use-wishlists';

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

  const handleSubmit = async (data: CreateItemData | UpdateItemData) => {
    setIsLoading(true);
    try {
      await createItemMutation.mutateAsync(data as CreateItemData);
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
                Adicionar Item à Lista
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Adicione um novo item à sua lista de desejos.
              </p>
            </div>

            <ItemForm
              onSubmit={handleSubmit}
              onCancel={onClose}
              isLoading={isLoading}
              submitLabel="Adicionar Item"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
