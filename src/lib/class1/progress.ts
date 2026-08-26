// ─────────────────────────────────────────────────────────────────────────────
// CLASE 1 · PROGRESO
//
// Cinco etapas y un estado por etapa. Sin porcentajes de dominio, sin XP, sin
// niveles cognitivos: el progreso dice dónde estás y qué falta para seguir, y
// nada más.
// ─────────────────────────────────────────────────────────────────────────────
import { STAGES, type StageId } from '@/content/class1/stages';
import { compilePrompt } from '@/content/class1/lab';
import type { Class1State } from './state';

export type StageStatus = 'pendiente' | 'en-curso' | 'completada';

export interface StageProgress {
  id: StageId;
  status: StageStatus;
  /** Qué falta, en lenguaje del estudiante. Vacío si la etapa está completa. */
  missing: string[];
}

function nonEmpty(s: string | null | undefined): boolean {
  return typeof s === 'string' && s.trim().length > 0;
}

function statusOf(done: boolean, started: boolean): StageStatus {
  if (done) return 'completada';
  return started ? 'en-curso' : 'pendiente';
}

export function stageProgress(state: Class1State, id: StageId): StageProgress {
  const missing: string[] = [];
  let done = false;
  let started = false;

  switch (id) {
    case 'pregunta': {
      done = state.initialQuestion.committed;
      started = state.initialQuestion.blame !== null;
      if (!done) missing.push('Responde y registra tu respuesta.');
      break;
    }
    case 'prompt': {
      // Una edición manual vale tanto como un compilado válido: lo que importa
      // es que exista un prompt ejecutable, no cómo se produjo.
      const compiled = compilePrompt(state.promptV1.draft);
      done = compiled.ready || nonEmpty(state.promptV1.manual);
      started = state.promptV1.draft.task !== null || nonEmpty(state.promptV1.manual);
      if (!done) missing.push('Completa las decisiones que faltan para poder exportar tu prompt.');
      break;
    }
    case 'auditoria': {
      const a = state.audit;
      done = nonEmpty(a.accepted) && nonEmpty(a.rejected) && nonEmpty(a.why);
      started = nonEmpty(a.accepted) || nonEmpty(a.rejected) || a.tool !== null;
      if (!nonEmpty(a.accepted)) missing.push('Anota una sugerencia que aceptaste.');
      if (!nonEmpty(a.rejected)) missing.push('Anota una sugerencia que rechazaste.');
      if (!nonEmpty(a.why)) missing.push('Explica por qué.');
      break;
    }
    case 'verificacion': {
      const first = state.verification.claims[0];
      done = Boolean(first && nonEmpty(first.claim) && nonEmpty(first.source) && first.action);
      started = Boolean(first && (nonEmpty(first.claim) || nonEmpty(first.source)));
      if (!first || !nonEmpty(first.claim)) missing.push('Pega la afirmación que vas a comprobar.');
      if (!first || !nonEmpty(first.source)) missing.push('Indica con qué fuente la comprobaste.');
      if (!first || !first.action) missing.push('Decide qué haces con la afirmación.');
      break;
    }
    case 'cierre': {
      done = state.finalQuestion.committed && nonEmpty(state.reflection.before) && nonEmpty(state.reflection.after);
      started = state.finalQuestion.blame !== null;
      if (!state.finalQuestion.committed) missing.push('Responde otra vez a la pregunta guía.');
      if (!nonEmpty(state.reflection.before) || !nonEmpty(state.reflection.after)) {
        missing.push('Completa la frase final.');
      }
      break;
    }
  }

  return { id, status: statusOf(done, started), missing };
}

export interface Class1Progress {
  stages: Record<StageId, StageProgress>;
  /** Etapas completadas, para el indicador «3 de 5». */
  completed: number;
  total: number;
  /** Primera etapa no completada: el sitio al que lleva «Continuar». */
  next: StageId;
  /** Todo lo esencial está hecho. Solo informa; nunca bloquea la entrega. */
  readyToDeliver: boolean;
}

export function computeProgress(state: Class1State): Class1Progress {
  const stages = {} as Record<StageId, StageProgress>;
  let completed = 0;

  for (const s of STAGES) {
    const p = stageProgress(state, s.id);
    stages[s.id] = p;
    if (p.status === 'completada') completed += 1;
  }

  const next = STAGES.find(s => stages[s.id].status !== 'completada')?.id ?? 'cierre';

  return {
    stages,
    completed,
    total: STAGES.length,
    next,
    readyToDeliver: completed === STAGES.length,
  };
}
