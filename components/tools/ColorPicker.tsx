'use client';

import { useState } from 'react';

export default function ColorPicker() {
  const [color, setColor] = useState('#6366F1');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Conversões HEX para RGB e HSL
  const hexToRgb = (hex: string) => {
    let clean = hex.replace('#', '');
    if (clean.length === 3) {
      clean = clean.split('').map((c) => c + c).join('');
    }
    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  const rgb = hexToRgb(color);

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const colorFormats = [
    { label: 'HEX', value: color.toUpperCase() },
    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: 'CSS Var', value: `--color: ${color};` },
  ];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(label);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  // Paleta Gerada Automaticamente (Tons e Sombras)
  const generateShades = () => {
    return [0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4].map((multiplier) => {
      const newL = Math.min(100, Math.max(0, Math.round(hsl.l * multiplier)));
      return `hsl(${hsl.h}, ${hsl.s}%, ${newL}%)`;
    });
  };

  // Suporte à Extração de Cor com a EyeDropper API nativa
  const handleEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        setColor(result.sRGBHex);
      } catch {
        // Usuário cancelou ou fechou o dropper
      }
    } else {
      alert('Seu navegador não suporta captura direta de tela. Use o seletor visual abaixo.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Bloco Principal de Visualização */}
      <div className="grid md:grid-cols-[1fr_1.3fr] gap-6 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm items-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-full h-44 rounded-2xl shadow-inner border border-zinc-200 transition-colors flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: color }}
          >
            <span
              className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-xl text-white font-mono font-bold text-sm tracking-wider"
            >
              {color.toUpperCase()}
            </span>
          </div>

          <div className="flex gap-2 w-full">
            <label className="flex-1 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow">
              <span>🎨 Abrir Seletor</span>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="opacity-0 w-0 h-0 absolute"
              />
            </label>

            <button
              onClick={handleEyeDropper}
              className="py-3 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded-2xl text-xs flex items-center gap-1.5 transition"
              title="Conta-gotas da tela"
            >
              <span>🧪</span> Conta-Gotas
            </button>
          </div>
        </div>

        {/* Tabela de Códigos para Copiar */}
        <div className="space-y-2.5">
          {colorFormats.map((fmt) => (
            <div
              key={fmt.label}
              className="flex items-center justify-between p-3 bg-zinc-50 rounded-2xl border border-zinc-200"
            >
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  {fmt.label}
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold text-zinc-800">
                  {fmt.value}
                </span>
              </div>
              <button
                onClick={() => handleCopy(fmt.value, fmt.label)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  copiedFormat === fmt.label
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-800'
                }`}
              >
                {copiedFormat === fmt.label ? '✓ Copiado' : 'Copiar'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Paleta Dinâmica Harmônica */}
      <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm space-y-3">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
          Tons e Graduações de Brilho:
        </span>
        <div className="grid grid-cols-7 gap-2">
          {generateShades().map((shade, i) => (
            <div
              key={i}
              className="h-12 rounded-xl border border-black/10 shadow-sm cursor-pointer hover:scale-105 transition-transform"
              style={{ backgroundColor: shade }}
              title={shade}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
