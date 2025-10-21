import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';

/**
 * Hook para verificar se a autenticação está pronta (hidratada)
 * Útil para evitar problemas de hidratação com Zustand
 */
export function useAuthReady() {
  const [isReady, setIsReady] = useState(false);
  const { authStatus } = useAuthStore();

  useEffect(() => {
    // Aguardar um tick para garantir que o Zustand foi hidratado
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return {
    isReady,
    authStatus: isReady ? authStatus : 'PENDING',
    isAuthenticated: isReady && authStatus === 'AUTHENTICATED',
  };
}

