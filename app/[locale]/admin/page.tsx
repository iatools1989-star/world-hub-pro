import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { COOKIE_NAME, verificarSessao } from '@/lib/admin/auth';
import AdminLogin from '@/components/AdminLogin';
import AdminShell from '@/components/AdminShell';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const cookie = (await cookies()).get(COOKIE_NAME)?.value;
  const sessao = await verificarSessao(cookie, process.env.ADMIN_SESSION_SECRET);

  if (!sessao) {
    return <AdminLogin locale={locale} />;
  }
  return <AdminShell email={sessao.email} locale={locale} />;
}
