// ─────────────────────────────────────────────────────────────────────────────
// CLASE 1 · OBJETO DE ENTREGA
//
// Una sola función produce el trabajo completo del estudiante, y ese objeto
// alimenta los tres canales: la vista final, la descarga y el correo. Así
// ninguno puede entregar una versión ligeramente distinta del mismo trabajo.
//
// Módulo isomorfo: sin APIs de navegador. Lo usa el cliente para descargar y el
// route handler para redactar el correo.
// ─────────────────────────────────────────────────────────────────────────────
import { blameOptions, claimActions } from '@/content/class1/activities';
import { summarizeDraft, type DraftSummary } from '@/content/class1/lab';
import { GUIDING_QUESTION } from '@/content/class1/stages';
import { class1Meta } from '@/content/class1/manifest';
import { AI_TOOLS } from '@/content/class1/prompts';
import type { Class1State } from './state';

export interface SubmissionAnswer {
  answer: string | null;
  answerLabel: string;
  confidence: string | null;
  at: string | null;
}

export interface SubmissionClaim {
  claim: string;
  source: string;
  locator: string;
  action: string;
}

export interface Class1Submission {
  meta: {
    classCode: string;
    classTitle: string;
    classDate: string;
    generatedAt: string;
  };
  identity: { name: string; email: string };
  guidingQuestion: string;
  initialQuestion: SubmissionAnswer;
  promptV1: { text: string; config: DraftSummary[] };
  audit: { tool: string; accepted: string; rejected: string; why: string };
  promptV2: { text: string; changed: boolean };
  verification: { claims: SubmissionClaim[] };
  finalQuestion: SubmissionAnswer;
  reflection: { before: string; after: string };
}

function labelOfBlame(id: string | null): string {
  return blameOptions.find(o => o.id === id)?.label ?? '—';
}

function labelOfAction(id: string | null): string {
  return claimActions.find(a => a.id === id)?.label ?? '—';
}

function answerOf(q: Class1State['initialQuestion']): SubmissionAnswer {
  return {
    answer: q.blame,
    answerLabel: q.committed ? labelOfBlame(q.blame) : '—',
    confidence: q.committed ? q.confidence : null,
    at: q.at,
  };
}

/**
 * Construye el objeto de entrega. `generatedAt` se inyecta para que la función
 * sea determinista y comprobable; por defecto usa el reloj del entorno.
 */
export function buildClass1Submission(
  state: Class1State,
  generatedAt: string = new Date().toISOString(),
): Class1Submission {
  const v1 = state.promptV1.text.trim();
  const v2 = state.promptV2.text.trim();

  return {
    meta: {
      classCode: class1Meta.code,
      classTitle: class1Meta.title,
      classDate: class1Meta.date,
      generatedAt,
    },
    identity: { name: state.identity.name.trim(), email: state.identity.email.trim() },
    guidingQuestion: GUIDING_QUESTION,
    initialQuestion: answerOf(state.initialQuestion),
    promptV1: { text: v1, config: summarizeDraft(state.promptV1.draft) },
    audit: {
      tool: AI_TOOLS.find(t => t.id === state.audit.tool)?.label ?? '—',
      accepted: state.audit.accepted.trim(),
      rejected: state.audit.rejected.trim(),
      why: state.audit.why.trim(),
    },
    promptV2: { text: v2 || v1, changed: Boolean(v2) && v2 !== v1 },
    verification: {
      claims: state.verification.claims
        .filter(c => c.claim.trim())
        .map(c => ({
          claim: c.claim.trim(),
          source: c.source.trim() || '—',
          locator: c.locator.trim() || '—',
          action: labelOfAction(c.action),
        })),
    },
    finalQuestion: answerOf(state.finalQuestion),
    reflection: { before: state.reflection.before.trim(), after: state.reflection.after.trim() },
  };
}

// ─── Render ──────────────────────────────────────────────────────────────────

const DASH = '—';

function value(s: string): string {
  return s.trim() || DASH;
}

