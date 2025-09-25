'use client';

import { useState } from 'react';
import { useUpdateWishlistSharing } from '@/hooks/useUpdateWishlistSharing';
import { Wishlist } from '@/types/wishlist';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface ShareWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Wishlist;
}

export function ShareWishlistModal({ isOpen, onClose, wishlist }: ShareWishlistModalProps) {
  const [isPublic, setIsPublic] = useState(wishlist.sharing?.isPublic || false);
  const updateSharingMutation = useUpdateWishlistSharing();

  const handleToggleSharing = async () => {
    const newIsPublic = !isPublic;
    setIsPublic(newIsPublic);

    try {
      await updateSharingMutation.mutateAsync({
        wishlistId: wishlist.id,
        data: { isPublic: newIsPublic }
      });

      toast.success(
        newIsPublic
          ? 'Lista tornada pública com sucesso!'
          : 'Lista tornada privada com sucesso!'
      );
    } catch {
      // Reverter o estado em caso de erro
      setIsPublic(!newIsPublic);
      toast.error('Erro ao atualizar configurações de compartilhamento');
    }
  };

  const handleCopyLink = async () => {
    if (wishlist.sharing?.publicLink) {
      try {
        await navigator.clipboard.writeText(wishlist.sharing.publicLink);
        toast.success('Link copiado para a área de transferência!');
      } catch {
        toast.error('Erro ao copiar link');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-dark">
              Compartilhar Lista
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Informações da lista */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">
                {wishlist.title}
              </h4>
              {wishlist.description && (
                <p className="text-sm text-gray-500">
                  {wishlist.description}
                </p>
              )}
            </div>

            {/* Toggle de compartilhamento */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Tornar lista pública
                </label>
                <p className="text-xs text-gray-500">
                  Listas públicas podem ser visualizadas por qualquer pessoa com o link
                </p>
              </div>
              <button
                onClick={handleToggleSharing}
                disabled={updateSharingMutation.isPending}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isPublic ? 'bg-primary' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isPublic ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Link público */}
            {isPublic && wishlist.sharing?.publicLink && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link público
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={wishlist.sharing.publicLink}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-600"
                  />
                  <Button
                    onClick={handleCopyLink}
                    variant="secondary"
                    className="px-3 py-2 text-sm"
                  >
                    Copiar
                  </Button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Compartilhe este link para que outras pessoas possam ver sua lista
                </p>
              </div>
            )}

            {/* Estado de carregamento */}
            {updateSharingMutation.isPending && (
              <div className="flex items-center justify-center py-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="ml-2 text-sm text-gray-600">Atualizando...</span>
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              onClick={onClose}
              variant="ghost"
            >
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
