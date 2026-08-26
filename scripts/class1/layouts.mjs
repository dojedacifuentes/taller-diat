// ─────────────────────────────────────────────────────────────────────────────
// CLASE 1 · DECK · composición de las 30 diapositivas
//
// Una función por clave `layout` de deck.ts. NINGUNA de estas funciones escribe
// contenido pedagógico: todo el texto sustantivo se importa de
// `src/content/class1/activities.ts`, `prompts.ts` y `manifest.ts`, que son los
// mismos módulos que renderiza la plataforma.
// ─────────────────────────────────────────────────────────────────────────────

import { C, F, G, H, W, T } from './theme.mjs';
import { chrome, surface, card, tag, para, codeBlock } from './chrome.mjs';

import { class1Meta, CLASS_URL, CLASS_ROOT } from '../../src/content/class1/manifest.ts';
import {
  PROMPT_DIAGNOSTICO,
  PROMPT_DIAT_REFERENCIA,
  METAPROMPT_AUDITORIA,
} from '../../src/content/class1/prompts.ts';
import {
  fakeCitation,
  blameQuestion,
  blameOptions,
  disciplinaryLine,
  modelCore,
  capabilities,
  productLayers,
  myths,
  diatComponents,
  riskLevels,
  promptLabSteps,
  metapromptModes,
  metapromptLimits,
  metapromptGuidance,
  errorTypes,
  warningSignals,
  workModes,
  googleWarning,
  terminologyBan,
  confidentialityRule,
  icjrPhases,
  epistemicStatuses,
  claimStates,
  solvedRow,
  notVerifiedRule,
  finalStatement,
  finalSubtitle,
} from '../../src/content/class1/activities.ts';

/** Imagen embebida como data URI. La rellena el generador antes de componer. */
export const ASSETS = { crestWhite: null, crestDark: null, qr: null };

// ─── 01 · Portada ────────────────────────────────────────────────────────────

function cover(slide, s) {
  chrome(slide, s, { bare: true });
  const sf = surface(s);

  slide.addShape('rect', {
    x: 0, y: 0, w: W, h: H,
    fill: { type: 'solid', color: sf.bg }, line: { type: 'none' },
  });
  slide.addShape('rect', {
    x: 0, y: 0, w: G.rail, h: H, fill: { color: C.crimson }, line: { type: 'none' },
  });
  // Bloque cromático de fondo, discreto.
  slide.addShape('rect', {
    x: 8.55, y: 0, w: 4.78, h: H, fill: { color: '161E2E' }, line: { type: 'none' },
  });

  if (ASSETS.crestWhite) {
    slide.addImage({ data: ASSETS.crestWhite, x: 0.66, y: 0.52, w: 1.62, h: 1.13 });
  }

  slide.addText('PROGRAMA DE POSTÍTULO EN DERECHO, INTELIGENCIA ARTIFICIAL Y TECNOLOGÍA', {
    x: 0.78, y: 1.86, w: 7.4, h: 0.26,
    fontFace: F.mono, fontSize: 9.5, bold: true, charSpacing: 1.1, color: 'E7C3C5', valign: 'middle',
  });
  slide.addText('Escuela de Derecho · Pontificia Universidad Católica de Valparaíso', {
    x: 0.78, y: 2.10, w: 7.4, h: 0.26,
    fontFace: F.sans, fontSize: 12, color: '94A3B8', valign: 'middle',
  });

  slide.addShape('rect', { x: 0.78, y: 2.58, w: 1.9, h: 0.04, fill: { color: C.crimson }, line: { type: 'none' } });

  slide.addText(class1Meta.title, {
    x: 0.78, y: 2.86, w: 7.5, h: 1.86,
    fontFace: F.sans, fontSize: 38, bold: true, color: C.white,
    valign: 'top', lineSpacingMultiple: 1.0,
  });

  slide.addText(class1Meta.thesis, {
    x: 0.78, y: 4.80, w: 7.2, h: 0.9,
    fontFace: F.sans, fontSize: 13, color: 'CBD5E1', valign: 'top', lineSpacingMultiple: 1.22,
  });

  const meta = [
    ['CLASE', 'Clase 1 de 3'],
    ['FECHA', class1Meta.date],
    ['HORARIO', `${class1Meta.time} · ${class1Meta.durationMin} min exactos`],
    ['MODALIDAD', 'Presencial · aprendizaje individual guiado por plataforma'],
  ];
  meta.forEach(([k, v], i) => {
    const y = 5.86 + i * 0.30;
    slide.addText(k, {
      x: 0.78, y, w: 1.25, h: 0.28,
      fontFace: F.mono, fontSize: 8.5, bold: true, charSpacing: 1, color: '8C6F72', valign: 'middle',
    });
    slide.addText(v, {
      x: 2.05, y, w: 6.2, h: 0.28,
      fontFace: F.sans, fontSize: 11, color: 'CBD5E1', valign: 'middle',
    });
  });

  // QR: la primera acción que se pide al curso.
  slide.addShape('rect', {
    x: 9.42, y: 1.94, w: 3.05, h: 3.62, fill: { color: C.white }, line: { type: 'none' },
  });
  if (ASSETS.qr) {
    slide.addImage({ data: ASSETS.qr, x: 9.76, y: 2.20, w: 2.37, h: 2.37 });
  }
  slide.addText('ENTRA AHORA', {
    x: 9.42, y: 4.66, w: 3.05, h: 0.24,
    fontFace: F.mono, fontSize: 9.5, bold: true, charSpacing: 1.2, color: C.crimson,
    align: 'center', valign: 'middle',
  });
  slide.addText(CLASS_URL.replace('https://', ''), {
    x: 9.42, y: 4.90, w: 3.05, h: 0.30,
    fontFace: F.mono, fontSize: 11, bold: true, color: C.ink, align: 'center', valign: 'middle',
  });
  slide.addText('y déjala abierta toda la sesión', {
    x: 9.42, y: 5.18, w: 3.05, h: 0.26,
    fontFace: F.sans, fontSize: 9.5, color: C.muted, align: 'center', valign: 'middle',
  });

  slide.addText(class1Meta.classroomRule, {
    x: 9.42, y: 5.86, w: 3.05, h: 1.0,
    fontFace: F.sans, fontSize: 8.5, color: '8FA0B4', valign: 'top', lineSpacingMultiple: 1.15,
  });
}

// ─── 02 · Ficha bibliográfica falsa ──────────────────────────────────────────

function citation(slide, s) {
  const b = chrome(slide, s);
  const sf = surface(s);

  card(slide, { x: G.left, y: b.y + 0.12, w: G.width, h: 2.10, accent: C.crimson });

  slide.addText('REFERENCIA CITADA EN UN RECURSO DE CASACIÓN', {
    x: G.left + 0.46, y: b.y + 0.42, w: G.width - 0.92, h: 0.26,
    fontFace: F.mono, fontSize: 9.5, bold: true, charSpacing: 1.1, color: C.muted, valign: 'middle',
  });

  const c = fakeCitation;
  slide.addText(
    [
      { text: `${c.author} (${c.year}). `, options: { bold: true, color: C.ink } },
      { text: `${c.title}. `, options: { italic: true, color: C.ink2 } },
      { text: `${c.publisher}, ${c.place}, ${c.pages}.`, options: { color: C.ink2 } },
    ],
    {
      x: G.left + 0.46, y: b.y + 0.80, w: G.width - 0.92, h: 1.42,
      fontFace: F.sans, fontSize: 19, valign: 'top', lineSpacingMultiple: 1.20,
    },
  );

  para(slide, {
    x: G.left, y: b.y + 2.44, w: G.width, h: 1.06,
    text: c.reading, size: T.lead, color: sf.sub, spacing: 1.24,
  });

  slide.addText('Nada de esto se puede detectar mirando la ficha.', {
    x: G.left, y: b.y + 3.62, w: G.width, h: 0.36,
    fontFace: F.sans, fontSize: 15, bold: true, italic: true, color: C.crimson, valign: 'middle',
  });
}

// ─── 03 · ¿Quién falló? ──────────────────────────────────────────────────────

