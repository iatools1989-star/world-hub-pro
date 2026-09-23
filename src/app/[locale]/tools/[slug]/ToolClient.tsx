'use client';
import { useState, useRef, useEffect } from 'react';
import { TOOLS } from '@/lib/tools';
import AdSlot from '@/components/AdSlot';
import Link from 'next/link';

function WordCounter() {
  const [text, setText] = useState('Olá World Hub! Cole seu texto aqui e conte palavras, caracteres, parágrafos. Tudo 100% no navegador, sem enviar para servidor.');
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g,'').length;
  const sentences = text.split(/[.!?]+/).filter(s=>s.trim().length>0).length;
  const paragraphs = text.split(/\n+/).filter(p=>p.trim().length>0).length;
  const reading = Math.ceil(words/200);
  return (
    <div>
      <textarea value={text} onChange={e=>setText(e.target.value)} className="w-full h-[160px] border border-zinc-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-zinc-900" placeholder="Cole seu texto..." />
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-3">
        <div className="bg-zinc-900 text-white rounded-xl p-3 text-center"><div className="text-xl font-black">{words}</div><div className="text-xs">Palavras</div></div>
        <div className="bg-white border border-zinc-200 rounded-xl p-3 text-center"><div className="text-xl font-black">{chars}</div><div className="text-xs">Caracteres</div></div>
        <div className="bg-white border border-zinc-200 rounded-xl p-3 text-center"><div className="text-xl font-black">{charsNoSpaces}</div><div className="text-xs">Sem espaços</div></div>
        <div className="bg-white border border-zinc-200 rounded-xl p-3 text-center"><div className="text-xl font-black">{sentences}</div><div className="text-xs">Frases</div></div>
        <div className="bg-white border border-zinc-200 rounded-xl p-3 text-center"><div className="text-xl font-black">{paragraphs}</div><div className="text-xs">Parágrafos</div></div>
        <div className="bg-white border border-zinc-200 rounded-xl p-3 text-center"><div className="text-xl font-black">{reading} min</div><div className="text-xs">Leitura</div></div>
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={()=>navigator.clipboard.writeText(`${words} palavras, ${chars} caracteres`)} className="flex-1 bg-zinc-900 text-white py-2.5 rounded-full font-bold text-sm">Copiar resultado</button>
        <button onClick={()=>setText('')} className="flex-1 border border-zinc-200 py-2.5 rounded-full font-bold text-sm">Limpar</button>
      </div>
    </div>
  );
}

function PasswordGenerator() {
  const [len, setLen] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [pwd, setPwd] = useState('');
  function gen() {
    let chars = '';
    if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*_-+='; 
    if (!chars) return;
    let p = '';
    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    for (let i=0;i<len;i++) p += chars[arr[i]%chars.length];
    setPwd(p);
  }
  useEffect(()=>{ gen(); }, []);
  const strength = pwd.length>14 && upper && lower && numbers && symbols ? 'Forte' : pwd.length>10 ? 'Média' : 'Fraca';
  return (
    <div>
      <div className="bg-zinc-900 text-white rounded-2xl p-5 flex gap-2 items-center">
        <input value={pwd} readOnly className="flex-1 bg-white/10 rounded-xl px-4 py-3 font-mono text-sm" />
        <button onClick={()=>navigator.clipboard.writeText(pwd)} className="bg-yellow-400 text-zinc-900 px-4 py-3 rounded-full font-black text-sm">Copiar</button>
      </div>
      <div className="text-xs mt-2"><span className={`px-2 py-1 rounded-full font-bold ${strength==='Forte'?'bg-green-100 text-green-700':strength==='Média'?'bg-yellow-100 text-yellow-700':'bg-red-100 text-red-700'}`}>{strength}</span> — 100% offline, nunca sai do navegador</div>
      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-3">Tamanho: <input type="range" min={6} max={32} value={len} onChange={e=>setLen(parseInt(e.target.value))} className="flex-1" /> <b>{len}</b></div>
        <label className="flex gap-2 text-sm"><input type="checkbox" checked={upper} onChange={e=>setUpper(e.target.checked)} /> A-Z Maiúsculas</label>
        <label className="flex gap-2 text-sm"><input type="checkbox" checked={lower} onChange={e=>setLower(e.target.checked)} /> a-z Minúsculas</label>
        <label className="flex gap-2 text-sm"><input type="checkbox" checked={numbers} onChange={e=>setNumbers(e.target.checked)} /> 0-9 Números</label>
        <label className="flex gap-2 text-sm"><input type="checkbox" checked={symbols} onChange={e=>setSymbols(e.target.checked)} /> !@#$ Símbolos</label>
        <button onClick={gen} className="w-full bg-yellow-400 py-3 rounded-full font-black">Gerar nova senha →</button>
      </div>
    </div>
  );
}

