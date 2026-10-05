import Header from '@/components/Header';
import Footer from '@/components/Footer';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return {
    title: 'About World Tools Hub - Privacy-First Web Utilities',
    description: 'Learn about World Tools Hub, our browser-native computing architecture, privacy commitment, and editorial curation process for artificial intelligence software.',
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolved = await params;
  const locale = resolved.locale || 'en';

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentLocale={locale} />
      <main className="max-w-[900px] mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="border-b border-zinc-200 pb-6 mb-8">
            <span className="text-xs uppercase tracking-wider font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
              Our Vision
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 mt-3 tracking-tight">
              About World Tools Hub
            </h1>
            <p className="text-sm text-zinc-600 mt-2">
              Empowering global productivity with private, zero-upload web utilities and transparent AI benchmarking.
            </p>
          </div>

          <div className="prose text-zinc-700 space-y-6 text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-black text-zinc-900 mb-2">1. Who We Are</h2>
              <p>
                <strong>World Tools Hub</strong> (<a href="https://www.iatools.online" className="text-yellow-600 font-bold hover:underline">iatools.online</a>) is an open utility initiative created by engineers and digital creators who were tired of bloated, ad-ridden converter websites that demand file uploads and harvest user telemetry.
              </p>
              <p className="mt-2">
                We believe that modern web browsers possess more than enough compute power to process PDFs, manipulate images, analyze text, and execute cryptographic calculations locally without transmitting confidential documents across public internet servers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-zinc-900 mb-2">2. The Client-Side Advantage: Zero Server Footprint</h2>
              <p>
                Most online document converters require you to send sensitive contracts, personal photos, and business spreadsheets to cloud instances owned by unknown third parties. 
                At World Tools Hub, our architecture relies entirely on <strong>client-side execution</strong>:
              </p>
              <div className="grid sm:grid-cols-3 gap-4 mt-4 not-prose">
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                  <div className="text-2xl mb-1">🛡️</div>
                  <div className="font-bold text-zinc-900 text-sm">Strict Privacy</div>
                  <div className="text-xs text-zinc-600 mt-1">Your data never touches our server disks or backend databases.</div>
                </div>
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                  <div className="text-2xl mb-1">⚡</div>
                  <div className="font-bold text-zinc-900 text-sm">Instant Execution</div>
                  <div className="text-xs text-zinc-600 mt-1">No upload queues, no network latency, and zero wait time.</div>
                </div>
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                  <div className="text-2xl mb-1">🌍</div>
                  <div className="font-bold text-zinc-900 text-sm">Universal Access</div>
                  <div className="text-xs text-zinc-600 mt-1">Available in 12 global languages, free for everyone forever.</div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-black text-zinc-900 mb-2">3. Our Editorial & Testing Methodology</h2>
              <p>
                In addition to our browser utilities, we curate a focused directory of artificial intelligence software. Every tool listed undergoes rigorous criteria before inclusion:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li><strong>Practical Utility:</strong> We test whether the AI platform delivers measurable productivity gains for real workflows.</li>
                <li><strong>Pricing Transparency:</strong> We verify free tier availability, hidden credit limits, and subscription renewal clarity.</li>
                <li><strong>Security & Compliance:</strong> We verify data retention policies, commercial copyright safeguards, and API stability.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-zinc-900 mb-2">4. Sustainable Monetization Model</h2>
              <p>
                We do not sell user data, we do not require account registration, and we do not paywall our utilities. Our infrastructure and ongoing development are sustained by:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li><strong>Contextual Advertisements:</strong> Served through Google AdSense under compliant, user-respecting formats.</li>
                <li><strong>Affiliate Partnerships:</strong> Direct referral commissions from vetted enterprise software providers when a user voluntarily upgrades to premium cloud tools.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-zinc-900 mb-2">5. Editorial Leadership & Contact</h2>
              <p>
                World Tools Hub is continually updated to support modern Web APIs (WebAssembly, HTML5 Canvas 2D, Web Speech API, and Client Crypto). 
                For suggestions, bug reports, or feature requests, contact us directly at{' '}
                <a href="mailto:contact@iatools.online" className="text-yellow-600 font-bold hover:underline">
                  contact@iatools.online
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer currentLocale={locale} />
    </div>
  );
}
