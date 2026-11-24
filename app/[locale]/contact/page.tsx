import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { canonical } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    alternates: { canonical: canonical(`/${locale}/contact`) },
    title: 'Contact Support & Editorial Team',
    description: 'Contact World Tools Hub by email for bug reports, tool suggestions or partnership questions. One inbox, answered by the person who writes the code.',
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolved = await params;
  const locale = resolved.locale || 'en';

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentLocale={locale} />
      <main className="max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8 py-9 sm:py-12 flex-1 w-full">
        <div className="bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[14px] p-6 sm:p-10 shadow-sm">
          <div className="border-b border-[var(--color-line)] pb-6 mb-8">
            <span className="text-xs uppercase tracking-wider font-bold text-[var(--color-brand-deep)] bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
              Get In Touch
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[var(--color-ink)] mt-3 tracking-tight">
              Contact Us
            </h1>
            <p className="text-sm text-[var(--color-ink-muted)] mt-2">
              Questions, feedback, partnership proposals or a bug you found — it all goes to the same inbox.
            </p>
            <p className="text-xs text-[var(--color-ink-muted)] mt-2">
              Last updated: November 10, 2026 · Answered by the person who maintains the code, not a support desk.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-[12px] flex flex-col justify-between">
              <div>
                <div className="text-3xl mb-3">📬</div>
                <h3 className="font-bold text-[var(--color-ink)] text-lg">General & Technical Inquiries</h3>
                <p className="text-xs text-[var(--color-ink-muted)] mt-1">
                  Report bugs, propose new client-side utilities, or ask questions about how our browser tools process data.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--color-line)]">
                <a href="mailto:guilhermemarculasilva@gmail.com" className="text-sm font-bold text-[var(--color-ink)] hover:text-[var(--color-brand-deep)] transition flex items-center gap-1">
                  guilhermemarculasilva@gmail.com <span>→</span>
                </a>
              </div>
            </div>

            <div className="p-6 bg-yellow-50/60 border border-yellow-200 rounded-[12px] flex flex-col justify-between">
              <div>
                <div className="text-3xl mb-3">🤝</div>
                <h3 className="font-bold text-[var(--color-ink)] text-lg">Partnerships & Directory Submissions</h3>
                <p className="text-xs text-[var(--color-ink-muted)] mt-1">
                  Are you an AI software founder? Submit your platform for benchmark evaluation in our curated directory.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-yellow-200">
                <a href="mailto:guilhermemarculasilva@gmail.com?subject=Partnership%20Inquiry" className="text-sm font-bold text-[var(--color-ink)] hover:text-[var(--color-brand-deep)] transition flex items-center gap-1">
                  partnerships@iatools.online <span>→</span>
                </a>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[var(--color-surface-2)] rounded-[12px] border border-[var(--color-line)]">
            <h3 className="font-bold text-[var(--color-ink)] mb-2">Office & Operational Details</h3>
            <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
              <strong>World Tools Hub Operations</strong><br />
              A small independent team. No office, no call centre, no phone support.<br />
              Domain: <a href="https://iatools.online" className="underline font-medium">iatools.online</a><br />
              Email is the only support channel. We read everything; we reply when a human can.
            </p>
          </div>
        </div>
      </main>
      <Footer currentLocale={locale} />
    </div>
  );
}
