import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToolIcon from '@/components/ToolIcon';
import { Breadcrumbs } from '@/components/PageShell';
import AdSenseBanner from '@/components/AdSenseBanner';
import { DIRECTORY_ITEMS } from '@/lib/data';
import JsonLd from '@/components/JsonLd';
import { canonical, breadcrumbs, publisher, authorEntity } from '@/lib/seo';
import { DIRECTORY_DETAILS } from '@/lib/directoryContent';
import { DIRECTORY_OVERRIDES, mergeOverride } from '@/lib/contentOverrides';
import { overridesDe, aplicarPatch } from '@/lib/cms/overrides';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const item = DIRECTORY_ITEMS.find((d) => d.slug === slug);
  if (!item) return {};

  const detail = aplicarPatch(
    mergeOverride(DIRECTORY_DETAILS[slug], DIRECTORY_OVERRIDES[slug]),
    overridesDe('directory', slug)
  );

  // Sem "Review": nao publicamos nota nem teste proprio, e anunciar
  // "review" sem review e exatamente o tipo de sinal que o AdSense penaliza.
  const title = detail ? detail.metaTitle : `${item.name} - Pricing, Category & Official Link`;
  const description = detail
    ? detail.metaDescription
    : `${item.desc} Pricing model: ${item.pricing}. Direct link to the official site, with our disclosure stated up front.`;

  return {
    title,
    description,
    alternates: { canonical: canonical(`/${locale}/directory/${slug}`) },
    openGraph: {
      title,
      description,
      url: canonical(`/${locale}/directory/${slug}`),
      type: 'website',
      ...(detail ? { modifiedTime: detail.updated } : {}),
    },
  };
}

