// ─────────────────────────────────────────────────────────────────────────────
// LABORATORIOS — datos de las herramientas interactivas.
//
// «Cazador de alucinaciones», constructor de flujos, registro de validación y
// ficha de Match Making. Todo el contenido es ficticio y pedagógico: la
// respuesta de IA que se analiza fue redactada para el taller e incluye errores
// deliberados, no proviene de una consulta real.
// ─────────────────────────────────────────────────────────────────────────────
import type { HuntClaim, ClaimVerdict, FlowKind } from '@/lib/types';

// ─── Cazador de alucinaciones ────────────────────────────────────────────────
export const verdictLabels: Record<ClaimVerdict, string> = {
  verificada: 'Verificada',
  falsa: 'Falsa',
  dudosa: 'Dudosa',
  'sin-fuente': 'Sin fuente',
  inferencia: 'Inferencia',
};

export const verdictHelp: Record<ClaimVerdict, string> = {
  verificada: 'La encontré en la fuente oficial y dice lo que la respuesta afirma.',
  falsa: 'La busqué en la fuente y no existe, o la fuente dice otra cosa.',
  dudosa: 'Podría ser correcta, pero está enunciada de forma demasiado categórica o le falta un matiz decisivo.',
  'sin-fuente': 'Puede que sea cierta, pero la respuesta no indica de dónde sale y no pude localizarla.',
  inferencia: 'No está en la fuente: el modelo la dedujo y la presenta como si fuera un dato.',
};

export const verdictColors: Record<ClaimVerdict, string> = {
  verificada: 'emerald',
  falsa: 'rose',
  dudosa: 'amber',
  'sin-fuente': 'indigo',
  inferencia: 'purple',
};

/** Encabezado de la respuesta ficticia que el ejercicio pone bajo examen. */
export const huntIntro = {
  caseCode: 'CT-01',
  question: '¿Es válida la cláusula de modificación unilateral de tarifas y de tratamiento de datos de VeloUrbano SpA?',
  disclaimer:
    'La respuesta que sigue fue redactada para este taller e incluye errores deliberados. No proviene de una consulta real ni debe usarse como material jurídico.',
  instruction:
    'Lee cada afirmación y clasifícala. No juzgues el estilo: juzga si la afirmación resiste el contraste con una fuente.',
};

export const huntClaims: HuntClaim[] = [
  {
    id: 'h1',
    text: 'La Ley 19.496 se aplica a los contratos de adhesión celebrados entre proveedores y consumidores.',
    answer: 'verificada',
    why: 'Es el ámbito propio de la Ley 19.496 y puede comprobarse directamente en el texto publicado en BCN/LeyChile.',
  },
  {
    id: 'h2',
    text: 'El artículo 16 letra g) de la Ley 19.496 fija un parámetro general de abusividad: el desequilibrio importante contrario a la buena fe.',
    answer: 'verificada',
    why: 'La letra g) del artículo 16 opera como cláusula general de abusividad. Se comprueba abriendo el artículo en la fuente oficial.',
  },
  {
    id: 'h3',
    text: 'El artículo 16 bis letra h) de la Ley 19.496 prohíbe expresamente las cláusulas de modificación unilateral de tarifas en contratos celebrados por medios digitales.',
    answer: 'falsa',
    why: 'La numeración suena verosímil y por eso engaña. Al abrir el artículo 16 bis en la fuente se comprueba que no tiene ese contenido. Es el patrón clásico de cita inexistente: número plausible, contenido inventado.',
  },
  {
    id: 'h4',
    text: 'La Ley 21.719 obliga a la empresa a notificar a la Agencia de Protección de Datos dentro de 72 horas.',
    answer: 'falsa',
    why: 'Dos errores en una sola frase. Primero, la Ley 21.719 entra en vigencia el 1 de diciembre de 2026: en agosto de 2026 no es aplicable. Segundo, el plazo de 72 horas viene del reglamento europeo, no de la ley chilena.',
  },
  {
    id: 'h5',
    text: 'La Corte Suprema, en sentencia rol 12.345-2023, declaró abusiva una cláusula idéntica de una aplicación de transporte.',
    answer: 'falsa',
    why: 'Una cita judicial se verifica buscándola. Si el rol no aparece en el buscador del Poder Judicial, la afirmación no se sostiene. La precisión del formato —rol y año— no es señal de que exista.',
  },
  {
    id: 'h6',
    text: 'Dado que la cláusula permite modificar tarifas sin aviso previo, es probable que un tribunal la considere abusiva.',
    answer: 'inferencia',
    why: 'No está en ninguna fuente: es un razonamiento del modelo presentado con el tono de un dato. Puede ser un buen razonamiento, pero debe marcarse como lo que es.',
  },
  {
    id: 'h7',
    text: 'El consentimiento prestado mediante un clic no constituye consentimiento válido en Chile.',
    answer: 'dudosa',
    why: 'Enunciada así, en términos absolutos, no se sostiene. La cuestión depende de cómo se preste el consentimiento y de qué se informa. Una afirmación categórica sobre un punto discutible debe marcarse antes de usarse.',
  },
  {
    id: 'h8',
    text: 'La empresa debe designar un delegado de protección de datos.',
    answer: 'sin-fuente',
    why: 'La respuesta no indica de dónde sale la obligación. Bajo el régimen vigente al momento del caso no puede localizarse esa exigencia con ese alcance. Sin fuente, no entra al informe.',
  },
  {
    id: 'h9',
    text: 'El plazo para reclamar ante el SERNAC es de seis meses.',
    answer: 'sin-fuente',
    why: 'Un plazo es exactamente el tipo de afirmación que nunca debe aceptarse sin artículo. La respuesta no lo indica, y sin él la cifra es solo una cifra.',
  },
  {
    id: 'h10',
    text: 'La cláusula está redactada en términos amplios y de difícil comprensión para una persona usuaria sin formación jurídica.',
    answer: 'verificada',
    why: 'Aquí la fuente es el propio documento del caso. Se comprueba leyéndolo. No toda verificación exige salir a buscar una ley.',
  },
];

