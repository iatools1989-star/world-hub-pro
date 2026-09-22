import { AI_TOOLS } from '@/lib/directory';
import { LOCALES } from '@/lib/i18n';
import AdSlot from '@/components/AdSlot';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  const params = [];
  for (const locale of LOCALES) {
    for (const tool of AI_TOOLS) params.push({ locale, slug: tool.slug });
  }
  return params;
}

export default async function DirectoryPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const tool = AI_TOOLS.find(t => t.slug === slug);
  if (!tool) notFound();

  return (
    <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-8">
      <Link href={`/${locale}#directory`} className="text-sm font-bold text-zinc-500">← Back to Directory</Link>
      <div className="mt-4 bg-white rounded-3xl p-8 border border-zinc-200">
        <div className="flex gap-4 items-start">
          <span className="text-5xl">{tool.logo}</span>
          <div>
            <h1 className="text-3xl font-black">{tool.name}</h1>
            <p className="text-zinc-600 mt-1">{tool.desc} — Review, pricing, alternatives in {locale.toUpperCase()}.</p>
            <div className="mt-2 flex gap-2 text-xs">
              <span className="bg-zinc-900 text-white px-2.5 py-1 rounded-full">{tool.pricing}</span>
              <span className="bg-green-50 border border-green-200 text-green-700 px-2.5 py-1 rounded-full font-bold">{tool.commission} affiliate</span>
              {tool.featured && <span className="bg-yellow-400 px-2.5 py-1 rounded-full font-black">Featured</span>}
            </div>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-[1.5fr_0.5fr] gap-4">
          <div className="bg-zinc-900 text-white rounded-2xl p-6 text-center">
            <div className="font-black text-xl">Try {tool.name}</div>
            <p className="text-white/60 text-sm mt-1">Affiliate link with 30% commission — tracked via /go</p>
            <a href={`https://example.com/go/${tool.slug}?via=directory`} target="_blank" className="mt-4 inline-block bg-yellow-400 text-zinc-900 px-6 py-3 rounded-full font-black">Visit Official Site →</a>
            <div className="text-xs text-white/40 mt-2">Your affiliate ID auto-appended • Cookie 30-60 days</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
            <div className="font-black">Sponsor this spot</div>
            <p className="text-sm text-zinc-600">Be #1 for "{tool.name}" in 12 languages. $29/mo, cancel anytime.</p>
            <button className="mt-3 bg-zinc-900 text-white w-full py-2.5 rounded-full font-bold text-sm">Feature for $29/mo →</button>
            <div className="text-xs text-zinc-500 mt-1">Stripe • 6,600 pages of SEO juice</div>
          </div>
        </div>

        <div className="mt-6">
          <AdSlot label={`AdSense - ${tool.name} Review`} />
        </div>

        <div className="mt-6 prose prose-sm max-w-none">
          <h3 className="font-black">What is {tool.name}?</h3>
          <p className="text-zinc-600">Detailed review, pros/cons, pricing table, and 5 alternatives. This content is auto-generated per locale for SEO. Add FAQ + schema.org/Review.</p>
          <h3 className="font-black mt-4">Pricing</h3>
          <table className="w-full text-sm border border-zinc-200 rounded-xl overflow-hidden">
            <thead><tr className="bg-zinc-900 text-white"><th className="p-2 text-left">Plan</th><th className="p-2">Price</th><th className="p-2">Affiliate</th></tr></thead>
            <tbody><tr><td className="p-2">Free</td><td className="p-2">$0</td><td className="p-2">—</td></tr><tr className="bg-zinc-50"><td className="p-2">Pro</td><td className="p-2">$20/mo</td><td className="p-2 font-bold text-green-600">{tool.commission}</td></tr></tbody>
          </table>
        </div>

        <div className="mt-6 text-xs text-zinc-400">hreflang: {LOCALES.map(l => `/${l}/directory/${slug}`).join(' | ')}</div>
      </div>
    </div>
  );
}
