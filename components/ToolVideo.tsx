'use client';

import { useRef, useState } from 'react';

/**
 * Video curto mostrando a ferramenta funcionando.
 *
 * Decisoes (todas por um motivo pratico):
 *
 * 1. Arquivo no proprio dominio, nao YouTube. Player de terceiro carrega
 *    cookie e script de rastreio antes de qualquer consentimento — num site
 *    que promete "nada sai do seu navegador", isso seria contraditorio. Tambem
 *    e mais rapido: sem iframe, sem JS externo.
 *
 * 2. `preload="none"`: o video so baixa quando o visitante aperta o play. Sem
 *    isso, 16 paginas de ferramenta baixariam centenas de KB a toa, o que
 *    estraga a nota de velocidade no celular (e o AdSense olha isso).
 *
 * 3. Autoplay so com `muted` — navegador bloqueia som automatico. O botao de
 *    play aparece grande por cima, porque metade das pessoas nao percebe que
 *    a imagem parada e um video.
 *
 * 4. `poster` e uma moldura do proprio video, gerada no mesmo processo de
 *    gravacao. Assim a primeira coisa que o visitante ve ja e a ferramenta,
 *    nao um retangulo preto.
 *
 * 5. Fica na secao "How to use", junto dos passos escritos: e a mesma
 *    pergunta ("como eu uso isto?") respondida de duas formas.
 */


export default function ToolVideo({ slug, name, passos = 3 }: { slug: string; name: string; passos?: number }) {
  const [tocando, setTocando] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  const iniciar = () => {
    const v = ref.current;
    if (!v) return;
    setTocando(true);
    v.play().catch(() => setTocando(false));
  };

  return (
    <figure className="bg-[var(--color-surface)] rounded-[14px] border border-[var(--color-line)] shadow-sm overflow-hidden">
      <div className="relative bg-[#0a0a0c]">
        <video
          ref={ref}
          className="w-full block aspect-video"
          poster={`/videos/${slug}.jpg`}
          preload="none"
          playsInline
          controls={tocando}
          muted
          onEnded={() => setTocando(false)}
        >
          {/* MP4/H.264 e o unico formato que toca em todos os navegadores
              relevantes, inclusive Safari no iPhone. O WebM ficou de fora
              de proposito: pesava 10x mais para a mesma imagem. */}
          <source src={`/videos/${slug}.mp4`} type="video/mp4" />
          {/* Sem faixa de audio: a legenda queimada no video explica cada
              passo, entao ninguem depende de som. Isso tambem evita o
              navegador bloquear o play automatico. */}
        </video>

        {!tocando && (
          <button
            onClick={iniciar}
            aria-label={`Play the ${name} demo`}
            className="absolute inset-0 grid place-items-center group cursor-pointer"
          >
            <span className="grid h-16 w-16 place-items-center rounded-full bg-[var(--color-brand,#f5c518)] shadow-lg transition group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="h-7 w-7 translate-x-[2px]" fill="#0a0a0c">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>

      <figcaption className="px-4 py-3 text-xs text-[var(--color-ink-muted)] flex items-center gap-2 border-t border-[var(--color-line)]">
        <span className="font-bold text-[var(--color-ink)]">Watch it in action</span>
        — the {passos} steps in {passos * 7} seconds, with captions, no sound needed
      </figcaption>
    </figure>
  );
}
