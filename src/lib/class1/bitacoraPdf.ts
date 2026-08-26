// ─────────────────────────────────────────────────────────────────────────────
// CLASE 1 · PDF DE LA ENTREGA
//
// Segundo formato de la misma entrega: lee el objeto que produce
// `buildClass1Submission`, igual que la descarga en Markdown y que el correo.
// Ninguno puede decir algo distinto de los otros.
//
// jsPDF ya estaba en el proyecto; el PDF es texto vectorial, no captura del DOM.
// El formato principal sigue siendo el `.md`: si esto falla, la entrega no se
// bloquea.
// ─────────────────────────────────────────────────────────────────────────────
import { C, CW, ML, MR, accentBar, fillPage, getJsPDF, hLine, type JsPDFDoc } from '@/lib/pdfGenerators';
import type { Class1Submission } from './submission';
import { submissionFilename } from './submission';

const Y_LIMIT = 268;

interface Ctx {
  doc: JsPDFDoc;
  y: number;
  page: number;
  student: string;
}

function footer(ctx: Ctx) {
  hLine(ctx.doc, ML, MR, 278, C.muted);
  ctx.doc.setFont('courier', 'normal');
  ctx.doc.setFontSize(7);
  ctx.doc.setTextColor(...C.grayD);
  ctx.doc.text(`Clase 1 · ${ctx.student || 'Sin nombre'}`, ML, 285);
  ctx.doc.text(String(ctx.page), MR, 285, { align: 'right' });
}

function newPage(ctx: Ctx) {
  footer(ctx);
  ctx.doc.addPage();
  ctx.page += 1;
  fillPage(ctx.doc);
  accentBar(ctx.doc, 0, 1);
  ctx.y = 22;
}

function ensure(ctx: Ctx, needed: number) {
  if (ctx.y + needed > Y_LIMIT) newPage(ctx);
}

function sectionTitle(ctx: Ctx, n: string, title: string) {
  ensure(ctx, 20);
  ctx.y += 4;
  ctx.doc.setFont('courier', 'bold');
  ctx.doc.setFontSize(7.5);
  ctx.doc.setTextColor(...C.cyan);
  ctx.doc.text(n, ML, ctx.y);
  ctx.doc.setFont('helvetica', 'bold');
  ctx.doc.setFontSize(12);
  ctx.doc.setTextColor(...C.white);
  ctx.doc.text(title, ML + 10, ctx.y);
  hLine(ctx.doc, ML, MR, ctx.y + 2.5, C.cyan, 0.25);
  ctx.y += 9;
}

function label(ctx: Ctx, text: string) {
  ensure(ctx, 8);
  ctx.doc.setFont('courier', 'bold');
  ctx.doc.setFontSize(6.8);
  ctx.doc.setTextColor(...C.gray);
  ctx.doc.text(text.toUpperCase(), ML, ctx.y);
  ctx.y += 4;
}

/** Párrafo con salto de página automático línea a línea. */
function body(
  ctx: Ctx,
  text: string,
  opts: { size?: number; color?: [number, number, number]; indent?: number; mono?: boolean } = {},
) {
  const { size = 9, color = C.grayL, indent = 0, mono = false } = opts;
  const font = mono ? 'courier' : 'helvetica';
  const x = ML + indent;
  const width = CW - indent;
  ctx.doc.setFont(font, 'normal');
  ctx.doc.setFontSize(size);
  const lines = ctx.doc.splitTextToSize(text || '—', width) as string[];
  const lh = size * 0.55;
  for (const line of lines) {
    ensure(ctx, lh + 1);
    ctx.doc.setFont(font, 'normal');
    ctx.doc.setFontSize(size);
    ctx.doc.setTextColor(...color);
    ctx.doc.text(line, x, ctx.y);
    ctx.y += lh;
  }
  ctx.y += 2;
}

function field(ctx: Ctx, name: string, value: string) {
  label(ctx, name);
  body(ctx, value.trim() || '—');
}

