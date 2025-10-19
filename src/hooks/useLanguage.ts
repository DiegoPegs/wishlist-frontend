import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

type Locale = 'en' | 'pt-BR';

export const useLanguage = () => {
  const locale = useLocale() as Locale;
  const router = useRouter();

  const changeLanguage = useCallback((newLocale: Locale) => {
    // Atualizar a URL com o novo idioma
    const currentPath = window.location.pathname;

    // Remover o idioma atual da URL se existir
    const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, '') || '/';

    // Construir a nova URL
    const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;

    // Salvar a preferência do usuário no localStorage
    localStorage.setItem('preferred-language', newLocale);

    // Navegar para a nova URL
    router.push(newPath);
  }, [router]);

  const getPreferredLanguage = useCallback((): Locale => {
    // 1. Verificar se há idioma salvo no localStorage
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && ['en', 'pt-BR'].includes(savedLanguage)) {
      return savedLanguage as Locale;
    }

    // 2. Verificar idioma do navegador
    const browserLanguage = navigator.language;
    if (browserLanguage.startsWith('pt')) {
      return 'pt-BR';
    }
    if (browserLanguage.startsWith('en')) {
      return 'en';
    }

    // 3. Idioma padrão
    return 'en';
  }, []);

  return {
    locale,
    changeLanguage,
    getPreferredLanguage
  };
};
