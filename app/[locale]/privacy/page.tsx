import Header from '@/components/Header';
import Footer from '@/components/Footer';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return {
    title: 'Privacy Policy & Data Protection',
    description: 'Learn how World Tools Hub safeguards your personal data, enforces zero-server file processing, and manages cookies in compliance with GDPR, LGPD, and Google AdSense guidelines.',
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolved = await params;
  const locale = resolved.locale || 'en';

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentLocale={locale} />
      <main className="max-w-[900px] mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="border-b border-zinc-200 pb-6 mb-8">
            <span className="text-xs uppercase tracking-wider font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
              Legal & Trust
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 mt-3 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs text-zinc-500 mt-2">
              Last updated: October 5, 2026 • Effective Date: January 1, 2025
            </p>
          </div>

          <div className="prose text-zinc-700 space-y-6 text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-black text-zinc-900 mb-2">1. Introduction & Core Mission</h2>
              <p>
                Welcome to <strong>World Tools Hub</strong> (accessible at <a href="https://www.iatools.online" className="text-yellow-600 font-bold hover:underline">https://www.iatools.online</a>). 
                We are committed to operating our browser utilities under strict <strong>Privacy-by-Design</strong> principles. 
                Our architectural premise is straightforward: everyday utility tools (such as PDF manipulators, image converters, 
                and text processors) should execute <strong>locally in the user's browser sandbox</strong> without uploading confidential documents 
                to external servers or cloud data warehouses.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-zinc-900 mb-2">2. Zero-Knowledge Local File Processing</h2>
              <p>
                When you use tools on World Tools Hub—including but not limited to <em>PDF to JPG, Merge PDF, Compress PDF, Remove Background, 
                Image Compressor, Password Generator, and Text to Speech</em>:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li><strong>No File Uploads:</strong> Files loaded into our tools are processed in your web browser memory using HTML5 APIs, WebAssembly, and client-side JavaScript.</li>
                <li><strong>No Remote Storage:</strong> Your documents, images, credentials, or generated files are never transmitted to our backend, nor are they cached or stored on any server.</li>
                <li><strong>Immediate Volatility:</strong> As soon as you refresh or close your browser tab, all active working data held in client-side RAM is permanently cleared.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-zinc-900 mb-2">3. Google AdSense & Third-Party Cookies Policy</h2>
              <p>
                To provide free access to all utility tools, World Tools Hub partners with <strong>Google AdSense</strong> to display digital advertisements.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites across the Internet.</li>
                <li>Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to our site and/or other sites on the Internet.</li>
                <li>
                  Users may opt out of personalized advertising by visiting Google's Ad Settings at{' '}
                  <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-yellow-600 font-bold underline">
                    Google Ads Settings
                  </a>.
                </li>
                <li>
                  Alternatively, users can opt out of a third-party vendor's use of cookies for personalized advertising by visiting{' '}
                  <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer" className="text-yellow-600 font-bold underline">
                    www.aboutads.info
                  </a>.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-zinc-900 mb-2">4. Web Analytics & Server Logs</h2>
              <p>
                When you browse our pages, basic standard technical logs may be automatically recorded by our hosting infrastructure (Vercel Edge Network), such as:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Internet Protocol (IP) address;</li>
                <li>Browser user-agent, operating system, and language preferences;</li>
                <li>Requested URL path, timestamps, and referring website addresses.</li>
              </ul>
              <p className="mt-2">
                These server logs are used exclusively for security monitoring, DDoS mitigation, and system health verification. They are never paired with personal identifiers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-zinc-900 mb-2">5. Affiliate Disclosure & Transparency</h2>
              <p>
                World Tools Hub participates in curated affiliate partner programs (e.g., enterprise AI software directories and advanced desktop alternatives). 
                If you choose to click on an external affiliate link (such as <em>/go/[slug]</em>) and purchase a subscription or software license, 
                we may receive a referral commission at zero additional cost to you. 
                These commercial partnerships do not compromise the editorial integrity or technical evaluation of tools listed in our directory.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-zinc-900 mb-2">6. User Rights (GDPR & LGPD Compliance)</h2>
              <p>
                Under global data protection regulations, including the European Union General Data Protection Regulation (GDPR) and the Brazilian Lei Geral de Proteção de Dados (LGPD), you possess the following rights:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li><strong>Right of Access & Portability:</strong> Since we do not maintain user databases or profile records, we do not hold your personal files.</li>
                <li><strong>Right to Rectification or Erasure:</strong> Any browser-level cache or local storage settings (such as theme or preferred language) can be wiped directly via your browser clearing history tool.</li>
                <li><strong>Consent Revocation:</strong> You can block advertising cookies at any time using your browser's cookie controls or ad blockers.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-zinc-900 mb-2">7. Children's Information (COPPA Compliance)</h2>
              <p>
                World Tools Hub does not knowingly collect or solicit any personally identifiable information from children under the age of 13. If you believe your child provided personal information on our website, please contact us immediately, and we will promptly remove such records from our standard server logs.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-zinc-900 mb-2">8. Contact Information & Data Protection Officer</h2>
              <p>
                If you have questions, inquiries, or suggestions regarding this Privacy Policy, please contact our Data Governance team:
              </p>
              <div className="mt-3 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                <div className="font-bold text-zinc-900">World Tools Hub Data Protection Inquiries</div>
                <div className="text-xs text-zinc-600 mt-1">Website: https://www.iatools.online</div>
                <div className="text-xs text-zinc-600">Email:{' '}
                  <a href="mailto:contact@iatools.online" className="text-yellow-600 font-bold hover:underline">
                    contact@iatools.online
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer currentLocale={locale} />
    </div>
  );
}
