import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdSenseBanner from '@/components/AdSenseBanner';
import ToolIcon from '@/components/ToolIcon';
import { Breadcrumbs } from '@/components/PageShell';
import { TOOLS, ADSENSE_CONFIG } from '@/lib/data';
import JsonLd from '@/components/JsonLd';
import { canonical, breadcrumbs } from '@/lib/seo';

const BASE = 'https://iatools.online';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'All Free Browser Tools — 16 Utilities, No Upload, No Account',
    description:
      'Every tool on World Tools Hub in one page: PDF, image, text, security and calculator utilities. All 16 run entirely in your browser — nothing is uploaded to a server.',
    alternates: { canonical: `${BASE}/${locale}/tools` },
  };
}

export default async function ToolsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const categorias = Array.from(new Set(TOOLS.map((t) => t.category))).sort();
  const destaque = TOOLS.find((t) => t.slug === 'bulk-studio');
  const restantes = TOOLS.filter((t) => t.slug !== 'bulk-studio');

  return (
    <div className="flex min-h-screen flex-col">
      <Header currentLocale={locale} />

      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'All 16 free browser tools',
            url: canonical(`/${locale}/tools`),
            inLanguage: 'en',
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: TOOLS.length,
              itemListElement: TOOLS.map((tool: { name: string; slug: string }, i: number) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: tool.name,
                url: canonical(`/${locale}/tools/${tool.slug}`),
              })),
            },
          },
          breadcrumbs([
            { name: 'Home', path: `/${locale}` },
            { name: 'Tools', path: `/${locale}/tools` },
          ]),
        ]}
      />

      <main className="w-full flex-1">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
          <Breadcrumbs itens={[{ nome: 'Home', href: `/${locale}` }, { nome: 'Tools' }]} />

          <p className="eyebrow">16 utilities · all client-side</p>
          <h1 className="mt-3 max-w-[20ch] text-[1.9rem] font-extrabold leading-[1.12] tracking-[-0.033em] text-[var(--color-ink)] sm:text-[2.6rem]">
            All free browser tools
          </h1>
          <p className="mt-4 max-w-[62ch] text-[16.5px] leading-relaxed text-[var(--color-ink-soft)]">
            Every utility below runs inside your browser using HTML5, Canvas and WebAssembly. Your
            files are never uploaded, cached or logged — there is no server to send them to. No
            account, no daily limit, no watermark.
          </p>

          {/* Categorias como âncoras — sem virar seções separadas, que é o que
              deixava uma coluna de um cartão só e o resto vazio. */}
          <div className="mt-7 flex flex-wrap gap-2">
            {categorias.map((c) => (
              <a
                key={c}
                href={`#${c.toLowerCase()}`}
                className="ui-chip transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
              >
                {c}
                <span className="text-[var(--color-ink-muted)]">
                  {TOOLS.filter((t) => t.category === c).length}
                </span>
              </a>
            ))}
          </div>

          <div className="my-9">
            <AdSenseBanner slotId={ADSENSE_CONFIG.slotTools} />
          </div>

          {/* Destaque */}
          {destaque && (
            <Link
              href={`/${locale}/tools/${destaque.slug}`}
              className="ui-card ui-card-hover group mb-5 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[11px] border border-[var(--color-line)] bg-[var(--color-brand)] text-[#0a0a0b]">
                  <ToolIcon nome={destaque.slug} className="h-5 w-5" />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-[15px] font-bold text-[var(--color-ink)]">{destaque.name}</h2>
                    <span className="ui-chip ui-chip-dark">Featured</span>
                  </div>
                  <p className="mt-1 max-w-[70ch] text-[13.5px] leading-relaxed text-[var(--color-ink-muted)]">
                    {destaque.desc}
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-[13px] font-bold text-[var(--color-ink)] group-hover:underline underline-offset-4">
                Open tool →
              </span>
            </Link>
          )}

          {/* Grade única com as 16 ferramentas */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {restantes.map((tool) => (
              <Link
                key={tool.slug}
                id={tool.category.toLowerCase()}
                href={`/${locale}/tools/${tool.slug}`}
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
                <span className="mt-4 border-t border-[var(--color-line)] pt-3 text-[12.5px] font-bold text-[var(--color-ink)] group-hover:underline underline-offset-4">
                  Open tool →
                </span>
              </Link>
            ))}
          </div>

          <section className="ui-panel mt-10 p-6">
            <h2 className="text-[15px] font-bold text-[var(--color-ink)]">
              Looking for AI services instead?
            </h2>
            <p className="mt-2 max-w-[75ch] text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">
              These 16 tools are utilities we built and run ourselves. If you need AI writing, image
              or voice services, we keep a separate directory of{' '}
              <Link href={`/${locale}/directory`} className="ui-link font-bold">
                commercial AI tools
              </Link>{' '}
              — with the pricing model of each one stated up front.
            </p>
          </section>
        </div>
      </main>

      <Footer currentLocale={locale} />
    </div>
  );
}
