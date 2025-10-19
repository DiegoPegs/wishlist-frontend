import { useMemo } from 'react';
import { useCurrentLocale } from './useCurrentLocale';

// Importar as traduções
import ptBR from '@/messages/pt-BR.json';
import en from '@/messages/en.json';

const translations = {
  'pt-BR': ptBR,
  'en': en,
};

export function useTranslations(namespace: string) {
  const currentLocale = useCurrentLocale();

  const t = useMemo(() => {
    const messages = translations[currentLocale as keyof typeof translations] || translations['pt-BR'];
    const namespaceMessages = messages[namespace as keyof typeof messages] || {};

    return (key: string) => {
      return namespaceMessages[key as keyof typeof namespaceMessages] || key;
    };
  }, [namespace, currentLocale]);

  return t;
}
