import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LOCALES = ['en', 'es', 'pt', 'fr', 'de', 'it', 'ja', 'ko', 'zh', 'ar', 'hi', 'ru'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignora arquivos internos, estáticos e rotas de api/go/robots/sitemap/ads.txt
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/go') ||
    pathname.includes('.') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/ads.txt'
  ) {
    return NextResponse.next();
  }

  // Verifica se o pathname já começa com algum dos locales
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redireciona para /en se não tiver locale
  request.nextUrl.pathname = `/en${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
