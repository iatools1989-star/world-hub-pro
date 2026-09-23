'use client';

import { useState, useEffect } from 'react';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  // Calcula entropia e força da senha
  const calculateStrength = () => {
    let poolSize = 0;
    if (includeLower) poolSize += 26;
    if (includeUpper) poolSize += 26;
    if (includeNumbers) poolSize += 10;
    if (includeSymbols) poolSize += 30;
    if (excludeAmbiguous) poolSize -= 8;
    if (poolSize <= 0) poolSize = 26;

    // Entropia em bits = length * log2(poolSize)
    const entropy = Math.round(length * Math.log2(poolSize));

    if (entropy < 40) {
      return { label: 'Fraca', color: 'bg-red-500', percent: 25, crackTime: 'Poucos segundos' };
    }
    if (entropy < 60) {
      return { label: 'Média', color: 'bg-amber-500', percent: 50, crackTime: 'Algumas horas' };
    }
    if (entropy < 80) {
      return { label: 'Forte', color: 'bg-emerald-500', percent: 75, crackTime: 'Vários anos' };
    }
    return { label: 'Impenetrável', color: 'bg-green-600', percent: 100, crackTime: 'Milhões de séculos' };
  };

  const strength = calculateStrength();

  const generate = () => {
    let lowercase = 'abcdefghijklmnopqrstuvwxyz';
    let uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let numbers = '0123456789';
    let symbols = '!@#$%^&*()_+~|}{[]:;?><,./-=';

    // Remove caracteres que geram confusão visual (0, O, o, 1, l, I, 5, S)
    if (excludeAmbiguous) {
      lowercase = lowercase.replace(/[lo]/g, '');
      uppercase = uppercase.replace(/[IO]/g, '');
      numbers = numbers.replace(/[015]/g, '');
      symbols = symbols.replace(/[|]/g, '');
    }

    let charset = '';
    if (includeLower) charset += lowercase;
    if (includeUpper) charset += uppercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    // Fallback de segurança se tudo for desmarcado
    if (!charset) charset = lowercase;

    let result = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }

    setPassword(result);
    setCopied(false);
  };

  useEffect(() => {
    generate();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeAmbiguous]);

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Campo de Exibição e Cópia */}
      <div className="relative flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          readOnly
          value={password}
          className="flex-1 px-5 py-4 bg-white text-zinc-900 rounded-2xl font-mono text-base sm:text-lg border-2 border-zinc-200 focus:outline-none focus:border-yellow-400 select-all tracking-wider shadow-inner"
        />
        <div className="flex gap-2">
          <button
            onClick={generate}
            title="Gerar Nova Senha"
            className="px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded-2xl transition flex items-center justify-center text-lg"
          >
            🔄
          </button>
          <button
            onClick={copyToClipboard}
            className={`px-6 py-3 font-bold rounded-2xl text-sm transition flex items-center gap-2 shadow ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-900 text-white hover:bg-zinc-800'
            }`}
          >
            {copied ? '✓ Copiado!' : '📋 Copiar'}
          </button>
        </div>
      </div>

      {/* Medidor de Força e Estimativa de Brute-Force */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-zinc-600">
            Segurança da Senha: <b className="text-zinc-900 uppercase">{strength.label}</b>
          </span>
          <span className="text-zinc-500 font-medium">
            Tempo estimado para quebrar: <b className="text-zinc-800">{strength.crackTime}</b>
          </span>
        </div>
        <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strength.color}`}
            style={{ width: `${strength.percent}%` }}
          />
        </div>
      </div>

      {/* Controles de Configuração */}
      <div className="space-y-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold text-zinc-800">Comprimento da Senha</span>
            <span className="font-mono text-base font-black px-3 py-1 bg-zinc-100 rounded-lg border border-zinc-200">
              {length} caracteres
            </span>
          </div>
          <input
            type="range"
            min="8"
            max="64"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-zinc-900"
          />
          <div className="flex justify-between text-[10px] text-zinc-400 font-bold">
            <span>8 (Mínimo)</span>
            <span>16 (Recomendado)</span>
            <span>32 (Alto)</span>
            <span>64 (Extremo)</span>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-100 grid sm:grid-cols-2 gap-3 text-sm">
          <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-zinc-100 hover:bg-zinc-50 cursor-pointer">
            <input
              type="checkbox"
              checked={includeUpper}
              onChange={(e) => setIncludeUpper(e.target.checked)}
              className="w-4 h-4 accent-zinc-900 rounded"
            />
            <span className="font-semibold text-zinc-700">Maiúsculas (A-Z)</span>
          </label>

          <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-zinc-100 hover:bg-zinc-50 cursor-pointer">
            <input
              type="checkbox"
              checked={includeLower}
              onChange={(e) => setIncludeLower(e.target.checked)}
              className="w-4 h-4 accent-zinc-900 rounded"
            />
            <span className="font-semibold text-zinc-700">Minúsculas (a-z)</span>
          </label>

          <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-zinc-100 hover:bg-zinc-50 cursor-pointer">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="w-4 h-4 accent-zinc-900 rounded"
            />
            <span className="font-semibold text-zinc-700">Números (0-9)</span>
          </label>

          <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-zinc-100 hover:bg-zinc-50 cursor-pointer">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="w-4 h-4 accent-zinc-900 rounded"
            />
            <span className="font-semibold text-zinc-700">Símbolos (!@#$)</span>
          </label>

          <label className="sm:col-span-2 flex items-center gap-2.5 p-2.5 rounded-xl border border-zinc-100 hover:bg-zinc-50 cursor-pointer">
            <input
              type="checkbox"
              checked={excludeAmbiguous}
              onChange={(e) => setExcludeAmbiguous(e.target.checked)}
              className="w-4 h-4 accent-zinc-900 rounded"
            />
            <span className="font-semibold text-zinc-700">
              Evitar caracteres semelhantes (ex: 1, l, I, 0, O, o)
            </span>
          </label>
        </div>
      </div>

      <button
        onClick={generate}
        className="w-full py-4 bg-yellow-400 text-zinc-950 font-black rounded-2xl hover:bg-yellow-300 transition text-sm shadow-md flex items-center justify-center gap-2"
      >
        <span>⚡</span> Gerar Nova Senha Criptografada
      </button>
    </div>
  );
}
