// ─────────────────────────────────────────────────────────────────────────────
// CLASE 1 · AUDITORÍA DEL DECK
//
//   node --experimental-strip-types --import ./scripts/class1/ts-resolve.mjs \
//        scripts/class1/audit-class1-deck.mjs
//
// Tres auditorías sobre el archivo REAL, no sobre el modelo:
//
//   A · PEDAGÓGICA   30 diapositivas, B00–B09 en orden, horarios y rutas,
//                    productos A/B/C, frases ancla, siete componentes, ICJR,
//                    cinco estatus, cuatro errores en aula, tipos 5–6 fuera,
//                    ausencia de términos retirados.
//   B · GEOMÉTRICA   ninguna forma fuera del lienzo, ninguna invadiendo el pie,
//                    ninguna diapositiva sin contenido.
//   C · RENDER       las 30 imágenes existen y ninguna salió en blanco.
//
// Sale con código 1 si hay algún fallo: sirve como puerta de calidad.
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import JSZip from 'jszip';

import { SLIDES, deckInvariants, blockOf, platformRoute, STATE_LABEL } from '../../src/content/class1/deck.ts';
import { BLOCKS, class1Meta, blockClock } from '../../src/content/class1/manifest.ts';
import { RUN_OF_SHOW, segmentClock, segmentOf, timeSplit } from '../../src/content/class1/runofshow.ts';
import { STAGES, getStage } from '../../src/content/class1/stages.ts';
import { class1ActivityDurations } from '../../src/content/class1/timers.ts';
import {
  diatComponents, icjrPhases, epistemicStatuses, claimStates, claimActions,
  errorTypes, warningSignals, googleWarning, disciplinaryLine, solvedRow,
} from '../../src/content/class1/activities.ts';
import { PROMPT_DIAT_REFERENCIA, METAPROMPT_AUDITORIA, PROMPT_DIAGNOSTICO } from '../../src/content/class1/prompts.ts';
import { W, H, G } from './theme.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
const OUT = process.env.DIAT_OUT
  ? path.resolve(process.env.DIAT_OUT)
  : path.resolve(REPO, '..', '..', 'Desktop', 'diat', 'CLASES TALLER DIAT 2026', 'CLASE 1', 'PPT_v2.0', 'build');
const DECK = path.join(OUT, 'DIAT_CLASE_1_CANON_2026.pptx');
const RENDERS = path.join(OUT, 'renders');

const EMU = 914400;
const fails = [];
const warns = [];
const ok = [];

const check = (cond, label, detail) => (cond ? ok.push(label) : fails.push(detail ? `${label} — ${detail}` : label));
const soft = (cond, label) => { if (!cond) warns.push(label); };

if (!fs.existsSync(DECK)) {
  console.error(`✗ No existe ${DECK}. Compila primero: npm run build:class1-ppt`);
  process.exit(1);
}

// ─── Texto real del paquete ──────────────────────────────────────────────────

const zip = await JSZip.loadAsync(fs.readFileSync(DECK));
const dec = (s) => s
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&amp;/g, '&');

const slideXml = [];
const notesText = [];
for (let n = 1; n <= 30; n++) {
  const f = zip.file(`ppt/slides/slide${n}.xml`);
  if (!f) { fails.push(`Falta ppt/slides/slide${n}.xml en el paquete`); slideXml.push(''); continue; }
  slideXml.push(await f.async('string'));
  const nf = zip.file(`ppt/notesSlides/notesSlide${n}.xml`);
  notesText.push(nf ? [...(await nf.async('string')).matchAll(/<a:t>([\s\S]*?)<\/a:t>/g)].map((m) => dec(m[1])).join('\n') : '');
}
const textOf = (n) => [...slideXml[n - 1].matchAll(/<a:t>([\s\S]*?)<\/a:t>/g)].map((m) => dec(m[1])).join(' ');
const ALL = slideXml.map((_, i) => textOf(i + 1));
const CORPUS = ALL.join('\n');
const NOTES = notesText.join('\n');

// ─── A · Auditoría pedagógica ────────────────────────────────────────────────

const inv = deckInvariants();
check(inv.length === 0, 'Invariantes del deck', inv.join(' | '));
check(SLIDES.length === 30, 'El deck tiene 30 diapositivas', `tiene ${SLIDES.length}`);
check(zip.file('ppt/slides/slide30.xml') !== null && zip.file('ppt/slides/slide31.xml') === null,
  'El paquete contiene exactamente 30 diapositivas');

