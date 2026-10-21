import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const LOCALES = ['en','es','pt','de','fr','ja'] as const;
export const DEFAULT_LOCALE = 'en';

function getLocaleFromHeader(req: NextRequest): string {
  const header = req.headers.get('accept-language') || '';
  for (const lang of header.split(',')) {
    const code = lang.split(';')[0].trim().split('-')[0].toLowerCase();
    if ((LOCALES as readonly string[]).includes(code)) return code;
  }
  return DEFAULT_LOCALE;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/go') || pathname.includes('.') || ['/robots.txt','/sitemap.xml','/ads.txt'].includes(pathname)) {
    return NextResponse.next();
  }
  const pathnameHasLocale = LOCALES.some(l => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (pathnameHasLocale) {
    const res = NextResponse.next();
    res.cookies.set('NEXT_LOCALE', pathname.split('/')[1], { maxAge: 31536000, path: '/' });
    return res;
  }
  const cookieLocale = req.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)) {
    req.nextUrl.pathname = `/${cookieLocale}${pathname}`;
    return NextResponse.redirect(req.nextUrl);
  }
  const detected = getLocaleFromHeader(req);
  req.nextUrl.pathname = `/${detected}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(req.nextUrl);
}

export const config = { matcher: ['/((?!_next|.*\\..*).*)'] };