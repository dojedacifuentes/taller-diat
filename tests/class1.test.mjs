import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, {
  alias: { '@': path.resolve(process.cwd(), 'src') },
});

const { BLOCKS } = await jiti.import('../src/content/class1/manifest.ts');
const {
  clearState, createInitialState, loadState, migrate, saveState, SCHEMA_VERSION, STORAGE_KEY,
} = await jiti.import('../src/lib/class1/state.ts');
const { blockProgress, computeProgress } = await jiti.import('../src/lib/class1/progress.ts');
const { bitacoraData, bitacoraFilename, generateBitacoraPDF } = await jiti.import('../src/lib/class1/bitacoraPdf.ts');
const { deliveryMailto, deliverySubject } = await jiti.import('../src/lib/class1/delivery.ts');

test('el manifest define B00–B09 una sola vez y cubre 90 minutos', () => {
  assert.equal(BLOCKS.length, 10);
  assert.deepEqual(BLOCKS.map(block => block.id), Array.from({ length: 10 }, (_, i) => `b0${i}`));
  assert.equal(new Set(BLOCKS.map(block => block.id)).size, 10);
  assert.equal(BLOCKS[0].from, 0);
  assert.equal(BLOCKS.at(-1).to, 90);
  BLOCKS.slice(1).forEach((block, index) => assert.equal(block.from, BLOCKS[index].to));
});

test('la migración conserva la auditoría antigua y restablece invariantes', () => {
  const migrated = migrate({
    schemaVersion: 1,
    b05: { excerpt: 'Auditoría heredada' },
    b08: { claims: [] },
  });
  assert.equal(migrated.schemaVersion, SCHEMA_VERSION);
  assert.equal(migrated.b05.audit, 'Auditoría heredada');
  assert.equal(migrated.b08.claims.length, 2);
  assert.equal(migrated.productA.decisions.length, 3);
});

test('Producto A exige tres decisiones justificadas y no delegación', () => {
  const state = createInitialState();
  state.productA = {
    task: 'Revisar contrato',
    risk: 'medio',
    notDelegating: 'Validez de las fuentes',
    components: ['tarea'],
    prompt: 'Extrae y localiza cada cláusula.',
    decisions: ['Usar tabla', 'Citar cláusula', 'Separar dudas'],
    reasons: ['Comparar', 'Trazar', 'No suponer'],
  };
  assert.equal(blockProgress(state, 'b04').status, 'completado');
  state.productA.reasons[2] = '';
  assert.equal(blockProgress(state, 'b04').status, 'en-curso');
});

test('B05 exige pegar la auditoría externa y fundamentar aceptación y rechazo', () => {
  const state = createInitialState();
  state.b05 = {
    tool: 'chatgpt',
    audit: 'La herramienta identificó dos supuestos.',
    accepted: 'Agregar localizadores',
    acceptedWhy: 'Permite contrastar',
    rejected: 'Inventar el contexto faltante',
    rejectedWhy: 'Aumenta el riesgo',
  };
  assert.equal(blockProgress(state, 'b05').status, 'completado');
  state.b05.audit = '';
  assert.equal(blockProgress(state, 'b05').status, 'en-curso');
});

test('Producto B exige fuente y localizador en dos afirmaciones', () => {
  const state = createInitialState();
  for (const claim of state.b08.claims) {
    Object.assign(claim, {
      claim: 'Afirmación verificable',
      status: 'hecho',
      source: 'Sentencia pública',
      locator: 'Considerando 4.º',
      state: 'verificada',
      action: 'incorporar',
    });
  }
  assert.equal(blockProgress(state, 'b08').status, 'completado');
  state.b08.claims[1].locator = '';
  assert.equal(blockProgress(state, 'b08').status, 'en-curso');
});

test('la entrega solo queda lista con identidad y productos A, B y C', () => {
  const state = createInitialState();
  state.student = { firstName: 'Diego', lastName: 'Ojeda', email: 'diego@pucv.cl' };
  state.productA = {
    task: 'Revisar contrato', risk: 'medio', notDelegating: 'Fuentes', components: ['tarea'],
    prompt: 'Extrae con localizador.', decisions: ['a', 'b', 'c'], reasons: ['a', 'b', 'c'],
  };
  state.b08.claims.forEach(claim => Object.assign(claim, {
    claim: 'Afirmación', status: 'hecho', source: 'Fuente', locator: 'p. 1',
    state: 'verificada', action: 'incorporar',
  }));
  state.b09 = { ...state.b09, committed: true, before: 'La IA', after: 'Quien firma' };
  assert.equal(computeProgress(state).readyToDeliver, true);
  state.student.email = '';
  assert.equal(computeProgress(state).readyToDeliver, false);
});

