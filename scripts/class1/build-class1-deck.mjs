// ─────────────────────────────────────────────────────────────────────────────
// CLASE 1 · GENERADOR DEL DECK CANÓNICO
//
//   node --experimental-strip-types --import ./scripts/class1/ts-resolve.mjs \
//        scripts/class1/build-class1-deck.mjs
//
// o, más cómodo:  npm run build:class1-ppt
//
// QUÉ HACE
//   1. Importa el canon: manifest.ts, activities.ts, prompts.ts y deck.ts —los
//      mismos módulos que renderiza /clase-1. No hay contenido duplicado.
//   2. Comprueba las invariantes del deck. Si alguna falla, aborta.
//   3. Compone las 30 diapositivas con PptxGenJS (texto y formas nativos).
//   4. Trasplanta las diapositivas al esqueleto de paquete del deck v1 —tema,
//      patrón y once diseños originales—, que es lo que conserva la identidad
//      visual y lo que hace el archivo legible por PowerPoint 2007.
//   5. Reempaqueta el ZIP en el orden que exige OPC.
//   6. Emite CLASS_1_PPT_CONTENT.md con el contenido textual de las 30.
//
// POR QUÉ EL TRASPLANTE
//   El XML de diapositiva que produce PptxGenJS es válido y PowerPoint 2007 lo
//   abre sin problemas. El esqueleto que PptxGenJS genera alrededor, no: su
//   patrón, sus diseños y su presentation.xml hacen fallar Presentations.Open
//   con E_FAIL. Comprobado por bisección con archivos mínimos en 4.0.1 y 3.12.0.
//   Ver CLASS_1_CHANGELOG.md §2.
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import PptxGenJS from 'pptxgenjs';
import JSZip from 'jszip';
import QRCode from 'qrcode';

import { SLIDES, deckInvariants, blockOf, slideStamp, STATE_LABEL, platformRoute } from '../../src/content/class1/deck.ts';
import { class1Meta, CLASS_URL, blockClock } from '../../src/content/class1/manifest.ts';
import { LAYOUTS, ASSETS } from './layouts.mjs';
import { C, F, W, H } from './theme.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
const SKELETON = path.join(HERE, 'skeleton');
const ASSET_DIR = path.join(HERE, 'assets');

/** Carpeta de salida. Configurable para no dejarla clavada al workspace. */
const OUT = process.env.DIAT_OUT
  ? path.resolve(process.env.DIAT_OUT)
  : path.resolve(REPO, '..', '..', 'Desktop', 'diat', 'CLASES TALLER DIAT 2026', 'CLASE 1', 'PPT_v2.0', 'build');

const DECK_NAME = 'DIAT_CLASE_1_CANON_2026.pptx';
const STAMP_DATE = new Date(Date.UTC(2026, 7, 24, 12, 0, 0));

const log = (...a) => console.log(...a);

// ─── 1 · Invariantes ─────────────────────────────────────────────────────────

const errs = deckInvariants();
if (errs.length) {
  console.error('\n✗ INVARIANTES DEL DECK FALLIDAS:\n' + errs.map((e) => '  · ' + e).join('\n') + '\n');
  process.exit(1);
}
log(`✓ Invariantes del deck: ${SLIDES.length} diapositivas, B00–B09 en orden`);

// ─── 2 · Activos ─────────────────────────────────────────────────────────────

function dataUri(file, mime) {
  return `data:${mime};base64,${fs.readFileSync(path.join(ASSET_DIR, file)).toString('base64')}`;
}

ASSETS.crestWhite = dataUri('diat-horizontal-blanco.png', 'image/png');
ASSETS.crestDark = dataUri('diat-cuadrado.png', 'image/png');

// QR generado localmente. Sin servicios externos, sin claves, sin red en runtime.
ASSETS.qr = await QRCode.toDataURL(CLASS_URL, {
  errorCorrectionLevel: 'M',
  margin: 0,
  width: 720,
  color: { dark: '#1A202CFF', light: '#FFFFFFFF' },
});
log(`✓ QR generado localmente → ${CLASS_URL}`);

