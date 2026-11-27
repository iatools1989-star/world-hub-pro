'use client';

import { useEffect, useState } from 'react';

/**
 * Tela de afiliados do painel.
 *
 * O que ela resolve: o site inteiro ja tem os CTAs escritos, mas nenhum link
 * pagava comissao porque faltava onde colar o ID. Aqui voce ve, por programa:
 * quanto paga, em que rede, se aceita cadastro do Brasil, onde ele aparece no
 * site, e o campo para colar o link de rastreio.
 *
 * Regra visivel na tela: enquanto o status nao for "aprovado" E o link estiver
 * preenchido, o site continua dizendo ao leitor que nao ganhamos nada. E o
 * contrario tambem vale: aprovar sem link nao faz o site prometer comissao.
 */

type Status = 'aprovado' | 'pendente' | 'sem-programa';

type Programa = {
  nome: string;
  rede: string;
  cadastro: string;
  dominios: string[];
  comissao: string;
  cookie: string;
  payout: string;
  aceitaBrasil: string;
  status: Status;
  id: string;
  link: string;
  ondeAparece: string[];
  nota: string;
};

type Linha = { slug: string; programa: Programa };

const ESTILO: Record<Status, string> = {
  aprovado: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  pendente: 'bg-amber-50 text-amber-800 border-amber-200',
  'sem-programa': 'bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] border-[var(--color-line)]',
};

const ROTULO: Record<Status, string> = {
  aprovado: 'aprovado — site monetiza',
  pendente: 'pendente — falta cadastrar',
  'sem-programa': 'sem programa de comissão',
};

