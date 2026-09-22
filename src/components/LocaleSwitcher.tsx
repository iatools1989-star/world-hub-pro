'use client';
import { LOCALES, LOCALE_NAMES, LOCALE_FLAGS } from '@/lib/i18n';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LocaleSwitcher({ current }: { current: string }) {
  const path = usePathname();
  const rest = path.replace(`/${current}`, '') || '/';

  return (
    <div className="flex flex-wrap gap-1.5">
      {LOCALES.map(l => (
        <Link
          key={l}
          href={`/${l}${rest}`}
          className={`px-2.5 py-1.5 rounded-full text-xs font-bold border transition ${current === l ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white border-zinc-200 hover:border-zinc-900'}`}
          title={LOCALE_NAMES[l as keyof typeof LOCALE_NAMES]}
        >
          {LOCALE_FLAGS[l as keyof typeof LOCALE_FLAGS]} {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
