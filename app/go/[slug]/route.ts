import { NextRequest, NextResponse } from 'next/server';
import { DIRECTORY_ITEMS } from '@/lib/data';
import { destinoDoPrograma, listarProgramas } from '@/lib/afiliados';

const FALLBACK_AFFILIATES: Record<string, string> = {
  adobe: 'https://www.adobe.com/acrobat/online.html',
  smallpdf: 'https://smallpdf.com',
  removebg: 'https://www.removebg.com',
  elevenlabs: 'https://elevenlabs.io',
};

/**
 * Redirect de afiliado.
 *
 * Seguranca: nunca redireciona para destino fora do diretorio/fallback.
 * Antes, qualquer slug inexistente caia no /en — mas um `affiliateUrl` mal
 * preenchido no data.ts (ex.: link encurtado, "javascript:", ou dominio errado)
 * viraria redirect cego. Agora o destino precisa ser https e de dominio permitido.
 */
const ALLOWED_HOSTS = new Set([
  'jasper.ai',
  'runwayml.com',
  'midjourney.com',
  'elevenlabs.io',
  'notion.so',
  'github.com',
  'copy.ai',
  'pika.art',
  'canva.com',
  'www.canva.com',
  'gamma.app',
  'capcut.com',
  'www.capcut.com',
  'otter.ai',
  'adobe.com',
  'www.adobe.com',
  'smallpdf.com',
  'remove.bg',
  'www.remove.bg',
  'www.removebg.com',
]);

/**
 * Hosts dos programas cadastrados em content/afiliados.json.
 * Somado a lista fixa abaixo, que fica como rede de seguranca: um programa novo
 * no JSON nao pode abrir um redirect para lugar nenhum sem que o dominio tenha
 * sido declarado la.
 */
const HOSTS_DOS_PROGRAMAS = new Set(
  listarProgramas().flatMap(({ programa }) => programa.dominios.map((d) => d.toLowerCase()))
);

function safeRedirect(rawUrl: string, request: NextRequest): string | null {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:') return null;
  if (!ALLOWED_HOSTS.has(url.hostname) && !HOSTS_DOS_PROGRAMAS.has(url.hostname)) return null;
  return url.toString();
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const lowerSlug = slug.toLowerCase();

  // Ordem de preferencia:
  //  1. link de afiliado cadastrado e aprovado no registro (gera comissao);
  //  2. URL oficial do diretorio (sem comissao);
  //  3. fallback fixo para ferramentas que nao estao no diretorio.
  // Assim /go/adobe continua funcionando hoje (link direto) e passa a
  // comissionar no dia em que o ID for cadastrado no painel, sem mudar codigo.
  const doPrograma = destinoDoPrograma(lowerSlug);
  const dirMatch = DIRECTORY_ITEMS.find((d) => d.slug === lowerSlug);
  const raw = doPrograma || dirMatch?.affiliateUrl || FALLBACK_AFFILIATES[lowerSlug];

  if (raw) {
    const safe = safeRedirect(raw, request);
    if (safe) {
      return NextResponse.redirect(safe, 307);
    }
    // Destino invalido: nao redireciona para lugar nenhum inesperado.
    // Caminho relativo: o Next resolve contra a origem publica da requisicao.
    // Antes usava request.url, que atras de proxy/Worker pode ser localhost:3000
    // e mandava o visitante para um endereco invalido.
    return NextResponse.redirect(new URL('/en/directory', request.nextUrl.origin), 307);
  }

  return NextResponse.redirect(new URL('/en', request.nextUrl.origin), 307);
}
