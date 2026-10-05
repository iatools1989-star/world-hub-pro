'use client';

import React, { useState, useId } from 'react';

// ============================================================================
// DADOS E TIPOS DO CONVERSOR DE UNIDADES
// ============================================================================
type CategoryKey = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'speed';

interface UnitDef {
  label: string;
  rate: number; // Multiplicador para a unidade base
}

const CONVERTER_CATEGORIES: Record<CategoryKey, { name: string; icon: string; units: Record<string, UnitDef> }> = {
  length: {
    name: 'Comprimento',
    icon: '📏',
    units: {
      m: { label: 'Metros (m)', rate: 1 },
      km: { label: 'Quilômetros (km)', rate: 1000 },
      cm: { label: 'Centímetros (cm)', rate: 0.01 },
      mm: { label: 'Milímetros (mm)', rate: 0.001 },
      mi: { label: 'Milhas (mi)', rate: 1609.344 },
      yd: { label: 'Jardas (yd)', rate: 0.9144 },
      ft: { label: 'Pés (ft)', rate: 0.3048 },
      in: { label: 'Polegadas (in)', rate: 0.0254 },
    },
  },
  weight: {
    name: 'Peso / Massa',
    icon: '⚖️',
    units: {
      kg: { label: 'Quilogramas (kg)', rate: 1 },
      g: { label: 'Gramas (g)', rate: 0.001 },
      mg: { label: 'Miligramas (mg)', rate: 0.000001 },
      t: { label: 'Toneladas (t)', rate: 1000 },
      lb: { label: 'Libras (lb)', rate: 0.45359237 },
      oz: { label: 'Onças (oz)', rate: 0.02834952 },
    },
  },
  temperature: {
    name: 'Temperatura',
    icon: '🌡️',
    units: {
      c: { label: 'Celsius (°C)', rate: 1 },
      f: { label: 'Fahrenheit (°F)', rate: 1 },
      k: { label: 'Kelvin (K)', rate: 1 },
    },
  },
  area: {
    name: 'Área',
    icon: '📐',
    units: {
      m2: { label: 'Metros Quadrados (m²)', rate: 1 },
      km2: { label: 'Quilômetros Quadrados (km²)', rate: 1000000 },
      ha: { label: 'Hectares (ha)', rate: 10000 },
      ft2: { label: 'Pés Quadrados (ft²)', rate: 0.092903 },
      ac: { label: 'Acres (ac)', rate: 4046.856 },
    },
  },
  volume: {
    name: 'Volume',
    icon: '🧪',
    units: {
      l: { label: 'Litros (L)', rate: 1 },
      ml: { label: 'Mililitros (mL)', rate: 0.001 },
      m3: { label: 'Metros Cúbicos (m³)', rate: 1000 },
      gal: { label: 'Galões (gal EUA)', rate: 3.78541 },
      cup: { label: 'Xícaras', rate: 0.24 },
    },
  },
  speed: {
    name: 'Velocidade',
    icon: '🚀',
    units: {
      kmh: { label: 'Quilômetros por Hora (km/h)', rate: 1 },
      ms: { label: 'Metros por Segundo (m/s)', rate: 3.6 },
      mph: { label: 'Milhas por Hora (mph)', rate: 1.609344 },
      knot: { label: 'Nós (kn)', rate: 1.852 },
    },
  },
};

// ============================================================================
// LISTA DE PARÂMETROS DE RASTREAMENTO PARA LIMPEZA
// ============================================================================
const TRACKING_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'fbclid',
  'gclid',
  'msclkid',
  'mc_eid',
  '_hsenc',
  '_hsmi',
  'zanpid',
  'igshid',
  'si',
  'yclid',
  '_ga',
  'dclid',
];

