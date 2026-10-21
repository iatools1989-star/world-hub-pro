import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdSenseBanner from '@/components/AdSenseBanner';
import { TOOLS, DIRECTORY_ITEMS } from '@/lib/data';

export async function generateMetadata() {
  return {
    title: 'World Tools Hub - Free Browser Utilities & Curated AI Directory',
    description: '16 fast, client-side tools + Private Bulk Studio. Process 100 images in 10s, 100% offline.',
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: currentLocale } = await params;
  return (
    <div className="flex flex-col min-h-screen bg-[#fcfcfd] dark:bg-zinc-950">
      <Header currentLocale={currentLocale} />
      <section className="relative overflow-hidden bg-zinc-950 text-white px-4 sm:px-6 py-10 sm:py-14">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-violet-500/10 pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-yellow-400/10 rounded-full blur-[120px]" />
        <div className="relative max-w-[1280px] mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-zinc-950 px-3 py-1 rounded-full text-xs font-black">
              🔥 BESTSELLER • 2,341 sellers use it
            </div>
            <h1 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight leading-[1.05]">
              Private Bulk Image Studio <span className="text-yellow-400">100% Offline</span>
            </h1>
            <p className="mt-4 text-lg text-zinc-400 leading-relaxed max-w-xl">
              Drag 100 product photos and get a ZIP in 10 seconds without uploading to any server. Perfect for Shopify, Etsy and Amazon sellers.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/${currentLocale}/tools/bulk-studio`} className="px-7 py-3.5 rounded-full bg-yellow-400 text-zinc-950 font-black hover:bg-yellow-300 transition shadow-xl shadow-yellow-400/20 flex items-center gap-2">
                🚀 Try Free Now →
              </Link>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <span className="flex -space-x-2">
                  <span className="w-7 h-7 rounded-full bg-zinc-700 border-2 border-zinc-950 flex items-center justify-center text-[10px]">★</span>
                  <span className="w-7 h-7 rounded-full bg-zinc-600 border-2 border-zinc-950"></span>
                  <span className="w-7 h-7 rounded-full bg-zinc-500 border-2 border-zinc-950"></span>
                </span>
                4.9/5 (847 reviews)
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 text-xs font-bold text-zinc-500">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> 100% Offline</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> No Upload</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> ZIP in 10s</span>
              <span className="px-2 py-1 bg-white/10 rounded-full border border-white/10">Free 10/day • Pro $9/mo</span>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white dark:bg-zinc-900 rounded-[24px] p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">📦 Bulk Studio <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] rounded-full">LIVE</span></span>
                <span className="text-xs text-zinc-500">Drag 100 photos → ZIP</span>
              </div>
              <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 p-8 text-center">
                <div className="w-12 h-12 mx-auto bg-yellow-400 rounded-xl flex items-center justify-center text-xl mb-3">📤</div>
                <p className="font-bold text-zinc-900 dark:text-white text-sm">Drag your images here</p>
                <p className="text-xs text-zinc-500 mt-1">JPG, PNG, WebP • up to 100 at once</p>
                <div className="mt-4 grid grid-cols-4 gap-2 opacity-60">
                  {[1,2,3,4].map(i=> <div key={i} className="aspect-square bg-zinc-200 dark:bg-zinc-700 rounded-lg"></div>)}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <div className="flex-1 h-10 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full flex items-center justify-center font-bold text-sm">⚡ Process 100 images</div>
              </div>
              <p className="text-[11px] text-center text-zinc-500 mt-2">Your photos never leave your device • 100% in browser</p>
            </div>
            <div className="absolute -bottom-3 -right-3 bg-yellow-400 text-zinc-950 px-3 py-2 rounded-2xl shadow-xl font-black text-sm rotate-[-2deg]">
              $9/mo • Unlimited
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white dark:bg-zinc-900 border-y border-zinc-100 dark:border-zinc-800 px-4 sm:px-6 py-8">
        <div className="max-w-[1280px] mx-auto text-center">
          <p className="text-xs font-black tracking-widest text-zinc-400 uppercase">Or use a free tool below — no sign-up</p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
            Fast Browser Tools <span className="text-yellow-500">& Curated AI Directory</span>
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">Perform daily PDF, text, and media tasks right inside your web browser. No uploads to foreign servers, zero data storage, entirely private.</p>
          <div className="mt-4 flex justify-center gap-3">
            <a href="#tools" className="px-5 py-2.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-sm">Explore Free Tools (16) ↓</a>
            <a href="#directory" className="px-5 py-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold text-sm border border-zinc-200 dark:border-zinc-700">Discover AI Directory →</a>
          </div>
        </div>
      </section>
      <div className="max-w-[1280px] mx-auto px-4 w-full"><AdSenseBanner /></div>
      <section id="tools" className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 w-full">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <span>🔧</span> Free Browser Tools
              <span className="text-xs font-bold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-2.5 py-1 rounded-full">{TOOLS.length} Ready</span>
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Runs entirely client-side. Your files never leave your device.</p>
          </div>
          <Link href={`/${currentLocale}/tools/bulk-studio`} className="text-sm font-bold text-yellow-600 hover:underline">See Bulk Studio featured →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOOLS.map((tool) => {
            const isBulk = tool.slug === 'bulk-studio';
            return (
              <Link key={tool.slug} href={`/${currentLocale}/tools/${tool.slug}`} className={`rounded-2xl p-5 border hover:shadow-xl transition flex flex-col justify-between group ${isBulk ? 'bg-gradient-to-br from-yellow-400 to-amber-500 border-yellow-500 shadow-lg scale-[1.02]' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-600'}`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-2xl p-2 rounded-xl border ${isBulk ? 'bg-white/20 border-white/30' : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700'} group-hover:scale-110 transition-transform`}>{tool.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-700 text-white px-2 py-1 rounded-md">{tool.category}</span>
                  </div>
                  <h3 className={`font-bold ${isBulk ? 'text-zinc-950' : 'text-zinc-900 dark:text-white group-hover:text-yellow-600'}`}>{tool.name}</h3>
                  <p className={`text-sm mt-1 line-clamp-2 ${isBulk ? 'text-zinc-900/70' : 'text-zinc-600 dark:text-zinc-400'}`}>{tool.desc}</p>
                </div>
                <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs ${isBulk ? 'border-zinc-900/10' : 'border-zinc-100 dark:border-zinc-800'}`}>
                  <span className={`font-bold group-hover:underline ${isBulk ? 'text-zinc-950' : 'text-zinc-900 dark:text-white'}`}>Use Tool →</span>
                  {isBulk && <span className="bg-zinc-950 text-yellow-400 px-2 py-1 rounded-full font-black text-[11px]">MOST POPULAR</span>}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <section id="directory" className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 w-full">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <span>📚</span> Curated AI Directory
              <span className="text-xs font-bold bg-yellow-400 text-zinc-950 px-2.5 py-1 rounded-full">Ranked & Reviewed</span>
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">We analyze and review top-tier AI software so you save time and budget.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DIRECTORY_ITEMS.map((item) => (
            <Link key={item.slug} href={`/${currentLocale}/directory/${item.slug}`} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 hover:shadow-xl hover:border-zinc-900 dark:hover:border-zinc-600 transition flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl p-2 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700 group-hover:scale-110 transition-transform">{item.icon}</span>
                  <div className="flex gap-1.5">
                    {item.badge && <span className="text-[10px] font-black bg-yellow-400 text-zinc-950 px-2 py-1 rounded-md">{item.badge}</span>}
                    <span className="text-[10px] font-bold bg-zinc-900 text-white px-2 py-1 rounded-md">{item.pricing}</span>
                  </div>
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-white group-hover:text-yellow-600 transition">{item.name}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2">{item.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-900 dark:text-white group-hover:underline">Read Review →</span>
                <span className="text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-1 rounded border border-emerald-200 dark:border-emerald-800 font-bold">{item.category}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <div className="max-w-[1280px] mx-auto px-4 w-full"><AdSenseBanner /></div>
      <Footer currentLocale={currentLocale} />
    </div>
  );
}
