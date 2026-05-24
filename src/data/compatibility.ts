export type CompatibilityField =
  | 'profile'
  | 'goal'
  | 'aiLevel'
  | 'workload'
  | 'verification'
  | 'confidentiality'
  | 'buildIntent';

export interface CompatibilityChoice {
  id: string;
  label: string;
  description: string;
  fit: number;
  automation: number;
  modules: Partial<Record<1 | 2 | 3, number>>;
  reason: string;
}

export interface CompatibilityGroup {
  id: CompatibilityField;
  step: string;
  title: string;
  subtitle: string;
  choices: CompatibilityChoice[];
}

export interface CompatibilityInput {
  profile: string;
  goal: string;
  aiLevel: string;
  workload: string;
  verification: string;
  confidentiality: string;
  buildIntent: string;
}

export interface ModuleRecommendation {
  id: 1 | 2 | 3;
  label: string;
  shortLabel: string;
  focus: string;
  score: number;
}

export interface ToolRecommendation {
  id: string;
  label: string;
  reason: string;
  score: number;
}

export interface CompatibilityResult {
  fitScore: number;
  fitLevel: string;
  fitTone: string;
  automationScore: number;
  automationLevel: string;
  modules: ModuleRecommendation[];
  primaryModule: ModuleRecommendation;
  tools: ToolRecommendation[];
  reasons: string[];
  gaps: string[];
  nextSteps: string[];
  riskFlags: string[];
  summary: string;
}

