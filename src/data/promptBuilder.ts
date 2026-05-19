// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface PromptProfile {
  id: string;
  label: string;
  emoji: string;
  template: string;
}

export interface PromptPurpose {
  id: string;
  label: string;
  emoji: string;
  template: string;
}

export interface PromptArea {
  id: string;
  label: string;
  emoji: string;
  sources: string[];
  template: string;
}

export interface DepthLevel {
  id: string;
  label: string;
  description: string;
  template: string;
}

export interface TargetAI {
  id: string;
  label: string;
  description: string;
  optimizationTip: string;
}

export interface OutputFormat {
  id: string;
  label: string;
  emoji: string;
  template: string;
}

export interface Enhancement {
  id: string;
  label: string;
  emoji: string;
  description: string;
  template: string;
}

// ─── STEP 1: PERFIL ───────────────────────────────────────────────────────────

export const profiles: PromptProfile[] = [
  {
    id: 'estudiante', label: 'Estudiante de Derecho', emoji: '🎓',
    template: 'Actúa como un asistente jurídico experto orientado a apoyar a un estudiante de Derecho. Explica los conceptos con rigor académico y claridad pedagógica. Cita normas vigentes distinguiéndolas de las derogadas. Prioriza la comprensión estructural del sistema jurídico sobre la memorización. Si un concepto es complejo, usa ejemplos contextualizados en el sistema jurídico chileno.',
  },
  {
    id: 'abogado', label: 'Abogado en ejercicio', emoji: '⚖️',
    template: 'Actúa como un abogado senior con vasta experiencia en el sistema jurídico chileno. Tu análisis debe ser técnico, preciso y orientado a resultados prácticos. Anticipa contingencias jurídicas, identifica riesgos y propón estrategias concretas. No expliques lo obvio — asume un interlocutor con formación jurídica sólida. Sé directo y eficiente.',
  },
  {
    id: 'academico', label: 'Académico / Investigador', emoji: '🔬',
    template: 'Actúa como un investigador jurídico con expertise en dogmática, teoría del derecho y derecho comparado. Tu análisis debe tener rigor científico: cita doctrina nacional e internacional, identifica los debates en curso, distingue entre posiciones doctrinales y evalúa críticamente los argumentos. Usa notas al pie cuando sea relevante.',
  },
  {
    id: 'funcionario', label: 'Funcionario público', emoji: '🏛️',
    template: 'Actúa como asesor jurídico especializado en derecho público y administrativo. Tu análisis debe respetar el principio de legalidad, considerar el control de la Contraloría General de la República y las implicancias institucionales de cada decisión. Prioriza la objetividad técnica sobre la conveniencia política.',
  },
  {
    id: 'docente', label: 'Ayudante / Docente', emoji: '📚',
    template: 'Actúa como un asistente jurídico experto en apoyo a docentes y ayudantes de derecho. Genera materiales estructurados, didácticos y académicamente rigurosos. Prioriza la claridad conceptual, los ejemplos bien construidos y las rutas de aprendizaje progresivas. Distingue entre nivel introductorio y nivel avanzado.',
  },
];

// ─── STEP 2: FINALIDAD ────────────────────────────────────────────────────────

