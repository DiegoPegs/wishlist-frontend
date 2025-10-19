'use client';

import { use } from 'react';
import { usePublicWishlist } from '@/hooks/usePublicWishlist';
import { PublicItemCard } from '@/components/item/PublicItemCard';
import { formatDate } from '@/lib/formatters';
import { Heart, Calendar, Package, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface PublicWishlistPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default function PublicWishlistPage({ params }: PublicWishlistPageProps) {
  const { token } = use(params);
  const { data: wishlist, isLoading, isError } = usePublicWishlist(token);

  // Componente de loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="bg-gray-200 rounded-lg h-24"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Componente de erro
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Lista não encontrada
            </h1>
            <p className="text-gray-600 mb-4">
              Esta lista de desejos não existe, foi removida ou é privada.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
            >
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Renderização da wishlist
  if (!wishlist) return null;

  const totalValue = wishlist.items?.reduce((sum, item) => {
    let price = 0;
    if (typeof item.price === 'number') {
      price = item.price;
    } else if (typeof item.price === 'object' && item.price) {
      const priceObj = item.price as { min?: number; max?: number };
      price = priceObj.min || 0;
    }
    let quantity = 1;
    if (typeof item.quantity === 'object' && item.quantity) {
      quantity = (item.quantity as { desired?: number }).desired || 1;
    } else if (typeof item.quantity === 'number') {
      quantity = item.quantity;
    }
    return sum + (price * quantity);
  }, 0) || 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Título principal */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Lista de Desejos de {wishlist?.ownerName || 'Usuário'}
          </h1>

          {/* CTA Banner */}
          <div className="bg-primary/20 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-900">
              Gostou da ideia? Crie sua própria Kero Wishlist!
            </h2>
            <p className="text-gray-700 mb-4">
              Organize seus desejos e compartilhe com quem você ama.
            </p>
            <div className="flex justify-center">
              <Link href="/register">
                <Button variant="primary" className="font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Quero criar minha lista!
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Header da wishlist */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {wishlist.title}
              </h2>
              {wishlist.description && (
                <p className="text-gray-600 text-lg">
                  {wishlist.description}
                </p>
              )}
            </div>
            <div className="flex items-center text-primary">
              <Heart className="w-8 h-8" />
            </div>
          </div>

          {/* Estatísticas da wishlist */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Itens</p>
                <p className="text-xl font-semibold text-gray-900">
                  {wishlist.items?.length || 0}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Valor total</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatPrice(totalValue)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Criada em</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatDate(wishlist.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de itens */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Itens da Lista
          </h2>

          {wishlist.items && wishlist.items.length > 0 ? (
            <div className="space-y-4">
              {wishlist.items.map((item, index) => (
                <PublicItemCard key={item.id || `item-${index}`} item={item} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum item na lista
              </h3>
              <p className="text-gray-500">
                Esta lista ainda não possui itens.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Lista compartilhada via{' '}
            <span className="font-semibold text-primary">Kero Wishlist</span>
          </p>
        </div>
      </div>
    </div>
  );
}