export default function AdminAfiliados() {
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [aviso, setAviso] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ tom: 'ok' | 'erro'; texto: string } | null>(null);
  const [rascunho, setRascunho] = useState<Record<string, { status: Status; id: string; link: string }>>({});

  async function carregar() {
    setCarregando(true);
    try {
      const r = await fetch('/api/admin/afiliados');
      if (r.status === 401) {
        setMsg({ tom: 'erro', texto: 'Sessão expirada — entre de novo em /en/admin.' });
        return;
      }
      const d = await r.json();
      if (d.erro) throw new Error(d.erro);
      setLinhas(d.programas ?? []);
      setAviso(d.aviso ?? '');
      const r0: Record<string, { status: Status; id: string; link: string }> = {};
      for (const { slug, programa } of d.programas as Linha[]) {
        r0[slug] = { status: programa.status, id: programa.id ?? '', link: programa.link ?? '' };
      }
      setRascunho(r0);
    } catch (e) {
      setMsg({ tom: 'erro', texto: (e as Error).message });
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function editar(slug: string, campo: 'status' | 'id' | 'link', valor: string) {
    setRascunho((r) => ({ ...r, [slug]: { ...r[slug], [campo]: valor } }));
  }

  async function salvar(slug: string) {
    setSalvando(slug);
    setMsg(null);
    try {
      const alterados = rascunho[slug];
      const r = await fetch('/api/admin/afiliados', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, alterados }),
      });
      const d = await r.json();
      if (!r.ok || d.erro) throw new Error(d.erro || 'falhou');
      setMsg({ tom: 'ok', texto: d.aviso || 'Gravado. O site rebuilda em ~2 min e o link passa a comissionar.' });
    } catch (e) {
      setMsg({ tom: 'erro', texto: (e as Error).message });
    } finally {
      setSalvando(null);
    }
  }

  const pagando = linhas.filter(({ slug }) => {
    const p = rascunho[slug];
    return p && p.status === 'aprovado' && p.link.trim().length > 0;
  }).length;
  const faltam = linhas.filter((l) => l.programa.status === 'pendente').length;

  return (
    <div className="space-y-5">
      <div className="bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[14px] p-5">
        <h1 className="text-xl font-black text-[var(--color-ink)]">Afiliados</h1>
        <p className="text-xs text-[var(--color-ink-muted)] mt-1 leading-relaxed max-w-[70ch]">
          {aviso ||
            'Cadastre o link de rastreio de cada programa. Enquanto não houver link, o site diz ao leitor que não ganhamos nada — e isso é proposital: anunciar comissão que não existe é divulgação enganosa.'}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-bold">
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            {pagando} {pagando === 1 ? 'programa monetizando' : 'programas monetizando'}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            {faltam} {faltam === 1 ? 'pendente' : 'pendentes'}
          </span>
        </div>
      </div>

      {msg && (
        <div
          className={
            'rounded-[12px] border px-4 py-3 text-xs font-semibold ' +
            (msg.tom === 'ok'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-700')
          }
        >
          {msg.texto}
        </div>
      )}

      {carregando && <p className="text-xs text-[var(--color-ink-muted)]">Carregando…</p>}

      <div className="space-y-3">
        {linhas.map(({ slug, programa }) => {
          const r = rascunho[slug] ?? { status: programa.status, id: programa.id, link: programa.link };
          const monetizando = r.status === 'aprovado' && r.link.trim().length > 0;
          return (
            <div
              key={slug}
              className="bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[14px] p-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-black text-[var(--color-ink)]">{programa.nome}</h2>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${ESTILO[r.status]}`}>
                  {ROTULO[r.status]}
                </span>
                <span className="text-[10px] font-bold text-[var(--color-ink-muted)]">{programa.rede}</span>
                <span className="flex-1" />
                <a
                  href={programa.cadastro}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold underline text-[var(--color-ink)]"
                >
                  cadastrar ↗
                </a>
              </div>

              <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
                <div className="bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-[10px] p-3">
                  <div className="font-bold text-[var(--color-ink-muted)] uppercase tracking-wider text-[10px]">Comissão</div>
                  <div className="text-[var(--color-ink)] mt-0.5">{programa.comissao}</div>
                </div>
                <div className="bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-[10px] p-3">
                  <div className="font-bold text-[var(--color-ink-muted)] uppercase tracking-wider text-[10px]">Cookie</div>
                  <div className="text-[var(--color-ink)] mt-0.5">{programa.cookie}</div>
                </div>
                <div className="bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-[10px] p-3">
                  <div className="font-bold text-[var(--color-ink-muted)] uppercase tracking-wider text-[10px]">Pagamento</div>
                  <div className="text-[var(--color-ink)] mt-0.5">{programa.payout}</div>
                </div>
                <div className="bg-[var(--color-surface-2)] border border-[var(--color-line)] rounded-[10px] p-3">
                  <div className="font-bold text-[var(--color-ink-muted)] uppercase tracking-wider text-[10px]">Brasil</div>
                  <div className="text-[var(--color-ink)] mt-0.5">{programa.aceitaBrasil}</div>
                </div>
              </div>

              {programa.nota && (
                <p className="text-[11px] text-[var(--color-ink-soft)] mt-3 leading-relaxed">{programa.nota}</p>
              )}

              {programa.ondeAparece?.length > 0 && (
                <p className="text-[10px] text-[var(--color-ink-muted)] mt-2">
                  Aparece em: {programa.ondeAparece.join(' · ')}
                </p>
              )}

              <div className="mt-4 grid sm:grid-cols-[140px_1fr_1fr_auto] gap-2 items-end">
                <label className="block">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-muted)] mb-1">
                    Status
                  </span>
                  <select
                    value={r.status}
                    onChange={(e) => editar(slug, 'status', e.target.value)}
                    className="w-full p-2 rounded-[10px] border border-[var(--color-line-strong)] text-xs bg-[var(--color-surface)]"
                  >
                    <option value="pendente">pendente</option>
                    <option value="aprovado">aprovado</option>
                    <option value="sem-programa">sem programa</option>
                  </select>
                </label>
                <label className="block">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-muted)] mb-1">
                    ID do afiliado
                  </span>
                  <input
                    value={r.id}
                    onChange={(e) => editar(slug, 'id', e.target.value)}
                    placeholder="ex.: 1234567"
                    className="w-full p-2 rounded-[10px] border border-[var(--color-line-strong)] text-xs bg-[var(--color-surface)]"
                  />
                </label>
                <label className="block">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-muted)] mb-1">
                    Link de rastreio (https, do domínio do programa)
                  </span>
                  <input
                    value={r.link}
                    onChange={(e) => editar(slug, 'link', e.target.value)}
                    placeholder={`https://${programa.dominios[0]}/...`}
                    className="w-full p-2 rounded-[10px] border border-[var(--color-line-strong)] text-xs bg-[var(--color-surface)]"
                  />
                </label>
                <button
                  onClick={() => salvar(slug)}
                  disabled={salvando === slug}
                  className="px-4 py-2 rounded-[10px] bg-[var(--color-btn-bg)] text-[var(--color-btn-fg)] text-xs font-bold hover:opacity-90 transition disabled:opacity-50"
                >
                  {salvando === slug ? 'Salvando…' : 'Salvar'}
                </button>
              </div>

              <p className="text-[10px] mt-2 font-bold">
                {monetizando ? (
                  <span className="text-emerald-700">
                    ✓ Site vai mostrar #ad e rel=&quot;sponsored&quot; neste link.
                  </span>
                ) : r.status === 'aprovado' ? (
                  <span className="text-amber-700">
                    Aprovado, mas sem link: o site continua dizendo que não ganhamos nada.
                  </span>
                ) : (
                  <span className="text-[var(--color-ink-muted)]">
                    Site mostra link direto, sem #ad, e diz que não ganhamos nada.
                  </span>
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
