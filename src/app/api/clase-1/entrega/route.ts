// ─────────────────────────────────────────────────────────────────────────────
// ENTREGA DE LA CLASE 1 · ENVÍO POR CORREO
//
// Server-side y solo server-side: las credenciales nunca salen de aquí. El
// endpoint responde `ok: true` únicamente cuando un proveedor ha aceptado el
// correo. Nunca se finge un envío.
//
// Dos vías, se usa la primera que esté configurada:
//
//   1. SMTP  — el camino de una universidad. Sirve el servidor de la casa o una
//              cuenta de Gmail con contraseña de aplicación.
//   2. Resend — API HTTP, sin dependencia: útil si no hay SMTP a mano.
//
// Si no hay ninguna, se devuelve 503 con `configured: false` y el cliente pasa
// a la entrega manual: descarga el archivo y abre el correo preparado. La
// entrega nunca depende de que esto esté configurado.
//
// Configuración: ver .env.example.
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

interface Fail {
  error: string;
  status: number;
  /** `false` cuando el servidor no tiene correo configurado, no cuando falla. */
  configured?: boolean;
}

function fail({ error, status, configured = true }: Fail): Response {
  return Response.json({ ok: false, error, configured }, { status });
}

/**
 * Comprueba la forma completa que el renderizador va a recorrer. Antes se
 * miraban solo cinco campos y una entrega a medias —un `localStorage` de una
 * versión anterior, una petición manipulada— llegaba hasta el renderizador y
 * reventaba con un 500. Un cuerpo mal formado tiene que salir por 400.
 */
function isSubmission(value: unknown): value is Class1Submission {
  if (!value || typeof value !== 'object') return false;
  const s = value as Partial<Class1Submission>;
  const objetos = [
    s.meta, s.identity, s.initialQuestion, s.promptV1, s.audit,
    s.promptV2, s.verification, s.finalQuestion, s.reflection,
  ];
  if (objetos.some(o => !o || typeof o !== 'object')) return false;
  if (typeof s.identity?.name !== 'string') return false;
  return Array.isArray(s.verification?.claims);
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

interface Envelope {
  to: string;
  cc?: string;
  from: string;
  replyTo?: string;
  subject: string;
  markdown: string;
  filename: string;
}

// ─── Vía 1 · SMTP ────────────────────────────────────────────────────────────

async function sendSmtp(env: Envelope): Promise<string | null> {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD;
  if (!host || !user || !pass) return 'sin-configurar';

  const port = Number(process.env.SMTP_PORT ?? 587);
  // 465 es SMTPS (TLS desde el saludo); 587 y 25 negocian STARTTLS.
  const secure = (process.env.SMTP_SECURE ?? (port === 465 ? 'true' : 'false')) === 'true';

  const { createTransport } = await import('nodemailer');
  const transport = createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
  });

  await transport.sendMail({
    from: env.from,
    to: env.to,
    cc: env.cc,
    replyTo: env.replyTo,
    subject: env.subject,
    text: env.markdown,
    attachments: [{ filename: env.filename, content: env.markdown, contentType: 'text/markdown; charset=utf-8' }],
  });
  return null;
}

// ─── Vía 2 · Resend ──────────────────────────────────────────────────────────

async function sendResend(env: Envelope): Promise<string | null> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return 'sin-configurar';

  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.from,
      to: [env.to],
      cc: env.cc ? [env.cc] : undefined,
      reply_to: env.replyTo || undefined,
      subject: env.subject,
      text: env.markdown,
      html: `<pre style="font-family:ui-monospace,Menlo,Consolas,monospace;white-space:pre-wrap">${escapeHtml(env.markdown)}</pre>`,
      attachments: [{ filename: env.filename, content: Buffer.from(env.markdown, 'utf8').toString('base64') }],
    }),
  });

  if (response.ok) return null;
  const detail = await response.text().catch(() => '');
  console.error('[clase-1/entrega] Resend respondió', response.status, detail);
  return `resend:${response.status}`;
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export async function POST(request: Request): Promise<Response> {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return fail({
      error: 'La entrega es demasiado grande para enviarse por correo. Descárgala y envíala manualmente.',
      status: 413,
    });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return fail({ error: 'La entrega llegó malformada. Vuelve a intentarlo.', status: 400 });
  }

  const submission = (payload as { submission?: unknown })?.submission;
  if (!isSubmission(submission)) {
    return fail({ error: 'La entrega llegó incompleta. Vuelve a intentarlo.', status: 400 });
  }
  if (!submission.identity.name.trim()) {
    return fail({ error: 'Falta tu nombre o identificador para enviar la entrega.', status: 400 });
  }

  const to = process.env.CLASS1_SUBMISSION_EMAIL?.trim() || delivery.to;
  const cc = process.env.CLASS1_SUBMISSION_CC?.trim() || delivery.cc;
  // El remitente por defecto es la propia cuenta SMTP: casi siempre es lo
  // correcto y evita que el servidor rechace un `from` que no le pertenece.
  const from = process.env.CLASS1_SUBMISSION_FROM?.trim() || process.env.SMTP_USER?.trim();

  if (!from) {
    return fail({
      error: 'El envío por correo no está configurado en el servidor.',
      status: 503,
      configured: false,
    });
  }

  // Cinturón además de los tirantes: aunque la forma valide, componer el
  // documento no puede tumbar el endpoint. Si falla, es un cuerpo defectuoso.
  let markdown: string;
  let filename: string;
  try {
    markdown = renderSubmissionMarkdown(submission);
    filename = submissionFilename(submission);
  } catch (err) {
    console.error('[clase-1/entrega] no se pudo componer la entrega', err);
    return fail({ error: 'La entrega llegó incompleta. Vuelve a intentarlo.', status: 400 });
  }

  const envelope: Envelope = {
    to,
    cc: cc || undefined,
    from,
    replyTo: submission.identity.email?.trim() || undefined,
    subject: SUBMISSION_SUBJECT,
    markdown,
    filename,
  };

  const vias: { nombre: string; enviar: () => Promise<string | null> }[] = [
    { nombre: 'smtp', enviar: () => sendSmtp(envelope) },
    { nombre: 'resend', enviar: () => sendResend(envelope) },
  ];

  let alguna = false;
  for (const via of vias) {
    let resultado: string | null;
    try {
      resultado = await via.enviar();
    } catch (err) {
      console.error(`[clase-1/entrega] ${via.nombre} lanzó`, err);
      resultado = `${via.nombre}:excepcion`;
    }
    if (resultado === null) {
      return Response.json({ ok: true, filename: envelope.filename, via: via.nombre });
    }
    if (resultado !== 'sin-configurar') alguna = true;
  }

  if (!alguna) {
    return fail({
      error: 'El envío por correo no está configurado en el servidor.',
      status: 503,
      configured: false,
    });
  }

  return fail({
    error: 'El servicio de correo rechazó la entrega. Tu trabajo está intacto: descárgalo y vuelve a intentarlo.',
    status: 502,
  });
}
