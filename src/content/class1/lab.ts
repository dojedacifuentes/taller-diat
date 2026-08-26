// ─────────────────────────────────────────────────────────────────────────────
// CLASE 1 · PROMPT LAB
//
// Catálogo de decisiones y compilador de prompts.
//
// Regla dura del compilador: lo que sale de aquí se pega en ChatGPT, Claude o
// Gemini y la tarea empieza. Sin marcadores, sin etiquetas por rellenar, sin
// instrucciones dirigidas al estudiante mezcladas con instrucciones dirigidas al
// modelo. Si falta un dato imprescindible, no se exporta: se dice qué falta.
//
// Los siete componentes DIAT están detrás de la interfaz como preguntas, no
// como casillas obligatorias. Rol vive en «Agregar extras» porque no toda tarea
// lo necesita: esa ausencia es contenido pedagógico, no un olvido.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Tarea ───────────────────────────────────────────────────────────────────

export type SourceMode = 'pegar' | 'adjuntar' | 'provistas' | 'oficiales' | 'ninguna';

export interface TaskPreset {
  id: string;
  label: string;
  /** Instrucción imperativa completa. Se copia tal cual al prompt. */
  directive: string;
  /** Ayuda del campo «¿Qué necesitas concretamente?». */
  placeholder: string;
  defaults: {
    source: SourceMode;
    constraints: string[];
    format: string;
    controls: string[];
  };
}

export const taskPresets: readonly TaskPreset[] = [
  {
    id: 'analizar-sentencia',
    label: 'Analizar sentencia',
    directive:
      'Analiza la sentencia y expón, en este orden: (1) los hechos jurídicamente relevantes; (2) la cuestión jurídica controvertida; (3) las normas que el tribunal aplica o menciona; (4) los principales argumentos de cada parte; (5) el razonamiento del tribunal; y (6) la decisión.',
    placeholder: 'Me interesa sobre todo cómo el tribunal resuelve la prescripción.',
    defaults: {
      source: 'pegar',
      constraints: ['no-inventar', 'si-no-consta', 'sin-externas'],
      format: 'tabla',
      controls: ['considerando', 'marcar-inferencias'],
    },
  },
  {
    id: 'resumir',
    label: 'Resumir documento',
    directive:
      'Resume el documento conservando su estructura argumental: qué se sostiene, sobre qué base y con qué consecuencia. No omitas las excepciones ni los matices que el propio documento introduce.',
    placeholder: 'Necesito el resumen para decidir si el documento me sirve.',
    defaults: {
      source: 'pegar',
      constraints: ['no-inventar', 'si-no-consta', 'sin-externas'],
      format: 'sintesis',
      controls: ['pagina'],
    },
  },
  {
    id: 'comparar',
    label: 'Comparar documentos o normas',
    directive:
      'Compara los textos indicados. Establece primero los criterios de comparación, contrasta después cada texto criterio por criterio y señala expresamente en qué puntos coinciden, en cuáles difieren y en cuáles uno de ellos guarda silencio.',
    placeholder: 'Compara el régimen de terminación del contrato A con el del contrato B.',
    defaults: {
      source: 'pegar',
      constraints: ['no-inventar', 'si-no-consta', 'sin-externas'],
      format: 'comparacion',
      controls: ['fuente-usada', 'marcar-inferencias'],
    },
  },
  {
    id: 'estudiar',
    label: 'Preparar estudio / examen',
    directive:
      'Prepara material de estudio sobre el contenido indicado: explica los conceptos centrales, cómo se relacionan entre sí y dónde suelen concentrarse las dudas. Añade al final las preguntas que un examinador haría sobre esta materia.',
    placeholder: 'Quiero llegar al examen entendiendo la institución, no memorizándola.',
    defaults: {
      source: 'pegar',
      constraints: ['no-inventar', 'incertidumbre'],
      format: 'estructurada',
      controls: ['marcar-inferencias'],
    },
  },
  {
    id: 'redactar',
    label: 'Redactar borrador',
    directive:
      'Redacta un borrador del documento solicitado. Es un borrador de trabajo, no una versión final: deja marcada entre corchetes toda información que yo deba completar o confirmar antes de usarlo.',
    placeholder: 'Una carta de requerimiento previo por incumplimiento contractual.',
    defaults: {
      source: 'pegar',
      constraints: ['no-inventar', 'no-completar'],
      format: 'estructurada',
      controls: ['marcar-inferencias', 'no-verificable'],
    },
  },
  {
    id: 'revisar',
    label: 'Revisar o criticar texto',
    directive:
      'Revisa críticamente el texto. Señala los puntos débiles del razonamiento, las afirmaciones que no quedan sostenidas, las ambigüedades y los saltos lógicos. Para cada observación, propón una corrección concreta.',
    placeholder: 'Quiero saber qué le objetaría la contraparte.',
    defaults: {
      source: 'pegar',
      constraints: ['no-inventar', 'separar'],
      format: 'vinetas',
      controls: ['fuente-usada', 'separar-respaldo'],
    },
  },
  {
    id: 'investigar',
    label: 'Investigar',
    directive:
      'Investiga la cuestión planteada. Expón el estado de la cuestión, las posiciones existentes y los puntos todavía discutidos. Distingue con claridad lo que puedes sostener con una fuente identificable de lo que es una reconstrucción tuya.',
    placeholder: 'Cómo se ha resuelto en Chile la responsabilidad del mandatario aparente.',
    defaults: {
      source: 'oficiales',
      constraints: ['no-inventar', 'incertidumbre', 'no-completar'],
      format: 'informe',
      controls: ['fuente-usada', 'no-verificable', 'marcar-inferencias'],
    },
  },
  {
    id: 'extraer',
    label: 'Extraer información',
    directive:
      'Extrae del material únicamente la información solicitada, sin interpretarla ni completarla. Reproduce el dato tal como aparece y no lo reformules cuando la formulación literal importe.',
    placeholder: 'Todas las cláusulas sobre terminación anticipada y sus plazos.',
    defaults: {
      source: 'pegar',
      constraints: ['no-inventar', 'si-no-consta', 'sin-externas', 'no-completar'],
      format: 'tabla',
      controls: ['pagina', 'no-verificable'],
    },
  },
  {
    id: 'otra',
    label: 'Otra tarea',
    directive: '',
    placeholder: 'Escribe la tarea completa: qué debe hacer exactamente la IA.',
    defaults: {
      source: 'pegar',
      constraints: ['no-inventar', 'si-no-consta'],
      format: 'estructurada',
      controls: ['fuente-usada'],
    },
  },
] as const;

