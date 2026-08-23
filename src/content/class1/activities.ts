// ─────────────────────────────────────────────────────────────────────────────
// CLASE 1 · CONTENIDO DE LAS ACTIVIDADES B00–B09
//
// Todo el contenido sustantivo procede de:
//   · CLASE_1_DIAT_DOCUMENTO_MAESTRO_v2.0  (fuente canónica)
//   · DIAT_2026_CLASE_1_MANUAL_DEL_ESTUDIANTE_v1.0 (versión pedagógica)
//
// La interfaz no debe contener texto pedagógico propio: si algo se enseña,
// vive aquí.
// ─────────────────────────────────────────────────────────────────────────────

// ─── B00 · DIAGNÓSTICO INICIAL ───────────────────────────────────────────────

/**
 * Ficha bibliográfica falsa. El Manual sustituye el nombre del autor por un
 * marcador: atribuir una obra inexistente a una persona real e identificable en
 * un material que circula fuera del aula no es aceptable. Ver
 * CLASS1_CONTENT_ISSUES.md → C1-04.
 */
export const fakeCitation = {
  author: '[APELLIDO, Nombre]',
  year: '2023',
  title:
    'La alucinación normativa en los modelos de lenguaje: razonamiento jurídico y validez dogmática',
  publisher: 'Editorial Jurídica de Chile',
  place: 'Santiago',
  pages: 'págs. 142–158',
  stamp: 'ESTA OBRA NO EXISTE',
  reading:
    'Autor plausible. Editorial verosímil. Año razonable. Título que encaja con la tesis que se quería sostener. La respuesta honesta es incómoda: a simple vista no tiene nada de sospechosa. Ese es exactamente el problema.',
} as const;

export type BlameOption = 'ia' | 'prompt' | 'verificacion' | 'profesional' | 'sistema';

export const blameOptions: readonly { id: BlameOption; label: string; hint: string }[] = [
  { id: 'ia', label: 'La IA', hint: 'Defecto en la generación del modelo probabilístico.' },
  { id: 'prompt', label: 'El prompt', hint: 'Instrucción imprecisa o falta de restricciones.' },
  { id: 'verificacion', label: 'La verificación', hint: 'Ausencia de contraste ex post con fuente oficial.' },
  { id: 'profesional', label: 'El profesional', hint: 'Incumplimiento de deberes procesales y firma.' },
  { id: 'sistema', label: 'Más de uno / el sistema completo', hint: 'El defecto se distribuye en varios puntos.' },
] as const;

export const blameQuestion =
  'Un escrito contiene una cita doctrinal perfectamente formateada: autor, título, año y una tesis que encaja con nuestro argumento. El problema es que el libro no existe. ¿Dónde está el fallo?';

/** Tabla de la línea disciplinaria chilena 2026 (Documento Maestro, B00). */
export const disciplinaryLine = [
  {
    court: 'Segundo Juzgado Civil de Concepción',
    rol: 'C-6127-2025',
    date: '21 ene 2026',
    sanction: '1 UTM (≈ $69.751)',
    ai: 'Sí. El abogado reconoció el uso de modelos de lenguaje y la «alucinación de datos».',
    highlight: false,
  },
  {
    court: 'Tribunal de Defensa de la Libre Competencia',
    rol: 'C-547-2026',
    date: '24 mar 2026',
    sanction: '1 UTM',
    ai: 'Sí.',
    highlight: false,
  },
  {
    court: 'Corte Suprema, Tercera Sala',
    rol: '23.322-2025',
    date: '22 abr 2026',
    sanction: 'Suspensión 1 mes + 5 UTM',
    ai: 'Sí. La comunicación oficial del Poder Judicial atribuye las citas a «un Chatbot de inteligencia artificial».',
    highlight: true,
  },
  {
    court: 'Tribunal Constitucional',
    rol: '17.063-2025-INA',
    date: '28 jul 2026',
    sanction: 'Suspensión 1 mes + 1 UTM',
    ai: 'No. La resolución no menciona uso de IA.',
    highlight: false,
  },
] as const;

export const supremeCourtCase = {
  summary:
    'El 22 de abril de 2026, la Tercera Sala de la Corte Suprema sancionó a una abogada que atribuyó, en un recurso de casación, obras inexistentes a dos profesores chilenos. Aplicó los artículos 531 y 542 del Código Orgánico de Tribunales y el principio de buena fe procesal del artículo 2 letra d) de la Ley 20.886, e impuso un mes de suspensión del ejercicio profesional y multa de 5 UTM.',
  quote:
    'demuestra falta de profesionalidad y resulta contraria a la rectitud elemental que deben observar los abogados ante los tribunales',
  note:
    'El artículo 531 del COT fue concebido en 1875 para reprimir faltas de respeto en escritos judiciales. Su extensión a la presentación de fuentes inexistentes es defendible pero no pacífica. El deber de verificar no está en discusión; lo que se discute es cuál es la vía sancionatoria idónea.',
} as const;

export type ConfidenceLevel = 'bajo' | 'medio' | 'alto';

export const confidenceLevels: readonly { id: ConfidenceLevel; label: string }[] = [
  { id: 'bajo', label: 'Bajo' },
  { id: 'medio', label: 'Medio' },
  { id: 'alto', label: 'Alto' },
] as const;

// ─── B01 · MODELO MENTAL ─────────────────────────────────────────────────────

export interface ProductLayerNode {
  id: string;
  label: string;
  gives: string;
  doesNotGuarantee: string;
}

