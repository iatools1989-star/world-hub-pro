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
  // Arquivos estaticos que existem de verdade.
  //
  // Antes a regra era `pathname.includes('.')`, ou seja: qualquer coisa com
  // ponto no nome passava sem passar pelo roteador. Consequencia: /index.html,
  // /app.js e /bases.js (nomes da epoca do painel antigo) e qualquer
  // /coisa.inventada devolviam a home com status 200 — a mesma pagina em
  // infinitas URLs. Para um buscador isso e conteudo duplicado sem limite.
  const ESTATICOS = ['/robots.txt', '/sitemap.xml', '/ads.txt', '/favicon.ico', '/ads.txt'];
  const ARQUIVOS_PUBLICOS = /^\/(pdf\.worker\.min\.js|file\.svg|globe\.svg|next\.svg|vercel\.svg|window\.svg|videos\/[\w-]+\.(mp4|jpg)|demo\/[\w-]+\.(jpg|png))$/;
  if (ESTATICOS.includes(pathname) || ARQUIVOS_PUBLICOS.test(pathname)) {
    return NextResponse.next();
  }
  if (pathname.startsWith('/painel/')) {
    // Arquivos do editor, carregados pelo iframe de /en/admin depois do login.
    return NextResponse.next();
  }

  // Caminho com extensao de arquivo que nao existe de verdade: 404 seco.
  //
  // Sem isto, /index.html virava 301 para /en/index.html, que por sua vez
  // carregava a home. O correto e dizer "nao existe" de uma vez: redirect em
  // URL inexistente gasta rastreamento do Googlebot e ainda cria o par
  // duplicado. O Next serve o proprio 404 do site.
  if (/\.[a-z0-9]{2,}$/i.test(pathname)) {
    return new NextResponse('Not Found', { status: 404, headers: { 'content-type': 'text/plain' } });
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

/**
 * O matcher antigo era `/((?!_next|.*\..*).*)` — ou seja, o middleware nem
 * era executado em caminhos com ponto no nome. Era por isso que /index.html,
 * /app.js e /bases.js nunca chegavam aqui para serem barrados: o Next
 * respondia com a home e status 200, criando paginas duplicadas em URLs
 * infinitas. Agora so /_next (arquivos do proprio framework) fica de fora;
 * todo o resto passa pela checagem acima.
 */
export const config = { matcher: ['/((?!_next/).*)'] };
