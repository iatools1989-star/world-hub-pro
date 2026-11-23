/* =====================================================================
   Painel de administracao — iatools.online
   =====================================================================
   O QUE ESTE PAINEL FAZ
   Edita e cria paginas de conteudo (reviews do diretorio e paginas de
   ferramenta). Ele NAO altera lib/directoryContent.ts nem
   lib/toolEditorial.ts: escreve lib/contentOverrides.ts, que o site mescla
   por cima. Assim uma edicao vira um diff pequeno, e um erro no painel
   nunca apaga o texto original — basta remover a entrada.

   COMO PUBLICA
   O site e um Worker no Cloudflare com o conteudo compilado do repositorio.
   Se o painel so gravasse em memoria, tudo se perderia no proximo deploy.
   Por isso: ele gera o arquivo e faz commit direto no GitHub (API contents).
   O GitHub Actions rebuilda e publica sozinho. Um deploy leva ~2-3 min.

   SEGURANCA
   - O painel e estatico: quem protege o conteudo e o token do GitHub, que
     fica no seu navegador (localStorage) e nunca e enviado a este site.
   - O token precisa de escopo `Contents: read and write` apenas neste repo.
   - Nada aqui e indexado (noindex + robots.txt).

   LIMITES CONHECIDOS (nao escondidos)
   - Precisa de token: nao ha login proprio. Sem token, o painel so visualiza.
   - Nao edita componentes React das ferramentas (o widget em si).
   - Nao exclui ferramentas nem paginas legais.
   - Nao tem historico: o historico e o git.
   ===================================================================== */

const REPO = 'iatools1989-star/world-hub-pro';
const BRANCH = 'main';
const FILE = 'lib/contentOverrides.ts';
const K_TOKEN = 'iatools.gh.token';

let S = {
  token: localStorage.getItem(K_TOKEN) || '',
  ready: false,
  current: null,        // {kind:'dir'|'tool'|'site', slug}
  overrides: { dir: {}, tool: {} },
  files: { data: '', dirContent: '', toolEditorial: '', toolContent: '', privacy: '', terms: '', about: '', contact: '' },
  dirty: false,
};

const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const toast = (msg, ms = 2600) => {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('show'), ms);
};

/* ---------------------------------------------------------------- GitHub */

async function gh(path, opts = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...opts,
    headers: {
      Accept: 'application/vnd.github+json',
      ...(S.token ? { Authorization: `Bearer ${S.token}` } : {}),
      ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub ${res.status}: ${body.slice(0, 220)}`);
  }
  return res.json();
}

async function readFileFromRepo(path) {
  // raw e publico: nao exige token para ler
  const res = await fetch(`https://raw.githubusercontent.com/${REPO}/${BRANCH}/${path}?t=${Date.now()}`);
  if (!res.ok) throw new Error(`raw ${path}: ${res.status}`);
  return res.text();
}

async function writeFileToRepo(path, content, message) {
  if (!S.token) throw new Error('Sem token: conecte o GitHub para publicar.');
  let sha;
  try {
    const cur = await gh(`/repos/${REPO}/contents/${path}?ref=${BRANCH}`);
    sha = cur.sha;
  } catch { /* arquivo novo */ }
  const b64 = btoa(unescape(encodeURIComponent(content)));
  return gh(`/repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify({ message, content: b64, branch: BRANCH, ...(sha ? { sha } : {}) }),
  });
}

/* ------------------------------------------------------- dados do site */

async function carregarDados() {
  const [data, privacy, terms, about, contact, dirContent, toolEd, toolContent] = await Promise.all([
    readFileFromRepo('lib/data.ts'),
    readFileFromRepo('app/[locale]/privacy/page.tsx'),
    readFileFromRepo('app/[locale]/terms/page.tsx'),
    readFileFromRepo('app/[locale]/about/page.tsx'),
    readFileFromRepo('app/[locale]/contact/page.tsx'),
    readFileFromRepo('lib/directoryContent.ts'),
    readFileFromRepo('lib/toolEditorial.ts'),
    readFileFromRepo('lib/toolContent.ts'),
  ]);
  S.files = { data, dirContent, toolEditorial: toolEd, toolContent, privacy, terms, about, contact };

  // overrides atuais
  try {
    const ov = await readFileFromRepo(FILE);
    S.overrides = parseOverrides(ov);
  } catch {
    S.overrides = { dir: {}, tool: {} };
  }

  S.ready = true;
  renderNav();
  render();
}

/** Le os dois Records do arquivo de overrides com eval controlado. */
function parseOverrides(src) {
  const dir = {};
  const tool = {};
  for (const [alvo, kind] of [['DIRECTORY_OVERRIDES', 'dir'], ['TOOL_OVERRIDES', 'tool']]) {
    const i = src.indexOf(`export const ${alvo}`);
    if (i === -1) continue;
    const start = src.indexOf('{', src.indexOf('=', i));
    // percorre balanceando chaves
    let depth = 0, end = -1, inStr = null;
    for (let j = start; j < src.length; j++) {
      const c = src[j];
      if (inStr) { if (c === '\\') j++; else if (c === inStr) inStr = null; continue; }
      if (c === "'" || c === '"' || c === '`') { inStr = c; continue; }
      if (c === '{') depth++;
      else if (c === '}') { depth--; if (depth === 0) { end = j + 1; break; } }
    }
    if (end === -1) continue;
    const literal = src.slice(start, end);
    try {
      const obj = new Function(`return (${literal})`)();
      Object.assign(kind === 'dir' ? dir : tool, obj);
    } catch (e) {
      console.warn('override ilegivel', alvo, e);
    }
  }
  return { dir, tool };
}

