import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'pt-BR'],

  // Used when no locale matches
  defaultLocale: 'pt-BR'
});

export const config = {
  // Match all pathnames except for
  // - API routes
  // - _next (Next.js internals)
  // - _static (inside /public)
  // - all root files inside /public (e.g. favicon.ico)
  matcher: ['/((?!api|_next|_static|.*\\..*).*)']
};