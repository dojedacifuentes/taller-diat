// ─────────────────────────────────────────────────────────────────────────────
// BITÁCORA DE RAZONAMIENTO JURÍDICO ASISTIDO · PDF
//
// Generación client-side con jsPDF, reutilizando las primitivas y la paleta ya
// establecidas en @/lib/pdfGenerators. Texto vectorial real —no captura del
// DOM—: se puede seleccionar, buscar y pesa una fracción.
//
// El PDF no contiene notas, puntajes ni predicciones de competencia. Contiene lo
// que el estudiante decidió, escribió y verificó.
// ─────────────────────────────────────────────────────────────────────────────
import {
  C, CW, ML, MR, PW, accentBar, fillPage, getJsPDF, hLine,
  type JsPDFDoc,
} from '@/lib/pdfGenerators';
import { class1Meta } from '@/content/class1/manifest';
import {
  blameOptions, claimActions, claimStates, epistemicStatuses, errorTypes, myths,
  componentStates, diatComponents, riskLevels,
} from '@/content/class1/activities';
import { AI_TOOLS, AI_TOOL_NOTEBOOK } from '@/content/class1/prompts';
import type { Class1State } from './state';
import { fullName } from './state';
import type { Class1Progress } from './progress';

const FOOT = 'Programa DIAT · Escuela de Derecho PUCV';
const TITLE = 'Bitácora de Razonamiento Jurídico Asistido';

/** Margen inferior a partir del cual se salta de página. */
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
  ctx.doc.text(`${TITLE} · Clase 1 · ${ctx.student || 'Sin nombre'}`, ML, 285);
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

/** Reserva espacio vertical; salta de página si no cabe. */
function ensure(ctx: Ctx, needed: number) {
  if (ctx.y + needed > Y_LIMIT) newPage(ctx);
}

function sectionTitle(ctx: Ctx, n: string, title: string) {
  ensure(ctx, 18);
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
  opts: { size?: number; color?: [number, number, number]; indent?: number; style?: string } = {},
) {
  const { size = 9, color = C.grayL, indent = 0, style = 'normal' } = opts;
  const x = ML + indent;
  const width = CW - indent;
  ctx.doc.setFont('helvetica', style);
  ctx.doc.setFontSize(size);
  ctx.doc.setTextColor(...color);
  const lines = ctx.doc.splitTextToSize(text, width) as string[];
  const lh = size * 0.52;
  for (const line of lines) {
    ensure(ctx, lh + 1);
    ctx.doc.setFont('helvetica', style);
    ctx.doc.setFontSize(size);
    ctx.doc.setTextColor(...color);
    ctx.doc.text(line, x, ctx.y);
    ctx.y += lh;
  }
  ctx.y += 1.5;
}

/** Bloque de texto del estudiante, sobre tarjeta. */
function quoteCard(ctx: Ctx, text: string, opts: { mono?: boolean } = {}) {
  const value = text.trim() || '— sin completar —';
  const size = opts.mono ? 7.8 : 8.6;
  const font = opts.mono ? 'courier' : 'helvetica';
  ctx.doc.setFont(font, 'normal');
  ctx.doc.setFontSize(size);
  const lines = ctx.doc.splitTextToSize(value, CW - 8) as string[];
  const lh = size * 0.55;

  let i = 0;
  while (i < lines.length) {
    const remaining = Y_LIMIT - ctx.y - 6;
    const fit = Math.max(1, Math.floor(remaining / lh));
    if (fit < 1) { newPage(ctx); continue; }
    const chunk = lines.slice(i, i + fit);
    const h = chunk.length * lh + 5;

    ctx.doc.setFillColor(...C.bgCard);
    ctx.doc.roundedRect(ML, ctx.y, CW, h, 1.5, 1.5, 'F');
    ctx.doc.setDrawColor(...C.muted);
    ctx.doc.setLineWidth(0.15);
    ctx.doc.roundedRect(ML, ctx.y, CW, h, 1.5, 1.5, 'S');

    ctx.doc.setFont(font, 'normal');
    ctx.doc.setFontSize(size);
    ctx.doc.setTextColor(...(text.trim() ? C.grayL : C.grayD));
    chunk.forEach((l, k) => ctx.doc.text(l, ML + 4, ctx.y + 4.5 + k * lh));

    ctx.y += h + 3;
    i += fit;
    if (i < lines.length) newPage(ctx);
  }
}

