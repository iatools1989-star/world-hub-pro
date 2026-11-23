import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdSenseBanner from '@/components/AdSenseBanner';
import { DIRECTORY_ITEMS, ADSENSE_CONFIG } from '@/lib/data';

const BASE = 'https://iatools.online';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const url = `${BASE}/${locale}/directory`;
  return {
    title: 'AI Tools Directory — 10 Services Compared by Pricing',
    description:
      'A short, honest list of commercial AI services: writing, video, image, voice and productivity. Each entry states the real pricing model. Some links are affiliate links, marked as such.',
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
    <div className="flex flex-col min-h-screen bg-[#fcfcfd] dark:bg-zinc-950">
      <Header currentLocale={locale} />

      <main className="flex-1 max-w-[1100px] mx-auto w-full px-4 sm:px-6 py-10">
        <nav className="text-xs text-zinc-500 mb-4">
          <Link href={`/${locale}`} className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-900 dark:text-zinc-300 font-semibold">Directory</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
          AI tools directory
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          Ten commercial AI services we actually think are worth listing — no invented ratings, no
          &ldquo;2,000 happy customers&rdquo;. Each entry states its pricing model up front so you can decide
          before clicking.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {porPreco.map(({ preco, total }) => (
            <span
              key={preco}
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
            >
              {preco}: {total}
            </span>
          ))}
        </div>

        <div className="mt-4 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900/60 rounded-2xl p-4">
          <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
            <strong>Affiliate disclosure:</strong> links to these services may earn us a commission at no
            extra cost to you. It never changes what appears here or the order of this list.{' '}
            <Link href={`/${locale}/affiliate-disclosure`} className="font-bold underline">
              Read the full disclosure
            </Link>
            .
          </p>
        </div>

        <div className="my-8">
          <AdSenseBanner slotId={ADSENSE_CONFIG.slotDirectory} />
        </div>

        {categorias.map((cat) => {
          const itens = DIRECTORY_ITEMS.filter((i) => i.category === cat);
          return (
            <section key={cat} className="mb-10">
              <h2 className="text-lg font-black text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                {cat}
                <span className="text-xs font-bold text-zinc-400">({itens.length})</span>
              </h2>
              <div className="space-y-3">
                {itens.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/${locale}/directory/${item.slug}`}
                    className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 hover:shadow-xl hover:border-zinc-900 dark:hover:border-zinc-600 transition flex items-start gap-4"
                  >
                    <div className="text-2xl">{item.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-zinc-900 dark:text-white group-hover:underline text-sm">
                          {item.name}
                        </h3>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 uppercase">
                          {item.pricing}
                        </span>
                        {item.badge && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-yellow-400 text-zinc-950 uppercase">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                    <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400 whitespace-nowrap">
                      Details →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <section className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
          <h2 className="font-bold text-zinc-900 dark:text-white mb-2">These cost money. Ours don&rsquo;t.</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            If what you need is a QR code, a PDF merge or an image compressor, you don&rsquo;t have to pay a
            subscription for it. All 16 utilities in our{' '}
            <Link href={`/${locale}/tools`} className="font-bold text-yellow-600 dark:text-yellow-400 hover:underline">
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
