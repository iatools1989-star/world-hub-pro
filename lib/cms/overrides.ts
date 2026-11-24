/**
 * Grava e le os overrides do CMS.
 *
 * O site publicado e estatico: nao ha banco de dados. Quando voce clica em
 * "Salvar" no editor, o texto editado vira uma entrada em
 * `content/overrides.json`, o arquivo e commitado no GitHub e o Cloudflare
 * rebuild a partir do commit. Resultado: o site continua estatico (rapido e
 * barato), e cada edicao tem diff, historico e rollback de graca.
 *
 * Por que um arquivo JSON e nao o codigo .ts: o painel antigo reescrevia
 * lib/*.ts e um erro de virgula derrubava o build inteiro. JSON nao compila,
 * entao um erro de conteudo nunca quebra o site.
 */
import fs from 'node:fs';
import path from 'node:path';

export type Overrides = {
  directory?: Record<string, Record<string, unknown>>;
  tool?: Record<string, Record<string, unknown>>;
  toolHero?: Record<string, Record<string, unknown>>;
  guide?: Record<string, Record<string, unknown>>;
};

const ARQUIVO = path.join(process.cwd(), 'content', 'overrides.json');

export function lerOverrides(): Overrides {
  try {
    return JSON.parse(fs.readFileSync(ARQUIVO, 'utf8')) as Overrides;
  } catch {
    return {};
  }
}

export function overridesDe(tipo: keyof Overrides, slug: string): Record<string, unknown> {
  return lerOverrides()[tipo]?.[slug] ?? {};
}

/**
 * Aplica {a.b.0.c: valor} sobre uma copia do objeto. Nao muta a entrada.
 * Sem base devolve undefined (a pagina trata como conteudo ausente).
 */
export function aplicarPatch<T>(base: T | undefined, patch: Record<string, unknown>): T | undefined {
  if (!base) return undefined;
  const copia = JSON.parse(JSON.stringify(base)) as Record<string, unknown>;
  for (const [caminho, valor] of Object.entries(patch)) {
    const chaves = caminho.split('.');
    let alvo: Record<string, unknown> = copia;
    for (let i = 0; i < chaves.length - 1; i++) {
      const k = chaves[i];
      if (typeof alvo[k] !== 'object' || alvo[k] === null) alvo[k] = {};
      alvo = alvo[k] as Record<string, unknown>;
    }
    alvo[chaves[chaves.length - 1]] = valor;
  }
  return copia as T;
}

export function serializarOverrides(o: Overrides): string {
  return JSON.stringify(o, null, 2) + '\n';
}

export { ARQUIVO };