// ============================================================================
// COMPONENTE 1: UNIT CONVERTER
// ============================================================================
function UnitConverterTool() {
  const [category, setCategory] = useState<CategoryKey>('length');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');
  const [fromValue, setFromValue] = useState<string>('1');

  const inputId = useId();
  const fromSelectId = useId();
  const toSelectId = useId();

  const currentCategory = CONVERTER_CATEGORIES[category];
  const units = currentCategory.units;

  // Troca de categoria
  const handleCategoryChange = (cat: CategoryKey) => {
    setCategory(cat);
    const keys = Object.keys(CONVERTER_CATEGORIES[cat].units);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
  };

  // Conversão de temperatura
  const convertTemperature = (val: number, from: string, to: string): number => {
    if (from === to) return val;
    let celsius = val;
    if (from === 'f') celsius = (val - 32) * (5 / 9);
    if (from === 'k') celsius = val - 273.15;

    if (to === 'c') return celsius;
    if (to === 'f') return celsius * (9 / 5) + 32;
    if (to === 'k') return celsius + 273.15;
    return celsius;
  };

  // Cálculo principal
  const calculateResult = (): string => {
    const num = parseFloat(fromValue);
    if (isNaN(num)) return '0';

    if (category === 'temperature') {
      const res = convertTemperature(num, fromUnit, toUnit);
      return Number(res.toFixed(4)).toString();
    }

    const baseValue = num * (units[fromUnit]?.rate || 1);
    const result = baseValue / (units[toUnit]?.rate || 1);
    return Number(result.toFixed(6)).toString();
  };

  // Inversão instantânea (⇄)
  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  return (
    <div className="space-y-6">
      {/* Seletor de Categorias */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2" role="tablist" aria-label="Categorias de Conversão">
        {(Object.keys(CONVERTER_CATEGORIES) as CategoryKey[]).map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={category === cat}
            onClick={() => handleCategoryChange(cat)}
            className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
              category === cat
                ? 'bg-zinc-900 text-yellow-400 border-zinc-900 shadow-md scale-[1.02]'
                : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
            }`}
          >
            <span className="text-xl" aria-hidden="true">{CONVERTER_CATEGORIES[cat].icon}</span>
            <span>{CONVERTER_CATEGORIES[cat].name}</span>
          </button>
        ))}
      </div>

      {/* Caixa de Conversão */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
          {/* Origem */}
          <div className="space-y-2">
            <label htmlFor={inputId} className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">
              De (Valor e Unidade):
            </label>
            <input
              id={inputId}
              type="number"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 rounded-2xl border-2 border-zinc-200 focus:outline-none focus:border-yellow-400 font-bold text-lg"
            />
            <label htmlFor={fromSelectId} className="sr-only">Unidade de Origem</label>
            <select
              id={fromSelectId}
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-zinc-300 text-sm bg-white font-medium cursor-pointer"
            >
              {Object.entries(units).map(([key, item]) => (
                <option key={key} value={key}>{item.label}</option>
              ))}
            </select>
          </div>

          {/* Botão de Inversão */}
          <div className="flex justify-center pt-2 md:pt-4">
            <button
              onClick={handleSwap}
              type="button"
              title="Inverter Unidades (⇄)"
              aria-label="Inverter Unidades"
              className="w-12 h-12 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-full flex items-center justify-center font-bold text-xl transition-transform hover:scale-110 active:scale-95 shadow-sm"
            >
              ⇄
            </button>
          </div>

          {/* Destino */}
          <div className="space-y-2">
            <label htmlFor={toSelectId} className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Para (Resultado):
            </label>
            <div
              className="w-full px-4 py-3 rounded-2xl bg-zinc-50 border-2 border-zinc-200 font-black text-xl text-zinc-900 select-all overflow-x-auto min-h-[52px] flex items-center"
              aria-live="polite"
            >
              {calculateResult()}
            </div>
            <select
              id={toSelectId}
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-zinc-300 text-sm bg-white font-medium cursor-pointer"
            >
              {Object.entries(units).map(([key, item]) => (
                <option key={key} value={key}>{item.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabela de Referência Rápida (4 Unidades Alternativas em Tempo Real) */}
        <div className="pt-4 border-t border-zinc-100">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-3">
            Tabela de Referência Rápida ({fromValue || 0} {units[fromUnit]?.label.split(' ')[0]} equivalem a):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {Object.entries(units)
              .filter(([k]) => k !== fromUnit)
              .slice(0, 4)
              .map(([k, item]) => {
                const num = parseFloat(fromValue) || 0;
                let converted = 0;
                if (category === 'temperature') {
                  converted = convertTemperature(num, fromUnit, k);
                } else {
                  converted = (num * units[fromUnit]?.rate) / item.rate;
                }
                return (
                  <div key={k} className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 text-center space-y-1">
                    <div className="font-black text-sm text-zinc-900 truncate">
                      {Number(converted.toFixed(4))}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-semibold truncate">
                      {item.label}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENTE 2: COLOR PICKER
// ============================================================================
function ColorPickerTool() {
  const [color, setColor] = useState('#6366F1');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [eyeDropperMessage, setEyeDropperMessage] = useState<string | null>(null);

  // Conversões HEX para RGB
  const hexToRgb = (hex: string) => {
    let clean = hex.replace('#', '');
    if (clean.length === 3) {
      clean = clean.split('').map((c) => c + c).join('');
    }
    const num = parseInt(clean, 16) || 0;
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  const rgb = hexToRgb(color);

  // Conversões RGB para HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const colorFormats = [
    { label: 'HEX', value: color.toUpperCase() },
    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: 'CSS Var', value: `--color: ${color};` },
  ];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(label);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  // Paleta Harmônica de 7 Tons
  const generateShades = () => {
    const scales = [15, 30, 45, hsl.l, 70, 85, 95];
    return scales.map((l) => `hsl(${hsl.h}, ${hsl.s}%, ${l}%)`);
  };

  // Integração EyeDropper com mensagem amigável
  const handleEyeDropper = async () => {
    setEyeDropperMessage(null);
    if (typeof window !== 'undefined' && 'EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        setColor(result.sRGBHex);
      } catch {
        // Usuário fechou ou cancelou
      }
    } else {
      setEyeDropperMessage('Seu navegador atual não suporta a EyeDropper API (disponível no Chrome, Edge e Opera). Utilize o seletor visual abaixo.');
      setTimeout(() => setEyeDropperMessage(null), 6000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Alerta Amigável para EyeDropper */}
      {eyeDropperMessage && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-xs flex items-center justify-between">
          <span>ℹ️ {eyeDropperMessage}</span>
          <button onClick={() => setEyeDropperMessage(null)} className="font-bold ml-2">✕</button>
        </div>
      )}

      {/* Bloco Principal de Visualização e Cópia */}
      <div className="grid md:grid-cols-[1fr_1.3fr] gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm items-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-full h-44 rounded-2xl shadow-inner border border-zinc-200 transition-colors flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: color }}
          >
            <span className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-xl text-white font-mono font-bold text-sm tracking-wider">
              {color.toUpperCase()}
            </span>
          </div>

          <div className="flex gap-2 w-full">
            <label className="flex-1 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow">
              <span>🎨 Abrir Seletor</span>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="sr-only"
              />
            </label>

            <button
              onClick={handleEyeDropper}
              type="button"
              className="py-3 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded-2xl text-xs flex items-center gap-1.5 transition"
            >
              <span>🧪</span> Conta-Gotas
            </button>
          </div>
        </div>

        {/* Tabela de Formatos com Cópia de 1 Clique */}
        <div className="space-y-2.5">
          {colorFormats.map((fmt) => (
            <div
              key={fmt.label}
              className="flex items-center justify-between p-3 bg-zinc-50 rounded-2xl border border-zinc-200"
            >
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  {fmt.label}
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold text-zinc-800">
                  {fmt.value}
                </span>
              </div>
              <button
                onClick={() => handleCopy(fmt.value, fmt.label)}
                type="button"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  copiedFormat === fmt.label
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-800'
                }`}
              >
                {copiedFormat === fmt.label ? '✓ Copiado' : 'Copiar'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Paleta Harmônica de 7 Tons */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-3">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
          Paleta Harmônica (7 Graus de Brilho HSL — Clique para selecionar):
        </span>
        <div className="grid grid-cols-7 gap-2">
          {generateShades().map((shade, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                // Converte HSL de volta para o picker
                setColor(shade);
              }}
              className="h-12 rounded-xl border border-black/10 shadow-sm hover:scale-105 active:scale-95 transition-transform"
              style={{ backgroundColor: shade }}
              title={`Clique para selecionar ${shade}`}
              aria-label={`Tom de cor ${shade}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENTE 3: URL SHORTENER & CLEANER
// ============================================================================
function URLShortenerTool() {
  const [inputUrl, setInputUrl] = useState('https://exemplo.com/artigo?utm_source=facebook&utm_medium=cpc&fbclid=IwAR123456789&gclid=XYZ999&session=ok');
  const [cleanedUrl, setCleanedUrl] = useState('');
  const [removedCount, setRemovedCount] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const cleanUrl = () => {
    try {
      const url = new URL(inputUrl.trim());
      let count = 0;

      // Remoção dos parâmetros pré-definidos
      TRACKING_PARAMS.forEach((param) => {
        if (url.searchParams.has(param)) {
          url.searchParams.delete(param);
          count++;
        }
      });

      // Remoção de variações de utm_* e afins
      Array.from(url.searchParams.keys()).forEach((key) => {
        if (key.startsWith('utm_') || key.startsWith('hsa_')) {
          url.searchParams.delete(key);
          count++;
        }
      });

      setCleanedUrl(url.toString());
      setRemovedCount(count);
      setCopied(false);
    } catch {
      alert('URL inválida. Certifique-se de digitar o link completo iniciando com http:// ou https://');
    }
  };

  const handleCopy = () => {
    if (!cleanedUrl) return;
    navigator.clipboard.writeText(cleanedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
        <div>
          <label htmlFor="url-input" className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
            Insira o link com parâmetros de rastreamento (anúncios, redes sociais, UTMs):
          </label>
          <input
            id="url-input"
            type="url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="https://exemplo.com/pagina?utm_source=..."
            className="w-full px-4 py-3 rounded-2xl border-2 border-zinc-200 focus:outline-none focus:border-yellow-400 font-sans text-sm"
          />
        </div>

        <button
          onClick={cleanUrl}
          type="button"
          className="w-full py-4 bg-yellow-400 text-zinc-950 font-black rounded-2xl hover:bg-yellow-300 transition text-sm shadow-md flex items-center justify-center gap-2"
        >
          <span>✨</span> Higienizar e Remover Parâmetros de Rastreamento
        </button>
      </div>

      {/* Exibição do Resultado */}
      {cleanedUrl && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              URL Limpa e Otimizada:
            </span>
            {removedCount !== null && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ✓ {removedCount} {removedCount === 1 ? 'rastreador removido' : 'rastreadores removidos'}
              </span>
            )}
          </div>

          <div
            className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 font-mono text-xs sm:text-sm text-zinc-800 break-all select-all leading-relaxed"
            aria-live="polite"
          >
            {cleanedUrl}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleCopy}
              type="button"
              className={`flex-1 py-3 px-5 font-bold rounded-2xl text-xs transition flex items-center justify-center gap-2 shadow ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-900 text-white hover:bg-zinc-800'
              }`}
            >
              {copied ? '✓ Copiado para a Área de Transferência!' : '📋 Copiar Link Limpo'}
            </button>
            <a
              href={cleanedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition"
            >
              <span>↗</span> Testar URL em Nova Aba
            </a>
          </div>
        </div>
      )}

      {/* Cartão Explicativo de Privacidade */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-xs text-zinc-600 leading-relaxed">
        <b>💡 Por que limpar seus links?</b> Redes como Facebook, Google e TikTok anexam identificadores individuais (como <code className="bg-zinc-200 px-1 rounded">fbclid</code> e <code className="bg-zinc-200 px-1 rounded">gclid</code>) que rastreiam quem compartilhou a página. A remoção limpa esses dados sem quebrar o acesso ao destino.
      </div>
    </div>
  );
}

// ============================================================================
// PÁGINA COMPLETA INTEGRADA COM SELEÇÃO POR ABAS / SEÇÕES
// ============================================================================
type ToolTab = 'unit-converter' | 'color-picker' | 'url-shortener';

export default function Batch2ToolsPage() {
  const [activeTab, setActiveTab] = useState<ToolTab>('unit-converter');

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 py-10 px-4 sm:px-6">
      <div className="max-w-[1000px] mx-auto space-y-8">
        {/* Cabeçalho */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-zinc-900 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            Lote 2 • Utilitários de Conversão & Cor
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900">
            Ferramentas Online Otimizadas
          </h1>
          <p className="text-sm text-zinc-600 max-w-xl mx-auto">
            Processamento 100% nativo no navegador, sem cookies de terceiros e sem chamadas externas.
          </p>
        </div>

        {/* Barra de Navegação entre as Ferramentas (Abas) */}
        <div className="flex justify-center" role="tablist" aria-label="Navegação entre Ferramentas">
          <div className="inline-flex p-1.5 bg-white border border-zinc-200 rounded-2xl shadow-sm gap-1">
            <button
              role="tab"
              aria-selected={activeTab === 'unit-converter'}
              onClick={() => setActiveTab('unit-converter')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 ${
                activeTab === 'unit-converter'
                  ? 'bg-zinc-900 text-yellow-400 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <span>📐</span> Unit Converter
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'color-picker'}
              onClick={() => setActiveTab('color-picker')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 ${
                activeTab === 'color-picker'
                  ? 'bg-zinc-900 text-yellow-400 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <span>🎨</span> Color Picker
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'url-shortener'}
              onClick={() => setActiveTab('url-shortener')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 ${
                activeTab === 'url-shortener'
                  ? 'bg-zinc-900 text-yellow-400 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <span>🔗</span> URL Cleaner
            </button>
          </div>
        </div>

        {/* Conteúdo Dinâmico da Ferramenta Selecionada */}
        <main className="transition-all">
          {activeTab === 'unit-converter' && (
            <section aria-labelledby="unit-converter-title">
              <div className="mb-4">
                <h2 id="unit-converter-title" className="text-xl font-black text-zinc-900">
                  Unit Converter <span className="text-xs text-zinc-500 font-normal">(/en/tools/unit-converter)</span>
                </h2>
                <p className="text-xs text-zinc-600">
                  Conversão exata entre 6 categorias com inversão rápida e referência simultânea.
                </p>
              </div>
              <UnitConverterTool />
            </section>
          )}

          {activeTab === 'color-picker' && (
            <section aria-labelledby="color-picker-title">
              <div className="mb-4">
                <h2 id="color-picker-title" className="text-xl font-black text-zinc-900">
                  Color Picker <span className="text-xs text-zinc-500 font-normal">(/en/tools/color-picker)</span>
                </h2>
                <p className="text-xs text-zinc-600">
                  Inspeção com conta-gotas na tela, conversão para múltiplos formatos e paletas de 7 tons.
                </p>
              </div>
              <ColorPickerTool />
            </section>
          )}

          {activeTab === 'url-shortener' && (
            <section aria-labelledby="url-shortener-title">
              <div className="mb-4">
                <h2 id="url-shortener-title" className="text-xl font-black text-zinc-900">
                  URL Cleaner &amp; Shortener <span className="text-xs text-zinc-500 font-normal">(/en/tools/url-shortener)</span>
                </h2>
                <p className="text-xs text-zinc-600">
                  Higienize links removendo parâmetros invasivos de rastreamento com 1 clique.
                </p>
              </div>
              <URLShortenerTool />
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
