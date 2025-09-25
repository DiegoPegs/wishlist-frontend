'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { CreateDependentData } from '@/types/dependent';
import toast from 'react-hot-toast';

const createDependentSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
  relationship: z.enum(['son', 'daughter', 'brother', 'sister', 'nephew', 'niece', 'other']),
});

type CreateDependentFormData = z.infer<typeof createDependentSchema>;

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
    resolver: zodResolver(createDependentSchema),
    defaultValues: {
      relationship: 'son',
    },
  });

  const handleFormSubmit = async (data: CreateDependentFormData) => {
    setError(null);

    try {
      await onSubmit(data);
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome Completo *
            </label>
            <input
              {...register('name')}
              id="name"
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Ex: João Silva"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          {/* Data de Nascimento */}
          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
              Data de Nascimento *
            </label>
            <input
              {...register('birthDate')}
              id="birthDate"
              type="date"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
            {errors.birthDate && <p className="mt-1 text-sm text-red-600">{errors.birthDate.message}</p>}
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
              <option value="son">Filho</option>
              <option value="daughter">Filha</option>
              <option value="brother">Irmão</option>
              <option value="sister">Irmã</option>
              <option value="nephew">Sobrinho</option>
              <option value="niece">Sobrinha</option>
              <option value="other">Outro</option>
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
