'use client';
// B08 · ICJR STUDIO — Producto B.
import {
  claimActions, claimStates, epistemicStatuses, icjrPhases, icjrPriority, notVerifiedRule, solvedRow,
  type ClaimAction, type ClaimState, type EpistemicStatus,
} from '@/content/class1/activities';
import { PROMPT_AFIRMACIONES_VERIFICABLES } from '@/content/class1/prompts';
import { useClass1, useVisitBlock } from '@/lib/class1/store';
import { emptyClaim } from '@/lib/class1/state';
import { Callout, Field, Prose, PromptBlock, ResponsiveRows, SelectField, Statement, TextField } from '../ui';
import { ConceptLink } from '../ConceptPanel';

export function B08() {
  useVisitBlock('b08');
  const { state, update } = useClass1();
  const s = state.b08;

  function setClaim(id: string, patch: Partial<(typeof s.claims)[number]>) {
    update(d => ({
      ...d,
      b08: { ...d.b08, claims: d.b08.claims.map(c => (c.id === id ? { ...c, ...patch } : c)) },
    }));
  }

  return (
    <>
      <Prose>
        <p>
          Decir «hay que revisar lo que dice la IA» es correcto y bastante inútil. ¿Qué significa
          revisar? ¿Cuánto? ¿Contra qué? ¿Y cómo se demuestra después que se hizo?{' '}
          <strong>ICJR</strong> convierte esa recomendación en cuatro operaciones, un producto y un
          registro.
        </p>
      </Prose>

      <section aria-labelledby="protocolo" className="space-y-2.5">
        <h2 id="protocolo" className="text-lg font-bold text-white">El protocolo</h2>
        {icjrPhases.map(p => (
          <div key={p.letter} className="rounded-xl border border-white/[0.10] bg-white/[0.02] p-4">
            <div className="flex items-start gap-3.5">
              <span className="mono flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-lg font-bold text-cyan-400">
                {p.letter}
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-bold uppercase tracking-wide text-white">{p.name}</h3>
                <p className="mt-0.5 text-sm italic text-zinc-400">{p.question}</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">{p.operation}</p>
                <dl className="mt-2.5 grid gap-2 border-t border-white/[0.06] pt-2.5 text-xs sm:grid-cols-2">
                  <div>
                    <dt className="mono text-[9px] font-bold uppercase tracking-widest text-emerald-400">Resultado esperado</dt>
                    <dd className="text-zinc-400">{p.expected}</dd>
                  </div>
                  <div>
                    <dt className="mono text-[9px] font-bold uppercase tracking-widest text-rose-400">Error que evita</dt>
                    <dd className="text-zinc-400">{p.avoids}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </section>

      <Statement caption="Son complementarios y ninguno sustituye al otro." tone="accent">
        <ConceptLink id="icjr">Control ex ante · ICJR ex post</ConceptLink>
      </Statement>

      <section aria-labelledby="estatus">
        <h2 id="estatus" className="mb-1 text-lg font-bold text-white">
          <ConceptLink id="estatus">Cinco estatus epistémicos</ConceptLink>
        </h2>
        <p className="mb-3 text-sm text-zinc-400">
          Antes de contrastar hay que saber qué clase de afirmación se tiene delante: cada clase se
          verifica de manera distinta y algunas no se verifican en absoluto.
        </p>
        <ResponsiveRows
          head={['', 'Estatus', 'Qué significa', 'Cómo se comprueba', 'Uso jurídico admisible']}
          rows={epistemicStatuses.map(e => [
            <span key="i" className="mono text-base font-bold text-cyan-400">{e.id}</span>,
            <span key="l" className="font-medium text-white">{e.label}</span>,
            e.meaning,
            e.howToCheck,
            e.admissibleUse,
          ])}
        />
      </section>

      <Callout kind="verifica" title="La verificación también es proporcional al riesgo">
        <p>
          <strong>Orden de prioridad.</strong> {icjrPriority.order.map((o, i) => `${i + 1}. ${o}`).join(' · ')}
        </p>
        <p>
          <strong>Jerarquía de fuentes.</strong> {icjrPriority.hierarchy} {icjrPriority.rule}
        </p>
      </Callout>

      <section aria-labelledby="resuelta">
        <h2 id="resuelta" className="mb-3 text-lg font-bold text-white">Una fila resuelta</h2>
        <ResponsiveRows
          head={['Afirmación generada', 'Estatus', 'Fuente contrastada', 'Localizador', 'Estado → Acción']}
          rows={[[
            <em key="c">«{solvedRow.claim}»</em>,
            <span key="s" className="mono font-bold text-cyan-400">{solvedRow.status}</span>,
            solvedRow.source,
            <span key="l" className="mono text-xs">{solvedRow.locator}</span>,
            <span key="a" className="text-emerald-400">Confirmada → mantener</span>,
          ]]}
        />
      </section>

      <PromptBlock
        label="Prompt de apoyo · paso I"
        text={PROMPT_AFIRMACIONES_VERIFICABLES.text}
        footer={PROMPT_AFIRMACIONES_VERIFICABLES.warning}
      />

      {/* ── Matriz del estudiante ── */}
      <section aria-labelledby="matriz" className="space-y-4 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.04] p-4 sm:p-5">
        <div>
          <div className="mono text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
            Producto B · hito de tu Bitácora
          </div>
          <h2 id="matriz" className="mt-1 text-lg font-bold text-white">Tu matriz ICJR</h2>
          <p className="mt-1.5 text-sm text-zinc-400">
            Toma <strong>dos afirmaciones</strong> concretas de la salida que produjiste con tu prompt.
            Dos bien hechas valen más que cinco a medias.
          </p>
        </div>

        {s.claims.map((c, i) => (
          <div key={c.id} className="space-y-3 rounded-xl border border-white/[0.10] bg-[oklch(0.08_0.016_250)] p-3.5">
            <div className="mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Afirmación {i + 1}
            </div>
            <Field
              label="Afirmación generada"
              value={c.claim}
              onChange={v => setClaim(c.id, { claim: v })}
              rows={2}
              placeholder="Pega aquí la afirmación tal como la produjo la IA…"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <SelectField
                label="Estatus (A–E)"
                value={c.status}
                onChange={v => setClaim(c.id, { status: v as EpistemicStatus | null })}
                options={epistemicStatuses.map(e => ({ id: e.id, label: `${e.id} · ${e.label}` }))}
              />
              <TextField
                label="Fuente contrastada"
                value={c.source}
                onChange={v => setClaim(c.id, { source: v })}
                placeholder="Sentencia, Código, base oficial…"
              />
              <TextField
                label="Localizador"
                value={c.locator}
                onChange={v => setClaim(c.id, { locator: v })}
                placeholder="Considerando 7.º / Art. 2515 inc. 1.º"
              />
              <SelectField
                label="Estado"
                value={c.state}
                onChange={v => {
                  const st = v as ClaimState | null;
                  const suggested = st ? claimStates.find(x => x.id === st)?.action : undefined;
                  setClaim(c.id, {
                    state: st,
                    action: c.action ?? ((suggested as ClaimAction | undefined) ?? null),
                  });
                }}
                options={claimStates.map(x => ({ id: x.id, label: x.label }))}
              />
              <SelectField
                label="Acción"
                value={c.action}
                onChange={v => setClaim(c.id, { action: v as ClaimAction | null })}
                options={claimActions.map(x => ({ id: x.id, label: x.label }))}
              />
            </div>
            {c.status === 'C' && (
              <p className="rounded-lg border border-indigo-500/25 bg-indigo-500/[0.06] px-3 py-2 text-xs text-indigo-200">
                Estatus C: esta afirmación no se «verifica». Se evalúa el razonamiento y se declara
                siempre como inferencia.
              </p>
            )}
            {c.state === 'no-verificable' && (
              <p className="rounded-lg border border-emerald-500/25 bg-emerald-500/[0.06] px-3 py-2 text-xs text-emerald-200">
                «No verificable» es un resultado válido, no un fracaso. La acción coherente es investigar.
              </p>
            )}
          </div>
        ))}

        {s.claims.length < 4 && (
          <button
            type="button"
            onClick={() =>
              update(d => ({
                ...d,
                b08: { ...d.b08, claims: [...d.b08.claims, emptyClaim(`c${d.b08.claims.length + 1}`)] },
              }))
            }
            className="w-full rounded-lg border border-dashed border-white/20 px-3 py-2.5 text-xs text-zinc-400 transition-colors hover:border-emerald-500/40 hover:text-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
          >
            Añadir otra afirmación — elige la que más te gustaría que fuera verdad
          </button>
        )}

        <div className="grid gap-3 border-t border-white/[0.08] pt-4 sm:grid-cols-2">
          <TextField
            label="Quién verificó"
            value={s.verifiedBy}
            onChange={v => update(d => ({ ...d, b08: { ...d.b08, verifiedBy: v } }))}
            placeholder="Tu nombre"
          />
          <TextField
            label="Fecha de la verificación"
            type="date"
            value={s.verifiedAt}
            onChange={v => update(d => ({ ...d, b08: { ...d.b08, verifiedAt: v } }))}
          />
        </div>
        <Field
          label="Registro (paso R)"
          hint="Qué revisaste, contra qué fuente y qué decidiste. Debe poder reconstruirlo un tercero."
          value={s.notes}
          onChange={v => update(d => ({ ...d, b08: { ...d.b08, notes: v } }))}
          rows={3}
        />
      </section>

      <Callout kind="verifica" title="La pregunta que decide el ejercicio">
        <p>
          <strong>¿Leíste el considerando, o solo comprobaste que existe?</strong> Si la respuesta es
          la segunda, la afirmación todavía no está verificada: está localizada. La diferencia entre
          ambas es exactamente el error tipo 2.
        </p>
      </Callout>

      <Statement caption={notVerifiedRule}>«NO VERIFICADA» es un resultado válido.</Statement>
    </>
  );
}
