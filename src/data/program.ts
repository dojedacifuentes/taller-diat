// ─────────────────────────────────────────────────────────────────────────────
// FUENTE ÚNICA DE VERDAD — Taller de Prompting Jurídico 3.0 (DIAT PUCV, 2026)
//
// Todo el contenido de este archivo proviene de la propuesta académica oficial
// «Taller de Prompting 2026». Ningún dato debe agregarse aquí si no está en esa
// fuente. Landing, /modulos, /dossier, layout, TopBar, Sidebar, SiteFooter,
// FloatingCTA, countdown y los generadores de PDF leen desde aquí.
// ─────────────────────────────────────────────────────────────────────────────
import type { Session } from '@/lib/types';

// ─── Identidad ───────────────────────────────────────────────────────────────
export const identity = {
  name: 'Taller de Prompting Jurídico 3.0',
  shortName: 'Prompting Jurídico 3.0',
  tagline: 'De la pregunta jurídica al resultado verificable',
  edition: '2026',
  documentLabel: 'Propuesta académica 2026',
  /** Tesis editorial del rediseño. */
  thesis:
    'El foco ya no es escribir prompts más largos, sino diseñar procesos jurídicos útiles, verificables, trazables y responsables.',
  /** Idea central del enfoque pedagógico. */
  principle:
    'La IA se utiliza como apoyo al razonamiento jurídico, no como sustituto de la responsabilidad intelectual o profesional.',
} as const;

export const institution = {
  program: 'Programa DIAT PUCV',
  programLong: 'Programa de Derecho, Inteligencia Artificial y Tecnología — DIAT PUCV',
  faculty: 'Facultad y Escuela de Derecho PUCV',
  university: 'Pontificia Universidad Católica de Valparaíso',
  discipline: 'Derecho, inteligencia artificial y tecnología',
  city: 'Valparaíso, Chile',
} as const;

// ─── Fechas y horario ────────────────────────────────────────────────────────
export const schedule = {
  weekdayLabel: 'Tres jueves',
  time: '15:00–16:30 hrs.',
  startTime: '15:00',
  endTime: '16:30',
  sessionMinutes: 90,
  sessionDuration: '90 minutos',
  sessionDurationLong: '1 hora 30 minutos',
  totalDuration: '4,5 horas',
  sessionCount: 3,
  /** Línea corta para badges y barras. */
  datesShort: '27 AGO · 3 SEP · 10 SEP 2026',
  /** Línea completa para textos editoriales. */
  datesLong: '27 de agosto · 3 de septiembre · 10 de septiembre de 2026',
  /**
   * Inicio real del taller con offset explícito de Chile continental (UTC-4 en
   * agosto; el horario de verano comienza recién en septiembre). El offset
   * evita que la cuenta regresiva dependa de la zona horaria del navegador.
   */
  countdownTarget: '2026-08-27T15:00:00-04:00',
} as const;

// ─── Público, modalidad y metodología ────────────────────────────────────────
export const audience = {
  headline: 'Estudiantes de tercero, cuarto y quinto año de Derecho PUCV',
  detail:
    'Dirigido prioritariamente a estudiantes de tercero, cuarto y quinto año de Derecho PUCV.',
} as const;

export const modality = {
  items: ['Presencial', 'Práctica', 'Colaborativa', 'Cupos limitados', 'Uso de computador personal'],
  detail:
    'Modalidad presencial, práctica y colaborativa, con cupos limitados y uso de computador personal.',
} as const;

export const methodology = {
  ratio: { contents: 30, practice: 70, label: '30% contenidos · 70% práctica' },
  stages: [
    { label: 'Exposición breve', description: 'Marco conceptual acotado, sin relleno teórico.' },
    { label: 'Demostración en vivo', description: 'El flujo se muestra funcionando, con sus errores incluidos.' },
    { label: 'Trabajo aplicado', description: 'Cada participante avanza sobre su propio desafío.' },
    { label: 'Revisión crítica', description: 'Comparación de resultados y registro de decisiones.' },
  ],
  spine:
    'El aprendizaje se organiza sobre un mismo desafío que progresa durante las tres sesiones.',
  principles: [
    'Aprendizaje basado en problemas.',
    'Trabajo interdisciplinario y revisión entre pares.',
    'Comparación crítica de resultados, no competencia por el prompt más extenso.',
    'Registro de fuentes, errores, decisiones y correcciones.',
    'Uso exclusivo de casos simulados, anonimizados o expresamente autorizados.',
  ],
} as const;

