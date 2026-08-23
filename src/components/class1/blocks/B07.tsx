'use client';
// B07 · GROUNDING LAB — la plataforma acompaña; el docente conduce la demostración.
//
// Ningún estudiante necesita ejecutar operaciones en Gemini Notebook para que la
// clase avance: las decisiones son sobre lo que se ve en pantalla. El puente
// hacia la herramienta es opcional.
import { confidentialityRule, googleWarning, groundingDecisions, terminologyBan, workModes } from '@/content/class1/activities';
import { AI_TOOL_NOTEBOOK, PROMPT_CORPUS_CERRADO } from '@/content/class1/prompts';
import { useClass1, useVisitBlock } from '@/lib/class1/store';
import { AiBridge } from '../AiBridge';
import { Callout, ChoiceGroup, CommitGate, Feedback, Field, Prose, PromptBlock, ResponsiveRows, Statement } from '../ui';
import { ConceptLink, useConceptPanel } from '../ConceptPanel';

export function B07() {
  useVisitBlock('b07');
  const { state, update, hydrated } = useClass1();
  const { open } = useConceptPanel();
  const s = state.b07;

  return (
    <>
      <Prose>
        <p>
          La respuesta a los errores generativos no es «use otra herramienta». Es una distinción
          conceptual: no es lo mismo preguntar de forma abierta que pedir trabajar sobre un corpus
          documental explícitamente delimitado.
        </p>
      </Prose>

      <ResponsiveRows
        head={['Modalidad', 'Qué recibe el sistema', 'Ventaja', 'Riesgo residual']}
        rows={workModes.map(m => [
          <span key="a" className="font-medium text-white">{m.label}</span>,
          m.receives,
          m.advantage,
          m.residualRisk,
        ])}
      />

      <Callout kind="aplicalo" title="Grounding, sin tecnicismos">
        <p>
          En lugar de pedirle al sistema que responda desde todo lo que aprendió durante su
          entrenamiento, le entregamos las fuentes específicas sobre las que queremos que trabaje.{' '}
          <strong>RAG</strong> es la sigla de la técnica; no hace falta usarla. Conviene saber, eso sí,
          que la recuperación también puede fallar: si el fragmento pertinente no se recupera, el
          sistema responderá igual, con lo que sí recuperó.
        </p>
      </Callout>

      <Statement tone="accent" caption="Grounding resuelve el problema de de dónde sale la información. No resuelve el problema de si fue interpretada correctamente.">
        <ConceptLink id="grounding">PROCEDENCIA ≠ INTERPRETACIÓN</ConceptLink>
      </Statement>

      {/* ── Decisiones guiadas ── */}
      <section aria-labelledby="decisiones" className="space-y-4">
        <div>
          <h2 id="decisiones" className="text-lg font-bold text-white">Decide sobre lo que ves en pantalla</h2>
          <p className="mt-1.5 text-sm text-zinc-400">
            El profesor conduce la demostración sobre un corpus cerrado. Tú tomas las decisiones.
          </p>
        </div>

        {groundingDecisions.map(g => {
          const answer = s.decisions[g.id] ?? null;
          const committed = Boolean(s.committed[g.id]);
          const correct = answer === g.correct;
          return (
            <div key={g.id} className="space-y-3.5 rounded-xl border border-white/[0.10] bg-white/[0.02] p-4">
              <p className="rounded-lg border-l-2 border-cyan-500/40 bg-white/[0.02] px-3 py-2 text-sm leading-relaxed text-zinc-300">
                {g.scenario}
              </p>
              <ChoiceGroup
                legend={g.question}
                options={g.options}
                value={answer}
                onChange={id => update(d => ({ ...d, b07: { ...d.b07, decisions: { ...d.b07.decisions, [g.id]: id } } }))}
                disabled={committed || !hydrated}
                mark={committed ? id => (id === g.correct ? 'ok' : id === answer ? 'bad' : null) : undefined}
              />
              <CommitGate
                committed={committed}
                canCommit={Boolean(answer)}
                onCommit={() => update(d => ({ ...d, b07: { ...d.b07, committed: { ...d.b07.committed, [g.id]: true } } }))}
                lockedNote="Decisión registrada."
              >
                <Feedback
                  correct={correct}
                  explanation={correct ? g.feedbackCorrect : g.feedbackWrong}
                  principle={g.principle}
                  manualRef="Manual §17"
                  onOpenConcept={() => open('grounding')}
                />
              </CommitGate>
            </div>
          );
        })}
      </section>

      {/* ── Herramienta de ejemplo ── */}
      <section aria-labelledby="notebook" className="space-y-4">
        <h2 id="notebook" className="text-lg font-bold text-white">Gemini Notebook, como ejemplo</h2>
        <Prose>
          <p>
            La herramienta usada en clase se llama <strong>Gemini Notebook</strong>. Hasta julio de 2026
            se llamaba NotebookLM; Google la renombró ese mes. Se menciona el nombre anterior porque es
            la mejor lección disponible sobre el punto: no conviene convertir una función comercial en
            objetivo de aprendizaje.
          </p>
        </Prose>

        <Callout kind="alerta" title="Prohibición terminológica">
          <p>
            No llamar a esta herramienta, ni a ninguna otra, {terminologyBan.banned}. No existe esa
            categoría. Las denominaciones correctas son: {terminologyBan.correct.join('; ')}.
          </p>
        </Callout>

        <div className="rounded-xl border border-white/[0.14] bg-white/[0.02] p-4">
          <div className="mono mb-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">
            Lo dice el propio proveedor
          </div>
          <blockquote className="text-sm italic leading-relaxed text-zinc-200">
            «{googleWarning.text}»
          </blockquote>
          <p className="mt-2 text-xs text-zinc-500">{googleWarning.source}</p>
          <p className="mt-3 border-t border-white/[0.08] pt-2.5 text-xs italic text-zinc-400">
            {googleWarning.translation}
          </p>
          <p className="mt-2 text-xs text-zinc-400">{googleWarning.comment}</p>
        </div>

        <PromptBlock
          label="Prompt de trabajo sobre corpus cerrado"
          text={PROMPT_CORPUS_CERRADO.text}
          footer={PROMPT_CORPUS_CERRADO.iteration}
        />

        <AiBridge
          payload={PROMPT_CORPUS_CERRADO.text}
          copyLabel="Copiar prompt de corpus cerrado"
          tools={[AI_TOOL_NOTEBOOK]}
          note="Opcional. Si tienes un cuaderno propio con fuentes públicas, puedes replicar la demostración. La clase avanza igual si solo la observas."
        />

        <Field
          label="Nota de la demostración (opcional)"
          hint="Algo que hayas observado y quieras conservar."
          value={s.note}
          onChange={v => update(d => ({ ...d, b07: { ...d.b07, note: v } }))}
          rows={2}
        />
      </section>

      {/* ── Confidencialidad ── */}
      <section aria-labelledby="confidencialidad" className="space-y-4">
        <h2 id="confidencialidad" className="text-lg font-bold text-white">Confidencialidad y datos</h2>

        <Callout kind="alerta" title="Regla DIAT">
          <p>{confidentialityRule.rule}</p>
        </Callout>

        <Prose>
          <p>{confidentialityRule.guide}</p>
          <p>
            Antes de incorporar antecedentes de clientes, la Guía recomienda evaluar:{' '}
            {confidentialityRule.beforeUploading.join(', ').toLowerCase()}; con consentimiento expreso
            e informado cuando corresponda.
          </p>
        </Prose>

        <div className="grid gap-2.5 sm:grid-cols-2">
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/[0.06] p-3.5">
            <div className="mono text-[10px] font-bold uppercase tracking-widest text-cyan-400">
              {confidentialityRule.law.date}
            </div>
            <h3 className="mt-1 text-sm font-semibold text-white">{confidentialityRule.law.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{confidentialityRule.law.detail}</p>
          </div>
          <div className="rounded-xl border border-white/[0.10] bg-white/[0.02] p-3.5">
            <div className="mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              En tramitación
            </div>
            <h3 className="mt-1 text-sm font-semibold text-white">{confidentialityRule.bill.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{confidentialityRule.bill.detail}</p>
          </div>
        </div>
      </section>
    </>
  );
}
