// ─────────────────────────────────────────────────────────────────────────────
// CLASE 1 · ETAPAS DE LA EXPERIENCIA
//
// La plataforma de Clase 1 no es un manual: es una superficie de ejecución.
// Cinco etapas, una acción por etapa. La teoría vive en el PPT y en la voz del
// profesor; aquí el estudiante decide, construye, copia, ejecuta fuera, audita,
// comprueba y entrega.
//
// Este archivo es la única fuente de la secuencia visible. La numeración interna
// de bloques del guion docente (B00–B09) no aparece nunca en la interfaz.
// ─────────────────────────────────────────────────────────────────────────────

export type StageId = 'pregunta' | 'prompt' | 'auditoria' | 'verificacion' | 'cierre';

export interface Class1Stage {
  id: StageId;
  /** Etiqueta del indicador de progreso. Una palabra. */
  label: string;
  /** Ruta pública. */
  route: string;
  /** Título de la pantalla. */
  title: string;
  /** Consigna breve: qué tiene que hacer el estudiante. Una línea. */
  brief: string;
}

export const STAGES: readonly Class1Stage[] = [
  {
    id: 'pregunta',
    label: 'Pregunta',
    route: '/clase-1',
    title: '¿Quién falló?',
    brief: 'Lee el caso, responde y continúa. No hay respuesta correcta todavía.',
  },
  {
    id: 'prompt',
    label: 'Prompt',
    route: '/clase-1/prompt',
    title: 'Construye tu prompt',
    brief: 'Toma decisiones con botones. El prompt se escribe solo, más abajo.',
  },
  {
    id: 'auditoria',
    label: 'Auditoría',
    route: '/clase-1/auditoria',
    title: 'Haz que la IA audite tu prompt',
    brief: 'Copia el paquete, pégalo en tu IA y vuelve con dos decisiones.',
  },
  {
    id: 'verificacion',
    label: 'Verificación',
    route: '/clase-1/verificacion',
    title: 'Prueba y verifica',
    brief: 'Ejecuta tu prompt, elige una afirmación y compruébala contra una fuente.',
  },
  {
    id: 'cierre',
    label: 'Cierre',
    route: '/clase-1/cierre',
    title: 'Volvamos al principio',
    brief: 'Responde otra vez, compara y entrega.',
  },
] as const;

export const STAGE_IDS: readonly StageId[] = STAGES.map(s => s.id);

export function getStage(id: StageId): Class1Stage {
  const stage = STAGES.find(s => s.id === id);
  if (!stage) throw new Error(`Etapa desconocida: ${id}`);
  return stage;
}

export function stageIndex(id: StageId): number {
  return STAGES.findIndex(s => s.id === id);
}

export function nextStage(id: StageId): Class1Stage | undefined {
  return STAGES[stageIndex(id) + 1];
}

export function prevStage(id: StageId): Class1Stage | undefined {
  const i = stageIndex(id);
  return i > 0 ? STAGES[i - 1] : undefined;
}

/** Pregunta guía que atraviesa toda la sesión. */
export const GUIDING_QUESTION = '¿Quién falló?';
