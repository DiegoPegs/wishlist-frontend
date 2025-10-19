'use client';

import { useCurrentLocale } from './useCurrentLocale';

export function useLocalizedPath() {
  const locale = useCurrentLocale();

  const getLocalizedPath = (path: string): string => {
    // Garantir que o path comece com '/'
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    // Se o path já tem um idioma válido (en ou pt-BR), substituir pelo atual
    const pathWithoutLocale = normalizedPath.replace(/^\/(en|pt-BR)/, '') || '/';

    // Se o path é apenas '/', retornar apenas o locale
    if (pathWithoutLocale === '/') {
      return `/${locale}`;
    }

    return `/${locale}${pathWithoutLocale}`;
  };

  return { getLocalizedPath, locale };
}
