import Link from 'next/link';
import { LOCALES } from '@/lib/data';

export default function Header({ currentLocale = 'en' }: { currentLocale?: string }) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap gap-4 justify-between items-center">
        <Link href={`/${currentLocale}`} className="flex items-center gap-2 group">
          <span className="text-2xl">🌍</span>
          <span className="font-black text-xl tracking-tight text-zinc-900">
            WORLD<span className="text-zinc-500 font-normal">HUB</span>
          </span>
          <span className="bg-zinc-900 text-yellow-400 font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
            12 Langs
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="flex gap-2 text-sm font-bold">
            <Link
              href={`/${currentLocale}#tools`}
              className="px-3.5 py-1.5 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 transition"
            >
              Tools
            </Link>
            <Link
              href={`/${currentLocale}#directory`}
              className="px-3.5 py-1.5 rounded-full border border-zinc-300 text-zinc-700 hover:border-zinc-900 transition"
            >
              Directory
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
