'use client';

import { useEffect } from 'react';

export function ErrorSuppressor() {
  useEffect(() => {
    // Suprimir erros de runtime.lastError (extensões do navegador)
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Filtrar erros de runtime.lastError
      if (args[0] && typeof args[0] === 'string' &&
          args[0].includes('runtime.lastError')) {
        return;
      }
      originalConsoleError.apply(console, args);
    };

    // Cleanup function para restaurar o console.error original
    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  return null;
}