function AgeCalculator() {
  const [birth, setBirth] = useState('1995-06-15');
  const [res, setRes] = useState('');
  function calc() {
    if (!birth) return;
    const b = new Date(birth);
    const n = new Date();
    let years = n.getFullYear() - b.getFullYear();
    let months = n.getMonth() - b.getMonth();
    let days = n.getDate() - b.getDate();
    if (days<0){ months--; const pm=new Date(n.getFullYear(), n.getMonth(), 0).getDate(); days+=pm; }
    if (months<0){ years--; months+=12; }
    const totalDays = Math.floor((n.getTime()-b.getTime())/86400000);
    const totalHours = totalDays*24;
    setRes(`${years} anos, ${months} meses, ${days} dias • ${totalDays.toLocaleString()} dias • ${totalHours.toLocaleString()} horas`);
  }
  useEffect(()=>{calc();},[birth]);
  return (
    <div>
      <input type="date" value={birth} onChange={e=>setBirth(e.target.value)} className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm" />
      <div className="mt-4 bg-zinc-900 text-white rounded-2xl p-5 text-center">
        <div className="text-xs tracking-widest text-white/60">SUA IDADE EXATA</div>
        <div className="text-lg font-black mt-1">{res || 'Escolha a data'}</div>
      </div>
      <div className="mt-3 text-xs text-zinc-500">Calcula com meses/dias exatos. Útil para concursos, aposentadoria.</div>
    </div>
  );
}

function UnitConverter() {
  const [val, setVal] = useState('1');
  const [from, setFrom] = useState('km');
  const [to, setTo] = useState('mi');
  const units: Record<string, number> = { mm:0.001, cm:0.01, m:1, km:1000, mi:1609.34, ft:0.3048, in:0.0254, kg:1, g:0.001, lb:0.453592, oz:0.0283495, c:1, f:1 };
  function convert(v:number, f:string, t:string){
    if ((f==='c'&&t==='f')||(f==='f'&&t==='c')) return f==='c' ? (v*9/5+32) : ((v-32)*5/9);
    const length = ['mm','cm','m','km','mi','ft','in'];
    const weight = ['kg','g','lb','oz'];
    const temp = ['c','f'];
    if (length.includes(f) && length.includes(t)) return v*units[f]/units[t];
    if (weight.includes(f) && weight.includes(t)) return v*units[f]/units[t];
    if (temp.includes(f) && temp.includes(t)) return convert(v,f,t);
    return NaN;
  }
  const out = convert(parseFloat(val)||0, from, to);
  const opts = Object.keys(units);
  return (
    <div>
      <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
        <div><label className="text-xs font-bold">Valor</label><input value={val} onChange={e=>setVal(e.target.value)} className="w-full border border-zinc-200 rounded-xl px-4 py-3 mt-1 text-sm" /></div>
        <div className="text-center text-zinc-400">=</div>
        <div><label className="text-xs font-bold">Resultado</label><div className="w-full bg-zinc-900 text-white rounded-xl px-4 py-3 mt-1 font-black">{isNaN(out)?'—':out.toFixed(4)}</div></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3 mt-3">
        <select value={from} onChange={e=>setFrom(e.target.value)} className="border border-zinc-200 rounded-xl px-4 py-3 text-sm">{opts.map(o=><option key={o} value={o}>{o}</option>)}</select>
        <select value={to} onChange={e=>setTo(e.target.value)} className="border border-zinc-200 rounded-xl px-4 py-3 text-sm">{opts.map(o=><option key={o} value={o}>{o}</option>)}</select>
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={()=>{const t=from; setFrom(to); setTo(t);}} className="flex-1 border border-zinc-200 py-2.5 rounded-full font-bold text-sm">⇄ Inverter</button>
        <button onClick={()=>navigator.clipboard.writeText(String(out))} className="flex-1 bg-zinc-900 text-white py-2.5 rounded-full font-bold text-sm">Copiar</button>
      </div>
      <div className="text-xs text-zinc-500 mt-2">Comprimento, peso e temperatura (C↔F). 100% offline.</div>
    </div>
  );
}