function question(slide, s) {
  const b = chrome(slide, s);
  const sf = surface(s);

  para(slide, {
    x: G.left, y: b.y, w: G.width - 0.4, h: 0.86,
    text: blameQuestion, size: T.lead + 1, color: sf.sub, spacing: 1.22,
  });

  const gap = 0.20;
  const colW = (G.width - gap * 4) / 5;
  const rowH = 2.42;
  const y = b.y + 1.02;
  blameOptions.forEach((o, i) => {
    const x = G.left + i * (colW + gap);
    card(slide, { x, y, w: colW, h: rowH, accent: C.crimson });
    tag(slide, {
      x: x + 0.24, y: y + 0.24, w: 0.36, h: 0.36,
      text: String(i + 1), bg: C.crimson, color: C.white, size: 12,
    });
    slide.addText(o.label, {
      x: x + 0.24, y: y + 0.68, w: colW - 0.48, h: 0.86,
      fontFace: F.sans, fontSize: 13.5, bold: true, color: C.ink,
      valign: 'top', lineSpacingMultiple: 1.04,
    });
    slide.addText(o.hint, {
      x: x + 0.24, y: y + 1.58, w: colW - 0.48, h: 0.68,
      fontFace: F.sans, fontSize: 10, color: C.muted, valign: 'top', lineSpacingMultiple: 1.1,
    });
  });

  slide.addText('Elige una. Declara tu confianza. Confirma. No se puede editar: volveremos a esta pregunta a las 16:22.', {
    x: G.left, y: y + rowH + 0.12, w: G.width, h: 0.32,
    fontFace: F.sans, fontSize: 11.5, italic: true, color: C.muted, valign: 'middle',
  });
}

// ─── 04 · Cuatro tribunales ──────────────────────────────────────────────────

function courts(slide, s) {
  const b = chrome(slide, s);

  const cols = [
    { key: 'court', label: 'SEDE', w: 3.55, align: 'left' },
    { key: 'rol', label: 'ROL', w: 1.60, align: 'left' },
    { key: 'date', label: 'FECHA', w: 1.20, align: 'left' },
    { key: 'sanction', label: 'SANCIÓN', w: 2.10, align: 'left' },
    { key: 'ai', label: '¿LA RESOLUCIÓN ATRIBUYE EL HECHO A IA?', w: 3.32, align: 'left' },
  ];

  let x = G.left;
  const headY = b.y;
  cols.forEach((c) => {
    slide.addText(c.label, {
      x, y: headY, w: c.w - 0.14, h: 0.34,
      fontFace: F.mono, fontSize: 8.5, bold: true, charSpacing: 0.8, color: C.muted, valign: 'middle',
    });
    x += c.w;
  });
  slide.addShape('rect', {
    x: G.left, y: headY + 0.36, w: G.width, h: 0.02, fill: { color: C.ink }, line: { type: 'none' },
  });

  const rowH = 0.92;
  disciplinaryLine.forEach((r, i) => {
    const y = headY + 0.46 + i * rowH;
    if (r.highlight) {
      slide.addShape('rect', {
        x: G.left - 0.16, y: y - 0.06, w: G.width + 0.32, h: rowH - 0.06,
        fill: { color: C.crimsonT }, line: { type: 'none' },
      });
      slide.addShape('rect', {
        x: G.left - 0.16, y: y - 0.06, w: 0.045, h: rowH - 0.06,
        fill: { color: C.crimson }, line: { type: 'none' },
      });
    }
    let cx = G.left;
    cols.forEach((c) => {
      const bold = c.key === 'court' || c.key === 'sanction';
      const mono = c.key === 'rol';
      slide.addText(String(r[c.key]), {
        x: cx, y, w: c.w - 0.16, h: rowH - 0.12,
        fontFace: mono ? F.mono : F.sans,
        fontSize: c.key === 'ai' ? 9.5 : mono ? 10.5 : 11.5,
        bold, color: r.highlight && bold ? C.crimsonD : c.key === 'ai' ? C.muted : C.ink2,
        valign: 'middle', lineSpacingMultiple: 1.08,
      });
      cx += c.w;
    });
    slide.addShape('rect', {
      x: G.left, y: y + rowH - 0.10, w: G.width, h: 0.008,
      fill: { color: C.line }, line: { type: 'none' },
    });
  });

  slide.addText('La sanción no recae sobre la herramienta; recae sobre quien incorpora el contenido y firma.', {
    x: G.left, y: b.bottom - 0.50, w: G.width, h: 0.40,
    fontFace: F.sans, fontSize: 15, bold: true, color: C.crimson, valign: 'middle',
  });
}

// ─── 05 · Flujo canónico ─────────────────────────────────────────────────────

function flow(slide, s) {
  const b = chrome(slide, s);

  // Esquema abandonado.
  slide.addShape('rect', {
    x: G.left, y: b.y, w: 5.2, h: 0.86, fill: { color: 'F1F1EE' },
    line: { color: C.line, width: 0.75 },
  });
  slide.addText('PROMPT  →  RESPUESTA', {
    x: G.left, y: b.y, w: 5.2, h: 0.86,
    fontFace: F.mono, fontSize: 16, bold: true, color: C.faint, strike: true,
    align: 'center', valign: 'middle',
  });
  slide.addText('Lo que abandonamos hoy', {
    x: G.left + 5.44, y: b.y, w: 3.4, h: 0.86,
    fontFace: F.sans, fontSize: 12, italic: true, color: C.muted, valign: 'middle',
  });

  // Flujo canónico.
  const steps = class1Meta.flow;
  const gap = 0.16;
  const colW = (G.width - gap * (steps.length - 1)) / steps.length;
  const y = b.y + 1.46;
  steps.forEach((step, i) => {
    const last = i === steps.length - 1;
    const x = G.left + i * (colW + gap);
    slide.addShape('rect', {
      x, y, w: colW, h: 1.92,
      fill: { color: last ? C.crimson : C.white },
      line: { color: last ? C.crimson : C.line, width: last ? 1 : 0.75 },
    });
    slide.addText(String(i + 1).padStart(2, '0'), {
      x, y: y + 0.18, w: colW, h: 0.30,
      fontFace: F.mono, fontSize: 10, bold: true,
      color: last ? 'F0C7C9' : C.faint, align: 'center', valign: 'middle',
    });
    slide.addText(step, {
      x: x + 0.10, y: y + 0.56, w: colW - 0.20, h: 1.16,
      fontFace: F.sans, fontSize: step.length > 14 ? 12 : 13.5, bold: true,
      color: last ? C.white : C.ink, align: 'center', valign: 'middle', lineSpacingMultiple: 1.02,
    });
    if (!last) {
      slide.addText('→', {
        x: x + colW - 0.06, y: y + 0.78, w: gap + 0.12, h: 0.38,
        fontFace: F.sans, fontSize: 13, color: C.faint, align: 'center', valign: 'middle',
      });
    }
  });

  slide.addText(class1Meta.idea, {
    x: G.left, y: b.bottom - 0.70, w: G.width, h: 0.50,
    fontFace: F.mono, fontSize: 12.5, bold: true, charSpacing: 0.6,
    color: C.ink, align: 'center', valign: 'middle',
  });
}

// ─── 06 · Capacidades y límites ──────────────────────────────────────────────

function capabilitiesLayout(slide, s) {
  const b = chrome(slide, s);

  card(slide, { x: G.left, y: b.y, w: G.width, h: 0.94, accent: C.ink, fill: C.lineSoft, border: false });
  slide.addText('MECANISMO GENERATIVO', {
    x: G.left + 0.34, y: b.y + 0.16, w: 3.2, h: 0.26,
    fontFace: F.mono, fontSize: 9, bold: true, charSpacing: 1, color: C.muted, valign: 'middle',
  });
  slide.addText(modelCore.description, {
    x: G.left + 0.34, y: b.y + 0.40, w: G.width - 0.68, h: 0.50,
    fontFace: F.sans, fontSize: 12, color: C.ink2, valign: 'top', lineSpacingMultiple: 1.10,
  });

  const y0 = b.y + 1.16;
  slide.addText('CUATRO CAPACIDADES', {
    x: G.left, y: y0, w: 5.7, h: 0.28,
    fontFace: F.mono, fontSize: 9, bold: true, charSpacing: 1, color: C.green, valign: 'middle',
  });
  slide.addText('CUATRO LÍMITES QUE NO SE RESUELVEN USÁNDOLAS MEJOR', {
    x: G.left + 6.1, y: y0, w: 5.7, h: 0.28,
    fontFace: F.mono, fontSize: 9, bold: true, charSpacing: 1, color: C.crimson, valign: 'middle',
  });

  const rowH = 0.68;
  capabilities.forEach((c, i) => {
    const y = y0 + 0.34 + i * (rowH + 0.07);
    slide.addShape('rect', {
      x: G.left, y, w: 5.7, h: rowH, fill: { color: C.white }, line: { color: C.line, width: 0.75 },
    });
    slide.addShape('rect', { x: G.left, y, w: 0.04, h: rowH, fill: { color: C.green }, line: { type: 'none' } });
    slide.addText(c.capability, {
      x: G.left + 0.22, y: y + 0.04, w: 5.3, h: 0.28,
      fontFace: F.sans, fontSize: 12, bold: true, color: C.ink, valign: 'middle',
    });
    slide.addText(c.utility, {
      x: G.left + 0.22, y: y + 0.30, w: 5.3, h: 0.34,
      fontFace: F.sans, fontSize: 9.5, color: C.muted, valign: 'top', lineSpacingMultiple: 1.06,
    });

    slide.addShape('rect', {
      x: G.left + 6.1, y, w: 5.7, h: rowH, fill: { color: C.white }, line: { color: C.line, width: 0.75 },
    });
    slide.addShape('rect', {
      x: G.left + 6.1, y, w: 0.04, h: rowH, fill: { color: C.crimson }, line: { type: 'none' },
    });
    slide.addText(c.limit, {
      x: G.left + 6.32, y: y + 0.04, w: 5.3, h: 0.60,
      fontFace: F.sans, fontSize: 10.5, color: C.ink2, valign: 'middle', lineSpacingMultiple: 1.08,
    });
  });
}