export const purposes: PromptPurpose[] = [
  {
    id: 'estudiar', label: 'Estudiar materia', emoji: '📖',
    template: 'Tu objetivo es APOYAR EL ESTUDIO de una materia jurídica específica. Presenta los conceptos de mayor a menor complejidad, vincula cada institución con su fundamento normativo, e identifica las preguntas de examen más comunes. Usa esquemas cuando simplifiquen la comprensión.',
  },
  {
    id: 'examen', label: 'Preparar examen oral', emoji: '🎤',
    template: 'Tu objetivo es PREPARAR UN EXAMEN ORAL. Genera preguntas del nivel del interrogador, anticipa las preguntas difíciles o trampa, propón respuestas concisas y bien articuladas, e identifica los puntos donde el tribunal suele profundizar. El formato debe ser pregunta / respuesta modelo / observación crítica.',
  },
  {
    id: 'redactar', label: 'Redactar documento', emoji: '📝',
    template: 'Tu objetivo es REDACTAR UN DOCUMENTO JURÍDICO completo con precisión técnica. Incluye todas las cláusulas, secciones y requisitos formales que exige el tipo de documento. Usa terminología jurídica apropiada. Asegúrate de que el documento sea válido y funcional según la legislación chilena vigente.',
  },
  {
    id: 'sentencia', label: 'Analizar sentencia', emoji: '⚖️',
    template: 'Tu objetivo es ANALIZAR UNA SENTENCIA en profundidad. Identifica: hechos del litigio, cuestiones jurídicas planteadas, normas aplicadas, razonamiento del tribunal, doctrina jurisprudencial establecida y posibles críticas. Evalúa la coherencia lógica y jurídica del fallo.',
  },
  {
    id: 'contrato', label: 'Analizar contrato', emoji: '📋',
    template: 'Tu objetivo es ANALIZAR UN CONTRATO con perspectiva jurídica experta. Identifica: partes y capacidad, objeto y causa, cláusulas de riesgo, posibles nulidades, desequilibrios prestacionales, cláusulas abusivas, vacíos contractuales y estrategia de negociación. Prioriza los hallazgos por nivel de riesgo.',
  },
  {
    id: 'audiencia', label: 'Preparar audiencia', emoji: '🎯',
    template: 'Tu objetivo es PREPARAR UNA AUDIENCIA con estrategia completa. Desarrolla: argumentario principal y subsidiario, anticipación de argumentos contrarios con rebates específicos, orden de presentación de prueba, manejo de preguntas del tribunal y plan B ante cada escenario adverso.',
  },
  {
    id: 'estrategia', label: 'Crear estrategia procesal', emoji: '♟️',
    template: 'Tu objetivo es DISEÑAR UNA ESTRATEGIA PROCESAL completa. Analiza: vías procesales disponibles, sus fortalezas y debilidades, plazos críticos, riesgos de cada ruta, costos y probabilidades de éxito. Propón la ruta óptima con plan contingente.',
  },
  {
    id: 'doctrina', label: 'Investigar doctrina', emoji: '🔍',
    template: 'Tu objetivo es realizar una INVESTIGACIÓN DOCTRINARIA exhaustiva. Mapea las posiciones doctrinales relevantes, identifica los autores de referencia, los debates no resueltos, los puntos de consenso y las tendencias emergentes. Organiza el resultado por corrientes de pensamiento.',
  },
  {
    id: 'comparar', label: 'Comparar normas', emoji: '🔄',
    template: 'Tu objetivo es COMPARAR NORMAS O SISTEMAS JURÍDICOS. Establece los criterios de comparación, analiza semejanzas y diferencias estructurales, identifica las razones históricas o filosóficas de las divergencias y extrae conclusiones aplicables al derecho chileno.',
  },
  {
    id: 'agente', label: 'Crear agente / GPT jurídico', emoji: '🤖',
    template: 'Tu objetivo es GENERAR UN SYSTEM PROMPT para un agente jurídico especializado. Diseña el rol, las capacidades, las restricciones, el comportamiento por defecto, los protocolos de error y el tono. El resultado debe ser un system prompt de producción, listo para configurar en Claude Project o GPT personalizado.',
  },
];

// ─── STEP 3: ÁREA ────────────────────────────────────────────────────────────