export const productLayers: readonly ProductLayerNode[] = [
  {
    id: 'busqueda',
    label: 'Búsqueda web',
    gives: 'Permite recuperar documentos que existen hoy y no estaban en el entrenamiento.',
    doesNotGuarantee:
      'Que el documento recuperado diga lo que la respuesta afirma. El resultado depende de lo que la web devuelva ese día.',
  },
  {
    id: 'archivos',
    label: 'Lectura de archivos',
    gives: 'Permite trabajar sobre material que uno aporta, en lugar de patrones aprendidos.',
    doesNotGuarantee:
      'Que lea el documento completo con atención uniforme. El detalle sepultado en el medio de un texto extenso se recupera peor.',
  },
  {
    id: 'memoria',
    label: 'Memoria',
    gives: 'Conserva preferencias y contexto entre conversaciones.',
    doesNotGuarantee:
      'Que usted sepa qué está recordando. El contexto efectivo cambia sin que el usuario lo advierta.',
  },
  {
    id: 'instrucciones',
    label: 'Instrucciones del sistema',
    gives: 'Fija comportamiento por defecto del producto antes de que usted escriba nada.',
    doesNotGuarantee: 'Ser visible. Buena parte de lo que se atribuye «a la IA» es comportamiento del producto.',
  },
  {
    id: 'codigo',
    label: 'Ejecución de código',
    gives: 'Permite cálculos y transformaciones deterministas sobre datos.',
    doesNotGuarantee: 'Que los datos de entrada sean correctos ni que la operación sea la jurídicamente pertinente.',
  },
] as const;

export const modelCore = {
  label: 'MODELO',
  description:
    'Recibe una entrada, la representa en unidades de procesamiento llamadas tokens, utiliza el contexto disponible y genera una continuación probable de acuerdo con patrones aprendidos.',
} as const;

export const capabilities = [
  {
    capability: 'Generar y transformar lenguaje',
    utility: 'Redactar, reformular, resumir, estructurar, comparar, traducir.',
    limit: 'La fluidez del texto no certifica exactitud factual ni jurídica.',
  },
  {
    capability: 'Trabajar con contexto',
    utility: 'Usar instrucciones, documentos y conversación previa para orientar la salida.',
    limit: 'Puede omitir, malinterpretar o perder detalles aunque la fuente esté disponible.',
  },
  {
    capability: 'Detectar patrones',
    utility: 'Clasificar información, encontrar similitudes, proponer estructuras.',
    limit: 'Puede reproducir sesgos del material y confundir correlación con fundamento jurídico.',
  },
  {
    capability: 'Proponer alternativas',
    utility: 'Generar argumentos, contraargumentos, hipótesis y preguntas.',
    limit: 'Una posibilidad plausible no es una conclusión jurídicamente validada.',
  },
] as const;

export const variabilityCauses = [
  {
    title: 'Muestreo probabilístico',
    detail:
      'La generación elige entre continuaciones posibles con un componente aleatorio deliberado. Por eso el mismo prompt no produce el mismo texto.',
  },
  {
    title: 'Contexto efectivo variable',
    detail:
      'El historial, la memoria del producto, las instrucciones del proyecto y los archivos cargados cambian sin que el usuario lo advierta.',
  },
  {
    title: 'Uso de herramientas',
    detail: 'Si el producto busca en la web, el resultado depende de lo que la web devuelva ese día.',
  },
  {
    title: 'Actualizaciones del proveedor',
    detail:
      'Los modelos que sirven a un producto comercial se actualizan sin aviso. El sistema de la semana pasada puede no ser el de hoy.',
  },
] as const;

export interface KnowledgeCheck {
  id: string;
  question: string;
  options: readonly { id: string; label: string }[];
  correct: string;
  feedbackCorrect: string;
  feedbackWrong: string;
  principle: string;
}

export const b01Checks: readonly KnowledgeCheck[] = [
  {
    id: 'k1',
    question:
      'Pide un resumen de jurisprudencia sin adjuntar nada. La respuesta llega bien escrita, estructurada y sin ningún error detectable. ¿Es utilizable en trabajo jurídico?',
    options: [
      { id: 'a', label: 'Sí: si no hay error, sirve.' },
      { id: 'b', label: 'No: no se puede rastrear de dónde salió cada afirmación.' },
      { id: 'c', label: 'Sí, siempre que se cite a la herramienta como fuente.' },
    ],
    correct: 'b',
    feedbackCorrect:
      'Exacto. No hace falta que la respuesta contenga un error: basta con que no se pueda saber de dónde viene.',
    feedbackWrong:
      'No. Un texto cuya procedencia no puede rastrearse no es utilizable en trabajo jurídico, aunque cada frase sea verdadera. Y la herramienta no es una fuente citable.',
    principle: 'Fluidez ≠ verdad.',
  },
  {
    id: 'k2',
    question:
      'Un colega dice: «le pedí jurisprudencia y me la inventó; estas herramientas no sirven». ¿Qué falta en ese diagnóstico?',
    options: [
      { id: 'a', label: 'Nada: describe correctamente el problema.' },
      { id: 'b', label: 'Distinguir si falló el modelo o si el producto no tenía búsqueda o lectura de fuentes activada.' },
      { id: 'c', label: 'Haber usado una herramienta de pago.' },
    ],
    correct: 'b',
    feedbackCorrect:
      'Correcto. El modelo no es el producto: son diagnósticos distintos y se corrigen distinto.',
    feedbackWrong:
      'El punto es la distinción modelo / producto: a veces el problema es el modelo y a veces es que el producto no tenía habilitada la búsqueda o la lectura de fuentes.',
    principle: 'El modelo no es el producto.',
  },
] as const;

// ─── B02 · CINCO MITOS ───────────────────────────────────────────────────────

export type MythAnswer = 'verdadero' | 'falso' | 'depende';

export interface Myth {
  id: string;
  statement: string;
  answer: MythAnswer;
  explanation: string;
  principle: string;
  manualRef: string;
  /** El mito 3 es el más importante: es casi verdadero. */
  core?: boolean;
}

