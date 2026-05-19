export interface Flashcard {
  id: number;
  category: 'Vocabulario IA' | 'Prompting Jurídico' | 'Herramientas' | 'Flujos Multi-IA';
  front: string;
  back: string;
  emoji: string;
  funFact?: string;
}

export const flashcards: Flashcard[] = [
  // VOCABULARIO IA
  {
    id: 1, category: 'Vocabulario IA', emoji: '🪙',
    front: '¿Qué es un Token?',
    back: 'La unidad mínima que procesa un LLM. Aproximadamente 4 caracteres. GPT-4 cobra por ellos. Claude es más generoso.',
    funFact: '1.000 tokens ≈ 750 palabras ≈ 1 página A4',
  },
  {
    id: 2, category: 'Vocabulario IA', emoji: '👻',
    front: '¿Qué es una Alucinación?',
    back: 'Cuando la IA inventa datos con total seguridad. Jurisprudencia falsa, artículos inexistentes, fechas incorrectas. Tu pesadilla profesional.',
    funFact: 'La IA no miente — no sabe que está equivocada. Por eso hay que verificar siempre.',
  },
  {
    id: 3, category: 'Vocabulario IA', emoji: '🌡️',
    front: '¿Qué es la Temperatura en IA?',
    back: 'Controla la aleatoriedad del output. 0 = respuestas deterministas y precisas. 1 = creativo e impredecible. Para derecho: usa temperatura baja.',
    funFact: 'Para contratos: temperatura 0. Para lluvia de ideas jurídicas: temperatura alta.',
  },
  {
    id: 4, category: 'Vocabulario IA', emoji: '🧠',
    front: '¿Qué es RAG?',
    back: 'Retrieval-Augmented Generation. La IA busca en tus documentos antes de responder. NotebookLM hace esto exactamente.',
    funFact: 'Con RAG, la IA "lee" tu expediente antes de contestar. Sin RAG, inventa contexto.',
  },
  {
    id: 5, category: 'Vocabulario IA', emoji: '🪟',
    front: '¿Qué es el Context Window?',
    back: 'La cantidad de texto que la IA puede "ver" en una conversación. Claude tiene 200.000 tokens. Suficiente para leer toda una novela.',
    funFact: 'Un expediente judicial de 300 páginas cabe perfectamente en el context window de Claude.',
  },
  {
    id: 6, category: 'Vocabulario IA', emoji: '🎯',
    front: '¿Qué es Few-Shot Prompting?',
    back: 'Darle ejemplos a la IA antes de pedirle algo. "Esto es un contrato bien redactado → ahora hazme uno similar." Funciona increíblemente.',
    funFact: 'Zero-shot = sin ejemplos. Few-shot = 2-5 ejemplos. La diferencia en calidad es abismal.',
  },
  {
    id: 7, category: 'Vocabulario IA', emoji: '🔗',
    front: '¿Qué es Chain-of-Thought?',
    back: 'Pedirle a la IA que "piense en voz alta" antes de dar su respuesta. Agrega "razona paso a paso" y observa la magia.',
    funFact: 'Para análisis jurídicos complejos, esto mejora la precisión hasta un 40%.',
  },
  {
    id: 8, category: 'Vocabulario IA', emoji: '📋',
    front: '¿Qué es el System Prompt?',
    back: 'Las instrucciones base que moldean el comportamiento de la IA antes de tu primera pregunta. El "ADN" de cómo se comporta el modelo.',
    funFact: 'Claude tiene un system prompt de Anthropic enorme. Tú puedes agregar el tuyo encima.',
  },
  {
    id: 9, category: 'Vocabulario IA', emoji: '🔢',
    front: '¿Qué es un Embedding?',
    back: 'Representación matemática del significado de un texto. Permite a la IA entender que "norma" y "artículo legal" son conceptos similares.',
    funFact: 'Google y Perplexity usan embeddings para entender búsquedas jurídicas complejas.',
  },
  {
    id: 10, category: 'Vocabulario IA', emoji: '🏗️',
    front: '¿Qué es un LLM?',
    back: 'Large Language Model. El motor detrás de Claude, ChatGPT y Gemini. Entrenado en billones de palabras, incluyendo (mucha) literatura jurídica.',
    funFact: 'GPT-4 fue entrenado con más texto legal que cualquier abogado podría leer en mil vidas.',
  },

  // PROMPTING JURÍDICO
  {
    id: 11, category: 'Prompting Jurídico', emoji: '🎭',
    front: 'La anatomía del prompt perfecto',
    back: 'ROL + CONTEXTO + INSTRUCCIÓN + FORMATO + RESTRICCIONES. Cada elemento que falta = output más genérico. Todos presentes = output de calidad profesional.',
    funFact: 'La mayoría de los abogados usa solo "instrucción". Se pierden el 80% del potencial.',
  },
  {
    id: 12, category: 'Prompting Jurídico', emoji: '🛡️',
    front: '¿Cómo evitar alucinaciones jurídicas?',
    back: '"Si no tienes certeza absoluta, indícalo con [VERIFICAR]. No inventes artículos, sentencias ni fechas." Esta frase reduce errores hasta un 60%.',
    funFact: 'También funciona pedir: "Cita solo normas del sistema jurídico chileno vigente."',
  },
  {
    id: 13, category: 'Prompting Jurídico', emoji: '📁',
    front: 'Cómo analizar un expediente con IA',
    back: '1. Pega el documento completo. 2. Pide un resumen estructurado. 3. Haz preguntas específicas. 4. Pide identificar riesgos. 5. Solicita estrategia.',
    funFact: 'Claude puede leer contratos de 200 páginas en segundos. Tu asociado tardaba días.',
  },
  {
    id: 14, category: 'Prompting Jurídico', emoji: '🔒',
    front: 'Confidencialidad del cliente con IA',
    back: 'NUNCA pegues RUT, nombres reales, datos de cuentas o información sensible del cliente en IAs públicas. Anonimiza siempre antes de compartir.',
    funFact: 'Reemplaza nombre_real → "Empresa A". RUT → "XXXXX". Dirección → "Ciudad X".',
  },
  {
    id: 15, category: 'Prompting Jurídico', emoji: '🗂️',
    front: 'Formato de output que funciona',
    back: '"Estructura tu respuesta: 1) Síntesis ejecutiva (3 líneas), 2) Análisis por secciones, 3) Riesgos identificados, 4) Conclusión y recomendaciones."',
    funFact: 'Sin instrucción de formato, la IA da párrafos densos. Con formato = documento usable.',
  },
  {
    id: 16, category: 'Prompting Jurídico', emoji: '🔄',
    front: '¿Cómo iterar con la IA?',
    back: 'El primer output es un borrador. Di: "Mejora la sección X", "Agrega más jurisprudencia", "Hazlo más formal", "Reduce a la mitad". La IA no se cansa.',
    funFact: 'Los mejores prompts jurídicos nacen de 3-5 iteraciones, no de la primera respuesta.',
  },
  {
    id: 17, category: 'Prompting Jurídico', emoji: '⚖️',
    front: 'La regla de oro del derecho con IA',
    back: 'La IA es tu co-redactor, no tu abogado. TÚ eres el responsable profesional del documento final. Siempre verifica, valida y firma.',
    funFact: '"AI-assisted" no es excusa ante el colegio de abogados. La revisión humana es obligatoria.',
  },
  {
    id: 18, category: 'Prompting Jurídico', emoji: '📚',
    front: 'Fuentes jurídicas chilenas que la IA conoce',
    back: 'BCN (bcn.cl), Poder Judicial (pjud.cl), Contraloría (contraloria.cl), TC (tribunalconstitucional.cl), Diario Oficial. Cítalas en tu prompt.',
    funFact: 'Perplexity puede buscar en estas fuentes en tiempo real. Claude las conoce por entrenamiento.',
  },
  {
    id: 19, category: 'Prompting Jurídico', emoji: '🎪',
    front: 'Prompt para redactar contratos',
    back: '"Actúa como abogado civil experto. Redacta [tipo de contrato] según la legislación chilena vigente. Incluye: cláusulas de responsabilidad, incumplimiento, fuerza mayor y resolución de disputas."',
    funFact: 'Agrega: "Identifica los 3 principales riesgos de este contrato para mi cliente" al final.',
  },
  {
    id: 20, category: 'Prompting Jurídico', emoji: '🔍',
    front: 'Prompt para investigación jurídica',
    back: '"Investiga [tema] en el derecho chileno. Cita: a) Normativa aplicable, b) Doctrina relevante, c) Jurisprudencia de la Corte Suprema. Indica [VERIFICAR] si no tienes certeza."',
    funFact: 'Combina con NotebookLM: sube los papers y jurisprudencia, luego interroga el corpus.',
  },

  // HERRAMIENTAS
  {
    id: 21, category: 'Herramientas', emoji: '🤖',
    front: 'Claude — ¿cuándo usarlo?',
    back: 'El mejor para: documentos legales largos, análisis profundo, razonamiento complejo, mantener el tono formal. Su context window es el más grande del mercado.',
    funFact: 'Claude tiene principios éticos más conservadores. No te ayudará con nada cuestionable, para bien.',
  },
  {
    id: 22, category: 'Herramientas', emoji: '💬',
    front: 'ChatGPT — ¿cuándo usarlo?',
    back: 'El más popular y versátil. Ideal para borradores rápidos, brainstorming, y cuando necesitas plugins de terceros. Amplio ecosistema de herramientas.',
    funFact: 'ChatGPT tiene más integraciones de terceros. Claude tiene mejor razonamiento. Úsalos juntos.',
  },
  {
    id: 23, category: 'Herramientas', emoji: '💎',
    front: 'Gemini — ¿cuándo usarlo?',
    back: 'Multimodal y nativo de Google. Analiza PDFs directamente, se integra con Drive y Docs. Perfecto para expedientes digitalizados y presentaciones.',
    funFact: 'Gemini lee PDFs sin copiar texto. Arrastra el expediente → pregunta directamente.',
  },
  {
    id: 24, category: 'Herramientas', emoji: '📓',
    front: 'NotebookLM — ¿cuándo usarlo?',
    back: 'Tu asistente de investigación personalizado. Sube la doctrina, legislación y jurisprudencia → crea un sistema RAG que cita textualmente tus fuentes.',
    funFact: 'NotebookLM nunca inventa fuentes. Todo lo que dice viene de tus documentos subidos.',
  },
  {
    id: 25, category: 'Herramientas', emoji: '🔎',
    front: 'Perplexity — ¿cuándo usarlo?',
    back: 'Búsqueda jurídica con citas verificables en tiempo real. Alternativa inteligente a Google Scholar. Excelente para monitorear cambios normativos.',
    funFact: 'Perplexity cita URLs verificables. Si no hay fuente, no da el dato. Más confiable para hechos.',
  },
  {
    id: 26, category: 'Herramientas', emoji: '🐱',
    front: 'GitHub — ¿para qué sirve a abogados?',
    back: 'Gestión de plantillas jurídicas con control de versiones. Nunca pierdas un borrador. Colaboración en proyectos legales complejos. Base de la automatización.',
    funFact: 'Un estudio jurídico con 500 plantillas en GitHub las actualiza en minutos, no semanas.',
  },
  {
    id: 27, category: 'Herramientas', emoji: '🚀',
    front: 'Vercel — ¿para qué sirve a abogados?',
    back: 'Publicar herramientas jurídicas propias en internet. Portales de clientes, calculadoras legales, formularios inteligentes. Sin necesidad de servidor propio.',
    funFact: 'Esta misma app que estás usando fue desplegada en Vercel en minutos.',
  },

  // FLUJOS MULTI-IA
  {
    id: 28, category: 'Flujos Multi-IA', emoji: '🔀',
    front: 'El flujo básico de investigación',
    back: 'PERPLEXITY (busca fuentes actuales) → NOTEBOOKLM (analiza el corpus) → CLAUDE (redacta el documento final). Tres herramientas, un resultado de calidad.',
    funFact: 'Este flujo puede reemplazar 4 horas de investigación manual. En 30 minutos.',
  },
  {
    id: 29, category: 'Flujos Multi-IA', emoji: '⚡',
    front: 'El flujo avanzado para litigios',
    back: 'GEMINI (lee el expediente PDF) → CLAUDE (analiza estrategia legal) → CHATGPT (genera argumentario en formato audiencia) → humano revisa y firma.',
    funFact: 'Harvey AI (la IA jurídica de élite) hace esto en automático. Cuesta USD 50k/año.',
  },
  {
    id: 30, category: 'Flujos Multi-IA', emoji: '🌍',
    front: 'El futuro que ya llegó',
    back: 'Harvey AI · Clio Duo · Thomson Reuters AI · Lexis+ AI. El ecosistema legaltech explota en 2026. Los que sepan usarlas, liderarán la profesión.',
    funFact: 'Firmas como Allen & Overy ya tienen IA mandatoria para todos sus abogados. Chile sigue.',
  },
];

export const categories = ['Todos', 'Vocabulario IA', 'Prompting Jurídico', 'Herramientas', 'Flujos Multi-IA'] as const;
