'use client';

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

type QRType = 'url' | 'wifi' | 'text';

export default function QRGenerator() {
  const [activeTab, setActiveTab] = useState<QRType>('url');
  const [rawText, setRawText] = useState('https://iatools.online');
  
  // Wi-Fi inputs
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [wifiType, setWifiType] = useState('WPA');

  // Styling options
  const [size, setSize] = useState(300);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [svgDataUrl, setSvgDataUrl] = useState<string>('');

  // Constrói o payload final conforme a aba ativa
  const getPayload = (): string => {
    switch (activeTab) {
      case 'wifi':
        return `WIFI:T:${wifiType};S:${wifiSsid};P:${wifiPass};;`;
      case 'url':
      case 'text':
      default:
        return rawText.trim() || ' ';
    }
  };

  const payload = getPayload();

  // Renderização 100% Client-Side em Canvas e SVG
  useEffect(() => {
    if (!payload.trim()) return;

    // 1. Renderiza no Canvas para preview e download PNG
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        payload,
        {
          width: size,
          margin: 2,
          errorCorrectionLevel: errorLevel,
          color: {
            dark: fgColor,
            light: bgColor,
          },
        },
        (err) => {
          if (err) console.error('QR canvas rendering error:', err);
        }
      );
    }

    // 2. Gera a string SVG vetorial pura para download
    QRCode.toString(
      payload,
      {
        type: 'svg',
        margin: 2,
        errorCorrectionLevel: errorLevel,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      },
      (err, string) => {
        if (!err && string) {
          const blob = new Blob([string], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          setSvgDataUrl(url);
        }
      }
    );
  }, [payload, size, fgColor, bgColor, errorLevel]);

  // Download do PNG em alta definição gerado localmente
  const downloadPNG = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  // Download do SVG vetorial
  const downloadSVG = () => {
    if (!svgDataUrl) return;
    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.svg`;
    link.href = svgDataUrl;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Abas de Tipos Rápidos */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--color-line)] pb-3">
        {(['url', 'wifi', 'text'] as QRType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              activeTab === tab
                ? 'bg-zinc-900 text-yellow-400 shadow'
                : 'bg-zinc-100 text-[var(--color-ink-muted)] hover:bg-zinc-200'
            }`}
          >
            {tab === 'url' && '🔗 Link / URL'}
            {tab === 'wifi' && '📶 Wi-Fi'}
            {tab === 'text' && '📝 Plain Text'}
          </button>
        ))}
      </div>

      {/* Formulários dinâmicos por tipo */}
      <div className="bg-[var(--color-surface)] p-5 rounded-[12px] border border-[var(--color-line)] shadow-sm space-y-4">
        {activeTab === 'url' && (
          <div>
            <label className="block text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-wider mb-1">
              Website or Destination Link
            </label>
            <input
              type="url"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="https://exemplo.com"
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            />
          </div>
        )}

        {activeTab === 'wifi' && (
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-wider mb-1">
                Network name (SSID)
              </label>
              <input
                type="text"
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
                placeholder="Ex: MinhaCasa_5G"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-wider mb-1">
                Wi-Fi password
              </label>
              <input
                type="text"
                value={wifiPass}
                onChange={(e) => setWifiPass(e.target.value)}
                placeholder="Network password..."
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-wider mb-1">
                Criptografia
              </label>
              <select
                value={wifiType}
                onChange={(e) => setWifiType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm bg-[var(--color-surface)]"
              >
                <option value="WPA">WPA / WPA2 / WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Open network</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'text' && (
          <div>
            <label className="block text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-wider mb-1">
              Your text
            </label>
            <textarea
              rows={3}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Type any text..."
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm"
            />
          </div>
        )}

        {/* Opções Avançadas de Customização */}
        <div className="pt-4 border-t border-[var(--color-line)] grid grid-cols-2 sm:grid-cols-4 gap-4 items-center text-xs">
          <div>
            <span className="font-bold text-[var(--color-ink-muted)] block mb-1">Size: {size}px</span>
            <input
              type="range"
              min="150"
              max="600"
              step="25"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full accent-zinc-900"
            />
          </div>

          <div>
            <span className="font-bold text-[var(--color-ink-muted)] block mb-1">QR Color</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-8 h-8 rounded border cursor-pointer"
              />
              <span className="font-mono text-[11px]">{fgColor}</span>
            </div>
          </div>

          <div>
            <span className="font-bold text-[var(--color-ink-muted)] block mb-1">Background Color</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-8 h-8 rounded border cursor-pointer"
              />
              <span className="font-mono text-[11px]">{bgColor}</span>
            </div>
          </div>

          <div>
            <span className="font-bold text-[var(--color-ink-muted)] block mb-1">Error Correction</span>
            <select
              value={errorLevel}
              onChange={(e) => setErrorLevel(e.target.value as any)}
              className="w-full px-2 py-1.5 rounded-lg border border-zinc-300 bg-[var(--color-surface)] text-xs"
            >
              <option value="L">Low (7%)</option>
              <option value="M">Medium (15%)</option>
              <option value="Q">High (25%)</option>
              <option value="H">Maximum (30%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Área de Preview e Download */}
      <div className="p-8 bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[14px] flex flex-col items-center justify-center gap-5 shadow-sm">
        <div className="p-4 bg-[var(--color-surface)] rounded-[12px] shadow-inner border border-[var(--color-line)] flex items-center justify-center">
          <canvas ref={canvasRef} className="max-w-full rounded-lg" />
        </div>

        <div className="text-xs text-[var(--color-ink-muted)] font-medium text-center">
          ✓ 100% rendered in your browser — nothing is sent over the network.
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={downloadPNG}
            className="px-6 py-3 bg-zinc-900 text-white font-bold rounded-full hover:bg-zinc-800 transition text-sm flex items-center gap-2 shadow"
          >
            <span>⬇</span> Download PNG Image
          </button>
          <button
            onClick={downloadSVG}
            className="px-6 py-3 bg-yellow-400 text-zinc-950 font-bold rounded-full hover:bg-yellow-300 transition text-sm flex items-center gap-2 shadow"
          >
            <span>⚡</span> Download SVG Vector (Infinito)
          </button>
        </div>
      </div>
    </div>
  );
}