export const myths: readonly Myth[] = [
  {
    id: 'm1',
    statement: 'Si el prompt es bueno, la respuesta será verdadera.',
    answer: 'falso',
    explanation:
      'Un buen prompt mejora orientación, alcance y control. No convierte al sistema en fuente de verdad. Es la confusión central que esta clase existe para corregir.',
    principle: 'Instruir mejor y verificar son dos actividades distintas y no se compensan entre sí.',
    manualRef: 'Manual §5',
  },
  {
    id: 'm2',
    statement: 'Un prompt más largo siempre es mejor.',
    answer: 'falso',
    explanation:
      'La utilidad depende de la tarea. Instrucciones redundantes o contradictorias añaden ruido y pueden degradar el resultado. Existe el prompt de dos líneas que es excelente.',
    principle: 'La complejidad del prompt debe ser proporcional al riesgo de la tarea.',
    manualRef: 'Manual §9',
  },
  {
    id: 'm3',
    statement: 'Si subo la sentencia original, la IA ya no puede equivocarse.',
    answer: 'falso',
    explanation:
      'Delimitar fuentes reduce el problema de la procedencia. No elimina la mala interpretación, la omisión ni la inferencia no declarada. Es el mito más importante porque es casi verdadero.',
    principle: 'Grounding mejora la procedencia; no garantiza la interpretación.',
    manualRef: 'Manual §17',
    core: true,
  },
  {
    id: 'm4',
    statement: 'Asignar un rol siempre mejora el resultado.',
    answer: 'depende',
    explanation:
      'Puede orientar perspectiva, vocabulario o nivel. Es prescindible cuando la tarea y los criterios ya están claros. Nunca aporta expertise real: pedirle a un modelo que actúe como especialista no le da matrícula, experiencia ni responsabilidad disciplinaria.',
    principle: 'El rol es el primer componente que se elimina si hay que elegir.',
    manualRef: 'Manual §7',
  },
  {
    id: 'm5',
    statement: 'La misma instrucción puede producir respuestas diferentes.',
    answer: 'verdadero',
    explanation:
      'Por muestreo probabilístico, contexto efectivo variable, uso de herramientas y actualizaciones del proveedor. Consecuencia práctica: si el resultado va a sostener algo, guarde la salida.',
    principle: 'Un resultado obtenido en una conversación no es reproducible.',
    manualRef: 'Manual §4',
  },
] as const;

// ─── B03 · DIAGNÓSTICO DIAT ──────────────────────────────────────────────────

export type ComponentId =
  | 'contexto' | 'rol' | 'tarea' | 'fuentes' | 'restricciones' | 'formato' | 'control';

export interface DiatComponent {
  id: ComponentId;
  label: string;
  question: string;
  solves: string;
  example: string;
  ifMissing: string;
  whenOmit: string;
  /** Fuentes y Control son la contribución propia del programa. */
  signature?: boolean;
}

export const diatComponents: readonly DiatComponent[] = [
  {
    id: 'contexto',
    label: 'Contexto',
    question: '¿Qué necesita conocer el modelo antes de empezar?',
    solves: 'Fija finalidad, destinatario, nivel y foco del encargo.',
    example: '«Preparo una ficha de estudio para estudiantes de tercer año sobre la sentencia que adjunto.»',
    ifMissing: 'El sistema decide por nosotros nivel, finalidad y foco.',
    whenOmit: 'En tareas de riesgo bajo donde la operación ya es inequívoca.',
  },
  {
    id: 'rol',
    label: 'Rol',
    question: '¿Qué perspectiva especializada puede ser útil?',
    solves: 'Ajusta registro, vocabulario y perspectiva. Nada más.',
    example: '«Actúa como ayudante docente de Derecho procesal chileno.»',
    ifMissing: 'Nada grave. Usado como adorno aporta poco y genera falsa confianza.',
    whenOmit: 'Siempre que la tarea y los criterios ya estén claros. Es el primero que se elimina.',
  },
  {
    id: 'tarea',
    label: 'Tarea',
    question: '¿Qué debe hacer exactamente?',
    solves: 'Define la operación concreta y sus componentes.',
    example: '«Identifica hechos, cuestión jurídica, argumentos, razonamiento y decisión.»',
    ifMissing: 'Verbos vagos como «analiza» dejan demasiadas decisiones implícitas.',
    whenOmit: 'Nunca. Es el único componente sin el cual no hay encargo.',
  },
  {
    id: 'fuentes',
    label: 'Fuentes',
    question: '¿Con qué información puede trabajar y cuál manda?',
    solves:
      'Delimita el corpus admisible y su jerarquía. En Derecho, la autoridad de lo que se afirma depende de dónde viene.',
    example: '«Trabaja exclusivamente con la sentencia adjunta. No uses información externa.»',
    ifMissing:
      'Puede mezclar patrones aprendidos, resultados web, inferencias y material irrelevante, sin distinguirlos.',
    whenOmit: 'En tareas puramente formales sobre un texto ya provisto.',
    signature: true,
  },
  {
    id: 'restricciones',
    label: 'Restricciones',
    question: '¿Qué debe evitar?',
    solves: 'Explicita el estándar y autoriza la respuesta «no consta».',
    example: '«No inventes normas, citas ni antecedentes. Si algo no consta, escríbelo.»',
    ifMissing:
      'Una prohibición no garantiza cumplimiento, pero su ausencia elimina el estándar contra el cual medir la salida.',
    whenOmit: 'Cuando no hay evidencia que completar: transformación de texto propio.',
  },
  {
    id: 'formato',
    label: 'Formato',
    question: '¿Cómo debe presentar el resultado?',
    solves: 'Hace que la salida sea utilizable sin reprocesarla.',
    example: '«Una tabla de seis filas y una síntesis final de 120 palabras.»',
    ifMissing: 'El contenido puede ser correcto y aun así inutilizable.',
    whenOmit: 'Cuando la forma de salida es indiferente o está impuesta por la tarea.',
  },
  {
    id: 'control',
    label: 'Control',
    question: '¿Qué mecanismos permitirán detectar problemas?',
    solves: 'Hace la salida auditable. Es el puente entre prompting y verificación.',
    example: '«Para cada conclusión indica considerando o página; marca las inferencias como inferencia.»',
    ifMissing:
      'Sin control, la salida no es auditable — y una salida no auditable, en trabajo jurídico, es una salida que no se puede usar.',
    whenOmit: 'En riesgo bajo, donde no hay afirmaciones que sostener.',
    signature: true,
  },
] as const;

/** Las siete instrucciones de control (Documento Maestro, B03). */
export const controlInstructions: readonly string[] = [
  'Distinguir explícitamente hechos de inferencias.',
  'Señalar cuándo una afirmación no tiene respaldo en las fuentes entregadas.',
  'No inventar fuentes bajo ninguna circunstancia.',
  'Identificar qué fuente concreta se usó en cada afirmación.',
  'Indicar página, considerando, artículo o párrafo.',
  'Preguntar cuando falte información crítica, en lugar de suponerla.',
  'Explicitar el grado de incertidumbre en lugar de uniformar el tono asertivo.',
] as const;

