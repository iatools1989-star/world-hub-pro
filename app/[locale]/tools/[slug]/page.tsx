import BulkStudio from "@/components/tools/BulkStudio";
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
import { TOOLS } from '@/lib/data';
import { TOOL_GUIDES } from '@/lib/toolContent';

export const dynamicParams = false;

export function generateStaticParams() {
  return TOOLS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) return {};
  const guide = TOOL_GUIDES[slug];
  return {
    title: `${tool.name} - Free Online Browser Tool | World Tools Hub`,
    description: guide ? guide.summary : `${tool.desc} Fast, private and free forever without uploading files.`,
  };
}

export default async function ToolPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const tool = TOOLS.find((t) => t.slug === slug);

  if (!tool) {
    notFound();
  }

  const guide = TOOL_GUIDES[slug];

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

      <main className="max-w-[960px] mx-auto px-4 sm:px-6 py-8 w-full">
        <a href={`/${locale}#tools`} className="text-xs font-bold text-zinc-500 hover:text-zinc-900 transition">
          ← Back to All Tools
        </a>

        <div className="mt-4 bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm">
          <div className="flex gap-4 items-start pb-6 border-b border-zinc-100">
            <span className="text-5xl">{tool.icon}</span>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-900">{tool.name}</h1>
              <p className="text-zinc-600 mt-1 text-sm sm:text-base">{tool.desc}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
                  ✓ 100% Client-Side
                </span>
                <span className="bg-zinc-900 text-white px-2.5 py-1 rounded-full font-bold">
                  Free Forever
                </span>
                {tool.featured && (
                  <a
                    href={`/go/${tool.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-yellow-400 text-zinc-950 font-bold px-2.5 py-1 rounded-full hover:bg-yellow-300 transition"
                  >
                    Pro: {tool.featured} ↗
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Tool Runner */}
          <div className="mt-6 bg-zinc-50 border border-zinc-200 rounded-2xl p-4 sm:p-6">
            {renderToolComponent()}
          </div>

          {/* AdSense In-Tool Banner */}
          <AdSenseBanner />

          {/* Rich Editorial Content: Solves Thin Content for AdSense */}
          {guide && (
            <div className="mt-8 space-y-8 pt-6 border-t border-zinc-100">
              {/* Comprehensive Overview */}
              <section className="bg-zinc-50/70 border border-zinc-200 rounded-2xl p-6">
                <h2 className="text-lg font-black text-zinc-900 mb-2">
                  About {guide.title}
                </h2>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  {guide.summary}
                </p>
              </section>

              {/* Step by Step Guide */}
              <section>
                <h2 className="text-lg font-black text-zinc-900 mb-4 flex items-center gap-2">
                  <span>📖</span> How to Use {tool.name}
                </h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {guide.steps.map((s) => (
                    <div key={s.step} className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs">
                      <div className="w-7 h-7 rounded-full bg-zinc-900 text-yellow-400 font-bold flex items-center justify-center text-xs mb-2">
                        {s.step}
                      </div>
                      <h3 className="font-bold text-sm text-zinc-900">{s.title}</h3>
                      <p className="text-xs text-zinc-600 mt-1 leading-normal">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Key Features & Architecture */}
              <section>
                <h2 className="text-lg font-black text-zinc-900 mb-4 flex items-center gap-2">
                  <span>⚡</span> Technical Features & Privacy Architecture
                </h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {guide.features.map((f, idx) => (
                    <div key={idx} className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4">
                      <h3 className="font-bold text-sm text-zinc-900">{f.title}</h3>
                      <p className="text-xs text-zinc-600 mt-1 leading-normal">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Structured FAQ Section */}
              <section>
                <h2 className="text-lg font-black text-zinc-900 mb-4 flex items-center gap-2">
                  <span>❓</span> Frequently Asked Questions (FAQ)
                </h2>
                <div className="space-y-3">
                  {guide.faqs.map((faq, idx) => (
                    <div key={idx} className="bg-white border border-zinc-200 rounded-2xl p-4">
                      <h3 className="font-bold text-sm text-zinc-900 mb-1">{faq.q}</h3>
                      <p className="text-xs text-zinc-600 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* Bottom Pro Recommendation & Info Box */}
          <div className="mt-8 grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5">
              <h3 className="font-bold text-zinc-900 mb-2">100% Client-Side Privacy Guarantee</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                All computational algorithms execute exclusively within your local browser memory via HTML5, Canvas, and WebAssembly APIs. 
                Your files and inputs are never transmitted, cached, or logged on remote servers.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-zinc-900 mb-1">Need Enterprise Batch Processing?</h3>
                <p className="text-xs text-zinc-600">
                  Upgrade to cloud-grade automated workflows with our verified industry software partners.
                </p>
              </div>
              <a
                href={`/go/${tool.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-center py-2 px-4 bg-zinc-900 text-white rounded-full font-bold text-xs hover:bg-zinc-800 transition"
              >
                View Recommended Pro Tools →
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer currentLocale={locale} />
    </div>
  );
}
