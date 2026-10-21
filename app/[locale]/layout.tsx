import { notFound } from 'next/navigation';
import { LOCALES } from '@/lib/data';

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map(({ code }) => ({ locale: code }));
}

export default async function LocaleLayout({ children, params }: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!LOCALES.some(({ code }) => code === locale)) notFound();
  return children;
}
