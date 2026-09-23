import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolved = await params;
  const locale = resolved.locale || 'en';

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentLocale={locale} />
      <main className="max-w-[800px] mx-auto px-4 py-12 flex-1">
        <h1 className="text-3xl font-black mb-4">About World Tools Hub</h1>
        <div className="prose text-zinc-700 space-y-4 text-sm leading-relaxed">
          <p>
            World Tools Hub is built on a simple premise: everyday tools should be fast, completely free, and strictly private.
          </p>
          <p>
            Unlike legacy conversion websites that upload your personal documents and media to third-party cloud servers, our utility tools run directly within your browser’s local sandbox using modern Web APIs and WebAssembly.
          </p>
          <p>
            We also curate and benchmark top artificial intelligence tools to empower developers, writers, designers, and marketers around the globe in 12 languages.
          </p>
        </div>
      </main>
      <Footer currentLocale={locale} />
    </div>
  );
}
