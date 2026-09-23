'use client';

import React, { useState, useEffect } from 'react';

export default function TextToSpeech() {
  const [text, setText] = useState<string>(
    'Olá! Este é o sintetizador de voz natural da World Tools Hub. Ele converte qualquer texto em fala diretamente no seu navegador, com zero consumo de internet.'
  );
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [rate, setRate] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(1.0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      // Prioriza vozes em português ou inglês como padrão inicial
      if (availableVoices.length > 0 && !selectedVoice) {
        const preferred =
          availableVoices.find((v) => v.lang.startsWith('pt')) ||
          availableVoices.find((v) => v.lang.startsWith('en')) ||
          availableVoices[0];
        setSelectedVoice(preferred.name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleSpeak = () => {
    if (!text.trim() || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voiceObj = voices.find((v) => v.name === selectedVoice);
    if (voiceObj) utterance.voice = voiceObj;

    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePauseResume = () => {
    if (typeof window === 'undefined') return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  return (
    <div className="space-y-6">
      {/* Entrada de Texto */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
            Texto para Leitura por Voz Neural:
          </label>
          <textarea
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Digite ou cole aqui o texto que você deseja ouvir..."
            className="w-full p-4 rounded-2xl border-2 border-zinc-200 focus:outline-none focus:border-yellow-400 font-sans text-sm leading-relaxed"
          />
        </div>

        {/* Seleção de Voz e Ajustes */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-zinc-600 mb-1.5 uppercase tracking-wider">
              Voz / Idioma ({voices.length} disponíveis)
            </label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-zinc-300 text-xs bg-white font-medium cursor-pointer"
            >
              {voices.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-bold text-zinc-600 mb-1.5">
              <span>Velocidade</span>
              <span className="font-mono text-zinc-900">{rate}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-zinc-900"
            />
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-bold text-zinc-600 mb-1.5">
              <span>Tom (Pitch)</span>
              <span className="font-mono text-zinc-900">{pitch}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(Number(e.target.value))}
              className="w-full accent-zinc-900"
            />
          </div>
        </div>

        {/* Barra de Controles de Áudio */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-zinc-100">
          <button
            onClick={handleSpeak}
            type="button"
            className="flex-1 py-4 bg-yellow-400 text-zinc-950 font-black rounded-2xl hover:bg-yellow-300 transition text-sm shadow-md flex items-center justify-center gap-2"
          >
            <span>▶</span> {isSpeaking ? 'Reiniciar Fala' : 'Ouvir Texto Agora'}
          </button>

          {isSpeaking && (
            <button
              onClick={handlePauseResume}
              type="button"
              className="px-6 py-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded-2xl text-sm transition"
            >
              {isPaused ? 'Continuar ⏯' : 'Pausar ⏸'}
            </button>
          )}

          {(isSpeaking || isPaused) && (
            <button
              onClick={handleStop}
              type="button"
              className="px-6 py-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl text-sm transition"
            >
              Parar ⏹
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
