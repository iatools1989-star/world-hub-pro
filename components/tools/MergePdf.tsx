'use client';

import React, { useState } from 'react';

interface PdfFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
}

export default function MergePdf() {
  const [pdfFiles, setPdfFiles] = useState<PdfFileItem[]>([]);
  const [isMerging, setIsMerging] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [mergedBlobUrl, setMergedBlobUrl] = useState<string>('');

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    const validPdfs = selected
      .filter((f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'))
      .map((f) => ({
        id: Math.random().toString(36).substring(7),
        file: f,
        name: f.name,
        size: f.size,
      }));

    if (validPdfs.length === 0) {
      alert('Selecione arquivos PDF válidos.');
      return;
    }

    setPdfFiles((prev) => [...prev, ...validPdfs]);
    setMergedBlobUrl('');
    setStatusMessage('');
  };

  const removePdf = (id: string) => {
    setPdfFiles((prev) => prev.filter((p) => p.id !== id));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setPdfFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const moveDown = (index: number) => {
    if (index === pdfFiles.length - 1) return;
    setPdfFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Mesclagem 100% no cliente usando pdf-lib carregado dinamicamente
  const mergeDocuments = async () => {
    if (pdfFiles.length < 2) {
      alert('Adicione pelo menos 2 arquivos PDF para mesclar.');
      return;
    }

    setIsMerging(true);
    setStatusMessage('Carregando biblioteca de manipulação PDF em memória...');

    try {
      if (!(window as any).PDFLib) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      const { PDFDocument } = (window as any).PDFLib;
      setStatusMessage('Criando documento PDF consolidado...');

      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < pdfFiles.length; i++) {
        setStatusMessage(`Mesclando arquivo ${i + 1} de ${pdfFiles.length}: "${pdfFiles[i].name}"...`);
        const arrayBuffer = await pdfFiles[i].file.arrayBuffer();
        const donorPdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(donorPdf, donorPdf.getPageIndices());
        copiedPages.forEach((page: any) => mergedPdf.addPage(page));
      }

      setStatusMessage('Finalizando e gerando arquivo...');
      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setMergedBlobUrl(url);
      setStatusMessage('Sucesso! Seu PDF mesclado está pronto para download.');
      setIsMerging(false);
    } catch {
      setStatusMessage('Nota: Um dos arquivos PDF pode estar corrompido ou protegido por senha restritiva.');
      setIsMerging(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Drag & Drop */}
      <div className="border-2 border-dashed border-zinc-300 hover:border-zinc-500 rounded-3xl p-8 text-center bg-white transition cursor-pointer shadow-sm">
        <input
          type="file"
          id="merge-pdf-input"
          multiple
          accept="application/pdf"
          onChange={handleFiles}
          className="hidden"
        />
        <label htmlFor="merge-pdf-input" className="cursor-pointer block space-y-3">
          <span className="text-4xl block">📚</span>
          <div>
            <span className="font-black text-zinc-900 block text-base">
              Selecione ou arraste múltiplos arquivos PDF para juntar
            </span>
            <span className="text-xs text-zinc-500 mt-1 block">
              100% Client-Side: todo o processo roda na memória local sem envio para servidores.
            </span>
          </div>
        </label>
      </div>

      {pdfFiles.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                Ordem dos Arquivos ({pdfFiles.length} adicionados):
              </span>
              <button
                onClick={() => setPdfFiles([])}
                className="text-xs font-bold text-red-600 hover:underline"
              >
                Limpar Todos
              </button>
            </div>

            <div className="space-y-2">
              {pdfFiles.map((item, index) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 bg-zinc-900 text-white rounded-lg flex items-center justify-center text-xs font-black shrink-0">
                      {index + 1}
                    </span>
                    <div className="truncate">
                      <span className="font-bold text-xs text-zinc-900 block truncate">{item.name}</span>
                      <span className="text-[10px] text-zinc-500 font-medium">{formatSize(item.size)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="p-1.5 hover:bg-zinc-200 rounded-lg text-xs disabled:opacity-20"
                      title="Mover para cima"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === pdfFiles.length - 1}
                      className="p-1.5 hover:bg-zinc-200 rounded-lg text-xs disabled:opacity-20"
                      title="Mover para baixo"
                    >
                      ▼
                    </button>
                    <button
                      onClick={() => removePdf(item.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg text-xs font-bold ml-1"
                      title="Remover arquivo"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={mergeDocuments}
            disabled={isMerging || pdfFiles.length < 2}
            type="button"
            className="w-full py-4 bg-yellow-400 text-zinc-950 font-black rounded-2xl hover:bg-yellow-300 transition text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isMerging ? '⏳' : '⚡'}</span>
            <span>{isMerging ? 'Mesclando PDFs no navegador...' : 'Juntar Todos os Documentos PDF'}</span>
          </button>

          {statusMessage && (
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-center text-xs text-zinc-700 font-medium">
              {statusMessage}
            </div>
          )}

          {mergedBlobUrl && (
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎉</span>
                <span className="text-xs font-bold text-emerald-900">
                  Documento combinado com sucesso!
                </span>
              </div>
              <a
                href={mergedBlobUrl}
                download={`documento-combinado-${Date.now()}.pdf`}
                className="px-6 py-2.5 bg-zinc-900 text-white font-bold rounded-xl text-xs hover:bg-zinc-800 transition shadow"
              >
                ⬇ Baixar PDF Mesclado
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