/** Bloque de prompt sobre tarjeta, en monoespaciada. */
function promptCard(ctx: Ctx, text: string) {
  const value = text.trim() || '— sin completar —';
  ctx.doc.setFont('courier', 'normal');
  ctx.doc.setFontSize(7.6);
  const lines = ctx.doc.splitTextToSize(value, CW - 8) as string[];
  const lh = 3.6;

  let i = 0;
  while (i < lines.length) {
    const available = Math.floor((Y_LIMIT - ctx.y - 6) / lh);
    if (available < 3) {
      newPage(ctx);
      continue;
    }
    const chunk = lines.slice(i, i + available);
    const h = chunk.length * lh + 6;
    ctx.doc.setFillColor(...C.bgCard);
    ctx.doc.roundedRect(ML, ctx.y, CW, h, 2, 2, 'F');
    ctx.doc.setFont('courier', 'normal');
    ctx.doc.setFontSize(7.6);
    ctx.doc.setTextColor(...C.grayL);
    chunk.forEach((l, li) => ctx.doc.text(l, ML + 4, ctx.y + 5 + li * lh));
    ctx.y += h + 3;
    i += chunk.length;
  }
}

export function class1PdfFilename(submission: Class1Submission): string {
  return submissionFilename(submission).replace(/\.md$/, '.pdf');
}

/** Genera y descarga el PDF de la entrega. */
export async function generateClass1PDF(submission: Class1Submission): Promise<void> {
  const JsPDF = await getJsPDF();
  const doc = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const student = submission.identity.name || 'Sin nombre';
  const ctx: Ctx = { doc, y: 0, page: 1, student };

  // Portada compacta: sin página completa desperdiciada.
  fillPage(doc);
  accentBar(doc, 0, 2);
  doc.setFont('courier', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...C.cyan);
  doc.text(`${submission.meta.classCode} · ${submission.meta.classDate}`, ML, 24);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...C.white);
  const titleLines = doc.splitTextToSize(submission.meta.classTitle, CW) as string[];
  let ty = 36;
  titleLines.forEach(l => { doc.text(l, ML, ty); ty += 9; });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...C.grayL);
  doc.text(student, ML, ty + 2);
  if (submission.identity.email) {
    doc.setFontSize(8.5);
    doc.setTextColor(...C.gray);
    doc.text(submission.identity.email, ML, ty + 8);
  }
  hLine(doc, ML, MR, ty + 14, C.cyan, 0.3);
  ctx.y = ty + 24;

  sectionTitle(ctx, '01', `Pregunta guía · ${submission.guidingQuestion}`);
  field(ctx, 'Al comenzar', submission.initialQuestion.answerLabel);
  field(ctx, 'Confianza', submission.initialQuestion.confidence ?? '—');

  sectionTitle(ctx, '02', 'Prompt V1');
  for (const row of submission.promptV1.config) field(ctx, row.label, row.value);
  label(ctx, 'Texto');
  promptCard(ctx, submission.promptV1.text);

  sectionTitle(ctx, '03', 'Auditoría del prompt');
  field(ctx, 'Herramienta', submission.audit.tool);
  field(ctx, 'Sugerencia que acepté', submission.audit.accepted);
  field(ctx, 'Sugerencia que rechacé', submission.audit.rejected);
  field(ctx, 'Por qué', submission.audit.why);

  sectionTitle(ctx, '04', 'Prompt V2 · auditado');
  promptCard(ctx, submission.promptV2.text);

  sectionTitle(ctx, '05', 'Verificación (ICJR)');
  if (submission.verification.claims.length === 0) {
    body(ctx, '— sin completar —');
  } else {
    submission.verification.claims.forEach((c, i) => {
      label(ctx, `Afirmación ${i + 1} · identificar`);
      body(ctx, c.claim, { mono: true, size: 8 });
      field(ctx, 'Contrastar', c.source);
      field(ctx, 'Justificar', c.locator);
      field(ctx, 'Registrar', c.action);
    });
  }

  sectionTitle(ctx, '06', `Vuelta a la pregunta guía · ${submission.guidingQuestion}`);
  field(
    ctx,
    'Al comenzar',
    `${submission.initialQuestion.answerLabel} (confianza: ${submission.initialQuestion.confidence ?? '—'})`,
  );
  field(
    ctx,
    'Ahora',
    `${submission.finalQuestion.answerLabel} (confianza: ${submission.finalQuestion.confidence ?? '—'})`,
  );

  sectionTitle(ctx, '07', 'Microreflexión');
  body(
    ctx,
    `Antes pensaba que el problema era ${submission.reflection.before || '—'}. Ahora agregaría ${submission.reflection.after || '—'}.`,
  );

  footer(ctx);
  doc.save(class1PdfFilename(submission));
}
