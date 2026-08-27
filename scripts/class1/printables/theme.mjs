// ─────────────────────────────────────────────────────────────────────────────
// IMPRIMIBLES DE CLASE 1 · SISTEMA VISUAL COMPARTIDO
//
// Dos piezas hermanas que se imprimen en A4 y se rellenan a mano:
//   · Ruta analógica  → hacer
//   · Ficha           → recordar
//
// Reglas que gobiernan todo lo de aquí abajo:
//   1. Legible en blanco y negro. El color añade jerarquía; nunca la sustituye.
//      Ningún dato se comunica solo por color.
//   2. Si una tinta cae sobre una zona de escritura, la zona deja de servir.
//      Los campos manuscritos son blancos, siempre.
//   3. El papel no tiene hover ni scroll. Lo que no cabe, no entra.
// ─────────────────────────────────────────────────────────────────────────────

/** Paleta institucional. No se amplía sin pasar por la identidad del programa. */
export const COLORS = {
  ink: '#1A202C',
  crimson: '#8C1D24',
  gray: '#5A6270',
  grayLight: '#9AA1AC',
  rule: '#C8CCD3',
  ruleSoft: '#E2E5E9',
  wash: '#F4F5F7',
  white: '#FFFFFF',
};

/**
 * Milímetros. La página A4 mide 210 × 297; con 11 mm de margen quedan 188 mm
 * de ancho útil, que es lo que toda impresora doméstica imprime sin recortar.
 */
export const PAGE = { w: 210, h: 297, margin: 11, get inner() { return this.w - this.margin * 2; } };

