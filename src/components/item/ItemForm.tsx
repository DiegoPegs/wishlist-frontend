'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { CreateItemData, UpdateItemData } from '@/types/wishlist';
import toast from 'react-hot-toast';

const itemFormSchema = z.object({
  name: z.string().min(1, 'Nome do item é obrigatório'),
  description: z.string().optional(),
  price: z.number().min(0, 'Preço deve ser maior ou igual a zero').optional(),
  currency: z.string().optional(),
  url: z.string().url('URL inválida').optional().or(z.literal('')),
  imageUrl: z.string().url('URL da imagem inválida').optional().or(z.literal('')),
  quantity: z.number().min(1, 'Quantidade deve ser pelo menos 1').optional(),
  itemType: z.enum(['SPECIFIC_PRODUCT', 'ONGOING_SUGGESTION']),
});

type ItemFormData = z.infer<typeof itemFormSchema>;

interface ItemFormProps {
  onSubmit: (data: CreateItemData | UpdateItemData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<ItemFormData>;
  isLoading?: boolean;
  submitLabel?: string;
}

export const ItemForm: React.FC<ItemFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
  submitLabel = 'Adicionar Item',
}) => {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      itemType: 'SPECIFIC_PRODUCT',
      ...initialData,
    },
  });

  const watchedItemType = watch('itemType');

  const handleFormSubmit = async (data: ItemFormData) => {
    setError(null);

    try {
      // Se for ONGOING_SUGGESTION, remover quantity dos dados
      const submitData = { ...data };
      if (data.itemType === 'ONGOING_SUGGESTION') {
        delete submitData.quantity;
      }

      await onSubmit(submitData);
      toast.success('Item salvo com sucesso!');
      reset();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao salvar item';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
        <div className="space-y-6">
          {/* Tipo do Item */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo do Item *
            </label>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  {...register('itemType')}
                  id="specific-product"
                  type="radio"
                  value="SPECIFIC_PRODUCT"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <label htmlFor="specific-product" className="ml-3 block text-sm text-gray-700">
                  <span className="font-medium">Produto Específico</span>
                  <p className="text-xs text-gray-500">Um produto específico com quantidade definida</p>
                </label>
              </div>
              <div className="flex items-center">
                <input
                  {...register('itemType')}
                  id="ongoing-suggestion"
                  type="radio"
                  value="ONGOING_SUGGESTION"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <label htmlFor="ongoing-suggestion" className="ml-3 block text-sm text-gray-700">
                  <span className="font-medium">Ideia de Presente</span>
                  <p className="text-xs text-gray-500">Uma sugestão contínua sem quantidade específica</p>
                </label>
              </div>
            </div>
            {errors.itemType && (
              <p className="mt-1 text-sm text-red-600">{errors.itemType.message}</p>
            )}
          </div>

          {/* Nome */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome do Item *
            </label>
            <input
              {...register('name')}
              id="name"
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Ex: iPhone 15 Pro"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
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
              placeholder="Descreva o item..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          {/* Preço */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Preço (opcional)
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                R$
              </span>
              <input
                {...register('price', { valueAsNumber: true })}
                id="price"
                type="number"
                step="0.01"
                min="0"
                className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-none rounded-r-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="0.00"
              />
            </div>
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
          </div>

          {/* Quantidade - Renderização Condicional */}
          {watchedItemType === 'SPECIFIC_PRODUCT' && (
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantidade *
              </label>
              <input
                {...register('quantity', { valueAsNumber: true })}
                id="quantity"
                type="number"
                min="1"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="1"
              />
              {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>}
            </div>
          )}

          {/* URL */}
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700">
              URL do Produto (opcional)
            </label>
            <input
              {...register('url')}
              id="url"
              type="url"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="https://exemplo.com/produto"
            />
            {errors.url && <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>}
          </div>

          {/* URL da Imagem */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
              URL da Imagem (opcional)
            </label>
            <input
              {...register('imageUrl')}
              id="imageUrl"
              type="url"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="https://exemplo.com/imagem.jpg"
            />
            {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>}
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
