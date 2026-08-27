// ─────────────────────────────────────────────────────────────────────────────
// RUTA ANALÓGICA · CLASE 1 — dos páginas para trabajar con lápiz
//
// Para el estudiante que llega sin dispositivo. No es una versión pobre de la
// plataforma: es la misma secuencia de decisiones en otro soporte.
//
//   Plataforma            Papel
//   ──────────────────────────────────────────────────────────
//   /clase-1              pág. 1 · el encargo recibido
//   /clase-1/prompt       pág. 1 · siete componentes + Mi versión 1
//   /clase-1/auditoria    pág. 1 · microauditoría
//   /clase-1/verificacion pág. 2 · señales + Matriz ICJR
//   /clase-1/cierre       pág. 2 · corrección + tres reglas
//
// Página 1 construye. Página 2 desconfía. El cambio de lógica entre ambas es
// deliberado y es el contenido de la clase.
// ─────────────────────────────────────────────────────────────────────────────
import { COLORS, baseCSS, meter, lines, check } from './theme.mjs';

const S = `
  /* Encargo recibido: tinta oscura, porque es lo que llega, no lo que se decide. */
  .brief-quote {
    font-family: Consolas, "SF Mono", "Courier New", monospace;
    font-size: 8.6pt; line-height: 1.35; color: ${COLORS.white};
  }

  /* Los siete componentes. Dos columnas de celdas: rótulo arriba, renglón abajo. */
  .comp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.8mm 2.6mm; }
  .comp {
    border: .35mm solid ${COLORS.rule}; border-radius: 1mm;
    background: ${COLORS.white};
    padding: 1.4mm 1.6mm .8mm;
    display: flex; flex-direction: column;
  }
  .comp-head { display: flex; align-items: baseline; gap: 1.4mm; }
  .comp-n {
    font-family: Consolas, "SF Mono", "Courier New", monospace;
    font-size: 6.4pt; font-weight: 700; color: ${COLORS.crimson}; flex: none;
  }
  .comp-name { font-size: 7.6pt; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
  /* Fuentes y Control son el aporte propio del programa: se marcan, no se colorean. */
  .comp-sig {
    font-family: Consolas, "SF Mono", "Courier New", monospace;
    font-size: 5pt; font-weight: 700; letter-spacing: .08em;
    color: ${COLORS.crimson}; border: .25mm solid ${COLORS.crimson};
    border-radius: .5mm; padding: 0 .8mm; margin-left: auto; flex: none;
  }
  .comp-q { font-size: 6.4pt; color: ${COLORS.gray}; line-height: 1.2; margin-top: .3mm; }
  .comp-write { border-bottom: .25mm dotted ${COLORS.rule}; height: 8mm; margin-top: .8mm; }

  /* La octava celda no se deja vacía: recuerda cuántos componentes pide la
     tarea según su riesgo, que es justo la decisión que el estudiante tiene
     delante mientras rellena las siete anteriores. */
  .risk { display: flex; flex-direction: column; gap: .9mm; }
  .risk-row { display: flex; gap: 1.4mm; align-items: baseline; }
  .risk-tag {
    font-family: Consolas, "SF Mono", "Courier New", monospace;
    font-size: 5.4pt; font-weight: 700; letter-spacing: .06em;
    color: ${COLORS.white}; background: ${COLORS.gray};
    border-radius: .5mm; padding: .2mm 1mm; flex: none; min-width: 11mm; text-align: center;
  }
  .risk-txt { font-size: 6pt; line-height: 1.2; color: ${COLORS.ink}; }

  /* Conector físico entre páginas: una línea que cambia de función. */
  .rail { display: flex; align-items: center; gap: 1.6mm; }
  .rail-line { flex: 1; height: .25mm; background: ${COLORS.rule}; }
  .rail-node {
    font-family: Consolas, "SF Mono", "Courier New", monospace;
    font-size: 5.6pt; font-weight: 700; letter-spacing: .1em;
    color: ${COLORS.gray}; white-space: nowrap;
  }
  .rail-node.on { color: ${COLORS.crimson}; }

  /* Respuesta simulada de la página 2. Numerada para poder señalarla. */
  .claim { display: flex; gap: 1.6mm; margin-bottom: .9mm; }
  .claim:last-child { margin-bottom: 0; }
  .claim-n {
    font-family: Consolas, "SF Mono", "Courier New", monospace;
    font-size: 6.2pt; font-weight: 700; color: ${COLORS.crimson};
    flex: none; padding-top: .2mm;
  }
  .claim-t { font-size: 7pt; line-height: 1.28; flex: 1; }
  .fict { border-bottom: .25mm dashed ${COLORS.crimson}; }

  /* Estatus A–E: la letra manda, la etiqueta acompaña. */
  .status { display: flex; gap: 1.6mm; }
  .status-item {
    flex: 1; border: .35mm solid ${COLORS.rule}; border-radius: 1mm;
    background: ${COLORS.white}; padding: 1.1mm 1.2mm; text-align: center;
  }
  .status-letter {
    font-family: Consolas, "SF Mono", "Courier New", monospace;
    font-size: 10pt; font-weight: 700; color: ${COLORS.ink}; line-height: 1;
  }
  .status-cb { width: 3.4mm; height: 3.4mm; border: .35mm solid ${COLORS.gray}; border-radius: .5mm; margin: .8mm auto .6mm; }
  .status-label { font-size: 5.4pt; line-height: 1.15; color: ${COLORS.gray}; }

  /* Acciones del paso R. */
  .actions { display: flex; gap: 1.4mm; }
  .action {
    flex: 1; border: .35mm solid ${COLORS.rule}; border-radius: 1mm;
    padding: 1mm .6mm; text-align: center; background: ${COLORS.white};
    font-size: 6.4pt; font-weight: 700;
  }
  .action-cb { width: 3.2mm; height: 3.2mm; border: .35mm solid ${COLORS.gray}; border-radius: .5mm; margin: 0 auto .7mm; }

  /* Tres reglas de cierre. */
  .rule-item { display: flex; gap: 1.8mm; align-items: flex-start; }
  .rule-n {
    font-family: Consolas, "SF Mono", "Courier New", monospace;
    font-size: 8pt; font-weight: 700; color: ${COLORS.crimson}; line-height: 1.1; flex: none;
  }

  /* Campo recurrente de duda. Normaliza no saber. */
  .doubt { display: flex; align-items: flex-end; gap: 1.6mm; }
  .doubt-label { font-size: 6.2pt; font-weight: 700; color: ${COLORS.crimson}; white-space: nowrap; padding-bottom: .3mm; }
  .doubt-line { flex: 1; border-bottom: .25mm dotted ${COLORS.rule}; height: 5.4mm; }
`;

