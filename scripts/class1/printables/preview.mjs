// ─────────────────────────────────────────────────────────────────────────────
// QA VISUAL DE LOS IMPRIMIBLES
//
//   node --experimental-strip-types --import ./scripts/class1/ts-resolve.mjs \
//        scripts/class1/printables/preview.mjs
//
// Rasteriza cada página a PNG para revisarla antes de mandar a imprimir. Un PDF
// que compila no es un PDF que se puede rellenar a mano: hay que mirarlo.
//
// Genera además una versión en escala de grises, porque la mitad de las copias
// van a salir de una impresora en blanco y negro.
// ─────────────────────────────────────────────────────────────────────────────
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..', '..');
const SRC = path.join(REPO, 'public', 'descargas');
const OUT = path.join(os.tmpdir(), 'diat-preview');

function findChrome() {
  const c = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  ].filter(Boolean).find(p => fs.existsSync(p));
  if (!c) throw new Error('Sin Chrome. Define CHROME_PATH.');
  return c;
}

const CHROME = findChrome();
fs.mkdirSync(OUT, { recursive: true });

/**
 * Se rasteriza desde el HTML, no desde el PDF: Chrome headless no exporta
 * páginas de un PDF a imagen, pero sí captura el HTML que lo originó, que es
 * exactamente la misma composición.
 */
const pieces = process.argv.slice(2).filter(a => !a.startsWith('--'));
const targets = (pieces.length ? pieces : ['DIAT_Clase1_Ruta_Analogica', 'DIAT_Clase1_Ficha_Imprimible'])
  .map(n => path.join(SRC, `${n}.html`))
  .filter(f => fs.existsSync(f));

const GRAY = process.argv.includes('--gray');

for (const htmlFile of targets) {
  const name = path.basename(htmlFile, '.html');
  const raw = fs.readFileSync(htmlFile, 'utf8');

  // Cada .page se captura por separado, a tamaño A4 real (210 × 297 mm a 96 dpi
  // ≈ 794 × 1123 px). Se aísla la página pedida ocultando la otra.
  for (const n of [1, 2]) {
    const isolated = raw.replace(
      '</style>',
      `.page:nth-of-type(${n === 1 ? 2 : 1}) { display: none !important; }
       body { margin: 0; padding: 11mm; width: 210mm; }
       ${GRAY ? 'html { filter: grayscale(100%) contrast(1.05); }' : ''}
       </style>`,
    );
    const tmp = path.join(OUT, `${name}-p${n}.html`);
    fs.writeFileSync(tmp, isolated, 'utf8');

    const png = path.join(OUT, `${name}-p${n}${GRAY ? '-gray' : ''}.png`);
    execFileSync(CHROME, [
      '--headless', '--disable-gpu', '--no-sandbox',
      '--hide-scrollbars',
      '--window-size=794,1123',
      '--force-device-scale-factor=2',
      '--run-all-compositor-stages-before-draw',
      '--virtual-time-budget=8000',
      `--screenshot=${png}`,
      `file:///${tmp.replace(/\\/g, '/')}`,
    ], { stdio: 'pipe' });

    console.log(png);
  }
}
