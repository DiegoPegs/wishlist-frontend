'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { createDependentFormSchema, createDependentSchema, CreateDependentFormData } from '@/lib/schemas/dependent.schema';
import { CreateDependentData } from '@/types/dependent';
import toast from 'react-hot-toast';

// Mapa de tradução para as opções de parentesco
const relationshipLabels = {
  son: 'Filho',
  daughter: 'Filha',
  brother: 'Irmão',
  sister: 'Irmã',
  nephew: 'Sobrinho',
  niece: 'Sobrinha',
  other: 'Outro',
};

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

interface CreateDependentFormProps {
  onSubmit: (data: CreateDependentData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const CreateDependentForm: React.FC<CreateDependentFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateDependentFormData>({
    resolver: zodResolver(createDependentFormSchema),
    defaultValues: {
      fullName: '',
      birthDay: '',
      birthMonth: '',
      birthYear: '',
      relationship: '',
    },
  });

  const handleFormSubmit = async (data: CreateDependentFormData) => {
    setError(null);

    try {
      // Validar os dados com o schema de validação
      const validatedData = createDependentSchema.parse(data);

      // Converter os campos de data separados em uma string de data
      let birthDateString = '';
      if (validatedData.birthDay && validatedData.birthMonth) {
        const year = validatedData.birthYear || new Date().getFullYear();
        const month = String(validatedData.birthMonth).padStart(2, '0');
        const day = String(validatedData.birthDay).padStart(2, '0');
        birthDateString = `${year}-${month}-${day}`;
      }

      const submitData: CreateDependentData = {
        name: validatedData.fullName,
        birthDate: birthDateString,
        relationship: validatedData.relationship as 'son' | 'daughter' | 'brother' | 'sister' | 'nephew' | 'niece' | 'other',
      };

      await onSubmit(submitData);
      toast.success('Dependente adicionado com sucesso!');
      reset();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar dependente';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
        <div className="space-y-6">
          {/* Nome */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Nome Completo *
            </label>
            <input
              {...register('fullName')}
              id="fullName"
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Ex: João Silva"
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
          </div>

          {/* Data de Nascimento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data de Nascimento (opcional)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {/* Dia */}
              <div>
                <label htmlFor="birthDay" className="block text-xs font-medium text-gray-600 mb-1">
                  Dia
                </label>
                <select
                  {...register('birthDay')}
                  id="birthDay"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                >
                  <option value="">Selecione</option>
                  {dayOptions.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                {errors.birthDay && <p className="mt-1 text-xs text-red-600">{errors.birthDay.message}</p>}
              </div>

              {/* Mês */}
              <div>
                <label htmlFor="birthMonth" className="block text-xs font-medium text-gray-600 mb-1">
                  Mês
                </label>
                <select
                  {...register('birthMonth')}
                  id="birthMonth"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                >
                  <option value="">Selecione</option>
                  {monthOptions.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
                {errors.birthMonth && <p className="mt-1 text-xs text-red-600">{errors.birthMonth.message}</p>}
              </div>

              {/* Ano */}
              <div>
                <label htmlFor="birthYear" className="block text-xs font-medium text-gray-600 mb-1">
                  Ano (opcional)
                </label>
                <input
                  {...register('birthYear')}
                  id="birthYear"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Ex: 1990"
                />
                {errors.birthYear && <p className="mt-1 text-xs text-red-600">{errors.birthYear.message}</p>}
              </div>
            </div>
          </div>

          {/* Relacionamento */}
          <div>
            <label htmlFor="relationship" className="block text-sm font-medium text-gray-700">
              Relacionamento *
            </label>
            <select
              {...register('relationship')}
              id="relationship"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
              <option value="">Selecione o parentesco</option>
              {Object.entries(relationshipLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {errors.relationship && <p className="mt-1 text-sm text-red-600">{errors.relationship.message}</p>}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Botões */}
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          Adicionar Dependente
        </Button>
      </div>
    </form>
  );
};
