/**
 * API do editor de conteudo.
 *
 * Toda resposta passa pela checagem de sessao. O cookie e HttpOnly e assinado
 * no servidor (lib/admin/auth.ts), entao um visitante comum nao consegue usar
 * isto mesmo sabendo a URL.
 *
 *   GET /api/admin/content                       -> lista de documentos
 *   GET /api/admin/content?id=tool:qr-generator  -> um documento completo
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_NAME, verificarSessao } from '@/lib/admin/auth';
import { listarDocumentos, carregarDocumento } from '@/lib/cms/content';

export const dynamic = 'force-dynamic';

async function sessaoValida() {
  const cookie = (await cookies()).get(COOKIE_NAME)?.value;
  return verificarSessao(cookie, process.env.ADMIN_SESSION_SECRET);
}

export async function GET(req: NextRequest) {
  if (!(await sessaoValida())) {
    return NextResponse.json({ erro: 'nao autorizado' }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ documentos: listarDocumentos() });
  }

  const doc = carregarDocumento(id);
  if (!doc) {
    return NextResponse.json({ erro: 'documento nao encontrado' }, { status: 404 });
  }
  return NextResponse.json({ documento: doc });
}
