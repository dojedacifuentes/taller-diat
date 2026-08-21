// ─────────────────────────────────────────────────────────────────────────────
// NÚCLEO PEDAGÓGICO — vocabulario, progresión del prompt, ruta de aprendizaje
// y reglas de privacidad.
//
// Criterio de admisión de contenido en este archivo: una persona que estudia
// Derecho, usa Word y navegador, y quizá ha usado ChatGPT alguna vez, debe
// poder entenderlo sin formación técnica previa. Si un concepto no le ayuda a
// hacer algo concreto, no entra.
// ─────────────────────────────────────────────────────────────────────────────
import type { GlossaryTerm } from '@/lib/types';

// ─── Tesis transversal ───────────────────────────────────────────────────────
export const thesis = {
  headline:
    'El objetivo no es escribir prompts más largos. Es diseñar trabajo jurídico útil, verificable, trazable y responsable.',
  progression: [
    { step: 'Sesión 1', label: 'PROMPT', claim: 'Aprendo a formular la tarea correctamente.' },
    { step: 'Sesión 2', label: 'FLUJO', claim: 'Aprendo a convertir una respuesta aislada en un procedimiento verificable.' },
    { step: 'Sesión 3', label: 'MATCH', claim: 'Aprendo a explicar el problema y mejorar la solución con otras disciplinas.' },
    { step: 'Resultado', label: 'USO RESPONSABLE', claim: 'Formular, controlar, verificar y asumir la decisión final.' },
  ],
  closing:
    'La competencia profesional no consiste en conseguir que una IA responda. Consiste en saber formular la tarea, controlar el proceso, verificar el resultado y asumir responsablemente la decisión final.',
} as const;

// ─── Contenido mínimo sobre IA (máx. 10–12 min acumulados en la sesión 1) ────
export const aiMinimum = {
  what: {
    q: '¿Qué es?',
    a: 'Un sistema capaz de producir resultados a partir de patrones aprendidos en datos.',
  },
  llm: {
    q: '¿Qué hace un modelo de lenguaje?',
    a: 'Genera lenguaje de forma probabilística, condicionado por el contexto que recibe.',
  },
  notImplied: {
    q: '¿Qué NO implica?',
    a: 'No garantiza verdad, vigencia jurídica, existencia real de la fuente, interpretación correcta, intención ni responsabilidad.',
    items: ['Verdad', 'Vigencia jurídica', 'Fuente real', 'Interpretación correcta', 'Intención', 'Responsabilidad'],
  },
  teachingLine:
    'La fluidez es una propiedad del lenguaje generado. La corrección jurídica exige verificación externa.',
} as const;

/** Los tres tipos de respuesta que la sesión 1 enseña a distinguir. */
export const answerTypes = [
  {
    kind: 'Plausible',
    definition: 'Suena bien, está bien escrita y es coherente.',
    test: '¿Podría leerse en voz alta sin que nadie se incomode?',
    enough: false,
  },
  {
    kind: 'Correcta',
    definition: 'Afirma cosas que efectivamente son así.',
    test: '¿Cada afirmación resiste el contraste con una fuente?',
    enough: false,
  },
  {
    kind: 'Jurídicamente fundada',
    definition: 'Es correcta, indica su fuente vigente y muestra el razonamiento que conecta hecho y norma.',
    test: '¿Puedo mostrar de dónde sale cada afirmación y con qué fecha?',
    enough: true,
  },
] as const;

