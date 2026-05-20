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

// ─── AI RECOMMENDATION ENGINE ────────────────────────────────────────────────

export interface AIRecommendation {
  ai: TargetAI;
  score: number;   // 0–100
  reasons: string[];
}

export function recommendAIModel(
  purpose: PromptPurpose,
  area: PromptArea,
  depth: DepthLevel,
): AIRecommendation[] {
  const base: Record<string, { score: number; reasons: string[] }> = {
    claude:     { score: 60, reasons: [] },
    chatgpt:    { score: 58, reasons: [] },
    gemini:     { score: 55, reasons: [] },
    notebooklm: { score: 48, reasons: [] },
    perplexity: { score: 45, reasons: [] },
  };

  // Purpose boosts
  if (['agente', 'redactar'].includes(purpose.id)) {
    base.claude.score    += 25; base.claude.reasons.push('Ideal para agentes y documentos extensos');
    base.chatgpt.score   += 20; base.chatgpt.reasons.push('Perfecto para GPTs personalizados');
  }
  if (['estudiar', 'examen'].includes(purpose.id)) {
    base.claude.score      += 15; base.claude.reasons.push('Explicaciones pedagógicas detalladas');
    base.notebooklm.score  += 25; base.notebooklm.reasons.push('Estudia citando tus propios apuntes');
  }
  if (purpose.id === 'doctrina') {
    base.notebooklm.score  += 30; base.notebooklm.reasons.push('Investigación con fuentes propias citadas');
    base.perplexity.score  += 22; base.perplexity.reasons.push('Jurisprudencia reciente verificada');
  }
  if (['sentencia', 'contrato'].includes(purpose.id)) {
    base.claude.score  += 25; base.claude.reasons.push('Análisis profundo de documentos extensos');
    base.gemini.score  += 22; base.gemini.reasons.push('Adjunta PDFs directamente sin copiar texto');
  }
  if (['audiencia', 'estrategia'].includes(purpose.id)) {
    base.claude.score   += 20; base.claude.reasons.push('Razonamiento estratégico multi-paso');
    base.chatgpt.score  += 15; base.chatgpt.reasons.push('Argumentarios y planes de contingencia');
  }
  if (purpose.id === 'comparar') {
    base.claude.score  += 15; base.claude.reasons.push('Análisis comparado con rigor estructural');
    base.gemini.score  += 12; base.gemini.reasons.push('Búsqueda en tiempo real útil para comparación');
  }

  // Area boosts
  if (area.id === 'tech') {
    base.claude.score      += 15; base.claude.reasons.push('Especialista en IA y tecnología jurídica');
    base.perplexity.score  += 10; base.perplexity.reasons.push('Normativa emergente de IA actualizada');
  }
  if (['administrativo', 'constitucional'].includes(area.id)) {
    base.perplexity.score  += 15; base.perplexity.reasons.push('Normativa pública actualizada en tiempo real');
    base.notebooklm.score  += 10; base.notebooklm.reasons.push('Sube la ley y analiza con precisión');
  }
  if (area.id === 'filosofia') {
    base.claude.score  += 20; base.claude.reasons.push('Razonamiento filosófico y teoría jurídica');
  }

  // Depth boosts
  if (depth.id === 'academico') {
    base.claude.score      += 20; base.claude.reasons.push('Nivel académico con razonamiento profundo');
    base.notebooklm.score  += 15; base.notebooklm.reasons.push('Citas precisas de tus fuentes académicas');
  }
  if (depth.id === 'litigacion') {
    base.claude.score  += 20; base.claude.reasons.push('Análisis estratégico de litigación avanzada');
    base.chatgpt.score += 10; base.chatgpt.reasons.push('Argumentarios estructurados para audiencia');
  }
  if (depth.id === 'rapido') {
    base.chatgpt.score  += 12; base.chatgpt.reasons.push('Respuestas rápidas y directas');
    base.perplexity.score += 8; base.perplexity.reasons.push('Síntesis con fuentes en segundos');
  }

  return targetAIs
    .map(ai => ({
      ai,
      score: Math.min(100, base[ai.id]?.score ?? 50),
      reasons: base[ai.id]?.reasons ?? [],
    }))
    .sort((a, b) => b.score - a.score);
}

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

// ─── PROMPT++ (YAML STRUCTURED FORMAT) ───────────────────────────────────────

