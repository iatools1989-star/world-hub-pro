'use client';

import { useEffect, useMemo, useState } from 'react';
import { GUIDES } from '@/lib/guidesContent';

/**
 * Guias que existem no codigo. Os demais, com tipo `guide`, foram criados pelo
 * CMS e sao os unicos que podem ser apagados pelo editor.
 */
const GUIAS_CONHECIDOS = new Set(Object.keys(GUIDES));

/**
 * Editor de conteudo do site.
 *
 * COMO ESTE COMPONENTE PENSA
 *
 * O painel antigo escrevia TypeScript direto no GitHub. Trocar uma palavra
 * podia quebrar o build, e o autor ficava sem publicar. Aqui o editor trata o
 * conteudo como dado: carrega JSON pela API, mostra campos, e o que nao foi
 * tocado continua vindo do arquivo original.
 *
 * O QUE ESTA TELA FAZ
 * - lista todas as paginas de conteudo (diretorio, ferramentas, artigos)
 * - abre qualquer uma e mostra os textos em campos editaveis
 * - salva: o texto vai para content/overrides.json, o arquivo e commitado no
 *   GitHub e o Cloudflare rebuild. O site publica sozinho em ~2 minutos.
 *
 * O QUE AINDA FALTA
 * - criar pagina nova do zero (hoje so edita as que existem)
 * - a gravacao depende do secret ADMIN_GITHUB_TOKEN no Cloudflare; sem ele o
 *   botao avisa em vez de fingir que salvou.
 */

type Resumo = {
  id: string; tipo: 'directory' | 'tool' | 'guide'; slug: string;
  nome: string; caminho: string; updated: string; palavras: number;
};
type Documento = Record<string, unknown> & { tipo: string; slug: string };

const ROTULO_TIPO: Record<string, string> = {
  directory: 'Diretório',
  tool: 'Ferramentas',
  guide: 'Artigos',
};

/**
 * Campos que nao devem aparecer como texto editavel.
 *
 * `nome` entra aqui de proposito: ele vem de lib/data.ts e alimenta menu,
 * breadcrumb e schema. Editar o nome no CMS seria um botao que nao publica
 * nada — o texto salvaria e o site continuaria igual. Quem troca o nome de
 * uma ferramenta mexe no codigo, e isso e raro de proposito.
 */
const CAMPOS_TECNICOS = new Set(['tipo', 'slug', 'updated', 'readingMinutes', 'step', 'nome']);

