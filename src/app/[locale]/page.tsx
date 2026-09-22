import { TOOLS } from '@/lib/tools';
import { AI_TOOLS, DIRECTORY_CATEGORIES } from '@/lib/directory';
import { LOCALES, getDict, LOCALE_FLAGS } from '@/lib/i18n';
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

      {/* Hero - USER FOCUSED, NO MONETIZATION */}
      <section className="bg-zinc-900 text-white px-4 sm:px-6 py-10">
        <div className="max-w-[1280px] mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full text-xs font-bold">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Free • No Signup • 12 Languages • Privacy First
          </div>
          <h1 className="text-[42px] sm:text-[54px] font-black leading-[0.9] tracking-tight mt-4">
            {t.hero} <span className="bg-yellow-400 text-zinc-900 px-3 rounded-xl">12 Langs</span>
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl">
            50 free tools to convert, compress and create — plus 500 AI tools tested and ranked. All in your language, no signup, your files never leave your browser.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#tools" className="bg-yellow-400 text-zinc-900 px-6 py-3 rounded-full font-black">⚡ Use Free Tool →</a>
            <a href="#directory" className="bg-white text-zinc-900 px-6 py-3 rounded-full font-black">Explore AI Directory →</a>
          </div>
          <div className="mt-6">
            <div className="text-xs font-black tracking-widest text-white/60 mb-2">SWITCH LANGUAGE — 1 REPO, 12X SEO</div>
            <LocaleSwitcher current={locale} />
          </div>
          <div className="mt-4 text-xs text-white/50">🇺🇸 EN • 🇪🇸 ES • 🇧🇷 PT • 🇫🇷 FR • 🇩🇪 DE • 🇮🇹 IT • 🇯🇵 JA • 🇰🇷 KO • 🇨🇳 ZH • 🇸🇦 AR • 🇮🇳 HI • 🇷🇺 RU — hreflang + auto-translate</div>
        </div>
      </section>

      {/* Trust - USER TRUST, NOT MONEY */}
      <div className="bg-yellow-400 border-y border-black/10">
        <div className="max-w-[1280px] mx-auto px-6 py-3 flex flex-wrap gap-4 justify-between text-xs font-black">
          <span>✓ Free forever • No signup</span>
          <span>✓ Privacy first — files stay in browser</span>
          <span>✓ 12 Languages • 1 Domain</span>
          <span>✓ Fast & Secure</span>
        </div>
      </div>

      {/* TOOLS */}
      <section id="tools" className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10">
        <div className="flex justify-between items-end gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight">🔧 {t.tools} <span className="text-zinc-500 text-lg font-bold">(50)</span></h2>
            <p className="text-zinc-500">Fast, private and free forever. No signup, no watermarks. Pick a tool and get it done in seconds.</p>
          </div>
          <span className="hidden sm:block text-xs font-bold bg-white border border-zinc-200 px-3 py-1.5 rounded-full">No signup • Free</span>
        </div>

        <div className="mt-6 grid lg:grid-cols-[1fr_300px] gap-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOLS.map(tool => (
              <Link key={tool.slug} href={`/${locale}/tools/${tool.slug}`} className="bg-white rounded-2xl p-5 border border-zinc-200 hover:border-zinc-900 hover:shadow-lg transition group">
                <div className="text-3xl">{tool.icon}</div>
                <div className="font-black mt-2 group-hover:text-zinc-900">{tool.name}</div>
                <div className="text-sm text-zinc-500">{tool.desc}</div>
                <div className="mt-3 flex gap-2 items-center">
                  <span className="text-xs font-bold bg-zinc-900 text-white px-2.5 py-1 rounded-full">{t.cta}</span>
                  {tool.affiliate && <span className="text-xs bg-zinc-100 border border-zinc-200 px-2 py-1 rounded-full">{tool.affiliate}</span>}
                </div>
              </Link>
            ))}
          </div>
          <div className="space-y-4">
            <AdSlot label="Tools - Featured" />
            <div className="bg-white rounded-2xl p-5 border border-zinc-200">
              <div className="font-black">How to use</div>
              <ol className="text-sm text-zinc-500 mt-2 space-y-1 list-decimal pl-5">
                <li>Pick a tool (e.g. PDF to JPG)</li>
                <li>Drop your file — it never leaves your browser</li>
                <li>Download the result in seconds</li>
              </ol>
              <div className="mt-3 text-xs bg-zinc-900 text-white rounded-xl p-3">💡 Tip: All tools work on mobile. No app needed.</div>
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
              <p className="text-zinc-500">We test every AI so you don’t have to. Find the right one for your task in seconds.</p>
            </div>
            <span className="hidden sm:block text-xs font-bold bg-zinc-900 text-white px-3 py-1.5 rounded-full">Updated daily • Curated</span>
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
                {tool.featured && <div className="text-xs text-zinc-500">{t.sponsors}</div>}
              </Link>
            ))}
          </div>

          <div className="mt-6 grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <AdSlot label="Directory - Featured" />
            </div>
            <div className="bg-zinc-900 text-white rounded-2xl p-6">
              <div className="font-black">Why World Hub?</div>
              <ul className="text-sm text-white/70 mt-2 space-y-2">
                <li>✓ <b className="text-white">Save time</b> — one place for every task</li>
                <li>✓ <b className="text-white">Stay private</b> — files processed in your browser</li>
                <li>✓ <b className="text-white">Always free</b> — no signup, no watermarks</li>
              </ul>
              <Link href={`/${locale}/about`} className="mt-4 inline-block bg-yellow-400 text-zinc-900 px-4 py-2 rounded-full font-black text-sm">Learn more →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - FOR VISITOR, NOT MONEY */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl font-black">How it works — in 3 steps</h2>
        <p className="text-zinc-500 mt-1">Made for students, creators and professionals who need results fast.</p>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-zinc-200">
            <div className="text-2xl">⚡</div>
            <div className="font-black mt-2">1. Choose a tool</div>
            <div className="text-sm text-zinc-500 mt-1">Pick from 50 tools — PDF, image, text, dev. No signup.</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-zinc-200">
            <div className="text-2xl">🔒</div>
            <div className="font-black mt-2">2. Work privately</div>
            <div className="text-sm text-zinc-500 mt-1">Your file is processed in your browser. We never store it.</div>
          </div>
          <div className="bg-yellow-400 rounded-2xl p-6 border border-black/10">
            <div className="text-2xl">✅</div>
            <div className="font-black mt-2">3. Get it done</div>
            <div className="text-sm mt-1">Download perfect results in seconds. Free forever.</div>
          </div>
        </div>
        <div className="mt-6 bg-zinc-900 text-white rounded-2xl p-6 flex flex-wrap gap-4 justify-between items-center">
          <div>
            <div className="font-black">Popular this week</div>
            <div className="text-sm text-white/60">PDF to JPG • Remove Background • AI Headshot • Compress PDF</div>
          </div>
          <a href="#tools" className="bg-white text-zinc-900 px-5 py-2.5 rounded-full font-black text-sm">Try now →</a>
        </div>
      </section>

      <footer className="bg-zinc-900 text-white mt-6">
        <div className="max-w-[1280px] mx-auto px-6 py-8 text-sm text-white/60">
          <div className="flex flex-wrap gap-4 mb-4 text-white">
            <Link href={`/${locale}/about`} className="hover:text-yellow-400">About</Link>
            <Link href={`/${locale}/privacy`} className="hover:text-yellow-400">Privacy</Link>
            <Link href={`/${locale}/terms`} className="hover:text-yellow-400">Terms</Link>
            <Link href={`/${locale}/contact`} className="hover:text-yellow-400">Contact</Link>
            <a href="mailto:contact@iatools.online" className="hover:text-yellow-400">contact@iatools.online</a>
          </div>
          <div>© 2026 World Hub Pro • 12 Languages • Privacy First • Free Forever</div>
          <div className="mt-2 flex gap-3 flex-wrap">
            {LOCALES.map(l => <span key={l}>{LOCALE_FLAGS[l as keyof typeof LOCALE_FLAGS]} {l.toUpperCase()}</span>)}
          </div>
        </div>
      </footer>
    </div>
  );
}