function keyValue(ctx: Ctx, k: string, v: string) {
  ensure(ctx, 6);
  ctx.doc.setFont('courier', 'bold');
  ctx.doc.setFontSize(7.2);
  ctx.doc.setTextColor(...C.gray);
  ctx.doc.text(k.toUpperCase(), ML, ctx.y);
  ctx.doc.setFont('helvetica', 'normal');
  ctx.doc.setFontSize(8.6);
  ctx.doc.setTextColor(...C.white);
  const lines = ctx.doc.splitTextToSize(v || '—', CW - 45) as string[];
  lines.forEach((l, i) => {
    if (i > 0) ensure(ctx, 4.6);
    ctx.doc.setFont('helvetica', 'normal');
    ctx.doc.setFontSize(8.6);
    ctx.doc.setTextColor(...C.white);
    ctx.doc.text(l, ML + 45, ctx.y);
    if (i < lines.length - 1) ctx.y += 4.6;
  });
  ctx.y += 6;
}

/** Tabla simple con anchos proporcionales y salto de página por fila. */
function table(ctx: Ctx, head: string[], rows: string[][], widths: number[]) {
  const total = widths.reduce((a, b) => a + b, 0);
  const cols = widths.map(w => (w / total) * CW);

  function drawHead() {
    ensure(ctx, 10);
    ctx.doc.setFillColor(...C.bgLight);
    ctx.doc.rect(ML, ctx.y - 4, CW, 6.5, 'F');
    ctx.doc.setFont('courier', 'bold');
    ctx.doc.setFontSize(6.5);
    ctx.doc.setTextColor(...C.cyanL);
    let x = ML + 2;
    head.forEach((h, i) => {
      ctx.doc.text(h.toUpperCase(), x, ctx.y);
      x += cols[i];
    });
    ctx.y += 5;
  }

  drawHead();

  for (const row of rows) {
    ctx.doc.setFont('helvetica', 'normal');
    ctx.doc.setFontSize(7.6);
    const cells = row.map((cell, i) => ctx.doc.splitTextToSize(cell || '—', cols[i] - 4) as string[]);
    const h = Math.max(...cells.map(c => c.length)) * 3.9 + 3;

    if (ctx.y + h > Y_LIMIT) {
      newPage(ctx);
      drawHead();
    }

    let x = ML + 2;
    cells.forEach((c, i) => {
      c.forEach((l, k) => {
        ctx.doc.setFont('helvetica', 'normal');
        ctx.doc.setFontSize(7.6);
        ctx.doc.setTextColor(...C.grayL);
        ctx.doc.text(l, x, ctx.y + k * 3.9);
      });
      x += cols[i];
    });

    ctx.y += h;
    hLine(ctx.doc, ML, MR, ctx.y - 1.5, C.muted, 0.1);
  }
  ctx.y += 3;
}

// ─── Portada ─────────────────────────────────────────────────────────────────

