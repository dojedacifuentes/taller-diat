// ─────────────────────────────────────────────────────────────────────────────
// CLASE 1 · ENTREGA
//
// La descarga y el correo salen del mismo objeto. El envío es server-side: la
// clave del proveedor nunca llega al navegador y el botón solo dice «Enviado»
// después de que el servidor confirme el envío.
//
// La entrega no depende del correo: si el servidor falla, el trabajo sigue
// intacto, la descarga sigue disponible y se puede reintentar.
// ─────────────────────────────────────────────────────────────────────────────
import { delivery } from '@/content/class1/manifest';
import {
  renderSubmissionMarkdown, submissionFilename, type Class1Submission,
} from './submission';

/** Asunto exacto exigido por el programa. No se decora ni se parametriza. */
export const SUBMISSION_SUBJECT = 'Clase 1';

export const SUBMIT_ENDPOINT = '/api/clase-1/entrega';

export type SendStatus = 'idle' | 'sending' | 'sent' | 'error' | 'manual';

export interface SendResult {
  ok: boolean;
  /** Mensaje mostrable al estudiante. Nunca contiene detalles del proveedor. */
  message: string;
  /**
   * `false` cuando el servidor no tiene correo configurado. No es un fallo del
   * estudiante ni un error transitorio: reintentar no va a servir de nada, así
   * que la interfaz ofrece directamente la entrega manual en lugar de un
   * «Reintentar» que sabe que va a volver a fallar.
   */
  configured: boolean;
}

/** Descarga el documento único de la Clase 1 como `.md`. */
export function downloadSubmission(submission: Class1Submission): string {
  const filename = submissionFilename(submission);
  const markdown = renderSubmissionMarkdown(submission);
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // El objeto se libera en el siguiente turno: Safari necesita que siga vivo
  // cuando se dispara la descarga.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return filename;
}

/**
 * Envía la entrega. Solo resuelve `ok: true` si el servidor confirmó que el
 * proveedor aceptó el correo. No se declara éxito antes de eso.
 */
export async function sendSubmission(submission: Class1Submission): Promise<SendResult> {
  try {
    const res = await fetch(SUBMIT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submission }),
    });
    const data = (await res.json().catch(() => null)) as
      | { ok?: boolean; error?: string; configured?: boolean }
      | null;
    if (res.ok && data?.ok) {
      return { ok: true, message: 'Entrega recibida.', configured: true };
    }
    return {
      ok: false,
      message: data?.error ?? 'El servidor no pudo enviar la entrega.',
      configured: data?.configured !== false,
    };
  } catch {
    return {
      ok: false,
      message: 'No hay conexión con el servidor. Tu trabajo sigue guardado.',
      configured: true,
    };
  }
}

/**
 * Entrega manual en un gesto: descarga el archivo y abre el correo preparado
 * para adjuntarlo. Es el camino que siempre funciona, sin configuración y sin
 * depender de que el servidor pueda enviar.
 *
 * El orden importa: primero la descarga —que es lo que de verdad conserva el
 * trabajo— y solo después el cliente de correo, que en algunos navegadores se
 * lleva el foco de la pestaña.
 */
export function manualDelivery(submission: Class1Submission): string {
  const filename = downloadSubmission(submission);
  setTimeout(() => {
    window.location.href = fallbackMailto(submission);
  }, 400);
  return filename;
}

/**
 * Alternativa manual cuando el envío automático falla. No sustituye al envío:
 * es la salida de emergencia para que la entrega no dependa del correo.
 */
export function fallbackMailto(submission: Class1Submission): string {
  const params = new URLSearchParams({
    cc: delivery.cc,
    subject: SUBMISSION_SUBJECT,
    body: [
      `Entrega de la Clase 1 · ${submission.identity.name || 'Estudiante'}`,
      '',
      `Adjunto el archivo ${submissionFilename(submission)} que descargué desde la plataforma.`,
    ].join('\n'),
  });
  return `mailto:${delivery.to}?${params.toString().replace(/\+/g, '%20')}`;
}

export { delivery };
