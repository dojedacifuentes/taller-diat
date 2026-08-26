// ─────────────────────────────────────────────────────────────────────────────
// CLASE 1 · DECK · arquitectura de las 30 diapositivas
//
// Capa de PROYECCIÓN. No contiene contenido pedagógico propio: describe qué
// diapositiva acompaña a qué bloque, qué función cumple en la pantalla
// colectiva y qué estado de clase comunica. Todo lo que se enseña vive en
// `activities.ts`, `prompts.ts` y `manifest.ts`, y el generador del PPTX lo
// importa desde allí.
//
// Deriva de:
//   · DIAT_C1_CANON_02_MATRIZ_CANONICA_v1.0        (conceptos y redacciones)
//   · DIAT_C1_CANON_03_MATRIZ_EJECUCION_v1.0       (minuto a minuto)
//   · DIAT_C1_CANON_04_GUION_DOCENTE_v2.0          (conducción y marcas [SLIDE NN])
//   · DIAT_C1_CANON_05_PPT_ESPECIFICACION_v2.0     (veredicto por diapositiva)
//
// Regla editorial que gobierna todo el deck (Especificación v2.0):
//   Si el profesor necesita decirlo        → Guion. No va a la diapositiva.
//   Si el estudiante necesita verlo        → Diapositiva.
//   Si el estudiante necesita decidirlo    → Plataforma. La diapositiva indica cuándo.
//   Si el estudiante necesita conservarlo  → Manual.
// ─────────────────────────────────────────────────────────────────────────────

import {
  BLOCKS,
  getBlock,
  type BlockId,
  type Class1Block,
} from './manifest';
import { getStage, type StageId } from './stages';
import { RUN_OF_SHOW, clockAt, segmentClock, segmentOf, segmentOfSlide, runOfShowErrors } from './runofshow';
import { class1ActivityDurations } from './timers';

/**
 * Función de la diapositiva en la pantalla colectiva. Una diapositiva cumple
 * UNA. Si intenta cumplir cuatro, está mal diseñada.
 */
export type SlideFunction =
  /** Una idea. Ocupa la pantalla entera. */
  | 'ANCLA'
  /** Una relación entre elementos. */
  | 'DIAGRAMA'
  /** Evidencia: un caso, una tabla de hechos, una cita real. */
  | 'CASO'
  /** Qué debe hacer el estudiante, y dónde. */
  | 'CONSIGNA'
  /** Qué debe observar el estudiante mientras el profesor opera. */
  | 'DEMOSTRACION'
  /** Qué queda aprendido. */
  | 'SINTESIS';

/**
 * Estado de clase. Es lo que el deck comunica sin que el profesor lo diga:
 * quién tiene la palabra en este momento.
 */
export type ClassState =
  /** Conduce el profesor. El estudiante escucha. */
  | 'ESCUCHAS'
  /** El estudiante trabaja en /clase-1. El profesor circula y calla. */
  | 'TRABAJAS'
  /** Demostración en pantalla: el estudiante observa y decide a la vez. */
  | 'OBSERVAS';

/** Veredicto respecto del deck de 30 diapositivas anterior. */
export type SlideVerdict = 'CONSERVAR' | 'AJUSTAR' | 'RECONSTRUIR';

/** Fondo canónico de la diapositiva, heredado del deck v1. */
export type SlideSurface = 'PAPEL' | 'TINTA' | 'CARMESI' | 'NOCHE';

export interface Class1Slide {
  /** 01–30. Coincide con la marca [SLIDE NN] del Guion. */
  n: number;
  /** Bloque al que pertenece. */
  block: BlockId;
  /** Título canónico proyectado. */
  title: string;
  /** Línea superior corta. Ubica al espectador sin explicar. */
  kicker: string;
  fn: SlideFunction;
  state: ClassState;
  surface: SlideSurface;
  /** Momento de proyección según la Matriz de ejecución. Puede ser doble. */
  at: string;
  /** Minutos aproximados en pantalla. */
  minutes: number;
  /** Objetivo cognitivo: qué debe quedar en la cabeza al mirar esto. */
  cognitive: string;
  /** Qué ve el estudiante. Una frase. */
  sees: string;
  /** Qué hace el docente mientras esto está proyectado. */
  teacher: string;
  /** Qué hace el estudiante. */
  student: string;
  /**
   * Etapa de la plataforma que abre la franja «▸ …», si la hay.
   *
   * La plataforma dejó de organizarse en bloques: cinco diapositivas llaman a
   * cinco etapas de ejecución, y ninguna otra manda al estudiante al teléfono.
   */
  opens?: StageId;
  /** Etiqueta larga de la llamada. */
  opensLabel?: string;
  /** Producto que depende de esta diapositiva. */
  dependency?: string;
  /** Procedencia canónica del contenido proyectado. */
  source: string;
  verdict: SlideVerdict;
  /** Qué cambió respecto del deck v1, en una línea. */
  change: string;
  /** Clave de composición. El generador tiene una función por clave. */
  layout: string;
}

