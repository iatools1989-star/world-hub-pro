'use client';

import { useState } from 'react';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState('Select options & generate');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let charset = 'abcdefghijklmnopqrstuvwxyz';
    if (includeUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let result = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }
    setPassword(result);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          readOnly
          value={password}
          className="flex-1 px-4 py-3 bg-zinc-100 rounded-xl font-mono text-sm border border-zinc-300 select-all"
        />
        <button
          onClick={copyToClipboard}
          className="px-5 py-3 bg-zinc-900 text-white font-bold rounded-xl text-sm hover:bg-zinc-800 transition"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>

      <div className="space-y-3 bg-white p-4 rounded-xl border border-zinc-200">
        <div className="flex items-center justify-between text-sm">
          <span>Password Length: <b>{length}</b></span>
          <input
            type="range"
            min="8"
            max="64"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-48 accent-zinc-900"
          />
        </div>

        <div className="flex flex-wrap gap-4 text-sm font-medium">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={includeUpper}
              onChange={(e) => setIncludeUpper(e.target.checked)}
            />
            Uppercase (A-Z)
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
            />
            Numbers (0-9)
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
            />
            Symbols (!@#$)
          </label>
        </div>
      </div>

      <button
        onClick={generate}
        className="w-full py-3.5 bg-yellow-400 text-zinc-950 font-black rounded-xl hover:bg-yellow-300 transition text-sm shadow-md"
      >
        ⚡ Generate Secure Password
      </button>
    </div>
  );
}
