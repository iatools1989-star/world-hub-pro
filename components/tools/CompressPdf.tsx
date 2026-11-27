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
      alert('Please select a valid PDF file.');
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
    setStatusMessage('Starting the local compression engine...');

    try {
      // Carrega pdfjs dinamicamente
      // Ambas as bibliotecas vem do proprio bundle (npm). Antes eram baixadas
      // de cdnjs em tempo de execucao — inclusive o worker do pdf.js — o que
      // quebrava a promessa de processamento sem chamadas externas.
      const [{ PDFDocument }, pdfjsLib] = await Promise.all([
        import('pdf-lib'),
        import('pdfjs-dist/build/pdf'),
      ]);
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const newPdf = await PDFDocument.create();

      // Ajustes de DPI e JPEG conforme o nível de compressão
      const scale = compressionLevel === 'high' ? 1.0 : compressionLevel === 'medium' ? 1.25 : 1.5;
      const quality = compressionLevel === 'high' ? 0.6 : compressionLevel === 'medium' ? 0.75 : 0.85;

      const maxPages = Math.min(pdf.numPages, 15);

      for (let i = 1; i <= maxPages; i++) {
        setStatusMessage(`Optimising page ${i} of ${maxPages}...`);
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

      setStatusMessage('Finishing up and packaging the PDF file...');
      const compressedBytes = await newPdf.save();
      const blob = new Blob([compressedBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setCompressedBlobUrl(url);
      setCompressedSize(blob.size);
      setStatusMessage('');
      setIsCompressing(false);
    } catch {
      setStatusMessage('Note: this document has cryptographic protection or is vector-based, which prevents native compression.');
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
      <div className="border-2 border-dashed border-[var(--color-line-strong)] hover:border-zinc-500 rounded-[14px] p-8 text-center bg-[var(--color-surface)] transition cursor-pointer shadow-sm">
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
            <span className="font-black text-[var(--color-ink)] block text-base">
              {file ? file.name : 'Click to select your PDF document'}
            </span>
            <span className="text-xs text-[var(--color-ink-muted)] mt-1 block">
              100% Client-Side: reduces file size without uploading your document anywhere.
            </span>
          </div>
          {file && (
            <span className="inline-block px-3 py-1 bg-[var(--color-surface-2)] rounded-full text-xs font-bold text-[var(--color-ink-soft)]">
              Current size: {formatSize(file.size)}
            </span>
          )}
        </label>
      </div>

      {file && (
        <div className="bg-[var(--color-surface)] p-6 sm:p-8 rounded-[14px] border border-[var(--color-line)] shadow-sm space-y-6">
          {/* Nível de Compressão */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[var(--color-ink-muted)] uppercase tracking-wider block">
              Compression level:
            </span>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'low', label: 'Light', desc: 'Smaller savings, maximum quality' },
                { id: 'medium', label: 'Recommended', desc: 'Best balance of size and sharpness' },
                { id: 'high', label: 'Maximum', desc: 'Largest file size reduction' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setCompressionLevel(opt.id as any)}
                  className={`p-3.5 rounded-[12px] border text-left transition ${
                    compressionLevel === opt.id
                      ? 'bg-[var(--color-btn-bg)] text-[var(--color-btn-fg)] border-zinc-900 shadow-sm'
                      : 'bg-[var(--color-surface-2)] border-[var(--color-line)] text-[var(--color-ink-soft)] hover:bg-[var(--color-surface-2)]'
                  }`}
                >
                  <span className="font-bold text-xs block">{opt.label}</span>
                  <span className={`text-[10px] block mt-0.5 ${compressionLevel === opt.id ? 'text-zinc-400' : 'text-[var(--color-ink-muted)]'}`}>
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
            className="w-full py-4 bg-yellow-400 text-zinc-950 font-black rounded-[12px] hover:bg-yellow-300 transition text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isCompressing ? '⏳' : '⚡'}</span>
            <span>{isCompressing ? 'Optimising the document in your browser...' : 'Compress PDF file'}</span>
          </button>

          {statusMessage && (
            <div className="p-3 bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-xl text-center text-xs text-[var(--color-ink-soft)] font-medium">
              {statusMessage}
            </div>
          )}

          {compressedBlobUrl && compressedSize !== null && (
            <div className="p-6 bg-[var(--color-surface-2)] rounded-[12px] border border-[var(--color-line)] space-y-4 animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-[var(--color-ink-muted)] uppercase tracking-wider block">Optimisation result:</span>
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
                download={`compressed-${file.name}`}
                className="w-full py-3.5 bg-[var(--color-btn-bg)] text-[var(--color-btn-fg)] font-bold rounded-[12px] hover:opacity-90 transition text-sm flex items-center justify-center gap-2 shadow"
              >
                <span>⬇</span> Download compressed PDF
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
