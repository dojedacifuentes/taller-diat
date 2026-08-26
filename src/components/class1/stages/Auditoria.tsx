'use client';
// ─────────────────────────────────────────────────────────────────────────────
// ETAPA 3 · AUDITORÍA DEL PROPIO PROMPT
//
// No es una explicación sobre metaprompting: es una acción. Un ejemplo de dos
// líneas, un botón que copia el paquete completo —metaprompt + el prompt real
// del estudiante, con delimitadores— y dos decisiones que obligan a distinguir
// auditar de obedecer.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect } from 'react';
import Link from 'next/link';
import { METAPROMPT_AUDITORIA } from '@/content/class1/prompts';
import { useClass1 } from '@/lib/class1/store';
import { AiBridge } from '../AiBridge';
import {
  Brief, CopyButton, DownloadButton, Field, Notice, Panel, PromptBlock, StepHeading, downloadText,
} from '../ui';

export const PROMPT_OPEN = '<<<INICIO DEL PROMPT>>>';
export const PROMPT_CLOSE = '<<<FIN DEL PROMPT>>>';

/**
 * Paquete de auditoría. Se copia entero: al pegarlo, la IA empieza a auditar el
 * prompt real del estudiante sin que él tenga que explicar nada más.
 */
export function buildAuditPackage(promptV1: string): string {
  return [
    METAPROMPT_AUDITORIA.text,
    '',
    'PROMPT QUE DEBES AUDITAR:',
    '',
    PROMPT_OPEN,
    '',
    promptV1.trim(),
    '',
    PROMPT_CLOSE,
  ].join('\n');
}

export function Auditoria() {
  const { state, update, hydrated } = useClass1();
  const promptV1 = state.promptV1.text.trim();
  const audit = state.audit;

  // El editor del Prompt V2 se siembra una sola vez con el V1: a partir de ahí
  // es del estudiante y nada lo vuelve a pisar.
  useEffect(() => {
    if (!hydrated || !promptV1) return;
    if (state.promptV2.seeded) return;
    update(s => ({ ...s, promptV2: { text: promptV1, at: null, seeded: true } }));
  }, [hydrated, promptV1, state.promptV2.seeded, update]);

  if (hydrated && !promptV1) {
    return (
      <Notice tone="warn">
        Todavía no tienes un prompt que auditar.{' '}
        <Link href="/clase-1/prompt" className="underline underline-offset-2">Vuelve a construirlo</Link>.
      </Notice>
    );
  }

  const pack = buildAuditPackage(promptV1);
  const promptV2 = state.promptV2.text;

  return (
    <>
      <Panel>
        <div className="space-y-3">
          <div>
            <div className="mono text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
              Prompt original
            </div>
            <p className="mono mt-1.5 text-[12.5px] text-zinc-300">«Analiza esta sentencia.»</p>
          </div>
          <div>
            <div className="mono text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
              Qué vamos a hacer
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-300">
              Pedirle a la IA que <strong className="text-white">no ejecute todavía la tarea</strong> y
              audite la instrucción.
            </p>
          </div>
        </div>
      </Panel>

      <Panel className="border-indigo-500/25 bg-indigo-500/[0.04]">
        <StepHeading n={1}>Copia el paquete de auditoría</StepHeading>
        <Brief>Lleva dentro tu Prompt V1: no tienes que pegar nada más.</Brief>
        <div className="mt-4">
          <PromptBlock
            label="Metaprompt + tu Prompt V1"
            text={pack}
            actions={<CopyButton text={pack} label="Copiar para auditar en IA" variant="primary" />}
          />
        </div>

        <div className="mt-6">
          <StepHeading n={2}>Pégalo en ChatGPT, Claude o Gemini</StepHeading>
          <div className="mt-3">
            <AiBridge
              selected={audit.tool}
              onSelect={id => update(s => ({ ...s, audit: { ...s.audit, tool: id } }))}
            />
          </div>
        </div>

        <div className="mt-6">
          <StepHeading n={3}>Revisa la respuesta</StepHeading>
        </div>

        <div className="mt-6">
          <StepHeading n={4}>Vuelve aquí y decide</StepHeading>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field
              label="Una sugerencia que acepté"
              value={audit.accepted}
              onChange={v => update(s => ({ ...s, audit: { ...s.audit, accepted: v } }))}
              rows={2}
            />
            <Field
              label="Una sugerencia que rechacé"
              value={audit.rejected}
              onChange={v => update(s => ({ ...s, audit: { ...s.audit, rejected: v } }))}
              rows={2}
            />
          </div>
          <div className="mt-3">
            <Field
              label="¿Por qué?"
              hint="Auditar no significa obedecer."
              value={audit.why}
              onChange={v => update(s => ({ ...s, audit: { ...s.audit, why: v } }))}
              rows={2}
            />
          </div>
        </div>
      </Panel>

      <div className="space-y-3">
        <h2 className="text-lg font-bold text-white">Prompt V2 · auditado</h2>
        <Field
          label="Introduce los cambios que consideres pertinentes"
          value={promptV2}
          onChange={v => update(s => ({ ...s, promptV2: { text: v, at: new Date().toISOString(), seeded: true } }))}
          rows={12}
          mono
        />
        <div className="flex flex-wrap gap-2">
          <CopyButton text={promptV2} label="Copiar Prompt V2" variant="primary" disabled={!promptV2.trim()} />
          <DownloadButton
            onClick={() => downloadText(promptV2, 'DIAT_Clase_1_prompt_v2.txt')}
            disabled={!promptV2.trim()}
          />
        </div>
        <Notice>Este también se pega y se ejecuta: no lo dejes con huecos por rellenar.</Notice>
      </div>
    </>
  );
}