export const SLIDES: readonly Class1Slide[] = [
  {
    n: 1,
    block: 'b00',
    title: 'Del prompt aislado al razonamiento jurídico asistido',
    kicker: 'Taller de IA y Prompting Jurídico · Clase 1',
    fn: 'CONSIGNA',
    state: 'ESCUCHAS',
    surface: 'NOCHE',
    at: '15:00',
    minutes: 1,
    cognitive: 'Saber dónde está la clase y entrar a ella antes de que empiece el contenido.',
    sees: 'Portada, datos de la sesión y el QR de /clase-1 desde el minuto cero.',
    teacher: 'Bienvenida y regla de aula sobre datos. La cumple en pantalla.',
    student: 'Abre /clase-1 en su dispositivo y la deja abierta.',
    opens: 'pregunta',
    opensLabel: 'ABRE /clase-1 · déjala abierta',
    source: 'Matriz canónica §1 y §12 · Guion B00',
    verdict: 'AJUSTAR',
    change: 'QR y URL a /clase-1 visibles desde el minuto 0. Modalidad canónica en el subtítulo.',
    layout: 'cover',
  },
  {
    n: 2,
    block: 'b00',
    title: 'Una cita perfecta. Un problema: no existe',
    kicker: 'B00 · El problema profesional',
    fn: 'CASO',
    state: 'ESCUCHAS',
    surface: 'PAPEL',
    at: '15:01',
    minutes: 1,
    cognitive: 'Comprobar en carne propia que la plausibilidad formal no es un indicio de existencia.',
    sees: 'Una ficha bibliográfica maquetada. Nada más. La sanción todavía no aparece.',
    teacher: '«Miren esto cinco segundos.» Después: «¿hay algo que les parezca sospechoso?».',
    student: 'Mira. No decide todavía.',
    source: 'activities.ts → fakeCitation · Matriz canónica §8 tipo 1',
    verdict: 'RECONSTRUIR',
    change:
      'Autor real sustituido por el marcador [APELLIDO, Nombre]. Retirado el bloque «Sanción Disciplinaria», que revelaba el desenlace antes de la votación.',
    layout: 'citation',
  },
  {
    n: 3,
    block: 'b00',
    title: '¿Quién falló?',
    kicker: 'Decisión individual',
    fn: 'CONSIGNA',
    state: 'TRABAJAS',
    surface: 'PAPEL',
    at: '15:02 · 16:22',
    minutes: 3,
    cognitive: 'Comprometerse con una respuesta antes de tener la información que la matizará.',
    sees: 'La pregunta y las cinco opciones. Sin pistas y sin respuesta correcta señalada.',
    teacher: 'Lanza la pregunta y calla. Circula. No adelanta nada.',
    student: 'Elige una opción, declara su nivel de confianza y confirma. No se puede editar.',
    opens: 'pregunta',
    // Se proyecta dos veces. A las 15:02 la pregunta se responde en la entrada
    // de la plataforma; a las 16:22, en el cierre, que la repite con la
    // comparación al lado. La franja lo dice para que nadie tenga que recordarlo.
    opensLabel: 'ABRE /clase-1 · A LAS 16:22, /clase-1/cierre',
    dependency: 'Registro inicial · se recupera en el cierre',
    source: 'activities.ts → blameQuestion, blameOptions, confidenceLevels',
    verdict: 'AJUSTAR',
    change:
      'La llamada apunta a la etapa de entrada de la plataforma, no a un bloque. Se proyecta dos veces; en la segunda no cambia nada.',
    layout: 'question',
  },
  {
    n: 4,
    block: 'b00',
    title: 'Cuatro tribunales, siete meses, 2026',
    kicker: 'B00 · Línea disciplinaria chilena',
    fn: 'CASO',
    state: 'ESCUCHAS',
    surface: 'PAPEL',
    at: '15:05',
    minutes: 2,
    cognitive: 'Entender que no es un caso desafortunado sino un estándar formándose.',
    sees: 'Cuatro resoluciones con rol, fecha, sanción y si la resolución atribuye el hecho a IA.',
    teacher: 'Recorre la tabla. Cierra con «la sanción no recayó sobre la herramienta».',
    student: 'Escucha. Ya votó.',
    source: 'activities.ts → disciplinaryLine · Matriz canónica §9',
    verdict: 'RECONSTRUIR',
    change:
      'TDLC: «Amonestación» → 1 UTM. Añadida la columna de rol en las cuatro filas, la equivalencia ≈ $69.751 y la precisión de que el Tribunal Constitucional no menciona IA.',
    layout: 'courts',
  },
  {
    n: 5,
    block: 'b00',
    title: 'Prompt → Respuesta no basta',
    kicker: 'B00 · Flujo canónico',
    fn: 'DIAGRAMA',
    state: 'ESCUCHAS',
    surface: 'PAPEL',
    at: '15:06',
    minutes: 1,
    cognitive: 'Sustituir el esquema de dos casillas por uno de seis pasos con decisión humana al final.',
    sees: 'El esquema de dos casillas tachado y, debajo, el flujo completo.',
    teacher: 'Explica el flujo. «El razonamiento sigue siendo nuestro.»',
    student: 'Escucha.',
    source: 'manifest.ts → class1Meta.flow · Matriz canónica §4',
    verdict: 'CONSERVAR',
    change: 'Sin cambios de contenido. Recompuesto con texto nativo.',
    layout: 'flow',
  },
  {
    n: 6,
    block: 'b01',
    title: 'Qué hace un modelo de lenguaje',
    kicker: 'B01 · Modelo mental mínimo',
    fn: 'DIAGRAMA',
    state: 'ESCUCHAS',
    surface: 'PAPEL',
    at: '15:08 · 15:15',
    minutes: 3,
    cognitive: 'Cambiar «consulta un registro de verdad» por «genera una continuación probable».',
    sees: 'El mecanismo generativo y cuatro capacidades emparejadas con cuatro límites.',
    teacher: 'Primera y segunda distinción. Después comenta el patrón: no las lee.',
    student: 'Escucha. Entre las dos proyecciones trabaja en B01.',
    source: 'activities.ts → modelCore, capabilities',
    verdict: 'CONSERVAR',
    change: 'Sin cambios de contenido. Recompuesto con texto nativo.',
    layout: 'capabilities',
  },
  {
    n: 7,
    block: 'b01',
    title: 'El modelo no es el producto',
    kicker: 'B01 · Arquitectura del sistema',
    fn: 'DIAGRAMA',
    state: 'ESCUCHAS',
    surface: 'PAPEL',
    at: '15:10',
    minutes: 1,
    cognitive: 'Distinguir el fallo del modelo del fallo de la herramienta que lo envuelve.',
    sees: 'El modelo al centro y las capas del producto alrededor.',
    teacher: '«Ustedes nunca abren un modelo: abren un producto.»',
    student: 'Escucha; explorará el diagrama completo en B01.',
    source: 'activities.ts → modelCore, productLayers',
    verdict: 'CONSERVAR',
    change: 'Sin cambios de contenido. Recompuesto con texto nativo.',
    layout: 'product',
  },
  {
    n: 8,
    block: 'b01',
    title: 'FLUIDEZ ≠ VERDAD',
    kicker: 'B01 · Frase ancla',
    fn: 'ANCLA',
    state: 'ESCUCHAS',
    surface: 'TINTA',
    at: '15:16',
    minutes: 1,
    cognitive: 'Separar la calidad de la redacción de la calidad de la evidencia.',
    sees: 'Una frase. Nada más.',
    teacher: 'Cierra el bloque.',
    student: 'Escucha.',
    source: 'manifest.ts → class1Meta.anchors[0]',
    verdict: 'CONSERVAR',
    change: 'Sin cambios.',
    layout: 'anchor',
  },
  {
    n: 9,
    block: 'b02',
    title: 'Cinco mitos',
    kicker: 'Desmontaje de intuiciones',
    fn: 'CONSIGNA',
    state: 'ESCUCHAS',
    surface: 'PAPEL',
    at: '15:18',
    minutes: 4,
    cognitive: 'Comprometerse con cinco respuestas antes de escuchar la explicación.',
    sees: 'Las cinco afirmaciones. Sin respuestas.',
    teacher:
      'Lee cada afirmación, deja diez segundos de silencio para que cada uno decida, y recién entonces explica. Cierra con el mito 3 y el patrón común.',
    student: 'Decide en silencio, para sí mismo, antes de oír la explicación. No toca el teléfono.',
    source: 'activities.ts → myths (solo el enunciado)',
    verdict: 'AJUSTAR',
    change:
      'Los cinco mitos vuelven a la sala y los explica el profesor. Se conserva lo que los hacía útiles —decidir antes de escuchar— con diez segundos de silencio por afirmación, no con una votación pública.',
    layout: 'myths',
  },
  {
    n: 10,
    block: 'b03',
    title: 'Las siete preguntas de diseño',
    kicker: 'B03 · Modelo DIAT',
    fn: 'DIAGRAMA',
    state: 'ESCUCHAS',
    surface: 'PAPEL',
    at: '15:22',
    minutes: 1,
    cognitive: 'Ver los siete componentes como un circuito y entender por qué DIAT añade dos.',
    sees: 'Los siete componentes, con Fuentes y Control marcados como aporte propio del programa.',
    teacher: 'Explica por qué las guías generalistas no incorporan fuentes ni control.',
    student: 'Escucha.',
    source: 'activities.ts → diatComponents (signature)',
    verdict: 'AJUSTAR',
    change:
      'Título alineado al canon. Barrido de «capas» y de «estructura»: la denominación es componentes / preguntas de diseño.',
    layout: 'diat',
  },
  {
    n: 11,
    block: 'b03',
    title: 'Son preguntas de diseño, no casillas',
    kicker: 'Diagnóstico en voz alta',
    fn: 'CONSIGNA',
    state: 'ESCUCHAS',
    surface: 'PAPEL',
    at: '15:24',
    minutes: 3,
    cognitive: 'Diagnosticar sin plantilla: saber cuál componente falta y hace daño, y cuál falta y da igual.',
    sees: 'Las siete preguntas, sin etiquetas y sin explicación, junto al prompt de riesgo medio.',
    teacher:
      'Proyecta el prompt de diagnóstico y lo desarma con el curso en voz alta: qué componente falta y si hace daño.',
    student: 'Responde en voz alta. El diagnóstico lo hará después sobre su propio encargo.',
    dependency: 'Insumo del Prompt V1',
    source: 'activities.ts → diatComponents.question · diagnosisPrompt',
    verdict: 'AJUSTAR',
    change:
      'El diagnóstico deja de ser un ejercicio de plataforma y pasa a hacerse con el curso: el estudiante diagnostica cuando construye su propio prompt, no antes sobre uno ajeno.',
    layout: 'questions',
  },
  {
    n: 12,
    block: 'b03',
    title: 'No todos los prompts necesitan todo',
    kicker: 'B03 · Proporcionalidad al riesgo',
    fn: 'DIAGRAMA',
    state: 'ESCUCHAS',
    surface: 'PAPEL',
    at: '15:26',
    minutes: 3,
    cognitive: 'Instalar la regla que evita que los siete componentes se conviertan en ritual.',
    sees: 'Tres niveles de riesgo con sus ejemplos y la estructura que cada uno pide.',
    teacher: 'Enuncia la regla. «Agregarle componentes a un prompt de riesgo bajo lo empeora.»',
    student: 'Escucha.',
    source: 'activities.ts → riskLevels · Matriz canónica §5',
    verdict: 'CONSERVAR',
    change: 'Título alineado al canon. Contenido sin cambios.',
    layout: 'risk',
  },
  {
    n: 13,
    block: 'b04',
    title: 'De «Analiza esta sentencia» a un encargo controlable',
    kicker: 'Prompt Lab',
    fn: 'CONSIGNA',
    state: 'TRABAJAS',
    surface: 'PAPEL',
    at: '15:28',
    minutes: 16,
    cognitive: 'Ver cuántas decisiones se delegan en una instrucción que parece razonable.',
    sees: 'El Prompt 0 y las seis decisiones que el sistema acaba de tomar por nosotros.',
    teacher: 'Da la consigna y calla. No muestra todavía el prompt de referencia.',
    student: 'Construye su encargo apretando botones y pega su propio material. Catorce minutos.',
    opens: 'prompt',
    opensLabel: 'ABRE /clase-1/prompt · CONSTRUYE TU PROMPT',
    dependency: 'Prompt V1',
    source: 'prompts.ts → PROMPT_DIAGNOSTICO · activities.ts → promptLabSteps.stopsDeciding',
    verdict: 'AJUSTAR',
    change:
      'El bloque central de la clase: de 7 a 14 minutos de plataforma. Absorbe el diagnóstico que antes era un ejercicio aparte, y el prompt que sale se pega en una IA y se ejecuta sin retoques.',
    layout: 'prompt0',
  },
  {
    n: 14,
    block: 'b04',
    title: 'Lo que decidía la IA · lo que decidimos nosotros',
    kicker: 'B04 · Prompt DIAT de referencia',
    fn: 'SINTESIS',
    state: 'ESCUCHAS',
    surface: 'PAPEL',
    at: '15:42',
    minutes: 2,
    cognitive: 'Comprobar que un prompt de referencia funciona sin Rol: los siete nunca fueron obligatorios.',
    sees: 'Las seis decisiones recuperadas y el Prompt DIAT de referencia completo.',
    teacher: 'Revela el prompt y señala la ausencia de rol. No lo lee en voz alta.',
    student: 'Compara con el suyo.',
    dependency: 'Producto A',
    source: 'prompts.ts → PROMPT_DIAT_REFERENCIA (carácter por carácter)',
    verdict: 'AJUSTAR',
    change:
      'Añadido el texto íntegro del Prompt DIAT de referencia, que no estaba en el deck y que el Guion manda proyectar aquí.',
    layout: 'reference',
  },
  {
    n: 15,
    block: 'b05',
    title: 'Metaprompting: auditar antes de ejecutar',
    kicker: 'Auditoría de instrucciones',
    fn: 'CONSIGNA',
    state: 'TRABAJAS',
    surface: 'PAPEL',
    at: '15:44',
    minutes: 11,
    cognitive: 'Distinguir auditor, entrevistador y generador, y aceptar el orden no negociable.',
    sees: 'Las tres modalidades con su riesgo y el metaprompt canónico, con dos líneas resaltadas.',
    teacher: 'Señala solo las dos líneas que hacen la diferencia. No lo lee entero.',
    student:
      'Copia el paquete —metaprompt más su propio prompt—, lo ejecuta en su herramienta y vuelve con una sugerencia aceptada y una rechazada.',
    opens: 'auditoria',
    opensLabel: 'ABRE /clase-1/auditoria · HAZ QUE LA IA LO AUDITE',
    dependency: 'Prompt V2 · auditado',
    source: 'activities.ts → metapromptModes · prompts.ts → METAPROMPT_AUDITORIA',
    verdict: 'AJUSTAR',
    change:
      'El botón copia el metaprompt con el prompt del estudiante ya pegado entre delimitadores: pegarlo en una IA basta para que la auditoría empiece.',
    layout: 'metaprompt',
  },
  {
    n: 16,
    block: 'b05',
    title: 'Metaprompting ≠ delegar el propósito',
    kicker: 'B05 · Cinco límites',
    fn: 'SINTESIS',
    state: 'ESCUCHAS',
    surface: 'PAPEL',
    at: '15:53',
    minutes: 2,
    cognitive: 'Saber qué no se delega nunca: objetivo, jerarquía de fuentes y apetito de riesgo.',
    sees: 'La regla de orden y los cinco límites.',
    teacher: 'Enuncia los cinco límites. Cierra con «auditar no es verificar».',
    student: 'Escucha.',
    source: 'activities.ts → metapromptLimits, metapromptGuidance',
    verdict: 'CONSERVAR',
    change: 'Sin cambios de contenido. Recompuesto con texto nativo.',
    layout: 'limits',
  },
  {
    n: 17,
    block: 'b06',
    title: 'Cómo falla una respuesta plausible',
    kicker: 'B06 · Cuatro errores jurídicos generativos',
    fn: 'DIAGRAMA',
    state: 'ESCUCHAS',
    surface: 'PAPEL',
    at: '15:55',
    minutes: 2,
    cognitive: 'Sustituir «la IA inventa cosas» por cuatro tipos que se detectan con operaciones distintas.',
    sees: 'Los cuatro tipos como tarjetas, con cómo se detecta cada uno.',
    teacher: 'Explica 1, 3 y 4. Deja el 2 para la siguiente.',
    student: 'Escucha.',
    source: 'activities.ts → errorTypes',
    verdict: 'CONSERVAR',
    change: 'Sin cambios de contenido. Recompuesto con texto nativo.',
    layout: 'errors',
  },
  {
    n: 18,
    block: 'b06',
    title: 'FUENTE REAL ≠ CONCLUSIÓN CORRECTA',
    kicker: 'Error tipo 2 · núcleo del bloque',
    fn: 'ANCLA',
    state: 'ESCUCHAS',
    surface: 'CARMESI',
    at: '15:57',
    minutes: 3,
    cognitive: 'Entender que el error tipo 2 sobrevive a la verificación superficial.',
    sees: 'La frase y una sola línea: que el rol exista no prueba que la sentencia lo sostenga.',
    teacher:
      'Núcleo del bloque. Revela el caso en pantalla, paso a paso, y contrasta el tipo 2 con el tipo 4.',
    student: 'Escucha. Va a encontrarse este error de verdad en la verificación de las 16:12.',
    source: 'activities.ts → errorTypes.tipo2 · frase ancla n.º 3',
    verdict: 'AJUSTAR',
    change:
      'La revelación progresiva vuelve a la pantalla del profesor: la plataforma dejó de clasificar casos ajenos y verifica una afirmación propia.',
    layout: 'anchor',
  },
  {
    n: 19,
    block: 'b06',
    title: 'Siete señales de alerta inmediata',
    kicker: 'B06 · Tarjeta de señales de alerta',
    fn: 'SINTESIS',
    state: 'ESCUCHAS',
    surface: 'PAPEL',
    at: '16:01',
    minutes: 2,
    cognitive: 'Reconocer que la séptima señal no apunta al sistema, sino a nosotros.',
    sees: 'Las siete señales, con la séptima destacada.',
    teacher: 'Comenta solo la séptima. No las lee.',
    student: 'Escucha.',
    source: 'activities.ts → warningSignals · Matriz canónica §8',
    verdict: 'CONSERVAR',
    change: 'Redacción alineada carácter por carácter con la canónica. Denominación: tarjeta de señales de alerta.',
    layout: 'signals',
  },
  {
    n: 20,
    block: 'b07',
    title: 'Chat abierto vs. fuentes delimitadas',
    kicker: 'B07 · Tres modos de trabajo',
    fn: 'DIAGRAMA',
    state: 'ESCUCHAS',
    surface: 'PAPEL',
    at: '16:03',
    minutes: 1,
    cognitive: 'Elegir el modo de trabajo por su riesgo residual, no por su marca.',
    sees: 'Tres columnas: ventaja, riesgo residual y uso adecuado.',
    teacher: 'Explica los tres modos. Empieza por la distinción, no por la marca.',
    student: 'Escucha.',
    source: 'activities.ts → workModes · Matriz canónica §11',
    verdict: 'CONSERVAR',
    change: 'Rótulos alineados al canon: chat abierto · documento adjunto · entorno basado en fuentes.',
    layout: 'modes',
  },
  {
    n: 21,
    block: 'b07',
    title: 'PROCEDENCIA ≠ INTERPRETACIÓN',
    kicker: 'La advertencia va antes, no después',
    fn: 'ANCLA',
    state: 'OBSERVAS',
    surface: 'TINTA',
    at: '16:04 · 16:09',
    minutes: 3,
    cognitive: 'Saber que un localizador acredita de dónde salió algo, no que la conclusión se siga de ahí.',
    sees: 'La regla en mayúsculas.',
    teacher: 'La dice antes de la demostración. La reproyecta al terminar el movimiento 5.',
    student: 'Responde en voz alta si la conclusión está en la sentencia o la puso el sistema.',
    source: 'Matriz canónica §11 · frase ancla n.º 6',
    verdict: 'AJUSTAR',
    change:
      'La decisión sobre el movimiento 5 se toma en voz alta con el curso: la plataforma dejó de recoger decisiones sobre lo que ocurre en la pantalla del profesor.',
    layout: 'anchor',
  },
  {
    n: 22,
    block: 'b07',
    title: 'Gemini Notebook (ex NotebookLM)',
    kicker: 'B07 · Demostración sobre corpus cerrado',
    fn: 'DEMOSTRACION',
    state: 'OBSERVAS',
    surface: 'PAPEL',
    at: '16:05',
    minutes: 4,
    cognitive: 'Ver un corpus cerrado, un localizador que abre y una conclusión que sigue siendo discutible.',
    sees: 'Los seis movimientos de la demostración, con el quinto marcado como innegociable.',
    teacher: 'Conduce la demostración. El movimiento 5 no se sacrifica nunca.',
    student: 'Observa y prepara sus dos decisiones en B07.',
    source: 'Guion B07 · Matriz canónica §11 · activities.ts → terminologyBan',
    verdict: 'CONSERVAR',
    change: 'Marcado el movimiento 5 como innegociable y añadida la prohibición terminológica.',
    layout: 'demo',
  },
  {
    n: 23,
    block: 'b07',
    title: 'Lo dice el propio proveedor',
    kicker: 'B07 · Exención de responsabilidad',
    fn: 'CASO',
    state: 'ESCUCHAS',
    surface: 'PAPEL',
    at: '16:10',
    minutes: 1,
    cognitive: 'Aceptar que el argumento más fuerte del bloque no lo pone el profesor: lo pone el proveedor.',
    sees: 'La advertencia oficial, a pantalla completa, con fuente y fecha de consulta.',
    teacher: 'La traduce en voz alta. «Ningún argumento mío tiene esa fuerza.»',
    student: 'Escucha.',
    source: 'activities.ts → googleWarning (redacción única)',
    verdict: 'RECONSTRUIR',
    change:
      'Sustituida la cita anterior —más larga y con las dos denominaciones del producto mezcladas— por la redacción canónica única, con su traducción y su fecha de consulta.',
    layout: 'quote',
  },
  {
    n: 24,
    block: 'b07',
    title: 'Lo que viene: 1 de diciembre de 2026',
    kicker: 'B07 · Confidencialidad y marco normativo',
    fn: 'SINTESIS',
    state: 'ESCUCHAS',
    surface: 'PAPEL',
    at: '16:11',
    minutes: 2,
    cognitive: 'Distinguir lo vigente de lo que está en trámite, y saber qué cambia en tres meses.',
    sees: 'Regla de aula, Ley 21.719 y el estado real del Boletín 16821-19.',
    teacher: 'Noventa segundos. «En trámite no es lo mismo que vigente.»',
    student: 'Escucha.',
    source: 'activities.ts → confidentialityRule · Matriz canónica §12',
    verdict: 'CONSERVAR',
    change: 'Añadida la regla de aula y los cuatro criterios previos a subir información.',
    layout: 'law',
  },
  {
    n: 25,
    block: 'b08',
    title: 'Protocolo ICJR',
    kicker: 'B08 · Cuatro operaciones ex post',
    fn: 'DIAGRAMA',
    state: 'ESCUCHAS',
    surface: 'PAPEL',
    at: '16:12',
    minutes: 1,
    cognitive: 'Convertir «hay que revisar» en cuatro operaciones con nombre.',
    sees: 'Los cuatro verbos en grande, con su operación y el error que evita cada uno.',
    teacher: 'Explica las cuatro operaciones. «Control ex ante; ICJR ex post.»',
    student: 'Escucha.',
    source: 'activities.ts → icjrPhases · Matriz canónica §6',
    verdict: 'CONSERVAR',
    change: 'Añadido el error que evita cada fase.',
    layout: 'icjr',
  },
  {
    n: 26,
    block: 'b08',
    title: '¿Qué clase de afirmación es esta?',
    kicker: 'B08 · Cinco estatus epistémicos',
    fn: 'DIAGRAMA',
    state: 'ESCUCHAS',
    surface: 'PAPEL',
    at: '16:13',
    minutes: 1,
    cognitive: 'Saber que cada clase de afirmación se verifica distinto, y que dos no se verifican.',
    sees: 'Los cinco estatus A–E con cómo se comprueba cada uno.',
    teacher: 'Señala solo la C y la E.',
    student: 'Escucha.',
    source: 'activities.ts → epistemicStatuses · Matriz canónica §7',
    verdict: 'CONSERVAR',
    change: 'Añadida la columna «cómo se comprueba». Sin mezclar estatus con estado ni con acción.',
    layout: 'status',
  },
  {
    n: 27,
    block: 'b08',
    title: 'Matriz ICJR',
    kicker: 'Una afirmación, comprobada de verdad',
    fn: 'CONSIGNA',
    state: 'TRABAJAS',
    surface: 'PAPEL',
    at: '16:14 · 16:20',
    minutes: 8,
    cognitive: 'Ver una fila resuelta y entender que «no verificada» es un resultado, no un fracaso.',
    sees: 'Cinco columnas y una fila resuelta. Permanece proyectada todo el ejercicio.',
    teacher: 'La señala y la deja. Circula: «¿leíste el considerando o solo comprobaste que existe?».',
    student:
      'Ejecuta su propio prompt, toma una afirmación de la respuesta y la comprueba: fuente, localizador y qué hace con ella.',
    opens: 'verificacion',
    opensLabel: 'ABRE /clase-1/verificacion · PRUEBA Y VERIFICA',
    dependency: 'Verificación',
    source: 'activities.ts → solvedRow, claimStates, notVerifiedRule',
    verdict: 'AJUSTAR',
    change:
      'De dos afirmaciones con estatus A–E a una obligatoria con fuente, localizador y acción. La clasificación epistémica pasa a material avanzado: aquí el estudiante ejecuta el procedimiento, no memoriza cinco códigos.',
    layout: 'matrix',
  },
  {
    n: 28,
    block: 'b09',
    title: 'Razonamiento jurídico asistido',
    kicker: 'B09 · Integración',
    fn: 'SINTESIS',
    state: 'ESCUCHAS',
    surface: 'PAPEL',
    at: '16:26',
    minutes: 1,
    cognitive: 'Sostener que las cinco cosas son verdad al mismo tiempo y que la quinta no se distribuye.',
    sees: 'El flujo completo con DECISIÓN HUMANA destacada y la ecuación canónica.',
    teacher: 'Respuesta integrada. «La responsabilidad profesional no se delega al modelo.»',
    student: 'Escucha. Ya votó por segunda vez.',
    source: 'manifest.ts → class1Meta.idea, flow · activities.ts → closingSynthesis',
    verdict: 'AJUSTAR',
    change:
      'Ecuación corregida a la canónica: PROMPT + CONTEXTO Y FUENTES + VERIFICACIÓN = RAZONAMIENTO JURÍDICO ASISTIDO. La proyectada decía «corpus delimitado + protocolo ICJR».',
    layout: 'integration',
  },
  {
    n: 29,
    block: 'b09',
    title: 'Tres reglas para salir de la sala',
    kicker: 'Cierre y entrega',
    fn: 'SINTESIS',
    state: 'TRABAJAS',
    surface: 'PAPEL',
    at: '16:27',
    minutes: 6,
    cognitive: 'Llevarse tres reglas operativas y cerrar la evidencia de la sesión.',
    sees: 'Las tres reglas y la consigna del cierre.',
    teacher: 'Las enuncia y da la consigna del cierre.',
    student:
      'Vuelve a responder «¿quién falló?», ve su respuesta de las 15:02 al lado, completa la frase y entrega.',
    opens: 'cierre',
    opensLabel: 'ABRE /clase-1/cierre · VUELVE A LA PREGUNTA Y ENTREGA',
    dependency: 'Entrega',
    source: 'manifest.ts → class1Meta.rules · activities.ts → productCPrompts',
    verdict: 'AJUSTAR',
    change:
      'Un solo documento de entrega: se descarga y se envía desde la misma pantalla, con la comparación antes/ahora arriba. Ya no hay una ruta aparte para cerrar la Bitácora.',
    layout: 'rules',
  },
  {
    n: 30,
    block: 'b09',
    title: 'LA IA NO COMPARECE ANTE EL TRIBUNAL.',
    kicker: 'Programa DIAT · Escuela de Derecho PUCV',
    fn: 'ANCLA',
    state: 'ESCUCHAS',
    surface: 'NOCHE',
    at: '16:29',
    minutes: 1,
    cognitive: 'Cerrar con la única afirmación que resume el taller entero.',
    sees: 'La frase final y su subtítulo. Logos.',
    teacher: 'Cierre de treinta segundos.',
    student: 'Escucha.',
    source: 'activities.ts → finalStatement, finalSubtitle',
    verdict: 'CONSERVAR',
    change: 'Sin cambios.',
    layout: 'closing',
  },
] as const;