// ─── 07 · Modelo / producto ──────────────────────────────────────────────────

function product(slide, s) {
  const b = chrome(slide, s);

  slide.addShape('rect', {
    x: G.left, y: b.y + 0.34, w: 4.30, h: 2.26, fill: { color: C.ink }, line: { type: 'none' },
  });
  slide.addText(modelCore.label, {
    x: G.left + 0.30, y: b.y + 0.52, w: 3.70, h: 0.36,
    fontFace: F.mono, fontSize: 12, bold: true, charSpacing: 1.6, color: 'F0C7C9', valign: 'middle',
  });
  slide.addText(modelCore.description, {
    x: G.left + 0.30, y: b.y + 0.92, w: 3.70, h: 1.56,
    fontFace: F.sans, fontSize: 11, color: 'CBD5E1', valign: 'top', lineSpacingMultiple: 1.16,
  });

  slide.addText('LO QUE USTEDES ABREN ES EL PRODUCTO: EL MODELO MÁS ESTAS CAPAS', {
    x: G.left + 4.62, y: b.y, w: 7.2, h: 0.28,
    fontFace: F.mono, fontSize: 9, bold: true, charSpacing: 0.9, color: C.crimson, valign: 'middle',
  });

  slide.addText('CAPA', {
    x: G.left + 4.84, y: b.y + 0.32, w: 2.0, h: 0.22,
    fontFace: F.mono, fontSize: 8, bold: true, charSpacing: 0.9, color: C.faint, valign: 'middle',
  });
  slide.addText('LO QUE NO GARANTIZA', {
    x: G.left + 6.90, y: b.y + 0.32, w: 4.80, h: 0.22,
    fontFace: F.mono, fontSize: 8, bold: true, charSpacing: 0.9, color: C.crimson, valign: 'middle',
  });

  const rowH = 0.70;
  productLayers.slice(0, 4).forEach((l, i) => {
    const y = b.y + 0.62 + i * (rowH + 0.08);
    slide.addShape('rect', {
      x: G.left + 4.62, y, w: 7.2, h: rowH, fill: { color: C.white }, line: { color: C.line, width: 0.75 },
    });
    slide.addText(l.label, {
      x: G.left + 4.84, y: y + 0.04, w: 2.0, h: rowH - 0.08,
      fontFace: F.sans, fontSize: 12, bold: true, color: C.ink, valign: 'middle',
    });
    slide.addText(l.doesNotGuarantee, {
      x: G.left + 6.90, y: y + 0.06, w: 4.80, h: rowH - 0.12,
      fontFace: F.sans, fontSize: 10, color: C.muted, valign: 'middle', lineSpacingMultiple: 1.08,
    });
  });

  slide.addText('«Me buscó jurisprudencia y me la inventó»: a veces falla el modelo y a veces el producto no tenía la búsqueda activada. Son diagnósticos distintos y se corrigen distinto.', {
    x: G.left, y: b.bottom - 0.72, w: G.width, h: 0.64,
    fontFace: F.sans, fontSize: 12.5, color: C.ink2, valign: 'middle', lineSpacingMultiple: 1.16,
  });
}

// ─── Anclas (08 · 18 · 21) ───────────────────────────────────────────────────

const ANCHOR_SUB = {
  8: 'Una respuesta puede estar perfectamente redactada y ser jurídicamente incorrecta. La calidad de la redacción y la calidad de la evidencia son dos cosas distintas.',
  18: 'Que el rol exista y que el enlace abra no prueba que la sentencia sostenga la tesis. Es el error que se le cuela a quien sí revisa.',
  21: 'Grounding resuelve de dónde sale la información. No resuelve si fue interpretada correctamente. Un localizador dice de qué fragmento salió; no que la conclusión se siga de él.',
};

function anchor(slide, s) {
  // Sin título de cromo: el ancla ES el título, a pantalla completa.
  chrome(slide, s, { noTitle: true });
  const sf = surface(s);
  const long = s.title.length > 24;

  slide.addText(s.title, {
    x: G.left, y: 2.42, w: G.width, h: 1.50,
    fontFace: F.sans, fontSize: long ? T.anchorLong : T.anchor, bold: true,
    color: sf.fg, align: 'center', valign: 'middle', charSpacing: 0.6,
  });
  slide.addShape('rect', {
    x: (W - 1.9) / 2, y: 4.06, w: 1.9, h: 0.035,
    fill: { color: sf.dark ? sf.meta : C.crimson }, line: { type: 'none' },
  });
  slide.addText(ANCHOR_SUB[s.n] ?? '', {
    x: 2.30, y: 4.34, w: W - 4.60, h: 1.10,
    fontFace: F.sans, fontSize: 14, color: sf.sub,
    align: 'center', valign: 'top', lineSpacingMultiple: 1.24,
  });
}

// ─── 09 · Cinco mitos ────────────────────────────────────────────────────────

function mythsLayout(slide, s) {
  const b = chrome(slide, s);

  slide.addText('Verdadero, falso o depende. Decídelo para ti antes de oír la explicación.', {
    x: G.left, y: b.y, w: G.width, h: 0.34,
    fontFace: F.sans, fontSize: 13, color: C.ink2, valign: 'middle',
  });

  const rowH = 0.62;
  myths.forEach((m, i) => {
    const y = b.y + 0.50 + i * (rowH + 0.09);
    slide.addShape('rect', {
      x: G.left, y, w: G.width, h: rowH,
      fill: { color: C.white }, line: { color: C.line, width: 0.75 },
    });
    tag(slide, {
      x: G.left, y, w: 0.62, h: rowH,
      text: String(i + 1), bg: C.ink, color: C.white, size: 14,
    });
    slide.addText(`«${m.statement}»`, {
      x: G.left + 0.86, y, w: G.width - 1.20, h: rowH,
      fontFace: F.sans, fontSize: 15, color: C.ink, valign: 'middle',
    });
  });

  // La síntesis del bloque («instruir mejor y verificar no se compensan») NO se
  // proyecta aquí: respondería el mito 1 antes de que el estudiante decida en
  // B02. El profesor la dice a las 15:21, después del trabajo. Guion v2.0, B02.
}

// ─── 10 · Siete componentes ──────────────────────────────────────────────────

function diat(slide, s) {
  const b = chrome(slide, s);

  const gap = 0.14;
  const colW = (G.width - gap * 6) / 7;
  const y = b.y + 0.26;
  diatComponents.forEach((c, i) => {
    const x = G.left + i * (colW + gap);
    const own = !!c.signature;
    slide.addShape('rect', {
      x, y, w: colW, h: 2.56,
      fill: { color: own ? C.crimsonT : C.white },
      line: { color: own ? C.crimson : C.line, width: own ? 1 : 0.75 },
    });
    slide.addText(String(i + 1).padStart(2, '0'), {
      x, y: y + 0.16, w: colW, h: 0.26,
      fontFace: F.mono, fontSize: 9, bold: true, color: own ? C.crimson : C.faint,
      align: 'center', valign: 'middle',
    });
    slide.addText(c.label, {
      x: x + 0.06, y: y + 0.46, w: colW - 0.12, h: 0.42,
      fontFace: F.sans, fontSize: 14, bold: true, color: own ? C.crimsonD : C.ink,
      align: 'center', valign: 'middle',
    });
    slide.addText(c.question, {
      x: x + 0.12, y: y + 0.94, w: colW - 0.24, h: 1.50,
      fontFace: F.sans, fontSize: 9.5, color: C.muted,
      align: 'center', valign: 'top', lineSpacingMultiple: 1.12,
    });
  });

  slide.addShape('rect', {
    x: G.left, y: y + 2.82, w: G.width, h: 1.06,
    fill: { color: C.lineSoft }, line: { type: 'none' },
  });
  slide.addShape('rect', {
    x: G.left, y: y + 2.82, w: 0.045, h: 1.06, fill: { color: C.crimson }, line: { type: 'none' },
  });
  slide.addText(
    [
      { text: 'Fuentes y Control son el aporte propio del programa. ', options: { bold: true, color: C.crimsonD } },
      { text: 'Ninguna guía institucional revisada los incorpora: están diseñadas para tareas donde el costo del error es bajo. En trabajo jurídico, la autoridad depende de dónde viene lo que se afirma, y la salida tiene que ser auditable antes de decidir si se usa.', options: { color: C.ink2 } },
    ],
    {
      x: G.left + 0.28, y: y + 2.92, w: G.width - 0.56, h: 0.86,
      fontFace: F.sans, fontSize: 12, valign: 'middle', lineSpacingMultiple: 1.14,
    },
  );
}