export function getTask(id: string | null): TaskPreset | undefined {
  return taskPresets.find(t => t.id === id);
}

// ─── Fuentes ─────────────────────────────────────────────────────────────────

export interface SourceOption {
  id: SourceMode;
  label: string;
  /** Instrucción que entra en el prompt. */
  directive: string;
  /** Aviso honesto cuando el prompt no es autosuficiente. */
  warning?: string;
  recommended?: boolean;
}

export const sourceOptions: readonly SourceOption[] = [
  {
    id: 'pegar',
    label: 'Texto que voy a pegar',
    directive:
      'Trabaja exclusivamente con el material delimitado al final de este mensaje entre <<<INICIO DEL MATERIAL>>> y <<<FIN DEL MATERIAL>>>. No incorpores normas, jurisprudencia, doctrina ni hechos que no estén en ese material.',
    recommended: true,
  },
  {
    id: 'adjuntar',
    label: 'Documento que adjuntaré',
    directive:
      'Trabaja exclusivamente con el documento que adjunto en este mismo mensaje. Si no has recibido ningún documento, dímelo y no continúes: no reconstruyas su contenido.',
    warning: 'Este prompt requiere adjuntar el documento al iniciar la conversación.',
  },
  {
    id: 'provistas',
    label: 'Solo fuentes proporcionadas',
    directive:
      'Trabaja exclusivamente con las fuentes que te he proporcionado en esta conversación. No incorpores ninguna otra fuente ni conocimiento previo tuyo.',
    warning: 'Este prompt requiere que las fuentes ya estén en la conversación.',
  },
  {
    id: 'oficiales',
    label: 'Fuentes oficiales',
    directive:
      'Apóyate únicamente en fuentes oficiales: texto legal vigente, sentencias publicadas y repositorios institucionales. Identifica cada fuente que uses. Si no puedes identificarla con precisión, dilo en lugar de citarla de memoria.',
  },
  {
    id: 'ninguna',
    label: 'Sin fuente específica',
    directive:
      'No dispones de fuentes específicas para esta tarea. No inventes normas, sentencias ni citas: si una afirmación necesita respaldo documental, señálalo en lugar de producir el respaldo.',
  },
] as const;

