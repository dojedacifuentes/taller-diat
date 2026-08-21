// ─────────────────────────────────────────────────────────────────────────────
// BANCO DE CASOS PEDAGÓGICOS
//
// Reglas que gobiernan este archivo:
//   · Todos los casos son ficticios. No hay datos personales reales, causas
//     reales, expedientes ni información confidencial.
//   · Las fuentes jurídicas son públicas, oficiales y verificadas contra BCN /
//     LeyChile (identificadores comprobados el 21 de agosto de 2026).
//   · Los «traps» son errores que el caso induce deliberadamente para que el
//     estudiante los detecte. No son errores del material.
//   · La corrección jurídica del ejemplo sirve a la pedagogía: si un punto de
//     Derecho no aporta a enseñar prompting y verificación, no se complica.
// ─────────────────────────────────────────────────────────────────────────────
import type { LegalCase } from '@/lib/types';

/** Fecha en que se comprobó la vigencia de las fuentes citadas. */
export const SOURCES_CHECKED_ON = '21 de agosto de 2026';

const BCN = 'https://www.bcn.cl/leychile/navegar?idNorma=';

/**
 * Nota de vigencia que atraviesa varios casos y que es, en sí misma, contenido
 * del taller: una norma publicada no es todavía una norma vigente.
 */
export const VIGENCIA_NOTE =
  'La Ley 21.719, que crea el nuevo régimen de protección de datos personales y la Agencia de Protección de Datos, fue publicada el 13 de diciembre de 2024 y entra en vigencia el 1 de diciembre de 2026. Durante las fechas del taller (agosto y septiembre de 2026) está publicada pero NO vigente: el régimen aplicable sigue siendo la Ley 19.628. Un modelo de lenguaje suele confundir ambas cosas, y ese es exactamente el error que el taller enseña a detectar.';