function mk(seed) {
  const i = S.files.data.indexOf(seed);
  return i;
}

/** Extrai os itens do DIRECTORY_ITEMS (name, desc, category, pricing, icon, affiliateUrl). */
function directoryItems() {
  const src = S.files.data;
  const i = src.indexOf('DIRECTORY_ITEMS');
  const seg = src.slice(i, src.indexOf('];', i));
  const out = [];
  const re = /\{\s*slug:\s*'([^']+)'([^}]*)\}/g;
  let m;
  while ((m = re.exec(seg))) {
    const slug = m[1];
    const campos = m[2];
    const pega = (k) => {
      const r = new RegExp(`${k}:\\s*'([^']*)'`).exec(campos);
      return r ? r[1] : '';
    };
    out.push({ slug, name: pega('name'), desc: pega('desc'), category: pega('category'), pricing: pega('pricing'), icon: pega('icon') });
  }
  return out.filter((d) => d.name);
}

function toolItems() {
  const src = S.files.data;
  const i = src.indexOf('export const TOOLS');
  const seg = src.slice(i, src.indexOf('];', i));
  const out = [];
  const re = /\{\s*slug:\s*'([^']+)'([^}]*)\}/g;
  let m;
  while ((m = re.exec(seg))) {
    const pega = (k) => {
      const r = new RegExp(`${k}:\\s*'([^']*)'`).exec(m[2]);
      return r ? r[1] : '';
    };
    out.push({ slug: m[1], name: pega('name'), desc: pega('desc') });
  }
  return out.filter((d) => d.name && d.slug);
}

/* ------------------------------------------------------------- helpers */

function field(label, value, oninput, opts = {}) {
  const { hint, rows, type = 'text', min, max } = opts;
  const id = 'f' + Math.random().toString(36).slice(2, 9);
  const counter = opts.counter
    ? `<span class="count" id="${id}c"></span>`
    : '';
  setTimeout(() => { if (opts.counter) updateCount(id, value, opts.counter); }, 0);
  if (rows) {
    return `<label for="${id}">${esc(label)}${counter}</label>
      <textarea id="${id}" rows="${rows}" placeholder="${esc(opts.ph || '')}"
        oninput="window.__inp('${id}','${esc(opts.key)}',this.value,${opts.counter || 0})">${esc(value || '')}</textarea>
      ${hint ? `<div class="hint">${hint}</div>` : ''}`;
  }
  return `<label for="${id}">${esc(label)}${counter}</label>
    <input id="${id}" type="${type}" ${min != null ? `min="${min}"` : ''} ${max != null ? `max="${max}"` : ''}
      value="${esc(value || '')}" placeholder="${esc(opts.ph || '')}"
      oninput="window.__inp('${id}','${esc(opts.key)}',this.value,${opts.counter || 0})">
    ${hint ? `<div class="hint">${hint}</div>` : ''}`;
}

function updateCount(id, v, range) {
  const el = document.getElementById(id + 'c');
  if (!el) return;
  const n = (v || '').length;
  const [lo, hi] = range;
  el.textContent = `${n} / ${hi}`;
  el.className = 'count ' + (n >= lo && n <= hi ? 'ok' : n === 0 ? '' : n < lo ? 'warn' : 'bad');
  el.title = `faixa ideal: ${lo}-${hi} caracteres`;
}

/** edicao de lista de strings */
function listEditor(arr, key, singular) {
  const itens = (arr || []).map((v, i) => `
    <div class="list-item">
      <div class="list-head"><strong>${esc(singular)} ${i + 1}</strong><span class="spacer" style="flex:1"></span>
        <button class="danger" onclick="window.__del('${esc(key)}',${i})">remover</button></div>
      <textarea rows="2" oninput="window.__list('${esc(key)}',${i},this.value)">${esc(v)}</textarea>
    </div>`).join('');
  return `${itens}<button onclick="window.__add('${esc(key)}')">+ adicionar ${esc(singular.toLowerCase())}</button>`;
}