// ─── 11 · Siete preguntas, sin etiquetas ─────────────────────────────────────

function questions(slide, s) {
  const b = chrome(slide, s);

  const rowH = 0.45;
  diatComponents.forEach((c, i) => {
    const y = b.y + 0.06 + i * (rowH + 0.06);
    slide.addText(String(i + 1).padStart(2, '0'), {
      x: G.left, y, w: 0.52, h: rowH,
      fontFace: F.mono, fontSize: 11, bold: true, color: C.faint, valign: 'middle',
    });
    slide.addText(c.question, {
      x: G.left + 0.60, y, w: G.width - 0.60, h: rowH,
      fontFace: F.sans, fontSize: 16, color: C.ink, valign: 'middle',
    });
    slide.addShape('rect', {
      x: G.left, y: y + rowH, w: G.width, h: 0.008,
      fill: { color: C.line }, line: { type: 'none' },
    });
  });

  slide.addText('Una omisión puede ser la decisión correcta. No buscamos siete de siete: buscamos cuál falta y hace daño, y cuál falta y da igual.', {
    x: G.left, y: b.bottom - 0.38, w: G.width, h: 0.34,
    fontFace: F.sans, fontSize: 12.5, bold: true, italic: true, color: C.crimson, valign: 'middle',
  });
}

// ─── 12 · Proporcionalidad al riesgo ─────────────────────────────────────────

const RISK_COLOR = { bajo: C.green, medio: C.amber, alto: C.crimson };

function risk(slide, s) {
  const b = chrome(slide, s);

  const gap = 0.30;
  const colW = (G.width - gap * 2) / 3;
  riskLevels.forEach((r, i) => {
    const x = G.left + i * (colW + gap);
    const accent = RISK_COLOR[r.id];
    card(slide, { x, y: b.y, w: colW, h: 3.10, accent });
    slide.addText(r.label.toUpperCase(), {
      x: x + 0.28, y: b.y + 0.24, w: colW - 0.56, h: 0.34,
      fontFace: F.mono, fontSize: 11, bold: true, charSpacing: 1.2, color: accent, valign: 'middle',
    });
    slide.addText(r.examples, {
      x: x + 0.28, y: b.y + 0.68, w: colW - 0.56, h: 0.92,
      fontFace: F.sans, fontSize: 11.5, color: C.ink2, valign: 'top', lineSpacingMultiple: 1.16,
    });
    slide.addShape('rect', {
      x: x + 0.28, y: b.y + 1.70, w: colW - 0.56, h: 0.012,
      fill: { color: C.line }, line: { type: 'none' },
    });
    slide.addText('ESTRUCTURA', {
      x: x + 0.28, y: b.y + 1.80, w: colW - 0.56, h: 0.24,
      fontFace: F.mono, fontSize: 8.5, bold: true, charSpacing: 1, color: C.faint, valign: 'middle',
    });
    slide.addText(r.structure, {
      x: x + 0.28, y: b.y + 2.06, w: colW - 0.56, h: 0.86,
      fontFace: F.sans, fontSize: 11.5, bold: true, color: C.ink, valign: 'top', lineSpacingMultiple: 1.14,
    });
  });

  slide.addText('Agregarle componentes a un prompt de riesgo bajo lo empeora.', {
    x: G.left, y: b.bottom - 0.50, w: G.width, h: 0.40,
    fontFace: F.sans, fontSize: 15, bold: true, color: C.crimson, valign: 'middle',
  });
}

// ─── 13 · Prompt 0 y las seis decisiones delegadas ───────────────────────────

function prompt0(slide, s) {
  const b = chrome(slide, s);

  slide.addShape('rect', {
    x: G.left, y: b.y, w: G.width, h: 0.94, fill: { color: C.ink }, line: { type: 'none' },
  });
  slide.addText('EL PROMPT MÁS HONESTO DEL MUNDO, PORQUE ES EL QUE TODOS ESCRIBIMOS', {
    x: G.left + 0.32, y: b.y + 0.12, w: G.width - 0.64, h: 0.24,
    fontFace: F.mono, fontSize: 8.5, bold: true, charSpacing: 1, color: '94A3B8', valign: 'middle',
  });
  slide.addText(`«${PROMPT_DIAGNOSTICO.text}»`, {
    x: G.left + 0.32, y: b.y + 0.36, w: G.width - 0.64, h: 0.46,
    fontFace: F.mono, fontSize: 22, bold: true, color: C.white, valign: 'middle',
  });

  slide.addText('Tres palabras. Seis decisiones que el sistema acaba de tomar por nosotros:', {
    x: G.left, y: b.y + 1.12, w: G.width, h: 0.30,
    fontFace: F.sans, fontSize: 12.5, color: C.ink2, valign: 'middle',
  });

  const gap = 0.18;
  const colW = (G.width - gap * 2) / 3;
  const rowH = 0.94;
  promptLabSteps.forEach((p, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = G.left + col * (colW + gap);
    const y = b.y + 1.54 + row * (rowH + 0.16);
    slide.addShape('rect', {
      x, y, w: colW, h: rowH, fill: { color: C.white }, line: { color: C.line, width: 0.75 },
    });
    slide.addShape('rect', { x, y, w: 0.04, h: rowH, fill: { color: C.crimson }, line: { type: 'none' } });
    slide.addText(p.component.toUpperCase(), {
      x: x + 0.24, y: y + 0.08, w: colW - 0.48, h: 0.26,
      fontFace: F.mono, fontSize: 8.5, bold: true, charSpacing: 1, color: C.crimson, valign: 'middle',
    });
    slide.addText(p.stopsDeciding, {
      x: x + 0.24, y: y + 0.34, w: colW - 0.48, h: 0.50,
      fontFace: F.sans, fontSize: 13, bold: true, color: C.ink, valign: 'middle', lineSpacingMultiple: 1.06,
    });
  });
}

// ─── 14 · Prompt DIAT de referencia ──────────────────────────────────────────

function reference(slide, s) {
  const b = chrome(slide, s);

  const leftW = 4.22;
  slide.addText('LO QUE DECIDÍA LA IA', {
    x: G.left, y: b.y, w: leftW, h: 0.26,
    fontFace: F.mono, fontSize: 8.5, bold: true, charSpacing: 1, color: C.faint, valign: 'middle',
  });
  // Cada pregunta con SU componente. El orden de promptLabSteps es el de la
  // construcción capa por capa, que no es el de estas preguntas.
  const qs = [
    ['¿Para quién es el análisis?', 'Contexto'],
    ['¿Qué significa «analizar»?', 'Tarea'],
    ['¿Puede inventar o usar la web?', 'Fuentes'],
    ['¿Qué hace si falta el dato?', 'Restricciones'],
    ['¿Qué extensión y qué forma?', 'Formato'],
    ['¿Cómo comprobamos la salida?', 'Control'],
  ];
  qs.forEach(([q, component], i) => {
    const y = b.y + 0.34 + i * 0.44;
    slide.addText(q, {
      x: G.left, y, w: leftW, h: 0.40,
      fontFace: F.sans, fontSize: 11.5, color: C.muted, valign: 'middle',
    });
    slide.addText(component, {
      x: G.left + leftW - 1.30, y, w: 1.24, h: 0.40,
      fontFace: F.mono, fontSize: 8.5, bold: true, color: C.crimson,
      align: 'right', valign: 'middle',
    });
    slide.addShape('rect', {
      x: G.left, y: y + 0.40, w: leftW, h: 0.008, fill: { color: C.line }, line: { type: 'none' },
    });
  });

  slide.addText('PROMPT DIAT DE REFERENCIA · NO TIENE ROL, Y ES DELIBERADO', {
    x: G.left + leftW + 0.42, y: b.y, w: G.width - leftW - 0.42, h: 0.26,
    fontFace: F.mono, fontSize: 8.5, bold: true, charSpacing: 1, color: C.crimson, valign: 'middle',
  });
  codeBlock(slide, {
    x: G.left + leftW + 0.42, y: b.y + 0.34, w: G.width - leftW - 0.42, h: 2.64,
    text: PROMPT_DIAT_REFERENCIA.text, size: 9,
  });

  slide.addText(PROMPT_DIAT_REFERENCIA.warning, {
    x: G.left + leftW + 0.42, y: b.y + 3.06, w: G.width - leftW - 0.42, h: 0.52,
    fontFace: F.sans, fontSize: 10, italic: true, color: C.muted, valign: 'top', lineSpacingMultiple: 1.12,
  });

  slide.addText('No copiamos un prompt más bonito. Recuperamos seis decisiones.', {
    x: G.left, y: b.bottom - 0.48, w: G.width, h: 0.38,
    fontFace: F.sans, fontSize: 14.5, bold: true, color: C.crimson, valign: 'middle',
  });
}

