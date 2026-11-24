/**
 * Conteudo editavel do site, num formato que um CMS precisa.
 *
 * O problema do painel antigo: ele editava `lib/*.ts` escrevendo codigo
 * TypeScript direto no GitHub. Para trocar um titulo, o painel precisava
 * reescrever um arquivo com tipos, comentarios e virgulas — qualquer erro de
 * sintaxe derrubava o build inteiro, e o autor ficava sem conseguir publicar.
 *
 * Aqui o conteudo sai dos arquivos `.ts` e vira dado puro (JSON serializavel).
 * O editor trabalha nele; o site le do mesmo lugar.
 *
 * Sem banco de dados, de proposito: um site de uma pessoa nao precisa de
 * Postgres. O que for editado vira `content/*.json`, versionado pelo git — o
 * que da historico, diff e rollback de graca.
 */
import { TOOLS, DIRECTORY_ITEMS } from '@/lib/data';
import { TOOL_GUIDES } from '@/lib/toolContent';
import { TOOL_EDITORIAL } from '@/lib/toolEditorial';
import { TOOL_OVERRIDES, mergeOverride } from '@/lib/contentOverrides';
import { DIRECTORY_DETAILS } from '@/lib/directoryContent';
import { GUIDES } from '@/lib/guidesContent';
import { overridesDe, aplicarPatch } from '@/lib/cms/overrides';

export type DocDiretorio = {
  tipo: 'directory';
  slug: string;
  nome: string;
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
  verdict: string[];
  faqs: { q: string; a: string }[];
};

export type DocFerramenta = {
  tipo: 'tool';
  slug: string;
  nome: string;
  metaTitle: string;
  metaDescription: string;
  keyword: string;
  updated: string;
  resumo: string;
  intro: string[];
  beneficios: { title: string; desc: string }[];
  naoIdealPara: string;
  passos: { step: number; title: string; desc: string }[];
  faqs: { q: string; a: string }[];
};

export type DocGuia = {
  tipo: 'guide';
  slug: string;
  titulo: string;
  metaTitle: string;
  metaDescription: string;
  keyword: string;
  updated: string;
  readingMinutes: number;
  intro: string[];
  secoes: { h: string; p: string[]; list?: string[]; callout?: string }[];
  limitacoes: string[];
  faqs: { q: string; a: string }[];
};

export type Documento = DocDiretorio | DocFerramenta | DocGuia;

/** Lista enxuta para a tela de indice do CMS. */
export type ResumoDocumento = {
  id: string;
  tipo: Documento['tipo'];
  slug: string;
  nome: string;
  caminho: string;
  updated: string;
  palavras: number;
};

/** Conta palavras de qualquer ramo do documento, sem contar nomes de campo. */
export function contarPalavras(valor: unknown): number {
  if (typeof valor === 'string') return valor.trim().split(/\s+/).filter(Boolean).length;
  if (Array.isArray(valor)) return valor.reduce<number>((n, v) => n + contarPalavras(v), 0);
  if (valor && typeof valor === 'object') {
    return Object.values(valor as Record<string, unknown>).reduce<number>(
      (n, v) => n + contarPalavras(v),
      0
    );
  }
  return 0;
}

