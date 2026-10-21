import Link from 'next/link';
import { LOCALES } from '@/lib/data';

export default function Footer({ currentLocale = 'en' }: { currentLocale?: string }) {
  return (
    <footer className="bg-zinc-950 text-white mt-12 border-t border-zinc-800">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-6 justify-between border-b border-zinc-800 pb-6">
          <div>
            <div className="font-black text-lg">🌍 WORLD<span className="font-normal text-zinc-400">HUB</span></div>
            <p className="text-xs text-zinc-500 mt-1">Privacy-first tools. 100% client-side. No upload. Trusted globally.</p>
            <div className="flex gap-2 mt-3 text-[11px]">
              <span className="bg-white text-zinc-900 px-2 py-1 rounded font-bold">VISA</span>
              <span className="bg-white text-zinc-900 px-2 py-1 rounded font-bold">MASTERCARD</span>
              <span className="bg-yellow-400 text-zinc-900 px-2 py-1 rounded font-black">STRIPE SECURE</span>
            </div>
          </div>
          <div className="flex gap-6 text-sm font-medium">
            <Link href={`/${currentLocale}/about`} className="hover:text-yellow-400">About</Link>
            <Link href={`/${currentLocale}/privacy`} className="hover:text-yellow-400">Privacy</Link>
            <Link href={`/${currentLocale}/terms`} className="hover:text-yellow-400">Terms</Link>
            <a href="mailto:contact@iatools.online" className="hover:text-yellow-400">contact@iatools.online</a>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
          <div className="text-xs text-zinc-500">© {new Date().getFullYear()} World Tools Hub. 12 Languages • 100% Offline</div>
          <div className="flex flex-wrap gap-2">
            {LOCALES.map((loc) => (
              <Link key={loc.code} href={`/${loc.code}`} className={`text-xs px-2.5 py-1 rounded-full border ${loc.code === currentLocale ? 'bg-yellow-400 text-zinc-950 border-yellow-400 font-bold' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>
                {loc.flag} {loc.code.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}