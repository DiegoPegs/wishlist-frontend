'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto
            retry: (failureCount, error: unknown) => {
              // Não tentar novamente para erros 4xx
              if (error && typeof error === 'object' && 'response' in error &&
                  error.response && typeof error.response === 'object' && 'status' in error.response &&
                  typeof error.response.status === 'number' &&
                  error.response.status >= 400 && error.response.status < 500) {
                return false;
              }
              return failureCount < 3;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