function objListEditor(arr, key, campos, singular) {
  const itens = (arr || []).map((o, i) => `
    <div class="list-item">
      <div class="list-head"><strong>${esc(singular)} ${i + 1}</strong><span style="flex:1"></span>
        <button class="danger" onclick="window.__del('${esc(key)}',${i})">remover</button></div>
      <div class="grid3">
        ${campos.map((c) => `<div>
          <div class="hint" style="margin:0 0 3px">${esc(c.label)}</div>
          <input value="${esc(o[c.k] ?? '')}" placeholder="${esc(c.ph || '')}"
            oninput="window.__obj('${esc(key)}',${i},'${esc(c.k)}',this.value)">
        </div>`).join('')}
      </div>
    </div>`).join('');
  return `${itens}<button onclick="window.__addObj('${esc(key)}')">+ adicionar ${esc(singular.toLowerCase())}</button>`;
}

/* --------------------------------------------------------------- estado */

function getEditor() {
  const c = S.current;
  if (!c) return null;
  if (c.kind === 'dir') {
    const base = window.__DIR_BASE?.[c.slug] || {};
    const ov = S.overrides.dir[c.slug] || {};
    return { base, ov, store: S.overrides.dir, slug: c.slug };
  }
  if (c.kind === 'tool') {
    const base = window.__TOOL_BASE?.[c.slug] || {};
    const ov = S.overrides.tool[c.slug] || {};
    return { base, ov, store: S.overrides.tool, slug: c.slug };
  }
  return null;
}

function val(key) {
  const e = getEditor();
  if (!e) return '';
  return e.ov[key] !== undefined ? e.ov[key] : e.base[key];
}

window.__inp = (id, key, v, counter) => {
  const e = getEditor();
  if (!e) return;
  e.store[e.slug] = { ...(e.store[e.slug] || {}), [key]: v };
  S.dirty = true;
  marcarDirty();
  if (counter) updateCount(id, v, counter);
};
window.__list = (key, i, v) => {
  const e = getEditor();
  if (!e) return;
  const arr = [...(e.ov[key] !== undefined ? e.ov[key] : e.base[key] || [])];
  arr[i] = v;
  e.store[e.slug] = { ...(e.store[e.slug] || {}), [key]: arr };
  S.dirty = true; marcarDirty();
};
window.__obj = (key, i, fieldName, v) => {
  const e = getEditor();
  if (!e) return;
  const arr = [...(e.ov[key] !== undefined ? e.ov[key] : e.base[key] || [])];
  arr[i] = { ...arr[i], [fieldName]: v };
  e.store[e.slug] = { ...(e.store[e.slug] || {}), [key]: arr };
  S.dirty = true; marcarDirty();
};
window.__del = (key, i) => {
  const e = getEditor();
  if (!e) return;
  const arr = [...(e.ov[key] !== undefined ? e.ov[key] : e.base[key] || [])];
  arr.splice(i, 1);
  e.store[e.slug] = { ...(e.store[e.slug] || {}), [key]: arr };
  S.dirty = true; marcarDirty(); render();
};
window.__add = (key) => {
  const e = getEditor();
  if (!e) return;
  const arr = [...(e.ov[key] !== undefined ? e.ov[key] : e.base[key] || []), ''];
  e.store[e.slug] = { ...(e.store[e.slug] || {}), [key]: arr };
  S.dirty = true; marcarDirty(); render();
};
window.__addObj = (key) => {
  const e = getEditor();
  if (!e) return;
  const modelo = { pricingRows: { plan: '', price: '', includes: '' }, faqs: { q: '', a: '' }, alternatives: { name: '', href: '', why: '' }, benefits: { title: '', desc: '' }, related: { name: '', href: '', why: '' }, cta: null }[key] || {};
  const arr = [...(e.ov[key] !== undefined ? e.ov[key] : e.base[key] || []), modelo];
  e.store[e.slug] = { ...(e.store[e.slug] || {}), [key]: arr };
  S.dirty = true; marcarDirty(); render();
};

function marcarDirty() {
  const b = $('#btnPublish');
  b.textContent = S.dirty ? 'Publicar •' : 'Publicar';
  b.disabled = !S.dirty || !S.token;
}

/* ------------------------------------------------------------ render */

function renderNav() {
  const dirs = directoryItems();
  const tools = toolItems();
  $('#navDirectory').innerHTML = dirs.map((d) => `
    <button class="item ${S.current?.kind === 'dir' && S.current.slug === d.slug ? 'on' : ''}"
      onclick="window.__go('dir','${esc(d.slug)}')">
      ${esc(d.icon || '•')} ${esc(d.name)}
      <small>${esc(d.pricing || '')}${S.overrides.dir[d.slug] ? ' · editado' : ''}</small>
    </button>`).join('');

  $('#navTools').innerHTML = tools.map((t) => `
    <button class="item ${S.current?.kind === 'tool' && S.current.slug === t.slug ? 'on' : ''}"
      onclick="window.__go('tool','${esc(t.slug)}')">
      ${esc(t.name)}
      <small>${S.overrides.tool[t.slug] ? 'editado' : 'original'}</small>
    </button>`).join('');

  $('#navSite').innerHTML = ['privacy', 'terms', 'about', 'contact'].map((k) => `
    <button class="item ${S.current?.kind === 'site' && S.current.slug === k ? 'on' : ''}"
      onclick="window.__go('site','${k}')">${esc({ privacy: 'Privacidade', terms: 'Termos', about: 'Sobre', contact: 'Contato' }[k])}</button>`).join('');
}

