'use client';
// B03 · DIAGNÓSTICO DIAT — los siete componentes como preguntas de diseño.
import { useState } from 'react';
import {
  componentStates, controlInstructions, diagnosisPrompt, diagnosisReading, diatComponents,
  riskLevels, type ComponentId, type ComponentState,
} from '@/content/class1/activities';
import { useClass1, useVisitBlock } from '@/lib/class1/store';
import { Callout, CommitGate, Field, Prose, PromptBlock, Statement } from '../ui';
import { ConceptLink } from '../ConceptPanel';

const stateTone: Record<ComponentState, string> = {
  definido: 'border-emerald-500/45 bg-emerald-500/[0.10] text-emerald-300',
  ambiguo: 'border-amber-500/45 bg-amber-500/[0.10] text-amber-300',
  ausente: 'border-rose-500/45 bg-rose-500/[0.10] text-rose-300',
  innecesario: 'border-white/20 bg-white/[0.05] text-zinc-400',
};

export function B03() {
  useVisitBlock('b03');
  const { state, update, hydrated } = useClass1();
  const [openFicha, setOpenFicha] = useState<ComponentId | null>(null);
  const s = state.b03;

  const assigned = diatComponents.filter(c => s.states[c.id]).length;

  return (
    <>
      <Prose>
        <p>
          La estructura DIAT no es una fórmula: es una lista de preguntas de diseño. Su valor no está
          en rellenar siete casillas, sino en detectar cuáles de esas decisiones estamos dejando{' '}
          <ConceptLink id="decision-implicita">implícitas</ConceptLink>.
        </p>
      </Prose>

      <Callout kind="aplicalo" title="Por qué DIAT añade dos componentes">
        <p>
          La Academia Judicial de Chile (enero de 2026) propone rol/contexto, objetivo, detalles,
          restricciones y formato. La ayuda oficial de Google para construir <em>Gems</em> recomienda
          persona, tarea, contexto y formato. Ambas coinciden en lo esencial y{' '}
          <strong>ninguna incorpora fuentes ni control</strong> — las dos decisiones que en trabajo
          jurídico cambian el resultado por completo.
        </p>
      </Callout>

      <section aria-labelledby="fichas">
        <h2 id="fichas" className="mb-3 text-lg font-bold text-white">Las siete preguntas</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {diatComponents.map(c => {
            const isOpen = openFicha === c.id;
            return (
              <div key={c.id} className={`rounded-xl border ${c.signature ? 'border-cyan-500/30' : 'border-white/[0.10]'} bg-white/[0.02]`}>
                <button
                  type="button"
                  onClick={() => setOpenFicha(prev => (prev === c.id ? null : c.id))}
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-2 px-3.5 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
                >
                  <span className="min-w-0">
                    <span className={`mono block text-[11px] font-bold uppercase tracking-widest ${c.signature ? 'text-cyan-400' : 'text-zinc-500'}`}>
                      {c.label}
                      {c.signature && ' · aporte DIAT'}
                    </span>
                    <span className="mt-0.5 block text-sm italic leading-snug text-zinc-300">{c.question}</span>
                  </span>
                  <span className="mono shrink-0 text-xs text-zinc-600">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <dl className="space-y-2 border-t border-white/[0.08] px-3.5 py-3 text-xs">
                    <div>
                      <dt className="mono text-[9px] font-bold uppercase tracking-widest text-zinc-500">Qué resuelve</dt>
                      <dd className="text-zinc-300">{c.solves}</dd>
                    </div>
                    <div>
                      <dt className="mono text-[9px] font-bold uppercase tracking-widest text-zinc-500">Ejemplo</dt>
                      <dd className="text-zinc-300">{c.example}</dd>
                    </div>
                    <div>
                      <dt className="mono text-[9px] font-bold uppercase tracking-widest text-rose-400">Si falta</dt>
                      <dd className="text-zinc-300">{c.ifMissing}</dd>
                    </div>
                    <div>
                      <dt className="mono text-[9px] font-bold uppercase tracking-widest text-zinc-500">Cuándo puede omitirse</dt>
                      <dd className="text-zinc-300">{c.whenOmit}</dd>
                    </div>
                  </dl>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="diagnostico" className="space-y-4 rounded-xl border border-cyan-500/20 bg-cyan-500/[0.04] p-4 sm:p-5">
        <div>
          <h2 id="diagnostico" className="text-lg font-bold text-white">Diagnostica este prompt</h2>
          <p className="mt-1.5 text-sm text-zinc-400">
            Un prompt real de riesgo medio, del tipo que cualquiera escribiría un martes a las siete de
            la tarde. No lo reescribas: <strong>diagnostícalo</strong>.
          </p>
        </div>

        <PromptBlock
          label="Prompt de diagnóstico · riesgo medio"
          text={diagnosisPrompt.text}
          footer={diagnosisPrompt.note}
        />

        <div>
          <p className="mb-2.5 text-sm font-medium text-zinc-200">
            Estado de cada componente
            <span className="mono ml-2 text-[11px] text-cyan-400">{assigned}/{diatComponents.length}</span>
          </p>
          <p className="mb-3 text-xs text-zinc-500">
            No se trata de conseguir siete «definidos». Una omisión puede ser la decisión correcta.
          </p>

          <div className="space-y-2">
            {diatComponents.map(c => {
              const value = s.states[c.id] ?? null;
              return (
                <fieldset key={c.id} disabled={s.committed || !hydrated} className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2.5">
                  <legend className="sr-only">{c.label}</legend>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className={`mono w-28 shrink-0 text-[11px] font-bold uppercase tracking-wider ${c.signature ? 'text-cyan-400' : 'text-zinc-400'}`}>
                      {c.label}
                    </span>
                    <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                      {componentStates.map(st => {
                        const on = value === st.id;
                        return (
                          <label
                            key={st.id}
                            className={`cursor-pointer rounded border px-2 py-1 text-[11px] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-cyan-400 ${
                              on ? stateTone[st.id] : 'border-white/[0.10] text-zinc-500 hover:border-white/25'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`state-${c.id}`}
                              className="sr-only"
                              checked={on}
                              onChange={() =>
                                update(d => ({ ...d, b03: { ...d.b03, states: { ...d.b03.states, [c.id]: st.id } } }))
                              }
                            />
                            {st.short}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </fieldset>
              );
            })}
          </div>
        </div>

        <Field
          label="¿Qué decisión está quedando implícita al escribirlo así?"
          hint="Una o dos frases. Es el corazón del ejercicio: no la solución, el diagnóstico."
          value={s.implicitDecisions}
          onChange={v => update(d => ({ ...d, b03: { ...d.b03, implicitDecisions: v } }))}
          rows={3}
          placeholder="Al no delimitar las fuentes, el sistema puede mezclar…"
        />

        <CommitGate
          committed={s.committed}
          canCommit={assigned === diatComponents.length && s.implicitDecisions.trim().length > 0}
          onCommit={() => update(d => ({ ...d, b03: { ...d.b03, committed: true } }))}
          label="Confirmar diagnóstico"
          lockedNote="Diagnóstico registrado. Abajo tienes la lectura de referencia para contrastar."
        >
          <div className="space-y-2.5">
            <h3 className="text-sm font-semibold text-white">Lectura de referencia</h3>
            <p className="text-xs text-zinc-500">
              No es una corrección con puntaje. Es el comentario con el que puedes contrastar tu propio
              diagnóstico: donde coincidas, confirma; donde no, la diferencia es lo interesante.
            </p>
            {diatComponents.map(c => {
              const mine = s.states[c.id];
              const ref = diagnosisReading[c.id];
              const aligned = mine ? ref.expected.includes(mine) : false;
              return (
                <div key={c.id} className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="mono text-[11px] font-bold uppercase tracking-wider text-zinc-300">{c.label}</span>
                    {mine && (
                      <span className={`mono rounded border px-1.5 py-0.5 text-[10px] ${stateTone[mine]}`}>
                        tu lectura: {componentStates.find(x => x.id === mine)?.short}
                      </span>
                    )}
                    <span className={`mono text-[10px] font-bold uppercase tracking-widest ${aligned ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {aligned ? 'coincide' : 'contrasta'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">{ref.comment}</p>
                </div>
              );
            })}
          </div>
        </CommitGate>
      </section>

      <section aria-labelledby="control">
        <h2 id="control" className="mb-1 text-lg font-bold text-white">
          Control: siete instrucciones reutilizables
        </h2>
        <p className="mb-3 text-sm text-zinc-400">
          <ConceptLink id="control">Control</ConceptLink> no verifica la respuesta: hace que sea
          auditable. Es el puente entre prompting y verificación.
        </p>
        <ol className="space-y-1.5">
          {controlInstructions.map((t, i) => (
            <li key={t} className="flex items-start gap-2.5 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2">
              <span className="mono mt-0.5 shrink-0 text-[11px] font-bold text-cyan-400">{i + 1}</span>
              <span className="text-sm text-zinc-300">{t}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="riesgo">
        <h2 id="riesgo" className="mb-3 text-lg font-bold text-white">
          <ConceptLink id="proporcionalidad">Proporcionalidad al riesgo</ConceptLink>
        </h2>
        <div className="grid gap-2.5 md:grid-cols-3">
          {riskLevels.map(r => (
            <div key={r.id} className="rounded-xl border border-white/[0.10] bg-white/[0.02] p-3.5">
              <div className="mono text-[10px] font-bold uppercase tracking-widest text-cyan-400">{r.label}</div>
              <p className="mt-1.5 text-xs text-zinc-400"><strong className="text-zinc-300">Ejemplos.</strong> {r.examples}</p>
              <p className="mt-1.5 text-xs text-zinc-400"><strong className="text-zinc-300">Estructura.</strong> {r.structure}</p>
              <p className="mt-1.5 text-xs text-zinc-400"><strong className="text-zinc-300">Verificación.</strong> {r.verification}</p>
            </div>
          ))}
        </div>
      </section>

      <Statement caption="Agregarle componentes a un prompt de riesgo bajo lo empeora." tone="accent">
        Son siete preguntas de diseño,
        <br />
        no siete casillas obligatorias.
      </Statement>
    </>
  );
}
