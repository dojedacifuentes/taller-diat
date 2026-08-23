// ─────────────────────────────────────────────────────────────────────────────
// CLASE 1 · MANUAL CONTEXTUAL
//
// Microcontenidos que se abren desde cualquier actividad sin sacar al estudiante
// del flujo. NO son las 36 páginas del Manual del Estudiante convertidas en web:
// son el mínimo necesario para resolver una duda en mitad de una decisión, con
// la referencia al parágrafo del Manual para quien quiera leer más.
// ─────────────────────────────────────────────────────────────────────────────

export interface Concept {
  id: string;
  /** Formulación corta, tal como aparece en el PPT y el Manual. */
  headline: string;
  /** Explicación breve: dos o tres frases como máximo. */
  explanation: string;
  /** Aplicación concreta. */
  example?: string;
  /** Riesgo profesional asociado. */
  risk?: string;
  /** Parágrafo del Manual del Estudiante. */
  manualRef: string;
  /** Bloque donde se practica. */
  practiceBlock?: string;
}

export const concepts: readonly Concept[] = [
  {
    id: 'fluidez-verdad',
    headline: 'FLUIDEZ ≠ VERDAD',
    explanation:
      'Una respuesta puede estar perfectamente redactada y ser jurídicamente equivocada al mismo tiempo. La calidad de la redacción y la calidad de la evidencia son dos cosas distintas.',
    example:
      'Un resumen de jurisprudencia bien escrito, estructurado y con tono de autoridad, del que no se puede saber de dónde salió cada afirmación.',
    risk: 'Nuestro criterio rápido de fiabilidad es la forma. Este error está en condiciones de superarlo.',
    manualRef: 'Manual §4',
    practiceBlock: 'b01',
  },
  {
    id: 'modelo-producto',
    headline: 'El modelo no es el producto',
    explanation:
      'El modelo genera una continuación probable. El producto es el modelo más una capa de herramientas: búsqueda web, lectura de archivos, memoria, instrucciones del sistema, ejecución de código.',
    example:
      '«Me buscó jurisprudencia y me la inventó»: a veces el problema es el modelo y a veces es que el producto no tenía búsqueda activada.',
    manualRef: 'Manual §4',
    practiceBlock: 'b01',
  },
  {
    id: 'decision-implicita',
    headline: 'Decisión implícita',
    explanation:
      'Toda ambigüedad que el profesional no resuelve al redactar el encargo la resuelve el sistema al ejecutarlo. Escribir un buen prompt no es escribir más: es recuperar decisiones.',
    example:
      '«Analiza esta sentencia» delega seis decisiones: finalidad, operación, fuentes, qué hacer ante vacíos, formato y auditabilidad.',
    manualRef: 'Manual §6',
    practiceBlock: 'b03',
  },
  {
    id: 'proporcionalidad',
    headline: 'Proporcionalidad al riesgo',
    explanation:
      'La complejidad de la instrucción y del control debe ser proporcional a la complejidad y al riesgo de la tarea. No todo prompt necesita los siete componentes.',
    example:
      '«Corrige la puntuación y la concordancia de este párrafo. No cambies el contenido ni el registro.» Dos componentes, y añadir más lo empeoraría.',
    manualRef: 'Manual §9',
    practiceBlock: 'b04',
  },
  {
    id: 'control',
    headline: 'Control no verifica: hace auditable',
    explanation:
      'Control es un componente del prompt, ex ante: pide localizadores, separación entre evidencia e inferencia y declaración de ausencias. Hace visible el incumplimiento; no lo impide.',
    risk:
      'Quien cree que la restricción garantiza el resultado abandona la verificación. Ahí aparece el riesgo profesional.',
    manualRef: 'Manual §8',
    practiceBlock: 'b04',
  },
  {
    id: 'auditar-verificar',
    headline: 'AUDITAR ≠ VERIFICAR',
    explanation:
      'Un metaprompt revisa la instrucción. La verificación revisa la salida contra una fuente. Un prompt auditado sigue produciendo salidas que hay que comprobar.',
    manualRef: 'Manual §12',
    practiceBlock: 'b05',
  },
  {
    id: 'fuente-real',
    headline: 'FUENTE REAL ≠ CONCLUSIÓN CORRECTA',
    explanation:
      'Verificar que una sentencia existe no significa comprobar que sostenga la proposición que se le atribuye. Son dos operaciones distintas y solo la segunda es verificación.',
    example:
      '«CS Rol 12.345-2024 estableció que…», cuando ese rol trata de una materia distinta. El rol existe. El enlace abre.',
    risk: 'Supera la verificación superficial: se le cuela a quien sí revisa, no al distraído.',
    manualRef: 'Manual §14',
    practiceBlock: 'b06',
  },
  {
    id: 'grounding',
    headline: 'PROCEDENCIA ≠ INTERPRETACIÓN',
    explanation:
      'Grounding resuelve el problema de de dónde sale la información. No resuelve el problema de si fue interpretada correctamente. Un localizador indica de qué fragmento salió; no demuestra que la conclusión se siga de él.',
    example:
      'Una cita con enlace que abre correctamente, y el fragmento citado no dice lo que la respuesta afirma: el error tipo 2 dentro de un entorno anclado en fuentes.',
    manualRef: 'Manual §17',
    practiceBlock: 'b07',
  },
  {
    id: 'icjr',
    headline: 'Control ex ante · ICJR ex post',
    explanation:
      'Control solicita trazabilidad; ICJR la comprueba. Control reduce ambigüedad; ICJR contrasta evidencia. Control hace visible el error; ICJR decide qué hacer con él.',
    risk: 'Pedirle a la IA que no invente no constituye verificación.',
    manualRef: 'Manual §21',
    practiceBlock: 'b08',
  },
  {
    id: 'estatus',
    headline: 'Cinco estatus epistémicos',
    explanation:
      'Antes de contrastar hay que saber qué clase de afirmación se tiene delante: respaldada (A), síntesis (B), inferencia (C), hipótesis (D) o información externa no verificada (E). Cada clase se verifica de manera distinta, y la inferencia no se verifica: se evalúa.',
    manualRef: 'Manual §22',
    practiceBlock: 'b08',
  },
  {
    id: 'no-verificada',
    headline: '«NO VERIFICADA» es un resultado válido',
    explanation:
      'Si una afirmación no puede verificarse en el tiempo disponible, ese es el resultado correcto. No se completa el hueco por intuición: un estado honesto vale más que una casilla llena.',
    manualRef: 'Manual §23',
    practiceBlock: 'b08',
  },
  {
    id: 'segunda-ia',
    headline: 'Verificar no es preguntarle a otra IA',
    explanation:
      'Una segunda herramienta puede ayudar a localizar evidencia, pero el contraste relevante debe terminar en una fuente suficientemente autoritativa. Dos respuestas coincidentes no se convierten en fuente por votación.',
    manualRef: 'Manual §14',
    practiceBlock: 'b08',
  },
  {
    id: 'responsabilidad',
    headline: 'La responsabilidad profesional no se delega al modelo',
    explanation:
      'La sanción no recae sobre la herramienta: recae sobre quien incorpora el contenido y firma. La IA no tiene deberes procesales; el abogado sí.',
    example:
      'Cuatro resoluciones chilenas en 2026, en cuatro sedes distintas, por presentar escritos con fuentes inexistentes.',
    manualRef: 'Manual §3',
    practiceBlock: 'b00',
  },
] as const;

