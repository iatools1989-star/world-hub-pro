'use client';

import { useState } from 'react';

export default function QRGenerator() {
  const [text, setText] = useState('https://iatools.online');
  const [size, setSize] = useState(300);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;

  const handleDownload = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qrcode-${Date.now()}.png`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Could not download QR Code directly.');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-zinc-700 mb-1">Text, URL, WiFi or Key</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste URL, text or PIX key..."
          className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-semibold text-zinc-600">Size: {size}px</label>
        <input
          type="range"
          min="150"
          max="500"
          step="25"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="flex-1 accent-zinc-900"
        />
      </div>

      <div className="p-6 bg-white border border-zinc-200 rounded-2xl flex flex-col items-center justify-center gap-4 shadow-inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qrUrl} alt="QR Code" width={size} height={size} className="rounded-xl border border-zinc-200" />
        <button
          onClick={handleDownload}
          className="px-6 py-2.5 bg-zinc-900 text-white font-bold rounded-full hover:bg-zinc-800 transition text-sm"
        >
          Download PNG Image
        </button>
      </div>
    </div>
  );
}
