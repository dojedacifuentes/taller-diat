// ─────────────────────────────────────────────────────────────────────────────
// GENERADORES DE LOS DOCE DESCARGABLES
//
// Se producen en el navegador con jsPDF, reutilizando la paleta y los helpers
// de pdfGenerators.ts para que las fichas no parezcan de otro taller. Son PDF
// de texto vectorial: se pueden buscar, copiar y ampliar sin pixelarse.
//
// No hay contenido escrito a mano en este archivo. Todo proviene de @/data.
// ─────────────────────────────────────────────────────────────────────────────
import {
  C, getJsPDF, type JsPDFDoc,
} from '@/lib/pdfGenerators';
import { identity, institution, schedule, sessions } from '@/data/program';
import {
  promptLayers, promptProgression, verificationProtocol, glossary, glossaryGroups,
  privacyRule, privacyPractices, aiMinimum, thesis, huntRule,
} from '@/data/pedagogy';
import {
  matrixColumns, validationFields, challengeFields, challengeRule, canonicalFlow,
  flowKindMeta, verdictLabels, verdictHelp, huntClaims, huntIntro, brokenFlow,
  translationExample, pitchSpec,
} from '@/data/labs';
import { rubric, rubricLevelOrder, peerChecklist, crossAudit } from '@/data/assessment';
import { troncalCase, cases, SOURCES_CHECKED_ON, VIGENCIA_NOTE } from '@/data/cases';
import { planFor } from '@/data/sessionPlan';
import type { FlowKind } from '@/lib/types';

type RGB = [number, number, number];

// La paleta compartida no define estos dos tonos; se declaran aquí para las
// fichas que necesitan marcar «esto está mal» y «atención».
const ROSE: RGB = [251, 113, 133];
const AMBER: RGB = [251, 191, 36];

const FOOT = `${identity.name} · ${institution.program}`;

// ─────────────────────────────────────────────────────────────────────────────
// Contexto de dibujo con salto de página automático
// ─────────────────────────────────────────────────────────────────────────────
interface DocCtx {
  doc: JsPDFDoc;
  y: number;
  page: number;
  W: number;   // ancho de página
  H: number;   // alto de página
  ML: number;  // margen izquierdo
  MR: number;  // margen derecho
  CW: number;  // ancho útil
  accent: RGB;
  title: string;
  code: string;
}

const BOTTOM = 20; // margen inferior antes del pie

