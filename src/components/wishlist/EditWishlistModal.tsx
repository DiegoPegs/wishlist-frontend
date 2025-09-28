'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useUpdateWishlist } from '@/hooks/useUpdateWishlist';
import toast from 'react-hot-toast';

const editWishlistSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(100, 'Título deve ter no máximo 100 caracteres'),
  description: z.string().max(500, 'Descrição deve ter no máximo 500 caracteres').optional(),
});

type EditWishlistFormData = z.infer<typeof editWishlistSchema>;

interface EditWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistId: string;
  currentTitle: string;
  currentDescription?: string;
}

export function EditWishlistModal({
  isOpen,
  onClose,
  wishlistId,
  currentTitle,
  currentDescription = '',
}: EditWishlistModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const updateWishlistMutation = useUpdateWishlist(wishlistId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditWishlistFormData>({
    resolver: zodResolver(editWishlistSchema),
    defaultValues: {
      title: currentTitle,
      description: currentDescription,
    },
  });

  const onSubmit = async (data: EditWishlistFormData) => {
    if (!wishlistId) {
      toast.error('ID da wishlist não encontrado');
      return;
    }

    setIsLoading(true);
    try {
      await updateWishlistMutation.mutateAsync({
        title: data.title.trim(),
        description: data.description?.trim() || undefined,
      });
      toast.success('Lista atualizada com sucesso!');
      onClose();
    } catch (error: unknown) {
      console.error('Erro ao atualizar lista:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Erro ao atualizar lista. Tente novamente.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Editar Lista</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Título da Lista *
              </label>
              <input
                {...register('title')}
                id="title"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Digite o título da lista"
                disabled={isLoading}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                {...register('description')}
                id="description"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Digite uma descrição para a lista (opcional)"
                disabled={isLoading}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
