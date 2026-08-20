// ─────────────────────────────────────────────────────────────────────────────
// Generadores PDF — jsPDF, descarga directa (sin diálogo de impresión)
// Se invocan desde componentes cliente al hacer clic, por eso este módulo no
// necesita 'use client'.
//
// Todo el contenido del taller proviene de @/data/program. No escribir fechas,
// nombres ni cifras a mano en este archivo.
// ─────────────────────────────────────────────────────────────────────────────
import type { jsPDF as JsPDFClass } from 'jspdf';
import type { Session } from '@/lib/types';
import {
  identity, institution, schedule, audience, modality, methodology,
  objective, learningOutcomes, sessions, finalChallenge, evaluation,
  evaluationTotal, organization, indicators, background, sources,
  contact, registration,
} from '@/data/program';

export interface PromptConfig {
  objetivo: string;
  area: string;
  profundidad: string;
  modelo: string;
  promptText: string;
  modelTip?: string;
}

// ─── Paleta ───────────────────────────────────────────────────────────────────
const C = {
  bg:      [7,  11,  18]  as [number,number,number],
  bgCard:  [12, 18,  30]  as [number,number,number],
  bgLight: [18, 26,  46]  as [number,number,number],
  white:   [248,250, 252] as [number,number,number],
  cyan:    [6,  182, 212] as [number,number,number],
  cyanL:   [34, 211, 238] as [number,number,number],
  indigo:  [129,140, 248] as [number,number,number],
  purple:  [168,85,  247] as [number,number,number],
  emerald: [52, 211, 153] as [number,number,number],
  gray:    [100,116, 139] as [number,number,number],
  grayL:   [148,163, 184] as [number,number,number],
  grayD:   [51, 65,  85]  as [number,number,number],
  muted:   [30, 41,  59]  as [number,number,number],
};

// ─── Medidas A4 vertical (mm) ────────────────────────────────────────────────
const PW = 210;
const PH = 297;
const ML = 20;
const MR = 190;
const CW = MR - ML; // ancho de columna útil

// ─── Import perezoso de jsPDF, cacheado ──────────────────────────────────────
let _jsPDFCache: typeof JsPDFClass | null = null;
async function getJsPDF(): Promise<typeof JsPDFClass> {
  if (!_jsPDFCache) {
    _jsPDFCache = (await import('jspdf')).jsPDF;
  }
  return _jsPDFCache;
}

type JsPDFDoc = InstanceType<typeof JsPDFClass>;

// ─── Helpers de dibujo ────────────────────────────────────────────────────────
function fillPage(doc: JsPDFDoc, color = C.bg) {
  doc.setFillColor(...color);
  doc.rect(0, 0, PW, PH, 'F');
}

function accentBar(doc: JsPDFDoc, y = 0, h = 1.5) {
  doc.setFillColor(...C.cyan);
  doc.rect(0, y, PW / 2, h, 'F');
  doc.setFillColor(...C.indigo);
  doc.rect(PW / 2, y, PW / 2, h, 'F');
}

function hLine(doc: JsPDFDoc, x1: number, x2: number, y: number, color = C.muted, width = 0.2) {
  doc.setDrawColor(...color);
  doc.setLineWidth(width);
  doc.line(x1, y, x2, y);
}

function badge(doc: JsPDFDoc, text: string, x: number, y: number, borderColor = C.cyan, textColor = C.cyanL) {
  const w = text.length * 1.7 + 8;
  doc.setFillColor(...C.bgCard);
  doc.roundedRect(x, y - 4, w, 6, 1.5, 1.5, 'F');
  doc.setDrawColor(...borderColor);
  doc.setLineWidth(0.15);
  doc.roundedRect(x, y - 4, w, 6, 1.5, 1.5, 'S');
  doc.setFont('courier', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...textColor);
  doc.text(text, x + w / 2, y - 0.3, { align: 'center' });
  return w;
}

function sectionLabel(doc: JsPDFDoc, label: string, x: number, y: number, color = C.cyan) {
  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...color);
  doc.text(label.toUpperCase(), x, y);
  hLine(doc, x, MR, y + 1.5, color, 0.15);
}

/** Cabecera estándar: fondo + barra + badges + título + línea. */
function pageHeader(
  doc: JsPDFDoc,
  badges: string[],
  title: string,
  lineColor: [number, number, number] = C.cyan,
) {
  fillPage(doc);
  accentBar(doc);
  let bx = ML;
  badges.forEach(b => { bx += badge(doc, b, bx, 18, lineColor) + 4; });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...C.white);
  const lines = doc.splitTextToSize(title, CW) as string[];
  let ty = 33;
  lines.forEach(l => { doc.text(l, ML, ty); ty += 9; });
  hLine(doc, ML, MR, ty - 4, lineColor, 0.3);
  return ty + 4;
}

/** Pie estándar con etiqueta izquierda y número de página a la derecha. */
function pageFooter(doc: JsPDFDoc, leftText: string, rightText = '') {
  hLine(doc, ML, MR, 278, C.muted);
  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...C.grayD);
  doc.text(leftText, ML, 285);
  if (rightText) doc.text(rightText, MR, 285, { align: 'right' });
}

