'use client';

import { useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/store/auth.store';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { checkAuthStatus } = useAuthStore();

  useEffect(() => {
    // Verificar status de autenticação uma única vez quando a aplicação carregar
    checkAuthStatus();
  }, [checkAuthStatus]);

  return <>{children}</>;
}