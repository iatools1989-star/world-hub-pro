'use client';

import { useEffect, useRef, useState } from 'react';
import { ADSENSE_CONFIG, ADSENSE_ATIVO } from '@/lib/data';

interface AdSlotProps {
  slotId?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
  responsive?: boolean;
}

export default function AdSenseBanner({
  slotId = ADSENSE_CONFIG.slotTools,
  format = 'auto',
  className = '',
  responsive = true,
}: AdSlotProps) {
  const insRef = useRef<HTMLModElement>(null);
  const [estado, setEstado] = useState<'carregando' | 'preenchido' | 'vazio'>('carregando');

  useEffect(() => {
    // Sem bloco configurado nao existe o que preencher: nao empurra nada
    // para o Google nem espera o timeout para decidir que esta vazio.
    if (!ADSENSE_ATIVO) return;
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      // Adblock ativo ou script bloqueado: cai no estado "vazio" no timeout abaixo.
    }
    /*
     * Sem esta verificação o anúncio não preenchido vira um bloco vazio de 280px
     * no meio do conteúdo — o "buraco" que aparecia nas páginas internas.
     * O AdSense marca o <ins> com data-ad-status="filled" quando entrega algo.
     */
    const t = setTimeout(() => {
      const el = insRef.current;
      setEstado(el?.dataset.adStatus === 'filled' ? 'preenchido' : 'vazio');
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  if (!ADSENSE_ATIVO) return null;
  const compacto = estado !== 'preenchido';

  return (
    <div
      /* Sem altura mínima fixa: quando não há anúncio preenchido (o caso até a
         aprovação), o espaço não vira um buraco vazio de 320px no meio do texto. */
      className={`w-full overflow-hidden my-8 flex flex-col justify-center items-center bg-[var(--color-surface-2)]/50 border border-dashed border-[var(--color-line-strong)] rounded-[14px] p-3 text-center transition-all ${className}`}
    >
      <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-muted)] mb-1">
        Advertisement
      </div>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={compacto ? { display: 'none' } : { display: 'block', width: '100%' }}
        data-ad-client={ADSENSE_CONFIG.client}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
