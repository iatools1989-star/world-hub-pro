import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure | World Tools Hub',
  description:
    'How World Tools Hub earns money, which links are affiliate links, and what that means for you. FTC, ASA and Amazon Associates compliant disclosure.',
};

export default async function AffiliateDisclosurePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolved = await params;
  const locale = resolved.locale || 'en';

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentLocale={locale} />
      <main className="max-w-[900px] mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="border-b border-zinc-200 pb-6 mb-8">
            <span className="text-xs uppercase tracking-wider font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
              #ad · Transparency
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 mt-3 tracking-tight">
              Affiliate Disclosure
            </h1>
            <p className="text-xs text-zinc-500 mt-2">
              Last updated: 10 November 2026 · Applies to every page on this site
            </p>
          </div>

          <div className="text-zinc-700 space-y-6 text-sm leading-relaxed">
            <section className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="font-bold text-blue-900">
                Short version: some links on this site are affiliate links. If you subscribe to a paid
                plan through one of them, we may earn a commission — at no extra cost to you. It never
                changes the price you pay, and it never changes what we write.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-zinc-900 mb-2">1. Which links are affiliate links</h2>
              <p>Affiliate links are always marked in at least one of these ways:</p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>a visible <code className="bg-zinc-100 px-1 rounded">#ad</code> badge at the top of the page or next to the link;</li>
                <li>the words <em>affiliate link</em> or <em>we may earn a commission</em>;</li>
                <li>the attributes <code className="bg-zinc-100 px-1 rounded">rel=&quot;sponsored noopener noreferrer&quot;</code> in the page source.</li>
              </ul>
              <p className="mt-2">
                Our own tools contain no affiliate links. We never use link shorteners: the destination is
                always the official website of the tool.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-zinc-900 mb-2">2. Programs we participate in</h2>
              <p>
                We take part in affiliate programs of software vendors listed in our directory. Commission
                rates published by those programs change without notice; the exact rate is set by the vendor,
                not by us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-zinc-900 mb-2">3. Amazon Associates</h2>
              <p className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-900 font-semibold">
                As an Amazon Associate I earn from qualifying purchases.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-zinc-900 mb-2">4. What we never do</h2>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>We never publish a positive review in exchange for payment.</li>
                <li>We never invent ratings, prices, testimonials or user numbers.</li>
                <li>We never copy a vendor&apos;s marketing text and present it as our own review.</li>
                <li>We never publish a link we have not verified.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-zinc-900 mb-2">5. Prices change</h2>
              <p>
                Prices, plans and features are set by the vendors. Anything shown on this site is for
                comparison and may be out of date. The price you pay is always the one on the vendor&apos;s
                checkout page — always check it before subscribing.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-zinc-900 mb-2">6. Advertising</h2>
              <p>
                This site displays third-party advertising (Google AdSense). Advertisers do not review,
                approve or influence our editorial content. See our{' '}
                <a href={`/${locale}/privacy`} className="text-yellow-600 font-bold hover:underline">
                  Privacy Policy
                </a>{' '}
                for cookies and data handling.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-zinc-900 mb-2">7. Questions and corrections</h2>
              <p>
                Found a broken or outdated link? Write to{' '}
                <a href="mailto:contact@iatools.online" className="text-yellow-600 font-bold hover:underline">
                  contact@iatools.online
                </a>{' '}
                and we will correct it.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer currentLocale={locale} />
    </div>
  );
}
