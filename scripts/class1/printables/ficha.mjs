// ─────────────────────────────────────────────────────────────────────────────
// FICHA IMPRIMIBLE · CLASE 1 — dos páginas para conservar
//
// La hermana de la Ruta analógica. Aquella sirve para hacer; esta, para
// recordar. Se deja sobre los puestos antes de empezar y se la lleva el
// estudiante: al mirarla en noviembre tiene que poder reconstruir qué se
// enseñó en agosto.
//
//   Página 1 · De pedir a diseñar    → un prompt es un conjunto de decisiones
//   Página 2 · De recibir a comprobar → una respuesta plausible aún no está verificada
//
// Más contenido que la Ruta, pero no es un resumen del Manual: el Manual tiene
// treinta páginas y otra función. Aquí solo entra lo que sostiene la
// arquitectura de la sesión.
// ─────────────────────────────────────────────────────────────────────────────
import { COLORS, baseCSS, lines } from './theme.mjs';

const S = `
  /* Cita gráfica: una frase ancla ocupando el ancho, como en el deck. */
  .anchor {
    background: ${COLORS.ink}; color: ${COLORS.white};
    border-radius: 1.2mm; padding: 3mm 3.4mm;
    display: flex; align-items: center; gap: 3.4mm;
  }
  .anchor-mark {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 26pt; line-height: .7; color: ${COLORS.crimson}; flex: none;
  }
  .anchor-text { font-size: 12.5pt; font-weight: 700; letter-spacing: -.01em; line-height: 1.14; }
  .anchor-sub { font-size: 6.4pt; color: ${COLORS.grayLight}; margin-top: 1mm; line-height: 1.3; }

  /* Ecuación canónica de la sesión. */
  .equation {
    border: .4mm solid ${COLORS.crimson}; border-radius: 1.2mm;
    padding: 2.2mm 2.6mm; text-align: center;
  }
  .equation-t {
    font-family: Consolas, "SF Mono", "Courier New", monospace;
    font-size: 8pt; font-weight: 700; letter-spacing: .02em;
    color: ${COLORS.crimson}; line-height: 1.3;
  }

  /* Tránsito intención → decisiones → instrucción → resultado. */
  .transit { display: flex; align-items: stretch; }
  .transit-step { flex: 1; text-align: center; padding: 0 .6mm; }
  .transit-dot {
    width: 4.4mm; height: 4.4mm; border-radius: 50%;
    border: .4mm solid ${COLORS.crimson}; background: ${COLORS.white};
    margin: 0 auto 1.1mm; position: relative;
  }
  .transit-dot.fill { background: ${COLORS.crimson}; }
  .transit-name { font-size: 6.6pt; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; line-height: 1.1; }
  .transit-note { font-size: 5.6pt; color: ${COLORS.gray}; line-height: 1.2; margin-top: .5mm; }
  .transit-rail { position: relative; height: .35mm; background: ${COLORS.crimson}; margin: 2.2mm 0 -2.85mm; }

  /* Siete componentes en formato editorial: nombre, pregunta, una línea. */
  .comps { display: grid; grid-template-columns: 1fr 1fr; gap: 1.6mm 2.6mm; }
  .cmp {
    border-left: .7mm solid ${COLORS.rule};
    padding: .4mm 0 .4mm 2mm;
  }
  .cmp.sig { border-left-color: ${COLORS.crimson}; }
  .cmp-top { display: flex; align-items: baseline; gap: 1.3mm; }
  .cmp-n {
    font-family: Consolas, "SF Mono", "Courier New", monospace;
    font-size: 5.8pt; font-weight: 700; color: ${COLORS.grayLight}; flex: none;
  }
  .cmp-name { font-size: 8pt; font-weight: 700; letter-spacing: .02em; }
  .cmp-tag {
    font-family: Consolas, "SF Mono", "Courier New", monospace;
    font-size: 4.8pt; font-weight: 700; letter-spacing: .06em; color: ${COLORS.crimson};
    border: .2mm solid ${COLORS.crimson}; border-radius: .5mm; padding: 0 .7mm; margin-left: auto; flex: none;
  }
  .cmp-q { font-size: 6.4pt; font-weight: 600; color: ${COLORS.crimson}; line-height: 1.2; margin-top: .3mm; }
  .cmp-d { font-size: 6.1pt; color: ${COLORS.gray}; line-height: 1.22; margin-top: .3mm; }

  /* Estaciones ICJR: pieza central de la página 2. */
  .stations { display: flex; align-items: stretch; }
  .station { flex: 1; }
  .station-box {
    border: .35mm solid ${COLORS.rule}; border-top: 1mm solid ${COLORS.crimson};
    border-radius: 0 0 1mm 1mm; padding: 1.6mm 1.4mm; height: 100%;
    background: ${COLORS.white};
  }
  .station-l {
    font-family: Consolas, "SF Mono", "Courier New", monospace;
    font-size: 13pt; font-weight: 700; color: ${COLORS.crimson}; line-height: 1;
  }
  .station-n { font-size: 7.4pt; font-weight: 700; margin-top: .5mm; }
  .station-q { font-size: 5.9pt; color: ${COLORS.gray}; line-height: 1.2; margin-top: .6mm; }
  .station-e { font-size: 5.7pt; color: ${COLORS.ink}; line-height: 1.2; margin-top: .8mm; padding-top: .8mm; border-top: .2mm dotted ${COLORS.rule}; }
  .station-gap { flex: none; width: 2.2mm; align-self: center; text-align: center; color: ${COLORS.grayLight}; font-size: 7pt; }

  /* Estatus A–E en fila editorial. */
  .st { display: flex; gap: 1.6mm; }
  .st-i { flex: 1; border: .35mm solid ${COLORS.rule}; border-radius: 1mm; padding: 1.3mm 1.4mm; }
  .st-l {
    font-family: Consolas, "SF Mono", "Courier New", monospace;
    font-size: 11pt; font-weight: 700; line-height: 1; color: ${COLORS.crimson};
  }
  .st-n { font-size: 6.5pt; font-weight: 700; margin-top: .6mm; line-height: 1.15; }
  .st-m { font-size: 5.6pt; color: ${COLORS.gray}; line-height: 1.2; margin-top: .5mm; }

  /* Tipos de error y señales. */
  .err { display: flex; gap: 1.5mm; align-items: baseline; margin-bottom: .8mm; }
  .err-n {
    font-family: Consolas, "SF Mono", "Courier New", monospace;
    font-size: 6pt; font-weight: 700; color: ${COLORS.white}; background: ${COLORS.crimson};
    border-radius: .5mm; padding: .2mm 1.1mm; flex: none;
  }
  .err-t { font-size: 6.6pt; line-height: 1.2; }
  .sig-item { display: flex; gap: 1.3mm; align-items: baseline; margin-bottom: .7mm; }
  .sig-n {
    font-family: Consolas, "SF Mono", "Courier New", monospace;
    font-size: 5.6pt; font-weight: 700; color: ${COLORS.crimson}; flex: none;
  }
  .sig-t { font-size: 5.9pt; line-height: 1.2; color: ${COLORS.ink}; }

  /* Mapa operativo de la verificación. */
  .map { display: flex; align-items: center; }
  .map-s {
    flex: 1; text-align: center; font-size: 6.2pt; font-weight: 700;
    border: .3mm solid ${COLORS.rule}; border-radius: 1mm; padding: 1.2mm .5mm;
    background: ${COLORS.white}; line-height: 1.15;
  }
  .map-s.on { background: ${COLORS.crimson}; color: ${COLORS.white}; border-color: ${COLORS.crimson}; }
  .map-a { flex: none; padding: 0 .9mm; color: ${COLORS.grayLight}; font-size: 7pt; }

  /* Tres reglas. */
  .fin { display: flex; gap: 2mm; }
  .fin-i { flex: 1; border-top: .8mm solid ${COLORS.crimson}; padding-top: 1.4mm; }
  .fin-n {
    font-family: Consolas, "SF Mono", "Courier New", monospace;
    font-size: 7pt; font-weight: 700; color: ${COLORS.crimson};
  }
  .fin-t { font-size: 6.8pt; line-height: 1.24; margin-top: .5mm; }

  /* Las siete instrucciones de Control, en dos columnas. */
  .ctrl { column-count: 2; column-gap: 5mm; }
  .ctrl-i { display: flex; gap: 1.4mm; align-items: baseline; margin-bottom: 1mm; break-inside: avoid; }
  .ctrl-n {
    font-family: Consolas, "SF Mono", "Courier New", monospace;
    font-size: 5.6pt; font-weight: 700; color: ${COLORS.crimson}; flex: none;
  }
  .ctrl-t { font-size: 6.4pt; line-height: 1.24; }

  /* Zona personal. Pequeña: la ficha es para recordar, no para trabajar. */
  .personal { display: flex; gap: 2.6mm; }
  .personal-i { flex: 1; }
  .personal-l { font-size: 6.2pt; font-weight: 700; color: ${COLORS.crimson}; }
  /* Sólida, no punteada: es el único renglón de la ficha y tiene que verse a
     la primera, también en una fotocopia. */
  .personal-line { border-bottom: .3mm solid ${COLORS.rule}; height: 6.4mm; }

  /* Cabecera con doble logo. */
  .mast2 { display: flex; align-items: center; gap: 3.4mm; border-bottom: .6mm solid ${COLORS.crimson}; padding-bottom: 2.4mm; }
  .mast2 img.d { height: 15mm; width: auto; flex: none; }
  .mast2 img.e { height: 9mm; width: auto; flex: none; opacity: .95; }
`;

