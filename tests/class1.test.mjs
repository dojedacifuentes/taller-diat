// ─────────────────────────────────────────────────────────────────────────────
// CLASE 1 · PRUEBAS
//
//   npm run test:class1
//
// Corren en el build remoto de Vercel antes de publicar: si una falla, no se
// despliega. Cubren lo que no puede romperse sin que la clase deje de funcionar:
// el estado del estudiante, el reparto de los 90 minutos y el documento de
// entrega, que es lo único que sale de la sesión.
//
// Incluye la regla dura del compilador —«lo que se copia, se ejecuta»— para que
// el build remoto no dependa de flags experimentales de Node.
// ─────────────────────────────────────────────────────────────────────────────
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, {
  alias: { '@': path.resolve(process.cwd(), 'src') },
});

const { BLOCKS } = await jiti.import('../src/content/class1/manifest.ts');
const { STAGES, STAGE_IDS, getStage } = await jiti.import('../src/content/class1/stages.ts');
const { RUN_OF_SHOW, runOfShowErrors, timeSplit } = await jiti.import('../src/content/class1/runofshow.ts');
const { class1ActivityDurations } = await jiti.import('../src/content/class1/timers.ts');
const { compilePrompt, emptyDraft, applyTaskDefaults, taskPresets } = await jiti.import('../src/content/class1/lab.ts');
const {
  clearState, createInitialState, currentPrompt, loadState, migrate, saveState,
  SCHEMA_VERSION, STORAGE_KEY,
} = await jiti.import('../src/lib/class1/state.ts');
const { computeProgress, stageProgress } = await jiti.import('../src/lib/class1/progress.ts');
const {
  buildClass1Submission, renderSubmissionMarkdown, submissionFilename,
} = await jiti.import('../src/lib/class1/submission.ts');
const { SUBMISSION_SUBJECT, fallbackMailto } = await jiti.import('../src/lib/class1/delivery.ts');

// ─── Superficie visible ──────────────────────────────────────────────────────

test('la portada ofrece accesos visibles a la experiencia de Clase 1', () => {
  const landingPage = readFileSync(path.resolve(process.cwd(), 'src/app/page.tsx'), 'utf8');
  assert.match(landingPage, /href="\/clase-1"/);
  assert.match(landingPage, /Entrar a la Clase 1/);
  assert.match(landingPage, /Abrir Clase 1 interactiva/);
});

test('la plataforma expone cinco etapas y ninguna ruta de bloque', () => {
  assert.equal(STAGES.length, 5);
  assert.deepEqual(STAGE_IDS, ['pregunta', 'prompt', 'auditoria', 'verificacion', 'cierre']);
  assert.equal(getStage('pregunta').route, '/clase-1');
  for (const stage of STAGES) {
    assert.doesNotMatch(stage.route, /\/clase-1\/b0\d/, `${stage.id} apunta a una ruta retirada`);
    assert.ok(stage.brief.length > 0, `${stage.id} no tiene consigna`);
  }
});

test('ninguna etapa muestra al estudiante la nomenclatura interna de bloques', () => {
  for (const stage of STAGES) {
    const surface = `${stage.label} ${stage.title} ${stage.brief}`;
    assert.doesNotMatch(surface, /\bB0\d\b/, `${stage.id} nombra un bloque`);
  }
});

// ─── Reparto de los 90 minutos ───────────────────────────────────────────────

test('el manifest define B00–B09 una sola vez y cubre 90 minutos', () => {
  assert.equal(BLOCKS.length, 10);
  assert.deepEqual(BLOCKS.map(block => block.id), Array.from({ length: 10 }, (_, i) => `b0${i}`));
  assert.equal(new Set(BLOCKS.map(block => block.id)).size, 10);
  assert.equal(BLOCKS[0].from, 0);
  assert.equal(BLOCKS.at(-1).to, 90);
  BLOCKS.slice(1).forEach((block, index) => assert.equal(block.from, BLOCKS[index].to));
});

test('el reparto cuadra: sin huecos, sin solapes y con las etapas cabiendo dentro', () => {
  assert.deepEqual(runOfShowErrors(), []);
  const split = timeSplit();
  assert.equal(split.total, 90);
  assert.equal(split.platform + split.teacher, 90);
});