// ─── Estructura DIAT del prompt jurídico ─────────────────────────────────────
export const promptLayers = [
  {
    key: 'contexto',
    name: 'Contexto',
    question: '¿Quién pregunta, sobre qué hechos y en qué jurisdicción?',
    why: 'Sin jurisdicción y hechos, la respuesta es genérica o de Derecho extranjero.',
    example: 'Estudiante de Derecho en Chile. Contrato de adhesión de una app de arriendo de bicicletas. Los hechos son los del caso CT-01.',
    required: true,
  },
  {
    key: 'rol',
    name: 'Rol (cuando es útil)',
    question: '¿Desde qué punto de vista conviene que trabaje?',
    why: 'Ayuda a fijar el nivel de detalle. No es magia: un rol no vuelve correcta una respuesta falsa.',
    example: 'Actúa como analista que prepara un informe para revisión de un abogado, no como abogado que decide.',
    required: false,
  },
  {
    key: 'tarea',
    name: 'Tarea',
    question: '¿Qué debe producir exactamente?',
    why: 'Una tarea amplia produce un texto amplio. Una tarea delimitada produce algo revisable.',
    example: 'Identifica qué elementos de la cláusula podrían discutirse a la luz de la Ley 19.496 y explica por qué.',
    required: true,
  },
  {
    key: 'fuentes',
    name: 'Fuentes',
    question: '¿De dónde puede y de dónde no puede sacar el fundamento?',
    why: 'Es la capa que más reduce las citas inventadas.',
    example: 'Usa exclusivamente la Ley 19.496 y la Ley 19.628 en su versión vigente en BCN. No uses Derecho comparado.',
    required: true,
  },
  {
    key: 'restricciones',
    name: 'Restricciones',
    question: '¿Qué no debe hacer?',
    why: 'Lo que se prohíbe explícitamente es lo que deja de aparecer.',
    example: 'No inventes números de artículo. No cites jurisprudencia. No concluyas sobre la validez final de la cláusula.',
    required: true,
  },
  {
    key: 'formato',
    name: 'Formato',
    question: '¿Cómo quiero recibirlo para poder revisarlo?',
    why: 'Un formato con columnas obliga a mostrar dónde falta respaldo.',
    example: 'Tabla con columnas: afirmación · norma invocada · artículo · nivel de certeza.',
    required: true,
  },
  {
    key: 'control',
    name: 'Control',
    question: '¿Cómo debe declarar lo que no sabe?',
    why: 'Es la capa que convierte la respuesta en material de trabajo y no en veredicto.',
    example: 'Distingue afirmación textual, inferencia y recomendación. Si no puedes verificar un punto, indícalo expresamente.',
    required: true,
  },
] as const;

// ─── Progresión del prompt: de nivel 0 a nivel 5 ─────────────────────────────
// Enseña que la mejora es acumulativa. No existe el «prompt mágico» de 2.000
// palabras: existe una tarea cada vez mejor especificada.
export const promptProgression = [
  {
    level: 0,
    label: 'Orden vaga',
    prompt: 'Analiza este contrato.',
    problem: 'No dice qué significa «analizar». La respuesta puede ser cualquier cosa y no hay forma de decir si está bien.',
    adds: [],
  },
  {
    level: 1,
    label: 'Tarea nombrada',
    prompt: 'Identifica cláusulas problemáticas en este contrato.',
    problem: '«Problemáticas» según qué criterio y qué Derecho. Sigue sin poder revisarse.',
    adds: ['Tarea'],
  },
  {
    level: 2,
    label: 'Con contexto',
    prompt:
      'Contrato de adhesión de una aplicación de arriendo de bicicletas en Chile. Necesito preparar una consulta para una usuaria que reclama un alza de tarifa sin aviso. Identifica qué cláusulas podrían discutirse.',
    problem: 'Ya se puede evaluar la pertinencia, pero nada impide que invente la norma que cita.',
    adds: ['Contexto', 'Jurisdicción', 'Finalidad'],
  },
  {
    level: 3,
    label: 'Con fuentes y límites',
    prompt:
      '…Usa exclusivamente la Ley 19.496 y la Ley 19.628 en su versión vigente. No uses Derecho comparado ni jurisprudencia. No inventes números de artículo.',
    problem: 'Baja mucho la invención, pero la respuesta todavía puede ser un texto corrido difícil de auditar.',
    adds: ['Fuentes autorizadas', 'Restricciones'],
  },
  {
    level: 4,
    label: 'Con formato revisable',
    prompt:
      '…Devuélvelo como tabla: afirmación · norma invocada · artículo · nivel de certeza (alto/medio/bajo). Marca con «—» cualquier celda que no puedas completar con respaldo.',
    problem: 'Ya es auditable. Falta que declare explícitamente qué es inferencia suya.',
    adds: ['Formato', 'Declaración de incertidumbre'],
  },
  {
    level: 5,
    label: 'Con control',
    prompt:
      '…Distingue afirmación textual de la ley, inferencia propia y recomendación. No inventes fuentes. Si no puedes verificar un punto, indícalo expresamente en lugar de completarlo.',
    problem: 'Este es el punto de llegada del taller: no un prompt más largo, sino uno que puede revisarse línea por línea.',
    adds: ['Control', 'Trazabilidad'],
  },
] as const;

