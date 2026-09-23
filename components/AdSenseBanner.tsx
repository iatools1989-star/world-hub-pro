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
    } catch (e) {
      // Ignora erros em desenvolvimento ou adblock
    }
  }, []);

  return (
    <div className={`w-full overflow-hidden my-6 flex justify-center items-center min-h-[100px] bg-zinc-50 border border-zinc-200 rounded-2xl p-2 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', textAlign: 'center' }}
        data-ad-client={ADSENSE_CONFIG.client}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
