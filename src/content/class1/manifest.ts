// ─────────────────────────────────────────────────────────────────────────────
// CLASE 1 · MANIFEST
//
// Fuente única de la secuencia B00–B09 para /clase-1. Alimenta navegación,
// progreso, referencias al PPT y modo docente.
//
// Procedencia del contenido: CLASE_1_DIAT_DOCUMENTO_MAESTRO_v2.0 (Parte III.5 y
// Parte IV, mapa temporal) y DIAT_2026_CLASE_1_MANUAL_DEL_ESTUDIANTE_v1.0.
//
// Este manifest describe la CLASE 1 tal como se ejecuta en plataforma
// (aprendizaje individual guiado). No sustituye a src/data/sessionPlan.ts, que
// describe el run of show general del taller y alimenta otras rutas.
// ─────────────────────────────────────────────────────────────────────────────

import canonicalClass1Manifest from './class1-manifest.json';

/** Las cinco fases conceptuales que estructuran la navegación de /clase-1. */
export type Class1Phase =
  | 'COMPRENDER'
  | 'INSTRUIR'
  | 'DESCONFIAR'
  | 'COMPROBAR'
  | 'INTEGRAR';

export const PHASES: readonly Class1Phase[] = [
  'COMPRENDER',
  'INSTRUIR',
  'DESCONFIAR',
  'COMPROBAR',
  'INTEGRAR',
] as const;

export const phaseMeta: Record<
  Class1Phase,
  { question: string; idea: string; accent: 'cyan' | 'indigo' | 'amber' | 'rose' | 'emerald' }
> = {
  COMPRENDER: {
    question: '¿Qué hace realmente un modelo de lenguaje y qué no podemos inferir de su fluidez?',
    idea: 'Generar lenguaje plausible no equivale a certificar verdad jurídica.',
    accent: 'cyan',
  },
  INSTRUIR: {
    question: '¿Cómo transformamos una intención vaga en un encargo ejecutable?',
    idea: 'El prompt reduce ambigüedad mediante contexto, tarea, fuentes, límites, formato y control.',
    accent: 'indigo',
  },
  DESCONFIAR: {
    question: '¿Cómo puede fallar una respuesta que suena correcta?',
    idea: 'Los errores jurídicos generativos no se limitan a citas inventadas.',
    accent: 'rose',
  },
  COMPROBAR: {
    question: '¿Qué hacemos antes de incorporar el resultado al trabajo jurídico?',
    idea: 'La verificación es personal, trazable y proporcional al riesgo.',
    accent: 'emerald',
  },
  INTEGRAR: {
    question: '¿Quién falló, y qué puedo decir ahora que no podía decir al empezar?',
    idea: 'La responsabilidad profesional sobre lo que se firma no se delega al modelo.',
    accent: 'amber',
  },
};

/** Identificadores de bloque. El orden del array ES el orden de la clase. */
export type BlockId =
  | 'b00' | 'b01' | 'b02' | 'b03' | 'b04'
  | 'b05' | 'b06' | 'b07' | 'b08' | 'b09';

/** Producto pedagógico al que contribuye el bloque (hito de la Bitácora). */
export type ProductId = 'A' | 'B' | 'C';