function cover(ctx: Ctx, state: Class1State, progress: Class1Progress) {
  fillPage(ctx.doc);
  accentBar(ctx.doc, 0, 2);

  ctx.doc.setFont('courier', 'bold');
  ctx.doc.setFontSize(8);
  ctx.doc.setTextColor(...C.cyan);
  ctx.doc.text('PROGRAMA DIAT · ESCUELA DE DERECHO PUCV', ML, 30);

  ctx.doc.setFont('courier', 'normal');
  ctx.doc.setFontSize(7.5);
  ctx.doc.setTextColor(...C.gray);
  ctx.doc.text('TALLER DE IA Y PROMPTING JURÍDICO · CLASE 1', ML, 36);

  ctx.doc.setFont('helvetica', 'bold');
  ctx.doc.setFontSize(26);
  ctx.doc.setTextColor(...C.white);
  const t = ctx.doc.splitTextToSize(TITLE, CW) as string[];
  let y = 58;
  t.forEach(l => { ctx.doc.text(l, ML, y); y += 11; });

  ctx.doc.setFillColor(...C.cyan);
  ctx.doc.rect(ML, y + 2, 32, 1.2, 'F');
  y += 14;

  ctx.doc.setFont('helvetica', 'normal');
  ctx.doc.setFontSize(12);
  ctx.doc.setTextColor(...C.grayL);
  ctx.doc.text('Del prompt aislado al razonamiento jurídico asistido', ML, y);
  y += 22;

  // Ficha del estudiante
  ctx.doc.setFillColor(...C.bgCard);
  ctx.doc.roundedRect(ML, y, CW, 40, 2, 2, 'F');
  ctx.doc.setDrawColor(...C.cyan);
  ctx.doc.setLineWidth(0.25);
  ctx.doc.roundedRect(ML, y, CW, 40, 2, 2, 'S');

  const rows: [string, string][] = [
    ['ESTUDIANTE', fullName(state.student) || '—'],
    ['CORREO', state.student.email || '—'],
    ['SESIÓN', `${class1Meta.date} · ${class1Meta.time}`],
  ];
  rows.forEach((r, i) => {
    const ry = y + 11 + i * 10;
    ctx.doc.setFont('courier', 'bold');
    ctx.doc.setFontSize(7);
    ctx.doc.setTextColor(...C.gray);
    ctx.doc.text(r[0], ML + 6, ry);
    ctx.doc.setFont('helvetica', 'bold');
    ctx.doc.setFontSize(10);
    ctx.doc.setTextColor(...C.white);
    ctx.doc.text(r[1], ML + 40, ry);
  });
  y += 52;

  // Hitos
  ctx.doc.setFont('courier', 'bold');
  ctx.doc.setFontSize(7);
  ctx.doc.setTextColor(...C.gray);
  ctx.doc.text('HITOS DE LA BITÁCORA', ML, y);
  y += 7;

  const hitos: [string, boolean][] = [
    ['Producto A · prompt jurídico estructurado', progress.productA],
    ['Producto B · matriz ICJR aplicada', progress.productB],
    ['Producto C · desplazamiento conceptual', progress.productC],
  ];
  hitos.forEach(([labelText, ok]) => {
    ctx.doc.setFillColor(...(ok ? C.emerald : C.grayD));
    ctx.doc.circle(ML + 2, y - 1.2, 1.4, 'F');
    ctx.doc.setFont('helvetica', 'normal');
    ctx.doc.setFontSize(9);
    ctx.doc.setTextColor(...(ok ? C.white : C.grayD));
    ctx.doc.text(labelText, ML + 7, y);
    ctx.doc.setFont('courier', 'normal');
    ctx.doc.setFontSize(7);
    ctx.doc.setTextColor(...(ok ? C.emerald : C.grayD));
    ctx.doc.text(ok ? 'COMPLETO' : 'INCOMPLETO', MR, y, { align: 'right' });
    y += 7;
  });

  y += 8;
  ctx.doc.setFont('helvetica', 'italic');
  ctx.doc.setFontSize(8.5);
  ctx.doc.setTextColor(...C.gray);
  const thesis = ctx.doc.splitTextToSize(`«${class1Meta.thesis}»`, CW) as string[];
  thesis.forEach(l => { ctx.doc.text(l, ML, y); y += 4.8; });

  hLine(ctx.doc, ML, MR, 262, C.muted);
  ctx.doc.setFont('courier', 'normal');
  ctx.doc.setFontSize(7);
  ctx.doc.setTextColor(...C.grayD);
  ctx.doc.text(FOOT, ML, 268);
  ctx.doc.text(
    `Generado el ${new Date().toLocaleDateString('es-CL')}`,
    MR, 268, { align: 'right' },
  );
  ctx.doc.setFontSize(6.5);
  ctx.doc.text(
    'Documento producido por el estudiante. No constituye certificación de competencia.',
    PW / 2, 274, { align: 'center' },
  );
}

// ─── Documento ───────────────────────────────────────────────────────────────

export function bitacoraFilename(state: Class1State): string {
  const clean = (s: string) =>
    s.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9]/g, '') || 'Estudiante';
  const last = clean(state.student.lastName);
  const first = clean(state.student.firstName);
  return `DIAT_CLASE1_${last}_${first}_2026-08-27.pdf`;
}

