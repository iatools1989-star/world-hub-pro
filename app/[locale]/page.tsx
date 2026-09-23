import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdSenseBanner from '@/components/AdSenseBanner';
import { TOOLS, DIRECTORY_ITEMS } from '@/lib/data';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const currentLocale = resolvedParams.locale || 'en';

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentLocale={currentLocale} />

      {/* Hero Section */}
      <section className="bg-zinc-950 text-white py-16 px-4 sm:px-6">
        <div className="max-w-[1280px] mx-auto text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-zinc-800/80 border border-zinc-700 px-3.5 py-1.5 rounded-full text-xs font-semibold text-zinc-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            100% Free • No Sign-up • Privacy First
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl leading-[1.1]">
            Fast Browser Tools & Curated <span className="text-yellow-400">AI Directory</span>
          </h1>

          <p className="mt-5 text-lg text-zinc-400 max-w-2xl leading-relaxed">
            Perform daily PDF, text, and media tasks right inside your web browser. No uploads to foreign servers, zero data storage, entirely private.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
            <a
              href="#tools"
              className="px-6 py-3.5 rounded-full bg-yellow-400 text-zinc-950 font-bold hover:bg-yellow-300 transition shadow-lg shadow-yellow-400/20"
            >
              Explore Free Tools ↓
            </a>
            <a
              href="#directory"
              className="px-6 py-3.5 rounded-full bg-zinc-800 border border-zinc-700 text-white font-bold hover:bg-zinc-700 transition"
            >
              Discover AI Directory →
            </a>
          </div>
        </div>
      </section>

      {/* Banner AdSense Top */}
      <div className="max-w-[1280px] mx-auto px-4 w-full">
        <AdSenseBanner />
      </div>

      {/* Tools Section */}
      <section id="tools" className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
              <span>🔧</span> Free Tools
              <span className="text-sm font-semibold bg-zinc-200 text-zinc-700 px-2.5 py-0.5 rounded-full">
                {TOOLS.length} Ready
              </span>
            </h2>
            <p className="text-zinc-600 mt-1">Runs entirely client-side. Your files never leave your device.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${currentLocale}/tools/${tool.slug}`}
              className="bg-white border border-zinc-200 rounded-2xl p-5 hover:border-zinc-900 hover:shadow-xl transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2 bg-zinc-50 rounded-xl border border-zinc-100 group-hover:scale-110 transition-transform">
                    {tool.icon}
                  </span>
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider bg-zinc-100 px-2 py-0.5 rounded-md">
                    {tool.category}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-zinc-900 group-hover:text-yellow-600 transition">
                  {tool.name}
                </h3>
                <p className="text-sm text-zinc-600 mt-1 line-clamp-2">
                  {tool.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-900 group-hover:underline">Use Tool →</span>
                {tool.featured && (
                  <span className="text-zinc-500 font-medium bg-zinc-50 px-2 py-0.5 rounded border border-zinc-200">
                    Pro: {tool.featured}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Directory Section */}
      <section id="directory" className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
              <span>📚</span> Curated AI Directory
              <span className="text-sm font-semibold bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded-full">
                Ranked & Reviewed
              </span>
            </h2>
            <p className="text-zinc-600 mt-1">We analyze and review top-tier AI software so you save time and budget.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DIRECTORY_ITEMS.map((item) => (
            <Link
              key={item.slug}
              href={`/${currentLocale}/directory/${item.slug}`}
              className="bg-white border border-zinc-200 rounded-2xl p-5 hover:border-zinc-900 hover:shadow-xl transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2 bg-zinc-50 rounded-xl border border-zinc-100 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <div className="flex gap-1.5">
                    {item.badge && (
                      <span className="text-[11px] font-black bg-yellow-400 text-zinc-950 px-2 py-0.5 rounded-md">
                        {item.badge}
                      </span>
                    )}
                    <span className="text-[11px] font-bold bg-zinc-900 text-white px-2 py-0.5 rounded-md">
                      {item.pricing}
                    </span>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-zinc-900 group-hover:text-yellow-600 transition">
                  {item.name}
                </h3>
                <p className="text-sm text-zinc-600 mt-1 line-clamp-2">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-900 group-hover:underline">Read Review →</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {item.category}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Banner AdSense Bottom */}
      <div className="max-w-[1280px] mx-auto px-4 w-full">
        <AdSenseBanner />
      </div>

      <Footer currentLocale={currentLocale} />
    </div>
  );
}