// ─── 15 · Metaprompting ──────────────────────────────────────────────────────

const TWO_LINES = [
  'No agregues requisitos que no mejoren el resultado de esta tarea en particular.',
  'Formula como máximo tres preguntas aclaratorias, y solo aquellas cuya respuesta cambiaría efectivamente el resultado.',
];

function metaprompt(slide, s) {
  const b = chrome(slide, s);

  const leftW = 4.22;

  // La regla de orden encabeza la columna de modalidades: no cruza la diapositiva.
  slide.addText('El orden no es negociable: primero usted especifica, después la IA audita.', {
    x: G.left, y: b.y, w: leftW, h: 0.44,
    fontFace: F.sans, fontSize: 11.5, bold: true, color: C.ink,
    valign: 'middle', lineSpacingMultiple: 1.08,
  });

  const top = b.y + 0.52;
  const rowH = 1.10;
  metapromptModes.forEach((m, i) => {
    const y = top + i * (rowH + 0.09);
    const active = m.id === 'auditor';
    slide.addShape('rect', {
      x: G.left, y, w: leftW, h: rowH,
      fill: { color: active ? C.crimsonT : C.white },
      line: { color: active ? C.crimson : C.line, width: active ? 1 : 0.75 },
    });
    slide.addText(m.label.toUpperCase(), {
      x: G.left + 0.24, y: y + 0.10, w: leftW - 0.48, h: 0.28,
      fontFace: F.mono, fontSize: 9.5, bold: true, charSpacing: 1,
      color: active ? C.crimsonD : C.muted, valign: 'middle',
    });
    slide.addText(m.does, {
      x: G.left + 0.24, y: y + 0.34, w: leftW - 0.48, h: 0.38,
      fontFace: F.sans, fontSize: 10, color: C.ink2, valign: 'top', lineSpacingMultiple: 1.06,
    });
    slide.addText(`Riesgo · ${m.risk}`, {
      x: G.left + 0.24, y: y + 0.72, w: leftW - 0.48, h: 0.34,
      fontFace: F.sans, fontSize: 9, italic: true, color: C.muted, valign: 'top', lineSpacingMultiple: 1.04,
    });
  });

  const rx = G.left + leftW + 0.42;
  const rw = G.width - leftW - 0.42;
  slide.addText('METAPROMPT CANÓNICO · SE USA TAL CUAL, NO SE MEJORA', {
    x: rx, y: b.y + 0.06, w: rw, h: 0.26,
    fontFace: F.mono, fontSize: 8.5, bold: true, charSpacing: 1, color: C.crimson, valign: 'middle',
  });
  codeBlock(slide, {
    x: rx, y: top, w: rw, h: 2.88,
    text: METAPROMPT_AUDITORIA.text, size: 8, highlight: TWO_LINES,
  });
  slide.addShape('rect', {
    x: rx, y: top + 3.00, w: rw, h: 0.68, fill: { color: C.crimsonT }, line: { type: 'none' },
  });
  slide.addShape('rect', {
    x: rx, y: top + 3.00, w: 0.045, h: 0.68, fill: { color: C.crimson }, line: { type: 'none' },
  });
  slide.addText('Sin esas dos líneas el sistema devuelve un prompt inflado: optimiza por completitud aparente. Un prompt inflado es el hábito que esta clase quiere destruir.', {
    x: rx + 0.24, y: top + 3.02, w: rw - 0.48, h: 0.64,
    fontFace: F.sans, fontSize: 10, color: C.crimsonD, valign: 'middle', lineSpacingMultiple: 1.10,
  });
}

// ─── 16 · Cinco límites ──────────────────────────────────────────────────────

function limits(slide, s) {
  const b = chrome(slide, s);

  slide.addShape('rect', {
    x: G.left, y: b.y, w: G.width, h: 0.78, fill: { color: C.ink }, line: { type: 'none' },
  });
  slide.addText('REGLA DE ORDEN', {
    x: G.left + 0.30, y: b.y + 0.10, w: 3.0, h: 0.24,
    fontFace: F.mono, fontSize: 8.5, bold: true, charSpacing: 1, color: '94A3B8', valign: 'middle',
  });
  slide.addText('Primero el abogado diseña la especificación; después la IA audita. Al revés produce profesionales que aceptan instrucciones que no comprenden.', {
    x: G.left + 0.30, y: b.y + 0.32, w: G.width - 0.60, h: 0.42,
    fontFace: F.sans, fontSize: 12.5, color: C.white, valign: 'middle',
  });

  const rowH = 0.52;
  metapromptLimits.forEach((l, i) => {
    const y = b.y + 0.98 + i * (rowH + 0.08);
    const last = i === metapromptLimits.length - 1;
    slide.addShape('rect', {
      x: G.left, y, w: G.width, h: rowH,
      fill: { color: last ? C.crimsonT : C.white },
      line: { color: last ? C.crimson : C.line, width: last ? 1 : 0.75 },
    });
    tag(slide, {
      x: G.left, y, w: 0.56, h: rowH,
      text: String(i + 1), bg: last ? C.crimson : C.ink2, color: C.white, size: 12,
    });
    slide.addText(l, {
      x: G.left + 0.80, y, w: G.width - 1.10, h: rowH,
      fontFace: F.sans, fontSize: 12.5, bold: last, color: last ? C.crimsonD : C.ink2, valign: 'middle',
    });
  });

  slide.addText(`Nunca se delegan: ${metapromptGuidance.neverDelegate}`, {
    x: G.left, y: b.bottom - 0.44, w: G.width, h: 0.36,
    fontFace: F.sans, fontSize: 11.5, italic: true, color: C.muted, valign: 'middle',
  });
}

// ─── 17 · Cuatro errores ─────────────────────────────────────────────────────

function errors(slide, s) {
  const b = chrome(slide, s);

  const gap = 0.20;
  const colW = (G.width - gap * 3) / 4;
  errorTypes.forEach((e, i) => {
    const x = G.left + i * (colW + gap);
    const core = !!e.core;
    slide.addShape('rect', {
      x, y: b.y, w: colW, h: 3.44,
      fill: { color: core ? C.crimsonT : C.white },
      line: { color: core ? C.crimson : C.line, width: core ? 1.25 : 0.75 },
    });
    slide.addShape('rect', {
      x, y: b.y, w: colW, h: 0.05, fill: { color: core ? C.crimson : C.ink2 }, line: { type: 'none' },
    });
    slide.addText(`TIPO ${e.n}`, {
      x: x + 0.24, y: b.y + 0.22, w: colW - 0.48, h: 0.26,
      fontFace: F.mono, fontSize: 9, bold: true, charSpacing: 1.1,
      color: core ? C.crimson : C.faint, valign: 'middle',
    });
    slide.addText(e.label, {
      x: x + 0.24, y: b.y + 0.52, w: colW - 0.48, h: 0.62,
      fontFace: F.sans, fontSize: 14, bold: true, color: core ? C.crimsonD : C.ink,
      valign: 'top', lineSpacingMultiple: 1.04,
    });
    slide.addText(e.definition, {
      x: x + 0.24, y: b.y + 1.18, w: colW - 0.48, h: 0.76,
      fontFace: F.sans, fontSize: 10.5, color: C.ink2, valign: 'top', lineSpacingMultiple: 1.12,
    });
    slide.addShape('rect', {
      x: x + 0.24, y: b.y + 2.00, w: colW - 0.48, h: 0.012,
      fill: { color: core ? 'E4B8BB' : C.line }, line: { type: 'none' },
    });
    slide.addText('CÓMO SE DETECTA', {
      x: x + 0.24, y: b.y + 2.10, w: colW - 0.48, h: 0.24,
      fontFace: F.mono, fontSize: 8, bold: true, charSpacing: 0.9, color: C.faint, valign: 'middle',
    });
    slide.addText(e.detect, {
      x: x + 0.24, y: b.y + 2.36, w: colW - 0.48, h: 0.92,
      fontFace: F.sans, fontSize: 10.5, color: C.ink2, valign: 'top', lineSpacingMultiple: 1.12,
    });
  });

  slide.addText('Se separan porque se detectan con operaciones distintas entre sí. El tipo 2 es el núcleo del bloque.', {
    x: G.left, y: b.bottom - 0.46, w: G.width, h: 0.38,
    fontFace: F.sans, fontSize: 12.5, bold: true, color: C.crimson, valign: 'middle',
  });
}

// ─── 19 · Siete señales ──────────────────────────────────────────────────────