function paragraph(
  doc: JsPDFDoc,
  text: string, x: number, y: number,
  maxWidth = CW, lineHeight = 5.2,
  size = 9, color: [number,number,number] = C.grayL,
  style = 'normal',
): number {
  doc.setFont('helvetica', style);
  doc.setFontSize(size);
  doc.setTextColor(...color);
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  lines.forEach(line => { doc.text(line, x, y); y += lineHeight; });
  return y;
}

/** Lista numerada en tarjetas. Devuelve la Y final. */
function numberedCards(
  doc: JsPDFDoc,
  items: readonly string[],
  y: number,
  accent: [number, number, number],
): number {
  items.forEach((item, i) => {
    const lines = doc.splitTextToSize(item, CW - 22) as string[];
    const h = Math.max(12, lines.length * 4.6 + 6);

    doc.setFillColor(...C.bgCard);
    doc.roundedRect(ML, y, CW, h, 2, 2, 'F');
    doc.setFillColor(...accent);
    doc.roundedRect(ML, y, 12, h, 2, 2, 'F');

    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...C.bg);
    doc.text(String(i + 1).padStart(2, '0'), ML + 6, y + h / 2 + 1.2, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...C.grayL);
    lines.forEach((l, li) => doc.text(l, ML + 17, y + 6.5 + li * 4.6));

    y += h + 4;
  });
  return y;
}

// ─────────────────────────────────────────────────────────────────────────────
// DOSSIER — estructura editorial
//
// DOSSIER_SECTIONS es la fuente de verdad compartida entre la página /dossier y
// el generador: la UI no puede prometer un número de secciones distinto al que
// realmente produce el PDF.
// ─────────────────────────────────────────────────────────────────────────────
export const DOSSIER_SECTIONS = [
  { num: '01', title: 'Antecedentes y evolución', desc: 'Taller 2025 · progresión 2026' },
  { num: '02', title: 'Objetivo general', desc: 'Propósito y principios de uso responsable' },
  { num: '03', title: 'Resultados de aprendizaje', desc: 'Los cinco resultados oficiales' },
  { num: '04', title: 'Público, formato y metodología', desc: 'Público · presencial · 30/70 · ABP' },
  { num: '05', title: 'Sesión 1 · 27 de agosto', desc: 'Del prompt aislado al razonamiento asistido' },
  { num: '06', title: 'Sesión 2 · 3 de septiembre', desc: 'Laboratorio: del prompt al flujo verificable' },
  { num: '07', title: 'Sesión 3 · 10 de septiembre', desc: 'Match Making e interdisciplina' },
  { num: '08', title: 'Desafío final y evaluación', desc: 'Flujo jurídico · criterios porcentuales' },
  { num: '09', title: 'Organización e indicadores', desc: 'DIAT · Derecho · LMIL · Ingeniería' },
  { num: '10', title: 'Fuentes, cierre e inscripción', desc: 'Fuentes institucionales y contacto' },
] as const;

/** Portada + una página por sección. */
export const DOSSIER_PAGE_COUNT = DOSSIER_SECTIONS.length + 1;

const FOOT = `${identity.name} · ${institution.faculty}`;

function sessionPage(doc: JsPDFDoc, session: Session, accent: [number, number, number], pageNo: number) {
  doc.addPage();
  const startY = pageHeader(
    doc,
    [session.label.toUpperCase(), session.displayDateShort, schedule.time],
    session.title,
    accent,
  );

  let y = startY + 6;

  sectionLabel(doc, 'PROPÓSITO', ML, y, accent);
  y = paragraph(doc, session.purpose, ML, y + 7) + 6;

  sectionLabel(doc, 'CONTENIDOS', ML, y, accent);
  y += 8;

  session.contents.forEach((content, i) => {
    doc.setFont('courier', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...accent);
    doc.text(String(i + 1).padStart(2, '0'), ML, y);

    const lines = doc.splitTextToSize(content.title, CW - 12) as string[];
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...C.grayL);
    lines.forEach((l, li) => doc.text(l, ML + 10, y + li * 4.4));
    y += lines.length * 4.4;

    if (content.items) {
      doc.setFont('courier', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...C.gray);
      const chips = doc.splitTextToSize(content.items.join('  ·  '), CW - 12) as string[];
      chips.forEach(l => { doc.text(l, ML + 10, y + 3.6); y += 4; });
      y += 1;
    }
    y += 3.5;
  });

  y += 3;
  sectionLabel(doc, session.practice.label.toUpperCase(), ML, y, accent);
  y = paragraph(doc, session.practice.description, ML, y + 7) + 6;

  // Producto
  doc.setFillColor(...C.bgCard);
  doc.roundedRect(ML, y, CW, 16, 2, 2, 'F');
  doc.setDrawColor(...accent);
  doc.setLineWidth(0.25);
  doc.roundedRect(ML, y, CW, 16, 2, 2, 'S');
  doc.setFont('courier', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...accent);
  doc.text('PRODUCTO DE LA SESIÓN', ML + 6, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...C.white);
  doc.text(session.product, ML + 6, y + 12.5);
  y += 22;

  if (session.notes) {
    session.notes.forEach(note => {
      const lines = doc.splitTextToSize(note, CW - 12) as string[];
      const h = lines.length * 4.4 + 7;
      doc.setFillColor(...C.bgLight);
      doc.roundedRect(ML, y, CW, h, 2, 2, 'F');
      doc.setFillColor(...C.emerald);
      doc.rect(ML, y, 2, h, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...C.grayL);
      lines.forEach((l, li) => doc.text(l, ML + 7, y + 6 + li * 4.4));
      y += h + 4;
    });
  }

  pageFooter(doc, `${session.label} · ${FOOT}`, String(pageNo));
}

