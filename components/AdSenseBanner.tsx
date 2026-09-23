'use client';

import { useEffect } from 'react';
import { ADSENSE_CONFIG } from '@/lib/data';

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
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch {
      // Ignora erro caso adblock esteja ativo
    }
  }, []);

  return (
    <div
      className={`w-full overflow-hidden my-8 flex flex-col justify-center items-center min-h-[120px] sm:min-h-[250px] bg-zinc-50/50 border border-dashed border-zinc-300 rounded-3xl p-3 text-center transition-all ${className}`}
      style={{ minHeight: '120px' }}
    >
      <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
        Publicidade
      </div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: '90px' }}
        data-ad-client={ADSENSE_CONFIG.client}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
