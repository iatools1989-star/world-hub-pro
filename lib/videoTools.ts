/**
 * Ferramentas que tem video de demonstracao em /public/videos.
 *
 * Fica fora do componente porque componente com 'use client' nao pode ser
 * importado por um Server Component e usado como dado: o Next entrega um
 * proxy no lugar do array, e `VIDEO_TOOLS.includes(...)` quebra em runtime
 * (o build passa, a pagina da 500).
 */
export const VIDEO_TOOLS = [
  'qr-generator',
  'password-generator',
  'word-counter',
  'unit-converter',
  'color-picker',
  'url-shortener',
  'image-compressor',
  'jpg-to-pdf',
  'pdf-to-jpg',
  'age-calculator',
  'merge-pdf',
  'compress-pdf',
  'remove-bg',
  'bulk-studio',
  'text-to-speech',
  'resume-builder',
] as readonly string[];
