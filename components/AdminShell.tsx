'use client';

import { useState, useEffect } from 'react';

/**
 * Casca do painel ja autenticado.
 *
 * O login aconteceu no servidor e o cookie e HttpOnly — este componente nao ve
 * senha nem token. Ele so carrega o editor de conteudo (o mesmo /painel/app.js)
 * num iframe da mesma origem, reaproveitando tudo que ja foi construido.
 *
 * Por que iframe e nao um import: o editor e uma SPA sem framework, escrita em
 * JS puro, que ja funciona. Reescrever em React so para "nao usar iframe" seria
 * trocar codigo que funciona por codigo que precisa ser testado de novo.
 */
export default function AdminShell({ email, locale }: { email: string; locale: string }) {
  const [carregado, setCarregado] = useState(false);

  async function sair() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-4 py-2.5 flex items-center gap-3 flex-wrap">
          <div className="font-black tracking-tight text-zinc-900">
            iatools <span className="text-zinc-400 font-semibold text-sm">/ admin</span>
          </div>
          <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
            sessão ativa
          </span>
          <span className="text-[11px] text-zinc-500">{email}</span>
          <span className="flex-1" />
          <a
            href={`/${locale}`}
            target="_blank"
            className="text-xs font-bold text-zinc-600 hover:text-zinc-900"
          >
            ver site ↗
          </a>
          <button
            onClick={sair}
            className="text-xs font-bold px-3 py-1.5 rounded-full border border-zinc-200 hover:border-zinc-900 transition"
          >
            Sair
          </button>
        </div>
      </header>

      {!carregado && (
        <div className="max-w-[1400px] mx-auto px-4 py-6 text-xs text-zinc-500">
          Carregando editor…
        </div>
      )}

      <iframe
        src="/en/admin/editor"
        title="Editor de conteúdo"
        onLoad={() => setCarregado(true)}
        className="w-full border-0 block"
        style={{ height: 'calc(100vh - 46px)' }}
      />
    </div>
  );
}
