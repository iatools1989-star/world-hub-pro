import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { canonical } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    alternates: { canonical: canonical(`/${locale}/privacy`) },
    title: 'Privacy Policy & Data Protection',
    description: 'What World Tools Hub stores and what it does not: local file processing, the cookies Google AdSense and Analytics set, and the rights you can exercise by email.',
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolved = await params;
  const locale = resolved.locale || 'en';

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentLocale={locale} />
      <main className="max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8 py-9 sm:py-12 flex-1 w-full">
        <div className="bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[14px] p-6 sm:p-10 shadow-sm">
          <div className="border-b border-[var(--color-line)] pb-6 mb-8">
            <span className="text-xs uppercase tracking-wider font-bold text-[var(--color-brand-deep)] bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
              Legal & Trust
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[var(--color-ink)] mt-3 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs text-[var(--color-ink-muted)] mt-2">
              Last updated: November 10, 2026 · Applies to the English edition at iatools.online
            </p>
          </div>

          <div className="prose text-[var(--color-ink-soft)] space-y-6 text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-black text-[var(--color-ink)] mb-2">1. Introduction & Core Mission</h2>
              <p>
                Welcome to <strong>World Tools Hub</strong> (available at <a href="https://iatools.online" className="text-[var(--color-brand-deep)] font-bold hover:underline inline-flex min-h-6 items-center">https://iatools.online</a>). 
                We are committed to operating our browser utilities under strict <strong>Privacy-by-Design</strong> principles. 
                Our architectural premise is straightforward: everyday utility tools (such as PDF manipulators, image converters, 
                and text processors) should execute <strong>locally in the user's browser sandbox</strong> without uploading confidential documents 
                to external servers or cloud data warehouses.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[var(--color-ink)] mb-2">2. Local File Processing</h2>
              <p>
                When you use tools on World Tools Hub—including but not limited to <em>PDF to JPG, Merge PDF, Compress PDF, Remove Background, 
                Image Compressor, Password Generator, and Text to Speech</em>:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li><strong>No File Uploads:</strong> Files loaded into our tools are processed in your web browser memory using HTML5 APIs, WebAssembly, and client-side JavaScript.</li>
                <li><strong>No Remote Storage:</strong> Your documents, images, credentials, or generated files are never transmitted to our backend, nor are they cached or stored on any server.</li>
                <li><strong>Nothing survives the tab:</strong> Close or refresh the tab and the page can no longer reach your file. We do not write it to disk, to a cookie or to local storage. (As with any web page, the operating system may swap memory while the tab is open — we cannot control that, and it is one more reason to close the tab when you are done.)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-[var(--color-ink)] mb-2">3. Google AdSense & Third-Party Cookies Policy</h2>
              <p>
                To provide free access to all utility tools, World Tools Hub partners with <strong>Google AdSense</strong> to display digital advertisements.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites across the Internet.</li>
                <li>Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to our site and/or other sites on the Internet.</li>
                <li>
                  Users may opt out of personalized advertising by visiting Google's Ad Settings at{' '}
                  <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand-deep)] font-bold underline">
                    Google Ads Settings
                  </a>.
                </li>
                <li>
                  Alternatively, users can opt out of a third-party vendor's use of cookies for personalized advertising by visiting{' '}
                  <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand-deep)] font-bold underline">
                    www.aboutads.info
                  </a>.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-[var(--color-ink)] mb-2">4. Web Analytics & Server Logs</h2>
              <p>
                We use <strong>Google Analytics 4</strong> (delivered through Google Tag Manager) to
                understand which pages people find useful and which ones they leave immediately. It
                records things like the pages you visit, how long you stay, the country your
                connection comes from, and the browser and device you use. It does not receive the
                contents of any file you process — that never leaves your browser, and analytics has
                no way to see it.
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>
                  <strong>What it sets:</strong> cookies that distinguish one visit from another
                  (<code className="text-[13px]">_ga</code>,{' '}
                  <code className="text-[13px]">_ga_*</code>), valid for up to 2 years.
                </li>
                <li>
                  <strong>IP addresses:</strong> Google Analytics 4 does not log or store your full
                  IP address.
                </li>
                <li>
                  <strong>Opting out:</strong> install the{' '}
                  <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand-deep)] font-bold underline">
                    Google Analytics Opt-out Browser Add-on
                  </a>
                  , or block the cookies with your browser settings. The tools on this site keep
                  working either way — they do not depend on analytics.
                </li>
              </ul>
              <p className="mt-3">
                Separately, basic standard technical logs may be automatically recorded by our
                hosting infrastructure (Cloudflare Workers), such as:
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
              <h2 className="text-xl font-black text-[var(--color-ink)] mb-2">5. Affiliate Disclosure & Transparency</h2>
              <p>
                World Tools Hub participates in curated affiliate partner programs (e.g., enterprise AI software directories and advanced desktop alternatives). 
                If you choose to click on an external affiliate link (such as <em>/go/[slug]</em>) and purchase a subscription or software license, 
                we may receive a referral commission at zero additional cost to you. 
                These commercial partnerships do not compromise the editorial integrity or technical evaluation of tools listed in our directory.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[var(--color-ink)] mb-2">6. User Rights (GDPR & LGPD Compliance)</h2>
              <p>
                Under global data protection regulations, including the European Union General Data Protection Regulation (GDPR) and the Brazilian Lei Geral de Proteção de Dados (LGPD), you possess the following rights:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li><strong>Right of Access & Portability:</strong> Since we do not maintain user databases or profile records, we do not hold your personal files.</li>
                <li><strong>Right to Rectification or Erasure:</strong> Any browser-level cache or local storage settings (such as theme or preferred language) can be wiped directly via your browser clearing history tool.</li>
                <li><strong>Consent Revocation:</strong> You can block advertising cookies at any time using your browser's cookie controls or ad blockers.</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, or to ask what — if anything — we hold about you, write to{' '}
                <a href="mailto:guilhermemarculasilva@gmail.com" className="text-[var(--color-brand-deep)] font-bold hover:underline inline-flex min-h-6 items-center">guilhermemarculasilva@gmail.com</a>{' '}
                with the subject line <em>Data request</em>. Email is our only support channel. We answer from a real
                inbox, not an autoresponder, so allow a few working days. If you are not satisfied with the answer, you
                may complain to your local data protection authority — in Brazil, the ANPD.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[var(--color-ink)] mb-2">7. Children's Information (COPPA Compliance)</h2>
              <p>
                World Tools Hub does not knowingly collect or solicit any personally identifiable information from children under the age of 13. If you believe your child provided personal information on our website, please contact us immediately, and we will promptly remove such records from our standard server logs.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[var(--color-ink)] mb-2">8. Contact Information & Data Protection Officer</h2>
              <p>
                If you have questions, inquiries, or suggestions regarding this Privacy Policy, please contact our Data Governance team:
              </p>
              <div className="mt-3 p-4 bg-[var(--color-surface-2)] rounded-xl border border-[var(--color-line)]">
                <div className="font-bold text-[var(--color-ink)]">World Tools Hub Data Protection Inquiries</div>
                <div className="text-xs text-[var(--color-ink-muted)] mt-1">Website: iatools.online</div>
                <div className="text-xs text-[var(--color-ink-muted)]">Email:{' '}
                  <a href="mailto:guilhermemarculasilva@gmail.com" className="text-[var(--color-brand-deep)] font-bold hover:underline inline-flex min-h-6 items-center">
                    guilhermemarculasilva@gmail.com
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
