import Link from 'next/link';

export default function Footer({ currentLocale }: { currentLocale: string }) {
  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500" />
              <span className="font-black text-white tracking-tight">WORLD<span className="font-normal">HUB</span></span>
            </div>
            <p className="text-sm mt-2 text-zinc-500">Privacy-first tools. 100% client-side. No upload, no account required.</p>
            <p className="text-xs mt-2 text-zinc-600">Free tools · No subscription · No paywall</p>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/en/guides" className="hover:text-white">Guides</Link>
            <Link href="/en/about" className="hover:text-white">About</Link>
            <Link href="/en/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/en/terms" className="hover:text-white">Terms</Link>
            <Link href="/en/affiliate-disclosure" className="hover:text-white">Affiliate disclosure</Link>
            <a href="mailto:contact@iatools.online" className="hover:text-white">contact@iatools.online</a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row justify-between gap-4 text-xs text-zinc-500">
          <span>© 2026 World Tools Hub · Free browser tools · Some outbound links may be affiliate links (#ad) — never a paid ranking</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> All systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}
