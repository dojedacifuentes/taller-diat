'use client';
// ─────────────────────────────────────────────────────────────────────────────
// Flujo — constructor de flujos, reconstrucción del flujo defectuoso y registro
// de validación. Sesión 2.
//
// El constructor es deliberadamente simple: una lista ordenada de bloques con
// etiqueta. No es un editor gráfico de nodos y aristas, porque el objetivo no
// es aprender una herramienta sino ver que el trabajo tiene pasos revisables.
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import Link from 'next/link';
import {
  Plus, Trash2, RotateCcw, Download, ArrowUp, ArrowDown, ArrowRight, Check, Lightbulb,
} from 'lucide-react';

import {
  flowKindMeta, flowKindOrder, canonicalFlow, brokenFlow, validationFields,
} from '@/data/labs';
import { privacyNotice } from '@/data/pedagogy';
import { crossAudit } from '@/data/assessment';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { downloadBlob } from '@/lib/utils';
import type { FlowKind } from '@/lib/types';
import { Shell, SectionHead, Panel, PrivacyNote, accents, type AccentName } from '@/components/common/Page';

type Tab = 'constructor' | 'desordenado' | 'registro';

interface BuiltStep { id: string; kind: FlowKind; label: string }

export default function FlujoPage() {
  const [tab, setTab] = useState<Tab>('constructor');

  const tabs: [Tab, string][] = [
    ['constructor', 'Constructor de flujo'],
    ['desordenado', 'Flujo defectuoso'],
    ['registro', 'Registro de validación'],
  ];

  return (
    <div className="py-8 sm:py-12">
      <Shell>
        <header className="mb-8">
          <div className="mono text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-2">
            Sesión 2 · minutos 27–78
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            Del prompt al flujo
          </h1>
          <p className="mt-3 text-base text-zinc-400 leading-relaxed max-w-3xl">
            No se trata de preguntarle todo a la IA de una vez. Se trata de organizar el trabajo en
            pasos que puedan revisarse por separado.
          </p>
        </header>

        <div className="mb-8 flex flex-wrap gap-1.5" role="tablist" aria-label="Herramientas de flujo">
          {tabs.map(([id, label]) => (
            <button
              key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
              className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                tab === id
                  ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300'
                  : 'border-white/[0.1] text-zinc-400 hover:bg-white/[0.04]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'constructor' && <Builder />}
        {tab === 'desordenado' && <BrokenFlow />}
        {tab === 'registro' && <ValidationLog />}

        <section className="mt-16">
          <SectionHead
            kicker="Auditoría cruzada" title="El equipo A audita el flujo del equipo B"
            lead={crossAudit.instruction} accent="emerald"
          />
          <Panel accent="emerald" className="p-5">
            <ol className="space-y-2.5">
              {crossAudit.questions.map((q, i) => (
                <li key={q} className="flex gap-3 text-sm text-zinc-300 leading-relaxed">
                  <span className="mono text-xs font-bold text-emerald-400 shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {q}
                </li>
              ))}
            </ol>
            <p className="mt-4 pt-4 border-t border-white/[0.08] text-xs text-zinc-500 leading-relaxed">
              <span className="mono uppercase tracking-widest text-[9px] text-emerald-400/70">Se entrega: </span>
              {crossAudit.deliverable}
            </p>
          </Panel>
        </section>

        <div className="mt-10">
          <PrivacyNote text={privacyNotice} />
        </div>

        <nav className="mt-8 flex flex-wrap gap-4">
          <Link href="/sesiones/2" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:underline">
            Volver a la sesión 2 <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
          <Link href="/verificacion" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:underline">
            Verificación <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        </nav>
      </Shell>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Constructor
// ─────────────────────────────────────────────────────────────────────────────
function Builder() {
  const [steps, setSteps] = useLocalStorage<BuiltStep[]>('diat.flow.v1', []);

  function add(kind: FlowKind) {
    let suffix = steps.length;
    let id = `${kind}-${suffix}`;
    while (steps.some(step => step.id === id)) {
      suffix += 1;
      id = `${kind}-${suffix}`;
    }
    setSteps([...steps, { id, kind, label: '' }]);
  }
  function update(id: string, label: string) {
    setSteps(steps.map(s => (s.id === id ? { ...s, label } : s)));
  }
  function remove(id: string) { setSteps(steps.filter(s => s.id !== id)); }
  function move(index: number, delta: number) {
    const next = [...steps];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setSteps(next);
  }
  function loadExample() {
    setSteps(canonicalFlow.map((s, i) => ({ id: `ex-${i}`, kind: s.kind, label: s.label })));
  }

  const hasControl = steps.some(s => s.kind === 'control');
  const hasFuente = steps.some(s => s.kind === 'fuente');
  const hasRegistro = steps.some(s => s.kind === 'registro');

  function exportMarkdown() {
    const md = [
      '# Flujo jurídico asistido — Taller de Prompting Jurídico 3.0',
      '', 'DIAT PUCV · 2026', '',
      ...steps.map((s, i) => `${i + 1}. **${flowKindMeta[s.kind].label}** — ${s.label || '(sin describir)'}`),
      '',
      '## Comprobaciones',
      `- Fuente autorizada declarada: ${hasFuente ? 'sí' : 'NO'}`,
      `- Control humano explícito: ${hasControl ? 'sí' : 'NO'}`,
      `- Registro del paso: ${hasRegistro ? 'sí' : 'NO'}`,
    ].join('\n');
    downloadBlob(md, 'flujo-juridico-DIAT.md', 'text/markdown;charset=utf-8');
  }

  return (
    <section>
      <p className="text-sm text-zinc-400 mb-5 leading-relaxed">
        Añade bloques y descríbelos en una línea. Un flujo sin fuente y sin control humano no es un
        flujo: es una respuesta larga partida en trozos.
      </p>

      <div className="mb-6">
        <div className="mono text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2.5">
          Añadir bloque
        </div>
        <div className="flex flex-wrap gap-2">
          {flowKindOrder.map(kind => {
            const meta = flowKindMeta[kind];
            const a = accents[meta.color as AccentName];
            return (
              <button
                key={kind} type="button" onClick={() => add(kind)}
                title={meta.hint}
                className={`inline-flex items-center gap-1.5 rounded-lg border ${a.border} ${a.bgSoft} px-3 py-2 text-xs font-semibold ${a.text} hover:brightness-125 transition`}
              >
                <Plus className="w-3.5 h-3.5" aria-hidden /> {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      {steps.length === 0 ? (
        <Panel className="p-8 text-center">
          <p className="text-sm text-zinc-500 mb-4">Todavía no hay bloques.</p>
          <button
            type="button" onClick={loadExample}
            className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-4 py-2.5 text-sm font-semibold text-indigo-300 hover:brightness-125 transition"
          >
            <Lightbulb className="w-4 h-4" aria-hidden /> Cargar el flujo de ejemplo
          </button>
        </Panel>
      ) : (
        <ol className="space-y-2.5">
          {steps.map((step, i) => {
            const meta = flowKindMeta[step.kind];
            const a = accents[meta.color as AccentName];
            return (
              <li key={step.id}>
                <Panel className="p-3.5">
                  <div className="flex items-start gap-3">
                    <div className={`shrink-0 rounded-lg border ${a.border} ${a.bgSoft} px-2.5 py-1.5 min-w-[7.5rem]`}>
                      <div className={`mono text-[9px] font-bold uppercase tracking-widest ${a.text}`}>
                        {String(i + 1).padStart(2, '0')} · {meta.label}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <label htmlFor={`f-${step.id}`} className="sr-only">{meta.hint}</label>
                      <input
                        id={`f-${step.id}`}
                        type="text"
                        value={step.label}
                        onChange={e => update(step.id, e.target.value)}
                        placeholder={meta.hint}
                        className="w-full rounded-lg border border-white/[0.1] bg-black/30 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-indigo-500/40"
                      />
                    </div>

                    <div className="flex shrink-0 gap-0.5">
                      <button
                        type="button" onClick={() => move(i, -1)} disabled={i === 0}
                        aria-label={`Subir el bloque ${i + 1}`}
                        className="rounded p-1.5 text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.04] disabled:opacity-25 transition"
                      >
                        <ArrowUp className="w-4 h-4" aria-hidden />
                      </button>
                      <button
                        type="button" onClick={() => move(i, 1)} disabled={i === steps.length - 1}
                        aria-label={`Bajar el bloque ${i + 1}`}
                        className="rounded p-1.5 text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.04] disabled:opacity-25 transition"
                      >
                        <ArrowDown className="w-4 h-4" aria-hidden />
                      </button>
                      <button
                        type="button" onClick={() => remove(step.id)}
                        aria-label={`Eliminar el bloque ${i + 1}`}
                        className="rounded p-1.5 text-zinc-600 hover:text-rose-400 hover:bg-white/[0.04] transition"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden />
                      </button>
                    </div>
                  </div>
                </Panel>
              </li>
            );
          })}
        </ol>
      )}

      {steps.length > 0 && (
        <>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            <Check3 ok={hasFuente} label="Fuente autorizada declarada" />
            <Check3 ok={hasControl} label="Control humano explícito" />
            <Check3 ok={hasRegistro} label="El paso queda registrado" />
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              type="button" onClick={exportMarkdown}
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] px-4 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-white/[0.04] transition"
            >
              <Download className="w-4 h-4" aria-hidden /> Descargar (.md)
            </button>
            <button
              type="button" onClick={() => setSteps([])}
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] px-4 py-2.5 text-sm font-semibold text-zinc-400 hover:bg-white/[0.04] transition"
            >
              <RotateCcw className="w-4 h-4" aria-hidden /> Vaciar
            </button>
          </div>
        </>
      )}
    </section>
  );
}

function Check3({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-xs ${
        ok ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300' : 'border-amber-500/30 bg-amber-500/5 text-amber-300'
      }`}
    >
      <span aria-hidden>{ok ? '✓' : '!'}</span>
      <span>{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Flujo defectuoso
// ─────────────────────────────────────────────────────────────────────────────
function BrokenFlow() {
  const [order, setOrder] = useState(() => brokenFlow.steps.map(s => s.id));
  const [checked, setChecked] = useState(false);

  const byId: Record<string, (typeof brokenFlow.steps)[number]> =
    Object.fromEntries(brokenFlow.steps.map(s => [s.id, s] as const));

  function move(index: number, delta: number) {
    const next = [...order];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
    setChecked(false);
  }

  const correctCount = order.filter((id, i) => byId[id].correctPosition === i + 1).length;
  const allCorrect = correctCount === order.length;

  return (
    <section>
      <p className="text-sm text-zinc-400 mb-5 leading-relaxed">{brokenFlow.instruction}</p>

      <ol className="space-y-2">
        {order.map((id, i) => {
          const step = byId[id];
          const right = checked && step.correctPosition === i + 1;
          const wrong = checked && step.correctPosition !== i + 1;
          return (
            <li key={id}>
              <Panel className={`p-3.5 ${right ? 'border-emerald-500/30' : wrong ? 'border-rose-500/30' : ''}`}>
                <div className="flex items-center gap-3">
                  <span className="mono text-xs font-bold text-zinc-600 shrink-0 w-6">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="flex-1 text-sm text-zinc-200 leading-relaxed">{step.text}</p>
                  {checked && (
                    <span className={`mono text-[10px] shrink-0 ${right ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {right ? '✓' : `→ ${step.correctPosition}`}
                    </span>
                  )}
                  <div className="flex shrink-0 gap-0.5">
                    <button
                      type="button" onClick={() => move(i, -1)} disabled={i === 0}
                      aria-label={`Subir el paso ${i + 1}`}
                      className="rounded p-1.5 text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.04] disabled:opacity-25 transition"
                    >
                      <ArrowUp className="w-4 h-4" aria-hidden />
                    </button>
                    <button
                      type="button" onClick={() => move(i, 1)} disabled={i === order.length - 1}
                      aria-label={`Bajar el paso ${i + 1}`}
                      className="rounded p-1.5 text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.04] disabled:opacity-25 transition"
                    >
                      <ArrowDown className="w-4 h-4" aria-hidden />
                    </button>
                  </div>
                </div>
              </Panel>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button" onClick={() => setChecked(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-4 py-2.5 text-sm font-semibold text-indigo-300 hover:brightness-125 transition"
        >
          <Check className="w-4 h-4" aria-hidden /> Comprobar el orden
        </button>
        {checked && (
          <span className="mono text-xs text-zinc-500" aria-live="polite">
            {correctCount} de {order.length} en su posición
          </span>
        )}
      </div>

      {checked && (
        <Panel accent={allCorrect ? 'emerald' : 'amber'} className="mt-5 p-5">
          <div className={`mono text-[10px] font-bold uppercase tracking-widest mb-3 ${allCorrect ? 'text-emerald-400' : 'text-amber-400'}`}>
            {allCorrect ? 'Orden correcto — y sin embargo' : 'Aún hay pasos fuera de lugar — y además'}
          </div>
          <p className="text-sm text-zinc-300 mb-3 leading-relaxed">
            Este flujo tiene dos defectos que ningún reordenamiento arregla:
          </p>
          <ul className="space-y-2.5">
            {brokenFlow.hiddenDefects.map(d => (
              <li key={d} className="flex gap-2.5 text-sm text-zinc-400 leading-relaxed">
                <span aria-hidden className="text-rose-400 shrink-0">·</span>{d}
              </li>
            ))}
          </ul>
          <p className="mt-4 pt-4 border-t border-white/[0.08] text-sm text-white font-medium">
            {brokenFlow.discussion}
          </p>
        </Panel>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Registro de validación
// ─────────────────────────────────────────────────────────────────────────────
type LogEntry = Record<string, string>;

const emptyEntry = (): LogEntry => Object.fromEntries(validationFields.map(f => [f.key, ''] as const));

function ValidationLog() {
  const [entries, setEntries] = useLocalStorage<LogEntry[]>('diat.log.v1', [emptyEntry()]);

  function update(i: number, key: string, value: string) {
    setEntries(entries.map((e, idx) => (idx === i ? { ...e, [key]: value } : e)));
  }

  function exportMarkdown() {
    const md = [
      '# Registro de validación — Taller de Prompting Jurídico 3.0',
      '', 'DIAT PUCV · 2026', '',
      ...entries.flatMap((e, i) => [
        `## Entrada ${i + 1}`,
        '',
        ...validationFields.map(f => `- **${f.label}:** ${e[f.key] || '—'}`),
        '',
      ]),
    ].join('\n');
    downloadBlob(md, 'registro-validacion-DIAT.md', 'text/markdown;charset=utf-8');
  }

  return (
    <section>
      <p className="text-sm text-zinc-400 mb-5 leading-relaxed">
        Una entrada por paso ejecutado. El registro es el producto de la sesión 2: sin él, el
        resultado no se puede explicar a nadie más.
      </p>

      <div className="space-y-3">
        {entries.map((entry, i) => (
          <Panel key={i} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Entrada {String(i + 1).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => setEntries(entries.length === 1 ? [emptyEntry()] : entries.filter((_, idx) => idx !== i))}
                aria-label={`Eliminar la entrada ${i + 1}`}
                className="rounded p-1.5 text-zinc-600 hover:text-rose-400 hover:bg-white/[0.04] transition"
              >
                <Trash2 className="w-4 h-4" aria-hidden />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {validationFields.map(f => (
                <div key={f.key}>
                  <label
                    htmlFor={`v-${i}-${f.key}`}
                    className="block mono text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5"
                  >
                    {f.label}
                  </label>
                  <input
                    id={`v-${i}-${f.key}`}
                    type="text"
                    value={entry[f.key] ?? ''}
                    onChange={e => update(i, f.key, e.target.value)}
                    placeholder={f.example}
                    className="w-full rounded-lg border border-white/[0.1] bg-black/30 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-indigo-500/40"
                  />
                  <p className="mt-1 text-[11px] text-zinc-600 leading-snug">{f.hint}</p>
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2.5">
        <button
          type="button" onClick={() => setEntries([...entries, emptyEntry()])}
          className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-4 py-2.5 text-sm font-semibold text-indigo-300 hover:brightness-125 transition"
        >
          <Plus className="w-4 h-4" aria-hidden /> Añadir entrada
        </button>
        <button
          type="button" onClick={exportMarkdown}
          className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] px-4 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-white/[0.04] transition"
        >
          <Download className="w-4 h-4" aria-hidden /> Descargar (.md)
        </button>
        <button
          type="button" onClick={() => setEntries([emptyEntry()])}
          className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] px-4 py-2.5 text-sm font-semibold text-zinc-400 hover:bg-white/[0.04] transition"
        >
          <RotateCcw className="w-4 h-4" aria-hidden /> Reiniciar
        </button>
      </div>
    </section>
  );
}
