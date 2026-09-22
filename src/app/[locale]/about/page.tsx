import { LOCALES } from '@/lib/i18n';
import Link from 'next/link';
export function generateStaticParams() { return LOCALES.map(l => ({ locale: l })); }
export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b sticky top-0"><div className="max-w-3xl mx-auto px-6 py-4 flex justify-between"><Link href={`/${locale}`} className="font-black">WORLD HUB</Link><Link href={`/${locale}`} className="text-sm border px-3 py-1 rounded-full">Back</Link></div></header>
      <main className="max-w-3xl mx-auto px-6 py-10 bg-white mt-6 rounded-2xl border">
        <h1 className="text-3xl font-black">About World Hub Pro</h1>
        <p className="mt-4">One domain, 12 languages, 6600 pages. 50 free tools + 500 AI directory. Built to earn $50/day with AdSense + Affiliate + Featured.</p>
        <p className="mt-4">Owner: Guilherme Marcula, Guanambi BA, Brazil. contact@iatools.online</p>
      </main>
    </div>
  );
}