// ─── Objetivo y resultados de aprendizaje ────────────────────────────────────
export const objective = {
  label: 'Objetivo general',
  text:
    'Desarrollar en estudiantes de Derecho competencias para diseñar, ejecutar y evaluar procesos jurídicos asistidos por inteligencia artificial generativa, resguardando la fundamentación jurídica, la verificación de fuentes, la confidencialidad, la trazabilidad y la supervisión humana.',
} as const;

export const learningOutcomes = [
  'Estructurar prompts jurídicos con contexto, propósito, restricciones, fuentes y formato de salida.',
  'Detectar respuestas infundadas, omisiones, sesgos y alucinaciones, aplicando un protocolo de verificación.',
  'Traducir un problema jurídico real en un flujo de trabajo interdisciplinario susceptible de prototipado.',
  'Comparar críticamente respuestas de distintas herramientas sin confundir fluidez con corrección jurídica.',
  'Presentar una solución jurídicamente fundada, útil para una persona usuaria y responsable en el tratamiento de datos.',
] as const;

// ─── Las tres sesiones ───────────────────────────────────────────────────────
export const sessions: Session[] = [
  {
    id: 1,
    label: 'Sesión 1',
    shortTitle: 'Razonamiento asistido',
    title: 'Del prompt aislado al razonamiento jurídico asistido',
    date: '2026-08-27',
    displayDate: 'Jueves 27 de agosto',
    displayDateShort: '27 AGO',
    time: schedule.time,
    duration: schedule.sessionDuration,
    purpose:
      'Comprender capacidades y límites de la IA generativa; construir prompts jurídicos; aplicar verificación y trazabilidad.',
    contents: [
      { title: 'Qué puede y qué no puede hacer un modelo de lenguaje.' },
      {
        title: 'Estructura DIAT de un prompt jurídico.',
        items: ['Contexto', 'Rol', 'Tarea', 'Fuentes', 'Restricciones', 'Formato', 'Control'],
      },
      { title: 'Alucinaciones, citas inexistentes y falsa seguridad lingüística.' },
      {
        title: 'Protocolo breve de verificación.',
        items: ['Identificar', 'Contrastar', 'Justificar', 'Registrar'],
      },
    ],
    practice: {
      label: 'Caso guiado',
      description:
        'Análisis inicial de un problema jurídico y contraste con fuentes proporcionadas.',
    },
    product: 'Prompt estructurado + matriz de verificación',
  },
  {
    id: 2,
    label: 'Sesión 2',
    shortTitle: 'Laboratorio jurídico',
    title: 'Laboratorio jurídico: del prompt al flujo verificable',
    date: '2026-09-03',
    displayDate: 'Jueves 3 de septiembre',
    displayDateShort: '3 SEP',
    time: schedule.time,
    duration: schedule.sessionDuration,
    purpose:
      'Probar y comparar un flujo jurídico asistido por IA, aplicando fuentes y supervisión humana.',
    contents: [
      { title: 'Prompting encadenado y revisión iterativa.' },
      { title: 'Comparación de resultados entre herramientas o configuraciones.' },
      {
        title: 'Evaluación del resultado.',
        items: ['Utilidad', 'Fundamento jurídico', 'Trazabilidad', 'Riesgos'],
      },
      {
        title: 'Diseño preliminar del flujo.',
        items: ['Entradas', 'Intervención de IA', 'Control humano', 'Salida'],
      },
    ],
    practice: {
      label: 'Laboratorio',
      description:
        'Cada participante o equipo prepara un flujo jurídico preliminar y registra sus fuentes, errores, decisiones y correcciones.',
    },
    product: 'Flujo preliminar + registro de validación',
  },
  {
    id: 3,
    label: 'Sesión 3',
    shortTitle: 'Match Making y cierre',
    title: 'Match Making: Derecho conversa con otras disciplinas',
    date: '2026-09-10',
    displayDate: 'Jueves 10 de septiembre',
    displayDateShort: '10 SEP',
    time: schedule.time,
    duration: schedule.sessionDuration,
    purpose:
      'Formar equipos interdisciplinarios, mejorar las soluciones y presentar el desafío trabajado.',
    contents: [
      { title: 'Presentación breve de los problemas jurídicos trabajados.' },
      { title: 'Formación de equipos interdisciplinarios.' },
      {
        title: 'Definición de la solución.',
        items: ['Usuario', 'Necesidad', 'Tarea', 'Riesgo', 'Resultado esperado'],
      },
      { title: 'Mejora de la solución y presentación final con retroalimentación experta.' },
    ],
    practice: {
      label: 'Cierre',
      description:
        'Cada equipo presenta su desafío ante el grupo y recibe retroalimentación experta.',
    },
    product: 'Ficha de desafío + pitch de 4 minutos',
    notes: [
      'No se utilizan datos personales ni información confidencial.',
      'Los proyectos con mayor potencial podrán vincularse con actividades del LMIL PUCV e Innova Day 2026.',
    ],
  },
];

