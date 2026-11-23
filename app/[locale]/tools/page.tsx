import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdSenseBanner from '@/components/AdSenseBanner';
import { TOOLS, ADSENSE_CONFIG } from '@/lib/data';

const BASE = 'https://iatools.online';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const url = `${BASE}/${locale}/tools`;
  return {
    title: 'All Free Browser Tools — 16 Utilities, No Upload, No Account',
    description:
      'Every tool on World Tools Hub in one page: PDF, image, text, security and calculator utilities. All 16 run entirely in your browser — nothing is uploaded to a server.',
    alternates: { canonical: url },
  };
}

export default async function ToolsIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const categorias = Array.from(new Set(TOOLS.map((t) => t.category))).sort();

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfcfd] dark:bg-zinc-950">
      <Header currentLocale={locale} />

      <main className="flex-1 max-w-[1100px] mx-auto w-full px-4 sm:px-6 py-10">
        <nav className="text-xs text-zinc-500 mb-4">
          <Link href={`/${locale}`} className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-900 dark:text-zinc-300 font-semibold">Tools</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
          All 16 free browser tools
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          Every utility below runs inside your browser using HTML5, Canvas and WebAssembly.
          Your files are never uploaded, cached or logged — there is no server to send them to.
          No account, no daily limit, no watermark.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {categorias.map((c) => (
            <a
              key={c}
              href={`#${c.toLowerCase()}`}
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-900 dark:hover:border-zinc-600 transition"
            >
              {c}
            </a>
          ))}
        </div>

        <div className="my-8">
          <AdSenseBanner slotId={ADSENSE_CONFIG.slotTools} />
        </div>

        {categorias.map((cat) => {
          const itens = TOOLS.filter((t) => t.category === cat);
          return (
            <section key={cat} id={cat.toLowerCase()} className="mb-10 scroll-mt-24">
              <h2 className="text-lg font-black text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                {cat}
                <span className="text-xs font-bold text-zinc-400">({itens.length})</span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {itens.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/${locale}/tools/${tool.slug}`}
                    className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 hover:shadow-xl hover:border-zinc-900 dark:hover:border-zinc-600 transition flex flex-col"
                  >
                    <div className="text-2xl mb-2">{tool.icon}</div>
                    <h3 className="font-bold text-zinc-900 dark:text-white group-hover:underline text-sm">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed flex-1">
                      {tool.desc}
                    </p>
                    <span className="mt-3 text-xs font-bold text-yellow-600 dark:text-yellow-400">
                      Open tool →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <section className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
          <h2 className="font-bold text-zinc-900 dark:text-white mb-2">Looking for AI services instead?</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            These 16 tools are utilities we built and run ourselves. If you need AI writing, image or voice
            services, we keep a separate directory of{' '}
            <Link href={`/${locale}/directory`} className="font-bold text-yellow-600 dark:text-yellow-400 hover:underline">
              commercial AI tools
            </Link>{' '}
            — with the pricing model of each one stated up front.
          </p>
        </section>
      </main>

      <Footer currentLocale={locale} />
    </div>
  );
}
