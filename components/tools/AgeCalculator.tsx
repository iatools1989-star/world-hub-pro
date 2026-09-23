'use client';

import React, { useState } from 'react';

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState<string>('1995-06-15');
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Cálculo de idade e métricas detalhadas
  const calculateAge = () => {
    if (!birthDate) return null;

    const start = new Date(birthDate + 'T00:00:00');
    const end = targetDate ? new Date(targetDate + 'T00:00:00') : new Date();

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
      return null;
    }

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months--;
      const prevMonthLastDay = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Totais acumulados
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    // Próximo aniversário
    const currentYearBirthday = new Date(end.getFullYear(), start.getMonth(), start.getDate());
    if (currentYearBirthday < end) {
      currentYearBirthday.setFullYear(end.getFullYear() + 1);
    }
    const daysUntilNextBirthday = Math.ceil((currentYearBirthday.getTime() - end.getTime()) / (1000 * 60 * 60 * 24));

    // Dia da semana do nascimento
    const weekdays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const bornDayOfWeek = weekdays[start.getDay()];

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalHours,
      totalMinutes,
      daysUntilNextBirthday,
      bornDayOfWeek,
    };
  };

  const stats = calculateAge();

  return (
    <div className="space-y-6">
      {/* Formulário de Datas */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
              Data de Nascimento:
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-zinc-200 focus:outline-none focus:border-yellow-400 font-bold text-sm bg-zinc-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
              Calcular Idade na Data de (Hoje por padrão):
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-zinc-200 focus:outline-none focus:border-yellow-400 font-bold text-sm bg-zinc-50"
            />
          </div>
        </div>
      </div>

      {stats ? (
        <div className="space-y-6 animate-in fade-in">
          {/* Cartão de Destaque da Idade */}
          <div className="bg-zinc-900 text-white p-6 sm:p-8 rounded-3xl shadow-sm text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-yellow-400 font-bold">
              Idade Exata Calculada
            </span>
            <div className="text-3xl sm:text-5xl font-black text-white">
              {stats.years} <span className="text-xl sm:text-2xl font-normal text-zinc-400">anos</span>, {stats.months} <span className="text-xl sm:text-2xl font-normal text-zinc-400">meses e</span> {stats.days} <span className="text-xl sm:text-2xl font-normal text-zinc-400">dias</span>
            </div>
            <p className="text-xs text-zinc-400">
              Você nasceu em um(a) <b>{stats.bornDayOfWeek}</b>. Faltam <b>{stats.daysUntilNextBirthday} dias</b> para o seu próximo aniversário!
            </p>
          </div>

          {/* Grade de Totais Acumulados */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
              <div className="text-xl sm:text-2xl font-black text-zinc-900">{stats.totalDays.toLocaleString('pt-BR')}</div>
              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mt-1">Dias de Vida</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
              <div className="text-xl sm:text-2xl font-black text-zinc-900">{stats.totalWeeks.toLocaleString('pt-BR')}</div>
              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mt-1">Semanas</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
              <div className="text-xl sm:text-2xl font-black text-zinc-900">{stats.totalHours.toLocaleString('pt-BR')}</div>
              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mt-1">Horas</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
              <div className="text-xl sm:text-2xl font-black text-zinc-900">{stats.totalMinutes.toLocaleString('pt-BR')}</div>
              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mt-1">Minutos</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-red-50 text-red-700 border border-red-200 rounded-2xl text-center text-xs font-bold">
          A data de nascimento deve ser anterior à data de referência.
        </div>
      )}
    </div>
  );
}
