'use client';

import React, { useState, useRef } from 'react';

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [quality, setQuality] = useState<number>(80);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [scalePercent, setScalePercent] = useState<number>(100);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith('image/')) {
      alert('Por favor, envie um arquivo de imagem válido (JPG, PNG ou WebP).');
      return;
    }

    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
    setCompressedBlob(null);
    setCompressedUrl('');
  };

  const compressImage = async () => {
    if (!file || !previewUrl) return;

    setIsProcessing(true);

    try {
      const img = new Image();
      img.src = previewUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      const targetWidth = Math.round((img.width * scalePercent) / 100);
      const targetHeight = Math.round((img.height * scalePercent) / 100);

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Não foi possível inicializar o canvas.');

      // Se for JPEG, garante fundo branco se houver transparência
      if (outputFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressedBlob(blob);
            const downloadUrl = URL.createObjectURL(blob);
            setCompressedUrl(downloadUrl);
          }
          setIsProcessing(false);
        },
        outputFormat,
        outputFormat === 'image/png' ? undefined : quality / 100
      );
    } catch {
      alert('Erro ao comprimir imagem localmente.');
      setIsProcessing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSavedPercentage = () => {
    if (!file || !compressedBlob) return 0;
    const diff = file.size - compressedBlob.size;
    if (diff <= 0) return 0;
    return Math.round((diff / file.size) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Upload Drag & Drop */}
      <div className="border-2 border-dashed border-zinc-300 hover:border-zinc-500 rounded-3xl p-8 text-center bg-white transition cursor-pointer shadow-sm">
        <input
          type="file"
          id="img-upload-input"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="img-upload-input" className="cursor-pointer block space-y-3">
          <span className="text-4xl block">🖼️</span>
          <div>
            <span className="font-black text-zinc-900 block text-base">
              {file ? file.name : 'Selecione ou arraste sua imagem JPG, PNG ou WebP'}
            </span>
            <span className="text-xs text-zinc-500 mt-1 block">
              100% Client-Side: sua foto é processada no seu navegador sem ir para a nuvem.
            </span>
          </div>
          {file && (
            <span className="inline-block px-3 py-1 bg-zinc-100 rounded-full text-xs font-bold text-zinc-700">
              Tamanho original: {formatSize(file.size)}
            </span>
          )}
        </label>
      </div>

      {file && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          {/* Controles de Qualidade e Formato */}
          <div className="grid sm:grid-cols-3 gap-5">
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-zinc-600 mb-2">
                <span>Qualidade de Compressão</span>
                <span className="font-mono text-zinc-900">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-zinc-900"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold text-zinc-600 mb-2">
                <span>Dimensão (Escala)</span>
                <span className="font-mono text-zinc-900">{scalePercent}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={scalePercent}
                onChange={(e) => setScalePercent(Number(e.target.value))}
                className="w-full accent-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-600 mb-2">Formato de Saída</label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-zinc-300 text-sm bg-white font-medium cursor-pointer"
              >
                <option value="image/jpeg">JPEG (.jpg)</option>
                <option value="image/webp">WebP (.webp - Máxima compressão)</option>
                <option value="image/png">PNG (.png)</option>
              </select>
            </div>
          </div>

          <button
            onClick={compressImage}
            disabled={isProcessing}
            type="button"
            className="w-full py-4 bg-yellow-400 text-zinc-950 font-black rounded-2xl hover:bg-yellow-300 transition text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isProcessing ? '⏳' : '⚡'}</span>
            <span>{isProcessing ? 'Comprimindo no navegador...' : 'Comprimir Imagem Agora'}</span>
          </button>

          {/* Comparativo de Resultados */}
          {compressedBlob && (
            <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Resultado:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm line-through text-zinc-400">{formatSize(file.size)}</span>
                    <span className="text-lg font-black text-emerald-700">{formatSize(compressedBlob.size)}</span>
                  </div>
                </div>

                {getSavedPercentage() > 0 && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-black text-xs">
                    Economia de {getSavedPercentage()}%
                  </span>
                )}
              </div>

              <a
                href={compressedUrl}
                download={`comprimido-${file.name.replace(/\.[^/.]+$/, '')}.${outputFormat.split('/')[1]}`}
                className="w-full py-3.5 bg-zinc-900 text-white font-bold rounded-2xl hover:bg-zinc-800 transition text-sm flex items-center justify-center gap-2 shadow"
              >
                <span>⬇</span> Baixar Imagem Otimizada
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
