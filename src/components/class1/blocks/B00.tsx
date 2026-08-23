'use client';
// B00 · DIAGNÓSTICO INICIAL — instalar el problema profesional.
import {
  blameOptions, blameQuestion, confidenceLevels, disciplinaryLine, fakeCitation,
  supremeCourtCase, type BlameOption, type ConfidenceLevel,
} from '@/content/class1/activities';
import { class1Meta } from '@/content/class1/manifest';
import { useClass1, useVisitBlock } from '@/lib/class1/store';
import { Callout, ChoiceGroup, CommitGate, EvaNote, Prose, ResponsiveRows, Statement } from '../ui';
import { ConceptLink } from '../ConceptPanel';

export function B00() {
  useVisitBlock('b00');
  const { state, update, hydrated } = useClass1();
  const s = state.b00;

  return (
    <>
      <Callout kind="alerta" title="Regla de aula">
        <p>{class1Meta.classroomRule}</p>
      </Callout>

      <section aria-labelledby="ficha">
        <h2 id="ficha" className="sr-only">Ficha bibliográfica proyectada en clase</h2>
        <div className="rounded-xl border border-white/[0.12] bg-white/[0.02] p-5">
          <div className="mono mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">
            Ficha bibliográfica proyectada en clase
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
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">{fakeCitation.reading}</p>
        </div>
      </section>

      <EvaNote>
        Autor plausible, editorial verosímil, año razonable. Si la forma es impecable, la cita
        es buena. ¿O el filtro que estás usando es justo el que este error sabe superar?
      </EvaNote>

      <section aria-labelledby="voto" className="rounded-xl border border-cyan-500/20 bg-cyan-500/[0.04] p-5">
        <h2 id="voto" className="text-lg font-bold text-white">¿Quién falló?</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-300">{blameQuestion}</p>

        <div className="mt-5 space-y-5">
          <ChoiceGroup
            legend="Elige la opción que más pese, aunque creas que varias son verdad."
            options={blameOptions.map(o => ({ id: o.id, label: o.label, hint: o.hint }))}
            value={s.blame}
            onChange={id => update(d => ({ ...d, b00: { ...d.b00, blame: id as BlameOption } }))}
            disabled={s.committed || !hydrated}
          />

          <ChoiceGroup
            legend="¿Qué tan seguro estás de tu respuesta?"
            options={confidenceLevels.map(c => ({ id: c.id, label: c.label }))}
            value={s.confidence}
            onChange={id => update(d => ({ ...d, b00: { ...d.b00, confidence: id as ConfidenceLevel } }))}
            disabled={s.committed || !hydrated}
            columns={3}
          />

          <CommitGate
            committed={s.committed}
            canCommit={Boolean(s.blame && s.confidence)}
            onCommit={() =>
              update(d => ({ ...d, b00: { ...d.b00, committed: true, at: new Date().toISOString() } }))
            }
            label="Registrar mi respuesta"
            lockedNote="Respuesta registrada. No se puede modificar: a las 16:25 volveremos a esta misma pregunta y la compararemos con lo que respondas entonces."
          >
            <Callout kind="idea" title="Todavía no hay respuesta">
              <p>
                No vas a recibir la solución ahora, y es deliberado. La respuesta se completa en B09,
                cuando tengas con qué precisarla. Lo que acabas de registrar es tu punto de partida.
              </p>
            </Callout>
          </CommitGate>
        </div>
      </section>

      {s.committed && (
        <>
          <section aria-labelledby="caso" className="space-y-4">
            <h2 id="caso" className="text-lg font-bold text-white">
              El caso: Corte Suprema, Rol 23.322-2025
            </h2>
            <Prose>
              <p>{supremeCourtCase.summary}</p>
              <p className="border-l-2 border-cyan-500/40 pl-3 italic text-zinc-400">
                «{supremeCourtCase.quote}»
              </p>
            </Prose>

            <h3 className="pt-2 text-base font-semibold text-white">
              Cuatro tribunales, siete meses: la línea disciplinaria chilena de 2026
            </h3>
            <ResponsiveRows
              head={['Sede', 'Rol', 'Fecha', 'Sanción', 'Atribución expresa a IA']}
              rows={disciplinaryLine.map(r => [
                <span key="c" className={r.highlight ? 'font-semibold text-cyan-300' : ''}>{r.court}</span>,
                <span key="r" className="mono text-xs">{r.rol}</span>,
                <span key="d" className="mono text-xs whitespace-nowrap">{r.date}</span>,
                r.sanction,
                r.ai,
              ])}
            />
            <p className="text-xs text-zinc-500">
              Cuatro resoluciones en siete meses y en cuatro sedes distintas demuestran un estándar;
              un caso solo demuestra una desgracia.
            </p>

            <Callout kind="aplicalo" title="Nota de precisión">
              <p>{supremeCourtCase.note}</p>
            </Callout>
          </section>

          <Statement caption="La IA no tiene deberes procesales. El abogado sí." tone="accent">
            La sanción no recae sobre la herramienta.
            <br />
            Recae sobre quien incorpora el contenido y firma.
          </Statement>

          <Prose>
            <p>
              Delegar una tarea a una IA no equivale a delegar la{' '}
              <ConceptLink id="responsabilidad">responsabilidad profesional</ConceptLink>. Ese es el
              contenido entero del taller expresado en una frase — y el resto de la clase reconstruye
              hacia atrás qué debió ocurrir para que el escrito nunca hubiera llegado así al tribunal.
            </p>
          </Prose>
        </>
      )}
    </>
  );
}
