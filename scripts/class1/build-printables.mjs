// ─────────────────────────────────────────────────────────────────────────────
// IMPRIMIBLES DE CLASE 1
//
//   npm run build:class1-print
//
// Genera las dos piezas físicas de la sesión y las deja en public/descargas,
// desde donde /clase-1 las ofrece:
//
//   · DIAT_Clase1_Ruta_Analogica.pdf   → hacer las actividades sin dispositivo
//   · DIAT_Clase1_Ficha_Imprimible.pdf → recordar la arquitectura de la clase
//
// El contenido sustantivo NO se escribe aquí: se importa de activities.ts y
// manifest.ts, que son el canon. Si una formulación cambia allí, cambia en el
// papel al siguiente build, y no hay forma de que el impreso contradiga a la
// plataforma sin que alguien lo haya hecho a propósito.
//
// Chrome imprime el PDF. Es el mismo motor que compone la web, así que el
// resultado es vectorial, con fuentes incrustadas y sin sorpresas de layout.
// ─────────────────────────────────────────────────────────────────────────────
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import QRCode from 'qrcode';

import { rutaAnalogicaHTML } from './printables/ruta-analogica.mjs';
import { fichaHTML } from './printables/ficha.mjs';
import { guionHTML } from './printables/guion.mjs';

import {
  diatComponents, controlInstructions, icjrPhases, epistemicStatuses,
  claimStates, claimActions, warningSignals, errorTypes, riskLevels,
  diagnosisPrompt, notVerifiedRule, icjrPriority, solvedRow,
} from '../../src/content/class1/activities.ts';
import { class1Meta, CLASS_ORIGIN, CLASS_ROOT } from '../../src/content/class1/manifest.ts';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
const OUT = path.join(REPO, 'public', 'descargas');
const ASSETS = path.join(HERE, 'assets');

const log = (...a) => console.log(...a);

// ─── 1 · Canon ───────────────────────────────────────────────────────────────

const canon = {
  diatComponents, controlInstructions, icjrPhases, epistemicStatuses,
  claimStates, claimActions, warningSignals, errorTypes, riskLevels,
  diagnosisPrompt, notVerifiedRule, icjrPriority, solvedRow,
  meta: {
    date: class1Meta.date,
    idea: class1Meta.idea,
    thesis: class1Meta.thesis,
    flow: class1Meta.flow,
    rules: class1Meta.rules,
    anchors: class1Meta.anchors,
  },
};

/**
 * Guardas de canon. Se ejecutan antes de componer: más vale no generar el PDF
 * que imprimir trescientas copias de una matriz con seis columnas.
 */
function canonErrors() {
  const e = [];
  const expectComponents = ['Contexto', 'Rol', 'Tarea', 'Fuentes', 'Restricciones', 'Formato', 'Control'];
  const actual = canon.diatComponents.map(c => c.label);
  if (actual.join('|') !== expectComponents.join('|')) {
    e.push(`Los siete componentes DIAT no coinciden con el canon: ${actual.join(', ')}`);
  }
  if (canon.icjrPhases.map(p => p.letter).join('') !== 'ICJR') {
    e.push('Las cuatro fases de ICJR no están en orden I·C·J·R.');
  }
  if (canon.icjrPhases.map(p => p.name).join('|') !== 'Identificar|Contrastar|Justificar|Registrar') {
    e.push('Los nombres de las fases ICJR no son los canónicos.');
  }
  if (canon.epistemicStatuses.map(s => s.id).join('') !== 'ABCDE') {
    e.push('Los cinco estatus epistémicos no son A–E.');
  }
  if (canon.meta.rules.length !== 3) e.push(`Hay ${canon.meta.rules.length} reglas finales; deben ser 3.`);
  if (canon.warningSignals.length !== 7) e.push(`Hay ${canon.warningSignals.length} señales de alerta; deben ser 7.`);
  if (canon.controlInstructions.length !== 7) e.push('Las instrucciones de control no son siete.');
  if (canon.errorTypes.length !== 4) e.push('Los tipos de error no son cuatro.');
  return e;
}

const errs = canonErrors();
if (errs.length) {
  console.error('\n✗ CANON ROTO — no se genera nada:\n' + errs.map(x => '  · ' + x).join('\n') + '\n');
  process.exit(1);
}
log('✓ Canon verificado: 7 componentes · ICJR · 5 estatus · 7 señales · 3 reglas');

// ─── 2 · Assets ──────────────────────────────────────────────────────────────

/** Los logos van incrustados: el PDF tiene que abrirse en cualquier máquina. */
function dataUri(file, mime) {
  return `data:${mime};base64,${fs.readFileSync(path.join(ASSETS, file)).toString('base64')}`;
}

