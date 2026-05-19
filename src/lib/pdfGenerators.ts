// ─────────────────────────────────────────────────────────────────────────────
// Shared PDF generators — jsPDF direct download (no print dialog)
// Called from client components on click — no 'use client' needed here
// ─────────────────────────────────────────────────────────────────────────────
import type { Module } from '@/lib/types';
import type { jsPDF as JsPDFClass } from 'jspdf';

// ─── Local types ─────────────────────────────────────────────────────────────
type EquipoMember = {
  readonly id: string;
  readonly name: string;
  readonly rol: string;
  readonly calidad: string;
  readonly initials: string;
  readonly color: string;
};

export interface PromptConfig {
  objetivo: string;
  area: string;
  profundidad: string;
  modelo: string;
  promptText: string;
  modelTip?: string;
}

// ─── Color palette ────────────────────────────────────────────────────────────
const C = {
  bg:      [7,  11,  18]  as [number,number,number],   // #070b12
  bgCard:  [12, 18,  30]  as [number,number,number],   // #0c121e
  bgLight: [18, 26,  46]  as [number,number,number],   // #121a2e
  white:   [248,250, 252] as [number,number,number],   // #f8fafc
  cyan:    [6,  182, 212] as [number,number,number],   // #06b6d4
  cyanL:   [34, 211, 238] as [number,number,number],   // #22d3ee
  indigo:  [129,140, 248] as [number,number,number],   // #818cf8
  purple:  [168,85,  247] as [number,number,number],   // #a855f7
  gray:    [100,116, 139] as [number,number,number],   // #64748b
  grayL:   [148,163, 184] as [number,number,number],   // #94a3b8
  grayD:   [51, 65,  85]  as [number,number,number],   // #334155
  muted:   [30, 41,  59]  as [number,number,number],   // #1e293b
};

// ─── Layout constants (A4 portrait, mm) ──────────────────────────────────────
const PW = 210;   // page width
const PH = 297;   // page height
const ML = 20;    // left margin
const MR = 190;   // right margin endpoint

// ─── jsPDF lazy import — cached singleton ────────────────────────────────────
// Cached after first call so multiple downloads in a session avoid re-resolving the import.
let _jsPDFCache: typeof JsPDFClass | null = null;
async function getJsPDF(): Promise<typeof JsPDFClass> {
  if (!_jsPDFCache) {
    _jsPDFCache = (await import('jspdf')).jsPDF;
  }
  return _jsPDFCache;
}

// ─── Local doc type alias ─────────────────────────────────────────────────────
type JsPDFDoc = InstanceType<typeof JsPDFClass>;

// ─── Drawing helpers ──────────────────────────────────────────────────────────
function fillPage(doc: JsPDFDoc, color = C.bg) {
  doc.setFillColor(...color);
  doc.rect(0, 0, PW, PH, 'F');
}

function accentBar(doc: JsPDFDoc, y = 0, h = 1.5) {
  // Cyan→Indigo gradient approximated as two rects
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

function badge(doc: JsPDFDoc, text: string, x: number, y: number, bgColor = C.bgCard, textColor = C.cyanL) {
  const w = text.length * 1.7 + 8;
  doc.setFillColor(...bgColor);
  doc.roundedRect(x, y - 4, w, 6, 1.5, 1.5, 'F');
  doc.setDrawColor(...C.cyan);
  doc.setLineWidth(0.15);
  doc.roundedRect(x, y - 4, w, 6, 1.5, 1.5, 'S');
  doc.setFont('courier', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...textColor);
  doc.text(text, x + w / 2, y - 0.3, { align: 'center' });
}

function sectionLabel(doc: JsPDFDoc, label: string, x: number, y: number, color = C.cyan) {
  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...color);
  doc.text(label.toUpperCase(), x, y);
  hLine(doc, x, MR, y + 1.5, color, 0.15);
}

/** Standard dark page header: fillPage + accentBar + badges + bold title + hLine. */
function pageHeader(
  doc: JsPDFDoc,
  badges: { text: string; x: number }[],
  title: string,
  lineColor: [number, number, number] = C.cyan,
) {
  fillPage(doc);
  accentBar(doc);
  badges.forEach(b => badge(doc, b.text, b.x, 18));
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...C.white);
  doc.text(title, ML, 32);
  hLine(doc, ML, MR, 36, lineColor, 0.3);
}

/** Standard dark page footer with left label and optional right page-number. */
function pageFooter(doc: JsPDFDoc, leftText: string, rightText = '') {
  hLine(doc, ML, MR, 278, C.muted);
  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...C.grayD);
  doc.text(leftText, ML, 285);
  if (rightText) doc.text(rightText, MR, 285, { align: 'right' });
}

function wrapText(
  doc: JsPDFDoc,
  text: string, x: number, y: number,
  maxWidth: number, lineHeight: number,
  size: number, color: [number,number,number],
  style = 'normal',
): number {
  doc.setFont('helvetica', style);
  doc.setFontSize(size);
  doc.setTextColor(...color);
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  lines.forEach((line: string) => {
    if (y > 280) { doc.addPage(); fillPage(doc); accentBar(doc); y = 20; }
    doc.text(line, x, y);
    y += lineHeight;
  });
  return y;
}

