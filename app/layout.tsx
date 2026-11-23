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