/**
 * Prompt de diagnóstico de B03. El Documento Maestro fija el perfil (prompt real
 * de riesgo medio) pero no su texto: esta es la formulación de trabajo indicada
 * en el Guion Docente, sustituible por un prompt propio del profesor.
 * Ver CLASS1_CONTENT_ISSUES.md → C1-06.
 */
export const diagnosisPrompt = {
  text: 'Resume esta sentencia y dime qué implicancias tiene para un caso parecido que estoy viendo.',
  risk: 'medio' as const,
  note:
    'Su virtud didáctica es que le faltan fuentes, restricciones y control, y que «implicancias» pide abiertamente una inferencia sin declararla.',
};

export type ComponentState = 'definido' | 'ambiguo' | 'ausente' | 'innecesario';

export const componentStates: readonly {
  id: ComponentState;
  label: string;
  short: string;
  tone: 'ok' | 'warn' | 'bad' | 'muted';
}[] = [
  { id: 'definido', label: 'Pertinente y definido', short: 'Definido', tone: 'ok' },
  { id: 'ambiguo', label: 'Pertinente pero ambiguo', short: 'Ambiguo', tone: 'warn' },
  { id: 'ausente', label: 'Pertinente y ausente', short: 'Ausente', tone: 'bad' },
  { id: 'innecesario', label: 'No necesario en esta tarea', short: 'No necesario', tone: 'muted' },
] as const;

/**
 * Lectura de referencia del prompt de diagnóstico. No es una «respuesta
 * correcta» con puntaje: es el comentario que el estudiante contrasta con su
 * propio diagnóstico después de confirmarlo.
 */
export const diagnosisReading: Record<ComponentId, { expected: ComponentState[]; comment: string }> = {
  contexto: {
    expected: ['ambiguo', 'ausente'],
    comment:
      'No dice para qué ni para quién es el resumen. El sistema decidirá el nivel y el foco por nosotros.',
  },
  rol: {
    expected: ['innecesario'],
    comment:
      'No aporta nada aquí. Marcarlo como carencia sería el error de leer los siete componentes como un formulario.',
  },
  tarea: {
    expected: ['ambiguo'],
    comment:
      'Hay dos operaciones —resumir y derivar implicancias— y la segunda es una inferencia que el prompt no nombra como tal.',
  },
  fuentes: {
    expected: ['ausente'],
    comment:
      'No delimita el corpus. Nada impide que mezcle la sentencia con jurisprudencia recordada del entrenamiento o con resultados web.',
  },
  restricciones: {
    expected: ['ausente'],
    comment:
      'No dice qué hacer si un dato no consta. Sin ese permiso explícito, la alternativa por defecto es completar el vacío.',
  },
  formato: {
    expected: ['ausente', 'ambiguo'],
    comment:
      'No fija extensión ni estructura. Es la carencia menos grave de todas: molesta, no engaña.',
  },
  control: {
    expected: ['ausente'],
    comment:
      'Nadie pidió localizadores ni separación entre evidencia e inferencia. Sin control, «implicancias» y «lo que dice la sentencia» llegarán mezclados.',
  },
};

export const riskLevels = [
  {
    id: 'bajo' as const,
    label: 'Riesgo bajo',
    examples: 'Corregir ortografía; cambiar el tono; convertir un texto en tabla.',
    structure: 'Tarea + Formato. Nada más.',
    verification: 'Lectura ordinaria del resultado.',
  },
  {
    id: 'medio' as const,
    label: 'Riesgo medio',
    examples: 'Resumir una sentencia adjunta; extraer cláusulas; comparar dos textos aportados.',
    structure: 'Contexto + Tarea + Fuentes + Restricciones + Formato + Control selectivo.',
    verification: 'ICJR sobre las afirmaciones que sostienen conclusiones.',
  },
  {
    id: 'alto' as const,
    label: 'Riesgo alto',
    examples:
      'Investigar jurisprudencia; recomendar estrategia; redactar la versión final de un escrito; citar autoridades.',
    structure:
      'Estructura completa + fuentes autoritativas + control fuerte + verificación humana independiente + registro.',
    verification: 'Los dos últimos ya no son partes del prompt: son partes del proceso.',
  },
] as const;

// ─── B04 · PROMPT LAB ────────────────────────────────────────────────────────

export const promptLabSteps = [
  {
    step: 1,
    component: 'Tarea',
    text: 'Identifica hechos relevantes, cuestión jurídica, normas aplicadas, argumentos de las partes, razonamiento y decisión.',
    stopsDeciding: 'Qué operación ejecutar.',
  },
  {
    step: 2,
    component: 'Contexto',
    text: 'Preparo una ficha de estudio para estudiantes de tercer año de Derecho.',
    stopsDeciding: 'Nivel, finalidad y profundidad.',
  },
  {
    step: 3,
    component: 'Fuentes',
    text: 'Trabaja exclusivamente con el documento adjunto. No incorpores jurisprudencia, doctrina ni hechos externos.',
    stopsDeciding: 'De dónde puede tomar información.',
  },
  {
    step: 4,
    component: 'Restricciones',
    text: 'Si un elemento no consta, escribe: No consta en la fuente. No completes vacíos por inferencia sin declararla.',
    stopsDeciding: 'Qué hacer ante la falta de evidencia.',
  },
  {
    step: 5,
    component: 'Formato',
    text: 'Presenta primero una tabla y luego una síntesis de máximo 150 palabras.',
    stopsDeciding: 'La forma del entregable.',
  },
  {
    step: 6,
    component: 'Control',
    text: 'Para cada afirmación jurídica indica el considerando o página. Distingue expresamente información textual de inferencia propia.',
    stopsDeciding: 'Si el resultado será auditable.',
  },
] as const;