export const cases: LegalCase[] = [
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'ct-01',
    code: 'CT-01',
    area: 'Consumidor y contratos de adhesión',
    title: 'La cláusula que se modifica sola',
    difficulty: 'Inicial',
    troncal: true,
    brief:
      'VeloUrbano SpA es una empresa ficticia que arrienda bicicletas por aplicación en Valparaíso. Sus términos y condiciones, que el usuario acepta con un solo clic, contienen esta cláusula: «El proveedor podrá modificar unilateralmente las tarifas, los plazos y las condiciones del servicio en cualquier momento, sin necesidad de aviso previo. El uso continuado de la aplicación constituye aceptación de las modificaciones. El usuario autoriza a VeloUrbano SpA a recopilar, tratar y comunicar a terceros sus datos de geolocalización, contactos y hábitos de desplazamiento, con fines comerciales presentes o futuros». Una usuaria reclama porque la tarifa por minuto subió un 40 % sin aviso.',
    objective:
      'Que el estudiante formule una consulta jurídica completa —jurisdicción, hechos, finalidad, fuentes, restricciones, formato y control— sobre un problema que parece simple, y descubra cuánta información faltaba en su primera versión.',
    traps: [
      'Pedir «¿es válida esta cláusula?» sin decir en qué jurisdicción, lo que produce una respuesta genérica o basada en Derecho extranjero.',
      'Aceptar una respuesta que afirme la nulidad sin distinguir entre la cláusula de modificación unilateral y la cláusula de datos, que se evalúan por vías distintas.',
      'Recibir una cita a un «artículo 16 bis letra h)» u otra numeración que suena plausible y no existe con ese contenido.',
      'Aplicar la Ley 21.719 como si estuviera vigente en agosto de 2026, cuando su vigencia comienza el 1 de diciembre de 2026.',
      'Confundir la respuesta fluida con una respuesta fundada: el texto puede estar bien escrito y no citar ninguna fuente real.',
    ],
    sources: [
      {
        label: 'Ley 19.496, sobre protección de los derechos de los consumidores — en especial arts. 16 y 17 (contratos de adhesión y cláusulas abusivas).',
        url: `${BCN}61438`,
        note: 'El art. 16 letra g) fija el parámetro general de abusividad por desequilibrio importante contrario a la buena fe.',
      },
      {
        label: 'Ley 19.628, sobre protección de la vida privada — régimen vigente al momento del taller.',
        url: `${BCN}141599`,
      },
      {
        label: 'Ley 21.719, sobre protección de datos personales — publicada el 13 de diciembre de 2024, vigente desde el 1 de diciembre de 2026.',
        url: 'https://www.bcn.cl/leychile/navegar?idLey=21719',
        note: 'Verificar siempre la fecha de entrada en vigencia antes de aplicarla.',
      },
    ],
    teacherNotes: [
      'El caso funciona porque la pregunta ingenua («¿es válida?») produce una respuesta que suena correcta. No adelantar la conclusión: dejar que el grupo la reciba y luego pedir que subrayen qué afirmaciones tienen fuente.',
      'Separar las dos preguntas en pizarra: (1) modificación unilateral sin aviso; (2) autorización amplia de tratamiento de datos. Son problemas distintos con fuentes distintas.',
      'Si algún equipo cita la Ley 21.719 como vigente, no corregirlo de inmediato: pedirle que verifique la fecha de entrada en vigencia en BCN. El descubrimiento vale más que la corrección.',
      'No se busca una respuesta única sobre la validez de la cláusula. Se busca que el equipo pueda decir qué verificó, contra qué fuente y qué quedó sin verificar.',
    ],
    arc: [
      {
        session: 1,
        task: 'Construir el prompt estructurado sobre la cláusula y completar la matriz de verificación con al menos tres afirmaciones contrastadas contra fuente oficial.',
      },
      {
        session: 2,
        task: 'Convertir el análisis en un flujo de seis casillas: entrada (texto de la cláusula) → tarea acotada → IA → fuente autorizada → control humano → salida y registro. Comparar dos variantes de instrucción.',
      },
      {
        session: 3,
        task: 'Traducir el problema a una ficha de desafío: quién es la persona usuaria (¿SERNAC? ¿una clínica jurídica? ¿la propia usuaria?), qué tarea concreta se apoya con tecnología y qué NO debe hacer la solución.',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'c-02',
    code: 'C-02',
    area: 'Laboral',
    title: 'La carta de despido incompleta',
    difficulty: 'Inicial',
    troncal: false,
    brief:
      'Una empresa ficticia de logística despide a una trabajadora invocando «necesidades de la empresa». La carta entregada dice únicamente: «Se pone término a su contrato por necesidades de la empresa, conforme a la ley». No indica hechos, no acompaña el estado de las cotizaciones previsionales y se entrega el mismo día del término. La trabajadora consulta qué puede hacer.',
    objective:
      'Que el estudiante distinga entre lo que la IA puede hacer bien —ordenar los hechos y listar qué exige la ley que contenga una carta— y lo que no puede hacer: decidir si el despido es o no justificado.',
    traps: [
      'Pedir a la IA que «diga si el despido es nulo», que es precisamente la decisión que no le corresponde tomar.',
      'Recibir plazos procesales afirmados con seguridad y sin fuente. Los plazos deben verificarse siempre en el texto legal.',
      'Aceptar una respuesta que mezcle la caducidad de la acción con la prescripción de los derechos laborales como si fueran lo mismo.',
    ],
    sources: [
      {
        label: 'Código del Trabajo (DFL 1 de 2002, Ministerio del Trabajo y Previsión Social) — en especial arts. 161, 162 y 168.',
        url: `${BCN}207436`,
        note: 'Verificar la versión vigente: el Código del Trabajo se modifica con frecuencia.',
      },
      {
        label: 'Dirección del Trabajo — dictámenes y normativa laboral.',
        url: 'https://www.dt.gob.cl/',
      },
    ],
    teacherNotes: [
      'Buen caso para mostrar la diferencia entre tarea delimitada («lista los requisitos formales que la ley exige a la comunicación de término») y tarea indebida («dime si gana el juicio»).',
      'Pedir explícitamente que la respuesta separe: hecho, requisito legal, fuente y lo que queda pendiente de verificación.',
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'c-03',
    code: 'C-03',
    area: 'Protección de datos',
    title: 'La base de datos que salió por correo',
    difficulty: 'Intermedio',
    troncal: false,
    brief:
      'Un centro médico ficticio envía por error una planilla con nombres, RUT, diagnósticos y teléfonos de 1.400 pacientes a una lista de correo externa. La dirección pregunta qué obligaciones tiene, si debe notificar a alguien y en qué plazo. La consulta se hace en septiembre de 2026.',
    objective:
      'Que el estudiante verifique la vigencia de la norma antes de aplicarla, y que compruebe que un modelo de lenguaje tiende a describir el régimen más nuevo o más comentado, no necesariamente el aplicable.',
    traps: [
      'Aplicar el deber de notificación de brechas de la Ley 21.719 como si estuviera vigente en septiembre de 2026. No lo está: rige desde el 1 de diciembre de 2026.',
      'Importar obligaciones del RGPD europeo —incluido el plazo de 72 horas— como si fueran Derecho chileno vigente.',
      'Tratar los datos de salud como datos personales comunes, sin advertir que son datos sensibles.',
    ],
    sources: [
      {
        label: 'Ley 19.628, sobre protección de la vida privada — régimen aplicable al momento de los hechos.',
        url: `${BCN}141599`,
      },
      {
        label: 'Ley 21.719, sobre protección de datos personales — publicada el 13 de diciembre de 2024, vigente desde el 1 de diciembre de 2026.',
        url: 'https://www.bcn.cl/leychile/navegar?idLey=21719',
      },
    ],
    teacherNotes: [
      'Este es el caso más eficaz para enseñar vigencia. Pedir al equipo que escriba en la matriz, para cada obligación afirmada, la fecha desde la cual esa obligación existe.',
      'Recordar la regla transversal del taller: nunca pegar datos reales de pacientes ni de nadie. El caso es ficticio y así debe permanecer.',
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'c-04',
    code: 'C-04',
    area: 'Propiedad intelectual',
    title: 'La campaña ilustrada por una IA',
    difficulty: 'Intermedio',
    troncal: false,
    brief:
      'Una agencia ficticia entrega a su cliente una campaña gráfica cuyas ilustraciones fueron generadas íntegramente con una herramienta de IA a partir de instrucciones escritas por una diseñadora. El contrato dice que la agencia «cede al cliente todos los derechos de autor sobre las obras entregadas». El cliente pregunta si efectivamente adquiere esos derechos y si puede impedir que un tercero use imágenes casi idénticas.',
    objective:
      'Que el estudiante identifique una pregunta donde la respuesta correcta incluye reconocer incertidumbre, y que exija a la IA declarar expresamente qué no puede afirmar.',
    traps: [
      'Aceptar una afirmación categórica sobre la titularidad de obras generadas por IA, cuando la cuestión no está zanjada de ese modo en el Derecho chileno.',
      'Recibir jurisprudencia chilena inventada sobre obras generadas por IA.',
      'Confundir la validez de la cláusula contractual con la existencia del derecho que se pretende ceder.',
    ],
    sources: [
      {
        label: 'Ley 17.336, sobre propiedad intelectual.',
        url: `${BCN}28933`,
      },
      {
        label: 'Instituto Nacional de Propiedad Industrial (INAPI).',
        url: 'https://www.inapi.cl/',
      },
    ],
    teacherNotes: [
      'Caso ideal para la capa «control» del prompt: exigir que el modelo distinga afirmación textual de la ley, inferencia propia y recomendación.',
      'Si un equipo obtiene una sentencia chilena citada con rol y año, pedirle que la busque en el buscador del Poder Judicial. La búsqueda fallida enseña más que la advertencia.',
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'c-05',
    code: 'C-05',
    area: 'Administrativo y transparencia',
    title: 'La solicitud que nadie respondió',
    difficulty: 'Intermedio',
    troncal: false,
    brief:
      'Una organización ficticia solicita a un municipio copia de los informes técnicos que fundaron una autorización de obra. Han pasado más de dos meses sin respuesta y sin prórroga comunicada. La organización pregunta qué vías tiene y qué plazos corren.',
    objective:
      'Que el estudiante compruebe qué tan fácil es que un modelo mezcle regímenes de plazos distintos, y aprenda a pedir que cada plazo venga con su artículo y su fuente.',
    traps: [
      'Mezclar los plazos del procedimiento administrativo general con los del procedimiento especial de acceso a la información pública.',
      'Afirmar el efecto del silencio administrativo sin distinguir entre silencio positivo y negativo.',
      'Citar plazos en «días» sin precisar si son hábiles o corridos.',
    ],
    sources: [
      {
        label: 'Ley 19.880, que establece bases de los procedimientos administrativos que rigen los actos de los órganos de la Administración del Estado.',
        url: `${BCN}210676`,
      },
      {
        label: 'Consejo para la Transparencia — normativa y decisiones.',
        url: 'https://www.consejotransparencia.cl/',
      },
    ],
    teacherNotes: [
      'Exigir en el formato de salida una tabla con columnas: plazo, artículo, norma, hábil o corrido, fuente consultada. La tabla obliga a que la IA muestre dónde no tiene respaldo.',
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'c-06',
    code: 'C-06',
    area: 'Civil y contratos',
    title: 'La maquinaria que llegó fallada',
    difficulty: 'Avanzado',
    troncal: false,
    brief:
      'Una panadería ficticia compra un horno industrial usado. A las tres semanas el horno presenta un desperfecto que impide alcanzar la temperatura necesaria. El vendedor sostiene que se vendió «en las condiciones en que se encuentra» y que el comprador lo revisó antes de comprar. La panadería pregunta qué puede exigir.',
    objective:
      'Que el estudiante diseñe un flujo de varios pasos —ordenar hechos, identificar preguntas jurídicas, buscar fuentes, analizar, verificar— en lugar de una sola pregunta larga.',
    traps: [
      'Pedir todo de una vez y recibir un texto que mezcla resolución del contrato, indemnización y vicios redhibitorios sin distinguir supuestos ni requisitos.',
      'Aceptar plazos de prescripción afirmados sin artículo.',
      'Pasar por alto que los hechos disponibles son insuficientes para concluir, y no pedir que la IA declare qué información falta.',
    ],
    sources: [
      {
        label: 'Código Civil (DFL 1 de 2000, Ministerio de Justicia) — en especial las reglas sobre obligaciones del vendedor y vicios redhibitorios.',
        url: `${BCN}172986`,
      },
      {
        label: 'Poder Judicial de Chile — buscador de causas y jurisprudencia.',
        url: 'https://www.pjud.cl/',
      },
    ],
    teacherNotes: [
      'Es el caso más exigente del banco. Reservarlo para equipos que terminen antes o para la sesión 2, donde la separación en pasos es el aprendizaje central.',
      'Buen momento para introducir la pregunta que cierra la sesión 2: ¿en qué punto de este flujo una persona debe decidir antes de continuar?',
    ],
  },
];

export const troncalCase = cases.find(c => c.troncal)!;
export const supportCases = cases.filter(c => !c.troncal);

export function caseByCode(code: string): LegalCase | undefined {
  return cases.find(c => c.code === code);
}

/** Casos sugeridos por sesión, sin excluir que un equipo mantenga el suyo. */
export const casesBySession: Record<number, string[]> = {
  1: ['CT-01', 'C-02', 'C-03'],
  2: ['CT-01', 'C-05', 'C-06'],
  3: ['CT-01', 'C-03', 'C-04'],
};