export async function generateDossierPDF(): Promise<void> {
  const JsPDF = await getJsPDF();
  const doc = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const accents: [number, number, number][] = [C.cyan, C.indigo, C.purple];

  // ── PÁGINA 1 · PORTADA ─────────────────────────────────────────────────────
  fillPage(doc);
  doc.setDrawColor(...C.muted);
  doc.setLineWidth(0.08);
  for (let i = 0; i < 30; i++) {
    doc.line(0, i * 10, PW, i * 10);
    doc.line(i * 7, 0, i * 7, PH);
  }
  accentBar(doc, 0, 2);

  let bx = ML;
  [identity.documentLabel.toUpperCase(), 'DIAT PUCV', 'DERECHO PUCV'].forEach(b => {
    bx += badge(doc, b, bx, 32) + 4;
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(34);
  doc.setTextColor(...C.white);
  doc.text('Taller de Prompting', ML, 78);
  doc.setTextColor(...C.cyanL);
  doc.text('Jurídico 3.0', ML, 94);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(...C.grayL);
  doc.text(identity.tagline, ML, 108);

  hLine(doc, ML, MR, 118, C.cyan, 0.4);

  doc.setFont('courier', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...C.white);
  doc.text(`${schedule.weekdayLabel.toUpperCase()} · ${schedule.time}`, ML, 130);
  doc.setFontSize(13);
  doc.setTextColor(...C.cyanL);
  doc.text(schedule.datesShort, ML, 140);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...C.gray);
  doc.text(
    `${schedule.sessionCount} sesiones de ${schedule.sessionDuration} · ${schedule.totalDuration} en total`,
    ML, 149,
  );

  // Tesis editorial
  doc.setFillColor(...C.bgCard);
  doc.roundedRect(ML, 162, CW, 30, 3, 3, 'F');
  doc.setFillColor(...C.cyan);
  doc.rect(ML, 162, 2, 30, 'F');
  paragraph(doc, identity.thesis, ML + 8, 174, CW - 16, 5.4, 9.5, C.grayL, 'bold');

  // Institución
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...C.grayL);
  doc.text(institution.programLong, ML, 212);
  doc.text(institution.faculty, ML, 220);
  doc.setFontSize(9);
  doc.setTextColor(...C.gray);
  doc.text(`${institution.university} · ${institution.city}`, ML, 228);

  hLine(doc, ML, MR, 260, C.muted);
  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...C.grayD);
  doc.text(`${identity.name} · ${institution.program} · ${contact.email}`, ML, 268);
  doc.text(
    `Dossier · portada + ${DOSSIER_SECTIONS.length} secciones · © 2026 ${institution.program}`,
    ML, 275,
  );

  // ── PÁGINA 2 · 01 ANTECEDENTES Y EVOLUCIÓN ────────────────────────────────
  doc.addPage();
  let y = pageHeader(doc, ['01', 'ANTECEDENTES'], 'Antecedentes y evolución');
  y += 6;

  sectionLabel(doc, background.previous.title.toUpperCase(), ML, y);
  y = paragraph(doc, background.previous.text, ML, y + 8) + 3;
  y = paragraph(doc, background.previous.scope, ML, y, CW, 5.2, 9, C.gray) + 8;

  sectionLabel(doc, background.evolution.title.toUpperCase(), ML, y, C.indigo);
  y = paragraph(doc, background.evolution.text, ML, y + 8) + 6;

  // Progresión en tres pasos
  const stepW = (CW - 16) / 3;
  background.evolution.steps.forEach((step, i) => {
    const sx = ML + i * (stepW + 8);
    doc.setFillColor(...C.bgCard);
    doc.roundedRect(sx, y, stepW, 24, 2, 2, 'F');
    doc.setDrawColor(...accents[i]);
    doc.setLineWidth(0.2);
    doc.roundedRect(sx, y, stepW, 24, 2, 2, 'S');
    doc.setFont('courier', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...accents[i]);
    doc.text(`0${i + 1}`, sx + 5, y + 8);
    const lines = doc.splitTextToSize(step, stepW - 10) as string[];
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...C.white);
    lines.forEach((l, li) => doc.text(l, sx + 5, y + 15 + li * 4.6));
  });
  y += 32;

  doc.setFillColor(...C.bgLight);
  doc.roundedRect(ML, y, CW, 20, 2, 2, 'F');
  paragraph(doc, identity.principle, ML + 7, y + 8, CW - 14, 5, 9, C.grayL, 'bold');

  pageFooter(doc, `01 · Antecedentes · ${FOOT}`, '2');

  // ── PÁGINA 3 · 02 OBJETIVO GENERAL ────────────────────────────────────────
  doc.addPage();
  y = pageHeader(doc, ['02', 'OBJETIVO'], objective.label);
  y += 8;

  doc.setFillColor(...C.bgCard);
  doc.roundedRect(ML, y, CW, 44, 3, 3, 'F');
  doc.setFillColor(...C.cyan);
  doc.rect(ML, y, 2, 44, 'F');
  paragraph(doc, objective.text, ML + 8, y + 11, CW - 16, 5.6, 10, C.white);
  y += 54;

  sectionLabel(doc, 'PRINCIPIOS DE USO RESPONSABLE', ML, y);
  y += 10;

  const principles = [
    identity.principle,
    'Uso exclusivo de casos simulados, anonimizados o expresamente autorizados.',
    'No se utilizan datos personales ni información confidencial.',
    'Registro de fuentes, errores, decisiones y correcciones en todo el proceso.',
  ];
  y = numberedCards(doc, principles, y, C.indigo) + 6;

  doc.setFillColor(...C.bgLight);
  doc.roundedRect(ML, y, CW, 22, 2, 2, 'F');
  paragraph(doc, identity.thesis, ML + 7, y + 9, CW - 14, 5, 9, C.cyanL, 'bold');

  pageFooter(doc, `02 · ${objective.label} · ${FOOT}`, '3');

  // ── PÁGINA 4 · 03 RESULTADOS DE APRENDIZAJE ───────────────────────────────
  doc.addPage();
  y = pageHeader(doc, ['03', 'RESULTADOS'], 'Resultados de aprendizaje', C.indigo);
  y += 6;

  y = paragraph(
    doc,
    'Al finalizar las tres sesiones, cada participante debería ser capaz de:',
    ML, y, CW, 5.2, 9, C.gray,
  ) + 6;

  numberedCards(doc, learningOutcomes, y, C.indigo);

  pageFooter(doc, `03 · Resultados de aprendizaje · ${FOOT}`, '4');

  // ── PÁGINA 5 · 04 PÚBLICO, FORMATO Y METODOLOGÍA ──────────────────────────
  doc.addPage();
  y = pageHeader(doc, ['04', 'METODOLOGÍA'], 'Público, formato y metodología');
  y += 6;

  sectionLabel(doc, 'PÚBLICO', ML, y);
  y = paragraph(doc, audience.detail, ML, y + 8) + 6;

  sectionLabel(doc, 'FORMATO', ML, y);
  y += 8;
  let mx = ML;
  modality.items.forEach(item => {
    const w = item.length * 1.75 + 9;
    if (mx + w > MR) { mx = ML; y += 9; }
    doc.setFillColor(...C.bgCard);
    doc.roundedRect(mx, y - 4.5, w, 7, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...C.grayL);
    doc.text(item, mx + w / 2, y, { align: 'center' });
    mx += w + 4;
  });
  y += 12;

  // Proporción 30/70
  sectionLabel(doc, 'PROPORCIÓN PEDAGÓGICA', ML, y);
  y += 10;
  const contentsW = CW * (methodology.ratio.contents / 100);
  doc.setFillColor(...C.indigo);
  doc.roundedRect(ML, y, contentsW, 10, 1.5, 1.5, 'F');
  doc.setFillColor(...C.cyan);
  doc.roundedRect(ML + contentsW, y, CW - contentsW, 10, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...C.bg);
  doc.text(`${methodology.ratio.contents}% contenidos`, ML + contentsW / 2, y + 6.5, { align: 'center' });
  doc.text(`${methodology.ratio.practice}% práctica`, ML + contentsW + (CW - contentsW) / 2, y + 6.5, { align: 'center' });
  y += 18;

  sectionLabel(doc, 'ESTRUCTURA DE CADA JORNADA', ML, y);
  y += 9;
  const stageW = (CW - 12) / 4;
  methodology.stages.forEach((stage, i) => {
    const sx = ML + i * (stageW + 4);
    doc.setFillColor(...C.bgCard);
    doc.roundedRect(sx, y, stageW, 26, 2, 2, 'F');
    doc.setFillColor(...C.cyan);
    doc.roundedRect(sx, y, stageW, 4, 2, 2, 'F');
    doc.setFont('courier', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(...C.bg);
    doc.text(`0${i + 1}`, sx + stageW / 2, y + 3, { align: 'center' });
    const tl = doc.splitTextToSize(stage.label, stageW - 6) as string[];
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...C.white);
    tl.forEach((l, li) => doc.text(l, sx + 3, y + 10 + li * 4));
  });
  y += 34;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(...C.cyanL);
  const spineLines = doc.splitTextToSize(methodology.spine, CW) as string[];
  spineLines.forEach(l => { doc.text(l, ML, y); y += 5; });
  y += 5;

  sectionLabel(doc, 'PRINCIPIOS METODOLÓGICOS', ML, y);
  y += 8;
  methodology.principles.forEach(p => {
    doc.setFillColor(...C.cyan);
    doc.circle(ML + 1.5, y - 1.2, 0.9, 'F');
    const lines = doc.splitTextToSize(p, CW - 8) as string[];
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...C.grayL);
    lines.forEach((l, li) => doc.text(l, ML + 6, y + li * 4.4));
    y += lines.length * 4.4 + 2.5;
  });

  pageFooter(doc, `04 · Público, formato y metodología · ${FOOT}`, '5');

  // ── PÁGINAS 6-8 · 05/06/07 LAS TRES SESIONES ──────────────────────────────
  sessions.forEach((session, i) => sessionPage(doc, session, accents[i], i + 6));

  // ── PÁGINA 9 · 08 DESAFÍO FINAL Y EVALUACIÓN ──────────────────────────────
  doc.addPage();
  y = pageHeader(doc, ['08', 'DESAFÍO FINAL'], 'Desafío final y evaluación');
  y += 6;

  doc.setFillColor(...C.bgCard);
  doc.roundedRect(ML, y, CW, 22, 3, 3, 'F');
  doc.setFillColor(...C.cyan);
  doc.rect(ML, y, 2, 22, 'F');
  paragraph(doc, finalChallenge.headline, ML + 8, y + 9, CW - 16, 5.4, 10.5, C.white, 'bold');
  y += 30;

  sectionLabel(doc, 'EL ENTREGABLE DEBE INCLUIR', ML, y);
  y += 9;
  const compW = (CW - 8) / 3;
  finalChallenge.components.forEach((comp, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const cx = ML + col * (compW + 4);
    const cy = y + row * 20;
    doc.setFillColor(...C.bgCard);
    doc.roundedRect(cx, cy, compW, 16, 2, 2, 'F');
    doc.setFont('courier', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...C.gray);
    doc.text(String(i + 1).padStart(2, '0'), cx + 4, cy + 6);
    const lines = doc.splitTextToSize(comp, compW - 8) as string[];
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...C.grayL);
    lines.slice(0, 2).forEach((l, li) => doc.text(l, cx + 4, cy + 11 + li * 4));
  });
  y += Math.ceil(finalChallenge.components.length / 3) * 20 + 6;

  sectionLabel(doc, 'CRITERIOS DE EVALUACIÓN', ML, y, C.indigo);
  y += 10;

  const barMax = 70;
  evaluation.forEach(({ weight, criterion }) => {
    doc.setFont('courier', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...C.cyanL);
    doc.text(`${weight}%`, ML + 12, y + 4, { align: 'right' });

    doc.setFillColor(...C.muted);
    doc.roundedRect(ML + 16, y, barMax, 5, 1, 1, 'F');
    doc.setFillColor(...C.cyan);
    doc.roundedRect(ML + 16, y, (barMax * weight) / 25, 5, 1, 1, 'F');

    const lines = doc.splitTextToSize(criterion, CW - barMax - 22) as string[];
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...C.grayL);
    lines.forEach((l, li) => doc.text(l, ML + barMax + 20, y + 4 + li * 4.2));

    y += Math.max(11, lines.length * 4.2 + 6);
  });

  hLine(doc, ML, MR, y, C.muted);
  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...C.white);
  doc.text(`TOTAL ${evaluationTotal}%`, MR, y + 7, { align: 'right' });

  pageFooter(doc, `08 · Desafío final y evaluación · ${FOOT}`, '9');

  // ── PÁGINA 10 · 09 ORGANIZACIÓN E INDICADORES ─────────────────────────────
  doc.addPage();
  y = pageHeader(doc, ['09', 'ORGANIZACIÓN'], 'Organización, continuidad e indicadores', C.purple);
  y += 6;

  sectionLabel(doc, 'ORGANIZACIÓN Y CONTINUIDAD', ML, y, C.purple);
  y += 9;

  organization.forEach(({ entity, role }) => {
    const eLines = doc.splitTextToSize(entity, CW - 12) as string[];
    const rLines = doc.splitTextToSize(role, CW - 12) as string[];
    const h = eLines.length * 4.6 + rLines.length * 4.2 + 7;

    doc.setFillColor(...C.bgCard);
    doc.roundedRect(ML, y, CW, h, 2, 2, 'F');
    doc.setFillColor(...C.purple);
    doc.rect(ML, y, 2, h, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...C.white);
    eLines.forEach((l, li) => doc.text(l, ML + 7, y + 6 + li * 4.6));

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...C.gray);
    rLines.forEach((l, li) => doc.text(l, ML + 7, y + 6 + eLines.length * 4.6 + li * 4.2));

    y += h + 4;
  });

  y += 4;
  sectionLabel(doc, 'INDICADORES DE RESULTADO', ML, y, C.purple);
  y += 8;

  indicators.forEach(ind => {
    doc.setDrawColor(...C.purple);
    doc.setLineWidth(0.3);
    doc.rect(ML, y - 2.6, 3, 3, 'S');
    const lines = doc.splitTextToSize(ind, CW - 10) as string[];
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...C.grayL);
    lines.forEach((l, li) => doc.text(l, ML + 8, y + li * 4.4));
    y += lines.length * 4.4 + 3;
  });

  pageFooter(doc, `09 · Organización e indicadores · ${FOOT}`, '10');

  // ── PÁGINA 11 · 10 FUENTES, CIERRE E INSCRIPCIÓN ──────────────────────────
  doc.addPage();
  y = pageHeader(doc, ['10', 'FUENTES'], 'Fuentes, cierre e inscripción');
  y += 6;

  sectionLabel(doc, 'FUENTES PÚBLICAS CONSULTADAS', ML, y);
  y += 9;

  sources.forEach((src, i) => {
    doc.setFont('courier', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...C.cyan);
    doc.text(String(i + 1).padStart(2, '0'), ML, y);

    const lines = doc.splitTextToSize(src.label, CW - 10) as string[];
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...C.grayL);
    lines.forEach((l, li) => doc.text(l, ML + 8, y + li * 4.2));
    y += lines.length * 4.2;

    const urlLines = doc.splitTextToSize(src.url, CW - 10) as string[];
    doc.setFont('courier', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...C.gray);
    urlLines.forEach(l => { doc.text(l, ML + 8, y + 3.4); y += 3.6; });
    y += 4;
  });

  y += 4;
  doc.setFillColor(...C.bgLight);
  doc.roundedRect(ML, y, CW, 24, 2, 2, 'F');
  paragraph(doc, identity.thesis, ML + 7, y + 9, CW - 14, 5, 9, C.cyanL, 'bold');
  y += 32;

  // CTA de inscripción
  doc.setFillColor(...C.bgCard);
  doc.roundedRect(ML, y, CW, 46, 3, 3, 'F');
  doc.setDrawColor(...C.cyan);
  doc.setLineWidth(0.3);
  doc.roundedRect(ML, y, CW, 46, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...C.cyanL);
  doc.text('Inscripción', PW / 2, y + 12, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...C.grayL);
  doc.text(`${schedule.datesLong}`, PW / 2, y + 21, { align: 'center' });
  doc.text(`${schedule.time} · ${registration.note}`, PW / 2, y + 28, { align: 'center' });
  doc.setTextColor(...C.white);
  doc.text(`Contacto: ${contact.email}`, PW / 2, y + 36, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(...C.gray);
  doc.text(institution.faculty, PW / 2, y + 42, { align: 'center' });

  pageFooter(doc, `10 · Fuentes e inscripción · ${FOOT}`, String(DOSSIER_PAGE_COUNT));

  doc.save('Taller-Prompting-Juridico-3.0-DIAT-PUCV-Dossier.pdf');
}

