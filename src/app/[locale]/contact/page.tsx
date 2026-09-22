import { LOCALES } from '@/lib/i18n';
import Link from 'next/link';
export function generateStaticParams() { return LOCALES.map(l => ({ locale: l })); }
export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b sticky top-0"><div className="max-w-3xl mx-auto px-6 py-4 flex justify-between"><Link href={`/${locale}`} className="font-black">WORLD HUB</Link><Link href={`/${locale}`} className="text-sm border px-3 py-1 rounded-full">Back</Link></div></header>
      <main className="max-w-3xl mx-auto px-6 py-10 bg-white mt-6 rounded-2xl border">
        <h1 className="text-3xl font-black">Contact</h1>
        <p>We reply in 24h.</p>
        <p className="mt-4"><a href="mailto:contact@iatools.online" className="text-blue-600 underline">contact@iatools.online</a></p>
        <p className="mt-2 text-sm">Guanambi, BA, Brazil - AdSense ca-pub-3588158822524146</p>
        <div className="mt-8"><Link href={`/${locale}/privacy`} className="underline">Privacy</Link> | <Link href={`/${locale}/terms`} className="underline">Terms</Link></div>
      </main>
    </div>
  );
}
