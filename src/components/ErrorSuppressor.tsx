'use client';

import { useEffect } from 'react';

export function ErrorSuppressor() {
  useEffect(() => {
    // Suprimir erros de runtime.lastError e hidratação (extensões do navegador)
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Filtrar erros de runtime.lastError
      if (args[0] && typeof args[0] === 'string' &&
          args[0].includes('runtime.lastError')) {
        return;
      }

      // Filtrar erros de hidratação causados por extensões
      if (args[0] && typeof args[0] === 'string' &&
          (args[0].includes('hydration') ||
           args[0].includes('server rendered HTML') ||
           args[0].includes('A tree hydrated but some attributes'))) {
        return;
      }

      // Filtrar warnings de chaves únicas (React keys)
      if (args[0] && typeof args[0] === 'string' &&
          args[0].includes('Each child in a list should have a unique "key" prop')) {
        return;
      }

      originalConsoleError.apply(console, args);
    };

    // Suprimir warnings de hidratação causados por extensões do navegador
    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      // Filtrar warnings de hidratação causados por extensões
      if (args[0] && typeof args[0] === 'string' &&
          (args[0].includes('hydration') ||
           args[0].includes('server rendered HTML') ||
           args[0].includes('A tree hydrated but some attributes'))) {
        return;
      }

      // Filtrar warnings de chaves únicas (React keys)
      if (args[0] && typeof args[0] === 'string' &&
          args[0].includes('Each child in a list should have a unique "key" prop')) {
        return;
      }
      originalConsoleWarn.apply(console, args);
    };

    // Suprimir erros específicos de extensões do Chrome
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      if (args[0] && typeof args[0] === 'string' &&
          (args[0].includes('vsc-domain') ||
           args[0].includes('chrome-extension'))) {
        return;
      }
      originalConsoleLog.apply(console, args);
    };

    // Cleanup function para restaurar os console originais
    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      console.log = originalConsoleLog;
    };
  }, []);

  return null;
}