// ─── Derivados y comprobaciones ───────────────────────────────────────────────

export const SLIDE_COUNT = SLIDES.length;

export function getSlide(n: number): Class1Slide | undefined {
  return SLIDES.find(s => s.n === n);
}

export function slidesOfBlock(id: BlockId): Class1Slide[] {
  return SLIDES.filter(s => s.block === id);
}

/** Bloque completo al que pertenece una diapositiva. */
export function blockOf(s: Class1Slide): Class1Block {
  const b = getBlock(s.block);
  if (!b) throw new Error(`Diapositiva ${s.n}: bloque desconocido ${s.block}`);
  return b;
}

/** Etiqueta de la franja de plataforma, o `undefined` si la diapositiva no llama. */
export function platformCall(s: Class1Slide): string | undefined {
  if (!s.opens) return undefined;
  const label = s.opensLabel ?? `ABRE ${getStage(s.opens).title.toUpperCase()}`;
  return `▸ ${label}`;
}

/** Ruta de plataforma asociada, si la hay. */
export function platformRoute(s: Class1Slide): string | undefined {
  return s.opens ? getStage(s.opens).route : undefined;
}

/** Minutos de cronómetro que la plataforma da al ejercicio de esta diapositiva. */
export function platformMinutes(s: Class1Slide): number | undefined {
  return s.opens ? class1ActivityDurations[s.opens] / 60 : undefined;
}

