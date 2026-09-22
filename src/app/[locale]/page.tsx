import { TOOLS, TOOL_CATEGORIES } from '@/lib/tools';
import { AI_TOOLS, DIRECTORY_CATEGORIES } from '@/lib/directory';
import { LOCALES, getDict, LOCALE_FLAGS, LOCALE_NAMES } from '@/lib/i18n';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import AdSlot from '@/components/AdSlot';
import Link from 'next/link';

export function generateStaticParams() {
  return LOCALES.map(l => ({ locale: l }));
}

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDict(locale);

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-zinc-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap gap-3 justify-between items-center">
          <Link href={`/${locale}`} className="font-black text-xl tracking-tight">🌍 WORLD<span className="font-light">HUB</span><span className="ml-2 bg-zinc-900 text-white text-xs px-2 py-1 rounded-full">PRO 12 LANGS</span></Link>
          <nav className="flex gap-2 text-sm font-bold">
            <a href={`/${locale}#tools`} className="px-3 py-2 rounded-full bg-zinc-900 text-white">Tools</a>
            <a href={`/${locale}#directory`} className="px-3 py-2 rounded-full border border-zinc-200">Directory</a>
            <Link href={`/${locale}/admin`} className="px-3 py-2 rounded-full bg-yellow-400">Admin</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-zinc-900 text-white px-4 sm:px-6 py-10">
        <div className="max-w-[1280px] mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full text-xs font-bold">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            50 Tools + 500 AI Directory • 12 Languages • Triple Monetization
          </div>
          <h1 className="text-[42px] sm:text-[54px] font-black leading-[0.9] tracking-tight mt-4">
            {t.hero} <span className="bg-yellow-400 text-zinc-900 px-3 rounded-xl">12 Langs</span>
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl">{t.sub} AdSense $8 RPM + Affiliate 30% + Featured $29/mo = $50/day with 5k views.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#tools" className="bg-yellow-400 text-zinc-900 px-6 py-3 rounded-full font-black">⚡ Use Free Tool →</a>
            <a href="#directory" className="bg-white text-zinc-900 px-6 py-3 rounded-full font-black">Explore Directory →</a>
          </div>
          <div className="mt-6">
            <div className="text-xs font-black tracking-widest text-white/60 mb-2">SWITCH LANGUAGE — 1 REPO, 12X SEO</div>
            <LocaleSwitcher current={locale} />
          </div>
          <div className="mt-4 text-xs text-white/50">🇺🇸 EN • 🇪🇸 ES • 🇧🇷 PT • 🇫🇷 FR • 🇩🇪 DE • 🇮🇹 IT • 🇯🇵 JA • 🇰🇷 KO • 🇨🇳 ZH • 🇸🇦 AR • 🇮🇳 HI • 🇷🇺 RU — hreflang + auto-translate</div>
        </div>
      </section>

      {/* Trust */}
      <div className="bg-yellow-400 border-y border-black/10">
        <div className="max-w-[1280px] mx-auto px-6 py-3 flex flex-wrap gap-4 justify-between text-xs font-black">
          <span>💰 AdSense + Affiliate + Featured $29</span>
          <span>🌍 12 Languages • 1 Domain • 6,600 Pages</span>
          <span>⚡ Next.js 14 • Vercel • ISR 1h</span>
          <span>📈 $50/day = 5k views</span>
        </div>
      </div>

      {/* TOOLS */}
      <section id="tools" className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10">
        <div className="flex justify-between items-end gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight">🔧 {t.tools} <span className="text-zinc-500 text-lg font-bold">(50)</span></h2>
            <p className="text-zinc-500">Free, no signup. Each tool = 1 SEO page x 12 langs. Monetized with ads + affiliate.</p>
          </div>
          <span className="hidden sm:block text-xs font-bold bg-white border border-zinc-200 px-3 py-1.5 rounded-full">AdSense $8 RPM</span>
        </div>

        {/* Categories */}
        <div className="mt-6 grid lg:grid-cols-[1fr_300px] gap-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOLS.map(tool => (
              <Link key={tool.slug} href={`/${locale}/tools/${tool.slug}`} className="bg-white rounded-2xl p-5 border border-zinc-200 hover:border-zinc-900 hover:shadow-lg transition group">
                <div className="text-3xl">{tool.icon}</div>
                <div className="font-black mt-2 group-hover:text-zinc-900">{tool.name}</div>
                <div className="text-sm text-zinc-500">{tool.desc}</div>
                <div className="mt-3 flex gap-2 items-center">
                  <span className="text-xs font-bold bg-zinc-900 text-white px-2.5 py-1 rounded-full">{t.cta}</span>
                  {tool.affiliate && <span className="text-xs bg-yellow-100 border border-yellow-200 px-2 py-1 rounded-full">{tool.affiliate}</span>}
                </div>
              </Link>
            ))}
          </div>
          <div className="space-y-4">
            <AdSlot label="AdSense - Tools Sidebar" />
            <div className="bg-white rounded-2xl p-5 border border-zinc-200">
              <div className="font-black">How it ranks</div>
              <p className="text-sm text-zinc-500 mt-1">Each tool has: H1, how-to, FAQ, schema.org, 12 hreflangs. Example: <code className="bg-zinc-100 px-1 rounded">/pt/tools/pdf-para-jpg</code> ranks in Brazil, <code className="bg-zinc-100 px-1 rounded">/ja/tools/pdf-to-jpg</code> in Japan. Same code.</p>
              <div className="mt-3 text-xs bg-green-50 border border-green-200 rounded-xl p-3">💡 50 tools x 12 = 600 pages. 10 views/page/day = 6k views.</div>
            </div>
          </div>
        </div>
      </section>

      {/* DIRECTORY */}
      <section id="directory" className="bg-white border-y border-zinc-200 py-10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-end gap-4">
            <div>
              <h2 className="text-3xl font-black tracking-tight">📚 {t.directory} <span className="text-zinc-500 text-lg font-bold">(500)</span></h2>
              <p className="text-zinc-500">Curated AI tools. Featured sponsors pay $29/mo to be on top. 30% affiliate on each.</p>
            </div>
            <span className="hidden sm:block text-xs font-bold bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-full">Featured $29/mo</span>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AI_TOOLS.map(tool => (
              <Link key={tool.slug} href={`/${locale}/directory/${tool.slug}`} className={`rounded-2xl p-5 border flex flex-col gap-2 hover:shadow-lg transition ${tool.featured ? 'bg-yellow-50 border-yellow-300' : 'bg-zinc-50 border-zinc-200'}`}>
                <div className="flex justify-between items-start">
                  <span className="text-2xl">{tool.logo}</span>
                  {tool.featured && <span className="text-xs font-black bg-yellow-400 px-2 py-1 rounded-full">{t.featured}</span>}
                </div>
                <div className="font-black">{tool.name}</div>
                <div className="text-sm text-zinc-600 line-clamp-2">{tool.desc}</div>
                <div className="flex gap-2 text-xs mt-1">
                  <span className="bg-white border border-zinc-200 px-2 py-1 rounded-full">{DIRECTORY_CATEGORIES[tool.category as keyof typeof DIRECTORY_CATEGORIES]}</span>
                  <span className="bg-zinc-900 text-white px-2 py-1 rounded-full">{tool.pricing}</span>
                </div>
                <div className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full w-fit">{tool.commission} afiliado</div>
                {tool.featured && <div className="text-xs text-zinc-500">{t.sponsors}</div>}
              </Link>
            ))}
          </div>

          <div className="mt-6 grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <AdSlot label="AdSense - Directory" />
            </div>
            <div className="bg-zinc-900 text-white rounded-2xl p-6">
              <div className="font-black">Monetização Directory</div>
              <ul className="text-sm text-white/70 mt-2 space-y-1 list-disc pl-5">
                <li>2 Featured/dia x $29 = $58/dia só de sponsors</li>
                <li>5% converte afiliado: 500 tools x 5 vendas/mês x $10 = $25k/mês</li>
                <li>Cross-sell Tools → Directory (tráfego grátis)</li>
              </ul>
              <Link href={`/${locale}/admin`} className="mt-4 inline-block bg-yellow-400 text-zinc-900 px-4 py-2 rounded-full font-black text-sm">+ Add Tool (Admin)</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl font-black">💰 Como $50/dia fecha</h2>
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-zinc-200">
            <div className="font-black">Ads</div>
            <div className="text-3xl font-black mt-2">5k views</div>
            <div className="text-sm text-zinc-500">x $8 RPM = $40/dia global (EN $12, HI $3 → média $8)</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-zinc-200">
            <div className="font-black">Afiliado</div>
            <div className="text-3xl font-black mt-2">5 vendas</div>
            <div className="text-sm text-zinc-500">x $5 média (Canva/Adobe/ElevenLabs) = $25/dia</div>
          </div>
          <div className="bg-yellow-400 rounded-2xl p-6 border border-black/10">
            <div className="font-black">Featured</div>
            <div className="text-3xl font-black mt-2">2 sponsors</div>
            <div className="text-sm">x $29/mês = $2/dia → escala para 20 = $20/dia</div>
          </div>
        </div>
        <p className="text-xs text-zinc-500 mt-3">Total conservador: $40 + $10 (1 venda) = $50/dia. Com 20 Featured = $100+/dia.</p>
      </section>

      <footer className="bg-zinc-900 text-white mt-6">
        <div className="max-w-[1280px] mx-auto px-6 py-8 text-sm text-white/60">
          <div>© 2026 World Hub Pro • 12 Langs • 1 Repo • Vercel Hobby • Feito para faturar global.</div>
          <div className="mt-2 flex gap-3">
            {LOCALES.map(l => <span key={l}>{LOCALE_FLAGS[l as keyof typeof LOCALE_FLAGS]} {l.toUpperCase()}</span>)}
          </div>
        </div>
      </footer>
    </div>
  );
}
