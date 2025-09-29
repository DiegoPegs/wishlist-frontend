'use client';

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface DeleteWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  wishlistTitle: string;
  isLoading?: boolean;
}

export function DeleteWishlistModal({
  isOpen,
  onClose,
  onConfirm,
  wishlistTitle,
  isLoading = false,
}: DeleteWishlistModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Erro ao excluir wishlist:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-red-100 p-2 rounded-full mr-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Excluir Wishlist
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting || isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Tem certeza que deseja excluir a wishlist{' '}
            <span className="font-semibold text-gray-900">&ldquo;{wishlistTitle}&rdquo;</span>?
          </p>
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-800">
              <strong>Atenção:</strong> Esta ação não pode ser desfeita. Todos os itens da wishlist serão permanentemente excluídos.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isDeleting || isLoading}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting || isLoading}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isDeleting || isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Excluindo...
              </>
            ) : (
              'Sim, Excluir'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
