// ─────────────────────────────────────────────────────────────────────────────
// CURSO · FUNDAMENTOS DE IA PARA ESTUDIANTES DE DERECHO (Escuela de Derecho PUCV)
//
// Material del alumno de las cuatro clases: lo que se hace en sala, los prompts
// listos para copiar, los enlaces exactos que se abren y los protocolos que se
// marcan. Es una superficie de ejecución, no un manual: el desarrollo completo
// vive en el documento del curso y en el Word descargable de cada clase.
// ─────────────────────────────────────────────────────────────────────────────

export interface EnlaceFundamentos {
  url: string;
  label: string;
  nota?: string;
}

export interface PromptFundamentos {
  id: string;
  titulo: string;
  texto: string;
  nota?: string;
}

export interface BloqueFundamentos {
  id: string;
  minutos: string;
  titulo: string;
  sintesis: string;
  pasos?: string[];
  dato?: string;
  prompts?: PromptFundamentos[];
  enlaces?: EnlaceFundamentos[];
}

export interface ClaseFundamentos {
  n: 1 | 2 | 3 | 4;
  slug: string;
  etiqueta: string;
  titulo: string;
  pregunta: string;
  objetivo: string;
  producto: string;
  word: string;
  bloques: BloqueFundamentos[];
  protocolo: { titulo: string; items: string[] };
  puente?: string;
}

export const cursoFundamentos = {
  nombre: 'Fundamentos de IA para estudiantes de Derecho',
  bajada: 'Modelos, privacidad, conectores, asistentes propios y repositorios abiertos',
  institucion: 'Escuela de Derecho · PUCV',
  relator: 'Diego Hernán Ojeda Cifuentes',
  formato: '4 clases presenciales de 2 horas · planes gratuitos · sin programación',
  regla:
    'La IA redacta borradores y organiza información; la fuente oficial (Ley Chile, Poder Judicial) es la única que confirma.',
} as const;

