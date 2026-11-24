import type { ReactNode } from 'react';
import { SITE_NAME } from '@/lib/seo';

/**
 * Um único invólucro para TODAS as páginas.
 *
 * Antes, cada página decidia sozinha sua largura (900px, 960px, 1100px,
 * 1280px, 760px) e seu fundo (algumas com bg-[var(--color-canvas)], outras sem nada).
 * Era essa divergência que fazia as páginas internas parecerem outro site.
 * Agora a casca é uma só e a largura é escolhida por uma prop explícita.
 */

type Largura = 'estreita' | 'leitura' | 'padrao' | 'largo';

const LARGURAS: Record<Largura, string> = {
  // Artigos e guias — medida confortável de leitura
  estreita: 'max-w-[720px]',
  // Reviews e páginas de ferramenta
  leitura: 'max-w-[820px]',
  // Páginas institucionais
  padrao: 'max-w-[1040px]',
  // Índices e home
  largo: 'max-w-[1200px]',
};

export default function PageShell({
  children,
  largura = 'padrao',
  className = '',
}: {
  children: ReactNode;
  largura?: Largura;
  className?: string;
}) {
  return (
    <main className={`flex-1 w-full ${className}`}>
      <div className={`${LARGURAS[largura]} mx-auto px-4 sm:px-6 lg:px-8 py-9 sm:py-12 w-full`}>
        {children}
      </div>
    </main>
  );
}

/** Cabeçalho editorial — o mesmo em toda página interna. */
export function PageHeader({
  eyebrow,
  titulo,
  intro,
  meta,
  acoes,
}: {
  eyebrow?: string;
  titulo: string;
  intro?: ReactNode;
  meta?: ReactNode;
  acoes?: ReactNode;
}) {
  return (
    <header className="mb-8 sm:mb-10">
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h1 className="text-[1.9rem] leading-[1.12] sm:text-[2.6rem] font-extrabold tracking-[-0.033em] text-[var(--color-ink)]">
        {titulo}
      </h1>
      {intro && (
        <div className="mt-4 max-w-[62ch] text-[16.5px] leading-relaxed text-[var(--color-ink-soft)]">
          {intro}
        </div>
      )}
      {meta && <div className="mt-5 flex flex-wrap items-center gap-2">{meta}</div>}
      {acoes && <div className="mt-6 flex flex-wrap items-center gap-3">{acoes}</div>}
    </header>
  );
}

/** Trilha de navegação — sempre igual. */
export function Breadcrumbs({
  itens,
}: {
  itens: { nome: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1.5 text-[12.5px] text-[var(--color-ink-muted)]">
      {itens.map((it, i) => (
        <span key={it.nome} className="flex items-center gap-1.5">
          {i > 0 && <span aria-hidden className="text-[var(--color-line-strong)]">/</span>}
          {it.href ? (
            <a
              href={it.href}
              /* min-h-6 = 24px: o alvo de toque minimo da WCAG 2.5.8. Sem
                 isso o link tinha 15px de altura e era dificil de acertar
                 no celular, mesmo parecendo normal no desktop. */
              className="inline-flex min-h-6 items-center hover:text-[var(--color-ink)] hover:underline underline-offset-2"
            >
              {it.nome}
            </a>
          ) : (
            <span className="font-semibold text-[var(--color-ink)]">{it.nome}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/** Rodapé da página, para CTA editorial. */
export function PageFooterNote({ children }: { children: ReactNode }) {
  return (
    <aside className="mt-12 border-t border-[var(--color-line)] pt-6 text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
      {children}
    </aside>
  );
}

export { SITE_NAME };
