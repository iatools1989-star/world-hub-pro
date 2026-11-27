import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import '@/app/globals.css';
import { ADSENSE_CONFIG } from '@/lib/data';
import { SITE_URL, SITE_NAME, AUTHOR_NAME } from '@/lib/seo';
import ConsentBanner from '@/components/ConsentBanner';

// Fontes servidas do próprio build (sem requisição a terceiros).
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});
const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
  variable: '--font-mono',
});

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
    <html
      lang="en"
      className={`${inter.variable} ${mono.variable}`}
      /* A classe `dark` é aplicada no cliente antes da hidratação; sem isto o
         React reclama da diferença entre servidor e cliente. */
      suppressHydrationWarning
    >
      <head>
        {/* Evita o piscar branco ao carregar já no tema escuro.
            Roda antes da primeira pintura, por isso é inline e síncrono. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('wtb-theme');var d=s==='escuro'||(!s&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
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
        {/* O AdSense exige a tag <script> crua no <head>. O componente <Script>
            do Next injeta um atributo data-nscript que o Google rejeita com
            "AdSense head tag doesn't support data-nscript attribute" — o que
            pode invalidar a verificação do site. Por isso vai como script puro. */}
        {/* O script do AdSense NAO fica mais aqui.
            Ele grava cookie de publicidade, e cookie de publicidade exige
            consentimento previo (GDPR/LGPD). Quem o injeta — e so depois do
            aceite — e o componente ConsentBanner. O atributo de verificacao
            do AdSense continua no metadata, que nao grava nada. */}
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        {children}
        <ConsentBanner />
      </body>
    </html>
  );
}
