// ─────────────────────────────────────────────────────────────────────────────
// EVALUACIÓN E INSTRUMENTOS
//
// Los porcentajes provienen de la propuesta académica oficial y no se alteran.
// Lo que se añade aquí es la traducción de esos criterios a cuatro niveles con
// descriptores observables: cada nivel describe una conducta que puede verse en
// el material entregado, no una impresión general. No se usan adjetivos sueltos
// («bueno», «adecuado») sin decir qué conducta los justifica.
// ─────────────────────────────────────────────────────────────────────────────
import type { RubricCriterion } from '@/lib/types';
import { evaluation } from '@/data/program';

export const rubric: RubricCriterion[] = [
  {
    weight: 20,
    criterion: 'Relevancia y definición del problema jurídico',
    levels: [
      { level: 'Inicial', descriptor: 'El problema se enuncia como un tema («contratos», «datos personales») sin hechos ni pregunta jurídica identificable.' },
      { level: 'En desarrollo', descriptor: 'Hay hechos y una pregunta, pero falta jurisdicción, finalidad o persona afectada, y la pregunta admite varias lecturas.' },
      { level: 'Logrado', descriptor: 'El problema se enuncia en una frase con hechos, jurisdicción y finalidad, y se identifica a quién afecta.' },
      { level: 'Destacado', descriptor: 'Además, se distinguen las preguntas jurídicas que el problema contiene y se explica cuál se aborda y cuál queda fuera del alcance.' },
    ],
  },
  {
    weight: 20,
    criterion: 'Calidad del flujo y de los prompts',
    levels: [
      { level: 'Inicial', descriptor: 'Un único prompt largo que pide todo a la vez; el flujo no existe o es una lista de deseos.' },
      { level: 'En desarrollo', descriptor: 'El prompt tiene tarea y contexto, y el flujo tiene pasos, pero ningún paso puede revisarse por separado.' },
      { level: 'Logrado', descriptor: 'Los prompts tienen las siete capas y el flujo separa entrada, tarea, IA, fuente, control humano, salida y registro.' },
      { level: 'Destacado', descriptor: 'Además, cada paso declara qué entrega al siguiente y el equipo muestra al menos una iteración: qué falló, qué se cambió y qué mejoró.' },
    ],
  },
  {
    weight: 25,
    criterion: 'Fundamentación y verificación de fuentes',
    levels: [
      { level: 'Inicial', descriptor: 'Se citan normas sin indicar artículo ni versión, o se toma la respuesta de la IA como fuente.' },
      { level: 'En desarrollo', descriptor: 'Hay fuentes oficiales, pero no se comprueba la vigencia ni se registra la fecha de consulta; algunas afirmaciones quedan sin respaldo y no se marca.' },
      { level: 'Logrado', descriptor: 'Cada afirmación relevante aparece en la matriz con fuente indicada, fuente real, coincidencia, nivel de confianza y fecha de consulta.' },
      { level: 'Destacado', descriptor: 'Además, el equipo documenta al menos un error detectado —cita inexistente, norma no vigente u omisión— y explica cómo lo descubrió.' },
    ],
  },
  {
    weight: 15,
    criterion: 'Utilidad para la persona usuaria',
    levels: [
      { level: 'Inicial', descriptor: 'No se identifica a la persona usuaria, o se la describe como «los abogados» en general.' },
      { level: 'En desarrollo', descriptor: 'Se nombra a la persona usuaria pero la solución responde a lo que el equipo quiere construir, no a lo que esa persona necesita conseguir.' },
      { level: 'Logrado', descriptor: 'Se identifica a la persona usuaria, qué necesita conseguir y en qué momento de su trabajo aparece la necesidad.' },
      { level: 'Destacado', descriptor: 'Además, el criterio de éxito está formulado de modo que podría comprobarse con esa persona.' },
    ],
  },
  {
    weight: 10,
    criterion: 'Ética, privacidad y supervisión humana',
    levels: [
      { level: 'Inicial', descriptor: 'Aparecen datos identificables en los ejemplos, o no se menciona quién revisa antes de que el resultado salga.' },
      { level: 'En desarrollo', descriptor: 'Se afirma que habrá revisión humana pero no se dice quién, en qué punto ni con qué criterio.' },
      { level: 'Logrado', descriptor: 'Los ejemplos están anonimizados y el flujo indica el punto exacto de control humano y quién lo ejerce.' },
      { level: 'Destacado', descriptor: 'Además, la ficha declara expresamente qué NO debe hacer la solución y qué decisiones no pueden delegarse.' },
    ],
  },
  {
    weight: 10,
    criterion: 'Claridad de la demostración final',
    levels: [
      { level: 'Inicial', descriptor: 'El pitch excede el tiempo o se agota describiendo la herramienta sin llegar al problema.' },
      { level: 'En desarrollo', descriptor: 'Se explica el problema y la solución dentro del tiempo, pero no se muestra ningún control ni límite.' },
      { level: 'Logrado', descriptor: 'En cuatro minutos se cubren problema, persona usuaria, qué hace la solución, qué controles tiene y qué no debe hacer.' },
      { level: 'Destacado', descriptor: 'Además, el equipo responde una objeción sobre riesgo o verificación sin abandonar sus límites declarados.' },
    ],
  },
];

/** Comprueba que la rúbrica no se despegue de los porcentajes oficiales. */
const officialWeights = evaluation.map(e => `${e.weight}|${e.criterion}`).join('#');
const rubricWeights = rubric.map(r => `${r.weight}|${r.criterion}`).join('#');
if (officialWeights !== rubricWeights) {
  throw new Error(
    'La rúbrica de cuatro niveles no coincide con los criterios oficiales de la propuesta académica.',
  );
}

