import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolved = await params;
  const locale = resolved.locale || 'en';

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentLocale={locale} />
      <main className="max-w-[800px] mx-auto px-4 py-12 flex-1">
        <h1 className="text-3xl font-black mb-4">Privacy Policy</h1>
        <div className="prose text-zinc-700 space-y-4 text-sm leading-relaxed">
          <p>
            Your privacy is our priority. World Tools Hub is designed with privacy-by-design principles:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Browser-First Execution:</strong> Files, images, and text inputted into our free utility tools are processed locally via your client browser and are never uploaded or retained on our backend.</li>
            <li><strong>Advertising & Analytics:</strong> We use Google AdSense to serve non-personalized and relevant ads. Third-party vendors may use cookies according to Google’s privacy standards.</li>
            <li><strong>Affiliate Transparency:</strong> Some links to AI software contain referral codes. If you purchase through our links, we may receive a commission at no additional cost to you.</li>
          </ul>
        </div>
      </main>
      <Footer currentLocale={locale} />
    </div>
  );
}
