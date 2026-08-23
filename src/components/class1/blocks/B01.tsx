'use client';
// B01 · MODELO MENTAL MÍNIMO — modelo vs. producto, capacidades y variabilidad.
import { useState } from 'react';
import { b01Checks, capabilities, modelCore, productLayers, variabilityCauses } from '@/content/class1/activities';
import { useClass1, useVisitBlock } from '@/lib/class1/store';
import { Callout, ChoiceGroup, CommitGate, Feedback, Prose, ResponsiveRows, Statement } from '../ui';
import { ConceptLink, useConceptPanel } from '../ConceptPanel';

export function B01() {
  useVisitBlock('b01');
  const { state, update, hydrated } = useClass1();
  const { open } = useConceptPanel();
  const [active, setActive] = useState<string | null>(null);
  const explored = state.b01.explored;

  function explore(id: string) {
    setActive(prev => (prev === id ? null : id));
    if (!explored.includes(id)) {
      update(d => ({ ...d, b01: { ...d.b01, explored: [...d.b01.explored, id] } }));
    }
  }

  const node = productLayers.find(l => l.id === active);

  return (
    <>
      <Prose>
        <p>
          Aquí solo interesa el conocimiento técnico que cambia una conducta de uso. Hacen falta tres
          distinciones: IA no es lo mismo que IA generativa; el{' '}
          <ConceptLink id="modelo-producto">modelo no es el producto</ConceptLink>; y la misma
          instrucción puede producir respuestas distintas.
        </p>
      </Prose>

      <section aria-labelledby="diagrama" className="rounded-xl border border-white/[0.10] bg-white/[0.02] p-5">
        <h2 id="diagrama" className="text-lg font-bold text-white">El modelo no es el producto</h2>
        <p className="mt-1.5 text-sm text-zinc-400">
          Toca cada capa del producto para ver qué aporta y qué no garantiza. Explora al menos tres.
          <span className="mono ml-2 text-[11px] text-cyan-400">{explored.length}/5</span>
        </p>

        <div className="mt-5">
          <div className="rounded-xl border-2 border-cyan-500/40 bg-cyan-500/[0.07] px-4 py-3.5 text-center">
            <div className="mono text-sm font-bold tracking-wider text-cyan-300">{modelCore.label}</div>
            <p className="mx-auto mt-1.5 max-w-lg text-xs leading-relaxed text-zinc-400">
              {modelCore.description}
            </p>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {productLayers.map(l => {
              const seen = explored.includes(l.id);
              const isActive = active === l.id;
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => explore(l.id)}
                  aria-expanded={isActive}
                  className={`rounded-lg border px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 ${
                    isActive
                      ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-200'
                      : seen
                        ? 'border-white/[0.14] bg-white/[0.04] text-zinc-300'
                        : 'border-white/[0.10] bg-white/[0.02] text-zinc-400 hover:border-white/25'
                  }`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span>{l.label}</span>
                    {seen && <span className="mono text-[9px] font-bold text-emerald-400">visto</span>}
                  </span>
                </button>
              );
            })}
          </div>

          {node && (
            <div className="mt-3 rounded-xl border border-indigo-500/30 bg-indigo-500/[0.06] p-4">
              <h3 className="text-sm font-bold text-indigo-200">{node.label}</h3>
              <dl className="mt-2.5 space-y-2.5 text-sm">
                <div>
                  <dt className="mono text-[10px] font-bold uppercase tracking-widest text-emerald-400">Qué aporta</dt>
                  <dd className="mt-0.5 text-zinc-300">{node.gives}</dd>
                </div>
                <div>
                  <dt className="mono text-[10px] font-bold uppercase tracking-widest text-rose-400">Qué no garantiza</dt>
                  <dd className="mt-0.5 text-zinc-300">{node.doesNotGuarantee}</dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="capacidades">
        <h2 id="capacidades" className="mb-3 text-lg font-bold text-white">
          Cuatro capacidades y sus cuatro límites
        </h2>
        <ResponsiveRows
          head={['Capacidad', 'Utilidad', 'Límite jurídico']}
          rows={capabilities.map(c => [
            <span key="a" className="font-medium text-white">{c.capability}</span>,
            c.utility,
            c.limit,
          ])}
        />
      </section>

      <section aria-labelledby="checks" className="space-y-4">
        <h2 id="checks" className="text-lg font-bold text-white">Comprueba tu lectura</h2>
        {b01Checks.map(c => {
          const answer = state.b01.checks[c.id] ?? null;
          const committed = Boolean(state.b01.committed[c.id]);
          const correct = answer === c.correct;
          return (
            <div key={c.id} className="space-y-3.5 rounded-xl border border-white/[0.10] bg-white/[0.02] p-4">
              <ChoiceGroup
                legend={c.question}
                options={c.options}
                value={answer}
                onChange={id => update(d => ({ ...d, b01: { ...d.b01, checks: { ...d.b01.checks, [c.id]: id } } }))}
                disabled={committed || !hydrated}
                mark={committed ? id => (id === c.correct ? 'ok' : id === answer ? 'bad' : null) : undefined}
              />
              <CommitGate
                committed={committed}
                canCommit={Boolean(answer)}
                onCommit={() =>
                  update(d => ({ ...d, b01: { ...d.b01, committed: { ...d.b01.committed, [c.id]: true } } }))
                }
                lockedNote="Respuesta registrada."
              >
                <Feedback
                  correct={correct}
                  explanation={correct ? c.feedbackCorrect : c.feedbackWrong}
                  principle={c.principle}
                  manualRef="Manual §4"
                  onOpenConcept={() => open(c.id === 'k1' ? 'fluidez-verdad' : 'modelo-producto')}
                />
              </CommitGate>
            </div>
          );
        })}
      </section>

      <section aria-labelledby="variabilidad">
        <h2 id="variabilidad" className="mb-1 text-lg font-bold text-white">
          Por qué la misma instrucción produce respuestas distintas
        </h2>
        <p className="mb-3 text-sm text-zinc-400">Cuatro causas, y ninguna es que el sistema tenga un mal día.</p>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {variabilityCauses.map((v, i) => (
            <div key={v.title} className="rounded-xl border border-white/[0.10] bg-white/[0.02] p-3.5">
              <div className="mono text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                Causa {i + 1}
              </div>
              <h3 className="mt-1 text-sm font-semibold text-white">{v.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">{v.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <Callout kind="idea" title="Consecuencia práctica">
        <p>
          Un resultado obtenido en una conversación no es reproducible como lo sería una consulta a una
          base de datos jurídica. Si el resultado va a sostener algo, <strong>guarda la salida</strong>:
          no confíes en poder regenerarla. Y no prometas reproducibilidad «bajando la temperatura».
        </p>
      </Callout>

      <Statement caption="Una respuesta puede estar perfectamente redactada y ser jurídicamente equivocada al mismo tiempo.">
        FLUIDEZ ≠ VERDAD
      </Statement>
    </>
  );
}
