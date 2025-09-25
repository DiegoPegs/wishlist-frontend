'use client';

import { useState } from 'react';
import { CreateDependentForm } from './CreateDependentForm';
import { CreateDependentData } from '@/types/dependent';
import { useCreateDependent } from '@/hooks/use-dependents';

interface CreateDependentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateDependentModal: React.FC<CreateDependentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const createDependentMutation = useCreateDependent();

  const handleSubmit = async (data: CreateDependentData) => {
    setIsLoading(true);
    try {
      await createDependentMutation.mutateAsync(data);
      onClose();
    } catch (error) {
      throw error; // Re-throw para o CreateDependentForm tratar
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Adicionar Dependente
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Adicione um novo dependente à sua conta.
              </p>
            </div>

            <CreateDependentForm
              onSubmit={handleSubmit}
              onCancel={onClose}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
