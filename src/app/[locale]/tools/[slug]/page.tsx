import { TOOLS } from '@/lib/tools';
import { LOCALES } from '@/lib/i18n';
import AdSlot from '@/components/AdSlot';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  const params = [];
  for (const locale of LOCALES) {
    for (const tool of TOOLS) params.push({ locale, slug: tool.slug });
  }
  return params;
}

export default async function ToolPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const tool = TOOLS.find(t => t.slug === slug);
  if (!tool) notFound();

  return (
    <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-8">
      <Link href={`/${locale}#tools`} className="text-sm font-bold text-zinc-500">← Back to Tools</Link>
      <div className="mt-4 bg-white rounded-3xl p-8 border border-zinc-200">
        <div className="text-5xl">{tool.icon}</div>
        <h1 className="text-3xl font-black mt-3">{tool.name} — Free Online</h1>
        <p className="text-zinc-600 mt-2">{tool.desc} — No signup, 100% free in {locale.toUpperCase()}. {tool.affiliate && `Try ${tool.affiliate} Pro for more.`}</p>

        <div className="mt-6 bg-zinc-50 border border-zinc-200 rounded-2xl p-6">
          <div className="font-black">1. Upload your file</div>
          <div className="mt-3 border-2 border-dashed border-zinc-300 rounded-2xl p-8 text-center bg-white">
            <div className="text-zinc-400">Drag & Drop or Click to Upload</div>
            <button className="mt-3 bg-zinc-900 text-white px-6 py-3 rounded-full font-black">Choose File</button>
            <div className="text-xs text-zinc-500 mt-2">Demo UI — connect to real API (e.g., Smallpdf, Remove.bg) + affiliate link</div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="flex-1 bg-yellow-400 py-3 rounded-full font-black">Convert Now →</button>
            <button className="flex-1 border border-zinc-200 py-3 rounded-full font-bold">Download</button>
          </div>
        </div>

        <div className="mt-6">
          <AdSlot label={`AdSense - ${tool.name}`} />
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white border border-zinc-200 rounded-2xl p-5">
            <div className="font-black">How to use {tool.name}?</div>
            <ol className="list-decimal pl-5 mt-2 text-zinc-600 space-y-1">
              <li>Upload file</li>
              <li>Click Convert</li>
              <li>Download result</li>
            </ol>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
            <div className="font-black">Monetization here</div>
            <p className="text-zinc-600">Affiliate: {tool.affiliate || 'AdSense only'} — CTA to Pro version. + Display ads. + Premium $9 to remove ads.</p>
            <button className="mt-3 bg-zinc-900 text-white px-4 py-2 rounded-full text-sm font-bold w-full">Upgrade to Pro $9/yr →</button>
          </div>
        </div>

        <div className="mt-6 text-xs text-zinc-400">
          hreflang: {LOCALES.map(l => `/${l}/tools/${slug}`).join(' | ')} • SEO: FAQ + HowTo schema
        </div>
      </div>
    </div>
  );
}