// Bloques, orden y horarios.
const codes = BLOCKS.map((b) => b.code).join(',');
check(codes === 'B00,B01,B02,B03,B04,B05,B06,B07,B08,B09', 'Los diez bloques B00–B09 están en orden', codes);
const total = BLOCKS.reduce((a, b) => a + (b.to - b.from), 0);
check(total === 90, 'Los bloques suman 90 minutos exactos', `suman ${total}`);
BLOCKS.forEach((b, i) => {
  if (i > 0) check(BLOCKS[i - 1].to === b.from, `Continuidad ${BLOCKS[i - 1].code}→${b.code}`, `${BLOCKS[i - 1].to} ≠ ${b.from}`);
});
// Reparto v2.2 · la plataforma pasó de diez ejercicios a cinco etapas de
// ejecución, y los minutos que sobraron volvieron a la conducción docente.
const EXPECTED_CLOCK = {
  B00: '15:00–15:08', B01: '15:08–15:18', B02: '15:18–15:22', B03: '15:22–15:28', B04: '15:28–15:44',
  B05: '15:44–15:55', B06: '15:55–16:03', B07: '16:03–16:12', B08: '16:12–16:22', B09: '16:22–16:30',
};
for (const b of BLOCKS) {
  check(blockClock(b) === EXPECTED_CLOCK[b.code], `Horario de ${b.code}`, `${blockClock(b)} ≠ ${EXPECTED_CLOCK[b.code]}`);
}

// Reparto de diapositivas por bloque.
const EXPECTED_SLIDES = {
  B00: '1,2,3,4,5', B01: '6,7,8', B02: '9', B03: '10,11,12', B04: '13,14',
  B05: '15,16', B06: '17,18,19', B07: '20,21,22,23,24', B08: '25,26,27', B09: '28,29,30',
};
for (const b of BLOCKS) {
  check(b.slides.join(',') === EXPECTED_SLIDES[b.code], `Diapositivas de ${b.code}`, `${b.slides.join(',')} ≠ ${EXPECTED_SLIDES[b.code]}`);
}

// Portada y cierre no llevan cromo: son piezas de identidad, no de navegación.
const BARE = new Set(['cover', 'closing']);
const isBare = (s) => BARE.has(s.layout);

// Cada diapositiva de contenido imprime su bloque, su franja horaria,
// su estado de clase y su numeración.
for (const s of SLIDES) {
  if (isBare(s)) continue;
  const b = blockOf(s);
  const t = ALL[s.n - 1];
  check(t.includes(b.code), `Slide ${s.n} imprime su bloque`, `no aparece ${b.code}`);
  check(t.includes(blockClock(b)), `Slide ${s.n} imprime su franja horaria`, `no aparece ${blockClock(b)}`);
  check(t.includes(`${String(s.n).padStart(2, '0')} / 30`), `Slide ${s.n} imprime su numeración`);
  check(t.includes(STATE_LABEL[s.state]), `Slide ${s.n} imprime su estado de clase`, STATE_LABEL[s.state]);
}

// Rutas de plataforma. Cinco etapas, cinco llamadas, más la portada.
const CALLS = [1, 3, 13, 15, 27, 29];
for (const n of CALLS) {
  const s = SLIDES[n - 1];
  const route = platformRoute(s);
  check(!!route, `Slide ${n} declara ruta de plataforma`);
  // La portada imprime la raíz /clase-1 con QR, no la ruta de la etapa.
  const expected = isBare(s) ? 'clase-1' : route.replace('/clase-1', 'clase-1');
  check(ALL[n - 1].includes(expected), `Slide ${n} imprime la ruta ${isBare(s) ? '/clase-1' : route}`);
}

// Ninguna diapositiva proyecta una ruta que la plataforma ya no sirve. Se
// aceptan la raíz y las cinco etapas; cualquier otra cosa bajo /clase-1/ es un
// resto de la arquitectura retirada.
const LIVE_ROUTES = new Set(STAGES.map((s) => s.route.replace('/clase-1', '').replace('/', '')).filter(Boolean));
for (const s of SLIDES) {
  const t = ALL[s.n - 1];
  for (const m of t.matchAll(/clase-1\/([a-z0-9-]+)/gi)) {
    check(LIVE_ROUTES.has(m[1].toLowerCase()), `Slide ${s.n} no proyecta rutas retiradas`, `/clase-1/${m[1]}`);
  }
}

