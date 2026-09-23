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
        alert('Por favor, autorize pop-ups para gerar seu PDF com alta fidelidade.');
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
      alert('Erro ao processar as páginas do PDF.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Múltiplo */}
      <div className="border-2 border-dashed border-zinc-300 hover:border-zinc-500 rounded-3xl p-8 text-center bg-white transition cursor-pointer shadow-sm">
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
            <span className="font-black text-zinc-900 block text-base">
              Clique para selecionar ou solte várias imagens aqui
            </span>
            <span className="text-xs text-zinc-500 mt-1 block">
              Junte fotos JPG, PNG e WebP em um único documento PDF em ordem personalizada.
            </span>
          </div>
        </label>
      </div>

      {images.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          {/* Opções de Diagramação */}
          <div className="grid sm:grid-cols-2 gap-4 pb-4 border-b border-zinc-100">
            <div>
              <label className="block text-xs font-bold text-zinc-600 mb-1.5 uppercase tracking-wider">
                Tamanho da Página
              </label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-zinc-300 text-sm bg-white font-medium cursor-pointer"
              >
                <option value="a4">Padrão A4 (Ideal para Impressão)</option>
                <option value="fit">Ajustar ao tamanho da imagem</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-600 mb-1.5 uppercase tracking-wider">
                Orientação
              </label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-zinc-300 text-sm bg-white font-medium cursor-pointer"
              >
                <option value="portrait">Retrato (Vertical)</option>
                <option value="landscape">Paisagem (Horizontal)</option>
              </select>
            </div>
          </div>

          {/* Lista e Ordenação de Páginas */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
              Páginas ({images.length} selecionadas — Reordene conforme desejar):
            </span>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {images.map((img, index) => (
                <div
                  key={img.id}
                  className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center gap-3 relative group"
                >
                  <img
                    src={img.previewUrl}
                    alt={img.file.name}
                    className="w-14 h-14 object-cover rounded-xl border border-zinc-200 bg-white"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-xs text-zinc-900 block truncate">
                      Página {index + 1}
                    </span>
                    <span className="text-[10px] text-zinc-500 truncate block">
                      {img.file.name}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="p-1 hover:bg-zinc-200 rounded text-xs disabled:opacity-20"
                      title="Mover para cima"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === images.length - 1}
                      className="p-1 hover:bg-zinc-200 rounded text-xs disabled:opacity-20"
                      title="Mover para baixo"
                    >
                      ▼
                    </button>
                  </div>

                  <button
                    onClick={() => removeImage(img.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg text-xs"
                    title="Excluir página"
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
            className="w-full py-4 bg-yellow-400 text-zinc-950 font-black rounded-2xl hover:bg-yellow-300 transition text-sm shadow-md flex items-center justify-center gap-2"
          >
            <span>{isGenerating ? '⏳' : '⚡'}</span>
            <span>{isGenerating ? 'Processando Documento...' : 'Gerar e Salvar Documento PDF'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
