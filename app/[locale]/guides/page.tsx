import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { GUIDES } from '@/lib/guidesContent';
import { canonical, breadcrumbs, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Guides — how to buy software without getting burned',
  description:
    'Plain-English guides on choosing tools, picking a first email platform, and understanding how affiliate commissions actually work. No jargon, no promises.',
  alternates: { canonical: `${SITE_URL}/en/guides` },
};

export default async function GuidesIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const guias = Object.values(GUIDES);

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfcfd]">
      <Header currentLocale={locale} />
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Guides',
            url: canonical(`/${locale}/guides`),
            inLanguage: 'en',
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: guias.length,
              itemListElement: guias.map((g, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: g.title,
                url: canonical(`/${locale}/guides/${g.slug}`),
              })),
            },
          },
          breadcrumbs([
            { name: 'Home', path: `/${locale}` },
            { name: 'Guides', path: `/${locale}/guides` },
          ]),
        ]}
      />

      <main className="flex-1 max-w-[760px] mx-auto w-full px-4 sm:px-6 py-10">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900">Guides</h1>
        <p className="mt-3 text-zinc-600 leading-relaxed max-w-2xl">
          Long-form explanations of the decisions people actually get wrong when they buy software:
          how to tell a real problem from a mood, which limit on a free plan binds first, and what is
          really happening when a site earns a commission on what it recommends.
        </p>

        <div className="mt-8 space-y-4">
          {guias.map((g) => (
            <Link
              key={g.slug}
              href={`/${locale}/guides/${g.slug}`}
              className="block bg-white border border-zinc-200 rounded-2xl p-5 hover:border-zinc-900 transition"
            >
              <h2 className="font-black text-lg text-zinc-900 tracking-tight">{g.title}</h2>
              <p className="text-sm text-zinc-600 mt-1.5 leading-relaxed">{g.metaDescription}</p>
              <p className="text-xs text-zinc-500 mt-2">
                {g.readingMinutes} min read · updated {g.updated}
              </p>
            </Link>
          ))}
        </div>

        <section className="mt-10 p-5 bg-zinc-50 border border-zinc-200 rounded-2xl">
          <h2 className="text-sm font-black text-zinc-900 mb-2">Why these three exist</h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Because the alternative is a directory of ten tools with prices and no context, which
            helps nobody decide anything. These guides are the method behind the{' '}
            <Link href={`/${locale}/directory`} className="font-bold underline">directory</Link> —
            and the{' '}
            <Link href={`/${locale}/tools`} className="font-bold underline">sixteen free tools</Link>{' '}
            exist for the cases where the honest answer is "you do not need to pay for this".
          </p>
        </section>
      </main>

      <Footer currentLocale={locale} />
    </div>
  );
}