export const huntFeedback = {
  perfect: 'Todas correctas. Ese es el hábito: no se verifica el estilo, se verifican las afirmaciones.',
  good: 'Buen resultado. Revisa las que fallaste: casi siempre el error está en aceptar una cifra o una cita porque «suena» precisa.',
  needsWork:
    'Vale la pena repasar. La trampa más común es confundir seguridad de tono con respaldo: una frase bien escrita no es una frase verificada.',
};

// ─── Constructor de flujos ───────────────────────────────────────────────────
export const flowKindMeta: Record<FlowKind, { label: string; color: string; hint: string }> = {
  entrada:  { label: 'Entrada',        color: 'cyan',    hint: '¿Qué información entra y de dónde sale?' },
  tarea:    { label: 'Tarea',          color: 'indigo',  hint: '¿Qué se pide exactamente en este paso?' },
  ia:       { label: 'IA',             color: 'purple',  hint: '¿Qué parte hace la herramienta y con qué instrucción?' },
  fuente:   { label: 'Fuente',         color: 'amber',   hint: '¿Contra qué fuente oficial se contrasta?' },
  control:  { label: 'Control humano', color: 'emerald', hint: '¿Quién decide antes de continuar y con qué criterio?' },
  salida:   { label: 'Salida',         color: 'teal',    hint: '¿Qué produce este paso y para quién?' },
  registro: { label: 'Registro',       color: 'rose',    hint: '¿Qué queda anotado y dónde?' },
};

export const flowKindOrder: FlowKind[] = ['entrada', 'tarea', 'ia', 'fuente', 'control', 'salida', 'registro'];

/** Flujo de referencia: el canvas mínimo que se presenta en la sesión 2. */
export const canonicalFlow = [
  { kind: 'entrada'  as FlowKind, label: 'Texto de la cláusula, anonimizado' },
  { kind: 'tarea'    as FlowKind, label: 'Identificar qué elementos podrían discutirse' },
  { kind: 'ia'       as FlowKind, label: 'Análisis con fuentes acotadas y formato de tabla' },
  { kind: 'fuente'   as FlowKind, label: 'Contraste contra Ley 19.496 vigente en BCN' },
  { kind: 'control'  as FlowKind, label: 'Revisión de citas por una persona antes de continuar' },
  { kind: 'salida'   as FlowKind, label: 'Minuta con afirmaciones y su respaldo' },
  { kind: 'registro' as FlowKind, label: 'Fecha, herramienta, fuente, error detectado y corrección' },
];

/**
 * Ejercicio de la sesión 2: pasos desordenados de un flujo defectuoso. El
 * defecto no es solo el orden — la fuente aparece después del análisis y el
 * control humano está al final, cuando el documento ya salió.
 */