export const areas: PromptArea[] = [
  {
    id: 'civil', label: 'Civil', emoji: '📜',
    sources: ['Código Civil · bcn.cl', 'Sala Civil Corte Suprema · pjud.cl', 'Repertorio de Legislación y Jurisprudencia'],
    template: 'Opera bajo el Código Civil chileno y sus normas complementarias. Aplica los principios de autonomía de la voluntad, buena fe objetiva y la teoría general del acto jurídico. En materia de responsabilidad, distingue la contractual de la extracontractual.',
  },
  {
    id: 'procesal_civil', label: 'Procesal Civil', emoji: '🏛️',
    sources: ['Código de Procedimiento Civil · bcn.cl', 'Sala Civil Corte Suprema · pjud.cl', 'Ley 18.120 sobre comparecencia'],
    template: 'Aplica el Código de Procedimiento Civil y la normativa procesal vigente. Considera plazos, cargas procesales, incidentes, recursos y excepciones. Prioriza el análisis de procedencia de cada acción y los requisitos formales de los escritos.',
  },
  {
    id: 'penal', label: 'Penal', emoji: '🔒',
    sources: ['Código Penal · bcn.cl', 'Código Procesal Penal · bcn.cl', 'Art. 19 CPR · Sala Penal CS · pjud.cl'],
    template: 'Aplica el Código Penal y el Código Procesal Penal. Respeta los principios de legalidad, culpabilidad y proporcionalidad. En materia procesal, analiza el sistema acusatorio oral y las garantías constitucionales del art. 19 CPR.',
  },
  {
    id: 'procesal_penal', label: 'Procesal Penal', emoji: '⚖️',
    sources: ['Código Procesal Penal · bcn.cl', 'Ministerio Público · fiscaliadechile.cl', 'Sala Penal CS · pjud.cl'],
    template: 'Analiza bajo el sistema procesal penal acusatorio oral chileno. Considera las etapas del proceso, los intervinientes, las audiencias y los recursos. Prioriza garantías constitucionales y los estándares de la Corte Suprema en sala penal.',
  },
  {
    id: 'administrativo', label: 'Administrativo', emoji: '🏢',
    sources: ['LOCBGAE Ley 18.575 · bcn.cl', 'Contraloría General · contraloria.cl', 'Ley 19.880 procedimientos admin.'],
    template: 'Aplica la LOCBGAE y la Ley 19.880 sobre procedimientos administrativos. Considera el principio de legalidad, la competencia del órgano, el control de la Contraloría General de la República y los plazos administrativos.',
  },
  {
    id: 'constitucional', label: 'Constitucional', emoji: '📰',
    sources: ['CPR 1980 · bcn.cl', 'Tribunal Constitucional · tribunalconstitucional.cl', 'Corte Suprema pleno · pjud.cl'],
    template: 'Opera desde la Constitución Política de la República y la jurisprudencia del Tribunal Constitucional. Considera la supremacía constitucional, el principio de legalidad, los derechos fundamentales del art. 19 y los mecanismos de control de constitucionalidad.',
  },
  {
    id: 'laboral', label: 'Laboral', emoji: '🤝',
    sources: ['Código del Trabajo · bcn.cl', 'Dirección del Trabajo · dt.gob.cl', 'Juzgados Laborales · pjud.cl'],
    template: 'Aplica el Código del Trabajo y la normativa laboral vigente. Considera el principio pro-trabajador, las normas de orden público irrenunciables y los dictámenes de la Dirección del Trabajo. En materia procesal, aplica el procedimiento monitorio o ordinario laboral según corresponda.',
  },
  {
    id: 'tech', label: 'Derecho y Tecnología', emoji: '💻',
    sources: ['Ley 19.628 datos personales · bcn.cl', 'Ley 21.663 (AI) · bcn.cl', 'CISA · cisa.gov (ref. comparada)'],
    template: 'Opera en la intersección entre derecho y tecnología. Considera la Ley 19.628 de protección de datos personales, la normativa emergente sobre IA en Chile, los estándares internacionales de ciberseguridad y las implicancias jurídicas de la automatización y el procesamiento de datos.',
  },
  {
    id: 'filosofia', label: 'Filosofía del Derecho', emoji: '🧭',
    sources: ['Doctrina iusfilosófica relevante', 'Teoría general del derecho', 'Derecho comparado'],
    template: 'Aborda la cuestión desde la filosofía del derecho y la teoría jurídica. Considera las corrientes del positivismo, el iusnaturalismo, el realismo jurídico y las teorías contemporáneas (Dworkin, Hart, Alexy). Distingue entre el derecho que es y el que debe ser.',
  },
];

// ─── STEP 4: PROFUNDIDAD ─────────────────────────────────────────────────────

export const depthLevels: DepthLevel[] = [
  {
    id: 'rapido', label: 'Rápido', description: 'Síntesis en 5 min',
    template: 'Sé conciso y directo. Entrega la respuesta más útil en el menor espacio posible. Prioriza la acción sobre la explicación.',
  },
  {
    id: 'intermedio', label: 'Intermedio', description: 'Análisis equilibrado',
    template: 'Desarrolla el análisis con un nivel de profundidad intermedio: cubre los aspectos esenciales con fundamentos normativos, sin extenderte en detalles secundarios.',
  },
  {
    id: 'examen', label: 'Examen de grado', description: 'Para defender ante tribunal',
    template: 'El nivel de análisis debe ser apto para un examen de grado. Cubre la institución en profundidad, anticipa preguntas difíciles, incluye posiciones doctrinales en debate y jurisprudencia relevante de la Corte Suprema.',
  },
  {
    id: 'profesional', label: 'Profesional', description: 'Para uso en ejercicio',
    template: 'Nivel de profundidad profesional. El output debe ser usable directamente en el ejercicio del derecho. Incluye análisis de contingencias, riesgos y recomendaciones accionables.',
  },
  {
    id: 'academico', label: 'Académico', description: 'Para investigación y publicación',
    template: 'Nivel académico con rigor científico. Incluye referencias doctrinales, nota al pie cuando corresponda, estado del debate y posición del autor. El output debe ser apto para publicación o trabajo de investigación.',
  },
  {
    id: 'litigacion', label: 'Litigación avanzada', description: 'Para sala y audiencias',
    template: 'Nivel de litigación avanzada. El análisis debe incluir argumentación táctica, anticipación de la posición contraria con rebates específicos, fortalezas y debilidades de la posición propia, y plan de contingencia ante cada escenario adverso.',
  },
];