async function startDoc(opts: {
  code: string;
  title: string;
  accent: RGB;
  landscape?: boolean;
}): Promise<DocCtx> {
  const JsPDF = await getJsPDF();
  const doc = new JsPDF({
    orientation: opts.landscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  const W = opts.landscape ? 297 : 210;
  const H = opts.landscape ? 210 : 297;
  const ML = 18;
  const MR = W - 18;
  const ctx: DocCtx = {
    doc, y: 0, page: 1, W, H, ML, MR, CW: MR - ML,
    accent: opts.accent, title: opts.title, code: opts.code,
  };
  paintPage(ctx, true);
  return ctx;
}

/** Fondo, barra de acento, cabecera y pie. */
function paintPage(ctx: DocCtx, first: boolean) {
  const { doc, W, H, ML, MR } = ctx;

  doc.setFillColor(...C.bg);
  doc.rect(0, 0, W, H, 'F');

  doc.setFillColor(...C.cyan);
  doc.rect(0, 0, W / 2, 1.4, 'F');
  doc.setFillColor(...C.indigo);
  doc.rect(W / 2, 0, W / 2, 1.4, 'F');

  if (first) {
    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...ctx.accent);
    doc.text(`FICHA ${ctx.code}`, ML, 15);

    doc.setFont('courier', 'normal');
    doc.setTextColor(...C.grayD);
    doc.text(`${schedule.datesShort}`, MR, 15, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(19);
    doc.setTextColor(...C.white);
    const lines = doc.splitTextToSize(ctx.title, ctx.CW) as string[];
    let ty = 26;
    lines.forEach(l => { doc.text(l, ML, ty); ty += 8; });

    doc.setDrawColor(...ctx.accent);
    doc.setLineWidth(0.3);
    doc.line(ML, ty - 3, MR, ty - 3);
    ctx.y = ty + 5;
  } else {
    doc.setFont('courier', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...C.grayD);
    doc.text(`FICHA ${ctx.code} · ${ctx.title}`, ML, 12);
    doc.setDrawColor(...C.muted);
    doc.setLineWidth(0.2);
    doc.line(ML, 15, MR, 15);
    ctx.y = 22;
  }

  // Pie
  doc.setDrawColor(...C.muted);
  doc.setLineWidth(0.2);
  doc.line(ML, H - 14, MR, H - 14);
  doc.setFont('courier', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...C.grayD);
  doc.text(FOOT, ML, H - 9);
  doc.text(String(ctx.page), MR, H - 9, { align: 'right' });
}

/** Reserva `h` mm; si no caben, abre página nueva. */
function ensure(ctx: DocCtx, h: number) {
  if (ctx.y + h > ctx.H - BOTTOM) {
    ctx.doc.addPage();
    ctx.page += 1;
    paintPage(ctx, false);
  }
}

function heading(ctx: DocCtx, label: string) {
  ensure(ctx, 14);
  const { doc, ML, MR } = ctx;
  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...ctx.accent);
  doc.text(label.toUpperCase(), ML, ctx.y);
  doc.setDrawColor(...ctx.accent);
  doc.setLineWidth(0.15);
  doc.line(ML, ctx.y + 1.6, MR, ctx.y + 1.6);
  ctx.y += 8;
}

function para(ctx: DocCtx, text: string, opts: { size?: number; color?: RGB; style?: string; indent?: number } = {}) {
  const size = opts.size ?? 8.6;
  const color = opts.color ?? C.grayL;
  const style = opts.style ?? 'normal';
  const indent = opts.indent ?? 0;
  const { doc, ML } = ctx;
  doc.setFont('helvetica', style);
  doc.setFontSize(size);
  doc.setTextColor(...color);
  const lines = doc.splitTextToSize(text, ctx.CW - indent) as string[];
  const lh = size * 0.55;
  lines.forEach(l => {
    ensure(ctx, lh + 1);
    doc.text(l, ML + indent, ctx.y);
    ctx.y += lh;
  });
  ctx.y += 1.5;
}

/** Tarjeta con título, cuerpo opcional y franja de acento. */
function card(ctx: DocCtx, o: {
  tag?: string; title: string; body?: string; note?: string; accent?: RGB;
}) {
  const acc = o.accent ?? ctx.accent;
  const { doc, ML } = ctx;
  const inner = ctx.CW - 14;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.4);
  const titleLines = doc.splitTextToSize(o.title, inner) as string[];
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.4);
  const bodyLines = o.body ? (doc.splitTextToSize(o.body, inner) as string[]) : [];
  doc.setFontSize(7.6);
  const noteLines = o.note ? (doc.splitTextToSize(o.note, inner) as string[]) : [];
  const h =
    9 + (o.tag ? 4.5 : 0) + titleLines.length * 5 +
    bodyLines.length * 4.3 + (noteLines.length ? noteLines.length * 4 + 2 : 0);

  ensure(ctx, h + 4);
  const top = ctx.y;

  doc.setFillColor(...C.bgCard);
  doc.roundedRect(ML, top, ctx.CW, h, 2, 2, 'F');
  doc.setFillColor(...acc);
  doc.rect(ML, top, 1.6, h, 'F');

  let iy = top + 7;
  if (o.tag) {
    doc.setFont('courier', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(...acc);
    doc.text(o.tag.toUpperCase(), ML + 7, iy);
    iy += 4.5;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.4);
  doc.setTextColor(...C.white);
  titleLines.forEach(l => { doc.text(l, ML + 7, iy); iy += 5; });

  if (bodyLines.length) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.4);
    doc.setTextColor(...C.grayL);
    bodyLines.forEach(l => { doc.text(l, ML + 7, iy); iy += 4.3; });
  }

  if (noteLines.length) {
    iy += 1;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.6);
    doc.setTextColor(...C.gray);
    noteLines.forEach(l => { doc.text(l, ML + 7, iy); iy += 4; });
  }

  ctx.y = top + h + 4;
}

