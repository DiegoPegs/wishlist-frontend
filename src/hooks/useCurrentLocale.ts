'use client';

import { usePathname } from 'next/navigation';

const SUPPORTED_LOCALES = ['en', 'pt-BR'] as const;
type Locale = typeof SUPPORTED_LOCALES[number];

export function useCurrentLocale(): Locale {
  const pathname = usePathname();

  // Detectar idioma diretamente da URL (sem estado)
  const pathSegments = pathname.split('/');
  const urlLocale = pathSegments[1];

  if (SUPPORTED_LOCALES.includes(urlLocale as Locale)) {
    return urlLocale as Locale;
  }

  // Fallback para pt-BR (sem localStorage para evitar SSR issues)
  return 'pt-BR';
}
