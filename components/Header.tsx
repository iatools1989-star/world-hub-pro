'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const NAV = [
  { href: '/en/tools', label: 'Tools' },
  { href: '/en/directory', label: 'AI Directory' },
  { href: '/en/guides', label: 'Guides' },
  { href: '/en/about', label: 'About' },
];

const CHAVE = 'wtb-theme';

export default function Header({ currentLocale }: { currentLocale: string }) {
  const [tema, setTema] = useState<'claro' | 'escuro'>('claro');
  const [montado, setMontado] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  // Lê a preferência na primeira renderização no cliente.
  useEffect(() => {
    setMontado(true);
    const salvo = localStorage.getItem(CHAVE);
    const prefereEscuro =
      salvo === 'escuro' ||
      (!salvo && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setTema(prefereEscuro ? 'escuro' : 'claro');
    document.documentElement.classList.toggle('dark', prefereEscuro);
  }, []);

  // Fecha o menu móvel ao navegar ou ao apertar Esc.
  useEffect(() => {
    if (!menuAberto) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuAberto(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuAberto]);

  const alternarTema = () => {
    const proximo = tema === 'escuro' ? 'claro' : 'escuro';
    setTema(proximo);
    localStorage.setItem(CHAVE, proximo);
    document.documentElement.classList.toggle('dark', proximo === 'escuro');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-[var(--color-canvas)]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[var(--nav-h)] max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Marca */}
        <Link href={`/${currentLocale}`} className="group flex shrink-0 items-center gap-2.5" aria-label="World Tools Hub — home">
          <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-[#101012] text-[13px] font-black text-[#f5c518] dark:bg-[#f5c518] dark:text-[#101012] transition-transform group-hover:-rotate-6">
            W
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[14.5px] font-extrabold tracking-[-0.02em] text-[var(--color-ink)]">
              World Tools Hub
            </span>
            <span className="mt-0.5 text-[10px] font-semibold tracking-[0.1em] text-[var(--color-ink-muted)]">
              IATOOLS.ONLINE
            </span>
          </span>
        </Link>

        {/* Navegação desktop */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-[13.5px] font-semibold text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Tema */}
          <button
            onClick={alternarTema}
            aria-label={tema === 'escuro' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            title={tema === 'escuro' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            className="grid h-9 w-9 place-items-center rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] text-[15px] transition-colors hover:border-[var(--color-line-strong)]"
          >
            {/* Renderiza só após montar para não haver troca de ícone no servidor */}
            <span suppressHydrationWarning aria-hidden>
              {!montado ? '◐' : tema === 'escuro' ? '☀' : '☾'}
            </span>
          </button>

          <Link
            href="/en/tools"
            className="ui-btn ui-btn-primary hidden !px-4 !py-2 !text-[13px] sm:inline-flex"
          >
            Browse tools
          </Link>

          {/* Menu móvel */}
          <button
            onClick={() => setMenuAberto((v) => !v)}
            aria-label="Abrir menu"
            aria-expanded={menuAberto}
            className="grid h-9 w-9 place-items-center rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] md:hidden"
          >
            <span aria-hidden className="text-[15px] leading-none">{menuAberto ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {menuAberto && (
        <div className="border-t border-[var(--color-line)] bg-[var(--color-surface)] md:hidden">
          <nav className="mx-auto flex max-w-[1200px] flex-col px-4 py-3 sm:px-6" aria-label="Menu móvel">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuAberto(false)}
                className="rounded-lg px-2 py-3 text-[15px] font-semibold text-[var(--color-ink)] hover:bg-[var(--color-surface-2)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