test('cada etapa de plataforma se abre en un solo tramo y con su cronómetro real', () => {
  const staged = RUN_OF_SHOW.filter(segment => segment.stage);
  assert.equal(staged.length, 5);
  assert.equal(new Set(staged.map(segment => segment.stage)).size, 5);
  for (const segment of staged) {
    const minutes = class1ActivityDurations[segment.stage] / 60;
    assert.ok(minutes > 0, `${segment.stage} sin duración`);
    assert.ok(
      (segment.stageAt ?? segment.from) + minutes <= segment.to,
      `${segment.stage} no cabe en su tramo`,
    );
  }
});

// ─── La regla dura: lo que se copia, se ejecuta ──────────────────────────────

// Marcador = corchete por rellenar. `[INFERENCIA]` es una etiqueta que la IA
// debe escribir, no un hueco que el estudiante deba completar.
const PLACEHOLDER = /\[(?!INFERENCIA\])[^\]]*\]/;

test('sin las decisiones esenciales no se exporta nada, y se dice qué falta', () => {
  const compiled = compilePrompt(emptyDraft());
  assert.equal(compiled.ready, false);
  assert.equal(compiled.text, '');
  assert.equal(compiled.missing.length, 3);
});

test('toda tarea del catálogo produce un prompt ejecutable y sin marcadores', () => {
  for (const preset of taskPresets) {
    let draft = applyTaskDefaults(emptyDraft(), preset.id);
    draft = { ...draft, taskDetail: 'Detalle concreto.', purpose: 'Para un informe interno.' };
    if (draft.source === 'pegar') draft = { ...draft, material: 'TEXTO DE PRUEBA' };
    const compiled = compilePrompt(draft);
    assert.equal(compiled.ready, true, `${preset.id} no exporta: ${compiled.missing.join(', ')}`);
    assert.doesNotMatch(compiled.text, PLACEHOLDER, `${preset.id} exporta un marcador`);
  }
});

test('el material pegado viaja dentro del prompt, entre delimitadores', () => {
  const draft = { ...applyTaskDefaults(emptyDraft(), 'resumir'), taskDetail: 'x', material: 'CONTENIDO REAL' };
  const compiled = compilePrompt(draft);
  assert.match(compiled.text, /CONTENIDO REAL/);
  assert.match(compiled.text, /<<<INICIO DEL MATERIAL>>>/);
  assert.match(compiled.text, /<<<FIN DEL MATERIAL>>>/);
  assert.match(compiled.text, /Trabaja exclusivamente con el material delimitado/);
  assert.equal(compiled.warning, undefined);
});

test('sin material pegado no se exporta', () => {
  const compiled = compilePrompt({ ...applyTaskDefaults(emptyDraft(), 'resumir'), taskDetail: 'x' });
  assert.equal(compiled.ready, false);
  assert.ok(compiled.missing.includes('el contenido sobre el que trabajará la IA'));
});

test('el modo adjunto advierte en pantalla y lo dice dentro del prompt', () => {
  const compiled = compilePrompt({
    ...applyTaskDefaults(emptyDraft(), 'analizar-sentencia'),
    taskDetail: 'x',
    source: 'adjuntar',
  });
  assert.equal(compiled.ready, true);
  assert.match(compiled.warning, /adjuntar el documento/);
  assert.match(compiled.text, /documento que adjunto en este mismo mensaje/);
  assert.match(compiled.text, /no continúes/);
});

test('el rol solo aparece si el estudiante lo pide, y va primero', () => {
  const draft = { ...applyTaskDefaults(emptyDraft(), 'resumir'), taskDetail: 'x', material: 'X' };
  assert.doesNotMatch(compilePrompt(draft).text, /Actúa como/);
  const conRol = compilePrompt({ ...draft, extras: { ...draft.extras, role: 'ayudante de Derecho civil' } });
  assert.match(conRol.text, /^Actúa como ayudante de Derecho civil\./);
});

