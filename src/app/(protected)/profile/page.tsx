'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { ChangePasswordForm } from '@/components/user/ChangePasswordForm';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Meu Perfil</h1>
        <p className="text-gray-600 mt-1">Gerencie suas informações pessoais e configurações de conta.</p>
      </div>

      {/* Informações do Usuário */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-dark mb-4">Informações Pessoais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <p className="text-sm text-dark">{user?.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-sm text-dark">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status do Email</label>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              user?.emailVerified
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {user?.emailVerified ? 'Verificado' : 'Não verificado'}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Membro desde</label>
            <p className="text-sm text-dark">{user?.createdAt ? formatDate(user.createdAt) : 'N/A'}</p>
          </div>
        </div>
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
    </div>
  );
}