test('el roundtrip persistido conserva B00 y los productos A, B y C', () => {
  const state = createInitialState();
  state.b00 = { blame: 'profesional', confidence: 'alto', committed: true, at: '2026-08-27T15:01:00Z' };
  state.productA.prompt = 'Prompt A persistido';
  state.b08.claims[0].claim = 'Producto B persistido';
  state.b09 = { ...state.b09, before: 'Antes', after: 'Ahora', doubt: 'Duda' };
  const restored = migrate(JSON.parse(JSON.stringify(state)));
  assert.equal(restored.b00.blame, 'profesional');
  assert.equal(restored.productA.prompt, 'Prompt A persistido');
  assert.equal(restored.b08.claims[0].claim, 'Producto B persistido');
  assert.deepEqual(
    [restored.b09.before, restored.b09.after, restored.b09.doubt],
    ['Antes', 'Ahora', 'Duda'],
  );
});

test('save/load conserva el estado y reset elimina solo la clave de Clase 1', () => {
  const previousWindow = globalThis.window;
  const storage = new Map([['otra.clave', 'intacta']]);
  globalThis.window = {
    localStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: key => storage.delete(key),
    },
  };
  try {
    const state = createInitialState();
    state.productA.prompt = 'Persistido en localStorage';
    saveState(state);
    assert.equal(loadState().productA.prompt, 'Persistido en localStorage');
    assert.ok(storage.has(STORAGE_KEY));
    clearState();
    assert.equal(storage.has(STORAGE_KEY), false);
    assert.equal(storage.get('otra.clave'), 'intacta');
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});

test('el mapeo del PDF contiene identidad, A, auditoría, ICJR y reflexión', async () => {
  const state = createInitialState();
  state.student = { firstName: 'Diego', lastName: 'Ojeda', email: 'diego@pucv.cl' };
  state.b00 = { blame: 'profesional', confidence: 'alto', committed: true, at: '2026-08-27T15:01:00Z' };
  state.productA.prompt = 'Analiza únicamente la fuente adjunta.';
  state.productA.decisions[0] = 'Exigir localizador';
  state.productA.reasons[0] = 'Permite contrastar';
  state.b05.audit = 'Auditoría completa';
  Object.assign(state.b08.claims[0], { claim: 'Afirmación ICJR', source: 'Fuente oficial', locator: 'p. 4' });
  state.b09 = { ...state.b09, before: 'Confiaba en la forma', after: 'Verifico la fuente', doubt: 'Alcance' };
  const data = bitacoraData(state);
  assert.equal(data.identity.name, 'Diego Ojeda');
  assert.equal(data.productA.prompt, 'Analiza únicamente la fuente adjunta.');
  assert.deepEqual(data.productA.decisions[0], { decision: 'Exigir localizador', reason: 'Permite contrastar' });
  assert.equal(data.audit.audit, 'Auditoría completa');
  assert.equal(data.icjr.claims[0].claim, 'Afirmación ICJR');
  assert.equal(data.productC.initial.blame, 'profesional');
  assert.equal(data.productC.final.after, 'Verifico la fuente');
  const pdf = await generateBitacoraPDF(state, computeProgress(state));
  assert.equal(pdf.type, 'application/pdf');
  assert.ok(pdf.size > 10_000);
});

test('nombre de archivo y correo de entrega son deterministas', () => {
  const state = createInitialState();
  state.student = { firstName: 'Diego', lastName: 'Ojeda', email: 'diego@pucv.cl' };
  assert.equal(bitacoraFilename(state), 'DIAT_CLASE1_Ojeda_Diego_2026-08-27.pdf');
  assert.equal(deliverySubject(state), 'DIAT · Clase 1 · Entrega · Diego Ojeda');
  const mailto = deliveryMailto(state);
  assert.match(mailto, /^mailto:/);
  assert.match(decodeURIComponent(mailto), /DIAT · Clase 1 · Entrega · Diego Ojeda/);
  assert.match(decodeURIComponent(mailto), /DIAT_CLASE1_Ojeda_Diego_2026-08-27.pdf/);
});
