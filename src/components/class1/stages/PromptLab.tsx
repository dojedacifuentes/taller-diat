'use client';
// ─────────────────────────────────────────────────────────────────────────────
// ETAPA 2 · PROMPT LAB
//
// El corazón de la Clase 1. El estudiante construye un encargo apretando
// botones y escribiendo muy poco. El prompt se escribe solo debajo, en tiempo
// real, y lo que se copia se ejecuta: sin marcadores, sin etiquetas por
// rellenar, con su propio material dentro.
//
// No se puntúa el prompt. No hay porcentajes de calidad ni «prompt perfecto»:
// hay decisiones tomadas y decisiones pendientes.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useMemo } from 'react';
import {
  applyTaskDefaults, compilePrompt, constraintOptions, controlOptions, depthOptions,
  formatOptions, missingMessage, sourceOptions, taskPresets, toneOptions,
  type PromptDraft, type PromptExtras, type SourceMode,
} from '@/content/class1/lab';
import { useClass1 } from '@/lib/class1/store';
import {
  Brief, ChipRadio, ChipToggles, Collapsible, CopyButton, DownloadButton, Field,
  Notice, Panel, PromptBlock, StepHeading, TextField, downloadText,
} from '../ui';

/** Tope generoso pero finito: un pegado desbocado no debe romper la entrega. */
const MATERIAL_MAX = 60000;

