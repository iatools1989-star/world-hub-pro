import { NextRequest, NextResponse } from 'next/server';
import { DIRECTORY_ITEMS } from '@/lib/data';

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
  'otter.ai',
  'adobe.com',
  'smallpdf.com',
  'remove.bg',
  'www.remove.bg',
  'www.removebg.com',
]);

function safeRedirect(rawUrl: string, request: NextRequest): string | null {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:') return null;
  if (!ALLOWED_HOSTS.has(url.hostname)) return null;
  return url.toString();
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const lowerSlug = slug.toLowerCase();

  const dirMatch = DIRECTORY_ITEMS.find((d) => d.slug === lowerSlug);
  const raw = dirMatch?.affiliateUrl || FALLBACK_AFFILIATES[lowerSlug];

  if (raw) {
    const safe = safeRedirect(raw, request);
    if (safe) {
      return NextResponse.redirect(safe, 307);
    }
    // Destino invalido: nao redireciona para lugar nenhum inesperado.
    return NextResponse.redirect(new URL('/en/directory', request.url), 307);
  }

  return NextResponse.redirect(new URL('/en', request.url));
}
