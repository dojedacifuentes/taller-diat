'use client';
// ─────────────────────────────────────────────────────────────────────────────
// ETAPA 1 · PREGUNTA GUÍA
//
// El caso mínimo indispensable para poder responder, la respuesta y adelante.
// El marco teórico, la línea disciplinaria y los modelos los expone el profesor
// en sala: aquí no se repiten.
// ─────────────────────────────────────────────────────────────────────────────
import {
  blameOptions, blameQuestion, confidenceLevels, fakeCitation,
  type BlameOption, type ConfidenceLevel,
} from '@/content/class1/activities';
import { useClass1 } from '@/lib/class1/store';
import { ChipRadio, LockedNote, Panel, PrimaryButton } from '../ui';

export function Pregunta() {
  const { state, update, hydrated } = useClass1();
  const q = state.initialQuestion;

  return (
    <>
      <Panel className="border-white/[0.12]">
        <div className="mono mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
          Ficha bibliográfica citada en un escrito judicial
        </div>
        <p className="mono text-[13px] leading-relaxed text-zinc-200">
          {fakeCitation.author} ({fakeCitation.year}). <em>{fakeCitation.title}</em>.{' '}
          {fakeCitation.publisher}, {fakeCitation.place}, {fakeCitation.pages}.
        </p>
        <div className="mt-4 rounded-lg border-2 border-rose-500/60 px-4 py-2.5 text-center">
          <span className="mono text-sm font-bold tracking-[0.1em] text-rose-400">
            {fakeCitation.stamp}
          </span>
        </div>
      </Panel>

      <Panel className="border-cyan-500/25 bg-cyan-500/[0.04]">
        <p className="text-sm leading-relaxed text-zinc-300">{blameQuestion}</p>

        <div className="mt-5 space-y-5">
          <ChipRadio
            legend="Elige la opción que más pese."
            options={blameOptions.map(o => ({ id: o.id, label: o.label, hint: o.hint }))}
            value={q.blame}
            onChange={id => update(d => ({ ...d, initialQuestion: { ...d.initialQuestion, blame: id as BlameOption } }))}
            columns={1}
            disabled={q.committed || !hydrated}
          />

          <ChipRadio
            legend="¿Qué tan seguro estás?"
            options={confidenceLevels.map(c => ({ id: c.id, label: c.label }))}
            value={q.confidence}
            onChange={id =>
              update(d => ({ ...d, initialQuestion: { ...d.initialQuestion, confidence: id as ConfidenceLevel } }))
            }
            columns={3}
            disabled={q.committed || !hydrated}
          />

          {q.committed ? (
            <LockedNote>
              Respuesta registrada. No se puede modificar: es el punto de comparación con el que
              volverás a encontrarte al cerrar la sesión.
            </LockedNote>
          ) : (
            <PrimaryButton
              disabled={!hydrated || !q.blame || !q.confidence}
              onClick={() =>
                update(d => ({
                  ...d,
                  initialQuestion: { ...d.initialQuestion, committed: true, at: new Date().toISOString() },
                }))
              }
            >
              Registrar mi respuesta
            </PrimaryButton>
          )}
        </div>
      </Panel>
    </>
  );
}
