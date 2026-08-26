// ─────────────────────────────────────────────────────────────────────────────
// CLASE 1 · DECK · cromo común
//
// Todo lo que se repite en las 30 diapositivas: filete de estado, antetítulo,
// título, filete de acento, franja de plataforma y pie. Ninguna diapositiva
// dibuja su propio cromo.
// ─────────────────────────────────────────────────────────────────────────────

import { C, F, G, H, W, SURFACE, STATE_COLOR, T } from './theme.mjs';
import { STATE_LABEL, platformCall, platformRoute, blockOf } from '../../src/content/class1/deck.ts';
import { blockClock } from '../../src/content/class1/manifest.ts';

/** Superficie de la diapositiva. */
export function surface(s) {
  return SURFACE[s.surface];
}

/** Ancho útil del cuerpo y su borde inferior según haya o no franja. */
export function bodyBox(s) {
  const bottom = s.opens ? G.bodyBottom : G.bodyBottomNoCall;
  return { x: G.left, y: G.bodyY, w: G.width, h: bottom - G.bodyY, bottom };
}

/**
 * Dibuja fondo, filete de estado, antetítulo, título, filete de acento,
 * franja de plataforma y pie. Devuelve la caja disponible para el cuerpo.
 */
export function chrome(slide, s, opts = {}) {
  const sf = surface(s);
  slide.background = { color: sf.bg };

  // Filete de estado: quién tiene la palabra ahora mismo.
  slide.addShape('rect', {
    x: 0, y: 0, w: G.rail, h: H,
    fill: { color: STATE_COLOR[s.state] },
    line: { type: 'none' },
  });

  if (opts.bare) return bodyBox(s);

  const b = blockOf(s);

  // Antetítulo.
  slide.addText(s.kicker.toUpperCase(), {
    x: G.left, y: G.kickerY, w: G.width, h: 0.26,
    fontFace: F.mono, fontSize: T.kicker, bold: true, charSpacing: 1.4,
    color: sf.dark ? sf.meta : C.crimson, valign: 'middle',
  });

  // Título. Las anclas lo omiten aquí: lo proyectan a pantalla completa.
  if (!opts.noTitle) {
    const long = s.title.length > 46;
    slide.addText(s.title, {
      x: G.left, y: G.titleY, w: G.width, h: 0.86,
      fontFace: F.sans, fontSize: opts.titleSize ?? (long ? T.titleLong : T.title),
      bold: true, color: sf.fg, valign: 'middle', lineSpacingMultiple: 0.98,
    });
    slide.addShape('rect', {
      x: G.left, y: G.ruleY, w: 1.9, h: 0.035,
      fill: { color: sf.dark ? sf.meta : C.crimson }, line: { type: 'none' },
    });
  }

  platformBand(slide, s, sf);
  footer(slide, s, sf, b);

  return bodyBox(s);
}

/** Franja discreta de plataforma. Mismo tratamiento en las nueve diapositivas. */
function platformBand(slide, s, sf) {
  const call = platformCall(s);
  if (!call) return;
  const route = platformRoute(s);

  slide.addShape('rect', {
    x: G.left, y: G.callY, w: G.width, h: G.callH,
    fill: { color: sf.dark ? '1F2937' : C.lineSoft }, line: { type: 'none' },
  });
  slide.addShape('rect', {
    x: G.left, y: G.callY, w: 0.045, h: G.callH,
    fill: { color: C.blue }, line: { type: 'none' },
  });
  slide.addText(call, {
    x: G.left + 0.22, y: G.callY, w: G.width * 0.62, h: G.callH,
    fontFace: F.mono, fontSize: T.micro + 0.5, bold: true, charSpacing: 0.8,
    color: sf.dark ? '93C5FD' : C.blue, valign: 'middle',
  });
  if (route) {
    slide.addText(`taller-diat.vercel.app${route}`, {
      x: G.left + G.width * 0.6, y: G.callY, w: G.width * 0.4 - 0.2, h: G.callH,
      fontFace: F.mono, fontSize: T.micro - 0.5, color: sf.meta,
      align: 'right', valign: 'middle',
    });
  }
}

