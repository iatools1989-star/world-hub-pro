'use client';

import { useState } from 'react';

export default function WordCounter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  // Análise em tempo real
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s+/g, '').length;
  const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+(\s|$)/g) || [trimmed]).length : 0;
  const paragraphs = trimmed ? trimmed.split(/\n+/).filter((p) => p.trim().length > 0).length : 0;
  
  // Médias de leitura e fala
  const readingTime = Math.ceil(words / 200); // 200 palavras/min
  const speakingTime = Math.ceil(words / 130); // 130 palavras/min

  // Ações rápidas de texto
  const handleClear = () => setText('');
  
  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpperCase = () => setText(text.toUpperCase());
  const handleLowerCase = () => setText(text.toLowerCase());
  const handleCapitalize = () => {
    setText(
      text
        .toLowerCase()
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    );
  };

  return (
    <div className="space-y-6">
      {/* Grade de Estatísticas Principais */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[var(--color-surface)] border border-[var(--color-line)] p-3.5 rounded-[12px] text-center shadow-sm">
          <div className="text-3xl font-black text-[var(--color-ink)]">{words}</div>
          <div className="text-[11px] text-[var(--color-ink-muted)] font-bold uppercase tracking-wider mt-0.5">Words</div>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-line)] p-3.5 rounded-[12px] text-center shadow-sm">
          <div className="text-3xl font-black text-[var(--color-ink)]">{chars}</div>
          <div className="text-[11px] text-[var(--color-ink-muted)] font-bold uppercase tracking-wider mt-0.5">Characters</div>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-line)] p-3.5 rounded-[12px] text-center shadow-sm">
          <div className="text-3xl font-black text-[var(--color-ink)]">{charsNoSpaces}</div>
          <div className="text-[11px] text-[var(--color-ink-muted)] font-bold uppercase tracking-wider mt-0.5">No Spaces</div>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-line)] p-3.5 rounded-[12px] text-center shadow-sm">
          <div className="text-3xl font-black text-[var(--color-ink)]">{sentences}</div>
          <div className="text-[11px] text-[var(--color-ink-muted)] font-bold uppercase tracking-wider mt-0.5">Sentences</div>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-line)] p-3.5 rounded-[12px] text-center shadow-sm">
          <div className="text-3xl font-black text-[var(--color-ink)]">{paragraphs}</div>
          <div className="text-[11px] text-[var(--color-ink-muted)] font-bold uppercase tracking-wider mt-0.5">Paragraphs</div>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-line)] p-3.5 rounded-[12px] text-center shadow-sm">
          <div className="text-2xl font-black text-[var(--color-ink)]">~{readingTime}m</div>
          <div className="text-[11px] text-[var(--color-ink-muted)] font-bold uppercase tracking-wider mt-0.5">
            Reading
          </div>
          <div className="text-[10px] text-[var(--color-ink-muted)] mt-0.5">
            ~{speakingTime}m spoken
          </div>
        </div>
      </div>

      {/* Barra de Ações Rápidas */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[var(--color-surface)] p-2.5 rounded-[12px] border border-[var(--color-line)] shadow-sm text-xs">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={handleUpperCase}
            disabled={!text}
            className="px-3 py-1.5 bg-[var(--color-surface-2)] hover:bg-[var(--color-line)] rounded-lg font-bold text-[var(--color-ink-soft)] disabled:opacity-40 transition"
          >
            UPPERCASE
          </button>
          <button
            onClick={handleLowerCase}
            disabled={!text}
            className="px-3 py-1.5 bg-[var(--color-surface-2)] hover:bg-[var(--color-line)] rounded-lg font-bold text-[var(--color-ink-soft)] disabled:opacity-40 transition"
          >
            lowercase
          </button>
          <button
            onClick={handleCapitalize}
            disabled={!text}
            className="px-3 py-1.5 bg-[var(--color-surface-2)] hover:bg-[var(--color-line)] rounded-lg font-bold text-[var(--color-ink-soft)] disabled:opacity-40 transition"
          >
            Capitalise each word
          </button>
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={handleCopy}
            disabled={!text}
            className={`px-3 py-1.5 font-bold rounded-lg transition disabled:opacity-40 ${
              copied ? 'bg-emerald-600 text-white' : 'bg-[var(--color-btn-bg)] text-[var(--color-btn-fg)] hover:opacity-90'
            }`}
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleClear}
            disabled={!text}
            className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-bold transition disabled:opacity-40"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Caixa de Texto Principal */}
      <textarea
        rows={9}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your text here for a live analysis..."
        className="w-full p-5 bg-[var(--color-surface)] rounded-[14px] border-2 border-[var(--color-line)] focus:outline-none focus:border-yellow-400 font-sans text-sm leading-relaxed shadow-inner"
      />
    </div>
  );
}

