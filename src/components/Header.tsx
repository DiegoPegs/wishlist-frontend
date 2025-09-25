'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';

interface HeaderProps {
  onLogout: () => void;
}

export function Header({ onLogout }: HeaderProps) {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="bg-light border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold text-dark">
              Kero Wishlist
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-dark">
              Olá, {user?.name || 'Usuário'}
            </span>
            <button
              onClick={onLogout}
              className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