/** Rúbrica DIAT de autoevaluación (Documento Maestro, B04). */
export const rubric = [
  { id: 'tarea', criterion: 'Tarea', question: '¿Se entiende qué operación debe ejecutar?', levels: ['Vaga', 'Parcial', 'Específica'] },
  { id: 'contexto', criterion: 'Contexto / objetivo', question: '¿Se entiende para qué y para quién?', levels: ['No', 'Parcial', 'Sí'] },
  { id: 'fuentes', criterion: 'Fuentes', question: '¿Está delimitado el corpus?', levels: ['No', 'Ambiguo', 'Sí'] },
  { id: 'restricciones', criterion: 'Restricciones', question: '¿Se controlan invenciones, alcance y omisiones?', levels: ['No', 'Algunas', 'Claras'] },
  { id: 'formato', criterion: 'Formato', question: '¿La salida será utilizable sin reprocesarla?', levels: ['No', 'Genérico', 'Específico'] },
  { id: 'control', criterion: 'Control', question: '¿Exige evidencia, localizador o marca de incertidumbre?', levels: ['No', 'Parcial', 'Sí'] },
] as const;

export const rubricNote =
  'La rúbrica no premia la extensión. Un prompt de riesgo bajo con dos componentes bien elegidos está correcto: la ausencia de un componente innecesario no es una carencia. La ausencia de rol nunca lo es.';

// ─── B05 · METAPROMPTING ─────────────────────────────────────────────────────

export const metapromptModes = [
  {
    id: 'auditor',
    label: 'Auditor',
    does: 'Detecta ambigüedad, omisiones y contradicciones en un prompt ya escrito.',
    when: 'Antes de una tarea compleja o repetida.',
    risk: 'Sugerir requisitos innecesarios o desplazar sutilmente el objetivo.',
  },
  {
    id: 'entrevistador',
    label: 'Entrevistador',
    does: 'Formula preguntas aclaratorias antes de redactar el prompt.',
    when: 'Cuando faltan datos esenciales y no se sabe cuáles.',
    risk: 'Convertir una tarea simple en un interrogatorio interminable.',
  },
  {
    id: 'generador',
    label: 'Generador',
    does: 'Transforma una descripción del objetivo en un prompt estructurado.',
    when: 'Para tareas repetibles que se van a plantillar.',
    risk: 'Aceptar una especificación que no se comprende ni se sabe evaluar.',
  },
] as const;

export const metapromptLimits: readonly string[] = [
  'No define el objetivo profesional: puede proponer uno más fácil de cumplir que el nuestro y no avisará del cambio.',
  'No sabe qué fuente tiene autoridad en nuestro ordenamiento.',
  'No conoce nuestro apetito de riesgo.',
  'Tiende a la inflación: optimiza por completitud aparente, no por pertinencia.',
  'Auditar no es verificar.',
] as const;

export const metapromptGuidance = {
  accept:
    'Ambigüedad real, omisiones que cambian el resultado y defectos de formato que harían inutilizable la salida.',
  question:
    'Requisitos que no mejoran esta tarea; reformulaciones que desplazan el objetivo; «citar doctrina relevante» sin criterio de autoridad.',
  neverDelegate:
    'El objetivo profesional, la jerarquía de fuentes admisibles y el nivel de riesgo aceptado. Son decisiones del abogado.',
} as const;

// ─── B06 · ERROR LAB ─────────────────────────────────────────────────────────

export type ErrorType = 'tipo1' | 'tipo2' | 'tipo3' | 'tipo4';

export interface ErrorTypeDef {
  id: ErrorType;
  n: number;
  label: string;
  definition: string;
  example: string;
  danger: string;
  detect: string;
  verify: string;
  core?: boolean;
}

export const errorTypes: readonly ErrorTypeDef[] = [
  {
    id: 'tipo1',
    n: 1,
    label: 'Fuente inexistente',
    definition: 'Sentencia, artículo, libro o autor que no existe.',
    example:
      'La obra atribuida a un profesor real que ninguna editorial publicó — el caso de la Corte Suprema.',
    danger: 'Tiene forma bibliográfica perfecta. Parece citable.',
    detect: 'Buscarla en catálogos, repositorios oficiales o el sitio de la editorial.',
    verify: 'Existencia del documento. Si no aparece, no existe: no se «matiza».',
  },
  {
    id: 'tipo2',
    n: 2,
    label: 'Fuente real, proposición falsa',
    definition: 'La fuente existe, pero no sostiene lo que se le atribuye.',
    example: '«CS Rol 12.345-2024 estableció que…», cuando ese rol trata de una materia distinta.',
    danger:
      'Supera la verificación superficial. Se le cuela a quien sí revisa, no al distraído.',
    detect: 'Abrir la fuente y leer el pasaje.',
    verify:
      'Materia, cuestión resuelta y decisión. Que el rol exista no es el punto; el punto es qué dice.',
    core: true,
  },
  {
    id: 'tipo3',
    n: 3,
    label: 'Cita alterada',
    definition: 'Se presenta como textual una paráfrasis o una frase inventada.',
    example: 'Comillas alrededor de una frase que resume bien el considerando pero no aparece en él.',
    danger: 'Las comillas producen apariencia de evidencia directa e invitan a no comprobar.',
    detect: 'Cotejar contra el texto original.',
    verify: 'Literalidad. Una buena paráfrasis deja de serlo al entrecomillarse.',
  },
  {
    id: 'tipo4',
    n: 4,
    label: 'Descontextualización',
    definition: 'La fuente es real y está correctamente citada, pero es jurídicamente impropia.',
    example:
      'Norma derogada o modificada; jurisdicción distinta; precedente materialmente diferente; fecha anterior a la reforma.',
    danger: 'Todo verifica bien excepto la aplicabilidad, que es lo único que importaba.',
    detect: 'Comprobar texto vigente, fecha de aplicación, jurisdicción y semejanza material.',
    verify: 'Aplicabilidad al caso, no solo exactitud de la cita.',
  },
] as const;

export interface ErrorCase {
  id: string;
  text: string;
  answer: ErrorType;
  discussion: string;
}

