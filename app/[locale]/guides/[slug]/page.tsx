import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdSenseBanner from '@/components/AdSenseBanner';
import JsonLd from '@/components/JsonLd';
import { GUIDES } from '@/lib/guidesContent';
import { overridesDe, aplicarPatch } from '@/lib/cms/overrides';
import { guiasCriados, lerCriados } from '@/lib/cms/criados';
import { canonical, breadcrumbs, publisher, authorEntity } from '@/lib/seo';

export function generateStaticParams() {
  // Inclui os guias escritos pelo CMS: sem isto a pagina nova existiria no
  // editor mas nao seria gerada no build, e o link cairia em 404.
  return [...Object.keys(GUIDES), ...guiasCriados().map((g) => g.slug)].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const bruto = lerCriados().guide?.[slug] ?? GUIDES[slug];
  if (!bruto) return {};
  const g = aplicarPatch(bruto, overridesDe('guide', slug))!;
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
  const bruto = lerCriados().guide?.[slug] ?? GUIDES[slug];
  if (!bruto) notFound();
  const g = aplicarPatch(bruto, overridesDe('guide', slug))!;

  const irmas = [...guiasCriados(), ...Object.values(GUIDES)].filter((x) => x.slug !== slug);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-canvas)]">
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

      <main className="flex-1 max-w-[720px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-9 sm:py-12">
        <nav className="text-xs text-[var(--color-ink-muted)] mb-4">
          <Link href={`/${locale}`} className="inline-flex min-h-6 items-center hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/${locale}/guides`} className="inline-flex min-h-6 items-center hover:underline">Guides</Link>
        </nav>

        <article>
          <header>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--color-ink)] leading-tight">
              {g.title}
            </h1>
            <p className="mt-3 text-xs text-[var(--color-ink-muted)]">
              {g.readingMinutes} min read · Last updated {g.updated} · By Silva
            </p>
          </header>

          <div className="mt-6 space-y-3 text-[15px] text-[var(--color-ink-soft)] leading-relaxed">
            {g.intro.map((p, i) => (
              <p key={i} className={i === 0 ? 'text-base text-[var(--color-ink)]' : ''}>{p}</p>
            ))}
          </div>

          <div className="my-8">
            <AdSenseBanner />
          </div>

          {g.sections.map((s, i) => (
            <section key={i} className="mt-8">
              <h2 className="text-xl font-black text-[var(--color-ink)] tracking-tight mb-3">{s.h}</h2>
              <div className="space-y-3 text-[15px] text-[var(--color-ink-soft)] leading-relaxed">
                {s.p.map((p, j) => <p key={j}>{p}</p>)}
                {s.list && (
                  <ul className="list-disc pl-5 space-y-1.5 my-3">
                    {s.list.map((li, k) => <li key={k}>{li}</li>)}
                  </ul>
                )}
              </div>
              {s.callout && (
                <div className="mt-4 rounded-[12px] border-l-[3px] border-[var(--color-brand)] bg-[var(--color-surface-2)] p-4">
                  <p className="text-[14px] leading-relaxed text-[var(--color-ink-soft)]">{s.callout}</p>
                </div>
              )}
            </section>
          ))}

          <section className="mt-10 p-5 bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-[12px]">
            <h2 className="text-sm font-black text-[var(--color-ink)] mb-2">What this guide does not promise</h2>
            <ul className="list-disc pl-5 space-y-1 text-xs text-[var(--color-ink-muted)] leading-relaxed">
              {g.limitations.map((l, i) => <li key={i}>{l}</li>)}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-black text-[var(--color-ink)] tracking-tight mb-3">Where to go next</h2>
            <ul className="space-y-2">
              {g.related.map((r) => (
                <li key={r.href} className="p-4 bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[12px]">
                  <Link href={r.href} className="font-bold text-sm text-[var(--color-ink)] underline">{r.name}</Link>
                  <p className="text-xs text-[var(--color-ink-muted)] mt-1 leading-relaxed">{r.why}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-black text-[var(--color-ink)] tracking-tight mb-3">Questions people ask</h2>
            <div className="space-y-2">
              {g.faqs.map((f, i) => (
                <details key={i} className="bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[12px] p-4 group">
                  <summary className="font-bold text-sm text-[var(--color-ink)] cursor-pointer list-none flex justify-between gap-3">
                    <span>{f.q}</span>
                    <span className="text-[var(--color-ink-muted)] group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="text-sm text-[var(--color-ink-muted)] mt-2 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <p className="mt-8 text-xs text-[var(--color-ink-muted)] leading-relaxed">
            Written by Silva. No affiliate ID is attached to any link on this page.{' '}
            <Link href={`/${locale}/affiliate-disclosure`} className="inline-flex min-h-6 items-center underline">Full disclosure</Link>.
          </p>
        </article>

        <section className="mt-10 pt-6 border-t border-[var(--color-line)]">
          <h2 className="text-sm font-black uppercase tracking-wider text-[var(--color-ink-muted)] mb-3">Other guides</h2>
          <ul className="space-y-2">
            {irmas.map((o) => (
              <li key={o.slug}>
                <Link href={`/${locale}/guides/${o.slug}`} className="text-sm font-bold text-[var(--color-ink)] underline">
                  {o.title}
                </Link>
                <span className="text-xs text-[var(--color-ink-muted)]"> · {o.readingMinutes} min</span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer currentLocale={locale} />
    </div>
  );
}