// ─── 3 · Notas del orador ────────────────────────────────────────────────────

function notesFor(s) {
  const b = blockOf(s);
  const route = platformRoute(s);
  const lines = [
    slideStamp(s),
    '',
    `FUNCIÓN: ${s.fn} · ${STATE_LABEL[s.state]}`,
    '',
    'DOCENTE:',
    s.teacher,
    '',
    'ESTUDIANTE:',
    s.student,
  ];
  if (route) {
    lines.push('', 'PLATAFORMA:', `${route} — el estudiante trabaja; el profesor circula y calla.`);
  }
  if (b.anchor) lines.push('', 'FRASE ANCLA:', b.anchor);
  if (s.dependency) lines.push('', 'SALIDA:', s.dependency);
  lines.push('', 'FUENTE:', s.source);
  lines.push('', 'El texto que el profesor dice está en el Guion docente v2.0, bloque ' + b.code + '. Esta nota es navegación, no guion.');
  return lines.join('\n');
}

// ─── 4 · Composición ─────────────────────────────────────────────────────────

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'DIAT16x9', width: W, height: H });
pptx.layout = 'DIAT16x9';
pptx.author = 'Programa DIAT · Escuela de Derecho PUCV';
pptx.company = 'Pontificia Universidad Católica de Valparaíso';
pptx.subject = 'Taller de IA y Prompting Jurídico · Clase 1';
pptx.title = class1Meta.title;

for (const s of SLIDES) {
  const render = LAYOUTS[s.layout];
  if (!render) throw new Error(`Diapositiva ${s.n}: no existe la composición «${s.layout}»`);
  const slide = pptx.addSlide();
  render(slide, s);
  slide.addNotes(notesFor(s));
}
log(`✓ Compuestas ${SLIDES.length} diapositivas`);

const raw = Buffer.from(await pptx.write({ outputType: 'nodebuffer' }));

// ─── 5 · Trasplante al esqueleto del deck v1 ─────────────────────────────────

const REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const CT = 'application/vnd.openxmlformats-officedocument.presentationml';

function walk(dir, base = dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p, base) : [path.relative(base, p).split(path.sep).join('/')];
  });
}

/**
 * Repara el XML de diapositiva que produce PptxGenJS.
 *
 * Cuando un `addText` recibe varios runs con formato distinto, PptxGenJS emite
 * un `<a:pPr>` ANTES DE CADA RUN dentro del mismo `<a:p>`. El esquema
 * DrawingML admite un único `<a:pPr>`, y además como primer hijo del párrafo.
 * PowerPoint abre el archivo igual, pero deja la diapositiva ENTERA en blanco
 * al renderizarla — un fallo silencioso que solo se ve al exportar.
 *
 * Aquí se conserva el primer `<a:pPr>` de cada párrafo y se eliminan los demás.
 */
function fixDuplicateParagraphProps(xml) {
  let removed = 0;
  const out = xml.replace(/<a:p>([\s\S]*?)<\/a:p>/g, (whole, inner) => {
    let seen = false;
    const cleaned = inner.replace(/<a:pPr(?:\s[^>]*)?(?:\/>|>[\s\S]*?<\/a:pPr>)/g, (m) => {
      if (!seen) { seen = true; return m; }
      removed++;
      return '';
    });
    return `<a:p>${cleaned}</a:p>`;
  });
  return { xml: out, removed };
}

const src = await JSZip.loadAsync(raw);
const parts = new Map();
let pPrFixed = 0;

// 5.1 · Esqueleto: tema, patrón, once diseños, propiedades y miniatura.
const KEEP_FROM_SKELETON = (name) =>
  name.startsWith('ppt/theme/') ||
  name.startsWith('ppt/slideLayouts/') ||
  name.startsWith('ppt/slideMasters/') ||
  name === 'ppt/presProps.xml' ||
  name === 'ppt/viewProps.xml' ||
  name === 'ppt/tableStyles.xml' ||
  name === 'docProps/thumbnail.jpeg' ||
  name === '_rels/.rels';

