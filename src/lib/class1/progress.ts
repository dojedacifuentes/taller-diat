// ─────────────────────────────────────────────────────────────────────────────
// CLASE 1 · PROGRESO
//
// El progreso mide operaciones intelectuales realizadas, no páginas abiertas.
// No produce notas, puntajes ni predicciones de competencia: solo dice qué
// hitos de la Bitácora están completos y cuáles faltan.
// ─────────────────────────────────────────────────────────────────────────────
import { BLOCKS, type BlockId } from '@/content/class1/manifest';
import { myths, b01Checks, errorCases, groundingDecisions, diatComponents } from '@/content/class1/activities';
import type { Class1State } from './state';

export type BlockStatus = 'pendiente' | 'en-curso' | 'completado';

export interface BlockProgress {
  id: BlockId;
  status: BlockStatus;
  /** 0–1. Solo alimenta la barra; nunca se muestra como calificación. */
  ratio: number;
  /** Qué falta, en lenguaje del estudiante. */
  missing: string[];
}

function ratioOf(done: number, total: number): number {
  return total === 0 ? 0 : Math.min(1, done / total);
}

function statusOf(ratio: number, started: boolean): BlockStatus {
  if (ratio >= 1) return 'completado';
  return started || ratio > 0 ? 'en-curso' : 'pendiente';
}

function nonEmpty(s: string | null | undefined): boolean {
  return typeof s === 'string' && s.trim().length > 0;
}

export function blockProgress(state: Class1State, id: BlockId): BlockProgress {
  const missing: string[] = [];
  let done = 0;
  let total = 1;
  let started = state.visited.includes(id);

  switch (id) {
    case 'b00': {
      total = 1;
      done = state.b00.committed ? 1 : 0;
      if (!state.b00.committed) missing.push('Confirmar tu respuesta y tu nivel de confianza.');
      started = started || state.b00.blame !== null;
      break;
    }
    case 'b01': {
      const checksDone = b01Checks.filter(c => state.b01.committed[c.id]).length;
      const exploredEnough = Math.min(state.b01.explored.length, 3);
      total = 3 + b01Checks.length;
      done = exploredEnough + checksDone;
      if (state.b01.explored.length < 3) missing.push('Explorar al menos tres capas del producto.');
      if (checksDone < b01Checks.length) missing.push('Responder las dos comprobaciones.');
      break;
    }
    case 'b02': {
      total = myths.length;
      done = myths.filter(m => state.b02.committed[m.id]).length;
      if (done < total) missing.push(`Confirmar ${total - done} afirmación(es).`);
      break;
    }
    case 'b03': {
      const assigned = diatComponents.filter(c => state.b03.states[c.id]).length;
      total = diatComponents.length + 1;
      done = assigned + (nonEmpty(state.b03.implicitDecisions) ? 1 : 0);
      if (assigned < diatComponents.length) {
        missing.push(`Asignar estado a ${diatComponents.length - assigned} componente(s).`);
      }
      if (!nonEmpty(state.b03.implicitDecisions)) missing.push('Describir la decisión implícita que detectaste.');
      break;
    }
    case 'b04': {
      const a = state.productA;
      const decisionsDone = a.decisions.filter(nonEmpty).length;
      total = 5;
      done =
        (nonEmpty(a.task) ? 1 : 0) +
        (a.risk ? 1 : 0) +
        (a.components.length > 0 ? 1 : 0) +
        (nonEmpty(a.prompt) ? 1 : 0) +
        (decisionsDone >= 1 ? 1 : 0);
      if (!nonEmpty(a.task)) missing.push('Describir tu tarea jurídica.');
      if (!a.risk) missing.push('Elegir el nivel de riesgo.');
      if (a.components.length === 0) missing.push('Marcar los componentes pertinentes.');
      if (!nonEmpty(a.prompt)) missing.push('Escribir tu prompt.');
      if (decisionsDone === 0) missing.push('Justificar al menos una decisión de diseño.');
      break;
    }
    case 'b05': {
      const b = state.b05;
      total = 3;
      done =
        (b.tool ? 1 : 0) +
        (nonEmpty(b.accepted) && nonEmpty(b.acceptedWhy) ? 1 : 0) +
        (nonEmpty(b.rejected) && nonEmpty(b.rejectedWhy) ? 1 : 0);
      if (!b.tool) missing.push('Indicar qué herramienta usaste.');
      if (!nonEmpty(b.accepted) || !nonEmpty(b.acceptedWhy)) missing.push('Registrar una sugerencia aceptada y su razón.');
      if (!nonEmpty(b.rejected) || !nonEmpty(b.rejectedWhy)) missing.push('Registrar una sugerencia rechazada y su fundamento.');
      break;
    }
    case 'b06': {
      const casesDone = errorCases.filter(c => state.b06.committed[c.id]).length;
      total = errorCases.length + 1;
      done = casesDone + (state.b06.revealCommitted ? 1 : 0);
      if (casesDone < errorCases.length) missing.push(`Clasificar ${errorCases.length - casesDone} caso(s).`);
      if (!state.b06.revealCommitted) missing.push('Resolver el caso de revelación progresiva.');
      break;
    }
    case 'b07': {
      total = groundingDecisions.length;
      done = groundingDecisions.filter(d => state.b07.committed[d.id]).length;
      if (done < total) missing.push(`Tomar ${total - done} decisión(es) guiada(s).`);
      break;
    }
    case 'b08': {
      const complete = state.b08.claims.filter(
        c => nonEmpty(c.claim) && c.status && c.state && c.action,
      ).length;
      total = 2;
      done = Math.min(complete, 2);
      if (complete < 2) missing.push(`Completar ${2 - complete} afirmación(es) con estatus, estado y acción.`);
      break;
    }
    case 'b09': {
      const b = state.b09;
      total = 3;
      done =
        (b.committed ? 1 : 0) + (nonEmpty(b.before) ? 1 : 0) + (nonEmpty(b.after) ? 1 : 0);
      if (!b.committed) missing.push('Volver a responder «¿quién falló?».');
      if (!nonEmpty(b.before) || !nonEmpty(b.after)) missing.push('Completar las dos frases del Producto C.');
      break;
    }
  }

  const ratio = ratioOf(done, total);
  return { id, status: statusOf(ratio, started), ratio, missing };
}