// ─── STEP 5: IA OBJETIVO ──────────────────────────────────────────────────────

export const targetAIs: TargetAI[] = [
  {
    id: 'claude', label: 'Claude',
    description: 'Mejor para análisis profundo y documentos extensos',
    optimizationTip: 'Este prompt está optimizado para Claude. Aprovecha su context window extendido (200k tokens) pegando el documento completo sin fragmentar. Claude responde mejor a instrucciones detalladas y precisas. Usa "<documento>" tags para separar el material de referencia de la instrucción.',
  },
  {
    id: 'chatgpt', label: 'ChatGPT',
    description: 'Mejor para agentes, GPTs y workflows',
    optimizationTip: 'Este prompt está optimizado para ChatGPT (GPT-4o). Para documentos extensos, fragmenta en secciones y solicita análisis incremental. Si es para un GPT personalizado, el campo "Instructions" admite hasta 8.000 caracteres. Usa el modo "Reason" para análisis complejos.',
  },
  {
    id: 'gemini', label: 'Gemini',
    description: 'Mejor para PDFs y ecosistema Google',
    optimizationTip: 'Este prompt está optimizado para Gemini 2.0. Puedes adjuntar el PDF directamente sin copiar el texto. Funciona mejor con instrucciones divididas en secciones claras. Si usas Gemini en Google Docs, el prompt puede ir en el panel lateral de IA Gemini.',
  },
  {
    id: 'notebooklm', label: 'NotebookLM',
    description: 'Mejor para investigar dentro de tus propios documentos',
    optimizationTip: 'Este prompt está optimizado para NotebookLM. Primero sube todos tus documentos fuente (libros, sentencias, apuntes). Luego usa este prompt como pregunta directa. NotebookLM responde citando textualmente tus fuentes — nunca inventa. Ideal para investigación verificable.',
  },
  {
    id: 'perplexity', label: 'Perplexity',
    description: 'Mejor para búsqueda con fuentes actuales',
    optimizationTip: 'Este prompt está optimizado para Perplexity AI. Añade "Busca en fuentes verificables y cita URLs exactas" al final. Perplexity recupera información actualizada de la web — ideal para normativa reciente, decretos y jurisprudencia de los últimos meses.',
  },
];

// ─── STEP 6: FORMATO ─────────────────────────────────────────────────────────

