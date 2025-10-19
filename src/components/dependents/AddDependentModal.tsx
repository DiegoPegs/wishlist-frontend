'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createDependentSchema } from '@/lib/schemas/dependent.schema';
import { z } from 'zod';

// Schema para o formulário (aceita strings vazias)
const addDependentFormSchema = z.object({
  fullName: z.string().min(3, 'O nome completo é obrigatório.'),
  birthDay: z.string(),
  birthMonth: z.string(),
  birthYear: z.string(),
  relationship: z.string().min(1, 'Selecione um parentesco válido.'),
});

type AddDependentFormData = z.infer<typeof addDependentFormSchema>;
import { useCreateDependent } from '@/hooks/use-dependents';
import { CreateDependentData as CreateDependentDataAPI } from '@/types/dependent';
import toast from 'react-hot-toast';
import { useTranslations } from '@/hooks/useTranslations';

// Opções para os campos de data
const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1);
const monthKeys = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

interface AddDependentModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

// Remover relationshipLabels hardcoded - usar traduções

export function AddDependentModal({ onClose, onSuccess }: AddDependentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createDependentMutation = useCreateDependent();
  const t = useTranslations('dependents');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddDependentFormData>({
    resolver: zodResolver(addDependentFormSchema),
  });

  const onSubmit = async (data: AddDependentFormData) => {
    setIsSubmitting(true);
    try {
      // Validar os dados com o schema de validação
      const validatedData = createDependentSchema.parse(data);

      // 1. Prepare the payload object with the correct structure
      const payload: CreateDependentDataAPI = {
        fullName: validatedData.fullName,
        relationship: validatedData.relationship as 'son' | 'daughter' | 'brother' | 'sister' | 'nephew' | 'niece' | 'other',
      };

      // 2. If date fields are filled, create the nested birthDate object
      if (validatedData.birthDay && validatedData.birthMonth) {
        payload.birthDate = {
          day: validatedData.birthDay,
          month: validatedData.birthMonth,
          year: validatedData.birthYear, // This will be undefined if empty, which is correct
        };
      }

      // 3. Send the correctly structured payload to the API
      await createDependentMutation.mutateAsync(payload);
      toast.success(t('dependentAddedSuccess'));
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erro ao criar dependente:', error);
      toast.error(t('dependentAddError'));
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
              {t('addDependent')}
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
              <label htmlFor="fullName" className="block text-sm font-medium text-dark mb-1">
                {t('fullName')}
              </label>
              <input
                {...register('fullName')}
                id="fullName"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder={t('dependentNamePlaceholder')}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                {t('birthDateOptional')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {/* Dia */}
                <div>
                  <label htmlFor="birthDay" className="block text-xs font-medium text-gray-600 mb-1">
                    {t('day')}
                  </label>
                  <select
                    {...register('birthDay')}
                    id="birthDay"
                    className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                  >
                    <option value="">{t('select')}</option>
                    {dayOptions.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  {errors.birthDay && (
                    <p className="mt-1 text-xs text-red-600">{errors.birthDay.message}</p>
                  )}
                </div>

                {/* Mês */}
                <div>
                  <label htmlFor="birthMonth" className="block text-xs font-medium text-gray-600 mb-1">
                    {t('month')}
                  </label>
                  <select
                    {...register('birthMonth')}
                    id="birthMonth"
                    className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                  >
                    <option value="">{t('select')}</option>
                    {monthKeys.map((monthKey, index) => (
                      <option key={index + 1} value={index + 1}>
                        {t(monthKey)}
                      </option>
                    ))}
                  </select>
                  {errors.birthMonth && (
                    <p className="mt-1 text-xs text-red-600">{errors.birthMonth.message}</p>
                  )}
                </div>

                {/* Ano */}
                <div>
                  <label htmlFor="birthYear" className="block text-xs font-medium text-gray-600 mb-1">
                    {t('yearOptional')}
                  </label>
                  <input
                    {...register('birthYear')}
                    id="birthYear"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                    placeholder={t('yearPlaceholder')}
                  />
                  {errors.birthYear && (
                    <p className="mt-1 text-xs text-red-600">{errors.birthYear.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="relationship" className="block text-sm font-medium text-dark mb-1">
                {t('relationshipRequired')}
              </label>
              <select
                {...register('relationship')}
                id="relationship"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">{t('selectRelationship')}</option>
                {['son', 'daughter', 'brother', 'sister', 'nephew', 'niece', 'other'].map((value) => (
                  <option key={value} value={value}>
                    {t(value)}
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
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t('adding') : t('add')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
