'use client';
// B04 · PROMPT LAB — Producto A.
//
// Refundación de la lógica del Prompt Lab general para la Clase 1: sin scores,
// sin «anti-alucinaciones», sin agentes y sin premiar la completitud. La
// cobertura DIAT se muestra como mapa de decisiones, no como puntuación: un
// componente ausente pero innecesario es correcto y se marca como tal.
import { useState } from 'react';
import { diatComponents, promptLabSteps, riskLevels, rubric, rubricNote, type ComponentId } from '@/content/class1/activities';
import { PROMPT_DIAGNOSTICO, PROMPT_DIAT_REFERENCIA, type RiskLevel } from '@/content/class1/prompts';
import { workingDocument, workingDocumentLabel } from '@/content/class1/document';
import { useClass1, useVisitBlock } from '@/lib/class1/store';
import { Callout, CheckGroup, ChoiceGroup, Field, Prose, PromptBlock, StepHeading, TextField } from '../ui';
import { ConceptLink } from '../ConceptPanel';

/** Componentes que el nivel de riesgo hace esperables. Orienta; no obliga. */
const expectedByRisk: Record<RiskLevel, ComponentId[]> = {
  bajo: ['tarea', 'formato'],
  medio: ['contexto', 'tarea', 'fuentes', 'restricciones', 'formato', 'control'],
  alto: ['contexto', 'tarea', 'fuentes', 'restricciones', 'formato', 'control'],
};

