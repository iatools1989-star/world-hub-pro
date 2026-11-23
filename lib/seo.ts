/**
 * Configuracao de SEO em um lugar so.
 *
 * O dominio oficial e SEM www. O www nao tem registro DNS e nunca resolveu;
 * por isso qualquer URL absoluta gerada aqui precisa usar o apex.
 */
export const SITE_URL = 'https://iatools.online';
export const SITE_NAME = 'World Tools Hub';

/**
 * Nome do autor humano responsavel pelo conteudo.
 *
 * O Google valoriza autoria identificavel ("quem escreveu isto e por que
 * deveria ser confiado") e o AdSense usa esse sinal ao avaliar conteudo
 * de baixo valor. Enquanto estiver vazio, o JSON-LD cai para a organizacao.
 *
 * Preencha com o nome real e o JSON-LD passa a emitir um Person.
 */
export const AUTHOR_NAME: string | null = null;

export function canonical(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}

export function jsonLdScript(data: Record<string, unknown> | Record<string, unknown>[]) {
  return { __html: JSON.stringify(data) };
}

/** Breadcrumb padrao: Home > Secao > Pagina */
export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: canonical(it.path),
    })),
  };
}

export function publisher() {
  return {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  };
}

export function authorEntity() {
  return AUTHOR_NAME
    ? { '@type': 'Person', name: AUTHOR_NAME }
    : publisher();
}
