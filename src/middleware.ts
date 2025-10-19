import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Se a rota já tem idioma, permitir
  if (pathname.startsWith('/en/') || pathname.startsWith('/pt-BR/')) {
    return NextResponse.next();
  }

  // Se for a rota raiz, redirecionar para pt-BR
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/pt-BR', request.url));
  }

  // Para outras rotas sem idioma, redirecionar para pt-BR + rota
  const defaultLocale = 'pt-BR';

  // Verificar se a rota não é um arquivo estático
  if (!pathname.includes('.')) {
    return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};