window.__go = (kind, slug) => {
  S.current = { kind, slug };
  S.dirty = false;
  marcarDirty();
  renderNav();
  render();
};

function render() {
  const c = S.current;
  if (!c) { $('#editor').innerHTML = homeHTML(); return; }
  if (c.kind === 'dir') return renderDir(c.slug);
  if (c.kind === 'tool') return renderTool(c.slug);
  if (c.kind === 'site') return renderSite(c.slug);
}

function homeHTML() {
  return `<div class="card pad">
    <h1>Painel de conteúdo</h1>
    <p class="sub">Edite as 10 reviews do diretório, as 16 páginas de ferramenta e o texto das páginas legais.</p>

    <div class="banner info" style="margin-top:16px">
      <b>Como este painel funciona.</b> Ele não altera os arquivos originais
      (<span class="kbd">lib/directoryContent.ts</span>,
      <span class="kbd">lib/toolEditorial.ts</span>). Escreve
      <span class="kbd">lib/contentOverrides.ts</span>, que o site mescla por cima.
      Uma edição vira um diff pequeno e reversível: apagar a entrada devolve o texto original.
    </div>

    <div class="banner warn">
      <b>Publicar exige um token do GitHub.</b> O site é um Worker com o conteúdo compilado
      do repositório — se o painel guardasse a edição só aqui, ela sumiria no próximo deploy.
      Então ele commita no GitHub e o deploy automático publica em ~2–3 minutos.
    </div>

    <h2 style="margin-top:20px">Antes de publicar, o painel checa</h2>
    <div id="checkAll"></div>

    <details style="margin-top:18px">
      <summary>O que este painel não faz</summary>
      <div class="hint" style="margin-top:8px;line-height:1.7">
        Não edita o componente React das ferramentas (o widget em si). Não exclui ferramentas.
        Não mexe em páginas legais por formulário — só mostra onde estão as afirmações que
        precisam de data e de canal de contato. Não tem login próprio: a proteção é o token,
        que fica no seu navegador.
      </div>
    </details>
  </div>`;
}

