'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header({ currentLocale }: { currentLocale: string }) {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme') || 'light';
    setTheme(saved);
    document.documentElement.classList.toggle('dark', saved === 'dark');
  }, []);
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-[64px] flex items-center justify-between">
        <Link href="/en" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center font-black text-zinc-950">W</div>
          <span className="font-black text-zinc-900 dark:text-white tracking-tight">WORLD<span className="text-yellow-500">HUB</span></span>
          <span className="text-[10px] font-bold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-1.5 py-0.5 rounded">PRO</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#tools" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">Tools</a>
          <a href="#directory" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">Directory</a>
          <a href="/en/about" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">About</a>
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} aria-label="Toggle theme" className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:scale-105 transition">
            {mounted && (theme === 'dark' ? '☀️' : '🌙')}
          </button>
          <Link href="/en/tools/bulk-studio" className="hidden sm:inline-flex items-center gap-1 px-4 py-2 rounded-full bg-yellow-400 text-zinc-950 font-bold text-sm hover:bg-yellow-300 transition shadow-lg shadow-yellow-400/20">
            ⚡ Go Pro $9 →
          </Link>
        </div>
      </div>
    </header>
  );
}