/** Filas con líneas en blanco para escribir a mano. */
function blankRows(ctx: DocCtx, labels: string[], rowHeight = 13) {
  const { doc, ML, MR } = ctx;
  labels.forEach(label => {
    ensure(ctx, rowHeight + 2);
    doc.setFont('courier', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(...ctx.accent);
    doc.text(label.toUpperCase(), ML, ctx.y);
    doc.setDrawColor(...C.grayD);
    doc.setLineWidth(0.15);
    doc.line(ML, ctx.y + rowHeight - 4, MR, ctx.y + rowHeight - 4);
    ctx.y += rowHeight;
  });
  ctx.y += 2;
}

/** Tabla genérica con anchos relativos. */
function table(ctx: DocCtx, head: string[], rows: string[][], widths: number[], opts: { minRowH?: number } = {}) {
  const { doc, ML } = ctx;
  const total = widths.reduce((a, b) => a + b, 0);
  const cols = widths.map(w => (w / total) * ctx.CW);

  const drawHead = () => {
    ensure(ctx, 12);
    doc.setFillColor(...C.bgLight);
    doc.rect(ML, ctx.y, ctx.CW, 7.5, 'F');
    doc.setFont('courier', 'bold');
    doc.setFontSize(6.6);
    doc.setTextColor(...ctx.accent);
    let x = ML;
    head.forEach((hd, i) => {
      doc.text(hd.toUpperCase(), x + 2, ctx.y + 5);
      x += cols[i];
    });
    ctx.y += 7.5;
  };

  drawHead();

  rows.forEach((row, ri) => {
    doc.setFontSize(7.6);
    const cellLines = row.map((cell, i) => doc.splitTextToSize(cell, cols[i] - 4) as string[]);
    const maxLines = Math.max(...cellLines.map(l => l.length), 1);
    const h = Math.max(opts.minRowH ?? 0, maxLines * 4 + 4);

    if (ctx.y + h > ctx.H - BOTTOM) {
      ctx.doc.addPage();
      ctx.page += 1;
      paintPage(ctx, false);
      drawHead();
    }

    doc.setFillColor(...(ri % 2 === 0 ? C.bgCard : C.bg));
    doc.rect(ML, ctx.y, ctx.CW, h, 'F');

    let x = ML;
    cellLines.forEach((lines, i) => {
      doc.setFont('helvetica', i === 0 ? 'bold' : 'normal');
      doc.setFontSize(7.6);
      doc.setTextColor(...(i === 0 ? C.white : C.grayL));
      lines.forEach((l, li) => doc.text(l, x + 2, ctx.y + 5 + li * 4));
      x += cols[i];
    });
    ctx.y += h;
  });
  ctx.y += 4;
}

function save(ctx: DocCtx, filename: string) {
  ctx.doc.setProperties?.({
    title: ctx.title,
    subject: `${identity.name} · ${identity.tagline}`,
    author: institution.program,
    keywords: 'prompting jurídico, verificación, DIAT, PUCV, 2026',
  });
  ctx.doc.save(filename);
}

// ─────────────────────────────────────────────────────────────────────────────
// 01 · Estructura del prompt jurídico
// ─────────────────────────────────────────────────────────────────────────────
async function estructuraPrompt() {
  const ctx = await startDoc({ code: '01', title: 'Estructura del prompt jurídico DIAT', accent: C.cyan });

  para(ctx, 'Siete capas. Cinco son obligatorias, el rol es opcional y el control es la que convierte una respuesta en material de trabajo revisable. No se trata de escribir más, sino de que cada parte pueda comprobarse.', { size: 9 });

  heading(ctx, 'Las siete capas');
  promptLayers.forEach((layer, i) => {
    card(ctx, {
      tag: `${String(i + 1).padStart(2, '0')} · ${layer.required ? 'Obligatoria' : 'Opcional'}`,
      title: `${layer.name} — ${layer.question}`,
      body: layer.why,
      note: `Ejemplo: ${layer.example}`,
      accent: layer.required ? C.cyan : C.gray,
    });
  });

  heading(ctx, 'La misma consulta, seis veces');
  para(ctx, 'La mejora es acumulativa. No existe un prompt mágico: existe una tarea cada vez mejor especificada.');
  table(
    ctx,
    ['Nivel', 'Prompt', 'Qué sigue fallando'],
    promptProgression.map(p => [`${p.level} · ${p.label}`, p.prompt, p.problem]),
    [16, 44, 40],
  );

  heading(ctx, 'Antes de pegar nada');
  para(ctx, privacyRule, { style: 'bold', color: C.white, size: 9.5 });
  privacyPractices.forEach(p => para(ctx, `Sí: ${p.do}   /   No: ${p.dont}`, { size: 7.8, indent: 3 }));

  save(ctx, '01_Estructura_Prompt_DIAT.pdf');
}

// ─────────────────────────────────────────────────────────────────────────────
// 02 · Matriz de verificación (apaisada, para completar a mano)
// ─────────────────────────────────────────────────────────────────────────────
async function matrizVerificacion() {
  const ctx = await startDoc({ code: '02', title: 'Matriz de verificación', accent: C.cyan, landscape: true });

  para(ctx, 'Una fila por afirmación. La columna «fuente real» es la que decide: si al buscarla no aparece, la afirmación no está verificada, por bien redactada que esté.', { size: 9 });

  const widths = [26, 18, 18, 10, 12, 22];
  const blank = Array(6).fill('');
  table(
    ctx,
    matrixColumns.map(c => c.label),
    Array.from({ length: 9 }, () => blank),
    widths,
    { minRowH: 15 },
  );

  heading(ctx, 'Cómo se completa');
  verificationProtocol.forEach((p, i) => {
    para(ctx, `${i + 1}. ${p.step} — ${p.action}`, { size: 8 });
  });

  heading(ctx, 'Revisión entre pares');
  peerChecklist.forEach((q, i) => para(ctx, `${String(i + 1).padStart(2, '0')}. ${q}`, { size: 8 }));

  save(ctx, '02_Matriz_Verificacion.pdf');
}

// ─────────────────────────────────────────────────────────────────────────────
// 03 · Checklist anti-alucinaciones
// ─────────────────────────────────────────────────────────────────────────────
async function checklistAlucinaciones() {
  const ctx = await startDoc({ code: '03', title: 'Checklist anti-alucinaciones', accent: ROSE });

  para(ctx, huntRule, { style: 'bold', color: C.white, size: 11 });
  para(ctx, aiMinimum.teachingLine, { size: 9 });

  heading(ctx, 'Los cinco estados de una afirmación');
  (Object.keys(verdictLabels) as (keyof typeof verdictLabels)[]).forEach(v => {
    card(ctx, { title: verdictLabels[v], body: verdictHelp[v] });
  });

  heading(ctx, 'El protocolo');
  verificationProtocol.forEach((p, i) => {
    card(ctx, {
      tag: `Paso ${i + 1}`,
      title: p.step,
      body: p.action,
      note: `Trampa frecuente: ${p.trap}`,
    });
  });

  heading(ctx, 'Señales de alarma');
  [
    'Un número de artículo que «suena bien» y no aparece al abrir la norma.',
    'Una sentencia con rol y año que no se encuentra en el buscador del Poder Judicial.',
    'Un plazo afirmado sin artículo, o sin decir si son días hábiles o corridos.',
    'Una norma aplicada sin comprobar desde cuándo está vigente.',
    'Una conclusión categórica sobre un punto que en realidad se discute.',
    'Una obligación afirmada sin indicar de dónde sale.',
    'Un razonamiento propio del modelo presentado con el tono de un dato.',
  ].forEach(s => para(ctx, `·  ${s}`, { size: 8.4, indent: 2 }));

  heading(ctx, 'Vigencia: publicada no es lo mismo que vigente');
  para(ctx, VIGENCIA_NOTE, { size: 8.2 });

  save(ctx, '03_Checklist_Anti_Alucinaciones.pdf');
}

// ─────────────────────────────────────────────────────────────────────────────
// 04 · Canvas del flujo jurídico (apaisado)
// ─────────────────────────────────────────────────────────────────────────────
async function canvasFlujo() {
  const ctx = await startDoc({ code: '04', title: 'Canvas del flujo jurídico', accent: C.indigo, landscape: true });

  para(ctx, 'Seis casillas, ninguna opcional. Un flujo sin fuente y sin control humano no es un flujo: es una respuesta larga partida en trozos.', { size: 9 });

  const { doc, ML } = ctx;
  const kinds: FlowKind[] = ['entrada', 'tarea', 'ia', 'fuente', 'control', 'salida'];
  const gap = 4;
  const boxW = (ctx.CW - gap * 2) / 3;
  const boxH = 42;

  kinds.forEach((kind, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = ML + col * (boxW + gap);
    const yy = ctx.y + row * (boxH + gap);

    doc.setFillColor(...C.bgCard);
    doc.roundedRect(x, yy, boxW, boxH, 2, 2, 'F');
    doc.setDrawColor(...C.indigo);
    doc.setLineWidth(0.2);
    doc.roundedRect(x, yy, boxW, boxH, 2, 2, 'S');

    doc.setFont('courier', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...C.indigo);
    doc.text(`${String(i + 1).padStart(2, '0')} · ${flowKindMeta[kind].label.toUpperCase()}`, x + 4, yy + 6);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.8);
    doc.setTextColor(...C.gray);
    const hint = doc.splitTextToSize(flowKindMeta[kind].hint, boxW - 8) as string[];
    hint.forEach((l, li) => doc.text(l, x + 4, yy + 11.5 + li * 3.4));

    doc.setDrawColor(...C.grayD);
    doc.setLineWidth(0.12);
    for (let li = 0; li < 4; li++) {
      doc.line(x + 4, yy + 23 + li * 5, x + boxW - 4, yy + 23 + li * 5);
    }
  });

  ctx.y += boxH * 2 + gap + 8;

  heading(ctx, 'La séptima casilla: el registro');
  para(ctx, flowKindMeta.registro.hint);
  blankRows(ctx, ['Qué queda anotado', 'Dónde queda anotado'], 11);

  heading(ctx, 'Ejemplo completo');
  canonicalFlow.forEach((s, i) => {
    para(ctx, `${String(i + 1).padStart(2, '0')} · ${flowKindMeta[s.kind].label}: ${s.label}`, { size: 8 });
  });

  heading(ctx, 'Auditoría cruzada');
  para(ctx, crossAudit.instruction, { size: 8.2 });
  crossAudit.questions.forEach((q, i) => para(ctx, `${i + 1}. ${q}`, { size: 8, indent: 2 }));

  save(ctx, '04_Canvas_Flujo_Juridico.pdf');
}