export interface Class1Progress {
  blocks: Record<BlockId, BlockProgress>;
  /** 0–100, redondeado. Es el porcentaje de la Bitácora, no una nota. */
  percent: number;
  completedBlocks: number;
  totalBlocks: number;
  /** Primer bloque no completado: el sitio al que lleva «Continuar». */
  nextBlock: BlockId;
  /** Hitos de la Bitácora. */
  productA: boolean;
  productB: boolean;
  productC: boolean;
  /** La Bitácora puede generarse aunque falten piezas; esto solo avisa. */
  readyToDeliver: boolean;
}

export function computeProgress(state: Class1State): Class1Progress {
  const blocks = {} as Record<BlockId, BlockProgress>;
  let sum = 0;
  let completed = 0;

  for (const b of BLOCKS) {
    const p = blockProgress(state, b.id);
    blocks[b.id] = p;
    sum += p.ratio;
    if (p.status === 'completado') completed += 1;
  }

  const percent = Math.round((sum / BLOCKS.length) * 100);
  const next = BLOCKS.find(b => blocks[b.id].status !== 'completado')?.id ?? 'b09';

  const productA = blocks.b04.status === 'completado';
  const productB = blocks.b08.status === 'completado';
  const productC = blocks.b09.status === 'completado';

  return {
    blocks,
    percent,
    completedBlocks: completed,
    totalBlocks: BLOCKS.length,
    nextBlock: next,
    productA,
    productB,
    productC,
    readyToDeliver: productA && productB && productC,
  };
}

// ─── Hitos discretos ─────────────────────────────────────────────────────────
//
// Se otorgan por una operación pedagógica significativa, nunca por navegar.

export interface Milestone {
  id: string;
  label: string;
  description: string;
  earned: boolean;
}

export function milestones(state: Class1State, p: Class1Progress): Milestone[] {
  const a = state.productA;
  return [
    {
      id: 'especificador',
      label: 'Especificador',
      description: 'Diagnosticaste las decisiones que un prompt deja implícitas.',
      earned: p.blocks.b03.status === 'completado',
    },
    {
      id: 'arquitecto',
      label: 'Arquitecto',
      description: 'Construiste un encargo proporcional al riesgo y justificaste tus decisiones.',
      earned: p.productA && a.decisions.filter(d => d.trim()).length >= 3,
    },
    {
      id: 'esceptico',
      label: 'Escéptico competente',
      description: 'Distinguiste una fuente real de una proposición sostenida por esa fuente.',
      earned: p.blocks.b06.status === 'completado',
    },
    {
      id: 'verificador',
      label: 'Verificador',
      description: 'Ejecutaste ICJR sobre dos afirmaciones y dejaste registro.',
      earned: p.productB,
    },
    {
      id: 'criterio',
      label: 'Criterio profesional',
      description: 'Rechazaste con fundamento una sugerencia de la IA y cerraste tu Bitácora.',
      earned:
        p.productC &&
        state.b05.rejected.trim().length > 0 &&
        state.b05.rejectedWhy.trim().length > 0,
    },
  ];
}