export const compatibilityGroups: CompatibilityGroup[] = [
  {
    id: 'profile',
    step: '01',
    title: 'Perfil juridico',
    subtitle: 'Desde donde entra la persona o equipo al taller.',
    choices: [
      {
        id: 'student',
        label: 'Estudiante',
        description: 'Necesita metodo, criterio de verificacion y estudio asistido.',
        fit: 13,
        automation: 4,
        modules: { 1: 20, 2: 8 },
        reason: 'El taller convierte el uso intuitivo de IA en metodo juridico verificable.',
      },
      {
        id: 'graduate',
        label: 'Egresado / memorista',
        description: 'Trabaja con doctrina, fuentes, tesis, examenes o investigacion.',
        fit: 12,
        automation: 7,
        modules: { 1: 12, 2: 14 },
        reason: 'El taller ayuda a pasar de busquedas dispersas a flujos con fuentes controladas.',
      },
      {
        id: 'lawyer',
        label: 'Abogado/a',
        description: 'Produce escritos, contratos, informes o estrategia profesional.',
        fit: 13,
        automation: 10,
        modules: { 2: 18, 3: 8 },
        reason: 'La plataforma DIAT esta pensada para trabajo juridico real con supervision humana.',
      },
      {
        id: 'team',
        label: 'Equipo juridico',
        description: 'Quiere estandarizar procesos, plantillas, control y trazabilidad.',
        fit: 15,
        automation: 15,
        modules: { 2: 14, 3: 18 },
        reason: 'Los equipos capturan mas valor cuando convierten aprendizaje en workflow repetible.',
      },
    ],
  },
  {
    id: 'goal',
    step: '02',
    title: 'Objetivo principal',
    subtitle: 'La tarea que quieres mejorar con IA juridica.',
    choices: [
      {
        id: 'study',
        label: 'Estudiar derecho',
        description: 'Explicar, esquematizar, entrenar preguntas y repasar contenidos.',
        fit: 12,
        automation: 5,
        modules: { 1: 22, 2: 6 },
        reason: 'DIAT entrega estructura para estudiar sin delegar criterio juridico.',
      },
      {
        id: 'draft',
        label: 'Redactar documentos',
        description: 'Contratos, minutas, informes, recursos o memorandos.',
        fit: 14,
        automation: 16,
        modules: { 1: 8, 2: 22 },
        reason: 'La redaccion asistida es uno de los usos con retorno inmediato si se verifica bien.',
      },
      {
        id: 'research',
        label: 'Investigar con fuentes',
        description: 'Doctrina, jurisprudencia, normas, comparacion y sintesis.',
        fit: 14,
        automation: 12,
        modules: { 1: 8, 2: 20 },
        reason: 'El taller integra busqueda, corpus documental y control de citas.',
      },
      {
        id: 'automate',
        label: 'Automatizar procesos',
        description: 'Plantillas, flujos repetibles, agentes, tableros o prototipos.',
        fit: 16,
        automation: 22,
        modules: { 2: 12, 3: 24 },
        reason: 'DIAT culmina en arquitectura de soluciones legaltech y agentes juridicos.',
      },
    ],
  },
  {
    id: 'aiLevel',
    step: '03',
    title: 'Nivel actual de IA',
    subtitle: 'No mide prestigio: mide punto de partida pedagogico.',
    choices: [
      {
        id: 'none',
        label: 'Casi cero',
        description: 'Ha probado poco o nada, pero quiere entrar con metodo.',
        fit: 11,
        automation: 2,
        modules: { 1: 24 },
        reason: 'M1 esta disenado para construir fundamentos y evitar malos habitos desde el inicio.',
      },
      {
        id: 'basic',
        label: 'Basico',
        description: 'Usa ChatGPT o similares, pero sin protocolo estable.',
        fit: 14,
        automation: 7,
        modules: { 1: 18, 2: 8 },
        reason: 'El salto clave es pasar de prompts sueltos a instrucciones verificables.',
      },
      {
        id: 'intermediate',
        label: 'Intermedio',
        description: 'Ya compara herramientas y quiere flujos mas robustos.',
        fit: 13,
        automation: 11,
        modules: { 2: 16, 3: 10 },
        reason: 'DIAT puede ordenar herramientas en una cadena de produccion juridica.',
      },
      {
        id: 'advanced',
        label: 'Avanzado',
        description: 'Busca agentes, system prompts, integraciones o prototipos.',
        fit: 10,
        automation: 16,
        modules: { 2: 8, 3: 22 },
        reason: 'M3 permite convertir criterio tecnico en arquitectura legaltech aplicable.',
      },
    ],
  },
  {
    id: 'workload',
    step: '04',
    title: 'Repeticion del trabajo',
    subtitle: 'A mayor repeticion, mayor retorno potencial.',
    choices: [
      {
        id: 'low',
        label: 'Baja',
        description: 'Casos aislados o uso ocasional.',
        fit: 7,
        automation: 4,
        modules: { 1: 10 },
        reason: 'Aun con bajo volumen, conviene aprender criterios de uso seguro.',
      },
      {
        id: 'medium',
        label: 'Media',
        description: 'Tareas frecuentes con formatos parecidos.',
        fit: 10,
        automation: 11,
        modules: { 1: 6, 2: 12 },
        reason: 'La repeticion permite crear plantillas y checklists reutilizables.',
      },
      {
        id: 'high',
        label: 'Alta',
        description: 'Documentos, analisis o revisiones todas las semanas.',
        fit: 13,
        automation: 18,
        modules: { 2: 18, 3: 10 },
        reason: 'El potencial crece cuando los flujos se vuelven estandarizables.',
      },
      {
        id: 'massive',
        label: 'Masiva',
        description: 'Muchas piezas, expedientes, fuentes o usuarios internos.',
        fit: 14,
        automation: 23,
        modules: { 2: 16, 3: 20 },
        reason: 'Los escenarios masivos exigen arquitectura, trazabilidad y control.',
      },
    ],
  },
  {
    id: 'verification',
    step: '05',
    title: 'Necesidad de verificacion',
    subtitle: 'Cuanto pesa la precision normativa y factual.',
    choices: [
      {
        id: 'low',
        label: 'Exploratoria',
        description: 'Ideas iniciales, lluvia de conceptos o apoyo preliminar.',
        fit: 7,
        automation: 8,
        modules: { 1: 8 },
        reason: 'Incluso lo exploratorio requiere separar inferencias de hechos.',
      },
      {
        id: 'medium',
        label: 'Media',
        description: 'Material de estudio, minutas internas o borradores.',
        fit: 10,
        automation: 10,
        modules: { 1: 10, 2: 8 },
        reason: 'El taller ensena a cerrar el ciclo entre generacion y revision.',
      },
      {
        id: 'high',
        label: 'Alta',
        description: 'Normas, jurisprudencia, contratos o documentos externos.',
        fit: 14,
        automation: 12,
        modules: { 1: 12, 2: 16 },
        reason: 'La verificacion es una competencia central del programa DIAT.',
      },
      {
        id: 'critical',
        label: 'Critica',
        description: 'Riesgo profesional, decision sensible o entrega institucional.',
        fit: 15,
        automation: 9,
        modules: { 1: 16, 2: 14, 3: 8 },
        reason: 'Los casos criticos requieren protocolos, limites y trazabilidad antes de automatizar.',
      },
    ],
  },
  {
    id: 'confidentiality',
    step: '06',
    title: 'Sensibilidad de datos',
    subtitle: 'Determina controles, no solo herramientas.',
    choices: [
      {
        id: 'public',
        label: 'Publica',
        description: 'Fuentes abiertas o material no sensible.',
        fit: 7,
        automation: 12,
        modules: { 1: 6, 2: 8 },
        reason: 'Permite experimentar con menos friccion y aprender comparando modelos.',
      },
      {
        id: 'internal',
        label: 'Interna',
        description: 'Borradores, apuntes, documentos internos o casos anonimizados.',
        fit: 10,
        automation: 10,
        modules: { 1: 8, 2: 10 },
        reason: 'Buen escenario para aprender politicas basicas de resguardo.',
      },
      {
        id: 'sensitive',
        label: 'Sensible',
        description: 'Datos personales, clientes, expedientes o informacion reservada.',
        fit: 13,
        automation: 6,
        modules: { 1: 12, 2: 12, 3: 8 },
        reason: 'DIAT aporta criterios de seguridad antes de subir informacion a plataformas.',
      },
      {
        id: 'critical',
        label: 'Critica',
        description: 'Secreto profesional, alto impacto o restricciones institucionales.',
        fit: 12,
        automation: 3,
        modules: { 1: 16, 3: 12 },
        reason: 'El valor esta en definir limites, anonimizar y decidir cuando no usar IA publica.',
      },
    ],
  },
  {
    id: 'buildIntent',
    step: '07',
    title: 'Ambicion de construccion',
    subtitle: 'Que tan lejos quieres llevar el aprendizaje.',
    choices: [
      {
        id: 'personal',
        label: 'Uso personal',
        description: 'Mejorar estudio o productividad individual.',
        fit: 8,
        automation: 5,
        modules: { 1: 10, 2: 6 },
        reason: 'La ruta personal se beneficia de prompts base y checklists permanentes.',
      },
      {
        id: 'workflow',
        label: 'Workflow juridico',
        description: 'Crear una cadena repetible desde caso a documento.',
        fit: 13,
        automation: 15,
        modules: { 2: 18, 3: 8 },
        reason: 'Los workflows son el puente natural entre prompting y produccion juridica.',
      },
      {
        id: 'agent',
        label: 'Agente juridico',
        description: 'Configurar instrucciones, roles, limites y memoria de trabajo.',
        fit: 14,
        automation: 20,
        modules: { 2: 8, 3: 24 },
        reason: 'M3 esta orientado a system prompts, agentes y arquitectura legaltech.',
      },
      {
        id: 'platform',
        label: 'Prototipo legaltech',
        description: 'Diseñar una herramienta, tablero, repositorio o app juridica.',
        fit: 15,
        automation: 22,
        modules: { 3: 28 },
        reason: 'La mayor proyeccion aparece cuando el aprendizaje termina en herramienta.',
      },
    ],
  },
];

