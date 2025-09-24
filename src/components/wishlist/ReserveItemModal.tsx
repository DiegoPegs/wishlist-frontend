'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WishlistItem } from '@/types/wishlist';

const reserveSchema = z.object({
  quantity: z.number().min(1, 'Quantidade deve ser pelo menos 1'),
  message: z.string().optional(),
});

type ReserveFormData = z.infer<typeof reserveSchema>;

interface ReserveItemModalProps {
  item: WishlistItem;
  onReserve: (quantity: number, message?: string) => void;
  onClose: () => void;
}

export function ReserveItemModal({ item, onReserve, onClose }: ReserveItemModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ReserveFormData>({
    resolver: zodResolver(reserveSchema),
    defaultValues: {
      quantity: 1,
      message: '',
    },
  });

  const watchedQuantity = watch('quantity');

  const onSubmit = async (data: ReserveFormData) => {
    setIsSubmitting(true);
    try {
      onReserve(data.quantity, data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price?: number, currency?: string) => {
    if (!price) return 'Preço não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency || 'BRL',
    }).format(price);
  };

  const totalPrice = item.price ? item.price * watchedQuantity : 0;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-dark">
              Reservar Item
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

          <div className="mb-6">
            <div className="flex items-start space-x-4">
              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded-md"
                />
              )}
              <div className="flex-1">
                <h4 className="font-medium text-dark">{item.name}</h4>
                <p className="text-sm text-gray-600">{formatPrice(item.price, item.currency)}</p>
                {item.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-dark mb-1">
                Quantidade
              </label>
              <input
                {...register('quantity', { valueAsNumber: true })}
                type="number"
                min="1"
                max={item.quantity || 1}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
              )}
              {item.quantity && (
                <p className="mt-1 text-xs text-gray-500">
                  Disponível: {item.quantity} unidades
                </p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-dark mb-1">
                Mensagem (opcional)
              </label>
              <textarea
                {...register('message')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Deixe uma mensagem para o dono da lista..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
              )}
            </div>

            {item.price && (
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Total:</span>
                  <span className="text-lg font-semibold text-dark">
                    {formatPrice(totalPrice, item.currency)}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-md hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Reservando...' : 'Confirmar Reserva'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
