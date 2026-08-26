// ─────────────────────────────────────────────────────────────────────────────
// CLASE 1 · REPARTO DE LOS 90 MINUTOS
//
// Fuente única del minuto a minuto. La consumen el deck (para estampar la hora
// de cada diapositiva) y el guion docente (para las cabeceras de tramo). Ningún
// artefacto vuelve a escribir una hora a mano.
//
// El reparto cambió con la reforma de la plataforma: la plataforma dejó de ser
// un manual interactivo de diez ejercicios y pasó a ser una superficie de
// ejecución de cinco. La teoría que antes se leía en pantalla ahora la expone el
// profesor, y el tiempo de plataforma se concentra donde el estudiante produce
// algo: el prompt, la auditoría, la verificación y el cierre.
//
//   Antes  ·  32 min docente · 58 min alumno · 10 puntos de plataforma
//   Ahora  ·  51 min docente · 39 min alumno ·  5 puntos de plataforma
// ─────────────────────────────────────────────────────────────────────────────

import { BLOCKS, type BlockId } from './manifest';
import type { StageId } from './stages';
import { class1ActivityDurations } from './timers';

export interface RunSegment {
  /** Código del canon. Se conserva para trazabilidad con el Documento Maestro. */
  block: BlockId;
  /** Título del tramo tal como aparece en el guion. */
  title: string;
  /** Minuto de inicio y fin, relativos a las 15:00. */
  from: number;
  to: number;
  /** Diapositivas que acompañan el tramo. */
  slides: readonly number[];
  /** Etapa de plataforma que se abre en este tramo, si alguna. */
  stage?: StageId;
  /** Minuto exacto en que arranca el trabajo de plataforma. */
  stageAt?: number;
}

/**
 * Los diez tramos del canon con su nuevo reparto. Los códigos B00–B09 siguen
 * siendo la referencia interna del guion y del Documento Maestro; no aparecen
 * en ninguna pantalla del estudiante.
 */
export const RUN_OF_SHOW: readonly RunSegment[] = [
  { block: 'b00', title: 'Una cita perfecta que no existe', from: 0, to: 8, slides: [1, 2, 3, 4, 5], stage: 'pregunta', stageAt: 2 },
  { block: 'b01', title: 'Qué hace un modelo de lenguaje', from: 8, to: 18, slides: [6, 7, 8] },
  { block: 'b02', title: 'Cinco mitos', from: 18, to: 22, slides: [9] },
  { block: 'b03', title: 'Las siete preguntas DIAT', from: 22, to: 28, slides: [10, 11, 12] },
  { block: 'b04', title: 'Prompt Lab', from: 28, to: 44, slides: [13, 14], stage: 'prompt', stageAt: 29 },
  { block: 'b05', title: 'Metaprompting', from: 44, to: 55, slides: [15, 16], stage: 'auditoria', stageAt: 45 },
  { block: 'b06', title: 'Cómo falla una respuesta plausible', from: 55, to: 63, slides: [17, 18, 19] },
  { block: 'b07', title: 'Fuentes delimitadas y su límite', from: 63, to: 72, slides: [20, 21, 22, 23, 24] },
  { block: 'b08', title: 'Verificación · ICJR', from: 72, to: 82, slides: [25, 26, 27], stage: 'verificacion', stageAt: 74 },
  { block: 'b09', title: 'Cierre en espejo y entrega', from: 82, to: 90, slides: [28, 29, 30], stage: 'cierre', stageAt: 82 },
] as const;

/** Minuto 0 = 15:00. Devuelve «15:37». */
export function clockAt(minute: number): string {
  const total = 15 * 60 + minute;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export function segmentClock(s: Pick<RunSegment, 'from' | 'to'>): string {
  return `${clockAt(s.from)}–${clockAt(s.to)}`;
}

export function segmentOf(block: BlockId): RunSegment {
  const found = RUN_OF_SHOW.find(s => s.block === block);
  if (!found) throw new Error(`Sin tramo para ${block}`);
  return found;
}

/** Tramo al que pertenece una diapositiva. */
export function segmentOfSlide(n: number): RunSegment | undefined {
  return RUN_OF_SHOW.find(s => s.slides.includes(n));
}

/** Etapa de plataforma que abre una diapositiva, si alguna. */
export function stageOfSlide(n: number): StageId | undefined {
  return RUN_OF_SHOW.find(s => s.stage && s.slides.includes(n))?.stage;
}

// ─── Invariantes ─────────────────────────────────────────────────────────────

/**
 * El reparto tiene que cuadrar: sin huecos, sin solapes, 90 minutos exactos, y
 * cada etapa de plataforma cabiendo dentro de su tramo con el tiempo que el
 * cronómetro de la plataforma le da de verdad.
 */
export function runOfShowErrors(): string[] {
  const errs: string[] = [];
  let cursor = 0;

  for (const s of RUN_OF_SHOW) {
    if (s.from !== cursor) {
      errs.push(`${s.block}: empieza en ${s.from} y el tramo anterior terminó en ${cursor}.`);
    }
    if (s.to <= s.from) errs.push(`${s.block}: duración no positiva.`);
    cursor = s.to;

    if (s.stage) {
      const minutes = class1ActivityDurations[s.stage] / 60;
      const start = s.stageAt ?? s.from;
      if (start < s.from) errs.push(`${s.block}: la etapa arranca antes del tramo.`);
      if (start + minutes > s.to) {
        errs.push(
          `${s.block}: la etapa «${s.stage}» dura ${minutes} min desde ${clockAt(start)} y no cabe antes de ${clockAt(s.to)}.`,
        );
      }
    }
  }

  if (cursor !== 90) errs.push(`El reparto suma ${cursor} minutos, no 90.`);

  // El manifest canónico (class1-manifest.json) alimenta el deck, el guion y la
  // plataforma. Si sus minutos se separan de este reparto, algún artefacto va a
  // proyectar una hora que no ocurre. No se permite.
  for (const seg of RUN_OF_SHOW) {
    const block = BLOCKS.find(b => b.id === seg.block);
    if (!block) {
      errs.push(`${seg.block}: no existe en el manifest canónico.`);
      continue;
    }
    if (block.from !== seg.from || block.to !== seg.to) {
      errs.push(
        `${seg.block}: el manifest dice ${clockAt(block.from)}–${clockAt(block.to)} y el reparto ${segmentClock(seg)}.`,
      );
    }
    if (block.slides.join(',') !== seg.slides.join(',')) {
      errs.push(`${seg.block}: diapositivas ${block.slides.join(',')} en el manifest y ${seg.slides.join(',')} en el reparto.`);
    }
  }

  const stages = RUN_OF_SHOW.filter(s => s.stage).map(s => s.stage);
  if (new Set(stages).size !== stages.length) errs.push('Hay una etapa de plataforma repartida en dos tramos.');
  if (stages.length !== 5) errs.push(`Se abren ${stages.length} etapas de plataforma; deben ser 5.`);

  return errs;
}

/** Minutos de plataforma y de conducción, derivados y no escritos a mano. */
export function timeSplit(): { platform: number; teacher: number; total: number } {
  const platform = RUN_OF_SHOW.filter(s => s.stage).reduce(
    (sum, s) => sum + class1ActivityDurations[s.stage as StageId] / 60,
    0,
  );
  return { platform, teacher: 90 - platform, total: 90 };
}
