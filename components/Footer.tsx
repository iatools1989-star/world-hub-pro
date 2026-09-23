import Link from 'next/link';
import { LOCALES } from '@/lib/data';

export default function Footer({ currentLocale = 'en' }: { currentLocale?: string }) {
  return (
    <footer className="bg-zinc-950 text-white mt-auto border-t border-zinc-800">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-wrap gap-6 justify-between items-center pb-8 border-b border-zinc-800 text-sm">
          <div className="flex flex-wrap gap-5 text-zinc-400 font-medium">
            <Link href={`/${currentLocale}/about`} className="hover:text-yellow-400 transition">About</Link>
            <Link href={`/${currentLocale}/privacy`} className="hover:text-yellow-400 transition">Privacy Policy</Link>
            <Link href={`/${currentLocale}/terms`} className="hover:text-yellow-400 transition">Terms of Service</Link>
            <a href="mailto:contact@iatools.online" className="hover:text-yellow-400 transition">contact@iatools.online</a>
          </div>
          <div className="text-zinc-500 text-xs">
            © {new Date().getFullYear()} World Tools Hub. Privacy First • 100% Client-Side.
          </div>
        </div>

        <div className="mt-6">
          <div className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-3">Available Languages:</div>
          <div className="flex flex-wrap gap-2">
            {LOCALES.map((loc) => (
              <Link
                key={loc.code}
                href={`/${loc.code}`}
                className={`text-xs px-2.5 py-1 rounded-full border transition flex items-center gap-1 ${
                  loc.code === currentLocale
                    ? 'bg-yellow-400 text-zinc-950 border-yellow-400 font-bold'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <span>{loc.flag}</span>
                <span>{loc.code.toUpperCase()}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