export function generatePromptPlusPlus(
  profile: PromptProfile,
  purpose: PromptPurpose,
  area: PromptArea,
  depth: DepthLevel,
  targetAI: TargetAI,
  format: OutputFormat,
  activeEnhancements: string[],
  context: string,
): string {
  const date = new Date().toISOString().slice(0, 10);
  const layers = enhancements.filter(e => activeEnhancements.includes(e.id));
  const indent = (s: string, n = 2) => s.replace(/\n/g, `\n${' '.repeat(n)}`);

  return `# LexPrompt Architect v2.0 — Structured Machine-Readable Format
# DIAT Prompting Hub · Facultad de Derecho PUCV

lexiprompt: "2.0"
generated: "${date}"
platform: "${targetAI.label}"

config:
  profile:    "${profile.id}"    # ${profile.label}
  finalidad:  "${purpose.id}"   # ${purpose.label}
  area:       "${area.id}"      # ${area.label}
  profundidad: "${depth.id}"    # ${depth.label}
  formato:    "${format.id}"    # ${format.label}
  capas:
${layers.map(l => `    - ${l.id}  # ${l.label}`).join('\n') || '    []'}

context: |
  ${context.trim() || '(sin contexto adicional)'}

system_role: |
  ${indent(profile.template)}

purpose: |
  ${indent(purpose.template)}

area_context: |
  ${indent(area.template)}

depth_instruction: |
  ${indent(depth.template)}

format_instruction: |
  ${indent(format.template)}
${layers.length > 0 ? `
security_layers:
${layers.map(l => `  - id: ${l.id}
    label: "${l.label}"
    instruction: |
      ${indent(l.template.trim(), 6)}`).join('\n')}
` : ''}
sources:
${area.sources.map(s => `  - "${s}"`).join('\n') || '  []'}

optimization_tip: |
  ${indent(targetAI.optimizationTip)}

# ─── Usage ────────────────────────────────────────────────────────────────────
# Paste config.system_role → purpose → area_context → depth_instruction
# → format_instruction → security_layers in that order into your AI platform.
# Replace context block with your specific case details.
`;
}

// ════════════════════════════════════════════════════════════════════════════
//  COGNITIVE RUNTIME ARCHITECTURE v3.0
//  LexPrompt Cognitive IR · Multi-Model Compiler Engine
// ════════════════════════════════════════════════════════════════════════════

// ─── COGNITIVE TYPES ─────────────────────────────────────────────────────────

export interface LegalObjective {
  id: string; label: string; emoji: string;
  description: string; executionProtocol: string;
}
export interface Audience {
  id: string; label: string; emoji: string; calibration: string;
}
export interface CognitiveMode {
  id: string; label: string; emoji: string;
  description: string; reasoningProtocol: string;
}
export interface RiskTolerance {
  id: string; label: string; emoji: string;
  description: string; protocol: string;
}
export interface ProceduralStage {
  id: string; label: string; emoji: string; context: string;
}
export interface JurisdictionScope {
  id: string; label: string; emoji: string; scope: string;
}
export interface DocumentContextMode {
  id: string; label: string; emoji: string;
  description: string; groundingPolicy: string;
}
export interface PrecisionConfig {
  analytical_depth: number;
  litigious_aggressiveness: number;
  argumentative_creativity: number;
  technical_density: number;
  verification_strictness: number;
}
export interface CompilerInput {
  profile: PromptProfile; purpose: PromptPurpose; area: PromptArea;
  depth: DepthLevel; targetAI: TargetAI; format: OutputFormat;
  activeEnhancements: string[]; context: string;
  legalObjective: LegalObjective; audience: Audience;
  cognitiveMode: CognitiveMode; riskTolerance: RiskTolerance;
  proceduralStage: ProceduralStage; jurisdiction: JurisdictionScope;
  documentContextMode: DocumentContextMode; precision: PrecisionConfig;
}

// ─── LEGAL OBJECTIVES ────────────────────────────────────────────────────────

export const legalObjectives: LegalObjective[] = [
  {
    id: 'litigar', label: 'Litigar', emoji: '⚔️',
    description: 'Conducir un proceso judicial',
    executionProtocol: 'Desarrolla argumentación ofensiva y defensiva. Anticipa la posición contraria con rebates específicos para cada argumento probable. Mapea los medios de prueba disponibles y su pertinencia. Identifica los puntos débiles del caso propio y propón cómo neutralizarlos. Prioriza la persuasión ante el tribunal.',
  },
  {
    id: 'negociar', label: 'Negociar', emoji: '🤝',
    description: 'Alcanzar acuerdo extrajudicial',
    executionProtocol: 'Identifica los intereses reales detrás de las posiciones declaradas. Mapea la Zona de Posible Acuerdo (ZOPA). Diseña opciones de valor mutuo. Anticipa la BATNA de la contraparte y evalúa la propia. El tono es estratégicamente colaborativo sin ceder posiciones clave.',
  },
  {
    id: 'prevenir_riesgo', label: 'Prevenir riesgo', emoji: '🛡️',
    description: 'Anticipar contingencias jurídicas',
    executionProtocol: 'Mapea todos los riesgos jurídicos del escenario con metodología exhaustiva. Clasifícalos por probabilidad e impacto (matriz 2x2). Propón medidas de mitigación concretas para cada riesgo. Identifica los escenarios de worst-case y sus consecuencias patrimoniales e institucionales.',
  },
  {
    id: 'persuadir', label: 'Persuadir', emoji: '🎯',
    description: 'Convencer a una audiencia específica',
    executionProtocol: 'Construye el argumento más sólido para la posición asignada con retórica jurídica apropiada. Estructura: premisa mayor (norma) → premisa menor (hecho) → conclusión. Anticipa las tres objeciones más fuertes y prepara rebates directos. Cierra con síntesis contundente y memorable.',
  },
  {
    id: 'interpretar', label: 'Interpretar', emoji: '🔍',
    description: 'Determinar el sentido de normas o contratos',
    executionProtocol: 'Aplica los métodos interpretativos en orden: (1) gramatical — sentido natural y obvio; (2) sistemático — contexto normativo; (3) histórico — historia fidedigna del establecimiento; (4) teleológico — espíritu y finalidad. Concluye con la interpretación más técnicamente sólida.',
  },
  {
    id: 'fiscalizar', label: 'Fiscalizar', emoji: '🏛️',
    description: 'Control de legalidad y compliance',
    executionProtocol: 'Verifica el cumplimiento normativo punto a punto. Identifica infracciones y omisiones con cita normativa específica. Clasifica hallazgos por gravedad: crítico / alto / medio / bajo. Propón plan de remediación priorizado por urgencia y consecuencia jurídica.',
  },
  {
    id: 'impugnar', label: 'Impugnar', emoji: '⚡',
    description: 'Atacar una resolución o acto jurídico',
    executionProtocol: 'Identifica todos los vicios formales y sustantivos del acto impugnable. Para cada vicio: señala la norma vulnerada, el argumento de impugnación y su solidez. Determina los recursos aplicables con sus plazos exactos. Diseña la estrategia de impugnación óptima con subsidiarias.',
  },
  {
    id: 'defender', label: 'Defender', emoji: '🔰',
    description: 'Proteger derechos e intereses del representado',
    executionProtocol: 'Construye la defensa más robusta posible. Identifica excepciones dilatorias, perentorias y mixtas aplicables. Cuestiona legitimidad activa, competencia del tribunal y suficiencia de la prueba. Propón argumentos subsidiarios de mayor a menor contundencia para cada escenario adverso.',
  },
  {
    id: 'diagnosticar', label: 'Diagnosticar', emoji: '🩺',
    description: 'Evaluar la situación jurídica actual',
    executionProtocol: 'Diagnóstico jurídico integral: (1) situación actual y hechos relevantes, (2) normas aplicables, (3) fortalezas y debilidades, (4) riesgos clasificados, (5) oportunidades jurídicas. Concluye con semáforo de riesgo (verde/amarillo/rojo) y recomendaciones priorizadas.',
  },
  {
    id: 'enseñar', label: 'Enseñar', emoji: '📚',
    description: 'Transmitir conocimiento jurídico',
    executionProtocol: 'Progresión pedagógica: de lo general a lo particular, de lo simple a lo complejo. Usa ejemplos del sistema jurídico chileno. Anticipa las dudas más frecuentes y las responde proactivamente. Incluye ejercicios de autocomprobación al final.',
  },
  {
    id: 'documentar', label: 'Documentar', emoji: '📝',
    description: 'Redactar actos y documentos jurídicos',
    executionProtocol: 'Produce documentos con precisión técnica y rigor formal. Incluye todos los elementos formales y de fondo requeridos. Usa terminología jurídica exacta y consistente. Anticipa los cuestionamientos formales más probables y los previene en la redacción.',
  },
  {
    id: 'automatizar', label: 'Automatizar', emoji: '🤖',
    description: 'Diseñar agentes y flujos con IA',
    executionProtocol: 'Diseña el flujo cognitivo del agente: rol y capacidades, restricciones éticas, protocolo de decisión por escenario, manejo de excepciones y criterios de escalamiento a profesional humano. El output debe ser un system prompt de producción ejecutable directamente.',
  },
];

// ─── AUDIENCES ───────────────────────────────────────────────────────────────

export const audiences: Audience[] = [
  {
    id: 'cliente', label: 'Cliente', emoji: '👤',
    calibration: 'Usa lenguaje claro y accesible, sin tecnicismos innecesarios. Explica las implicancias prácticas y concretas. Prioriza la claridad sobre la exhaustividad técnica. El cliente necesita entender para tomar decisiones informadas.',
  },
  {
    id: 'abogado_junior', label: 'Abogado junior', emoji: '👨‍💼',
    calibration: 'Nivel técnico intermedio-avanzado. Explica el razonamiento, no solo la conclusión. Señala los fundamentos normativos con artículos específicos. Actúa como mentor: enseña la metodología, no solo el resultado.',
  },
  {
    id: 'socio', label: 'Socio / Senior', emoji: '⚖️',
    calibration: 'Máximo nivel técnico. Solo hechos relevantes, análisis preciso y recomendaciones accionables. Sin explicaciones de conceptos básicos. El foco es la decisión estratégica y los riesgos de negocio. Sé directo y eficiente.',
  },
  {
    id: 'juez', label: 'Tribunal / Juez', emoji: '🏛️',
    calibration: 'Argumentación técnica, ordenada y con respeto procesal. Cita normativa con artículo, cuerpo legal y año. Distingue con claridad hechos de derecho. Anticipa las preguntas del tribunal y las aborda proactivamente.',
  },
  {
    id: 'alumno', label: 'Alumno de Derecho', emoji: '🎓',
    calibration: 'Lenguaje pedagógico y progresivo. Explica desde fundamentos teóricos antes de llegar a las normas. Usa ejemplos contextualizados en Chile. Prioriza la comprensión estructural sobre la memorización de artículos.',
  },
  {
    id: 'profesor', label: 'Académico / Profesor', emoji: '🔬',
    calibration: 'Rigor científico completo. Cita doctrina con autor, obra y año. Señala debates no resueltos y posiciones en pugna. El output puede incluir referencias al derecho comparado y notas al pie.',
  },
  {
    id: 'empresa', label: 'Empresa / Directorio', emoji: '🏢',
    calibration: 'Lenguaje de negocio con rigor jurídico. Cuantifica riesgos en términos económicos cuando sea posible. Las recomendaciones deben ser accionables por un ejecutivo sin formación legal.',
  },
  {
    id: 'organismo', label: 'Organismo público', emoji: '🏛️',
    calibration: 'Formalidad institucional estricta. Referencia al principio de legalidad, competencia del órgano y control de la Contraloría. Considera las implicancias para el erario público y la responsabilidad administrativa del funcionario.',
  },
  {
    id: 'contraparte', label: 'Análisis de contraparte', emoji: '⚡',
    calibration: 'Modo adversarial: analiza desde la perspectiva del oponente. Identifica sus mejores argumentos y diseña rebates específicos. Anticipa sus movimientos procesales más probables y evalúa sus puntos débiles estructurales.',
  },
  {
    id: 'interno', label: 'Uso interno', emoji: '🔒',
    calibration: 'Documento de trabajo interno sin destinatario externo. Puede incluir análisis preliminares, hipótesis de trabajo y evaluaciones de riesgo sin filtros. El nivel de franqueza es máximo.',
  },
];

// ─── COGNITIVE MODES ─────────────────────────────────────────────────────────

export const cognitiveModes: CognitiveMode[] = [
  {
    id: 'estrategico', label: 'Estratégico', emoji: '♟️',
    description: 'Análisis de opciones y ruta óptima',
    reasoningProtocol: 'Mapea todas las opciones disponibles antes de recomendar. Evalúa cada una por viabilidad jurídica, riesgo, costo y tiempo. Identifica la ruta óptima con su plan de contingencia. Termina siempre con una recomendación concreta y ejecutable.',
  },
  {
    id: 'adversarial', label: 'Adversarial', emoji: '⚔️',
    description: 'Litigación y contraargumentación',
    reasoningProtocol: 'Razona desde la perspectiva del adversario antes de construir tu posición. Identifica los tres argumentos más fuertes de la contraparte y diseña rebates específicos. El análisis es dialéctico: tesis → antítesis → síntesis estratégica. Nunca ignores los puntos débiles del caso propio.',
  },
  {
    id: 'doctrinal', label: 'Doctrinal', emoji: '📖',
    description: 'Análisis dogmático y teórico',
    reasoningProtocol: 'Parte de los principios generales hacia la norma específica. Identifica las corrientes doctrinales relevantes con sus representantes. Distingue entre norma positiva, interpretación mayoritaria y posiciones en debate. El análisis es estructurado desde la teoría jurídica con citas precisas.',
  },
  {
    id: 'pedagogico', label: 'Pedagógico', emoji: '📚',
    description: 'Enseñanza y transmisión de conocimiento',
    reasoningProtocol: 'Estructura el conocimiento en capas de complejidad progresiva. Usa analogías y ejemplos concretos para ilustrar conceptos abstractos. Anticipa las confusiones más comunes antes de que surjan. Verifica comprensión con preguntas de cierre.',
  },
  {
    id: 'preventivo', label: 'Preventivo', emoji: '🛡️',
    description: 'Gestión anticipada de riesgos',
    reasoningProtocol: 'Razona desde el worst-case hacia el presente para construir barreras de protección. Clasifica riesgos por probabilidad e impacto. Prioriza las medidas de mitigación de mayor eficiencia: máximo impacto con mínimo costo.',
  },
  {
    id: 'analitico', label: 'Analítico', emoji: '🔬',
    description: 'Descomposición sistemática del problema',
    reasoningProtocol: 'Descompone el problema en sus elementos constitutivos mínimos. Analiza cada elemento por separado con rigor lógico antes de reconstruir la conclusión. El razonamiento es inductivo-deductivo y explícitamente estructurado.',
  },
  {
    id: 'forense', label: 'Forense', emoji: '🔎',
    description: 'Investigación de hechos y evidencia',
    reasoningProtocol: 'Razona estrictamente desde la evidencia disponible. Distingue con precisión: hechos probados, hechos presuntos y hechos por probar. Evalúa la suficiencia, pertinencia y admisibilidad de cada medio de prueba.',
  },
  {
    id: 'compliance', label: 'Compliance', emoji: '✅',
    description: 'Verificación de cumplimiento normativo',
    reasoningProtocol: 'Mapea todas las obligaciones normativas aplicables. Verifica el cumplimiento punto a punto con cita normativa específica. Identifica brechas y clasifica por gravedad y urgencia. Propón plan de remediación ejecutable con plazos.',
  },
  {
    id: 'negociacion', label: 'Negociación', emoji: '🤝',
    description: 'Diseño de acuerdos y consensos',
    reasoningProtocol: 'Identifica los intereses reales detrás de las posiciones declaradas de ambas partes. Busca zonas de valor creado mutuamente antes de proponer concesiones. El razonamiento prioriza la sostenibilidad del acuerdo sobre la victoria táctica inmediata.',
  },
  {
    id: 'critico', label: 'Crítico', emoji: '🧐',
    description: 'Cuestionamiento riguroso de premisas',
    reasoningProtocol: 'Cuestiona cada premisa antes de aceptarla. Identifica falacias lógicas, argumentos circulares y peticiones de principio. Evalúa la solidez de cada argumento por sus méritos propios, independientemente de su fuente. El análisis es escéptico y basado en evidencia verificable.',
  },
];

// ─── RISK TOLERANCES ─────────────────────────────────────────────────────────

export const riskTolerances: RiskTolerance[] = [
  {
    id: 'conservador', label: 'Conservador', emoji: '🟢',
    description: 'Mínimo riesgo, máxima certeza',
    protocol: 'Prioriza la certeza jurídica sobre la oportunidad. Solo recomienda acciones con alta probabilidad de éxito y consecuencias adversas acotadas. Cuando existan dudas interpretativas, opta por la lectura más segura. Advierte explícitamente de toda incertidumbre antes de proceder.',
  },
  {
    id: 'equilibrado', label: 'Equilibrado', emoji: '🟡',
    description: 'Balance riesgo-beneficio razonado',
    protocol: 'Evalúa el balance entre riesgo y beneficio para cada opción disponible. Recomienda la ruta con mejor relación riesgo-retorno ajustada al contexto. Señala oportunidades y riesgos de forma balanceada. Acepta riesgo calculado cuando el beneficio lo justifica.',
  },
  {
    id: 'agresivo', label: 'Agresivo', emoji: '🔴',
    description: 'Alta tolerancia al riesgo, máximo beneficio',
    protocol: 'Maximiza el beneficio potencial aunque implique mayor exposición al riesgo. Explora las interpretaciones más favorables disponibles, incluyendo las debatidas en doctrina. Propón las estrategias más ventajosas asumiendo disposición del cliente para litigar si es necesario.',
  },
];

// ─── PROCEDURAL STAGES ───────────────────────────────────────────────────────

export const proceduralStages: ProceduralStage[] = [
  {
    id: 'preconflicto', label: 'Pre-conflicto', emoji: '🕊️',
    context: 'Fase preventiva o de asesoría estructural. No hay conflicto activo. El objetivo es configurar la relación jurídica correctamente desde el inicio para prevenir controversias futuras.',
  },
  {
    id: 'negociacion_ext', label: 'Negociación extrajudicial', emoji: '🤝',
    context: 'Proceso de negociación directa, mediación o conciliación extrajudicial sin proceso judicial activo. El objetivo es alcanzar acuerdo preservando la relación cuando sea posible.',
  },
  {
    id: 'demanda', label: 'Demanda / Requerimiento', emoji: '📋',
    context: 'Preparación o presentación de la acción judicial inicial. El proceso está en su etapa inaugural. El objetivo es construir la posición inicial más sólida y exhaustiva posible.',
  },
  {
    id: 'contestacion', label: 'Contestación / Defensa', emoji: '🛡️',
    context: 'Respuesta a una acción judicial o administrativa iniciada por la contraparte. Posición reactiva. El objetivo es construir la defensa eficaz, identificar excepciones y establecer la narrativa propia.',
  },
  {
    id: 'prueba', label: 'Etapa probatoria', emoji: '🔎',
    context: 'Fase de rendición y valoración de pruebas. El objetivo es diseñar la estrategia probatoria óptima: qué probar, cómo probarlo y con qué medios. También anticipar y cuestionar la prueba de la contraparte.',
  },
  {
    id: 'recursos', label: 'Recursos e impugnaciones', emoji: '📤',
    context: 'Preparación de un recurso contra una resolución o respuesta a uno interpuesto por la contraparte. El objetivo es identificar vicios recurribles y construir el mejor argumento de impugnación.',
  },
  {
    id: 'ejecucion', label: 'Ejecución de resolución', emoji: '⚡',
    context: 'Fase de ejecución o cumplimiento de resolución judicial o administrativa. El objetivo es materializar el derecho reconocido o resistir una ejecución injusta o desproporcionada.',
  },
  {
    id: 'no_aplica', label: 'Consultivo / Académico', emoji: '💡',
    context: 'Asunto de carácter consultivo, académico o de planificación, sin proceso activo. El análisis se realiza en abstracto o con fines de estructuración preventiva o investigación.',
  },
];

// ─── JURISDICTIONS ───────────────────────────────────────────────────────────

export const jurisdictions: JurisdictionScope[] = [
  {
    id: 'chile', label: 'Chile', emoji: '🇨🇱',
    scope: 'Marco jurídico chileno exclusivo. Fuentes: BCN (bcn.cl), PJUD (pjud.cl), Contraloría (contraloria.cl), TC (tribunalconstitucional.cl). Prioriza jurisprudencia de la Corte Suprema y los tribunales de instancia chilenos.',
  },
  {
    id: 'internacional', label: 'Internacional', emoji: '🌐',
    scope: 'Derecho internacional público o privado. Considera tratados ratificados por Chile, CISG, UNIDROIT, normas de soft law aplicables y los criterios de los organismos internacionales pertinentes al caso.',
  },
  {
    id: 'comparado', label: 'Derecho comparado', emoji: '🔄',
    scope: 'Análisis comparado entre sistemas jurídicos. Prioriza jurisdicciones históricamente influyentes en el derecho chileno: España, Francia, Alemania, Italia. Incluye el derecho norteamericano cuando el contexto lo justifique.',
  },
  {
    id: 'interamericano', label: 'Sistema Interamericano', emoji: '🌎',
    scope: 'Marco del Sistema Interamericano de DDHH. Considera la CADH, la jurisprudencia vinculante de la Corte IDH, las recomendaciones de la CIDH y los estándares de protección aplicables a Chile como Estado parte.',
  },
];

// ─── DOCUMENT CONTEXT MODES ──────────────────────────────────────────────────

export const documentContextModes: DocumentContextMode[] = [
  {
    id: 'exclusive_source', label: 'Solo del documento', emoji: '📄',
    description: 'Responde exclusivamente con lo que aparece en el documento. Sin conocimiento externo.',
    groundingPolicy: 'RESTRICCIÓN DE GROUNDING — MODO EXCLUSIVO: Responde únicamente con información del documento adjunto o contexto proporcionado. No uses conocimiento externo de entrenamiento. Si la información no está en el documento, indica: [INFORMACIÓN NO DISPONIBLE EN EL DOCUMENTO]. No inferir ni extrapolar más allá del texto explícito.',
  },
  {
    id: 'primary_plus_knowledge', label: 'Documento + conocimiento', emoji: '📚',
    description: 'El documento es tu fuente principal, complementado con tu entrenamiento jurídico.',
    groundingPolicy: 'MODO FUENTE PRIMARIA: El documento o contexto es tu fuente PRINCIPAL. Complementa con conocimiento jurídico de entrenamiento pero distingue claramente entre lo que proviene del documento y lo que agregas por conocimiento propio. Señala la fuente de cada afirmación sustantiva.',
  },
  {
    id: 'reference_model', label: 'Modelo de referencia', emoji: '🗂️',
    description: 'El documento es una plantilla o modelo a replicar y adaptar.',
    groundingPolicy: 'MODO MODELO DE REFERENCIA: El documento proporcionado es una PLANTILLA. Úsalo como estructura arquitectónica para el documento que debes generar. Mantén el esquema de secciones, estilo formal y cláusulas tipo del modelo. Adapta el contenido al caso del usuario preservando la arquitectura original.',
  },
  {
    id: 'comparative_analysis', label: 'Análisis comparativo', emoji: '⚖️',
    description: 'Compara el documento adjunto con un estándar jurídico o con otro documento.',
    groundingPolicy: 'MODO ANÁLISIS COMPARATIVO: Realiza comparación sistemática entre el documento proporcionado y el estándar jurídico aplicable o el documento de referencia. Estructura: semejanzas, diferencias, brechas y puntos de mejora. Usa cuadro comparativo cuando simplifique la comprensión.',
  },
  {
    id: 'audit_review', label: 'Auditoría / Revisión crítica', emoji: '🔍',
    description: 'Revisa el documento buscando errores, riesgos e incumplimientos.',
    groundingPolicy: 'MODO AUDITORÍA: Revisión crítica exhaustiva del documento adjunto. Identifica y documenta: errores formales y de fondo, cláusulas de riesgo, omisiones peligrosas, incumplimientos normativos, ambigüedades y desequilibrios prestacionales. Clasifica cada hallazgo: CRÍTICO / ALTO / MEDIO / BAJO.',
  },
];

// ─── COMPILER HELPERS ─────────────────────────────────────────────────────────

const _bar = (v: number): string => '█'.repeat(Math.round(v / 10)) + '░'.repeat(10 - Math.round(v / 10));
const _lvl = (v: number): string => v >= 80 ? 'Muy alto' : v >= 60 ? 'Alto' : v >= 40 ? 'Medio' : v >= 20 ? 'Bajo' : 'Mínimo';

// ─── IR YAML ─────────────────────────────────────────────────────────────────

export function buildIRYAML(input: CompilerInput): string {
  const { profile, purpose, area, depth, targetAI, format, activeEnhancements, context,
    legalObjective, audience, cognitiveMode, riskTolerance, proceduralStage,
    jurisdiction, documentContextMode, precision } = input;

  const date = new Date().toISOString().slice(0, 10);
  const layers = enhancements.filter(e => activeEnhancements.includes(e.id));

  return `# LexPrompt Cognitive IR v3.0
# DIAT Prompting Hub · Facultad de Derecho PUCV
# Intermediate Representation — Model-agnostic execution schema

lexicognitive: "3.0"
generated: "${date}"
target_platform: "${targetAI.id}"

intent:
  legal_objective: "${legalObjective.id}"     # ${legalObjective.label}
  task_type:       "${purpose.id}"            # ${purpose.label}

legal_context:
  area:             "${area.id}"              # ${area.label}
  procedural_stage: "${proceduralStage.id}"   # ${proceduralStage.label}
  jurisdiction:     "${jurisdiction.id}"      # ${jurisdiction.label}

cognitive_configuration:
  mode:           "${cognitiveMode.id}"       # ${cognitiveMode.label}
  audience:       "${audience.id}"            # ${audience.label}
  risk_tolerance: "${riskTolerance.id}"       # ${riskTolerance.label}
  profile:        "${profile.id}"             # ${profile.label}

task_parameters:
  depth:                 "${depth.id}"        # ${depth.label}
  format:                "${format.id}"       # ${format.label}
  document_context_mode: "${documentContextMode.id}"

precision_dials:
  analytical_depth:         ${precision.analytical_depth}   # ${_lvl(precision.analytical_depth)}
  litigious_aggressiveness: ${precision.litigious_aggressiveness}   # ${_lvl(precision.litigious_aggressiveness)}
  argumentative_creativity: ${precision.argumentative_creativity}   # ${_lvl(precision.argumentative_creativity)}
  technical_density:        ${precision.technical_density}   # ${_lvl(precision.technical_density)}
  verification_strictness:  ${precision.verification_strictness}   # ${_lvl(precision.verification_strictness)}

security_layers:
${layers.length > 0 ? layers.map(l => `  - id: "${l.id}"  # ${l.label}`).join('\n') : '  []'}

sources:
${area.sources.map(s => `  - "${s}"`).join('\n')}

execution_pipeline:
  - step: contextual_analysis
    action: "Analizar '${legalObjective.label}' en contexto de ${proceduralStage.label}"
  - step: normative_mapping
    action: "Mapear marco normativo de ${area.label} · ${jurisdiction.label}"
  - step: cognitive_processing
    mode: "${cognitiveMode.id}"
    action: "Aplicar razonamiento ${cognitiveMode.label}"
  - step: risk_assessment
    tolerance: "${riskTolerance.id}"
    action: "Evaluar con criterio ${riskTolerance.label}"
  - step: audience_calibration
    target: "${audience.id}"
  - step: output_generation
    format: "${format.id}"

uncertainty_protocols:
  hallucination_guard:   ${activeEnhancements.includes('antihallu')}
  source_verification:   ${activeEnhancements.includes('sources') || activeEnhancements.includes('normVerif')}
  confidentiality_guard: ${activeEnhancements.includes('confidential')}
  professional_disclaimer: true

context: |
  ${context.trim() || '(sin contexto adicional)'}

# DIAT Prompting Hub · Facultad de Derecho PUCV · 2026
`;
}

// ─── CLAUDE COMPILER (XML PIPELINE) ──────────────────────────────────────────

export function compileForClaude(input: CompilerInput): string {
  const { profile, purpose, area, depth, targetAI, format, activeEnhancements, context,
    legalObjective, audience, cognitiveMode, riskTolerance, proceduralStage,
    jurisdiction, documentContextMode, precision } = input;

  const layers = enhancements.filter(e => activeEnhancements.includes(e.id));
  const securityBlocks = layers.map(l =>
    `  <layer id="${l.id}">\n    ${l.template.trim()}\n  </layer>`
  ).join('\n');

  return `<lexiprompt version="3.0" platform="claude">
<!--
  LexPrompt Cognitive Runtime v3.0 · Compilado para Claude
  DIAT Prompting Hub · Facultad de Derecho PUCV
-->

<cognitive_configuration>
  <legal_objective id="${legalObjective.id}">${legalObjective.emoji} ${legalObjective.label} — ${legalObjective.description}</legal_objective>
  <task_type id="${purpose.id}">${purpose.label}</task_type>
  <cognitive_mode id="${cognitiveMode.id}">${cognitiveMode.label} — ${cognitiveMode.description}</cognitive_mode>
  <audience id="${audience.id}">${audience.label}</audience>
  <risk_tolerance id="${riskTolerance.id}">${riskTolerance.label}</risk_tolerance>
  <procedural_stage id="${proceduralStage.id}">${proceduralStage.label}</procedural_stage>
  <jurisdiction id="${jurisdiction.id}">${jurisdiction.label}</jurisdiction>
  <depth id="${depth.id}">${depth.label}</depth>
</cognitive_configuration>

<precision_dials>
  <analytical_depth value="${precision.analytical_depth}">${_bar(precision.analytical_depth)} ${precision.analytical_depth}% · ${_lvl(precision.analytical_depth)}</analytical_depth>
  <aggressiveness value="${precision.litigious_aggressiveness}">${_bar(precision.litigious_aggressiveness)} ${precision.litigious_aggressiveness}% · ${_lvl(precision.litigious_aggressiveness)}</aggressiveness>
  <creativity value="${precision.argumentative_creativity}">${_bar(precision.argumentative_creativity)} ${precision.argumentative_creativity}% · ${_lvl(precision.argumentative_creativity)}</creativity>
  <technical_density value="${precision.technical_density}">${_bar(precision.technical_density)} ${precision.technical_density}% · ${_lvl(precision.technical_density)}</technical_density>
  <verification_strictness value="${precision.verification_strictness}">${_bar(precision.verification_strictness)} ${precision.verification_strictness}% · ${_lvl(precision.verification_strictness)}</verification_strictness>
</precision_dials>

<system_role profile="${profile.id}">
${profile.template}
</system_role>

<legal_context area="${area.id}" jurisdiction="${jurisdiction.id}">
${area.template}

Fuentes autorizadas:
${area.sources.map(s => `• ${s}`).join('\n')}

Contexto procesal: ${proceduralStage.context}
Marco jurisdiccional: ${jurisdiction.scope}
</legal_context>

<objective_instruction task="${purpose.id}">
${purpose.template}
</objective_instruction>

<legal_objective_protocol objective="${legalObjective.id}">
${legalObjective.executionProtocol}
</legal_objective_protocol>

<cognitive_mode_protocol mode="${cognitiveMode.id}">
${cognitiveMode.reasoningProtocol}
</cognitive_mode_protocol>

<audience_calibration audience="${audience.id}">
${audience.calibration}
</audience_calibration>

<risk_protocol tolerance="${riskTolerance.id}">
${riskTolerance.protocol}
</risk_protocol>

<depth_instruction level="${depth.id}">
${depth.template}
</depth_instruction>

<grounding_policy mode="${documentContextMode.id}">
${documentContextMode.groundingPolicy}
</grounding_policy>

<execution_pipeline>
  <step id="1" type="contextual_analysis">
    Analizar objetivo '${legalObjective.label}' · Etapa: ${proceduralStage.label} · Jurisdicción: ${jurisdiction.label}
  </step>
  <step id="2" type="normative_mapping">
    Mapear marco normativo de ${area.label} · Fuentes: ${area.sources.join(' · ')}
  </step>
  <step id="3" type="cognitive_processing">
    Modo: ${cognitiveMode.label} — ${cognitiveMode.reasoningProtocol.split('.')[0]}.
  </step>
  <step id="4" type="risk_assessment">
    Tolerancia: ${riskTolerance.label} — ${riskTolerance.protocol.split('.')[0]}.
  </step>
  <step id="5" type="audience_calibration">
    Calibrar para: ${audience.label} — ${audience.calibration.split('.')[0]}.
  </step>
  <step id="6" type="output_generation">
    Formato: ${format.label} ${format.emoji} — ${format.template.split('.')[0]}.
  </step>
</execution_pipeline>

<security_layers>
${securityBlocks || '  <!-- Sin capas adicionales -->'}
</security_layers>

<user_context>
${context.trim() || '<!-- Sin contexto adicional -->'}
</user_context>

<optimization_tip platform="claude">
${targetAI.optimizationTip}
</optimization_tip>

</lexiprompt>`;
}

// ─── GPT COMPILER (CONVERSATIONAL) ───────────────────────────────────────────

export function compileForGPT(input: CompilerInput): string {
  const { profile, purpose, area, depth, targetAI, format, activeEnhancements, context,
    legalObjective, audience, cognitiveMode, riskTolerance, proceduralStage,
    jurisdiction, documentContextMode, precision } = input;

  const layers = enhancements.filter(e => activeEnhancements.includes(e.id));
  const sep = '═'.repeat(58);

  return `[PROMPT JURÍDICO — Compilado para ${targetAI.label}]
[LexPrompt Cognitive Runtime v3.0 · DIAT Prompting Hub · PUCV]

${sep}
 ROL Y PERSPECTIVA EXPERTA
${sep}

${profile.template}

${sep}
 OBJETIVO ESTRATÉGICO Y CONFIGURACIÓN
${sep}

OBJETIVO LEGAL   : ${legalObjective.emoji} ${legalObjective.label} — ${legalObjective.description}
TAREA            : ${purpose.emoji} ${purpose.label}
MODO COGNITIVO   : ${cognitiveMode.emoji} ${cognitiveMode.label}
AUDIENCIA        : ${audience.emoji} ${audience.label}
RIESGO           : ${riskTolerance.emoji} ${riskTolerance.label}
ETAPA PROCESAL   : ${proceduralStage.emoji} ${proceduralStage.label}
JURISDICCIÓN     : ${jurisdiction.emoji} ${jurisdiction.label}
NIVEL ANÁLISIS   : ${depth.label} — ${depth.description}

Protocolo de objetivo:
${legalObjective.executionProtocol}

${sep}
 CONTEXTO JURÍDICO — ${area.label.toUpperCase()}
${sep}

${area.template}

Fuentes autorizadas:
${area.sources.map(s => `• ${s}`).join('\n')}

Contexto procesal: ${proceduralStage.context}
Marco jurisdiccional: ${jurisdiction.scope}

${sep}
 MODO COGNITIVO: ${cognitiveMode.label.toUpperCase()}
${sep}

${cognitiveMode.reasoningProtocol}

Calibración para audiencia — ${audience.label}:
${audience.calibration}

Protocolo de riesgo — ${riskTolerance.label}:
${riskTolerance.protocol}

${sep}
 INSTRUCCIONES DE EJECUCIÓN (PIPELINE)
${sep}

1. ANÁLISIS CONTEXTUAL
   Analiza el objetivo "${legalObjective.label}" en el contexto de "${proceduralStage.label}"
   bajo el marco jurídico de ${area.label} · ${jurisdiction.label}.

2. MAPEO NORMATIVO
   Identifica y cita normas aplicables con artículo y número de ley.
   Fuentes: ${area.sources.join(' · ')}
   Verifica la vigencia de cada norma antes de citarla.

3. PROCESAMIENTO COGNITIVO [MODO: ${cognitiveMode.label.toUpperCase()}]
   ${cognitiveMode.reasoningProtocol.split('.')[0]}.

4. EVALUACIÓN DE RIESGO [TOLERANCIA: ${riskTolerance.label.toUpperCase()}]
   ${riskTolerance.protocol.split('.')[0]}.

5. CALIBRACIÓN PARA AUDIENCIA [${audience.label.toUpperCase()}]
   ${audience.calibration.split('.')[0]}.

6. POLÍTICA DOCUMENTAL [${documentContextMode.label.toUpperCase()}]
   ${documentContextMode.groundingPolicy.split('\n')[0]}

7. NIVEL DE ANÁLISIS
   ${depth.template.split('.')[0]}.

8. GENERACIÓN DE OUTPUT
   Formato requerido: ${format.emoji} ${format.label}
   ${format.template}

${sep}
 CALIBRACIÓN DE PRECISIÓN
${sep}

• Profundidad analítica    ${_bar(precision.analytical_depth)} ${precision.analytical_depth}% — ${_lvl(precision.analytical_depth)}
• Agresividad litigante   ${_bar(precision.litigious_aggressiveness)} ${precision.litigious_aggressiveness}% — ${_lvl(precision.litigious_aggressiveness)}
• Creatividad argumental  ${_bar(precision.argumentative_creativity)} ${precision.argumentative_creativity}% — ${_lvl(precision.argumentative_creativity)}
• Densidad técnica        ${_bar(precision.technical_density)} ${precision.technical_density}% — ${_lvl(precision.technical_density)}
• Rigor de verificación   ${_bar(precision.verification_strictness)} ${precision.verification_strictness}% — ${_lvl(precision.verification_strictness)}

${layers.length > 0 ? `${sep}\n CAPAS DE SEGURIDAD ACTIVAS\n${sep}\n\n${layers.map(l => l.template.trim()).join('\n\n')}\n` : ''}
${context.trim() ? `${sep}\n CONTEXTO ESPECÍFICO DEL CASO\n${sep}\n\n${context.trim()}\n` : ''}
${sep}
 OPTIMIZACIÓN PARA ${targetAI.label.toUpperCase()}
${sep}

${targetAI.optimizationTip}

${sep}
 CHECKLIST PREVIO A EJECUCIÓN
${sep}

 [ ] Anonimizar todos los datos personales antes de pegar
 [ ] Verificar normas citadas en bcn.cl
 [ ] Confirmar jurisprudencia en pjud.cl
 [ ] No incluir información estratégica confidencial
 [ ] Revisar y validar el output antes de uso profesional
 [ ] La responsabilidad final recae siempre en el abogado

${sep}
 DIAT Prompting Hub · Facultad de Derecho PUCV · 2026
 "Construye criterio antes de automatizar."
${sep}`;
}

// ─── GEMINI COMPILER (DOCUMENT-FIRST MARKDOWN) ────────────────────────────────

export function compileForGemini(input: CompilerInput): string {
  const { profile, purpose, area, depth, targetAI, format, activeEnhancements, context,
    legalObjective, audience, cognitiveMode, riskTolerance, proceduralStage,
    jurisdiction, documentContextMode, precision } = input;

  const layers = enhancements.filter(e => activeEnhancements.includes(e.id));
  const date = new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });

  return `# ANÁLISIS JURÍDICO — CONFIGURACIÓN COGNITIVA
**LexPrompt Cognitive Runtime v3.0 · DIAT Prompting Hub · Facultad de Derecho PUCV**
*Compilado para ${targetAI.label} · ${date}*

---

## 1. Rol y perspectiva experta

${profile.template}

---

## 2. Configuración estratégica

| Parámetro | Valor |
|-----------|-------|
| Objetivo legal | ${legalObjective.emoji} **${legalObjective.label}** — ${legalObjective.description} |
| Tarea | ${purpose.emoji} ${purpose.label} |
| Área jurídica | ${area.emoji} ${area.label} |
| Etapa procesal | ${proceduralStage.emoji} ${proceduralStage.label} |
| Jurisdicción | ${jurisdiction.emoji} ${jurisdiction.label} |
| Modo cognitivo | ${cognitiveMode.emoji} ${cognitiveMode.label} |
| Audiencia | ${audience.emoji} ${audience.label} |
| Tolerancia al riesgo | ${riskTolerance.emoji} ${riskTolerance.label} |
| Nivel de análisis | ${depth.label} — ${depth.description} |
| Formato de salida | ${format.emoji} ${format.label} |

---

## 3. Protocolo de objetivo legal — ${legalObjective.label}

${legalObjective.executionProtocol}

---

## 4. Marco jurídico — ${area.label}

${area.template}

**Fuentes autorizadas:**
${area.sources.map(s => `- ${s}`).join('\n')}

> **Contexto procesal:** ${proceduralStage.context}

> **Marco jurisdiccional:** ${jurisdiction.scope}

---

## 5. Modo cognitivo — ${cognitiveMode.label}

*${cognitiveMode.description}*

${cognitiveMode.reasoningProtocol}

**Calibración para audiencia — ${audience.label}:**

${audience.calibration}

---

## 6. Protocolo de riesgo — ${riskTolerance.label}

${riskTolerance.protocol}

---

## 7. Parámetros de precisión

| Dimensión | Valor | Nivel | Barra |
|-----------|------:|-------|-------|
| Profundidad analítica | ${precision.analytical_depth}% | ${_lvl(precision.analytical_depth)} | \`${_bar(precision.analytical_depth)}\` |
| Agresividad litigante | ${precision.litigious_aggressiveness}% | ${_lvl(precision.litigious_aggressiveness)} | \`${_bar(precision.litigious_aggressiveness)}\` |
| Creatividad argumental | ${precision.argumentative_creativity}% | ${_lvl(precision.argumentative_creativity)} | \`${_bar(precision.argumentative_creativity)}\` |
| Densidad técnica | ${precision.technical_density}% | ${_lvl(precision.technical_density)} | \`${_bar(precision.technical_density)}\` |
| Rigor de verificación | ${precision.verification_strictness}% | ${_lvl(precision.verification_strictness)} | \`${_bar(precision.verification_strictness)}\` |

---

## 8. Nivel de análisis y método

${depth.template}

---

## 9. Política documental — ${documentContextMode.label}

${documentContextMode.groundingPolicy}

---

${layers.length > 0 ? `## 10. Capas de seguridad\n\n${layers.map(l => `### ${l.emoji} ${l.label}\n${l.template.trim()}`).join('\n\n')}\n\n---\n\n` : ''}## ${layers.length > 0 ? '11' : '10'}. Formato de salida requerido

${format.template}

---

${context.trim() ? `## ${layers.length > 0 ? '12' : '11'}. Contexto específico del caso\n\n${context.trim()}\n\n---\n\n` : ''}## Optimización para ${targetAI.label}

${targetAI.optimizationTip}

---

*DIAT Prompting Hub · Facultad de Derecho PUCV · 2026 · "Construye criterio antes de automatizar."*`;
}
