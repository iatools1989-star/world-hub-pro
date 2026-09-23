'use client';

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

type QRType = 'url' | 'wifi' | 'text' | 'pix';

export default function QRGenerator() {
  const [activeTab, setActiveTab] = useState<QRType>('url');
  const [rawText, setRawText] = useState('https://iatools.online');
  
  // Wi-Fi inputs
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [wifiType, setWifiType] = useState('WPA');

  // PIX inputs
  const [pixKey, setPixKey] = useState('');

  // Styling options
  const [size, setSize] = useState(300);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [svgDataUrl, setSvgDataUrl] = useState<string>('');

  // Constrói o payload final conforme a aba ativa
  const getPayload = (): string => {
    switch (activeTab) {
      case 'wifi':
        return `WIFI:T:${wifiType};S:${wifiSsid};P:${wifiPass};;`;
      case 'pix':
        return pixKey.trim() || ' ';
      case 'url':
      case 'text':
      default:
        return rawText.trim() || ' ';
    }
  };

  const payload = getPayload();

  // Renderização 100% Client-Side em Canvas e SVG
  useEffect(() => {
    if (!payload.trim()) return;

    // 1. Renderiza no Canvas para preview e download PNG
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        payload,
        {
          width: size,
          margin: 2,
          errorCorrectionLevel: errorLevel,
          color: {
            dark: fgColor,
            light: bgColor,
          },
        },
        (err) => {
          if (err) console.error('Erro na renderização do canvas QR:', err);
        }
      );
    }

    // 2. Gera a string SVG vetorial pura para download
    QRCode.toString(
      payload,
      {
        type: 'svg',
        margin: 2,
        errorCorrectionLevel: errorLevel,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      },
      (err, string) => {
        if (!err && string) {
          const blob = new Blob([string], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          setSvgDataUrl(url);
        }
      }
    );
  }, [payload, size, fgColor, bgColor, errorLevel]);

  // Download do PNG em alta definição gerado localmente
  const downloadPNG = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  // Download do SVG vetorial
  const downloadSVG = () => {
    if (!svgDataUrl) return;
    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.svg`;
    link.href = svgDataUrl;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Abas de Tipos Rápidos */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-3">
        {(['url', 'wifi', 'pix', 'text'] as QRType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              activeTab === tab
                ? 'bg-zinc-900 text-yellow-400 shadow'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {tab === 'url' && '🔗 Link / URL'}
            {tab === 'wifi' && '📶 Wi-Fi'}
            {tab === 'pix' && '💸 Chave PIX'}
            {tab === 'text' && '📝 Texto Puro'}
          </button>
        ))}
      </div>

      {/* Formulários dinâmicos por tipo */}
      <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
        {activeTab === 'url' && (
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Website ou Link de Destino
            </label>
            <input
              type="url"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="https://exemplo.com"
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            />
          </div>
        )}

        {activeTab === 'wifi' && (
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Nome da Rede (SSID)
              </label>
              <input
                type="text"
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
                placeholder="Ex: MinhaCasa_5G"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Senha do Wi-Fi
              </label>
              <input
                type="text"
                value={wifiPass}
                onChange={(e) => setWifiPass(e.target.value)}
                placeholder="Senha da rede..."
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                Criptografia
              </label>
              <select
                value={wifiType}
                onChange={(e) => setWifiType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm bg-white"
              >
                <option value="WPA">WPA / WPA2 / WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Rede Aberta</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'pix' && (
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Chave PIX ou Código Copia e Cola
            </label>
            <input
              type="text"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              placeholder="CPF, CNPJ, E-mail, Celular ou chave aleatória..."
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm"
            />
          </div>
        )}

        {activeTab === 'text' && (
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
              Mensagem ou Texto Livre
            </label>
            <textarea
              rows={3}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Digite qualquer texto..."
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm"
            />
          </div>
        )}

        {/* Opções Avançadas de Customização */}
        <div className="pt-4 border-t border-zinc-100 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center text-xs">
          <div>
            <span className="font-bold text-zinc-600 block mb-1">Tamanho: {size}px</span>
            <input
              type="range"
              min="150"
              max="600"
              step="25"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full accent-zinc-900"
            />
          </div>

          <div>
            <span className="font-bold text-zinc-600 block mb-1">Cor do QR</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-8 h-8 rounded border cursor-pointer"
              />
              <span className="font-mono text-[11px]">{fgColor}</span>
            </div>
          </div>

          <div>
            <span className="font-bold text-zinc-600 block mb-1">Cor de Fundo</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-8 h-8 rounded border cursor-pointer"
              />
              <span className="font-mono text-[11px]">{bgColor}</span>
            </div>
          </div>

          <div>
            <span className="font-bold text-zinc-600 block mb-1">Correção de Erro</span>
            <select
              value={errorLevel}
              onChange={(e) => setErrorLevel(e.target.value as any)}
              className="w-full px-2 py-1.5 rounded-lg border border-zinc-300 bg-white text-xs"
            >
              <option value="L">Baixa (7%)</option>
              <option value="M">Média (15%)</option>
              <option value="Q">Alta (25%)</option>
              <option value="H">Máxima (30%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Área de Preview e Download */}
      <div className="p-8 bg-white border border-zinc-200 rounded-3xl flex flex-col items-center justify-center gap-5 shadow-sm">
        <div className="p-4 bg-white rounded-2xl shadow-inner border border-zinc-100 flex items-center justify-center">
          <canvas ref={canvasRef} className="max-w-full rounded-lg" />
        </div>

        <div className="text-xs text-zinc-500 font-medium text-center">
          ✓ 100% renderizado no seu navegador (sem dados enviados para a rede).
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={downloadPNG}
            className="px-6 py-3 bg-zinc-900 text-white font-bold rounded-full hover:bg-zinc-800 transition text-sm flex items-center gap-2 shadow"
          >
            <span>⬇</span> Baixar Imagem PNG
          </button>
          <button
            onClick={downloadSVG}
            className="px-6 py-3 bg-yellow-400 text-zinc-950 font-bold rounded-full hover:bg-yellow-300 transition text-sm flex items-center gap-2 shadow"
          >
            <span>⚡</span> Baixar Vetor SVG (Infinito)
          </button>
        </div>
      </div>
    </div>
  );
}
