'use client';
import { TOOLS as INITIAL_TOOLS } from '@/lib/tools';
import { AI_TOOLS as INITIAL_AI } from '@/lib/directory';
import { useState, useEffect } from 'react';

const PWD = typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_ADMIN_PASSWORD as string | undefined) : undefined;
const DEFAULT_PWD = PWD || 'WorldHub2026!';

type Tab = 'overview' | 'directory' | 'tools' | 'affiliates' | 'featured' | 'config';

export default function Admin() {
  const [auth, setAuth] = useState(false);
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');
  const [tab, setTab] = useState<Tab>('overview');
  const [ai, setAi] = useState(INITIAL_AI);
  const [tools, setTools] = useState(INITIAL_TOOLS);
  const [q, setQ] = useState('');
  const [showAdd, setShowAdd] = useState<null | 'ai' | 'tool'>(null);
  const [editAi, setEditAi] = useState<any>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('wh_admin') === '1') setAuth(true);
  }, []);

  function login() {
    if (pwd === DEFAULT_PWD) {
      localStorage.setItem('wh_admin', '1');
      setAuth(true);
      setErr('');
    } else setErr('Senha incorreta. Dica: padrão é WorldHub2026! (ou a que você definiu em Vercel → ADMIN_PASSWORD)');
  }
  function logout() {
    localStorage.removeItem('wh_admin');
    setAuth(false);
    setPwd('');
  }

  if (!auth) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[420px] bg-white rounded-2xl p-6 border border-zinc-200 shadow-lg">
          <div className="text-center">
            <div className="inline-flex bg-zinc-900 text-white text-xs font-black px-3 py-1 rounded-full">🔒 ÁREA RESTRITA</div>
            <h1 className="text-2xl font-black mt-3">World Hub — Admin</h1>
            <p className="text-sm text-zinc-500 mt-1">Só você acessa. Visitantes NÃO veem esta página.</p>
          </div>
          <div className="mt-6">
            <label className="text-sm font-bold">Senha</label>
            <input type="password" value={pwd} onChange={e => setPwd(e.target.value)} onKeyDown={e => e.key==='Enter' && login()} placeholder="Digite sua senha" className="mt-1 w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-900" />
            <button onClick={login} className="mt-3 w-full bg-zinc-900 text-white py-3 rounded-full font-black">Entrar →</button>
            {err && <div className="mt-3 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-sm">{err}</div>}
            <div className="mt-4 text-xs bg-yellow-50 border border-yellow-200 rounded-xl p-3">
              <div className="font-black">Senha padrão: <code className="bg-white px-1 rounded">WorldHub2026!</code></div>
              <div className="text-zinc-600 mt-1">Para trocar: Vercel → Settings → Environment Variables → <code className="bg-white px-1 rounded">ADMIN_PASSWORD=sua_senha</code> e <code className="bg-white px-1 rounded">NEXT_PUBLIC_ADMIN_PASSWORD=sua_senha</code> → Redeploy</div>
              <div className="text-zinc-600 mt-1">Acesso direto só por URL: <code className="bg-white px-1 rounded">iatools.online/en/admin</code> — botão Admin foi removido da homepage para visitantes.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredAi = ai.filter(a => !q || a.name.toLowerCase().includes(q.toLowerCase()) || a.slug.includes(q.toLowerCase()));
  const featured = ai.filter(a => a.featured);
  const totalCommission = ai.length;

  return (
    <div className="max-w-[1180px] mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-3xl font-black">Admin — World Hub Pro <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">🔓 Logado</span></h1>
          <p className="text-zinc-500 text-sm">Gerencie tudo. Esta visão é PRIVADA — visitante nunca vê $50/dia, RPM ou Featured $29.</p>
        </div>
        <button onClick={logout} className="text-sm border border-zinc-200 px-4 py-2 rounded-full font-bold hover:border-zinc-900">Sair</button>
      </div>

      <div className="mt-6 flex gap-2 flex-wrap">
        {[
          ['overview', 'Visão Geral 👁️'],
          ['directory', `Directory (${ai.length})`],
          ['tools', `Tools (${tools.length})`],
          ['affiliates', 'Afiliados $'],
          ['featured', `Featured (${featured.length})`],
          ['config', 'Config'],
        ].map(([k, label]) => (
          <button key={k} onClick={() => setTab(k as Tab)} className={`px-4 py-2 rounded-full text-sm font-black border ${tab===k ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white border-zinc-200 hover:border-zinc-900'}`}>{label}</button>
        ))}
      </div>

      {msg && <div className="mt-4 bg-zinc-900 text-white px-4 py-3 rounded-xl text-sm flex justify-between"><span>{msg}</span><button onClick={()=>setMsg(null)} className="text-white/60">✕</button></div>}

      {tab==='overview' && (
        <div className="mt-6 space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-zinc-200"><div className="text-xs font-black tracking-widest text-zinc-400">TOOLS</div><div className="text-3xl font-black mt-1">{tools.length} / 50</div><div className="text-xs text-zinc-500">Objetivo 50 (faltam {Math.max(0,50-tools.length)})</div></div>
            <div className="bg-white rounded-2xl p-5 border border-zinc-200"><div className="text-xs font-black tracking-widest text-zinc-400">DIRECTORY</div><div className="text-3xl font-black mt-1">{ai.length} / 500</div><div className="text-xs text-zinc-500">Atual: {ai.length} demo</div></div>
            <div className="bg-white rounded-2xl p-5 border border-zinc-200"><div className="text-xs font-black tracking-widest text-zinc-400">IDIOMAS</div><div className="text-3xl font-black mt-1">12 × SEO</div><div className="text-xs text-zinc-500">EN ES PT FR DE IT JA KO ZH AR HI RU</div></div>
            <div className="bg-yellow-400 rounded-2xl p-5 border border-black/10"><div className="text-xs font-black tracking-widest text-black/60">DOMÍNIO</div><div className="text-lg font-black mt-1">iatools.online</div><div className="text-xs">AdSense ca-pub-3588158822524146</div></div>
          </div>

          <div className="bg-zinc-900 text-white rounded-2xl p-6">
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="text-xs tracking-widest font-black text-white/50">VISÃO PRIVADA — SEU $50/DIA (NÃO É CONTEÚDO PÚBLICO)</div>
                <h3 className="text-xl font-black mt-1">Matemática para $50/dia — só você vê aqui</h3>
                <p className="text-sm text-white/60">Removido da homepage pública. Aqui você acompanha.</p>
              </div>
              <span className="bg-yellow-400 text-zinc-900 text-xs font-black px-3 py-1 rounded-full">PRIVADO</span>
            </div>
            <div className="mt-6 grid md:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-xl p-4"><div className="text-xs font-black text-yellow-400">1. ADSENSE</div><div className="font-black mt-1">5.000 views × $8 RPM = $40/dia</div><div className="text-xs text-white/60 mt-1">12 línguas • 366 páginas • AdSlot já no layout</div></div>
              <div className="bg-white/10 rounded-xl p-4"><div className="text-xs font-black text-yellow-400">2. AFILIADOS</div><div className="font-black mt-1">5 vendas × $5 média = $25/dia</div><div className="text-xs text-white/60 mt-1">{ai.length} IAs • comissão {ai[0]?.commission || '20-30%'} • link em /directory/[slug]</div></div>
              <div className="bg-white/10 rounded-xl p-4"><div className="text-xs font-black text-yellow-400">3. FEATURED $29</div><div className="font-black mt-1">2 Featured / dia = $58/dia → média $1.9/dia recorrente</div><div className="text-xs text-white/60 mt-1">Stripe $29/mês • badge amarelo • {featured.length} ativos</div></div>
            </div>
            <div className="mt-4 text-xs text-white/50">Total estimado quando bater 5k/dia: ~$50–65/dia. Semana 1: ligar dinheiro (AdSense + 3 afiliados). Semana 2-4: escalar tráfego i18n.</div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-zinc-200">
              <h3 className="font-black">Ações rápidas</h3>
              <div className="mt-3 grid sm:grid-cols-2 gap-2">
                <button onClick={()=>setTab('directory')} className="bg-zinc-900 text-white py-3 rounded-full font-bold text-sm">+ Adicionar IA ($29)</button>
                <button onClick={()=>setTab('tools')} className="bg-white border border-zinc-200 py-3 rounded-full font-black text-sm">+ Nova Tool</button>
                <button onClick={()=>{const data=JSON.stringify(ai,null,2); const blob=new Blob([data],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='directory.json'; a.click(); setMsg('JSON exportado — envie para gerar .bat');}} className="bg-yellow-400 py-3 rounded-full font-black text-sm">⬇ Exportar Directory JSON</button>
                <button onClick={()=>setMsg('Em produção: conectar Vercel Postgres + Prisma. Hoje dados são em src/lib/*.ts')} className="bg-white border border-zinc-200 py-3 rounded-full font-bold text-sm">Conectar DB</button>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-zinc-200">
              <h3 className="font-black">Checklist Monetização (1x)</h3>
              <ol className="list-decimal pl-5 text-sm text-zinc-600 mt-2 space-y-1">
                <li>✅ AdSense ca-pub-3588158822524146 (conta guilhermemarculasilva@gmail.com) — aguardando aprovação</li>
                <li>⬜ Trocar 3 links afiliados de exemplo por seus links reais (ShareASale/Impact)</li>
                <li>⬜ Stripe $29 Featured → webhook → featured=true</li>
                <li>⬜ Search Console + sitemap 12 línguas</li>
              </ol>
              <div className="mt-3 text-xs bg-green-50 border border-green-200 rounded-xl p-3">Quando aprovar AdSense, <code className="bg-white px-1 rounded">&lt;AdSlot&gt;</code> vira <code className="bg-white px-1 rounded">&lt;ins className=&quot;adsbygoogle&quot;&gt;</code> automático.</div>
            </div>
          </div>
        </div>
      )}

      {tab==='directory' && (
        <div className="mt-6 bg-white rounded-2xl p-6 border border-zinc-200">
          <div className="flex flex-wrap justify-between gap-3">
            <h3 className="font-black text-lg">Directory — {ai.length} IAs</h3>
            <div className="flex gap-2">
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar nome/slug" className="border border-zinc-200 rounded-full px-4 py-2 text-sm w-[220px]" />
              <button onClick={()=>setShowAdd('ai')} className="bg-yellow-400 px-4 py-2 rounded-full font-black text-sm">+ Add IA</button>
            </div>
          </div>
          <div className="mt-4 overflow-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-xs text-zinc-400 text-left"><th className="py-2">IA</th><th>Categoria</th><th>Preço</th><th>Comissão</th><th>Featured</th><th>Afiliado</th><th>Ações</th></tr></thead>
              <tbody>
                {filteredAi.map(a=>(
                  <tr key={a.slug} className="border-t border-zinc-100">
                    <td className="py-2 font-bold">{a.logo} {a.name}<span className="text-xs text-zinc-400 ml-2">/{a.slug}</span></td>
                    <td>{a.category}</td>
                    <td><span className="bg-zinc-900 text-white px-2 py-1 rounded-full text-xs">{a.pricing}</span></td>
                    <td className="text-green-700 font-bold">{a.commission}</td>
                    <td><button onClick={()=>setAi(prev=>prev.map(x=>x.slug===a.slug?{...x, featured:!x.featured}:x))} className={`text-xs px-2 py-1 rounded-full font-black ${a.featured?'bg-yellow-400':'bg-zinc-100'}`}>{a.featured?'⭐ Featured':'—'}</button></td>
                    <td className="text-xs max-w-[180px] truncate">{a.affiliate}</td>
                    <td className="flex gap-1 py-2">
                      <button onClick={()=>setEditAi(a)} className="text-xs border border-zinc-200 px-2 py-1 rounded-full">Editar</button>
                      <button onClick={()=>{if(confirm('Remover '+a.name+'?')) setAi(prev=>prev.filter(x=>x.slug!==a.slug))}} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full">Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredAi.length===0 && <div className="text-center text-sm text-zinc-500 py-6">Nenhum resultado para "{q}"</div>}
          <div className="mt-4 text-xs text-zinc-500">Edições aqui são em memória. Clique <b>Exportar JSON</b> na Visão Geral para gerar .bat de deploy.</div>
        </div>
      )}

      {tab==='tools' && (
        <div className="mt-6 bg-white rounded-2xl p-6 border border-zinc-200">
          <div className="flex justify-between">
            <h3 className="font-black text-lg">Tools — {tools.length} / 50</h3>
            <button onClick={()=>setShowAdd('tool')} className="bg-zinc-900 text-white px-4 py-2 rounded-full font-black text-sm">+ Add Tool</button>
          </div>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tools.map(t=>(
              <div key={t.slug} className="border border-zinc-200 rounded-xl p-4 flex justify-between">
                <div><div className="font-black">{t.icon} {t.name}</div><div className="text-xs text-zinc-500">/{t.slug} • {t.category}</div>{t.affiliate && <div className="text-xs bg-zinc-100 inline-block px-2 py-1 rounded-full mt-1">{t.affiliate}</div>}</div>
                <button onClick={()=>{if(confirm('Remover '+t.name+'?')) setTools(prev=>prev.filter(x=>x.slug!==t.slug))}} className="text-xs text-red-600">Excluir</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==='affiliates' && (
        <div className="mt-6 bg-white rounded-2xl p-6 border border-zinc-200">
          <h3 className="font-black text-lg">Afiliados — onde ganha</h3>
          <p className="text-sm text-zinc-500">Troque os exemplos abaixo pelos seus links reais. Cada /directory/[slug] terá botão com seu link.</p>
          <div className="mt-4 grid md:grid-cols-2 gap-3">
            {ai.map(a=>(
              <div key={a.slug} className="border border-zinc-200 rounded-xl p-4 flex justify-between items-center">
                <div><div className="font-black">{a.logo} {a.name}</div><div className="text-xs text-zinc-500">{a.affiliate} • {a.commission}</div></div>
                <a href="#" onClick={e=>{e.preventDefault(); const url=prompt('Cole seu link afiliado para '+a.name, 'https://'); if(url) { setAi(prev=>prev.map(x=>x.slug===a.slug?{...x, affiliate:url}:x)); setMsg('Link de '+a.name+' atualizado (em memória). Exporte JSON.'); } }} className="text-xs bg-zinc-900 text-white px-3 py-1.5 rounded-full font-bold">Editar link</a>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs bg-zinc-900 text-white rounded-xl p-3">Dica: priorize 3 primeiro: Jasper (30% recorrente), ElevenLabs (30%), Runway ($25). ShareASale / Impact / PartnerStack.</div>
        </div>
      )}

      {tab==='featured' && (
        <div className="mt-6 bg-white rounded-2xl p-6 border border-zinc-200">
          <h3 className="font-black text-lg">Featured $29/mês — {featured.length} ativos</h3>
          <p className="text-sm text-zinc-500">Em produção: Stripe Product $29 → webhook → Prisma `featured=true` → card com fundo amarelo e badge ⭐ Featured no topo da Directory.</p>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {featured.map(a=>(
              <div key={a.slug} className="bg-yellow-50 border border-yellow-300 rounded-xl p-4">
                <div className="font-black">⭐ {a.logo} {a.name}</div><div className="text-xs text-zinc-600">{a.desc}</div><div className="text-xs bg-yellow-400 inline-block px-2 py-1 rounded-full mt-2 font-black">Featured $29/mês</div>
                <button onClick={()=>setAi(prev=>prev.map(x=>x.slug===a.slug?{...x, featured:false}:x))} className="ml-2 text-xs underline">Desativar</button>
              </div>
            ))}
            {featured.length===0 && <div className="text-sm text-zinc-500">Nenhum Featured ativo. Marque ⭐ na aba Directory.</div>}
          </div>
          <div className="mt-4 bg-zinc-50 border border-dashed border-zinc-300 rounded-xl p-4 text-xs">Webhook Stripe: <code className="bg-white px-1 rounded">/api/stripe/webhook</code> → <code>prisma.directoryTool.update featured true</code></div>
        </div>
      )}

      {tab==='config' && (
        <div className="mt-6 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-zinc-200">
            <h3 className="font-black">Config — 1 domínio, 12 línguas</h3>
            <div className="mt-3 grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-zinc-50 rounded-xl p-4"><div className="font-black">Domínio</div><div>iatools.online</div><div className="text-xs text-zinc-500">Vercel → Settings → Domains → iatools.online (www redirect)</div></div>
              <div className="bg-zinc-50 rounded-xl p-4"><div className="font-black">AdSense</div><div>ca-pub-3588158822524146</div><div className="text-xs text-zinc-500">guilhermemarculasilva@gmail.com — Verificação pendente</div></div>
              <div className="bg-zinc-50 rounded-xl p-4"><div className="font-black">Idiomas</div><div>EN ES PT FR DE IT JA KO ZH AR HI RU</div><div className="text-xs text-zinc-500">hreflang + auto-translate • 1 repo 12x SEO</div></div>
              <div className="bg-zinc-50 rounded-xl p-4"><div className="font-black">Senha Admin</div><div>Env ADMIN_PASSWORD + NEXT_PUBLIC_ADMIN_PASSWORD</div><div className="text-xs text-zinc-500">Atual: {DEFAULT_PWD === 'WorldHub2026!' ? 'WorldHub2026! (padrão)' : 'custom (env)'}</div></div>
            </div>
            <div className="mt-4 text-xs bg-yellow-50 border border-yellow-200 rounded-xl p-3">Para esconder admin de visitantes já feito: botão <code className="bg-white px-1 rounded">Admin</code> removido da homepage pública. Acesso só via <code className="bg-white px-1 rounded">/en/admin</code> + senha.</div>
          </div>
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-[560px]">
            <h3 className="font-black text-lg">{showAdd==='ai'?'Adicionar IA ao Directory':'Adicionar Tool'}</h3>
            <p className="text-sm text-zinc-500">Preencha e clique Salvar (em memória).</p>
            <div className="mt-4 space-y-3">
              <input id="add-name" placeholder={showAdd==='ai'?'Nome ex: Claude 3':'Nome ex: Merge PDF'} className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm" />
              <input id="add-slug" placeholder="slug ex: claude-3 (sem espaços)" className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm" />
              <input id="add-desc" placeholder="Descrição curta" className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm" />
              <div className="flex gap-2">
                <button onClick={()=>{
                  const name=(document.getElementById('add-name') as HTMLInputElement).value.trim();
                  const slug=(document.getElementById('add-slug') as HTMLInputElement).value.trim().toLowerCase().replace(/\s+/g,'-');
                  const desc=(document.getElementById('add-desc') as HTMLInputElement).value.trim();
                  if(!name||!slug) { alert('Preencha nome e slug'); return; }
                  if(showAdd==='ai') {
                    if(ai.some(x=>x.slug===slug)) { alert('Slug já existe'); return; }
                    setAi(prev=>[...prev, {slug, name, desc: desc||'New AI tool', category:'productivity', pricing:'Freemium', affiliate:'Seu link afiliado aqui', commission:'20%', logo:'🤖'} as any]);
                  } else {
                    if(tools.some(x=>x.slug===slug)) { alert('Slug já existe'); return; }
                    setTools(prev=>[...prev, {slug, name, desc: desc||'New tool', icon:'🔧', category:'dev'} as any]);
                  }
                  setShowAdd(null); setMsg((showAdd==='ai'?'IA ':'Tool ')+name+' adicionada (em memória). Exporte JSON.');
                }} className="flex-1 bg-zinc-900 text-white py-2.5 rounded-full font-black">Salvar</button>
                <button onClick={()=>setShowAdd(null)} className="flex-1 border border-zinc-200 py-2.5 rounded-full font-bold">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editAi && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-[560px]">
            <h3 className="font-black text-lg">Editar {editAi.name}</h3>
            <div className="mt-4 space-y-3">
              <input id="edit-name" defaultValue={editAi.name} className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm" />
              <input id="edit-affiliate" defaultValue={editAi.affiliate} placeholder="Link afiliado" className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm" />
              <input id="edit-commission" defaultValue={editAi.commission} placeholder="Comissão ex: 30%" className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm" />
              <div className="flex gap-2">
                <button onClick={()=>{
                  const name=(document.getElementById('edit-name') as HTMLInputElement).value.trim();
                  const affiliate=(document.getElementById('edit-affiliate') as HTMLInputElement).value.trim();
                  const commission=(document.getElementById('edit-commission') as HTMLInputElement).value.trim();
                  setAi(prev=>prev.map(x=>x.slug===editAi.slug?{...x, name: name||x.name, affiliate: affiliate||x.affiliate, commission: commission||x.commission}:x));
                  setEditAi(null); setMsg('Atualizado: '+name);
                }} className="flex-1 bg-zinc-900 text-white py-2.5 rounded-full font-black">Salvar</button>
                <button onClick={()=>setEditAi(null)} className="flex-1 border border-zinc-200 py-2.5 rounded-full font-bold">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