export const defaultCompatibilityInput: CompatibilityInput = {
  profile: 'lawyer',
  goal: 'draft',
  aiLevel: 'basic',
  workload: 'medium',
  verification: 'high',
  confidentiality: 'internal',
  buildIntent: 'workflow',
};

const modules: Record<1 | 2 | 3, Omit<ModuleRecommendation, 'score'>> = {
  1: {
    id: 1,
    label: 'Modulo 1 - Fundamentos de IA y Prompting Juridico',
    shortLabel: 'M1 Fundamentos',
    focus: 'Prompting estructurado, riesgos, alucinaciones y verificacion post-IA.',
  },
  2: {
    id: 2,
    label: 'Modulo 2 - Claude for Legal y Flujos Juridicos',
    shortLabel: 'M2 Workflows',
    focus: 'Documentos, expedientes, fuentes, NotebookLM, Gemini y Claude como co-redactor.',
  },
  3: {
    id: 3,
    label: 'Modulo 3 - Agentes Juridicos y Ecosistema Legaltech',
    shortLabel: 'M3 Agentes',
    focus: 'System prompts, agentes, automatizacion y diseño de soluciones legaltech.',
  },
};

const toolCatalog: Record<string, { label: string; base: number }> = {
  claude: { label: 'Claude', base: 54 },
  chatgpt: { label: 'ChatGPT', base: 50 },
  gemini: { label: 'Gemini', base: 44 },
  notebooklm: { label: 'NotebookLM', base: 42 },
  perplexity: { label: 'Perplexity', base: 40 },
  github: { label: 'GitHub', base: 28 },
  vercel: { label: 'Vercel', base: 24 },
};

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function getChoice(field: CompatibilityField, id: string): CompatibilityChoice {
  const group = compatibilityGroups.find(item => item.id === field);
  const choice = group?.choices.find(item => item.id === id);
  return choice ?? compatibilityGroups.find(item => item.id === field)!.choices[0];
}