export default async function DirectoryPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const item = DIRECTORY_ITEMS.find((d) => d.slug === slug);

  if (!item) {
    notFound();
  }

  // O painel escreve em DIRECTORY_OVERRIDES; o conteudo escrito a mao continua
  // sendo a base. Sem override, nada muda.
  const detail = aplicarPatch(
    mergeOverride(DIRECTORY_DETAILS[slug], DIRECTORY_OVERRIDES[slug]),
    overridesDe('directory', slug)
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentLocale={locale} />

      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: item.name,
            description: item.desc,
            applicationCategory: item.category,
            operatingSystem: 'Web',
            publisher: publisher(),
            // Autoria identificavel: o AdSense usa este sinal ao avaliar
            // conteudo de baixo valor. Sem nome real, cai em Organization.
            author: authorEntity(),
            // Preco NAO e inventado: usamos o modelo cadastrado, sem valor falso.
            ...(item.pricing === 'Free'
              ? { offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, isAccessibleForFree: true }
              : {}),
          },
          breadcrumbs([
            { name: 'Home', path: `/${locale}` },
            { name: 'Directory', path: `/${locale}/directory` },
            { name: item.name, path: `/${locale}/directory/${item.slug}` },
          ]),
          ...(detail
            ? [
                {
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: detail.faqs.map((f) => ({
                    '@type': 'Question',
                    name: f.q,
                    acceptedAnswer: { '@type': 'Answer', text: f.a },
                  })),
                },
              ]
            : []),
        ]}
      />

      <main className="max-w-[820px] mx-auto px-4 sm:px-6 lg:px-8 py-9 sm:py-12 w-full">

        <Breadcrumbs itens={[{ nome: 'Home', href: `/${locale}` }, { nome: 'AI Directory', href: `/${locale}/directory` }, { nome: item.name }]} />

        <div className="mt-4 bg-[var(--color-surface)] rounded-[14px] p-6 sm:p-8 border border-[var(--color-line)] shadow-sm">
          <div className="flex gap-4 items-start pb-6 border-b border-[var(--color-line)]">
            <span className="grid h-14 w-14 place-items-center rounded-[13px] border border-[var(--color-line)] bg-[var(--color-surface-2)] text-[var(--color-ink)]"><ToolIcon nome={item.slug} className="h-7 w-7" /></span>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-ink)]">{item.name}</h1>
              <p className="text-[var(--color-ink-muted)] mt-1 text-sm sm:text-base">{item.desc}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="bg-zinc-900 text-white px-2.5 py-1 rounded-full font-bold">
                  {item.pricing}
                </span>
                <span className="bg-zinc-100 border border-[var(--color-line)] text-[var(--color-ink-soft)] px-2.5 py-1 rounded-full font-bold">
                  {item.category}
                </span>
                {detail && (
                  <span className="bg-zinc-100 border border-[var(--color-line)] text-[var(--color-ink-muted)] px-2.5 py-1 rounded-full">
                    Prices checked {detail.updated}
                  </span>
                )}
                {item.badge && (
                  <span className="bg-yellow-400 text-zinc-950 px-2.5 py-1 rounded-full font-black">
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-[1.5fr_1fr] gap-4">
            <div className="bg-zinc-950 text-white rounded-[12px] p-6 flex flex-col justify-between">
              <div>
                <h2 className="font-black text-xl mb-1">Visit {item.name}</h2>
                <p className="text-zinc-400 text-xs">
                  Straight to the official site. No affiliate ID is attached to this link, so we earn nothing
                  from your click — the recommendation above is the only thing we are offering.
                </p>
              </div>
              <a
                href={`/go/${item.slug}`}
                rel="noopener noreferrer"
                className="mt-5 inline-block text-center bg-yellow-400 text-zinc-950 font-black py-3 px-6 rounded-full hover:bg-yellow-300 transition text-sm shadow-md"
              >
                Visit Official Website ↗
              </a>
            </div>

            <div className="bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-[12px] p-6">
              <h3 className="font-bold text-[var(--color-ink)] mb-1">How this page is funded</h3>
              <p className="text-[var(--color-ink-muted)] text-xs leading-relaxed">
                Display advertising and nothing else. We do not sell rankings or placements, and we do not
                accept payment to make a listing look better — which is why these pages disagree with the
                marketing copy on the vendors’ own sites.
              </p>
              <a
                href={`/${locale}/affiliate-disclosure`}
                className="mt-3 inline-flex min-h-6 items-center text-xs font-bold text-[var(--color-ink)] underline"
              >
                Read the full disclosure
              </a>
            </div>
          </div>

          {/* AdSense In-Review */}
          <AdSenseBanner />

          {/* ---- Conteudo editorial ---- */}
          {detail && (
            <div className="mt-8 space-y-8 pt-6 border-t border-[var(--color-line)]">
              {/* Introducao */}
              <section>
                <h2 className="text-lg font-black text-[var(--color-ink)] mb-3">
                  What {item.name} is, in plain terms
                </h2>
                <div className="space-y-3 text-sm text-[var(--color-ink-soft)] leading-relaxed max-w-prose">
                  {detail.intro.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>

              {/* O que faz */}
              <section>
                <h2 className="text-lg font-black text-[var(--color-ink)] mb-3">What you actually get</h2>
                <div className="space-y-3 text-sm text-[var(--color-ink-soft)] leading-relaxed max-w-prose">
                  {detail.whatItDoes.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>

              {/* Tabela de precos */}
              <section>
                <h2 className="text-lg font-black text-[var(--color-ink)] mb-1">{detail.pricingHeading}</h2>
                <p className="text-xs text-[var(--color-ink-muted)] mb-3">
                  Published prices, checked {detail.updated}. SaaS pricing moves — confirm on the vendor’s page
                  before you commit.
                </p>
                <div className="overflow-x-auto -mx-1 px-1">
                  <table className="w-full text-xs sm:text-sm border-collapse min-w-[520px]">
                    <thead>
                      <tr className="text-left text-[var(--color-ink-muted)] uppercase tracking-wide text-[10px]">
                        <th className="py-2 pr-3 font-bold border-b border-[var(--color-line)]">Plan</th>
                        <th className="py-2 pr-3 font-bold border-b border-[var(--color-line)]">Price</th>
                        <th className="py-2 font-bold border-b border-[var(--color-line)]">What is included</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.pricingRows.map((row) => (
                        <tr key={row.plan} className="align-top">
                          <td className="py-2.5 pr-3 font-bold text-[var(--color-ink)] border-b border-[var(--color-line)] whitespace-nowrap">
                            {row.plan}
                          </td>
                          <td className="py-2.5 pr-3 text-[var(--color-ink)] border-b border-[var(--color-line)] whitespace-nowrap">
                            {row.price}
                          </td>
                          <td className="py-2.5 text-[var(--color-ink-muted)] border-b border-[var(--color-line)] leading-relaxed">
                            {row.includes}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 space-y-2 text-sm text-[var(--color-ink-soft)] leading-relaxed max-w-prose">
                  {detail.pricingNotes.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>

              {/* Pros e contras */}
              <section>
                <h2 className="text-lg font-black text-[var(--color-ink)] mb-3">What it is good at, and what it is not</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-5 bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-[12px]">
                    <h3 className="font-black text-emerald-900 text-sm mb-3">Worth paying for</h3>
                    <ul className="space-y-2 text-xs text-emerald-950 leading-relaxed">
                      {detail.pros.map((pro, idx) => (
                        <li key={idx} className="flex gap-2 items-start">
                          <span className="font-bold text-emerald-600">+</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-5 bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-[12px]">
                    <h3 className="font-black text-rose-900 text-sm mb-3">Reasons not to buy</h3>
                    <ul className="space-y-2 text-xs text-rose-950 leading-relaxed">
                      {detail.cons.map((con, idx) => (
                        <li key={idx} className="flex gap-2 items-start">
                          <span className="font-bold text-rose-600">−</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Quem deve e quem nao deve comprar */}
              <section>
                <h2 className="text-lg font-black text-[var(--color-ink)] mb-3">Who should buy it, and who should not</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-5 bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-[12px]">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-ink-muted)] mb-2">Buy it if</h3>
                    <p className="text-sm text-zinc-800 leading-relaxed">{detail.bestFor}</p>
                  </div>
                  <div className="p-5 bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-[12px]">
                    <h3 className="text-xs font-black uppercase tracking-wider text-amber-700 mb-2">
                      Do not buy it if
                    </h3>
                    <p className="text-sm text-zinc-800 leading-relaxed">{detail.notFor}</p>
                  </div>
                </div>
              </section>

              {/* Alternativas */}
              <section>
                <h2 className="text-lg font-black text-[var(--color-ink)] mb-3">What to look at instead</h2>
                <ul className="space-y-3">
                  {detail.alternatives.map((alt) => (
                    <li key={alt.href} className="p-4 bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[12px]">
                      <a href={alt.href} className="font-bold text-sm text-[var(--color-ink)] underline">
                        {alt.name}
                      </a>
                      <p className="text-xs text-[var(--color-ink-muted)] mt-1 leading-relaxed">{alt.why}</p>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Veredito */}
              <section>
                <h2 className="text-lg font-black text-[var(--color-ink)] mb-3">The honest conclusion</h2>
                <div className="p-5 bg-zinc-950 text-zinc-100 rounded-[12px]">
                  <div className="space-y-3 text-sm leading-relaxed">
                    {detail.verdict.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              </section>

              {/* FAQ */}
              <section>
                <h2 className="text-lg font-black text-[var(--color-ink)] mb-3">Questions people actually ask</h2>
                <div className="space-y-2">
                  {detail.faqs.map((f, i) => (
                    <details key={i} className="bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-[12px] p-4 group">
                      <summary className="font-bold text-sm text-[var(--color-ink)] cursor-pointer list-none flex justify-between gap-3">
                        <span>{f.q}</span>
                        <span className="text-zinc-400 group-open:rotate-45 transition-transform">+</span>
                      </summary>
                      <p className="text-sm text-[var(--color-ink-muted)] mt-2 leading-relaxed">{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>

              <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                Prices and limits on this page were checked against public sources on {detail.updated}. We do
                not test these products hands-on, so nothing here is a lab result — it is a careful reading of
                what the vendors publish, plus where the published numbers tend to mislead.{' '}
                <a href={`/${locale}/affiliate-disclosure`} className="inline-flex min-h-6 items-center underline">How we work</a>.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer currentLocale={locale} />
    </div>
  );
}
