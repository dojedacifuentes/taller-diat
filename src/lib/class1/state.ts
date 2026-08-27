// ─────────────────────────────────────────────────────────────────────────────
// CLASE 1 · MODELO DE ESTADO
//
// Todo el trabajo del estudiante vive en un único objeto serializable,
// persistido en localStorage bajo una clave versionada. Sin backend, sin
// cuenta, sin datos sensibles: solo lo que el propio estudiante escribe.
//
// El estado está centralizado a propósito: la entrega, la descarga y la vista
// final se construyen todas desde aquí con una sola función
// (`buildClass1Submission`), de modo que ningún canal pueda entregar una
// versión distinta del mismo trabajo.
// ─────────────────────────────────────────────────────────────────────────────
import type { BlameOption, ConfidenceLevel, ClaimAction } from '@/content/class1/activities';
import { emptyDraft, type PromptDraft } from '@/content/class1/lab';
import type { StageId } from '@/content/class1/stages';

export const STORAGE_KEY = 'diat.class1';
export const SCHEMA_VERSION = 2;

// ─── Sub-estados ─────────────────────────────────────────────────────────────

export interface StudentIdentity {
  /** Nombre o identificador. No se pide RUT. */
  name: string;
  /** Opcional: sirve como remitente de la entrega. */
  email: string;
}

/** Respuesta comprometida: no se puede editar una vez confirmada. */
export interface QuestionAnswer {
  blame: BlameOption | null;
  confidence: ConfidenceLevel | null;
  committed: boolean;
  at: string | null;
}

export function emptyAnswer(): QuestionAnswer {
  return { blame: null, confidence: null, committed: false, at: null };
}

export interface PromptV1State {
  draft: PromptDraft;
  /**
   * Edición manual del estudiante sobre el prompt compilado. Cuando tiene
   * contenido, manda sobre el compilador: el botón «Editar» del laboratorio
   * escribe aquí y el compilador deja de pisar el texto.
   */
  manual: string;
  /** Texto vigente del Prompt V1: la edición manual si la hay, el compilado si no. */
  text: string;
  at: string | null;
}

export interface AuditState {
  /** Herramienta externa utilizada (id de AI_TOOLS). */
  tool: string | null;
  accepted: string;
  rejected: string;
  why: string;
}

export interface PromptV2State {
  text: string;
  at: string | null;
  /** El editor se sembró con el Prompt V1: no volver a pisarlo. */
  seeded: boolean;
}

export interface VerifiedClaim {
  id: string;
  claim: string;
  source: string;
  locator: string;
  action: ClaimAction | null;
}

export function emptyClaim(id: string): VerifiedClaim {
  return { id, claim: '', source: '', locator: '', action: null };
}

export interface VerificationState {
  claims: VerifiedClaim[];
}

export interface ReflectionState {
  before: string;
  after: string;
}

export interface SubmissionState {
  /** Última entrega confirmada por el servidor. */
  sentAt: string | null;
  downloadedAt: string | null;
}

/** Cronómetro por ejercicio. El instante de arranque vive en el estado. */
export interface TimerState {
  startedAt: string;
  durationSec: number;
}

// ─── Estado raíz ─────────────────────────────────────────────────────────────

export interface Class1State {
  schemaVersion: number;
  startedAt: string | null;
  updatedAt: string | null;
  identity: StudentIdentity;
  initialQuestion: QuestionAnswer;
  promptV1: PromptV1State;
  audit: AuditState;
  promptV2: PromptV2State;
  verification: VerificationState;
  finalQuestion: QuestionAnswer;
  reflection: ReflectionState;
  submission: SubmissionState;
  timers: Partial<Record<StageId, TimerState>>;
}

export function createInitialState(): Class1State {
  return {
    schemaVersion: SCHEMA_VERSION,
    startedAt: null,
    updatedAt: null,
    identity: { name: '', email: '' },
    initialQuestion: emptyAnswer(),
    promptV1: { draft: emptyDraft(), manual: '', text: '', at: null },
    audit: { tool: null, accepted: '', rejected: '', why: '' },
    promptV2: { text: '', at: null, seeded: false },
    verification: { claims: [emptyClaim('c1')] },
    finalQuestion: emptyAnswer(),
    reflection: { before: '', after: '' },
    submission: { sentAt: null, downloadedAt: null },
    timers: {},
  };
}

// ─── Persistencia ────────────────────────────────────────────────────────────

interface LegacyV1Shape {
  schemaVersion?: number;
  student?: { firstName?: string; lastName?: string; email?: string };
  b00?: Partial<QuestionAnswer>;
  productA?: { prompt?: string; task?: string };
  b05?: { tool?: string | null; accepted?: string; acceptedWhy?: string; rejected?: string; rejectedWhy?: string };
  b08?: { claims?: { claim?: string; source?: string; locator?: string; action?: ClaimAction | null }[] };
  b09?: Partial<QuestionAnswer> & { before?: string; after?: string };
}

/**
 * Rescata lo que un estado de la arquitectura anterior (bloques B00–B09) sí
 * tiene equivalente en la nueva. Nadie pierde su trabajo por una recarga a
 * mitad de sesión: lo que no tiene equivalente simplemente no viaja.
 */
