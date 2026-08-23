'use client';
// B09 · CIERRE — comparación B00/B09 y Producto C.
import Link from 'next/link';
import {
  blameOptions, blameQuestion, closingIntegration, closingSynthesis, confidenceLevels,
  finalStatement, finalSubtitle, productCPrompts, type BlameOption, type ConfidenceLevel,
} from '@/content/class1/activities';
import { class1Meta } from '@/content/class1/manifest';
import { useClass1, useVisitBlock } from '@/lib/class1/store';
import { Callout, ChoiceGroup, CommitGate, Field, Prose, Statement } from '../ui';
import { ConceptLink } from '../ConceptPanel';

function labelOf(id: BlameOption | null): string {
  return blameOptions.find(o => o.id === id)?.label ?? '—';
}

export function B09() {
  useVisitBlock('b09');
  const { state, update, hydrated } = useClass1();
  const before = state.b00;
  const s = state.b09;

  const moved = before.committed && s.committed && before.blame !== s.blame;
  const confidenceMoved =
    before.committed && s.committed && before.confidence !== s.confidence;

  return (
    <>
      {!before.committed && (
        <Callout kind="alerta">
          <p>
            No registraste tu respuesta inicial en B00, así que no hay comparación posible. Puedes
            responder ahora igualmente, pero el ejercicio pierde su parte más útil.{' '}
            <Link href="/clase-1/b00" className="underline underline-offset-2">Ir a B00</Link>
          </p>
        </Callout>
      )}

      <section aria-labelledby="espejo" className="space-y-4 rounded-xl border border-cyan-500/20 bg-cyan-500/[0.04] p-4 sm:p-5">
        <h2 id="espejo" className="text-lg font-bold text-white">Volvamos a la primera pregunta</h2>
        <p className="text-sm leading-relaxed text-zinc-300">{blameQuestion}</p>

        <ChoiceGroup
          legend="¿Dónde está el fallo, ahora?"
          options={blameOptions.map(o => ({ id: o.id, label: o.label, hint: o.hint }))}
          value={s.blame}
          onChange={id => update(d => ({ ...d, b09: { ...d.b09, blame: id as BlameOption } }))}
          disabled={s.committed || !hydrated}
        />

        <ChoiceGroup
          legend="¿Qué tan seguro estás ahora?"
          options={confidenceLevels.map(c => ({ id: c.id, label: c.label }))}
          value={s.confidence}
          onChange={id => update(d => ({ ...d, b09: { ...d.b09, confidence: id as ConfidenceLevel } }))}
          disabled={s.committed || !hydrated}
          columns={3}
        />

        <CommitGate
          committed={s.committed}
          canCommit={Boolean(s.blame && s.confidence)}
          onCommit={() =>
            update(d => ({ ...d, b09: { ...d.b09, committed: true, at: new Date().toISOString() } }))
          }
          label="Registrar mi respuesta final"
          lockedNote="Respuesta final registrada."
        >
          {before.committed && (
            <div className="grid gap-2.5 sm:grid-cols-2">
              <div className="rounded-xl border border-white/[0.10] bg-white/[0.02] p-3.5">
                <div className="mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">Antes · 15:03</div>
                <p className="mt-1.5 text-sm font-semibold text-zinc-300">{labelOf(before.blame)}</p>
                <p className="mt-0.5 text-xs text-zinc-500">Confianza: {before.confidence ?? '—'}</p>
              </div>
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/[0.06] p-3.5">
                <div className="mono text-[10px] font-bold uppercase tracking-widest text-cyan-400">Ahora · 16:25</div>
                <p className="mt-1.5 text-sm font-semibold text-white">{labelOf(s.blame)}</p>
                <p className="mt-0.5 text-xs text-zinc-400">Confianza: {s.confidence ?? '—'}</p>
              </div>
            </div>
          )}

          {before.committed && (
            <p className="text-sm text-zinc-400">
              {moved
                ? 'Tu respuesta se movió. Lo interesante no es hacia qué casilla: es que ahora puedes decir en qué punto exacto del proceso se rompió.'
                : confidenceMoved
                  ? 'Mantuviste la respuesta y cambió tu confianza. También es un desplazamiento: sabes mejor por qué lo crees.'
                  : 'Mantuviste tu respuesta. Está bien: probablemente ya venías con la intuición correcta. Lo que cambió, si cambió algo, es que ahora puedes fundamentarla.'}
            </p>
          )}
        </CommitGate>
      </section>

      {s.committed && (
        <>
          <section aria-labelledby="integracion" className="space-y-3">
            <h2 id="integracion" className="text-lg font-bold text-white">La respuesta completa</h2>
            <ol className="space-y-2">
              {closingIntegration.map((line, i) => (
                <li key={i} className="flex items-start gap-3 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5">
                  <span className="mono mt-0.5 shrink-0 text-[11px] font-bold text-cyan-400">{i + 1}</span>
                  <span className="text-sm leading-relaxed text-zinc-300">{line}</span>
                </li>
              ))}
            </ol>
            <Callout kind="idea">
              <p>{closingSynthesis}</p>
            </Callout>
          </section>

          <section aria-labelledby="flujo">
            <h2 id="flujo" className="mb-3 text-lg font-bold text-white">El flujo que te llevas</h2>
            <ol className="flex flex-wrap items-center gap-1.5">
              {class1Meta.flow.map((step, i) => (
                <li key={step} className="flex items-center gap-1.5">
                  <span
                    className={`mono rounded border px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider ${
                      i === class1Meta.flow.length - 1
                        ? 'border-cyan-500/45 bg-cyan-500/15 text-cyan-300'
                        : 'border-white/[0.12] bg-white/[0.03] text-zinc-400'
                    }`}
                  >
                    {step}
                  </span>
                  {i < class1Meta.flow.length - 1 && <span aria-hidden className="text-zinc-700">→</span>}
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="reglas">
            <h2 id="reglas" className="mb-3 text-lg font-bold text-white">Tres reglas para salir de la sala</h2>
            <ol className="space-y-2">
              {class1Meta.rules.map((r, i) => (
                <li key={r} className="flex items-start gap-3.5 rounded-xl border border-white/[0.10] bg-white/[0.02] p-3.5">
                  <span className="mono flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-sm font-bold text-cyan-400">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium leading-snug text-zinc-200">{r}</span>
                </li>
              ))}
            </ol>
          </section>
        </>
      )}

      <section aria-labelledby="producto-c" className="space-y-4 rounded-xl border border-indigo-500/25 bg-indigo-500/[0.04] p-4 sm:p-5">
        <div>
          <div className="mono text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-300">
            Producto C · hito de tu Bitácora
          </div>
          <h2 id="producto-c" className="mt-1 text-lg font-bold text-white">Qué cambió en tu razonamiento</h2>
        </div>
        <Field
          label={productCPrompts.before}
          value={s.before}
          onChange={v => update(d => ({ ...d, b09: { ...d.b09, before: v } }))}
          rows={2}
        />
        <Field
          label={productCPrompts.after}
          value={s.after}
          onChange={v => update(d => ({ ...d, b09: { ...d.b09, after: v } }))}
          rows={2}
        />
        <Field
          label={productCPrompts.doubt}
          value={s.doubt}
          onChange={v => update(d => ({ ...d, b09: { ...d.b09, doubt: v } }))}
          rows={2}
        />
      </section>

      <Prose>
        <p>
          Cuando un escrito llega a un tribunal, el tribunal no cita a declarar al modelo. No hay
          comparecencia del sistema ni un representante del proveedor explicando por qué esa
          referencia salió así. Hay un abogado, con nombre, matrícula y un deber de buena fe procesal,{' '}
          <ConceptLink id="responsabilidad">respondiendo por lo que firmó</ConceptLink>.
        </p>
      </Prose>

      <Statement tone="accent" caption={finalSubtitle}>{finalStatement}</Statement>

      <div className="flex justify-center">
        <Link
          href="/clase-1/mi-trabajo"
          className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/15 px-5 py-3 text-sm font-semibold text-cyan-200 transition-colors hover:bg-cyan-500/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
        >
          Cerrar mi Bitácora y generar el PDF
        </Link>
      </div>
    </>
  );
}
