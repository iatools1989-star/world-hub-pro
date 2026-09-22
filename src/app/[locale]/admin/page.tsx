'use client';
import { TOOLS } from '@/lib/tools';
import { AI_TOOLS } from '@/lib/directory';
import { useState } from 'react';

export default function Admin() {
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-black">Admin — World Hub Pro</h1>
      <p className="text-zinc-500">Add tools / directory entries. In production, connect to Prisma + Vercel Postgres.</p>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-zinc-200">
          <h3 className="font-black">Tools ({TOOLS.length})</h3>
          <div className="mt-3 space-y-2 max-h-[320px] overflow-auto pr-2">
            {TOOLS.map(t => <div key={t.slug} className="flex justify-between items-center border border-zinc-200 rounded-xl px-3 py-2 text-sm"><span>{t.icon} {t.name}</span><span className="text-xs bg-zinc-100 px-2 py-1 rounded-full">/{t.slug}</span></div>)}
          </div>
          <button onClick={() => setMsg('Em produção: POST /api/tools com Prisma')} className="mt-3 w-full bg-zinc-900 text-white py-2.5 rounded-full font-bold">+ Add Tool</button>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-zinc-200">
          <h3 className="font-black">Directory ({AI_TOOLS.length})</h3>
          <div className="mt-3 space-y-2 max-h-[320px] overflow-auto pr-2">
            {AI_TOOLS.map(t => <div key={t.slug} className="flex justify-between items-center border border-zinc-200 rounded-xl px-3 py-2 text-sm"><span>{t.logo} {t.name}</span><span className={`text-xs px-2 py-1 rounded-full ${t.featured ? 'bg-yellow-400' : 'bg-zinc-100'}`}>{t.featured ? 'Featured' : 'Free'}</span></div>)}
          </div>
          <button onClick={() => setMsg('Em produção: POST /api/directory + Stripe $29')} className="mt-3 w-full bg-yellow-400 py-2.5 rounded-full font-black">+ Add AI Tool ($29)</button>
        </div>
      </div>

      {msg && <div className="mt-4 bg-zinc-900 text-white px-4 py-3 rounded-xl text-sm">{msg}</div>}

      <div className="mt-6 bg-white rounded-2xl p-6 border border-zinc-200">
        <h3 className="font-black">Monetization Setup (1x)</h3>
        <ol className="list-decimal pl-5 text-sm text-zinc-600 mt-2 space-y-1">
          <li>Vercel → Settings → Environment Variables → <code className="bg-zinc-100 px-1 rounded">NEXT_PUBLIC_ADSENSE_ID=ca-pub-...</code></li>
          <li>Substitua &lt;AdSlot&gt; por &lt;ins className="adsbygoogle"&gt;</li>
          <li>Stripe: crie Product $29 Featured → webhook → Prisma `featured=true`</li>
          <li>Afiliados: troque links `example.com/go` por seus links ShareASale/Impact</li>
        </ol>
        <div className="mt-3 text-xs bg-green-50 border border-green-200 rounded-xl p-3">Prisma schema já inclui Tool, DirectoryTool, Featured. Rode <code>npx prisma db push</code> após criar Vercel Postgres.</div>
      </div>
    </div>
  );
}