function renderDir(slug) {
  const base = (window.__DIR_BASE || {})[slug] || {};
  const item = directoryItems().find((d) => d.slug === slug) || { name: slug };
  const ov = S.overrides.dir[slug] || {};
  const usaOverride = Object.keys(ov).length > 0;

  $('#editor').innerHTML = `
  <div class="card pad">
    <h1>${esc(item.icon || '')} ${esc(item.name)}</h1>
    <p class="sub">${esc(item.category || '')} · ${esc(item.pricing || '')} ·
      <a href="/en/directory/${esc(slug)}" target="_blank">ver página ↗</a></p>
    ${usaOverride
      ? `<div class="banner warn" style="margin-top:12px">Esta página tem <b>${Object.keys(ov).length} campo(s) editados</b> no painel.
           <button class="ghost" style="padding:2px 8px;margin-left:8px" onclick="window.__reset('dir','${esc(slug)}')">descartar edições</button></div>`
      : `<div class="banner ok" style="margin-top:12px">Texto original, sem edições do painel.</div>`}

    ${field('Title (SEO)', usaOverride ? ov.metaTitle ?? base.metaTitle : base.metaTitle, null, { key: 'metaTitle', counter: [40, 60], ph: 'Pricing (2026): …' })}
    ${field('Meta description', usaOverride ? ov.metaDescription ?? base.metaDescription : base.metaDescription, null, { key: 'metaDescription', rows: 3, counter: [120, 158] })}

    <label>Introdução (um parágrafo por caixa)</label>
    ${listEditor(usaOverride ? ov.intro ?? base.intro : base.intro, 'intro', 'Parágrafo')}

    <label>What you actually get</label>
    ${listEditor(usaOverride ? ov.whatItDoes ?? base.whatItDoes : base.whatItDoes, 'whatItDoes', 'Parágrafo')}

    <label>Título da tabela de preços</label>
    ${field('', usaOverride ? ov.pricingHeading ?? base.pricingHeading : base.pricingHeading, null, { key: 'pricingHeading' })}

    <label>Linhas da tabela</label>
    ${objListEditor(usaOverride ? ov.pricingRows ?? base.pricingRows : base.pricingRows, 'pricingRows',
      [{ k: 'plan', label: 'Plano', ph: 'Creator' }, { k: 'price', label: 'Preço', ph: '$49/mo' }, { k: 'includes', label: 'O que inclui' }], 'Linha')}

    <label>Notas de preço (onde o número publicado engana)</label>
    ${listEditor(usaOverride ? ov.pricingNotes ?? base.pricingNotes : base.pricingNotes, 'pricingNotes', 'Nota')}

    <div class="row">
      <div><label>Vantagens</label>${listEditor(usaOverride ? ov.pros ?? base.pros : base.pros, 'pros', 'Vantagem')}</div>
      <div><label>Desvantagens</label>${listEditor(usaOverride ? ov.cons ?? base.cons : base.cons, 'cons', 'Desvantagem')}</div>
    </div>

    ${field('Buy it if', usaOverride ? ov.bestFor ?? base.bestFor : base.bestFor, null, { key: 'bestFor', rows: 2 })}
    ${field('Do NOT buy it if', usaOverride ? ov.notFor ?? base.notFor : base.notFor, null, { key: 'notFor', rows: 2, hint: 'Obrigatório: toda página precisa de um caso em que a compra é errada.' })}

    <label>Alternativas</label>
    ${objListEditor(usaOverride ? ov.alternatives ?? base.alternatives : base.alternatives, 'alternatives',
      [{ k: 'name', label: 'Nome' }, { k: 'href', label: 'Link', ph: '/en/directory/x' }, { k: 'why', label: 'Por quê' }], 'Alternativa')}

    <label>Veredito (um parágrafo por caixa)</label>
    ${listEditor(usaOverride ? ov.verdict ?? base.verdict : base.verdict, 'verdict', 'Parágrafo')}

    <label>Perguntas frequentes</label>
    ${objListEditor(usaOverride ? ov.faqs ?? base.faqs : base.faqs, 'faqs',
      [{ k: 'q', label: 'Pergunta' }, { k: 'a', label: 'Resposta' }], 'Pergunta')}

    ${field('Preços checados em', usaOverride ? ov.updated ?? base.updated : base.updated, null, { key: 'updated', ph: '2026-11-10', hint: 'Muda a data que aparece na página e no JSON-LD.' })}
  </div>

  <div class="card pad">
    <h2>Checagens automáticas desta página</h2>
    <div id="checks"></div>
    <div class="actions">
      <button onclick="window.__preview('dir','${esc(slug)}')">Gerar arquivo e ver diff</button>
    </div>
  </div>`;

  runChecks(dirChecklist(slug, base, ov));
}

function renderTool(slug) {
  const base = (window.__TOOL_BASE || {})[slug] || {};
  const item = toolItems().find((t) => t.slug === slug) || { name: slug };
  const ov = S.overrides.tool[slug] || {};
  const usaOverride = Object.keys(ov).length > 0;
  const cta = (usaOverride && ov.cta) || base.cta || {};

  $('#editor').innerHTML = `
  <div class="card pad">
    <h1>${esc(item.name)}</h1>
    <p class="sub">Ferramenta · <a href="/en/tools/${esc(slug)}" target="_blank">ver página ↗</a></p>
    ${usaOverride
      ? `<div class="banner warn" style="margin-top:12px">${Object.keys(ov).length} campo(s) editados.
           <button class="ghost" style="padding:2px 8px;margin-left:8px" onclick="window.__reset('tool','${esc(slug)}')">descartar edições</button></div>`
      : `<div class="banner ok" style="margin-top:12px">Texto original, sem edições do painel.</div>`}

    ${field('Title (SEO)', usaOverride ? ov.metaTitle ?? base.metaTitle : base.metaTitle, null, { key: 'metaTitle', counter: [40, 60] })}
    ${field('Meta description', usaOverride ? ov.metaDescription ?? base.metaDescription : base.metaDescription, null, { key: 'metaDescription', rows: 3, counter: [140, 158] })}
    ${field('Palavra-chave', usaOverride ? ov.keyword ?? base.keyword : base.keyword, null, { key: 'keyword' })}

    <label>Introdução</label>
    ${listEditor(usaOverride ? ov.intro ?? base.intro : base.intro, 'intro', 'Parágrafo')}

    <label>Benefícios</label>
    ${objListEditor(usaOverride ? ov.benefits ?? base.benefits : base.benefits, 'benefits',
      [{ k: 'title', label: 'Título' }, { k: 'desc', label: 'Descrição' }], 'Benefício')}

    ${field('Quando esta ferramenta é a escolha errada', usaOverride ? ov.notIdealFor ?? base.notIdealFor : base.notIdealFor, null, { key: 'notIdealFor', rows: 3, hint: 'A seção que dá credibilidade. Não deixe vazia.' })}

    <label>CTA (chamada para o diretório)</label>
    ${objListEditor([cta], 'cta',
      [{ k: 'partner', label: 'Parceiro', ph: 'Canva' }, { k: 'label', label: 'Rótulo', ph: 'Ver opções' }, { k: 'href', label: 'Link', ph: '/en/directory/canva-magic' }], 'CTA')}
    ${field('Texto do CTA', cta.body, null, { key: 'cta.body', rows: 2 })}
    <div class="banner ${cta.monetized ? 'warn' : 'info'}" style="margin-top:10px">
      ${cta.monetized
        ? '<b>monetized: true</b> — a página vai exibir <b>#ad</b> e <code>rel="sponsored"</code>. Só ligue isto quando o link realmente tiver um ID de afiliado.'
        : '<b>monetized: false</b> — o link é editorial. A página mostra "Official site" e diz que não ganhamos nada no clique. É o estado correto enquanto não houver ID de afiliado.'}
    </div>

    <label>Leituras relacionadas</label>
    ${objListEditor(usaOverride ? ov.related ?? base.related : base.related, 'related',
      [{ k: 'name', label: 'Nome' }, { k: 'href', label: 'Link' }, { k: 'why', label: 'Por quê' }], 'Leitura')}

    ${field('Atualizado em', usaOverride ? ov.updated ?? base.updated : base.updated, null, { key: 'updated' })}
  </div>
  <div class="card pad">
    <h2>Checagens automáticas desta página</h2>
    <div id="checks"></div>
    <div class="actions"><button onclick="window.__preview('tool','${esc(slug)}')">Gerar arquivo e ver diff</button></div>
  </div>`;

  runChecks(toolChecklist(slug, base, ov, cta));
}