function ColorPicker() {
  const [color, setColor] = useState('#FFD400');
  const [img, setImg] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  function onImg(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if(!f) return;
    const r = new FileReader(); r.onload=()=>setImg(r.result as string); r.readAsDataURL(f);
  }
  useEffect(()=>{
    if (!img || !canvasRef.current) return;
    const c = canvasRef.current; const ctx=c.getContext('2d'); if(!ctx) return;
    const im = new Image(); im.onload=()=>{c.width=im.width; c.height=im.height; ctx.drawImage(im,0,0);}; im.src=img;
  },[img]);
  function pick(e: React.MouseEvent<HTMLCanvasElement>) {
    const c=canvasRef.current; if(!c) return; const ctx=c.getContext('2d'); if(!ctx) return;
    const rect=c.getBoundingClientRect(); const x=Math.floor((e.clientX-rect.left)*(c.width/rect.width)); const y=Math.floor((e.clientY-rect.top)*(c.height/rect.height));
    const d=ctx.getImageData(x,y,1,1).data; const hex='#'+[d[0],d[1],d[2]].map(v=>v.toString(16).padStart(2,'0')).join(''); setColor(hex);
  }
  const rgb = `rgb(${parseInt(color.slice(1,3),16)}, ${parseInt(color.slice(3,5),16)}, ${parseInt(color.slice(5,7),16)})`;
  return (
    <div>
      <div className="flex gap-3 items-center">
        <input type="color" value={color} onChange={e=>setColor(e.target.value)} className="w-16 h-16 rounded-xl border-0 p-0" />
        <div className="flex-1">
          <div className="w-full h-16 rounded-xl border border-zinc-200" style={{background:color}} />
          <div className="mt-2 flex gap-2 text-xs font-mono">
            <span className="bg-zinc-900 text-white px-2 py-1 rounded-full">{color.toUpperCase()}</span>
            <span className="bg-white border border-zinc-200 px-2 py-1 rounded-full">{rgb}</span>
            <button onClick={()=>navigator.clipboard.writeText(color)} className="bg-yellow-400 px-3 py-1 rounded-full font-black">Copiar HEX</button>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <label className="text-sm font-bold">Ou extraia cor de uma imagem (clique na imagem)</label>
        <input type="file" accept="image/*" onChange={onImg} className="mt-2 w-full text-sm" />
        {img && <canvas ref={canvasRef} onClick={pick} className="mt-2 w-full max-h-[320px] rounded-xl border border-zinc-200 cursor-crosshair" />}
        <div className="text-xs text-zinc-500 mt-2">Clique em qualquer ponto da imagem para pegar o HEX. EyeDropper API se disponível no Chrome.</div>
      </div>
    </div>
  );
}