// ─────────────────────────────────────────────────────────────────────────────
// PROGRAMA — resumen de una página del calendario y las tres sesiones
// ─────────────────────────────────────────────────────────────────────────────
export async function generateProgramPDF(): Promise<void> {
  const JsPDF = await getJsPDF();
  const doc = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const accents: [number, number, number][] = [C.cyan, C.indigo, C.purple];

  let y = pageHeader(
    doc,
    ['PROGRAMA', 'DIAT PUCV'],
    identity.name,
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...C.cyanL);
  doc.text(identity.tagline, ML, y + 3);
  y += 12;

  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...C.white);
  doc.text(`${schedule.weekdayLabel.toUpperCase()} · ${schedule.time} · ${schedule.datesShort}`, ML, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...C.gray);
  doc.text(
    `${schedule.sessionCount} sesiones de ${schedule.sessionDuration} · ${schedule.totalDuration} en total · ${methodology.ratio.label}`,
    ML, y + 6,
  );
  y += 16;

  sessions.forEach((session, i) => {
    const accent = accents[i];
    const contentLines = session.contents.map((c, ci) =>
      `${String(ci + 1).padStart(2, '0')}  ${c.title}${c.items ? ` (${c.items.join(' · ')})` : ''}`,
    );
    const wrapped = contentLines.flatMap(l => doc.splitTextToSize(l, CW - 14) as string[]);
    const h = 34 + wrapped.length * 4.2;

    doc.setFillColor(...C.bgCard);
    doc.roundedRect(ML, y, CW, h, 2.5, 2.5, 'F');
    doc.setFillColor(...accent);
    doc.rect(ML, y, 2.5, h, 'F');

    doc.setFont('courier', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...accent);
    doc.text(`${session.label.toUpperCase()} · ${session.displayDate.toUpperCase()} · ${session.time}`, ML + 8, y + 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...C.white);
    doc.text(session.title, ML + 8, y + 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...C.gray);
    const purposeLines = doc.splitTextToSize(session.purpose, CW - 14) as string[];
    purposeLines.slice(0, 2).forEach((l, li) => doc.text(l, ML + 8, y + 21 + li * 4));

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...C.grayL);
    wrapped.forEach((l, li) => doc.text(l, ML + 8, y + 32 + li * 4.2));

    doc.setFont('courier', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...accent);
    doc.text(`PRODUCTO: ${session.product}`, ML + 8, y + h - 4);

    y += h + 5;
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...C.gray);
  y = paragraph(doc, audience.detail, ML, y + 2, CW, 4.4, 8, C.gray) + 1;
  paragraph(doc, `${methodology.spine} Contacto: ${contact.email}`, ML, y, CW, 4.4, 8, C.gray);

  pageFooter(doc, `${identity.name} · ${institution.faculty}`, '1');

  doc.save('Taller-Prompting-Juridico-3.0-Programa.pdf');
}