function fromLegacy(raw: LegacyV1Shape): Class1State {
  const base = createInitialState();
  const name = [raw.student?.firstName, raw.student?.lastName].filter(Boolean).join(' ').trim();
  const promptText = raw.productA?.prompt?.trim() ?? '';
  const legacyClaim = raw.b08?.claims?.find(c => c.claim?.trim());

  return {
    ...base,
    identity: { name, email: raw.student?.email ?? '' },
    initialQuestion: {
      blame: raw.b00?.blame ?? null,
      confidence: raw.b00?.confidence ?? null,
      committed: Boolean(raw.b00?.committed),
      at: raw.b00?.at ?? null,
    },
    promptV1: promptText
      ? {
          draft: { ...emptyDraft(), taskDetail: raw.productA?.task ?? '' },
          manual: promptText,
          text: promptText,
          at: null,
        }
      : base.promptV1,
    audit: {
      tool: raw.b05?.tool ?? null,
      accepted: raw.b05?.accepted ?? '',
      rejected: raw.b05?.rejected ?? '',
      why: [raw.b05?.acceptedWhy, raw.b05?.rejectedWhy].filter(Boolean).join(' · '),
    },
    verification: legacyClaim
      ? {
          claims: [
            {
              id: 'c1',
              claim: legacyClaim.claim ?? '',
              source: legacyClaim.source ?? '',
              locator: legacyClaim.locator ?? '',
              action: legacyClaim.action ?? null,
            },
          ],
        }
      : base.verification,
    finalQuestion: {
      blame: raw.b09?.blame ?? null,
      confidence: raw.b09?.confidence ?? null,
      committed: Boolean(raw.b09?.committed),
      at: raw.b09?.at ?? null,
    },
    reflection: { before: raw.b09?.before ?? '', after: raw.b09?.after ?? '' },
  };
}

/**
 * Rellena huecos de un estado leído del disco contra la forma actual. Un schema
 * antiguo nunca rompe la aplicación: los campos nuevos aparecen vacíos en lugar
 * de `undefined`.
 */
export function migrate(raw: unknown): Class1State {
  const base = createInitialState();
  if (!raw || typeof raw !== 'object') return base;

  const version = (raw as { schemaVersion?: number }).schemaVersion ?? 1;
  if (version < SCHEMA_VERSION) return fromLegacy(raw as LegacyV1Shape);

  const parsed = raw as Partial<Class1State>;
  const merged: Class1State = {
    ...base,
    ...parsed,
    schemaVersion: SCHEMA_VERSION,
    identity: { ...base.identity, ...(parsed.identity ?? {}) },
    initialQuestion: { ...base.initialQuestion, ...(parsed.initialQuestion ?? {}) },
    promptV1: {
      ...base.promptV1,
      ...(parsed.promptV1 ?? {}),
      draft: { ...emptyDraft(), ...(parsed.promptV1?.draft ?? {}) },
    },
    audit: { ...base.audit, ...(parsed.audit ?? {}) },
    promptV2: { ...base.promptV2, ...(parsed.promptV2 ?? {}) },
    verification: { ...base.verification, ...(parsed.verification ?? {}) },
    finalQuestion: { ...base.finalQuestion, ...(parsed.finalQuestion ?? {}) },
    reflection: { ...base.reflection, ...(parsed.reflection ?? {}) },
    submission: { ...base.submission, ...(parsed.submission ?? {}) },
    timers: { ...(parsed.timers ?? {}) },
  };

  // Invariantes de forma que el resto del código da por supuestos.
  const draft = merged.promptV1.draft;
  if (!Array.isArray(draft.constraints)) draft.constraints = [];
  if (!Array.isArray(draft.controls)) draft.controls = [];
  if (!draft.extras || typeof draft.extras !== 'object') draft.extras = emptyDraft().extras;
  if (!Array.isArray(merged.verification.claims) || merged.verification.claims.length === 0) {
    merged.verification.claims = [emptyClaim('c1')];
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

/** El prompt que el estudiante lleva a la IA: V2 si existe, V1 si no. */
export function currentPrompt(state: Class1State): string {
  return state.promptV2.text.trim() || state.promptV1.text.trim();
}

export function displayName(identity: StudentIdentity): string {
  return identity.name.trim();
}

/**
 * Duración de la sesión. Un cronómetro arrancado antes de esta ventana no
 * pertenece a la clase que está ocurriendo ahora.
 */
const SESION_MS = 90 * 60 * 1000;

/**
 * ¿La marca de arranque viene de otra sentada?
 *
 * Un cronómetro arrancado ayer —el profesor probando la clase, un estudiante
 * que abrió la página antes de tiempo— llega a hoy en 00:00, y desde fuera eso
 * es indistinguible de un cronómetro que no arranca. Vive aquí y no en el
 * store para que sea código plano y se pueda probar sin montar React.
 */
export function esDeOtraSesion(startedAt: string, ahora: number = Date.now()): boolean {
  const t = Date.parse(startedAt);
  if (Number.isNaN(t)) return true;
  return ahora - t > SESION_MS;
}
