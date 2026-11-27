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
  const [inputUrl, setInputUrl] = useState('https://example.com/article?utm_source=facebook&utm_medium=cpc&fbclid=IwAR123456789&gclid=XYZ999&session=ok');
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
      alert('Invalid URL. Make sure you paste the full link, starting with http:// or https://');
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
      <div className="bg-[var(--color-surface)] p-6 sm:p-8 rounded-[14px] border border-[var(--color-line)] shadow-sm space-y-4">
        <div>
          <label htmlFor="url-input-standalone" className="block text-xs font-bold text-[var(--color-ink-muted)] uppercase tracking-wider mb-2">
            Paste a link with tracking parameters (ads, social media, UTMs):
          </label>
          <input
            id="url-input-standalone"
            type="url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="https://example.com/page?utm_source=..."
            className="w-full px-4 py-3 rounded-[12px] border-2 border-[var(--color-line)] focus:outline-none focus:border-yellow-400 font-sans text-sm"
          />
        </div>

        <button
          onClick={cleanUrl}
          type="button"
          className="w-full py-4 bg-yellow-400 text-zinc-950 font-black rounded-[12px] hover:bg-yellow-300 transition text-sm shadow-md flex items-center justify-center gap-2"
        >
          <span>✨</span> Clean and Remove Tracking Parameters
        </button>
      </div>

      {/* Exibição do Resultado */}
      {cleanedUrl && (
        <div className="bg-[var(--color-surface)] p-6 sm:p-8 rounded-[14px] border border-[var(--color-line)] shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-[var(--color-ink-muted)] uppercase tracking-wider">
              Clean URL:
            </span>
            {removedCount !== null && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ✓ {removedCount} {removedCount === 1 ? 'tracker removed' : 'trackers removed'}
              </span>
            )}
          </div>

          <div
            className="p-4 bg-[var(--color-surface-2)] rounded-[12px] border border-[var(--color-line)] font-mono text-xs sm:text-sm text-[var(--color-ink)] break-all select-all leading-relaxed"
            aria-live="polite"
          >
            {cleanedUrl}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleCopy}
              type="button"
              className={`flex-1 py-3 px-5 font-bold rounded-[12px] text-xs transition flex items-center justify-center gap-2 shadow ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[var(--color-btn-bg)] text-[var(--color-btn-fg)] hover:opacity-90'
              }`}
            >
              {copied ? '✓ Copied to clipboard' : 'Copy clean link'}
            </button>
            <a
              href={cleanedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-5 bg-[var(--color-surface-2)] hover:bg-[var(--color-line)] text-[var(--color-ink)] font-bold rounded-[12px] text-xs flex items-center justify-center gap-1.5 transition"
            >
              <span>↗</span> Open cleaned URL in a new tab
            </a>
          </div>
        </div>
      )}

      {/* Cartão Explicativo de Privacidade */}
      <div className="bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-[12px] p-4 text-xs text-[var(--color-ink-muted)] leading-relaxed">
        <b>💡 Why clean your links?</b> Networks like Facebook, Google and TikTok attach personal identifiers (such as <code className="bg-[var(--color-line)] px-1 rounded">fbclid</code> and <code className="bg-[var(--color-line)] px-1 rounded">gclid</code>) that track who shared the page. Removing them clears that data without breaking the destination.
      </div>
    </div>
  );
}

