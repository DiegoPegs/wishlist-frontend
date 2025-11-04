'use client';

import { useState } from 'react';
import { useConfirmRegistration } from '@/hooks/useConfirmRegistration';
import { useResendVerificationEmail } from '@/hooks/useResendVerificationEmail';

interface ConfirmRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

export function ConfirmRegistrationModal({ isOpen, onClose, username }: ConfirmRegistrationModalProps) {
  const [code, setCode] = useState('');
  const confirmMutation = useConfirmRegistration();
  const resendEmailMutation = useResendVerificationEmail();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCode = code.trim();

    if (!trimmedCode) {
      return;
    }

    try {
      await confirmMutation.mutateAsync({ username, code: trimmedCode });
      setCode('');
      onClose();
    } catch {
      // Erro já tratado pelo hook
    }
  };

  const handleResendCode = async () => {
    setCode('');
    await resendEmailMutation.mutateAsync();
  };

  const handleClose = () => {
    setCode('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-dark">Verificar E-mail</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={confirmMutation.isPending}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-1">
          Digite o código de verificação que você recebeu no seu e-mail.
        </p>
        <p className="text-xs text-gray-500 mb-4">
          Usuário: <span className="font-medium text-gray-700">{username}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700 mb-2">
              Código de Verificação
            </label>
            <input
              id="verification-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Digite o código"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg tracking-wider text-center"
              disabled={confirmMutation.isPending}
              autoFocus
              maxLength={10}
            />
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendEmailMutation.isPending}
              className="text-sm text-gray-600 hover:text-primary underline disabled:opacity-50"
            >
              {resendEmailMutation.isPending ? 'Reenviando...' : 'Não recebeu o código? Reenviar'}
            </button>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={confirmMutation.isPending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={confirmMutation.isPending || !code.trim()}
            >
              {confirmMutation.isPending ? 'Verificando...' : 'Verificar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

