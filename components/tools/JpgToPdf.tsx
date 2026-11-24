'use client';

import React, { useState } from 'react';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

export default function JpgToPdf() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'fit'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newItems: ImageItem[] = files
      .filter((f) => f.type.startsWith('image/'))
      .map((f) => ({
        id: Math.random().toString(36).substring(7),
        file: f,
        previewUrl: URL.createObjectURL(f),
      }));

    setImages((prev) => [...prev, ...newItems]);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const moveDown = (index: number) => {
    if (index === images.length - 1) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // Conversão de Imagens para PDF Nativo em Canvas/Print ou Download
  const generatePdf = async () => {
    if (!images.length) return;
    setIsGenerating(true);

    try {
      // Cria uma janela temporária formatada para impressão/salvamento direto como PDF nativo
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow pop-ups so we can generate your PDF at full fidelity.');
        setIsGenerating(false);
        return;
      }

      const imgTags = images
        .map(
          (img) => `
          <div class="page ${pageSize === 'a4' ? orientation : ''}">
            <img src="${img.previewUrl}" alt="Page" />
          </div>
        `
        )
        .join('');

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Documento_Convertido_${Date.now()}</title>
          <style>
            @page {
              size: ${pageSize === 'a4' ? (orientation === 'portrait' ? 'A4 portrait' : 'A4 landscape') : 'auto'};
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              background-color: #f4f4f5;
              display: flex;
              flex-direction: column;
              align-items: center;
              font-family: sans-serif;
            }
            .page {
              page-break-after: always;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100vw;
              height: 100vh;
              overflow: hidden;
            }
            .page img {
              max-width: 95%;
              max-height: 95%;
              object-fit: contain;
            }
            @media print {
              body { background: transparent; }
              .page { width: 100%; height: 100%; }
            }
          </style>
        </head>
        <body>
          ${imgTags}
          <script>
            window.onload = function() {
              window.focus();
              window.print();
            };
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
      setIsGenerating(false);
    } catch {
      alert('Something went wrong while processing the PDF pages.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Múltiplo */}
      <div className="border-2 border-dashed border-zinc-300 hover:border-zinc-500 rounded-[14px] p-8 text-center bg-[var(--color-surface)] transition cursor-pointer shadow-sm">
        <input
          type="file"
          id="jpg-to-pdf-input"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFiles}
          className="hidden"
        />
        <label htmlFor="jpg-to-pdf-input" className="cursor-pointer block space-y-3">
          <span className="text-4xl block">📚</span>
          <div>
            <span className="font-black text-[var(--color-ink)] block text-base">
              Click to select or drop multiple images here
            </span>
            <span className="text-xs text-[var(--color-ink-muted)] mt-1 block">
              Join JPG, PNG and WebP images into a single PDF, in any order you like.
            </span>
          </div>
        </label>
      </div>

      {images.length > 0 && (
        <div className="bg-[var(--color-surface)] p-6 sm:p-8 rounded-[14px] border border-[var(--color-line)] shadow-sm space-y-6">
          {/* Opções de Diagramação */}
          <div className="grid sm:grid-cols-2 gap-4 pb-4 border-b border-[var(--color-line)]">
            <div>
              <label className="block text-xs font-bold text-[var(--color-ink-muted)] mb-1.5 uppercase tracking-wider">
                Page size
              </label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-zinc-300 text-sm bg-[var(--color-surface)] font-medium cursor-pointer"
              >
                <option value="a4">Standard A4 (best for printing)</option>
                <option value="fit">Fit to image size</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-ink-muted)] mb-1.5 uppercase tracking-wider">
                Orientation
              </label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-zinc-300 text-sm bg-[var(--color-surface)] font-medium cursor-pointer"
              >
                <option value="portrait">Portrait (vertical)</option>
                <option value="landscape">Landscape (horizontal)</option>
              </select>
            </div>
          </div>

          {/* Lista e Ordenação de Páginas */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-[var(--color-ink-muted)] uppercase tracking-wider block">
              Pages ({images.length} selected — drag or use the arrows to reorder):
            </span>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {images.map((img, index) => (
                <div
                  key={img.id}
                  className="p-3 bg-[var(--color-surface-2)] rounded-[12px] border border-[var(--color-line)] flex items-center gap-3 relative group"
                >
                  <img
                    src={img.previewUrl}
                    alt={img.file.name}
                    className="w-14 h-14 object-cover rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)]"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-xs text-[var(--color-ink)] block truncate">
                      Page {index + 1}
                    </span>
                    <span className="text-[10px] text-[var(--color-ink-muted)] truncate block">
                      {img.file.name}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="p-1 hover:bg-zinc-200 rounded text-xs disabled:opacity-20"
                      title="Move up"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === images.length - 1}
                      className="p-1 hover:bg-zinc-200 rounded text-xs disabled:opacity-20"
                      title="Move down"
                    >
                      ▼
                    </button>
                  </div>

                  <button
                    onClick={() => removeImage(img.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg text-xs"
                    title="Remove page"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={generatePdf}
            disabled={isGenerating}
            type="button"
            className="w-full py-4 bg-yellow-400 text-zinc-950 font-black rounded-[12px] hover:bg-yellow-300 transition text-sm shadow-md flex items-center justify-center gap-2"
          >
            <span>{isGenerating ? '⏳' : '⚡'}</span>
            <span>{isGenerating ? 'Processing document...' : 'Generate and save PDF'}</span>
          </button>
        </div>
      )}
    </div>
  );
}