/** Mini banco de errores (Documento Maestro, III.8). */
export const errorCases: readonly ErrorCase[] = [
  {
    id: 'c1',
    text: 'La IA cita «CS Rol 12.345-2024». El rol existe, pero corresponde a una materia completamente distinta.',
    answer: 'tipo2',
    discussion:
      'Verificar la existencia no basta: hay que revisar materia y decisión. Es el error que sobrevive a la comprobación superficial.',
  },
  {
    id: 'c2',
    text: 'Atribuye a un profesor conocido un libro de 2025 que no aparece en catálogos ni en el sitio de ninguna editorial.',
    answer: 'tipo1',
    discussion:
      'La forma bibliográfica plausible no es evidencia. Es exactamente el caso de la Corte Suprema con el que abrimos.',
  },
  {
    id: 'c3',
    text: 'Entrecomilla una frase que resume muy bien un considerando, pero ese texto literal no aparece en la sentencia.',
    answer: 'tipo3',
    discussion:
      'Una buena paráfrasis deja de ser buena en el momento en que se presenta entre comillas.',
  },
  {
    id: 'c4',
    text: 'Usa una norma real que fue sustituida por una reforma posterior a los hechos del caso.',
    answer: 'tipo4',
    discussion:
      'Verificar texto y fecha de aplicación. La cita es impecable y la conclusión, inaplicable.',
  },
  {
    id: 'c5',
    text: 'Responde citando un fallo de un tribunal español porque la cuestión es análoga, sin advertir el cambio de jurisdicción.',
    answer: 'tipo4',
    discussion:
      'La analogía puede ser útil como argumento y nunca como autoridad. Distinguir ambas cosas es la operación jurídica.',
  },
] as const;

/** Caso de revelación progresiva sobre el error tipo 2. */
export const revealCase = {
  claim:
    '«La Corte Suprema, en el Rol 12.345-2024, estableció que el plazo de prescripción se suspende mientras el acreedor desconozca la identidad del deudor.»',
  steps: [
    {
      id: 's1',
      prompt: 'Primera comprobación: el rol existe. Aparece en la base jurisprudencial y el enlace abre.',
      question: '¿Ya está verificada la afirmación?',
      options: [
        { id: 'si', label: 'Sí: la fuente existe y el enlace abre.' },
        { id: 'no', label: 'No: todavía no sé qué dice la sentencia.' },
      ],
      correct: 'no',
      feedbackCorrect:
        'Correcto. Comprobar que el rol existe es localizar, no verificar. Son operaciones distintas.',
      feedbackWrong:
        'Todavía no. Que el rol exista y el enlace abra demuestra que el documento existe; no demuestra que diga lo que la respuesta afirma.',
    },
  ],
  revelation:
    'Abrimos la sentencia. Trata de una materia distinta y no contiene ninguna regla sobre suspensión de la prescripción por desconocimiento del deudor. La fuente es real. La proposición atribuida, no.',
  lesson: 'FUENTE REAL ≠ CONCLUSIÓN CORRECTA',
  contrast:
    'Tipo 2 y tipo 4 se confunden con facilidad. En el tipo 4 la fuente sí dice eso, pero no aplica —norma derogada, otra jurisdicción, otro supuesto—. En el tipo 2 la fuente ni siquiera dice eso. Se verifican distinto: uno con lectura del pasaje, el otro con vigencia y ámbito.',
} as const;

/** Siete señales de alerta (Documento Maestro, B06). */
export const warningSignals = [
  { n: 1, text: 'Citas extremadamente precisas sin localizador verificable.', gloss: 'La precisión aparente sustituye a la comprobabilidad.' },
  { n: 2, text: 'Fórmulas como «jurisprudencia uniforme» o «doctrina pacífica» sin ninguna fuente concreta.', gloss: 'El lenguaje inflado ocupa el lugar de la referencia.' },
  { n: 3, text: 'Libros o artículos con títulos demasiado convenientes para el argumento que se quiere sostener.', gloss: 'Calzan perfecto porque fueron generados para calzar.' },
  { n: 4, text: 'Comillas textuales sin página, considerando ni enlace a fuente primaria.', gloss: 'La apariencia de evidencia directa sin evidencia.' },
  { n: 5, text: 'Fechas, porcentajes o cifras exactas que aparecen sin procedencia.', gloss: 'La exactitud numérica no es, por sí sola, un indicio de origen.' },
  { n: 6, text: 'Respuesta muy segura frente a una pregunta para la que el material entregado era insuficiente.', gloss: 'El tono asertivo es uniforme; la evidencia, no.' },
  { n: 7, text: 'Un resultado que coincide demasiado bien con lo que esperábamos encontrar.', gloss: 'Es la única de las siete que no apunta al sistema, sino a nosotros.' },
] as const;

// ─── B07 · GROUNDING LAB ─────────────────────────────────────────────────────

export const workModes = [
  {
    id: 'chat',
    label: 'Chat abierto',
    receives: 'Prompt + conversación + capacidades del producto (búsqueda web, memoria).',
    advantage: 'Rapidez, exploración amplia, generación de hipótesis.',
    residualRisk: 'La procedencia de cada afirmación puede ser difusa o inexistente.',
    use: 'Explorar el problema, generar preguntas y borradores no citables.',
  },
  {
    id: 'adjunto',
    label: 'Documento adjunto',
    receives: 'Prompt + uno o más documentos aportados en la conversación.',
    advantage: 'Análisis focalizado sobre material propio.',
    residualRisk:
      'Puede complementar con conocimiento externo sin avisar, según la configuración del producto.',
    use: 'Analizar, resumir o comparar textos que uno aporta, con control explícito de fuentes.',
  },
  {
    id: 'corpus',
    label: 'Entorno basado en fuentes',
    receives: 'Corpus seleccionado + mecanismo de recuperación restringido a ese corpus.',
    advantage: 'Trazabilidad: cada afirmación puede remitirse a un fragmento.',
    residualRisk:
      'Recuperación incompleta, síntesis defectuosa, omisión e interpretación errónea del fragmento correcto.',
    use: 'Trabajo sostenido sobre un conjunto estable de documentos que se van a citar.',
  },
] as const;