export function getSource(id: SourceMode | null): SourceOption | undefined {
  return sourceOptions.find(s => s.id === id);
}

// ─── Restricciones ───────────────────────────────────────────────────────────

export interface LabOption {
  id: string;
  label: string;
  directive: string;
}

export const constraintOptions: readonly LabOption[] = [
  {
    id: 'no-inventar',
    label: 'No inventar información',
    directive:
      'No inventes normas, sentencias, artículos, autores, cifras ni fechas. Si no dispones del dato, dilo.',
  },
  {
    id: 'si-no-consta',
    label: 'Si no consta, indicarlo',
    directive: 'Si un elemento no consta en el material, escribe exactamente: «No consta en la fuente».',
  },
  {
    id: 'sin-externas',
    label: 'No usar fuentes externas',
    directive: 'No uses información externa al material entregado, aunque la conozcas.',
  },
  {
    id: 'separar',
    label: 'Separar hechos e inferencias',
    directive:
      'Distingue de forma explícita lo que el material dice de lo que tú infieres a partir de él.',
  },
  {
    id: 'no-completar',
    label: 'No completar vacíos por intuición',
    directive:
      'No completes los vacíos del material por analogía ni por lo que sea habitual: un vacío señalado vale más que un vacío rellenado.',
  },
  {
    id: 'incertidumbre',
    label: 'Indicar incertidumbre',
    directive:
      'Cuando no estés seguro, dilo en ese mismo punto en lugar de uniformar el tono asertivo.',
  },
] as const;

// ─── Formato ─────────────────────────────────────────────────────────────────

export const formatOptions: readonly LabOption[] = [
  { id: 'tabla', label: 'Tabla', directive: 'Presenta el resultado en una tabla.' },
  { id: 'vinetas', label: 'Viñetas', directive: 'Presenta el resultado en viñetas breves.' },
  { id: 'sintesis', label: 'Síntesis', directive: 'Presenta el resultado como una síntesis en prosa continua.' },
  { id: 'informe', label: 'Informe breve', directive: 'Presenta el resultado como un informe breve, con títulos y subtítulos.' },
  { id: 'checklist', label: 'Checklist', directive: 'Presenta el resultado como una lista de verificación accionable.' },
  { id: 'comparacion', label: 'Comparación', directive: 'Presenta el resultado como una comparación por criterios, en columnas paralelas.' },
  { id: 'estructurada', label: 'Respuesta estructurada', directive: 'Presenta el resultado en secciones numeradas, con un título cada una.' },
  { id: 'otro', label: 'Otro', directive: '' },
] as const;

// ─── Control ─────────────────────────────────────────────────────────────────

export const controlOptions: readonly LabOption[] = [
  { id: 'pagina', label: 'Indicar página', directive: 'Para cada afirmación relevante, indica la página en la que consta.' },
  { id: 'considerando', label: 'Indicar considerando', directive: 'Para cada afirmación relevante, indica el considerando en el que consta.' },
  { id: 'articulo', label: 'Indicar artículo', directive: 'Para cada afirmación relevante, indica el artículo en el que consta.' },
  { id: 'fuente-usada', label: 'Identificar la fuente usada', directive: 'Indica en cada punto qué fuente concreta utilizaste para sostenerlo.' },
  { id: 'marcar-inferencias', label: 'Marcar inferencias', directive: 'Marca con la etiqueta [INFERENCIA] toda afirmación que no esté literalmente en el material.' },
  { id: 'separar-respaldo', label: 'Separar respaldo de interpretación', directive: 'Separa en apartados distintos lo respaldado por la fuente y tu interpretación.' },
  { id: 'no-verificable', label: 'Señalar lo no verificable', directive: 'Señala expresamente toda afirmación que no pueda comprobarse con el material disponible.' },
] as const;

// ─── Extras ──────────────────────────────────────────────────────────────────

export const depthOptions: readonly LabOption[] = [
  { id: 'introductoria', label: 'Introductoria', directive: 'Nivel introductorio: explica los términos técnicos la primera vez que aparezcan.' },
  { id: 'estandar', label: 'Estándar', directive: 'Nivel estándar: puedes dar por conocidos los conceptos jurídicos básicos.' },
  { id: 'avanzada', label: 'Avanzada', directive: 'Nivel avanzado: no expliques lo elemental y entra directamente en la discusión técnica.' },
] as const;