// ─────────────────────────────────────────────────────────────────────────────
// DOSSIER PDF — Premium editorial document
// ─────────────────────────────────────────────────────────────────────────────
export async function generateDossierPDF(
  mods: Module[],
  equipo: readonly EquipoMember[],
): Promise<void> {
  const JsPDF = await getJsPDF();
  const doc = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // ── PAGE 1: COVER ──────────────────────────────────────────────────────────
  fillPage(doc);

  // Diagonal grid lines (subtle)
  doc.setDrawColor(6, 182, 212, 0.03);
  doc.setLineWidth(0.1);
  for (let i = 0; i < 30; i++) {
    doc.line(0, i * 10, PW, i * 10);
    doc.line(i * 7, 0, i * 7, PH);
  }

  // Top accent bar
  accentBar(doc, 0, 2);

  // DIAT badge
  badge(doc, 'DIAT 2026', 20, 32);
  badge(doc, 'FD · PUCV', 68, 32);
  badge(doc, 'PROGRAMA OFICIAL', 116, 32);

  // Main title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(42);
  doc.setTextColor(...C.white);
  doc.text('DIAT', 20, 80);

  doc.setFontSize(18);
  doc.setTextColor(...C.cyanL);
  doc.text('Derecho · Inteligencia Artificial · Tecnología', 20, 94);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(...C.gray);
  doc.text('Facultad de Derecho — Pontificia Universidad Católica de Valparaíso', 20, 104);
  doc.text('Septiembre 2026 · Valparaíso, Chile', 20, 112);

  // Divider
  hLine(doc, ML, MR, 122, C.cyan, 0.4);

  // Subtitle
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...C.indigo);
  doc.text('DOSSIER OFICIAL DEL PROGRAMA', 20, 132);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...C.grayL);
  const coverDesc = 'Programa de formación aplicada en inteligencia artificial jurídica, prompting avanzado y nuevas competencias digitales para el ejercicio legal. Dirigido a estudiantes de Derecho, egresados y profesionales jurídicos de la región.';
  wrapText(doc, coverDesc, 20, 142, 170, 6, 9, C.grayL);

  // Stats row
  const stats = [
    { num: '69%', label: 'Abogados usarán IA', sub: 'Thomson Reuters 2025' },
    { num: '4h',  label: 'Ahorro semanal', sub: 'McKinsey, 2024' },
    { num: '3',   label: 'Módulos intensivos', sub: 'Sep 2026 · PUCV' },
  ];
  let sx = 20;
  stats.forEach(s => {
    doc.setFillColor(...C.bgCard);
    doc.roundedRect(sx, 168, 54, 28, 3, 3, 'F');
    doc.setDrawColor(...C.muted);
    doc.setLineWidth(0.2);
    doc.roundedRect(sx, 168, 54, 28, 3, 3, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(...C.cyanL);
    doc.text(s.num, sx + 27, 182, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...C.white);
    doc.text(s.label, sx + 27, 189, { align: 'center' });

    doc.setFont('courier', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(...C.gray);
    doc.text(s.sub, sx + 27, 193, { align: 'center' });

    sx += 58;
  });

  // Bottom
  hLine(doc, ML, MR, 260, C.muted);
  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...C.grayD);
  doc.text('DIAT Prompting Hub v2.0 · Facultad de Derecho PUCV · Todos los derechos reservados', ML, 268);
  doc.text('© 2026 Programa DIAT · Valparaíso, Chile', ML, 275);

  // ── PAGE 2: CONTEXTO Y ESTADÍSTICAS ────────────────────────────────────────
  doc.addPage();
  pageHeader(doc, [{ text: 'CONTEXTO', x: ML }], '¿Por qué aprender IA jurídica ahora?');

  let y2 = 46;
  const contextParas = [
    'La inteligencia artificial está transformando el ejercicio del derecho de manera acelerada. Los modelos de lenguaje avanzados como Claude, ChatGPT y Gemini son hoy herramientas de trabajo efectivas para investigación jurídica, redacción de documentos y análisis de casos.',
    'Sin embargo, la ventaja competitiva no reside en el acceso a las herramientas — que es universal — sino en la capacidad de instruirlas con precisión jurídica. El prompting avanzado es la nueva competencia diferenciadora del abogado del siglo XXI.',
    'El Programa DIAT fue diseñado precisamente para cerrar esa brecha: transformar a juristas en usuarios expertos de IA, capaces de obtener resultados de nivel profesional, con control metodológico, seguridad informacional y criterio crítico sobre las limitaciones del sistema.',
  ];
  contextParas.forEach(p => {
    y2 = wrapText(doc, p, 20, y2, 170, 5.5, 9.5, C.grayL) + 6;
  });

  // Key data points
  sectionLabel(doc, '01 · DATOS CLAVE DEL MERCADO', 20, y2 + 4);
  y2 += 16;

  const dataPoints = [
    { pct: '69%', text: 'de abogados encuestados afirma que usará IA en tareas jurídicas en los próximos 5 años', src: 'Thomson Reuters, Future of Professionals 2025' },
    { pct: '23%', text: 'de las horas facturables en un estudio de abogados son susceptibles de automatización parcial', src: 'McKinsey Global Institute, 2024' },
    { pct: '$1.2B', text: 'inversión en legaltech en América Latina proyectada para 2027', src: 'Stanford CodeX + CB Insights' },
    { pct: '4h',   text: 'ahorro semanal promedio por profesional que usa IA para tareas de investigación y redacción', src: 'McKinsey, 2024' },
  ];
  dataPoints.forEach(d => {
    doc.setFillColor(...C.bgCard);
    doc.roundedRect(20, y2, 170, 14, 2, 2, 'F');
    doc.setDrawColor(...C.muted);
    doc.setLineWidth(0.15);
    doc.roundedRect(20, y2, 170, 14, 2, 2, 'S');

    doc.setFillColor(...C.cyan);
    doc.roundedRect(20, y2, 28, 14, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...C.bg);
    doc.text(d.pct, 34, y2 + 9, { align: 'center' });

    const tLines = doc.splitTextToSize(d.text, 120) as string[];
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...C.grayL);
    doc.text(tLines[0] || '', 52, y2 + 6);
    if (tLines[1]) doc.text(tLines[1], 52, y2 + 11);

    doc.setFont('courier', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...C.gray);
    doc.text(d.src, 52, y2 + 17.5);

    y2 += 20;
  });

  // ── PAGE 3: COMPETENCIAS ───────────────────────────────────────────────────
  doc.addPage();
  pageHeader(doc, [{ text: 'COMPETENCIAS', x: ML }], '9 competencias que desarrollarás', C.indigo);

  const competencias = [
    { n: '01', title: 'Prompting jurídico de precisión', desc: 'Diseñar instrucciones complejas que producen outputs jurídicos fiables, reproducibles y profesionales.' },
    { n: '02', title: 'Selección estratégica de herramientas', desc: 'Evaluar Claude, ChatGPT, Gemini, NotebookLM y Perplexity para cada tipo de tarea jurídica.' },
    { n: '03', title: 'Control de alucinaciones', desc: 'Aplicar protocolos de verificación para detectar y prevenir errores jurídicos generados por IA.' },
    { n: '04', title: 'Seguridad informacional', desc: 'Gestionar datos sensibles, confidencialidad del cliente y riesgos de privacidad al usar IA.' },
    { n: '05', title: 'Diseño de workflows jurídicos', desc: 'Construir flujos de trabajo con múltiples modelos encadenados para tareas jurídicas complejas.' },
    { n: '06', title: 'Investigación jurídica aumentada', desc: 'Acelerar la investigación de doctrina y jurisprudencia con IA verificable y citada.' },
    { n: '07', title: 'Agentes jurídicos especializados', desc: 'Configurar system prompts de producción para Claude Projects y GPTs personalizados.' },
    { n: '08', title: 'Análisis de documentos avanzado', desc: 'Procesar contratos, sentencias y expedientes con modelos de alta ventana de contexto.' },
    { n: '09', title: 'Evaluación crítica de outputs', desc: 'Aplicar criterios jurídicos para validar, corregir y mejorar las respuestas de la IA.' },
  ];

  let cy = 44;
  competencias.forEach((c, i) => {
    const col = i % 2;
    const cx = col === 0 ? 20 : 108;
    if (col === 0 && i > 0) cy += 22;

    const colors = [C.cyan, C.indigo, C.purple];
    const clr = colors[i % 3];

    doc.setFillColor(...C.bgCard);
    doc.roundedRect(cx, cy, 82, 19, 2, 2, 'F');
    doc.setDrawColor(clr[0], clr[1], clr[2]);
    doc.setLineWidth(0.15);
    doc.roundedRect(cx, cy, 82, 19, 2, 2, 'S');

    doc.setFillColor(...clr);
    doc.roundedRect(cx, cy, 10, 19, 2, 2, 'F');

    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...C.bg);
    doc.text(c.n, cx + 5, cy + 11, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...C.white);
    doc.text(c.title, cx + 13, cy + 7);

    const dlines = doc.splitTextToSize(c.desc, 66) as string[];
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...C.gray);
    dlines.slice(0, 2).forEach((dl: string, di: number) => doc.text(dl, cx + 13, cy + 12 + di * 4));
  });

  // ── PAGES 4-6: MODULE BLUEPRINTS ──────────────────────────────────────────
  const modColors = [C.cyan, C.indigo, C.purple];
  const modLabels = ['MÓDULO 01', 'MÓDULO 02', 'MÓDULO 03'];

  mods.forEach((mod, i) => {
    doc.addPage();
    fillPage(doc);

    const mc = modColors[i];
    // Top accent bar in module color
    doc.setFillColor(...mc);
    doc.rect(0, 0, PW, 2, 'F');

    badge(doc, modLabels[i], 20, 18);
    badge(doc, mod.displayDate || `Sesión ${i + 1}`, 74, 18);
    badge(doc, mod.duration || '3h', 130, 18);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(...C.white);
    doc.text(mod.title, 20, 34);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...C.gray);
    doc.text(mod.subtitle || '', 20, 42);

    hLine(doc, ML, MR, 46, mc, 0.4);

    // Objectives
    let my = 54;
    sectionLabel(doc, 'OBJETIVOS DE APRENDIZAJE', 20, my);
    my += 8;

    mod.objectives.slice(0, 5).forEach((obj, oi) => {
      doc.setFillColor(...mc);
      doc.roundedRect(20, my - 3, 6, 6, 1, 1, 'F');
      doc.setFont('courier', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(...C.bg);
      doc.text(`0${oi + 1}`, 23, my + 1.5, { align: 'center' });

      const olines = doc.splitTextToSize(obj, 155) as string[];
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(...C.grayL);
      olines.slice(0, 2).forEach((ol: string, oi2: number) => doc.text(ol, 30, my + oi2 * 4.5));
      my += 10;
    });

    // Contents
    my += 6;
    sectionLabel(doc, 'CONTENIDOS DEL MÓDULO', 20, my);
    my += 8;

    const leftContents = mod.contents.slice(0, Math.ceil(mod.contents.length / 2));
    const rightContents = mod.contents.slice(Math.ceil(mod.contents.length / 2));

    leftContents.slice(0, 5).forEach((c, ci) => {
      doc.setFillColor(...C.bgCard);
      doc.roundedRect(20, my, 82, 10, 1.5, 1.5, 'F');
      doc.setDrawColor(mc[0], mc[1], mc[2]);
      doc.setLineWidth(0.3);
      doc.line(20, my + 1.5, 20, my + 8.5);
      const cl = doc.splitTextToSize(c, 73) as string[];
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...C.grayL);
      doc.text(cl[0] || '', 24, my + 6.5);
      my += 13;
    });

    const ry_start = 54 + 8 + mod.objectives.slice(0, 5).length * 10 + 6 + 8;
    let ry = ry_start;
    rightContents.slice(0, 5).forEach((c) => {
      doc.setFillColor(...C.bgCard);
      doc.roundedRect(108, ry, 82, 10, 1.5, 1.5, 'F');
      doc.setDrawColor(mc[0], mc[1], mc[2]);
      doc.setLineWidth(0.3);
      doc.line(108, ry + 1.5, 108, ry + 8.5);
      const cl = doc.splitTextToSize(c, 73) as string[];
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...C.grayL);
      doc.text(cl[0] || '', 112, ry + 6.5);
      ry += 13;
    });

    // Timeline if available
    if (mod.timeline && mod.timeline.length > 0) {
      const ty = Math.max(my, ry) + 8;
      if (ty < 250) {
        sectionLabel(doc, 'CRONOGRAMA DE LA SESIÓN', 20, ty);
        let tx = 20;
        mod.timeline.slice(0, 5).forEach((block) => {
          const tw = Math.min(30, (170 / mod.timeline.length));
          doc.setFillColor(...C.bgCard);
          doc.roundedRect(tx, ty + 6, tw - 2, 18, 1.5, 1.5, 'F');
          doc.setFillColor(...mc);
          doc.roundedRect(tx, ty + 6, tw - 2, 5, 1.5, 1.5, 'F');
          doc.setFont('courier', 'bold');
          doc.setFontSize(6);
          doc.setTextColor(...C.bg);
          doc.text(block.time || '', tx + (tw - 2) / 2, ty + 10, { align: 'center' });
          const bl = doc.splitTextToSize(block.topic || '', tw - 6) as string[];
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(6.5);
          doc.setTextColor(...C.grayL);
          bl.slice(0, 2).forEach((bline: string, bi: number) => doc.text(bline, tx + 2, ty + 17 + bi * 4));
          tx += tw;
        });
      }
    }

    // Footer
    pageFooter(doc, `${modLabels[i]} · Programa DIAT 2026 · Facultad de Derecho PUCV`, `${i + 4}`);
  });

  // ── PAGE 7: TOOLKIT ────────────────────────────────────────────────────────
  doc.addPage();
  pageHeader(doc, [{ text: 'TOOLKIT IA', x: ML }], 'Herramientas del ecosistema legaltech');

  const tools = [
    { name: 'Claude', maker: 'Anthropic', role: 'Análisis profundo · Documentos extensos · Agentes jurídicos', ideal: 'Contratos, informes, system prompts', color: C.cyanL },
    { name: 'ChatGPT', maker: 'OpenAI', role: 'Agentes GPT · Workflows · Generación versátil', ideal: 'GPTs personalizados, automatización', color: C.indigo },
    { name: 'Gemini', maker: 'Google', role: 'PDFs directos · Ecosistema Google · Multimodal', ideal: 'Análisis de documentos adjuntos', color: C.purple },
    { name: 'NotebookLM', maker: 'Google', role: 'Investigación con fuentes propias · Citas verificadas', ideal: 'Investigación doctrinal y jurisprudencial', color: [52, 211, 153] as [number,number,number] },
    { name: 'Perplexity', maker: 'Perplexity AI', role: 'Búsqueda con fuentes en tiempo real', ideal: 'Normativa reciente, jurisprudencia 2024-2025', color: [251, 191, 36] as [number,number,number] },
    { name: 'Harvey AI', maker: 'Harvey', role: 'IA especializada para firmas de abogados', ideal: 'Grandes firmas, litigación corporativa', color: [245, 101, 101] as [number,number,number] },
    { name: 'Thomson Reuters AI', maker: 'Thomson Reuters', role: 'Westlaw AI · Research Assistant jurídico premium', ideal: 'Investigación jurídica profesional verificada', color: [248, 113, 113] as [number,number,number] },
  ];

  let ty = 44;
  // Table header
  doc.setFillColor(...C.bgLight);
  doc.rect(20, ty, 170, 8, 'F');
  const cols = [20, 52, 90, 130, 172];
  const headers = ['HERRAMIENTA', 'FABRICANTE', 'ROL PRINCIPAL', 'USO IDEAL'];
  headers.forEach((h, hi) => {
    doc.setFont('courier', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...C.cyanL);
    doc.text(h, cols[hi] + 2, ty + 5.5);
  });
  ty += 10;

  tools.forEach((t, ti) => {
    const rowBg = ti % 2 === 0 ? C.bgCard : C.bg;
    doc.setFillColor(...rowBg);
    doc.rect(20, ty, 170, 11, 'F');

    // Color dot
    doc.setFillColor(...t.color);
    doc.circle(cols[0] + 3, ty + 5.5, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...C.white);
    doc.text(t.name, cols[0] + 8, ty + 6.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...C.gray);
    doc.text(t.maker, cols[1] + 2, ty + 6.5);

    const roleLines = doc.splitTextToSize(t.role, 36) as string[];
    doc.setTextColor(...C.grayL);
    doc.text(roleLines[0] || '', cols[2] + 2, ty + 5);
    if (roleLines[1]) doc.text(roleLines[1], cols[2] + 2, ty + 9);

    const idealLines = doc.splitTextToSize(t.ideal, 38) as string[];
    doc.text(idealLines[0] || '', cols[3] + 2, ty + 5);
    if (idealLines[1]) doc.text(idealLines[1], cols[3] + 2, ty + 9);

    ty += 12;
  });

  // ── PAGE 8: EQUIPO + CIERRE ────────────────────────────────────────────────
  doc.addPage();
  pageHeader(doc, [{ text: 'EQUIPO EJECUTOR', x: ML }], 'Equipo Programa DIAT 2026', C.purple);

  // Autoridades
  sectionLabel(doc, 'AUTORIDADES', 20, 44);

  const autoridades = [
    { name: 'Eduardo Aldunate Lizana', rol: 'Director, Escuela de Derecho PUCV', color: C.cyanL },
    { name: 'Dr. Adolfo Silva Walbaum', rol: 'Director Programa DIAT · Director del Taller', color: C.cyanL },
  ];
  let ey = 52;
  autoridades.forEach(a => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...a.color);
    doc.text(a.name, 20, ey);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...C.gray);
    doc.text(a.rol, 20, ey + 5);
    ey += 13;
  });

  // Equipo ejecutor
  sectionLabel(doc, 'EQUIPO EJECUTOR', 20, ey + 4);
  ey += 12;

  const colorsMap: Record<string, [number,number,number]> = {
    cyan: C.cyan, indigo: C.indigo, blue: [96, 165, 250],
    purple: C.purple, emerald: [52, 211, 153], teal: [20, 184, 166],
    violet: [167, 139, 250],
  };

  equipo.forEach((m, mi) => {
    const col2 = mi % 2;
    const ex = col2 === 0 ? 20 : 108;
    const mColor = colorsMap[m.color] || C.gray;

    doc.setFillColor(...C.bgCard);
    doc.roundedRect(ex, ey, 82, 16, 2, 2, 'F');

    // Avatar
    doc.setFillColor(mColor[0], mColor[1], mColor[2]);
    doc.circle(ex + 10, ey + 8, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...C.bg);
    doc.text(m.initials, ex + 10, ey + 9.5, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...C.white);
    doc.text(m.name, ex + 20, ey + 7);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...C.gray);
    doc.text(m.rol, ex + 20, ey + 12);
    doc.text(m.calidad, ex + 20, ey + 16.5);

    if (col2 === 1) ey += 20;
  });
  if (equipo.length % 2 !== 0) ey += 20;

  // Registration CTA
  ey = Math.max(ey, 200);
  hLine(doc, ML, MR, ey, C.cyan, 0.3);
  ey += 10;

  doc.setFillColor(...C.bgCard);
  doc.roundedRect(20, ey, 170, 40, 3, 3, 'F');
  doc.setDrawColor(...C.cyan);
  doc.setLineWidth(0.3);
  doc.roundedRect(20, ey, 170, 40, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...C.cyanL);
  doc.text('¿Quieres participar?', 105, ey + 12, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...C.grayL);
  doc.text('Fechas tentativas: 8 · 15 · 22 Septiembre 2026 · Cupos limitados', 105, ey + 20, { align: 'center' });
  doc.text('Contacto: programadiat@pucv.cl · Facultad de Derecho PUCV', 105, ey + 28, { align: 'center' });

  // Footer
  pageFooter(doc, 'DIAT Prompting Hub v2.0 · Facultad de Derecho PUCV · © 2026', '8');

  // Save
  doc.save('DIAT-Prompting-Hub-2026.pdf');
}