export const outputFormats: OutputFormat[] = [
  { id: 'tabla', label: 'Tabla', emoji: '📊', template: 'Entrega la respuesta en formato de tabla con columnas claramente identificadas. Usa filas para cada elemento analizado y columnas para los criterios de análisis.' },
  { id: 'esquema', label: 'Esquema', emoji: '🗂️', template: 'Presenta la respuesta como esquema jerárquico: I. Sección principal → A. Subsección → 1. Punto específico. Usa indentación clara y consistente.' },
  { id: 'checklist', label: 'Checklist', emoji: '✅', template: 'Genera un checklist accionable con casillas de verificación [ ] para cada elemento. Organiza por prioridad o secuencia lógica. Cada ítem debe ser concreto y verificable.' },
  { id: 'minuta', label: 'Minuta', emoji: '📋', template: 'Redacta en formato de minuta jurídica: encabezado, antecedentes, análisis por puntos numerados, conclusión y recomendaciones. Tono formal y técnico.' },
  { id: 'preguntas', label: 'Preguntas orales', emoji: '🎤', template: 'Genera un listado de preguntas orales con respuesta modelo. Formato: PREGUNTA → Respuesta esperada → Observación / trampa potencial. Orden de menor a mayor dificultad.' },
  { id: 'flashcards', label: 'Flashcards', emoji: '🃏', template: 'Genera flashcards en formato FRENTE / REVERSO. Cada tarjeta debe tener un concepto o pregunta concisa al frente y la respuesta completa al reverso. Máximo 30 palabras por lado.' },
  { id: 'mapa', label: 'Mapa conceptual', emoji: '🗺️', template: 'Describe un mapa conceptual en formato texto: CONCEPTO CENTRAL → relaciones → conceptos secundarios → relaciones → conceptos terciarios. Usa → para relaciones y | para ramificaciones paralelas.' },
  { id: 'flujograma', label: 'Flujograma', emoji: '🔀', template: 'Describe el proceso como flujograma en texto: [INICIO] → (Decisión: ¿condición?) → [SÍ: acción] / [NO: acción alternativa] → [FIN]. Usa corchetes para procesos y paréntesis para decisiones.' },
  { id: 'informe', label: 'Informe jurídico', emoji: '📄', template: 'Redacta en formato de informe jurídico formal: I. Síntesis ejecutiva, II. Antecedentes, III. Marco normativo, IV. Análisis jurídico, V. Conclusión, VI. Recomendaciones, VII. Referencias.' },
  { id: 'system_prompt', label: 'System Prompt', emoji: '🤖', template: 'El output debe ser un system prompt de producción, listo para configurar un agente. Incluye: rol, capacidades, restricciones, comportamiento por defecto, protocolos de error y formato de respuesta. Sin explicaciones adicionales.' },
];

// ─── STEP 7: CAPAS DE PROTECCIÓN ──────────────────────────────────────────────

export const enhancements: Enhancement[] = [
  {
    id: 'cybersec', label: 'Ciberseguridad', emoji: '🛡️',
    description: 'Identifica datos sensibles antes de responder',
    template: `

G ▸ PROTOCOLO DE CIBERSEGURIDAD
──────────────────────────────────────────────────────
Antes de responder, identifica si la información entregada contiene datos personales, sensibles, confidenciales, estratégicos o protegidos. Si existen, advierte los riesgos específicos y sugiere anonimizar o generalizar la información antes de procesarla. No solicites datos innecesarios para completar la tarea.`,
  },
  {
    id: 'antihallu', label: 'Anti-alucinaciones', emoji: '🧠',
    description: 'Prohíbe inventar normas o jurisprudencia',
    template: `

H ▸ PROTOCOLO ANTI-ALUCINACIÓN
──────────────────────────────────────────────────────
No inventes normas, artículos, jurisprudencia, doctrina, autores ni fechas. Si no tienes certeza de un dato, indícalo expresamente usando la marca [VERIFICAR]. Distingue con claridad entre: información cierta y verificable | inferencia razonable basada en el contexto | punto que requiere verificación obligatoria antes de su uso.`,
  },
  {
    id: 'sources', label: 'Fuentes chilenas', emoji: '📚',
    description: 'Ancla la respuesta en el marco jurídico chileno',
    template: `

I ▸ FUENTES JURÍDICAS AUTORIZADAS
──────────────────────────────────────────────────────
Prioriza el marco jurídico chileno. Cuando corresponda, menciona normas chilenas aplicables. Si citas jurisprudencia, indica tribunal, rol y año. Si citas doctrina, indica autor y obra. Advierte expresamente cuando una cita normativa deba verificarse en: Biblioteca del Congreso Nacional (bcn.cl) · Poder Judicial (pjud.cl) · Contraloría General (contraloria.cl) · Tribunal Constitucional (tribunalconstitucional.cl).`,
  },
  {
    id: 'confidential', label: 'Confidencialidad', emoji: '🔐',
    description: 'Protege datos del cliente con variables',
    template: `

J ▸ PROTOCOLO DE CONFIDENCIALIDAD
──────────────────────────────────────────────────────
No reproduzcas en tu respuesta nombres, RUT, domicilios, correos electrónicos, teléfonos ni datos sensibles que aparezcan en el material entregado. Cuando necesites referirte a personas o entidades, usa variables descriptivas: [CLIENTE], [CONTRAPARTE], [TRIBUNAL], [EMPRESA], [FECHA], [MONTO]. Si el usuario solicita algo que requiera datos sensibles, adviértelo antes de proceder.`,
  },
  {
    id: 'normVerif', label: 'Verificación normativa', emoji: '📋',
    description: 'Exige comprobación de toda norma citada',
    template: `

K ▸ VERIFICACIÓN NORMATIVA OBLIGATORIA
──────────────────────────────────────────────────────
Cada norma jurídica que cites debe incluir: nombre completo de la ley, número, fecha de publicación y artículo específico. Si existe duda razonable sobre la vigencia o el texto exacto de una norma, indícalo con [VERIFICAR EN BCN]. Señala explícitamente si una ley ha sido modificada recientemente o está sujeta a interpretación controvertida.`,
  },
  {
    id: 'format', label: 'Formato estructurado', emoji: '📊',
    description: 'Output listo para usar profesionalmente',
    template: `

L ▸ FORMATO ESTRUCTURADO
──────────────────────────────────────────────────────
Entrega la respuesta con: 1) SÍNTESIS EJECUTIVA (máximo 3 líneas), 2) DESARROLLO por secciones con títulos numerados, 3) RIESGOS O CONTINGENCIAS identificados, 4) CONCLUSIÓN Y RECOMENDACIONES concretas, 5) REFERENCIAS (normas y jurisprudencia citada). Usa negritas para conceptos jurídicos clave. El output debe ser usable directamente sin reformateo.`,
  },
  {
    id: 'limits', label: 'Advertencia de límites', emoji: '⚠️',
    description: 'Señala qué no puede hacer la IA',
    template: `

M ▸ ADVERTENCIA DE LÍMITES
──────────────────────────────────────────────────────
Al finalizar tu respuesta, agrega una sección breve indicando: qué aspectos de la consulta requieren verificación jurídica profesional, qué elementos no pudiste analizar por falta de información, y qué decisiones finales deben recaer exclusivamente en un profesional del derecho responsable.`,
  },
  {
    id: 'clarify', label: 'Pedir aclaraciones', emoji: '💬',
    description: 'La IA pide más información si es necesario',
    template: `

N ▸ SOLICITAR ACLARACIONES
──────────────────────────────────────────────────────
Si la consulta es ambigua, incompleta o carece de información suficiente para un análisis preciso, formula las preguntas de aclaración necesarias ANTES de responder. Indica qué información adicional mejoraría significativamente la calidad de tu respuesta. No asumas ni rellenes vacíos sin advertirlo.`,
  },
];