function signals(slide, s) {
  const b = chrome(slide, s);

  const rowH = 0.52;
  warningSignals.forEach((w, i) => {
    const y = b.y + i * (rowH + 0.07);
    const last = w.n === 7;
    if (last) {
      slide.addShape('rect', {
        x: G.left - 0.16, y: y - 0.04, w: G.width + 0.32, h: rowH + 0.08,
        fill: { color: C.crimsonT }, line: { type: 'none' },
      });
      slide.addShape('rect', {
        x: G.left - 0.16, y: y - 0.04, w: 0.045, h: rowH + 0.08,
        fill: { color: C.crimson }, line: { type: 'none' },
      });
    }
    slide.addText(String(w.n).padStart(2, '0'), {
      x: G.left, y, w: 0.50, h: rowH,
      fontFace: F.mono, fontSize: 10.5, bold: true,
      color: last ? C.crimson : C.faint, valign: 'middle',
    });
    slide.addText(w.text, {
      x: G.left + 0.56, y, w: 7.6, h: rowH,
      fontFace: F.sans, fontSize: 12.5, bold: last, color: last ? C.crimsonD : C.ink,
      valign: 'middle', lineSpacingMultiple: 1.04,
    });
    slide.addText(w.gloss, {
      x: G.left + 8.30, y, w: G.width - 8.30, h: rowH,
      fontFace: F.sans, fontSize: 10, italic: true,
      color: last ? C.crimsonD : C.muted, valign: 'middle', lineSpacingMultiple: 1.04,
    });
  });
}

// ─── 20 · Tres modos de trabajo ──────────────────────────────────────────────

function modes(slide, s) {
  const b = chrome(slide, s);

  const gap = 0.28;
  const colW = (G.width - gap * 2) / 3;
  workModes.forEach((m, i) => {
    const x = G.left + i * (colW + gap);
    const accent = i === 2 ? C.green : i === 1 ? C.amber : C.muted;
    card(slide, { x, y: b.y, w: colW, h: 3.62, accent });
    slide.addText(m.label.toUpperCase(), {
      x: x + 0.26, y: b.y + 0.22, w: colW - 0.52, h: 0.34,
      fontFace: F.mono, fontSize: 10.5, bold: true, charSpacing: 1, color: accent, valign: 'middle',
    });
    const rows = [
      ['VENTAJA', m.advantage],
      ['RIESGO RESIDUAL', m.residualRisk],
      ['USO ADECUADO', m.use],
    ];
    rows.forEach(([k, v], j) => {
      const y = b.y + 0.66 + j * 0.98;
      slide.addText(k, {
        x: x + 0.26, y, w: colW - 0.52, h: 0.22,
        fontFace: F.mono, fontSize: 8, bold: true, charSpacing: 0.9,
        color: k === 'RIESGO RESIDUAL' ? C.crimson : C.faint, valign: 'middle',
      });
      slide.addText(v, {
        x: x + 0.26, y: y + 0.22, w: colW - 0.52, h: 0.72,
        fontFace: F.sans, fontSize: 10.5, color: C.ink2, valign: 'top', lineSpacingMultiple: 1.14,
      });
    });
  });
}

// ─── 22 · Demostración ───────────────────────────────────────────────────────

const MOVES = [
  ['Corpus visible', 'Una sola fuente en la barra. El corpus está cerrado y a la vista.'],
  ['Consulta estructurada', 'Tres criterios, cada uno con su localizador al lado.'],
  ['Abrir un localizador', 'Diez segundos. Eso es lo que cuesta comprobar una cita.'],
  ['Consulta fuera del corpus', 'Reconoce que no tiene evidencia. «No consta» vale más que una respuesta inventada.'],
  ['Conclusión discutible', '¿Está eso en la sentencia, o es una interpretación que el sistema hace por nosotros?'],
  ['Exención de responsabilidad', 'Lo dice el propio proveedor. Ningún argumento del profesor tiene esa fuerza.'],
];

function demo(slide, s) {
  const b = chrome(slide, s);

  slide.addShape('rect', {
    x: G.left, y: b.y, w: G.width, h: 0.72, fill: { color: C.lineSoft }, line: { type: 'none' },
  });
  slide.addShape('rect', { x: G.left, y: b.y, w: 0.045, h: 0.72, fill: { color: C.ink }, line: { type: 'none' } });
  slide.addText(
    [
      { text: 'Entorno de trabajo fundamentado en fuentes. ', options: { bold: true, color: C.ink } },
      { text: `Es la denominación correcta: ${terminologyBan.correct[1]}. La generación queda restringida al corpus cargado y cada afirmación puede remitirse a un fragmento. No existe ninguna herramienta que elimine el problema.`, options: { color: C.ink2 } },
    ],
    {
      x: G.left + 0.28, y: b.y + 0.06, w: G.width - 0.56, h: 0.60,
      fontFace: F.sans, fontSize: 11.5, valign: 'middle', lineSpacingMultiple: 1.12,
    },
  );

  const gap = 0.18;
  const colW = (G.width - gap * 2) / 3;
  const rowH = 1.52;
  MOVES.forEach(([title, detail], i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = G.left + col * (colW + gap);
    const y = b.y + 0.96 + row * (rowH + 0.18);
    const key = i === 4;
    slide.addShape('rect', {
      x, y, w: colW, h: rowH,
      fill: { color: key ? C.crimsonT : C.white },
      line: { color: key ? C.crimson : C.line, width: key ? 1.25 : 0.75 },
    });
    tag(slide, {
      x: x + 0.20, y: y + 0.20, w: 0.36, h: 0.36,
      text: String(i + 1), bg: key ? C.crimson : C.ink2, color: C.white, size: 11,
    });
    slide.addText(title, {
      x: x + 0.66, y: y + 0.18, w: colW - 0.90, h: 0.40,
      fontFace: F.sans, fontSize: 12.5, bold: true, color: key ? C.crimsonD : C.ink, valign: 'middle',
    });
    slide.addText(detail, {
      x: x + 0.20, y: y + 0.62, w: colW - 0.40, h: 0.70,
      fontFace: F.sans, fontSize: 10, color: key ? C.crimsonD : C.muted,
      valign: 'top', lineSpacingMultiple: 1.10,
    });
    if (key) {
      slide.addText('NO SE SACRIFICA NUNCA', {
        x: x + 0.20, y: y + rowH - 0.32, w: colW - 0.40, h: 0.22,
        fontFace: F.mono, fontSize: 7.5, bold: true, charSpacing: 0.9,
        color: C.crimson, align: 'right', valign: 'middle',
      });
    }
  });
}

// ─── 23 · Advertencia del proveedor ──────────────────────────────────────────

function quote(slide, s) {
  const b = chrome(slide, s);

  slide.addShape('rect', {
    x: G.left, y: b.y + 0.14, w: G.width, h: 2.30, fill: { color: C.ink }, line: { type: 'none' },
  });
  slide.addShape('rect', {
    x: G.left, y: b.y + 0.14, w: 0.06, h: 2.30, fill: { color: C.crimson }, line: { type: 'none' },
  });
  slide.addText(`“${googleWarning.text}”`, {
    x: G.left + 0.56, y: b.y + 0.44, w: G.width - 1.12, h: 1.70,
    fontFace: F.sans, fontSize: 21, color: C.white, valign: 'middle', lineSpacingMultiple: 1.22,
  });

  slide.addText(googleWarning.translation, {
    x: G.left, y: b.y + 2.66, w: G.width, h: 0.76,
    fontFace: F.sans, fontSize: 14, italic: true, color: C.ink2, valign: 'top', lineSpacingMultiple: 1.18,
  });
  slide.addText(googleWarning.comment, {
    x: G.left, y: b.y + 3.46, w: G.width * 0.62, h: 0.34,
    fontFace: F.sans, fontSize: 13, bold: true, color: C.crimson, valign: 'middle',
  });
  slide.addText(googleWarning.source, {
    x: G.left + G.width * 0.62, y: b.y + 3.46, w: G.width * 0.38, h: 0.34,
    fontFace: F.mono, fontSize: 9, color: C.muted, align: 'right', valign: 'middle',
  });
}

// ─── 24 · Confidencialidad y marco normativo ─────────────────────────────────