for (const name of walk(SKELETON)) {
  if (KEEP_FROM_SKELETON(name)) parts.set(name, fs.readFileSync(path.join(SKELETON, name)));
}

// 5.2 · Diapositivas, notas y medios: los que acaba de producir PptxGenJS.
const slideRe = /^ppt\/slides\/slide(\d+)\.xml$/;
const slideRelRe = /^ppt\/slides\/_rels\/slide(\d+)\.xml\.rels$/;
let mediaCount = 0;

for (const [name, entry] of Object.entries(src.files)) {
  if (entry.dir) continue;
  const buf = Buffer.from(await entry.async('nodebuffer'));

  if (slideRe.test(name) || name.startsWith('ppt/notesSlides/') || name.startsWith('ppt/notesMasters/')) {
    const fixed = fixDuplicateParagraphProps(buf.toString('utf8'));
    pPrFixed += fixed.removed;
    parts.set(name, Buffer.from(fixed.xml, 'utf8'));
  } else if (slideRelRe.test(name)) {
    // El diseño que PptxGenJS inventa se sustituye por el diseño en blanco del deck v1.
    parts.set(name, Buffer.from(buf.toString('utf8').replace(/slideLayouts\/slideLayout\d+\.xml/g, 'slideLayouts/slideLayout7.xml'), 'utf8'));
  } else if (name.startsWith('ppt/media/')) {
    parts.set(name, buf);
    mediaCount++;
  }
}

// El notesMaster debe apuntar al tema del deck v1.
parts.set(
  'ppt/notesMasters/_rels/notesMaster1.xml.rels',
  Buffer.from(
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
      `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
      `<Relationship Id="rId1" Type="${REL}/theme" Target="../theme/theme1.xml"/>` +
      `</Relationships>`,
    'utf8',
  ),
);

const slideNums = [...parts.keys()]
  .map((n) => slideRe.exec(n))
  .filter(Boolean)
  .map((m) => Number(m[1]))
  .sort((a, b) => a - b);

if (slideNums.length !== SLIDES.length) {
  throw new Error(`El paquete trae ${slideNums.length} diapositivas y el deck declara ${SLIDES.length}`);
}

// 5.3 · presentation.xml, con el estilo de texto por defecto del deck v1.
const skelPres = fs.readFileSync(path.join(SKELETON, 'ppt', 'presentation.xml'), 'utf8');
const defaultTextStyle = /<p:defaultTextStyle>[\s\S]*?<\/p:defaultTextStyle>/.exec(skelPres)?.[0] ?? '';

const RID = { master: 'rId1', presProps: 'rId2', viewProps: 'rId3', theme: 'rId4', tableStyles: 'rId5', notesMaster: 'rId6' };
const slideRid = (n) => `rId${100 + n}`;

parts.set(
  'ppt/presentation.xml',
  Buffer.from(
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
      `<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"` +
      ` xmlns:r="${REL}"` +
      ` xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"` +
      ` saveSubsetFonts="1" autoCompressPictures="0">` +
      `<p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="${RID.master}"/></p:sldMasterIdLst>` +
      `<p:notesMasterIdLst><p:notesMasterId r:id="${RID.notesMaster}"/></p:notesMasterIdLst>` +
      `<p:sldIdLst>` +
      slideNums.map((n) => `<p:sldId id="${255 + n}" r:id="${slideRid(n)}"/>`).join('') +
      `</p:sldIdLst>` +
      `<p:sldSz cx="12192000" cy="6858000"/>` +
      `<p:notesSz cx="6858000" cy="9144000"/>` +
      defaultTextStyle +
      `</p:presentation>`,
    'utf8',
  ),
);