// ─── Protocolo de verificación ───────────────────────────────────────────────
export const verificationProtocol = [
  {
    step: 'Identificar',
    action: 'Subrayar cada afirmación que pretende ser un hecho jurídico: norma, artículo, plazo, requisito, consecuencia.',
    trap: 'Subrayar el estilo en vez de las afirmaciones.',
  },
  {
    step: 'Contrastar',
    action: 'Buscar cada afirmación en la fuente oficial. Si la fuente no la contiene, la afirmación no está verificada.',
    trap: 'Dar por buena una cita porque el número de artículo «suena bien».',
  },
  {
    step: 'Justificar',
    action: 'Escribir en una línea por qué la fuente sostiene —o no— la afirmación.',
    trap: 'Escribir «coincide» sin decir qué parte de la fuente coincide.',
  },
  {
    step: 'Registrar',
    action: 'Dejar constancia de la fuente, la fecha de consulta y la corrección aplicada.',
    trap: 'Corregir el texto y perder el rastro de qué se corrigió y por qué.',
  },
] as const;

/** Regla del ejercicio «Cazador de alucinaciones». */
export const huntRule = 'No verificar el estilo. Verificar las afirmaciones.';

// ─── Ruta de aprendizaje (progreso local, sin cuenta) ────────────────────────
export const learningPath = [
  { id: 'comprender', n: 1, label: 'Comprender', session: 1, description: 'Qué puede y qué no puede hacer un modelo de lenguaje.', href: '/sesiones/1' },
  { id: 'disenar', n: 2, label: 'Diseñar prompt', session: 1, description: 'Las siete capas de la estructura DIAT.', href: '/prompt-lab' },
  { id: 'verificar', n: 3, label: 'Verificar', session: 1, description: 'Cazar alucinaciones y completar la matriz.', href: '/verificacion' },
  { id: 'flujo', n: 4, label: 'Construir flujo', session: 2, description: 'Entrada → IA → fuente → control → salida → registro.', href: '/flujo' },
  { id: 'validar', n: 5, label: 'Validar', session: 2, description: 'Registro de validación y auditoría cruzada.', href: '/flujo' },
  { id: 'traducir', n: 6, label: 'Traducir problema', session: 3, description: 'De «quiero una IA que…» a una especificación.', href: '/match' },
  { id: 'match', n: 7, label: 'Match', session: 3, description: 'Ficha de desafío en doce campos.', href: '/match' },
  { id: 'presentar', n: 8, label: 'Presentar', session: 3, description: 'Pitch de cuatro minutos y defensa de los límites.', href: '/match' },
] as const;

// ─── Privacidad ──────────────────────────────────────────────────────────────
export const privacyRule =
  'No pegar información confidencial en herramientas públicas de IA.';

export const privacyPractices = [
  { do: 'Sustituir nombres por iniciales o etiquetas («la usuaria», «la empresa A»).', dont: 'Pegar el nombre completo de una parte.' },
  { do: 'Eliminar el RUT o reemplazarlo por «RUT omitido».', dont: 'Copiar el RUT «solo para que entienda el caso».' },
  { do: 'Quitar domicilios, teléfonos y correos.', dont: 'Dejar el encabezado del documento original.' },
  { do: 'Omitir datos sensibles: salud, situación socioeconómica, origen, creencias.', dont: 'Pegar un informe médico completo.' },
  { do: 'Describir el hecho en abstracto cuando el detalle no aporta.', dont: 'Subir el expediente entero por comodidad.' },
  { do: 'Trabajar con casos ficticios en el taller.', dont: 'Usar una causa real en curso.' },
] as const;

export const privacyNotice =
  'Este taller trabaja exclusivamente con casos simulados, anonimizados o expresamente autorizados. Nada de lo que se escriba en estas herramientas debe contener datos personales reales.';