// Y no proyecta la nomenclatura de entregables retirada: los productos A, B y C
// se fundieron en un único documento de entrega.
for (const s of SLIDES) {
  const dead = /Producto\s+[ABC]\b|Bitácora/i.exec(ALL[s.n - 1]);
  check(!dead, `Slide ${s.n} no nombra los entregables retirados`, dead?.[0]);
}

// Las cinco etapas de la plataforma están llamadas desde el deck, con su ruta
// real y con el tiempo que el cronómetro les da de verdad.
for (const stage of STAGES) {
  const slide = SLIDES.find((s) => s.n !== 1 && s.opens === stage.id);
  check(!!slide, `La etapa «${stage.label}» se abre desde alguna diapositiva`);
  if (!slide) continue;
  check(platformRoute(slide) === stage.route, `Slide ${slide.n} apunta a ${stage.route}`, platformRoute(slide));
  const seg = RUN_OF_SHOW.find((r) => r.stage === stage.id);
  check(!!seg, `El reparto reserva un tramo para «${stage.label}»`);
  if (!seg) continue;
  const minutes = class1ActivityDurations[stage.id] / 60;
  check(
    (seg.stageAt ?? seg.from) + minutes <= seg.to,
    `«${stage.label}» cabe en ${segmentClock(seg)}`,
    `${minutes} min desde el minuto ${seg.stageAt ?? seg.from}`,
  );
}

// Los tres entregables tienen diapositiva.
check(SLIDES.some((s) => s.n === 13 && s.dependency?.includes('Prompt V1')), 'El Prompt V1 vive en la diapositiva 13');
check(SLIDES.some((s) => s.n === 15 && s.dependency?.includes('Prompt V2')), 'El Prompt V2 vive en la diapositiva 15');
check(SLIDES.some((s) => s.n === 27 && s.dependency?.includes('Verificación')), 'La verificación vive en la diapositiva 27');
check(SLIDES.some((s) => s.n === 29 && s.dependency?.includes('Entrega')), 'La entrega vive en la diapositiva 29');
check(/Antes de esta clase pensaba que el problema era/.test(ALL[28]), 'La diapositiva 29 proyecta la frase de cierre');

// El reparto docente/alumno del canon v2.2.
const split = timeSplit();
check(split.total === 90, 'El reparto suma 90 minutos', String(split.total));
check(split.platform === 39, 'La plataforma ocupa 39 minutos', String(split.platform));
check(split.teacher === 51, 'La conducción docente ocupa 51 minutos', String(split.teacher));

// Frases ancla.
const ANCHORS_IN_DECK = [
  ['FLUIDEZ ≠ VERDAD', 8],
  ['FUENTE REAL ≠ CONCLUSIÓN CORRECTA', 18],
  ['PROCEDENCIA ≠ INTERPRETACIÓN', 21],
  ['LA IA NO COMPARECE ANTE EL TRIBUNAL.', 30],
];
for (const [phrase, n] of ANCHORS_IN_DECK) {
  check(ALL[n - 1].includes(phrase), `Frase ancla en la diapositiva ${n}`, phrase);
}
check(/Control es ex ante[\s\S]*ICJR es ex post/.test(ALL[24]), 'La diapositiva 25 enuncia «Control ex ante; ICJR ex post»');

// Los siete componentes DIAT, en orden y con su denominación canónica.
const COMPONENTS = ['Contexto', 'Rol', 'Tarea', 'Fuentes', 'Restricciones', 'Formato', 'Control'];
check(diatComponents.map((c) => c.label).join(',') === COMPONENTS.join(','), 'Los siete componentes DIAT, en orden canónico');
for (const c of COMPONENTS) check(ALL[9].includes(c), `La diapositiva 10 nombra «${c}»`);
check(diatComponents.filter((c) => c.signature).map((c) => c.label).join(',') === 'Fuentes,Control',
  'Fuentes y Control marcados como aporte propio del programa');
check(/preguntas de diseño/i.test(ALL[9]) || /preguntas de diseño/i.test(ALL[10]),
  'El deck llama «preguntas de diseño» a los componentes');
check(diatComponents.every((c) => ALL[10].includes(c.question)), 'La diapositiva 11 proyecta las siete preguntas');
check(!COMPONENTS.some((c) => ALL[10].includes(`${c}:`)), 'La diapositiva 11 no lleva etiquetas: son preguntas, no casillas');