// ─────────────────────────────────────────────────────────────────────────────
// 05 · Registro de validación
// ─────────────────────────────────────────────────────────────────────────────
async function registroValidacion() {
  const ctx = await startDoc({ code: '05', title: 'Registro de validación', accent: C.indigo });

  para(ctx, 'Una entrada por paso ejecutado. El registro es el producto de la sesión 2: sin él, el resultado no se puede explicar a nadie más.', { size: 9 });

  heading(ctx, 'Qué se anota en cada campo');
  validationFields.forEach(f => {
    para(ctx, `${f.label} — ${f.hint}`, { size: 7.8 });
  });

  for (let entry = 1; entry <= 3; entry++) {
    ctx.doc.addPage();
    ctx.page += 1;
    paintPage(ctx, false);
    heading(ctx, `Entrada ${entry}`);
    blankRows(ctx, validationFields.map(f => f.label), 14);
  }

  save(ctx, '05_Registro_Validacion.pdf');
}

// ─────────────────────────────────────────────────────────────────────────────
// 06 · Ficha de desafío
// ─────────────────────────────────────────────────────────────────────────────
async function fichaDesafio() {
  const ctx = await startDoc({ code: '06', title: 'Ficha de desafío · Match Making', accent: C.purple });

  para(ctx, challengeRule, { size: 9 });

  heading(ctx, 'Cómo NO y cómo SÍ enunciarlo');
  card(ctx, { tag: 'No sirve', title: `«${translationExample.bad}»`, body: translationExample.badWhy, accent: ROSE });
  card(ctx, { tag: 'Sí sirve', title: '«Necesitamos detectar determinadas cláusulas…»', body: translationExample.goodWhy, accent: C.emerald });

  ctx.doc.addPage();
  ctx.page += 1;
  paintPage(ctx, false);

  heading(ctx, 'Los doce campos');
  challengeFields.forEach(f => {
    ensure(ctx, 20);
    const { doc, ML, MR } = ctx;
    doc.setFont('courier', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(...(f.n === 12 ? C.purple : C.gray));
    doc.text(`${String(f.n).padStart(2, '0')} · ${f.label.toUpperCase()}`, ML, ctx.y);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.2);
    doc.setTextColor(...C.grayD);
    doc.text(f.question, ML, ctx.y + 4);

    doc.setDrawColor(...C.grayD);
    doc.setLineWidth(0.15);
    doc.line(ML, ctx.y + 13, MR, ctx.y + 13);
    ctx.y += 18;
  });

  ctx.doc.addPage();
  ctx.page += 1;
  paintPage(ctx, false);

  heading(ctx, 'Ejemplo completo');
  challengeFields.forEach(f => {
    para(ctx, `${String(f.n).padStart(2, '0')} · ${f.label}: ${f.placeholder}`, { size: 8 });
  });

  save(ctx, '06_Ficha_Desafio_Match_Making.pdf');
}