export interface Class1Block {
  /** Slug de ruta: /clase-1/b04 */
  id: BlockId;
  /** Etiqueta corta usada por el guion docente. */
  code: string;
  /** Título del bloque en el Documento Maestro. */
  title: string;
  /** Subtítulo operativo para la plataforma. */
  subtitle: string;
  phase: Class1Phase;
  /**
   * Objetivo del bloque, en la redacción del Guion docente v2.0. Es lo que el
   * bloque debe dejar instalado; no es lo que el profesor dice en voz alta.
   */
  objective: string;
  /** Minuto de inicio/fin relativos a las 15:00. */
  from: number;
  to: number;
  /** Diapositivas del PPT que acompañan el bloque. */
  slides: readonly number[];
  /** Qué hace el docente mientras el estudiante trabaja en plataforma. */
  teacher: string;
  /** Qué hace el estudiante en /clase-1. */
  student: string;
  /** Conceptos que el bloque instala o recupera. */
  concepts: readonly string[];
  /** Frase ancla asociada, si la hay. */
  anchor?: string;
  /** Hito de Bitácora que produce el bloque. */
  product?: ProductId;
  /**
   * Identificadores de actividad de la Matriz de ejecución v1.0 (`C1-EJ-nn`) y
   * de las demostraciones docentes (`C1-DM-nn`). Gestión interna: no se muestran
   * al estudiante.
   */
  activityIds: readonly string[];
  /**
   * Criterio de completitud. Se evalúa contra el estado en
   * `lib/class1/progress.ts`; aquí solo se documenta en lenguaje natural.
   */
  completeWhen: string;
}

