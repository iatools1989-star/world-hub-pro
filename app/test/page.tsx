'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TestPage() {
  const [isPro, setIsPro] = useState(false);
  const [used, setUsed] = useState(0);
  const [email, setEmail] = useState('teste@iatools.online');

  useEffect(() => {
    setIsPro(localStorage.getItem('bulk_pro') === 'true');
    setUsed(parseInt(localStorage.getItem('bulk_used') || '0'));
  }, []);

  const loginTestUser = () => {
    localStorage.setItem('bulk_pro', 'true');
    localStorage.setItem('bulk_user', email);
    localStorage.setItem('bulk_used', '0');
    setIsPro(true);
    setUsed(0);
    alert(`✅ Logado como TESTE: ${email}\nPRO ativado! Vá para /en/tools/bulk-studio e teste ilimitado.`);
  };

  const logout = () => {
    localStorage.removeItem('bulk_pro');
    localStorage.removeItem('bulk_user');
    setIsPro(false);
  };

  const resetFree = () => {
    localStorage.setItem('bulk_used', '0');
    localStorage.setItem('bulk_pro', 'false');
    setUsed(0);
    setIsPro(false);
    alert('Resetado para FREE: 0/10 hoje. Teste o paywall arrastando 11 imagens.');
  };

  const simulatePaywall = () => {
    localStorage.setItem('bulk_used', '10');
    setUsed(10);
    alert('Simulado: 10/10 usado. Vá para Bulk Studio e tente arrastar mais 1 imagem → paywall aparece.');
  };

  return (
    <div className="max-w-[600px] mx-auto p-6 mt-10">
      <h1 className="text-3xl font-black">🧪 Usuário de Teste</h1>
      <p className="text-sm text-zinc-600 mt-2">Use para ver a ferramenta como cliente PRO e FREE sem pagar.</p>

      <div className="mt-6 bg-zinc-950 text-white rounded-2xl p-6">
        <div className="text-xs text-zinc-400">Status Atual</div>
        <div className="font-black text-lg">{isPro ? '✅ PRO Ilimitado' : `🆓 FREE ${used}/10 hoje`}</div>
        <div className="text-xs text-zinc-500 mt-1">Email: {isPro ? email : 'não logado'}</div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="border rounded-xl p-4">
          <h3 className="font-bold">1. Logar como PRO (Teste)</h3>
          <input value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full border rounded-lg px-3 py-2 text-sm" placeholder="teste@iatools.online" />
          <button onClick={loginTestUser} className="mt-2 w-full py-2 bg-yellow-400 text-zinc-950 rounded-full font-bold">🔓 Logar como PRO Teste →</button>
          <p className="text-xs text-zinc-500 mt-1">Senha: teste123 (qualquer senha funciona no teste)</p>
        </div>

        <div className="border rounded-xl p-4">
          <h3 className="font-bold">2. Testar Paywall FREE</h3>
          <button onClick={simulatePaywall} className="mt-2 w-full py-2 bg-zinc-900 text-white rounded-full font-bold">Simular 10/10 usado → ver paywall</button>
          <button onClick={resetFree} className="mt-2 w-full py-2 bg-zinc-100 rounded-full font-bold">Resetar para 0/10</button>
        </div>

        <div className="border rounded-xl p-4">
          <h3 className="font-bold">3. Ver Ferramenta</h3>
          <Link href="/en/tools/bulk-studio" className="mt-2 block text-center py-2 bg-emerald-600 text-white rounded-full font-bold">→ Ir para Bulk Studio PRO</Link>
          <Link href="/en" className="mt-2 block text-center py-2 border rounded-full font-bold">→ Voltar para Home</Link>
        </div>

        <button onClick={logout} className="w-full text-sm text-zinc-500 underline">Sair / Voltar para FREE</button>
      </div>

      <div className="mt-8 text-xs text-zinc-500 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <b>Dica Sênior:</b> Após login PRO, faça o teste real: arraste 20 imagens no Bulk Studio → deve processar sem paywall. Depois clique em Sair e teste o limite FREE.
      </div>
    </div>
  );
}