/** Cinco estaciones del flujo canónico, con la última destacada. */
function flowStrip(flow) {
  return `<div class="map">${flow
    .map((f, i) => `${i ? '<div class="map-a">→</div>' : ''}<div class="map-s ${i === flow.length - 1 ? 'on' : ''}">${f}</div>`)
    .join('')}</div>`;
}

function foot(right) {
  return `<div class="footer">
    <div>
      <span class="b">Programa DIAT · Derecho, Inteligencia Artificial y Tecnología</span><br>
      Escuela de Derecho · Pontificia Universidad Católica de Valparaíso<br>
      Taller de IA y Prompting Jurídico · 2026
    </div>
    <div style="text-align:right">${right}</div>
  </div>`;
}

export function fichaHTML({ canon, logoDiat, logoEscuela, qr }) {
  const { diatComponents, icjrPhases, epistemicStatuses, warningSignals,
          errorTypes, riskLevels, meta, notVerifiedRule } = canon;

  // ── Página 1 ──────────────────────────────────────────────────────────────
  const comps = diatComponents
    .map((c, i) => `<div class="cmp ${c.signature ? 'sig' : ''}">
      <div class="cmp-top">
        <span class="cmp-n">${String(i + 1).padStart(2, '0')}</span>
        <span class="cmp-name">${c.label}</span>
        ${c.signature ? '<span class="cmp-tag">APORTE DIAT</span>' : ''}
      </div>
      <div class="cmp-q">${c.question}</div>
      <div class="cmp-d">${c.solves}</div>
    </div>`)
    .join('');

  const transit = [
    { n: 'Intención', d: 'Lo que quiero conseguir.', fill: false },
    { n: 'Decisiones', d: 'Las siete preguntas de diseño.', fill: true },
    { n: 'Instrucción', d: 'Recién ahora se escribe.', fill: true },
    { n: 'Resultado', d: 'Que todavía habrá que comprobar.', fill: false },
  ];

  const page1 = `<section class="page">
    <div class="mast2">
      <img class="d" src="${logoDiat}" alt="Programa DIAT · PUCV">
      <div style="flex:1;min-width:0">
        <div class="kicker">Taller de IA y Prompting Jurídico · Clase 1 · ${meta.date}</div>
        <h1 style="font-size:15pt;line-height:1.06;margin-top:.8mm">Del prompt aislado al<br>razonamiento jurídico asistido</h1>
      </div>
      <div style="text-align:right;flex:none">
        <div class="kicker kicker-muted">Ficha<br>de clase</div>
        <div class="mono" style="font-size:13pt;font-weight:700;color:${COLORS.crimson};line-height:1;margin-top:1mm">1<span style="font-size:7pt;color:${COLORS.grayLight}">/2</span></div>
      </div>
    </div>

    <div class="body">
    <div class="anchor" style="margin-top:3mm">
      <span class="anchor-mark">«</span>
      <div style="flex:1">
        <div class="anchor-text">Un buen prompt reduce decisiones implícitas.</div>
        <div class="anchor-sub">${meta.thesis}</div>
      </div>
    </div>

    <div style="margin-top:3.4mm">
      <div class="sec"><span class="sec-n">1</span><span class="sec-t">Escribir es el último paso</span></div>
      <div class="transit-rail"></div>
      <div class="transit">
        ${transit.map(t => `<div class="transit-step">
          <div class="transit-dot ${t.fill ? 'fill' : ''}"></div>
          <div class="transit-name">${t.n}</div>
          <div class="transit-note">${t.d}</div>
        </div>`).join('')}
      </div>
    </div>

    <div style="margin-top:3.6mm">
      <div class="sec">
        <span class="sec-n">2</span>
        <span class="sec-t">Siete preguntas de diseño</span>
        <span class="sec-h">No siete casillas obligatorias. La tarea decide cuáles son pertinentes.</span>
      </div>
      <div class="comps">${comps}</div>
    </div>

    <div style="margin-top:3.6mm">
      <div class="sec">
        <span class="sec-n">3</span>
        <span class="sec-t">Las siete instrucciones de Control</span>
        <span class="sec-h">Fuentes y Control son el aporte del programa. Control es lo que hace auditable una salida — y una salida no auditable, en trabajo jurídico, no se puede usar.</span>
      </div>
      <div class="ctrl">
        ${canon.controlInstructions.map((t, i) => `<div class="ctrl-i">
          <span class="ctrl-n">${String(i + 1).padStart(2, '0')}</span>
          <span class="ctrl-t">${t}</span>
        </div>`).join('')}
      </div>
    </div>

    <div class="row" style="margin-top:3.6mm;align-items:stretch">
      <div class="col" style="flex:1.25">
        <div class="sec"><span class="sec-n">4</span><span class="sec-t">Proporcionalidad al riesgo</span></div>
        <div class="card" style="padding:1.8mm 2.2mm">
          ${riskLevels.map((r, i) => `<div style="display:flex;gap:1.6mm;align-items:baseline;${i < 2 ? 'margin-bottom:1.1mm' : ''}">
            <span class="mono b" style="font-size:5.8pt;color:${COLORS.white};background:${COLORS.gray};border-radius:.5mm;padding:.2mm 1.1mm;min-width:12mm;text-align:center;flex:none">${r.label.replace('Riesgo ', '').toUpperCase()}</span>
            <span style="font-size:6.3pt;line-height:1.22">${r.structure}</span>
          </div>`).join('')}
          <div class="tiny muted" style="margin-top:1.4mm;padding-top:1.2mm;border-top:.2mm dotted ${COLORS.rule}">
            Añadirle componentes a un prompt de riesgo bajo lo empeora.
          </div>
        </div>
      </div>
      <div class="col">
        <div class="sec"><span class="sec-n">5</span><span class="sec-t">La ecuación de la sesión</span></div>
        <div class="equation" style="display:flex;align-items:center;justify-content:center;height:calc(100% - 5.4mm)">
          <div class="equation-t">${meta.idea}</div>
        </div>
      </div>
    </div>

    </div>

    <div style="padding-top:3mm">
      <div class="personal">
        <div class="personal-i">
          <div class="personal-l">Una idea que me llevo</div>
          <div class="personal-line"></div>
        </div>
        <div class="personal-i">
          <div class="personal-l">? Lo que todavía no sé</div>
          <div class="personal-line"></div>
        </div>
      </div>
    </div>

    ${foot(`<img src="${logoEscuela}" alt="Escuela de Derecho PUCV" style="height:8mm;width:auto">`)}
  </section>`;

  // ── Página 2 ──────────────────────────────────────────────────────────────
  const stations = icjrPhases
    .map((p, i) => `${i ? '<div class="station-gap">›</div>' : ''}
      <div class="station">
        <div class="station-box">
          <div class="station-l">${p.letter}</div>
          <div class="station-n">${p.name}</div>
          <div class="station-q">${p.question}</div>
          <div class="station-e">${p.expected}</div>
        </div>
      </div>`)
    .join('');

  const statuses = epistemicStatuses
    .map(e => `<div class="st-i">
      <div class="st-l">${e.id}</div>
      <div class="st-n">${e.label}</div>
      <div class="st-m">${e.meaning}</div>
    </div>`)
    .join('');

  const errs = errorTypes
    .map(e => `<div class="err">
      <span class="err-n">${e.n}</span>
      <span class="err-t">${e.label}</span>
    </div>`)
    .join('');

  const sigs = warningSignals
    .map(s => `<div class="sig-item">
      <span class="sig-n">${String(s.n).padStart(2, '0')}</span>
      <span class="sig-t">${s.text}</span>
    </div>`)
    .join('');

  const rules = meta.rules
    .map((r, i) => `<div class="fin-i">
      <div class="fin-n">${i + 1}</div>
      <div class="fin-t">${r}</div>
    </div>`)
    .join('');

  const page2 = `<section class="page">
    <div class="mast2">
      <img class="d" src="${logoDiat}" alt="Programa DIAT · PUCV">
      <div style="flex:1;min-width:0">
        <div class="kicker">Clase 1 · Segunda idea de la sesión</div>
        <h1 style="font-size:15pt;line-height:1.06;margin-top:.8mm">De recibir a comprobar</h1>
      </div>
      <div style="text-align:right;flex:none">
        <div class="kicker kicker-muted">Ficha<br>de clase</div>
        <div class="mono" style="font-size:13pt;font-weight:700;color:${COLORS.crimson};line-height:1;margin-top:1mm">2<span style="font-size:7pt;color:${COLORS.grayLight}">/2</span></div>
      </div>
    </div>

    <div class="body">
    <div class="anchor" style="margin-top:3mm">
      <span class="anchor-mark">«</span>
      <div style="flex:1">
        <div class="anchor-text">Fuente real ≠ conclusión correcta.</div>
        <div class="anchor-sub">Que el rol exista no prueba que la sentencia sostenga lo que se le atribuye. Generar no es verificar.</div>
      </div>
    </div>

    <div class="row" style="margin-top:3.4mm;align-items:stretch">
      <div class="col">
        <div class="sec"><span class="sec-n">5</span><span class="sec-t">Cuatro formas de fallar</span></div>
        <div class="card" style="padding:1.8mm 2.2mm;height:calc(100% - 5.4mm)">
          ${errs}
          <div class="tiny muted" style="margin-top:1mm;padding-top:1mm;border-top:.2mm dotted ${COLORS.rule}">
            El tipo 2 es el que supera la verificación superficial: se le cuela a quien sí revisa.
          </div>
        </div>
      </div>
      <div class="col" style="flex:1.5">
        <div class="sec"><span class="sec-n">6</span><span class="sec-t">Siete señales de alerta</span></div>
        <div class="card" style="padding:1.8mm 2.2mm;height:calc(100% - 5.4mm)">${sigs}</div>
      </div>
    </div>

    <div style="margin-top:3.4mm">
      <div class="sec">
        <span class="sec-n">7</span>
        <span class="sec-t">Protocolo ICJR</span>
        <span class="sec-h">Control es ex ante: pides una respuesta auditable. ICJR es ex post: auditas la que recibiste.</span>
      </div>
      <div class="stations">${stations}</div>
    </div>

    <div style="margin-top:3.4mm">
      <div class="sec"><span class="sec-n">8</span><span class="sec-t">¿Qué clase de afirmación es esta?</span></div>
      <div class="st">${statuses}</div>
      <div class="tiny muted" style="margin-top:1.2mm">${notVerifiedRule}</div>
    </div>

    <div style="margin-top:3.4mm">
      <div class="sec"><span class="sec-n">9</span><span class="sec-t">El flujo que reemplaza a «prompt → respuesta»</span></div>
      ${flowStrip(meta.flow)}
    </div>

    </div>

    <div style="padding-top:3.4mm">
      <div class="kicker" style="margin-bottom:1.6mm">Lo que debes recordar al salir</div>
      <div class="fin">${rules}</div>
      <div class="personal" style="margin-top:3mm">
        <div class="personal-i">
          <div class="personal-l">Una práctica que voy a cambiar</div>
          <div class="personal-line"></div>
        </div>
      </div>
    </div>

    ${foot(`
      <div style="display:flex;align-items:flex-end;gap:2.4mm;justify-content:flex-end">
        <div style="text-align:right">
          <span class="b crimson">${meta.anchors[0]}</span><br>
          <span class="mono" style="font-size:5.4pt">taller-diat.vercel.app/clase-1</span>
        </div>
        ${qr ? `<img src="${qr}" alt="taller-diat.vercel.app/clase-1" style="width:13mm;height:13mm;flex:none">` : ''}
      </div>`)}
  </section>`;

  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<title>Ficha de Clase 1 · Taller de IA y Prompting Jurídico · DIAT PUCV</title>
<style>${baseCSS}${S}</style>
</head><body>${page1}${page2}</body></html>`;
}