const LEGACY_BLOCKS: readonly Class1Block[] = [
  {
    id: 'b00',
    code: 'B00',
    title: 'Una cita perfecta que no existe',
    subtitle: 'Diagnóstico inicial',
    phase: 'COMPRENDER',
    objective:
      'Instalar el problema profesional: el riesgo no es solo que la IA se equivoque, sino incorporar sin control un resultado que parece plausible.',
    from: 0,
    to: 7,
    slides: [1, 2, 3, 4, 5],
    teacher:
      'Enuncia la regla de aula, proyecta la ficha bibliográfica falsa y presenta la línea disciplinaria chilena de 2026.',
    student:
      'Examina la ficha, decide quién falló y declara su nivel de confianza. La respuesta queda registrada para recuperarla en B09.',
    concepts: ['responsabilidad profesional', 'plausibilidad formal', 'línea disciplinaria 2026'],
    anchor: 'La IA no comparece ante el tribunal.',
    activityIds: ['C1-EJ-01'],
    completeWhen: 'El estudiante confirmó una respuesta y un nivel de confianza.',
  },
  {
    id: 'b01',
    code: 'B01',
    title: 'Qué hace un modelo de lenguaje',
    subtitle: 'Modelo mental mínimo',
    phase: 'COMPRENDER',
    objective:
      'Instalar tres distinciones que cambian la conducta de uso, y solo esas.',
    from: 7,
    to: 17,
    slides: [6, 7, 8],
    teacher:
      'Explica las tres distinciones y hace una demostración de 90 segundos sin fuentes: «¿de dónde salió esto?».',
    student:
      'Explora el diagrama modelo/producto y resuelve dos comprobaciones breves sobre capacidades y límites.',
    concepts: ['IA vs. IA generativa', 'modelo vs. producto', 'variabilidad de las respuestas'],
    anchor: 'Fluidez ≠ verdad.',
    activityIds: ['C1-DM-01', 'C1-EJ-02'],
    completeWhen: 'Exploró al menos tres nodos del diagrama y respondió los dos knowledge checks.',
  },
  {
    id: 'b02',
    code: 'B02',
    title: 'Cinco mitos',
    subtitle: 'Desmontaje de intuiciones',
    phase: 'COMPRENDER',
    objective:
      'Desactivar cinco intuiciones erróneas antes de enseñar prompting, para que no reaparezcan después como resistencia.',
    from: 17,
    to: 22,
    slides: [9],
    teacher:
      'Introduce cada afirmación y, tras el registro individual, comenta la explicación en voz alta.',
    student:
      'Responde las cinco afirmaciones una a una. Confirma antes de ver el feedback: no hay vuelta atrás.',
    concepts: ['commit before feedback', 'grounding no es infalibilidad', 'rol como componente prescindible'],
    anchor: 'Un buen prompt reduce decisiones implícitas.',
    activityIds: ['C1-EJ-03'],
    completeWhen: 'Las cinco afirmaciones fueron confirmadas.',
  },
  {
    id: 'b03',
    code: 'B03',
    title: 'Diagnóstico DIAT',
    subtitle: 'Siete preguntas de diseño',
    phase: 'INSTRUIR',
    objective:
      'Enseñar los siete componentes como preguntas de diseño, no como casillas, e instalar la regla de proporcionalidad al riesgo.',
    from: 22,
    to: 37,
    slides: [10, 11, 12],
    teacher:
      'Expone los siete componentes como preguntas, no como casillas, e instala la regla de proporcionalidad al riesgo.',
    student:
      'Diagnostica un prompt real de riesgo medio: marca el estado de cada componente y nombra la decisión que queda implícita.',
    concepts: ['siete componentes DIAT', 'decisión implícita', 'proporcionalidad al riesgo'],
    anchor: 'Son siete preguntas de diseño, no siete casillas obligatorias.',
    activityIds: ['C1-EJ-04'],
    completeWhen: 'Los siete componentes tienen estado asignado y hay al menos una decisión implícita descrita.',
  },
  {
    id: 'b04',
    code: 'B04',
    title: 'Prompt Lab',
    subtitle: 'Construcción del encargo',
    phase: 'INSTRUIR',
    objective:
      'Que cada estudiante construya personalmente un encargo proporcional al riesgo y pueda justificar tres decisiones de diseño.',
    from: 37,
    to: 47,
    slides: [13, 14],
    teacher:
      'Construye el prompt capa por capa en pantalla y revela al final el Prompt DIAT de referencia, sin Rol.',
    student:
      'Construye su propio encargo: tarea, riesgo, decisiones que no delega, componentes pertinentes y tres decisiones de diseño justificadas.',
    concepts: ['especificación progresiva', 'cobertura DIAT', 'decisiones justificadas'],
    anchor: 'No lo hagan más largo. Háganlo menos ambiguo.',
    product: 'A',
    activityIds: ['C1-EJ-05'],
    completeWhen: 'Producto A con tarea, riesgo, prompt y al menos una decisión justificada.',
  },
  {
    id: 'b05',
    code: 'B05',
    title: 'Metaprompting',
    subtitle: 'Auditar antes de ejecutar',
    phase: 'INSTRUIR',
    objective:
      'Convertir la revisión de instrucciones en una fase explícita y repetible, sin delegar la definición del objetivo.',
    from: 47,
    to: 55,
    slides: [15, 16],
    teacher:
      'Demuestra la auditoría sobre el Prompt 0 y sobre el prompt de referencia, y enuncia los cinco límites.',
    student:
      'Lleva su Producto A a su propia herramienta de IA, trae la auditoría y decide qué acepta y qué rechaza con fundamento.',
    concepts: ['auditor / entrevistador / generador', 'inflación de requisitos', 'auditar ≠ verificar'],
    anchor: 'Auditar no es verificar.',
    activityIds: ['C1-EJ-06'],
    completeWhen: 'Hay una sugerencia aceptada y una rechazada, ambas fundamentadas.',
  },
  {
    id: 'b06',
    code: 'B06',
    title: 'Error Lab',
    subtitle: 'Cuatro errores jurídicos generativos',
    phase: 'DESCONFIAR',
    objective:
      'Sustituir «la IA inventa cosas» por cuatro tipos distinguibles, con el tipo 2 —fuente real, proposición falsa— como núcleo.',
    from: 55,
    to: 65,
    slides: [17, 18, 19],
    teacher:
      'Expone los cuatro tipos con el tipo 2 como núcleo y cierra con las siete señales de alerta.',
    student:
      'Clasifica casos breves y atraviesa una revelación progresiva sobre una fuente real que no sostiene la proposición.',
    concepts: ['fuente inexistente', 'fuente real + proposición falsa', 'cita alterada', 'descontextualización'],
    anchor: 'Fuente real ≠ conclusión correcta.',
    activityIds: ['C1-EJ-07'],
    completeWhen: 'Resolvió los casos de clasificación y el caso de revelación progresiva.',
  },
  {
    id: 'b07',
    code: 'B07',
    title: 'Grounding Lab',
    subtitle: 'Procedencia e interpretación',
    phase: 'DESCONFIAR',
    objective:
      'Distinguir chat abierto de trabajo anclado en fuentes, y mostrar en vivo el límite que esa distinción no resuelve.',
    from: 65,
    to: 75,
    slides: [20, 21, 22, 23, 24],
    teacher:
      'Conduce la demostración sobre corpus cerrado. El movimiento 5 —la conclusión discutible— no se sacrifica nunca.',
    student:
      'Decide, sobre lo que ve en pantalla, si un localizador que abre basta para dar por verificada una conclusión.',
    concepts: ['tres modos de trabajo', 'grounding', 'localizador', 'confidencialidad'],
    anchor: 'Grounding mejora la procedencia, no garantiza la interpretación.',
    activityIds: ['C1-DM-03', 'C1-EJ-08'],
    completeWhen: 'Respondió las dos decisiones guiadas del bloque.',
  },
  {
    id: 'b08',
    code: 'B08',
    title: 'ICJR Studio',
    subtitle: 'Identificar · Contrastar · Justificar · Registrar',
    phase: 'COMPROBAR',
    objective:
      'Convertir «hay que revisar lo que dice la IA» en cuatro operaciones, un producto y un registro.',
    from: 75,
    to: 85,
    slides: [25, 26, 27],
    teacher:
      'Explica el protocolo con una fila resuelta en pantalla y circula preguntando: «¿leíste el considerando o solo comprobaste que existe?».',
    student:
      'Ejecuta ICJR sobre dos afirmaciones: estatus, fuente, localizador, estado y acción.',
    concepts: ['ICJR', 'cinco estatus epistémicos', 'no verificada es un resultado válido'],
    anchor: 'Control ex ante; ICJR ex post.',
    product: 'B',
    activityIds: ['C1-EJ-09'],
    completeWhen: 'Dos afirmaciones con estatus, estado y acción asignados.',
  },
  {
    id: 'b09',
    code: 'B09',
    title: 'Cierre',
    subtitle: 'Volver a la primera pregunta',
    phase: 'INTEGRAR',
    objective:
      'Recuperar la respuesta inicial de cada estudiante, integrar la respuesta y dejar instaladas las tres reglas de salida.',
    from: 85,
    to: 90,
    slides: [28, 29, 30],
    teacher:
      'Recupera la votación inicial, integra la respuesta y enuncia las tres reglas de salida.',
    student:
      'Vuelve a responder «¿quién falló?», compara con su respuesta de B00 y completa el Producto C.',
    concepts: ['metacognición', 'tres reglas', 'decisión humana'],
    anchor: 'La IA no comparece ante el tribunal.',
    product: 'C',
    activityIds: ['C1-EJ-10', 'C1-EJ-11'],
    completeWhen: 'Respondió de nuevo, declaró confianza y completó las dos frases del Producto C.',
  },
] as const;

