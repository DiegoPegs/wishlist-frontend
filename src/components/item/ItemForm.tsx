'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import CurrencyInput from 'react-currency-input-field';
import { Button } from '@/components/ui/Button';
import { CreateItemData, UpdateItemData } from '@/types/wishlist';
import toast from 'react-hot-toast';

const itemFormSchema = z.object({
  title: z.string().min(1, 'Nome do item é obrigatório'),
  description: z.string().optional(),
  price: z.object({
    min: z.number().min(0, 'Preço mínimo deve ser maior ou igual a zero').optional(),
    max: z.number().min(0, 'Preço máximo deve ser maior ou igual a zero').optional(),
  }).optional(),
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
    control,
    formState: { errors },
    reset,
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      itemType: 'SPECIFIC_PRODUCT',
      quantity: 1,
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
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Nome do Item *
            </label>
            <input
              {...register('title')}
              id="title"
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Ex: iPhone 15 Pro"
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
              placeholder="Descreva o item..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          {/* Preço */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Faixa de Preço (opcional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price.min" className="block text-xs text-gray-600 mb-1">
                    Preço Mínimo
                  </label>
                  <Controller
                    name="price.min"
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput
                        value={field.value}
                        id="price.min"
                        placeholder="0,00"
                        intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        prefix="R$ "
                        decimalsLimit={2}
                        allowDecimals={true}
                        decimalSeparator=","
                        groupSeparator="."
                        onValueChange={(value, name, values) => {
                          // Usar values.float que já trata decimais corretamente
                          field.onChange(values?.float ?? undefined);
                        }}
                      />
                    )}
                  />
                  {errors.price?.min && (
                    <p className="mt-1 text-xs text-red-600">{errors.price.min.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="price.max" className="block text-xs text-gray-600 mb-1">
                    Preço Máximo
                  </label>
                  <Controller
                    name="price.max"
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput
                        value={field.value}
                        id="price.max"
                        placeholder="0,00"
                        intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        prefix="R$ "
                        decimalsLimit={2}
                        allowDecimals={true}
                        decimalSeparator=","
                        groupSeparator="."
                        onValueChange={(value, name, values) => {
                          // Usar values.float que já trata decimais corretamente
                          field.onChange(values?.float ?? undefined);
                        }}
                      />
                    )}
                  />
                  {errors.price?.max && (
                    <p className="mt-1 text-xs text-red-600">{errors.price.max.message}</p>
                  )}
                </div>
              </div>
            </div>
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
              Link do Produto (opcional)
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
