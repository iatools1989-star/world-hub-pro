import Link from 'next/link';
import { BotaoCookies } from './ConsentBanner';

const COLUNAS: { titulo: string; itens: { label: string; href: string }[] }[] = [
  {
    titulo: 'Product',
    itens: [
      { label: 'All tools', href: '/en/tools' },
      { label: 'AI directory', href: '/en/directory' },
      { label: 'Guides', href: '/en/guides' },
    ],
  },
  {
    titulo: 'Company',
    itens: [
      { label: 'About', href: '/en/about' },
      { label: 'Contact', href: '/en/contact' },
    ],
  },
  {
    titulo: 'Legal',
    itens: [
      { label: 'Privacy', href: '/en/privacy' },
      { label: 'Terms', href: '/en/terms' },
      { label: 'Affiliate disclosure', href: '/en/affiliate-disclosure' },
      // Nao e um link: limpa a escolha e recarrega, para o banner voltar a
      // aparecer. Consentimento precisa ser tao facil de retirar quanto de dar.
      { label: 'Cookie settings', href: '#' },
    ],
  },
];

export default function Footer({ currentLocale }: { currentLocale: string }) {
  const ano = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--color-line)] bg-[var(--color-surface-2)]">
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.6fr_repeat(3,1fr)]">
          {/* Marca */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-[#101012] text-[13px] font-black text-[#f5c518] dark:bg-[#f5c518] dark:text-[#101012]">
                W
              </span>
              <span className="text-[14.5px] font-extrabold tracking-[-0.02em] text-[var(--color-ink)]">
                World Tools Hub
              </span>
            </div>
            <p className="mt-4 max-w-[34ch] text-[13.5px] leading-relaxed text-[var(--color-ink-muted)]">
              Free browser tools that never upload your files, plus an AI directory with prices
              verified and limitations stated upfront.
            </p>
            <p className="mt-3 text-[12px] text-[var(--color-ink-muted)]">
              Some outbound links are affiliate links (<span className="font-semibold">#ad</span>).
              They never affect ranking or verdicts.
            </p>
          </div>

          {/* Colunas */}
          {COLUNAS.map((col) => (
            <div key={col.titulo}>
              <p className="eyebrow mb-3">{col.titulo}</p>
              <ul className="space-y-2">
                {col.itens.map((it) => (
                  <li key={it.href}>
                    {it.label === 'Cookie settings' ? (
                      <span className="text-[13.5px] font-medium text-[var(--color-ink-soft)]">
                        <BotaoCookies />
                      </span>
                    ) : (
                      <Link
                        href={it.href}
                        className="text-[13.5px] font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] hover:underline underline-offset-4"
                      >
                        {it.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="ui-rule my-8" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-[var(--color-ink-muted)]">
            © {ano} World Tools Hub · Free tools · No subscription · No paywall
          </p>
          <a
            href="mailto:guilhermemarculasilva@gmail.com"
            className="text-[12.5px] font-semibold text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] hover:underline underline-offset-4"
          >
            guilhermemarculasilva@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
