'use client';

import { useState } from 'react';

/**
 * Formulario de login do painel.
 *
 * A senha vai para /api/admin/login, que compara o hash no servidor e devolve
 * um cookie HttpOnly. Nenhum segredo fica no navegador.
 */
export default function AdminLogin({ locale }: { locale: string }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [ocupado, setOcupado] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setOcupado(true);
    try {
      const r = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });
      if (r.ok) {
        window.location.reload();
        return;
      }
      const d = await r.json().catch(() => ({}));
      setErro(d.erro || 'Não foi possível entrar.');
    } catch {
      setErro('Falha de rede.');
    } finally {
      setOcupado(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="text-2xl font-black tracking-tight text-zinc-900">
            iatools <span className="text-zinc-400 font-semibold text-base">/ admin</span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">Área restrita. Conteúdo não indexado.</p>
        </div>

        <form onSubmit={entrar} className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
          <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-500 mb-1">
            E-mail
          </label>
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full text-sm px-3 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-500 mb-1 mt-4">
            Senha
          </label>
          <input
            type="password"
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="w-full text-sm px-3 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          {erro && (
            <p className="mt-4 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={ocupado}
            className="mt-5 w-full bg-zinc-900 text-white font-bold text-sm py-2.5 rounded-full hover:bg-zinc-800 transition disabled:opacity-50"
          >
            {ocupado ? 'Entrando…' : 'Entrar'}
          </button>

          <p className="mt-4 text-[11px] text-zinc-500 leading-relaxed">
            A senha é conferida no servidor contra um hash PBKDF2. Nada de senha ou token
            fica guardado no navegador. Sessão de 12 horas.
          </p>
        </form>

        <p className="text-center text-[11px] text-zinc-400 mt-4">
          <a href={`/${locale}`} className="inline-flex min-h-6 items-center underline">← voltar ao site</a>
        </p>
      </div>
    </div>
  );
}