/** Barra de progreso impresa: las cinco etapas, con la actual marcada. */
function rail(active) {
  const steps = ['ENCARGO', 'DISEÑO', 'AUDITORÍA', 'VERIFICACIÓN', 'CIERRE'];
  return `<div class="rail">${steps
    .map((s, i) => {
      const node = `<span class="rail-node ${i === active ? 'on' : ''}">${i === active ? '◆' : '◇'} ${s}</span>`;
      return i === 0 ? node : `<div class="rail-line"></div>${node}`;
    })
    .join('')}</div>`;
}

function masthead(logo, { page, total, title, sub }) {
  return `<div class="masthead">
    <img class="masthead-logo" src="${logo}" alt="Programa DIAT · PUCV">
    <div class="masthead-main">
      <div class="kicker">Taller de IA y Prompting Jurídico · Clase 1</div>
      <h1 style="font-size:13pt;line-height:1.08;margin-top:.6mm">${title}</h1>
      <div class="tiny muted" style="margin-top:.5mm">${sub}</div>
    </div>
    <div class="masthead-side">
      <div class="mono" style="font-size:15pt;font-weight:700;line-height:1;color:${COLORS.crimson}">${page}<span style="font-size:8pt;color:${COLORS.grayLight}">/${total}</span></div>
      <div class="kicker kicker-muted" style="margin-top:.8mm">Ruta<br>analógica</div>
    </div>
  </div>`;
}

