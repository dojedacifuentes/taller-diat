// ─────────────────────────────────────────────────────────────────────────────
// CLASE 1 · MODELO DE ESTADO
//
// Todo el trabajo del estudiante vive en un único objeto serializable,
// persistido en localStorage bajo una clave versionada. Sin backend, sin
// cuenta, sin datos sensibles: solo lo que el propio estudiante escribe.
// ─────────────────────────────────────────────────────────────────────────────
import type { BlockId } from '@/content/class1/manifest';
import type {
  BlameOption, ConfidenceLevel, ComponentId, ComponentState, MythAnswer,
  ErrorType, EpistemicStatus, ClaimState, ClaimAction,
} from '@/content/class1/activities';
import type { RiskLevel } from '@/content/class1/prompts';

export const STORAGE_KEY = 'diat.class1';
export const SCHEMA_VERSION = 1;

// ─── Sub-estados por bloque ──────────────────────────────────────────────────

export interface StudentIdentity {
  firstName: string;
  lastName: string;
  email: string;
}

/** Respuesta comprometida: no se puede editar una vez confirmada. */
export interface CommittedAnswer<T> {
  value: T | null;
  committed: boolean;
  at: string | null;
}

export function emptyAnswer<T>(): CommittedAnswer<T> {
  return { value: null, committed: false, at: null };
}

export interface B00State {
  /** Respuesta inicial a «¿quién falló?». */
  blame: BlameOption | null;
  confidence: ConfidenceLevel | null;
  committed: boolean;
  at: string | null;
}

export interface B01State {
  /** Nodos del diagrama modelo/producto ya explorados. */
  explored: string[];
  /** id del check → opción elegida. */
  checks: Record<string, string>;
  /** id del check → confirmado. */
  committed: Record<string, boolean>;
}

export interface B02State {
  /** id del mito → respuesta. */
  answers: Record<string, MythAnswer>;
  committed: Record<string, boolean>;
}

export interface B03State {
  /** componente → estado diagnosticado. */
  states: Partial<Record<ComponentId, ComponentState>>;
  /** Decisiones implícitas que el estudiante detecta, en sus palabras. */
  implicitDecisions: string;
  committed: boolean;
}

export interface ProductA {
  task: string;
  risk: RiskLevel | null;
  notDelegating: string;
  /** Componentes que el estudiante considera pertinentes para SU tarea. */
  components: ComponentId[];
  prompt: string;
  decisions: [string, string, string];
  reasons: [string, string, string];
}

export interface B05State {
  /** Herramienta externa utilizada (id de AI_TOOLS). */
  tool: string | null;
  accepted: string;
  acceptedWhy: string;
  rejected: string;
  rejectedWhy: string;
  /** Fragmento de la auditoría que el estudiante quiere conservar. Opcional. */
  excerpt: string;
}

export interface B06State {
  /** id del caso → tipo elegido. */
  cases: Record<string, ErrorType>;
  committed: Record<string, boolean>;
  /** Revelación progresiva: respuesta al paso previo a la revelación. */
  revealAnswer: string | null;
  revealCommitted: boolean;
  revealConfidence: ConfidenceLevel | null;
  /** Qué se lleva el estudiante del contraste tipo 2 / tipo 4. */
  takeaway: string;
}

export interface B07State {
  decisions: Record<string, string>;
  committed: Record<string, boolean>;
  /** Nota libre sobre la demostración. */
  note: string;
}

export interface IcjrClaim {
  id: string;
  claim: string;
  status: EpistemicStatus | null;
  source: string;
  locator: string;
  state: ClaimState | null;
  action: ClaimAction | null;
}

export interface B08State {
  claims: IcjrClaim[];
  /** Registro del paso R. */
  verifiedBy: string;
  verifiedAt: string;
  notes: string;
}

export interface B09State {
  blame: BlameOption | null;
  confidence: ConfidenceLevel | null;
  committed: boolean;
  at: string | null;
  before: string;
  after: string;
  doubt: string;
}

// ─── Estado raíz ─────────────────────────────────────────────────────────────

export interface Class1State {
  schemaVersion: number;
  startedAt: string | null;
  updatedAt: string | null;
  student: StudentIdentity;
  b00: B00State;
  b01: B01State;
  b02: B02State;
  b03: B03State;
  productA: ProductA;
  b05: B05State;
  b06: B06State;
  b07: B07State;
  b08: B08State;
  b09: B09State;
  /** Bloques que el estudiante marcó como vistos (para la navegación). */
  visited: BlockId[];
}

