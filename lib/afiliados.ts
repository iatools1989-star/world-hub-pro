/**
 * Registro de programas de afiliado: uma fonte unica de verdade.
 *
 * POR QUE ESTE ARQUIVO EXISTE
 *
 * Antes, cada CTA de afiliado do site apontava direto para `affiliateUrl` em
 * `lib/data.ts` e repetia `monetized: false` no editorial. Resultado: 16 CTAs
 * escritos, nenhum link com ID de afiliado, e varias paginas dizendo ao leitor
 * "we earn nothing from this click". O site pedia para ser monetizado e nao
 * podia: faltava onde cadastrar o ID.
 *
 * Agora o ID vive em `content/afiliados.json` (editavel pelo painel /en/admin,
 * na aba Afiliados, sem precisar de codigo). Este modulo le esse arquivo e
 * responde tres perguntas:
 *
 *   1. O programa esta aprovado E tem link? (`aprovado`)
 *   2. Qual URL o visitante deve abrir? (`destinoDoPrograma`)
 *   3. O texto da pagina deve dizer "ganhamos comissao" ou "nao ganhamos"?
 *      (`rotuloDoDinheiro`)
 *
 * REGRA QUE NAO SE NEGOCIA
 *
 * `monetized` (e portanto o selo #ad e o rel="sponsored") so fica true quando
 * existe um link real de afiliado. Anunciar comissao em link que nao comissiona
 * e divulgacao enganosa — e, para o AdSense, sinal de pagina sem valor. Por
 * isso o padrao do sistema e "nao monetizado": esquecer de cadastrar o ID nunca
 * produz uma promessa falsa, so um link direto.
 */
import registro from '@/content/afiliados.json';

export type StatusPrograma = 'aprovado' | 'pendente' | 'sem-programa';

export interface Programa {
  nome: string;
  rede: string;
  cadastro: string;
  dominios: string[];
  comissao: string;
  cookie: string;
  payout: string;
  aceitaBrasil: string;
  status: StatusPrograma;
  id: string;
  link: string;
  ondeAparece: string[];
  nota: string;
}

const PROGRAMAS = (registro as { programas: Record<string, Programa> }).programas;

/** Todos os programas, na ordem do arquivo. Usado pelo painel. */
export function listarProgramas(): { slug: string; programa: Programa }[] {
  return Object.entries(PROGRAMAS).map(([slug, programa]) => ({ slug, programa }));
}

export function programa(slug: string): Programa | undefined {
  return PROGRAMAS[slug];
}

/**
 * Link de afiliado utilizavel, ou null.
 *
 * Exige https e host da lista de dominios do proprio programa. Isso impede que
 * um erro de digitacao no painel (ou um link encurtado de terceiro) mande o
 * visitante para um destino que nao e o site oficial — o mesmo cuidado que ja
 * existia no roteador /go.
 */
export function destinoDoPrograma(slug: string): string | null {
  const p = PROGRAMAS[slug];
  if (!p || p.status !== 'aprovado' || !p.link) return null;
  try {
    const url = new URL(p.link);
    if (url.protocol !== 'https:') return null;
    if (!p.dominios.includes(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

/** O programa esta aprovado e com link valido? */
export function aprovado(slug: string): boolean {
  return destinoDoPrograma(slug) !== null;
}

/**
 * True quando o programa ja foi aprovado em algum momento (tem ID), mesmo que o
 * link ainda esteja vazio. Serve para o aviso interno do painel, nao para o site.
 */
export function temId(slug: string): boolean {
  const p = PROGRAMAS[slug];
  return !!p && p.status === 'aprovado' && p.id.trim().length > 0;
}

/**
 * Para onde um CTA deve apontar.
 *
 * Se o programa paga, vai direto ao link rastreado (o /go nao e necessario e
 * adicionaria um salto). Se nao paga, vai para a pagina interna do diretorio,
 * que existe, tem conteudo e nao promete comissao.
 */
export function ctaDestino(slug: string, paginaInterna: string): string {
  return destinoDoPrograma(slug) ?? paginaInterna;
}

/**
 * Frase curta sobre dinheiro, por programa, para as paginas do diretorio.
 *
 * Devolve null quando o programa nao tem pagina de destino propria: a pagina
 * usa o texto padrao dela. Assim o arquivo de conteudo nao precisa ser editado
 * quando um programa for aprovado — o texto muda sozinho.
 */
export function rotuloDoDinheiro(slug: string): string | null {
  if (aprovado(slug)) {
    return 'This is an affiliate link: if you subscribe, we may earn a commission at no extra cost to you. It does not change the price you pay or what we wrote.';
  }
  const p = PROGRAMAS[slug];
  if (!p) return null;
  if (p.status === 'sem-programa') {
    return `We have no affiliate partnership with ${p.nome}. There is no commission on this link — we link to it because it is relevant, and the page is funded by display ads.`;
  }
  return `No affiliate ID is attached to this link, so we earn nothing from your click. If we are approved for ${p.nome}'s partner program later, this page will say so before you click.`;
}

export const AFILIADOS_ATUALIZADO = (registro as { atualizado: string }).atualizado;
