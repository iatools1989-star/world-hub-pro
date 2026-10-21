import assert from 'node:assert/strict';

const base = process.argv[2];
if (!base) throw new Error('Uso: npm run smoke:cloudflare -- https://URL-DA-IMPLANTACAO');
const origin = new URL(base);
if (!['https:', 'http:'].includes(origin.protocol)) throw new Error('URL inválida');
async function check(path, status, options = {}, validate = () => {}) {
  const response = await fetch(new URL(path, origin), { redirect: 'manual', ...options });
  assert.equal(response.status, status, `${path}: HTTP ${response.status}, esperado ${status}`);
  await validate(response);
  console.log(`OK ${status} ${path}`);
}
await check('/healthz', 200, {}, async (r) => assert.equal((await r.json()).status, 'ok'));
await check('/', 307, { headers: { 'accept-language': 'pt-BR, en;q=0.7' } }, (r) => {
  assert.equal(r.headers.get('location'), '/pt', 'Redirect deve preservar a origem HTTPS do navegador');
  assert.equal(r.headers.get('cache-control'), 'no-store');
});
for (const locale of ['en', 'pt', 'es', 'de', 'fr', 'ja']) await check(`/${locale}`, 200);
await check('/pt/tools/image-compressor', 200);
await check('/en/directory/jasper', 200);
await check('/go/jasper', 307, {}, (r) => assert.equal(new URL(r.headers.get('location')).hostname, 'jasper.ai'));
await check('/go/remove-bg', 307, {}, (r) => assert.equal(new URL(r.headers.get('location')).hostname, 'www.remove.bg'));
await check('/go/does-not-exist', 404);
await check('/test', 404);
await check('/test.html', 404);
await check('/not-a-real-page', 404);
await check('/en', 405, { method: 'POST' });
for (const path of ['/robots.txt', '/sitemap.xml', '/ads.txt']) await check(path, 200);
const html = await (await fetch(new URL('/en', origin))).text();
const asset = html.match(/(?:src|href)="([^" ]*\/_next\/static\/[^" ]+)"/);
assert(asset, 'HTML não contém assets Next.js');
await check(asset[1].replaceAll('&amp;', '&'), 200, {}, (r) => {
  if (r.headers.get('x-robots-tag')?.includes('noindex')) {
    assert.equal(r.headers.get('cache-control'), 'no-store', 'Staging deve evitar cache');
  } else {
    assert.equal(r.headers.get('cache-control'), 'public, max-age=31536000, immutable', 'Asset deve ter uma única política de cache coerente');
  }
  assert.equal(r.headers.get('x-content-type-options'), 'nosniff');
});
console.log('Smoke tests concluídos. Ferramentas, uploads e downloads ainda exigem teste no navegador.');
