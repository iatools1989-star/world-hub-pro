import { NextRequest, NextResponse } from 'next/server';
import { DIRECTORY_ITEMS } from '@/lib/data';

const FALLBACK_AFFILIATES: Record<string, string> = {
  adobe: 'https://www.adobe.com/acrobat/online.html',
  smallpdf: 'https://smallpdf.com',
  removebg: 'https://www.remove.bg',
  elevenlabs: 'https://elevenlabs.io',
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const lowerSlug = slug.toLowerCase();

  // Verifica se existe no diretório
  const dirMatch = DIRECTORY_ITEMS.find((d) => d.slug === lowerSlug);
  if (dirMatch) {
    return NextResponse.redirect(dirMatch.affiliateUrl, 307);
  }

  // Verifica fallbacks
  if (FALLBACK_AFFILIATES[lowerSlug]) {
    return NextResponse.redirect(FALLBACK_AFFILIATES[lowerSlug], 307);
  }

  return NextResponse.redirect(new URL('/en', request.url));
}
