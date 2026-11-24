/**
 * Conteudo criado pelo CMS: paginas novas, escritas do zero pelo editor.
 *
 * Diferenca para `content/overrides.json`: ali ficam PATCHES sobre textos que
 * ja existem no codigo; aqui ficam documentos completos que nao existem em
 * lugar nenhum. Por isso o arquivo tem a forma `{ guide: { slug: {...} } }` e
 * e mesclado por cima da base (o que e criado aqui nao pode ser editado no
 * codigo, senao os dois brigam).
 *
 * Mesma regra de gravacao: JSON puro, commitado pelo editor, publicado pelo
 * rebuild do Cloudflare.
 */
import criadosPublicados from '@/content/criados.json';

export type GuiaCriado = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keyword: string;
  updated: string;
  readingMinutes: number;
  intro: string[];
  sections: { h: string; p: string[]; list?: string[]; callout?: string }[];
  limitations: string[];
  related: { name: string; href: string; why: string }[];
  faqs: { q: string; a: string }[];
};

export type Criados = {
  guide?: Record<string, GuiaCriado>;
};

/**
 * Import estatico pelo mesmo motivo dos overrides: o Worker nao tem
 * sistema de arquivos, entao ler com `fs` devolveria vazio em producao.
 */
export function lerCriados(): Criados {
  return criadosPublicados as Criados;
}

/** Guias escritos pelo CMS, ja no formato que as paginas esperam. */
export function guiasCriados() {
  return Object.values(lerCriados().guide ?? {});
}

export const ARQUIVO_CRIADOS = 'content/criados.json';