// ICJR.
check(icjrPhases.map((p) => p.letter).join('') === 'ICJR', 'El protocolo es exactamente I·C·J·R');
check(icjrPhases.map((p) => p.name).join(',') === 'Identificar,Contrastar,Justificar,Registrar',
  'ICJR = Identificar · Contrastar · Justificar · Registrar');
for (const p of icjrPhases) check(ALL[24].includes(p.name), `La diapositiva 25 nombra «${p.name}»`);
check(/Matriz ICJR/.test(ALL[26]), 'La diapositiva 27 se titula «Matriz ICJR»');
check(!/matriz de verificación/i.test(ALL[26]), 'La diapositiva 27 no usa «matriz de verificación»');

// Las tres dimensiones, sin mezclarse.
check(epistemicStatuses.map((e) => e.id).join('') === 'ABCDE', 'Cinco estatus epistémicos A–E');
check(epistemicStatuses.map((e) => e.label).join(' · ') ===
  'Respaldada por fuente · Síntesis de fuente · Inferencia · Hipótesis · Información externa no verificada',
  'Redacción canónica de los cinco estatus');
check(claimStates.map((c) => c.label).join(' · ') ===
  'Confirmada · Parcialmente respaldada · No respaldada · Contradictoria · No verificable con las fuentes disponibles',
  'Redacción canónica de los cinco estados');
check(claimActions.map((a) => a.label).join(' · ') === 'Mantener · Matizar · Corregir · Eliminar · Investigar',
  'Redacción canónica de las cinco acciones');
check(/tres dimensiones distintas/i.test(ALL[25]), 'La diapositiva 26 advierte que estatus, estado y acción no son intercambiables');
check(/no verificada/i.test(ALL[26]) && /resultado/i.test(ALL[26]),
  'La diapositiva 27 lleva la regla «no verificada es un resultado válido»');

// Taxonomía de errores: cuatro en aula, tipos 5 y 6 fuera.
check(errorTypes.length === 4, 'La taxonomía de aula tiene exactamente cuatro tipos', `tiene ${errorTypes.length}`);
check(errorTypes.filter((e) => e.core).length === 1 && errorTypes.find((e) => e.core).n === 2,
  'El tipo 2 es el núcleo del bloque');
for (const e of errorTypes) check(ALL[16].includes(e.label), `La diapositiva 17 nombra el tipo ${e.n}`);
check(!/tipo 5|tipo 6|inferencia no declarada|omisión relevante/i.test(CORPUS),
  'Los tipos 5 y 6 no aparecen en el deck: son complementarios de plataforma y Manual');
check(warningSignals.length === 7, 'Siete señales de alerta');
check(warningSignals.every((w) => ALL[18].includes(w.text)), 'La diapositiva 19 proyecta las siete señales');

// Prompts canónicos, carácter por carácter.
const collapse = (s) => s.replace(/\s+/g, ' ').trim();
check(collapse(ALL[13]).includes(collapse(PROMPT_DIAT_REFERENCIA.text)),
  'La diapositiva 14 reproduce el Prompt DIAT de referencia carácter por carácter');
check(!/\bRol\b\s*:/.test(ALL[13]), 'El Prompt DIAT de referencia sigue sin Rol');
check(collapse(ALL[14]).includes(collapse(METAPROMPT_AUDITORIA.text)),
  'La diapositiva 15 reproduce el metaprompt canónico carácter por carácter');
check(ALL[12].includes(PROMPT_DIAGNOSTICO.text), 'La diapositiva 13 reproduce el Prompt 0');
for (const line of [
  'No agregues requisitos que no mejoren el resultado de esta tarea en particular.',
  'Formula como máximo tres preguntas aclaratorias, y solo aquellas cuya respuesta cambiaría efectivamente el resultado.',
]) check(ALL[14].includes(line), 'La diapositiva 15 contiene la línea decisiva', line.slice(0, 40) + '…');

// Correcciones históricas.
check(!/GARCÍA MANRIQUE|García Manrique/.test(CORPUS), 'Ninguna obra inexistente atribuida a una persona real');
check(ALL[1].includes('[APELLIDO, Nombre]'), 'La ficha bibliográfica usa el marcador canónico');
check(!/Sanción Disciplinaria/i.test(ALL[1]), 'La diapositiva 02 no revela la sanción antes de la votación');
check(!/Instraer/.test(CORPUS), 'La errata «Instraer» no existe en el deck');
for (const r of disciplinaryLine) {
  check(ALL[3].includes(r.rol), `La diapositiva 04 imprime el rol ${r.rol}`);
  check(ALL[3].includes(r.sanction), `La diapositiva 04 imprime la sanción de ${r.court}`, r.sanction);
}
check(!/Amonestación/i.test(CORPUS), 'La sanción del TDLC ya no dice «amonestación»');
check(/1 UTM/.test(ALL[3]), 'La diapositiva 04 dice 1 UTM para el TDLC');
check(/No\. La resolución no menciona uso de IA/.test(ALL[3]),
  'La diapositiva 04 precisa que el Tribunal Constitucional no menciona IA');