function minuteOffset(clockValue: string): number {
  const [hours, minutes] = clockValue.split(':').map(Number);
  return hours * 60 + minutes - 15 * 60;
}

/**
 * Proyección de plataforma del manifest JSON compartido con el deck. Solo los
 * identificadores internos C1-EJ/C1-DM permanecen en TypeScript porque no son
 * contenido pedagógico ni se muestran al estudiante.
 */
export const BLOCKS: readonly Class1Block[] = canonicalClass1Manifest.blocks.map((block) => {
  const legacy = LEGACY_BLOCKS.find((candidate) => candidate.id === block.id);
  if (!legacy) throw new Error(`Falta activityIds para ${block.id}`);
  return {
    id: block.id as BlockId,
    code: block.block,
    title: block.title,
    subtitle: block.subtitle,
    phase: block.phase as Class1Phase,
    objective: block.objective,
    from: minuteOffset(block.startTime),
    to: minuteOffset(block.endTime),
    slides: block.slides,
    teacher: block.professorRole,
    student: block.studentAction,
    concepts: block.concepts,
    anchor: block.anchorPhrase,
    product: block.product ? block.product as ProductId : undefined,
    activityIds: legacy.activityIds,
    completeWhen: block.completeWhen,
  };
});

/** Manifest canónico completo para deck, guion y plataforma. */
export const canonicalManifest = canonicalClass1Manifest;

