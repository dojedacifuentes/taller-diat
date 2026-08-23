'use client';
// B02 · CINCO MITOS — quiz individual con commit before feedback.
import { myths, type MythAnswer } from '@/content/class1/activities';
import { useClass1, useVisitBlock } from '@/lib/class1/store';
import { Callout, ChoiceGroup, CommitGate, Feedback, Prose } from '../ui';
import { useConceptPanel } from '../ConceptPanel';

const options = [
  { id: 'verdadero', label: 'Verdadero' },
  { id: 'falso', label: 'Falso' },
  { id: 'depende', label: 'Depende' },
] as const;

const answerLabel: Record<MythAnswer, string> = {
  verdadero: 'Verdadero',
  falso: 'Falso',
  depende: 'Depende',
};

const conceptByMyth: Record<string, string> = {
  m1: 'control',
  m2: 'proporcionalidad',
  m3: 'grounding',
  m4: 'decision-implicita',
  m5: 'modelo-producto',
};

export function B02() {
  useVisitBlock('b02');
  const { state, update, hydrated } = useClass1();
  const { open } = useConceptPanel();

  const done = myths.filter(m => state.b02.committed[m.id]).length;

  return (
    <>
      <Prose>
        <p>
          Cinco afirmaciones. Responde cada una y confirma antes de ver la explicación: el valor
          pedagógico está en comprometerse primero. Equivocarse aquí no tiene costo.
        </p>
      </Prose>

      <div className="flex items-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5">
        <span className="mono text-[11px] font-bold text-cyan-400 tabular-nums">{done}/{myths.length}</span>
        <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
          <span
            className="block h-full rounded-full bg-cyan-500 transition-all"
            style={{ width: `${(done / myths.length) * 100}%` }}
          />
        </span>
      </div>

      {myths.map((m, i) => {
        const answer = (state.b02.answers[m.id] as MythAnswer | undefined) ?? null;
        const committed = Boolean(state.b02.committed[m.id]);
        const correct = answer === m.answer;
        return (
          <section
            key={m.id}
            aria-labelledby={`myth-${m.id}`}
            className={`space-y-4 rounded-xl border p-4 sm:p-5 ${
              m.core ? 'border-cyan-500/25 bg-cyan-500/[0.04]' : 'border-white/[0.10] bg-white/[0.02]'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="mono mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border border-white/[0.14] text-[11px] font-bold text-zinc-400">
                {i + 1}
              </span>
              <div className="min-w-0">
                <h2 id={`myth-${m.id}`} className="text-base font-semibold leading-snug text-white">
                  «{m.statement}»
                </h2>
                {m.core && (
                  <p className="mono mt-1 text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                    El más importante de los cinco
                  </p>
                )}
              </div>
            </div>

            <ChoiceGroup
              legend="Tu respuesta"
              options={options}
              value={answer}
              onChange={id =>
                update(d => ({ ...d, b02: { ...d.b02, answers: { ...d.b02.answers, [m.id]: id as MythAnswer } } }))
              }
              disabled={committed || !hydrated}
              columns={3}
              mark={committed ? id => (id === m.answer ? 'ok' : id === answer ? 'bad' : null) : undefined}
            />

            <CommitGate
              committed={committed}
              canCommit={Boolean(answer)}
              onCommit={() =>
                update(d => ({ ...d, b02: { ...d.b02, committed: { ...d.b02.committed, [m.id]: true } } }))
              }
              lockedNote="Respuesta registrada en tu Bitácora."
            >
              <Feedback
                correct={correct}
                answer={answerLabel[m.answer]}
                explanation={m.explanation}
                principle={m.principle}
                manualRef={m.manualRef}
                onOpenConcept={() => open(conceptByMyth[m.id])}
              />
            </CommitGate>
          </section>
        );
      })}

      {done === myths.length && (
        <Callout kind="idea">
          <p>
            Ninguno de los cinco mitos se corrige escribiendo prompts más elaborados. Los cinco apuntan
            al mismo lugar: <strong>la mejora de la instrucción y la comprobación del resultado son
            fases separadas del trabajo</strong>, y la segunda no desaparece porque la primera haya
            salido bien.
          </p>
          <p className="text-zinc-400">
            Si no hay prompt mágico ni herramienta infalible, la pregunta útil es más modesta:
            ¿qué información necesita un sistema para ejecutar razonablemente bien un encargo jurídico?
          </p>
        </Callout>
      )}
    </>
  );
}
