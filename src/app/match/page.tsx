'use client';
// ─────────────────────────────────────────────────────────────────────────────
// Match Making — ficha de desafío, temporizador de pitch y rúbrica. Sesión 3.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Play, Pause, RotateCcw, Download, ArrowRight, Users, Timer } from 'lucide-react';

import { challengeFields, challengeRule, translationExample, pitchSpec } from '@/data/labs';
import { privacyNotice } from '@/data/pedagogy';
import { rubric, rubricLevelOrder } from '@/data/assessment';
import { planFor } from '@/data/sessionPlan';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { downloadBlob } from '@/lib/utils';
import { Shell, SectionHead, Panel, PrivacyNote, TableScroll } from '@/components/common/Page';

type Tab = 'ficha' | 'pitch' | 'rubrica';

export default function MatchPage() {
  const [tab, setTab] = useState<Tab>('ficha');

  const tabs: [Tab, string][] = [
    ['ficha', 'Ficha de desafío'],
    ['pitch', 'Temporizador de pitch'],
    ['rubrica', 'Rúbrica'],
  ];

  return (
    <div className="py-8 sm:py-12">
      <Shell>
        <header className="mb-8">
          <div className="mono text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400 mb-2">
            Sesión 3 · minutos 26–87
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            Match Making
          </h1>
          <p className="mt-3 text-base text-zinc-400 leading-relaxed max-w-3xl">
            Derecho no viene a programar y la contraparte técnica no viene a decidir qué es
            jurídicamente correcto. El aprendizaje está justo en la traducción entre ambos.
          </p>
        </header>

        <div className="mb-8 grid gap-3 sm:grid-cols-2">
          <Panel accent="rose" className="p-4">
            <div className="mono text-[10px] font-bold uppercase tracking-widest text-rose-400 mb-2">No sirve</div>
            <p className="text-sm text-zinc-200 leading-snug">«{translationExample.bad}»</p>
          </Panel>
          <Panel accent="emerald" className="p-4">
            <div className="mono text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-2">Sí sirve</div>
            <p className="text-sm text-zinc-200 leading-snug">«{translationExample.good}»</p>
          </Panel>
        </div>

        <div className="mb-8 flex flex-wrap gap-1.5" role="tablist" aria-label="Herramientas de Match Making">
          {tabs.map(([id, label]) => (
            <button
              key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
              className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                tab === id
                  ? 'border-purple-500/40 bg-purple-500/10 text-purple-300'
                  : 'border-white/[0.1] text-zinc-400 hover:bg-white/[0.04]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'ficha' && <ChallengeCanvas />}
        {tab === 'pitch' && <PitchTimer />}
        {tab === 'rubrica' && <RubricTable />}

        <section className="mt-16">
          <SectionHead
            kicker="Formato de sala" title="El pitch se organiza según cuántos equipos haya"
            lead="El pitch individual siempre dura cuatro minutos. Lo que cambia es cómo se reparte la sala."
            accent="amber"
          />
          <div className="space-y-2.5">
            {planFor(3).contingencies.filter(c => c.when.includes('equipos')).map(c => (
              <Panel key={c.when} className="p-4">
                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden />
                  <div>
                    <h3 className="text-sm font-semibold text-amber-200/90">{c.when}</h3>
                    <p className="text-sm text-zinc-400 mt-1 leading-relaxed">{c.then}</p>
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        </section>

        <div className="mt-10">
          <PrivacyNote text={privacyNotice} />
        </div>

        <nav className="mt-8 flex flex-wrap gap-4">
          <Link href="/sesiones/3" className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:underline">
            Volver a la sesión 3 <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
          <Link href="/flujo" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:underline">
            Constructor de flujos <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        </nav>
      </Shell>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Ficha de desafío
// ─────────────────────────────────────────────────────────────────────────────
function ChallengeCanvas() {
  const [values, setValues] = useLocalStorage<Record<string, string>>('diat.challenge.v1', {});

  const completed = challengeFields.filter(f => (values[f.key] ?? '').trim().length > 0).length;
  const limitsDeclared = (values.noDebe ?? '').trim().length > 0;

  function exportMarkdown() {
    const md = [
      `# ${values.nombre || 'Ficha de desafío'} — Match Making`,
      '', 'Taller de Prompting Jurídico 3.0 · DIAT PUCV · 2026', '',
      ...challengeFields.map(f => `## ${String(f.n).padStart(2, '0')} · ${f.label}\n\n${values[f.key] || '_(pendiente)_'}\n`),
    ].join('\n');
    downloadBlob(md, 'ficha-desafio-DIAT.md', 'text/markdown;charset=utf-8');
  }

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">{challengeRule}</p>
        <span className="mono text-xs text-zinc-500 shrink-0" aria-live="polite">
          {completed} / {challengeFields.length} campos
        </span>
      </div>

      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full bg-purple-500 transition-all"
          style={{ width: `${(completed / challengeFields.length) * 100}%` }}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {challengeFields.map(f => {
          const isLimits = f.key === 'noDebe';
          return (
            <Panel
              key={f.key}
              className={`p-4 ${isLimits ? 'sm:col-span-2 border-purple-500/30' : ''}`}
            >
              <label htmlFor={`c-${f.key}`} className="block mb-1.5">
                <span className={`mono text-[10px] font-bold uppercase tracking-widest ${isLimits ? 'text-purple-400' : 'text-zinc-500'}`}>
                  {String(f.n).padStart(2, '0')} · {f.label}
                </span>
                <span className="block text-sm text-zinc-300 mt-1">{f.question}</span>
              </label>
              <textarea
                id={`c-${f.key}`}
                rows={2}
                value={values[f.key] ?? ''}
                onChange={e => setValues({ ...values, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                className="w-full rounded-lg border border-white/[0.1] bg-black/30 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-purple-500/40 resize-y"
              />
              <p className="mt-1.5 text-[11px] text-zinc-600 leading-snug">{f.hint}</p>
            </Panel>
          );
        })}
      </div>

      {!limitsDeclared && (
        <div className="mt-4 rounded-lg border border-purple-500/25 bg-purple-500/[0.06] px-4 py-3">
          <p className="text-xs text-purple-200/80 leading-relaxed">
            El campo 12 —lo que la solución NO debe hacer— está vacío. Mientras siga así, la ficha
            no está terminada: es el campo que impide que el equipo prometa más de lo que puede
            sostener.
          </p>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2.5">
        <button
          type="button" onClick={exportMarkdown}
          className="inline-flex items-center gap-2 rounded-lg border border-purple-500/40 bg-purple-500/10 px-4 py-2.5 text-sm font-semibold text-purple-300 hover:brightness-125 transition"
        >
          <Download className="w-4 h-4" aria-hidden /> Descargar (.md)
        </button>
        <button
          type="button" onClick={() => setValues({})}
          className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] px-4 py-2.5 text-sm font-semibold text-zinc-400 hover:bg-white/[0.04] transition"
        >
          <RotateCcw className="w-4 h-4" aria-hidden /> Vaciar
        </button>
      </div>

      <p className="mt-4 text-xs text-zinc-600 leading-relaxed">
        La ficha se guarda solo en este navegador. Para la versión imprimible en blanco, descarga
        la ficha 06 desde <Link href="/materiales" className="text-purple-400 hover:underline">Materiales</Link>.
      </p>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Temporizador de pitch
// ─────────────────────────────────────────────────────────────────────────────
function PitchTimer() {
  const [remaining, setRemaining] = useState(pitchSpec.seconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  const pct = (remaining / pitchSpec.seconds) * 100;

  const tone =
    remaining === 0 ? 'text-rose-400'
      : remaining <= 60 ? 'text-amber-400'
        : 'text-purple-300';

  const barTone =
    remaining === 0 ? 'bg-rose-500'
      : remaining <= 60 ? 'bg-amber-500'
        : 'bg-purple-500';

  return (
    <section>
      <Panel className="p-6 sm:p-10 text-center">
        <div className="mono text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">
          Pitch de equipo
        </div>

        <div
          className={`mono text-6xl sm:text-8xl font-bold tabular-nums ${tone}`}
          role="timer"
          aria-live="off"
          aria-label={`Quedan ${mm} minutos y ${ss} segundos`}
        >
          {mm}:{ss}
        </div>

        <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div className={`h-full transition-all duration-1000 ${barTone}`} style={{ width: `${pct}%` }} />
        </div>

        <div className="mt-3 flex justify-between mono text-[10px] text-zinc-600">
          {pitchSpec.milestones.map(m => (
            <span key={m}>{Math.floor(m / 60)}:{String(m % 60).padStart(2, '0')}</span>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          <button
            type="button"
            onClick={() => setRunning(r => !r)}
            disabled={remaining === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-purple-500/40 bg-purple-500/10 px-5 py-3 text-sm font-semibold text-purple-300 hover:brightness-125 transition disabled:opacity-40"
          >
            {running
              ? <><Pause className="w-4 h-4" aria-hidden /> Pausar</>
              : <><Play className="w-4 h-4" aria-hidden /> Iniciar</>}
          </button>
          <button
            type="button"
            onClick={() => { setRunning(false); setRemaining(pitchSpec.seconds); }}
            className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] px-5 py-3 text-sm font-semibold text-zinc-400 hover:bg-white/[0.04] transition"
          >
            <RotateCcw className="w-4 h-4" aria-hidden /> Reiniciar
          </button>
        </div>

        <p className="mt-5 text-xs text-zinc-600">
          Sin sonido. El temporizador cambia de color a falta de un minuto y al llegar a cero.
        </p>
      </Panel>

      <div className="mt-6">
        <div className="mono text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">
          Cuatro minutos, cuatro cosas
        </div>
        <div className="space-y-2">
          {pitchSpec.structure.map(s => (
            <Panel key={s.at} className="p-3.5">
              <div className="flex items-start gap-4">
                <span className="mono text-xs font-bold text-purple-400 shrink-0 w-24">{s.at}</span>
                <span className="text-sm text-zinc-300 leading-relaxed">{s.say}</span>
              </div>
            </Panel>
          ))}
        </div>
        <p className="mt-4 flex items-start gap-2 text-sm text-zinc-400 leading-relaxed">
          <Timer className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" aria-hidden />
          {pitchSpec.rule}
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Rúbrica
// ─────────────────────────────────────────────────────────────────────────────
function RubricTable() {
  return (
    <section>
      <p className="text-sm text-zinc-400 mb-5 leading-relaxed">
        Los seis criterios y sus porcentajes vienen de la propuesta académica. Los cuatro niveles
        describen conductas observables en el material entregado, no impresiones generales.
      </p>

      <TableScroll>
        <table className="w-full min-w-[54rem] text-left border-collapse">
          <caption className="sr-only">
            Rúbrica de evaluación por criterio y nivel de logro
          </caption>
          <thead>
            <tr className="bg-white/[0.03]">
              <th scope="col" className="p-3 mono text-[10px] font-bold uppercase tracking-widest text-purple-400 w-56">
                Criterio
              </th>
              {rubricLevelOrder.map(l => (
                <th key={l} scope="col" className="p-3 mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  {l}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rubric.map(r => (
              <tr key={r.criterion} className="border-t border-white/[0.06] align-top">
                <th scope="row" className="p-3">
                  <span className="mono text-sm font-bold text-purple-400">{r.weight}%</span>
                  <span className="block text-xs text-zinc-300 font-medium mt-1 leading-snug">{r.criterion}</span>
                </th>
                {r.levels.map(l => (
                  <td key={l.level} className="p-3 text-xs text-zinc-400 leading-relaxed">
                    {l.descriptor}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </TableScroll>

      <p className="mt-4 text-xs text-zinc-600">
        Desliza la tabla en horizontal para ver los cuatro niveles.
      </p>
    </section>
  );
}
