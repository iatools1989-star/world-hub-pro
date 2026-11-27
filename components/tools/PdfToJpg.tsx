'use client';

import React, { useState } from 'react';

export default function PdfToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.type !== 'application/pdf') {
      alert('Please select a PDF file.');
      return;
    }

    setFile(selected);
    setPageImages([]);
    setStatusMessage('');
  };

  // Carrega dinamicamente a biblioteca CDN sem dependências estáticas do node_modules
  const convertPdfToJpg = async () => {
    if (!file) return;

    setIsProcessing(true);
    setStatusMessage('Starting the PDF renderer in your browser...');

    try {
      // Injeta pdfjs via script tag se ainda não estiver disponível na janela
      // pdf.js empacotado no bundle; o worker e servido do proprio dominio.
      const pdfjsLib = await import('pdfjs-dist/build/pdf');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      setStatusMessage(`Converting ${pdf.numPages} pages at high resolution...`);
      const convertedList: string[] = [];

      const maxPages = Math.min(pdf.numPages, 10);

      for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({ canvasContext: ctx, viewport }).promise;

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        convertedList.push(dataUrl);
      }

      setPageImages(convertedList);
      setStatusMessage('');
      setIsProcessing(false);
    } catch {
      setStatusMessage('Note: this PDF could not be converted locally. The file may be password-protected.');
      setIsProcessing(false);
    }
  };

  const downloadAll = () => {
    pageImages.forEach((imgUrl, index) => {
      const link = document.createElement('a');
      link.href = imgUrl;
      link.download = `pagina-${index + 1}.jpg`;
      link.click();
    });
  };

  return (
    <div className="space-y-6">
      {/* Upload Drag & Drop */}
      <div className="border-2 border-dashed border-[var(--color-line-strong)] hover:border-zinc-500 rounded-[14px] p-8 text-center bg-[var(--color-surface)] transition cursor-pointer shadow-sm">
        <input
          type="file"
          id="pdf-to-jpg-input"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="pdf-to-jpg-input" className="cursor-pointer block space-y-3">
          <span className="text-4xl block">📄</span>
          <div>
            <span className="font-black text-[var(--color-ink)] block text-base">
              {file ? file.name : 'Click to select your PDF document'}
            </span>
            <span className="text-xs text-[var(--color-ink-muted)] mt-1 block">
              100% private: pages are extracted locally with Canvas in your browser.
            </span>
          </div>
        </label>
      </div>

      {file && (
        <div className="bg-[var(--color-surface)] p-6 sm:p-8 rounded-[14px] border border-[var(--color-line)] shadow-sm space-y-6">
          <button
            onClick={convertPdfToJpg}
            disabled={isProcessing}
            type="button"
            className="w-full py-4 bg-yellow-400 text-zinc-950 font-black rounded-[12px] hover:bg-yellow-300 transition text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isProcessing ? '⏳' : '⚡'}</span>
            <span>{isProcessing ? 'Extracting pages in your browser...' : 'Convert PDF to JPG images'}</span>
          </button>

          {statusMessage && (
            <div className="p-3 bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-xl text-center text-xs text-[var(--color-ink-muted)] font-medium">
              {statusMessage}
            </div>
          )}

          {pageImages.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-[var(--color-line)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--color-ink-muted)] uppercase tracking-wider">
                  Converted pages ({pageImages.length}):
                </span>
                <button
                  onClick={downloadAll}
                  className="px-4 py-2 bg-[var(--color-btn-bg)] text-[var(--color-btn-fg)] rounded-xl text-xs font-bold hover:opacity-90 transition"
                >
                  Download all images
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {pageImages.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-[12px] flex flex-col items-center gap-2"
                  >
                    <img
                      src={imgUrl}
                      alt={`Page ${idx + 1}`}
                      className="w-full h-40 object-contain rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)]"
                    />
                    <div className="flex items-center justify-between w-full text-xs">
                      <span className="font-bold text-[var(--color-ink-soft)]">Page {idx + 1}</span>
                      <a
                        href={imgUrl}
                        download={`pagina-${idx + 1}.jpg`}
                        className="text-[var(--color-brand-deep)] font-bold hover:underline"
                      >
                        Download JPG
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