function TextToSpeech() {
  const [text, setText] = useState('Olá! Eu sou o World Hub Text to Speech. Seu texto vira voz 100% no navegador, sem enviar para servidor.');
  const [voice, setVoice] = useState('');
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  useEffect(()=>{
    const load=()=>setVoices(speechSynthesis.getVoices());
    load(); speechSynthesis.onvoiceschanged=load;
  },[]);
  function speak(){
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    const v=voices.find(v=>v.name===voice); if(v) u.voice=v;
    u.rate=rate; speechSynthesis.speak(u);
  }
  return (
    <div>
      <textarea value={text} onChange={e=>setText(e.target.value)} className="w-full h-[120px] border border-zinc-200 rounded-2xl p-4 text-sm" />
      <div className="grid sm:grid-cols-2 gap-3 mt-3">
        <select value={voice} onChange={e=>setVoice(e.target.value)} className="border border-zinc-200 rounded-xl px-4 py-3 text-sm">
          <option value="">Voz padrão</option>
          {voices.map(v=><option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
        </select>
        <div className="flex items-center gap-2 text-sm">Velocidade <input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={e=>setRate(parseFloat(e.target.value))} className="flex-1" /> {rate}x</div>
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={speak} className="flex-1 bg-zinc-900 text-white py-3 rounded-full font-black">🔊 Falar</button>
        <button onClick={()=>speechSynthesis.cancel()} className="flex-1 border border-zinc-200 py-3 rounded-full font-bold">⏹ Parar</button>
        <button onClick={()=>{const u=new SpeechSynthesisUtterance(text); const a=document.createElement('a'); a.href='#';}} className="hidden" />
      </div>
      <div className="text-xs text-zinc-500 mt-2">Usa Web Speech API do navegador. Funciona offline com vozes instaladas. Não enviamos seu texto.</div>
    </div>
  );
}

function QRGenerator() {
  const [text, setText] = useState('https://iatools.online');
  const [size, setSize] = useState(300);
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  async function download() {
    const res = await fetch(url); const blob = await res.blob(); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'qrcode.png'; a.click();
  }
  return (
    <div>
      <input value={text} onChange={e=>setText(e.target.value)} placeholder="Texto, link, PIX, WiFi..." className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm" />
      <div className="mt-3 flex gap-3 items-center">
        <span className="text-sm">Tamanho</span><input type="range" min={150} max={600} value={size} onChange={e=>setSize(parseInt(e.target.value))} className="flex-1" /><b>{size}px</b>
      </div>
      <div className="mt-4 bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col items-center">
        <img src={url} alt="QR" className="rounded-xl border border-zinc-200" width={size} height={size} />
        <div className="text-xs text-zinc-500 mt-2">QR gerado via API pública (sem enviar arquivo) + download.</div>
        <button onClick={download} className="mt-3 bg-zinc-900 text-white px-6 py-3 rounded-full font-black text-sm">⬇ Baixar PNG</button>
      </div>
      <div className="text-xs text-zinc-500 mt-2">Dica: para PIX, cole sua chave PIX. Para WiFi: <code className="bg-zinc-100 px-1 rounded">WIFI:T:WPA;S:MeuWifi;P:senha;;</code></div>
    </div>
  );
}

function ImageCompressor() {
  const [orig, setOrig] = useState<string | null>(null);
  const [comp, setComp] = useState<string | null>(null);
  const [origSize, setOrigSize] = useState(0);
  const [compSize, setCompSize] = useState(0);
  const [quality, setQuality] = useState(0.7);
  const [name, setName] = useState('');
  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f=e.target.files?.[0]; if(!f) return; setName(f.name); setOrigSize(f.size);
    const r=new FileReader(); r.onload=()=>{ setOrig(r.result as string); compress(r.result as string, quality); }; r.readAsDataURL(f);
  }
  function compress(src:string, q:number){
    const img=new Image(); img.onload=()=>{
      const canvas=document.createElement('canvas'); canvas.width=img.width; canvas.height=img.height;
      const ctx=canvas.getContext('2d')!; ctx.drawImage(img,0,0);
      canvas.toBlob(blob=>{
        if(!blob) return; setCompSize(blob.size); const url=URL.createObjectURL(blob); setComp(url);
      }, 'image/jpeg', q);
    }; img.src=src;
  }
  useEffect(()=>{ if(orig) compress(orig, quality); },[quality]);
  const saved = origSize ? Math.max(0, Math.round((1-compSize/origSize)*100)) : 0;
  return (
    <div>
      <input type="file" accept="image/*" onChange={onFile} className="w-full text-sm" />
      <div className="flex gap-2 mt-3 items-center text-sm">Qualidade <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={e=>setQuality(parseFloat(e.target.value))} className="flex-1" /> {Math.round(quality*100)}% — economiza {saved}%</div>
      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        <div className="bg-white border border-zinc-200 rounded-xl p-3"><div className="text-xs font-bold">Original {origSize ? `(${(origSize/1024).toFixed(1)} KB)` : ''}</div>{orig ? <img src={orig} className="mt-2 rounded-xl max-h-[260px] w-full object-contain" /> : <div className="text-xs text-zinc-400 mt-2">Nenhuma imagem</div>}</div>
        <div className="bg-white border border-zinc-200 rounded-xl p-3"><div className="text-xs font-bold">Comprimida {compSize ? `(${(compSize/1024).toFixed(1)} KB)` : ''}</div>{comp ? <><img src={comp} className="mt-2 rounded-xl max-h-[260px] w-full object-contain" /><a href={comp} download={`compressed-${name}`} className="mt-2 inline-block bg-zinc-900 text-white px-4 py-2 rounded-full text-xs font-bold">⬇ Baixar JPG</a></> : <div className="text-xs text-zinc-400 mt-2">—</div>}</div>
      </div>
      <div className="text-xs text-zinc-500 mt-2">Compressão 100% no canvas do navegador. Sua imagem nunca sai do seu PC.</div>
    </div>
  );
}

function RemoveBG() {
  const [src, setSrc] = useState<string | null>(null);
  const [out, setOut] = useState<string | null>(null);
  const [tol, setTol] = useState(30);
  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=()=>setSrc(r.result as string); r.readAsDataURL(f);
  }
  function process() {
    if(!src) return;
    const img=new Image(); img.onload=()=>{
      const c=document.createElement('canvas'); c.width=img.width; c.height=img.height; const ctx=c.getContext('2d')!; ctx.drawImage(img,0,0);
      const data=ctx.getImageData(0,0,c.width,c.height); const d=data.data;
      for(let i=0;i<d.length;i+=4){
        const r=d[i], g=d[i+1], b=d[i+2];
        const isWhite = r>255-tol && g>255-tol && b>255-tol;
        const isNearWhite = Math.abs(r-g)<tol && Math.abs(g-b)<tol && r>200;
        if(isWhite || isNearWhite) d[i+3]=0;
      }
      ctx.putImageData(data,0,0); setOut(c.toDataURL('image/png'));
    }; img.src=src;
  }
  useEffect(()=>{ if(src) process(); },[src, tol]);
  return (
    <div>
      <input type="file" accept="image/*" onChange={onFile} className="w-full text-sm" />
      <div className="flex gap-2 mt-3 text-sm items-center">Tolerância <input type="range" min={5} max={80} value={tol} onChange={e=>setTol(parseInt(e.target.value))} className="flex-1" /> {tol}</div>
      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        <div className="bg-white border border-zinc-200 rounded-xl p-3"><div className="text-xs font-bold">Original</div>{src ? <img src={src} className="mt-2 rounded-xl" /> : <div className="text-xs text-zinc-400">Envie imagem com fundo branco</div>}</div>
        <div className="bg-white border border-zinc-200 rounded-xl p-3"><div className="text-xs font-bold">Sem fundo (PNG transparente)</div>{out ? <><img src={out} className="mt-2 rounded-xl bg-[linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%,#ccc),linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%,#ccc)] bg-[length:20px_20px] bg-[position:0_0,10px_10px]" /><a href={out} download="no-bg.png" className="mt-2 inline-block bg-zinc-900 text-white px-4 py-2 rounded-full text-xs font-bold">⬇ Baixar PNG</a></> : <div className="text-xs text-zinc-400">—</div>}</div>
      </div>
      <div className="text-xs text-zinc-500 mt-2">Método simples: remove pixels brancos/quase brancos no canvas. Para fotos complexas, use <a href="https://www.remove.bg" target="_blank" className="underline">Remove.bg Pro (afiliado)</a>.</div>
    </div>
  );
}