parts.set(
  'ppt/_rels/presentation.xml.rels',
  Buffer.from(
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
      `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
      `<Relationship Id="${RID.master}" Type="${REL}/slideMaster" Target="slideMasters/slideMaster1.xml"/>` +
      `<Relationship Id="${RID.notesMaster}" Type="${REL}/notesMaster" Target="notesMasters/notesMaster1.xml"/>` +
      `<Relationship Id="${RID.presProps}" Type="${REL}/presProps" Target="presProps.xml"/>` +
      `<Relationship Id="${RID.viewProps}" Type="${REL}/viewProps" Target="viewProps.xml"/>` +
      `<Relationship Id="${RID.theme}" Type="${REL}/theme" Target="theme/theme1.xml"/>` +
      `<Relationship Id="${RID.tableStyles}" Type="${REL}/tableStyles" Target="tableStyles.xml"/>` +
      slideNums
        .map((n) => `<Relationship Id="${slideRid(n)}" Type="${REL}/slide" Target="slides/slide${n}.xml"/>`)
        .join('') +
      `</Relationships>`,
    'utf8',
  ),
);

// 5.4 · Propiedades del documento.
const iso = STAMP_DATE.toISOString().replace(/\.\d{3}Z$/, 'Z');
parts.set(
  'docProps/core.xml',
  Buffer.from(
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
      `<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"` +
      ` xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/"` +
      ` xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">` +
      `<dc:title>Clase 1 · ${esc(class1Meta.title)}</dc:title>` +
      `<dc:subject>Taller de IA y Prompting Jurídico · Programa DIAT · Escuela de Derecho PUCV</dc:subject>` +
      `<dc:creator>Programa DIAT · Escuela de Derecho PUCV</dc:creator>` +
      `<cp:keywords>DIAT; prompting jurídico; ICJR; canon v1.0; guion v2.0</cp:keywords>` +
      `<cp:lastModifiedBy>Programa DIAT</cp:lastModifiedBy>` +
      `<dcterms:created xsi:type="dcterms:W3CDTF">${iso}</dcterms:created>` +
      `<dcterms:modified xsi:type="dcterms:W3CDTF">${iso}</dcterms:modified>` +
      `<cp:revision>1</cp:revision>` +
      `</cp:coreProperties>`,
    'utf8',
  ),
);

parts.set(
  'docProps/app.xml',
  Buffer.from(
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
      `<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"` +
      ` xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">` +
      `<Application>Microsoft Office PowerPoint</Application>` +
      `<PresentationFormat>Presentación en pantalla (16:9)</PresentationFormat>` +
      `<Slides>${slideNums.length}</Slides>` +
      `<Notes>${slideNums.length}</Notes>` +
      `<Company>Pontificia Universidad Católica de Valparaíso</Company>` +
      `<AppVersion>12.0000</AppVersion>` +
      `</Properties>`,
    'utf8',
  ),
);

// 5.5 · [Content_Types].xml, reconstruido a partir de lo que hay en el paquete.
const layouts = [...parts.keys()].filter((n) => /^ppt\/slideLayouts\/slideLayout\d+\.xml$/.test(n)).sort();
const notesSlides = [...parts.keys()].filter((n) => /^ppt\/notesSlides\/notesSlide\d+\.xml$/.test(n)).sort();
const hasJpeg = [...parts.keys()].some((n) => /\.jpe?g$/i.test(n));
const hasPng = [...parts.keys()].some((n) => /\.png$/i.test(n));
const hasGif = [...parts.keys()].some((n) => /\.gif$/i.test(n));