// ─────────────────────────────────────────────────────────────────────────────
// 07 · Rúbrica y pitch (apaisada)
// ─────────────────────────────────────────────────────────────────────────────
async function rubricaPdf() {
  const ctx = await startDoc({ code: '07', title: 'Rúbrica de evaluación y pitch', accent: C.purple, landscape: true });

  para(ctx, 'Los seis criterios y sus porcentajes vienen de la propuesta académica. Los cuatro niveles describen conductas observables en el material entregado, no impresiones generales.', { size: 9 });

  table(
    ctx,
    ['Criterio', ...rubricLevelOrder],
    rubric.map(r => [`${r.weight}% · ${r.criterion}`, ...r.levels.map(l => l.descriptor)]),
    [22, 19.5, 19.5, 19.5, 19.5],
  );

  heading(ctx, 'El pitch: cuatro minutos, cuatro cosas');
  pitchSpec.structure.forEach(s => para(ctx, `${s.at} — ${s.say}`, { size: 8.4 }));
  para(ctx, pitchSpec.rule, { style: 'bold', color: C.white, size: 8.6 });

  heading(ctx, 'Formato de sala según número de equipos');
  planFor(3).contingencies
    .filter(c => c.when.includes('equipos'))
    .forEach(c => para(ctx, `${c.when}: ${c.then}`, { size: 8 }));

  save(ctx, '07_Rubrica_Pitch.pdf');
}

