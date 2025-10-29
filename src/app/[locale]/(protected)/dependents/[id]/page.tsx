'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useDependent } from '@/hooks/useDependent';
import { useDependentWishlists } from '@/hooks/use-dependent-wishlists';
import { useCreateDependentWishlist } from '@/hooks/use-dependent-wishlists';
import { useHardDeleteDependentWishlist } from '@/hooks/use-dependent-operations';
import { WishlistCard } from '@/components/wishlist/WishlistCard';
import { CreateWishlistModal } from '@/components/wishlist/CreateWishlistModal';
import { ShareDependentWishlistModal } from '@/components/wishlist/ShareDependentWishlistModal';
import { DeleteWishlistModal } from '@/components/wishlist/DeleteWishlistModal';
import { Button } from '@/components/ui/Button';
import { formatBirthDateObject, calculateAge } from '@/lib/formatters';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { BackButton } from '@/components/ui/BackButton';
import { Wishlist } from '@/types';

export default function DependentManagementPage() {
  const params = useParams();
  const dependentId = params.id as string;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedWishlist, setSelectedWishlist] = useState<Wishlist | null>(null);

  const { data: dependent, isLoading: dependentLoading, error: dependentError } = useDependent(dependentId);
  const { data: wishlists, isLoading: wishlistsLoading, error: wishlistsError } = useDependentWishlists(dependentId);
  const createWishlistMutation = useCreateDependentWishlist(dependentId);
  const deleteWishlistMutation = useHardDeleteDependentWishlist(dependentId);

  // Debug logs
  console.log('🔍 Debug página dependente:', {
    dependentId,
    dependent,
    dependentLoading,
    dependentError,
    wishlists,
    wishlistsLoading,
    wishlistsError
  });

  const relationshipLabels: Record<string, string> = {
    CHILD: 'Filho(a)',
    SIBLING: 'Irmão/Irmã',
    NEPHEW_NIECE: 'Sobrinho(a)',
    OTHER: 'Outro',
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

  const handleShareWishlist = (wishlist: Wishlist) => {
    setSelectedWishlist(wishlist);
    setIsShareModalOpen(true);
  };

  const handleDeleteWishlist = (wishlist: Wishlist) => {
    setSelectedWishlist(wishlist);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedWishlist) {
      try {
        await deleteWishlistMutation.mutateAsync(selectedWishlist.id);
        toast.success('Lista de desejos excluída com sucesso!');
        setIsDeleteModalOpen(false);
        setSelectedWishlist(null);
      } catch (error) {
        console.error('Erro ao excluir wishlist:', error);
        toast.error('Erro ao excluir lista de desejos');
      }
    }
  };

  // Estados de carregamento e erro
  const isLoading = dependentLoading || wishlistsLoading;
  const isError = dependentError || wishlistsError || !dependent;

  // Renderização de Loading
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={`dependent-skeleton-${i}`} className="bg-white rounded-lg shadow-sm border border-gray-200">
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

  // Renderização de Erro
  if (isError) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-dark mb-2">Erro ao carregar dependente</h3>
        <p className="text-gray-600 mb-4">Ocorreu um erro ao carregar os dados do dependente.</p>
        <Link href="/pt-BR/dashboard">
          <Button variant="primary">
            Voltar ao Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const age = calculateAge(dependent.birthDate);
  const formattedBirthDate = formatBirthDateObject(dependent.birthDate);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <BackButton />

      {/* Header com título */}
      <h1 className="text-3xl font-bold font-display">{dependent.name}</h1>

      {/* Card de Perfil */}
      <div className="bg-light rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold font-display mb-4">Informações</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-dark-light">Parentesco</p>
            <p className="font-semibold">
              {dependent.relationship ? relationshipLabels[dependent.relationship] : 'Não informado'}
            </p>
          </div>
          <div>
            <p className="text-sm text-dark-light">Idade</p>
            <p className="font-semibold">{age ? `${age} anos` : 'Não informada'}</p>
          </div>
          <div>
            <p className="text-sm text-dark-light">Nascimento</p>
            <p className="font-semibold">{formattedBirthDate}</p>
          </div>
        </div>

        {dependent.secondGuardianId && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Segundo Guardião:</h4>
            <p className="text-sm text-gray-600">{dependent.secondGuardianName}</p>
          </div>
        )}
      </div>

      {/* Seção de Listas de Desejos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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

        {/* Renderização das Wishlists */}
        {(() => {
          console.log('🔍 Renderização wishlists:', {
            wishlistsLoading,
            wishlists,
            wishlistsLength: wishlists?.length,
            wishlistsError,
            wishlistsType: typeof wishlists,
            wishlistsIsArray: Array.isArray(wishlists),
            wishlistsFirstItem: wishlists?.[0]
          });

          if (wishlistsLoading) {
            console.log('📱 Mostrando skeleton loading');
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={`wishlist-skeleton-${i}`} className="bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse">
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
            );
          } else if (wishlists && wishlists.length > 0) {
            console.log('📱 Mostrando wishlists:', wishlists);
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlists.map((wishlist, index) => (
                  <WishlistCard
                    key={wishlist.id || wishlist._id || `wishlist-${index}`}
                    wishlist={wishlist}
                    dependentId={dependentId}
                    onShare={() => handleShareWishlist(wishlist)}
                    onDelete={() => handleDeleteWishlist(wishlist)}
                  />
                ))}
              </div>
            );
          } else {
            console.log('📱 Mostrando estado vazio');
            return (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-dark mb-2">Este dependente ainda não tem listas de desejos.</h3>
                <p className="text-gray-600 mb-6">Crie a primeira lista de desejos para {dependent.name}.</p>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  variant="primary"
                  className="px-6 py-3 text-base"
                >
                  Criar primeira lista
                </Button>
              </div>
            );
          }
        })()}
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

      {/* Modal de Compartilhamento */}
      {selectedWishlist && (
        <ShareDependentWishlistModal
          isOpen={isShareModalOpen}
          onClose={() => {
            setIsShareModalOpen(false);
            setSelectedWishlist(null);
          }}
          wishlist={selectedWishlist}
          dependentId={dependentId}
        />
      )}

      {/* Modal de Exclusão */}
      {selectedWishlist && (
        <DeleteWishlistModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedWishlist(null);
          }}
          onConfirm={handleConfirmDelete}
          wishlistTitle={selectedWishlist.title}
          isLoading={deleteWishlistMutation.isPending}
          isPermanent={true}
        />
      )}
    </div>
  );
}
