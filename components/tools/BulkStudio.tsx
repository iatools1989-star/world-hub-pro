'use client';

import { useRef, useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Private Bulk Studio: redimensiona varias imagens e entrega um ZIP, tudo no
 * navegador.
 *
 * O QUE ESTAVA ERRADO ANTES (e por que cada linha mudou)
 *
 * 1. **A imagem era esticada.** O canvas era sempre 2000x2000 e o desenho
 *    preenchia o quadro inteiro. Uma foto 1600x900 virava 2000x2000 com o
 *    conteudo deformado — o oposto do que um "SEO de imagem" precisa. Agora a
 *    maior dimensao vira no maximo 2000 e a proporcao e preservada.
 *
 * 2. **JPG com fundo branco colado por cima.** Aplicar fundo branco e util
 *    para PNG transparente, e inutil (e levemente destrutivo) para JPG. So
 *    entra quando a imagem tem transparencia de verdade.
 *
 * 3. **Contador de uso escondido em localStorage pela data.** Gravava um
 *    numero por dia no armazenamento do visitante e nunca mostrava nada. Nao
 *    servia para o visitante nem para o autor. Saiu.
 *
 * 4. **A tela nao dizia nada enquanto trabalhava.** Sem barra, sem nome do
 *    arquivo, sem contagem. Em 100 fotos isso e a diferenca entre esperar e
 *    achar que travou.
 *
 * 5. **Input de arquivo cru.** Era o controle padrao do navegador, com o texto
 *    no idioma do sistema do visitante (aparecia "Procurar... Nenhum arquivo
 *    selecionado" em portugues num site em ingles). Agora e uma area de
 *    arrastar/soltar com rotulo proprio, em ingles, e o input real fica
 *    escondido — invisivel tambem para o leitor de tela, que usa o rotulo.
 */

const LADO_MAX = 2000;
const QUALIDADE = 0.8;

type Item = { nome: string; antes: number; depois: number };

function kb(n: number) {
  return n < 1024 * 1024 ? `${Math.round(n / 1024)} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export default function BulkStudio() {
  const [files, setFiles] = useState<File[]>([]);
  const [progresso, setProgresso] = useState(0);
  const [atual, setAtual] = useState('');
  const [processando, setProcessando] = useState(false);
  const [pronto, setPronto] = useState<Item[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [arrastando, setArrastando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function receber(lista: FileList | null) {
    const imagens = Array.from(lista ?? []).filter((f) => f.type.startsWith('image/'));
    setFiles(imagens);
    setPronto(null);
    setProgresso(0);
    setErro(null);
    if (lista && lista.length > 0 && imagens.length === 0) {
      setErro('Those files are not images. Drop JPG, PNG or WebP files.');
    }
  }

  /** Desenha a imagem num canvas preservando a proporcao. */
  async function reduzir(file: File): Promise<Blob> {
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise<HTMLImageElement>((res, rej) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = () => rej(new Error('unreadable image'));
        i.src = url;
      });

      const escala = Math.min(1, LADO_MAX / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * escala));
      const h = Math.max(1, Math.round(img.height * escala));

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('canvas unavailable');

      // Fundo branco apenas quando a origem aceita transparencia: PNG/WebP com
      // alpha, convertidos para JPG, ficariam com fundo preto sem isto.
      if (file.type !== 'image/jpeg') {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, w, h);
      }
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, w, h);

      return await new Promise<Blob>((res, rej) =>
        canvas.toBlob((b) => (b ? res(b) : rej(new Error('encode failed'))), 'image/jpeg', QUALIDADE)
      );
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async function processar() {
    if (files.length === 0 || processando) return;
    setProcessando(true);
    setProgresso(0);
    setPronto(null);
    setErro(null);

    const zip = new JSZip();
    const resultado: Item[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setAtual(file.name);
        setProgresso(Math.round((i / files.length) * 100));

        const blob = await reduzir(file);
        // Nome de saida previsivel e sem colisao: mesmo nome base do original,
        // extensao .jpg, prefixo numerico para o ZIP ficar na ordem de entrada.
        const base = file.name.replace(/\.[^.]+$/, '').replace(/[^\w-]+/g, '-').slice(0, 60);
        const nomeSaida = `${String(i + 1).padStart(3, '0')}-${base || 'image'}.jpg`;
        zip.file(nomeSaida, blob);
        resultado.push({ nome: nomeSaida, antes: file.size, depois: blob.size });
      }

      const conteudo = await zip.generateAsync({ type: 'blob' });
      saveAs(conteudo, `bulk-studio-${files.length}.zip`);
      setProgresso(100);
      setPronto(resultado);
    } catch (e) {
      setErro(
        `Could not finish: ${(e as Error).message}. If one of the files is unusually large or a HEIC, convert it first.`
      );
    } finally {
      setAtual('');
      setProcessando(false);
    }
  }

  const totalAntes = pronto?.reduce((n, i) => n + i.antes, 0) ?? 0;
  const totalDepois = pronto?.reduce((n, i) => n + i.depois, 0) ?? 0;

  return (
    <div className="bg-[var(--color-surface)] rounded-[14px] border border-[var(--color-line)] shadow-sm overflow-hidden">
      <div className="p-5 sm:p-7">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-ink)]">
          Private Bulk Studio
        </h2>
        <p className="mt-1 text-[13px] sm:text-sm text-[var(--color-ink-muted)] leading-relaxed">
          100% offline. Up to {LADO_MAX}px on the long edge, JPG quality{' '}
          {Math.round(QUALIDADE * 100)}%, zipped when done. Your photos never leave your browser.
        </p>

        {/* Area de soltar. O input fica escondido: o rotulo e o que o leitor de
            tela anuncia, e nenhum navegador traduz um rotulo escrito por nos. */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setArrastando(true);
          }}
          onDragLeave={() => setArrastando(false)}
          onDrop={(e) => {
            e.preventDefault();
            setArrastando(false);
            receber(e.dataTransfer.files);
          }}
          className={`mt-5 rounded-[12px] border-2 border-dashed p-6 text-center transition ${
            arrastando
              ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/10'
              : 'border-[var(--color-line-strong)] bg-[var(--color-surface-2)]'
          }`}
        >
          <input
            ref={inputRef}
            id="bulk-files"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => receber(e.target.files)}
            className="sr-only"
          />
          <label
            htmlFor="bulk-files"
            className="inline-flex cursor-pointer items-center rounded-full bg-[var(--color-btn-bg)] px-5 py-2.5 text-[13px] font-bold text-[var(--color-btn-brand-fg)] hover:opacity-90 transition"
          >
            Choose images
          </label>
          <p className="mt-2 text-[12px] text-[var(--color-ink-muted)]">
            or drop them here —{' '}
            {files.length === 0
              ? 'no files selected yet'
              : `${files.length} file${files.length === 1 ? '' : 's'} ready`}
          </p>
        </div>

        {erro && (
          <p className="mt-3 rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-800">
            {erro}
          </p>
        )}

        {files.length > 0 && !pronto && (
          <button
            onClick={processar}
            disabled={processando}
            className="mt-4 w-full rounded-[12px] bg-[var(--color-btn-bg)] py-3 text-[13px] font-bold text-[var(--color-btn-brand-fg)] disabled:opacity-60 transition"
          >
            {processando
              ? `Processing ${progresso}%${atual ? ` — ${atual}` : ''}`
              : `Process ${files.length} ${files.length === 1 ? 'image' : 'images'} → download ZIP`}
          </button>
        )}

        {processando && (
          <div
            className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-line)]"
            role="progressbar"
            aria-valuenow={progresso}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-[var(--color-brand)] transition-all"
              style={{ width: `${progresso}%` }}
            />
          </div>
        )}

        {pronto && (
          <div className="mt-4 rounded-[12px] border border-green-200 bg-green-50 px-4 py-3 text-[12px] text-green-900">
            <p className="font-bold">
              ✓ Done — {pronto.length} {pronto.length === 1 ? 'image' : 'images'} zipped and
              downloaded.
            </p>
            <p className="mt-1">
              {kb(totalAntes)} → {kb(totalDepois)}
              {totalAntes > 0 && (
                <> ({Math.max(0, Math.round((1 - totalDepois / totalAntes) * 100))}% smaller)</>
              )}
            </p>
            <details className="mt-2">
              <summary className="cursor-pointer font-bold">See each file</summary>
              <ul className="mt-1.5 space-y-0.5">
                {pronto.map((i) => (
                  <li key={i.nome} className="truncate font-mono text-[11px]">
                    {i.nome} — {kb(i.antes)} → {kb(i.depois)}
                  </li>
                ))}
              </ul>
            </details>
          </div>
        )}

        <p className="mt-4 text-[11px] leading-relaxed text-[var(--color-ink-muted)]">
          Note: HEIC photos from an iPhone are not readable by browsers other than Safari. Convert
          them to JPG first — your phone’s camera settings can also be set to “Most Compatible”.
        </p>
      </div>
    </div>
  );
}
