export interface PromptRole {
  id: string;
  label: string;
  emoji: string;
  template: string;
}

export interface PromptTask {
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

export interface Enhancement {
  id: string;
  label: string;
  emoji: string;
  description: string;
  template: string;
}

export const roles: PromptRole[] = [
  {
    id: 'estudiante',
    label: 'Estudiante de Derecho',
    emoji: '🎓',
    template: 'Actúa como un asistente legal experto que apoya a un estudiante de Derecho. Explica los conceptos con claridad académica, cita las fuentes doctrinales y normativas relevantes, y distingue explícitamente entre normas vigentes y derogadas.',
  },
  {
    id: 'abogado',
    label: 'Abogado en Ejercicio',
    emoji: '⚖️',
    template: 'Actúa como un abogado senior con amplia experiencia en el sistema jurídico chileno. Tu análisis debe ser técnico, preciso y orientado a la práctica profesional. Anticipa posibles contingencias jurídicas y propón soluciones concretas.',
  },
  {
    id: 'academico',
    label: 'Académico / Investigador',
    emoji: '🔬',
    template: 'Actúa como un investigador jurídico con expertise en dogmática y derecho comparado. Aborda el tema con rigor académico, cita doctrina nacional e internacional relevante, e identifica los debates doctrinales en curso.',
  },
  {
    id: 'funcionario',
    label: 'Funcionario / Asesor Público',
    emoji: '🏛️',
    template: 'Actúa como un asesor jurídico especializado en derecho público y administrativo. Tu análisis debe considerar las limitaciones propias de la función pública, el principio de legalidad y las implicancias de control administrativo y contralor.',
  },
];

export const tasks: PromptTask[] = [
  {
    id: 'redactar',
    label: 'Redactar documento',
    emoji: '📝',
    template: 'Tu tarea es REDACTAR con precisión jurídica un documento legal completo. Incluye todas las cláusulas esenciales, usa terminología técnica apropiada y asegúrate de que el documento sea funcionalmente válido según la legislación chilena.',
  },
  {
    id: 'investigar',
    label: 'Investigar y analizar',
    emoji: '🔍',
    template: 'Tu tarea es realizar una INVESTIGACIÓN JURÍDICA EXHAUSTIVA. Identifica: a) Normativa aplicable vigente, b) Doctrina relevante nacional e internacional, c) Jurisprudencia de la Corte Suprema y Tribunales de instancia, d) Tendencias y debates actuales.',
  },
  {
    id: 'analizar',
    label: 'Analizar caso/documento',
    emoji: '🧩',
    template: 'Tu tarea es ANALIZAR en profundidad el caso o documento presentado. Identifica: los hechos jurídicamente relevantes, las normas aplicables, los riesgos y contingencias, las fortalezas y debilidades de cada posición, y propón una estrategia fundada.',
  },
  {
    id: 'audiencia',
    label: 'Preparar audiencia',
    emoji: '🎤',
    template: 'Tu tarea es preparar una ESTRATEGIA COMPLETA para la audiencia. Incluye: argumentario principal y subsidiario, anticipación de argumentos contrarios con rebates, orden de presentación de la prueba, y manejo de preguntas del tribunal.',
  },
  {
    id: 'asesorar',
    label: 'Elaborar dictamen/consulta',
    emoji: '📋',
    template: 'Tu tarea es elaborar un DICTAMEN JURÍDICO PROFESIONAL. Estructura: 1) Antecedentes y consulta, 2) Marco normativo aplicable, 3) Análisis jurídico, 4) Conclusión y recomendación. El tono debe ser formal y la posición debe estar fundada.',
  },
];

export const areas: PromptArea[] = [
  {
    id: 'civil',
    label: 'Derecho Civil',
    emoji: '📜',
    sources: ['Código Civil (bcn.cl)', 'Corte Suprema - sala civil (pjud.cl)', 'Repertorio de Legislación y Jurisprudencia'],
    template: 'Aplica el Código Civil chileno y sus normas complementarias. Considera especialmente los principios de autonomía de la voluntad, buena fe objetiva y la responsabilidad civil contractual y extracontractual.',
  },
  {
    id: 'penal',
    label: 'Derecho Penal',
    emoji: '🔒',
    sources: ['Código Procesal Penal (bcn.cl)', 'Código Penal (bcn.cl)', 'Art. 19 CPR', 'Corte Suprema - sala penal (pjud.cl)'],
    template: 'Aplica el Código Penal y el Código Procesal Penal chilenos. Considera los principios de legalidad, culpabilidad y proporcionalidad. En materia procesal, analiza garantías constitucionales del art. 19 CPR y el sistema acusatorio oral.',
  },
  {
    id: 'laboral',
    label: 'Derecho Laboral',
    emoji: '🤝',
    sources: ['Código del Trabajo (bcn.cl)', 'Dirección del Trabajo (dt.gob.cl)', 'Juzgados Laborales (pjud.cl)'],
    template: 'Aplica el Código del Trabajo y la legislación laboral vigente. Considera el principio pro-trabajador, las normas de orden público laboral irrenunciables y los dictámenes de la Dirección del Trabajo relevantes.',
  },
  {
    id: 'administrativo',
    label: 'Derecho Administrativo',
    emoji: '🏛️',
    sources: ['LOCBGAE - Ley 18.575 (bcn.cl)', 'Contraloría General (contraloria.cl)', 'Ley 19.880 procedimientos admin.'],
    template: 'Aplica la LOCBGAE y la Ley 19.880 de procedimientos administrativos. Considera el principio de legalidad, el control de la Contraloría General de la República y los plazos y requisitos de los procedimientos administrativos.',
  },
  {
    id: 'corporativo',
    label: 'Derecho Corporativo',
    emoji: '🏢',
    sources: ['Ley 18.046 SA (bcn.cl)', 'Código de Comercio (bcn.cl)', 'CMF (cmfchile.cl)', 'Ley 20.190'],
    template: 'Aplica la Ley 18.046 de Sociedades Anónimas, el Código de Comercio y la normativa de la CMF. Considera las obligaciones fiduciarias de directores, la responsabilidad de administradores y el marco regulatorio de mercado de capitales.',
  },
  {
    id: 'constitucional',
    label: 'Derecho Constitucional',
    emoji: '⚡',
    sources: ['CPR 1980 (bcn.cl)', 'Tribunal Constitucional (tribunalconstitucional.cl)', 'Corte Suprema pleno (pjud.cl)'],
    template: 'Aplica la Constitución Política de la República y la jurisprudencia del Tribunal Constitucional. Considera los valores y principios constitucionales, la supremacía constitucional y el control de constitucionalidad de las normas.',
  },
];

export const enhancements: Enhancement[] = [
  {
    id: 'cybersec',
    label: 'Ciberseguridad',
    emoji: '🛡️',
    description: 'Protege datos del cliente',
    template: '\n\n⚠️ CIBERSEGURIDAD: Esta consulta puede contener información sensible. En tu respuesta: a) No solicites ni menciones datos identificatorios de personas, b) Trabaja con la información anonimizada que te entrego, c) Alerta si en el texto identificas datos que deberían estar protegidos bajo la Ley 19.628 de protección de datos personales.',
  },
  {
    id: 'antihallu',
    label: 'Anti-Alucinaciones',
    emoji: '🧠',
    description: 'Elimina inventos de la IA',
    template: '\n\n🚨 RESTRICCIÓN CRÍTICA: Bajo ninguna circunstancia inventes artículos legales, sentencias, resoluciones administrativas, autores doctrinales o fechas. Si no tienes certeza absoluta de un dato jurídico, indícalo con la marca [VERIFICAR]. Si no conoces la respuesta a algo, di explícitamente "No tengo información verificable sobre esto."',
  },
  {
    id: 'sources',
    label: 'Fuentes Chilenas',
    emoji: '📚',
    description: 'Ancla en fuentes verificables',
    template: '\n\n📚 FUENTES AUTORIZADAS: Basa tu respuesta únicamente en fuentes del sistema jurídico chileno verificables: Biblioteca del Congreso Nacional (bcn.cl) · Poder Judicial (pjud.cl) · Contraloría General de la República (contraloria.cl) · Tribunal Constitucional (tribunalconstitucional.cl) · Diario Oficial (diariooficial.interior.gob.cl). Cita siempre la fuente entre paréntesis.',
  },
  {
    id: 'format',
    label: 'Formato Estructurado',
    emoji: '📋',
    description: 'Output listo para usar',
    template: '\n\n📋 FORMATO DE RESPUESTA: Estructura tu output con: 1) SÍNTESIS EJECUTIVA (máx. 3 líneas), 2) DESARROLLO JURÍDICO (secciones numeradas con subtítulos), 3) RIESGOS O CONTINGENCIAS identificadas, 4) CONCLUSIÓN Y RECOMENDACIONES concretas, 5) REFERENCIAS (normas y jurisprudencia citada). Usa negritas para los conceptos jurídicos clave.',
  },
];

export function generatePrompt(
  role: PromptRole,
  task: PromptTask,
  area: PromptArea,
  activeEnhancements: string[],
  context: string,
): string {
  const enhancementTexts = enhancements
    .filter((e) => activeEnhancements.includes(e.id))
    .map((e) => e.template)
    .join('');

  const sourcesText = area.sources.length > 0
    ? `\n\nFUENTES RELEVANTES PARA ESTA ÁREA:\n${area.sources.map((s) => `  • ${s}`).join('\n')}`
    : '';

  return `═══════════════════════════════════════
PROMPT JURÍDICO DIAT — NIVEL PROFESIONAL
Generado con DIAT Prompting Hub · PUCV 2026
═══════════════════════════════════════

🎭 ROL Y PERSPECTIVA:
${role.template}

${task.emoji} TAREA:
${task.template}

⚖️ MARCO JURÍDICO (${area.label}):
${area.template}${sourcesText}${enhancementTexts}

${context ? `\n📝 CONTEXTO ESPECÍFICO DEL CASO:\n${context}` : ''}

═══════════════════════════════════════
INSTRUCCIÓN FINAL: Aplica todo lo anterior
de manera integrada. Sé preciso, útil y
profesional. El derecho exige exactitud.
═══════════════════════════════════════`;
}
