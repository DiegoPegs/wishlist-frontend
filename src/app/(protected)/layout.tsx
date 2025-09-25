'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authStatus, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Se ainda está verificando o status de autenticação, mostrar loading
  if (authStatus === 'PENDING') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-dark">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, redirecionar para login
  if (authStatus === 'UNAUTHENTICATED') {
    router.push('/login');
    return null;
  }

  // Se está autenticado, renderizar o layout normal
  if (authStatus === 'AUTHENTICATED') {
    return (
      <div className="min-h-screen bg-light">
        {/* Header */}
        <Header onLogout={handleLogout} />

        <div className="flex">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    );
  }

  // Fallback (não deveria acontecer)
  return null;
}