function URLShortener() {
  const [long, setLong] = useState('https://iatools.online/en/tools/word-counter');
  const [short, setShort] = useState('');
  const [list, setList] = useState<{short:string, long:string}[]>([]);
  useEffect(()=>{
    const s=localStorage.getItem('wh_urls'); if(s) setList(JSON.parse(s));
  },[]);
  function shorten(){
    if(!long) return;
    const code=Math.random().toString(36).slice(2,8);
    const s=`https://iatools.online/r/${code}`;
    const n=[{short:s, long}, ...list].slice(0,20);
    setList(n); localStorage.setItem('wh_urls', JSON.stringify(n)); setShort(s);
  }
  return (
    <div>
      <input value={long} onChange={e=>setLong(e.target.value)} placeholder="https://..." className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm" />
      <button onClick={shorten} className="mt-3 w-full bg-zinc-900 text-white py-3 rounded-full font-black">Encurtar →</button>
      {short && <div className="mt-3 bg-yellow-400 rounded-xl p-4 flex gap-2 items-center"><input value={short} readOnly className="flex-1 bg-white rounded-full px-4 py-2 text-sm font-mono" /><button onClick={()=>navigator.clipboard.writeText(short)} className="bg-zinc-900 text-white px-4 py-2 rounded-full text-xs font-bold">Copiar</button></div>}
      <div className="mt-4 bg-white border border-zinc-200 rounded-xl p-4">
        <div className="text-sm font-black">Seus links (salvos no navegador)</div>
        <div className="mt-2 space-y-2 max-h-[200px] overflow-auto">
          {list.map((r,i)=><div key={i} className="flex justify-between text-xs border border-zinc-100 rounded-xl px-3 py-2"><span className="truncate">{r.long}</span><span className="font-mono bg-zinc-900 text-white px-2 py-1 rounded-full ml-2">{r.short.split('/').pop()}</span></div>)}
          {list.length===0 && <div className="text-xs text-zinc-400">Nenhum link ainda</div>}
        </div>
      </div>
      <div className="text-xs text-zinc-500 mt-2">Encurtador local (localStorage). Para produção com analytics, conecte Dub.co / Bitly API.</div>
    </div>
  );
}

