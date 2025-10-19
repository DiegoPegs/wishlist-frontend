'use client';

import { Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCurrentLocale } from '@/hooks/useCurrentLocale';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt-BR', name: 'Português', flag: '🇧🇷' }
];

export default function LanguageSelector() {
  const router = useRouter();
  const currentLocale = useCurrentLocale();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;

    // Salvar preferência no localStorage
    localStorage.setItem('preferred-language', newLocale);

    // Obter o path atual sem o idioma
    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, '') || '/';
    const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;

    // Navegar usando router do Next.js
    router.push(newPath);
  };

  return (
    <div className="relative">
      <select
        value={currentLocale}
        onChange={handleLanguageChange}
        className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-label="Selecionar idioma"
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
