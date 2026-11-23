import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Etapa 1: site em ingles apenas.
// Nao ha deteccao de Accept-Language nem troca de idioma:
// todas as paginas sao escritas em ingles, entao redirecionar
// um visitante brasileiro para /pt nao mudava nada (era a mesma pagina).
//
// URLs antigas em outros idiomas sao redirecionadas 301 para /en,
// preservando qualquer link ou indexacao que ja exista.
export const DEFAULT_LOCALE = 'en';
export const RETIRED_LOCALES = ['es', 'pt', 'de', 'fr', 'ja'] as const;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/go')) {
    return NextResponse.next();
  }

  // Painel de administracao.
  // /en/admin passa por aqui normalmente (esta sob /en).
  // O editor solto em /painel nao deve ser uma porta de entrada: quem chega
  // nele sem sessao veria a interface sem autenticacao. Redireciona para o
  // login. Os arquivos do editor (index.html, app.js, bases.js) continuam
  // servidos porque o iframe de /en/admin os carrega depois do login.
  if (pathname === '/painel' || pathname === '/painel/') {
    req.nextUrl.pathname = `/${DEFAULT_LOCALE}/admin`;
    return NextResponse.redirect(req.nextUrl, 307);
  }
  if (pathname.includes('.') || ['/robots.txt', '/sitemap.xml', '/ads.txt'].includes(pathname)) {
    return NextResponse.next();
  }

  // /es/algo -> /en/algo  (301)
  for (const loc of RETIRED_LOCALES) {
    if (pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)) {
      const resto = pathname.slice(loc.length + 1);
      req.nextUrl.pathname = `/${DEFAULT_LOCALE}${resto}`;
      return NextResponse.redirect(req.nextUrl, 301);
    }
  }

  // Ja esta em /en... : segue
  if (pathname === `/${DEFAULT_LOCALE}` || pathname.startsWith(`/${DEFAULT_LOCALE}/`)) {
    return NextResponse.next();
  }

  // Qualquer outra coisa -> /en...
  req.nextUrl.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(req.nextUrl, pathname === '/' ? 307 : 301);
}

export const config = { matcher: ['/((?!_next|.*\\..*).*)'] };
