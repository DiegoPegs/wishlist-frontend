'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useDependent } from '@/hooks/use-dependents';
import { useDependentWishlists } from '@/hooks/use-dependent-wishlists';
import { useCreateDependentWishlist } from '@/hooks/use-dependent-wishlists';
import { WishlistCard } from '@/components/wishlist/WishlistCard';
import { CreateWishlistModal } from '@/components/wishlist/CreateWishlistModal';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function DependentManagementPage() {
  const params = useParams();
  const dependentId = params.id as string;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: dependent, isLoading: dependentLoading, error: dependentError } = useDependent(dependentId);
  const { data: wishlists, isLoading: wishlistsLoading } = useDependentWishlists(dependentId);
  const createWishlistMutation = useCreateDependentWishlist(dependentId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  const relationshipLabels = {
    son: 'Filho',
    daughter: 'Filha',
    brother: 'Irmão',
    sister: 'Irmã',
    nephew: 'Sobrinho',
    niece: 'Sobrinha',
    other: 'Outro',
  };

  const handleCreateWishlist = async (data: { title: string; description?: string }) => {
    try {
      await createWishlistMutation.mutateAsync(data);
      toast.success('Lista de desejos criada com sucesso!');
      setIsCreateModalOpen(false);
    } catch (error) {
      throw error; // Re-throw para o modal tratar
    }
  };

  if (dependentLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200">
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
        </div>
      </div>
    );
  }

  if (dependentError || !dependent) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-dark mb-2">Erro ao carregar dependente</h3>
        <p className="text-gray-600 mb-4">Ocorreu um erro ao carregar os dados do dependente.</p>
        <Link href="/dashboard">
          <Button variant="primary">
            Voltar ao Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const age = calculateAge(dependent.birthDate);

  return (
    <div className="space-y-6">
      {/* Header do Dependente */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-dark mb-2">
              {dependent.name}
            </h1>
            <div className="space-y-1 text-gray-600">
              <p>
                <span className="font-medium">Parentesco:</span> {relationshipLabels[dependent.relationship]}
              </p>
              <p>
                <span className="font-medium">Idade:</span> {age} anos
              </p>
              <p>
                <span className="font-medium">Nascido em:</span> {formatDate(dependent.birthDate)}
              </p>
            </div>
          </div>
          <div className="ml-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Dependente
            </span>
          </div>
        </div>

        {dependent.secondGuardianId && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Segundo Guardião:</h4>
            <p className="text-sm text-gray-600">{dependent.secondGuardianName}</p>
          </div>
        )}
      </div>

      {/* Listas do Dependente */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-dark">Listas de Desejos</h2>
            <p className="text-gray-600 mt-1">
              {wishlistsLoading ? 'Carregando...' : `${wishlists?.length || 0} ${(wishlists?.length || 0) === 1 ? 'lista' : 'listas'} encontrada${(wishlists?.length || 0) === 1 ? '' : 's'}`}
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            variant="ghost"
            className="flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova Lista
          </Button>
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
        ) : wishlists && (wishlists.length || 0) > 0 ? (
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
            <p className="text-gray-600 mb-6">Crie listas de desejos para {dependent.name}.</p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              variant="primary"
              className="px-6 py-3 text-base"
            >
              Criar primeira lista
            </Button>
          </div>
        )}
      </div>

      {/* Modal de Criação de Wishlist */}
      <CreateWishlistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateWishlist}
        title={`Criar Lista para ${dependent?.name}`}
        description={`Crie uma nova lista de desejos para ${dependent?.name}.`}
        submitLabel="Criar Lista"
        titlePlaceholder={`Ex: Lista de Aniversário do ${dependent?.name}`}
        descriptionPlaceholder={`Descreva a lista de desejos para ${dependent?.name}...`}
      />
    </div>
  );
}