test('sin restricciones ni control no se imprimen secciones vacías', () => {
  const compiled = compilePrompt({
    ...applyTaskDefaults(emptyDraft(), 'resumir'),
    taskDetail: 'x',
    material: 'X',
    constraints: [],
    controls: [],
  });
  assert.equal(compiled.ready, true);
  assert.doesNotMatch(compiled.text, /RESTRICCIONES/);
  assert.doesNotMatch(compiled.text, /CONTROL/);
});

// ─── Estado del estudiante ───────────────────────────────────────────────────

test('la migración rescata el trabajo hecho con la arquitectura de bloques', () => {
  const migrated = migrate({
    schemaVersion: 1,
    student: { firstName: 'Ana', lastName: 'Pérez', email: 'ana@pucv.cl' },
    b00: { blame: 'ia', confidence: 'medio', committed: true },
    productA: { task: 'Revisar contrato', prompt: 'Mi prompt anterior.' },
    b05: { accepted: 'A', acceptedWhy: 'porque sí', rejected: 'R', rejectedWhy: 'porque no' },
    b08: { claims: [{ claim: 'Una afirmación', source: 'CC', locator: 'Art. 2515', action: 'mantener' }] },
    b09: { blame: 'sistema', confidence: 'alto', committed: true, before: 'x', after: 'y' },
  });
  assert.equal(migrated.schemaVersion, SCHEMA_VERSION);
  assert.equal(migrated.identity.name, 'Ana Pérez');
  assert.equal(migrated.initialQuestion.blame, 'ia');
  assert.equal(migrated.promptV1.text, 'Mi prompt anterior.');
  assert.equal(migrated.audit.accepted, 'A');
  assert.equal(migrated.verification.claims[0].locator, 'Art. 2515');
  assert.equal(migrated.finalQuestion.blame, 'sistema');
  assert.equal(migrated.reflection.after, 'y');
});

test('la migración tolera basura sin romper la aplicación', () => {
  for (const value of [null, undefined, 0, 'texto', {}, []]) {
    const migrated = migrate(value);
    assert.equal(migrated.schemaVersion, SCHEMA_VERSION);
    assert.equal(migrated.verification.claims.length, 1);
    assert.ok(Array.isArray(migrated.promptV1.draft.constraints));
  }
});

test('save/load conserva el estado y reset elimina solo la clave de Clase 1', () => {
  const store = new Map([['otra.clave', 'intacta']]);
  globalThis.window = {
    localStorage: {
      getItem: key => (store.has(key) ? store.get(key) : null),
      setItem: (key, value) => store.set(key, value),
      removeItem: key => store.delete(key),
    },
  };
  try {
    const state = createInitialState();
    state.identity = { name: 'Ana Pérez', email: '' };
    state.promptV1.text = 'PROMPT';
    saveState(state);

    const loaded = loadState();
    assert.equal(loaded.identity.name, 'Ana Pérez');
    assert.equal(loaded.promptV1.text, 'PROMPT');

    clearState();
    assert.equal(store.has(STORAGE_KEY), false);
    assert.equal(store.get('otra.clave'), 'intacta');
  } finally {
    delete globalThis.window;
  }
});

test('el prompt vigente es el V2 cuando existe y el V1 cuando no', () => {
  const state = createInitialState();
  state.promptV1.text = 'V1';
  assert.equal(currentPrompt(state), 'V1');
  state.promptV2.text = 'V2';
  assert.equal(currentPrompt(state), 'V2');
});

// ─── Progreso ────────────────────────────────────────────────────────────────

function completeState() {
  const state = createInitialState();
  state.identity = { name: 'Ana Pérez', email: 'ana@pucv.cl' };
  state.initialQuestion = { blame: 'ia', confidence: 'medio', committed: true, at: null };

  let draft = applyTaskDefaults(emptyDraft(), 'resumir');
  draft = { ...draft, taskDetail: 'Necesito el resumen para decidir.', material: 'TEXTO DE TRABAJO' };
  state.promptV1.draft = draft;
  state.promptV1.text = compilePrompt(draft).text;

  state.audit = { tool: 'claude', accepted: 'A', rejected: 'R', why: 'Porque cambia el resultado.' };
  state.promptV2 = { text: `${state.promptV1.text}\n\nAjuste propio.`, at: null, seeded: true };
  state.verification.claims = [
    { id: 'c1', claim: 'Una afirmación', source: 'Código Civil', locator: 'Art. 2515', action: 'mantener' },
  ];
  state.finalQuestion = { blame: 'sistema', confidence: 'alto', committed: true, at: null };
  state.reflection = { before: 'que la IA se equivocaba', after: 'que nadie leyó la fuente' };
  return state;
}