/** Cómo se lee el estado de clase en pantalla. Sin señalética infantil. */
export const STATE_LABEL: Record<ClassState, string> = {
  ESCUCHAS: 'AHORA ESCUCHAS',
  TRABAJAS: 'AHORA TRABAJAS',
  OBSERVAS: 'AHORA OBSERVAS Y DECIDES',
};

/**
 * Invariantes del deck. Se ejecutan en el generador y en la auditoría: si una
 * falla, el build se detiene.
 */
export function deckInvariants(): string[] {
  const errs: string[] = [];

  if (SLIDES.length !== 30) errs.push(`El deck tiene ${SLIDES.length} diapositivas; deben ser 30.`);

  SLIDES.forEach((s, i) => {
    if (s.n !== i + 1) errs.push(`Orden roto en la posición ${i + 1}: la diapositiva declara n=${s.n}.`);
  });

  // Cada diapositiva pertenece al bloque que la reclama en manifest.ts.
  for (const s of SLIDES) {
    const b = getBlock(s.block);
    if (!b) {
      errs.push(`Diapositiva ${s.n}: bloque inexistente «${s.block}».`);
      continue;
    }
    if (!b.slides.includes(s.n)) {
      errs.push(`Diapositiva ${s.n}: manifest.ts no la asigna a ${b.code} (${b.slides.join(', ')}).`);
    }
  }

  // Cada diapositiva declarada en manifest.ts existe en el deck.
  for (const b of BLOCKS) {
    for (const n of b.slides) {
      const s = getSlide(n);
      if (!s) errs.push(`${b.code} declara la diapositiva ${n}, que no existe en el deck.`);
      else if (s.block !== b.id) {
        errs.push(`${b.code} declara la diapositiva ${n}, que el deck asigna a ${s.block.toUpperCase()}.`);
      }
    }
  }

  // La franja de plataforma aparece exactamente donde el reparto abre una etapa,
  // más la portada, que deja /clase-1 abierta desde el minuto cero.
  const SPEC_CALLS = [1, 3, 13, 15, 27, 29];
  const actual = SLIDES.filter(s => s.opens).map(s => s.n);
  if (actual.join(',') !== SPEC_CALLS.join(',')) {
    errs.push(`Llamadas a plataforma en ${actual.join(', ')}; el reparto fija ${SPEC_CALLS.join(', ')}.`);
  }

  // Cada etapa de la plataforma se abre desde una diapositiva y solo una. La
  // portada se excluye: no abre ejercicio, deja la clase abierta.
  const opened = SLIDES.filter(s => s.opens && s.n !== 1).map(s => s.opens as StageId);
  if (new Set(opened).size !== opened.length) errs.push('Una etapa se abre desde dos diapositivas.');
  for (const seg of RUN_OF_SHOW) {
    if (!seg.stage) continue;
    if (!opened.includes(seg.stage)) {
      errs.push(`El reparto abre «${seg.stage}» en ${seg.block.toUpperCase()} y ninguna diapositiva la llama.`);
    }
  }

  // Los tres entregables tienen diapositiva.
  for (const p of ['Prompt V1', 'Verificación', 'Entrega']) {
    if (!SLIDES.some(s => s.dependency?.includes(p))) errs.push(`Ninguna diapositiva declara «${p}».`);
  }

  // Los diez bloques están representados.
  for (const b of BLOCKS) {
    if (!SLIDES.some(s => s.block === b.id)) errs.push(`${b.code} no tiene ninguna diapositiva.`);
  }

  // La hora estampada en cada diapositiva cae dentro de su tramo.
  for (const s of SLIDES) {
    const seg = segmentOfSlide(s.n);
    if (!seg) {
      errs.push(`Diapositiva ${s.n}: no pertenece a ningún tramo del reparto.`);
      continue;
    }
    const stamped = s.at.split('·')[0].trim();
    const inRange = Array.from({ length: seg.to - seg.from + 1 }, (_, i) => clockAt(seg.from + i));
    if (!inRange.includes(stamped)) {
      errs.push(`Diapositiva ${s.n}: hora ${stamped} fuera del tramo ${segmentClock(seg)}.`);
    }
  }

  // Y el reparto, a su vez, cuadra.
  errs.push(...runOfShowErrors());

  return errs;
}

/** Cabecera de navegación para las notas del orador. */
export function slideStamp(s: Class1Slide): string {
  const b = blockOf(s);
  const seg = segmentOf(b.id);
  const route = platformRoute(s);
  return [
    'CLASE: 1',
    `TRAMO: ${b.code} · ${seg.title}`,
    `HORARIO: ${segmentClock(seg)}`,
    `SLIDE: ${String(s.n).padStart(2, '0')} · ${s.at}`,
    `RUTA: ${route ?? '— (esta diapositiva no manda al estudiante a la plataforma)'}`,
    `GUIÓN: ${b.code}`,
    s.dependency ? `ENTREGABLE: ${s.dependency}` : 'ENTREGABLE: —',
    'CANON: v1.0 · GUION: v2.2 · PLATAFORMA: 5 etapas',
  ].join('\n');
}