const logoDiat = dataUri('diat-cuadrado.png', 'image/png');
const logoEscuela = dataUri('escuela.jpg', 'image/jpeg');

/**
 * QR de la ficha. Complemento, nunca requisito: la hoja se entiende entera sin
 * escanearlo. Se genera desde la ruta de plataforma declarada en el manifest,
 * así que no puede apuntar a una URL inventada.
 */
const CLASS_URL = `${CLASS_ORIGIN}${CLASS_ROOT}`;
const qr = await QRCode.toDataURL(CLASS_URL, {
  errorCorrectionLevel: 'M',
  margin: 1,
  scale: 8,
  color: { dark: '#1A202CFF', light: '#FFFFFFFF' },
});
log(`✓ QR generado desde el manifest → ${CLASS_URL}`);

// ─── 3 · Chrome ──────────────────────────────────────────────────────────────

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].filter(Boolean);
  const found = candidates.find(c => { try { return fs.existsSync(c); } catch { return false; } });
  if (!found) {
    throw new Error(
      'No se encontró Chrome ni Edge. Define CHROME_PATH con la ruta al ejecutable.',
    );
  }
  return found;
}

const CHROME = findChrome();
log(`✓ Motor de impresión: ${path.basename(CHROME)}`);

function renderPDF(html, outFile, label) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'diat-print-'));
  const htmlFile = path.join(tmp, 'doc.html');
  fs.writeFileSync(htmlFile, html, 'utf8');

  execFileSync(CHROME, [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--no-pdf-header-footer',
    '--run-all-compositor-stages-before-draw',
    '--virtual-time-budget=10000',
    `--print-to-pdf=${outFile}`,
    `file:///${htmlFile.replace(/\\/g, '/')}`,
  ], { stdio: 'pipe' });

  // Se conserva el HTML junto al PDF: es la fuente editable de la pieza.
  fs.writeFileSync(outFile.replace(/\.pdf$/, '.html'), html, 'utf8');

  const size = fs.statSync(outFile).size;
  const pages = countPages(outFile);
  log(`✓ ${label} · ${pages} pág. · ${(size / 1024).toFixed(0)} KB → ${path.relative(REPO, outFile)}`);
  return { pages, size };
}

/** Cuenta páginas leyendo el propio PDF. No se confía en que sean dos: se comprueba. */
function countPages(file) {
  const buf = fs.readFileSync(file);
  const text = buf.toString('latin1');
  const counts = [...text.matchAll(/\/Type\s*\/Page[^s]/g)].length;
  const declared = [...text.matchAll(/\/Count\s+(\d+)/g)].map(m => Number(m[1]));
  return counts || (declared.length ? Math.max(...declared) : 0);
}

// ─── 4 · Composición ─────────────────────────────────────────────────────────

fs.mkdirSync(OUT, { recursive: true });

/** `--only=ruta` o `--only=ficha` para iterar sobre una pieza sin rehacer la otra. */
const only = (process.argv.find(a => a.startsWith('--only=')) ?? '').split('=')[1];

const PIECES = [
  {
    id: 'ruta',
    name: 'Ruta analógica',
    file: 'DIAT_Clase1_Ruta_Analogica.pdf',
    html: () => rutaAnalogicaHTML({ canon, logoDiat }),
  },
  {
    id: 'ficha',
    name: 'Ficha imprimible',
    file: 'DIAT_Clase1_Ficha_Imprimible.pdf',
    html: () => fichaHTML({ canon, logoDiat, logoEscuela, qr }),
  },
  {
    id: 'guion',
    name: 'Guion docente de sala',
    file: 'DIAT_C1_Guion_Docente_Sala_v2.2.pdf',
    // El guion no son dos páginas: es el documento que el profesor lleva en la
    // mano y crece con la clase. Se exime del control de dos páginas.
    pages: null,
    html: () => guionHTML({ canon, logoDiat, logoEscuela }),
  },
];

const results = PIECES
  .filter(p => !only || p.id === only)
  .map(p => ({ ...p, ...renderPDF(p.html(), path.join(OUT, p.file), p.name) }));

// ─── 5 · Control de salida ───────────────────────────────────────────────────

const bad = results.filter(r => r.pages !== 2 && r.pages !== undefined && PIECES.find(p => p.id === r.id)?.pages !== null);
if (bad.length) {
  console.error(
    `\n✗ ${bad.map(b => `${b.name} tiene ${b.pages} páginas`).join('; ')}. Deben ser exactamente 2.\n` +
    '  Revisa el desbordamiento en scripts/class1/printables/.\n',
  );
  process.exit(1);
}

log('\n✓ Listo para imprimir.');