function renderSite(kind) {
  const nomes = { privacy: 'Política de privacidade', terms: 'Termos de uso', about: 'Sobre', contact: 'Contato' };
  const arq = { privacy: 'app/[locale]/privacy/page.tsx', terms: 'app/[locale]/terms/page.tsx', about: 'app/[locale]/about/page.tsx', contact: 'app/[locale]/contact/page.tsx' }[kind];
  const src = S.files[kind] || '';
  const linhas = [
    ['Last updated', /Last updated[^<\n]*/],
    ['Canal de direitos (GDPR/LGPD)', /Data request|contact@iatools\.online/],
    ['e-mail de contato', /[a-z]+@iatools\.online/],
  ];
  const achados = linhas.map(([n, re]) => {
    const m = src.match(re);
    return `<div class="chk"><b>${esc(n)}:</b>&nbsp;${m ? `<span class="pill ok">presente</span> <code style="font-size:11px">${esc(m[0].slice(0, 70))}</code>` : '<span class="pill bad">ausente</span>'}</div>`;
  }).join('');

  $('#editor').innerHTML = `
  <div class="card pad">
    <h1>${esc(nomes[kind])}</h1>
    <p class="sub"><a href="/en/${kind}" target="_blank">ver página ↗</a> · arquivo <span class="kbd">${esc(arq)}</span></p>
    <div class="banner info" style="margin-top:14px">
      Estas páginas não são editadas por formulário de propósito: são texto jurídico e institucional,
      onde uma vírgula muda o sentido. O painel mostra o estado dos pontos que o AdSense e o GDPR
      cobram, e a edição é feita no arquivo.
    </div>
    <h2 style="margin-top:16px">Checagens</h2>
    ${achados}
    <div class="actions">
      <a href="https://github.com/${REPO}/edit/${BRANCH}/${arq.split('/').map(encodeURIComponent).join('/')}" target="_blank">
        <button class="primary">Abrir no GitHub para editar</button></a>
      <a href="/en/${kind}" target="_blank"><button>Ver no site</button></a>
    </div>
    <details style="margin-top:16px">
      <summary>Ver o texto atual</summary>
      <div class="file-out" style="margin-top:8px">${esc(src.slice(0, 12000))}</div>
    </details>
  </div>`;
}

/* ------------------------------------------------------------ checagens */

