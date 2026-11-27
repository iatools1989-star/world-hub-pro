import BulkStudio from "@/components/tools/BulkStudio";
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToolIcon from '@/components/ToolIcon';
import { Breadcrumbs } from '@/components/PageShell';
import AdSenseBanner from '@/components/AdSenseBanner';

// Lote 1
import QRGenerator from '@/components/tools/QRGenerator';
import PasswordGenerator from '@/components/tools/PasswordGenerator';
import WordCounter from '@/components/tools/WordCounter';

// Lote 2
import UnitConverter from '@/components/tools/UnitConverter';
import ColorPicker from '@/components/tools/ColorPicker';
import URLShortener from '@/components/tools/URLShortener';

// Lote 3
import ImageCompressor from '@/components/tools/ImageCompressor';
import JpgToPdf from '@/components/tools/JpgToPdf';
import PdfToJpg from '@/components/tools/PdfToJpg';

// Lote 4
import AgeCalculator from '@/components/tools/AgeCalculator';
import MergePdf from '@/components/tools/MergePdf';
import CompressPdf from '@/components/tools/CompressPdf';

// Lote 5
import RemoveBg from '@/components/tools/RemoveBg';
import TextToSpeech from '@/components/tools/TextToSpeech';
import ResumeBuilder from '@/components/tools/ResumeBuilder';