check(/≈ \$69\.751/.test(ALL[3]), 'La diapositiva 04 da la equivalencia en pesos');
check(collapse(ALL[22]).includes(collapse(googleWarning.text)), 'La advertencia de Google usa la redacción canónica');
check(!/NotebookLM may produce/.test(CORPUS), 'No sobrevive la redacción antigua de la advertencia');
check((CORPUS.match(/Gemini Notebook can make mistakes/g) || []).length === 1,
  'La advertencia de Google tiene una sola redacción en todo el deck');
check(/consultada el 22 de agosto de 2026/.test(ALL[22]), 'La advertencia lleva su fecha de consulta');
check(/Gemini Notebook/.test(ALL[21]), 'La herramienta se llama Gemini Notebook');

// Reglas finales, redacción canónica.
check(class1Meta.rules[0] === 'Un prompt mejor reduce ambigüedad; no garantiza verdad.', 'Regla 1 canónica');
check(!/reduce decisiones implícitas; no garantiza verdad/.test(ALL[28]), 'La regla 1 no dice «decisiones implícitas»');
check(!/verifícala en fuente oficial|verifíquenla en fuente oficial/.test(CORPUS), 'La regla 3 no añade «en fuente oficial»');
for (const r of class1Meta.rules) check(ALL[28].includes(r), 'La diapositiva 29 proyecta la regla', r.slice(0, 36) + '…');

// Flujo e idea fuerza.
check(class1Meta.flow.join(' → ') === 'TAREA → INSTRUCCIÓN → CONTEXTO Y FUENTES → RESPUESTA → VERIFICACIÓN → DECISIÓN HUMANA',
  'Flujo canónico de seis pasos');
for (const n of [5, 28]) {
  for (const step of class1Meta.flow) check(ALL[n - 1].includes(step), `La diapositiva ${n} proyecta «${step}»`);
}
check(ALL[4].includes(class1Meta.idea) && ALL[27].includes(class1Meta.idea),
  'La ecuación canónica aparece idéntica en las diapositivas 5 y 28');
check(!/CORPUS DELIMITADO \+ PROTOCOLO ICJR/i.test(CORPUS), 'No sobrevive la ecuación no canónica del deck v1');

// Términos retirados.
const BANNED = [
  [/anti-?alucinacion/i, '«anti-alucinaciones»'],
  [/siete capas|7 capas|las capas del prompt/i, '«siete capas»'],
  [/cazador de alucinaciones/i, '«Cazador de alucinaciones»'],
  [/checklist ICJR/i, '«Checklist ICJR»'],
  [/ficha de verificación/i, '«Ficha de verificación»'],
  [/en parejas|grupos de tres|revisión entre pares/i, 'trabajo en parejas o grupos'],
  [/mano alzada/i, '«a mano alzada»'],
  [/siete casillas obligatorias que/i, 'los componentes como fórmula'],
];
for (const [re, label] of BANNED) {
  check(!re.test(CORPUS), `El deck no contiene ${label}`);
  check(!re.test(NOTES), `Las notas del orador no contienen ${label}`);
}
check(!/SLIDE \d\d/.test(CORPUS), 'El identificador interno «SLIDE NN» no se proyecta al estudiante');

// Notas del orador.
for (const s of SLIDES) {
  const n = notesText[s.n - 1];
  const b = blockOf(s);
  check(n.length > 0, `La diapositiva ${s.n} tiene notas del orador`);
  check(n.includes('CLASE: 1'), `Notas de ${s.n}: cabecera CLASE`);
  check(n.includes(`TRAMO: ${b.code}`), `Notas de ${s.n}: tramo`);
  check(n.includes(`HORARIO: ${segmentClock(segmentOf(b.id))}`), `Notas de ${s.n}: horario`);
  const route = platformRoute(s);
  check(
    n.includes(`RUTA: ${route ?? '— (esta diapositiva no manda al estudiante a la plataforma)'}`),
    `Notas de ${s.n}: ruta`,
  );
  check(n.includes('CANON: v1.0'), `Notas de ${s.n}: versión del canon`);
  check(n.includes('PLATAFORMA: 5 etapas'), `Notas de ${s.n}: arquitectura de plataforma`);
  check(n.includes('DOCENTE:') && n.includes('ESTUDIANTE:'), `Notas de ${s.n}: docente y estudiante`);
  soft(n.length < 1400, `Notas de ${s.n} largas (${n.length} car.): deben ser navegación, no guion`);
}