export const rubricTotal = rubric.reduce((sum, r) => sum + r.weight, 0);

export const rubricLevelOrder = ['Inicial', 'En desarrollo', 'Logrado', 'Destacado'] as const;

// ─── Microdiagnóstico de entrada (sesión 1, máx. 5 minutos) ──────────────────
// Se responde a mano alzada o en papel. No se piden datos personales: ni
// nombre, ni correo, ni año que cursa de forma identificable.
export const entryDiagnostic = {
  title: 'Microdiagnóstico de entrada',
  when: 'Sesión 1 · minutos 0–5',
  howLong: '5 minutos',
  privacy: 'Anónimo. No se registran nombres ni correos.',
  questions: [
    {
      q: '¿Con qué frecuencia usas una herramienta de IA para algo relacionado con tus estudios de Derecho?',
      options: ['Nunca', 'Alguna vez', 'Cada semana', 'Casi a diario'],
      measures: 'Experiencia previa',
    },
    {
      q: 'Cuando una respuesta de IA te parece bien escrita, ¿cuánto confías en que además es correcta?',
      options: ['Nada', 'Poco', 'Bastante', 'Mucho'],
      measures: 'Confianza y falsa seguridad lingüística',
    },
    {
      q: '¿Has comprobado alguna vez en la fuente oficial una norma que te citó una IA?',
      options: ['Nunca', 'Una o dos veces', 'Habitualmente', 'Siempre'],
      measures: 'Hábito de verificación',
    },
    {
      q: '¿Has pegado alguna vez en una herramienta de IA un documento con nombres, RUT o datos de una persona real?',
      options: ['No', 'No estoy seguro/a', 'Sí, una vez', 'Sí, varias veces'],
      measures: 'Conciencia de privacidad',
    },
    {
      q: '¿Para qué la has usado con más frecuencia?',
      options: ['Resumir', 'Redactar', 'Explicar un concepto', 'Buscar normas o jurisprudencia', 'No la he usado'],
      measures: 'Usos declarados',
    },
  ],
} as const;

// ─── Exit tickets ────────────────────────────────────────────────────────────
export const exitTickets = [
  {
    session: 1,
    when: 'minutos 88–90',
    prompts: [
      'Algo que a partir de ahora verificaré siempre.',
      'Un error que detecté hoy en una respuesta de IA.',
      'Una regla que añadiré a mi próximo prompt.',
    ],
  },
  {
    session: 2,
    when: 'minutos 86–90',
    prompts: [
      'Completa y lee en voz alta: «Nuestra IA puede hacer ______, pero no puede decidir ______ sin revisión humana».',
      'El paso de nuestro flujo donde más fácil sería equivocarse sin darnos cuenta.',
    ],
  },
  {
    session: 3,
    when: 'minutos 87–89',
    prompts: [
      'Una frase sobre qué aprendí al explicar mi problema a otra disciplina.',
      'Algo que mi solución NO debe hacer, y por qué.',
    ],
  },
] as const;

// ─── Instrumento de salida (al cierre de la sesión 3) ────────────────────────
export const exitSurvey = {
  title: 'Instrumento de salida',
  when: 'Sesión 3 · minutos 87–89',
  privacy: 'Anónimo. Se compara con el diagnóstico de entrada solo de forma agregada.',
  scale: '1 = nada · 4 = mucho',
  items: [
    { item: 'Distingo una respuesta plausible de una respuesta jurídicamente fundada.', measures: 'Cambio de percepción' },
    { item: 'Me siento capaz de estructurar un prompt jurídico con fuentes y control.', measures: 'Autoconfianza' },
    { item: 'Sé cómo comprobar si una norma citada existe y está vigente.', measures: 'Capacidad de verificar' },
    { item: 'Podría dividir un encargo en pasos con control humano explícito.', measures: 'Comprensión del flujo' },
    { item: 'Identifico qué información no debo pegar en una herramienta pública.', measures: 'Reconocimiento de riesgos' },
    { item: 'Podría explicar mi problema jurídico a alguien de otra disciplina.', measures: 'Traducción interdisciplinaria' },
  ],
  openQuestion: '¿Qué cambiarías del taller? (opcional, una línea)',
} as const;

// ─── Revisión entre pares, sesión 1 ──────────────────────────────────────────
export const peerChecklist = [
  '¿El prompt dice en qué jurisdicción y sobre qué hechos se pregunta?',
  '¿La tarea es lo bastante concreta como para saber si se cumplió?',
  '¿Se indican fuentes autorizadas y se prohíbe expresamente inventarlas?',
  '¿El formato pedido obliga a mostrar de dónde sale cada afirmación?',
  '¿Hay al menos una afirmación marcada como no verificada o dudosa? Si no la hay, ¿es porque se verificó todo o porque no se revisó?',
] as const;

// ─── Auditoría cruzada, sesión 2 ─────────────────────────────────────────────
export const crossAudit = {
  instruction:
    'El equipo A audita el flujo del equipo B buscando una sola cosa: un punto donde la salida podría publicarse sin que ninguna persona la haya revisado.',
  questions: [
    '¿Cuál es la entrada exacta de cada paso y de dónde sale?',
    '¿Qué fuente autoriza el fundamento en el paso de análisis?',
    '¿Dónde está el control humano y quién lo ejerce?',
    '¿Qué pasa si ese control no se hace? ¿El flujo se detiene o sigue?',
    '¿Qué queda registrado y dónde?',
  ],
  deliverable: 'Una observación concreta, escrita, sobre un punto del flujo. No una impresión general.',
} as const;
