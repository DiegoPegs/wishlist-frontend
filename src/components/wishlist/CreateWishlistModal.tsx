'use client';

import { useState } from 'react';
import { CreateWishlistForm } from './CreateWishlistForm';
import { CreateWishlistData } from '@/types/wishlist';

interface CreateWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateWishlistData) => Promise<void>;
  title?: string;
  description?: string;
  submitLabel?: string;
  titlePlaceholder?: string;
  descriptionPlaceholder?: string;
}

export const CreateWishlistModal: React.FC<CreateWishlistModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title = 'Criar Nova Lista de Desejos',
  description = 'Crie uma nova lista de desejos.',
  submitLabel = 'Criar Lista',
  titlePlaceholder = 'Ex: Lista de Aniversário',
  descriptionPlaceholder = 'Descreva sua lista de desejos...',
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreateWishlistData) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      throw error; // Re-throw para o CreateWishlistForm tratar
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
                {title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {description}
              </p>
            </div>

            <CreateWishlistForm
              onSubmit={handleSubmit}
              onCancel={onClose}
              isLoading={isLoading}
              submitLabel={submitLabel}
              titlePlaceholder={titlePlaceholder}
              descriptionPlaceholder={descriptionPlaceholder}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