function law(slide, s) {
  const b = chrome(slide, s);

  slide.addShape('rect', {
    x: G.left, y: b.y, w: G.width, h: 0.82, fill: { color: C.crimsonT }, line: { type: 'none' },
  });
  slide.addShape('rect', { x: G.left, y: b.y, w: 0.045, h: 0.82, fill: { color: C.crimson }, line: { type: 'none' } });
  slide.addText('REGLA DE AULA', {
    x: G.left + 0.28, y: b.y + 0.08, w: 3.0, h: 0.24,
    fontFace: F.mono, fontSize: 8.5, bold: true, charSpacing: 1, color: C.crimson, valign: 'middle',
  });
  slide.addText(confidentialityRule.rule, {
    x: G.left + 0.28, y: b.y + 0.32, w: G.width - 0.56, h: 0.42,
    fontFace: F.sans, fontSize: 12, color: C.crimsonD, valign: 'middle',
  });

  const y0 = b.y + 1.12;
  const colW = (G.width - 0.34) / 2;

  card(slide, { x: G.left, y: y0, w: colW, h: 2.34, accent: C.green });
  slide.addText('VIGENTE EN TRES MESES', {
    x: G.left + 0.28, y: y0 + 0.20, w: colW - 0.56, h: 0.26,
    fontFace: F.mono, fontSize: 8.5, bold: true, charSpacing: 1, color: C.green, valign: 'middle',
  });
  slide.addText(`${confidentialityRule.law.title} · ${confidentialityRule.law.date}`, {
    x: G.left + 0.28, y: y0 + 0.50, w: colW - 0.56, h: 0.44,
    fontFace: F.sans, fontSize: 15, bold: true, color: C.ink, valign: 'middle',
  });
  slide.addText(confidentialityRule.law.detail, {
    x: G.left + 0.28, y: y0 + 0.98, w: colW - 0.56, h: 1.12,
    fontFace: F.sans, fontSize: 11, color: C.ink2, valign: 'top', lineSpacingMultiple: 1.16,
  });

  card(slide, { x: G.left + colW + 0.34, y: y0, w: colW, h: 2.34, accent: C.amber });
  slide.addText('EN TRÁMITE · NO ES LO MISMO QUE VIGENTE', {
    x: G.left + colW + 0.62, y: y0 + 0.20, w: colW - 0.56, h: 0.26,
    fontFace: F.mono, fontSize: 8.5, bold: true, charSpacing: 1, color: C.amber, valign: 'middle',
  });
  slide.addText(confidentialityRule.bill.title, {
    x: G.left + colW + 0.62, y: y0 + 0.50, w: colW - 0.56, h: 0.44,
    fontFace: F.sans, fontSize: 15, bold: true, color: C.ink, valign: 'middle',
  });
  slide.addText(confidentialityRule.bill.detail, {
    x: G.left + colW + 0.62, y: y0 + 0.98, w: colW - 0.56, h: 1.12,
    fontFace: F.sans, fontSize: 11, color: C.ink2, valign: 'top', lineSpacingMultiple: 1.16,
  });

  slide.addText(
    [
      { text: 'ANTES DE SUBIR CUALQUIER COSA:  ', options: { fontFace: F.mono, fontSize: 8.5, bold: true, charSpacing: 1, color: C.faint } },
      { text: confidentialityRule.beforeUploading.join('  ·  '), options: { fontFace: F.sans, fontSize: 11.5, color: C.ink2 } },
    ],
    { x: G.left, y: b.bottom - 0.46, w: G.width, h: 0.38, valign: 'middle' },
  );
}

// ─── 25 · ICJR ───────────────────────────────────────────────────────────────

function icjr(slide, s) {
  const b = chrome(slide, s);

  const gap = 0.20;
  const colW = (G.width - gap * 3) / 4;
  icjrPhases.forEach((p, i) => {
    const x = G.left + i * (colW + gap);
    card(slide, { x, y: b.y, w: colW, h: 3.24, accent: C.crimson });
    slide.addText(p.letter, {
      x: x + 0.22, y: b.y + 0.20, w: 0.78, h: 0.78,
      fontFace: F.sans, fontSize: T.numeral, bold: true, color: C.crimson,
      align: 'center', valign: 'middle',
    });
    slide.addText(p.name, {
      x: x + 1.04, y: b.y + 0.28, w: colW - 1.26, h: 0.36,
      fontFace: F.sans, fontSize: 15, bold: true, color: C.ink, valign: 'middle',
    });
    slide.addText(p.question, {
      x: x + 1.04, y: b.y + 0.62, w: colW - 1.26, h: 0.38,
      fontFace: F.sans, fontSize: 9.5, italic: true, color: C.muted, valign: 'top', lineSpacingMultiple: 1.06,
    });
    slide.addText(p.operation, {
      x: x + 0.22, y: b.y + 1.12, w: colW - 0.44, h: 1.34,
      fontFace: F.sans, fontSize: 9.5, color: C.ink2, valign: 'top', lineSpacingMultiple: 1.10,
    });
    slide.addShape('rect', {
      x: x + 0.22, y: b.y + 2.50, w: colW - 0.44, h: 0.012, fill: { color: C.line }, line: { type: 'none' },
    });
    slide.addText('EVITA', {
      x: x + 0.22, y: b.y + 2.58, w: colW - 0.44, h: 0.20,
      fontFace: F.mono, fontSize: 7.5, bold: true, charSpacing: 0.9, color: C.faint, valign: 'middle',
    });
    slide.addText(p.avoids, {
      x: x + 0.22, y: b.y + 2.78, w: colW - 0.44, h: 0.40,
      fontFace: F.sans, fontSize: 9.5, color: C.crimsonD, valign: 'top', lineSpacingMultiple: 1.08,
    });
  });

  slide.addText('Control es ex ante: pedimos una respuesta más auditable. ICJR es ex post: auditamos lo que recibimos. Ninguno reemplaza al otro.', {
    x: G.left, y: b.bottom - 0.46, w: G.width, h: 0.38,
    fontFace: F.sans, fontSize: 13, bold: true, color: C.crimson, valign: 'middle',
  });
}

// ─── 26 · Cinco estatus ──────────────────────────────────────────────────────

function status(slide, s) {
  const b = chrome(slide, s);

  const rowH = 0.68;
  epistemicStatuses.forEach((e, i) => {
    const y = b.y + i * (rowH + 0.09);
    const key = e.id === 'C' || e.id === 'E';
    slide.addShape('rect', {
      x: G.left, y, w: G.width, h: rowH,
      fill: { color: key ? C.crimsonT : C.white },
      line: { color: key ? C.crimson : C.line, width: key ? 1 : 0.75 },
    });
    tag(slide, {
      x: G.left, y, w: 0.72, h: rowH,
      text: e.id, bg: key ? C.crimson : C.ink2, color: C.white, size: 20,
    });
    slide.addText(e.label, {
      x: G.left + 0.96, y, w: 2.90, h: rowH,
      fontFace: F.sans, fontSize: 13, bold: true, color: key ? C.crimsonD : C.ink, valign: 'middle',
    });
    slide.addText(e.meaning, {
      x: G.left + 3.94, y, w: 3.90, h: rowH,
      fontFace: F.sans, fontSize: 10.5, color: C.ink2, valign: 'middle', lineSpacingMultiple: 1.08,
    });
    slide.addText(e.howToCheck, {
      x: G.left + 7.98, y, w: G.width - 8.20, h: rowH,
      fontFace: F.sans, fontSize: 10.5, color: key ? C.crimsonD : C.muted,
      valign: 'middle', lineSpacingMultiple: 1.08,
    });
  });

  slide.addText('El estatus dice qué clase de afirmación es, antes de contrastar. No es el estado ni la acción: son tres dimensiones distintas y no intercambiables.', {
    x: G.left, y: b.bottom - 0.44, w: G.width, h: 0.36,
    fontFace: F.sans, fontSize: 11.5, italic: true, color: C.muted, valign: 'middle',
  });
}

// ─── 27 · Matriz ICJR ────────────────────────────────────────────────────────

