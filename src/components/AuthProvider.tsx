'use client';

import { useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useIsClient } from '@/hooks/useIsClient';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { checkAuthStatus } = useAuthStore();
  const isClient = useIsClient();

  useEffect(() => {
    // Verificar status de autenticação apenas no cliente
    if (isClient) {
      checkAuthStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]); // Removido checkAuthStatus da dependência para evitar re-renderizações

  return <>{children}</>;
}