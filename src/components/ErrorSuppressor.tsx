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

    // Suprimir erros de hidratação causados por extensões do navegador
    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      // Filtrar warnings de hidratação causados por extensões
      if (args[0] && typeof args[0] === 'string' &&
          (args[0].includes('hydration') || args[0].includes('server rendered HTML'))) {
        return;
      }
      originalConsoleWarn.apply(console, args);
    };

    // Cleanup function para restaurar os console originais
    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  return null;
}