export const brokenFlow = {
  instruction:
    'Estos siete pasos pertenecen a un flujo real, pero están desordenados y el flujo tiene además dos defectos de fondo. Ordénalos y responde: ¿qué dos cosas seguirían mal aunque el orden fuera correcto?',
  steps: [
    { id: 'b1', text: 'Se envía la minuta al cliente.', correctPosition: 7 },
    { id: 'b2', text: 'Se pega el contrato completo, con nombre y RUT de las partes, en la herramienta.', correctPosition: 1 },
    { id: 'b3', text: 'Se pide a la IA un análisis general del contrato.', correctPosition: 2 },
    { id: 'b4', text: 'Se copia la respuesta a un documento y se le da formato.', correctPosition: 3 },
    { id: 'b5', text: 'Se buscan en Google los artículos citados para ver si existen.', correctPosition: 4 },
    { id: 'b6', text: 'Se corrigen las citas que no aparecieron.', correctPosition: 5 },
    { id: 'b7', text: 'Un abogado lee la minuta cuando el cliente pregunta por ella.', correctPosition: 6 },
  ],
  hiddenDefects: [
    'El primer paso entrega datos personales reales a una herramienta pública. Ningún reordenamiento arregla eso: el paso debe cambiar, no moverse.',
    'La revisión humana ocurre después del envío. Un control que llega cuando el documento ya salió no es un control: es una explicación.',
  ],
  discussion: '¿En qué punto de este flujo una persona debería haber decidido antes de continuar?',
};

// ─── Registro de validación ──────────────────────────────────────────────────
export const validationFields = [
  { key: 'fecha', label: 'Fecha', hint: 'Cuándo se ejecutó el paso.', example: '03-09-2026' },
  { key: 'herramienta', label: 'Herramienta', hint: 'Cuál se usó y, si se conoce, versión o configuración.', example: 'Asistente conversacional, configuración por defecto' },
  { key: 'tarea', label: 'Tarea', hint: 'Qué se pidió exactamente en este paso.', example: 'Identificar elementos discutibles de la cláusula' },
  { key: 'input', label: 'Input', hint: 'Qué información entró. Anonimizada.', example: 'Texto de la cláusula, sin partes identificadas' },
  { key: 'fuente', label: 'Fuente', hint: 'Contra qué se contrastó y en qué fecha.', example: 'Ley 19.496 en BCN, consultada el 03-09-2026' },
  { key: 'output', label: 'Output', hint: 'Qué produjo, en una línea.', example: 'Tabla con cuatro afirmaciones y sus normas' },
  { key: 'error', label: 'Error detectado', hint: 'Qué salió mal. Si no hubo error, decirlo explícitamente.', example: 'Citó un artículo 16 bis letra h) inexistente' },
  { key: 'correccion', label: 'Corrección', hint: 'Qué se hizo con el error.', example: 'Se eliminó la afirmación y se acotaron las fuentes en el prompt' },
  { key: 'decision', label: 'Decisión humana', hint: 'Quién decidió qué, en este paso.', example: 'La revisora descartó la afirmación por falta de respaldo' },
  { key: 'estado', label: 'Estado final', hint: 'Verificado, pendiente o descartado.', example: 'Verificado con reservas' },
] as const;

// ─── Matriz de verificación ──────────────────────────────────────────────────
export const matrixColumns = [
  { key: 'afirmacion', label: 'Afirmación', hint: 'La frase concreta que la respuesta sostiene.' },
  { key: 'fuenteIA', label: 'Fuente indicada por la IA', hint: 'Lo que la respuesta dijo que era su fuente.' },
  { key: 'fuenteReal', label: 'Fuente real', hint: 'Lo que efectivamente encontraste al buscarla.' },
  { key: 'coincide', label: '¿Coincide?', hint: 'Sí, no o parcialmente.' },
  { key: 'confianza', label: 'Nivel de confianza', hint: 'Alto, medio o bajo, después de verificar.' },
  { key: 'correccion', label: 'Corrección', hint: 'Qué harías con esta afirmación.' },
] as const;

