// ─────────────────────────────────────────────────────────────────────────────
// CLASE 1 · DECK · sistema visual
//
// Evolución del deck de 30 diapositivas existente, no refundación. La paleta,
// los fondos por diapositiva y la retícula se leyeron del archivo original
// («Clase 1 DIAT — Del prompt aislado al razonamiento jurídico asistido.pptx»)
// y se conservan. Lo que cambia es que ahora todo es texto y forma nativos, no
// imágenes rasterizadas.
// ─────────────────────────────────────────────────────────────────────────────

/** Paleta heredada del deck v1. Ningún tono nuevo. */
export const C = {
  ink: '1A202C',      // titulares y fondo de las anclas
  ink2: '2D3748',     // cuerpo
  muted: '718096',    // secundario
  faint: 'A0AEC0',    // pies y metadatos
  line: 'E2E8F0',     // filetes
  lineSoft: 'EDF2F7', // fondos de tarjeta
  paper: 'FAF9F6',    // fondo de contenido
  white: 'FFFFFF',
  crimson: '8C1D24',  // acento DIAT
  crimsonD: '6E1319',
  crimsonT: 'F7EDEE', // tinte de tarjeta
  night: '111827',    // fondo del cierre
  green: '276749',
  blue: '2B6CB0',
  amber: 'B7791F',
  red: 'C53030',
};

/**
 * Tipografías.
 *
 * El deck v1 declara DM Sans / JetBrains Mono / Cinzel. Ninguna de las tres
 * está instalada en la máquina de trabajo ni se puede garantizar en la sala:
 * PowerPoint no hace fallback tipográfico como un navegador, sustituye. Se
 * declaran por defecto tres caras presentes en cualquier Windows con Office,
 * elegidas por proximidad óptica.
 *
 * Para volver exactamente a la tipografía del deck v1 —cuando las tres estén
 * instaladas en la máquina que proyecta— basta con exportar
 * `DIAT_FONTS=original` antes de compilar.
 */
const ORIGINAL = { sans: 'DM Sans', mono: 'JetBrains Mono', display: 'Cinzel' };
const SAFE = { sans: 'Segoe UI', mono: 'Consolas', display: 'Constantia' };

export const F = process.env.DIAT_FONTS === 'original' ? ORIGINAL : SAFE;

/** Lienzo 16:9, idéntico al del deck v1 (12192000 × 6858000 EMU). */
export const W = 13.333;
export const H = 7.5;

/** Retícula. */
export const G = {
  rail: 0.09,        // filete de estado, borde izquierdo
  left: 0.78,
  right: 0.78,
  get width() { return W - this.left - this.right; },
  kickerY: 0.44,
  titleY: 0.76,
  ruleY: 1.70,
  bodyY: 2.02,
  bodyBottom: 6.16,  // hasta aquí llega el cuerpo si hay franja de plataforma
  bodyBottomNoCall: 6.58,
  callY: 6.24,
  callH: 0.40,
  footY: 6.86,
  footH: 0.28,
};

/** Color del filete y del rótulo de estado. */
export const STATE_COLOR = {
  ESCUCHAS: C.crimson,
  TRABAJAS: C.blue,
  OBSERVAS: C.amber,
};

/** Fondo y tinta según la superficie declarada en deck.ts. */
export const SURFACE = {
  PAPEL: { bg: C.paper, fg: C.ink, sub: C.ink2, meta: C.muted, rule: C.line, dark: false },
  TINTA: { bg: C.ink, fg: C.white, sub: 'CBD5E1', meta: '94A3B8', rule: '2D3748', dark: true },
  CARMESI: { bg: C.crimson, fg: C.white, sub: 'F7E4E5', meta: 'E7C3C5', rule: '9B2C2C', dark: true },
  NOCHE: { bg: C.night, fg: C.white, sub: 'CBD5E1', meta: '94A3B8', rule: '2D3748', dark: true },
};

/** Escalones tipográficos, en puntos. */
export const T = {
  kicker: 11,
  title: 27,
  titleLong: 22,
  lead: 15,
  body: 13,
  bodySm: 11.5,
  micro: 10,
  foot: 9.5,
  anchor: 54,
  anchorLong: 40,
  numeral: 34,
};