parts.set(
  '[Content_Types].xml',
  Buffer.from(
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
      `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
      `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` +
      `<Default Extension="xml" ContentType="application/xml"/>` +
      (hasPng ? `<Default Extension="png" ContentType="image/png"/>` : '') +
      (hasJpeg ? `<Default Extension="jpeg" ContentType="image/jpeg"/><Default Extension="jpg" ContentType="image/jpeg"/>` : '') +
      (hasGif ? `<Default Extension="gif" ContentType="image/gif"/>` : '') +
      `<Override PartName="/ppt/presentation.xml" ContentType="${CT}.presentation.main+xml"/>` +
      `<Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="${CT}.slideMaster+xml"/>` +
      layouts.map((n) => `<Override PartName="/${n}" ContentType="${CT}.slideLayout+xml"/>`).join('') +
      slideNums.map((n) => `<Override PartName="/ppt/slides/slide${n}.xml" ContentType="${CT}.slide+xml"/>`).join('') +
      `<Override PartName="/ppt/notesMasters/notesMaster1.xml" ContentType="${CT}.notesMaster+xml"/>` +
      notesSlides.map((n) => `<Override PartName="/${n}" ContentType="${CT}.notesSlide+xml"/>`).join('') +
      `<Override PartName="/ppt/presProps.xml" ContentType="${CT}.presProps+xml"/>` +
      `<Override PartName="/ppt/viewProps.xml" ContentType="${CT}.viewProps+xml"/>` +
      `<Override PartName="/ppt/tableStyles.xml" ContentType="${CT}.tableStyles+xml"/>` +
      `<Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>` +
      `<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>` +
      `<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>` +
      (parts.has('docProps/thumbnail.jpeg') ? '' : '') +
      `</Types>`,
    'utf8',
  ),
);

// 5.6 · Comprobación de relaciones colgantes: es lo que rompe PowerPoint 2007.
for (const [name, buf] of parts) {
  if (!name.endsWith('.rels')) continue;
  const dir = name.replace(/_rels\/[^/]+$/, '');
  for (const m of buf.toString('utf8').matchAll(/Target="([^"]+)"[^>]*?(TargetMode="External")?\/>/g)) {
    if (m[2]) continue;
    const target = path.posix.normalize(path.posix.join(dir, m[1]));
    if (!parts.has(target)) {
      throw new Error(`Relación colgante en ${name}: ${m[1]} → ${target} no existe en el paquete`);
    }
  }
}
log(`✓ Paquete sin relaciones colgantes · ${parts.size} partes · ${mediaCount} medios`);
log(`✓ Saneado del XML: ${pPrFixed} <a:pPr> duplicados retirados`);

// ─── 6 · Reempaquetado ───────────────────────────────────────────────────────

const zip = new JSZip();
const order = (n) => (n === '[Content_Types].xml' ? 0 : n === '_rels/.rels' ? 1 : 2);
for (const name of [...parts.keys()].sort((a, b) => order(a) - order(b) || a.localeCompare(b))) {
  zip.file(name, parts.get(name), { createFolders: false, date: STAMP_DATE });
}
const out = Buffer.from(
  await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 9 }, platform: 'DOS' }),
);

fs.mkdirSync(OUT, { recursive: true });
const deckPath = path.join(OUT, DECK_NAME);
fs.writeFileSync(deckPath, out);
log(`✓ ${DECK_NAME} · ${(out.length / 1024).toFixed(0)} KB → ${deckPath}`);

// ─── 7 · Contenido textual ───────────────────────────────────────────────────

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const md = [];
md.push('# CLASS_1_PPT_CONTENT');
md.push('');
md.push('**Contenido textual del deck canónico de la Clase 1.** Generado por `scripts/class1/build-class1-deck.mjs`.');
md.push('Permite revisar las 30 diapositivas sin abrir PowerPoint. **No se edita a mano:** se edita el canon y se recompila.');
md.push('');
md.push(`Taller de IA y Prompting Jurídico · ${class1Meta.date} · ${class1Meta.time} · ${class1Meta.durationMin} minutos exactos`);
md.push('');
md.push('| # | Bloque | Hora | Función | Estado | Plataforma | Veredicto |');
md.push('|---|---|---|---|---|---|---|');
for (const s of SLIDES) {
  const b = blockOf(s);
  md.push(
    `| ${String(s.n).padStart(2, '0')} | ${b.code} | ${s.at} | ${s.fn} | ${STATE_LABEL[s.state]} | ${platformRoute(s) ?? '—'} | ${s.verdict} |`,
  );
}
md.push('');
md.push('---');
md.push('');
for (const s of SLIDES) {
  const b = blockOf(s);
  md.push(`## Slide ${String(s.n).padStart(2, '0')} · ${s.title}`);
  md.push('');
  md.push(`**Antetítulo** · ${s.kicker}`);
  md.push('');
  md.push(`**Bloque** · ${b.code} — ${b.title} · ${blockClock(b)}`);
  md.push('');
  md.push(`**Función** · ${s.fn} · **Estado de clase** · ${STATE_LABEL[s.state]}`);
  md.push('');
  md.push(`**Ruta** · ${platformRoute(s) ?? '— (no hay trabajo de plataforma en esta diapositiva)'}`);
  md.push('');
  md.push(`**Objetivo cognitivo** · ${s.cognitive}`);
  md.push('');
  md.push(`**Contenido proyectado** · ${s.sees}`);
  md.push('');
  md.push(`**Nota docente** · ${s.teacher}`);
  md.push('');
  md.push(`**Acción del estudiante** · ${s.student}`);
  if (s.dependency) {
    md.push('');
    md.push(`**Dependencia** · ${s.dependency}`);
  }
  md.push('');
  md.push(`**Fuente** · ${s.source}`);
  md.push('');
  md.push(`**Veredicto** · ${s.verdict} — ${s.change}`);
  md.push('');
  md.push('<details><summary>Notas del orador incrustadas en el archivo</summary>');
  md.push('');
  md.push('```text');
  md.push(notesFor(s));
  md.push('```');
  md.push('');
  md.push('</details>');
  md.push('');
  md.push('---');
  md.push('');
}
const mdPath = path.resolve(OUT, '..', 'CLASS_1_PPT_CONTENT.md');
fs.writeFileSync(mdPath, md.join('\n'), 'utf8');
log(`✓ CLASS_1_PPT_CONTENT.md → ${mdPath}`);

// ─── 8 · Arquitectura del deck ───────────────────────────────────────────────

const flow = [];
flow.push('# CLASS_1_DECK_FLOW');
flow.push('');
flow.push('**Arquitectura de las 30 diapositivas de la Clase 1.**');
flow.push('Generado desde `src/content/class1/deck.ts`, que es la especificación. Si el deck y este');
flow.push('documento divergieran, el problema sería del generador, no del documento: **no se edita a mano.**');
flow.push('');
flow.push('Deriva de la Matriz canónica v1.0, la Matriz de ejecución v1.0, el Guion docente v2.0 y la');
flow.push('Especificación de la presentación v2.0.');
flow.push('');
flow.push('## Regla editorial');
flow.push('');
flow.push('| Si… | Entonces |');
flow.push('|---|---|');
flow.push('| el profesor necesita **decirlo** | Guion. No va a la diapositiva. |');
flow.push('| el estudiante necesita **verlo, compararlo o recordarlo** | Diapositiva. |');
flow.push('| el estudiante necesita **decidirlo, escribirlo o registrarlo** | Plataforma. La diapositiva indica cuándo. |');
flow.push('| el estudiante necesita **conservarlo después** | Manual. |');
flow.push('');
flow.push('## Funciones · una por diapositiva');
flow.push('');
const FN_DESC = {
  ANCLA: 'Una idea. Ocupa la pantalla entera.',
  DIAGRAMA: 'Una relación entre elementos.',
  CASO: 'Evidencia: un caso, una tabla de hechos, una cita real.',
  CONSIGNA: 'Qué debe hacer el estudiante, y dónde.',
  DEMOSTRACION: 'Qué debe observar mientras el profesor opera.',
  SINTESIS: 'Qué queda aprendido.',
};
flow.push('| Función | Qué es | Diapositivas |');
flow.push('|---|---|---|');
for (const [fn, desc] of Object.entries(FN_DESC)) {
  const ns = SLIDES.filter((s) => s.fn === fn).map((s) => String(s.n).padStart(2, '0'));
  flow.push(`| ${fn} | ${desc} | ${ns.join(' · ') || '—'} |`);
}
flow.push('');
flow.push('## Estados de clase');
flow.push('');
flow.push('El filete de color del borde izquierdo y el rótulo del pie dicen quién tiene la palabra, sin que el profesor lo anuncie.');
flow.push('');
flow.push('| Estado | Rótulo | Diapositivas |');
flow.push('|---|---|---|');
for (const st of ['ESCUCHAS', 'OBSERVAS', 'TRABAJAS']) {
  const ns = SLIDES.filter((s) => s.state === st).map((s) => String(s.n).padStart(2, '0'));
  flow.push(`| ${st} | ${STATE_LABEL[st]} | ${ns.join(' · ')} |`);
}
flow.push('');
flow.push('## Veredicto respecto del deck v1');
flow.push('');
flow.push('| Veredicto | N.º | Diapositivas |');
flow.push('|---|---|---|');
for (const v of ['CONSERVAR', 'AJUSTAR', 'RECONSTRUIR']) {
  const ns = SLIDES.filter((s) => s.verdict === v).map((s) => String(s.n).padStart(2, '0'));
  flow.push(`| ${v} | ${ns.length} | ${ns.join(' · ')} |`);
}
flow.push('');
flow.push('---');
flow.push('');
for (const s of SLIDES) {
  const b = blockOf(s);
  flow.push(`## SLIDE ${String(s.n).padStart(2, '0')}`);
  flow.push('');
  flow.push('```text');
  flow.push(`TÍTULO`);
  flow.push(s.title);
  flow.push('');
  flow.push('BLOQUE');
  flow.push(`${b.code} · ${b.title} · ${blockClock(b)}`);
  flow.push('');
  flow.push('FUNCIÓN');
  flow.push(`${s.fn} — ${FN_DESC[s.fn]}`);
  flow.push('');
  flow.push('ESTADO DE CLASE');
  flow.push(STATE_LABEL[s.state]);
  flow.push('');
  flow.push('OBJETIVO COGNITIVO');
  flow.push(s.cognitive);
  flow.push('');
  flow.push('QUÉ VE EL ESTUDIANTE');
  flow.push(s.sees);
  flow.push('');
  flow.push('QUÉ HACE EL DOCENTE');
  flow.push(s.teacher);
  flow.push('');
  flow.push('QUÉ HACE EL ESTUDIANTE');
  flow.push(s.student);
  flow.push('');
  flow.push('PLATAFORMA');
  flow.push(platformRoute(s) ?? '— (esta diapositiva no abre trabajo de plataforma)');
  flow.push('');
  flow.push('MOMENTO Y DURACIÓN APROX.');
  flow.push(`${s.at} · ${s.minutes} min en pantalla`);
  flow.push('');
  flow.push('DEPENDENCIA');
  flow.push(s.dependency ?? '—');
  flow.push('');
  flow.push('FUENTE');
  flow.push(s.source);
  flow.push('');
  flow.push('VEREDICTO');
  flow.push(`${s.verdict} — ${s.change}`);
  flow.push('```');
  flow.push('');
}
const flowPath = path.resolve(OUT, '..', 'CLASS_1_DECK_FLOW.md');
fs.writeFileSync(flowPath, flow.join('\n'), 'utf8');
log(`✓ CLASS_1_DECK_FLOW.md → ${flowPath}`);

log('\nListo. Siguiente paso: renderizar y auditar.');
log('  powershell -File scripts/class1/render-deck.ps1');
log('  node --experimental-strip-types --import ./scripts/class1/ts-resolve.mjs scripts/class1/audit-class1-deck.mjs');
