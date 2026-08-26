// ─────────────────────────────────────────────────────────────────────────────
// ENTREGA DE LA CLASE 1 · ENVÍO POR CORREO
//
// Server-side y solo server-side: la clave del proveedor nunca sale de aquí.
// El endpoint responde `ok: true` únicamente cuando el proveedor ha aceptado el
// correo; cualquier otro caso devuelve un error explícito para que el cliente
// muestre «No se pudo enviar · Reintentar» y conserve la descarga.
//
// Proveedor: Resend a través de su API HTTP. Se usa `fetch` en lugar del SDK
// para no añadir una dependencia solo por esto.
//
// Configuración (ver .env.example):
//   RESEND_API_KEY            obligatoria para que el envío funcione
//   CLASS1_SUBMISSION_EMAIL   destinatario; por defecto el del programa
//   CLASS1_SUBMISSION_CC      copia; por defecto la del programa
//   CLASS1_SUBMISSION_FROM    remitente verificado en el proveedor
// ─────────────────────────────────────────────────────────────────────────────
import { delivery } from '@/content/class1/manifest';
import { SUBMISSION_SUBJECT } from '@/lib/class1/delivery';
import {
  renderSubmissionMarkdown, submissionFilename, type Class1Submission,
} from '@/lib/class1/submission';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Tope defensivo: una entrega razonable no pasa de aquí ni con un fallo largo. */
const MAX_BODY_BYTES = 512 * 1024;

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

function fail(error: string, status: number): Response {
  return Response.json({ ok: false, error }, { status });
}

function isSubmission(value: unknown): value is Class1Submission {
  if (!value || typeof value !== 'object') return false;
  const s = value as Partial<Class1Submission>;
  return Boolean(s.meta && s.identity && s.promptV1 && s.promptV2 && s.verification);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function POST(request: Request): Promise<Response> {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return fail('La entrega es demasiado grande para enviarse por correo. Descárgala y envíala manualmente.', 413);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return fail('La entrega llegó malformada. Vuelve a intentarlo.', 400);
  }

  const submission = (payload as { submission?: unknown })?.submission;
  if (!isSubmission(submission)) {
    return fail('La entrega llegó incompleta. Vuelve a intentarlo.', 400);
  }
  if (!submission.identity.name.trim()) {
    return fail('Falta tu nombre o identificador para enviar la entrega.', 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CLASS1_SUBMISSION_EMAIL?.trim() || delivery.to;
  const cc = process.env.CLASS1_SUBMISSION_CC?.trim() || delivery.cc;
  const from = process.env.CLASS1_SUBMISSION_FROM?.trim();

  if (!apiKey || !from) {
    return fail(
      'El envío por correo no está configurado en el servidor. Descarga tu Clase 1 y entrégala por el canal que indique el profesor.',
      503,
    );
  }

  const markdown = renderSubmissionMarkdown(submission);
  const filename = submissionFilename(submission);

  let response: Response;
  try {
    response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        cc: cc ? [cc] : undefined,
        reply_to: submission.identity.email || undefined,
        subject: SUBMISSION_SUBJECT,
        text: markdown,
        html: `<pre style="font-family:ui-monospace,Menlo,Consolas,monospace;white-space:pre-wrap">${escapeHtml(markdown)}</pre>`,
        attachments: [
          {
            filename,
            content: Buffer.from(markdown, 'utf8').toString('base64'),
          },
        ],
      }),
    });
  } catch {
    return fail('No se pudo contactar con el servicio de correo. Inténtalo de nuevo.', 502);
  }

  if (!response.ok) {
    // El detalle del proveedor se queda en el log del servidor: al estudiante
    // se le dice lo que puede hacer, no lo que falló por dentro.
    const detail = await response.text().catch(() => '');
    console.error('[clase-1/entrega] Resend respondió', response.status, detail);
    return fail('El servicio de correo rechazó la entrega. Descárgala y vuelve a intentarlo.', 502);
  }

  return Response.json({ ok: true, filename });
}
