import { DIRECTORY_ITEMS, LOCALES } from '../lib/data';

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  STAGING?: string;
}

const locales = new Set(LOCALES.map(({ code }) => code));
const legacyPaths = new Set(['/about', '/contact', '/privacy', '/terms']);
const partners: Record<string, string> = {
  adobe: 'https://www.adobe.com/acrobat/online.html',
  smallpdf: 'https://smallpdf.com',
  removebg: 'https://www.remove.bg',
  'pdf-to-jpg': 'https://www.adobe.com/acrobat/online.html',
  'compress-pdf': 'https://smallpdf.com',
  'remove-bg': 'https://www.remove.bg',
  'resume-builder': 'https://www.rezi.ai',
  'text-to-speech': 'https://elevenlabs.io',
};
const destinations = new Map([
  ...Object.entries(partners),
  ...DIRECTORY_ITEMS.map(({ slug, affiliateUrl }) => [slug, affiliateUrl] as [string, string]),
]);

export function selectLocale(request: Request): string {
  const cookie = request.headers.get('cookie')?.match(/(?:^|;\s*)NEXT_LOCALE=([^;]*)/)?.[1];
  if (cookie && locales.has(cookie)) return cookie;

  const candidates = (request.headers.get('accept-language') || '')
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const quality = params.find((param) => param.trim().startsWith('q='));
      const q = quality ? Number(quality.trim().slice(2)) : 1;
      return { code: tag.toLowerCase().split('-')[0], q };
    })
    .filter(({ code, q }) => locales.has(code) && Number.isFinite(q) && q > 0 && q <= 1)
    .sort((a, b) => b.q - a.q);

  return candidates[0]?.code || 'en';
}

function responseHeaders(staging: boolean): Headers {
  const headers = new Headers({
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  });
  if (staging) headers.set('X-Robots-Tag', 'noindex, nofollow');
  return headers;
}

function redirect(location: string, staging: boolean, localeDependent = false): Response {
  const headers = responseHeaders(staging);
  headers.set('Location', location);
  if (localeDependent) headers.set('Vary', 'Accept-Language, Cookie');
  return new Response(null, { status: 307, headers });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const staging = env.STAGING === 'true';
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      const headers = responseHeaders(staging);
      headers.set('Allow', 'GET, HEAD');
      return new Response(null, { status: 405, headers });
    }

    if (url.pathname === '/healthz') {
      const headers = responseHeaders(staging);
      headers.set('Content-Type', 'application/json; charset=utf-8');
      return new Response(request.method === 'HEAD' ? null : '{"status":"ok","service":"world-hub-pro"}', { headers });
    }

    if (url.pathname === '/go' || url.pathname.startsWith('/go/')) {
      const slug = url.pathname.slice(4).replace(/\/$/, '').toLowerCase();
      const destination = destinations.get(slug);
      // Destinations come only from the repository, never from a query parameter.
      if (!destination || new URL(destination).protocol !== 'https:') {
        return new Response(null, { status: 404, headers: responseHeaders(staging) });
      }
      return redirect(destination, staging);
    }

    if (url.pathname === '/' || legacyPaths.has(url.pathname) ||
        url.pathname.startsWith('/tools/') || url.pathname.startsWith('/directory/')) {
      url.pathname = `/${selectLocale(request)}${url.pathname === '/' ? '' : url.pathname}`;
      // Keep navigation on the browser's origin. A TLS-terminating preview
      // proxy may deliver HTTP internally; absolute redirects would downgrade
      // HTTPS and be blocked as mixed content inside the preview iframe.
      return redirect(`${url.pathname}${url.search}`, staging, true);
    }

    const asset = await env.ASSETS.fetch(request);
    if (!staging) return asset;
    const response = new Response(asset.body, asset);
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    response.headers.set('Cache-Control', 'no-store');
    return response;
  },
};
