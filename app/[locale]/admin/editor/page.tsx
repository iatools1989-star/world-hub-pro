import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { COOKIE_NAME, verificarSessao } from '@/lib/admin/auth';
import AdminEditor from '@/components/AdminEditor';

export const metadata: Metadata = {
  title: 'Editor',
  robots: { index: false, follow: false },
};

/**
 * Editor de conteudo.
 *
 * Esta rota existe separada do /en/admin para o editor poder ser embutido no
 * AdminShell (que ja tem o cabecalho e o botao de sair) e, no futuro, aberto
 * em tela cheia sem duplicar codigo.
 *
 * A checagem de sessao e feita AQUI, no servidor: nao adianta esconder a tela
 * no cliente, porque o HTML chegaria mesmo assim.
 */
export default async function EditorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const cookie = (await cookies()).get(COOKIE_NAME)?.value;
  const sessao = await verificarSessao(cookie, process.env.ADMIN_SESSION_SECRET);

  if (!sessao) redirect(`/${locale}/admin`);

  return <AdminEditor />;
}
