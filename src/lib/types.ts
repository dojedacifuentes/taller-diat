export type SessionStatus = 'pending' | 'active' | 'completed';

/**
 * Una unidad de contenido de la sesión. `items` recoge los desgloses que la
 * propuesta académica enumera (p. ej. contexto · rol · tarea · fuentes…).
 */
export interface SessionContent {
  title: string;
  items?: string[];
}

/** Trabajo aplicado de la sesión: caso guiado, laboratorio o cierre. */
export interface SessionPractice {
  label: string;
  description: string;
}

/**
 * Sesión del taller. Deliberadamente no existe un campo de minutos por bloque:
 * la propuesta fija el horario (15:00–16:30) pero no reparte el tiempo entre
 * actividades, y no corresponde inventar esa distribución.
 */
export interface Session {
  id: number;
  label: string;
  shortTitle: string;
  title: string;
  /** Fecha ISO (YYYY-MM-DD). */
  date: string;
  displayDate: string;
  displayDateShort: string;
  time: string;
  duration: string;
  purpose: string;
  contents: SessionContent[];
  practice: SessionPractice;
  product: string;
  notes?: string[];
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  legalUseCase: string;
  level: 'Básico' | 'Intermedio' | 'Avanzado';
  category: string;
  url: string;
  color: string;
}

export type TeamRole =
  | 'Director'
  | 'Subdirector'
  | 'Coordinación'
  | 'Difusión'
  | 'Evidencias'
  | 'Soporte Técnico'
  | 'Relator'
  | 'Integrante'
  | 'Participante';

export interface TeamMember {
  id: string;
  name: string;
  role: TeamRole;
  status: 'active' | 'standby' | 'pending';
  moduleId?: number;
  email?: string;
  initials: string;
  color: string;
}

/**
 * Indicador oficial de resultado. `value` es null mientras no exista un dato
 * real registrado por la coordinación — nunca se rellena con estimaciones.
 */
export interface IndicatorRecord {
  id: string;
  label: string;
  value: number | null;
  unit: string;
}

/** Asistencia por sesión. Null hasta que la jornada se realice. */
export interface AttendanceData {
  session: string;
  date: string;
  registered: number | null;
  attended: number | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Arquitectura pedagógica 2026 — run of show, casos, evaluación y herramientas
//
// La propuesta académica fija objetivos, contenidos y productos, pero no
// reparte los 90 minutos entre actividades. Ese reparto proviene del diseño
// instruccional del equipo ejecutor (ver docs/TALLER_2026_RUN_OF_SHOW.md) y
// vive aquí para que exista una sola fuente de verdad.
// ─────────────────────────────────────────────────────────────────────────────

/** Quién conduce un bloque. Determina el cómputo del 30/70. */
export type BlockOwner = 'diego' | 'relatores' | 'equipos';

/** Cómo se trabaja el bloque. */
export type BlockMode =
  | 'Exposición'
  | 'Demostración'
  | 'Actividad'
  | 'Laboratorio'
  | 'Revisión'
  | 'Cierre';

/** Bloque del cronograma minuto a minuto. */
export interface RunBlock {
  /** Minuto de inicio contado desde el comienzo de la sesión (0 = 15:00). */
  from: number;
  /** Minuto de término. `to - from` son los minutos del bloque. */
  to: number;
  title: string;
  owner: BlockOwner;
  mode: BlockMode;
  /** Qué ocurre en el bloque, en una o dos frases. */
  detail: string;
  /** Materiales o herramientas necesarios. */
  needs?: string[];
  /** Ruta interna de la plataforma que acompaña el bloque. */
  tool?: string;
}

/** Plan completo de una sesión. */
export interface SessionPlan {
  sessionId: number;
  /** Frase que el estudiante debería poder decir al final. */
  successCriterion: string;
  /** Idea que atraviesa la sesión. */
  spine: string;
  blocks: RunBlock[];
  /** Qué hacer si algo falla. */
  contingencies: { when: string; then: string }[];
}

/** Caso pedagógico simulado. */
export interface LegalCase {
  id: string;
  code: string;
  area: string;
  title: string;
  difficulty: 'Inicial' | 'Intermedio' | 'Avanzado';
  /** Si es el caso que progresa por las tres sesiones. */
  troncal: boolean;
  /** Enunciado que recibe el estudiante. */
  brief: string;
  /** Qué se busca enseñar con este caso. */
  objective: string;
  /** Errores que el caso induce deliberadamente. */
  traps: string[];
  /** Fuentes públicas verificables sobre las que se puede trabajar. */
  sources: { label: string; url: string; note?: string }[];
  /** Orientación para el equipo docente. Nunca se muestra como solución cerrada. */
  teacherNotes: string[];
  /** Cómo evoluciona el caso entre sesiones. */
  arc?: { session: number; task: string }[];
}

/** Término del glosario. */
export interface GlossaryTerm {
  term: string;
  definition: string;
  legalExample: string;
  group: 'Fundamentos' | 'Prompting' | 'Verificación' | 'Riesgos' | 'Flujo';
}

/** Nivel de una rúbrica de cuatro niveles. */
export interface RubricLevel {
  level: 'Inicial' | 'En desarrollo' | 'Logrado' | 'Destacado';
  /** Conducta observable. Nunca adjetivos sueltos. */
  descriptor: string;
}

export interface RubricCriterion {
  weight: number;
  criterion: string;
  levels: RubricLevel[];
}

/** Afirmación del ejercicio «Cazador de alucinaciones». */
export type ClaimVerdict = 'verificada' | 'falsa' | 'dudosa' | 'sin-fuente' | 'inferencia';

export interface HuntClaim {
  id: string;
  text: string;
  answer: ClaimVerdict;
  /** Por qué esa es la calificación correcta. */
  why: string;
}

/** Bloque del constructor de flujos. */
export type FlowKind = 'entrada' | 'tarea' | 'ia' | 'fuente' | 'control' | 'salida' | 'registro';

export interface FlowStep {
  id: string;
  kind: FlowKind;
  label: string;
}

/** Recurso descargable publicado en /materiales. */
export interface Material {
  code: string;
  title: string;
  description: string;
  /** 0 = transversal a las tres sesiones. */
  session: 0 | 1 | 2 | 3;
  kind: 'Plantilla' | 'Guía' | 'Caso' | 'Presentación' | 'Manual' | 'Rúbrica';
  format: 'PDF' | 'PPTX' | 'DOCX' | 'MD';
  /** Ruta estática si el archivo existe en /public, o null si se genera en el navegador. */
  href: string | null;
  /** Identificador del generador cliente, cuando `href` es null. */
  generator?: string;
  /** Tamaño aproximado, solo cuando se conoce con certeza. */
  size?: string;
}