// ─────────────────────────────────────────────────────────────────────────────
// 08 · Glosario
// ─────────────────────────────────────────────────────────────────────────────
async function glosarioPdf() {
  const ctx = await startDoc({ code: '08', title: 'Glosario de IA jurídica', accent: C.cyan });

  para(ctx, `${glossary.length} términos. Definición breve y, cuando ayuda, un ejemplo jurídico inmediatamente después. Ningún término entra por ser técnicamente interesante: entra si sirve para trabajar.`, { size: 9 });

  glossaryGroups.forEach(group => {
    heading(ctx, group);
    glossary.filter(t => t.group === group).forEach(t => {
      card(ctx, { title: t.term, body: t.definition, note: t.legalExample });
    });
  });

  save(ctx, '08_Glosario_IA_Juridica.pdf');
}

// ─────────────────────────────────────────────────────────────────────────────
// 09 · Caso guiado sesión 1
// ─────────────────────────────────────────────────────────────────────────────
async function casoSesion1() {
  const ctx = await startDoc({ code: '09', title: `Caso guiado · ${troncalCase.title}`, accent: C.cyan });

  para(ctx, `Caso ${troncalCase.code} · ${troncalCase.area} · dificultad ${troncalCase.difficulty}. Caso ficticio: no contiene datos personales reales ni causas reales.`, { size: 8, color: C.gray });

  heading(ctx, 'Enunciado');
  para(ctx, troncalCase.brief, { size: 9 });

  heading(ctx, 'Qué se busca aprender');
  para(ctx, troncalCase.objective);

  heading(ctx, 'Fuentes oficiales');
  para(ctx, `Vigencia comprobada el ${SOURCES_CHECKED_ON}.`, { size: 7.6, color: C.gray });
  troncalCase.sources.forEach(s => {
    card(ctx, { title: s.label, body: s.url, note: s.note });
  });

  heading(ctx, 'Errores que el caso induce');
  troncalCase.traps.forEach(t => para(ctx, `·  ${t}`, { size: 8.4, indent: 2 }));

  ctx.doc.addPage();
  ctx.page += 1;
  paintPage(ctx, false);

  heading(ctx, 'Respuesta precalculada — plan de contingencia sin internet');
  para(ctx, huntIntro.disclaimer, { size: 7.8, color: C.gray, style: 'italic' });
  para(ctx, `Pregunta formulada: ${huntIntro.question}`, { size: 8.4 });
  huntClaims.forEach((c, i) => {
    para(ctx, `${String(i + 1).padStart(2, '0')}. ${c.text}`, { size: 8.4, indent: 2 });
  });

  ctx.doc.addPage();
  ctx.page += 1;
  paintPage(ctx, false);

  heading(ctx, 'Pauta docente — clasificación correcta');
  para(ctx, 'No se entrega a los equipos antes del ejercicio.', { size: 7.6, color: C.gray, style: 'italic' });
  table(
    ctx,
    ['#', 'Estado', 'Por qué'],
    huntClaims.map((c, i) => [String(i + 1).padStart(2, '0'), verdictLabels[c.answer], c.why]),
    [7, 18, 75],
  );

  heading(ctx, 'Orientación para el equipo docente');
  troncalCase.teacherNotes.forEach(n => para(ctx, `·  ${n}`, { size: 8.2, indent: 2 }));

  heading(ctx, 'Cómo progresa el caso');
  (troncalCase.arc ?? []).forEach(step => {
    para(ctx, `Sesión ${step.session}: ${step.task}`, { size: 8.2 });
  });

  save(ctx, '09_Caso_Guiado_Sesion_1.pdf');
}

