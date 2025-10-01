'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dependentSchema, DependentFormData } from '@/lib/schemas/dependent.schema';
import { useCreateDependent } from '@/hooks/use-dependents';
import { CreateDependentData } from '@/types/dependent';
import toast from 'react-hot-toast';

// Opções para os campos de data
const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1);
const monthOptions = [
  { value: 1, label: 'Janeiro' },
  { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' },
  { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' },
];

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
      // Converter os campos de data separados em uma string de data
      let birthDateString = '';
      if (data.birthDate?.day && data.birthDate?.month) {
        const year = data.birthDate.year || new Date().getFullYear();
        const month = String(data.birthDate.month).padStart(2, '0');
        const day = String(data.birthDate.day).padStart(2, '0');
        birthDateString = `${year}-${month}-${day}`;
      }

      const submitData: CreateDependentData = {
        name: data.name,
        birthDate: birthDateString,
        relationship: data.relationship as 'son' | 'daughter' | 'brother' | 'sister' | 'nephew' | 'niece' | 'other',
      };

      await createDependentMutation.mutateAsync(submitData);
      toast.success('Dependente adicionado com sucesso!');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erro ao criar dependente:', error);
      toast.error('Erro ao adicionar dependente');
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
                id="name"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Nome do dependente"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Data de nascimento (opcional)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {/* Dia */}
                <div>
                  <label htmlFor="birthDate.day" className="block text-xs font-medium text-gray-600 mb-1">
                    Dia
                  </label>
                  <select
                    {...register('birthDate.day', { valueAsNumber: true })}
                    id="birthDate.day"
                    className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                  >
                    <option value="">Selecione</option>
                    {dayOptions.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  {errors.birthDate?.day && (
                    <p className="mt-1 text-xs text-red-600">{errors.birthDate.day.message}</p>
                  )}
                </div>

                {/* Mês */}
                <div>
                  <label htmlFor="birthDate.month" className="block text-xs font-medium text-gray-600 mb-1">
                    Mês
                  </label>
                  <select
                    {...register('birthDate.month', { valueAsNumber: true })}
                    id="birthDate.month"
                    className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                  >
                    <option value="">Selecione</option>
                    {monthOptions.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                  {errors.birthDate?.month && (
                    <p className="mt-1 text-xs text-red-600">{errors.birthDate.month.message}</p>
                  )}
                </div>

                {/* Ano */}
                <div>
                  <label htmlFor="birthDate.year" className="block text-xs font-medium text-gray-600 mb-1">
                    Ano (opcional)
                  </label>
                  <input
                    {...register('birthDate.year', { valueAsNumber: true })}
                    id="birthDate.year"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                    placeholder="Ex: 1990"
                  />
                  {errors.birthDate?.year && (
                    <p className="mt-1 text-xs text-red-600">{errors.birthDate.year.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="relationship" className="block text-sm font-medium text-dark mb-1">
                Parentesco *
              </label>
              <select
                {...register('relationship')}
                id="relationship"
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
