'use client';

import { useState } from 'react';

export default function WordCounter() {
  const [text, setText] = useState('');

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s+/g, '').length;
  const readingTime = Math.ceil(words / 200);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-zinc-200 p-3 rounded-xl text-center">
          <div className="text-2xl font-black text-zinc-900">{words}</div>
          <div className="text-xs text-zinc-500 font-bold uppercase">Words</div>
        </div>
        <div className="bg-white border border-zinc-200 p-3 rounded-xl text-center">
          <div className="text-2xl font-black text-zinc-900">{chars}</div>
          <div className="text-xs text-zinc-500 font-bold uppercase">Characters</div>
        </div>
        <div className="bg-white border border-zinc-200 p-3 rounded-xl text-center">
          <div className="text-2xl font-black text-zinc-900">{charsNoSpaces}</div>
          <div className="text-xs text-zinc-500 font-bold uppercase">No Spaces</div>
        </div>
        <div className="bg-white border border-zinc-200 p-3 rounded-xl text-center">
          <div className="text-2xl font-black text-zinc-900">~{readingTime}m</div>
          <div className="text-xs text-zinc-500 font-bold uppercase">Reading Time</div>
        </div>
      </div>

      <textarea
        rows={8}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        className="w-full p-4 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-sans text-sm"
      />
    </div>
  );
}