export const baseCSS = `
  @page { size: A4 portrait; margin: ${PAGE.margin}mm; }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  body {
    width: ${PAGE.inner}mm;
    font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    font-size: 8.4pt;
    line-height: 1.32;
    color: ${COLORS.ink};
    background: ${COLORS.white};
    -webkit-font-smoothing: antialiased;
  }

  .page {
    width: ${PAGE.inner}mm;
    height: ${PAGE.h - PAGE.margin * 2}mm;
    display: flex;
    flex-direction: column;
    overflow: hidden;           /* garantiza 2 páginas exactas: nada desborda */
    position: relative;
  }
  .page + .page { page-break-before: always; }

  /* ─── Tipografía de servicio ─────────────────────────────────────────────
     La mono etiqueta; nunca redacta. Marca códigos, números y rótulos. */
  .mono {
    font-family: Consolas, "SF Mono", "Courier New", monospace;
    letter-spacing: .06em;
  }
  .kicker {
    font-family: Consolas, "SF Mono", "Courier New", monospace;
    font-size: 6pt;
    font-weight: 700;
    letter-spacing: .16em;
    text-transform: uppercase;
    color: ${COLORS.crimson};
  }
  .kicker-muted { color: ${COLORS.gray}; }

  h1, h2, h3 { font-weight: 700; letter-spacing: -.01em; }

  /* ─── Cabecera de sección ────────────────────────────────────────────────
     Un número en cuadro carmesí + título. Se lee igual en gris. */
  .sec { display: flex; align-items: baseline; gap: 2.2mm; margin-bottom: 1.4mm; }
  .sec-n {
    font-family: Consolas, "SF Mono", "Courier New", monospace;
    font-size: 6.6pt; font-weight: 700; color: ${COLORS.white};
    background: ${COLORS.crimson};
    padding: .5mm 1.4mm; border-radius: .6mm;
    flex: none;
  }
  .sec-t { font-size: 9.6pt; font-weight: 700; line-height: 1.1; }
  .sec-h { font-size: 7pt; color: ${COLORS.gray}; font-weight: 400; line-height: 1.2; }

  /* ─── Superficies ────────────────────────────────────────────────────────
     .card lleva contenido impreso. .field lleva escritura a mano y por eso
     nunca se tinta el fondo. */
  .card {
    border: .35mm solid ${COLORS.rule};
    border-radius: 1mm;
    background: ${COLORS.wash};
    padding: 2mm 2.4mm;
  }
  .card-ink { background: ${COLORS.ink}; color: ${COLORS.white}; border-color: ${COLORS.ink}; }
  .card-crimson { background: ${COLORS.crimson}; color: ${COLORS.white}; border-color: ${COLORS.crimson}; }
  .field {
    border: .35mm solid ${COLORS.rule};
    border-radius: 1mm;
    background: ${COLORS.white};
  }

  /* ─── Zonas de escritura ─────────────────────────────────────────────────
     Renglones con interlínea real de escritura a mano: 6,2 mm. Menos que eso
     y el estudiante escribe encima de la línea siguiente. */
  /* Los renglones reparten la altura disponible en lugar de amontonarse arriba:
     una caja de escritura medio vacía es papel desperdiciado. */
  .lines { display: flex; flex-direction: column; height: 100%; }
  .line { border-bottom: .25mm dotted ${COLORS.rule}; flex: 1; min-height: 6.2mm; }

  /* Caja de escritura libre, sin renglones. */
  .writebox { background: ${COLORS.white}; border: .35mm solid ${COLORS.rule}; border-radius: 1mm; }

  /* ─── Casillas ───────────────────────────────────────────────────────────
     3,4 mm es el mínimo que un lápiz pasta marca sin salirse. */
  .cb {
    display: inline-block; width: 3.4mm; height: 3.4mm;
    border: .35mm solid ${COLORS.gray}; border-radius: .5mm;
    background: ${COLORS.white};
    flex: none; margin-right: 1.4mm;
    vertical-align: -.6mm;
  }
  .check { display: flex; align-items: flex-start; gap: 0; line-height: 1.25; }
  /* Solo el texto crece. Si la casilla creciera dejaría de parecer una casilla. */
  .check > .cb + span { flex: 1; }

  /* ─── Medidor de ambigüedad ──────────────────────────────────────────────
     Herramienta metacognitiva: el estudiante rodea un nodo antes y después.
     No puntúa, no califica: hace visible un desplazamiento. */
  .meter { display: flex; align-items: center; gap: 1.6mm; }
  .meter-nodes { display: flex; align-items: center; gap: 0; flex: 1; }
  .meter-dot {
    width: 3.6mm; height: 3.6mm; border-radius: 50%;
    border: .35mm solid ${COLORS.gray}; background: ${COLORS.white}; flex: none;
  }
  .meter-seg { height: .25mm; background: ${COLORS.rule}; flex: 1; }
  .meter-label { font-size: 5.8pt; font-weight: 700; letter-spacing: .1em; color: ${COLORS.gray}; white-space: nowrap; }

  /* ─── Cintas de proceso ──────────────────────────────────────────────────
     Una fila de estaciones unidas por flechas. Sirve para ICJR y para el flujo. */
  .flow { display: flex; align-items: stretch; gap: 0; }
  .flow-step { flex: 1; text-align: center; }
  .flow-arrow {
    flex: none; align-self: center; padding: 0 1mm;
    color: ${COLORS.grayLight}; font-size: 8pt; line-height: 1;
  }

  /* ─── Tablas ─────────────────────────────────────────────────────────────
     Cabecera en tinta, celdas en blanco: se escribe dentro. */
  table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  th {
    background: ${COLORS.ink}; color: ${COLORS.white};
    font-family: Consolas, "SF Mono", "Courier New", monospace;
    font-size: 5.8pt; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
    padding: 1.1mm .8mm; text-align: left; border: .25mm solid ${COLORS.ink};
    line-height: 1.15;
  }
  td { border: .25mm solid ${COLORS.rule}; background: ${COLORS.white}; vertical-align: top; padding: 1mm .8mm; }

  /* ─── Cabecera y pie de página ───────────────────────────────────────────*/
  .masthead { display: flex; align-items: center; gap: 3mm; border-bottom: .5mm solid ${COLORS.ink}; padding-bottom: 2mm; }
  .masthead-logo { height: 13mm; width: auto; flex: none; }
  .masthead-main { flex: 1; min-width: 0; }
  .masthead-side { text-align: right; flex: none; }

  .footer {
    margin-top: auto; padding-top: 1.6mm;
    border-top: .25mm solid ${COLORS.rule};
    display: flex; justify-content: space-between; align-items: flex-end; gap: 3mm;
    font-size: 5.8pt; color: ${COLORS.gray}; line-height: 1.25;
  }

  /* Cuerpo de página que reparte el aire sobrante entre las secciones en vez
     de acumularlo al final. Una ficha con un tercio de página en blanco abajo
     no está "aireada": está mal compuesta. */
  .body { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }

  /* ─── Utilidades ─────────────────────────────────────────────────────────*/
  .row { display: flex; gap: 2.6mm; }
  .col { flex: 1; min-width: 0; }
  .muted { color: ${COLORS.gray}; }
  .tiny { font-size: 6pt; line-height: 1.25; }
  .small { font-size: 7pt; line-height: 1.28; }
  .b { font-weight: 700; }
  .up { text-transform: uppercase; letter-spacing: .1em; }
  .crimson { color: ${COLORS.crimson}; }
  .center { text-align: center; }
  .nowrap { white-space: nowrap; }
`;

/** Cinco nodos entre dos extremos rotulados. El estudiante rodea uno. */
export function meter(left, right) {
  const nodes = Array.from({ length: 5 })
    .map((_, i) => `${i ? '<div class="meter-seg"></div>' : ''}<div class="meter-dot"></div>`)
    .join('');
  return `<div class="meter">
    <span class="meter-label">${left}</span>
    <div class="meter-nodes">${nodes}</div>
    <span class="meter-label">${right}</span>
  </div>`;
}

/** `n` renglones de escritura a mano. */
export function lines(n) {
  return `<div class="lines">${'<div class="line"></div>'.repeat(n)}</div>`;
}

/** Casilla + texto. */
export function check(text, extraClass = '') {
  return `<div class="check ${extraClass}"><span class="cb"></span><span>${text}</span></div>`;
}
