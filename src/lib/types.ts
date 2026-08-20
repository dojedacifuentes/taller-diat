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