function fence(text: string): string {
  return ['```text', text.trim() || DASH, '```'].join('\n');
}

function formatDate(iso: string): string {
  // Fecha legible sin depender de la zona horaria del servidor de Vercel.
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getUTCDate())}-${pad(d.getUTCMonth() + 1)}-${d.getUTCFullYear()} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`;
}

/** Documento único de la Clase 1, en Markdown legible en cualquier editor. */
export function renderSubmissionMarkdown(s: Class1Submission): string {
  const out: string[] = [];

  out.push(`# ${s.meta.classCode} · ${s.meta.classTitle}`);
  out.push('');
  out.push(`**Estudiante** · ${value(s.identity.name)}`);
  if (s.identity.email) out.push(`**Correo** · ${s.identity.email}`);
  out.push(`**Sesión** · ${s.meta.classDate}`);
  out.push(`**Documento generado** · ${formatDate(s.meta.generatedAt)}`);
  out.push('');
  out.push('---');
  out.push('');

  out.push(`## 1 · Pregunta guía — ${s.guidingQuestion}`);
  out.push('');
  out.push(`- **Al comenzar:** ${s.initialQuestion.answerLabel}`);
  out.push(`- **Confianza:** ${s.initialQuestion.confidence ?? DASH}`);
  out.push('');

  out.push('## 2 · Prompt V1');
  out.push('');
  for (const row of s.promptV1.config) out.push(`- **${row.label}:** ${row.value}`);
  out.push('');
  out.push(fence(s.promptV1.text));
  out.push('');

  out.push('## 3 · Auditoría del prompt');
  out.push('');
  out.push(`- **Herramienta:** ${s.audit.tool}`);
  out.push(`- **Sugerencia que acepté:** ${value(s.audit.accepted)}`);
  out.push(`- **Sugerencia que rechacé:** ${value(s.audit.rejected)}`);
  out.push(`- **Por qué:** ${value(s.audit.why)}`);
  out.push('');

  out.push(`## 4 · Prompt V2 · auditado${s.promptV2.changed ? '' : ' (sin cambios respecto de V1)'}`);
  out.push('');
  out.push(fence(s.promptV2.text));
  out.push('');

  out.push('## 5 · Verificación (ICJR)');
  out.push('');
  if (s.verification.claims.length === 0) {
    out.push(DASH);
  } else {
    s.verification.claims.forEach((c, i) => {
      out.push(`### Afirmación ${i + 1}`);
      out.push('');
      out.push(`- **Identificar:** ${c.claim}`);
      out.push(`- **Contrastar:** ${c.source}`);
      out.push(`- **Justificar:** ${c.locator}`);
      out.push(`- **Registrar:** ${c.action}`);
      out.push('');
    });
  }

  out.push(`## 6 · Vuelta a la pregunta guía — ${s.guidingQuestion}`);
  out.push('');
  out.push(`- **Al comenzar:** ${s.initialQuestion.answerLabel} (confianza: ${s.initialQuestion.confidence ?? DASH})`);
  out.push(`- **Ahora:** ${s.finalQuestion.answerLabel} (confianza: ${s.finalQuestion.confidence ?? DASH})`);
  out.push('');

  out.push('## 7 · Microreflexión');
  out.push('');
  out.push(`Antes pensaba que el problema era **${value(s.reflection.before)}**. Ahora agregaría **${value(s.reflection.after)}**.`);
  out.push('');

  return out.join('\n');
}

/** Marcas diacríticas combinantes. Se construye con escapes para que el archivo
 *  fuente no dependa de que el editor conserve caracteres invisibles. */
const COMBINING_MARKS = new RegExp('[\\u0300-\\u036f]', 'g');

/** `DIAT_Clase_1_ana-perez.md` */
export function submissionFilename(s: Class1Submission): string {
  const slug =
    s.identity.name
      .normalize('NFD')
      .replace(COMBINING_MARKS, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || 'sin-nombre';
  return `DIAT_Clase_1_${slug}.md`;
}
