'use client';
// B05 · METAPROMPTING + AI BRIDGE — auditoría del propio Producto A.
import { metapromptGuidance, metapromptLimits, metapromptModes } from '@/content/class1/activities';
import { AI_TOOLS, METAPROMPT_AUDITORIA } from '@/content/class1/prompts';
import { useClass1, useVisitBlock } from '@/lib/class1/store';
import { AiBridge } from '../AiBridge';
import { Callout, Field, Prose, PromptBlock, ResponsiveRows, Statement, StepHeading } from '../ui';
import { ConceptLink } from '../ConceptPanel';

export function B05() {
  useVisitBlock('b05');
  const { state, update } = useClass1();
  const s = state.b05;
  const a = state.productA;

  const payload = a.prompt.trim()
    ? `${METAPROMPT_AUDITORIA.text}\n\n─────────────────────────────\nMI PROMPT:\n\n${a.prompt.trim()}`
    : METAPROMPT_AUDITORIA.text;

  return (
    <>
      <Prose>
        <p>
          Metaprompting es pedirle a un modelo que critique, complete o reestructure una instrucción
          destinada a otro uso con IA. Sirve para externalizar la revisión <strong>formal</strong> del
          encargo; no para decidir <strong>cuál es</strong> el encargo.
        </p>
      </Prose>

      <ResponsiveRows
        head={['Modalidad', 'Qué hace la IA', 'Cuándo sirve', 'Riesgo']}
        rows={metapromptModes.map(m => [
          <span key="a" className="font-medium text-white">{m.label}</span>,
          m.does,
          m.when,
          m.risk,
        ])}
      />

      <Statement caption="Invertir el orden produce profesionales que saben pedir prompts pero no diagnosticar encargos — que es la competencia que sobrevive al cambio de herramienta.">
        Primero el profesional construye la especificación.
        <br />
        Después la IA la audita.
      </Statement>

      <section aria-labelledby="metaprompt" className="space-y-3">
        <h2 id="metaprompt" className="text-lg font-bold text-white">Metaprompt canónico de auditoría</h2>
        <PromptBlock
          label="Metaprompt de auditoría · versión canónica"
          text={METAPROMPT_AUDITORIA.text}
          footer={METAPROMPT_AUDITORIA.warning}
        />
      </section>

      <section aria-labelledby="bridge" className="space-y-4 rounded-xl border border-indigo-500/25 bg-indigo-500/[0.04] p-4 sm:p-5">
        <div>
          <h2 id="bridge" className="text-lg font-bold text-white">Lleva tu Producto A a tu herramienta</h2>
          <p className="mt-1.5 text-sm text-zinc-400">
            Usa tu propia cuenta. La plataforma no ejecuta el modelo por ti.
          </p>
        </div>

        {!a.prompt.trim() && (
          <Callout kind="alerta">
            <p>
              Todavía no has escrito tu prompt en B04. Puedes copiar solo el metaprompt, pero la
              auditoría es mucho más útil sobre tu propio encargo.
            </p>
          </Callout>
        )}

        <StepHeading n={1}>Copiar y ejecutar fuera</StepHeading>
        <AiBridge
          payload={payload}
          copyLabel="Copiar metaprompt + mi Producto A"
          tools={AI_TOOLS}
          selectedTool={s.tool}
          onSelectTool={id => update(d => ({ ...d, b05: { ...d.b05, tool: id } }))}
        />

        <StepHeading n={2}>Volver con el resultado</StepHeading>
        <Field
          label="Pega la auditoría"
          hint="Pega el resultado que obtuviste fuera de DIAT. Después decidirás qué aceptar y qué rechazar."
          value={s.audit}
          onChange={v => update(d => ({ ...d, b05: { ...d.b05, audit: v } }))}
          rows={7}
          maxLength={12000}
          placeholder="Pega aquí la auditoría devuelta por tu herramienta…"
        />

        <StepHeading n={3}>Decidir</StepHeading>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3 rounded-lg border border-emerald-500/25 bg-emerald-500/[0.05] p-3.5">
            <div className="mono text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-400">
              Una sugerencia que acepto
            </div>
            <Field
              label="Sugerencia"
              value={s.accepted}
              onChange={v => update(d => ({ ...d, b05: { ...d.b05, accepted: v } }))}
              rows={2}
            />
            <Field
              label="Por qué la acepto"
              value={s.acceptedWhy}
              onChange={v => update(d => ({ ...d, b05: { ...d.b05, acceptedWhy: v } }))}
              rows={2}
            />
          </div>
          <div className="space-y-3 rounded-lg border border-cyan-500/30 bg-cyan-500/[0.06] p-3.5">
            <div className="mono text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-400">
              Una sugerencia que rechazo
            </div>
            <p className="text-xs text-zinc-400">
              Vale más que la anterior. Rechazar bien demuestra que entendiste; aceptarlas todas
              demuestra lo contrario.
            </p>
            <Field
              label="Sugerencia"
              value={s.rejected}
              onChange={v => update(d => ({ ...d, b05: { ...d.b05, rejected: v } }))}
              rows={2}
            />
            <Field
              label="Con qué fundamento la rechazo"
              value={s.rejectedWhy}
              onChange={v => update(d => ({ ...d, b05: { ...d.b05, rejectedWhy: v } }))}
              rows={2}
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="decidir" className="grid gap-2.5 md:grid-cols-3">
        <h2 id="decidir" className="sr-only">Qué aceptar, qué cuestionar, qué nunca delegar</h2>
        <div className="rounded-xl border border-white/[0.10] bg-white/[0.02] p-3.5">
          <div className="mono text-[10px] font-bold uppercase tracking-widest text-emerald-400">Qué aceptar</div>
          <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{metapromptGuidance.accept}</p>
        </div>
        <div className="rounded-xl border border-white/[0.10] bg-white/[0.02] p-3.5">
          <div className="mono text-[10px] font-bold uppercase tracking-widest text-amber-400">Qué cuestionar</div>
          <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{metapromptGuidance.question}</p>
        </div>
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/[0.06] p-3.5">
          <div className="mono text-[10px] font-bold uppercase tracking-widest text-cyan-400">Qué nunca delegar</div>
          <p className="mt-1.5 text-xs leading-relaxed text-zinc-300">{metapromptGuidance.neverDelegate}</p>
        </div>
      </section>

      <Callout kind="alerta" title="Cinco límites del metaprompting">
        <ol className="space-y-1">
          {metapromptLimits.map((l, i) => (
            <li key={l}><strong className="text-rose-300">{i + 1}.</strong> {l}</li>
          ))}
        </ol>
      </Callout>

      <Statement caption="Un prompt auditado sigue produciendo salidas que hay que comprobar." tone="accent">
        <ConceptLink id="auditar-verificar">AUDITAR ≠ VERIFICAR</ConceptLink>
      </Statement>
    </>
  );
}
