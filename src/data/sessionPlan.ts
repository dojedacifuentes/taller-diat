// ─────────────────────────────────────────────────────────────────────────────
// RUN OF SHOW — reparto minuto a minuto de las tres sesiones.
//
// La propuesta académica («Taller Prompting 2026») fija objetivo, contenidos,
// producto y el horario 15:00–16:30. NO reparte los 90 minutos entre
// actividades: ese reparto es diseño instruccional del equipo ejecutor y vive
// aquí, en un único lugar, para que la web, los guiones, las presentaciones y
// los PDF no puedan contradecirse entre sí.
//
// Dos invariantes se verifican en tiempo de ejecución más abajo:
//   1. Cada sesión suma exactamente 90 minutos, sin huecos ni solapes.
//   2. Diego conduce ≈30 % y la facilitación estudiantil ≈70 %.
// ─────────────────────────────────────────────────────────────────────────────
import type { SessionPlan, RunBlock, BlockOwner } from '@/lib/types';

/** Minuto 0 del cronograma. Todas las horas mostradas se derivan de aquí. */
export const CLOCK_START = { hour: 15, minute: 0 } as const;

/** Convierte un minuto relativo (0–90) en hora de reloj («15:27»). */
export function clockAt(minute: number): string {
  const total = CLOCK_START.hour * 60 + CLOCK_START.minute + minute;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Etiqueta de rango de reloj para un bloque («15:27 – 15:35»). */
export function clockRange(block: Pick<RunBlock, 'from' | 'to'>): string {
  return `${clockAt(block.from)} – ${clockAt(block.to)}`;
}

export const ownerLabels: Record<BlockOwner, string> = {
  diego: 'Diego · Subdirección',
  relatores: 'Relatoría estudiantil',
  equipos: 'Equipos + facilitación',
};

/** Etiqueta corta para las notas del presentador y los guiones. */
export const ownerTags: Record<BlockOwner, string> = {
  diego: '[DIEGO]',
  relatores: '[RELATOR A / RELATOR B]',
  equipos: '[ACTIVIDAD]',
};

// ─────────────────────────────────────────────────────────────────────────────
// SESIÓN 1 · 27 de agosto — Del prompt aislado al razonamiento jurídico asistido
//
// CANON v1.0. Los diez bloques B00–B09, sus títulos, sus minutos y su secuencia
// provienen de DIAT_C1_CANON_03_MATRIZ_EJECUCION_v1.0 (15:00–16:30) y coinciden
// exactamente con src/content/class1/manifest.ts, que es lo que se ejecuta en
// /clase-1. No se reinterpretan aquí: si cambia el canon, cambia primero allí.
//
// Metodología: el profesor enmarca → el estudiante trabaja individualmente en
// plataforma → la plataforma guía y retroalimenta → el profesor interpreta y
// sintetiza. No hay trabajo en parejas ni en grupos.
//
// Sobre `owner`. La matriz reparte cada bloque en minutos docentes (D) y minutos
// de estudiante (E); aquí solo cabe un responsable por bloque, así que se marca
// quién lo conduce y el reparto D/E de la matriz queda anotado bloque a bloque.
// El resultado —32 minutos de conducción y 58 de trabajo del estudiante— es el
// reparto 35/65 de la Clase 1 fijado en el canon.
// ─────────────────────────────────────────────────────────────────────────────
const session1: SessionPlan = {
  sessionId: 1,
  spine:
    'Una buena instrucción mejora la pertinencia; una buena fuente mejora el fundamento; ninguna de las dos elimina el deber de verificar.',
  successCriterion:
    'Sé transformar una instrucción vaga en un prompt estructurado y verificar sus afirmaciones con el protocolo ICJR, dejando registro de qué comprobé, contra qué fuente y con qué resultado.',
  blocks: [
    {
      // D 4 / E 3
      from: 0, to: 7,
      title: 'B00 · Una cita perfecta que no existe',
      owner: 'diego', mode: 'Actividad',
      detail:
        'Regla de aula sobre datos, que el profesor cumple en pantalla, y ficha bibliográfica falsa proyectada: cinco segundos de silencio y «¿hay algo aquí que les parezca sospechoso?». Cada estudiante decide en plataforma quién falló y declara su nivel de confianza. La respuesta queda registrada para recuperarla en B09.',
      needs: ['Slides 01–05', 'Ficha bibliográfica falsa', 'Proyector'],
      tool: '/clase-1',
    },
    {
      // D 5.5 / E 4.5
      from: 7, to: 17,
      title: 'B01 · Qué hace un modelo de lenguaje',
      owner: 'diego', mode: 'Exposición',
      detail:
        'Se revela el caso —Corte Suprema, Rol 23.322-2025— con la tabla de las cuatro resoluciones y la frase ancla. Tres distinciones: IA frente a IA generativa, el modelo no es el producto, y por qué varían las respuestas. Demostración de 60 segundos sin adjuntar nada: «¿cómo sabemos de dónde salió cada afirmación?». El estudiante explora el diagrama modelo/producto y resuelve dos comprobaciones.',
      needs: ['Slides 06–08', 'Herramienta de IA proyectada', 'Capturas de respaldo'],
      tool: '/clase-1',
    },
    {
      // D 1.5 / E 3.5
      from: 17, to: 22,
      title: 'B02 · Cinco mitos',
      owner: 'equipos', mode: 'Actividad',
      detail:
        'Consigna de los cinco mitos: «confirmen antes de ver la explicación; equivocarse aquí es gratis». Cada estudiante responde las cinco afirmaciones una a una y confirma antes del feedback. El profesor observa el ritmo del curso y cierra con el mito 3 y el patrón común a los cinco.',
      needs: ['Slide 09'],
      tool: '/clase-1',
    },
    {
      // D 6 / E 9
      from: 22, to: 37,
      title: 'B03 · Diagnóstico DIAT',
      owner: 'equipos', mode: 'Actividad',
      detail:
        'Los siete componentes se presentan como preguntas de diseño, no como casillas, junto con la proporcionalidad al riesgo y las siete instrucciones de control. Cada estudiante diagnostica en plataforma un prompt de riesgo medio: estado de los siete componentes y decisión implícita. Puesta en común de tres respuestas: «¿cuál eliminarían primero si escribieran el prompt en un ascensor?».',
      needs: ['Slides 10–12'],
      tool: '/clase-1/prompt',
    },
    {
      // D 2 / E 8
      from: 37, to: 47,
      title: 'B04 · Prompt Lab · Producto A',
      owner: 'equipos', mode: 'Laboratorio',
      detail:
        'Consigna del Producto A: «no lo hagan más largo: háganlo menos ambiguo». Cada estudiante construye su encargo en el Prompt Lab —tarea, riesgo, decisiones que no delega, componentes pertinentes, prompt y tres justificaciones—. El profesor circula con intervenciones tipo, ninguna explicativa, y solo al final se revela el Prompt DIAT de referencia, que no lleva Rol.',
      needs: ['Slides 13–14', 'Documento de trabajo de la sesión'],
      tool: '/clase-1/prompt',
    },
    {
      // D 3 / E 5
      from: 47, to: 55,
      title: 'B05 · Metaprompting',
      owner: 'equipos', mode: 'Laboratorio',
      detail:
        'Tres modalidades de metaprompting y el orden no negociable; se señalan solo las dos líneas que hacen la diferencia, sin leer el metaprompt entero. Cada estudiante lo copia junto a su Producto A, lo ejecuta en su propia herramienta, vuelve y registra una sugerencia aceptada y una rechazada. Cinco límites y la regla: auditar no es verificar.',
      needs: ['Slides 15–16', 'Herramienta de IA propia', 'Regla de aula sobre datos'],
      tool: '/clase-1/auditoria',
    },
    {
      // D 5 / E 5
      from: 55, to: 65,
      title: 'B06 · Error Lab',
      owner: 'diego', mode: 'Actividad',
      detail:
        'Definición funcional de alucinación y los cuatro tipos de error jurídico generativo, con el tipo 2 —fuente real, proposición falsa— como núcleo. El estudiante clasifica cinco casos y atraviesa la revelación progresiva del tipo 2. Síntesis: tipo 2 frente a tipo 4, las siete señales de alerta, las tres fuentes de deber y la regla de la segunda IA.',
      needs: ['Slides 17–19'],
      tool: '/clase-1/verificacion',
    },
    {
      // D 4 / E 6 — la demostración cuenta como tiempo de estudiante: decide en
      // plataforma mientras ocurre.
      from: 65, to: 75,
      title: 'B07 · Grounding Lab',
      owner: 'equipos', mode: 'Demostración',
      detail:
        'Tres modos de trabajo y qué es grounding, dicho antes de la demostración: procedencia ≠ interpretación. Demostración principal en seis movimientos sobre corpus cerrado —el movimiento 5 no se sacrifica nunca— mientras el estudiante decide en plataforma si un localizador que abre basta para dar por verificada una conclusión, y confirma dos decisiones guiadas. Cierre: confidencialidad en 90 segundos, Ley 21.719 y estado del Boletín 16821-19.',
      needs: ['Slides 20–24', 'Corpus cerrado', 'Documento de trabajo de la sesión', 'Capturas de respaldo'],
      tool: '/clase-1/verificacion',
    },
    {
      // D 2 / E 8
      from: 75, to: 85,
      title: 'B08 · ICJR Studio · Producto B',
      owner: 'equipos', mode: 'Laboratorio',
      detail:
        'ICJR en cuatro operaciones, con una fila resuelta proyectada: control ex ante, ICJR ex post. Cada estudiante ejecuta el protocolo sobre dos afirmaciones —estatus, fuente, localizador, estado y acción— mientras el profesor circula con una sola pregunta: «¿leíste el considerando o solo comprobaste que existe?». Se recogen dos o tres cifras de cuánto tardaron en verificar la primera.',
      needs: ['Slides 25–27', 'Documento de trabajo de la sesión'],
      tool: '/clase-1/verificacion',
    },
    {
      // D 2 / E 3
      from: 85, to: 90,
      title: 'B09 · Cierre en espejo · Producto C',
      owner: 'diego', mode: 'Cierre',
      detail:
        '«Volvamos a la primera pregunta de la clase»: votación en espejo y la plataforma muestra el antes y el ahora. Respuesta integrada —las cinco cosas son verdad al mismo tiempo y la quinta no se distribuye—, consigna del Producto C y cierre de la Bitácora, y las tres reglas para salir de la sala.',
      needs: ['Slides 28–30'],
      tool: '/clase-1/cierre',
    },
  ],
  contingencies: [
    {
      when: 'Falla la conexión a internet',
      then: 'Se usan las capturas de respaldo previstas para B01 y B07. La plataforma guarda el trabajo en el dispositivo, de modo que B00, B02, B03, B04, B08 y B09 siguen funcionando y sincronizan después.',
    },
    {
      when: 'La plataforma no carga',
      then: 'Plan B en papel para B04 y B08 —el Producto A y el Producto B se escriben a mano— y B02, B03, B06 y B07 se resuelven en voz alta con el curso. Se pierde la evidencia individual registrada; la clase avanza igual.',
    },
    {
      when: 'La clase se atrasa',
      then: 'Se poda en este orden exacto: 1) la comparación conceptual de Proyectos, Gems y Claude en B07, ya prevista como ficha de plataforma; 2) el caso comparado de B06, que el Documento Maestro marca como opcional; 3) la exposición de los siete componentes en B03, de 3 a 2 minutos; 4) la demostración en vivo de B07, sustituida por capturas, narrando igual el movimiento 5.',
    },
    {
      when: 'Hay que recortar todavía más',
      then: 'Nunca se corta: el movimiento 5 de la demostración, el protocolo ICJR y el Producto B, el flujo completo de seis pasos, la regla «fluidez ≠ verdad» y el cierre en espejo con las tres reglas.',
    },
    {
      when: 'Un estudiante llega sin dispositivo',
      then: 'Trabaja sobre el Manual del Estudiante v2.0, que reserva espacio de registro para los tres productos, y traspasa sus respuestas a la plataforma al terminar. La secuencia individual se conserva: no se le empareja con nadie.',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// SESIÓN 2 · 3 de septiembre — Del prompt al flujo verificable
// ─────────────────────────────────────────────────────────────────────────────
const session2: SessionPlan = {
  sessionId: 2,
  spine: 'No se trata de preguntarle todo a la IA de una vez. Se trata de organizar el trabajo en pasos que puedan revisarse.',
  successCriterion: 'Sé dividir un trabajo en etapas con fuentes y revisión humana.',
  blocks: [
    {
      from: 0, to: 5,
      title: 'Recuperación activa',
      owner: 'diego', mode: 'Exposición',
      detail:
        'Se proyecta un prompt real de la sesión anterior y se pregunta: ¿qué ocurre después de obtener la respuesta? Se recogen dos o tres respuestas del grupo.',
      needs: ['Prompt de la sesión 1'],
    },
    {
      from: 5, to: 15,
      title: 'Prompt aislado frente a flujo',
      owner: 'diego', mode: 'Exposición',
      detail:
        'Ocho pasos en pantalla: identificar el problema, ordenar los hechos, identificar las preguntas jurídicas, identificar fuentes, analizar, verificar, redactar y revisar humanamente. Cada paso es revisable por separado.',
      needs: ['Presentación sesión 2'],
    },
    {
      from: 15, to: 23,
      title: 'Demostración en vivo del flujo',
      owner: 'diego', mode: 'Demostración',
      detail:
        'El caso troncal se recorre por etapas delimitadas. Se muestra deliberadamente un paso que sale mal y cómo el control humano lo detiene antes de la salida.',
      needs: ['Caso troncal CT-01', 'Herramienta de IA proyectada'],
    },
    {
      from: 23, to: 27,
      title: 'El canvas del flujo jurídico',
      owner: 'diego', mode: 'Exposición',
      detail:
        'Entrada → IA → Fuente → Control humano → Salida → Registro. Seis casillas, ninguna opcional. Se entrega la ficha 04.',
      needs: ['Ficha 04 · Canvas de flujo'],
      tool: '/flujo',
    },
    {
      from: 27, to: 37,
      title: 'Reconstrucción de un flujo defectuoso',
      owner: 'relatores', mode: 'Actividad',
      detail:
        'Cada equipo recibe los pasos de un flujo desordenado, con un control humano faltante y una fuente puesta después del análisis. Debe reordenarlos y justificar dos decisiones.',
      needs: ['Tarjetas de flujo desordenado'],
      tool: '/flujo',
    },
    {
      from: 37, to: 55,
      title: 'Laboratorio: mi problema como flujo',
      owner: 'equipos', mode: 'Laboratorio',
      detail:
        'Cada equipo convierte el problema con el que trabajó en la sesión 1 en un flujo de seis casillas, con al menos dos puntos de control humano explícitos.',
      needs: ['Computador por equipo', 'Ficha 04'],
      tool: '/flujo',
    },
    {
      from: 55, to: 67,
      title: 'Comparación crítica',
      owner: 'equipos', mode: 'Laboratorio',
      detail:
        'Se ejecuta el mismo paso del flujo en dos herramientas, dos configuraciones o dos variantes de instrucción. La pregunta no es cuál escribe mejor, sino cuál resulta más verificable y por qué.',
      needs: ['Dos herramientas o dos variantes de prompt'],
    },
    {
      from: 67, to: 78,
      title: 'Registro de validación',
      owner: 'equipos', mode: 'Laboratorio',
      detail:
        'Se completa el registro: fecha, herramienta, tarea, input, fuente, output, error, corrección, decisión humana y estado final. El registro es el entregable, no la respuesta.',
      needs: ['Ficha 05 · Registro de validación'],
      tool: '/flujo',
    },
    {
      from: 78, to: 86,
      title: 'Auditoría cruzada',
      owner: 'relatores', mode: 'Revisión',
      detail:
        'El equipo A audita el flujo del equipo B buscando una sola cosa: un punto donde la salida podría publicarse sin que nadie la haya revisado.',
      needs: ['Pauta de auditoría cruzada'],
    },
    {
      from: 86, to: 90,
      title: 'Cierre: el límite declarado',
      owner: 'equipos', mode: 'Cierre',
      detail:
        'Cada equipo escribe y lee en voz alta una frase: «Nuestra IA puede hacer X, pero no puede decidir Y sin revisión humana».',
      needs: ['Exit ticket sesión 2'],
    },
  ],
  contingencies: [
    {
      when: 'Solo hay una herramienta de IA disponible',
      then: 'La comparación se hace entre dos variantes de instrucción sobre la misma herramienta: una con fuentes acotadas y otra sin ellas. El aprendizaje —qué hace verificable a un resultado— se conserva íntegro.',
    },
    {
      when: 'No hay internet',
      then: 'Se usan los dos outputs precalculados del caso troncal (CT-01/R2-A y CT-01/R2-B) impresos en el PDF del laboratorio, y la comparación se hace sobre ellos.',
    },
    {
      when: 'Un equipo no llegó a la sesión 1',
      then: 'Se le asigna el caso troncal ya diagnosticado (ficha 10, sección «punto de partida») para que entre directamente en la construcción del flujo.',
    },
    {
      when: 'El laboratorio se atrasa',
      then: 'Se recorta la comparación crítica a 8 minutos y se conserva íntegro el registro de validación: el registro es el producto de la sesión.',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// SESIÓN 3 · 10 de septiembre — Match Making
// ─────────────────────────────────────────────────────────────────────────────
const session3: SessionPlan = {
  sessionId: 3,
  spine: 'El valor no está en que Derecho aprenda a programar, sino en que sepa explicar el problema con la precisión suficiente para que otra disciplina pueda resolverlo.',
  successCriterion:
    'Sé explicar un problema jurídico a otra disciplina, establecer límites y defender una solución.',
  blocks: [
    {
      from: 0, to: 8,
      title: 'Recapitulación: prompt → flujo → solución',
      owner: 'diego', mode: 'Exposición',
      detail:
        'Se recorre el arco de las tres sesiones y se presenta a los equipos invitados de otras disciplinas. Encuadre explícito: nadie viene a sustituir el criterio del otro.',
      needs: ['Presentación sesión 3'],
    },
    {
      from: 8, to: 17,
      title: 'Cómo se traduce un problema jurídico',
      owner: 'diego', mode: 'Exposición',
      detail:
        'Contraste directo: «quiero una IA que revise contratos» frente a una especificación con tarea, input, fuente autorizada, salida, incertidumbre y derivación a revisión humana. La diferencia es lo que hace posible el trabajo conjunto.',
      needs: ['Presentación sesión 3'],
    },
    {
      from: 17, to: 26,
      title: 'Ejemplo de desafío y canvas de Match Making',
      owner: 'diego', mode: 'Demostración',
      detail:
        'Se completa un desafío de ejemplo en los doce campos de la ficha, en pantalla, incluido el campo que más cuesta: lo que la solución NO debe hacer.',
      needs: ['Ficha 06 · Ficha de desafío'],
      tool: '/match',
    },
    {
      from: 26, to: 35,
      title: 'Match Making: formación de equipos',
      owner: 'relatores', mode: 'Actividad',
      detail:
        'Cada estudiante de Derecho presenta su problema en 45 segundos. Los equipos se forman por afinidad de problema, no por amistad. Cada equipo mixto queda con un canvas y un facilitador asignado.',
      needs: ['Tarjetas de problema', 'Cronómetro'],
      tool: '/match',
    },
    {
      from: 35, to: 53,
      title: 'Trabajo interdisciplinario',
      owner: 'equipos', mode: 'Laboratorio',
      detail:
        'Se completan los doce campos de la ficha de desafío. Regla de mesa: si Ingeniería no entiende el problema, el problema todavía no está bien enunciado.',
      needs: ['Ficha 06 impresa por equipo', 'Computador'],
      tool: '/match',
    },
    {
      from: 53, to: 63,
      title: 'Preparación del pitch',
      owner: 'equipos', mode: 'Laboratorio',
      detail:
        'Cuatro minutos, cuatro cosas: problema y persona usuaria, qué hace la solución, qué controles tiene, qué no debe hacer. Se ensaya una vez con el temporizador.',
      needs: ['Rúbrica de pitch', 'Pitch timer'],
      tool: '/match',
    },
    {
      from: 63, to: 87,
      title: 'Pitch de equipos',
      owner: 'equipos', mode: 'Actividad',
      detail:
        'Cuatro minutos por equipo, sin excepción. El formato de sala se decide por número de equipos (plenaria, dos estaciones o rondas paralelas con síntesis).',
      needs: ['Pitch timer', 'Rúbrica 07', 'Retroalimentación externa'],
      tool: '/match',
    },
    {
      from: 87, to: 89,
      title: 'Síntesis de los equipos',
      owner: 'equipos', mode: 'Cierre',
      detail:
        'Cada equipo entrega una frase: qué se llevan sobre trabajar con otra disciplina. Se aplica el instrumento de salida.',
      needs: ['Instrumento de salida'],
    },
    {
      from: 89, to: 90,
      title: 'Cierre del taller',
      owner: 'diego', mode: 'Cierre',
      detail:
        'Continuidad LMIL PUCV e Innova Day 2026 para los proyectos con mayor potencial, y cierre del arco de las tres sesiones.',
    },
  ],
  contingencies: [
    {
      when: 'No llegan estudiantes de Ingeniería u otras disciplinas',
      then: 'Match Making interno con roles simulados: en cada equipo, dos personas asumen el rol de «disciplina técnica» y solo pueden hacer preguntas, no proponer soluciones jurídicas. El ejercicio de traducción se conserva.',
    },
    {
      when: 'Llegan menos personas de otras disciplinas que de Derecho',
      then: 'Estaciones rotativas: cada persona de otra disciplina atiende dos equipos durante 9 minutos cada uno, con el canvas como guion de la conversación.',
    },
    {
      when: 'Llegan más personas de otras disciplinas que de Derecho',
      then: 'Equipos mixtos pequeños de cuatro, con dos problemas jurídicos por mesa y un solo pitch por mesa que elija el problema mejor especificado.',
    },
    {
      when: 'Hay hasta 6 equipos',
      then: 'Pitch en plenaria completa: 6 × 4 = 24 minutos, que es exactamente el bloque previsto.',
    },
    {
      when: 'Hay entre 7 y 12 equipos',
      then: 'Dos estaciones paralelas con un facilitador cada una; 6 pitches de 4 minutos por estación en el mismo bloque de 24 minutos.',
    },
    {
      when: 'Hay más de 12 equipos',
      then: 'Primera ronda en tres estaciones paralelas (8 minutos por estación para pitches de 4 minutos en dos turnos) y selección de tres proyectos por estación para una síntesis plenaria. El pitch individual sigue siendo de 4 minutos.',
    },
  ],
};

export const sessionPlans: SessionPlan[] = [session1, session2, session3];

export function planFor(sessionId: number): SessionPlan {
  const plan = sessionPlans.find(p => p.sessionId === sessionId);
  if (!plan) throw new Error(`No existe plan para la sesión ${sessionId}`);
  return plan;
}

// ─── Cómputo del 30/70 ───────────────────────────────────────────────────────
export interface OwnerSplit {
  minutes: Record<BlockOwner, number>;
  total: number;
  /** Minutos conducidos por Diego. */
  diego: number;
  /** Minutos de facilitación estudiantil (relatoría + trabajo de equipos). */
  facilitated: number;
  diegoPct: number;
  facilitatedPct: number;
}

export function splitFor(plan: SessionPlan): OwnerSplit {
  const minutes: Record<BlockOwner, number> = { diego: 0, relatores: 0, equipos: 0 };
  for (const b of plan.blocks) minutes[b.owner] += b.to - b.from;
  const total = minutes.diego + minutes.relatores + minutes.equipos;
  const facilitated = minutes.relatores + minutes.equipos;
  return {
    minutes,
    total,
    diego: minutes.diego,
    facilitated,
    diegoPct: Math.round((minutes.diego / total) * 1000) / 10,
    facilitatedPct: Math.round((facilitated / total) * 1000) / 10,
  };
}

export const splits = sessionPlans.map(splitFor);

// ─── Invariantes ─────────────────────────────────────────────────────────────
// Se comprueban al importar el módulo: si alguien edita un bloque y rompe la
// suma de 90 minutos, el error aparece en el build y no en la sala de clases.
for (const plan of sessionPlans) {
  const total = plan.blocks.reduce((sum, b) => sum + (b.to - b.from), 0);
  if (total !== 90) {
    throw new Error(
      `Sesión ${plan.sessionId}: el cronograma suma ${total} minutos y debe sumar exactamente 90.`,
    );
  }
  for (let i = 0; i < plan.blocks.length; i++) {
    const expectedStart = i === 0 ? 0 : plan.blocks[i - 1].to;
    if (plan.blocks[i].from !== expectedStart) {
      throw new Error(
        `Sesión ${plan.sessionId}: el bloque «${plan.blocks[i].title}» empieza en el minuto ${plan.blocks[i].from} y debería empezar en ${expectedStart}.`,
      );
    }
  }
}