export function listarDocumentos(): ResumoDocumento[] {
  const lista: ResumoDocumento[] = [];

  for (const item of DIRECTORY_ITEMS) {
    const bruto = DIRECTORY_DETAILS[item.slug];
    if (!bruto) continue;
    const d = aplicarPatch(bruto, overridesDe('directory', item.slug))!;
    lista.push({
      id: `directory:${item.slug}`,
      tipo: 'directory',
      slug: item.slug,
      nome: item.name,
      caminho: `/en/directory/${item.slug}`,
      updated: d.updated,
      palavras: contarPalavras(d),
    });
  }

  for (const tool of TOOLS) {
    const ed = aplicarPatch(
      mergeOverride(TOOL_EDITORIAL[tool.slug], TOOL_OVERRIDES[tool.slug]),
      overridesDe('tool', tool.slug)
    );
    const guide = aplicarPatch(TOOL_GUIDES[tool.slug], overridesDe('toolHero', tool.slug));
    lista.push({
      id: `tool:${tool.slug}`,
      tipo: 'tool',
      slug: tool.slug,
      nome: tool.name,
      caminho: `/en/tools/${tool.slug}`,
      updated: (ed as { updated?: string })?.updated ?? '2026-11-10',
      palavras: contarPalavras(ed ?? guide ?? tool),
    });
  }

  for (const bruto of Object.values(GUIDES)) {
    const g = aplicarPatch(bruto, overridesDe('guide', bruto.slug))!;
    lista.push({
      id: `guide:${g.slug}`,
      tipo: 'guide',
      slug: g.slug,
      nome: g.title,
      caminho: `/en/guides/${g.slug}`,
      updated: g.updated,
      palavras: contarPalavras(g),
    });
  }

  return lista.sort((a, b) => a.tipo.localeCompare(b.tipo) || a.nome.localeCompare(b.nome));
}

/** Carrega um documento completo, ja mesclado com o que o site publica. */
export function carregarDocumento(id: string): Documento | null {
  const [tipo, slug] = id.split(':');
  if (!tipo || !slug) return null;

  if (tipo === 'directory') {
    const bruto = DIRECTORY_DETAILS[slug];
    const item = DIRECTORY_ITEMS.find((i) => i.slug === slug);
    if (!bruto || !item) return null;
    const d = aplicarPatch(bruto, overridesDe('directory', slug))!;
    return {
      tipo: 'directory',
      slug,
      nome: item.name,
      metaTitle: d.metaTitle,
      metaDescription: d.metaDescription,
      updated: d.updated,
      intro: d.intro,
      whatItDoes: d.whatItDoes,
      pricingHeading: d.pricingHeading,
      pricingRows: d.pricingRows,
      pricingNotes: d.pricingNotes,
      pros: d.pros,
      cons: d.cons,
      bestFor: d.bestFor,
      notFor: d.notFor,
      verdict: d.verdict,
      faqs: d.faqs,
    };
  }

  if (tipo === 'tool') {
    const tool = TOOLS.find((t) => t.slug === slug);
    if (!tool) return null;
    const ed = aplicarPatch(
      mergeOverride(TOOL_EDITORIAL[slug], TOOL_OVERRIDES[slug]),
      overridesDe('tool', slug)
    );
    const guide = aplicarPatch(TOOL_GUIDES[slug], overridesDe('toolHero', slug));
    return {
      tipo: 'tool',
      slug,
      nome: tool.name,
      metaTitle: (ed as { metaTitle?: string })?.metaTitle ?? `${tool.name} - Free Online Browser Tool`,
      metaDescription:
        (ed as { metaDescription?: string })?.metaDescription ??
        (guide as { summary?: string })?.summary ??
        tool.desc,
      keyword: (ed as { keyword?: string })?.keyword ?? slug,
      updated: (ed as { updated?: string })?.updated ?? '2026-11-10',
      resumo: (guide as { summary?: string })?.summary ?? tool.desc,
      intro: ed?.intro ?? [tool.desc],
      beneficios: ed?.benefits ?? guide?.features ?? [],
      naoIdealPara: ed?.notIdealFor ?? '',
      passos: guide?.steps ?? [],
      faqs: guide?.faqs ?? [],
    };
  }

  if (tipo === 'guide') {
    const bruto = GUIDES[slug];
    if (!bruto) return null;
    const g = aplicarPatch(bruto, overridesDe('guide', slug))!;
    return {
      tipo: 'guide',
      slug,
      titulo: g.title,
      metaTitle: g.metaTitle,
      metaDescription: g.metaDescription,
      keyword: g.keyword,
      updated: g.updated,
      readingMinutes: g.readingMinutes,
      intro: g.intro,
      secoes: g.sections,
      limitacoes: g.limitations,
      faqs: g.faqs,
    };
  }

  return null;
}