// ─── Desafío final y evaluación ──────────────────────────────────────────────
export const finalChallenge = {
  headline: 'Un flujo jurídico asistido por IA, demostrable y documentado.',
  components: [
    'Problema',
    'Secuencia de instrucciones',
    'Fuentes utilizadas',
    'Controles humanos',
    'Riesgos identificados',
    'Reflexión sobre los límites de la automatización',
  ],
} as const;

/** Criterios oficiales de evaluación. La suma debe ser 100. */
export const evaluation = [
  { weight: 20, criterion: 'Relevancia y definición del problema jurídico' },
  { weight: 20, criterion: 'Calidad del flujo y de los prompts' },
  { weight: 25, criterion: 'Fundamentación y verificación de fuentes' },
  { weight: 15, criterion: 'Utilidad para la persona usuaria' },
  { weight: 10, criterion: 'Ética, privacidad y supervisión humana' },
  { weight: 10, criterion: 'Claridad de la demostración final' },
] as const;

export const evaluationTotal = evaluation.reduce((sum, c) => sum + c.weight, 0);

// ─── Organización, continuidad e indicadores ─────────────────────────────────
export const organization = [
  { entity: 'Facultad y Escuela de Derecho PUCV', role: 'Marco institucional del taller.' },
  {
    entity: 'Programa de Derecho, Inteligencia Artificial y Tecnología — DIAT PUCV',
    role: 'Diseño y ejecución académica.',
  },
  {
    entity: 'Legal Management Innovation Lab — LMIL PUCV',
    role: 'Continuidad y acompañamiento de proyectos.',
  },
  {
    entity: 'Facultad de Ingeniería PUCV y otras unidades invitadas',
    role: 'Participación en la sesión de Match Making.',
  },
  {
    entity: 'Profesional externo/a',
    role: 'Retroalimentación experta en la sesión final.',
  },
] as const;

export const indicators = [
  'Inscritos',
  'Asistencia efectiva',
  'Tasa de finalización',
  'Número de equipos interdisciplinarios formados',
  'Porcentaje de proyectos que documenta fuentes y controles de verificación',
  'Evaluación de entrada y salida sobre uso crítico de IA',
  'Proyectos derivados a acompañamiento LMIL o Innova Day 2026',
] as const;

