// src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google'; // 1. Importar as fontes
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { Providers } from '@/components/Providers';
import { AuthProvider } from '@/components/AuthProvider';
import { ErrorSuppressor } from '@/components/ErrorSuppressor';
import { ClientOnly } from '@/components/ClientOnly';

// 2. Configurar as fontes com as variáveis CSS e fallbacks robustos
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
  preload: true,
  adjustFontFallback: true,
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: 'Kero Wishlist',
  description: 'Sua lista de desejos social',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 3. Aplicar as variáveis na tag <html>
    <html className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClientOnly>
          <ErrorSuppressor />
        </ClientOnly>
        <Providers>
          <AuthProvider>
            <ClientOnly>
              <Toaster position="top-right" />
            </ClientOnly>
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}