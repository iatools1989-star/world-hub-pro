"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LOCALES } from '@/lib/data';

export default function Header({ currentLocale = 'en' }: { currentLocale?: string }) {
  const pathname = usePathname();
  const getLocalizedPath = (locale: string) => {
    if (!pathname) return `/${locale}`;
    const parts = pathname.split('/');
    parts[1] = locale;
    return parts.join('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <Link href={`/${currentLocale}`} className="flex items-center gap-2">
          <span className="text-2xl">🌍</span>
          <span className="font-black text-xl tracking-tight text-zinc-900">WORLD<span className="text-zinc-500 font-normal">HUB</span></span>
          <span className="hidden sm:inline bg-zinc-900 text-yellow-400 font-extrabold text-[10px] px-2 py-0.5 rounded-full">12 LANGS</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="hidden md:flex gap-2 text-sm font-bold">
            <Link href={`/${currentLocale}#tools`} className="px-4 py-2 rounded-full bg-zinc-900 text-white hover:bg-zinc-800">Tools</Link>
            <Link href={`/${currentLocale}#directory`} className="px-4 py-2 rounded-full border border-zinc-300 hover:border-zinc-900">Directory</Link>
          </nav>
          <Link href={`/${currentLocale}/tools/bulk-studio`} className="px-4 py-2 rounded-full bg-yellow-400 text-zinc-900 font-black text-sm hover:bg-yellow-300">Go Pro $9 →</Link>
          <select 
            value={currentLocale} 
            onChange={(e) => window.location.href = getLocalizedPath(e.target.value)}
            className="border border-zinc-300 rounded-full px-2 py-2 text-xs font-bold bg-white"
          >
            {LOCALES.map(loc => <option key={loc.code} value={loc.code}>{loc.flag} {loc.code.toUpperCase()}</option>)}
          </select>
        </div>
      </div>
      <div className="bg-zinc-900 text-yellow-400 text-[11px] text-center py-1 tracking-wide">
        ✓ 100% Client-Side • Privacy First • No Upload • Trusted by 10k+ creators
      </div>
    </header>
  );
}