export function emptyClaim(id: string): IcjrClaim {
  return { id, claim: '', status: null, source: '', locator: '', state: null, action: null };
}

export function createInitialState(): Class1State {
  return {
    schemaVersion: SCHEMA_VERSION,
    startedAt: null,
    updatedAt: null,
    student: { firstName: '', lastName: '', email: '' },
    b00: { blame: null, confidence: null, committed: false, at: null },
    b01: { explored: [], checks: {}, committed: {} },
    b02: { answers: {}, committed: {} },
    b03: { states: {}, implicitDecisions: '', committed: false },
    productA: {
      task: '',
      risk: null,
      notDelegating: '',
      components: [],
      prompt: '',
      decisions: ['', '', ''],
      reasons: ['', '', ''],
    },
    b05: { tool: null, accepted: '', acceptedWhy: '', rejected: '', rejectedWhy: '', excerpt: '' },
    b06: {
      cases: {},
      committed: {},
      revealAnswer: null,
      revealCommitted: false,
      revealConfidence: null,
      takeaway: '',
    },
    b07: { decisions: {}, committed: {}, note: '' },
    b08: { claims: [emptyClaim('c1'), emptyClaim('c2')], verifiedBy: '', verifiedAt: '', notes: '' },
    b09: { blame: null, confidence: null, committed: false, at: null, before: '', after: '', doubt: '' },
    visited: [],
  };
}

// ─── Persistencia ────────────────────────────────────────────────────────────

/**
 * Rellena huecos de un estado leído del disco contra la forma actual. Evita que
 * un schema antiguo rompa la aplicación: los campos nuevos aparecen vacíos en
 * lugar de `undefined`.
 */
export function migrate(raw: unknown): Class1State {
  const base = createInitialState();
  if (!raw || typeof raw !== 'object') return base;
  const parsed = raw as Partial<Class1State>;

  // v0 → v1: no hay versiones anteriores publicadas. Cualquier objeto sin
  // schemaVersion se trata como parcial y se fusiona campo a campo.
  const merged: Class1State = {
    ...base,
    ...parsed,
    schemaVersion: SCHEMA_VERSION,
    student: { ...base.student, ...(parsed.student ?? {}) },
    b00: { ...base.b00, ...(parsed.b00 ?? {}) },
    b01: { ...base.b01, ...(parsed.b01 ?? {}) },
    b02: { ...base.b02, ...(parsed.b02 ?? {}) },
    b03: { ...base.b03, ...(parsed.b03 ?? {}) },
    productA: { ...base.productA, ...(parsed.productA ?? {}) },
    b05: { ...base.b05, ...(parsed.b05 ?? {}) },
    b06: { ...base.b06, ...(parsed.b06 ?? {}) },
    b07: { ...base.b07, ...(parsed.b07 ?? {}) },
    b08: { ...base.b08, ...(parsed.b08 ?? {}) },
    b09: { ...base.b09, ...(parsed.b09 ?? {}) },
    visited: Array.isArray(parsed.visited) ? parsed.visited : [],
  };

  // Invariantes de forma que el resto del código da por supuestos.
  if (!Array.isArray(merged.productA.decisions) || merged.productA.decisions.length !== 3) {
    merged.productA.decisions = ['', '', ''];
  }
  if (!Array.isArray(merged.productA.reasons) || merged.productA.reasons.length !== 3) {
    merged.productA.reasons = ['', '', ''];
  }
  if (!Array.isArray(merged.productA.components)) merged.productA.components = [];
  if (!Array.isArray(merged.b01.explored)) merged.b01.explored = [];
  if (!Array.isArray(merged.b08.claims) || merged.b08.claims.length === 0) {
    merged.b08.claims = [emptyClaim('c1'), emptyClaim('c2')];
  }
  return merged;
}

export function loadState(): Class1State {
  if (typeof window === 'undefined') return createInitialState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    return migrate(JSON.parse(raw));
  } catch {
    return createInitialState();
  }
}

export function saveState(state: Class1State): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Cuota agotada o almacenamiento bloqueado: la sesión sigue en memoria.
  }
}

export function clearState(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // sin almacenamiento
  }
}

export function fullName(s: StudentIdentity): string {
  return [s.firstName, s.lastName].filter(Boolean).join(' ').trim();
}