// ─────────────────────────────────────────────────────────────────────────────
// PROMPT PDF — Generated from Prompt Lab
// ─────────────────────────────────────────────────────────────────────────────
export async function generatePromptPDF(cfg: PromptConfig): Promise<void> {
  const JsPDF = await getJsPDF();
  const doc = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // ── PAGE 1: COVER / CONFIG ─────────────────────────────────────────────────
  fillPage(doc);
  accentBar(doc, 0, 2);

  badge(doc, 'DIAT 2026', 20, 18);
  badge(doc, 'LEXIPROMPT v2.0', 58, 18);
  badge(doc, 'PUCV · DERECHO', 118, 18);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.setTextColor(...C.white);
  doc.text('PROMPT JURÍDICO', 20, 38);
  doc.setFontSize(14);
  doc.setTextColor(...C.cyanL);
  doc.text('LexPrompt Architect · Facultad de Derecho PUCV', 20, 48);

  hLine(doc, ML, MR, 54, C.cyan, 0.4);

  // DNA config table
  sectionLabel(doc, 'PROMPT DNA — CONFIGURACIÓN', 20, 64);

  const dnaRows = [
    { label: 'OBJETIVO',    value: cfg.objetivo },
    { label: 'ÁREA JURÍDICA', value: cfg.area },
    { label: 'PROFUNDIDAD', value: cfg.profundidad },
    { label: 'IA OBJETIVO', value: cfg.modelo },
    { label: 'PROTECCIONES', value: 'Anti-alucinación · Fuentes jurídicas chilenas' },
  ];

  let dy = 72;
  dnaRows.forEach((row, ri) => {
    const rowBg = ri % 2 === 0 ? C.bgCard : C.bgLight;
    doc.setFillColor(...rowBg);
    doc.rect(20, dy, 170, 10, 'F');
    doc.setFont('courier', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...C.cyan);
    doc.text(row.label, 24, dy + 6.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...C.white);
    doc.text(row.value, 80, dy + 6.5);
    dy += 11;
  });

  // Date
  dy += 6;
  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...C.gray);
  doc.text(
    `Generado: ${new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    20, dy
  );
  doc.text('Programa DIAT · Facultad de Derecho PUCV', 20, dy + 5);

  // ── PAGE 2: PROMPT COMPLETO ────────────────────────────────────────────────
  doc.addPage();
  fillPage(doc);
  accentBar(doc);

  sectionLabel(doc, 'PROMPT JURÍDICO COMPLETO', 20, 18);

  // Prompt box
  doc.setFillColor(...C.bgCard);
  doc.roundedRect(16, 22, 178, 248, 3, 3, 'F');
  doc.setDrawColor(...C.cyan);
  doc.setLineWidth(0.2);
  doc.roundedRect(16, 22, 178, 248, 3, 3, 'S');

  // Print prompt text
  let py = 32;
  const lines = cfg.promptText.split('\n');
  lines.forEach(line => {
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
      const tl = doc.splitTextToSize(line, 162) as string[];
      tl.forEach((tline: string) => {
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
      const tl = doc.splitTextToSize(line, 162) as string[];
      tl.forEach((tline: string) => {
        if (py > 264) { doc.addPage(); fillPage(doc); accentBar(doc); py = 20; }
        doc.text(tline, 22, py);
        py += 4.8;
      });
    }
  });

  // ── LAST PAGE: TIPS + SECURITY ─────────────────────────────────────────────
  doc.addPage();
  fillPage(doc);
  accentBar(doc);
  badge(doc, 'USO PROFESIONAL', ML, 18);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...C.white);
  doc.text('Recomendaciones de uso', ML, 32);
  hLine(doc, ML, MR, 36, C.purple, 0.3);

  if (cfg.modelTip) {
    sectionLabel(doc, `OPTIMIZACIÓN PARA ${cfg.modelo.toUpperCase()}`, 20, 44);
    wrapText(doc, cfg.modelTip, 20, 52, 170, 5.5, 9, C.grayL);
  }

  let sp = cfg.modelTip ? 80 : 44;
  sectionLabel(doc, 'CAPAS DE SEGURIDAD ACTIVAS', 20, sp);
  sp += 8;

  const secLayers = [
    { icon: '🧠', title: 'Anti-alucinaciones', desc: 'El prompt incluye instrucciones para que la IA identifique con [VERIFICAR] cualquier dato no confirmado. Nunca inventa normas ni jurisprudencia.' },
    { icon: '📚', title: 'Fuentes jurídicas chilenas', desc: 'Anclaje al marco normativo chileno: BCN, Poder Judicial, Contraloría y Tribunal Constitucional como fuentes primarias.' },
  ];
  secLayers.forEach(sl => {
    doc.setFillColor(...C.bgCard);
    doc.roundedRect(20, sp, 170, 20, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...C.cyanL);
    doc.text(`${sl.icon}  ${sl.title}`, 26, sp + 8);
    const dl = doc.splitTextToSize(sl.desc, 156) as string[];
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...C.gray);
    dl.slice(0, 2).forEach((d: string, di: number) => doc.text(d, 26, sp + 13 + di * 4.5));
    sp += 24;
  });

  // DIAT branding
  hLine(doc, ML, MR, 260, C.muted);
  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...C.grayD);
  doc.text('LexPrompt Architect v2.0 · Programa DIAT · Facultad de Derecho PUCV', ML, 268);
  doc.text('© 2026 · Herramienta pedagógica — Verificar outputs con fuentes primarias', ML, 274);

  // Save
  doc.save('prompt-juridico-diat.pdf');
}

// ─────────────────────────────────────────────────────────────────────────────
// GUÍA JURÍDICA PDF — Tool usage guide
// ─────────────────────────────────────────────────────────────────────────────
export async function generateGuiaJuridicaPDF(): Promise<void> {
  const JsPDF = await getJsPDF();
  const doc = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // ── PAGE 1: COVER ──────────────────────────────────────────────────────────
  fillPage(doc);
  accentBar(doc, 0, 2);

  badge(doc, 'DIAT 2026', 20, 20);
  badge(doc, 'GUÍA JURÍDICA', 58, 20);
  badge(doc, 'FD · PUCV', 116, 20);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(36);
  doc.setTextColor(...C.white);
  doc.text('Guía de Usos', 20, 55);
  doc.text('Jurídicos con IA', 20, 68);

  doc.setFontSize(13);
  doc.setTextColor(...C.cyanL);
  doc.text('Prompts, Funciones y Workflows para Abogados', 20, 80);

  hLine(doc, ML, MR, 86, C.cyan, 0.4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...C.gray);
  const guiaDesc = 'Guía práctica con prompts profesionales para las 5 principales herramientas de IA jurídica. Incluye workflows optimizados, tablas comparativas y protocolos de seguridad para el uso responsable de inteligencia artificial en el ejercicio del derecho.';
  wrapText(doc, guiaDesc, 20, 96, 170, 5.5, 9.5, C.gray);

  const tools5 = [
    { name: 'Claude',      desc: 'Análisis profundo, system prompts', color: C.cyan },
    { name: 'ChatGPT',     desc: 'Agentes, workflows, GPTs', color: C.indigo },
    { name: 'Gemini',      desc: 'PDFs directos, Google Workspace', color: C.purple },
    { name: 'NotebookLM',  desc: 'Investigación con fuentes propias', color: [52,211,153] as [number,number,number] },
    { name: 'Perplexity',  desc: 'Búsqueda con fuentes actuales', color: [251,191,36] as [number,number,number] },
  ];

  let gx = 20;
  tools5.forEach(t => {
    doc.setFillColor(...C.bgCard);
    doc.roundedRect(gx, 130, 32, 26, 2, 2, 'F');
    doc.setDrawColor(t.color[0], t.color[1], t.color[2]);
    doc.setLineWidth(0.2);
    doc.roundedRect(gx, 130, 32, 26, 2, 2, 'S');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...t.color);
    doc.text(t.name, gx + 16, 143, { align: 'center' });
    const dl = doc.splitTextToSize(t.desc, 28) as string[];
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...C.gray);
    dl.forEach((d: string, di: number) => doc.text(d, gx + 16, 149 + di * 4, { align: 'center' }));
    gx += 36;
  });

  // ── PAGE 2: PROMPTS POR HERRAMIENTA ────────────────────────────────────────
  doc.addPage();
  fillPage(doc);
  accentBar(doc);

  sectionLabel(doc, 'PROMPTS RECOMENDADOS POR HERRAMIENTA', 20, 18);

  const promptGuides = [
    {
      tool: 'CLAUDE', color: C.cyan,
      tip: 'Pega el documento completo (hasta 200k tokens). Usa etiquetas <documento> para separar material del prompt. Ideal para contratos extensos y análisis multipasos.',
      prompt: 'Actúa como abogado senior chileno. Analiza el siguiente [documento/contrato/sentencia] e identifica: (1) puntos clave, (2) riesgos jurídicos, (3) cláusulas problemáticas, (4) recomendaciones accionables. No inventes normas — usa [VERIFICAR] para datos inciertos.',
    },
    {
      tool: 'CHATGPT (GPT-4o)', color: C.indigo,
      tip: 'Configura un GPT personalizado para tu área práctica con hasta 8.000 caracteres de instrucciones. Usa el modo "Reason" para análisis complejos.',
      prompt: 'Eres un asistente jurídico especializado en [área]. Tu tarea es [finalidad]. Formato de respuesta: (1) Síntesis ejecutiva, (2) Análisis por puntos, (3) Riesgos, (4) Recomendaciones. Cita normas por nombre, número y artículo específico.',
    },
    {
      tool: 'GEMINI', color: C.purple,
      tip: 'Adjunta PDFs directamente sin copiar texto. Funciona bien en Google Docs con el panel lateral. Usa instrucciones en secciones claras.',
      prompt: 'Analiza este documento PDF adjunto como experto jurídico chileno. Identifica: hechos relevantes, normas aplicables, riesgos y recomendaciones. Cita los artículos específicos del documento.',
    },
    {
      tool: 'NOTEBOOKLM', color: [52,211,153] as [number,number,number],
      tip: 'Primero sube tus documentos fuente (libros, sentencias, apuntes). Luego formula preguntas — responde citando textualmente tus fuentes. Ideal para investigación verificable.',
      prompt: '¿Qué dice la doctrina sobre [institución jurídica]? Cita los párrafos exactos de los documentos que subí. Si no hay información suficiente en mis documentos, indícalo.',
    },
  ];

  let gy = 26;
  promptGuides.forEach(pg => {
    doc.setFillColor(...C.bgCard);
    doc.roundedRect(20, gy, 170, 44, 2, 2, 'F');
    doc.setFillColor(pg.color[0], pg.color[1], pg.color[2]);
    doc.roundedRect(20, gy, 170, 7, 2, 2, 'F');

    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...C.bg);
    doc.text(pg.tool, 24, gy + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...C.gray);
    const tl = doc.splitTextToSize(pg.tip, 162) as string[];
    tl.slice(0, 2).forEach((tline: string, ti: number) => doc.text(tline, 24, gy + 12 + ti * 4.5));

    doc.setFont('courier', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...C.cyanL);
    const pl = doc.splitTextToSize(pg.prompt, 162) as string[];
    pl.slice(0, 4).forEach((pline: string, pi: number) => doc.text(pline, 24, gy + 23 + pi * 4.2));

    gy += 48;
  });

  // ── PAGE 3: WORKFLOWS ──────────────────────────────────────────────────────
  doc.addPage();
  fillPage(doc);
  accentBar(doc);

  sectionLabel(doc, 'WORKFLOWS JURÍDICOS CON IA', 20, 18);

  const workflows = [
    {
      title: 'Workflow de Análisis Contractual', color: C.cyan,
      steps: [
        'PASO 1 — CLAUDE: "Analiza este contrato e identifica todas las cláusulas de riesgo, ordenadas por criticidad."',
        'PASO 2 — CHATGPT: "Con base en este análisis, genera una tabla comparativa con los cambios recomendados."',
        'PASO 3 — NOTEBOOKLM: Verifica normas citadas contra tu base documental interna.',
        'PASO 4 — PERPLEXITY: Verifica si existen modificaciones legales recientes que afecten el contrato.',
        'RESULTADO: Informe completo con riesgos identificados, doctrina verificada y cambios recomendados.',
      ],
    },
    {
      title: 'Workflow de Investigación Jurídica', color: C.indigo,
      steps: [
        'PASO 1 — NOTEBOOKLM: Sube doctrina y jurisprudencia disponible. Mapea el estado del debate.',
        'PASO 2 — PERPLEXITY: "Busca sentencias recientes de la Corte Suprema sobre [tema] con URLs exactas."',
        'PASO 3 — CLAUDE: "Con estos insumos, redacta un informe jurídico nivel académico sobre [institución]."',
        'RESULTADO: Informe estructurado con fuentes verificadas, doctrina integrada y análisis crítico.',
      ],
    },
    {
      title: 'Workflow de Preparación de Audiencia', color: C.purple,
      steps: [
        'PASO 1 — CLAUDE: "Actúa como contraparte. ¿Cuáles son los 5 argumentos más fuertes en mi contra?"',
        'PASO 2 — CHATGPT: "Genera un esquema de argumentación con rebates para cada argumento identificado."',
        'PASO 3 — GEMINI: Analiza la jurisprudencia adjunta para identificar precedentes favorables.',
        'RESULTADO: Argumentario completo con anticipación de contingencias y plan de contingencia.',
      ],
    },
  ];

  let wy = 26;
  workflows.forEach(wf => {
    doc.setFillColor(...C.bgCard);
    const wh = 14 + wf.steps.length * 11;
    doc.roundedRect(20, wy, 170, wh, 2, 2, 'F');

    doc.setFillColor(wf.color[0], wf.color[1], wf.color[2]);
    doc.rect(20, wy, 3, wh, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...C.white);
    doc.text(wf.title, 27, wy + 8);

    let wy2 = wy + 14;
    wf.steps.forEach(step => {
      const sl = doc.splitTextToSize(step, 158) as string[];
      const isStep = step.startsWith('PASO');
      const isResult = step.startsWith('RESULTADO');
      doc.setFont('helvetica', isStep || isResult ? 'bold' : 'normal');
      doc.setFontSize(7.5);
      const wfColor = isResult ? C.cyanL : C.grayL;
      doc.setTextColor(...wfColor);
      doc.text(sl[0] || '', 27, wy2);
      if (sl[1]) doc.text(sl[1], 27, wy2 + 4);
      wy2 += 11;
    });

    wy += wh + 8;
  });

  // Footer
  pageFooter(doc, 'Guía de Usos Jurídicos con IA · Programa DIAT 2026 · Facultad de Derecho PUCV');

  doc.save('guia-juridica-ia-diat.pdf');
}
