'use client';
// ─────────────────────────────────────────────────────────────────────────────
// ETAPA 4 · PRUEBA Y VERIFICA
//
// Mini ICJR: identificar, contrastar, justificar, registrar. Una sola
// afirmación es obligatoria; la segunda es opcional. No hay matriz, no hay
// clasificación epistémica A–E: el objetivo es que el estudiante experimente el
// procedimiento, no que memorice cinco códigos.
// ─────────────────────────────────────────────────────────────────────────────
import Link from 'next/link';
import { Plus, Trash2 } from 'lucide-react';
import { claimActions, type ClaimAction } from '@/content/class1/activities';
import { useClass1 } from '@/lib/class1/store';
import { emptyClaim, type VerifiedClaim } from '@/lib/class1/state';
import { AiBridge } from '../AiBridge';
import {
  Brief, ChipRadio, CopyButton, Field, Notice, Panel, StepHeading, TextField,
} from '../ui';

const MAX_CLAIMS = 2;

export function Verificacion() {
  const { state, update, hydrated } = useClass1();
  const prompt = state.promptV2.text.trim() || state.promptV1.text.trim();
  const claims = state.verification.claims;

  function setClaim(id: string, patch: Partial<VerifiedClaim>) {
    update(s => ({
      ...s,
      verification: {
        claims: s.verification.claims.map(c => (c.id === id ? { ...c, ...patch } : c)),
      },
    }));
  }

  return (
    <>
      <Panel className="border-indigo-500/25 bg-indigo-500/[0.04]">
        <StepHeading n={1}>Copia tu Prompt V2 y ejecútalo</StepHeading>
        <Brief>Después elige una afirmación jurídicamente relevante de la respuesta.</Brief>
        <div className="mt-4 flex flex-wrap gap-2">
          <CopyButton text={prompt} label="Copiar Prompt V2" variant="primary" disabled={!hydrated || !prompt} />
          <AiBridge
            selected={state.audit.tool}
            onSelect={id => update(s => ({ ...s, audit: { ...s.audit, tool: id } }))}
          />
        </div>
        {hydrated && !prompt && (
          <div className="mt-3">
            <Notice tone="warn">
              Todavía no tienes prompt.{' '}
              <Link href="/clase-1/prompt" className="underline underline-offset-2">Constrúyelo aquí</Link>.
            </Notice>
          </div>
        )}
      </Panel>

      {claims.map((claim, i) => (
        <Panel key={claim.id} className="border-emerald-500/25 bg-emerald-500/[0.04]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <StepHeading n={i + 2}>
              {i === 0 ? 'Comprueba una afirmación' : 'Segunda afirmación'}
            </StepHeading>
            {i > 0 && (
              <button
                type="button"
                onClick={() =>
                  update(s => ({
                    ...s,
                    verification: { claims: s.verification.claims.filter(c => c.id !== claim.id) },
                  }))
                }
                className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-white/[0.12] px-2.5 py-1.5 text-xs text-zinc-400 transition-colors hover:border-rose-500/40 hover:text-rose-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
                Quitar
              </button>
            )}
          </div>

          <div className="space-y-4">
            <Field
              label="I · Afirmación que voy a comprobar"
              value={claim.claim}
              onChange={v => setClaim(claim.id, { claim: v })}
              rows={3}
              placeholder="Pega aquí la afirmación tal como la produjo la IA…"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField
                label="C · ¿Con qué fuente la comprobaste?"
                value={claim.source}
                onChange={v => setClaim(claim.id, { source: v })}
                placeholder="Código Civil, sentencia, base oficial…"
              />
              <TextField
                label="J · ¿Dónde está exactamente?"
                value={claim.locator}
                onChange={v => setClaim(claim.id, { locator: v })}
                placeholder="Art. 2515 inc. 1.º · Considerando 7.º · pág. 12"
              />
            </div>
            <ChipRadio
              legend="R · ¿Qué haces con la afirmación?"
              options={claimActions.map(a => ({ id: a.id, label: a.label }))}
              value={claim.action}
              onChange={id => setClaim(claim.id, { action: id as ClaimAction })}
              columns={3}
            />
          </div>
        </Panel>
      ))}

      {claims.length < MAX_CLAIMS && (
        <button
          type="button"
          onClick={() =>
            update(s => ({
              ...s,
              verification: { claims: [...s.verification.claims, emptyClaim(`c${s.verification.claims.length + 1}`)] },
            }))
          }
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 px-4 py-3 text-sm text-zinc-400 transition-colors hover:border-emerald-500/40 hover:text-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
        >
          <Plus className="h-4 w-4 shrink-0" aria-hidden />
          Verificar una segunda afirmación
          <span className="text-zinc-600">· opcional</span>
        </button>
      )}
    </>
  );
}