import GenericToolRunner from '@/components/tools/GenericToolRunner';
import ToolVideo from '@/components/ToolVideo';
import { VIDEO_TOOLS } from '@/lib/videoTools';
import { TOOLS } from '@/lib/data';
import { TOOL_GUIDES } from '@/lib/toolContent';
import { overridesDe, aplicarPatch } from '@/lib/cms/overrides';
import { TOOL_EDITORIAL } from '@/lib/toolEditorial';
import { TOOL_OVERRIDES, mergeOverride } from '@/lib/contentOverrides';
import JsonLd from '@/components/JsonLd';
import { canonical, breadcrumbs, publisher, authorEntity } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) return {};
  const guide = aplicarPatch(TOOL_GUIDES[slug], overridesDe('toolHero', slug));
  const ed = aplicarPatch(
    mergeOverride(TOOL_EDITORIAL[slug], TOOL_OVERRIDES[slug]),
    overridesDe('tool', slug)
  );

  // Preferimos o titulo/descricao editoriais: foram escritos com limite de
  // tamanho e com a palavra-chave no inicio. O nome puro da ferramenta nao
  // diz a um buscador o que a pagina resolve.
  const title = ed ? ed.metaTitle : `${tool.name} - Free Online Browser Tool`;
  const description = ed
    ? ed.metaDescription
    : guide
      ? guide.summary
      : `${tool.desc} Fast, private, and free to use without uploading files.`;

  return {
    title,
    description,
    keywords: ed ? [ed.keyword] : undefined,
    alternates: { canonical: canonical(`/${locale}/tools/${slug}`) },
    openGraph: {
      title,
      description,
      url: canonical(`/${locale}/tools/${slug}`),
      type: 'website',
      ...(ed ? { modifiedTime: ed.updated } : {}),
    },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const tool = TOOLS.find((t) => t.slug === slug);

  if (!tool) {
    notFound();
  }

  const guide = aplicarPatch(TOOL_GUIDES[slug], overridesDe('toolHero', slug));
  const ed = aplicarPatch(
    mergeOverride(TOOL_EDITORIAL[slug], TOOL_OVERRIDES[slug]),
    overridesDe('tool', slug)
  );

  const renderToolComponent = () => {
    switch (tool.slug) {
      case 'qr-generator':
        return <QRGenerator />;
      case 'password-generator':
        return <PasswordGenerator />;
      case 'word-counter':
        return <WordCounter />;
      case 'unit-converter':
        return <UnitConverter />;
      case 'color-picker':
        return <ColorPicker />;
      case 'url-shortener':
        return <URLShortener />;
      case 'image-compressor':
        return <ImageCompressor />;
      case 'jpg-to-pdf':
        return <JpgToPdf />;
      case 'pdf-to-jpg':
        return <PdfToJpg />;
      case 'age-calculator':
        return <AgeCalculator />;
      case 'merge-pdf':
        return <MergePdf />;
      case 'compress-pdf':
        return <CompressPdf />;
      case 'remove-bg':
        return <RemoveBg />;
      case 'bulk-studio':
        return <BulkStudio />;
      case 'text-to-speech':
        return <TextToSpeech />;
      case 'resume-builder':
        return <ResumeBuilder />;
      default:
        return <GenericToolRunner name={tool.name} />;
    }
    
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentLocale={locale} />

      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: tool.name,
            description: guide ? guide.summary : tool.desc,
            url: canonical(`/${locale}/tools/${tool.slug}`),
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'Any browser',
            browserRequirements: 'Requires JavaScript',
            // Preco real: o produto e gratuito. Isto e fato, nao marketing.
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            isAccessibleForFree: true,
            publisher: publisher(),
            // Autoria identificavel: o AdSense usa este sinal ao avaliar
            // conteudo de baixo valor. Sem nome real, cai em Organization.
            author: authorEntity(),
            ...(guide ? { featureList: guide.features.map((f) => f.title) } : {}),
          },
          ...(guide
            ? [{
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: guide.faqs.map((f) => ({
                  '@type': 'Question',
                  name: f.q,
                  acceptedAnswer: { '@type': 'Answer', text: f.a },
                })),
              }]
            : []),
          breadcrumbs([
            { name: 'Home', path: `/${locale}` },
            { name: 'Tools', path: `/${locale}/tools` },
            { name: tool.name, path: `/${locale}/tools/${tool.slug}` },
          ]),
        ]}
      />

      <main className="max-w-[820px] mx-auto px-4 sm:px-6 lg:px-8 py-9 sm:py-12 w-full">
        <a href={`/${locale}#tools`} className="inline-flex min-h-6 items-center text-xs font-bold text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition">
          ← Back to All Tools
        </a>

        <Breadcrumbs itens={[{ nome: 'Home', href: `/${locale}` }, { nome: 'Tools', href: `/${locale}/tools` }, { nome: tool.name }]} />

        <div className="mt-4 bg-[var(--color-surface)] rounded-[14px] p-6 sm:p-8 border border-[var(--color-line)] shadow-sm">
          <div className="flex gap-4 items-start pb-6 border-b border-[var(--color-line)]">
            <span className="grid h-14 w-14 place-items-center rounded-[13px] border border-[var(--color-line)] bg-[var(--color-surface-2)] text-[var(--color-ink)]"><ToolIcon nome={tool.slug} className="h-7 w-7" /></span>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-ink)]">{tool.name}</h1>
              <p className="text-[var(--color-ink-muted)] mt-1 text-sm sm:text-base">{tool.desc}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="bg-[var(--color-surface-2)] text-[var(--color-ink)] border border-[var(--color-line)] px-2.5 py-1 rounded-full font-bold">
                  ✓ 100% Client-Side
                </span>
                <span className="bg-[var(--color-btn-bg)] text-[var(--color-btn-fg)] px-2.5 py-1 rounded-full font-bold">
                  Free to use
                </span>
                {/* O selo "Pro: X" saiu daqui de proposito: era um segundo caminho
                    comercial para o mesmo parceiro, sem #ad e sem rel=sponsored,
                    competindo com o CTA editorial do fim da pagina. */}

              </div>
            </div>
          </div>

          {/* Interactive Tool Runner */}
          <div className="mt-6 bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-[12px] p-4 sm:p-6">
            {renderToolComponent()}
          </div>

          {/* AdSense In-Tool Banner */}
          <AdSenseBanner />

          {/* Rich Editorial Content: Solves Thin Content for AdSense */}
          {guide && (
            <div className="mt-8 space-y-8 pt-6 border-t border-[var(--color-line)]">
              {/* Comprehensive Overview */}
              <section className="bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-[12px] p-6">
                <h2 className="text-lg font-black text-[var(--color-ink)] mb-2">
                  About {guide.title}
                </h2>
                <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
                  {guide.summary}
                </p>
              </section>

            {/* ---- Conteudo editorial (AdSense) ---- */}

            {/* Introducao: o que a ferramenta faz e por que importa */}
            <section>
              <h2 className="text-lg font-black text-[var(--color-ink)] mb-3 flex items-center gap-2">
                <span>🧭</span> What {tool.name} does
              </h2>
              {ed ? (
                <div className="space-y-3 text-sm text-[var(--color-ink-soft)] leading-relaxed max-w-prose">
                  {ed.intro.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed max-w-prose">{tool.desc}</p>
              )}
            </section>

            {/* Beneficios concretos */}
            {ed && (
              <section>
                <h2 className="text-lg font-black text-[var(--color-ink)] mb-3 flex items-center gap-2">
                  <span>✅</span> Why use this one
                </h2>
                <div className="grid sm:grid-cols-3 gap-3">
                  {ed.benefits.map((b) => (
                    <div key={b.title} className="bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-[12px] p-4">
                      <h3 className="font-bold text-sm text-[var(--color-ink)]">{b.title}</h3>
                      <p className="text-xs text-[var(--color-ink-muted)] mt-1 leading-relaxed">{b.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Limitacao honesta — o que ganha confianca com o leitor e com o revisor */}
            {ed && (
              <section>
                <h2 className="text-lg font-black text-[var(--color-ink)] mb-3 flex items-center gap-2">
                  <span>⚠️</span> When this tool is the wrong choice
                </h2>
                <div className="bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-[12px] p-4">
                  <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">{ed.notIdealFor}</p>
                </div>
              </section>
            )}

              {/* Step by Step Guide — com o video logo acima dos passos.

                  Antes o video ficava no topo da pagina, longe do texto que
                  explica cada passo. Aqui ele responde a mesma pergunta que
                  os cartoes numerados (como eu uso isto?), entao ficam juntos:
                  primeiro se assiste, depois se confere a instrucao escrita.
                  O arquivo e servido do proprio dominio — nada de player de
                  terceiro nem cookie de rastreio antes do consentimento. */}
              <section>
                <h2 className="text-lg font-black text-[var(--color-ink)] mb-1 flex items-center gap-2">
                  <span>📖</span> How to Use {tool.name}
                </h2>
                <p className="text-sm text-[var(--color-ink-muted)] mb-4">
                  Watch the {guide.steps.length} steps in action, then follow them below.
                </p>

                {VIDEO_TOOLS.includes(tool.slug) && (
                  <div className="mb-5">
                    <ToolVideo slug={tool.slug} name={tool.name} passos={guide.steps.length} />
                  </div>
                )}

                <div className="grid sm:grid-cols-3 gap-4">
                  {guide.steps.map((s) => (
                    <div key={s.step} className="bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[12px] p-4 shadow-xs">
                      <div className="w-7 h-7 rounded-full bg-zinc-900 text-yellow-400 font-bold flex items-center justify-center text-xs mb-2">
                        {s.step}
                      </div>
                      <h3 className="font-bold text-sm text-[var(--color-ink)]">{s.title}</h3>
                      <p className="text-xs text-[var(--color-ink-muted)] mt-1 leading-normal">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Key Features & Architecture */}
              <section>
                <h2 className="text-lg font-black text-[var(--color-ink)] mb-4 flex items-center gap-2">
                  <span>⚡</span> Technical Features & Privacy Architecture
                </h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {guide.features.map((f, idx) => (
                    <div key={idx} className="bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-[12px] p-4">
                      <h3 className="font-bold text-sm text-[var(--color-ink)]">{f.title}</h3>
                      <p className="text-xs text-[var(--color-ink-muted)] mt-1 leading-normal">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Structured FAQ Section */}
              <section>
                <h2 className="text-lg font-black text-[var(--color-ink)] mb-4 flex items-center gap-2">
                  <span>❓</span> Frequently Asked Questions (FAQ)
                </h2>
                <div className="space-y-3">
                  {guide.faqs.map((faq, idx) => (
                    <div key={idx} className="bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[12px] p-4">
                      <h3 className="font-bold text-sm text-[var(--color-ink)] mb-1">{faq.q}</h3>
                      <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* Bottom Pro Recommendation & Info Box */}
          <div className="mt-8 grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-[12px] p-5">
              <h3 className="font-bold text-[var(--color-ink)] mb-2">100% Client-Side Privacy Guarantee</h3>
              <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                All computational algorithms execute exclusively within your local browser memory via HTML5, Canvas, and WebAssembly APIs. 
                Your files and inputs are never transmitted, cached, or logged on remote servers.
              </p>
            </div>

            {/* Leituras relacionadas — o caminho de saida para o diretorio */}
            {ed && (
              <section>
                <h2 className="text-lg font-black text-[var(--color-ink)] mb-3 flex items-center gap-2">
                  <span>📚</span> If this tool is not the whole answer
                </h2>
                <ul className="space-y-2">
                  {ed.related.map((r) => (
                    <li key={r.href} className="p-4 bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[12px]">
                      <a href={r.href} className="font-bold text-sm text-[var(--color-ink)] underline">
                        {r.name}
                      </a>
                      <p className="text-xs text-[var(--color-ink-muted)] mt-1 leading-relaxed">{r.why}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {ed ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-[12px] p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {ed.cta.monetized ? (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-zinc-900 text-yellow-400 px-2 py-0.5 rounded">
                        #ad
                      </span>
                    ) : (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-[var(--color-line)] text-[var(--color-ink-soft)] px-2 py-0.5 rounded">
                        Official site
                      </span>
                    )}
                    {ed.cta.partner && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                        {ed.cta.partner}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-[var(--color-ink)] mb-1">When this tool is not enough</h3>
                  <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">{ed.cta.body}</p>
                </div>
                <a
                  href={ed.cta.href}
                  {...(ed.cta.monetized
                    ? { rel: 'sponsored noopener noreferrer' }
                    : { rel: 'noopener noreferrer' })}
                  className="mt-3 inline-block text-center py-2 px-4 bg-[var(--color-btn-bg)] text-[var(--color-btn-fg)] rounded-full font-bold text-xs hover:opacity-90 transition"
                >
                  {ed.cta.label} →
                </a>
                <p className="text-[10px] text-[var(--color-ink-muted)] mt-2 leading-snug">
                  {ed.cta.monetized ? (
                    <>
                      Affiliate link. We may earn a commission at no extra cost to you.{' '}
                      <a href={`/${locale}/affiliate-disclosure`} className="inline-flex min-h-6 items-center underline">
                        Full disclosure
                      </a>
                      .
                    </>
                  ) : (
                    <>
                      Direct link to the official site. We earn nothing from this click.{' '}
                      <a href={`/${locale}/affiliate-disclosure`} className="inline-flex min-h-6 items-center underline">
                        Why we say this
                      </a>
                      .
                    </>
                  )}
                </p>
              </div>
            ) : (
              <div className="bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-[12px] p-5">
                <h3 className="font-bold text-[var(--color-ink)] mb-1">Other free tools</h3>
                <p className="text-xs text-[var(--color-ink-muted)] mb-3">
                  Sixteen browser utilities, all free, all processed locally.
                </p>
                <a
                  href={`/${locale}/tools`}
                  className="inline-block text-center py-2 px-4 bg-[var(--color-btn-bg)] text-[var(--color-btn-fg)] rounded-full font-bold text-xs hover:opacity-90 transition"
                >
                  Browse all tools →
                </a>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer currentLocale={locale} />
    </div>
  );
}
