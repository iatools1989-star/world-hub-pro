import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToolIcon from '@/components/ToolIcon';
import { Breadcrumbs } from '@/components/PageShell';
import AdSenseBanner from '@/components/AdSenseBanner';
import { DIRECTORY_ITEMS, ADSENSE_CONFIG } from '@/lib/data';
import JsonLd from '@/components/JsonLd';
import { canonical, breadcrumbs } from '@/lib/seo';

const BASE = 'https://iatools.online';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const url = `${BASE}/${locale}/directory`;
  return {
    title: 'AI Tools Directory — 10 Services Compared by Pricing',
    description:
      'Ten commercial AI services for writing, video, image, voice and productivity, each with its November 2026 prices, the case for not buying it, and what to use instead.',
    alternates: { canonical: url },
  };
}

const ORDEM_PRECO = ['Free', 'Freemium', 'Paid'] as const;

export default async function DirectoryIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const categorias = Array.from(new Set(DIRECTORY_ITEMS.map((i) => i.category))).sort();
  const porPreco = ORDEM_PRECO.map((p) => ({
    preco: p,
    total: DIRECTORY_ITEMS.filter((i) => i.pricing === p).length,
  }));

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-canvas)]">
      <Header currentLocale={locale} />

      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'AI tools directory',
            url: canonical(`/${locale}/directory`),
            inLanguage: 'en',
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: DIRECTORY_ITEMS.length,
              itemListElement: DIRECTORY_ITEMS.map((item, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: item.name,
                url: canonical(`/${locale}/directory/${item.slug}`),
              })),
            },
          },
          breadcrumbs([
            { name: 'Home', path: `/${locale}` },
            { name: 'Directory', path: `/${locale}/directory` },
          ]),
        ]}
      />

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <Breadcrumbs itens={[{ nome: 'Home', href: `/${locale}` }, { nome: 'AI Directory' }]} />

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--color-ink)]">
          AI tools directory
        </h1>
        <p className="mt-3 text-[var(--color-ink-muted)] max-w-2xl leading-relaxed">
          Ten commercial AI services we actually think are worth listing — no invented ratings, no
          &ldquo;2,000 happy customers&rdquo;. Each entry states its pricing model up front so you can decide
          before clicking.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {porPreco.map(({ preco, total }) => (
            <span
              key={preco}
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-line)] text-[var(--color-ink-soft)]"
            >
              {preco}: {total}
            </span>
          ))}
        </div>

        <div className="mt-4 rounded-[12px] border-l-[3px] border-[var(--color-brand)] bg-[var(--color-surface-2)] p-4">
          <p className="text-xs text-[var(--color-ink-soft)] leading-relaxed">
            <strong>Affiliate disclosure:</strong> no affiliate ID is attached to any link on this page today,
            so we earn nothing from your clicks. If that changes, the link and this notice change with it —
            and it will never affect what appears here or the order of this list.{' '}
            <Link href={`/${locale}/affiliate-disclosure`} className="font-bold underline">
              Read the full disclosure
            </Link>
            .
          </p>
        </div>

        <div className="my-8">
          <AdSenseBanner slotId={ADSENSE_CONFIG.slotDirectory} />
        </div>

        {/* Como esta lista e feita — conteudo real, nao recheio */}
        <section className="mb-10 grid md:grid-cols-[1.4fr_1fr] gap-6">
          <div className="space-y-3 text-sm text-[var(--color-ink-soft)] leading-relaxed">
            <h2 className="text-xl font-black text-[var(--color-ink)]">
              How we decide what gets listed
            </h2>
            <p>
              There are thousands of AI tools and this page lists ten. That is not a sampling problem — it is
              the point. A directory that lists everything tells you nothing, and most of them are paid for.
            </p>
            <p>
              Three questions decide inclusion. First, does the product do something that a free alternative or
              a general assistant does not? Second, is the pricing model stated plainly enough for a buyer to
              predict the monthly bill? Third, can we name a situation where it is the wrong purchase — because
              if we cannot, we do not understand it well enough to recommend it. That third question is why
              every entry below has a &ldquo;do not buy it if&rdquo; section.
            </p>
            <p>
              We do not test these products hands-on. We read what the vendors publish, compare it against what
              independent trackers found, and say where the two disagree. Every page carries the date the prices
              were checked, because SaaS prices move faster than published reviews do. If a page is out of date,
              the date on it tells you so — that is more useful than pretending otherwise.
            </p>
            <p>
              What we will not do: invent a rating out of ten, quote a &ldquo;verified user&rdquo; count we cannot
              check, promise a discount that does not exist, or sell a placement. The site is funded by display
              advertising, which has no opinion about which tool you pick.
            </p>
          </div>
          <aside className="bg-[var(--color-surface-2)] dark:bg-zinc-900 border border-[var(--color-line)] rounded-[12px] p-5 self-start">
            <h3 className="font-bold text-sm text-[var(--color-ink)] mb-2">Before you subscribe to anything</h3>
            <ul className="space-y-2 text-xs text-[var(--color-ink-muted)] leading-relaxed list-disc pl-4">
              <li>Check whether the free tier covers your actual monthly volume, not the demo volume.</li>
              <li>Prefer annual billing only after a month on monthly billing — the discount is real, the commitment is too.</li>
              <li>Look at the per-seat price, not the plan price, if more than one person will use it.</li>
              <li>Export your content before cancelling anything. Workspace history rarely survives a downgrade.</li>
              <li>Ask whether the free tool on this site already does it. Several times, the honest answer is yes.</li>
            </ul>
            <Link
              href={`/${locale}/tools`}
              className="mt-4 inline-block text-xs font-bold text-[var(--color-ink)] underline"
            >
              See the 16 free tools →
            </Link>
          </aside>
        </section>

        {categorias.map((cat) => {
          const itens = DIRECTORY_ITEMS.filter((i) => i.category === cat);
          return (
            <section key={cat} className="mb-10">
              <h2 className="mb-3 flex items-center gap-2 text-[15px] font-bold tracking-[-0.01em] text-[var(--color-ink)]">
                {cat}
                <span className="text-[11px] font-bold text-[var(--color-ink-muted)]">
                  {itens.length}
                </span>
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {itens.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/${locale}/directory/${item.slug}`}
                    className="ui-card ui-card-hover group flex items-start gap-3.5 p-4"
                  >
                    <div className="grid h-9 w-9 place-items-center rounded-[9px] border border-[var(--color-line)] bg-[var(--color-surface-2)] text-[var(--color-ink-soft)]"><ToolIcon nome={item.slug} className="h-[18px] w-[18px]" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-[var(--color-ink)] group-hover:underline text-sm">
                          {item.name}
                        </h3>
                        <span className="ui-chip !py-0.5 !text-[10px] uppercase tracking-wide">
                          {item.pricing}
                        </span>
                        {item.badge && (
                          <span className="ui-chip ui-chip-brand !py-0.5 !text-[10px] uppercase tracking-wide">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--color-ink-muted)] mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                    <span className="shrink-0 self-center whitespace-nowrap text-[12px] font-bold text-[var(--color-ink)] group-hover:underline underline-offset-4">
                      Details →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <section className="bg-[var(--color-surface-2)] dark:bg-zinc-900 border border-[var(--color-line)] rounded-[12px] p-6">
          <h2 className="font-bold text-[var(--color-ink)] mb-2">These cost money. Ours don&rsquo;t.</h2>
          <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
            If what you need is a QR code, a PDF merge or an image compressor, you don&rsquo;t have to pay a
            subscription for it. All 16 utilities in our{' '}
            <Link href={`/${locale}/tools`} className="font-bold text-[var(--color-brand-deep)] hover:underline">
              free tools section
            </Link>{' '}
            run locally in your browser, with no account and no limits.
          </p>
        </section>
      </main>

      <Footer currentLocale={locale} />
    </div>
  );
}
