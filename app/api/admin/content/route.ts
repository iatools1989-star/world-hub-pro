/**
 * API do CMS: le e grava o conteudo editavel.
 *
 * GET  /api/admin/content            -> lista de paginas
 * GET  /api/admin/content?id=tool:x  -> uma pagina completa
 * PUT  /api/admin/content            -> salva { id, alterados }
 *
 * A gravacao funciona assim: o texto editado entra em content/overrides.json,
 * o arquivo e commitado na main pelo GitHub, e o Cloudflare rebuild a partir
 * do commit. Sem banco de dados e sem servidor de aplicacao proprio.
 *
 * Seguranca:
 *  - toda rota exige o cookie de sessao do admin;
 *  - a escrita exige ADMIN_GITHUB_TOKEN (secret), nunca exposto ao navegador;
 *  - so as chaves presentes em `alterados` sao gravadas, o resto do arquivo
 *    fica intacto — salvar um campo nao apaga os outros;
 *  - a gravacao le o overrides.json do proprio GitHub antes de escrever, para
 *    nao sobrescrever uma edicao feita em outra aba.
 */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_NAME, verificarSessao } from '@/lib/admin/auth';
import { listarDocumentos, carregarDocumento, contarPalavras } from '@/lib/cms/content';
import { lerOverrides, serializarOverrides, ARQUIVO_REPO, type Overrides } from '@/lib/cms/overrides';
import { lerCriados, ARQUIVO_CRIADOS, type GuiaCriado } from '@/lib/cms/criados';
import { GUIDES } from '@/lib/guidesContent';

export const dynamic = 'force-dynamic';

const REPO = process.env.ADMIN_GITHUB_REPO || 'iatools1989-star/world-hub-pro';
const ARQUIVO = ARQUIVO_REPO;
const BRANCH = 'main';

async function sessaoValida(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  const sessao = await verificarSessao(token, process.env.ADMIN_SESSION_SECRET);
  return !!sessao;
}

function semSessao() {
  return NextResponse.json({ erro: 'nao autenticado' }, { status: 401 });
}

/**
 * Criados como estao no GitHub, nao como foram bundlados.
 *
 * Uma pagina criada agora nao esta na build (o JSON e import estatico, o
 * rebuild do Cloudflare leva ~2 min). Sem esta leitura, o autor criaria a
 * pagina e nao conseguiria abri-la nem edita-la ate o deploy terminar.
 * Vale so para o admin: o site publico continua lendo a build.
 */
async function criadosDoGithub(): Promise<Record<string, Record<string, unknown>>> {
  try {
    const dados = await github('GET', `contents/${ARQUIVO_CRIADOS}?ref=${BRANCH}`);
    if (dados?.content) {
      const json = JSON.parse(Buffer.from(dados.content, 'base64').toString('utf8'));
      return (json.guide ?? {}) as Record<string, Record<string, unknown>>;
    }
  } catch {
    /* sem token ou arquivo ausente: cai para a build */
  }
  return (lerCriados().guide ?? {}) as unknown as Record<string, Record<string, unknown>>;
}

export async function GET(req: Request) {
  if (!(await sessaoValida())) return semSessao();

  const id = new URL(req.url).searchParams.get('id');
  const doGithub = await criadosDoGithub();

  if (!id) {
    const documentos = listarDocumentos();
    // Acrescenta o que existe no GitHub e ainda nao entrou na build.
    const conhecidos = new Set(documentos.map((d) => d.slug));
    for (const g of Object.values(doGithub)) {
      const slug = String(g.slug ?? '');
      if (!slug || conhecidos.has(slug)) continue;
      documentos.unshift({
        id: `guide:${slug}`,
        tipo: 'guide',
        slug,
        nome: String(g.title ?? slug),
        caminho: `/en/guides/${slug}`,
        updated: String(g.updated ?? ''),
        palavras: contarPalavras(g),
      });
    }
    return NextResponse.json({ documentos });
  }

  // Guia recem-criado: monta a partir do GitHub antes de olhar a build.
  const [tipo, slug] = id.split(':');
  if (tipo === 'guide' && slug && doGithub[slug] && !lerCriados().guide?.[slug]) {
    return NextResponse.json({
      documento: { tipo: 'guide', ...doGithub[slug] },
    });
  }

  const doc = carregarDocumento(id);
  if (!doc) return NextResponse.json({ erro: 'pagina nao encontrada' }, { status: 404 });
  return NextResponse.json({ documento: doc });
}

/* ------------------------------------------------------------------ */
/* Escrita                                                             */
/* ------------------------------------------------------------------ */

const TIPOS = new Set(['directory', 'tool', 'toolHero', 'guide']);

