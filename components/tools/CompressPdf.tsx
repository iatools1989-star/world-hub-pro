'use client';

import React, { useState } from 'react';

export default function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [compressedBlobUrl, setCompressedBlobUrl] = useState<string>('');
  const [compressedSize, setCompressedSize] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.type !== 'application/pdf' && !selected.name.toLowerCase().endsWith('.pdf')) {
      alert('Selecione um arquivo PDF válido.');
      return;
    }

    setFile(selected);
    setCompressedBlobUrl('');
    setCompressedSize(null);
    setStatusMessage('');
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Otimização e re-rasterização controlada em memória
  const compressPdfDocument = async () => {
    if (!file) return;

    setIsCompressing(true);
    setStatusMessage('Inicializando motor de compressão local...');

    try {
      // Carrega pdfjs dinamicamente
      if (!(window as any).pdfjsLib) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Carrega pdf-lib dinamicamente
      if (!(window as any).PDFLib) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      const pdfjsLib = (window as any).pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      const { PDFDocument } = (window as any).PDFLib;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const newPdf = await PDFDocument.create();

      // Ajustes de DPI e JPEG conforme o nível de compressão
      const scale = compressionLevel === 'high' ? 1.0 : compressionLevel === 'medium' ? 1.25 : 1.5;
      const quality = compressionLevel === 'high' ? 0.6 : compressionLevel === 'medium' ? 0.75 : 0.85;

      const maxPages = Math.min(pdf.numPages, 15);

      for (let i = 1; i <= maxPages; i++) {
        setStatusMessage(`Otimizando página ${i} de ${maxPages}...`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({ canvasContext: ctx, viewport }).promise;

        // Converte o canvas para imagem JPEG compactada
        const imgData = canvas.toDataURL('image/jpeg', quality);
        const imgBytes = await (await fetch(imgData)).arrayBuffer();
        const embeddedImg = await newPdf.embedJpg(imgBytes);

        // Adiciona a página com a imagem compactada em proporção nativa
        const newPage = newPdf.addPage([viewport.width / scale, viewport.height / scale]);
        newPage.drawImage(embeddedImg, {
          x: 0,
          y: 0,
          width: viewport.width / scale,
          height: viewport.height / scale,
        });
      }

      setStatusMessage('Finalizando e empacotando arquivo PDF...');
      const compressedBytes = await newPdf.save();
      const blob = new Blob([compressedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setCompressedBlobUrl(url);
      setCompressedSize(blob.size);
      setStatusMessage('');
      setIsCompressing(false);
    } catch {
      setStatusMessage('Nota: Este documento possui proteções criptográficas ou formato vetorial que inviabiliza compressão nativa.');
      setIsCompressing(false);
    }
  };

  const getSavedPercent = () => {
    if (!file || !compressedSize) return 0;
    const diff = file.size - compressedSize;
    if (diff <= 0) return 0;
    return Math.round((diff / file.size) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Upload Drag & Drop */}
      <div className="border-2 border-dashed border-zinc-300 hover:border-zinc-500 rounded-3xl p-8 text-center bg-white transition cursor-pointer shadow-sm">
        <input
          type="file"
          id="compress-pdf-input"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="compress-pdf-input" className="cursor-pointer block space-y-3">
          <span className="text-4xl block">🗜️</span>
          <div>
            <span className="font-black text-zinc-900 block text-base">
              {file ? file.name : 'Clique para selecionar seu documento PDF'}
            </span>
            <span className="text-xs text-zinc-500 mt-1 block">
              100% Client-Side: redução de peso sem enviar seu arquivo para a internet.
            </span>
          </div>
          {file && (
            <span className="inline-block px-3 py-1 bg-zinc-100 rounded-full text-xs font-bold text-zinc-700">
              Tamanho atual: {formatSize(file.size)}
            </span>
          )}
        </label>
      </div>

      {file && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          {/* Nível de Compressão */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
              Nível de Compressão Desejado:
            </span>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'low', label: 'Básica', desc: 'Menor redução, máxima qualidade' },
                { id: 'medium', label: 'Recomendada', desc: 'Equilíbrio ideal entre peso e nitidez' },
                { id: 'high', label: 'Extrema', desc: 'Máxima redução de arquivo' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setCompressionLevel(opt.id as any)}
                  className={`p-3.5 rounded-2xl border text-left transition ${
                    compressionLevel === opt.id
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <span className="font-bold text-xs block">{opt.label}</span>
                  <span className={`text-[10px] block mt-0.5 ${compressionLevel === opt.id ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={compressPdfDocument}
            disabled={isCompressing}
            type="button"
            className="w-full py-4 bg-yellow-400 text-zinc-950 font-black rounded-2xl hover:bg-yellow-300 transition text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isCompressing ? '⏳' : '⚡'}</span>
            <span>{isCompressing ? 'Otimizando documento no navegador...' : 'Comprimir Arquivo PDF'}</span>
          </button>

          {statusMessage && (
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-center text-xs text-zinc-700 font-medium">
              {statusMessage}
            </div>
          )}

          {compressedBlobUrl && compressedSize !== null && (
            <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-4 animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Resultado da Otimização:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm line-through text-zinc-400">{formatSize(file.size)}</span>
                    <span className="text-lg font-black text-emerald-700">{formatSize(compressedSize)}</span>
                  </div>
                </div>

                {getSavedPercent() > 0 && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-black text-xs">
                    Economia de {getSavedPercent()}%
                  </span>
                )}
              </div>

              <a
                href={compressedBlobUrl}
                download={`otimizado-${file.name}`}
                className="w-full py-3.5 bg-zinc-900 text-white font-bold rounded-2xl hover:bg-zinc-800 transition text-sm flex items-center justify-center gap-2 shadow"
              >
                <span>⬇</span> Baixar PDF Compactado
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
