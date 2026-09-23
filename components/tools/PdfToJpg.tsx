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
      alert('Por favor, selecione um arquivo no formato PDF.');
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
    setStatusMessage('Inicializando motor de renderização PDF no navegador...');

    try {
      // Injeta pdfjs via script tag se ainda não estiver disponível na janela
      if (!(window as any).pdfjsLib) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      const pdfjsLib = (window as any).pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      setStatusMessage(`Convertendo ${pdf.numPages} páginas em alta definição...`);
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
      setStatusMessage('Nota: Não foi possível converter este PDF localmente. O arquivo pode estar protegido por senha.');
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
      <div className="border-2 border-dashed border-zinc-300 hover:border-zinc-500 rounded-3xl p-8 text-center bg-white transition cursor-pointer shadow-sm">
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
            <span className="font-black text-zinc-900 block text-base">
              {file ? file.name : 'Clique para selecionar seu documento PDF'}
            </span>
            <span className="text-xs text-zinc-500 mt-1 block">
              100% Privado: páginas extraídas localmente via Canvas no seu navegador.
            </span>
          </div>
        </label>
      </div>

      {file && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <button
            onClick={convertPdfToJpg}
            disabled={isProcessing}
            type="button"
            className="w-full py-4 bg-yellow-400 text-zinc-950 font-black rounded-2xl hover:bg-yellow-300 transition text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isProcessing ? '⏳' : '⚡'}</span>
            <span>{isProcessing ? 'Extraindo páginas no navegador...' : 'Converter PDF para Imagens JPG'}</span>
          </button>

          {statusMessage && (
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-center text-xs text-zinc-600 font-medium">
              {statusMessage}
            </div>
          )}

          {pageImages.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Páginas Convertidas ({pageImages.length}):
                </span>
                <button
                  onClick={downloadAll}
                  className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition"
                >
                  Baixar Todas as Imagens
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {pageImages.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-zinc-50 border border-zinc-200 rounded-2xl flex flex-col items-center gap-2"
                  >
                    <img
                      src={imgUrl}
                      alt={`Página ${idx + 1}`}
                      className="w-full h-40 object-contain rounded-xl border border-zinc-200 bg-white"
                    />
                    <div className="flex items-center justify-between w-full text-xs">
                      <span className="font-bold text-zinc-700">Pág. {idx + 1}</span>
                      <a
                        href={imgUrl}
                        download={`pagina-${idx + 1}.jpg`}
                        className="text-yellow-600 font-bold hover:underline"
                      >
                        Baixar JPG
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