// ─── AUTO-SELECTION HELPERS ──────────────────────────────────────────────────
// Derive a sensible profile and output format from purpose+depth without
// requiring the user to explicitly choose them in the wizard flow.

const _purposeToProfile: Record<string, string> = {
  estudiar: 'estudiante', examen: 'estudiante',
  redactar: 'abogado', sentencia: 'abogado', contrato: 'abogado',
  audiencia: 'abogado', estrategia: 'abogado',
  doctrina: 'academico', comparar: 'academico', agente: 'academico',
};

export function autoSelectProfile(purpose: PromptPurpose): PromptProfile {
  return profiles.find(p => p.id === (_purposeToProfile[purpose.id] ?? 'abogado'))!;
}

export function autoSelectFormat(purpose: PromptPurpose, depth: DepthLevel): OutputFormat {
  if (purpose.id === 'examen')                                  return outputFormats.find(f => f.id === 'preguntas')!;
  if (purpose.id === 'redactar')                                return outputFormats.find(f => f.id === 'minuta')!;
  if (purpose.id === 'agente')                                  return outputFormats.find(f => f.id === 'system_prompt')!;
  if (purpose.id === 'estrategia' || purpose.id === 'audiencia') return outputFormats.find(f => f.id === 'checklist')!;
  if (depth.id === 'academico')                                 return outputFormats.find(f => f.id === 'informe')!;
  return outputFormats.find(f => f.id === 'esquema')!;
}

// ─── GENERATE PROMPT ─────────────────────────────────────────────────────────

