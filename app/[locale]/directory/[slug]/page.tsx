import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdSenseBanner from '@/components/AdSenseBanner';
import { DIRECTORY_ITEMS } from '@/lib/data';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const item = DIRECTORY_ITEMS.find((d) => d.slug === slug);
  if (!item) return {};

  return {
    title: `${item.name} Review, Pricing & Alternatives`,
    description: `${item.desc} In-depth review, pros, cons, and official discount link.`,
  };
}

export default async function DirectoryPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const item = DIRECTORY_ITEMS.find((d) => d.slug === slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentLocale={locale} />

      <main className="max-w-[960px] mx-auto px-4 sm:px-6 py-8 w-full">
        <a href={`/${locale}#directory`} className="text-xs font-bold text-zinc-500 hover:text-zinc-900 transition">
          ← Back to Directory
        </a>

        <div className="mt-4 bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm">
          <div className="flex gap-4 items-start pb-6 border-b border-zinc-100">
            <span className="text-5xl">{item.icon}</span>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-900">{item.name}</h1>
              <p className="text-zinc-600 mt-1 text-sm sm:text-base">{item.desc}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="bg-zinc-900 text-white px-2.5 py-1 rounded-full font-bold">
                  {item.pricing}
                </span>
                <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-full font-bold">
                  Verified Partner ({item.commission})
                </span>
                {item.badge && (
                  <span className="bg-yellow-400 text-zinc-950 px-2.5 py-1 rounded-full font-black">
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-[1.5fr_1fr] gap-4">
            <div className="bg-zinc-950 text-white rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h2 className="font-black text-xl mb-1">Get Started with {item.name}</h2>
                <p className="text-zinc-400 text-xs">
                  Access direct discounts, trial periods, and onboarding offers through our verified referral link.
                </p>
              </div>
              <a
                href={`/go/${item.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block text-center bg-yellow-400 text-zinc-950 font-black py-3 px-6 rounded-full hover:bg-yellow-300 transition text-sm shadow-md"
              >
                Visit Official Website ↗
              </a>
            </div>

            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-zinc-900 mb-1">Promote Your AI Tool</h3>
                <p className="text-zinc-600 text-xs">
                  Featured placement across all 12 global language editions of World Tools Hub for $29/mo.
                </p>
              </div>
              <a
                href="mailto:contact@iatools.online?subject=Sponsor%20Spot%20Inquiry"
                className="mt-4 block text-center bg-zinc-900 text-white py-2.5 px-4 rounded-full font-bold text-xs hover:bg-zinc-800 transition"
              >
                Book Sponsor Spot ($29/mo) →
              </a>
            </div>
          </div>

          {/* AdSense In-Review */}
          <AdSenseBanner />

          <div className="mt-8 space-y-4 text-sm text-zinc-700 leading-relaxed border-t border-zinc-100 pt-6">
            <h3 className="text-lg font-black text-zinc-900">Overview & Key Capabilities</h3>
            <p>
              {item.name} is engineered to streamline daily productivity and automated content generation workflows.
              It eliminates friction by combining high computational efficiency with intuitive interfaces, making it ideal for both professionals and creators.
            </p>
          </div>
        </div>
      </main>

      <Footer currentLocale={locale} />
    </div>
  );
}