// ─────────────────────────────────────────────────────────────────────────────
// PROMPT PDF — generado desde el Prompt Lab (recurso complementario)
// ─────────────────────────────────────────────────────────────────────────────
export async function generatePromptPDF(cfg: PromptConfig): Promise<void> {
  const JsPDF = await getJsPDF();
  const doc = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  fillPage(doc);
  accentBar(doc, 0, 2);

  let bx = ML;
  ['PROMPT LAB', 'RECURSO COMPLEMENTARIO', 'DIAT PUCV'].forEach(b => {
    bx += badge(doc, b, bx, 18) + 4;
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(30);
  doc.setTextColor(...C.white);
  doc.text('PROMPT JURÍDICO', ML, 40);
  doc.setFontSize(12);
  doc.setTextColor(...C.cyanL);
  doc.text(`LexPrompt Architect · ${institution.faculty}`, ML, 50);

  hLine(doc, ML, MR, 56, C.cyan, 0.4);

  sectionLabel(doc, 'CONFIGURACIÓN DEL PROMPT', ML, 66);

  const dnaRows = [
    { label: 'OBJETIVO', value: cfg.objetivo },
    { label: 'ÁREA JURÍDICA', value: cfg.area },
    { label: 'PROFUNDIDAD', value: cfg.profundidad },
    { label: 'IA OBJETIVO', value: cfg.modelo },
    { label: 'PROTECCIONES', value: 'Verificación de fuentes · Control de alucinaciones' },
  ];

  let dy = 74;
  dnaRows.forEach((row, ri) => {
    doc.setFillColor(...(ri % 2 === 0 ? C.bgCard : C.bgLight));
    doc.rect(ML, dy, CW, 10, 'F');
    doc.setFont('courier', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...C.cyan);
    doc.text(row.label, ML + 4, dy + 6.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...C.white);
    doc.text(row.value, ML + 60, dy + 6.5);
    dy += 11;
  });

  dy += 6;
  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.gray);
  doc.text(
    `Generado: ${new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    ML, dy,
  );
  doc.text(
    'Recurso complementario de la plataforma — no forma parte del programa de las tres sesiones.',
    ML, dy + 5,
  );

  // ── Prompt completo ────────────────────────────────────────────────────────
  doc.addPage();
  fillPage(doc);
  accentBar(doc);

  sectionLabel(doc, 'PROMPT JURÍDICO COMPLETO', ML, 18);

  doc.setFillColor(...C.bgCard);
  doc.roundedRect(16, 22, 178, 248, 3, 3, 'F');
  doc.setDrawColor(...C.cyan);
  doc.setLineWidth(0.2);
  doc.roundedRect(16, 22, 178, 248, 3, 3, 'S');

  let py = 32;
  cfg.promptText.split('\n').forEach(line => {
    if (py > 264) { doc.addPage(); fillPage(doc); accentBar(doc); py = 20; }
    const isHeader = line.startsWith('═') || line.startsWith('─');
    const isSectionTitle = /^[A-Z] ▸/.test(line) || /^[A-Z] ·/.test(line);
    const isConfig = line.startsWith(' ');

    if (isHeader) {
      doc.setFont('courier', 'normal');
      doc.setFontSize(5.5);
      doc.setTextColor(...C.muted);
      doc.text(line.substring(0, 72), 22, py);
      py += 3.5;
    } else if (isSectionTitle) {
      doc.setFont('courier', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...C.cyanL);
      doc.text(line, 22, py);
      py += 5.5;
    } else if (isConfig) {
      doc.setFont('courier', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...C.gray);
      (doc.splitTextToSize(line, 162) as string[]).forEach(tline => {
        if (py > 264) { doc.addPage(); fillPage(doc); accentBar(doc); py = 20; }
        doc.text(tline, 22, py);
        py += 4.5;
      });
    } else if (line.trim() === '') {
      py += 2.5;
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...C.grayL);
      (doc.splitTextToSize(line, 162) as string[]).forEach(tline => {
        if (py > 264) { doc.addPage(); fillPage(doc); accentBar(doc); py = 20; }
        doc.text(tline, 22, py);
        py += 4.8;
      });
    }
  });

  // ── Recomendaciones de uso ─────────────────────────────────────────────────
  doc.addPage();
  fillPage(doc);
  accentBar(doc);
  badge(doc, 'USO RESPONSABLE', ML, 18);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...C.white);
  doc.text('Recomendaciones de uso', ML, 32);
  hLine(doc, ML, MR, 36, C.purple, 0.3);

  if (cfg.modelTip) {
    sectionLabel(doc, `OPTIMIZACIÓN PARA ${cfg.modelo.toUpperCase()}`, ML, 44);
    paragraph(doc, cfg.modelTip, ML, 52, CW, 5.5, 9);
  }

  let sp = cfg.modelTip ? 80 : 44;
  sectionLabel(doc, 'CONTROLES ANTES DE USAR EL RESULTADO', ML, sp);
  sp += 8;

  const controls = [
    { title: 'Verificación de fuentes', desc: 'Contrastar toda norma, sentencia o cita contra la fuente primaria antes de usarla. Marcar como pendiente cualquier dato no confirmado.' },
    { title: 'Trazabilidad', desc: 'Registrar fuentes, errores, decisiones y correcciones. El resultado debe poder reconstruirse paso a paso.' },
    { title: 'Supervisión humana', desc: 'La responsabilidad final del contenido jurídico recae siempre en la persona que lo firma, no en la herramienta.' },
  ];
  controls.forEach(ct => {
    doc.setFillColor(...C.bgCard);
    doc.roundedRect(ML, sp, CW, 20, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...C.cyanL);
    doc.text(ct.title, ML + 6, sp + 7);
    const dl = doc.splitTextToSize(ct.desc, CW - 12) as string[];
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...C.gray);
    dl.slice(0, 2).forEach((d, di) => doc.text(d, ML + 6, sp + 12 + di * 4.5));
    sp += 24;
  });

  hLine(doc, ML, MR, 260, C.muted);
  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...C.grayD);
  doc.text(`Prompt Lab · ${institution.program} · ${institution.faculty}`, ML, 268);
  doc.text('© 2026 · Herramienta pedagógica — verificar los resultados con fuentes primarias', ML, 274);

  doc.save('prompt-juridico-diat.pdf');
}

// ─────────────────────────────────────────────────────────────────────────────
// GUÍA DE HERRAMIENTAS — recurso complementario del toolkit
// ─────────────────────────────────────────────────────────────────────────────
export async function generateGuiaJuridicaPDF(): Promise<void> {
  const JsPDF = await getJsPDF();
  const doc = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  fillPage(doc);
  accentBar(doc, 0, 2);

  let bx = ML;
  ['RECURSO COMPLEMENTARIO', 'DIAT PUCV'].forEach(b => { bx += badge(doc, b, bx, 20) + 4; });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.setTextColor(...C.white);
  doc.text('Guía de uso de', ML, 52);
  doc.text('herramientas de IA', ML, 66);

  doc.setFontSize(12);
  doc.setTextColor(...C.cyanL);
  doc.text('Material de apoyo · Facultad y Escuela de Derecho PUCV', ML, 78);

  hLine(doc, ML, MR, 84, C.cyan, 0.4);

  paragraph(
    doc,
    'Guía práctica de referencia para trabajar con herramientas de IA generativa en tareas jurídicas. ' +
    'Es un recurso complementario de la plataforma: no forma parte de los contenidos obligatorios de las ' +
    'tres sesiones del taller. Cualquier resultado obtenido con estas herramientas debe verificarse contra ' +
    'fuentes primarias antes de usarse.',
    ML, 94, CW, 5.5, 9.5, C.grayL,
  );

  doc.setFillColor(...C.bgLight);
  doc.roundedRect(ML, 130, CW, 26, 2, 2, 'F');
  doc.setFillColor(...C.cyan);
  doc.rect(ML, 130, 2, 26, 'F');
  paragraph(
    doc,
    'Ninguna herramienta sustituye la fundamentación jurídica, la verificación de fuentes ni la supervisión humana.',
    ML + 8, 140, CW - 16, 5, 9.5, C.white, 'bold',
  );

  // ── Prompts de referencia ──────────────────────────────────────────────────
  doc.addPage();
  fillPage(doc);
  accentBar(doc);

  sectionLabel(doc, 'PROMPTS DE REFERENCIA', ML, 18);

  const promptGuides = [
    {
      tool: 'ANÁLISIS DE DOCUMENTO', color: C.cyan,
      tip: 'Entrega el documento completo y separa el material del encargo. Pide que se distinga entre lo que consta en el texto y lo que el modelo infiere.',
      prompt: 'Actúa como abogado/a senior en Chile. Analiza el documento adjunto e identifica: (1) puntos clave, (2) riesgos jurídicos, (3) cláusulas problemáticas, (4) recomendaciones. No inventes normas ni sentencias: marca como [VERIFICAR] todo dato que no puedas confirmar en el texto entregado.',
    },
    {
      tool: 'INVESTIGACIÓN CON FUENTES', color: C.indigo,
      tip: 'Sube primero tus documentos fuente. Exige cita textual y ubicación exacta. Si la fuente no está, la respuesta correcta es decir que no está.',
      prompt: '¿Qué dicen los documentos que entregué sobre [institución jurídica]? Cita los párrafos exactos e indica el documento y la página. Si no hay información suficiente en mis fuentes, dilo explícitamente en lugar de completar con conocimiento general.',
    },
    {
      tool: 'COMPARACIÓN CRÍTICA', color: C.purple,
      tip: 'Ejecuta el mismo encargo en dos herramientas o configuraciones y compara. La fluidez del texto no es indicador de corrección jurídica.',
      prompt: 'Compara estas dos respuestas al mismo problema jurídico. Para cada una indica: fundamento normativo invocado, fuentes verificables, omisiones relevantes y riesgos de error. Señala cuál está mejor fundada y por qué, no cuál está mejor redactada.',
    },
    {
      tool: 'PROTOCOLO DE VERIFICACIÓN', color: C.emerald,
      tip: 'Aplica el protocolo del taller sobre cualquier resultado antes de darlo por bueno.',
      prompt: 'Revisa tu respuesta anterior aplicando este protocolo: (1) identificar cada afirmación jurídica, (2) contrastarla con la fuente entregada, (3) justificar la conclusión, (4) registrar lo que no pudo verificarse. Devuelve una tabla con el resultado de cada paso.',
    },
  ];

  let gy = 26;
  promptGuides.forEach(pg => {
    doc.setFillColor(...C.bgCard);
    doc.roundedRect(ML, gy, CW, 50, 2, 2, 'F');
    doc.setFillColor(...pg.color);
    doc.roundedRect(ML, gy, CW, 7, 2, 2, 'F');

    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...C.bg);
    doc.text(pg.tool, ML + 4, gy + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...C.gray);
    (doc.splitTextToSize(pg.tip, CW - 8) as string[])
      .slice(0, 2)
      .forEach((tline, ti) => doc.text(tline, ML + 4, gy + 12 + ti * 4.5));

    doc.setFont('courier', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(...C.cyanL);
    (doc.splitTextToSize(pg.prompt, CW - 8) as string[])
      .slice(0, 6)
      .forEach((pline, pi) => doc.text(pline, ML + 4, gy + 23 + pi * 4.2));

    gy += 54;
  });

  pageFooter(doc, `Guía de herramientas · recurso complementario · ${institution.faculty}`, '2');

  doc.save('guia-herramientas-ia-diat.pdf');
}
