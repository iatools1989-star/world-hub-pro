import { readdir, readFile, stat } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { join, relative } from 'node:path';

const root = new URL('../out/', import.meta.url);
const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else files.push(path);
  }
}
await walk(root.pathname);
assert(files.length <= 20_000, 'Workers Free: limite de 20.000 arquivos excedido');
for (const file of files) {
  assert((await stat(file)).size <= 25 * 1024 * 1024, `Arquivo maior que 25 MiB: ${file}`);
  assert(!file.endsWith('.map'), `Source map público inesperado: ${file}`);
  assert(!/(^|\/)test(\/|\.|$)/.test(relative(root.pathname, file)), 'Rota de teste não pode ser publicada');
}
const html = files.filter((file) => file.endsWith('.html'));
for (const locale of ['en', 'pt', 'es', 'de', 'fr', 'ja']) {
  const home = await readFile(new URL(`${locale}.html`, root), 'utf8');
  assert(home.includes(`/${locale}/tools/bulk-studio`), `Home ${locale}: link com locale incorreto`);
  await stat(new URL(`${locale}/tools/image-compressor.html`, root));
  await stat(new URL(`${locale}/directory/jasper.html`, root));
}
for (const file of ['404.html', '_headers', 'robots.txt', 'ads.txt', 'sitemap.xml']) {
  await stat(new URL(file, root));
}
console.log(`Cloudflare: ${html.length} arquivos HTML; ${files.length} arquivos totais; limites Free e rotas essenciais OK.`);
