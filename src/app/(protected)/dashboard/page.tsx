'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMyWishlists } from '@/hooks/useMyWishlists';
import { useDependents } from '@/hooks/use-dependents';
import { WishlistCard } from '@/components/wishlist/WishlistCard';
import { WishlistCardSkeleton } from '@/components/wishlist/WishlistCardSkeleton';
import { DependentCard } from '@/components/dependents/DependentCard';
import { AddDependentModal } from '@/components/dependents/AddDependentModal';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export default function DashboardPage() {
  const [showAddDependent, setShowAddDependent] = useState(false);

  // Hooks para buscar dados
  const { data: wishlists, isLoading: wishlistsLoading, isError: wishlistsError } = useMyWishlists();
  const { data: dependents, isLoading: dependentsLoading } = useDependents();

  // Função auxiliar para decidir o que renderizar - ordem correta: isLoading, isError, sucesso com dados, sucesso sem dados
  const renderWishlistContent = () => {
    // 1. Primeiro, verifique isLoading
    if (wishlistsLoading) {
      return Array.from({ length: 3 }).map((_, index) => (
        <WishlistCardSkeleton key={index} />
      ));
    }

    // 2. Segundo, verifique isError
    if (wishlistsError) {
      return (
        <div className="col-span-full text-center text-red-500 py-10">
          <h3 className="text-lg font-semibold mb-2">Erro ao carregar listas</h3>
          <p className="text-sm">Não foi possível carregar suas listas de desejos.</p>
        </div>
      );
    }

    // 3. Terceiro, verifique sucesso com dados - garanta que está fazendo .map() no array
    if (wishlists && wishlists.length > 0) {
      return wishlists.map((wishlist) => (
        <WishlistCard key={wishlist.id} wishlist={wishlist} />
      ));
    }

    // 4. Por último, sucesso sem dados - estado vazio
    return (
      <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-dark mb-2">Nenhuma lista encontrada</h3>
        <p className="text-gray-600 mb-6">Você ainda não criou nenhuma lista de desejos.</p>
        <Link href="/dashboard/new">
          <Button variant="primary" className="px-6 py-3 text-base">
            Criar primeira lista
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Seção Minhas Listas de Desejos */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold font-display">Minhas Listas de Desejos</h2>
            <p className="text-sm text-dark-light">
              {!wishlistsLoading && wishlists ? `${wishlists.length} lista(s) encontrada(s)` : 'Carregando...'}
            </p>
          </div>
          <Link href="/dashboard/new">
            <Button variant="ghost">
              <Plus className="mr-2 h-4 w-4" />
              Nova Lista
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {renderWishlistContent()}
        </div>
      </section>

      {/* Seção Meus Dependentes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold font-display">Meus Dependentes</h2>
            <p className="text-sm text-dark-light">
              {!dependentsLoading && dependents ? `${dependents.length} dependente(s) cadastrado(s)` : 'Carregando...'}
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => setShowAddDependent(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Dependente
          </Button>
        </div>

        {dependentsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse">
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : dependents && dependents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dependents.map((dependent) => (
              <DependentCard key={dependent.id} dependent={dependent} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-dark mb-2">Nenhum dependente cadastrado</h3>
            <p className="text-gray-600 mb-6">Adicione dependentes para gerenciar suas listas de desejos.</p>
            <Button
              onClick={() => setShowAddDependent(true)}
              variant="secondary"
              className="px-6 py-3 text-base"
            >
              Adicionar primeiro dependente
            </Button>
          </div>
        )}
      </section>

      {/* Modal para adicionar dependente */}
      {showAddDependent && (
        <AddDependentModal
          onClose={() => setShowAddDependent(false)}
          onSuccess={() => {
            setShowAddDependent(false);
            // O hook useDependents irá atualizar automaticamente
          }}
        />
      )}
    </div>
  );
}