export const toneOptions: readonly LabOption[] = [
  { id: 'neutro', label: 'Neutro', directive: 'Escribe en tono neutro y descriptivo.' },
  { id: 'tecnico', label: 'Técnico', directive: 'Escribe en tono técnico-jurídico, con terminología precisa.' },
  { id: 'didactico', label: 'Didáctico', directive: 'Escribe en tono didáctico, orientado a que se entienda el razonamiento.' },
  { id: 'critico', label: 'Crítico', directive: 'Escribe en tono crítico: señala los problemas antes que las virtudes.' },
] as const;

// ─── Borrador del estudiante ─────────────────────────────────────────────────

export interface PromptExtras {
  role: string;
  audience: string;
  area: string;
  jurisdiction: string;
  depth: string | null;
  tone: string | null;
  other: string;
}

export interface PromptDraft {
  task: string | null;
  taskDetail: string;
  purpose: string;
  source: SourceMode | null;
  material: string;
  constraints: string[];
  format: string | null;
  formatDetail: string;
  controls: string[];
  extras: PromptExtras;
}

export function emptyExtras(): PromptExtras {
  return { role: '', audience: '', area: '', jurisdiction: '', depth: null, tone: null, other: '' };
}

export function emptyDraft(): PromptDraft {
  return {
    task: null,
    taskDetail: '',
    purpose: '',
    source: null,
    material: '',
    constraints: [],
    format: null,
    formatDetail: '',
    controls: [],
    extras: emptyExtras(),
  };
}

/** Aplica los valores sugeridos de una tarea sin pisar lo que el estudiante ya eligió. */
export function applyTaskDefaults(draft: PromptDraft, taskId: string): PromptDraft {
  const preset = getTask(taskId);
  if (!preset) return { ...draft, task: taskId };
  return {
    ...draft,
    task: taskId,
    source: draft.source ?? preset.defaults.source,
    constraints: draft.constraints.length ? draft.constraints : [...preset.defaults.constraints],
    format: draft.format ?? preset.defaults.format,
    controls: draft.controls.length ? draft.controls : [...preset.defaults.controls],
  };
}

// ─── Compilador ──────────────────────────────────────────────────────────────

export const MATERIAL_OPEN = '<<<INICIO DEL MATERIAL>>>';
export const MATERIAL_CLOSE = '<<<FIN DEL MATERIAL>>>';

export interface CompiledPrompt {
  /** Prompt ejecutable. Vacío si falta información imprescindible. */
  text: string;
  /** Qué falta, en lenguaje del estudiante. Vacío si el prompt es exportable. */
  missing: string[];
  /** El prompt no es autosuficiente: depende de algo que se aporta aparte. */
  warning?: string;
  ready: boolean;
}

function directivesOf(ids: readonly string[], catalog: readonly LabOption[]): string[] {
  return catalog.filter(o => ids.includes(o.id) && o.directive).map(o => o.directive);
}

/** «la tarea, el formato y el material» */
export function joinList(items: readonly string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;
}