// ─── Ficha de Match Making ───────────────────────────────────────────────────
export const challengeFields = [
  { n: 1,  key: 'nombre',     label: 'Nombre del desafío', question: '¿Cómo lo llamamos?', hint: 'Un nombre corto que cualquiera entienda.', placeholder: 'Revisión asistida de contratos de adhesión' },
  { n: 2,  key: 'problema',   label: 'Problema jurídico', question: '¿Cuál es el problema, en una frase?', hint: 'Una frase. Si necesitas tres, el problema todavía no está definido.', placeholder: 'Las personas usuarias aceptan cláusulas que no pueden leer ni comparar.' },
  { n: 3,  key: 'usuaria',    label: 'Persona usuaria', question: '¿Para quién?', hint: 'Una persona concreta con un trabajo concreto, no «los abogados».', placeholder: 'Abogada de una clínica jurídica que revisa 20 contratos por semana.' },
  { n: 4,  key: 'necesidad',  label: 'Necesidad', question: '¿Qué necesita conseguir?', hint: 'Lo que esa persona quiere lograr, no la herramienta que imaginamos.', placeholder: 'Detectar en minutos qué cláusulas merecen revisión detallada.' },
  { n: 5,  key: 'tarea',      label: 'Tarea susceptible de apoyo tecnológico', question: '¿Qué tarea concreta puede apoyar la IA?', hint: 'Una tarea delimitada, no «revisar contratos».', placeholder: 'Localizar y extraer cláusulas de modificación unilateral y de tratamiento de datos.' },
  { n: 6,  key: 'input',      label: 'Input', question: '¿Qué información ingresa?', hint: 'Qué entra, en qué formato y anonimizado cómo.', placeholder: 'Texto del contrato en PDF, sin datos de las partes.' },
  { n: 7,  key: 'fuente',     label: 'Fuente jurídica autorizada', question: '¿De dónde obtiene el fundamento?', hint: 'Fuentes oficiales y su versión vigente.', placeholder: 'Ley 19.496 y Ley 19.628, versión vigente en BCN/LeyChile.' },
  { n: 8,  key: 'resultado',  label: 'Resultado esperado', question: '¿Qué debe producir?', hint: 'Algo que la persona usuaria pueda usar y revisar.', placeholder: 'Lista de cláusulas marcadas, con el texto citado y la norma pertinente.' },
  { n: 9,  key: 'riesgos',    label: 'Riesgos', question: '¿Qué puede salir mal?', hint: 'Al menos uno que sea culpa del diseño, no del usuario.', placeholder: 'Marcar como problemática una cláusula que no lo es, y que nadie lo revise.' },
  { n: 10, key: 'supervision',label: 'Supervisión humana', question: '¿Quién revisa y cuándo?', hint: 'Nombre del rol y momento exacto del flujo.', placeholder: 'La abogada revisa cada cláusula marcada antes de que salga a informe.' },
  { n: 11, key: 'exito',      label: 'Criterio de éxito', question: '¿Cómo sabremos si sirve?', hint: 'Algo que podría comprobarse con la persona usuaria.', placeholder: 'La revisión inicial baja de 40 a 10 minutos sin perder cláusulas relevantes.' },
  { n: 12, key: 'noDebe',     label: 'Lo que NO debe hacer', question: '¿Qué límites declaramos?', hint: 'El campo más importante. Si está vacío, la ficha no está terminada.', placeholder: 'No concluir sobre la validez de una cláusula ni comunicarse con la contraparte.' },
] as const;

export const challengeRule =
  'Si la persona de otra disciplina no entiende el problema, el problema todavía no está bien enunciado. La ficha se corrige, no se explica de viva voz.';

// ─── Cómo NO y cómo SÍ traducir un problema ──────────────────────────────────
export const translationExample = {
  bad: 'Quiero una IA que revise contratos.',
  badWhy: 'No dice qué contratos, qué se busca en ellos, contra qué se contrasta, qué produce ni quién responde por el resultado. No hay nada que construir.',
  good: 'Necesitamos detectar determinadas cláusulas, mostrar el texto relevante, contrastarlo con fuentes autorizadas, indicar el nivel de incertidumbre y derivar la decisión final a revisión humana.',
  goodWhy: 'Cada parte de la frase es una decisión de diseño: qué se detecta, qué se muestra, contra qué se contrasta, cómo se declara la duda y dónde entra la persona.',
};

// ─── Pitch ───────────────────────────────────────────────────────────────────
export const pitchSpec = {
  seconds: 240,
  milestones: [180, 60, 0],
  structure: [
    { at: '0:00 – 1:00', say: 'Problema y persona usuaria. Qué le pasa hoy a esa persona.' },
    { at: '1:00 – 2:15', say: 'Qué hace la solución: la tarea concreta, el input y la salida.' },
    { at: '2:15 – 3:15', say: 'Fuentes y controles: contra qué se contrasta y quién revisa antes de que salga.' },
    { at: '3:15 – 4:00', say: 'Qué NO debe hacer, y el criterio de éxito.' },
  ],
  rule: 'Cuatro minutos, sin excepción. Un pitch que se pasa de tiempo es un pitch que no eligió qué era importante.',
};
