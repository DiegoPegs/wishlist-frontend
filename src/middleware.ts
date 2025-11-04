import createMiddleware from 'next-intl/middleware';
import { type NextRequest } from 'next/server';

const locales = ['en', 'pt-BR'] as const;
const defaultLocale = 'pt-BR';

// Função customizada para detectar o locale
function getLocale(request: NextRequest): string {
  // 1. Prioridade: idioma do perfil do usuário (armazenado em cookie)
  const userLanguage = request.cookies.get('user-language')?.value;
  if (userLanguage && locales.includes(userLanguage as typeof locales[number])) {
    return userLanguage;
  }

  // 2. Verificar localStorage através de um cookie temporário
  const preferredLanguage = request.cookies.get('preferred-language')?.value;
  if (preferredLanguage && locales.includes(preferredLanguage as typeof locales[number])) {
    return preferredLanguage;
  }

  // 3. Idioma do navegador (accept-language header)
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const languages = acceptLanguage.split(',').map(lang => {
      const [locale] = lang.trim().split(';');
      return locale;
    });

    for (const language of languages) {
      if (language.startsWith('pt')) return 'pt-BR';
      if (language.startsWith('en')) return 'en';
    }
  }

  // 4. Fallback para idioma padrão
  return defaultLocale;
}

const intlMiddleware = createMiddleware({
  locales: locales as unknown as string[],
  defaultLocale,
  localeDetection: true,
  localePrefix: 'always'
});

export default function middleware(request: NextRequest) {
  // Obter o locale customizado
  const locale = getLocale(request);

  // Adicionar o locale como um header personalizado para ser usado pela aplicação
  const response = intlMiddleware(request);
  response.headers.set('x-user-locale', locale);

  return response;
}

export const config = {
  // Match all pathnames except for
  // - API routes
  // - _next (Next.js internals)
  // - _static (inside /public)
  // - all root files inside /public (e.g. favicon.ico)
  matcher: ['/((?!api|_next|_static|.*\\..*).*)']
};