function matrix(slide, s) {
  const b = chrome(slide, s);

  // Cuatro columnas, una por operación del protocolo. La clasificación
  // epistémica A–E se explicó en la diapositiva anterior y se queda ahí: la
  // plataforma no la pide, para que el ejercicio sea el procedimiento y no la
  // memorización de cinco códigos.
  const cols = [
    { label: 'I · AFIRMACIÓN', w: 4.60 },
    { label: 'C · FUENTE CONTRASTADA', w: 2.90 },
    { label: 'J · LOCALIZADOR', w: 2.35 },
    { label: 'R · QUÉ HACES CON ELLA', w: 1.92 },
  ];

  let x = G.left;
  cols.forEach((c) => {
    slide.addText(c.label, {
      x, y: b.y, w: c.w - 0.14, h: 0.32,
      fontFace: F.mono, fontSize: 8.5, bold: true, charSpacing: 0.8, color: C.muted, valign: 'middle',
    });
    x += c.w;
  });
  slide.addShape('rect', {
    x: G.left, y: b.y + 0.34, w: G.width, h: 0.02, fill: { color: C.ink }, line: { type: 'none' },
  });

  const stateDef = claimStates.find((c) => c.id === solvedRow.state);
  const rowY = b.y + 0.44;
  const rowH = 1.00;
  slide.addShape('rect', {
    x: G.left - 0.16, y: rowY, w: G.width + 0.32, h: rowH,
    fill: { color: C.crimsonT }, line: { type: 'none' },
  });
  slide.addShape('rect', {
    x: G.left - 0.16, y: rowY, w: 0.045, h: rowH, fill: { color: C.crimson }, line: { type: 'none' },
  });

  const cells = [
    { text: `«${solvedRow.claim}»`, size: 11.5, bold: false, face: F.sans },
    { text: solvedRow.source, size: 10.5, bold: false, face: F.sans },
    { text: solvedRow.locator, size: 10.5, bold: true, face: F.mono },
    { text: `${stateDef.label} → ${stateDef.action}`, size: 11, bold: true, face: F.sans, color: C.green },
  ];
  x = G.left;
  cells.forEach((cell, i) => {
    slide.addText(cell.text, {
      x, y: rowY, w: cols[i].w - 0.16, h: rowH,
      fontFace: cell.face, fontSize: cell.size, bold: cell.bold,
      color: cell.color ?? C.ink2, valign: 'middle', lineSpacingMultiple: 1.08,
    });
    x += cols[i].w;
  });

  // Filas en blanco: una obligatoria y una opcional. Una fila honesta produce
  // más aprendizaje que dos a medias, y así lo pide la plataforma.
  const BLANKS = [
    { label: 'Tu afirmación', note: 'obligatoria' },
    { label: 'Una segunda, si te alcanza el tiempo', note: 'opcional' },
  ];
  BLANKS.forEach((blank, r) => {
    const y = rowY + rowH + 0.12 + r * 0.86;
    slide.addShape('rect', {
      x: G.left, y, w: G.width, h: 0.78,
      fill: { color: C.white },
      line: { color: C.line, width: 0.75, dashType: r === 1 ? 'dash' : 'solid' },
    });
    slide.addText(blank.label, {
      x: G.left + 0.20, y, w: cols[0].w - 0.40, h: 0.78,
      fontFace: F.sans, fontSize: 11, italic: true, color: C.faint, valign: 'middle',
    });
    slide.addText(blank.note, {
      x: G.left + G.width - 1.30, y, w: 1.10, h: 0.78,
      fontFace: F.mono, fontSize: 8, charSpacing: 0.8, color: C.faint, valign: 'middle', align: 'right',
    });
  });

  slide.addShape('rect', {
    x: G.left, y: b.bottom - 0.56, w: G.width, h: 0.48,
    fill: { color: C.lineSoft }, line: { type: 'none' },
  });
  slide.addShape('rect', {
    x: G.left, y: b.bottom - 0.56, w: 0.045, h: 0.48, fill: { color: C.ink }, line: { type: 'none' },
  });
  slide.addText(notVerifiedRule, {
    x: G.left + 0.26, y: b.bottom - 0.56, w: G.width - 0.52, h: 0.48,
    fontFace: F.sans, fontSize: 11, bold: true, color: C.ink, valign: 'middle',
  });
}

// ─── 28 · Integración ────────────────────────────────────────────────────────

function integration(slide, s) {
  const b = chrome(slide, s);

  const steps = class1Meta.flow;
  const gap = 0.14;
  const colW = (G.width - gap * (steps.length - 1)) / steps.length;
  steps.forEach((step, i) => {
    const last = i === steps.length - 1;
    const x = G.left + i * (colW + gap);
    slide.addShape('rect', {
      x, y: b.y, w: colW, h: 1.34,
      fill: { color: last ? C.crimson : C.white },
      line: { color: last ? C.crimson : C.line, width: last ? 1.25 : 0.75 },
    });
    slide.addText(step, {
      x: x + 0.08, y: b.y, w: colW - 0.16, h: 1.34,
      fontFace: F.sans, fontSize: step.length > 14 ? 11.5 : 13,
      bold: true, color: last ? C.white : C.ink,
      align: 'center', valign: 'middle', lineSpacingMultiple: 1.02,
    });
  });

  slide.addShape('rect', {
    x: G.left, y: b.y + 1.62, w: G.width, h: 0.92, fill: { color: C.ink }, line: { type: 'none' },
  });
  slide.addText(class1Meta.idea, {
    x: G.left + 0.30, y: b.y + 1.62, w: G.width - 0.60, h: 0.92,
    fontFace: F.mono, fontSize: 14, bold: true, charSpacing: 0.5, color: C.white,
    align: 'center', valign: 'middle',
  });

  slide.addText('LA RESPUESTA INTEGRADA', {
    x: G.left, y: b.y + 2.94, w: G.width, h: 0.26,
    fontFace: F.mono, fontSize: 8.5, bold: true, charSpacing: 1, color: C.faint, valign: 'middle',
  });
  slide.addText('Las cuatro primeras se distribuyen. La quinta no: la responsabilidad profesional sobre lo que se firma no se delega al modelo.', {
    x: G.left, y: b.y + 3.24, w: G.width, h: 0.76,
    fontFace: F.sans, fontSize: 17, bold: true, color: C.crimson, valign: 'top', lineSpacingMultiple: 1.16,
  });
}

// ─── 29 · Tres reglas ────────────────────────────────────────────────────────

function rules(slide, s) {
  const b = chrome(slide, s);

  const rowH = 0.86;
  class1Meta.rules.forEach((r, i) => {
    const y = b.y + i * (rowH + 0.14);
    slide.addShape('rect', {
      x: G.left, y, w: G.width, h: rowH, fill: { color: C.white }, line: { color: C.line, width: 0.75 },
    });
    slide.addShape('rect', { x: G.left, y, w: 0.05, h: rowH, fill: { color: C.crimson }, line: { type: 'none' } });
    slide.addText(String(i + 1), {
      x: G.left + 0.28, y, w: 0.52, h: rowH,
      fontFace: F.sans, fontSize: 26, bold: true, color: 'E4B8BB',
      align: 'center', valign: 'middle',
    });
    slide.addText(r, {
      x: G.left + 0.94, y, w: G.width - 1.24, h: rowH,
      fontFace: F.sans, fontSize: 16, color: C.ink, valign: 'middle', lineSpacingMultiple: 1.06,
    });
  });

  const y0 = b.y + 3 * (rowH + 0.14) + 0.10;
  slide.addShape('rect', {
    x: G.left, y: y0, w: G.width, h: 0.82, fill: { color: C.lineSoft }, line: { type: 'none' },
  });
  slide.addShape('rect', { x: G.left, y: y0, w: 0.045, h: 0.82, fill: { color: C.blue }, line: { type: 'none' } });
  slide.addText('CIERRE · TU ENTREGA DE LA CLASE 1', {
    x: G.left + 0.28, y: y0 + 0.08, w: G.width - 0.56, h: 0.24,
    fontFace: F.mono, fontSize: 8.5, bold: true, charSpacing: 1, color: C.blue, valign: 'middle',
  });
  slide.addText('«Antes de esta clase pensaba que el problema era ______; ahora agregaría ______.»  ·  Descarga y envía tu Clase 1 desde la misma pantalla.', {
    x: G.left + 0.28, y: y0 + 0.30, w: G.width - 0.56, h: 0.44,
    fontFace: F.sans, fontSize: 12.5, color: C.ink, valign: 'middle',
  });
}

// ─── 30 · Cierre ─────────────────────────────────────────────────────────────

function closing(slide, s) {
  chrome(slide, s, { bare: true });
  const sf = surface(s);

  slide.addShape('rect', {
    x: 0, y: 0, w: G.rail, h: H, fill: { color: C.crimson }, line: { type: 'none' },
  });

  slide.addText(finalStatement, {
    x: 1.10, y: 2.36, w: W - 2.20, h: 1.32,
    fontFace: F.sans, fontSize: 42, bold: true, color: C.white,
    align: 'center', valign: 'middle', charSpacing: 0.6,
  });
  slide.addShape('rect', {
    x: (W - 1.9) / 2, y: 3.82, w: 1.9, h: 0.035, fill: { color: C.crimson }, line: { type: 'none' },
  });
  slide.addText(finalSubtitle, {
    x: 2.40, y: 4.10, w: W - 4.80, h: 0.72,
    fontFace: F.sans, fontSize: 15, color: 'CBD5E1',
    align: 'center', valign: 'top', lineSpacingMultiple: 1.20,
  });

  if (ASSETS.crestWhite) {
    slide.addImage({ data: ASSETS.crestWhite, x: (W - 1.42) / 2, y: 5.16, w: 1.42, h: 0.99 });
  }
  slide.addText('PROGRAMA DIAT · ESCUELA DE DERECHO · PONTIFICIA UNIVERSIDAD CATÓLICA DE VALPARAÍSO', {
    x: 1.10, y: 6.40, w: W - 2.20, h: 0.26,
    fontFace: F.mono, fontSize: 8.5, bold: true, charSpacing: 1.1, color: '6B7A8D',
    align: 'center', valign: 'middle',
  });
}

// ─── Registro ────────────────────────────────────────────────────────────────

export const LAYOUTS = {
  cover,
  citation,
  question,
  courts,
  flow,
  capabilities: capabilitiesLayout,
  product,
  anchor,
  myths: mythsLayout,
  diat,
  questions,
  risk,
  prompt0,
  reference,
  metaprompt,
  limits,
  errors,
  signals,
  modes,
  demo,
  quote,
  law,
  icjr,
  status,
  matrix,
  integration,
  rules,
  closing,
};