export function generatePrompt(
  profile: PromptProfile,
  purpose: PromptPurpose,
  area: PromptArea,
  depth: DepthLevel,
  targetAI: TargetAI,
  format: OutputFormat,
  activeEnhancements: string[],
  context: string,
): string {
  const date = new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });

  const activeLayers = enhancements
    .filter(e => activeEnhancements.includes(e.id))
    .map(e => `${e.emoji} ${e.label}`)
    .join(' · ') || 'Ninguna';

  const enhancementBlocks = enhancements
    .filter(e => activeEnhancements.includes(e.id))
    .map(e => e.template)
    .join('');

  const sourcesBlock = area.sources.length > 0
    ? `\n\n   Fuentes prioritarias para esta área:\n${area.sources.map(s => `   • ${s}`).join('\n')}`
    : '';

  const contextBlock = context.trim()
    ? `\n════════════════════════════════════════════════════════\n CONTEXTO ESPECÍFICO ENTREGADO POR EL USUARIO\n════════════════════════════════════════════════════════\n\n${context.trim()}\n`
    : '';

  return `════════════════════════════════════════════════════════
 PROMPT JURÍDICO PROFESIONAL
 LexPrompt Architect v2.0 · DIAT Prompting Hub · PUCV
 Generado: ${date}
════════════════════════════════════════════════════════

 CONFIGURACIÓN
 ────────────────────────────────────────────────────────
 Perfil        : ${profile.emoji} ${profile.label}
 Finalidad     : ${purpose.emoji} ${purpose.label}
 Área jurídica : ${area.emoji} ${area.label}
 Profundidad   : ${depth.label} — ${depth.description}
 IA objetivo   : ${targetAI.label}
 Formato       : ${format.emoji} ${format.label}
 Capas activas : ${activeLayers}

════════════════════════════════════════════════════════

A ▸ ROL Y PERSPECTIVA EXPERTA
────────────────────────────────────────────────────────
${profile.template}

B ▸ CONTEXTO JURÍDICO — ${area.label}
────────────────────────────────────────────────────────
${area.template}${sourcesBlock}

C ▸ OBJETIVO Y FINALIDAD
────────────────────────────────────────────────────────
${purpose.template}

D ▸ NIVEL DE ANÁLISIS Y MÉTODO
────────────────────────────────────────────────────────
${depth.template}

E ▸ OPTIMIZACIÓN PARA ${targetAI.label.toUpperCase()}
────────────────────────────────────────────────────────
${targetAI.optimizationTip}

F ▸ FORMATO DE SALIDA REQUERIDO
────────────────────────────────────────────────────────
${format.template}${enhancementBlocks}
${contextBlock}
════════════════════════════════════════════════════════
 CHECKLIST PREVIO A EJECUCIÓN
════════════════════════════════════════════════════════

 [ ] Anonimizar datos personales del cliente antes de pegar
 [ ] Verificar artículos citados en bcn.cl
 [ ] Confirmar jurisprudencia en pjud.cl antes de usar
 [ ] No incluir información estratégica confidencial
 [ ] Revisar y validar el output antes de uso profesional
 [ ] La responsabilidad final siempre recae en el abogado

════════════════════════════════════════════════════════
 DIAT Prompting Hub · Facultad de Derecho PUCV · 2026
 "Construye criterio antes de automatizar."
════════════════════════════════════════════════════════`;
}

// ─── VARIANT GENERATORS ───────────────────────────────────────────────────────

export function generateCompact(fullPrompt: string): string {
  const lines = fullPrompt.split('\n');
  const start = lines.findIndex(l => l.startsWith('A ▸'));
  const end = lines.findIndex(l => l.includes('CHECKLIST'));
  const core = lines.slice(start, end).filter(l =>
    !l.startsWith('────') && !l.startsWith('════') && l.trim()
  );
  return `[PROMPT COMPACTO — DIAT Prompting Hub]\n\n${core.join('\n')}`;
}

export function generateSystemPrompt(fullPrompt: string, targetAI: TargetAI): string {
  return `[SYSTEM PROMPT — Optimizado para ${targetAI.label}]\n\nEres un asistente jurídico especializado. Opera bajo los siguientes parámetros:\n\n${fullPrompt.split('A ▸')[1]?.split('════')[0]?.trim() ?? fullPrompt}`;
}

export function generateGPTInstructions(fullPrompt: string): string {
  return `[GPT PERSONALIZADO — Instructions]\n\n${fullPrompt.substring(0, 7500)}\n\n[Fin de instrucciones — configurar en ChatGPT → Explore → Create a GPT → Configure → Instructions]`;
}

export function generateClaudeProject(fullPrompt: string): string {
  return `[CLAUDE PROJECT — System Prompt]\n\n${fullPrompt.substring(0, 7500)}\n\n[Fin — configurar en Claude → Projects → New Project → Instructions]`;
}
