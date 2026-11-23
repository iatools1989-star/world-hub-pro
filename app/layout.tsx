import type { Metadata } from 'next';
import Script from 'next/script';
import '@/app/globals.css';
import { ADSENSE_CONFIG } from '@/lib/data';
import { SITE_URL, SITE_NAME, AUTHOR_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - 16 Free Browser Tools + AI Directory`,
    template: '%s | World Tools Hub',
  },
  description: 'Fast, secure, private online tools that process entirely in your browser. Plus a curated directory of the best AI tools.',
  applicationName: SITE_NAME,
  authors: [{ name: AUTHOR_NAME ?? SITE_NAME, url: SITE_URL }],
  creator: AUTHOR_NAME ?? SITE_NAME,
  publisher: SITE_NAME,
  other: {
    'google-adsense-account': ADSENSE_CONFIG.client,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Verificacao de propriedade do Impact.com (rede da Canva e outros).
            O Impact exige o atributo `value`, nao `content` — e nao aceita a tag
            injetada por JavaScript, tem que estar no HTML inicial. Por isso ela
            vai no <head> do layout raiz, que e renderizado no servidor. */}
        <meta
          name="impact-site-verification"
          // O Impact exige o atributo `value`, mas os tipos do React so conhecem
          // `content` em <meta>. O spread mantem o atributo correto no HTML sem
          // cair para `content` — que o verificador do Impact NAO aceita.
          {...({ value: '72bda8c9-0933-4a3f-bc45-c3497910c8e4' } as Record<string, string>)}
        />
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.client}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900 antialiased selection:bg-yellow-300 selection:text-zinc-900">
        {children}
      </body>
    </html>
  );
}
