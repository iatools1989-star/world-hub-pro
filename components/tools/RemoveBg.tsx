'use client';

import React, { useState, useRef, useEffect } from 'react';

export default function RemoveBg() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [processedUrl, setProcessedUrl] = useState<string>('');
  const [tolerance, setTolerance] = useState<number>(35);
  const [feather, setFeather] = useState<number>(2);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<'transparent' | 'white' | 'black' | 'custom'>('transparent');
  const [customBgHex, setCustomBgHex] = useState<string>('#3B82F6');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith('image/')) {
      alert('Please select a valid image (PNG, JPG or WebP).');
      return;
    }

    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
    setProcessedUrl('');
  };

  // Processamento 100% no cliente em Canvas com remoção de fundo por amostragem de bordas
  const processImage = () => {
    if (!previewUrl) return;

    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = previewUrl;

    img.onload = () => {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Amostra a cor do fundo nos 4 cantos da imagem
      const corners = [
        [0, 0],
        [canvas.width - 1, 0],
        [0, canvas.height - 1],
        [canvas.width - 1, canvas.height - 1],
      ];

      let targetR = 0, targetG = 0, targetB = 0;
      corners.forEach(([x, y]) => {
        const idx = (y * canvas.width + x) * 4;
        targetR += data[idx];
        targetG += data[idx + 1];
        targetB += data[idx + 2];
      });

      targetR = Math.round(targetR / 4);
      targetG = Math.round(targetG / 4);
      targetB = Math.round(targetB / 4);

      const tolSq = (tolerance * 2.55) ** 2;

      // Remoção e suavização de bordas (alpha feathering)
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const distSq = (r - targetR) ** 2 + (g - targetG) ** 2 + (b - targetB) ** 2;

        if (distSq < tolSq) {
          // Totalmente transparente
          data[i + 3] = 0;
        } else if (distSq < tolSq * (1 + feather * 0.2)) {
          // Gradiente suave nas bordas para evitar corte serrilhado
          const factor = (distSq - tolSq) / (tolSq * (feather * 0.2 || 0.01));
          data[i + 3] = Math.round(255 * Math.min(1, Math.max(0, factor)));
        }
      }

      // Aplica a nova imagem com canal alpha
      ctx.putImageData(imgData, 0, 0);

      // Se o usuário selecionou fundo colorido
      if (bgColor !== 'transparent') {
        const compositeCanvas = document.createElement('canvas');
        compositeCanvas.width = canvas.width;
        compositeCanvas.height = canvas.height;
        const compCtx = compositeCanvas.getContext('2d');
        if (compCtx) {
          compCtx.fillStyle = bgColor === 'white' ? '#FFFFFF' : bgColor === 'black' ? '#000000' : customBgHex;
          compCtx.fillRect(0, 0, compositeCanvas.width, compositeCanvas.height);
          compCtx.drawImage(canvas, 0, 0);
          setProcessedUrl(compositeCanvas.toDataURL('image/png'));
          setIsProcessing(false);
          return;
        }
      }

      setProcessedUrl(canvas.toDataURL('image/png'));
      setIsProcessing(false);
    };

    img.onerror = () => {
      alert('Could not load the image into local memory.');
      setIsProcessing(false);
    };
  };

  useEffect(() => {
    if (previewUrl) {
      processImage();
    }
  }, [tolerance, feather, bgColor, customBgHex]);

  return (
    <div className="space-y-6">
      {/* Upload Drag & Drop */}
      <div className="border-2 border-dashed border-zinc-300 hover:border-zinc-500 rounded-[14px] p-8 text-center bg-[var(--color-surface)] transition cursor-pointer shadow-sm">
        <input
          type="file"
          id="remove-bg-input"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="remove-bg-input" className="cursor-pointer block space-y-3">
          <span className="text-4xl block">✂️</span>
          <div>
            <span className="font-black text-[var(--color-ink)] block text-base">
              {file ? file.name : 'Select an image to remove the background'}
            </span>
            <span className="text-xs text-[var(--color-ink-muted)] mt-1 block">
              100% Client-Side: instant Canvas processing — your photo is never uploaded.
            </span>
          </div>
        </label>
      </div>

      {file && (
        <div className="bg-[var(--color-surface)] p-6 sm:p-8 rounded-[14px] border border-[var(--color-line)] shadow-sm space-y-6">
          {/* Controles de Tolerância e Fundo */}
          <div className="grid sm:grid-cols-3 gap-5">
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-[var(--color-ink-muted)] mb-2">
                <span>Colour tolerance</span>
                <span className="font-mono text-[var(--color-ink)]">{tolerance}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                value={tolerance}
                onChange={(e) => setTolerance(Number(e.target.value))}
                className="w-full accent-zinc-900"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold text-[var(--color-ink-muted)] mb-2">
                <span>Edge smoothing</span>
                <span className="font-mono text-[var(--color-ink)]">{feather}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                value={feather}
                onChange={(e) => setFeather(Number(e.target.value))}
                className="w-full accent-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-ink-muted)] mb-2">New background</label>
              <div className="flex gap-2">
                {(['transparent', 'white', 'black', 'custom'] as const).map((bg) => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setBgColor(bg)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${
                      bgColor === bg
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'bg-[var(--color-surface-2)] border-[var(--color-line)] text-[var(--color-ink-soft)] hover:bg-zinc-100'
                    }`}
                  >
                    {bg === 'transparent' ? 'PNG' : bg === 'white' ? 'White' : bg === 'black' ? 'Black' : 'Colour'}
                  </button>
                ))}
                {bgColor === 'custom' && (
                  <input
                    type="color"
                    value={customBgHex}
                    onChange={(e) => setCustomBgHex(e.target.value)}
                    className="w-9 h-9 rounded-xl border cursor-pointer p-0.5"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Comparativo Lado a Lado */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[var(--color-ink-muted)] uppercase tracking-wider block">Original:</span>
              <div className="h-56 bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-[12px] flex items-center justify-center p-3 overflow-hidden">
                <img src={previewUrl} alt="Original image" className="max-h-full max-w-full object-contain rounded-lg" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[var(--color-ink-muted)] uppercase tracking-wider block">Fundo Removido:</span>
              <div
                className="h-56 border border-[var(--color-line)] rounded-[12px] flex items-center justify-center p-3 overflow-hidden"
                style={{
                  backgroundImage:
                    bgColor === 'transparent'
                      ? 'linear-gradient(45deg, #eee 25%, transparent 25%), linear-gradient(-45deg, #eee 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #eee 75%), linear-gradient(-45deg, transparent 75%, #eee 75%)'
                      : undefined,
                  backgroundSize: '16px 16px',
                  backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                  backgroundColor: bgColor === 'white' ? '#fff' : bgColor === 'black' ? '#000' : bgColor === 'custom' ? customBgHex : '#fff',
                }}
              >
                {isProcessing ? (
                  <span className="text-xs font-bold text-[var(--color-ink-muted)] animate-pulse">Processando pixels...</span>
                ) : processedUrl ? (
                  <img src={processedUrl} alt="Processada" className="max-h-full max-w-full object-contain rounded-lg" />
                ) : null}
              </div>
            </div>
          </div>

          {processedUrl && (
            <a
              href={processedUrl}
              download={`no-background-${file.name.replace(/\.[^/.]+$/, '')}.png`}
              className="w-full py-4 bg-zinc-900 text-white font-bold rounded-[12px] hover:bg-zinc-800 transition text-sm shadow-md flex items-center justify-center gap-2"
            >
              <span>⬇</span> Download transparent PNG
            </a>
          )}
        </div>
      )}
    </div>
  );
}