function getLevel(score: number): { label: string; tone: string } {
  if (score >= 88) return { label: 'Compatibilidad estrategica', tone: 'Excelente encaje con el taller' };
  if (score >= 76) return { label: 'Compatibilidad alta', tone: 'Muy buen candidato para DIAT' };
  if (score >= 62) return { label: 'Compatibilidad media-alta', tone: 'Buen encaje con foco definido' };
  return { label: 'Compatibilidad exploratoria', tone: 'Conviene iniciar por fundamentos' };
}

function getAutomationLevel(score: number): string {
  if (score >= 82) return 'Potencial alto';
  if (score >= 66) return 'Potencial medio-alto';
  if (score >= 48) return 'Potencial medio';
  return 'Potencial controlado';
}

function buildToolRecommendations(input: CompatibilityInput): ToolRecommendation[] {
  const scores: Record<string, { score: number; reasons: string[] }> = Object.fromEntries(
    Object.entries(toolCatalog).map(([id, tool]) => [id, { score: tool.base, reasons: [] }]),
  );

  const add = (id: string, amount: number, reason: string) => {
    scores[id].score += amount;
    if (!scores[id].reasons.includes(reason)) scores[id].reasons.push(reason);
  };

  if (['draft', 'automate'].includes(input.goal)) {
    add('claude', 20, 'documentos largos y razonamiento juridico');
    add('chatgpt', 12, 'borradores rapidos y workflows');
  }

  if (input.goal === 'research') {
    add('notebooklm', 24, 'investigacion con corpus propio');
    add('perplexity', 20, 'busqueda con fuentes actuales');
    add('claude', 12, 'sintesis juridica profunda');
  }

  if (input.goal === 'study') {
    add('claude', 16, 'explicaciones pedagogicas');
    add('notebooklm', 14, 'repaso con apuntes propios');
  }

  if (input.goal === 'automate' || ['agent', 'platform'].includes(input.buildIntent)) {
    add('github', 24, 'versionado de plantillas y prototipos');
    add('vercel', 20, 'publicacion de herramientas legales');
    add('chatgpt', 10, 'configuracion de GPTs personalizados');
  }

  if (['high', 'critical'].includes(input.verification)) {
    add('perplexity', 16, 'contraste de normas y fuentes publicas');
    add('notebooklm', 16, 'verificacion contra documentos subidos');
  }

  if (['high', 'massive'].includes(input.workload)) {
    add('gemini', 12, 'analisis de PDFs y material multimodal');
    add('claude', 10, 'contexto extenso');
  }

  return Object.entries(scores)
    .map(([id, item]) => ({
      id,
      label: toolCatalog[id].label,
      score: clamp(Math.round(item.score)),
      reason: item.reasons[0] ?? 'herramienta complementaria para la ruta DIAT',
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

export function evaluateCompatibility(input: CompatibilityInput): CompatibilityResult {
  const selected = compatibilityGroups.map(group => getChoice(group.id, input[group.id]));
  const fitScore = clamp(Math.round(22 + selected.reduce((total, choice) => total + choice.fit, 0)));
  const automationScore = clamp(Math.round(18 + selected.reduce((total, choice) => total + choice.automation, 0)));
  const level = getLevel(fitScore);

  const moduleScores: Record<1 | 2 | 3, number> = { 1: 24, 2: 22, 3: 20 };
  for (const choice of selected) {
    for (const [moduleId, boost] of Object.entries(choice.modules)) {
      moduleScores[Number(moduleId) as 1 | 2 | 3] += boost ?? 0;
    }
  }

  const recommendedModules = ([1, 2, 3] as const)
    .map(id => ({ ...modules[id], score: clamp(Math.round(moduleScores[id])) }))
    .sort((a, b) => b.score - a.score);

  const gaps: string[] = [];
  const riskFlags: string[] = [];

  if (['none', 'basic'].includes(input.aiLevel)) {
    gaps.push('Estandarizar una anatomia de prompt antes de aumentar complejidad.');
  }
  if (['high', 'critical'].includes(input.verification)) {
    gaps.push('Definir un protocolo de fuentes primarias y marcas [VERIFICAR].');
  }
  if (['sensitive', 'critical'].includes(input.confidentiality)) {
    gaps.push('Anonimizar documentos y separar datos sensibles antes de usar IA publica.');
    riskFlags.push('Datos sensibles: usar controles de confidencialidad y criterio profesional.');
  }
  if (['automate'].includes(input.goal) || ['agent', 'platform'].includes(input.buildIntent)) {
    gaps.push('Traducir el caso de uso a un workflow versionable antes de construir herramientas.');
  }
  if (automationScore >= 75 && input.confidentiality === 'critical') {
    riskFlags.push('Alto potencial tecnico, pero automatizacion condicionada por secreto y gobernanza.');
  }

  const nextSteps = [
    `Comenzar por ${recommendedModules[0].shortLabel}: ${recommendedModules[0].focus}`,
    'Construir un prompt base en LexPrompt Architect y compararlo entre modelos.',
    'Cerrar cada output con checklist de verificacion juridica post-IA.',
  ];

  if (automationScore >= 70) {
    nextSteps.push('Documentar el flujo repetible para convertirlo en agente o prototipo legaltech.');
  } else {
    nextSteps.push('Primero estabilizar criterio de uso antes de automatizar.');
  }

  const tools = buildToolRecommendations(input);
  const reasons = selected.map(choice => choice.reason).slice(0, 5);
  const summary = `${fitScore}% de compatibilidad con DIAT. ${level.label}. ${automationScore}% de potencial de automatizacion. Ruta sugerida: ${recommendedModules[0].shortLabel}. Herramientas iniciales: ${tools.slice(0, 3).map(tool => tool.label).join(', ')}.`;

  return {
    fitScore,
    fitLevel: level.label,
    fitTone: level.tone,
    automationScore,
    automationLevel: getAutomationLevel(automationScore),
    modules: recommendedModules,
    primaryModule: recommendedModules[0],
    tools,
    reasons,
    gaps,
    nextSteps,
    riskFlags,
    summary,
  };
}
