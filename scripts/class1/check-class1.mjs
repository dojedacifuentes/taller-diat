// ─────────────────────────────────────────────────────────────────────────────
// COMPROBACIONES DE LA CLASE 1
//
//   npm run test:class1
//
// Dos invariantes que no pueden romperse sin que la clase deje de funcionar:
//
//   1. Todo prompt exportable se pega en una IA y la tarea empieza. Sin
//      marcadores por rellenar, sin etiquetas, sin instrucciones dirigidas al
//      estudiante mezcladas con instrucciones dirigidas al modelo.
//   2. Un estudiante que venía de la arquitectura anterior no pierde su trabajo
//      al recargar sobre la nueva.
//
// Sin framework: se ejecuta con el intérprete de TypeScript de Node.
// ─────────────────────────────────────────────────────────────────────────────
import {
  applyTaskDefaults, compilePrompt, emptyDraft, missingMessage, taskPresets,
} from '../../src/content/class1/lab.ts';
import { migrate, createInitialState, SCHEMA_VERSION } from '../../src/lib/class1/state.ts';
import { buildClass1Submission, renderSubmissionMarkdown, submissionFilename } from '../../src/lib/class1/submission.ts';

let failures = 0;
function check(name, cond, detail = '') {
  if (cond) console.log(`  ok   ${name}`);
  else { failures += 1; console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ''}`); }
}
function group(title) { console.log(`\n${title}`); }

// Marcador = corchete por rellenar. `[INFERENCIA]` es una etiqueta que la IA
// debe escribir, no un hueco que el estudiante deba completar.
const PLACEHOLDER = /\[(?!INFERENCIA\])[^\]]*\]/;

group('1 · Sin decisiones no se exporta, y se dice qué falta');
{
  const c = compilePrompt(emptyDraft());
  check('no está listo', !c.ready);
  check('no produce texto', c.text === '');
  check('nombra las tres decisiones que faltan', c.missing.length === 3, JSON.stringify(c.missing));
  check('el mensaje es una sola frase', missingMessage(c.missing).split('.').filter(Boolean).length === 1);
}

group('2 · Cada tarea del catálogo produce un prompt ejecutable');
for (const preset of taskPresets) {
  let d = applyTaskDefaults(emptyDraft(), preset.id);
  d = { ...d, taskDetail: 'Detalle concreto de la tarea.', purpose: 'Para un informe interno.' };
  if (d.source === 'pegar') d = { ...d, material: 'TEXTO DE PRUEBA' };
  const c = compilePrompt(d);
  check(`${preset.id}: exporta`, c.ready, JSON.stringify(c.missing));
  check(`${preset.id}: sin marcadores`, !PLACEHOLDER.test(c.text), (c.text.match(PLACEHOLDER) || [''])[0]);
}

group('3 · El material pegado viaja dentro del prompt');
{
  const d = { ...applyTaskDefaults(emptyDraft(), 'resumir'), taskDetail: 'x', material: 'CONTENIDO REAL' };
  const c = compilePrompt(d);
  check('incluye el material', c.text.includes('CONTENIDO REAL'));
  check('delimitadores', c.text.includes('<<<INICIO DEL MATERIAL>>>') && c.text.includes('<<<FIN DEL MATERIAL>>>'));
  check('dice cómo usarlo', c.text.includes('Trabaja exclusivamente con el material delimitado'));
  check('no advierte de dependencias externas', c.warning === undefined);
}

group('4 · Sin material pegado no se exporta');
{
  const c = compilePrompt({ ...applyTaskDefaults(emptyDraft(), 'resumir'), taskDetail: 'x' });
  check('no exporta', !c.ready);
  check('nombra el material', c.missing.includes('el contenido sobre el que trabajará la IA'));
}

group('5 · Documento adjunto: se advierte y el prompt lo dice');
{
  const c = compilePrompt({ ...applyTaskDefaults(emptyDraft(), 'analizar-sentencia'), taskDetail: 'x', source: 'adjuntar' });
  check('exporta', c.ready);
  check('advierte en la interfaz', c.warning?.includes('adjuntar el documento'));
  check('lo dice en el prompt', c.text.includes('documento que adjunto en este mismo mensaje'));
  check('no finge autosuficiencia', c.text.includes('no continúes'));
}

group('6 · «Otra tarea» exige que la escriba el estudiante');
{
  const base = { ...applyTaskDefaults(emptyDraft(), 'otra'), material: 'X' };
  check('sin detalle no exporta', !compilePrompt(base).ready);
  const con = compilePrompt({ ...base, taskDetail: 'Traduce este texto al inglés jurídico.' });
  check('con detalle exporta', con.ready);
  check('la tarea es la suya', con.text.startsWith('Traduce este texto al inglés jurídico.'));
}

group('7 · Rol solo si se pide; sin él el prompt sigue siendo válido');
{
  const d = { ...applyTaskDefaults(emptyDraft(), 'resumir'), taskDetail: 'x', material: 'X' };
  check('sin rol', !compilePrompt(d).text.includes('Actúa como'));
  const conRol = compilePrompt({ ...d, extras: { ...d.extras, role: 'ayudante de Derecho civil' } });
  check('con rol, va primero', conRol.text.startsWith('Actúa como ayudante de Derecho civil.'));
}

group('8 · Sin restricciones ni control no se imprimen secciones vacías');
{
  const c = compilePrompt({ ...applyTaskDefaults(emptyDraft(), 'resumir'), taskDetail: 'x', material: 'X', constraints: [], controls: [] });
  check('exporta', c.ready);
  check('sin secciones vacías', !c.text.includes('RESTRICCIONES') && !c.text.includes('CONTROL'));
}

group('9 · Migración desde la arquitectura de bloques');
{
  const legacy = {
    schemaVersion: 1,
    student: { firstName: 'Ana', lastName: 'Pérez', email: 'ana@pucv.cl' },
    b00: { blame: 'ia', confidence: 'medio', committed: true, at: '2026-08-27T18:03:00.000Z' },
    productA: { task: 'Analizar una sentencia', prompt: 'Mi prompt de la sesión anterior.' },
    b05: { tool: 'claude', accepted: 'A', acceptedWhy: 'porque sí', rejected: 'R', rejectedWhy: 'porque no' },
    b08: { claims: [{ claim: 'Una afirmación', source: 'CC', locator: 'Art. 2515', action: 'mantener' }] },
    b09: { blame: 'sistema', confidence: 'alto', committed: true, before: 'x', after: 'y' },
  };
  const s = migrate(legacy);
  check('versión al día', s.schemaVersion === SCHEMA_VERSION);
  check('identidad', s.identity.name === 'Ana Pérez' && s.identity.email === 'ana@pucv.cl');
  check('respuesta inicial', s.initialQuestion.blame === 'ia' && s.initialQuestion.committed);
  check('prompt conservado', s.promptV1.text === 'Mi prompt de la sesión anterior.');
  check('auditoría', s.audit.accepted === 'A' && s.audit.rejected === 'R' && s.audit.why.includes('porque'));
  check('verificación', s.verification.claims[0].locator === 'Art. 2515');
  check('respuesta final', s.finalQuestion.blame === 'sistema' && s.reflection.after === 'y');

  check('un objeto vacío no rompe nada', migrate({}).schemaVersion === SCHEMA_VERSION);
  check('un valor no-objeto no rompe nada', migrate(null).schemaVersion === SCHEMA_VERSION);
  const roundtrip = migrate(JSON.parse(JSON.stringify(createInitialState())));
  check('estado nuevo sobrevive al ciclo', roundtrip.verification.claims.length === 1);
}

group('10 · La entrega sale de un único objeto');
{
  const state = createInitialState();
  state.identity = { name: 'Ana Pérez Ñuñoa', email: 'ana@pucv.cl' };
  state.promptV1.text = 'PROMPT UNO';
  state.promptV2 = { text: 'PROMPT DOS', at: null, seeded: true };
  state.verification.claims = [{ id: 'c1', claim: 'Afirmación', source: 'CC', locator: 'Art. 1', action: 'matizar' }];
  const sub = buildClass1Submission(state, '2026-08-27T18:00:00.000Z');
  const md = renderSubmissionMarkdown(sub);

  check('nombre de archivo sin tildes', submissionFilename(sub) === 'DIAT_Clase_1_ana-perez-nunoa.md');
  check('sin nombre no se queda vacío', submissionFilename({ ...sub, identity: { name: '', email: '' } }) === 'DIAT_Clase_1_sin-nombre.md');
  check('contiene el Prompt V1', md.includes('PROMPT UNO'));
  check('contiene el Prompt V2', md.includes('PROMPT DOS'));
  check('marca que V2 cambió', sub.promptV2.changed === true);
  check('contiene la verificación', md.includes('Matizar') && md.includes('Art. 1'));
  check('tiene las siete secciones', [1, 2, 3, 4, 5, 6, 7].every(n => md.includes(`## ${n} ·`)));
  check('la fecha es estable', md.includes('27-08-2026'));
}

console.log(`\n${failures === 0 ? '✓ Todas las comprobaciones pasan.' : `✗ ${failures} comprobación(es) fallida(s).`}\n`);
process.exit(failures === 0 ? 0 : 1);
