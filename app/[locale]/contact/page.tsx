import Header from '@/components/Header';
import Footer from '@/components/Footer';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return {
    title: 'Contact Support & Editorial Team',
    description: 'Get in touch with the World Tools Hub development, advertising partnership, and technical support teams.',
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolved = await params;
  const locale = resolved.locale || 'en';

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentLocale={locale} />
      <main className="max-w-[900px] mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="border-b border-zinc-200 pb-6 mb-8">
            <span className="text-xs uppercase tracking-wider font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
              Get In Touch
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 mt-3 tracking-tight">
              Contact Us
            </h1>
            <p className="text-sm text-zinc-600 mt-2">
              Have questions, feedback, partnership proposals, or bug reports? We are here to help.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="text-3xl mb-3">📬</div>
                <h3 className="font-bold text-zinc-900 text-lg">General & Technical Inquiries</h3>
                <p className="text-xs text-zinc-600 mt-1">
                  Report bugs, propose new client-side utilities, or ask questions about how our browser tools process data.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-200">
                <a href="mailto:contact@iatools.online" className="text-sm font-bold text-zinc-900 hover:text-yellow-600 transition flex items-center gap-1">
                  contact@iatools.online <span>→</span>
                </a>
              </div>
            </div>

            <div className="p-6 bg-yellow-50/60 border border-yellow-200 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="text-3xl mb-3">🤝</div>
                <h3 className="font-bold text-zinc-900 text-lg">Partnerships & Directory Submissions</h3>
                <p className="text-xs text-zinc-600 mt-1">
                  Are you an AI software founder? Submit your platform for benchmark evaluation in our curated directory.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-yellow-200">
                <a href="mailto:contact@iatools.online?subject=Partnership%20Inquiry" className="text-sm font-bold text-zinc-900 hover:text-yellow-600 transition flex items-center gap-1">
                  partnerships@iatools.online <span>→</span>
                </a>
              </div>
            </div>
          </div>

          <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200">
            <h3 className="font-bold text-zinc-900 mb-2">Office & Operational Details</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              <strong>World Tools Hub Operations</strong><br />
              Digital-First Remote Engineering Team • Serving 12 Global Regions<br />
              Domain: <a href="https://www.iatools.online" className="underline font-medium">www.iatools.online</a><br />
              Average Response Time: Within 24-48 business hours.
            </p>
          </div>
        </div>
      </main>
      <Footer currentLocale={locale} />
    </div>
  );
}
