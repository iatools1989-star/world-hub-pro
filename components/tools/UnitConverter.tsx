'use client';

import { useState } from 'react';

type CategoryKey = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'speed';

interface UnitDef {
  label: string;
  rate: number; // Multiplicador para converter para a unidade base
  offset?: number; // Para temperatura
}

const CATEGORIES: Record<CategoryKey, { name: string; icon: string; units: Record<string, UnitDef> }> = {
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
      c: { label: 'Celsius (°C)', rate: 1, offset: 0 },
      f: { label: 'Fahrenheit (°F)', rate: 1, offset: 0 },
      k: { label: 'Kelvin (K)', rate: 1, offset: 0 },
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
      gal: { label: 'Galões (EUA)', rate: 3.78541 },
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

export default function UnitConverter() {
  const [category, setCategory] = useState<CategoryKey>('length');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');
  const [fromValue, setFromValue] = useState<string>('1');

  const currentCategory = CATEGORIES[category];
  const units = currentCategory.units;

  // Lógica de troca de categoria ajustando unidades padrão
  const handleCategoryChange = (cat: CategoryKey) => {
    setCategory(cat);
    const keys = Object.keys(CATEGORIES[cat].units);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
  };

  // Conversão de Temperatura Especial
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

  // Cálculo Geral
  const calculateResult = (): string => {
    const num = parseFloat(fromValue);
    if (isNaN(num)) return '0';

    if (category === 'temperature') {
      const res = convertTemperature(num, fromUnit, toUnit);
      return Number(res.toFixed(4)).toString();
    }

    const baseValue = num * (units[fromUnit]?.rate || 1);
    const result = baseValue / (units[toUnit]?.rate || 1);

    // Formatação limpa evitando dízimas infinitas
    return Number(result.toFixed(6)).toString();
  };

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  return (
    <div className="space-y-6">
      {/* Seletor de Categorias */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {(Object.keys(CATEGORIES) as CategoryKey[]).map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
              category === cat
                ? 'bg-zinc-900 text-yellow-400 border-zinc-900 shadow'
                : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
            }`}
          >
            <span className="text-xl">{CATEGORIES[cat].icon}</span>
            <span>{CATEGORIES[cat].name}</span>
          </button>
        ))}
      </div>

      {/* Caixa de Conversão */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
          {/* Origem */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">De:</label>
            <input
              type="number"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 rounded-2xl border-2 border-zinc-200 focus:outline-none focus:border-yellow-400 font-bold text-lg"
            />
            <select
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
          <div className="flex justify-center pt-4 md:pt-0">
            <button
              onClick={handleSwap}
              title="Inverter Unidades"
              className="w-12 h-12 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-full flex items-center justify-center font-bold text-lg transition shadow-sm"
            >
              ⇄
            </button>
          </div>

          {/* Destino */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Para (Resultado):</label>
            <div className="w-full px-4 py-3 rounded-2xl bg-zinc-50 border-2 border-zinc-200 font-black text-xl text-zinc-900 select-all overflow-x-auto">
              {calculateResult()}
            </div>
            <select
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

        {/* Tabela de Conversão Rápida Dinâmica */}
        <div className="pt-4 border-t border-zinc-100">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-3">
            Valores de Referência ({fromValue || 0} {units[fromUnit]?.label.split(' ')[0]}):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {Object.entries(units).filter(([k]) => k !== fromUnit).slice(0, 4).map(([k, item]) => {
              const num = parseFloat(fromValue) || 0;
              let converted = 0;
              if (category === 'temperature') {
                converted = convertTemperature(num, fromUnit, k);
              } else {
                converted = (num * units[fromUnit]?.rate) / item.rate;
              }
              return (
                <div key={k} className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-200 text-center">
                  <div className="font-bold text-zinc-900">{Number(converted.toFixed(4))}</div>
                  <div className="text-[10px] text-zinc-500 truncate">{item.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
