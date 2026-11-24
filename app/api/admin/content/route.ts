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
import { listarDocumentos, carregarDocumento } from '@/lib/cms/content';
import { lerOverrides, serializarOverrides, ARQUIVO_REPO, type Overrides } from '@/lib/cms/overrides';

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

export async function GET(req: Request) {
  if (!(await sessaoValida())) return semSessao();

  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ documentos: listarDocumentos() });

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

  const { overrides, sha } = await overridesDoGithub();

  const ramo = (overrides[tipo as keyof Overrides] ??= {});
  ramo[slug] = { ...(ramo[slug] ?? {}), ...alterados };

  try {
    await github('PUT', `contents/${ARQUIVO}`, {
      message: `CMS: edita ${id}\n\nCampos: ${chaves.join(', ')}`,
      content: Buffer.from(serializarOverrides(overrides), 'utf8').toString('base64'),
      branch: BRANCH,
      ...(sha ? { sha } : {}),
    });
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
