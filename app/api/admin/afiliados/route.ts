/**
 * API do registro de afiliados.
 *
 * GET  /api/admin/afiliados  -> { programas: [{ slug, ...programa }], aviso }
 * PUT  /api/admin/afiliados   -> salva { slug, alterados: { status, id, link, nota, ... } }
 *
 * POR QUE EXISTE
 *
 * O registro vive em `content/afiliados.json` e e a unica coisa que separa
 * "temos 16 CTAs escritos" de "temos 16 CTAs que pagam". Sem uma tela, trocar o
 * status de um programa exigiria abrir o repositorio e editar JSON — e o passo
 * mais importante do site (colar o ID do afiliado) ficaria sempre para depois.
 *
 * Mesmo desenho do CMS: nada de banco de dados. O arquivo e commitado no
 * GitHub pela API e o Cloudflare rebuild a partir do commit. O token nunca vai
 * para o navegador.
 *
 * Seguranca:
 *  - exige o cookie de sessao do admin;
 *  - so aceita alteracao nos campos de uma lista fechada (nada de sobrescrever
 *    o arquivo inteiro por um PUT malformado);
 *  - um link so entra se for https e do dominio declarado do programa. Link
 *    torto nao chega a ser gravado, entao nunca vira redirect cego depois.
 */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_NAME, verificarSessao } from '@/lib/admin/auth';
import { listarProgramas, type Programa } from '@/lib/afiliados';
import registro from '@/content/afiliados.json';

export const dynamic = 'force-dynamic';

const REPO = process.env.ADMIN_GITHUB_REPO || 'iatools1989-star/world-hub-pro';
const ARQUIVO = 'content/afiliados.json';
const BRANCH = 'main';

/** Campos que a tela pode mudar. `nome`, `dominios` e `cadastro` sao codigo. */
const CAMPOS_EDITAVEIS = new Set(['status', 'id', 'link', 'nota', 'comissao', 'ondeAparece']);

async function sessaoValida(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  return !!(await verificarSessao(token, process.env.ADMIN_SESSION_SECRET));
}

async function github(metodo: string, caminho: string, corpo?: unknown) {
  const token = process.env.ADMIN_GITHUB_TOKEN;
  if (!token) return null;
  const r = await fetch(`https://api.github.com/repos/${REPO}/${caminho}`, {
    method: metodo,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
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

type Registro = {
  atualizado: string;
  aviso: string;
  programas: Record<string, Programa>;
};

export async function GET() {
  if (!(await sessaoValida())) {
    return NextResponse.json({ erro: 'nao autenticado' }, { status: 401 });
  }
  const dados = registro as unknown as Registro;
  return NextResponse.json({
    aviso: dados.aviso,
    atualizado: dados.atualizado,
    programas: listarProgramas(),
  });
}

/** Valida o link contra os dominios do proprio programa (nao contra uma lista global). */
function linkValido(programa: Programa, link: string): boolean {
  if (!link) return true; // campo vazio = "ainda nao tenho link"
  try {
    const url = new URL(link);
    return url.protocol === 'https:' && programa.dominios.includes(url.hostname);
  } catch {
    return false;
  }
}

export async function PUT(req: Request) {
  if (!(await sessaoValida())) {
    return NextResponse.json({ erro: 'nao autenticado' }, { status: 401 });
  }
  if (!process.env.ADMIN_GITHUB_TOKEN) {
    return NextResponse.json(
      { erro: 'Falta o secret ADMIN_GITHUB_TOKEN no Cloudflare (Workers > Settings > Variables).' },
      { status: 503 }
    );
  }

  let corpo: { slug?: string; alterados?: Record<string, unknown> };
  try {
    corpo = await req.json();
  } catch {
    return NextResponse.json({ erro: 'JSON invalido' }, { status: 400 });
  }

  const slug = corpo.slug ?? '';
  const alterados = corpo.alterados ?? {};
  const dados = registro as unknown as Registro;
  const programa = dados.programas[slug];
  if (!programa) return NextResponse.json({ erro: 'programa desconhecido' }, { status: 400 });

  const campos = Object.keys(alterados);
  if (campos.length === 0) return NextResponse.json({ ok: true, gravados: 0 });
  const invalido = campos.find((c) => !CAMPOS_EDITAVEIS.has(c));
  if (invalido) {
    return NextResponse.json(
      { erro: `campo "${invalido}" nao e editavel pela tela (edite lib/afiliados ou o JSON no repositorio)` },
      { status: 400 }
    );
  }

  if (typeof alterados.status === 'string' && !['aprovado', 'pendente', 'sem-programa'].includes(alterados.status)) {
    return NextResponse.json({ erro: 'status invalido' }, { status: 400 });
  }
  if (typeof alterados.link === 'string' && !linkValido(programa, alterados.link.trim())) {
    return NextResponse.json(
      {
        erro: `O link precisa ser https e do dominio do programa (${programa.dominios.join(', ')}). Cole o link de rastreio que o painel do afiliado te deu.`,
      },
      { status: 400 }
    );
  }

  try {
    // Le a versao atual do GitHub antes de escrever: outra aba (ou o painel do
    // afiliado) pode ter mudado o arquivo, e sobrescrever apagaria a alteracao.
    let atual = dados as unknown as Record<string, unknown>;
    let sha: string | null = null;
    try {
      const remoto = await github('GET', `contents/${ARQUIVO}?ref=${BRANCH}`);
      if (remoto?.content) {
        atual = JSON.parse(Buffer.from(remoto.content, 'base64').toString('utf8'));
        sha = remoto.sha;
      }
    } catch {
      // Arquivo ainda nao existe no repositorio (primeira gravacao) ou o token
      // nao pode ler: parte da copia embutida na build e cria o arquivo.
    }

    const programas = (atual.programas ?? {}) as Record<string, Record<string, unknown>>;
    const alvo = programas[slug] ?? {};
    for (const [campo, valor] of Object.entries(alterados)) {
      alvo[campo] = typeof valor === 'string' ? valor.trim() : valor;
    }
    programas[slug] = alvo;
    atual.programas = programas;
    atual.atualizado = new Date().toISOString().slice(0, 10);

    // Aprovar sem link rastreado nao monetiza nada: o site continua dizendo
    // que nao ganhamos. O aviso volta na resposta para a tela mostrar.
    const aviso =
      alvo.status === 'aprovado' && !alvo.link
        ? 'Status salvo como aprovado, mas sem link de rastreio o site ainda nao ganha comissao.'
        : null;

    await github('PUT', `contents/${ARQUIVO}`, {
      message: `Afiliados: atualiza ${slug}${alterados.status ? ` (${String(alterados.status)})` : ''}`,
      content: Buffer.from(JSON.stringify(atual, null, 2) + '\n').toString('base64'),
      branch: BRANCH,
      ...(sha ? { sha } : {}),
    });

    return NextResponse.json({ ok: true, gravados: campos.length, aviso });
  } catch (e) {
    return NextResponse.json({ erro: (e as Error).message }, { status: 500 });
  }
}
