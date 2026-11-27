import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { COOKIE_NAME, verificarSessao } from '@/lib/admin/auth';
import AdminAfiliados from '@/components/AdminAfiliados';

export const metadata: Metadata = {
  title: 'Afiliados',
  robots: { index: false, follow: false },
};

/**
 * Tela de afiliados, embutida no AdminShell como o editor de conteudo.
 * A checagem de sessao e no servidor, nao no cliente.
 */
export default async function AfiliadosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const cookie = (await cookies()).get(COOKIE_NAME)?.value;
  const sessao = await verificarSessao(cookie, process.env.ADMIN_SESSION_SECRET);
  if (!sessao) redirect(`/${locale}/admin`);
  return <AdminAfiliados />;
}
