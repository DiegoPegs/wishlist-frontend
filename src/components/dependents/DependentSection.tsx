'use client';

import { useState } from 'react';
import { useMyDependents } from '@/hooks/useMyDependents';
import { useDeleteDependent } from '@/hooks/use-dependents';
import { DependentCard } from '@/components/dependents/DependentCard';
import { AddDependentModal } from '@/components/dependents/AddDependentModal';
import { DeleteDependentModal } from '@/components/dependents/DeleteDependentModal';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { Dependent } from '@/types/dependent';
import { toast } from 'react-hot-toast';

export function DependentSection() {
  const [showAddDependent, setShowAddDependent] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [dependentToDelete, setDependentToDelete] = useState<Dependent | null>(null);

  // Hook para buscar dados dos dependentes
  const { data: dependents, isLoading } = useMyDependents();
  const deleteDependentMutation = useDeleteDependent();
  const t = useTranslations('dependents');
  const tCommon = useTranslations('common');

  const handleDeleteClick = (dependentId: string) => {
    const dependent = dependents?.find(d => d.id === dependentId);
    if (dependent) {
      setDependentToDelete(dependent);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (dependentToDelete) {
      try {
        await deleteDependentMutation.mutateAsync(dependentToDelete.id);
        toast.success(t('dependentDeletedSuccess'));
        setIsDeleteModalOpen(false);
        setDependentToDelete(null);
      } catch (error) {
        console.error('Erro ao excluir dependente:', error);
        toast.error(t('dependentDeleteError'));
      }
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold font-display">{t('title')}</h2>
          <p className="text-sm text-dark-light">
            {!isLoading && dependents ? `${dependents.length} dependente(s) cadastrado(s)` : tCommon('loading')}
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => setShowAddDependent(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('addDependent')}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={`dependent-skeleton-${i}`} className="bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse">
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
          {dependents.map((dependent, index) => (
            <DependentCard
              key={dependent.id || `dependent-${index}`}
              dependent={dependent}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-dark mb-2">{t('noDependents')}</h3>
          <p className="text-gray-600 mb-6">{t('addFirstDependent')}</p>
          <Button
            onClick={() => setShowAddDependent(true)}
            variant="primary"
            className="px-6 py-3 text-base"
          >
            {t('addDependent')}
          </Button>
        </div>
      )}

      {/* Modal para adicionar dependente */}
      {showAddDependent && (
        <AddDependentModal
          onClose={() => setShowAddDependent(false)}
          onSuccess={() => {
            setShowAddDependent(false);
            // O hook useMyDependents irá atualizar automaticamente
          }}
        />
      )}

      {/* Modal para excluir dependente */}
      {dependentToDelete && (
        <DeleteDependentModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDependentToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          dependentName={dependentToDelete.name}
          isLoading={deleteDependentMutation.isPending}
        />
      )}
    </section>
  );
}