// ─── B · Auditoría geométrica ────────────────────────────────────────────────

const CANVAS_W = W * EMU;
const CANVAS_H = H * EMU;
const FOOTER_TOP = (G.footY - 0.16) * EMU;
const TOL = 0.02 * EMU;

for (let n = 1; n <= 30; n++) {
  const xml = slideXml[n - 1];
  const shapes = [...xml.matchAll(/<a:off x="(-?\d+)" y="(-?\d+)"\/><a:ext cx="(\d+)" cy="(\d+)"\/>/g)]
    .map((m) => ({ x: +m[1], y: +m[2], w: +m[3], h: +m[4] }))
    .filter((s) => s.w > 0 && s.h > 0);

  check(shapes.length > 2, `Slide ${n} tiene contenido`, `solo ${shapes.length} formas`);

  for (const s of shapes) {
    if (s.x < -TOL || s.y < -TOL) fails.push(`Slide ${n}: forma fuera del lienzo por arriba/izquierda (${(s.x / EMU).toFixed(2)}, ${(s.y / EMU).toFixed(2)} in)`);
    if (s.x + s.w > CANVAS_W + TOL) fails.push(`Slide ${n}: forma se sale por la derecha hasta ${((s.x + s.w) / EMU).toFixed(2)} in (lienzo ${W})`);
    if (s.y + s.h > CANVAS_H + TOL) fails.push(`Slide ${n}: forma se sale por abajo hasta ${((s.y + s.h) / EMU).toFixed(2)} in (lienzo ${H})`);
  }

  // El pie es zona reservada: nada de cuerpo puede invadirlo.
  // Portada y cierre no llevan pie: ocupan el lienzo entero por diseño.
  if (BARE.has(SLIDES[n - 1].layout)) continue;
  const isChrome = (s) => s.h >= CANVAS_H - TOL || s.y >= FOOTER_TOP - TOL;
  const invaders = shapes.filter((s) => !isChrome(s) && s.y + s.h > FOOTER_TOP + TOL);
  for (const s of invaders) {
    fails.push(`Slide ${n}: el cuerpo invade el pie — llega a ${((s.y + s.h) / EMU).toFixed(2)} in (límite ${(FOOTER_TOP / EMU).toFixed(2)})`);
  }
}

// ─── C · Auditoría de render ─────────────────────────────────────────────────

if (!fs.existsSync(RENDERS)) {
  warns.push('No hay renders todavía: ejecuta scripts/class1/render-deck.ps1');
} else {
  for (let n = 1; n <= 30; n++) {
    const p = path.join(RENDERS, `slide-${String(n).padStart(2, '0')}.png`);
    if (!fs.existsSync(p)) { fails.push(`Falta el render slide-${String(n).padStart(2, '0')}.png`); continue; }
    const size = fs.statSync(p).size;
    if (size < 5000) fails.push(`El render de la diapositiva ${n} está en blanco (${size} bytes): PowerPoint no pudo dibujarla`);
  }
  const pdf = path.join(OUT, 'DIAT_CLASE_1_CANON_2026.pdf');
  check(fs.existsSync(pdf) && fs.statSync(pdf).size > 50_000, 'El PDF renderizado existe');
}

// ─── Informe ─────────────────────────────────────────────────────────────────

console.log(`\nAUDITORÍA DEL DECK · CLASE 1 · canon v1.0 · guion v2.0`);
console.log(`  comprobaciones superadas: ${ok.length}`);
console.log(`  avisos:                   ${warns.length}`);
console.log(`  fallos:                   ${fails.length}\n`);

if (warns.length) {
  console.log('AVISOS');
  for (const w of warns) console.log('  ! ' + w);
  console.log('');
}
if (fails.length) {
  console.log('FALLOS');
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('');
  process.exit(1);
}
console.log('✓ Sin fallos. El deck es coherente con el canon, el guion y la plataforma.\n');
