const {chromium}=require('playwright');
const BASE='http://localhost:3295';
const pages=['/en','/en/tools','/en/tools/text-to-speech','/en/tools/pdf-to-jpg','/en/tools/merge-pdf','/en/tools/compress-pdf','/en/tools/remove-bg','/en/tools/qr-generator','/en/tools/word-counter','/en/directory','/en/directory/elevenlabs','/en/directory/jasper','/en/directory/smallpdf','/en/affiliate-disclosure','/en/about'];
const re=/\b(Pausar|Parar|Continuar|Português|Abrir|Seletor|Infinito|Adicionado|Combinado|Nenhum|Procurar|Baixar|Limpar|Gerar|Copiar|Escolha|Voz|Idioma|Ferramenta|Grátis|Início|Sobre|Contato)\b/gi;
(async()=>{const b=await chromium.launch();const p=await b.newPage();const bad=[];
p.on('pageerror',e=>bad.push('ERR '+e.message));
for(const path of pages)for(const tema of ['claro','escuro']){
 await p.goto(BASE+'/en',{waitUntil:'domcontentloaded'});
 await p.evaluate(t=>{localStorage.setItem('wtb-consent',JSON.stringify({escolha:'recusado',quando:Date.now()}));localStorage.setItem('wtb-theme',t);},tema);
 const r=await p.goto(BASE+path,{waitUntil:'networkidle'}); await p.waitForTimeout(300);
 const txt=await p.evaluate(()=>document.body.innerText);
 const m=txt.match(re); if(m) bad.push(path+' ['+tema+'] PT: '+[...new Set(m)].join(','));
 if(r.status()!==200) bad.push(path+' status '+r.status());
 const ov=await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
 if(ov>2) bad.push(path+' overflow '+ov);
 // coerencia: nunca "#ad" sem link sponsored e vice-versa
 const inc=await p.evaluate(()=>{
   const sponsor=[...document.querySelectorAll('a[rel]')].filter(a=>a.getAttribute('rel').includes('sponsored'));
   const badge=[...document.querySelectorAll('span')].filter(s=>s.textContent.trim()==='#ad'&&/ElevenLabs|Adobe|Canva|Copy|Smallpdf|remove/i.test(s.parentElement.textContent));
   return {sponsor:sponsor.length,badge:badge.length};
 });
 if(inc.sponsor!==inc.badge) bad.push(path+' incoerente #ad='+inc.badge+' sponsored='+inc.sponsor);
}
console.log(bad.length?bad.join('\n'):'CLEAN');
await b.close();})();
