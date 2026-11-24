/**
 * Ícones em SVG desenhados à mão, um traço só.
 *
 * Motivo: os cards usavam emoji (🔧 📦 📄). Emoji é a assinatura visual
 * mais forte de "template genérico": renderiza diferente em cada sistema,
 * colorido demais e fora da paleta. Um conjunto de ícones de linha dá
 * coerência e permite herdar a cor do tema.
 */

type Props = { nome: string; className?: string };

const CAMINHOS: Record<string, string> = {
  // Ferramentas
  'bulk-studio': 'M4 7h16M4 12h10M4 17h7M17 14l3 3-3 3',
  'image-compressor': 'M4 5h16v14H4zM4 15l4-4 3 3 3-3 6 6',
  'compress-pdf': 'M7 3h7l4 4v14H7zM14 3v5h4M10 13h5M10 17h5',
  'merge-pdf': 'M7 3h7l4 4v14H7zM14 3v5h4M12 12v6M9.5 15.5L12 18l2.5-2.5',
  'pdf-to-jpg': 'M7 3h7l4 4v14H7zM14 3v5h4M9 17l2-3 2 2 2-4 2 5',
  'jpg-to-pdf': 'M7 3h7l4 4v14H7zM14 3v5h4M9 17l2-4 2 2 2-3 2 5',
  'qr-generator': 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z',
  'word-counter': 'M4 6h16M4 12h16M4 18h9',
  'text-to-speech': 'M11 5L6 9H3v6h3l5 4zM16 9a4 4 0 010 6M19 6a8 8 0 010 12',
  'password-generator': 'M6 11a4 4 0 118 0v1H6zM4 12h12v8H4zM3 20h18',
  'color-picker': 'M12 3a9 9 0 100 18h1.5a2.5 2.5 0 000-5H13a2 2 0 010-4h4a4 4 0 000-8z',
  'unit-converter': 'M4 8h11M4 8l3-3M4 8l3 3M20 16H9M20 16l-3-3M20 16l-3 3',
  'age-calculator': 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M8 14h3M8 17h7',
  'resume-builder': 'M6 3h9l4 4v14H6zM15 3v5h4M9 12h6M9 16h6',
  'url-shortener': 'M10 13a5 5 0 007 0l2-2a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-2 2a5 5 0 007 7l1-1',
  'remove-bg': 'M4 4h7v7H4zM13 13h7v7h-7zM13 4h7v7h-7zM4 13h7v7H4z',
  // Categorias de IA
  jasper: 'M5 19L12 5l7 14M8.5 14h7',
  'copy-ai': 'M9 9h10v10H9zM5 15V5h10',
  'canva-magic': 'M5 17c3-8 6-11 9-11a4 4 0 014 4c0 3-3 5-7 5H5zM9 21h10',
  elevenlabs: 'M6 6v12M10 4v16M14 8v8M18 6v12',
  midjourney: 'M12 3l3.2 6.5 7 1-5 4.9 1.2 7L12 19l-6.4 3.4L6.8 15.4l-5-4.9 7-1z',
  runway: 'M4 12l6-6v4h10v4H10v4z',
  pika: 'M13 3L5 14h6l-1 7 8-11h-6z',
  'notion-ai': 'M6 4h9l4 4v12H6zM15 4v5h4M9 13h7M9 17h5',
  'github-copilot': 'M8 4l4 5 4-5M12 9v6M8 15a4 4 0 01-4-4V8M16 15a4 4 0 004-4V8M8 15l-2 5M16 15l2 5',
  'otter-ai': 'M12 4a4 4 0 014 4v4a4 4 0 01-8 0V8a4 4 0 014-4zM6 12a6 6 0 0012 0M12 18v3M9 21h6',
  // Gerais
  spark: 'M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4',
  bolt: 'M13 3L5 14h6l-1 7 8-11h-6z',
  book: 'M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM19 3v18',
  search: 'M11 4a7 7 0 100 14 7 7 0 000-14zM16 16l5 5',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  check: 'M4 13l5 5L20 7',
  x: 'M6 6l12 12M18 6L6 18',
  globe: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18',
  clock: 'M12 4a8 8 0 100 16 8 8 0 000-16zM12 8v4l3 2',
  lock: 'M6 11h12v9H6zM9 11V8a3 3 0 016 0v3',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
};

export default function ToolIcon({ nome, className = 'h-5 w-5' }: Props) {
  const d = CAMINHOS[nome] ?? CAMINHOS.spark;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} />
    </svg>
  );
}

/** Lista de nomes válidos, para uso em testes e no seletor do painel. */
export const ICONES = Object.keys(CAMINHOS);
