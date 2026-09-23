import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolved = await params;
  const locale = resolved.locale || 'en';

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentLocale={locale} />
      <main className="max-w-[800px] mx-auto px-4 py-12 flex-1">
        <h1 className="text-3xl font-black mb-4">Terms of Service</h1>
        <div className="prose text-zinc-700 space-y-4 text-sm leading-relaxed">
          <p>
            By using World Tools Hub, you agree to comply with and be bound by the following terms.
          </p>
          <p>
            The services are provided &quot;as is&quot; without warranties of any kind. You are responsible for ensuring that your use of the tools complies with local laws and regulations.
          </p>
        </div>
      </main>
      <Footer currentLocale={locale} />
    </div>
  );
}