export function getConcept(id: string): Concept | undefined {
  return concepts.find(c => c.id === id);
}

// ─── Glosario (Manual §28) ───────────────────────────────────────────────────

export interface GlossaryEntry {
  term: string;
  definition: string;
}

export const glossary: readonly GlossaryEntry[] = [
  {
    term: 'IA',
    definition:
      'Campo amplio que incluye sistemas de clasificación, predicción, visión y recomendación. No todo lo que se llama «IA» es generativo.',
  },
  {
    term: 'IA generativa',
    definition:
      'Familia dentro de ese campo que produce contenido nuevo —texto, imagen, audio, código— a partir de patrones aprendidos y del contexto que recibe.',
  },
  {
    term: 'LLM · modelo de lenguaje',
    definition:
      'Sistema que recibe una entrada, la representa en tokens, utiliza el contexto disponible y genera una continuación probable según patrones aprendidos.',
  },
  {
    term: 'Producto',
    definition:
      'Lo que el usuario abre (ChatGPT, Gemini, Claude): el modelo más una capa de herramientas. Buena parte de lo que se atribuye «a la IA» es comportamiento del producto.',
  },
  {
    term: 'Prompt',
    definition:
      'La instrucción que se entrega al sistema. En este taller se entiende como la especificación de un encargo, no como una fórmula.',
  },
  {
    term: 'Contexto',
    definition:
      'Todo lo que el sistema tiene disponible al generar: instrucciones, documentos, conversación previa, memoria del producto.',
  },
  {
    term: 'Ventana de contexto',
    definition:
      'Cantidad limitada de texto que el sistema procesa por vez. La atención no se distribuye de manera uniforme: lo situado en el medio de un documento extenso se recupera peor.',
  },
  { term: 'Token', definition: 'Unidad de procesamiento en la que el sistema representa el texto.' },
  {
    term: 'Fuente',
    definition:
      'El material del que proviene una afirmación. En Derecho, la autoridad de lo que se afirma depende de dónde viene.',
  },
  {
    term: 'Corpus',
    definition: 'Conjunto de documentos seleccionados sobre los que se restringe el trabajo del sistema.',
  },
  {
    term: 'Grounding',
    definition:
      'Entregar al sistema las fuentes específicas sobre las que debe trabajar, en lugar de dejarlo responder desde todo lo aprendido. Mejora la procedencia; no garantiza la interpretación.',
  },
  {
    term: 'RAG',
    definition:
      'Retrieval-augmented generation: recuperar fragmentos de un corpus definido y entregarlos al modelo para que responda a partir de ellos. La recuperación también puede fallar.',
  },
  {
    term: 'Localizador',
    definition:
      'Referencia precisa al lugar exacto del respaldo: artículo, considerando, página, párrafo o sección. Indica de dónde salió la información; no prueba que la conclusión se siga de ahí.',
  },
  {
    term: 'Inferencia',
    definition:
      'Conclusión derivada del material y no contenida en él. No se verifica: se evalúa el razonamiento. Debe declararse siempre como tal.',
  },
  {
    term: 'Alucinación',
    definition:
      'Salida en la que el sistema presenta como información respaldada algo que no está suficientemente sustentado por los datos o fuentes pertinentes.',
  },
  {
    term: 'Metaprompt',
    definition:
      'Instrucción dirigida a que el sistema critique, complete o reestructure otra instrucción. Auditar no es verificar.',
  },
  {
    term: 'Verificación',
    definition:
      'Contraste de una afirmación contra una fuente suficientemente autoritativa, con localizador y registro. Nunca termina en una segunda IA.',
  },
  {
    term: 'ICJR',
    definition:
      'Protocolo de verificación ex post en cuatro fases: Identificar, Contrastar, Justificar, Registrar.',
  },
  {
    term: 'Control',
    definition:
      'Componente del prompt, ex ante, que exige localizadores, separación entre evidencia e inferencia y declaración de ausencias. Hace la salida auditable; no la verifica.',
  },
] as const;
