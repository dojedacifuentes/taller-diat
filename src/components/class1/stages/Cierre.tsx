'use client';
// ─────────────────────────────────────────────────────────────────────────────
// ETAPA 5 · CIERRE
//
// La misma pregunta del principio, la comparación antes/ahora, una frase y la
// entrega. No se juzga si el estudiante «aprendió» ni se convierte en nota: el
// valor está en hacer visible el desplazamiento del razonamiento.
// ─────────────────────────────────────────────────────────────────────────────
import Link from 'next/link';
import {
  blameOptions, blameQuestion, confidenceLevels,
  type BlameOption, type ConfidenceLevel,
} from '@/content/class1/activities';
import { useClass1 } from '@/lib/class1/store';
import { ChipRadio, LockedNote, Notice, Panel, PrimaryButton, TextField } from '../ui';
import { Entrega } from '../Entrega';

function labelOf(id: BlameOption | null): string {
  return blameOptions.find(o => o.id === id)?.label ?? '—';
}

export function Cierre() {
  const { state, update, hydrated } = useClass1();
  const before = state.initialQuestion;
  const now = state.finalQuestion;

  return (
    <>
      {hydrated && !before.committed && (
        <Notice tone="warn">
          No registraste tu respuesta inicial, así que no habrá comparación.{' '}
          <Link href="/clase-1" className="underline underline-offset-2">Volver al principio</Link>.
        </Notice>
      )}

      <Panel className="border-cyan-500/25 bg-cyan-500/[0.04]">
        <p className="text-sm leading-relaxed text-zinc-300">{blameQuestion}</p>

        <div className="mt-5 space-y-5">
          <ChipRadio
            legend="¿Dónde está el fallo, ahora?"
            options={blameOptions.map(o => ({ id: o.id, label: o.label, hint: o.hint }))}
            value={now.blame}
            onChange={id => update(d => ({ ...d, finalQuestion: { ...d.finalQuestion, blame: id as BlameOption } }))}
            columns={1}
            disabled={now.committed || !hydrated}
          />

          <ChipRadio
            legend="¿Qué tan seguro estás ahora?"
            options={confidenceLevels.map(c => ({ id: c.id, label: c.label }))}
            value={now.confidence}
            onChange={id =>
              update(d => ({ ...d, finalQuestion: { ...d.finalQuestion, confidence: id as ConfidenceLevel } }))
            }
            columns={3}
            disabled={now.committed || !hydrated}
          />

          {now.committed ? (
            <LockedNote>Respuesta final registrada.</LockedNote>
          ) : (
            <PrimaryButton
              disabled={!hydrated || !now.blame || !now.confidence}
              onClick={() =>
                update(d => ({
                  ...d,
                  finalQuestion: { ...d.finalQuestion, committed: true, at: new Date().toISOString() },
                }))
              }
            >
              Registrar mi respuesta final
            </PrimaryButton>
          )}
        </div>
      </Panel>

      {hydrated && now.committed && (
        <>
          <section aria-labelledby="comparacion" className="space-y-3">
            <h2 id="comparacion" className="text-lg font-bold text-white">Antes y ahora</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.10] bg-white/[0.02] p-4">
                <div className="mono text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                  Al comenzar
                </div>
                <p className="mt-2 text-base font-semibold text-zinc-300">{labelOf(before.blame)}</p>
                <p className="mt-1 text-xs text-zinc-500">Confianza · {before.confidence ?? '—'}</p>
              </div>
              <div className="rounded-2xl border border-cyan-500/35 bg-cyan-500/[0.07] p-4">
                <div className="mono text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-400">
                  Ahora
                </div>
                <p className="mt-2 text-base font-semibold text-white">{labelOf(now.blame)}</p>
                <p className="mt-1 text-xs text-zinc-400">Confianza · {now.confidence ?? '—'}</p>
              </div>
            </div>
          </section>

          <Panel>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField
                label="Antes pensaba que el problema era…"
                value={state.reflection.before}
                onChange={v => update(d => ({ ...d, reflection: { ...d.reflection, before: v } }))}
              />
              <TextField
                label="Ahora agregaría…"
                value={state.reflection.after}
                onChange={v => update(d => ({ ...d, reflection: { ...d.reflection, after: v } }))}
              />
            </div>
          </Panel>

          <Entrega />
        </>
      )}
    </>
  );
}
