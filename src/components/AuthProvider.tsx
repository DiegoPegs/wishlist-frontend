'use client';

import { useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { testBackendConnection } from '@/lib/testConnection';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { checkAuthStatus } = useAuthStore();

  useEffect(() => {
    // Testar conexão com o backend primeiro
    const initializeApp = async () => {
      console.log('🚀 Inicializando aplicação...');

      const isConnected = await testBackendConnection();

      if (isConnected) {
        console.log('✅ Backend conectado, verificando status de autenticação...');
        await checkAuthStatus();
      } else {
        console.warn('⚠️ Backend não conectado, pulando verificação de autenticação');
      }
    };

    initializeApp();
  }, [checkAuthStatus]);

  return <>{children}</>;
}