export default function AdminEditor() {
  const [docs, setDocs] = useState<Resumo[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [filtro, setFiltro] = useState('');
  const [tipoAtivo, setTipoAtivo] = useState<string>('todos');
  const [aberto, setAberto] = useState<string | null>(null);
  const [doc, setDoc] = useState<Documento | null>(null);
  const [carregandoDoc, setCarregandoDoc] = useState(false);
  const [alterados, setAlterados] = useState<Record<string, unknown>>({});
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tom: 'ok' | 'erro'; rotulo?: string; texto: string } | null>(null);
  // criacao de pagina nova
  const [criando, setCriando] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState('');
  const [erroCriar, setErroCriar] = useState<string | null>(null);
  const [enviandoCriar, setEnviandoCriar] = useState(false);
  const [recarregar, setRecarregar] = useState(0);
  const [confirmandoApagar, setConfirmandoApagar] = useState(false);
  const [erroApagar, setErroApagar] = useState<string | null>(null);

  // lista
  useEffect(() => {
    fetch('/api/admin/content')
      .then((r) => {
        if (r.status === 401) throw new Error('sessão expirada — entre de novo');
        return r.json();
      })
      .then((d) => setDocs(d.documentos))
      .catch((e) => setErro(e.message));
  }, [recarregar]);

  // documento
  useEffect(() => {
    if (!aberto) { setDoc(null); setAlterados({}); return; }
    setCarregandoDoc(true);
    fetch(`/api/admin/content?id=${encodeURIComponent(aberto)}`)
      .then((r) => r.json())
      .then((d) => { setDoc(d.documento ?? null); setAlterados({}); })
      .catch(() => setDoc(null))
      .finally(() => setCarregandoDoc(false));
  }, [aberto]);

  // Criado pelo CMS = nao existe em lib/guidesContent.ts. A lista da API ja
  // mescla os dois, entao comparo com o slug conhecido.
  const ehCriado = useMemo(() => {
    if (!aberto?.startsWith('guide:') || !doc) return false;
    const slug = aberto.slice('guide:'.length);
    return !GUIAS_CONHECIDOS.has(slug);
  }, [aberto, doc]);

  const visiveis = useMemo(() => {
    if (!docs) return [];
    const q = filtro.trim().toLowerCase();
    return docs.filter(
      (d) =>
        (tipoAtivo === 'todos' || d.tipo === tipoAtivo) &&
        (!q || d.nome.toLowerCase().includes(q) || d.slug.includes(q))
    );
  }, [docs, filtro, tipoAtivo]);

  const contagem = useMemo(() => {
    const c: Record<string, number> = { todos: docs?.length ?? 0, directory: 0, tool: 0, guide: 0 };
    for (const d of docs ?? []) c[d.tipo]++;
    return c;
  }, [docs]);

  function editar(caminho: string, valor: unknown) {
    setAlterados((a) => ({ ...a, [caminho]: valor }));
    setMensagem(null);
  }

  async function criarPagina() {
    if (enviandoCriar) return;
    setEnviandoCriar(true);
    setErroCriar(null);
    try {
      const r = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: 'guide', titulo: novoTitulo }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.erro || `falhou (${r.status})`);
      setCriando(false);
      setNovoTitulo('');
      setRecarregar((n) => n + 1);
      setAberto(d.id);
      setMensagem({
        tom: 'ok',
        rotulo: 'Página criada.',
        texto: `Ela já está na lista em ${d.caminho}. Preencha os textos e clique em Salvar e publicar.`,
      });
    } catch (e) {
      setErroCriar((e as Error).message);
    } finally {
      setEnviandoCriar(false);
    }
  }

  async function apagar() {
    if (!aberto) return;
    try {
      const r = await fetch(`/api/admin/content?id=${encodeURIComponent(aberto)}`, { method: 'DELETE' });
      const d = await r.json();
      if (!r.ok) throw new Error(d.erro || `falhou (${r.status})`);
      setConfirmandoApagar(false);
      setAberto(null);
      setRecarregar((n) => n + 1);
      setMensagem({ tom: 'ok', rotulo: 'Página apagada.', texto: d.aviso ?? '' });
    } catch (e) {
      setErroApagar((e as Error).message);
    }
  }

  async function salvar() {
    if (!aberto || Object.keys(alterados).length === 0 || salvando) return;
    setSalvando(true);
    setMensagem(null);
    try {
      const r = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: aberto, alterados }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.erro || `falhou (${r.status})`);
      setAlterados({});
      setMensagem({ tom: 'ok', texto: d.aviso ?? 'Gravado.' });
    } catch (e) {
      setMensagem({ tom: 'erro', texto: (e as Error).message });
    } finally {
      setSalvando(false);
    }
  }

  if (erro) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {erro}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-5 grid lg:grid-cols-[340px_1fr] gap-5">
      {criando && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <h2 className="text-base font-black text-zinc-900">Nova página</h2>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Escreva o título. O endereço é gerado a partir dele e aparece na hora —
              confira antes de criar, porque mudar depois quebra link.
            </p>
            <input
              autoFocus
              value={novoTitulo}
              onChange={(e) => { setNovoTitulo(e.target.value); setErroCriar(null); }}
              onKeyDown={(e) => { if (e.key === 'Enter') criarPagina(); }}
              placeholder="Ex.: How to pick a transcription tool"
              className="mt-3 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <p className="mt-2 text-[11px] text-zinc-500 font-mono">
              /en/guides/{novoTitulo.trim()
                ? novoTitulo.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70) || '…'
                : '…'}
            </p>
            {erroCriar && (
              <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-800">
                {erroCriar}
              </p>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => { setCriando(false); setNovoTitulo(''); setErroCriar(null); }}
                className="rounded-full border border-zinc-300 px-4 py-1.5 text-xs font-bold text-zinc-600 hover:border-zinc-500"
              >
                Cancelar
              </button>
              <button
                onClick={criarPagina}
                disabled={enviandoCriar || novoTitulo.trim().length < 3}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                  enviandoCriar || novoTitulo.trim().length < 3
                    ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed'
                    : 'bg-zinc-900 text-amber-300 hover:bg-zinc-800'
                }`}
              >
                {enviandoCriar ? 'Criando…' : 'Criar página'}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmandoApagar && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <h2 className="text-base font-black text-zinc-900">Apagar esta página?</h2>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              O endereço sai do ar e o texto é removido do repositório. O histórico do git
              continua com a versão anterior, então dá para recuperar.
            </p>
            {erroApagar && (
              <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-800">
                {erroApagar}
              </p>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => { setConfirmandoApagar(false); setErroApagar(null); }}
                className="rounded-full border border-zinc-300 px-4 py-1.5 text-xs font-bold text-zinc-600 hover:border-zinc-500"
              >
                Cancelar
              </button>
              <button
                onClick={apagar}
                className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700"
              >
                Apagar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- coluna da lista ---------------- */}
      <aside className="space-y-3">
        <input
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Buscar página…"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <div className="flex flex-wrap gap-1.5">
          {[['todos', 'Tudo'], ['directory', 'Diretório'], ['tool', 'Ferramentas'], ['guide', 'Artigos']].map(
            ([k, rotulo]) => (
              <button
                key={k}
                onClick={() => setTipoAtivo(k)}
                className={`rounded-full px-3 py-1 text-[11px] font-bold border transition ${
                  tipoAtivo === k
                    ? 'bg-zinc-900 text-amber-300 border-zinc-900'
                    : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
                }`}
              >
                {rotulo} <span className="opacity-60">{contagem[k]}</span>
              </button>
            )
          )}
        </div>

        <button
          onClick={() => { setCriando(true); setErroCriar(null); }}
          className="w-full rounded-lg border border-zinc-900 bg-zinc-900 text-amber-300 px-3 py-2 text-xs font-bold hover:bg-zinc-800 transition"
        >
          + Nova página
        </button>

        {!docs && <p className="text-xs text-zinc-500">Carregando…</p>}

        <div className="space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
          {visiveis.map((d) => (
            <button
              key={d.id}
              onClick={() => setAberto(d.id)}
              className={`w-full text-left rounded-lg px-3 py-2 border transition ${
                aberto === d.id
                  ? 'border-amber-400 bg-amber-50'
                  : 'border-transparent hover:border-zinc-200 hover:bg-white'
              }`}
            >
              <div className="text-[13px] font-bold text-zinc-900 leading-tight">{d.nome}</div>
              <div className="text-[11px] text-zinc-500 flex gap-2 mt-0.5">
                <span>{ROTULO_TIPO[d.tipo]}</span>
                <span>·</span>
                <span>{d.palavras} palavras</span>
              </div>
            </button>
          ))}
          {docs && visiveis.length === 0 && (
            <p className="text-xs text-zinc-500 px-1">Nada encontrado.</p>
          )}
        </div>
      </aside>

      {/* ---------------- coluna do editor ---------------- */}
      <main>
        {!aberto && (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center">
            <p className="text-sm font-bold text-zinc-900">Escolha uma página à esquerda</p>
            <p className="text-xs text-zinc-500 mt-1">
              {docs?.length ?? 0} páginas de conteúdo: {contagem.directory} do diretório,{' '}
              {contagem.tool} de ferramentas e {contagem.guide} artigos.
            </p>
          </div>
        )}

        {carregandoDoc && <p className="text-xs text-zinc-500">Abrindo…</p>}

        {doc && !carregandoDoc && (
          <div className="space-y-4">
            <header className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-lg font-black text-zinc-900">{String(doc.nome ?? doc.titulo)}</h1>
                <p className="text-xs text-zinc-500">
                  {ROTULO_TIPO[String(doc.tipo)]} · /{doc.slug} · atualizado em {String(doc.updated)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`/en/${doc.tipo === 'guide' ? 'guides' : doc.tipo === 'tool' ? 'tools' : 'directory'}/${doc.slug}`}
                  target="_blank"
                  className="text-xs font-bold text-zinc-600 hover:text-zinc-900"
                >
                  ver página ↗
                </a>
                {ehCriado && (
                  <button
                    onClick={() => { setConfirmandoApagar(true); setErroApagar(null); }}
                    className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-50 transition"
                  >
                    Apagar
                  </button>
                )}
                <button
                  onClick={salvar}
                  disabled={salvando || Object.keys(alterados).length === 0}
                  title={
                    Object.keys(alterados).length === 0
                      ? 'Nada foi alterado ainda'
                      : 'Grava e publica em ~2 minutos'
                  }
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                    salvando || Object.keys(alterados).length === 0
                      ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed'
                      : 'bg-zinc-900 text-amber-300 hover:bg-zinc-800'
                  }`}
                >
                  {salvando ? 'Salvando…' : 'Salvar e publicar'}
                </button>
              </div>
            </header>

            {mensagem && (
              <div
                className={`rounded-xl border px-4 py-3 text-[12px] ${
                  mensagem.tom === 'ok'
                    ? 'border-green-200 bg-green-50 text-green-900'
                    : 'border-red-200 bg-red-50 text-red-800'
                }`}
              >
                <strong>{mensagem.tom === 'ok' ? mensagem.rotulo ?? 'Publicado. ' : 'Não salvou. '}</strong>
                {mensagem.texto}
              </div>
            )}

            {Object.keys(alterados).length > 0 && !mensagem && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] text-amber-900">
                Alterações ainda não publicadas. Clique em <strong>Salvar e publicar</strong> — o site
                atualiza em cerca de 2 minutos.
              </div>
            )}

            <Campos doc={doc} alterados={alterados} editar={editar} />

            {Object.keys(alterados).length > 0 && (
              <p className="text-[12px] text-zinc-600">
                {Object.keys(alterados).length} campo(s) alterado(s) nesta sessão.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Renderizacao generica dos campos                                    */
/* ------------------------------------------------------------------ */

function Campos({
  doc, alterados, editar,
}: {
  doc: Documento;
  alterados: Record<string, unknown>;
  editar: (caminho: string, valor: unknown) => void;
}) {
  const entradas = Object.entries(doc).filter(([k]) => !CAMPOS_TECNICOS.has(k));
  return (
    <div className="space-y-4">
      {entradas.map(([chave, valor]) => (
        <Secao key={chave} nome={chave} valor={valor} caminho={chave} alterados={alterados} editar={editar} />
      ))}
    </div>
  );
}

function nomeHumano(chave: string) {
  const mapa: Record<string, string> = {
    metaTitle: 'Título para o Google (60 caracteres)',
    metaDescription: 'Descrição para o Google (155 caracteres)',
    keyword: 'Palavra-chave',
    nome: 'Nome',
    titulo: 'Título',
    intro: 'Introdução',
    resumo: 'Resumo',
    beneficios: 'Benefícios',
    naoIdealPara: 'Quando NÃO serve',
    passos: 'Passo a passo',
    faqs: 'Perguntas frequentes',
    secoes: 'Seções do artigo',
    limitacoes: 'O que este artigo não promete',
    whatItDoes: 'O que ele faz',
    pricingHeading: 'Título da tabela de preços',
    pricingRows: 'Linhas de preço',
    pricingNotes: 'Observações de preço',
    pros: 'Prós',
    cons: 'Contras',
    bestFor: 'Melhor para',
    notFor: 'Não é para',
    verdict: 'Veredito',
  };
  return mapa[chave] ?? chave;
}

function Secao({
  nome, valor, caminho, alterados, editar,
}: {
  nome: string; valor: unknown; caminho: string;
  alterados: Record<string, unknown>;
  editar: (caminho: string, valor: unknown) => void;
}) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4">
      <h2 className="text-[11px] font-black uppercase tracking-wider text-zinc-500 mb-2">
        {nomeHumano(nome)}
      </h2>
      <Valor valor={valor} caminho={caminho} alterados={alterados} editar={editar} />
    </section>
  );
}

