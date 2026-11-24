import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdSenseBanner from '@/components/AdSenseBanner';
import ToolIcon from '@/components/ToolIcon';
import { TOOLS, DIRECTORY_ITEMS } from '@/lib/data';
import JsonLd from '@/components/JsonLd';
import { SITE_URL, SITE_NAME, canonical, publisher } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: 'Free Browser Tools & Curated AI Directory',
    description:
      '16 fast, client-side tools + Private Bulk Studio. Process 100 images in 10s, 100% offline.',
    alternates: { canonical: canonical(`/${locale}`) },
  };
}

const GARANTIAS = [
  { icone: 'lock', titulo: 'Nothing is uploaded', texto: 'Files are processed in the browser tab. There is no server to send them to.' },
  { icone: 'bolt', titulo: 'No account, no limit', texto: 'Open the tool and use it. No sign-up wall, no daily cap, no watermark.' },
  { icone: 'check', titulo: 'Prices we verified', texto: 'Every AI review lists the plan prices we checked and the case against buying.' },
];

export default async function HomePage() {
  const currentLocale = 'en';
  const ferramentas = TOOLS.filter((t) => t.slug !== 'bulk-studio');
  const destaque = TOOLS.find((t) => t.slug === 'bulk-studio');

  return (
    <div className="flex min-h-screen flex-col">
      <Header currentLocale={currentLocale} />

      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: SITE_NAME,
            url: SITE_URL,
            inLanguage: 'en',
            publisher: publisher(),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Free browser tools',
            numberOfItems: TOOLS.length,
            itemListElement: TOOLS.map((tool, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: tool.name,
              url: canonical(`/en/tools/${tool.slug}`),
            })),
          },
        ]}
      />

      <main className="flex-1">
      {/* ---------------------------------------------------------------- HERO */}
      <section className="border-b border-[var(--color-line)]">
        <div className="mx-auto max-w-[1200px] px-4 pb-14 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="eyebrow">Free · Private · No account</p>
              <h1 className="mt-4 text-[2.35rem] font-extrabold leading-[1.06] tracking-[-0.04em] text-[var(--color-ink)] sm:text-[3.4rem]">
                Tools that never
                <br />
                {/* Marcador: traço de caneta ABAIXO das letras, não atrás.
                    Motivo: faixa atrás do texto obriga o texto a ser escuro, e
                    escuro só funciona em metade da altura da letra — a outra
                    metade fica branca sobre preto. Com o traço abaixo, a cor do
                    texto continua sendo --color-ink e os dois temas ficam iguais. */}
                <span className="relative inline-block">
                  <span aria-hidden className="absolute inset-x-[-0.04em] -bottom-[0.1em] -z-10 h-[0.16em] -rotate-[0.4deg] rounded-[2px] bg-[var(--color-brand)]" />
                  touch your files
                </span>
              </h1>
              <p className="mt-6 max-w-[52ch] text-[17px] leading-relaxed text-[var(--color-ink-soft)]">
                Sixteen PDF, image and text utilities that run entirely inside your browser.
                Plus an AI directory where every price was checked and every downside is written
                down — including the ones that cost us a commission.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/en/tools" className="ui-btn ui-btn-primary">
                  Browse 16 tools
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-4 w-4" aria-hidden>
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
                <Link href="/en/directory" className="ui-btn ui-btn-outline">
                  AI directory
                </Link>
              </div>

              <dl className="mt-10 grid max-w-[440px] grid-cols-3 gap-6 border-t border-[var(--color-line)] pt-6">
                {[
                  ['16', 'free tools'],
                  ['10', 'AI reviews'],
                  ['0', 'files uploaded'],
                ].map(([n, r]) => (
                  <div key={r}>
                    <dt className="text-[1.6rem] font-extrabold leading-none tracking-[-0.03em] text-[var(--color-ink)]">
                      {n}
                    </dt>
                    <dd className="mt-1.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--color-ink-muted)]">
                      {r}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Cartão do Bulk Studio, sem promessa de preço */}
            <div className="ui-card relative overflow-hidden p-6 shadow-[0_22px_60px_-40px_rgba(0,0,0,0.5)] sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">Featured tool</p>
                  <h2 className="mt-2 text-[1.15rem] font-bold tracking-[-0.02em] text-[var(--color-ink)]">
                    Bulk Image Studio
                  </h2>
                </div>
                <span className="ui-chip ui-chip-brand">Free</span>
              </div>

              <div className="mt-5 rounded-[10px] border-2 border-dashed border-[var(--color-line-strong)] bg-[var(--color-surface-2)] px-5 py-8 text-center">
                <div className="mx-auto grid h-11 w-11 place-items-center rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-ink-muted)]">
                  <ToolIcon nome="image-compressor" className="h-5 w-5" />
                </div>
                <p className="mt-3 text-[13.5px] font-semibold text-[var(--color-ink)]">
                  Drop up to 100 images
                </p>
                <p className="mt-1 text-[12px] text-[var(--color-ink-muted)]">
                  JPG · PNG · WebP — resized and zipped
                </p>
                <div className="mt-4 grid grid-cols-6 gap-1.5" aria-hidden>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-[4px] bg-[var(--color-line)]" />
                  ))}
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                {['Runs offline after first load', 'No upload, no queue, no watermark', 'Works on phone and desktop'].map((t) => (
                  <p key={t} className="flex items-start gap-2 text-[13px] text-[var(--color-ink-soft)]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" className="mt-[3px] h-3.5 w-3.5 shrink-0 text-[var(--color-brand-deep)]" aria-hidden>
                      <path d="M4 13l5 5L20 7" />
                    </svg>
                    {t}
                  </p>
                ))}
              </div>

              <Link href="/en/tools/bulk-studio" className="ui-btn ui-btn-solid mt-6 w-full">
                Open Bulk Studio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- GARANTIAS */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)]">
        <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8">
          {GARANTIAS.map((g) => (
            <div key={g.titulo} className="flex gap-3.5">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--color-line)] bg-[var(--color-surface-2)] text-[var(--color-ink)]">
                <ToolIcon nome={g.icone} className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-[13.5px] font-bold text-[var(--color-ink)]">{g.titulo}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-ink-muted)]">{g.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1200px] px-4 pt-8 sm:px-6 lg:px-8">
        <AdSenseBanner />
      </div>

      {/* ---------------------------------------------------------- TOOLS */}
      <section id="tools" className="mx-auto w-full max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Utilities</p>
            <h2 className="mt-2 text-[1.75rem] font-extrabold tracking-[-0.03em] text-[var(--color-ink)] sm:text-[2.1rem]">
              Free browser tools
            </h2>
            <p className="mt-2 max-w-[54ch] text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">
              PDF, image, text, security and calculator utilities. All client-side — your files never
              leave the device.
            </p>
          </div>
          <Link href="/en/tools" className="ui-link inline-flex min-h-6 items-center text-[13.5px] font-bold">
            See all 16
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Destaque primeiro, largura dupla no desktop */}
          {destaque && (
            <Link
              href={`/en/tools/${destaque.slug}`}
              className="ui-card ui-card-hover group relative overflow-hidden p-5 sm:col-span-2 lg:col-span-1 lg:row-span-2"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-[10px] border border-[var(--color-line)] bg-[var(--color-brand)] text-[#0a0a0b]">
                  <ToolIcon nome={destaque.slug} className="h-5 w-5" />
                </span>
                <span className="ui-chip ui-chip-dark">Featured</span>
              </div>
              <h3 className="mt-4 text-[15.5px] font-bold tracking-[-0.01em] text-[var(--color-ink)] group-hover:underline underline-offset-4">
                {destaque.name}
              </h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--color-ink-muted)]">
                {destaque.desc}
              </p>
              <p className="mt-5 text-[13px] font-bold text-[var(--color-ink)]">Open tool →</p>
            </Link>
          )}

          {ferramentas.map((tool) => (
            <Link
              key={tool.slug}
              href={`/en/tools/${tool.slug}`}
              className="ui-card ui-card-hover group flex flex-col p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-[9px] border border-[var(--color-line)] bg-[var(--color-surface-2)] text-[var(--color-ink-soft)] transition-colors group-hover:bg-[var(--color-ink)] group-hover:text-[var(--color-canvas)]">
                  <ToolIcon nome={tool.slug} className="h-[18px] w-[18px]" />
                </span>
                <span className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-[var(--color-ink-muted)]">
                  {tool.category}
                </span>
              </div>
              <h3 className="mt-3.5 text-[14.5px] font-bold tracking-[-0.01em] text-[var(--color-ink)]">
                {tool.name}
              </h3>
              <p className="mt-1 flex-1 text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
                {tool.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <AdSenseBanner />
      </div>

      {/* ------------------------------------------------------- DIRECTORY */}
      <section id="directory" className="border-t border-[var(--color-line)] bg-[var(--color-surface-2)]">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Reviewed</p>
              <h2 className="mt-2 text-[1.75rem] font-extrabold tracking-[-0.03em] text-[var(--color-ink)] sm:text-[2.1rem]">
                AI tools directory
              </h2>
              <p className="mt-2 max-w-[56ch] text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">
                Ten commercial services, each with its November 2026 prices, the case against buying
                it, and a cheaper alternative.
              </p>
            </div>
            <Link href="/en/directory" className="ui-link inline-flex min-h-6 items-center text-[13.5px] font-bold">
              Compare all
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DIRECTORY_ITEMS.map((item) => (
              <Link
                key={item.slug}
                href={`/en/directory/${item.slug}`}
                className="ui-card ui-card-hover group flex flex-col p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-[9px] border border-[var(--color-line)] bg-[var(--color-surface-2)] text-[var(--color-ink-soft)]">
                    <ToolIcon nome={item.slug} className="h-[18px] w-[18px]" />
                  </span>
                  <div className="flex flex-wrap justify-end gap-1.5">
                    {item.badge && <span className="ui-chip ui-chip-brand">{item.badge}</span>}
                    <span className="ui-chip">{item.pricing}</span>
                  </div>
                </div>
                <h3 className="mt-3.5 text-[14.5px] font-bold tracking-[-0.01em] text-[var(--color-ink)] group-hover:underline underline-offset-4">
                  {item.name}
                </h3>
                <p className="mt-1 flex-1 text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
                  {item.desc}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-[var(--color-line)] pt-3">
                  <span className="text-[12px] font-semibold text-[var(--color-ink-soft)]">
                    {item.category}
                  </span>
                  <span className="text-[12px] font-bold text-[var(--color-ink)]">Read review →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ CTA */}
      <section className="border-t border-[var(--color-line)]">
        <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8">
          <div className="ui-card flex flex-col items-start justify-between gap-6 p-7 sm:flex-row sm:items-center sm:p-9">
            <div>
              <p className="eyebrow">Start here</p>
              <h2 className="mt-2 text-[1.4rem] font-extrabold tracking-[-0.025em] text-[var(--color-ink)] sm:text-[1.6rem]">
                Not sure which tool you actually need?
              </h2>
              <p className="mt-2 max-w-[62ch] text-[14px] leading-relaxed text-[var(--color-ink-soft)]">
                Our guides explain how to choose without jargon, what a pricing page hides, and how
                affiliate commissions work — including why we tell you about them.
              </p>
            </div>
            <Link href="/en/guides" className="ui-btn ui-btn-primary shrink-0">
              Read the guides
            </Link>
          </div>
        </div>
      </section>

      </main>

      <Footer currentLocale={currentLocale} />
    </div>
  );
}