export const BLOCK_IDS: readonly BlockId[] = BLOCKS.map(b => b.id);

export function getBlock(id: string): Class1Block | undefined {
  return BLOCKS.find(b => b.id === id);
}

export function blockIndex(id: BlockId): number {
  return BLOCKS.findIndex(b => b.id === id);
}

export function prevBlock(id: BlockId): Class1Block | undefined {
  return BLOCKS[blockIndex(id) - 1];
}

export function nextBlock(id: BlockId): Class1Block | undefined {
  return BLOCKS[blockIndex(id) + 1];
}

export function blocksOfPhase(phase: Class1Phase): Class1Block[] {
  return BLOCKS.filter(b => b.phase === phase);
}

/** Minuto 0 = 15:00. Devuelve «15:37». */
export function clock(minute: number): string {
  const total = 15 * 60 + minute;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export function blockClock(b: Pick<Class1Block, 'from' | 'to'>): string {
  return `${clock(b.from)}–${clock(b.to)}`;
}

/** Ruta pública del bloque. Se deriva del id: nunca se escribe a mano. */
export function blockRoute(id: BlockId): string {
  return `${CLASS_ROOT}/${id}`;
}

/** Raíz pública de la clase. Punto único de verdad para QR, PPT y enlaces. */
export const CLASS_ROOT = canonicalClass1Manifest.class.route;

/** Origen público desplegado. Se usa para el QR de la diapositiva 01. */
export const CLASS_ORIGIN = 'https://taller-diat.vercel.app';

/** URL absoluta de la clase, tal como se imprime en el deck. */
export const CLASS_URL = `${CLASS_ORIGIN}${CLASS_ROOT}`;

/** Bloque al que pertenece una diapositiva del PPT. */
export function blockOfSlide(n: number): Class1Block | undefined {
  return BLOCKS.find(b => b.slides.includes(n));
}

/** Datos de cabecera de la clase. */
export const class1Meta = {
  code: canonicalClass1Manifest.class.code,
  title: canonicalClass1Manifest.class.title,
  date: canonicalClass1Manifest.class.date,
  dateShort: canonicalClass1Manifest.class.dateShort,
  time: `${canonicalClass1Manifest.class.startTime}–${canonicalClass1Manifest.class.endTime}`,
  durationMin: canonicalClass1Manifest.class.duration,
  thesis: canonicalClass1Manifest.class.thesis,
  idea: canonicalClass1Manifest.class.idea,
  flow: canonicalClass1Manifest.canonical.flow,
  outcomes: [
    'Explicar, con lenguaje no técnico, al menos tres capacidades y tres límites relevantes de un modelo de lenguaje en tareas jurídicas.',
    'Transformar una instrucción jurídica vaga en un prompt estructurado usando los componentes DIAT pertinentes, sin convertirlos en una fórmula rígida, y justificar tres decisiones de diseño.',
    'Reconocer al menos cuatro formas de error jurídico generativo y distinguir, en particular, la fuente inexistente de la fuente real mal atribuida.',
    'Aplicar el protocolo ICJR a afirmaciones concretas y dejar registro de qué fue verificado, contra qué fuente, con qué localizador y con qué resultado.',
  ],
  rules: canonicalClass1Manifest.canonical.finalRules,
  anchors: Array.from(new Set([
    ...canonicalClass1Manifest.blocks.map(block => block.anchorPhrase),
    'Generar no es verificar.',
    'La responsabilidad profesional no se delega al modelo.',
  ])),
  classroomRule: canonicalClass1Manifest.class.classroomRule,
} as const;

/** Destinatarios de la entrega final. */
export const delivery = {
  to: 'programadiat@pucv.cl',
  cc: 'diego.ojeda.c@pucv.cl',
} as const;