export async function generateBitacoraPDF(
  state: Class1State,
  progress: Class1Progress,
): Promise<void> {
  const JsPDF = await getJsPDF();
  const doc = new JsPDF({ unit: 'mm', format: 'a4' });
  const ctx: Ctx = { doc, y: 22, page: 1, student: fullName(state.student) };

  cover(ctx, state, progress);
  newPage(ctx);

  // 1 · Diagnóstico inicial
  sectionTitle(ctx, '01', 'Diagnóstico inicial · B00');
  keyValue(ctx, 'Respuesta', blameOptions.find(o => o.id === state.b00.blame)?.label ?? '—');
  keyValue(ctx, 'Confianza', state.b00.confidence ?? '—');
  body(ctx, 'Pregunta: un escrito contiene una cita doctrinal perfectamente formateada, pero el libro no existe. ¿Dónde está el fallo?', { size: 8, color: C.gray });

  // 2 · Mitos
  sectionTitle(ctx, '02', 'Cinco mitos · B02');
  const mythRows = myths
    .filter(m => state.b02.committed[m.id])
    .map(m => {
      const mine = state.b02.answers[m.id];
      return [m.statement, mine ?? '—', m.answer, mine === m.answer ? 'Coincide' : 'Contrasta'];
    });
  if (mythRows.length) {
    table(ctx, ['Afirmación', 'Tu respuesta', 'Respuesta', 'Resultado'], mythRows, [50, 16, 16, 16]);
  } else {
    body(ctx, 'Sin respuestas registradas.', { color: C.grayD });
  }

  // 3 · Diagnóstico DIAT
  sectionTitle(ctx, '03', 'Diagnóstico DIAT · B03');
  const compRows = diatComponents.map(c => [
    c.label,
    componentStates.find(s => s.id === state.b03.states[c.id])?.label ?? '—',
  ]);
  table(ctx, ['Componente', 'Estado diagnosticado'], compRows, [30, 70]);
  label(ctx, 'Decisión implícita detectada');
  quoteCard(ctx, state.b03.implicitDecisions);

  // 4 · Producto A
  sectionTitle(ctx, '04', 'Producto A · prompt jurídico estructurado · B04');
  const a = state.productA;
  keyValue(ctx, 'Tarea', a.task);
  keyValue(ctx, 'Nivel de riesgo', riskLevels.find(r => r.id === a.risk)?.label ?? '—');
  keyValue(
    ctx,
    'Componentes',
    a.components.length
      ? a.components.map(id => diatComponents.find(c => c.id === id)?.label ?? id).join(' · ')
      : '—',
  );
  label(ctx, 'Decisiones que no delego');
  quoteCard(ctx, a.notDelegating);
  label(ctx, 'Prompt');
  quoteCard(ctx, a.prompt, { mono: true });

  label(ctx, 'Tres decisiones de diseño justificadas');
  const decRows = a.decisions
    .map((d, i) => [String(i + 1), d, a.reasons[i]])
    .filter(r => r[1].trim() || r[2].trim());
  if (decRows.length) {
    table(ctx, ['#', 'Decisión', 'Por qué'], decRows, [6, 44, 50]);
  } else {
    body(ctx, 'Sin decisiones registradas.', { color: C.grayD });
  }

  // 5 · Auditoría
  sectionTitle(ctx, '05', 'Auditoría del propio prompt · B05');
  const toolName =
    [...AI_TOOLS, AI_TOOL_NOTEBOOK].find(t => t.id === state.b05.tool)?.label ?? '—';
  keyValue(ctx, 'Herramienta', toolName);
  label(ctx, 'Sugerencia aceptada');
  quoteCard(ctx, state.b05.accepted);
  label(ctx, 'Por qué la acepto');
  quoteCard(ctx, state.b05.acceptedWhy);
  label(ctx, 'Sugerencia rechazada');
  quoteCard(ctx, state.b05.rejected);
  label(ctx, 'Con qué fundamento la rechazo');
  quoteCard(ctx, state.b05.rejectedWhy);
  if (state.b05.excerpt.trim()) {
    label(ctx, 'Fragmento conservado de la auditoría');
    quoteCard(ctx, state.b05.excerpt);
  }

  // 6 · Error Lab
  sectionTitle(ctx, '06', 'Error Lab · B06');
  keyValue(
    ctx,
    'Fuente real ≠ conclusión',
    state.b06.revealCommitted
      ? `Respuesta: ${state.b06.revealAnswer === 'no' ? 'no basta con que el rol exista' : 'la daba por verificada'} · confianza declarada: ${state.b06.revealConfidence ?? '—'}`
      : 'Sin registrar',
  );
  const errRows = Object.entries(state.b06.cases)
    .filter(([id]) => state.b06.committed[id])
    .map(([id, chosen]) => {
      const def = errorTypes.find(t => t.id === chosen);
      return [id.toUpperCase(), def ? `Tipo ${def.n} · ${def.label}` : String(chosen)];
    });
  if (errRows.length) table(ctx, ['Caso', 'Clasificación'], errRows, [14, 86]);
  if (state.b06.takeaway.trim()) {
    label(ctx, 'Qué me llevo del contraste tipo 2 / tipo 4');
    quoteCard(ctx, state.b06.takeaway);
  }

  // 7 · Grounding
  sectionTitle(ctx, '07', 'Grounding · B07');
  keyValue(
    ctx,
    'Procedencia',
    state.b07.committed['g1'] ? (state.b07.decisions['g1'] === 'b' ? 'Un localizador no valida la conclusión' : 'Respuesta registrada') : 'Sin registrar',
  );
  keyValue(
    ctx,
    'Interpretación',
    state.b07.committed['g2'] ? (state.b07.decisions['g2'] === 'b' ? 'Identificada como inferencia' : 'Respuesta registrada') : 'Sin registrar',
  );
  if (state.b07.note.trim()) {
    label(ctx, 'Nota de la demostración');
    quoteCard(ctx, state.b07.note);
  }

  // 8 · Producto B
  sectionTitle(ctx, '08', 'Producto B · matriz ICJR · B08');
  const icjrRows = state.b08.claims
    .filter(c => c.claim.trim())
    .map(c => [
      c.claim,
      c.status ? `${c.status} · ${epistemicStatuses.find(e => e.id === c.status)?.label ?? ''}` : '—',
      c.source,
      c.locator,
      [
        claimStates.find(s => s.id === c.state)?.label,
        claimActions.find(x => x.id === c.action)?.label,
      ].filter(Boolean).join(' → ') || '—',
    ]);
  if (icjrRows.length) {
    table(ctx, ['Afirmación', 'Estatus', 'Fuente', 'Localizador', 'Estado → Acción'], icjrRows, [30, 16, 18, 16, 20]);
  } else {
    body(ctx, 'Sin afirmaciones registradas.', { color: C.grayD });
  }
  if (state.b08.verifiedBy.trim() || state.b08.verifiedAt.trim()) {
    keyValue(ctx, 'Verificó', `${state.b08.verifiedBy || '—'}${state.b08.verifiedAt ? ` · ${state.b08.verifiedAt}` : ''}`);
  }
  if (state.b08.notes.trim()) {
    label(ctx, 'Registro (paso R)');
    quoteCard(ctx, state.b08.notes);
  }

  // 9 · Producto C
  sectionTitle(ctx, '09', 'Producto C · desplazamiento conceptual · B09');
  const beforeLabel = blameOptions.find(o => o.id === state.b00.blame)?.label ?? '—';
  const afterLabel = blameOptions.find(o => o.id === state.b09.blame)?.label ?? '—';
  table(
    ctx,
    ['', 'Respuesta', 'Confianza'],
    [
      ['Antes (B00)', beforeLabel, state.b00.confidence ?? '—'],
      ['Ahora (B09)', afterLabel, state.b09.confidence ?? '—'],
    ],
    [20, 55, 25],
  );
  label(ctx, 'Antes de esta clase pensaba que el problema era');
  quoteCard(ctx, state.b09.before);
  label(ctx, 'Ahora agregaría');
  quoteCard(ctx, state.b09.after);
  if (state.b09.doubt.trim()) {
    label(ctx, 'Todavía tengo una duda sobre');
    quoteCard(ctx, state.b09.doubt);
  }

  // 10 · Cierre
  sectionTitle(ctx, '10', 'Tres reglas para recordar');
  class1Meta.rules.forEach((r, i) => {
    ensure(ctx, 12);
    ctx.doc.setFont('courier', 'bold');
    ctx.doc.setFontSize(9);
    ctx.doc.setTextColor(...C.cyan);
    ctx.doc.text(String(i + 1), ML, ctx.y);
    body(ctx, r, { indent: 8, size: 9.5, color: C.white });
  });

  ensure(ctx, 26);
  ctx.y += 4;
  ctx.doc.setFillColor(...C.bgCard);
  ctx.doc.roundedRect(ML, ctx.y, CW, 18, 2, 2, 'F');
  ctx.doc.setDrawColor(...C.cyan);
  ctx.doc.setLineWidth(0.25);
  ctx.doc.roundedRect(ML, ctx.y, CW, 18, 2, 2, 'S');
  ctx.doc.setFont('helvetica', 'bold');
  ctx.doc.setFontSize(13);
  ctx.doc.setTextColor(...C.white);
  ctx.doc.text('LA IA NO COMPARECE ANTE EL TRIBUNAL.', PW / 2, ctx.y + 8, { align: 'center' });
  ctx.doc.setFont('helvetica', 'normal');
  ctx.doc.setFontSize(7.5);
  ctx.doc.setTextColor(...C.gray);
  ctx.doc.text(
    'La responsabilidad profesional sobre lo que se afirma, cita y firma sigue siendo humana.',
    PW / 2, ctx.y + 14, { align: 'center' },
  );
  ctx.y += 24;

  footer(ctx);
  doc.save(bitacoraFilename(state));
}