function Valor({
  valor, caminho, alterados, editar,
}: {
  valor: unknown; caminho: string;
  alterados: Record<string, unknown>;
  editar: (caminho: string, valor: unknown) => void;
}) {
  if (typeof valor === 'string') {
    const atual = (alterados[caminho] as string) ?? valor;
    const linhas = atual.length > 90 || atual.includes('\n') ? 4 : 1;
    const mudou = alterados[caminho] !== undefined && alterados[caminho] !== valor;
    const limite = caminho.endsWith('metaTitle') ? 60 : caminho.endsWith('metaDescription') ? 155 : 0;

    return (
      <div>
        {linhas === 1 ? (
          <input
            value={atual}
            onChange={(e) => editar(caminho, e.target.value)}
            className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 ${
              mudou ? 'border-amber-400 bg-amber-50/40' : 'border-zinc-300'
            }`}
          />
        ) : (
          <textarea
            value={atual}
            rows={linhas}
            onChange={(e) => editar(caminho, e.target.value)}
            className={`w-full rounded-lg border px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-400 ${
              mudou ? 'border-amber-400 bg-amber-50/40' : 'border-zinc-300'
            }`}
          />
        )}
        {limite > 0 && (
          <p className={`text-[11px] mt-1 ${atual.length > limite ? 'text-red-600 font-bold' : 'text-zinc-400'}`}>
            {atual.length}/{limite}
            {atual.length > limite ? ' — o Google corta o excesso' : ''}
          </p>
        )}
      </div>
    );
  }

  if (Array.isArray(valor)) {
    if (valor.length === 0) return <p className="text-xs text-zinc-400">vazio</p>;
    return (
      <div className="space-y-2">
        {valor.map((v, i) => (
          <div key={i} className="pl-3 border-l-2 border-zinc-100">
            <Valor valor={v} caminho={`${caminho}.${i}`} alterados={alterados} editar={editar} />
          </div>
        ))}
      </div>
    );
  }

  if (valor && typeof valor === 'object') {
    return (
      <div className="space-y-2">
        {Object.entries(valor as Record<string, unknown>).map(([k, v]) => (
          <div key={k}>
            <p className="text-[11px] font-bold text-zinc-500 mb-1">{nomeHumano(k)}</p>
            <Valor valor={v} caminho={`${caminho}.${k}`} alterados={alterados} editar={editar} />
          </div>
        ))}
      </div>
    );
  }

  return <p className="text-xs text-zinc-400">{String(valor)}</p>;
}
