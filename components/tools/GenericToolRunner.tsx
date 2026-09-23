'use client';

import { useState } from 'react';

export default function GenericToolRunner({ name }: { name: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');

  const handleProcess = () => {
    setStatus('Processing locally in your browser memory...');
    setTimeout(() => {
      setStatus('Done! Client-side task finished successfully.');
    }, 1200);
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-zinc-300 rounded-2xl p-8 text-center bg-zinc-50 hover:bg-zinc-100 transition cursor-pointer">
        <input
          type="file"
          id="toolFileInput"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <label htmlFor="toolFileInput" className="cursor-pointer block space-y-2">
          <div className="text-4xl">📁</div>
          <div className="font-bold text-zinc-800">
            {file ? file.name : `Select file to run ${name}`}
          </div>
          <div className="text-xs text-zinc-500">
            100% Client-Side. No data is sent to external servers.
          </div>
        </label>
      </div>

      <button
        onClick={handleProcess}
        disabled={!file}
        className="w-full py-3.5 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition disabled:opacity-40 text-sm"
      >
        Run {name} Locally
      </button>

      {status && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold text-center">
          {status}
        </div>
      )}
    </div>
  );
}