// ─────────────────────────────────────────────────────────────────────────────
// 10 · Caso de laboratorio sesión 2
// ─────────────────────────────────────────────────────────────────────────────
async function casoSesion2() {
  const ctx = await startDoc({ code: '10', title: 'Caso de laboratorio · del prompt al flujo', accent: C.indigo });

  para(ctx, `Se continúa con el caso ${troncalCase.code}. Un equipo que no asistió a la sesión 1 puede entrar directamente por el «punto de partida» de esta ficha.`, { size: 9 });

  heading(ctx, 'Punto de partida');
  para(ctx, troncalCase.brief, { size: 8.6 });

  heading(ctx, 'El flujo de referencia');
  canonicalFlow.forEach((s, i) => {
    card(ctx, {
      tag: `${String(i + 1).padStart(2, '0')} · ${flowKindMeta[s.kind].label}`,
      title: s.label,
      body: flowKindMeta[s.kind].hint,
      accent: C.indigo,
    });
  });

  ctx.doc.addPage();
  ctx.page += 1;
  paintPage(ctx, false);

  heading(ctx, 'Ejercicio: el flujo defectuoso');
  para(ctx, brokenFlow.instruction, { size: 8.6 });
  brokenFlow.steps.forEach((s, i) => {
    para(ctx, `(${String.fromCharCode(97 + i)})  ${s.text}`, { size: 8.4, indent: 2 });
  });

  heading(ctx, 'Pauta docente');
  para(ctx, `Orden correcto: ${[...brokenFlow.steps]
    .sort((a, b) => a.correctPosition - b.correctPosition)
    .map((s, i) => `${i + 1}) ${String.fromCharCode(97 + brokenFlow.steps.indexOf(s))}`)
    .join('  ·  ')}`, { size: 8 });
  para(ctx, 'Los dos defectos que ningún reordenamiento arregla:', { size: 8.2, style: 'bold', color: C.white });
  brokenFlow.hiddenDefects.forEach(d => para(ctx, `·  ${d}`, { size: 8.2, indent: 2 }));
  para(ctx, brokenFlow.discussion, { size: 8.6, style: 'bold', color: C.white });

  ctx.doc.addPage();
  ctx.page += 1;
  paintPage(ctx, false);

  heading(ctx, 'Comparación crítica — dos variantes de instrucción');
  para(ctx, 'Si solo hay una herramienta disponible, la comparación se hace entre estas dos variantes sobre la misma herramienta. La pregunta no es cuál escribe mejor, sino cuál resulta más verificable y por qué.', { size: 8.4 });
  card(ctx, {
    tag: 'Variante A', title: 'Sin fuentes acotadas',
    body: promptProgression[2].prompt,
    note: 'Qué observar: cuántas afirmaciones quedan sin norma identificable.',
    accent: ROSE,
  });
  card(ctx, {
    tag: 'Variante B', title: 'Con fuentes, formato y control',
    body: `${promptProgression[3].prompt} ${promptProgression[4].prompt} ${promptProgression[5].prompt}`,
    note: 'Qué observar: cuántas celdas quedan marcadas como no verificables, que es exactamente lo que se busca.',
    accent: C.emerald,
  });

  heading(ctx, 'Registro de validación');
  validationFields.forEach(f => para(ctx, `${f.label} — ${f.hint}`, { size: 7.8 }));

  save(ctx, '10_Caso_Laboratorio_Sesion_2.pdf');
}