export const clasesFundamentos: ClaseFundamentos[] = [
  // ══════════════════════════════════════════════ CLASE 1 · ENTENDER
  {
    n: 1,
    slug: 'clase-1',
    etiqueta: 'Entender',
    titulo: 'Qué es un modelo de lenguaje y qué hay disponible',
    pregunta: '¿Por qué responde distinto cada vez, y por qué inventa citas con total seguridad?',
    objetivo:
      'Salir sabiendo cómo genera texto un modelo, por qué alucina y qué herramienta sirve a cada tarea.',
    producto: 'Cuaderno comparativo: la misma consulta en tres modelos, con las diferencias registradas.',
    word: '/descargas/fundamentos-clase-1.docx',
    bloques: [
      {
        id: 'maquina',
        minutos: '10–35',
        titulo: 'Cómo funciona: cuatro conceptos y ninguno más',
        sintesis:
          'El modelo no consulta una base de leyes: predice, palabra por palabra, la continuación más probable de lo que escribes. Cuatro conceptos bastan para todo el curso: token, ventana de contexto, corte de conocimiento y probabilidad (no verdad).',
        pasos: [
          'Pega el artículo 1545 del Código Civil en el tokenizador y mira tu texto convertido en fichas.',
          'Pregunta por una reforma legal muy reciente con y sin búsqueda web, y compara.',
        ],
        enlaces: [
          { url: 'https://platform.openai.com/tokenizer', label: 'Tokenizador', nota: 'tu texto en tokens' },
          { url: 'https://www.bcn.cl/leychile', label: 'Ley Chile', nota: 'la fuente que confirma' },
        ],
      },
      {
        id: 'alucina',
        minutos: '35–55',
        titulo: 'Por qué alucina y por qué no cita bien',
        sintesis:
          'Una cita jurídica «probable» es justo lo que produce cuando no conoce la real: rol con formato perfecto, autor real con libro inexistente. No es un defecto ocasional: es consecuencia del diseño. La fluidez no es señal de verdad.',
        dato:
          'Corte Suprema, rol 23.322-2025: un mes de suspensión y 5 UTM a una abogada por citas doctrinales inexistentes generadas por IA. La base de Charlotin registra más de 2.200 resoluciones así en el mundo; 3 en Chile.',
        prompts: [
          {
            id: 'c1-alucinacion',
            titulo: 'Provocar una alucinación (para verla venir)',
            texto:
              'Transcríbeme el considerando quinto de la sentencia de la Corte Suprema rol 12.345-2023 sobre servidumbre de tránsito.',
            nota:
              'Hazlo sin búsqueda web. Obtendrás un texto verosímil de una sentencia que nadie comprobó que exista: esa es la lección.',
          },
        ],
        enlaces: [
          {
            url: 'https://www.damiencharlotin.com/hallucinations/',
            label: 'Base de Charlotin',
            nota: 'resoluciones con citas inventadas',
          },
          {
            url: 'https://www.pjud.cl/prensa-y-comunicaciones/noticias-del-poder-judicial/145652',
            label: 'Poder Judicial · la sanción',
            nota: 'noticia oficial del caso chileno',
          },
        ],
      },
      {
        id: 'panorama',
        minutos: '55–75',
        titulo: 'El panorama: siete herramientas que conviene distinguir',
        sintesis:
          'ChatGPT (generalista), Claude (redacción y textos largos), Gemini (integrado a Google), Copilot (dentro de Office), Perplexity (buscador con fuentes a la vista), Gemini Notebook (responde solo desde tus documentos) y los modelos abiertos de Hugging Face. Todas tienen plan gratuito.',
        enlaces: [
          { url: 'https://chatgpt.com', label: 'ChatGPT' },
          { url: 'https://claude.ai', label: 'Claude' },
          { url: 'https://gemini.google.com', label: 'Gemini' },
          { url: 'https://copilot.microsoft.com', label: 'Copilot' },
          { url: 'https://www.perplexity.ai', label: 'Perplexity' },
          { url: 'https://notebooklm.google.com', label: 'Gemini Notebook' },
          { url: 'https://huggingface.co', label: 'Hugging Face', nota: 'más de 2,5 millones de modelos abiertos' },
        ],
      },
      {
        id: 'escalones',
        minutos: '75–100',
        titulo: 'Encargar bien: los cuatro escalones',
        sintesis:
          'No hace falta «ingeniería de prompts»: hace falta encargar como se le encarga a un procurador. Instrucción, contexto, formato y ejemplos. Sube de a un escalón con la misma consulta y compara lo que cambia.',
        prompts: [
          {
            id: 'c1-esc1',
            titulo: 'Escalón 1 · instrucción sola (lo que hace todo el mundo)',
            texto: 'Explícame la prescripción extintiva.',
          },
          {
            id: 'c1-esc2',
            titulo: 'Escalón 2 · + contexto',
            texto:
              'Soy estudiante de segundo año de Derecho en Chile. Explícame la prescripción extintiva del Código Civil chileno, con los plazos generales y en qué se diferencia de la caducidad.',
          },
          {
            id: 'c1-esc3',
            titulo: 'Escalón 3 · + formato',
            texto:
              'Lo mismo, pero entrégalo así: (1) definición en tres líneas; (2) tabla con los plazos y su artículo del Código Civil; (3) tres ejemplos cotidianos; (4) dos preguntas de examen tipo desarrollo. No inventes artículos: si no estás seguro de un número, dilo.',
          },
          {
            id: 'c1-esc4',
            titulo: 'Escalón 4 · + ejemplo (el salto de calidad)',
            texto:
              'Además, imita este estilo de apunte que te pego como muestra:\n«Artículo 2514. La prescripción que extingue las acciones y derechos ajenos exige solamente cierto lapso de tiempo...»\n[pega aquí un fragmento de tu propio apunte]\nUsa ese tono y esa estructura.',
          },
        ],
      },
      {
        id: 'producto',
        minutos: '100–120',
        titulo: 'Producto: el cuaderno comparativo',
        sintesis:
          'La misma consulta en ChatGPT, Gemini y Claude. Registra qué respondió cada uno, qué citó, qué inventó o dudó, y cuál prefieres y por qué. En la clase 4 descubrirás cuál te mintió mejor.',
        prompts: [
          {
            id: 'c1-comparador',
            titulo: 'La consulta del comparador (pégala en los tres)',
            texto:
              '¿Qué requisitos exige la ley chilena para interponer un recurso de protección y en qué plazo se interpone? Indica la fuente exacta de cada afirmación (norma y artículo). Si alguna parte no la sabes con certeza, dilo expresamente.',
          },
        ],
      },
    ],
    protocolo: {
      titulo: 'Protocolo de la clase 1 · cuaderno comparativo',
      items: [
        'Pegué la misma consulta en ChatGPT, Gemini y Claude.',
        'Anoté qué citó cada modelo (norma y artículo).',
        'Marqué qué dato dudó o inventó cada uno.',
        'Elegí mi respuesta preferida y escribí por qué en dos líneas.',
        'Tarea puente: repetí los cuatro escalones con una materia de otro ramo.',
      ],
    },
    puente: 'Trae a la clase 2 tu cuenta a mano: configuraremos la privacidad en vivo.',
  },

  // ══════════════════════════════════════════════ CLASE 2 · CONFIGURAR
  {
    n: 2,
    slug: 'clase-2',
    etiqueta: 'Configurar',
    titulo: 'Privacidad, datos, conectores y repositorios abiertos',
    pregunta: '¿Qué pasa con lo que escribes, y qué no se escribe nunca?',
    objetivo:
      'Dejar tu cuenta configurada, saber qué información no entra jamás a una herramienta pública y manejar conectores y permisos.',
    producto: 'Tu cuenta revisada y la lista de verificación de privacidad completa.',
    word: '/descargas/fundamentos-clase-2.docx',
    bloques: [
      {
        id: 'destinos',
        minutos: '0–15',
        titulo: 'Tres destinos para lo que escribes',
        sintesis:
          'Lo que pegas queda almacenado, puede ser revisado por personas y puede usarse para entrenar modelos futuros. En los planes gratuitos el entrenamiento suele venir activado por defecto: apagar es tu primer acto de criterio. Y apagar no borra lo ya enviado.',
      },
      {
        id: 'ajustes',
        minutos: '15–45',
        titulo: 'Manos: apaga el entrenamiento en tus tres cuentas',
        sintesis:
          'Cada plataforma esconde el interruptor en un lugar distinto. Abre cada enlace y deja la configuración hecha hoy; el protocolo de abajo es tu constancia.',
        pasos: [
          'ChatGPT: Controles de datos → desactiva «Mejorar el modelo para todos». Conoce además el chat temporal.',
          'Claude: Configuración → Privacidad → desactiva «Ayudar a mejorar Claude» (viene activado).',
          'Gemini: desactiva «Actividad en las aplicaciones de Gemini» y configura el borrado automático.',
        ],
        enlaces: [
          { url: 'https://chatgpt.com/settings/data-controls', label: 'ChatGPT · Controles de datos' },
          { url: 'https://claude.ai/settings', label: 'Claude · Configuración' },
          { url: 'https://myactivity.google.com/product/gemini', label: 'Gemini · Actividad' },
        ],
      },
      {
        id: 'nunca',
        minutos: '45–65',
        titulo: 'Lo que no se sube nunca (con ninguna configuración)',
        sintesis:
          'Datos personales de terceros, datos sensibles, antecedentes bajo secreto profesional y documentos con reserva. La guía del Colegio de Abogados (julio 2026) es categórica: «en ningún caso» información confidencial en sistemas públicos sin asegurar que no se reutilice. La técnica que resuelve el día a día: anonimizar antes de pegar.',
        dato:
          'Ley 21.719 de datos personales: vigencia fijada para el 1-12-2026 (proyecto de postergación a 2027 en trámite). El deber de confidencialidad no espera.',
        prompts: [
          {
            id: 'c2-anonimizar',
            titulo: 'El anonimizador (pídele a la IA que te proteja de ti)',
            texto:
              'Voy a pegarte la descripción de un caso. Antes de responder nada, reescríbela reemplazando todo dato identificatorio (nombres, RUT, empresas, fechas exactas, montos exactos, lugares) por roles y rangos genéricos, y muéstrame la versión anonimizada para que yo la apruebe. Solo después de mi aprobación, analiza el caso.',
          },
          {
            id: 'c2-terminos',
            titulo: 'Leer términos y condiciones con ayuda',
            texto:
              'Te pego la política de privacidad de una herramienta. Respóndeme solo con base en el texto pegado, citando la sección: (1) ¿usa mis conversaciones para entrenar modelos y cómo se desactiva? (2) ¿cuánto tiempo retiene mis datos? (3) ¿quién más puede verlos? (4) ¿qué pasa al borrar la cuenta? Si el texto no lo dice, responde «el texto no lo dice», sin suponer.',
          },
        ],
      },
      {
        id: 'conectores',
        minutos: '65–85',
        titulo: 'Conectores: enchufar, ver y desenchufar',
        sintesis:
          'Un conector autoriza al asistente a leer tu correo, tus archivos o tu calendario, y la autorización persiste hasta que alguien la revoca. Regla: conectar lo que se necesita, mientras se necesita, en la cuenta que corresponde.',
        pasos: [
          'Abre las conexiones de terceros de tu cuenta Google y revisa qué tiene acceso desde hace años.',
          'Retira hoy al menos una aplicación que ya no uses.',
        ],
        enlaces: [
          { url: 'https://myaccount.google.com/connections', label: 'Google · Conexiones de terceros', nota: 'revócalas aquí' },
        ],
      },
      {
        id: 'repositorios',
        minutos: '85–105',
        titulo: 'Repositorios de libre acceso: lo que existe fuera de las tres de siempre',
        sintesis:
          'Hugging Face reúne millones de modelos abiertos con sus datos y licencias; y el derecho chileno tiene fuentes gratuitas y oficiales que verifican todo lo que el curso produce.',
        enlaces: [
          { url: 'https://huggingface.co', label: 'Hugging Face' },
          { url: 'https://www.bcn.cl/leychile', label: 'Ley Chile', nota: '+416.000 normas a texto vigente' },
          { url: 'https://www.pjud.cl', label: 'Poder Judicial', nota: 'buscadores de sentencias' },
          { url: 'https://www.diariooficial.interior.gob.cl', label: 'Diario Oficial' },
          { url: 'https://scielo.conicyt.cl', label: 'SciELO Chile', nota: 'doctrina en acceso abierto' },
        ],
      },
    ],
    protocolo: {
      titulo: 'Protocolo de la clase 2 · lista de verificación de privacidad',
      items: [
        'ChatGPT: «Mejorar el modelo para todos» desactivado.',
        'ChatGPT: sé abrir un chat temporal y cuándo usarlo.',
        'Claude: «Ayudar a mejorar Claude» desactivado.',
        'Gemini: actividad revisada y borrado automático configurado.',
        'Conexiones de terceros de Google auditadas; retiré las que no uso.',
        'Tengo clara mi lista de «nunca»: datos de terceros, datos sensibles, secreto profesional, reserva.',
        'Sé anonimizar una consulta antes de pegarla.',
      ],
    },
    puente: 'Trae a la clase 3 los materiales digitales de un ramo (apuntes, cédulas, un manual con copia legítima).',
  },

  // ══════════════════════════════════════════════ CLASE 3 · PERSONALIZAR
  {
    n: 3,
    slug: 'clase-3',
    etiqueta: 'Personalizar',
    titulo: 'Asistentes propios, documentos como fuente y estudio',
    pregunta: '¿Cómo paso de usar herramientas genéricas a tener las mías?',
    objetivo:
      'Configurar cómo te responde cada modelo, crear un cuaderno de estudio que cite tus propios apuntes y construir tu primer asistente.',
    producto: 'Tu asistente del ramo funcionando, probado con el protocolo de tres preguntas.',
    word: '/descargas/fundamentos-clase-3.docx',
    bloques: [
      {
        id: 'config',
        minutos: '0–15',
        titulo: 'Configuración inicial: que el modelo sepa quién eres',
        sintesis:
          'Las tres plataformas guardan quién eres y cómo quieres que te respondan, y esa configuración rige todos los chats futuros. Es la diferencia entre respuestas genéricas y respuestas para un estudiante de Derecho chileno.',
        pasos: [
          'Abre las instrucciones personalizadas de ChatGPT y completa apodo, ocupación y reglas de respuesta.',
          'Guarda el equivalente en Gemini («Tus instrucciones para Gemini»).',
          'En ChatGPT, pulsa Ctrl + / para ver todos los atajos de teclado.',
        ],
        prompts: [
          {
            id: 'c3-instrucciones',
            titulo: 'Instrucciones personalizadas (pégalas y ajústalas)',
            texto:
              'Soy estudiante de Derecho en Chile ([año]). Cuando pregunte algo jurídico, asume derecho chileno vigente salvo que diga otra cosa, usa la terminología técnica correcta y cita siempre la fuente con su artículo para que yo la verifique en Ley Chile. Si no estás seguro de un dato, dilo expresamente en vez de inventar. Respuestas ordenadas: primero la regla, después la excepción, al final un ejemplo. Nunca des por hecho que lo que te pego es confidencial: recuérdame anonimizar si detectas datos personales de terceros.',
          },
        ],
        enlaces: [
          { url: 'https://chatgpt.com/settings/personalization', label: 'ChatGPT · Personalización' },
          { url: 'https://gemini.google.com/saved-info', label: 'Gemini · Tus instrucciones' },
          { url: 'https://claude.ai/settings/profile', label: 'Claude · Perfil' },
        ],
      },
      {
        id: 'marcas',
        minutos: '15–30',
        titulo: 'El mismo concepto en tres marcas: GPT, gem, proyecto',
        sintesis:
          'Un encargo bien hecho se guarda para no reescribirlo nunca más: instrucciones permanentes más materiales de referencia, con un nombre. En ChatGPT se llama GPT o Proyecto; en Gemini, gem; en Claude, Proyecto. Antes de usar uno ajeno pregunta: ¿quién lo hizo?, ¿qué instrucciones trae?, ¿de qué jurisdicción es?',
        enlaces: [
          { url: 'https://claude.ai/projects', label: 'Claude · Proyectos' },
          { url: 'https://gemini.google.com/gems/view', label: 'Gemini · Gems' },
          { url: 'https://chatgpt.com', label: 'ChatGPT · menú «+» → Trabajar en un proyecto' },
        ],
      },
      {
        id: 'rag',
        minutos: '30–50',
        titulo: 'Cómo «lee» tus documentos: RAG en tres pasos, sin jerga',
        sintesis:
          'Buscar (encuentra en tus documentos los fragmentos parecidos a tu pregunta), juntar (los pega junto a tu pregunta, sin que lo veas) y redactar (responde condicionado por esos fragmentos, citando). Responde mucho mejor sobre tus materiales, pero no elimina la invención: hasta las herramientas jurídicas comerciales fallaron entre 17 % y 33 % (Stanford, 2025). Tu defensa: pedir la cita exacta y abrirla.',
      },
      {
        id: 'notebook',
        minutos: '50–80',
        titulo: 'Gemini Notebook: tus apuntes como profesor ayudante',
        sintesis:
          'La diferencia está en la dirección de la confianza: el chat general responde desde todo su entrenamiento (y puede inventar); un cuaderno responde solo desde las fuentes que cargaste, con citas al pasaje exacto, y si algo no está, lo dice. Crea hoy el cuaderno de tu ramo.',
        pasos: [
          'Crea un cuaderno nuevo y carga tus apuntes del ramo (solo material con copia legítima).',
          'Hazle las preguntas del certamen y abre cada cita numerada.',
          'Genera el resumen de audio, el mapa mental y el cuestionario desde tus propias fuentes.',
        ],
        dato: 'Prueba de honestidad: pregúntale algo que NO está en tus fuentes. Si responde «mis fuentes no lo cubren», funciona.',
        prompts: [
          {
            id: 'c3-preguntas',
            titulo: 'Generador de preguntas desde el apunte',
            texto:
              'Desde mis fuentes, redacta 10 preguntas de certamen sobre [unidad]: 4 conceptuales, 4 de aplicación con un caso breve y 2 de comparación. Para cada una, indica entre paréntesis la fuente y sección exacta de donde sale la respuesta. No uses nada externo a mis fuentes.',
          },
        ],
        enlaces: [
          { url: 'https://notebooklm.google.com', label: 'Gemini Notebook', nota: 'crea aquí tu cuaderno' },
        ],
      },
      {
        id: 'asistente',
        minutos: '80–120',
        titulo: 'Construye tu asistente y pruébalo',
        sintesis:
          'Crea tu gem (o GPT, o proyecto) con la plantilla de cinco partes: rol, tarea, tono, reglas y formato. Después somételo al protocolo de tres preguntas: una que está en tus materiales (debe citarlos), una que no está (debe declararlo) y una con un error deliberado (debe corregirte, no complacerte).',
        prompts: [
          {
            id: 'c3-plantilla',
            titulo: 'Plantilla de instrucciones del asistente',
            texto:
              'ROL: Eres mi ayudante de estudio de [ramo], de la carrera de Derecho en Chile. Tu base son los materiales que te cargué; el derecho aplicable es el chileno salvo que te indique otra cosa.\n\nTAREA: Me ayudas a (1) explicar instituciones con ejemplos cotidianos, (2) preparar cédulas y preguntas de examen, (3) revisar mis respuestas indicando errores y omisiones.\n\nTONO: Claro y riguroso. Usas la terminología técnica correcta y la explicas la primera vez que aparece.\n\nREGLAS: (a) Si la respuesta está en mis materiales, cita el documento y la sección. (b) Si no está, dilo expresamente antes de responder con conocimiento general. (c) Nunca inventes artículos, roles de causa ni autores: si no estás seguro, decláralo. (d) Cuando cites una norma, indica su número exacto para que yo la verifique en Ley Chile.\n\nFORMATO: Respuestas breves por defecto; tablas para comparar; al final de cada explicación, una pregunta de autoevaluación.',
          },
          {
            id: 'c3-error',
            titulo: 'La pregunta con error deliberado (prueba 3)',
            texto: 'Según el artículo 2515 del Código Civil, el plazo de prescripción de la acción ejecutiva es de diez años, ¿cierto?',
            nota: 'La respuesta correcta es que te corrija. Si te da la razón, revisa las reglas de tu plantilla.',
          },
        ],
      },
    ],
    protocolo: {
      titulo: 'Protocolo de la clase 3 · asistente propio',
      items: [
        'Instrucciones personalizadas guardadas en al menos una plataforma.',
        'Cuaderno del ramo creado en Gemini Notebook con mis fuentes cargadas.',
        'Comprobé una cita numerada: me llevó al pasaje exacto de mi apunte.',
        'Mi asistente (gem, GPT o proyecto) quedó creado con la plantilla de cinco partes.',
        'Prueba 1: preguntó algo de mis materiales y los citó.',
        'Prueba 2: preguntó algo que no está y lo declaró.',
        'Prueba 3: le planteé un error deliberado y me corrigió.',
      ],
    },
    puente: 'Usa el asistente esta semana y anota una respuesta buena, una mala y una dudosa: abren la clase 4.',
  },

  // ══════════════════════════════════════════════ CLASE 4 · APLICAR
  {
    n: 4,
    slug: 'clase-4',
    etiqueta: 'Aplicar',
    titulo: 'Investigación profunda, flujos de trabajo y control crítico',
    pregunta: '¿Cómo se junta todo en un flujo que resista un examen, y una firma?',
    objetivo:
      'Investigar con informes citados, redactar junto a la herramienta y verificar contra la fuente oficial antes de firmar.',
    producto: 'Tu flujo de trabajo documentado en seis pasos y la lista de verificación de citas.',
    word: '/descargas/fundamentos-clase-4.docx',
    bloques: [
      {
        id: 'deep',
        minutos: '0–25',
        titulo: 'Investigación profunda: un borrador documentado, no una fuente',
        sintesis:
          'En ChatGPT se llama «Investigación avanzada» (menú «+» del cuadro de texto); en Gemini, Deep Research (gratis con límites); Claude y Perplexity tienen lo suyo. El sistema investiga varios minutos y entrega un informe con fuentes enlazadas, que parece terminado sin estarlo: abre tres notas al azar y comprueba que digan lo que el informe les atribuye.',
        prompts: [
          {
            id: 'c4-deep',
            titulo: 'Encargo de investigación profunda (plantilla general)',
            texto:
              'Investiga [pregunta jurídica]. Reglas: (1) distingue siempre norma vigente, proyecto en trámite y mera propuesta; (2) cita cada afirmación con enlace a su fuente; (3) privilegia fuentes oficiales chilenas (bcn.cl, pjud.cl, senado.cl, camara.cl, diariooficial.interior.gob.cl) y señala la fecha de cada documento; (4) si las fuentes se contradicen, muestra la contradicción en vez de resolverla sola; (5) cierra con la lista de lo que no pudiste confirmar.',
          },
        ],
        enlaces: [
          { url: 'https://chatgpt.com', label: 'ChatGPT · «+» → Investigación avanzada' },
          { url: 'https://gemini.google.com', label: 'Gemini · Deep Research' },
          { url: 'https://claude.ai', label: 'Claude · Investigación' },
          { url: 'https://www.perplexity.ai', label: 'Perplexity' },
        ],
      },
      {
        id: 'lienzo',
        minutos: '25–45',
        titulo: 'Redactar junto a la herramienta: Canvas y artefactos',
        sintesis:
          'Para documentos, el chat se queda corto: Canvas (ChatGPT y Gemini) y los artefactos (Claude) abren el texto al costado y lo editan por selección, sin regenerarlo todo, con versiones. Selecciona solo el párrafo que quieres mejorar y pide el cambio sobre esa selección.',
      },
      {
        id: 'flujo',
        minutos: '45–70',
        titulo: 'El flujo completo en seis pasos',
        sintesis:
          'Delimitar (qué se delega y qué no: la decisión y el consejo, nunca) → investigar (con el encargo que exige fuentes) → verificar (cada cita contra la fuente) → redactar (por secciones, en el lienzo) → controlar (pasada adversarial) → responder (releer como autor: la firma es tuya).',
        prompts: [
          {
            id: 'c4-adversarial',
            titulo: 'Pasada adversarial sobre tu borrador (paso 5)',
            texto:
              'Te pego mi borrador. Atácalo como lo haría la contraparte: (1) ¿qué afirmaciones carecen de fundamento o cita? (2) ¿qué contraargumentos no estoy considerando? (3) ¿qué citas debería verificar primero por ser dudosas? (4) ¿dónde el tono daña la persuasión? No lo reescribas: solo critica, en lista numerada.',
          },
        ],
      },
      {
        id: 'verificacion',
        minutos: '70–95',
        titulo: 'Verificación: caza la cita falsa',
        sintesis:
          'Tres pistas: la norma se abre en Ley Chile (treinta segundos); el rol se busca en el Poder Judicial y se abre el texto (la causa puede existir y el extracto ser inventado); la doctrina se busca en el catálogo o SciELO. La verificación es personal e indelegable: que otra IA verifique no cuenta.',
        dato:
          'En el mejor registro disponible (derecho de EE. UU., sin internet), ningún modelo supera el 56 % de tareas de investigación jurídica correctas. Para derecho chileno ni siquiera existe la medición.',
        prompts: [
          {
            id: 'c4-cazador',
            titulo: 'Cazador de citas (extrae, tú verificas)',
            texto:
              'Del siguiente texto, extrae TODAS las citas verificables en una tabla: (1) normas con artículo; (2) sentencias con tribunal, rol y fecha; (3) doctrina con autor, obra y año. Agrega una columna «dónde verificar» (Ley Chile, buscador del Poder Judicial, catálogo de biblioteca). Yo haré la verificación; tú solo extrae y ordena.',
          },
        ],
        enlaces: [
          { url: 'https://www.bcn.cl/leychile', label: 'Ley Chile', nota: 'normas' },
          { url: 'https://www.pjud.cl', label: 'Poder Judicial', nota: 'sentencias' },
          { url: 'https://scielo.conicyt.cl', label: 'SciELO Chile', nota: 'doctrina' },
        ],
      },
      {
        id: 'opcional',
        minutos: 'Opcional',
        titulo: 'Módulo opcional: tu primera herramienta publicada',
        sintesis:
          'Para quien quiera cruzar al nivel «crear»: encarga una herramienta de un solo archivo HTML, pruébala, súbela a GitHub desde el navegador (sin terminal) y publícala gratis con Vercel. Terminas con una URL propia. Reglas: nunca datos de clientes en un repositorio, advertencia visible y el plan gratuito de Vercel es solo para uso personal.',
        prompts: [
          {
            id: 'c4-herramienta',
            titulo: 'Encargo de la herramienta (calculadora de plazos)',
            texto:
              'Hazme una herramienta en un solo archivo HTML (con su CSS y JavaScript incluidos) que funcione sin conexión y sin servicios externos: una calculadora de plazos para estudiantes de Derecho en Chile. Entradas: fecha inicial y número de días; opciones «días corridos» y «días hábiles», descontando los feriados de una tabla visible que yo pueda editar. Salida: la fecha de vencimiento y el detalle del cómputo, indicando los artículos del Código Civil que aplican como referencia que yo verificaré. Incluye al pie, siempre visible: «Herramienta educativa; no constituye asesoría jurídica». Diseño sobrio, en español.',
          },
        ],
        enlaces: [
          { url: 'https://github.com', label: 'GitHub', nota: 'New repository → Upload files' },
          { url: 'https://vercel.com', label: 'Vercel', nota: 'Continuar con GitHub → Deploy' },
          { url: 'https://choosealicense.com', label: 'Elegir licencia' },
        ],
      },
    ],
    protocolo: {
      titulo: 'Protocolo de la clase 4 · verificación de citas',
      items: [
        'Toda norma citada: abierta en Ley Chile y leída; el artículo dice lo que se le atribuye.',
        'Toda sentencia: rol encontrado y texto abierto; el extracto citado está en el fallo.',
        'Toda doctrina: autor y obra existen en el catálogo o SciELO; edición y año coinciden.',
        'Cifras y fechas: comprobadas contra la fuente original.',
        'Lo no verificado: eliminado o marcado como pendiente; nunca firmado.',
        'Mi flujo de seis pasos quedó escrito y aplicado a mi caso típico.',
      ],
    },
    puente:
      'El curso termina, el criterio queda: la IA redacta borradores; la fuente oficial es la única que confirma.',
  },
];

export function claseFundamentos(n: number): ClaseFundamentos | undefined {
  return clasesFundamentos.find(c => c.n === n);
}
