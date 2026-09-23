import { TOOLS } from '@/lib/tools';
import { LOCALES } from '@/lib/i18n';
import ToolClient from './ToolClient';

export function generateStaticParams() {
  const params = [];
  for (const locale of LOCALES) {
    for (const tool of TOOLS) params.push({ locale, slug: tool.slug });
  }
  return params;
}

export default async function ToolPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  return <ToolClient slug={slug} locale={locale} />;
}