export const googleWarning = {
  text: 'Gemini Notebook can make mistakes and its answers don’t reflect Google’s views. Always consult a qualified professional for medical, legal, or financial advice.',
  translation:
    'Gemini Notebook puede cometer errores y sus respuestas no reflejan las opiniones de Google. Consulte siempre a un profesional calificado para asuntos médicos, legales o financieros.',
  source: 'Ayuda oficial de Gemini Notebook, consultada el 22 de agosto de 2026.',
  comment: 'Es el propio proveedor quien excluye el uso como asesoría legal.',
} as const;

export const terminologyBan = {
  banned: '«herramienta antialucinaciones»',
  correct: [
    'entorno de trabajo fundamentado en fuentes',
    'sistema que permite trabajar sobre un corpus documental previamente seleccionado',
  ],
} as const;

export interface GroundingDecision {
  id: string;
  scenario: string;
  question: string;
  options: readonly { id: string; label: string }[];
  correct: string;
  feedbackCorrect: string;
  feedbackWrong: string;
  principle: string;
}

export const groundingDecisions: readonly GroundingDecision[] = [
  {
    id: 'g1',
    scenario:
      'En la demostración, cada afirmación aparece acompañada de un localizador. El profesor abre uno y el fragmento carga correctamente en diez segundos.',
    question: 'El localizador existe y abre. ¿Esto basta para validar la conclusión?',
    options: [
      { id: 'a', label: 'Sí: el anclaje en fuentes resuelve el problema.' },
      { id: 'b', label: 'No: acredita de qué fragmento salió, no que la conclusión se siga de él.' },
      { id: 'c', label: 'Depende de la herramienta que se use.' },
    ],
    correct: 'b',
    feedbackCorrect:
      'Exacto. Un localizador indica de qué fragmento salió la información. No demuestra que la conclusión se siga correctamente de ese fragmento.',
    feedbackWrong:
      'No. Es el error tipo 2 ocurriendo dentro de un entorno anclado en fuentes: todo está correctamente enlazado y la conclusión sigue sin sostenerse. Y no depende de la herramienta: depende de leer el fragmento.',
    principle: 'PROCEDENCIA ≠ INTERPRETACIÓN',
  },
  {
    id: 'g2',
    scenario:
      'Se pide una conclusión discutible: «¿el tribunal habría fallado igual si el plazo hubiera vencido?». La respuesta llega bien construida, anclada en el documento y citando fragmentos reales.',
    question: '¿La afirmación está contenida en el fragmento o es una inferencia?',
    options: [
      { id: 'a', label: 'Está contenida: cita fragmentos reales del documento.' },
      { id: 'b', label: 'Es una inferencia: el tribunal no resolvió ese supuesto.' },
      { id: 'c', label: 'Es una cita textual mal formateada.' },
    ],
    correct: 'b',
    feedbackCorrect:
      'Correcto. Todos los enlaces abren y la conclusión sigue siendo discutible. Una inferencia no se «verifica»: se evalúa el razonamiento, y debe declararse siempre como inferencia.',
    feedbackWrong:
      'La pregunta plantea un supuesto que el tribunal no resolvió. Que la respuesta cite fragmentos reales no convierte la conclusión en contenido de la fuente: es una inferencia, estatus C.',
    principle: 'El anclaje en fuentes no garantiza interpretación correcta.',
  },
] as const;

export const confidentialityRule = {
  rule:
    'No se suben a ninguna herramienta datos personales, antecedentes de clientes, expedientes privados ni información confidencial sin análisis previo.',
  guide:
    'La Guía de sugerencias para el uso responsable de inteligencia artificial en el ejercicio profesional fue aprobada por el Consejo General del Colegio de Abogados de Chile A.G. el 6 de julio de 2026 y publicada el 24 de julio de 2026. Es un instrumento de sugerencias, no una norma. Alcanza directamente a los colegiados; la colegiatura en Chile es voluntaria, de modo que respecto de los no colegiados opera como estándar de referencia.',
  beforeUploading: [
    'Riesgo de revelación',
    'Condiciones del proveedor',
    'Medidas de resguardo',
    'Sensibilidad de la información',
  ],
  law: {
    title: 'Ley N° 21.719',
    date: '1 de diciembre de 2026',
    detail:
      'Regula la protección y el tratamiento de los datos personales y crea la Agencia de Protección de Datos Personales. Entra en vigencia tres meses después de esta clase.',
  },
  bill: {
    title: 'Proyecto sobre sistemas de IA · Boletín 16821-19',
    detail:
      'En segundo trámite constitucional en el Senado, con urgencia simple desde el 4 de agosto de 2026. Chile todavía no tiene ley de inteligencia artificial: en trámite no es lo mismo que vigente.',
  },
} as const;

// ─── B08 · ICJR ──────────────────────────────────────────────────────────────

export const icjrPhases = [
  {
    letter: 'I',
    name: 'Identificar',
    question: '¿Qué afirmaciones necesitan comprobación?',
    operation:
      'Marcar normas, jurisprudencia, doctrina, citas textuales, hechos externos, fechas, cifras y afirmaciones categóricas. Priorizar lo que sostiene una conclusión jurídica o podría causar daño si es falso.',
    expected: 'Una lista acotada y jerarquizada de afirmaciones a verificar.',
    avoids: 'Revisar todo por igual — o, lo que es lo mismo, no revisar nada de verdad.',
  },
  {
    letter: 'C',
    name: 'Contrastar',
    question: '¿Existe la fuente y sostiene realmente la afirmación?',
    operation:
      'Buscar la fuente primaria u oficial. Verificar existencia, jurisdicción, fecha, vigencia, texto y contexto. No quedarse en que «el rol existe».',
    expected: 'Un juicio fundado sobre si la fuente respalda o no la afirmación.',
    avoids: 'El error tipo 2: dar por buena una fuente real que no dice lo que se le atribuye.',
  },
  {
    letter: 'J',
    name: 'Justificar',
    question: '¿Dónde está exactamente el respaldo?',
    operation:
      'Anotar artículo, considerando, página, párrafo o sección. Si la conclusión es inferencial, reconocerla como tal y explicitar el puente entre fuente y conclusión.',
    expected: 'Un localizador preciso, o una inferencia declarada como inferencia.',
    avoids: 'Presentar como respaldado por la fuente aquello que en realidad se dedujo de ella.',
  },
  {
    letter: 'R',
    name: 'Registrar',
    question: '¿Qué quedó verificado y con qué resultado?',
    operation:
      'Dejar constancia que permita reconstruir qué se revisó, contra qué fuente y qué se decidió: mantener, matizar, corregir o eliminar.',
    expected: 'Un registro reconstruible por un tercero — o por uno mismo tres meses después.',
    avoids: 'Haber verificado y no poder demostrarlo.',
  },
] as const;