test('una sesión vacía no tiene ninguna etapa completa y dice qué falta', () => {
  const progress = computeProgress(createInitialState());
  assert.equal(progress.completed, 0);
  assert.equal(progress.total, 5);
  assert.equal(progress.next, 'pregunta');
  assert.equal(progress.readyToDeliver, false);
  for (const id of STAGE_IDS) {
    assert.equal(progress.stages[id].status, 'pendiente');
    assert.ok(progress.stages[id].missing.length > 0, `${id} no explica qué falta`);
  }
});

test('una sesión completa cierra las cinco etapas y queda lista para entregar', () => {
  const progress = computeProgress(completeState());
  assert.equal(progress.completed, 5);
  assert.equal(progress.readyToDeliver, true);
  for (const id of STAGE_IDS) {
    assert.equal(progress.stages[id].status, 'completada', `${id} sin completar`);
    assert.deepEqual(progress.stages[id].missing, []);
  }
});

test('la verificación exige afirmación, fuente y decisión', () => {
  const state = completeState();
  state.verification.claims = [{ id: 'c1', claim: 'Una afirmación', source: '', locator: '', action: null }];
  const progress = stageProgress(state, 'verificacion');
  assert.equal(progress.status, 'en-curso');
  assert.equal(progress.missing.length, 2);
});

test('la auditoría exige aceptar, rechazar y justificar', () => {
  const state = completeState();
  state.audit = { tool: 'claude', accepted: 'A', rejected: '', why: '' };
  const progress = stageProgress(state, 'auditoria');
  assert.equal(progress.status, 'en-curso');
  assert.equal(progress.missing.length, 2);
});

// ─── Entrega ─────────────────────────────────────────────────────────────────

test('el documento de entrega sale de un único objeto y contiene todo el trabajo', () => {
  const submission = buildClass1Submission(completeState(), '2026-08-27T18:00:00.000Z');
  const markdown = renderSubmissionMarkdown(submission);

  assert.equal(submission.identity.name, 'Ana Pérez');
  assert.equal(submission.promptV2.changed, true);
  assert.match(markdown, /27-08-2026/);
  for (const heading of [1, 2, 3, 4, 5, 6, 7]) {
    assert.match(markdown, new RegExp(`## ${heading} · `), `falta la sección ${heading}`);
  }
  assert.match(markdown, /TEXTO DE TRABAJO/);
  assert.match(markdown, /Ajuste propio\./);
  assert.match(markdown, /Art\. 2515/);
  assert.match(markdown, /que nadie leyó la fuente/);
});

test('el documento no inventa nada cuando la sesión está vacía', () => {
  const submission = buildClass1Submission(createInitialState(), '2026-08-27T18:00:00.000Z');
  const markdown = renderSubmissionMarkdown(submission);
  assert.equal(submission.verification.claims.length, 0);
  assert.match(markdown, /—/);
  assert.doesNotMatch(markdown, /undefined|null|\[object/);
});

test('nombre de archivo y correo de entrega son deterministas', () => {
  const submission = buildClass1Submission(completeState(), '2026-08-27T18:00:00.000Z');
  assert.equal(submissionFilename(submission), 'DIAT_Clase_1_ana-perez.md');
  assert.equal(
    submissionFilename({ ...submission, identity: { name: '', email: '' } }),
    'DIAT_Clase_1_sin-nombre.md',
  );

  assert.equal(SUBMISSION_SUBJECT, 'Clase 1');
  const mailto = fallbackMailto(submission);
  assert.match(mailto, /^mailto:/);
  assert.match(mailto, /subject=Clase%20 ?1|subject=Clase%201/);
  assert.doesNotMatch(mailto, /\+/);
});
