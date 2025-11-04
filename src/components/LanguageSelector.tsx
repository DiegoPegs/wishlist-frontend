'use client';

import { Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCurrentLocale } from '@/hooks/useCurrentLocale';
import { useUpdateLanguage } from '@/hooks/useUpdateLanguage';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt-BR', name: 'Português', flag: '🇧🇷' }
];

export default function LanguageSelector() {
  const router = useRouter();
  const currentLocale = useCurrentLocale();
  const updateLanguage = useUpdateLanguage();
  const { isAuthenticated } = useAuthStore();

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;

    try {
      // 1. Salvar preferência no localStorage
      localStorage.setItem('preferred-language', newLocale);

      // 2. Salvar no cookie para o middleware
      document.cookie = `user-language=${newLocale}; path=/; max-age=31536000`; // 1 ano

      // 3. Se o usuário estiver autenticado, atualizar no backend
      if (isAuthenticated) {
        await updateLanguage.mutateAsync({ language: newLocale });
      }

      // 4. Obter o path atual sem o idioma
      const currentPath = window.location.pathname;
      const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, '') || '/';
      const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;

      // 5. Navegar usando router do Next.js
      router.push(newPath);
    } catch (error) {
      console.error('Erro ao atualizar idioma:', error);
      toast.error('Erro ao atualizar idioma');
    }
  };

  return (
    <div className="relative">
      <select
        value={currentLocale}
        onChange={handleLanguageChange}
        className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-label="Selecionar idioma"
        disabled={updateLanguage.isPending}
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.flag} {language.name}
          </option>
        ))}
      </select>
      <Globe className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );
}
