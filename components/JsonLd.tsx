import { jsonLdScript } from '@/lib/seo';

/**
 * Emite JSON-LD dentro do <head> renderizado no servidor.
 * Sem 'use client': o Google le o HTML inicial, nao precisa de JS.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={jsonLdScript(data)}
    />
  );
}