/** Pie: bloque y hora · estado de clase · numeración. */
function footer(slide, s, sf, b) {
  slide.addShape('rect', {
    x: G.left, y: G.footY - 0.14, w: G.width, h: 0.012,
    fill: { color: sf.rule }, line: { type: 'none' },
  });
  slide.addText(`${b.code} · ${blockClock(b)}`, {
    x: G.left, y: G.footY, w: 4.2, h: G.footH,
    fontFace: F.mono, fontSize: T.foot, color: sf.meta, valign: 'middle',
  });
  slide.addText(STATE_LABEL[s.state], {
    x: G.left + 4.3, y: G.footY, w: 4.0, h: G.footH,
    fontFace: F.mono, fontSize: T.foot, bold: true, charSpacing: 1.1,
    color: STATE_COLOR[s.state], align: 'center', valign: 'middle',
  });
  slide.addText(`${String(s.n).padStart(2, '0')} / 30`, {
    x: W - G.right - 3.0, y: G.footY, w: 3.0, h: G.footH,
    fontFace: F.mono, fontSize: T.foot, color: sf.meta,
    align: 'right', valign: 'middle',
  });
}

// ─── Primitivas de composición ───────────────────────────────────────────────

/** Tarjeta con filete superior de acento. */
export function card(slide, { x, y, w, h, accent, fill, border }) {
  slide.addShape('rect', {
    x, y, w, h,
    fill: { color: fill ?? C.white },
    line: border === false ? { type: 'none' } : { color: C.line, width: 0.75 },
  });
  if (accent) {
    slide.addShape('rect', { x, y, w, h: 0.045, fill: { color: accent }, line: { type: 'none' } });
  }
}

/** Etiqueta monoespaciada breve (numeral, letra, código). */
export function tag(slide, { x, y, w, h, text, color, bg, size }) {
  if (bg) {
    slide.addShape('rect', { x, y, w, h, fill: { color: bg }, line: { type: 'none' } });
  }
  slide.addText(text, {
    x, y, w, h,
    fontFace: F.mono, fontSize: size ?? T.micro, bold: true,
    color: color ?? C.white, align: 'center', valign: 'middle',
  });
}

/** Filas de texto a dos niveles: rótulo en negrita, glosa debajo. */
export function stack(slide, { x, y, w, rows, gap = 0.1, rowH = 0.52, sf, labelSize, glossSize }) {
  rows.forEach((r, i) => {
    const yy = y + i * (rowH + gap);
    slide.addText(
      [
        { text: r.label, options: { bold: true, color: r.color ?? sf.fg, fontSize: labelSize ?? T.body } },
        ...(r.gloss ? [{ text: `  ${r.gloss}`, options: { color: sf.meta, fontSize: glossSize ?? T.bodySm } }] : []),
      ],
      { x, y: yy, w, h: rowH, fontFace: F.sans, valign: 'middle', lineSpacingMultiple: 1.05 },
    );
  });
}

/** Párrafo simple. */
export function para(slide, { x, y, w, h, text, color, size, align, bold, face, spacing }) {
  slide.addText(text, {
    x, y, w, h,
    fontFace: face ?? F.sans, fontSize: size ?? T.body, color: color ?? C.ink2,
    bold: bold ?? false, align: align ?? 'left', valign: 'top',
    lineSpacingMultiple: spacing ?? 1.18,
  });
}

/** Bloque de código: prompt canónico. Se reproduce carácter por carácter. */
export function codeBlock(slide, { x, y, w, h, text, size = 10, highlight = [] }) {
  slide.addShape('rect', {
    x, y, w, h, fill: { color: C.white }, line: { color: C.line, width: 0.75 },
  });
  slide.addShape('rect', {
    x, y, w: 0.045, h, fill: { color: C.crimson }, line: { type: 'none' },
  });

  const lines = text.split('\n');
  const runs = [];
  lines.forEach((ln, i) => {
    const hot = highlight.some((h) => ln.includes(h));
    runs.push({
      text: ln.length ? ln : ' ',
      options: {
        fontFace: F.mono, fontSize: size,
        color: hot ? C.crimsonD : C.ink2,
        bold: hot,
        breakLine: i < lines.length - 1,
      },
    });
  });

  slide.addText(runs, {
    x: x + 0.24, y: y + 0.14, w: w - 0.46, h: h - 0.28,
    valign: 'top', lineSpacingMultiple: 1.14,
  });
}
