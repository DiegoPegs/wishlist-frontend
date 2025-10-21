'use client';

import { Bell } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { useTranslations } from '@/hooks/useTranslations';

export default function Header() {
  const t = useTranslations('header');

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              {t('appName')}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => console.log(t('notificationsClicked'))}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title={t('notifications')}
            >
              <Bell className="w-5 h-5" />
            </button>
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  );
}