// ─── Glosario vivo ───────────────────────────────────────────────────────────
export const glossary: GlossaryTerm[] = [
  { group: 'Fundamentos', term: 'IA generativa', definition: 'Sistema que produce contenido nuevo —texto, imagen, audio— a partir de patrones aprendidos en datos.', legalExample: 'Redactar un borrador de cláusula que después una persona revisa y corrige.' },
  { group: 'Fundamentos', term: 'Modelo de lenguaje (LLM)', definition: 'Sistema entrenado para predecir qué texto sigue a un texto dado. No consulta un registro de verdad.', legalExample: 'Puede escribir un párrafo impecable sobre una ley que no dice eso.' },
  { group: 'Fundamentos', term: 'Modelo', definition: 'El sistema concreto que se usa, con su versión y su fecha de corte de datos.', legalExample: 'Anotar qué modelo se usó permite explicar después por qué el resultado fue ese.' },
  { group: 'Fundamentos', term: 'Token', definition: 'Unidad mínima en que el modelo divide el texto: aproximadamente cuatro caracteres.', legalExample: 'Un escrito de veinte páginas ocupa varios miles de tokens del espacio disponible.' },
  { group: 'Fundamentos', term: 'Ventana de contexto', definition: 'Cantidad de texto que el modelo puede tener presente a la vez.', legalExample: 'Si se supera, el modelo deja de «ver» las primeras páginas del documento pegado.' },
  { group: 'Fundamentos', term: 'Corte de datos', definition: 'Fecha hasta la cual el modelo fue entrenado. Lo posterior no lo conoce, salvo que se le entregue.', legalExample: 'Una reforma legal reciente puede ser invisible para el modelo.' },
  { group: 'Prompting', term: 'Prompt', definition: 'La instrucción que se entrega al modelo. En este taller, siete capas: contexto, rol, tarea, fuentes, restricciones, formato y control.', legalExample: 'Un prompt sin jurisdicción produce una respuesta que no sirve para Chile.' },
  { group: 'Prompting', term: 'Contexto', definition: 'La información de partida: quién pregunta, sobre qué hechos y para qué.', legalExample: 'Decir «para preparar una consulta, no para presentar un escrito» cambia el resultado.' },
  { group: 'Prompting', term: 'Rol', definition: 'Punto de vista desde el que se pide trabajar. Ajusta el nivel de detalle, no la veracidad.', legalExample: 'Pedir «actúa como analista que prepara material para revisión» evita respuestas concluyentes.' },
  { group: 'Prompting', term: 'Restricción', definition: 'Lo que se prohíbe explícitamente en la respuesta.', legalExample: '«No inventes números de artículo» reduce visiblemente las citas falsas.' },
  { group: 'Prompting', term: 'Formato de salida', definition: 'La forma en que se pide el resultado para poder revisarlo.', legalExample: 'Una tabla con columna «fuente» deja a la vista las celdas sin respaldo.' },
  { group: 'Prompting', term: 'Prompting encadenado', definition: 'Dividir un trabajo en varios pasos consecutivos, cada uno con su propia instrucción y su propia revisión.', legalExample: 'Primero ordenar hechos; después identificar preguntas jurídicas; después buscar fuentes.' },
  { group: 'Prompting', term: 'Input', definition: 'La información que entra al paso: un texto, un documento, un dato.', legalExample: 'El input del primer paso del caso CT-01 es el texto de la cláusula, sin datos personales.' },
  { group: 'Prompting', term: 'Output', definition: 'Lo que el paso produce. Es material de trabajo, no un resultado final.', legalExample: 'El output se pega en el registro antes de corregirlo, para conservar el rastro.' },
  { group: 'Verificación', term: 'Fuente', definition: 'El texto oficial del que proviene una afirmación: la ley, el reglamento, la sentencia.', legalExample: 'BCN/LeyChile para legislación; el Diario Oficial para publicación; el Poder Judicial para causas.' },
  { group: 'Verificación', term: 'Vigencia', definition: 'Si la norma está en aplicación en la fecha relevante. Publicada no es lo mismo que vigente.', legalExample: 'La Ley 21.719 está publicada desde diciembre de 2024 y entra en vigencia el 1 de diciembre de 2026.' },
  { group: 'Verificación', term: 'Verificación', definition: 'Contrastar cada afirmación con la fuente oficial y dejar constancia del resultado.', legalExample: 'Buscar el artículo citado y comprobar que dice lo que la respuesta afirma.' },
  { group: 'Verificación', term: 'Trazabilidad', definition: 'Poder reconstruir de dónde salió cada parte del resultado y quién decidió qué.', legalExample: 'Registrar herramienta, fecha, input, fuente y corrección aplicada.' },
  { group: 'Verificación', term: 'Matriz de verificación', definition: 'Tabla que cruza cada afirmación con la fuente indicada, la fuente real y el nivel de confianza.', legalExample: 'Es el producto exigido al final de la sesión 1.' },
  { group: 'Verificación', term: 'Nivel de confianza', definition: 'Cuánto respaldo tiene una afirmación después de verificarla: alto, medio o bajo.', legalExample: 'Una afirmación sin fuente localizable es de confianza baja, aunque suene segura.' },
  { group: 'Riesgos', term: 'Alucinación', definition: 'Afirmación falsa producida con la misma seguridad que una verdadera.', legalExample: 'Un artículo con numeración verosímil que no existe o que dice otra cosa.' },
  { group: 'Riesgos', term: 'Cita inexistente', definition: 'Referencia a una norma, sentencia o autor que no puede encontrarse en ninguna fuente.', legalExample: 'Una sentencia con rol y año que no aparece en el buscador del Poder Judicial.' },
  { group: 'Riesgos', term: 'Falsa seguridad lingüística', definition: 'La impresión de solidez que produce un texto bien escrito, con independencia de si es correcto.', legalExample: 'Un párrafo elegante que atribuye a la ley un requisito que la ley no exige.' },
  { group: 'Riesgos', term: 'Omisión', definition: 'Lo que la respuesta deja fuera sin advertirlo.', legalExample: 'Analizar la cláusula de tarifas y no mencionar la cláusula de datos personales.' },
  { group: 'Riesgos', term: 'Sesgo', definition: 'Inclinación sistemática del resultado, heredada de los datos o del modo de preguntar.', legalExample: 'Preguntar «¿por qué esta cláusula es abusiva?» ya orienta la respuesta.' },
  { group: 'Riesgos', term: 'Inferencia', definition: 'Conclusión que el modelo deduce y que no está literalmente en la fuente.', legalExample: 'Deducir un plazo a partir de una regla general, sin decir que lo está deduciendo.' },
  { group: 'Riesgos', term: 'Dato personal', definition: 'Información sobre una persona identificada o identificable.', legalExample: 'Nombre, RUT, domicilio, teléfono, correo, patente del vehículo.' },
  { group: 'Riesgos', term: 'Dato sensible', definition: 'Dato personal referido a esferas especialmente protegidas.', legalExample: 'Salud, origen, creencias, vida sexual, situación socioeconómica.' },
  { group: 'Riesgos', term: 'Anonimización', definition: 'Quitar o sustituir los elementos que permiten identificar a una persona.', legalExample: 'Reemplazar «Juana Pérez, RUT …» por «la usuaria».' },
  { group: 'Flujo', term: 'Flujo', definition: 'Secuencia de pasos revisables por separado, en lugar de una sola pregunta larga.', legalExample: 'Entrada → tarea → IA → fuente → control humano → salida → registro.' },
  { group: 'Flujo', term: 'Control humano', definition: 'Punto del flujo donde una persona decide antes de continuar.', legalExample: 'Nadie envía el informe sin que un abogado haya revisado las citas.' },
  { group: 'Flujo', term: 'Supervisión humana', definition: 'Responsabilidad de una persona sobre el resultado, sostenida en el tiempo y no solo en un clic.', legalExample: 'Quien firma responde, aunque el borrador lo haya escrito una herramienta.' },
  { group: 'Flujo', term: 'Registro de validación', definition: 'Bitácora del flujo: qué se hizo, con qué, con qué fuente, qué salió mal y qué se corrigió.', legalExample: 'Es el producto exigido al final de la sesión 2.' },
];

export const glossaryGroups = ['Fundamentos', 'Prompting', 'Verificación', 'Riesgos', 'Flujo'] as const;
