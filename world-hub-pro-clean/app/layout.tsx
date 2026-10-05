import type { Metadata } from 'next';
import Script from 'next/script';
import '@/app/globals.css';
import { ADSENSE_CONFIG } from '@/lib/data';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.iatools.online'),
  title: {
    default: 'World Tools Hub - 50 Free Online Tools + AI Directory',
    template: '%s | World Tools Hub',
  },
  description: 'Fast, secure, private online tools that process entirely in your browser. Plus a curated directory of the best AI tools.',
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
