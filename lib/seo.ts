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
 *
 * ATENCAO (registrado de proposito): 'Admin' e um apelido, nao uma identidade.
 * Ele resolve o campo vazio, mas nao cria autoria verificavel. Quando houver um
 * nome real + perfil publico, troque as duas constantes abaixo.
 */
export const AUTHOR_NAME: string | null = 'Silva';

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

/**
 * Entidade de autoria para o JSON-LD.
 *
 * Um Person com nome e nada mais e quase inutil para o Google: o que faz
 * autoria "identificavel" e poder ligar a pessoa a um perfil real. Enquanto
 * AUTHOR_NAME for um apelido, emitimos a Organization — que e verdadeira —
 * em vez de fabricar um perfil. Quando houver um nome real e um perfil
 * publico, AUTHOR_PROFILE_URL preenche o buraco e o Person passa a valer.
 */
export const AUTHOR_PROFILE_URL: string | null = null;

export function authorEntity() {
  if (!AUTHOR_NAME) return publisher();
  return {
    '@type': 'Person',
    name: AUTHOR_NAME,
    ...(AUTHOR_PROFILE_URL ? { url: AUTHOR_PROFILE_URL, sameAs: [AUTHOR_PROFILE_URL] } : {}),
    worksFor: publisher(),
  };
}
