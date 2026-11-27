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

  /**
   * Gera um PDF de verdade com pdf-lib, no proprio navegador.
   *
   * Antes esta funcao abria uma janela e chamava window.print(), torcendo para
   * o visitante escolher "Salvar como PDF" no dialogo. No celular o navegador
   * costuma bloquear a janela e a ferramenta falhava sem avisar nada. Agora o
   * arquivo e baixado direto, com a imagem embutida e o tamanho de pagina
   * respeitado.
   */
  const generatePdf = async () => {
    if (!images.length) return;
    setIsGenerating(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const pdf = await PDFDocument.create();

      // Medidas em pontos (1 pt = 1/72 pol). A4 = 595,28 x 841,89.
      const A4: [number, number] =
        orientation === 'portrait' ? [595.28, 841.89] : [841.89, 595.28];

      for (const img of images) {
        const bytes = await img.file.arrayBuffer();
        // PDF so aceita JPEG e PNG embutidos. WebP e outros formatos passam por
        // um canvas antes de entrar no documento.
        let embutida;
        if (img.file.type === 'image/png') {
          embutida = await pdf.embedPng(bytes);
        } else if (img.file.type === 'image/jpeg') {
          embutida = await pdf.embedJpg(bytes);
        } else {
          const bitmap = await createImageBitmap(img.file);
          const canvas = document.createElement('canvas');
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          canvas.getContext('2d')!.drawImage(bitmap, 0, 0);
          const jpegUrl = canvas.toDataURL('image/jpeg', 0.92);
          const jpegBytes = await (await fetch(jpegUrl)).arrayBuffer();
          embutida = await pdf.embedJpg(jpegBytes);
        }

        let largura: number;
        let altura: number;
        if (pageSize === 'a4') {
          [largura, altura] = A4;
        } else {
          // "Ajustar a imagem": a pagina tem exatamente o tamanho da imagem
          largura = embutida.width;
          altura = embutida.height;
        }

        const pagina = pdf.addPage([largura, altura]);
        const escala = Math.min(
          (largura - 24) / embutida.width,
          (altura - 24) / embutida.height
        );
        const w = embutida.width * escala;
        const h = embutida.height * escala;
        pagina.drawImage(embutida, {
          x: (largura - w) / 2,
          y: (altura - h) / 2,
          width: w,
          height: h,
        });
      }

      const bytes = await pdf.save();
      const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `images-to-pdf-${Date.now()}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch {
      alert('Something went wrong while generating the PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Múltiplo */}
      <div className="border-2 border-dashed border-[var(--color-line-strong)] hover:border-zinc-500 rounded-[14px] p-8 text-center bg-[var(--color-surface)] transition cursor-pointer shadow-sm">
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
                className="w-full p-2.5 rounded-xl border border-[var(--color-line-strong)] text-sm bg-[var(--color-surface)] font-medium cursor-pointer"
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
                className="w-full p-2.5 rounded-xl border border-[var(--color-line-strong)] text-sm bg-[var(--color-surface)] font-medium cursor-pointer"
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
                      className="p-1 hover:bg-[var(--color-line)] rounded text-xs disabled:opacity-20"
                      title="Move up"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === images.length - 1}
                      className="p-1 hover:bg-[var(--color-line)] rounded text-xs disabled:opacity-20"
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