/** Impede caminhos esquisitos (__proto__, prototype) vindos do editor. */
function caminhoSeguro(caminho: string): boolean {
  const proibidas = new Set(['__proto__', 'prototype', 'constructor']);
  return caminho.split('.').every((k) => k.length > 0 && !proibidas.has(k));
}

/** Aplica {a.b.0: valor} num objeto ja carregado (usado no guia criado). */
function aplicarNoObjeto<T extends Record<string, unknown>>(base: T, patch: Record<string, unknown>): T {
  const copia = JSON.parse(JSON.stringify(base)) as Record<string, unknown>;
  for (const [caminho, valor] of Object.entries(patch)) {
    const chaves = caminho.split('.');
    let alvo: Record<string, unknown> = copia;
    for (let i = 0; i < chaves.length - 1; i++) {
      if (typeof alvo[chaves[i]] !== 'object' || alvo[chaves[i]] === null) alvo[chaves[i]] = {};
      alvo = alvo[chaves[i]] as Record<string, unknown>;
    }
    alvo[chaves[chaves.length - 1]] = valor;
  }
  return copia as T;
}

async function github(metodo: string, caminho: string, corpo?: unknown) {
  const token = process.env.ADMIN_GITHUB_TOKEN;
  if (!token) return null;
  const r = await fetch(`https://api.github.com/repos/${REPO}/${caminho}`, {
    method: metodo,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      // O GitHub recusa requisicao sem User-Agent (403 "Request forbidden by
      // administrative rules"). O fetch do Worker nao envia esse cabecalho
      // sozinho, entao ele vai explicito.
      'User-Agent': 'iatools-cms',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: corpo ? JSON.stringify(corpo) : undefined,
    cache: 'no-store',
  });
  const texto = await r.text();
  if (!r.ok) throw new Error(`GitHub ${r.status}: ${texto.slice(0, 300)}`);
  return texto ? JSON.parse(texto) : null;
}

/** Pega o overrides.json atual direto do GitHub (pode ser mais novo que o build). */
async function overridesDoGithub(): Promise<{ overrides: Overrides; sha: string | null }> {
  try {
    const dados = await github('GET', `contents/${ARQUIVO}?ref=${BRANCH}`);
    if (dados?.content) {
      const texto = Buffer.from(dados.content, 'base64').toString('utf8');
      return { overrides: JSON.parse(texto) as Overrides, sha: dados.sha };
    }
  } catch {
    /* arquivo ainda nao existe no repositorio: comeca vazio */
  }
  return { overrides: lerOverrides(), sha: null };
}

/**
 * Cria uma pagina nova. Hoje so guia/artigo: e o unico tipo em que a pagina
 * inteira e texto. Ferramenta e item do diretorio tambem tem um componente
 * de interface (o widget, a pagina do app) que nao se escreve por formulario.
 */
function slugificar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);
}

function guiaVazio(titulo: string, slug: string, hoje: string): GuiaCriado {
  return {
    slug,
    title: titulo,
    metaTitle: titulo.slice(0, 60),
    metaDescription: '',
    keyword: '',
    updated: hoje,
    readingMinutes: 5,
    intro: [''],
    sections: [{ h: '', p: [''] }],
    limitations: [''],
    related: [],
    faqs: [{ q: '', a: '' }],
  };
}

export async function POST(req: Request) {
  if (!(await sessaoValida())) return semSessao();

  if (!process.env.ADMIN_GITHUB_TOKEN) {
    return NextResponse.json(
      { erro: 'Falta o secret ADMIN_GITHUB_TOKEN no Cloudflare.' },
      { status: 503 }
    );
  }

  let corpo: { tipo?: string; titulo?: string };
  try {
    corpo = await req.json();
  } catch {
    return NextResponse.json({ erro: 'JSON invalido' }, { status: 400 });
  }

  const tipo = corpo.tipo ?? 'guide';
  const titulo = (corpo.titulo ?? '').trim();
  if (tipo !== 'guide') {
    return NextResponse.json(
      {
        erro:
          'Por enquanto o CMS cria artigos e guias. Ferramenta e pagina do diretorio precisam de um componente de interface junto, que nao se escreve por formulario.',
      },
      { status: 400 }
    );
  }
  if (titulo.length < 3) {
    return NextResponse.json({ erro: 'Escreva um titulo com pelo menos 3 letras.' }, { status: 400 });
  }

  const slug = slugificar(titulo);
  if (!slug) {
    return NextResponse.json({ erro: 'Nao consegui formar um endereco com esse titulo.' }, { status: 400 });
  }
  if (GUIDES[slug] || lerCriados().guide?.[slug]) {
    return NextResponse.json(
      { erro: `Ja existe uma pagina em /en/guides/${slug}. Escolha outro titulo.` },
      { status: 409 }
    );
  }

  const hoje = new Date().toISOString().slice(0, 10);

  // Le o arquivo atual no GitHub antes de escrever, para nao apagar o que foi
  // criado em outra aba entre um clique e outro.
  let criados = lerCriados() as Record<string, unknown>;
  let sha: string | null = null;
  try {
    const dados = await github('GET', `contents/${ARQUIVO_CRIADOS}?ref=${BRANCH}`);
    if (dados?.content) {
      criados = JSON.parse(Buffer.from(dados.content, 'base64').toString('utf8'));
      sha = dados.sha;
    }
  } catch {
    /* arquivo ainda nao existe no repositorio */
  }

  const guias = ((criados.guide ?? {}) as Record<string, unknown>) || {};
  guias[slug] = guiaVazio(titulo, slug, hoje);
  criados.guide = guias;

  try {
    await github('PUT', `contents/${ARQUIVO_CRIADOS}`, {
      message: `CMS: cria o guia "${titulo}" (/en/guides/${slug})`,
      content: Buffer.from(JSON.stringify(criados, null, 2) + '\n', 'utf8').toString('base64'),
      branch: BRANCH,
      ...(sha ? { sha } : {}),
    });
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    id: `guide:${slug}`,
    slug,
    caminho: `/en/guides/${slug}`,
    aviso: 'Pagina criada. Preencha os textos e clique em Salvar e publicar. Ela entra no site em ~2 minutos.',
  });
}

