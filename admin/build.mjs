/**
 * Gera public/painel/bases.js com o conteudo real das 10 reviews e das 16
 * ferramentas, para o painel abrir com os campos preenchidos.
 *
 * Sem isto o painel editaria no vazio. Com isto, ele edita o texto que esta
 * no ar — que e a unica coisa que faz sentido.
 *
 * Usa esbuild para compilar os .ts em memoria (eles tem tipos e imports).
 * Rode com: npm run painel:build
 */
import { build } from 'esbuild';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function carregar(arquivo, exportName) {
  const r = await build({
    entryPoints: [resolve(raiz, arquivo)],
    bundle: true,
    format: 'esm',
    write: false,
    platform: 'neutral',
    target: 'es2020',
    logLevel: 'silent',
  });
  const codigo = r.outputFiles[0].text;
  const url = 'data:text/javascript;base64,' + Buffer.from(codigo).toString('base64');
  const mod = await import(url);
  if (!mod[exportName]) throw new Error(`${arquivo} nao exporta ${exportName}`);
  return mod[exportName];
}

const dir = await carregar('lib/directoryContent.ts', 'DIRECTORY_DETAILS');
const tool = await carregar('lib/toolEditorial.ts', 'TOOL_EDITORIAL');

const conteudo = `/* GERADO por admin/build.mjs — nao edite a mao. */
window.__DIR_BASE = ${JSON.stringify(dir, null, 1)};
window.__TOOL_BASE = ${JSON.stringify(tool, null, 1)};
`;

mkdirSync(resolve(raiz, 'public/painel'), { recursive: true });
writeFileSync(resolve(raiz, 'public/painel/bases.js'), conteudo, 'utf8');

const nDir = Object.keys(dir).length;
const nTool = Object.keys(tool).length;
const kb = (conteudo.length / 1024).toFixed(0);
console.log(`bases.js gerado: ${nDir} reviews + ${nTool} ferramentas (${kb} KB)`);