function dirChecklist(slug, base, ov) {
  const g = (k) => (ov[k] !== undefined ? ov[k] : base[k]);
  const mt = g('metaTitle') || '', md = g('metaDescription') || '';
  const palavras = JSON.stringify({ ...base, ...ov }).match(/[A-Za-z']{2,}/g)?.length || 0;
  return [
    ['Título entre 40 e 60 caracteres', mt.length >= 40 && mt.length <= 60, `${mt.length} caracteres`],
    ['Meta description entre 120 e 158', md.length >= 120 && md.length <= 158, `${md.length} caracteres`],
    ['Existe um caso "não compre"', !!(g('notFor') && g('notFor').length > 40), 'seção que dá credibilidade'],
    ['Tabela de preços preenchida', (g('pricingRows') || []).length >= 2, `${(g('pricingRows') || []).length} linhas`],
    ['Ao menos 3 perguntas frequentes', (g('faqs') || []).length >= 3, `${(g('faqs') || []).length} perguntas`],
    ['Ao menos 2 alternativas', (g('alternatives') || []).length >= 2, `${(g('alternatives') || []).length}`],
    ['Data de checagem de preços', /^\d{4}-\d{2}-\d{2}$/.test(g('updated') || ''), g('updated') || '—'],
    ['Corpo com 600+ palavras', palavras >= 600, `${palavras} palavras`],
    ['Sem promessa de resultado', !/guaranteed|forever|#1 |best in the world/i.test(JSON.stringify(ov)), 'checagem sobre o texto do painel'],
    ['Sem nota inventada', !/\b\d(\.\d)?\s*\/\s*10\b|★/.test(JSON.stringify(ov)), 'checagem sobre o texto do painel'],
  ];
}

function toolChecklist(slug, base, ov, cta) {
  const g = (k) => (ov[k] !== undefined ? ov[k] : base[k]);
  const mt = g('metaTitle') || '', md = g('metaDescription') || '';
  return [
    ['Título entre 40 e 60 caracteres', mt.length >= 40 && mt.length <= 60, `${mt.length}`],
    ['Meta description entre 140 e 158', md.length >= 140 && md.length <= 158, `${md.length}`],
    ['Diz quando é a escolha errada', !!(g('notIdealFor') && g('notIdealFor').length > 40), 'obrigatório'],
    ['Ao menos 2 leituras relacionadas', (g('related') || []).length >= 2, `${(g('related') || []).length}`],
    ['CTA tem rótulo e destino', !!(cta.label && cta.href), `${cta.href || '—'}`],
    ['#ad só se o link tem ID de afiliado', !cta.monetized, cta.monetized ? 'LIGADO — confirme que existe ID real' : 'desligado (correto sem ID)'],
    ['Destino é interno ou /go/', /^\/en\/|\/go\//.test(cta.href || ''), cta.href || '—'],
    ['Sem promessa de resultado', !/guaranteed|forever/i.test(JSON.stringify(ov)), 'checagem sobre o texto do painel'],
  ];
}

function runChecks(lista) {
  const el = document.getElementById('checks');
  if (!el) return;
  const html = lista.map(([nome, ok, det]) => `
    <div class="chk"><span class="pill ${ok ? 'ok' : 'bad'}">${ok ? 'ok' : 'ajustar'}</span>
      <div><b>${esc(nome)}</b> <span style="color:#71717a">— ${esc(det)}</span></div></div>`).join('');
  const falhas = lista.filter((l) => !l[1]).length;
  el.innerHTML = (falhas
    ? `<div class="banner warn"><b>${falhas} ponto(s) para ajustar.</b> Publicar mesmo assim é possível — mas o painel avisa antes.</div>`
    : `<div class="banner ok"><b>Tudo certo.</b> Página nos padrões que o site usa.</div>`) + html;
}

/* ---------------------------------------------------------- publicar */

function serializar(store) {
  const linhas = Object.entries(store)
    .filter(([, v]) => v && Object.keys(v).length)
    .map(([slug, v]) => `  ${JSON.stringify(slug)}: ${JSON.stringify(v, null, 2).replace(/\n/g, '\n  ')},`)
    .join('\n');
  return linhas;
}

function gerarArquivo() {
  const dir = serializar(S.overrides.dir);
  const tool = serializar(S.overrides.tool);
  const cabecalho = `/**
 * Overrides de conteudo gerados pelo painel (/painel).
 *
 * O painel nao sobrescreve lib/directoryContent.ts nem lib/toolEditorial.ts:
 * escreve aqui, e o site mescla por cima (mergeOverride). Apagar uma entrada
 * devolve o texto original escrito a mao.
 *
 * GERADO PELO PAINEL — edite pelo painel, ou saiba que a proxima publicacao
 * sobrescreve este arquivo.
 */

export type DirectoryOverride = Record<string, unknown>;
export type ToolOverride = Record<string, unknown>;

export const DIRECTORY_OVERRIDES: Record<string, any> = {
${dir}
};

export const TOOL_OVERRIDES: Record<string, any> = {
${tool}
};

export function mergeOverride<T extends object>(
  base: T | undefined,
  override: Partial<T> | undefined
): T | undefined {
  if (!base) return override as T | undefined;
  if (!override) return base;
  return { ...base, ...override };
}
`;
  return cabecalho;
}

/**
 * Regenera public/painel/bases.js com o conteudo JA mesclado.
 *
 * Por que: o painel le os dados de bases.js, que e gerado no build. Se ele
 * commitasse so o override, o painel continuaria mostrando o texto antigo na
 * proxima abertura — e o editor editaria por cima de um texto que ja mudou.
 * Regenerar aqui mantem o painel e o site contando a mesma historia, sem
 * depender de nenhum passo extra no CI.
 */
function gerarBases() {
  const mesclar = (baseMap, ovMap) => {
    const out = {};
    for (const slug of new Set([...Object.keys(baseMap || {}), ...Object.keys(ovMap || {})])) {
      out[slug] = { ...(baseMap?.[slug] || {}), ...(ovMap?.[slug] || {}) };
    }
    return out;
  };
  const dir = mesclar(window.__DIR_BASE, S.overrides.dir);
  const tool = mesclar(window.__TOOL_BASE, S.overrides.tool);
  return `/* GERADO por admin/build.mjs — nao edite a mao. */
window.__DIR_BASE = ${JSON.stringify(dir, null, 1)};
window.__TOOL_BASE = ${JSON.stringify(tool, null, 1)};
`;
}

window.__preview = () => {
  const conteudo = gerarArquivo();
  const n = Object.keys(S.overrides.dir).length + Object.keys(S.overrides.tool).length;
  const w = window.open('', '_blank');
  w.document.write(`<title>lib/contentOverrides.ts</title>
    <style>body{font:13px ui-monospace,monospace;padding:20px;background:#18181b;color:#e4e4e7}
    pre{white-space:pre-wrap;word-break:break-word}</style>
    <h3 style="font-family:system-ui">lib/contentOverrides.ts — ${n} página(s) com edição</h3>
    <pre>${esc(conteudo)}</pre>`);
};

window.__reset = (kind, slug) => {
  if (!confirm('Descartar as edições desta página e voltar ao texto original?')) return;
  const store = kind === 'dir' ? S.overrides.dir : S.overrides.tool;
  delete store[slug];
  S.dirty = true;
  marcarDirty();
  renderNav();
  render();
  toast('Edições descartadas');
};

async function publicar() {
  if (!S.token) { pedirToken(); return; }
  // TRAVA DE SEGURANCA: se bases.js nao carregou, gerarBases() produziria um
  // arquivo quase vazio e publicar apagaria o conteudo de todas as paginas.
  // Preferimos recusar a publicar.
  const nDirBase = Object.keys(window.__DIR_BASE || {}).length;
  const nToolBase = Object.keys(window.__TOOL_BASE || {}).length;
  if (nDirBase < 10 || nToolBase < 16) {
    alert(
      'Não vou publicar: os dados base do painel não carregaram\n' +
      `(encontrei ${nDirBase} reviews e ${nToolBase} ferramentas; esperava 10 e 16).\n\n` +
      'Publicar agora apagaria o conteúdo das páginas. Recarregue a página e verifique ' +
      'se /painel/bases.js está respondendo.'
    );
    return;
  }

  const conteudo = gerarArquivo();
  const bases = gerarBases();
  const n = Object.keys(S.overrides.dir).length + Object.keys(S.overrides.tool).length;
  const msg = `conteudo(painel): ${n} pagina(s) editada(s) via /painel`;
  try {
    $('#statusPill').textContent = 'publicando…';
    $('#statusPill').className = 'pill';
    await writeFileToRepo(FILE, conteudo, msg);
    // Mantem o painel e o site com o mesmo texto na proxima abertura.
    await writeFileToRepo('public/painel/bases.js', bases, `${msg} — dados do painel`);
    window.__DIR_BASE = JSON.parse(bases.match(/__DIR_BASE = ([\s\S]*?);\nwindow/)[1]);
    window.__TOOL_BASE = JSON.parse(bases.match(/__TOOL_BASE = ([\s\S]*);\n$/)[1]);
    S.dirty = false;
    marcarDirty();
    $('#statusPill').textContent = 'publicado';
    $('#statusPill').className = 'pill ok';
    toast('Commit feito. Deploy automático em ~2–3 min.');
  } catch (e) {
    $('#statusPill').textContent = 'erro';
    $('#statusPill').className = 'pill bad';
    alert('Falha ao publicar:\n\n' + e.message);
  }
}

/* ------------------------------------------------------------- token */

function pedirToken() {
  const t = prompt(
    'Token do GitHub (fine-grained, apenas este repositório, permissão "Contents: Read and write").\n\n' +
    'Ele fica salvo só neste navegador. Nunca é enviado para iatools.online.'
  );
  if (t && t.trim()) {
    S.token = t.trim();
    localStorage.setItem(K_TOKEN, S.token);
    atualizarStatus();
  }
}

function atualizarStatus() {
  const p = $('#statusPill');
  if (S.token) { p.textContent = 'conectado'; p.className = 'pill ok'; }
  else { p.textContent = 'só leitura'; p.className = 'pill'; }
  $('#btnToken').textContent = S.token ? 'Trocar token' : 'Conectar GitHub';
  marcarDirty();
}

/* -------------------------------------------------------------- boot */

$('#btnToken').onclick = pedirToken;
$('#btnPublish').onclick = publicar;

(async function boot() {
  atualizarStatus();
  try {
    await carregarDados();
  } catch (e) {
    $('#editor').innerHTML = `<div class="card pad"><div class="banner bad">
      <b>Não consegui ler o repositório.</b><br>${esc(e.message)}<br><br>
      O painel lê os arquivos públicos de <code>${REPO}</code> via raw.githubusercontent.com.
      Se o repositório for privado, isso não vai funcionar sem ajuste.</div></div>`;
  }
})();