export async function PUT(req: Request) {
  if (!(await sessaoValida())) return semSessao();

  if (!process.env.ADMIN_GITHUB_TOKEN) {
    return NextResponse.json(
      {
        erro:
          'Falta o secret ADMIN_GITHUB_TOKEN no Cloudflare. Crie um token do GitHub com permissao de escrita em Contents e cadastre em Workers > Settings > Variables.',
      },
      { status: 503 }
    );
  }

  let corpo: { id?: string; alterados?: Record<string, unknown> };
  try {
    corpo = await req.json();
  } catch {
    return NextResponse.json({ erro: 'JSON invalido' }, { status: 400 });
  }

  const id = corpo.id ?? '';
  const alterados = corpo.alterados ?? {};
  const [tipo, slug] = id.split(':');
  if (!tipo || !slug || !TIPOS.has(tipo)) {
    return NextResponse.json({ erro: 'id invalido' }, { status: 400 });
  }
  const chaves = Object.keys(alterados);
  if (chaves.length === 0) return NextResponse.json({ ok: true, gravados: 0 });
  if (chaves.some((c) => !caminhoSeguro(c))) {
    return NextResponse.json({ erro: 'campo invalido' }, { status: 400 });
  }
  if (JSON.stringify(alterados).length > 400_000) {
    return NextResponse.json({ erro: 'alteracao grande demais' }, { status: 413 });
  }

  // Guia criado pelo CMS mora inteiro em criados.json: salvar um campo dele
  // em overrides.json nao teria efeito, porque o documento nao existe na base.
  const ehCriado = tipo === 'guide' && !!(await criadosDoGithub())[slug];

  try {
    if (ehCriado) {
      let criados = lerCriados() as unknown as Record<string, { [k: string]: unknown }>;
      let shaCriados: string | null = null;
      const dados = await github('GET', `contents/${ARQUIVO_CRIADOS}?ref=${BRANCH}`);
      if (dados?.content) {
        criados = JSON.parse(Buffer.from(dados.content, 'base64').toString('utf8'));
        shaCriados = dados.sha;
      }
      const guia = ((criados.guide ?? {}) as Record<string, Record<string, unknown>>)[slug] ?? {};
      criados.guide = { ...(criados.guide ?? {}), [slug]: aplicarNoObjeto(guia, alterados) };

      await github('PUT', `contents/${ARQUIVO_CRIADOS}`, {
        message: `CMS: edita ${id}\n\nCampos: ${chaves.join(', ')}`,
        content: Buffer.from(JSON.stringify(criados, null, 2) + '\n', 'utf8').toString('base64'),
        branch: BRANCH,
        ...(shaCriados ? { sha: shaCriados } : {}),
      });
    } else {
      const { overrides, sha } = await overridesDoGithub();
      const ramo = (overrides[tipo as keyof Overrides] ??= {});
      ramo[slug] = { ...(ramo[slug] ?? {}), ...alterados };

      await github('PUT', `contents/${ARQUIVO}`, {
        message: `CMS: edita ${id}\n\nCampos: ${chaves.join(', ')}`,
        content: Buffer.from(serializarOverrides(overrides), 'utf8').toString('base64'),
        branch: BRANCH,
        ...(sha ? { sha } : {}),
      });
    }
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    gravados: chaves.length,
    // o deploy do Cloudflare roda em ~2 min depois do commit na main
    aviso: 'Gravado. O site publica sozinho em cerca de 2 minutos.',
  });
}
