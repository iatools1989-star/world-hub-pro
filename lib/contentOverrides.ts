/**
 * Overrides de conteudo gerados pelo painel de administracao (/painel).
 *
 * POR QUE ESTE ARQUIVO EXISTE
 * O painel nao sobrescreve lib/directoryContent.ts nem lib/toolEditorial.ts:
 * esses arquivos tem conteudo escrito a mao, com comentarios que explicam cada
 * decisao editorial. O painel escreve aqui, e o site mescla por cima:
 *
 *   { ...DIRECTORY_DETAILS[slug], ...DIRECTORY_OVERRIDES[slug] }
 *
 * Assim uma edicao no painel vira um diff pequeno e reversivel, e um erro no
 * painel nunca apaga o texto original — basta remover a entrada daqui.
 *
 * GERADO POR: admin/ (npm run painel:build) + scripts/publicar.mjs
 * Nao edite a mao se for usar o painel; a proxima publicacao sobrescreve.
 */

export type DirectoryOverride = Partial<{
  metaTitle: string;
  metaDescription: string;
  updated: string;
  intro: string[];
  whatItDoes: string[];
  pricingHeading: string;
  pricingRows: { plan: string; price: string; includes: string }[];
  pricingNotes: string[];
  pros: string[];
  cons: string[];
  bestFor: string;
  notFor: string;
  alternatives: { name: string; href: string; why: string }[];
  verdict: string[];
  faqs: { q: string; a: string }[];
}>;

export type ToolOverride = Partial<{
  metaTitle: string;
  metaDescription: string;
  keyword: string;
  intro: string[];
  benefits: { title: string; desc: string }[];
  notIdealFor: string;
  cta: { partner?: string; body: string; label: string; href: string; monetized?: boolean };
  updated: string;
  related: { name: string; href: string; why: string }[];
}>;

export const DIRECTORY_OVERRIDES: Record<string, DirectoryOverride> = {};

export const TOOL_OVERRIDES: Record<string, ToolOverride> = {};

/**
 * Mescla o conteudo escrito a mao com o override do painel.
 * Sem override devolve a base intacta; sem base devolve o override.
 */
export function mergeOverride<T extends object>(
  base: T | undefined,
  override: Partial<T> | undefined
): T | undefined {
  if (!base) return override as T | undefined;
  if (!override) return base;
  return { ...base, ...override };
}
