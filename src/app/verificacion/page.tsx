'use client';
// ─────────────────────────────────────────────────────────────────────────────
// Verificación — cazador de alucinaciones y matriz de verificación.
//
// Todo ocurre en el navegador. Nada se envía a ningún servidor y el estado se
// guarda en localStorage, de modo que un equipo puede cerrar la pestaña sin
// perder su trabajo y sin que exista una cuenta de por medio.
// ─────────────────────────────────────────────────────────────────────────────
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, RotateCcw, Printer, Download, Check, X, ArrowRight } from 'lucide-react';

import {
  huntClaims, huntIntro, huntFeedback, verdictLabels, verdictHelp, verdictColors, matrixColumns,
} from '@/data/labs';
import { verificationProtocol, huntRule, privacyNotice } from '@/data/pedagogy';
import { peerChecklist } from '@/data/assessment';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { downloadBlob } from '@/lib/utils';
import type { ClaimVerdict } from '@/lib/types';
import { Shell, SectionHead, Panel, PrivacyNote, accents, type AccentName } from '@/components/common/Page';

const VERDICTS: ClaimVerdict[] = ['verificada', 'falsa', 'dudosa', 'sin-fuente', 'inferencia'];

type Tab = 'cazador' | 'matriz';

export default function VerificacionPage() {
  const [tab, setTab] = useState<Tab>('cazador');

  return (
    <div className="py-8 sm:py-12">
      <Shell>
        <header className="mb-8">
          <div className="mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 mb-2">
            Sesión 1 · minutos 62–82
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            Verificación
          </h1>
          <p className="mt-3 text-base text-zinc-400 leading-relaxed max-w-3xl">
            Dos herramientas para el mismo hábito: distinguir lo que una respuesta afirma de lo
            que una respuesta puede respaldar.
          </p>
          <p className="mt-4 rounded-lg border border-cyan-500/30 bg-cyan-500/5 px-4 py-3 text-base font-medium text-cyan-200">
            {huntRule}
          </p>
        </header>

        <div className="mb-8 flex gap-1.5" role="tablist" aria-label="Herramientas de verificación">
          {([['cazador', 'Cazador de alucinaciones'], ['matriz', 'Matriz de verificación']] as const).map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                tab === id
                  ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                  : 'border-white/[0.1] text-zinc-400 hover:bg-white/[0.04]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'cazador' ? <Hunter /> : <Matrix />}

        <section className="mt-16">
          <SectionHead
            kicker="El protocolo" title="Identificar · contrastar · justificar · registrar"
            lead="Cuatro pasos que caben en un margen de página y que ordenan cualquier revisión."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {verificationProtocol.map((p, i) => (
              <Panel key={p.step} className="p-4">
                <div className="mono text-[10px] font-bold text-cyan-400 mb-1.5">
                  {String(i + 1).padStart(2, '0')} · {p.step.toUpperCase()}
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">{p.action}</p>
                <p className="mt-2 text-xs text-rose-300/70 leading-relaxed">
                  <span className="mono uppercase tracking-widest text-[9px] text-rose-400/70">Trampa: </span>
                  {p.trap}
                </p>
              </Panel>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <SectionHead
            kicker="Revisión entre pares" title="Cinco preguntas al trabajo del otro equipo"
            lead="Sesión 1, minutos 82–88. Se devuelve una observación concreta, no una impresión."
            accent="emerald"
          />
          <Panel accent="emerald" className="p-5">
            <ol className="space-y-2.5">
              {peerChecklist.map((q, i) => (
                <li key={q} className="flex gap-3 text-sm text-zinc-300 leading-relaxed">
                  <span className="mono text-xs font-bold text-emerald-400 shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {q}
                </li>
              ))}
            </ol>
          </Panel>
        </section>

        <div className="mt-10">
          <PrivacyNote text={privacyNotice} />
        </div>

        <nav className="mt-8 flex flex-wrap gap-2.5">
          <Link href="/sesiones/1" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:underline">
            Volver a la sesión 1 <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
          <Link href="/prompt-lab" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:underline">
            Prompt Lab <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        </nav>
      </Shell>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Cazador de alucinaciones
// ─────────────────────────────────────────────────────────────────────────────
function Hunter() {
  const [answers, setAnswers] = useLocalStorage<Record<string, ClaimVerdict | undefined>>(
    'diat.hunt.v1', {},
  );
  const [checked, setChecked] = useState(false);

  const answeredCount = huntClaims.filter(c => answers[c.id]).length;
  const correctCount = huntClaims.filter(c => answers[c.id] === c.answer).length;
  const allAnswered = answeredCount === huntClaims.length;

  const feedback = useMemo(() => {
    const ratio = correctCount / huntClaims.length;
    if (ratio === 1) return huntFeedback.perfect;
    if (ratio >= 0.7) return huntFeedback.good;
    return huntFeedback.needsWork;
  }, [correctCount]);

  function pick(id: string, v: ClaimVerdict) {
    setAnswers({ ...answers, [id]: v });
  }

  function reset() {
    setAnswers({});
    setChecked(false);
  }

  return (
    <section>
      <Panel accent="amber" className="p-5 mb-6">
        <div className="mono text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-2">
          Caso {huntIntro.caseCode} · respuesta bajo examen
        </div>
        <p className="text-sm text-zinc-300 leading-relaxed">
          <span className="text-zinc-500">Pregunta formulada: </span>{huntIntro.question}
        </p>
        <p className="mt-3 text-xs text-amber-200/70 leading-relaxed">{huntIntro.disclaimer}</p>
      </Panel>

      <p className="text-sm text-zinc-400 mb-5 leading-relaxed">{huntIntro.instruction}</p>

      <div className="mb-6 grid gap-2 sm:grid-cols-5">
        {VERDICTS.map(v => {
          const a = accents[verdictColors[v] as AccentName];
          return (
            <div key={v} className={`rounded-lg border ${a.border} ${a.bgSoft} p-2.5`}>
              <div className={`mono text-[10px] font-bold uppercase tracking-widest ${a.text} mb-1`}>
                {verdictLabels[v]}
              </div>
              <p className="text-[11px] text-zinc-500 leading-snug">{verdictHelp[v]}</p>
            </div>
          );
        })}
      </div>

      <ol className="space-y-3">
        {huntClaims.map((claim, i) => {
          const chosen = answers[claim.id];
          const isRight = chosen === claim.answer;
          return (
            <li key={claim.id}>
              <Panel
                className={`p-4 sm:p-5 ${
                  checked ? (isRight ? 'border-emerald-500/30' : 'border-rose-500/30') : ''
                }`}
              >
                <fieldset>
                  <legend className="sr-only">Afirmación {i + 1}</legend>
                  <div className="flex items-start gap-3">
                    <span className="mono text-xs font-bold text-zinc-600 shrink-0 mt-1">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-sm text-zinc-200 leading-relaxed flex-1">{claim.text}</p>
                    {checked && (
                      <span className="shrink-0 mt-0.5" aria-label={isRight ? 'Correcta' : 'Incorrecta'}>
                        {isRight
                          ? <Check className="w-4 h-4 text-emerald-400" aria-hidden />
                          : <X className="w-4 h-4 text-rose-400" aria-hidden />}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {VERDICTS.map(v => {
                      const a = accents[verdictColors[v] as AccentName];
                      const active = chosen === v;
                      const isAnswer = checked && v === claim.answer;
                      return (
                        <button
                          key={v}
                          type="button"
                          aria-pressed={active}
                          onClick={() => pick(claim.id, v)}
                          className={`mono text-[11px] font-bold px-2.5 py-1.5 rounded border transition ${
                            active
                              ? `${a.borderStrong} ${a.bg} ${a.text}`
                              : isAnswer
                                ? 'border-emerald-500/50 text-emerald-400'
                                : 'border-white/[0.1] text-zinc-500 hover:bg-white/[0.04]'
                          }`}
                        >
                          {verdictLabels[v]}
                          {isAnswer && !active && <span className="ml-1 text-[9px]">← era esta</span>}
                        </button>
                      );
                    })}
                  </div>

                  {checked && (
                    <p className="mt-3 text-xs text-zinc-400 leading-relaxed border-l-2 border-white/10 pl-3">
                      {claim.why}
                    </p>
                  )}
                </fieldset>
              </Panel>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setChecked(true)}
          disabled={!allAnswered}
          className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-300 transition hover:brightness-125 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Check className="w-4 h-4" aria-hidden /> Revisar respuestas
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] px-4 py-2.5 text-sm font-semibold text-zinc-400 hover:bg-white/[0.04] transition"
        >
          <RotateCcw className="w-4 h-4" aria-hidden /> Reiniciar
        </button>
        <span className="mono text-xs text-zinc-500" aria-live="polite">
          {checked
            ? `${correctCount} de ${huntClaims.length} correctas`
            : `${answeredCount} de ${huntClaims.length} clasificadas`}
        </span>
      </div>

      {checked && (
        <Panel accent="cyan" className="mt-4 p-4">
          <p className="text-sm text-zinc-300 leading-relaxed">{feedback}</p>
        </Panel>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Matriz de verificación
// ─────────────────────────────────────────────────────────────────────────────
type MatrixRow = Record<string, string>;

const emptyRow = (): MatrixRow =>
  Object.fromEntries(matrixColumns.map(c => [c.key, ''] as const));

function Matrix() {
  const [rows, setRows] = useLocalStorage<MatrixRow[]>('diat.matrix.v1', [emptyRow()]);

  function update(i: number, key: string, value: string) {
    setRows(rows.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)));
  }
  function addRow() { setRows([...rows, emptyRow()]); }
  function removeRow(i: number) {
    setRows(rows.length === 1 ? [emptyRow()] : rows.filter((_, idx) => idx !== i));
  }
  function reset() { setRows([emptyRow()]); }

  function exportMarkdown() {
    const head = `| ${matrixColumns.map(c => c.label).join(' | ')} |`;
    const sep = `| ${matrixColumns.map(() => '---').join(' | ')} |`;
    const body = rows
      .map(r => `| ${matrixColumns.map(c => (r[c.key] || '—').replace(/\|/g, '\\|')).join(' | ')} |`)
      .join('\n');
    const md = [
      '# Matriz de verificación — Taller de Prompting Jurídico 3.0',
      '',
      'DIAT PUCV · 2026',
      '',
      head, sep, body,
      '',
      '_Completada en la plataforma del taller. Los datos nunca salieron de este navegador._',
    ].join('\n');
    downloadBlob(md, 'matriz-verificacion-DIAT.md', 'text/markdown;charset=utf-8');
  }

  const filled = rows.filter(r => r.afirmacion?.trim()).length;

  return (
    <section>
      <p className="text-sm text-zinc-400 mb-5 leading-relaxed">
        Una fila por afirmación. La columna «fuente real» es la que decide: si al buscarla no
        aparece, la afirmación no está verificada, por bien redactada que esté.
      </p>

      <div className="space-y-3">
        {rows.map((row, i) => (
          <Panel key={i} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Afirmación {String(i + 1).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => removeRow(i)}
                aria-label={`Eliminar la afirmación ${i + 1}`}
                className="rounded p-1.5 text-zinc-600 hover:text-rose-400 hover:bg-white/[0.04] transition"
              >
                <Trash2 className="w-4 h-4" aria-hidden />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {matrixColumns.map(col => (
                <div key={col.key} className={col.key === 'afirmacion' ? 'sm:col-span-2' : ''}>
                  <label
                    htmlFor={`m-${i}-${col.key}`}
                    className="block mono text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5"
                  >
                    {col.label}
                  </label>
                  <input
                    id={`m-${i}-${col.key}`}
                    type="text"
                    value={row[col.key] ?? ''}
                    onChange={e => update(i, col.key, e.target.value)}
                    placeholder={col.hint}
                    className="w-full rounded-lg border border-white/[0.1] bg-black/30 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-cyan-500/40"
                  />
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2.5 no-print">
        <button
          type="button" onClick={addRow}
          className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-300 hover:brightness-125 transition"
        >
          <Plus className="w-4 h-4" aria-hidden /> Añadir afirmación
        </button>
        <button
          type="button" onClick={exportMarkdown}
          className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] px-4 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-white/[0.04] transition"
        >
          <Download className="w-4 h-4" aria-hidden /> Descargar (.md)
        </button>
        <button
          type="button" onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] px-4 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-white/[0.04] transition"
        >
          <Printer className="w-4 h-4" aria-hidden /> Imprimir
        </button>
        <button
          type="button" onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] px-4 py-2.5 text-sm font-semibold text-zinc-400 hover:bg-white/[0.04] transition"
        >
          <RotateCcw className="w-4 h-4" aria-hidden /> Reiniciar
        </button>
        <span className="mono text-xs text-zinc-500" aria-live="polite">
          {filled} {filled === 1 ? 'afirmación registrada' : 'afirmaciones registradas'}
        </span>
      </div>

      <p className="mt-4 text-xs text-zinc-600 leading-relaxed">
        La matriz se guarda en este navegador. Nada se envía a ningún servidor y nadie más puede
        verla. Para la versión imprimible en blanco, descarga la ficha 02 desde{' '}
        <Link href="/materiales" className="text-cyan-400 hover:underline">Materiales</Link>.
      </p>
    </section>
  );
}
