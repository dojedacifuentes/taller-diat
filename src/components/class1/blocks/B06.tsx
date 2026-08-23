'use client';
// B06 · ERROR LAB — cuatro errores jurídicos generativos, con el tipo 2 como núcleo.
import { useState } from 'react';
import {
  confidenceLevels, errorCases, errorTypes, revealCase, warningSignals,
  type ConfidenceLevel, type ErrorType,
} from '@/content/class1/activities';
import { useClass1, useVisitBlock } from '@/lib/class1/store';
import { Callout, ChoiceGroup, CommitGate, EvaNote, Feedback, Field, Prose, Statement } from '../ui';
import { ConceptLink, useConceptPanel } from '../ConceptPanel';

const typeOptions = errorTypes.map(t => ({ id: t.id, label: `Tipo ${t.n} · ${t.label}` }));

export function B06() {
  useVisitBlock('b06');
  const { state, update, hydrated } = useClass1();
  const { open } = useConceptPanel();
  const [openType, setOpenType] = useState<ErrorType | null>(null);
  const s = state.b06;

  const casesDone = errorCases.filter(c => s.committed[c.id]).length;

  return (
    <>
      <Prose>
        <p>
          «La IA inventa cosas» es una descripción insuficiente para trabajo jurídico. Sirve para una
          sobremesa; no sirve para decidir qué revisar antes de firmar. El error que más daño produce
          no es la fuente inventada —esa se detecta— sino la fuente real a la que se le atribuye algo
          que no dice.
        </p>
      </Prose>

      <Callout kind="aplicalo" title="Definición funcional que se usa en este taller">
        <p>
          Llamaremos <strong>alucinación</strong> a una salida en la que el sistema presenta como
          información respaldada algo que no está suficientemente sustentado por los datos o fuentes
          pertinentes. Es deliberadamente amplia: el problema jurídico no se reduce a inventar un rol
          de sentencia.
        </p>
      </Callout>

      <section aria-labelledby="tipos">
        <h2 id="tipos" className="mb-1 text-lg font-bold text-white">Cuatro tipos</h2>
        <p className="mb-3 text-sm text-zinc-400">
          Se detectan con <strong>operaciones distintas entre sí</strong>: saber el nombre del error
          dice también qué hay que hacer para encontrarlo.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {errorTypes.map(t => {
            const isOpen = openType === t.id;
            return (
              <div
                key={t.id}
                className={`rounded-xl border bg-white/[0.02] ${t.core ? 'border-cyan-500/35' : 'border-white/[0.10]'}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenType(prev => (prev === t.id ? null : t.id))}
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-2 px-3.5 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
                >
                  <span className="min-w-0">
                    <span className={`mono block text-[10px] font-bold uppercase tracking-widest ${t.core ? 'text-cyan-400' : 'text-zinc-500'}`}>
                      Tipo {t.n}{t.core && ' · núcleo'}
                    </span>
                    <span className="mt-0.5 block text-sm font-semibold text-white">{t.label}</span>
                    <span className="mt-0.5 block text-xs text-zinc-400">{t.definition}</span>
                  </span>
                  <span className="mono shrink-0 text-xs text-zinc-600">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <dl className="space-y-2 border-t border-white/[0.08] px-3.5 py-3 text-xs">
                    <div>
                      <dt className="mono text-[9px] font-bold uppercase tracking-widest text-zinc-500">Ejemplo</dt>
                      <dd className="text-zinc-300">{t.example}</dd>
                    </div>
                    <div>
                      <dt className="mono text-[9px] font-bold uppercase tracking-widest text-rose-400">Por qué es peligroso</dt>
                      <dd className="text-zinc-300">{t.danger}</dd>
                    </div>
                    <div>
                      <dt className="mono text-[9px] font-bold uppercase tracking-widest text-emerald-400">Cómo detectarlo</dt>
                      <dd className="text-zinc-300">{t.detect}</dd>
                    </div>
                    <div>
                      <dt className="mono text-[9px] font-bold uppercase tracking-widest text-emerald-400">Qué verificar</dt>
                      <dd className="text-zinc-300">{t.verify}</dd>
                    </div>
                  </dl>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Revelación progresiva ── */}
      <section aria-labelledby="reveal" className="space-y-4 rounded-xl border border-cyan-500/25 bg-cyan-500/[0.04] p-4 sm:p-5">
        <h2 id="reveal" className="text-lg font-bold text-white">El caso que sobrevive a la revisión</h2>

        <div className="rounded-lg border border-white/[0.12] bg-[oklch(0.07_0.015_250)] px-3.5 py-3">
          <p className="mono text-[12.5px] leading-relaxed text-zinc-300">{revealCase.claim}</p>
        </div>

        <p className="text-sm text-zinc-300">{revealCase.steps[0].prompt}</p>

        <EvaNote>El rol existe. Entonces la cita ya está verificada, ¿cierto?</EvaNote>

        <ChoiceGroup
          legend={revealCase.steps[0].question}
          options={revealCase.steps[0].options}
          value={s.revealAnswer}
          onChange={id => update(d => ({ ...d, b06: { ...d.b06, revealAnswer: id } }))}
          disabled={s.revealCommitted || !hydrated}
          mark={
            s.revealCommitted
              ? id => (id === revealCase.steps[0].correct ? 'ok' : id === s.revealAnswer ? 'bad' : null)
              : undefined
          }
        />

        <ChoiceGroup
          legend="¿Qué tan seguro estás?"
          options={confidenceLevels.map(c => ({ id: c.id, label: c.label }))}
          value={s.revealConfidence}
          onChange={id => update(d => ({ ...d, b06: { ...d.b06, revealConfidence: id as ConfidenceLevel } }))}
          disabled={s.revealCommitted || !hydrated}
          columns={3}
        />

        <CommitGate
          committed={s.revealCommitted}
          canCommit={Boolean(s.revealAnswer && s.revealConfidence)}
          onCommit={() => update(d => ({ ...d, b06: { ...d.b06, revealCommitted: true } }))}
          lockedNote="Respuesta registrada."
        >
          <div className="space-y-4">
            <Feedback
              correct={s.revealAnswer === revealCase.steps[0].correct}
              explanation={
                s.revealAnswer === revealCase.steps[0].correct
                  ? revealCase.steps[0].feedbackCorrect
                  : revealCase.steps[0].feedbackWrong
              }
            />
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/[0.07] px-3.5 py-3">
              <div className="mono mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-rose-300">
                Abrimos la sentencia
              </div>
              <p className="text-sm leading-relaxed text-zinc-200">{revealCase.revelation}</p>
            </div>

            <Statement tone="accent" caption="Verificar que una sentencia existe no significa comprobar que sostenga la proposición que se le atribuye.">
              <ConceptLink id="fuente-real">{revealCase.lesson}</ConceptLink>
            </Statement>

            <Callout kind="aplicalo" title="Tipo 2 frente a tipo 4">
              <p>{revealCase.contrast}</p>
            </Callout>

            <Field
              label="¿Qué te llevas de este contraste?"
              hint="Una frase. Va a tu Bitácora."
              value={s.takeaway}
              onChange={v => update(d => ({ ...d, b06: { ...d.b06, takeaway: v } }))}
              rows={2}
            />
          </div>
        </CommitGate>
      </section>

      {/* ── Clasificación ── */}
      <section aria-labelledby="clasifica" className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="clasifica" className="text-lg font-bold text-white">Clasifica los casos</h2>
          <span className="mono text-[11px] text-cyan-400 tabular-nums">{casesDone}/{errorCases.length}</span>
        </div>

        {errorCases.map(c => {
          const answer = (s.cases[c.id] as ErrorType | undefined) ?? null;
          const committed = Boolean(s.committed[c.id]);
          const correct = answer === c.answer;
          const def = errorTypes.find(t => t.id === c.answer);
          return (
            <div key={c.id} className="space-y-3.5 rounded-xl border border-white/[0.10] bg-white/[0.02] p-4">
              <p className="text-sm leading-relaxed text-zinc-200">{c.text}</p>
              <ChoiceGroup
                legend="¿Qué tipo de error es?"
                options={typeOptions}
                value={answer}
                onChange={id => update(d => ({ ...d, b06: { ...d.b06, cases: { ...d.b06.cases, [c.id]: id as ErrorType } } }))}
                disabled={committed || !hydrated}
                columns={2}
                mark={committed ? id => (id === c.answer ? 'ok' : id === answer ? 'bad' : null) : undefined}
              />
              <CommitGate
                committed={committed}
                canCommit={Boolean(answer)}
                onCommit={() => update(d => ({ ...d, b06: { ...d.b06, committed: { ...d.b06.committed, [c.id]: true } } }))}
                lockedNote="Clasificación registrada."
              >
                <Feedback
                  correct={correct}
                  answer={def ? `Tipo ${def.n} · ${def.label}` : undefined}
                  explanation={c.discussion}
                  principle={def?.verify}
                  manualRef="Manual §14"
                  onOpenConcept={() => open('fuente-real')}
                />
              </CommitGate>
            </div>
          );
        })}
      </section>

      <section aria-labelledby="senales">
        <h2 id="senales" className="mb-1 text-lg font-bold text-white">Siete señales de alerta</h2>
        <p className="mb-3 text-sm text-zinc-400">
          Ninguna prueba que haya un error. Cada una indica <strong>dónde mirar primero</strong> cuando
          el tiempo de verificación es limitado.
        </p>
        <ol className="space-y-1.5">
          {warningSignals.map(w => (
            <li
              key={w.n}
              className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 ${
                w.n === 7 ? 'border-cyan-500/30 bg-cyan-500/[0.06]' : 'border-white/[0.08] bg-white/[0.02]'
              }`}
            >
              <span className={`mono mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-[11px] font-bold ${
                w.n === 7 ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/[0.06] text-zinc-400'
              }`}>
                {w.n}
              </span>
              <span className="min-w-0">
                <span className="block text-sm text-zinc-200">{w.text}</span>
                <span className="mt-0.5 block text-xs text-zinc-500">{w.gloss}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <Callout kind="verifica" title="La regla que no admite matices">
        <p>
          <strong>Verificar no es pedirle a otra IA que diga si la primera IA está en lo correcto.</strong>{' '}
          Una segunda herramienta puede ayudar a localizar evidencia, pero el contraste relevante debe
          terminar en una fuente suficientemente autoritativa. Dos respuestas coincidentes no se
          convierten en fuente por votación.
        </p>
      </Callout>
    </>
  );
}