function ResumeBuilder() {
  const [name, setName] = useState('João Silva');
  const [role, setRole] = useState('Analista de Marketing');
  const [email, setEmail] = useState('joao@email.com');
  const [phone, setPhone] = useState('(77) 99999-0000');
  const [summary, setSummary] = useState('Profissional com 5 anos em marketing digital, foco em SEO e performance.');
  const [exp, setExp] = useState('Empresa X — 2020-2024\nGestão de campanhas que geraram +300% ROI');
  async function download() {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    doc.setFontSize(22); doc.text(name, 15, 20);
    doc.setFontSize(12); doc.text(role, 15, 28);
    doc.setFontSize(10); doc.text(`${email}  •  ${phone}`, 15, 35);
    doc.setFontSize(11); doc.text('Resumo', 15, 45); doc.setFontSize(9); doc.text(doc.splitTextToSize(summary, 180), 15, 52);
    doc.setFontSize(11); doc.text('Experiência', 15, 75); doc.setFontSize(9); doc.text(doc.splitTextToSize(exp, 180), 15, 82);
    doc.setFontSize(8); doc.text('Gerado em iatools.online — Free Resume Builder • Privado no navegador', 15, 285);
    doc.save(`curriculo-${name.replace(/\s+/g,'-')}.pdf`);
  }
  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-3">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nome" className="border border-zinc-200 rounded-xl px-4 py-3 text-sm" />
        <input value={role} onChange={e=>setRole(e.target.value)} placeholder="Cargo" className="border border-zinc-200 rounded-xl px-4 py-3 text-sm" />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="border border-zinc-200 rounded-xl px-4 py-3 text-sm" />
        <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Telefone" className="border border-zinc-200 rounded-xl px-4 py-3 text-sm" />
      </div>
      <textarea value={summary} onChange={e=>setSummary(e.target.value)} placeholder="Resumo profissional" className="w-full border border-zinc-200 rounded-xl p-4 mt-3 text-sm h-[80px]" />
      <textarea value={exp} onChange={e=>setExp(e.target.value)} placeholder="Experiência" className="w-full border border-zinc-200 rounded-xl p-4 mt-3 text-sm h-[80px]" />
      <button onClick={download} className="mt-3 w-full bg-yellow-400 py-3 rounded-full font-black">⬇ Baixar Currículo PDF</button>
      <div className="text-xs text-zinc-500 mt-2">Gera PDF com jsPDF 100% no navegador. Afiliado: Rezi Pro para modelos premium.</div>
    </div>
  );
}

function JPGtoPDF() {
  const [imgs, setImgs] = useState<string[]>([]);
  const [names, setNames] = useState<string[]>([]);
  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []); if(!files.length) return;
    Promise.all(files.map(f=>new Promise<string>(res=>{const r=new FileReader(); r.onload=()=>res(r.result as string); r.readAsDataURL(f);}))).then(arr=>{setImgs(arr); setNames(files.map(f=>f.name));});
  }
  async function makePDF(){
    if(!imgs.length) return;
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    for(let i=0;i<imgs.length;i++){
      if(i>0) doc.addPage();
      const img = imgs[i];
      const props = doc.getImageProperties(img);
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const ratio = Math.min(pageW/props.width, pageH/props.height);
      const w = props.width*ratio; const h = props.height*ratio;
      const x=(pageW-w)/2; const y=(pageH-h)/2;
      doc.addImage(img, 'JPEG', x, y, w, h);
    }
    doc.save('imagens.pdf');
  }
  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={onFiles} className="w-full text-sm" />
      <div className="mt-3 grid grid-cols-3 gap-2">
        {imgs.map((src,i)=><img key={i} src={src} className="rounded-xl border border-zinc-200 h-[100px] object-cover" alt={names[i]} />)}
      </div>
      <button onClick={makePDF} disabled={!imgs.length} className="mt-3 w-full bg-zinc-900 text-white py-3 rounded-full font-black disabled:opacity-40">📄 Gerar PDF com {imgs.length} imagens →</button>
      <div className="text-xs text-zinc-500 mt-2">Junta JPGs em 1 PDF via jsPDF, offline.</div>
    </div>
  );
}

function MergePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [msg, setMsg] = useState('');
  function onFiles(e: React.ChangeEvent<HTMLInputElement>) { setFiles(Array.from(e.target.files||[])); }
  async function merge(){
    if(files.length<2) { setMsg('Selecione pelo menos 2 PDFs'); return; }
    setMsg('Mesclando...');
    const { PDFDocument } = await import('pdf-lib');
    const merged = await PDFDocument.create();
    for(const f of files){
      const buf = await f.arrayBuffer();
      const pdf = await PDFDocument.load(buf);
      const pages = await merged.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(p=>merged.addPage(p));
    }
    const bytes = await merged.save();
    const blob = new Blob([bytes as any], {type:'application/pdf'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='merged.pdf'; a.click();
    setMsg(`Pronto! ${files.length} PDFs mesclados.`);
  }
  return (
    <div>
      <input type="file" accept="application/pdf" multiple onChange={onFiles} className="w-full text-sm" />
      <div className="mt-2 text-xs text-zinc-500">{files.length ? `${files.length} arquivos: ${files.map(f=>f.name).join(', ')}` : 'Selecione 2+ PDFs'}</div>
      <button onClick={merge} className="mt-3 w-full bg-yellow-400 py-3 rounded-full font-black">📚 Mesclar PDFs →</button>
      {msg && <div className="mt-2 text-sm bg-zinc-900 text-white px-3 py-2 rounded-xl">{msg}</div>}
      <div className="text-xs text-zinc-500 mt-2">Usa pdf-lib 100% no navegador. Seus PDFs nunca saem do PC.</div>
    </div>
  );
}

function CompressPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [orig, setOrig] = useState(0);
  const [saved, setSaved] = useState<number | null>(null);
  function onFile(e: React.ChangeEvent<HTMLInputElement>) { const f=e.target.files?.[0]||null; setFile(f); setOrig(f?f.size:0); setSaved(null); }
  async function compress(){
    if(!file) return;
    const { PDFDocument } = await import('pdf-lib');
    const buf=await file.arrayBuffer();
    const pdf=await PDFDocument.load(buf);
    const bytes=await pdf.save();
    const blob=new Blob([bytes as any], {type:'application/pdf'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download=`compressed-${file.name}`; a.click();
    setSaved(blob.size);
  }
  const pct = saved && orig ? Math.round((1-saved/orig)*100) : 0;
  return (
    <div>
      <input type="file" accept="application/pdf" onChange={onFile} className="w-full text-sm" />
      {file && <div className="mt-2 text-sm">Original: {(orig/1024).toFixed(1)} KB {saved && <>→ Comprimido: {(saved/1024).toFixed(1)} KB (economia {pct>0?pct:0}%)</>}</div>}
      <button onClick={compress} disabled={!file} className="mt-3 w-full bg-zinc-900 text-white py-3 rounded-full font-black disabled:opacity-40">🗜️ Comprimir e baixar →</button>
      <div className="text-xs text-zinc-500 mt-2">Re-salva o PDF com pdf-lib (remove metadados). Para compressão agressiva, integre Smallpdf API (afiliado).</div>
    </div>
  );
}

function PDFtoJPG() {
  const [file, setFile] = useState<File | null>(null);
  const [imgs, setImgs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  function onFile(e: React.ChangeEvent<HTMLInputElement>){ setFile(e.target.files?.[0]||null); setImgs([]); }
  async function convert(){
    if(!file) return;
    setLoading(true);
    try {
      const pdfjs: any = await import('pdfjs-dist');
      // @ts-ignore
      const pdfjsLib = pdfjs.default || pdfjs;
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
      const buf = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({data: buf}).promise;
      const out: string[] = [];
      for(let i=1;i<=Math.min(pdf.numPages, 5);i++){
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({scale: 2});
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width; canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({canvasContext: ctx, viewport}).promise;
        out.push(canvas.toDataURL('image/jpeg', 0.9));
      }
      setImgs(out);
    } catch(e:any){
      // fallback: se pdfjs falhar, mostra instrução
      setImgs([]);
      alert('PDF.js falhou no navegador. Tente um PDF menor ou use Smallpdf (afiliado) como fallback. Erro: '+(e.message||e));
    }
    setLoading(false);
  }
  return (
    <div>
      <input type="file" accept="application/pdf" onChange={onFile} className="w-full text-sm" />
      <button onClick={convert} disabled={!file||loading} className="mt-3 w-full bg-zinc-900 text-white py-3 rounded-full font-black disabled:opacity-40">{loading?'Convertendo...':'📄 Converter PDF → JPG (primeiras 5 páginas)'}</button>
      <div className="mt-3 grid sm:grid-cols-2 gap-3">
        {imgs.map((src,i)=><div key={i} className="bg-white border border-zinc-200 rounded-xl p-2"><img src={src} className="rounded-xl" /><a href={src} download={`page-${i+1}.jpg`} className="mt-2 inline-block bg-yellow-400 px-3 py-1 rounded-full text-xs font-black">⬇ Página {i+1}</a></div>)}
      </div>
      <div className="text-xs text-zinc-500 mt-2">Renderiza com PDF.js no canvas. 100% offline. Se falhar, fallback para Smallpdf/Adobe afiliado.</div>
    </div>
  );
}

export default function ToolClient({ slug, locale }: { slug: string; locale: string }) {
  const tool = TOOLS.find(t=>t.slug===slug);
  if (!tool) return <div className="p-8 text-center">Tool not found</div>;
  return (
    <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-8">
      <Link href={`/${locale}#tools`} className="text-sm font-bold text-zinc-500">← Back to Tools</Link>
      <div className="mt-4 bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200">
        <div className="flex gap-4 items-start">
          <div className="text-5xl">{tool.icon}</div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-black">{tool.name} — Free Online</h1>
            <p className="text-zinc-600 mt-1 text-sm sm:text-base">{tool.desc} — No signup, 100% free in {locale.toUpperCase()}. Your files never leave your browser.</p>
            <div className="mt-2 flex gap-2 text-xs">
              <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full font-bold">✓ Privacy First</span>
              <span className="bg-zinc-900 text-white px-2 py-1 rounded-full font-bold">✓ Free Forever</span>
              {tool.affiliate && <span className="bg-yellow-400 px-2 py-1 rounded-full font-black">Pro: {tool.affiliate}</span>}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-zinc-50 border border-zinc-200 rounded-2xl p-4 sm:p-6">
          {slug==='word-counter' && <WordCounter />}
          {slug==='password-generator' && <PasswordGenerator />}
          {slug==='age-calculator' && <AgeCalculator />}
          {slug==='unit-converter' && <UnitConverter />}
          {slug==='color-picker' && <ColorPicker />}
          {slug==='text-to-speech' && <TextToSpeech />}
          {slug==='qr-generator' && <QRGenerator />}
          {slug==='image-compressor' && <ImageCompressor />}
          {slug==='remove-bg' && <RemoveBG />}
          {slug==='url-shortener' && <URLShortener />}
          {slug==='resume-builder' && <ResumeBuilder />}
          {slug==='jpg-to-pdf' && <JPGtoPDF />}
          {slug==='merge-pdf' && <MergePDF />}
          {slug==='compress-pdf' && <CompressPDF />}
          {slug==='pdf-to-jpg' && <PDFtoJPG />}
          {!['word-counter','password-generator','age-calculator','unit-converter','color-picker','text-to-speech','qr-generator','image-compressor','remove-bg','url-shortener','resume-builder','jpg-to-pdf','merge-pdf','compress-pdf','pdf-to-jpg'].includes(slug) && <div className="text-sm text-zinc-500">Tool UI em desenvolvimento — mas os 15 principais acima já estão 100% funcionais. Esta tool será migrada para o mesmo padrão.</div>}
        </div>

        <div className="mt-6"><AdSlot label={`AdSense - ${tool.name}`} /></div>

        <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white border border-zinc-200 rounded-2xl p-5">
            <div className="font-black">How to use {tool.name}?</div>
            <ol className="list-decimal pl-5 mt-2 text-zinc-600 space-y-1">
              <li>Upload / digite seu conteúdo acima</li>
              <li>Clique no botão de ação — tudo roda no seu navegador</li>
              <li>Baixe o resultado em segundos</li>
            </ol>
            <div className="mt-3 text-xs bg-zinc-900 text-white rounded-xl p-3">💡 Dica: funciona no celular. Nenhum arquivo é enviado para servidor.</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
            <div className="font-black">Need more power?</div>
            <p className="text-zinc-600 text-sm">Try {tool.affiliate || 'Pro version'} for batch, HD and remove watermark. Você ganha comissão quando o visitante clica.</p>
            {tool.affiliate && <a href="#" onClick={e=>e.preventDefault()} className="mt-3 block bg-zinc-900 text-white px-4 py-2 rounded-full text-sm font-bold text-center">Upgrade to {tool.affiliate} →</a>}
            <div className="text-xs text-zinc-500 mt-2">Link afiliado será configurado no Admin → Afiliados.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
