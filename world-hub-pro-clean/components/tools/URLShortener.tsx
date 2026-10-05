'use client';

import { useState } from 'react';

const TRACKING_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'fbclid',
  'gclid',
  'msclkid',
  'mc_eid',
  '_hsenc',
  '_hsmi',
  'zanpid',
  'igshid',
  'si',
  'yclid',
  '_ga',
  'dclid',
];

export default function URLShortener() {
  const [inputUrl, setInputUrl] = useState('https://exemplo.com/artigo?utm_source=facebook&utm_medium=cpc&fbclid=IwAR123456789&gclid=XYZ999&session=ok');
  const [cleanedUrl, setCleanedUrl] = useState('');
  const [removedCount, setRemovedCount] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const cleanUrl = () => {
    try {
      const url = new URL(inputUrl.trim());
      let count = 0;

      // Remoção dos parâmetros pré-definidos
      TRACKING_PARAMS.forEach((param) => {
        if (url.searchParams.has(param)) {
          url.searchParams.delete(param);
          count++;
        }
      });

      // Remoção de variações de utm_* e afins
      Array.from(url.searchParams.keys()).forEach((key) => {
        if (key.startsWith('utm_') || key.startsWith('hsa_')) {
          url.searchParams.delete(key);
          count++;
        }
      });

      setCleanedUrl(url.toString());
      setRemovedCount(count);
      setCopied(false);
    } catch {
      alert('URL inválida. Certifique-se de digitar o link completo iniciando com http:// ou https://');
    }
  };

  const handleCopy = () => {
    if (!cleanedUrl) return;
    navigator.clipboard.writeText(cleanedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
        <div>
          <label htmlFor="url-input-standalone" className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
            Insira o link com parâmetros de rastreamento (anúncios, redes sociais, UTMs):
          </label>
          <input
            id="url-input-standalone"
            type="url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="https://exemplo.com/pagina?utm_source=..."
            className="w-full px-4 py-3 rounded-2xl border-2 border-zinc-200 focus:outline-none focus:border-yellow-400 font-sans text-sm"
          />
        </div>

        <button
          onClick={cleanUrl}
          type="button"
          className="w-full py-4 bg-yellow-400 text-zinc-950 font-black rounded-2xl hover:bg-yellow-300 transition text-sm shadow-md flex items-center justify-center gap-2"
        >
          <span>✨</span> Higienizar e Remover Parâmetros de Rastreamento
        </button>
      </div>

      {/* Exibição do Resultado */}
      {cleanedUrl && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              URL Limpa e Otimizada:
            </span>
            {removedCount !== null && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ✓ {removedCount} {removedCount === 1 ? 'rastreador removido' : 'rastreadores removidos'}
              </span>
            )}
          </div>

          <div
            className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 font-mono text-xs sm:text-sm text-zinc-800 break-all select-all leading-relaxed"
            aria-live="polite"
          >
            {cleanedUrl}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleCopy}
              type="button"
              className={`flex-1 py-3 px-5 font-bold rounded-2xl text-xs transition flex items-center justify-center gap-2 shadow ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-900 text-white hover:bg-zinc-800'
              }`}
            >
              {copied ? '✓ Copiado para a Área de Transferência!' : '📋 Copiar Link Limpo'}
            </button>
            <a
              href={cleanedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition"
            >
              <span>↗</span> Testar URL em Nova Aba
            </a>
          </div>
        </div>
      )}

      {/* Cartão Explicativo de Privacidade */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-xs text-zinc-600 leading-relaxed">
        <b>💡 Por que limpar seus links?</b> Redes como Facebook, Google e TikTok anexam identificadores individuais (como <code className="bg-zinc-200 px-1 rounded">fbclid</code> e <code className="bg-zinc-200 px-1 rounded">gclid</code>) que rastreiam quem compartilhou a página. A remoção limpa esses dados sem quebrar o acesso ao destino.
      </div>
    </div>
  );
}