export function B04() {
  useVisitBlock('b04');
  const { state, update, hydrated } = useClass1();
  const [revealed, setRevealed] = useState(false);
  const a = state.productA;

  const expected = a.risk ? expectedByRisk[a.risk] : [];

  function coverage(id: ComponentId): { mark: string; tone: string; label: string } {
    const present = a.components.includes(id);
    const isExpected = expected.includes(id);
    if (present) return { mark: '●', tone: 'text-emerald-400', label: 'Incluido' };
    if (!isExpected) return { mark: '○', tone: 'text-zinc-600', label: 'No necesario' };
    return { mark: '△', tone: 'text-amber-400', label: 'Revisar' };
  }

  return (
    <>
      <Prose>
        <p>
          El prompt no aparece completo de una vez: se construye como especificación progresiva.
          Cada capa que se añade es una decisión que dejas de delegar.
        </p>
      </Prose>

      <section aria-labelledby="progresion" className="space-y-3">
        <h2 id="progresion" className="text-lg font-bold text-white">De tres palabras a un encargo controlable</h2>
        <PromptBlock label="Punto de partida · Prompt 0" text={PROMPT_DIAGNOSTICO.text} />
        <div className="space-y-2">
          {promptLabSteps.map(s => (
            <div key={s.step} className="rounded-xl border border-white/[0.10] bg-white/[0.02] p-3.5">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="mono flex h-5 w-5 items-center justify-center rounded border border-cyan-500/30 bg-cyan-500/10 text-[10px] font-bold text-cyan-400">
                  {s.step}
                </span>
                <span className="mono text-[11px] font-bold uppercase tracking-widest text-cyan-400">{s.component}</span>
              </div>
              <p className="mono mt-2 text-[12.5px] leading-relaxed text-zinc-300">«{s.text}»</p>
              <p className="mt-1.5 text-xs text-zinc-500">
                <span className="text-zinc-400">Deja de decidir:</span> {s.stopsDeciding}
              </p>
            </div>
          ))}
        </div>

        {!revealed ? (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="w-full rounded-xl border border-dashed border-white/20 px-4 py-3 text-sm text-zinc-400 transition-colors hover:border-cyan-500/40 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
          >
            Ver el Prompt DIAT de referencia — <span className="text-zinc-600">construye el tuyo primero</span>
          </button>
        ) : (
          <>
            <PromptBlock label="Prompt DIAT de referencia · versión canónica" text={PROMPT_DIAT_REFERENCIA.text} />
            <Callout kind="alerta" title="Advertencia que acompaña siempre a este prompt">
              <p>
                <strong>Este prompt no tiene Rol, y es deliberado.</strong> Están los otros seis
                componentes trabajando juntos y el resultado no sufre por la ausencia del séptimo.
                Si el séptimo puede faltar sin daño en un prompt de referencia, entonces los siete
                nunca fueron obligatorios: lo que decide qué componentes incluir no es la plantilla,
                es el riesgo de la tarea.
              </p>
            </Callout>
          </>
        )}
      </section>

      <hr className="border-white/[0.08]" />

      <section aria-labelledby="producto-a" className="space-y-5 rounded-xl border border-indigo-500/25 bg-indigo-500/[0.04] p-4 sm:p-5">
        <div>
          <div className="mono text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-300">
            Producto A · hito de tu Bitácora
          </div>
          <h2 id="producto-a" className="mt-1 text-lg font-bold text-white">Construye tu propio encargo</h2>
          <p className="mt-1.5 text-sm text-zinc-400">
            Toma una tarea jurídica que harías de verdad. La consigna va contra el instinto de todo el
            mundo: <strong>no lo hagas más largo, hazlo menos ambiguo</strong>.
          </p>
        </div>

        {!workingDocument.defined && (
          <p className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-xs text-zinc-500">
            {workingDocument.fallbackNote}
          </p>
        )}

        <StepHeading n={1}>Mi tarea jurídica</StepHeading>
        <Field
          label="¿Qué necesitas que se haga?"
          hint={`Puedes trabajar sobre ${workingDocumentLabel().toLowerCase()} o sobre una tarea propia.`}
          value={a.task}
          onChange={v => update(d => ({ ...d, productA: { ...d.productA, task: v } }))}
          rows={2}
          placeholder="Extraer las cláusulas de terminación anticipada de un contrato que voy a revisar…"
        />

        <StepHeading n={2}>Nivel de riesgo</StepHeading>
        <ChoiceGroup
          legend="¿Qué pasa si la salida está mal y no lo detecto?"
          options={riskLevels.map(r => ({ id: r.id, label: r.label, hint: r.examples }))}
          value={a.risk}
          onChange={id => update(d => ({ ...d, productA: { ...d.productA, risk: id as RiskLevel } }))}
          disabled={!hydrated}
          columns={3}
        />

        <StepHeading n={3}>Decisiones que no quiero delegar</StepHeading>
        <Field
          label="¿Qué debe quedar resuelto por ti y no por el sistema?"
          value={a.notDelegating}
          onChange={v => update(d => ({ ...d, productA: { ...d.productA, notDelegating: v } }))}
          rows={2}
          placeholder="Qué fuentes son admisibles; qué hacer si un dato no consta…"
        />

        <StepHeading n={4}>Componentes pertinentes</StepHeading>
        <CheckGroup
          legend="Marca solo los que esta tarea necesita"
          note="No busques marcarlos todos. Un prompt de riesgo bajo con dos componentes bien elegidos está correcto."
          options={diatComponents.map(c => ({
            id: c.id,
            label: c.label + (c.signature ? ' · aporte DIAT' : ''),
            hint: c.question,
          }))}
          values={a.components}
          onToggle={id =>
            update(d => {
              const cid = id as ComponentId;
              const has = d.productA.components.includes(cid);
              return {
                ...d,
                productA: {
                  ...d.productA,
                  components: has
                    ? d.productA.components.filter(x => x !== cid)
                    : [...d.productA.components, cid],
                },
              };
            })
          }
        />

        {a.risk && (
          <div className="rounded-xl border border-white/[0.10] bg-[oklch(0.07_0.015_250)] p-4">
            <div className="mono mb-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">
              Mapa de cobertura · {riskLevels.find(r => r.id === a.risk)?.label}
            </div>
            <ul className="space-y-1">
              {diatComponents.map(c => {
                const cov = coverage(c.id);
                return (
                  <li key={c.id} className="flex items-center gap-3 text-[13px]">
                    <span className={`mono w-4 shrink-0 text-center ${cov.tone}`} aria-hidden>{cov.mark}</span>
                    <span className="mono w-28 shrink-0 uppercase tracking-wider text-zinc-400">{c.label}</span>
                    <span className={`${cov.tone} text-xs`}>{cov.label}</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 border-t border-white/[0.06] pt-2.5 text-xs text-zinc-500">
              Gris no es una carencia: es un componente que esta tarea no necesita. La distinción entre
              gris y ámbar es todo el contenido del ejercicio. Este mapa no puntúa la calidad jurídica
              de tu prompt: eso no lo puede hacer una plataforma.
            </p>
          </div>
        )}

        <StepHeading n={5}>Mi prompt</StepHeading>
        <Field
          label="Escríbelo completo"
          value={a.prompt}
          onChange={v => update(d => ({ ...d, productA: { ...d.productA, prompt: v } }))}
          rows={9}
          placeholder="Escribe aquí tu encargo…"
        />

        <StepHeading n={6}>Tres decisiones de diseño que puedo justificar</StepHeading>
        <div className="space-y-3">
          {[0, 1, 2].map(i => (
            <div key={i} className="grid gap-2 sm:grid-cols-2">
              <TextField
                label={`Decisión ${i + 1}`}
                value={a.decisions[i]}
                onChange={v =>
                  update(d => {
                    const next = [...d.productA.decisions] as [string, string, string];
                    next[i] = v;
                    return { ...d, productA: { ...d.productA, decisions: next } };
                  })
                }
                placeholder="Delimité la fuente al documento adjunto"
              />
              <TextField
                label="Por qué la tomé"
                value={a.reasons[i]}
                onChange={v =>
                  update(d => {
                    const next = [...d.productA.reasons] as [string, string, string];
                    next[i] = v;
                    return { ...d, productA: { ...d.productA, reasons: next } };
                  })
                }
                placeholder="Porque la autoridad de lo que afirme depende de dónde venga"
              />
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="rubrica">
        <h2 id="rubrica" className="mb-1 text-lg font-bold text-white">Rúbrica DIAT de autoevaluación</h2>
        <p className="mb-3 text-xs text-zinc-500">{rubricNote}</p>
        <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.03]">
                <th scope="col" className="mono px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Criterio</th>
                <th scope="col" className="mono px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Pregunta</th>
                <th scope="col" className="mono px-3 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-zinc-400">0</th>
                <th scope="col" className="mono px-3 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-zinc-400">1</th>
                <th scope="col" className="mono px-3 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-zinc-400">2</th>
              </tr>
            </thead>
            <tbody>
              {rubric.map(r => (
                <tr key={r.id} className="border-b border-white/[0.05] last:border-0">
                  <td className="px-3 py-2 font-medium text-zinc-200">{r.criterion}</td>
                  <td className="px-3 py-2 text-xs text-zinc-400">{r.question}</td>
                  {r.levels.map(l => (
                    <td key={l} className="px-3 py-2 text-center text-xs text-zinc-500">{l}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout kind="idea">
        <p>
          No escribiste un prompt más bonito: <strong>recuperaste decisiones</strong>. Y si la tarea
          pasara a riesgo alto, la iteración disponible es añadir: «Antes de responder, indica qué
          información te falta para ejecutar esta tarea correctamente». Convierte el prompt en un
          intercambio y evita que el sistema suponga lo que no sabe.{' '}
          <ConceptLink id="proporcionalidad">Ver proporcionalidad</ConceptLink>
        </p>
      </Callout>
    </>
  );
}
