'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { ChangePasswordForm } from '@/components/user/ChangePasswordForm';
import { useUpdateUser, UpdateUserData } from '@/hooks/useUpdateUser';
import { UpdateProfileDto } from '@/types/auth-dto';
import { formatBirthDate } from '@/lib/dateUtils';
import { useResendVerificationEmail } from '@/hooks/useResendVerificationEmail';
import { ConfirmRegistrationModal } from '@/components/user/ConfirmRegistrationModal';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const queryClient = useQueryClient();
  const updateUserMutation = useUpdateUser();
  const resendEmailMutation = useResendVerificationEmail();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateUserData>({
    defaultValues: {
      name: user?.name || '',
      birthDate: {
        day: user?.birthDate?.day || undefined,
        month: user?.birthDate?.month || undefined,
        year: user?.birthDate?.year || undefined,
      },
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePasswordSuccess = () => {
    setShowChangePassword(false);
    setError(null);
  };

  const handlePasswordError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    reset({
      name: user?.name || '',
      birthDate: {
        day: user?.birthDate?.day || undefined,
        month: user?.birthDate?.month || undefined,
        year: user?.birthDate?.year || undefined,
      },
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    reset({
      name: user?.name || '',
      birthDate: {
        day: user?.birthDate?.day || undefined,
        month: user?.birthDate?.month || undefined,
        year: user?.birthDate?.year || undefined,
      },
    });
  };

  const onSubmit = async (data: UpdateUserData) => {
    try {
      // Criar payload com apenas as propriedades permitidas pelo UpdateProfileDto
      const payload: UpdateProfileDto = {
        name: data.name,
        giftingProfile: {
          interests: [],
          budget: {
            min: 0,
            max: 1000,
          },
          preferences: [],
        },
      };

      await updateUserMutation.mutateAsync(payload);
      setIsEditing(false);
      setError(null);
    } catch (error: unknown) {
      console.error('Erro ao atualizar perfil:', error);

      // Mostrar erro mais específico
      const errorObj = error as { response?: { data?: { message?: string }; status?: number } };
      if (errorObj.response?.data?.message) {
        setError(errorObj.response.data.message);
      } else if (errorObj.response?.status === 400) {
        setError('Dados inválidos. Verifique se o email está correto e tente novamente.');
      } else if (errorObj.response?.status === 409) {
        setError('Este email já está em uso por outro usuário.');
      } else {
        setError('Erro ao atualizar perfil. Tente novamente.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Meu Perfil</h1>
        <p className="text-gray-600 mt-1">Gerencie suas informações pessoais e configurações de conta.</p>
      </div>

      {/* Informações do Usuário */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-dark">Informações Pessoais</h2>
          {!isEditing && (
            <button
              onClick={handleEditProfile}
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              Editar Perfil
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  {...register('name', { required: 'Nome é obrigatório' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Dia</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      {...register('birthDate.day', {
                        required: 'Dia é obrigatório',
                        min: { value: 1, message: 'Dia deve ser entre 1 e 31' },
                        max: { value: 31, message: 'Dia deve ser entre 1 e 31' }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="DD"
                    />
                    {errors.birthDate?.day && (
                      <p className="mt-1 text-xs text-red-600">{errors.birthDate.day.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Mês</label>
                    <select
                      {...register('birthDate.month', {
                        required: 'Mês é obrigatório',
                        min: { value: 1, message: 'Mês deve ser entre 1 e 12' },
                        max: { value: 12, message: 'Mês deve ser entre 1 e 12' }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    >
                      <option value="">MM</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {String(i + 1).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    {errors.birthDate?.month && (
                      <p className="mt-1 text-xs text-red-600">{errors.birthDate.month.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Ano (opcional)</label>
                    <input
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      {...register('birthDate.year', {
                        min: { value: 1900, message: 'Ano deve ser maior que 1900' },
                        max: { value: new Date().getFullYear(), message: 'Ano não pode ser futuro' }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="AAAA"
                    />
                    {errors.birthDate?.year && (
                      <p className="mt-1 text-xs text-red-600">{errors.birthDate.year.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={updateUserMutation.isPending}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {updateUserMutation.isPending ? 'Salvando...' : 'Salvar'}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 text-sm font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <p className="text-sm text-dark">{user?.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
              <p className="text-sm text-dark">
                {formatBirthDate(user?.birthDate)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status do Email</label>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  user?.emailVerified
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                }`}>
                  {user?.emailVerified ? (
                    <>
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verificado
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Não verificado
                    </>
                  )}
                </span>
                {!user?.emailVerified && (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => resendEmailMutation.mutate()}
                      disabled={resendEmailMutation.isPending}
                      className="text-xs text-blue-600 hover:text-blue-800 underline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {resendEmailMutation.isPending ? 'Enviando...' : 'Reenviar código'}
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => setShowConfirmModal(true)}
                      className="text-xs text-purple-600 hover:text-purple-800 underline"
                    >
                      Inserir código
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => queryClient.invalidateQueries({ queryKey: ['user', 'profile'] })}
                      className="text-xs text-green-600 hover:text-green-800 underline"
                    >
                      Atualizar status
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Membro desde</label>
              <p className="text-sm text-dark">{user?.createdAt ? formatDate(user.createdAt) : 'N/A'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Alteração de Senha */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-dark">Alterar Senha</h2>
          {!showChangePassword && (
            <button
              onClick={() => setShowChangePassword(true)}
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              Alterar senha
            </button>
          )}
        </div>

        {showChangePassword ? (
          <div className="space-y-4">
            <ChangePasswordForm
              onSuccess={handlePasswordSuccess}
              onError={handlePasswordError}
            />
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            Mantenha sua conta segura usando uma senha forte e única.
          </p>
        )}
      </div>

      {/* Configurações de Conta */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-dark mb-4">Configurações de Conta</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-dark">Notificações por Email</h3>
              <p className="text-sm text-gray-600">Receba notificações sobre suas listas e reservas</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              <span className="sr-only">Ativar notificações</span>
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-dark">Perfil Público</h3>
              <p className="text-sm text-gray-600">Tornar suas listas visíveis para outros usuários</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              <span className="sr-only">Ativar perfil público</span>
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Registro */}
      {user?.username && (
        <ConfirmRegistrationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          username={user.username}
        />
      )}
    </div>
  );
}
