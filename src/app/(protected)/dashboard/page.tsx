'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useWishlists } from '@/hooks/use-wishlists';
import { useDependents } from '@/hooks/use-dependents';
import { WishlistCard } from '@/components/wishlist/WishlistCard';
import { DependentCard } from '@/components/dependents/DependentCard';
import { AddDependentModal } from '@/components/dependents/AddDependentModal';
import Link from 'next/link';

export default function DashboardPage() {
  const [showAddDependent, setShowAddDependent] = useState(false);

  const { data: wishlists, isLoading: wishlistsLoading } = useWishlists();
  const { data: dependents, isLoading: dependentsLoading } = useDependents();


  return (
    <ProtectedRoute>
      <div className="space-y-8">
        {/* Minhas Listas de Desejos */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-dark">Minhas Listas de Desejos</h2>
              <p className="text-gray-600 mt-1">
                {wishlistsLoading ? 'Carregando...' : `${wishlists?.length || 0} ${(wishlists?.length || 0) === 1 ? 'lista' : 'listas'} encontrada${(wishlists?.length || 0) === 1 ? '' : 's'}`}
              </p>
            </div>
            <Link
              href="/dashboard/new"
              className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary/90 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nova Lista
            </Link>
          </div>

          {wishlistsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
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
          ) : wishlists && wishlists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlists.map((wishlist) => (
                <WishlistCard key={wishlist.id} wishlist={wishlist} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-dark mb-2">Nenhuma lista encontrada</h3>
              <p className="text-gray-600 mb-6">Você ainda não criou nenhuma lista de desejos.</p>
              <Link
                href="/dashboard/new"
                className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary/90"
              >
                Criar primeira lista
              </Link>
            </div>
          )}
        </section>

        {/* Meus Dependentes */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-dark">Meus Dependentes</h2>
              <p className="text-gray-600 mt-1">
                {dependentsLoading ? 'Carregando...' : `${dependents?.length || 0} ${(dependents?.length || 0) === 1 ? 'dependente' : 'dependentes'} cadastrado${(dependents?.length || 0) === 1 ? '' : 's'}`}
              </p>
            </div>
            <button
              onClick={() => setShowAddDependent(true)}
              className="bg-secondary text-white px-4 py-2 rounded-md font-medium hover:bg-secondary/90 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Adicionar Dependente
            </button>
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
              <button
                onClick={() => setShowAddDependent(true)}
                className="bg-secondary text-white px-6 py-3 rounded-md font-medium hover:bg-secondary/90"
              >
                Adicionar primeiro dependente
              </button>
            </div>
          )}
        </section>

        {/* Modal para adicionar dependente */}
        {showAddDependent && (
          <AddDependentModal
            onClose={() => setShowAddDependent(false)}
            onSuccess={() => {
              // O hook useDependents irá atualizar automaticamente
            }}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
