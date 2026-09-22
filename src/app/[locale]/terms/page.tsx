import { LOCALES } from '@/lib/i18n';
import Link from 'next/link';
export function generateStaticParams() { return LOCALES.map(l => ({ locale: l })); }
export default async function Terms({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b sticky top-0"><div className="max-w-3xl mx-auto px-6 py-4 flex justify-between"><Link href={`/${locale}`} className="font-black">WORLD HUB</Link><Link href={`/${locale}`} className="text-sm border px-3 py-1 rounded-full">Back</Link></div></header>
      <main className="max-w-3xl mx-auto px-6 py-10 bg-white mt-6 rounded-2xl border">
        <h1 className="text-3xl font-black">Terms of Service</h1>
        <p className="text-sm text-zinc-500">Last updated: Sep 22, 2026 - iatools.online</p>
        <p className="text-sm mt-4">50 free tools + 500 AI directory. No signup. Affiliate links disclosed. Ads by Google AdSense. Featured is paid.</p>
        <p className="text-sm mt-4">Contact: contact@iatools.online</p>
        <div className="mt-10 flex gap-3 text-xs"><Link href={`/${locale}/privacy`} className="underline">Privacy</Link><Link href={`/${locale}/contact`} className="underline">Contact</Link></div>
      </main>
    </div>
  );
}
