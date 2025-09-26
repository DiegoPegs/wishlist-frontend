'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/Button';

export function Header() {
  const router = useRouter();
  // Pega o usuário, authStatus e a função de logout do store
  const user = useAuthStore((state) => state.user);
  const authStatus = useAuthStore((state) => state.authStatus);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-light px-6">
      <div className="flex items-center">
        <Link href="/dashboard" className="text-xl font-bold text-dark">
          Kero Wishlist
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {/* Renderiza o nome do usuário apenas se autenticado, senão um placeholder */}
        <span className="text-sm text-dark-light">
          Olá, {authStatus === 'AUTHENTICATED' ? (user?.name || user?.email?.split('@')[0] || 'Usuário') : '...'}
        </span>
        <Button onClick={handleLogout} variant="primary">
          Sair
        </Button>
      </div>
    </header>
  );
}