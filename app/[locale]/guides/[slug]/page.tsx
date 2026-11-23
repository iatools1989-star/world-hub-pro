import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdSenseBanner from '@/components/AdSenseBanner';
import JsonLd from '@/components/JsonLd';
import { GUIDES } from '@/lib/guidesContent';
import { canonical, breadcrumbs, publisher, authorEntity } from '@/lib/seo';

export function generateStaticParams() {
  return Object.keys(GUIDES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const g = GUIDES[slug];
  if (!g) return {};
  return {
    title: g.metaTitle,
    description: g.metaDescription,
    keywords: [g.keyword],
    alternates: { canonical: canonical(`/${locale}/guides/${slug}`) },
    openGraph: {
      title: g.metaTitle,
      description: g.metaDescription,
      url: canonical(`/${locale}/guides/${slug}`),
      type: 'article',
      modifiedTime: g.updated,
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const g = GUIDES[slug];
  if (!g) notFound();

  const irmas = Object.values(GUIDES).filter((x) => x.slug !== slug);

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfcfd]">
      <Header currentLocale={locale} />
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: g.title,
            description: g.metaDescription,
            datePublished: g.updated,
            dateModified: g.updated,
            inLanguage: 'en',
            author: authorEntity(),
            publisher: publisher(),
            mainEntityOfPage: canonical(`/${locale}/guides/${slug}`),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: g.faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
          breadcrumbs([
            { name: 'Home', path: `/${locale}` },
            { name: 'Guides', path: `/${locale}/guides` },
            { name: g.title, path: `/${locale}/guides/${slug}` },
          ]),
        ]}
      />

      <main className="flex-1 max-w-[760px] mx-auto w-full px-4 sm:px-6 py-8">
        <nav className="text-xs text-zinc-500 mb-4">
          <Link href={`/${locale}`} className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/${locale}/guides`} className="hover:underline">Guides</Link>
        </nav>

        <article>
          <header>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 leading-tight">
              {g.title}
            </h1>
            <p className="mt-3 text-xs text-zinc-500">
              {g.readingMinutes} min read · Last updated {g.updated} · By Silva
            </p>
          </header>

          <div className="mt-6 space-y-3 text-[15px] text-zinc-700 leading-relaxed">
            {g.intro.map((p, i) => (
              <p key={i} className={i === 0 ? 'text-base text-zinc-800' : ''}>{p}</p>
            ))}
          </div>

          <div className="my-8">
            <AdSenseBanner />
          </div>

          {g.sections.map((s, i) => (
            <section key={i} className="mt-8">
              <h2 className="text-xl font-black text-zinc-900 tracking-tight mb-3">{s.h}</h2>
              <div className="space-y-3 text-[15px] text-zinc-700 leading-relaxed">
                {s.p.map((p, j) => <p key={j}>{p}</p>)}
                {s.list && (
                  <ul className="list-disc pl-5 space-y-1.5 my-3">
                    {s.list.map((li, k) => <li key={k}>{li}</li>)}
                  </ul>
                )}
              </div>
              {s.callout && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                  <p className="text-sm text-amber-950 leading-relaxed">{s.callout}</p>
                </div>
              )}
            </section>
          ))}

          <section className="mt-10 p-5 bg-zinc-50 border border-zinc-200 rounded-2xl">
            <h2 className="text-sm font-black text-zinc-900 mb-2">What this guide does not promise</h2>
            <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-600 leading-relaxed">
              {g.limitations.map((l, i) => <li key={i}>{l}</li>)}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-black text-zinc-900 tracking-tight mb-3">Where to go next</h2>
            <ul className="space-y-2">
              {g.related.map((r) => (
                <li key={r.href} className="p-4 bg-white border border-zinc-200 rounded-2xl">
                  <Link href={r.href} className="font-bold text-sm text-zinc-900 underline">{r.name}</Link>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">{r.why}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-black text-zinc-900 tracking-tight mb-3">Questions people ask</h2>
            <div className="space-y-2">
              {g.faqs.map((f, i) => (
                <details key={i} className="bg-white border border-zinc-200 rounded-2xl p-4 group">
                  <summary className="font-bold text-sm text-zinc-900 cursor-pointer list-none flex justify-between gap-3">
                    <span>{f.q}</span>
                    <span className="text-zinc-400 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="text-sm text-zinc-600 mt-2 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <p className="mt-8 text-xs text-zinc-500 leading-relaxed">
            Written by Silva. No affiliate ID is attached to any link on this page.{' '}
            <Link href={`/${locale}/affiliate-disclosure`} className="underline">Full disclosure</Link>.
          </p>
        </article>

        <section className="mt-10 pt-6 border-t border-zinc-200">
          <h2 className="text-sm font-black uppercase tracking-wider text-zinc-500 mb-3">Other guides</h2>
          <ul className="space-y-2">
            {irmas.map((o) => (
              <li key={o.slug}>
                <Link href={`/${locale}/guides/${o.slug}`} className="text-sm font-bold text-zinc-900 underline">
                  {o.title}
                </Link>
                <span className="text-xs text-zinc-500"> · {o.readingMinutes} min</span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer currentLocale={locale} />
    </div>
  );
}