// ─── Antecedentes 2025 y evolución 2026 ──────────────────────────────────────
export const background = {
  previous: {
    title: 'Taller 2025',
    text:
      'La versión 2025 del taller fue organizada por el Programa DIAT PUCV con apoyo institucional de la Facultad y Escuela de Derecho y Vinculación con el Medio PUCV. Según el Anuario 2025, reunió a cerca de 90 participantes en tres jornadas formativas.',
    scope:
      'Abordó fundamentos de machine learning, prompting jurídico, configuraciones avanzadas, experimentación con modelos de lenguaje y una clase magistral profesional.',
  },
  evolution: {
    title: 'Evolución 2026',
    text:
      'La propuesta 2026 conserva el formato de tres sesiones, pero introduce una progresión más exigente.',
    steps: ['Comprensión crítica', 'Diseño interdisciplinario', 'Aplicación jurídica verificable'],
  },
} as const;

export const sources = [
  {
    label:
      'Facultad y Escuela de Derecho PUCV, «Laboratorio de Innovación Legal y Programa de Derecho e Inteligencia Artificial se adjudican Fondos Concursables…», 11 de agosto de 2025.',
    url: 'https://www.pucv.cl/uuaa/derecho-pucv/noticias/laboratorio-de-innovacion-legal-y-programa-de-derecho-e-inteligencia',
  },
  {
    label:
      'Programa DIAT PUCV, «Programa DIAT se adjudica fondos para taller de Prompting Jurídico 2.0», 11 de septiembre de 2025.',
    url: 'https://www.diatpucv.cl/boletin-de-noticas/programa-diat-se-adjudica-fondos-para-taller-de-prompting-juridico-2-0/',
  },
  {
    label: 'Anuario Facultad y Escuela de Derecho PUCV 2025, publicado en 2026.',
    url: 'https://www.pucv.cl/uuaa/site/docs/20260303/20260303153438/derecho_2026_justificado_03_06.pdf',
  },
  {
    label: 'Programa DIAT PUCV, misión y visión institucional.',
    url: 'https://www.diatpucv.cl/nosotros/',
  },
] as const;

// ─── Inscripción, contacto y CTA ─────────────────────────────────────────────
export const contact = {
  email: 'programadiat@pucv.cl',
} as const;

export const registration = {
  statusLabel: 'PRÓXIMAMENTE',
  note: 'Cupos limitados',
  ctaPrimary: 'Reservar cupo',
  ctaSecondary: 'Ver las 3 sesiones',
} as const;

const EMAIL_SUBJECT = `Interés / inscripción — ${identity.name} DIAT PUCV`;

const EMAIL_BODY = `Hola Programa DIAT:

Quisiera participar en el ${identity.name} (${schedule.datesLong}, ${schedule.time}).

Nombre:
Carrera:
Año que cursa:
Correo:
Comentarios:

Muchas gracias.`;

export const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(
  EMAIL_SUBJECT,
)}&body=${encodeURIComponent(EMAIL_BODY)}`;

export const gmailCompose = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(
  contact.email,
)}&su=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`;

// ─── SEO ─────────────────────────────────────────────────────────────────────
export const seo = {
  title: `${identity.name} — DIAT PUCV`,
  description:
    'Taller práctico de IA generativa aplicada al Derecho: prompting jurídico, verificación de fuentes, trazabilidad y diseño de flujos jurídicos responsables. DIAT PUCV, agosto-septiembre 2026.',
} as const;

// ─── Recursos complementarios de la plataforma ───────────────────────────────
// No forman parte del programa académico de las tres sesiones.
export const complementaryResources = [
  {
    href: '/prompt-lab',
    label: 'Prompt Lab',
    description: 'Constructor guiado de prompts jurídicos estructurados.',
  },
  {
    href: '/flashcards',
    label: 'Flashcards',
    description: 'Repaso de vocabulario y conceptos de IA aplicada al Derecho.',
  },
  {
    href: '/toolkit',
    label: 'Toolkit',
    description: 'Guías rápidas y comparación de herramientas de IA generativa.',
  },
  {
    href: '/herramientas',
    label: 'Herramientas',
    description: 'Catálogo de referencia de plataformas de IA.',
  },
] as const;

export const complementaryNotice =
  'Recursos complementarios de la plataforma. No son contenidos obligatorios de las tres sesiones.';
