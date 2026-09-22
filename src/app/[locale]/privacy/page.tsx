import { LOCALES } from '@/lib/i18n';
import Link from 'next/link';
export function generateStaticParams() { return LOCALES.map(l => ({ locale: l })); }
export default async function Privacy({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b sticky top-0"><div className="max-w-3xl mx-auto px-6 py-4 flex justify-between"><Link href={`/${locale}`} className="font-black">WORLD HUB</Link><Link href={`/${locale}`} className="text-sm border px-3 py-1 rounded-full">Back</Link></div></header>
      <main className="max-w-3xl mx-auto px-6 py-10 bg-white mt-6 rounded-2xl border">
        <h1 className="text-3xl font-black">Privacy Policy</h1>
        <p className="text-sm text-zinc-500 mt-2">Last updated: Sep 22, 2026 - iatools.online</p>
        <p className="mt-6">We respect your privacy. We collect anonymous analytics via Vercel and Google Analytics. IP anonymized.</p>
        <h2 className="font-black mt-8">2. Cookies and Ads</h2>
        <p className="text-sm text-zinc-600 mt-2">We use Google AdSense ca-pub-3588158822524146 and affiliate links. Google uses cookies for ads. Opt out at adssettings.google.com. For EEA we show CMP.</p>
        <h2 className="font-black mt-6">3. Contact</h2>
        <p className="text-sm">contact@iatools.online - Guanambi, BA, Brazil</p>
        <div className="mt-10 flex gap-3 text-xs"><Link href={`/${locale}/terms`} className="underline">Terms</Link><Link href={`/${locale}/contact`} className="underline">Contact</Link><Link href={`/${locale}/about`} className="underline">About</Link></div>
      </main>
    </div>
  );
}