export function PromptLab() {
  const { state, update, hydrated } = useClass1();
  const draft = state.promptV1.draft;

  const compiled = useMemo(() => compilePrompt(draft), [draft]);

  function patch(fn: (d: PromptDraft) => PromptDraft) {
    update(s => ({ ...s, promptV1: { ...s.promptV1, draft: fn(s.promptV1.draft) } }));
  }

  function patchExtras(fn: (x: PromptExtras) => PromptExtras) {
    patch(d => ({ ...d, extras: fn(d.extras) }));
  }

  function toggle(key: 'constraints' | 'controls', id: string) {
    patch(d => ({
      ...d,
      [key]: d[key].includes(id) ? d[key].filter(x => x !== id) : [...d[key], id],
    }));
  }

  // Una edición manual manda sobre el compilador: si el estudiante tocó el
  // texto, dejamos de pisárselo.
  const manual = state.promptV1.manual.trim();
  const promptText = manual || compiled.text;
  const exportable = Boolean(manual) || compiled.ready;

  // El texto vigente se guarda en cuanto existe: la auditoría, la verificación
  // y la entrega leen de ahí sin recompilar ni adivinar.
  useEffect(() => {
    if (!hydrated) return;
    if (promptText === state.promptV1.text) return;
    update(s => ({
      ...s,
      promptV1: { ...s.promptV1, text: promptText, at: promptText ? new Date().toISOString() : s.promptV1.at },
    }));
  }, [promptText, hydrated, state.promptV1.text, update]);

  const task = taskPresets.find(t => t.id === draft.task);

  return (
    <>
      {/* 1 · Tarea */}
      <Panel>
        <StepHeading n={1}>¿Qué necesitas que haga la IA?</StepHeading>
        <div className="mt-4 space-y-4">
          <ChipRadio
            legend="Tarea"
            options={taskPresets.map(t => ({ id: t.id, label: t.label }))}
            value={draft.task}
            onChange={id => patch(d => applyTaskDefaults(d, id))}
            columns={3}
          />
          {task && (
            <Field
              label="¿Qué necesitas concretamente?"
              value={draft.taskDetail}
              onChange={v => patch(d => ({ ...d, taskDetail: v }))}
              rows={2}
              placeholder={task.placeholder}
            />
          )}
        </div>
      </Panel>

      {/* 2 · Contexto */}
      <Panel>
        <StepHeading n={2}>¿Para qué estás haciendo esto?</StepHeading>
        <div className="mt-4">
          <Field
            label="Contexto"
            value={draft.purpose}
            onChange={v => patch(d => ({ ...d, purpose: v }))}
            rows={2}
            placeholder="Estoy preparando una ficha de estudio para el examen de Civil."
          />
        </div>
      </Panel>

      {/* 3 · Fuentes */}
      <Panel>
        <StepHeading n={3}>¿Con qué información puede trabajar?</StepHeading>
        <div className="mt-4 space-y-4">
          <ChipRadio
            legend="Fuentes"
            options={sourceOptions.map(s => ({
              id: s.id,
              label: s.label,
              badge: s.recommended ? 'Recomendado' : undefined,
            }))}
            value={draft.source}
            onChange={id => patch(d => ({ ...d, source: id as SourceMode }))}
            columns={2}
          />

          {draft.source === 'pegar' && (
            <div>
              <Field
                label="Pega aquí el contenido sobre el que trabajará la IA"
                value={draft.material}
                onChange={v => patch(d => ({ ...d, material: v }))}
                rows={8}
                maxLength={MATERIAL_MAX}
                mono
                placeholder="Pega la sentencia, el contrato o el texto completo…"
              />
              <p className="mt-1.5 text-xs text-zinc-600">
                Se incorpora dentro del prompt entre delimitadores. No pegues datos personales ni
                antecedentes de clientes.
              </p>
            </div>
          )}

          {compiled.warning && <Notice tone="warn">{compiled.warning}</Notice>}
        </div>
      </Panel>

      {/* 4 · Restricciones */}
      <Panel>
        <StepHeading n={4}>¿Qué debe evitar?</StepHeading>
        <div className="mt-4">
          <ChipToggles
            legend="Restricciones"
            hint="Algunas vienen activadas según la tarea. Quita las que no correspondan."
            options={constraintOptions.map(c => ({ id: c.id, label: c.label }))}
            values={draft.constraints}
            onToggle={id => toggle('constraints', id)}
          />
        </div>
      </Panel>

      {/* 5 · Formato */}
      <Panel>
        <StepHeading n={5}>¿Cómo quieres recibir el resultado?</StepHeading>
        <div className="mt-4 space-y-4">
          <ChipRadio
            legend="Formato"
            options={formatOptions.map(f => ({ id: f.id, label: f.label }))}
            value={draft.format}
            onChange={id => patch(d => ({ ...d, format: id }))}
            columns={3}
          />
          <TextField
            label={draft.format === 'otro' ? 'Describe el formato' : 'Extensión aproximada (opcional)'}
            value={draft.formatDetail}
            onChange={v => patch(d => ({ ...d, formatDetail: v }))}
            placeholder={draft.format === 'otro' ? 'Un correo de tres párrafos.' : 'Máximo 150 palabras.'}
          />
        </div>
      </Panel>

      {/* 6 · Control */}
      <Panel>
        <StepHeading n={6}>¿Qué quieres poder comprobar después?</StepHeading>
        <div className="mt-4">
          <ChipToggles
            legend="Control"
            options={controlOptions.map(c => ({ id: c.id, label: c.label }))}
            values={draft.controls}
            onToggle={id => toggle('controls', id)}
          />
        </div>
      </Panel>

      {/* Extras */}
      <Collapsible summary="Agregar extras">
        <Brief>Nada de esto es obligatorio. No toda tarea necesita un rol.</Brief>
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField
            label="Rol"
            value={draft.extras.role}
            onChange={v => patchExtras(x => ({ ...x, role: v }))}
            placeholder="ayudante de Derecho procesal chileno"
          />
          <TextField
            label="Audiencia"
            value={draft.extras.audience}
            onChange={v => patchExtras(x => ({ ...x, audience: v }))}
            placeholder="estudiantes de tercer año"
          />
          <TextField
            label="Área jurídica"
            value={draft.extras.area}
            onChange={v => patchExtras(x => ({ ...x, area: v }))}
            placeholder="Derecho civil de contratos"
          />
          <TextField
            label="Jurisdicción"
            value={draft.extras.jurisdiction}
            onChange={v => patchExtras(x => ({ ...x, jurisdiction: v }))}
            placeholder="Chile"
          />
        </div>
        <ChipRadio
          legend="Profundidad"
          options={depthOptions.map(d => ({ id: d.id, label: d.label }))}
          value={draft.extras.depth}
          onChange={id => patchExtras(x => ({ ...x, depth: x.depth === id ? null : id }))}
          columns={3}
        />
        <ChipRadio
          legend="Tono"
          options={toneOptions.map(t => ({ id: t.id, label: t.label }))}
          value={draft.extras.tone}
          onChange={id => patchExtras(x => ({ ...x, tone: x.tone === id ? null : id }))}
          columns={3}
        />
        <Field
          label="Otras preferencias"
          value={draft.extras.other}
          onChange={v => patchExtras(x => ({ ...x, other: v }))}
          rows={2}
        />
      </Collapsible>

      {/* Preview */}
      <div id="tu-prompt" className="scroll-mt-6 space-y-3">
        <h2 className="text-lg font-bold text-white">Tu prompt</h2>
        {exportable ? (
          <>
            <PromptBlock
              label="Prompt V1"
              text={promptText}
              actions={
                <>
                  <CopyButton text={promptText} label="Copiar prompt" variant="primary" />
                  <DownloadButton onClick={() => downloadText(promptText, 'DIAT_Clase_1_prompt_v1.txt')} />
                </>
              }
              note={
                compiled.warning ? (
                  <>{compiled.warning}</>
                ) : (
                  <>Pégalo tal cual en ChatGPT, Claude o Gemini: la tarea empieza sin más pasos.</>
                )
              }
            />
            <Collapsible summary={manual ? 'Editar · texto propio activo' : 'Editar el texto a mano'}>
              <Field
                label="Prompt V1"
                hint="Con este campo vacío manda el prompt compilado. En cuanto escribas aquí, manda tu texto."
                value={state.promptV1.manual}
                onChange={v => update(s => ({ ...s, promptV1: { ...s.promptV1, manual: v } }))}
                rows={10}
                mono
                placeholder={compiled.text}
              />
            </Collapsible>
          </>
        ) : (
          <Notice tone="warn">{missingMessage(compiled.missing)}</Notice>
        )}
      </div>
    </>
  );
}
