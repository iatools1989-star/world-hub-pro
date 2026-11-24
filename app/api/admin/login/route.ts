import { NextRequest, NextResponse } from 'next/server';
import { derivarSenha, iguaisSeguro, assinarSessao, COOKIE_NAME, SESSAO_HORAS } from '@/lib/admin/auth';

/**
 * POST /api/admin/login
 *
 * Recebe { email, senha }. Compara contra os secrets do Worker e, se bater,
 * devolve um cookie HttpOnly assinado.
 *
 * Seguranca:
 * - A senha nunca e comparada em texto claro: PBKDF2 + comparacao constante.
 * - O e-mail e comparado em tempo constante tambem, para nao vazar qual dos
 *   dois campos errou.
 * - Freio simples de forca bruta: 5 tentativas por minuto por IP. Nao e um
 *   sistema de reputacao, mas transforma "milhoes de tentativas" em "60 por hora".
 * - A resposta de erro e sempre a mesma, e nunca diz se o e-mail existe.
 */

const JANELA_MS = 60_000;
const MAX_TENTATIVAS = 5;
const tentativas = new Map<string, { n: number; ate: number }>();

function excedeu(ip: string): boolean {
  const agora = Date.now();
  const t = tentativas.get(ip);
  if (!t || agora > t.ate) {
    tentativas.set(ip, { n: 1, ate: agora + JANELA_MS });
    return false;
  }
  t.n += 1;
  return t.n > MAX_TENTATIVAS;
}

export async function POST(req: NextRequest) {
  const env = process.env;
  const emailCorreto = env.ADMIN_EMAIL;
  const hashCorreto = env.ADMIN_PASSWORD_HASH;
  const salt = env.ADMIN_PASSWORD_SALT;
  const secret = env.ADMIN_SESSION_SECRET;

  if (!emailCorreto || !hashCorreto || !salt || !secret) {
    return NextResponse.json(
      { erro: 'Painel nao configurado. Rode scripts/configurar-admin.mjs.' },
      { status: 503 }
    );
  }

  const ip = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'local';
  if (excedeu(ip)) {
    return NextResponse.json({ erro: 'Muitas tentativas. Aguarde um minuto.' }, { status: 429 });
  }

  let body: { email?: string; senha?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ erro: 'Pedido invalido.' }, { status: 400 });
  }

  const email = (body.email || '').trim().toLowerCase();
  const senha = body.senha || '';

  const hashTentativa = await derivarSenha(senha, salt);
  // Os dois sao avaliados sempre: nao ha saida antecipada que revele qual falhou.
  const senhaOk = iguaisSeguro(hashTentativa, hashCorreto);
  const emailOk = iguaisSeguro(email, emailCorreto.toLowerCase());

  if (!senhaOk || !emailOk) {
    return NextResponse.json({ erro: 'E-mail ou senha incorretos.' }, { status: 401 });
  }

  const cookie = await assinarSessao(email, secret);
  // Cookie Secure so quando a conexao e https de verdade. Em producao e
  // sempre https (Cloudflare). Fixar Secure em qualquer ambiente quebra o
  // login em teste local (http), o que atrapalha depurar o painel.
  const https =
    req.headers.get('x-forwarded-proto') === 'https' || req.nextUrl.protocol === 'https:';
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, cookie, {
    httpOnly: true,
    secure: https,
    sameSite: 'strict',
    path: '/',
    maxAge: SESSAO_HORAS * 3600,
  });
  return res;
}