// ─────────────────────────────────────────────────────────────────────────────
// 11 · Guía de Match Making
// ─────────────────────────────────────────────────────────────────────────────
async function guiaMatchMaking() {
  const ctx = await startDoc({ code: '11', title: 'Guía de Match Making', accent: C.purple });

  para(ctx, 'Los estudiantes de Derecho no vienen a convertirse en ingenieros y los estudiantes de otras disciplinas no vienen a sustituir el criterio jurídico. El aprendizaje está exactamente en la traducción entre ambos.', { size: 9 });

  heading(ctx, 'Cómo traducir un problema jurídico');
  card(ctx, { tag: 'No sirve', title: `«${translationExample.bad}»`, body: translationExample.badWhy, accent: ROSE });
  card(ctx, { tag: 'Sí sirve', title: `«${translationExample.good}»`, body: translationExample.goodWhy, accent: C.emerald });

  heading(ctx, 'Formación de equipos');
  [
    'Cada estudiante de Derecho presenta su problema en 45 segundos: qué pasa, a quién le pasa y qué decisión hay que tomar.',
    'Los equipos se forman por afinidad de problema, no por amistad.',
    'Cada equipo mixto queda con un canvas impreso y un facilitador asignado.',
    'Si la persona de otra disciplina no entiende el problema, el problema todavía no está bien enunciado: se corrige la ficha, no se explica de viva voz.',
  ].forEach(r => para(ctx, `·  ${r}`, { size: 8.4, indent: 2 }));

  heading(ctx, 'Los doce campos, con la pregunta de cada uno');
  table(
    ctx,
    ['#', 'Campo', 'Pregunta que responde'],
    challengeFields.map(f => [String(f.n).padStart(2, '0'), f.label, f.question]),
    [7, 30, 63],
  );

  ctx.doc.addPage();
  ctx.page += 1;
  paintPage(ctx, false);

  heading(ctx, 'El pitch');
  pitchSpec.structure.forEach(s => para(ctx, `${s.at} — ${s.say}`, { size: 8.4 }));
  para(ctx, pitchSpec.rule, { style: 'bold', color: C.white, size: 8.6 });

  heading(ctx, 'Formato de sala y contingencias');
  planFor(3).contingencies.forEach(c => {
    card(ctx, { tag: 'Si…', title: c.when, body: c.then, accent: AMBER });
  });

  save(ctx, '11_Guia_Match_Making.pdf');
}

// ─────────────────────────────────────────────────────────────────────────────
// 12 · Kit rápido (una hoja)
// ─────────────────────────────────────────────────────────────────────────────
async function kitRapido() {
  const ctx = await startDoc({ code: '12', title: 'Kit rápido de prompting DIAT', accent: C.emerald });

  para(ctx, thesis.headline, { size: 9.5, style: 'bold', color: C.white });

  heading(ctx, 'Las siete capas del prompt');
  para(ctx, promptLayers.map(l => l.name).join('  ·  '), { size: 9, color: C.cyanL });
  promptLayers.forEach(l => para(ctx, `${l.name}: ${l.question}`, { size: 7.6, indent: 2 }));

  heading(ctx, 'Los cinco estados de una afirmación');
  (Object.keys(verdictLabels) as (keyof typeof verdictLabels)[]).forEach(v => {
    para(ctx, `${verdictLabels[v]}: ${verdictHelp[v]}`, { size: 7.6, indent: 2 });
  });

  heading(ctx, 'Las seis casillas del flujo');
  para(ctx, canonicalFlow.map(s => flowKindMeta[s.kind].label).join('  →  '), { size: 9, color: C.cyanL });

  heading(ctx, 'El protocolo');
  para(ctx, verificationProtocol.map(p => p.step).join('  ·  '), { size: 9, color: C.cyanL });

  heading(ctx, 'Privacidad');
  para(ctx, privacyRule, { size: 9, style: 'bold', color: C.white });
  para(ctx, privacyPractices.map(p => p.do).join(' '), { size: 7.6 });

  heading(ctx, 'Las tres sesiones');
  sessions.forEach(s => {
    para(ctx, `${s.displayDateShort} · ${s.shortTitle} — producto: ${s.product}`, { size: 8 });
  });

  heading(ctx, 'La frase que resume el taller');
  para(ctx, aiMinimum.teachingLine, { size: 9.5, style: 'bold', color: C.emerald });

  save(ctx, '12_Kit_Rapido_Prompting_DIAT.pdf');
}

// ─────────────────────────────────────────────────────────────────────────────
// Registro de generadores — la clave coincide con `generator` en materials.ts
// ─────────────────────────────────────────────────────────────────────────────
export const materialGenerators: Record<string, () => Promise<void>> = {
  estructuraPrompt,
  matrizVerificacion,
  checklistAlucinaciones,
  canvasFlujo,
  registroValidacion,
  fichaDesafio,
  rubrica: rubricaPdf,
  glosario: glosarioPdf,
  casoSesion1,
  casoSesion2,
  guiaMatchMaking,
  kitRapido,
};

/** Casos de apoyo, por si la coordinación quiere imprimir el banco completo. */
export const supportCaseCount = cases.length;
