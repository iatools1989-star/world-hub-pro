import assert from 'node:assert/strict';
import { test } from 'node:test';
import worker, { selectLocale } from '../cloudflare/worker';
import { DIRECTORY_ITEMS, TOOLS } from '../lib/data';

const request = (path: string, headers: Record<string, string> = {}) => new Request(`https://example.test${path}`, { headers });
const env = { ASSETS: { fetch: async () => new Response('asset', { headers: { 'Content-Type': 'text/html' } }) } };

test('locale respects language quality, region and cookie', () => {
  assert.equal(selectLocale(request('/', { 'accept-language': 'es;q=0.5,pt-BR;q=0.9,en;q=0.1' })), 'pt');
  assert.equal(selectLocale(request('/', { 'accept-language': 'ja;q=0,en;q=0.2' })), 'en');
  assert.equal(selectLocale(request('/', { cookie: 'other=1; NEXT_LOCALE=fr', 'accept-language': 'pt' })), 'fr');
  assert.equal(selectLocale(request('/', { cookie: 'NEXT_LOCALE=evil', 'accept-language': 'xx' })), 'en');
  assert.equal(selectLocale(request('/', { 'accept-language': 'es;q=bad, pt;q=2' })), 'en');
});

test('root redirect preserves query without caching a visitor locale', async () => {
  const r = await worker.fetch(request('/?utm_source=test', { 'accept-language': 'pt-BR' }), env);
  assert.equal(r.status, 307);
  assert.equal(r.headers.get('location'), '/pt?utm_source=test');
  assert.equal(r.headers.get('cache-control'), 'no-store');
  assert.equal(r.headers.get('vary'), 'Accept-Language, Cookie');
  assert.equal(r.headers.get('set-cookie'), null);
});

test('legacy unprefixed links redirect to the selected locale', async () => {
  for (const path of ['/about', '/tools/qr-generator', '/directory/jasper']) {
    const r = await worker.fetch(request(path, { 'accept-language': 'es' }), env);
    assert.equal(r.headers.get('location'), `/es${path}`);
  }
});

test('all directory and featured tool CTAs resolve to fixed HTTPS destinations', async () => {
  const slugs = [...DIRECTORY_ITEMS.map(({ slug }) => slug), ...TOOLS.filter((tool) => tool.featured).map(({ slug }) => slug)];
  for (const slug of slugs) {
    const r = await worker.fetch(request(`/go/${slug}?url=https://evil.test`), env);
    assert.equal(r.status, 307, slug);
    assert.equal(new URL(r.headers.get('location')!).protocol, 'https:');
    assert.notEqual(new URL(r.headers.get('location')!).hostname, 'evil.test');
    assert.equal(r.headers.get('cache-control'), 'no-store');
  }
});

test('unknown and malformed redirect destinations are not open redirects', async () => {
  for (const path of ['/go', '/go/', '/go/unknown', '/go/https://evil.test', '/go/%2F%2Fevil.test']) {
    assert.equal((await worker.fetch(request(path), env)).status, 404);
  }
});

test('unsupported methods fail without forwarding bodies', async () => {
  const r = await worker.fetch(new Request('https://example.test/go/jasper', { method: 'POST', body: 'secret' }), env);
  assert.equal(r.status, 405);
  assert.equal(r.headers.get('allow'), 'GET, HEAD');
});

test('staging is noindex on assets, errors, health and redirects', async () => {
  for (const path of ['/en', '/go/jasper', '/go/unknown', '/healthz', '/']) {
    const r = await worker.fetch(request(path), { ...env, STAGING: 'true' });
    assert.equal(r.headers.get('x-robots-tag'), 'noindex, nofollow', path);
    assert.equal(r.headers.get('cache-control'), 'no-store', path);
  }
});

test('production assets remain untouched and health HEAD has no body', async () => {
  const r = await worker.fetch(request('/en'), env);
  assert.equal(await r.text(), 'asset');
  assert.equal(r.headers.get('x-robots-tag'), null);
  const health = await worker.fetch(new Request('https://example.test/healthz', { method: 'HEAD' }), env);
  assert.equal(health.status, 200);
  assert.equal(await health.text(), '');
});

test('internal HTTP behind an HTTPS proxy cannot downgrade browser navigation', async () => {
  for (const path of ['/?utm_source=preview', '/tools/qr-generator', '/about']) {
    const r = await worker.fetch(new Request(`http://127.0.0.1:46357${path}`, {
      headers: { 'accept-language': 'pt-BR', 'x-forwarded-host': 'untrusted.test' },
    }), env);
    const location = r.headers.get('location')!;
    assert(location.startsWith('/pt'));
    assert(!location.startsWith('//'));
    const browserDestination = new URL(location, 'https://46357-preview.e2b.app');
    assert.equal(browserDestination.origin, 'https://46357-preview.e2b.app');
  }
});
