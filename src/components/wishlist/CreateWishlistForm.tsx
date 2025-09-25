'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { CreateWishlistData } from '@/types/wishlist';
import toast from 'react-hot-toast';

const createWishlistSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
});

type CreateWishlistFormData = z.infer<typeof createWishlistSchema>;

interface CreateWishlistFormProps {
  onSubmit: (data: CreateWishlistData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  submitLabel?: string;
  titlePlaceholder?: string;
  descriptionPlaceholder?: string;
}

export const CreateWishlistForm: React.FC<CreateWishlistFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = 'Criar Lista',
  titlePlaceholder = 'Ex: Lista de Aniversário',
  descriptionPlaceholder = 'Descreva sua lista de desejos...',
}) => {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateWishlistFormData>({
    resolver: zodResolver(createWishlistSchema),
  });

  const handleFormSubmit = async (data: CreateWishlistFormData) => {
    setError(null);

    try {
      await onSubmit(data);
      toast.success('Lista de desejos criada com sucesso!');
      reset();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar lista de desejos';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
        <div className="space-y-6">
          {/* Título */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Título da Lista *
            </label>
            <input
              {...register('title')}
              id="title"
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder={titlePlaceholder}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              {...register('description')}
              id="description"
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder={descriptionPlaceholder}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Botões */}
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
