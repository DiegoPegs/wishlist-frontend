'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateDependent } from '@/hooks/use-dependents';

const dependentSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
  relationship: z.enum(['son', 'daughter', 'brother', 'sister', 'nephew', 'niece', 'other']).refine((val) => val !== undefined, {
    message: 'Selecione o parentesco',
  }),
});

type DependentFormData = z.infer<typeof dependentSchema>;

interface AddDependentModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const relationshipLabels = {
  son: 'Filho',
  daughter: 'Filha',
  brother: 'Irmão',
  sister: 'Irmã',
  nephew: 'Sobrinho',
  niece: 'Sobrinha',
  other: 'Outro',
};

export function AddDependentModal({ onClose, onSuccess }: AddDependentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createDependentMutation = useCreateDependent();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DependentFormData>({
    resolver: zodResolver(dependentSchema),
  });

  const onSubmit = async (data: DependentFormData) => {
    setIsSubmitting(true);
    try {
      await createDependentMutation.mutateAsync(data);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erro ao criar dependente:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-dark">
              Adicionar Dependente
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-dark mb-1">
                Nome completo
              </label>
              <input
                {...register('name')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Nome do dependente"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-dark mb-1">
                Data de nascimento
              </label>
              <input
                {...register('birthDate')}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              {errors.birthDate && (
                <p className="mt-1 text-sm text-red-600">{errors.birthDate.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="relationship" className="block text-sm font-medium text-dark mb-1">
                Parentesco
              </label>
              <select
                {...register('relationship')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Selecione o parentesco</option>
                {Object.entries(relationshipLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.relationship && (
                <p className="mt-1 text-sm text-red-600">{errors.relationship.message}</p>
              )}
            </div>

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
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Adicionando...' : 'Adicionar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
