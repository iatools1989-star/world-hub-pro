import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolved = await params;
  const locale = resolved.locale || 'en';

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentLocale={locale} />
      <main className="max-w-[800px] mx-auto px-4 py-12 flex-1">
        <h1 className="text-3xl font-black mb-4">Contact Us</h1>
        <p className="text-sm text-zinc-600 mb-6">
          Have questions, partnership inquiries, or tool suggestions? Get in touch with our team.
        </p>
        <div className="p-6 bg-white border border-zinc-200 rounded-2xl">
          <div className="font-bold text-zinc-800">Direct Email</div>
          <a href="mailto:contact@iatools.online" className="text-yellow-600 font-bold hover:underline">
            contact@iatools.online
          </a>
        </div>
      </main>
      <Footer currentLocale={locale} />
    </div>
  );
}