export function compilePrompt(draft: PromptDraft): CompiledPrompt {
  const missing: string[] = [];
  const preset = getTask(draft.task);
  const detail = draft.taskDetail.trim();

  if (!preset) missing.push('la tarea');
  else if (preset.id === 'otra' && !detail) missing.push('qué necesitas que haga la IA');

  const source = getSource(draft.source);
  if (!source) missing.push('con qué información puede trabajar');
  else if (source.id === 'pegar' && !draft.material.trim()) {
    missing.push('el contenido sobre el que trabajará la IA');
  }

  const format = formatOptions.find(f => f.id === draft.format);
  if (!format) missing.push('el formato de la respuesta');
  else if (format.id === 'otro' && !draft.formatDetail.trim()) {
    missing.push('el formato de la respuesta');
  }

  if (missing.length > 0 || !preset || !source || !format) {
    return { text: '', missing, ready: false };
  }

  const parts: string[] = [];
  const x = draft.extras;

  // Rol, cuando lo hay: condiciona la lectura de todo lo que viene después.
  if (x.role.trim()) parts.push(`Actúa como ${x.role.trim()}.`);

  // Tarea.
  const taskLines: string[] = [];
  if (preset.id === 'otra') {
    taskLines.push(detail);
  } else {
    taskLines.push(preset.directive);
    if (detail) taskLines.push(`En concreto: ${detail}`);
  }
  parts.push(taskLines.join('\n\n'));

  // Contexto.
  const context: string[] = [];
  if (draft.purpose.trim()) context.push(draft.purpose.trim());
  if (x.audience.trim()) context.push(`El resultado está dirigido a: ${x.audience.trim()}.`);
  if (x.area.trim()) context.push(`Área jurídica: ${x.area.trim()}.`);
  if (x.jurisdiction.trim()) context.push(`Jurisdicción aplicable: ${x.jurisdiction.trim()}.`);
  const depth = depthOptions.find(d => d.id === x.depth);
  if (depth) context.push(depth.directive);
  const tone = toneOptions.find(t => t.id === x.tone);
  if (tone) context.push(tone.directive);
  if (x.other.trim()) context.push(x.other.trim());
  if (context.length) parts.push(`CONTEXTO\n${context.join(' ')}`);

  // Fuentes.
  parts.push(`FUENTES\n${source.directive}`);

  // Restricciones.
  const constraints = directivesOf(draft.constraints, constraintOptions);
  if (constraints.length) {
    parts.push(`RESTRICCIONES\n${constraints.map(c => `- ${c}`).join('\n')}`);
  }

  // Formato.
  const formatLines: string[] = [];
  if (format.id === 'otro') formatLines.push(draft.formatDetail.trim());
  else {
    formatLines.push(format.directive);
    if (draft.formatDetail.trim()) formatLines.push(`Extensión aproximada: ${draft.formatDetail.trim()}.`);
  }
  parts.push(`FORMATO\n${formatLines.join(' ')}`);

  // Control.
  const controls = directivesOf(draft.controls, controlOptions);
  if (controls.length) {
    parts.push(`CONTROL\n${controls.map(c => `- ${c}`).join('\n')}`);
  }

  // Material, incorporado dentro del propio prompt: copiar y pegar basta.
  if (source.id === 'pegar') {
    parts.push(
      ['MATERIAL DE TRABAJO', '', MATERIAL_OPEN, '', draft.material.trim(), '', MATERIAL_CLOSE].join('\n'),
    );
  }

  return { text: parts.join('\n\n'), missing: [], warning: source.warning, ready: true };
}

/** Mensaje único cuando no se puede exportar. Nada más. */
export function missingMessage(missing: readonly string[]): string {
  return `Falta definir ${joinList(missing)} para ejecutar esta tarea.`;
}

// ─── Resumen legible de la configuración ─────────────────────────────────────
//
// Alimenta la entrega. No puntúa nada: solo dice qué eligió el estudiante.

export interface DraftSummary {
  label: string;
  value: string;
}

function labelsOf(ids: readonly string[], catalog: readonly LabOption[]): string {
  const found = catalog.filter(o => ids.includes(o.id)).map(o => o.label);
  return found.length ? found.join(' · ') : '—';
}

export function summarizeDraft(draft: PromptDraft): DraftSummary[] {
  const rows: DraftSummary[] = [
    { label: 'Tarea', value: getTask(draft.task)?.label ?? '—' },
  ];
  if (draft.taskDetail.trim()) rows.push({ label: 'En concreto', value: draft.taskDetail.trim() });
  if (draft.purpose.trim()) rows.push({ label: 'Contexto', value: draft.purpose.trim() });
  rows.push({ label: 'Fuentes', value: getSource(draft.source)?.label ?? '—' });
  rows.push({ label: 'Restricciones', value: labelsOf(draft.constraints, constraintOptions) });
  rows.push({
    label: 'Formato',
    value: [formatOptions.find(f => f.id === draft.format)?.label, draft.formatDetail.trim()]
      .filter(Boolean)
      .join(' · ') || '—',
  });
  rows.push({ label: 'Control', value: labelsOf(draft.controls, controlOptions) });

  const x = draft.extras;
  const extras = [
    x.role.trim() && `Rol: ${x.role.trim()}`,
    x.audience.trim() && `Audiencia: ${x.audience.trim()}`,
    x.area.trim() && `Área: ${x.area.trim()}`,
    x.jurisdiction.trim() && `Jurisdicción: ${x.jurisdiction.trim()}`,
    depthOptions.find(d => d.id === x.depth)?.label && `Profundidad: ${depthOptions.find(d => d.id === x.depth)?.label}`,
    toneOptions.find(t => t.id === x.tone)?.label && `Tono: ${toneOptions.find(t => t.id === x.tone)?.label}`,
    x.other.trim(),
  ].filter(Boolean) as string[];
  if (extras.length) rows.push({ label: 'Extras', value: extras.join(' · ') });

  return rows;
}
