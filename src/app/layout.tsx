import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "World Hub Pro - 50 Tools + 500 AI Directory | 12 Languages",
  description: "World Tools Hub: 50 free tools + 500 AI tools directory in 12 languages. Monetized with AdSense + Affiliates + Featured $29/mo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <head>
        <meta name="google-adsense-account" content="ca-pub-3588158822524146" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3588158822524146" crossOrigin="anonymous"></script>
      </head>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
