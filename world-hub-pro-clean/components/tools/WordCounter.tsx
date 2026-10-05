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
        <div className="bg-white border border-zinc-200 p-3.5 rounded-2xl text-center shadow-sm">
          <div className="text-3xl font-black text-zinc-900">{words}</div>
          <div className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Palavras</div>
        </div>

        <div className="bg-white border border-zinc-200 p-3.5 rounded-2xl text-center shadow-sm">
          <div className="text-3xl font-black text-zinc-900">{chars}</div>
          <div className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Caracteres</div>
        </div>

        <div className="bg-white border border-zinc-200 p-3.5 rounded-2xl text-center shadow-sm">
          <div className="text-3xl font-black text-zinc-900">{charsNoSpaces}</div>
          <div className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Sem Espaços</div>
        </div>

        <div className="bg-white border border-zinc-200 p-3.5 rounded-2xl text-center shadow-sm">
          <div className="text-3xl font-black text-zinc-900">{sentences}</div>
          <div className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Frases</div>
        </div>

        <div className="bg-white border border-zinc-200 p-3.5 rounded-2xl text-center shadow-sm">
          <div className="text-3xl font-black text-zinc-900">{paragraphs}</div>
          <div className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Parágrafos</div>
        </div>

        <div className="bg-white border border-zinc-200 p-3.5 rounded-2xl text-center shadow-sm">
          <div className="text-2xl font-black text-zinc-900">~{readingTime}m</div>
          <div className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Leitura (~{speakingTime}m fala)</div>
        </div>
      </div>

      {/* Barra de Ações Rápidas */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-2.5 rounded-2xl border border-zinc-200 shadow-sm text-xs">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={handleUpperCase}
            disabled={!text}
            className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg font-bold text-zinc-700 disabled:opacity-40 transition"
          >
            MAIÚSCULAS
          </button>
          <button
            onClick={handleLowerCase}
            disabled={!text}
            className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg font-bold text-zinc-700 disabled:opacity-40 transition"
          >
            minúsculas
          </button>
          <button
            onClick={handleCapitalize}
            disabled={!text}
            className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg font-bold text-zinc-700 disabled:opacity-40 transition"
          >
            Primeira Maiúscula
          </button>
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={handleCopy}
            disabled={!text}
            className={`px-3 py-1.5 font-bold rounded-lg transition disabled:opacity-40 ${
              copied ? 'bg-emerald-600 text-white' : 'bg-zinc-900 text-white hover:bg-zinc-800'
            }`}
          >
            {copied ? '✓ Copiado!' : '📋 Copiar'}
          </button>
          <button
            onClick={handleClear}
            disabled={!text}
            className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-bold transition disabled:opacity-40"
          >
            🗑️ Limpar
          </button>
        </div>
      </div>

      {/* Caixa de Texto Principal */}
      <textarea
        rows={9}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Cole ou digite o texto aqui para analisar em tempo real..."
        className="w-full p-5 bg-white rounded-3xl border-2 border-zinc-200 focus:outline-none focus:border-yellow-400 font-sans text-sm leading-relaxed shadow-inner"
      />
    </div>
  );
}
