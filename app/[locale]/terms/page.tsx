import Header from '@/components/Header';
import Footer from '@/components/Footer';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return {
    title: 'Terms of Service & Usage Agreement',
    description: 'Read the terms of service, conditions of use, intellectual property, and disclaimers for World Tools Hub web utilities.',
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolved = await params;
  const locale = resolved.locale || 'en';

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentLocale={locale} />
      <main className="max-w-[900px] mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="border-b border-zinc-200 pb-6 mb-8">
            <span className="text-xs uppercase tracking-wider font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
              Legal Agreement
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 mt-3 tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xs text-zinc-500 mt-2">
              Last updated: October 5, 2026 • Effective Date: January 1, 2025
            </p>
          </div>

          <div className="prose text-zinc-700 space-y-6 text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-black text-zinc-900 mb-2">1. Acceptance of Terms</h2>
              <p>
                By accessing and utilizing the web utilities, services, and software directory provided on <strong>World Tools Hub</strong> (accessible at <a href="https://www.iatools.online" className="text-yellow-600 font-bold hover:underline">https://www.iatools.online</a>), you agree to be bound by these Terms of Service, all applicable laws and regulations, and acknowledge your responsibility for compliance with local legal provisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-zinc-900 mb-2">2. Permitted Use & Local Processing</h2>
              <p>
                World Tools Hub grants you a revocable, non-exclusive, non-transferable license to utilize our browser-based utility tools for personal, educational, or commercial purposes.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>You may use all conversion, compression, analysis, and generation tools without account creation.</li>
                <li>Because all file manipulations execute on your local client device, you retain 100% full ownership and copyright of any inputs, files, documents, or graphics processed.</li>
                <li>You agree not to use our utilities to produce, distribute, or manipulate defamatory, malicious, copyrighted without authorization, or unlawful material.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-zinc-900 mb-2">3. Intellectual Property Rights</h2>
              <p>
                The World Tools Hub website code, interface layout, brand designs, logos, software algorithms, and textual content are the intellectual property of World Tools Hub and are protected by international copyright and trademark protections.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-zinc-900 mb-2">4. Third-Party Links & AI Directory Listings</h2>
              <p>
                Our directory contains links to third-party tools, external software providers, and affiliate partners. These third-party websites operate under separate independent terms and privacy protocols. We do not assume responsibility or liability for third-party content, billing policies, or data handling practices.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-zinc-900 mb-2">5. Disclaimer of Warranties</h2>
              <p>
                The materials, tools, and calculators on World Tools Hub are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express or implied. 
                While we strive for precision in all mathematical algorithms, color models, PDF routines, and font renderings, we make no representations or warranties regarding the absolute accuracy, reliability, or completeness of the processed outputs for mission-critical or life-safety applications.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-zinc-900 mb-2">6. Limitation of Liability</h2>
              <p>
                In no event shall World Tools Hub, its founders, or contributors be held liable for any damages (including, without limitation, damages for loss of data, loss of business profits, or business interruption) arising out of the use or inability to use the tools on this website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-zinc-900 mb-2">7. Changes to Terms</h2>
              <p>
                World Tools Hub reserves the right to modify these terms of service at any time without prior notice. By continuing to use the website following any revisions, you agree to be bound by the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-zinc-900 mb-2">8. Governing Law & Jurisdiction</h2>
              <p>
                Any claims relating to World Tools Hub shall be governed by international internet commercial standards and consumer law provisions. Questions regarding these terms may be forwarded to{' '}
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