export type EpistemicStatus = 'A' | 'B' | 'C' | 'D' | 'E';

export const epistemicStatuses: readonly {
  id: EpistemicStatus;
  label: string;
  meaning: string;
  howToCheck: string;
  admissibleUse: string;
}[] = [
  {
    id: 'A',
    label: 'Respaldada por fuente',
    meaning: 'Hay texto en la fuente entregada que dice esto.',
    howToCheck: 'Se verifica con localizador: abrir y leer el pasaje.',
    admissibleUse: 'Es la única que puede sostener una conclusión sin más.',
  },
  {
    id: 'B',
    label: 'Síntesis de fuente',
    meaning: 'Resume o reordena contenido de la fuente sin añadir nada.',
    howToCheck: 'Se verifica que la síntesis sea fiel y que no omita una excepción relevante.',
    admissibleUse: 'Utilizable, indicando que es síntesis y no texto literal.',
  },
  {
    id: 'C',
    label: 'Inferencia',
    meaning: 'Conclusión derivada del material, no contenida en él.',
    howToCheck: 'No se «verifica»: se evalúa el razonamiento.',
    admissibleUse: 'Admisible como argumento propio, siempre declarada como inferencia.',
  },
  {
    id: 'D',
    label: 'Hipótesis',
    meaning: 'Posibilidad planteada, sin pretensión de estar respaldada.',
    howToCheck: 'Se etiqueta como hipótesis.',
    admissibleUse: 'No entra en un escrito como afirmación. Sirve para explorar, no para sostener.',
  },
  {
    id: 'E',
    label: 'Información externa no verificada',
    meaning: 'Afirmación sobre el mundo que no proviene de las fuentes entregadas.',
    howToCheck: 'Se verifica contra fuente externa o se elimina.',
    admissibleUse: 'Ninguno mientras no se verifique. Es la categoría que produce las sanciones.',
  },
] as const;

export type ClaimState =
  | 'confirmada' | 'parcial' | 'no-respaldada' | 'contradictoria' | 'no-verificable';

export const claimStates: readonly { id: ClaimState; label: string; detail: string; action: string }[] = [
  { id: 'confirmada', label: 'Confirmada', detail: 'La fuente existe y sostiene la afirmación.', action: 'mantener' },
  { id: 'parcial', label: 'Parcialmente respaldada', detail: 'La fuente sostiene parte de la afirmación.', action: 'matizar' },
  { id: 'no-respaldada', label: 'No respaldada', detail: 'La fuente existe pero no sostiene la afirmación.', action: 'eliminar' },
  { id: 'contradictoria', label: 'Contradictoria', detail: 'La fuente dice lo contrario.', action: 'eliminar' },
  { id: 'no-verificable', label: 'No verificable con las fuentes disponibles', detail: 'No se pudo comprobar en el tiempo o con el material.', action: 'investigar' },
] as const;

export type ClaimAction = 'mantener' | 'matizar' | 'corregir' | 'eliminar' | 'investigar';

export const claimActions: readonly { id: ClaimAction; label: string }[] = [
  { id: 'mantener', label: 'Mantener' },
  { id: 'matizar', label: 'Matizar' },
  { id: 'corregir', label: 'Corregir' },
  { id: 'eliminar', label: 'Eliminar' },
  { id: 'investigar', label: 'Investigar' },
] as const;

/** Fila resuelta de referencia (PPT slide 27). */
export const solvedRow = {
  claim: 'El plazo de prescripción aplicable es de 5 años conforme al art. 2515 CC.',
  status: 'A' as EpistemicStatus,
  source: 'Código Civil chileno (fuente oficial)',
  locator: 'Art. 2515 inc. 1°',
  state: 'confirmada' as ClaimState,
  action: 'mantener' as ClaimAction,
};

export const icjrPriority = {
  order: [
    'Autoridades y citas (normas, jurisprudencia, doctrina)',
    'Hechos materiales',
    'Cifras y fechas',
    'Inferencias que sostienen la conclusión',
  ],
  hierarchy: 'Fuente primaria → fuente oficial → fuente secundaria confiable.',
  rule: 'Nunca una segunda IA como término del contraste.',
} as const;

export const notVerifiedRule =
  'Si una afirmación no puede verificarse en el tiempo disponible, el resultado correcto es «no verificada». No se completa el hueco por intuición. Un estado honesto vale más que una casilla llena.';

// ─── B09 · CIERRE ────────────────────────────────────────────────────────────

export const closingIntegration = [
  'Falló el sistema: generó una referencia que no existe, y eso es comportamiento del sistema, no mala suerte.',
  'Falló el prompt, probablemente: una instrucción sin fuentes delimitadas y sin control deja seis decisiones en manos de la herramienta.',
  'Falló el control ex ante: nadie pidió localizadores, y sin localizadores no hay nada que abrir.',
  'Falló la verificación ex post: nadie leyó la fuente, porque no había fuente que leer.',
  'Y falló algo que no es ninguno de los cuatro anteriores: la persona que firmó incorporó a un escrito judicial una afirmación que no había comprobado.',
] as const;

export const closingSynthesis =
  'Las cinco cosas son verdad al mismo tiempo. Y ninguna de las cuatro primeras cancela la quinta, porque las cuatro primeras se distribuyen y la quinta no: la responsabilidad profesional no se delega al modelo.';

export const productCPrompts = {
  before: 'Antes de esta clase pensaba que el problema era…',
  after: 'Ahora agregaría…',
  doubt: 'Todavía tengo una duda sobre… (opcional)',
} as const;

export const finalStatement = 'LA IA NO COMPARECE ANTE EL TRIBUNAL.';
export const finalSubtitle =
  'La responsabilidad profesional sobre lo que se afirma, cita y firma sigue siendo humana.';