function footer(left) {
  return `<div class="footer">
    <div>${left}</div>
    <div style="text-align:right">
      Programa DIAT · Escuela de Derecho<br>
      Pontificia Universidad Católica de Valparaíso
    </div>
  </div>`;
}

export function rutaAnalogicaHTML({ canon, logoDiat }) {
  const { diatComponents, controlInstructions, icjrPhases, epistemicStatuses,
          claimActions, warningSignals, riskLevels, meta, diagnosisPrompt } = canon;

  // ── Página 1 ──────────────────────────────────────────────────────────────
  const comps = diatComponents
    .map((c, i) => `<div class="comp">
      <div class="comp-head">
        <span class="comp-n">${String(i + 1).padStart(2, '0')}</span>
        <span class="comp-name">${c.label}</span>
        ${c.signature ? '<span class="comp-sig">DIAT</span>' : ''}
      </div>
      <div class="comp-q">${c.question}</div>
      <div class="comp-write"></div>
    </div>`)
    .join('') +
    `<div class="card" style="padding:1.4mm 1.6mm;display:flex;flex-direction:column;justify-content:center">
      <div class="kicker kicker-muted" style="font-size:5.4pt">¿Cuántos necesito?</div>
      <div class="risk" style="margin-top:1mm">
        ${riskLevels.map(r => `<div class="risk-row">
          <span class="risk-tag">${r.label.replace('Riesgo ', '').toUpperCase()}</span>
          <span class="risk-txt">${r.structure}</span>
        </div>`).join('')}
      </div>
    </div>`;

  // La microauditoría sale de las siete instrucciones de control: se eligen las
  // cuatro que un estudiante puede comprobar sobre su propia hoja en 30 segundos.
  const audit = [controlInstructions[2], controlInstructions[3], controlInstructions[4], controlInstructions[1]];

  const page1 = `<section class="page">
    ${masthead(logoDiat, {
      page: '1', total: '2',
      title: 'Diseña antes de pedir',
      sub: 'Un prompt jurídico no empieza escribiendo. Empieza decidiendo.',
    })}

    <div style="margin-top:2.2mm">${rail(1)}</div>

    <div style="display:flex;gap:2.6mm;margin-top:2.6mm;align-items:stretch">
      <div style="flex:1.35;display:flex;flex-direction:column">
        <div class="sec"><span class="sec-n">A</span><span class="sec-t">El encargo que llega</span></div>
        <div class="card card-ink" style="flex:1;display:flex;flex-direction:column;justify-content:center">
          <div class="kicker" style="color:${COLORS.white};opacity:.65">Instrucción recibida</div>
          <div class="brief-quote" style="margin-top:1.2mm">«${diagnosisPrompt.text}»</div>
        </div>
      </div>
      <div style="flex:1;display:flex;flex-direction:column">
        <div class="sec"><span class="sec-n">B</span><span class="sec-t">¿Cómo de ambiguo es?</span></div>
        <div class="field" style="flex:1;padding:1.6mm 2mm;display:flex;flex-direction:column;justify-content:center;gap:2.2mm">
          <div>
            <div class="tiny b" style="margin-bottom:.9mm">ANTES · rodea un punto</div>
            ${meter('AMBIGUO', 'CONTROLADO')}
          </div>
          <div>
            <div class="tiny b" style="margin-bottom:.9mm">DESPUÉS · vuelve al terminar C</div>
            ${meter('AMBIGUO', 'CONTROLADO')}
          </div>
        </div>
      </div>
    </div>

    <div style="margin-top:3mm">
      <div class="sec">
        <span class="sec-n">C</span>
        <span class="sec-t">¿Qué falta decidir?</span>
        <span class="sec-h">Siete preguntas de diseño, no siete casillas obligatorias. Deja en blanco lo que tu tarea no necesite.</span>
      </div>
      <div class="comp-grid">${comps}</div>
    </div>

    <div style="margin-top:3mm;flex:1;display:flex;flex-direction:column">
      <div class="sec">
        <span class="sec-n">D</span>
        <span class="sec-t">Mi versión 1</span>
        <span class="sec-h">No lo hagas más largo. Hazlo menos ambiguo.</span>
      </div>
      <div class="writebox" style="flex:1;padding:1.4mm 2mm .6mm">
        ${lines(10)}
      </div>
    </div>

    <div style="margin-top:2.6mm">
      <div class="sec"><span class="sec-n">E</span><span class="sec-t">Antes de seguir, comprueba</span></div>
      <div class="row">
        ${audit.map(t => `<div class="col">${check(`<span class="tiny">${t}</span>`)}</div>`).join('')}
      </div>
    </div>

    <div style="margin-top:2.4mm" class="doubt">
      <span class="doubt-label">? Lo que todavía no sé:</span>
      <span class="doubt-line"></span>
    </div>

    ${footer(`<span class="b">Nombre</span> <span style="display:inline-block;width:52mm;border-bottom:.25mm solid ${COLORS.rule}">&nbsp;</span>
      &nbsp;·&nbsp; ${meta.date}
      <br><span class="muted">Sigue en la página 2: lo que acabas de construir se pone a prueba.</span>`)}
  </section>`;

  // ── Página 2 ──────────────────────────────────────────────────────────────
  const icjr = icjrPhases
    .map((p, i) => `${i ? '<div class="flow-arrow">→</div>' : ''}
      <div class="flow-step">
        <div class="card" style="padding:1.4mm 1mm;height:100%">
          <div class="mono" style="font-size:11pt;font-weight:700;color:${COLORS.crimson};line-height:1">${p.letter}</div>
          <div class="b" style="font-size:7pt;margin-top:.4mm">${p.name}</div>
          <div class="tiny muted" style="margin-top:.5mm">${p.question}</div>
        </div>
      </div>`)
    .join('');

  const signals = warningSignals
    .map(s => `<div style="width:50%;padding-right:2mm;margin-bottom:.9mm">${check(`<span class="tiny">${s.text}</span>`)}</div>`)
    .join('');

  const statuses = epistemicStatuses
    .map(e => `<div class="status-item">
      <div class="status-letter">${e.id}</div>
      <div class="status-cb"></div>
      <div class="status-label">${e.label}</div>
    </div>`)
    .join('');

  const actions = claimActions
    .map(a => `<div class="action"><div class="action-cb"></div>${a.label}</div>`)
    .join('');

  const rules = meta.rules
    .map((r, i) => `<div class="rule-item" style="margin-bottom:${i < 2 ? '1.4mm' : '0'}">
      <span class="rule-n">${i + 1}</span>
      <span class="small">${r}</span>
    </div>`)
    .join('');

  // La matriz es la zona de escritura más exigente de la hoja: hay que anotar
  // una afirmación entera, una fuente y un localizador. 18 mm por fila es lo
  // que ocupan dos renglones de letra manuscrita normal.
  const matrixRow = `<tr>
    <td style="height:18mm"></td><td></td><td></td><td></td><td></td>
  </tr>`;

  const page2 = `<section class="page">
    ${masthead(logoDiat, {
      page: '2', total: '2',
      title: 'No confíes: comprueba',
      sub: 'La respuesta ya llegó. Ahora empieza tu trabajo.',
    })}

    <div style="margin-top:2.2mm">${rail(3)}</div>

    <div style="margin-top:2.6mm">
      <div class="sec">
        <span class="sec-n">F</span>
        <span class="sec-t">La respuesta que recibes</span>
        <span class="sec-h">Ejemplo pedagógico. Lo subrayado en rojo es ficticio y está para que lo detectes.</span>
      </div>
      <div class="field" style="padding:1.8mm 2.2mm">
        <div class="claim">
          <span class="claim-n">01</span>
          <span class="claim-t">«El plazo de prescripción aplicable es de cinco años conforme al artículo 2515 del Código Civil.»</span>
        </div>
        <div class="claim">
          <span class="claim-n">02</span>
          <span class="claim-t">«Como sostiene <span class="fict">[APELLIDO, Nombre]</span> en <span class="fict">[TÍTULO INEXISTENTE]</span> (2023, pp. 142–158), la solución se ha consolidado en la doctrina nacional.»</span>
        </div>
        <div class="claim">
          <span class="claim-n">03</span>
          <span class="claim-t">«La jurisprudencia es uniforme en este punto y no admite discusión.»</span>
        </div>
      </div>
    </div>

    <div style="margin-top:2.8mm">
      <div class="sec">
        <span class="sec-n">G</span>
        <span class="sec-t">¿Qué te obliga a detenerte?</span>
        <span class="sec-h">Marca las señales que reconoces arriba.</span>
      </div>
      <div style="display:flex;flex-wrap:wrap">${signals}</div>
    </div>

    <div style="margin-top:2.6mm">
      <div class="sec">
        <span class="sec-n">H</span>
        <span class="sec-t">Protocolo ICJR</span>
        <span class="sec-h">Control ex ante; ICJR ex post.</span>
      </div>
      <div class="flow">${icjr}</div>
    </div>

    <div style="margin-top:2.6mm">
      <div class="sec">
        <span class="sec-n">I</span>
        <span class="sec-t">Matriz ICJR</span>
        <span class="sec-h">Dos afirmaciones bien hechas valen más que cinco a medias.</span>
      </div>
      <table>
        <colgroup><col style="width:34%"><col style="width:11%"><col style="width:21%"><col style="width:17%"><col style="width:17%"></colgroup>
        <thead><tr>
          <th>Afirmación</th><th>Estatus</th><th>Fuente contrastada</th><th>Localizador</th><th>Estado → acción</th>
        </tr></thead>
        <tbody>${matrixRow}${matrixRow}</tbody>
      </table>
    </div>

    <div class="row" style="margin-top:2.6mm">
      <div class="col" style="flex:1.15">
        <div class="sec"><span class="sec-n">J</span><span class="sec-t">Estatus</span></div>
        <div class="status">${statuses}</div>
      </div>
      <div class="col">
        <div class="sec"><span class="sec-n">K</span><span class="sec-t">¿Qué haces ahora?</span></div>
        <div class="actions">${actions}</div>
      </div>
    </div>

    <div style="margin-top:2.2mm;flex:1;display:flex;flex-direction:column">
      <div class="tiny muted" style="margin-bottom:1mm">Escribe qué haces con cada afirmación y por qué. Si no pudiste comprobarla, dilo: «no verificada» es un resultado.</div>
      <div class="writebox" style="flex:1;padding:1.2mm 2mm .4mm">${lines(4)}</div>
    </div>

    <div class="row" style="margin-top:2.8mm;align-items:stretch">
      <div class="col" style="flex:1.6">
        <div class="card card-crimson" style="height:100%;padding:2.2mm 2.6mm">
          <div class="kicker" style="color:${COLORS.white};opacity:.75">Tres reglas para salir de la sala</div>
          <div style="margin-top:1.6mm;color:${COLORS.white}">
            ${rules.replace(/class="rule-n"/g, `class="rule-n" style="color:${COLORS.white}"`)}
          </div>
        </div>
      </div>
      <div class="col">
        <div class="field" style="height:100%;padding:1.6mm 2mm;display:flex;flex-direction:column">
          <div class="kicker kicker-muted">Antes de entregar</div>
          <div class="doubt" style="margin-top:1.4mm">
            <span class="doubt-label">? Lo que todavía no sé:</span>
          </div>
          <div style="flex:1;display:flex;flex-direction:column;justify-content:flex-end">
            <div class="line"></div><div class="line"></div>
          </div>
        </div>
      </div>
    </div>

    ${footer(`<span class="b crimson">${meta.anchors[0]}</span>
      <br><span class="muted">Entrega esta hoja al terminar. Es la evidencia de tu razonamiento.</span>`)}
  </section>`;

  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<title>Ruta analógica · Clase 1 · Taller de IA y Prompting Jurídico · DIAT PUCV</title>
<style>${baseCSS}${S}</style>
</head><body>${page1}${page2}</body></html>`;
}
