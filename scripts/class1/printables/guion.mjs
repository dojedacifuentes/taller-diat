// ─────────────────────────────────────────────────────────────────────────────
// GUION DOCENTE DE SALA · CLASE 1 · v2.2
//
// Sustituye al v2.1. Aquel tenía 28 páginas y describía una plataforma de diez
// bloques que ya no existe. Este describe la de cinco etapas, con el reparto
// nuevo —51 minutos de conducción, 39 de plataforma— y en la mitad de espacio.
//
// Criterio editorial, heredado de la Especificación v2.0:
//   Si el profesor necesita decirlo        → aquí.
//   Si el estudiante necesita verlo        → diapositiva.
//   Si el estudiante necesita decidirlo    → plataforma.
//   Si el estudiante necesita conservarlo  → manual o ficha.
//
// El texto entre comillas se lee de corrido. Lo que va [entre corchetes] es
// acción y no se pronuncia. Las notas al margen son para el que conduce: si
// alguna hace gracia, mejor, pero están ahí porque son verdad.
//
// El contenido canónico se importa; no se escribe a mano.
// ─────────────────────────────────────────────────────────────────────────────
import { COLORS, baseCSS } from './theme.mjs';

const S = `
  /* El guion se lee de pie, en una sala, a un metro de los ojos: la letra no
     baja de 8,5 pt por mucho que se quiera acortar. Lo que se recorta es
     texto, no cuerpo. */
  body { font-size: 8.6pt; line-height: 1.36; }
  /* Sin min-height: cada tramo ocupa lo que necesita en lugar de reservar una
     página entera y dejarla a medias. */
  .page { height: auto; overflow: visible; }
  .page + .page { page-break-before: always; }
  .tramo, .qa, .aside, .ref { break-inside: avoid; }

  h1 { font-size: 17pt; line-height: 1.04; letter-spacing: -.02em; }

  /* Cabecera de tramo: barra de color según quién trabaja. */
  .tramo { margin-top: 5mm; break-inside: avoid; }
  .tramo-head {
    display: flex; align-items: baseline; gap: 2.4mm;
    border-left: 1.4mm solid ${COLORS.crimson};
    background: ${COLORS.wash};
    padding: 1.6mm 2.4mm; border-radius: 0 1mm 1mm 0;
  }
  .tramo-head.alumno { border-left-color: #1F5F8B; }
  .tramo-n {
    font-family: Consolas, "Courier New", monospace;
    font-size: 7pt; font-weight: 700; color: ${COLORS.crimson}; flex: none;
  }
  .tramo-head.alumno .tramo-n { color: #1F5F8B; }
  .tramo-t { font-size: 10.5pt; font-weight: 700; letter-spacing: -.01em; flex: 1; }
  .tramo-clock {
    font-family: Consolas, "Courier New", monospace;
    font-size: 7.4pt; font-weight: 700; color: ${COLORS.ink}; flex: none;
  }
  .tramo-min { font-size: 6.4pt; color: ${COLORS.gray}; flex: none; }
  .tramo-meta {
    font-size: 6.4pt; color: ${COLORS.gray}; margin: 1mm 0 0 3.8mm; line-height: 1.3;
  }

  /* Marca de diapositiva. */
  .slide {
    display: inline-flex; align-items: baseline; gap: 1.4mm;
    font-family: Consolas, "Courier New", monospace;
    font-size: 6.4pt; font-weight: 700; letter-spacing: .1em;
    color: ${COLORS.white}; background: ${COLORS.ink};
    padding: .5mm 1.6mm; border-radius: .6mm;
    margin: 3mm 0 1.4mm;
  }

  /* Lo que se dice. */
  p.say { margin: 0 0 2mm; }
  p.say + p.say { margin-top: -.6mm; }

  /* Acción, no discurso. */
  .do {
    font-family: Consolas, "Courier New", monospace;
    font-size: 7pt; color: ${COLORS.gray};
    background: ${COLORS.wash}; border-radius: .8mm;
    padding: 1mm 1.8mm; margin: 0 0 2mm; display: block;
  }

  /* Llamada a la plataforma. */
  .plat {
    border: .35mm solid #1F5F8B; border-left: 1.4mm solid #1F5F8B;
    border-radius: 0 1mm 1mm 0; background: #F0F5F9;
    padding: 1.8mm 2.4mm; margin: 2.4mm 0;
  }
  .plat-h {
    font-family: Consolas, "Courier New", monospace;
    font-size: 6.4pt; font-weight: 700; letter-spacing: .12em;
    color: #1F5F8B; text-transform: uppercase;
  }
  .plat-r {
    font-family: Consolas, "Courier New", monospace;
    font-size: 8pt; font-weight: 700; color: ${COLORS.ink}; margin-top: .8mm;
  }
  .plat-d { font-size: 7pt; color: ${COLORS.ink}; margin-top: 1mm; line-height: 1.3; }

  /* Frase ancla. */
  .anchor-line {
    text-align: center; font-size: 11pt; font-weight: 700; letter-spacing: -.01em;
    color: ${COLORS.crimson};
    border-top: .3mm solid ${COLORS.crimson}; border-bottom: .3mm solid ${COLORS.crimson};
    padding: 1.8mm 0; margin: 3mm 0 2mm;
  }

  /* Transición al tramo siguiente. */
  .trans {
    font-size: 7pt; font-style: italic; color: ${COLORS.gray};
    border-left: .3mm solid ${COLORS.rule}; padding-left: 2.4mm; margin: 2mm 0 0;
  }

  /* Nota al conductor. Aquí vive el humor, y siempre dice algo útil. */
  .aside {
    display: flex; gap: 2mm; align-items: flex-start;
    font-size: 6.8pt; line-height: 1.32; color: ${COLORS.ink};
    background: ${COLORS.white}; border: .25mm dashed ${COLORS.rule};
    border-radius: 1mm; padding: 1.4mm 2mm; margin: 2mm 0;
  }
  .aside-tag {
    font-family: Consolas, "Courier New", monospace;
    font-size: 5.6pt; font-weight: 700; letter-spacing: .1em;
    color: ${COLORS.crimson}; flex: none; padding-top: .3mm;
  }

  /* Si preguntan. */
  .qa { margin-top: 2.4mm; }
  .qa-h {
    font-family: Consolas, "Courier New", monospace;
    font-size: 6pt; font-weight: 700; letter-spacing: .12em;
    color: ${COLORS.gray}; text-transform: uppercase; margin-bottom: 1mm;
  }
  .qa-i { display: flex; gap: 2mm; margin-bottom: .9mm; align-items: baseline; }
  .qa-q { font-size: 6.8pt; font-weight: 700; flex: none; width: 46mm; color: ${COLORS.ink}; }
  .qa-a { font-size: 6.8pt; color: ${COLORS.gray}; line-height: 1.28; flex: 1; }

  /* Tablas de referencia. */
  .ref { width: 100%; border-collapse: collapse; margin-top: 1.6mm; }
  .ref th {
    background: ${COLORS.ink}; color: ${COLORS.white};
    font-family: Consolas, "Courier New", monospace;
    font-size: 5.8pt; letter-spacing: .08em; padding: 1mm 1.4mm; text-align: left;
  }
  .ref td {
    border-bottom: .2mm solid ${COLORS.ruleSoft};
    font-size: 6.8pt; padding: 1.1mm 1.4mm; vertical-align: top;
  }
  .ref td.mono { font-family: Consolas, "Courier New", monospace; font-size: 6.2pt; white-space: nowrap; }

  .cover-rule { height: .8mm; background: ${COLORS.crimson}; margin: 3mm 0; }
`;

/** Nota al conductor. Es donde el guion se permite tener carácter. */
function aside(tag, text) {
  return `<div class="aside"><span class="aside-tag">${tag}</span><span>${text}</span></div>`;
}

function slide(n, title) {
  return `<div class="slide">${String(n).padStart(2, '0')} · ${title}</div>`;
}

function say(...ps) {
  return ps.map(p => `<p class="say">${p}</p>`).join('');
}

function doing(text) {
  return `<div class="do">[${text}]</div>`;
}

function plataforma(ruta, minutos, detalle) {
  return `<div class="plat">
    <div class="plat-h">Plataforma · ${minutos} min · circula y calla</div>
    <div class="plat-r">${ruta}</div>
    <div class="plat-d">${detalle}</div>
  </div>`;
}

function anchor(text) {
  return `<div class="anchor-line">${text}</div>`;
}

function trans(text) {
  return `<p class="trans">→ ${text}</p>`;
}

function qa(items) {
  return `<div class="qa"><div class="qa-h">Si preguntan</div>${items
    .map(([q, a]) => `<div class="qa-i"><span class="qa-q">«${q}»</span><span class="qa-a">${a}</span></div>`)
    .join('')}</div>`;
}

function tramo({ n, title, clock, min, meta, alumno = false }) {
  return `<div class="tramo">
    <div class="tramo-head ${alumno ? 'alumno' : ''}">
      <span class="tramo-n">${n}</span>
      <span class="tramo-t">${title}</span>
      <span class="tramo-clock">${clock}</span>
      <span class="tramo-min">${min} min</span>
    </div>
    <div class="tramo-meta">${meta}</div>
  </div>`;
}

export function guionHTML({ canon, logoDiat, logoEscuela }) {
  const { meta, diatComponents, icjrPhases, epistemicStatuses, warningSignals, errorTypes } = canon;

  const portada = `<section class="page">
    <div style="display:flex;align-items:center;gap:4mm">
      <img src="${logoDiat}" alt="Programa DIAT · PUCV" style="height:20mm;width:auto;flex:none">
      <div style="flex:1">
        <div class="kicker">Programa DIAT · Escuela de Derecho PUCV</div>
        <h1 style="margin-top:1.2mm">Guion docente de sala<br>Clase 1</h1>
        <div style="font-size:8.4pt;color:${COLORS.gray};margin-top:1.6mm">
          Del prompt aislado al razonamiento jurídico asistido<br>
          ${meta.date} · 15:00–16:30
        </div>
      </div>
      <div style="text-align:right;flex:none">
        <div class="mono" style="font-size:20pt;font-weight:700;color:${COLORS.crimson};line-height:1">v2.2</div>
        <div class="tiny muted" style="margin-top:1mm">Sustituye a v2.1</div>
      </div>
    </div>

    <div class="cover-rule"></div>

    <div class="row" style="gap:4mm">
      <div class="col" style="flex:1.15">
        <div class="sec"><span class="sec-n">1</span><span class="sec-t">Qué cambió desde la versión anterior</span></div>
        <p class="say" style="font-size:7.6pt">
          La plataforma dejó de ser un manual interactivo de diez bloques y pasó a ser una superficie
          de ejecución de cinco etapas. La teoría volvió a donde siempre debió estar: a esta hoja y a
          la pantalla de proyección. El estudiante ya no lee en el teléfono lo que tú estás
          explicando en voz alta.
        </p>
        <table class="ref">
          <tr><th>&nbsp;</th><th>Antes</th><th>Ahora</th></tr>
          <tr><td>Conducción</td><td class="mono">32 min</td><td class="mono">51 min</td></tr>
          <tr><td>Plataforma</td><td class="mono">58 min</td><td class="mono">39 min</td></tr>
          <tr><td>Puntos de plataforma</td><td class="mono">10</td><td class="mono">5</td></tr>
        </table>
        ${aside('OJO', 'Hablas más que antes. No es un descuido: es que los alumnos dejaron de leer teoría en una pantalla de seis pulgadas mientras tú la explicabas en una de cien.')}
      </div>

      <div class="col">
        <div class="sec"><span class="sec-n">2</span><span class="sec-t">Las cinco etapas</span></div>
        <table class="ref">
          <tr><th>Ruta</th><th>Qué hace el alumno</th></tr>
          <tr><td class="mono">/clase-1</td><td>Responde «¿quién falló?»</td></tr>
          <tr><td class="mono">/prompt</td><td>Construye su encargo</td></tr>
          <tr><td class="mono">/auditoria</td><td>Lo audita en su IA</td></tr>
          <tr><td class="mono">/verificacion</td><td>Comprueba una afirmación</td></tr>
          <tr><td class="mono">/cierre</td><td>Vuelve a la pregunta y entrega</td></tr>
        </table>
        <p class="say" style="font-size:7pt;margin-top:1.6mm">
          Las rutas antiguas <span class="mono">/b00…/b09</span> redirigen. Si un alumno llega con un
          enlace viejo, aterriza donde debe.
        </p>
      </div>
    </div>

    <div class="sec" style="margin-top:4mm"><span class="sec-n">3</span><span class="sec-t">Antes de entrar a la sala</span></div>
    <table class="ref">
      <tr><th style="width:38mm">Ítem</th><th>Comprobación</th></tr>
      <tr><td><strong>Documento de trabajo</strong></td><td>Descargado, proyectable, con secciones numeradas y texto disponible para pegar. Sin numeración no hay localizadores, y sin localizadores el bloque de verificación se cae.</td></tr>
      <tr><td><strong>Cuaderno de Gemini Notebook</strong></td><td>Creado, con el documento como única fuente. Las cinco preguntas de la demostración, probadas <em>hoy</em>.</td></tr>
      <tr><td><strong>Plataforma</strong></td><td><span class="mono">/clase-1</span> abierta en el computador y probada en un teléfono. La mitad del curso trabajará desde el móvil.</td></tr>
      <tr><td><strong>Impresos</strong></td><td>Diez copias de la <strong>Ruta analógica</strong> (2 pp.) para quien llegue sin dispositivo, y la <strong>Ficha de Clase 1</strong> (2 pp.) para repartir al final. Ambas se descargan desde <span class="mono">/clase-1</span>.</td></tr>
      <tr><td><strong>Capturas de respaldo</strong></td><td>De las dos demostraciones, con la respuesta esperada incluida.</td></tr>
      <tr><td><strong>QR o enlace</strong></td><td>Proyectable desde el primer minuto.</td></tr>
    </table>
    ${aside('PLAN B', 'Si la plataforma no carga para nadie, reparte la Ruta analógica y sigue exactamente el mismo guion: la hoja tiene las mismas decisiones en el mismo orden. Si tampoco tienes las copias, te queda la voz. En ese orden de degradación.')}

    <div class="sec" style="margin-top:4mm"><span class="sec-n">4</span><span class="sec-t">Cómo se lee este guion</span></div>
    <table class="ref">
      <tr><td style="width:38mm"><span class="slide" style="margin:0">07 · TÍTULO</span></td><td>Barra oscura: diapositiva proyectada. Hablas tú.</td></tr>
      <tr><td><span class="mono" style="color:#1F5F8B;font-weight:700">PLATAFORMA · …</span></td><td>Barra azul: los alumnos trabajan. Circulas y no explicas.</td></tr>
      <tr><td><span class="mono">[EN CORCHETES]</span></td><td>Acción. No se pronuncia.</td></tr>
      <tr><td><span class="crimson b">FRASE ANCLA</span></td><td>Se dice tal cual y se deja respirar. Son ocho en toda la clase.</td></tr>
      <tr><td><span class="mono" style="font-size:5.6pt;color:${COLORS.crimson}">OJO / PLAN B / …</span></td><td>Nota para ti. No se lee en voz alta, aunque alguna tenga gracia.</td></tr>
    </table>

    ${foot(logoEscuela)}
  </section>`;

  const p1 = `<section class="page">
    ${tramo({ n: 'B00', title: 'Una cita perfecta que no existe', clock: '15:00–15:08', min: 8, alumno: true, meta: 'Slides 01–05 · Plataforma: <span class="mono">/clase-1</span> · Cierra cuando cada uno confirmó respuesta y confianza.' })}

    ${slide(1, 'PORTADA · REGLA DE AULA · QR')}
    ${say(
      '«Buenas tardes. Noventa minutos exactos, y empiezo por una regla que rige toda la sesión y que yo mismo voy a cumplir en pantalla: no subimos a ninguna herramienta datos personales, antecedentes de clientes ni expedientes privados. Todo lo que se abra hoy es material público o anonimizado. Si me ven a mí abriendo algo que no debería, me lo dicen.»',
      '«Segunda cosa: hoy no van a escucharme noventa minutos. Van a trabajar ustedes. Abran ahora clase uno en la plataforma y déjenla abierta.»',
    )}
    ${doing('esperar 30 segundos · no avanzar hasta ver teléfonos y pantallas abiertas')}
    ${aside('SIN DISPOSITIVO', 'Al que levante la mano, entrégale la Ruta analógica sin ceremonia. No es una versión pobre: es la misma secuencia en papel. Tratarlo como excepción es lo único que lo convertiría en una.')}

    ${slide(2, 'FICHA BIBLIOGRÁFICA FALSA')}
    ${say('«Miren esta referencia cinco segundos. Nada más que mirarla.»')}
    ${doing('pausa de 5 segundos')}
    ${say('«¿Hay algo aquí que les parezca sospechoso?»')}
    ${doing('esperar respuestas · 15 segundos · no corregir ninguna')}
    ${say('«Autor plausible. Editorial verosímil. Año razonable. Un título que encaja con el argumento que uno quería sostener… encaja demasiado bien, quizá. Y la respuesta honesta es: no, a simple vista no tiene nada de sospechosa. Ese es exactamente el problema. El libro no existe.»')}

    ${slide(3, '¿QUIÉN FALLÓ? · CINCO OPCIONES')}
    ${say('«Entonces la pregunta de la clase, y la quiero respondida por cada uno, no a mano alzada. Un escrito contiene una cita doctrinal perfectamente formateada: autor, título, año, y una tesis que calza con nuestro argumento. El problema es que el libro no existe. ¿Dónde está el fallo?»')}
    ${plataforma('/clase-1', 3, 'Elegir opción, declarar confianza y confirmar. No adelantes ninguna respuesta ni des pistas.')}
    ${say('«Quedó registrado. A las cuatro y veinte vamos a volver a esta misma pregunta y van a ver su propia respuesta de ahora al lado de la de entonces. Por eso no se puede editar.»')}
    ${aside('SI SE EQUIVOCAN', 'La respuesta se bloquea al confirmarla, y es deliberado. Si alguien confirmó sin querer, en la pantalla de cierre hay «Empezar la Clase 1 de nuevo». Borra todo, así que úsalo solo si de verdad hace falta.')}
    ${qa([['¿Y si creo que son varias?', 'Está la opción. Pero elijan la que más pese y defiéndanla mentalmente. «Todas las anteriores» es demasiado cómodo.']])}

    ${slide(4, 'CUATRO TRIBUNALES, SIETE MESES, 2026')}
    ${say(
      '«Esto no es un experimento mío. El 22 de abril de este año la Tercera Sala de la Corte Suprema sancionó a una abogada por presentar en un recurso de casación obras atribuidas a dos profesores chilenos que ninguna editorial publicó. Un mes de suspensión y cinco UTM. La comunicación oficial del Poder Judicial atribuye esas citas, con todas sus letras, a un chatbot de inteligencia artificial.»',
      '«Y miren la tabla, porque no es un caso desafortunado. Enero, Segundo Juzgado Civil de Concepción. Marzo, Tribunal de Defensa de la Libre Competencia. Abril, la Corte Suprema. Julio, Tribunal Constitucional — y en ese último la resolución no menciona IA, y conviene decirlo con precisión. Cuatro sedes distintas en siete meses. Un caso es una desgracia; cuatro resoluciones son un estándar formándose delante de nosotros.»',
    )}
    ${doing('pausa 2 segundos')}
    ${say('«Fíjense en algo: la sanción no recayó sobre la herramienta. Recayó sobre la persona que firmó.»')}
    ${aside('TONO', 'No conviertas la tabla en una galería de escarmiento. El curso no necesita miedo, necesita método. El miedo produce gente que no usa la herramienta y miente sobre ello.')}

    ${slide(5, 'PROMPT → RESPUESTA NO BASTA')}
    ${say('«El taller se llama Del prompt aislado al razonamiento jurídico asistido. No significa que la IA razone jurídicamente: no lo hace. Significa abandonar este esquema de dos casillas y reemplazarlo por este otro: tarea, instrucción, contexto y fuentes, respuesta, verificación, decisión humana. El razonamiento sigue siendo nuestro; la IA ocupa un lugar acotado adentro.»')}
    ${anchor('La IA no comparece ante el tribunal.')}
    ${trans('Para saber quién falló necesitamos entender qué hace exactamente el sistema, y sobre todo qué no hace. Diez minutos, lo mínimo indispensable, sin matemáticas.')}

    ${tramo({ n: 'B01', title: 'Qué hace un modelo de lenguaje', clock: '15:08–15:18', min: 10, meta: 'Slides 06–08 · Sin plataforma · Hablas tú y haces una demostración de 60 segundos.' })}

    ${slide(6, 'QUÉ HACE UN MODELO DE LENGUAJE')}
    ${say(
      '«Primera distinción, y es la más barata. Inteligencia artificial no es lo mismo que inteligencia artificial generativa. La generativa produce contenido nuevo a partir de patrones aprendidos y del contexto que recibe. Hoy hablamos solo de la segunda.»',
      '«Segunda distinción, y esta sí les va a cambiar cosas. Un modelo recibe una entrada, la representa internamente, usa el contexto disponible y genera una continuación probable. Eso es el modelo. Pero ustedes nunca abren un modelo: abren un producto.»',
    )}

    ${slide(7, 'EL MODELO NO ES EL PRODUCTO')}
    ${say('«ChatGPT, Gemini, Claude son el modelo más una capa de cosas alrededor: búsqueda web, lectura de archivos, memoria, instrucciones que ustedes no ven. ¿Por qué les importa profesionalmente? Porque cuando alguien dice "me buscó jurisprudencia y me la inventó", a veces falla el modelo y a veces es que el producto no tenía la búsqueda activada. Son diagnósticos distintos y se corrigen distinto.»')}
    ${doing('abrir la herramienta · no adjuntar nada · pedir jurisprudencia reciente sobre una materia acotada · no leer la respuesta completa en voz alta')}
    ${say(
      '«Miren la forma antes que el contenido. Está bien escrita. Está estructurada. Tiene tono de autoridad. Y ahora la única pregunta que importa: ¿cómo sabemos de dónde salió cada una de estas afirmaciones?»',
      '«Fíjense, porque este es el punto: yo no les estoy mostrando una respuesta equivocada. Ni siquiera hace falta que haya un error. Basta con que no podamos saber. Un texto cuya procedencia no podemos rastrear no es utilizable en trabajo jurídico, aunque cada frase sea verdadera.»',
    )}
    ${aside('SI SALE BIEN', 'Si la demostración devuelve citas con enlaces que abren, no la descartes: aprovéchala. «Perfecto, esto adelanta el bloque de las cuatro: que el enlace abra no significa que el documento diga lo que la respuesta afirma.»')}

    ${slide(8, 'FLUIDEZ ≠ VERDAD')}
    ${say('«Cuatro capacidades, cuatro límites, y están en pantalla, así que no se las voy a leer. Me interesa el patrón: cada capacidad viene con un límite que no se resuelve usándola mejor.»')}
    ${say('«Y una última cosa. ¿A cuántos les ha pasado que hacen la misma pregunta dos veces y llegan dos respuestas distintas? Cuatro causas, y ninguna es que el sistema esté de mal humor: muestreo probabilístico, contexto efectivo que cambia sin avisar, herramientas que dependen de lo que la web devuelva ese día, y actualizaciones del proveedor. La consecuencia práctica es una sola: si el resultado va a sostener algo, guarden la salida. No confíen en poder regenerarla.»')}
    ${aside('HUMOR NEGRO', 'El sistema no miente. Mentir exige saber qué es verdad y decidir decir otra cosa. Lo que hace es peor y más barato: no distingue. Si quieres una frase para el pasillo: «no es un testigo que miente, es un testigo que no sabe que está declarando».')}
    ${anchor('Fluidez ≠ verdad.')}
    ${trans('Antes de aprender a instruir, conviene desmontar cinco cosas que casi todos damos por ciertas. Cuatro minutos. Aquí equivocarse es gratis.')}

    ${foot(logoEscuela)}
  </section>`;

  const p2 = `<section class="page">
    ${tramo({ n: 'B02', title: 'Cinco mitos', clock: '15:18–15:22', min: 4, meta: 'Slide 09 · Sin plataforma · Mano alzada y explicación en voz alta.' })}

    ${slide(9, 'CINCO MITOS')}
    ${say('«Cinco afirmaciones. Verdadero, falso o depende. A mano alzada, y sin mirar al vecino. Aquí equivocarse no cuesta nada; en tres meses, sí.»')}
    ${doing('leer cada afirmación · pedir manos · explicar recién después de ver el reparto')}
    ${say(
      '«Me interesan dos cosas. La primera: el mito tres —"si subo la sentencia original, la IA ya no puede equivocarse"— es el más importante de los cinco y el que más gente vota mal, porque es casi verdadero. Delimitar la fuente reduce el problema de la procedencia. No elimina la mala interpretación, ni la omisión, ni la inferencia que el sistema no declara. A las cuatro y cuarto vamos a ver esto en vivo y va a ser incómodo.»',
      '«La segunda: los cinco apuntan al mismo lugar. Ninguno se corrige escribiendo prompts más elaborados. Instruir mejor y verificar son dos actividades distintas y no se compensan entre sí. Si se llevan una sola cosa de la clase, que sea esa.»',
    )}
    ${aside('LECTURA DEL CURSO', 'Si la mayoría acierta el mito 3, súbeles la apuesta: «buen curso; entonces les hago la clase más difícil: el problema no es si lo saben, es si lo aplican cuando la respuesta viene con citas que abren».')}
    ${anchor('Un buen prompt reduce decisiones implícitas.')}
    ${trans('Si no hay prompt mágico ni herramienta infalible, la pregunta útil es más modesta: ¿qué necesita saber un sistema para ejecutar razonablemente bien un encargo jurídico?')}

    ${tramo({ n: 'B03', title: 'Las siete preguntas DIAT', clock: '15:22–15:28', min: 6, meta: 'Slides 10–12 · Sin plataforma · El diagnóstico se hace con el curso, en voz alta.' })}

    ${slide(10, 'LAS 7 PREGUNTAS DIAT')}
    ${say('«Empiezo por una advertencia contra el contenido que voy a enseñar. Las guías institucionales que existen hoy no convergen en una sintaxis universal, y lo dicen ellas mismas. La Academia Judicial propone rol o contexto, objetivo, detalles, restricciones y formato. La ayuda de Google para construir Gems recomienda cuatro elementos. Coinciden bastante. Y ninguna de las dos incorpora fuentes ni control.»')}
    ${say(`«Nosotros usamos siete: ${diatComponents.map(c => c.label.toLowerCase()).join(', ')}. Los dos que faltaban en las otras guías son justamente los dos que agregamos, y no por afán de completitud. Las guías generalistas están diseñadas para tareas donde el costo del error es bajo. En trabajo jurídico hay dos decisiones que cambian el resultado entero: <strong>fuentes</strong>, porque en Derecho la autoridad de lo que se afirma depende de dónde viene; y <strong>control</strong>, porque necesitamos que la salida sea auditable antes de decidir si la usamos.»`)}
    ${aside('OJO', 'Son siete preguntas de diseño, no siete casillas. Si alguien las anota como checklist habrá aprendido justo lo contrario. Dilo antes de que pase, no después.')}

    ${slide(11, 'SON PREGUNTAS DE DISEÑO, NO CASILLAS')}
    ${say('«Miren el prompt en pantalla: "Resume esta sentencia y dime qué implicancias tiene para un caso parecido que estoy viendo". Es el prompt que cualquiera de nosotros escribiría un martes a las siete de la tarde. Vamos a desarmarlo entre todos, y no vamos a reescribirlo.»')}
    ${doing('recorrer los componentes con el curso · 3 o 4 intervenciones, no las siete')}
    ${say('«¿De qué fuente puede tomar información? ¿Qué debería hacer si el dato no aparece? Y la pregunta que decide el ejercicio: eso que falta, ¿hace daño que falte, o da igual? Porque una omisión puede ser la decisión correcta. No buscamos siete de siete.»')}
    ${say('«Se los pregunto al revés: si tuvieran que escribir el prompt en un ascensor, ¿cuál de los siete eliminarían primero?»')}
    ${doing('esperar · la respuesta esperada es «el rol» · no más de 15 segundos')}

    ${slide(12, 'NO TODOS LOS PROMPTS NECESITAN TODO')}
    ${say('«La regla que evita que todo esto se convierta en un ritual: la complejidad del prompt debe ser proporcional al riesgo de la tarea. Riesgo bajo —corregir ortografía, pasar un texto a tabla—: tarea y formato, nada más. Agregarle componentes a un prompt de riesgo bajo lo empeora, y quiero que se lleven esa frase tal cual.»')}
    ${say('«Y control tiene siete instrucciones que un jurista debería tener memorizadas. Están en pantalla, en la ficha que les voy a repartir y en el manual. No las copien ahora.»')}
    ${qa([
      ['¿Hay que poner los siete siempre?', 'No. Es la pregunta que la regla de proporcionalidad existe para responder.'],
      ['¿Sirve decirle que es abogado experto?', 'Poco, y genera falsa confianza. No confiere expertise: ni matrícula, ni experiencia, ni responsabilidad disciplinaria.'],
      ['¿Y si le pido que no invente y aun así inventa?', '«No inventes» explicita el estándar; no es un mecanismo de cumplimiento. El sistema no contrasta sus afirmaciones con un registro externo porque se lo pidamos.'],
    ])}
    ${anchor('Son siete preguntas de diseño, no siete casillas obligatorias.')}
    ${trans('Tienen siete preguntas. Ahora las van a usar sobre algo suyo. Este es el bloque más largo de la clase y el que más importa.')}

    ${foot(logoEscuela)}
  </section>`;

  const p3 = `<section class="page">
    ${tramo({ n: 'B04', title: 'Prompt Lab', clock: '15:28–15:44', min: 16, alumno: true, meta: 'Slides 13–14 · Plataforma: <span class="mono">/clase-1/prompt</span> · 14 min · El bloque central de la sesión.' })}

    ${slide(13, 'DE «ANALIZA ESTA SENTENCIA» A UN ENCARGO CONTROLABLE')}
    ${say('«Este es el prompt más honesto del mundo, porque es el que todos escribimos de verdad: "Analiza esta sentencia". Tres palabras, y seis decisiones que acaba de tomar el sistema por nosotros.»')}
    ${say('«Ahora les toca. Tomen una tarea jurídica que ustedes harían de verdad —o el documento de trabajo de hoy— y construyan el encargo. Casi todo se hace apretando botones: la plataforma escribe el prompt sola, abajo, mientras ustedes deciden. Pegan su propio texto en el recuadro y ese texto entra dentro del prompt. Una sola consigna, y va en contra del instinto de todo el mundo: no intenten hacerlo más largo. Intenten hacerlo menos ambiguo.»')}
    ${plataforma('/clase-1/prompt', 14, 'Circula. No muestres todavía el prompt de referencia. Avisa al minuto 12.')}
    ${aside('INTERVENCIONES', 'Dos o tres, nunca todas: «¿Cuántas de esas líneas eliminan una decisión implícita? Las que no, sobran.» · «Marcaste riesgo alto: ¿dónde está el control?» · «Terminaste rápido: súbele el riesgo, que ahora el resultado vaya a un escrito. ¿Qué le agregas?»')}
    ${aside('LO QUE SALE', 'El prompt que produce la plataforma se pega en ChatGPT, Claude o Gemini y arranca solo. Sin corchetes que rellenar, sin instrucciones sobre qué hacer después. Si falta un dato imprescindible no exporta nada: dice qué falta. Es deliberado — un prompt con huecos es un prompt que alguien va a ejecutar con los huecos puestos.')}
    ${doing('recoger dos decisiones de diseño en voz alta · 40 segundos')}

    ${slide(14, 'PROMPT DIAT DE REFERENCIA · NO TIENE ROL')}
    ${say('«Ahora les muestro el prompt de referencia del taller. No es el prompt perfecto —no existe tal cosa—, es un prompt de riesgo medio bien especificado. Y quiero que noten algo antes de copiarlo: no tiene rol. Es deliberado. Están los otros seis componentes trabajando juntos y el resultado no sufre por la ausencia del séptimo. Si el séptimo puede faltar sin daño en un prompt de referencia, entonces los siete nunca fueron obligatorios.»')}
    ${say('«No copiamos un prompt más bonito. Recuperamos seis decisiones.»')}
    ${qa([
      ['¿Y si la sentencia es muy larga?', 'Segmentar y preguntar por secciones identificadas. Cargar 300 páginas y pedir «resume esto» es la forma más eficiente de perder la cláusula que importaba.'],
      ['¿Me guarda esto la plataforma?', 'Sí, en su propio dispositivo. Al final lo exportan y esa es la entrega de la sesión.'],
    ])}
    ${anchor('No lo hagan más largo. Háganlo menos ambiguo.')}
    ${trans('Ya escribieron su prompt. Ahora vamos a pedirle a la propia herramienta que lo critique — y, más importante, a decidir en qué le hacemos caso.')}

    ${tramo({ n: 'B05', title: 'Metaprompting', clock: '15:44–15:55', min: 11, alumno: true, meta: 'Slides 15–16 · Plataforma: <span class="mono">/clase-1/auditoria</span> · 8 min · Salen a su propia herramienta y vuelven.' })}

    ${slide(15, 'METAPROMPTING: AUDITAR ANTES DE EJECUTAR')}
    ${say('«Metaprompting es pedirle a un modelo que critique una instrucción destinada a otro uso con IA. Tres modalidades y les basta con distinguirlas: auditor, entrevistador y generador. Hoy trabajamos solo con el auditor. Y hay un orden que no es negociable: primero ustedes construyen su prompt, y después piden la auditoría. Al revés produce gente que sabe redactar prompts pero no sabe diagnosticar encargos, que es justamente la competencia que sobrevive cuando cambie la herramienta.»')}
    ${say('«El metaprompt es canónico: úsenlo tal cual, no lo mejoren. Miren solo las dos instrucciones que hacen la diferencia: "no agregues requisitos que no mejoren el resultado de esta tarea en particular", y "formula como máximo tres preguntas aclaratorias". Sin esas dos líneas, el sistema devuelve un prompt inflado, porque optimiza por completitud aparente. Y un prompt inflado es exactamente el hábito que esta clase quiere destruir.»')}
    ${plataforma('/clase-1/auditoria', 8, 'El botón copia el metaprompt con su prompt ya pegado dentro. Lo llevan a su cuenta, lo ejecutan y vuelven. Recuérdales la regla del minuto uno: salen a una herramienta comercial, nada de datos de clientes.')}
    ${say('«Lo que quiero de vuelta son dos cosas: una sugerencia que aceptan y por qué, y una sugerencia que rechazan y con qué fundamento. La segunda vale más que la primera. Rechazar bien demuestra que entendieron; aceptarlas todas demuestra lo contrario.»')}
    ${aside('IRONÍA ÚTIL', 'Si a alguien el auditor le devuelve un prompt más largo pese a habérselo prohibido expresamente, proyéctalo. Es la mejor diapositiva del bloque y no la hiciste tú: «le pedí que no agregara requisitos innecesarios y agregó tres. Guarden esa imagen para cuando alguien les diga que basta con pedirlo bien».')}
    ${doing('preguntar: «¿a alguien el auditor le cambió el objetivo sin que lo notara?» · 40 segundos · este es el momento pedagógico del bloque')}

    ${slide(16, 'METAPROMPTING ≠ DELEGAR EL PROPÓSITO')}
    ${say('«Cinco límites, rápido. Uno: no define el objetivo profesional. Dos: no sabe qué fuente tiene autoridad en nuestro ordenamiento. Tres: no conoce nuestro apetito de riesgo —un memo interno y un escrito judicial no piden el mismo control, y esa decisión es del abogado—. Cuatro: tiende a la inflación. Y cinco, la que se olvida: auditar no es verificar. Un prompt auditado sigue produciendo salidas que hay que comprobar.»')}
    ${anchor('Auditar no es verificar.')}
    ${trans('Supongamos ahora que el prompt quedó impecable, auditado y todo. La respuesta puede seguir estando mal. Veamos de cuántas maneras.')}

    ${foot(logoEscuela)}
  </section>`;

  const p4 = `<section class="page">
    ${tramo({ n: 'B06', title: 'Cómo falla una respuesta plausible', clock: '15:55–16:03', min: 8, meta: 'Slides 17–19 · Sin plataforma · La revelación del tipo 2 se hace en pantalla, contigo.' })}

    ${slide(17, 'CÓMO FALLA UNA RESPUESTA PLAUSIBLE · 4 TIPOS')}
    ${say('«"La IA inventa cosas" es una descripción insuficiente para trabajo jurídico. Sirve para una sobremesa, no para decidir qué revisar antes de firmar.»')}
    ${say('«Definición que vamos a usar hoy: llamaremos alucinación a una salida en la que el sistema presenta como información respaldada algo que no está suficientemente sustentado por los datos o las fuentes pertinentes. Es deliberadamente amplia, porque el problema jurídico no se reduce a inventar un rol de sentencia.»')}
    ${say(`«Cuatro tipos, y los separo porque se detectan con operaciones distintas. ${errorTypes.map(e => `<strong>Tipo ${e.n}</strong>: ${e.label.toLowerCase()}`).join('. ')}.»`)}
    ${aside('DÓNDE PONER EL PESO', 'Los tipos 1, 3 y 4 se explican rápido. El 2 se guarda y se revela despacio. Es el núcleo del bloque y probablemente de la clase entera.')}

    ${slide(18, 'FUENTE REAL ≠ CONCLUSIÓN CORRECTA')}
    ${say('«Y el tipo dos, que dejé para el final. La fuente existe. Pero no sostiene lo que se le atribuye. El rol existe. El enlace funciona. Abrimos la sentencia. Y descubrimos que jamás sostuvo lo que acabamos de atribuirle.»')}
    ${doing('revelar el caso paso a paso en pantalla · no adelantar el desenlace')}
    ${say('«¿Por qué es el más peligroso? Porque supera la verificación superficial. El que revisa comprueba que el rol existe, ve que existe, y da el punto por bueno. Es el error que se les va a colar a los buenos, no a los distraídos. Los distraídos caen en el tipo uno.»')}
    ${aside('HUMOR NEGRO', 'El tipo 1 lo caza cualquiera con un buscador. El tipo 2 está diseñado, sin que nadie lo diseñara, para pasar el filtro de alguien que sí revisa. Es el único error de esta clase que exige que seas competente para caer en él.')}

    ${slide(19, 'SIETE SEÑALES DE ALERTA')}
    ${say(`«Siete señales, en pantalla y en su ficha, así que no se las leo. Solo la séptima, porque es la más difícil de aplicar y la más útil: <em>${warningSignals[6].text.toLowerCase()}</em> Es la única de las siete que no apunta al sistema. Apunta a nosotros.»`)}
    ${say('«Y una regla que no admite matices: verificar no es preguntarle a una segunda IA si la primera estaba en lo correcto. Una segunda herramienta puede ayudarles a localizar evidencia. Pero el contraste tiene que terminar en una fuente suficientemente autoritativa. Dos respuestas coincidentes no se convierten en fuente por votación.»')}
    ${qa([
      ['¿Y si le pido que solo cite fuentes reales?', 'Reduce y hace más detectable. No elimina.'],
      ['¿Existe alguna herramienta que no alucine?', 'Es la pregunta que abre el bloque siguiente. La respuesta corta es no.'],
      ['Confundo el tipo 2 con el tipo 4.', 'Buena confusión. En el cuatro la fuente sí dice eso, pero no aplica. En el dos la fuente ni siquiera dice eso.'],
    ])}
    ${anchor('Fuente real ≠ conclusión correcta.')}
    ${trans('La reacción natural, y es la sana, es preguntar si existe una herramienta que no se equivoque. La respuesta es no. Pero hay una diferencia que sí importa, y la vamos a ver en pantalla.')}

    ${tramo({ n: 'B07', title: 'Fuentes delimitadas y su límite', clock: '16:03–16:12', min: 9, meta: 'Slides 20–24 · Sin plataforma · Demostración en vivo. El movimiento 5 no se sacrifica nunca.' })}

    ${slide(20, 'CHAT ABIERTO VS. FUENTES DELIMITADAS')}
    ${say('«No voy a empezar por una marca. Voy a empezar por una distinción, porque las marcas cambian de nombre — y en un minuto van a ver que eso no es una hipótesis. Modo uno, chat abierto: rapidez, y procedencia difusa o inexistente. Modo dos, documento adjunto: análisis focalizado, pero según cómo esté configurado el producto puede complementar con conocimiento externo sin avisar. Modo tres, entorno basado en fuentes: un corpus seleccionado por mí y recuperación restringida a ese corpus.»')}
    ${say('«Esto último se llama grounding, y no necesitan la sigla. La idea en una frase: en lugar de pedirle al sistema que responda desde todo lo que aprendió, le entregamos las fuentes específicas sobre las que queremos que trabaje.»')}

    ${slide(21, 'PROCEDENCIA ≠ INTERPRETACIÓN')}
    ${say('«Y la advertencia va inmediatamente después, no al final, porque si la dejo para el final ustedes ya se convencieron. Grounding resuelve de dónde sale la información. No resuelve si esa información fue interpretada correctamente. Una cita en línea acredita de qué fragmento se recuperó. No acredita que la afirmación se siga de ese fragmento.»')}

    ${slide(22, 'GEMINI NOTEBOOK · SEIS MOVIMIENTOS')}
    ${doing('abrir el cuaderno ya preparado · una sola herramienta · no explicar la interfaz')}
    ${say('«Miren la barra de fuentes: un documento, y solo uno. El corpus es cerrado y está a la vista. Le pregunto por los tres criterios principales y que cite dónde aparece cada uno. Fíjense en lo que aparece al lado de cada afirmación: un localizador. Eso es lo que la diapositiva no les puede explicar y la pantalla sí.»')}
    ${doing('hacer clic en un localizador · leer el fragmento en voz alta')}
    ${say('«Diez segundos. Eso es lo que costó comprobar esta cita. Guarden ese número para cuando alguien les diga que verificar es inviable por falta de tiempo.»')}
    ${aside('MOVIMIENTO 5 · NO SE SACRIFICA', 'Si el reloj aprieta, recorta los movimientos 1 y 2. Este no. Pide una conclusión discutible —«¿el tribunal habría fallado igual si el plazo hubiera vencido?»— y lee la respuesta con el curso. Está bien construida, anclada, con fragmentos reales. Y es interpretación. Ese es el bloque entero.')}
    ${say('«Ahí está el punto. El anclaje en fuentes no garantiza interpretación correcta. Todos los enlaces abren. Y la conclusión sigue siendo discutible.»')}

    ${slide(23, 'EXENCIÓN DE RESPONSABILIDAD DEL PROVEEDOR')}
    ${say('«Cierro con la mejor diapositiva del bloque, que no es mía. Es el propio proveedor el que recomienda consultar a un profesional calificado para asuntos legales. Ningún argumento mío tiene esa fuerza.»')}
    ${aside('VOCABULARIO', 'Se llama Gemini Notebook. Hasta julio era NotebookLM. Y hay algo que no vamos a decir de ella ni de ninguna: que sea una herramienta antialucinaciones. Esa categoría no existe. Lo que es, correctamente nombrado, es un entorno de trabajo fundamentado en fuentes.')}

    ${slide(24, 'CONFIDENCIALIDAD · LEY 21.719')}
    ${say('«Noventa segundos sobre datos, y no voy a convertir esto en una clase de protección de datos personales. La Guía del Colegio de Abogados recomienda evaluar, antes de subir información de un cliente, el riesgo de revelación, las condiciones del proveedor, las medidas de resguardo y la sensibilidad de la información.»')}
    ${say('«Y el dato que cambia la conversación. La Ley 21.719 entra en vigencia el 1 de diciembre de este año. Tres meses después de hoy. Dicho de otra manera: lo que hoy es una buena práctica, en tres meses va a tener un supervisor con potestad sancionatoria.»')}
    ${aside('PRECISIÓN', 'Alguien lo va a afirmar en algún pasillo, así que dilo tú primero: Chile todavía no tiene ley de inteligencia artificial. El proyecto está en segundo trámite en el Senado. En trámite no es lo mismo que vigente.')}
    ${anchor('Grounding mejora la procedencia, no garantiza la interpretación.')}
    ${trans('Tenemos una respuesta con citas comprobables. Comprobarlas sigue siendo trabajo nuestro. Y esto es lo que toma tres minutos.')}

    ${foot(logoEscuela)}
  </section>`;

  const p5 = `<section class="page">
    ${tramo({ n: 'B08', title: 'Verificación · ICJR', clock: '16:12–16:22', min: 10, alumno: true, meta: 'Slides 25–27 · Plataforma: <span class="mono">/clase-1/verificacion</span> · 8 min · Una afirmación comprobada de verdad.' })}

    ${slide(25, 'PROTOCOLO ICJR')}
    ${say('«Decir "hay que revisar lo que hace la IA" es correcto y bastante inútil. ¿Qué significa revisar? ¿Cuánto? ¿Contra qué? ¿Y cómo demuestro después que lo hice? Cuatro operaciones.»')}
    ${say(icjrPhases.map(p => `<strong>${p.name}</strong>: ${p.question.replace(/^¿/, '').replace(/\?$/, '')}`).join(' · '))}
    ${say('«Y ahora la distinción que más mejora esta clase, y quiero que la anoten con estas palabras: control es ex ante —pedimos una respuesta más auditable—. ICJR es ex post —auditamos lo que recibimos—. Pedirle a la IA que no invente no es la verificación. Son complementarios y ninguno reemplaza al otro.»')}

    ${slide(26, 'CINCO ESTATUS EPISTÉMICOS')}
    ${say(`«Antes de contrastar hay que saber qué clase de afirmación tenemos delante, porque cada clase se verifica distinto y algunas no se verifican en absoluto. Están las cinco en pantalla; solo señalo las dos que deciden el ejercicio: la <strong>C</strong>, inferencia —esa no se "verifica", se evalúa el razonamiento, y debe declararse siempre como inferencia— y la <strong>E</strong>, ${epistemicStatuses[4].label.toLowerCase()}, que es la categoría que produce las sanciones.»`)}
    ${aside('CAMBIO RESPECTO DE v2.1', 'La plataforma ya no pide clasificar A–E: pide comprobar una afirmación con fuente, localizador y decisión. Los cinco estatus se explican aquí y quedan en la ficha. En una sesión introductoria queremos que ejecuten el procedimiento, no que memoricen cinco letras.')}

    ${slide(27, 'MATRIZ ICJR · FILA RESUELTA')}
    ${say('«Miren una fila resuelta. Afirmación generada. Fuente contrastada. Localizador. Y estado y acción: confirmada, mantener; parcialmente respaldada, matizar; no respaldada, eliminar; contradictoria, eliminar y revisar la conclusión; no verificable, investigar.»')}
    ${say('«Y la regla más importante del ejercicio: si una afirmación no se puede verificar en el tiempo disponible, el resultado correcto es "no verificada". No se rellena el hueco por intuición. Un estado honesto vale más que una casilla llena.»')}
    ${plataforma('/clase-1/verificacion', 8, 'Ejecutan su propio prompt, toman UNA afirmación de la respuesta y la comprueban. La segunda es opcional. Mantén la fila resuelta proyectada todo el ejercicio.')}
    ${aside('LA PREGUNTA DE CADA MESA', 'Literalmente así, y en todas: «¿Leíste el considerando, o solo comprobaste que existe?». Si la respuesta es la segunda, la afirmación no está verificada: está localizada. La diferencia entre ambas es exactamente el error tipo 2.')}
    ${doing('preguntar cuánto tardaron en verificar la primera · suelen decir entre uno y tres minutos · quédate con ese número')}
    ${say('«Entre uno y tres minutos. Ese es el mejor argumento contra la excusa de que verificar es inviable.»')}
    ${qa([
      ['¿Esto hay que hacerlo con todo?', 'No: la verificación también es proporcional al riesgo. Primero autoridades y citas, después hechos materiales, después cifras y fechas.'],
      ['No encuentro el localizador.', 'Entonces el estado es «no verificable» y la acción es investigar. Eso es un resultado, no un fracaso.'],
    ])}
    ${anchor('Control ex ante; ICJR ex post.')}
    ${trans('Volvamos a la primera pregunta de la clase.')}

    ${tramo({ n: 'B09', title: 'Cierre en espejo y entrega', clock: '16:22–16:30', min: 8, alumno: true, meta: 'Slides 03R, 28–30 · Plataforma: <span class="mono">/clase-1/cierre</span> · 6 min · Responder, comparar, entregar.' })}

    ${slide('03', '¿QUIÉN FALLÓ? · REPETIDA')}
    ${say('«A las tres y dos cada uno de ustedes respondió esta pregunta. Ninguno sabe qué respondieron los demás, y da igual: lo que importa es qué respondieron ustedes. Entren al cierre y respóndanla otra vez. La plataforma les va a mostrar su respuesta de entonces al lado de la de ahora.»')}
    ${plataforma('/clase-1/cierre', 6, 'Responder, ver la comparación, completar la frase y entregar. La comparación es individual y automática.')}

    ${slide(28, 'PROMPT + FUENTES + VERIFICACIÓN')}
    ${say('«No me interesa hacia qué casilla se movieron. Me interesa que ahora la respuesta se pueda decir con más precisión, así que la digo yo y ustedes corrigen.»')}
    ${say('«Falló el sistema, sí. Falló el prompt, probablemente: una instrucción sin fuentes delimitadas y sin control deja seis decisiones en manos de la herramienta. Falló el control ex ante: nadie pidió localizadores, y sin localizadores no hay nada que abrir. Falló la verificación ex post: nadie leyó la fuente, porque no había fuente que leer. Y falló, por último, algo que no es ninguno de los cuatro anteriores: la persona que firmó incorporó a un escrito judicial una afirmación que no había comprobado.»')}
    ${say('«Las cinco cosas son verdad al mismo tiempo. Esa es la respuesta adulta. Y ninguna de las cuatro primeras cancela la quinta, porque las cuatro primeras se distribuyen y la quinta no.»')}

    ${slide(29, 'TRES REGLAS PARA SALIR DE LA SALA')}
    ${say(meta.rules.map((r, i) => `<strong>${i + 1}.</strong> ${r}`).join(' '))}
    ${say('«Antes de irse: completen la frase del cierre y descarguen su Clase 1. El botón de enviar les abre el correo con el destinatario y el asunto ya puestos; solo tienen que adjuntar el archivo que se descargó.»')}
    ${aside('ENTREGA', 'La descarga funciona siempre. El envío abre el cliente de correo del alumno con el asunto «Clase 1» ya escrito. Quien no alcance puede cerrarla después: el trabajo queda guardado en su dispositivo. Reparte aquí la Ficha de Clase 1.')}

    ${slide(30, 'LA IA NO COMPARECE ANTE EL TRIBUNAL')}
    ${doing('pausa 2 segundos')}
    ${say('«Cuando un escrito llega a un tribunal, el tribunal no cita a declarar al modelo. No hay comparecencia del sistema. No hay un representante del proveedor explicando por qué esa referencia salió así. Hay un abogado, con nombre, matrícula y un deber de buena fe procesal, respondiendo por lo que firmó. Cuatro tribunales chilenos lo dijeron este año, en siete meses, con nombres distintos y con la misma lógica.»')}
    ${say('«Estas herramientas nos van a hacer más rápidos, y probablemente mejores. No nos van a acompañar a la audiencia. Nos vemos en la próxima sesión. Gracias.»')}
    ${aside('SI SOBRA UN MINUTO', '«¿Alguien se lleva una pregunta sin responder?» Toma una y respóndela en treinta segundos. Si falta un minuto: deja la frase de cierre y la descarga para después. Nunca saltes las tres reglas ni la última frase.')}
    ${anchor('La responsabilidad profesional no se delega al modelo.')}

    ${foot(logoEscuela)}
  </section>`;

  const anexo = `<section class="page">
    <div class="sec"><span class="sec-n">A</span><span class="sec-t">Criterio de poda · en este orden exacto</span></div>
    <p class="say" style="font-size:7.6pt">No improvises el recorte. Si vas atrasado, poda así:</p>
    <table class="ref">
      <tr><td class="mono" style="width:8mm">1</td><td>La comparación conceptual de Proyectos, Gems y Claude en B07. Ya está en la ficha.</td></tr>
      <tr><td class="mono">2</td><td>El caso comparado extranjero de B06. El Documento Maestro lo marca como opcional.</td></tr>
      <tr><td class="mono">3</td><td>La exposición de los siete componentes en B03, de 3 a 2 minutos. Se comprime, no se elimina.</td></tr>
      <tr><td class="mono">4</td><td>La demostración en vivo de B07, sustituida por capturas. El movimiento 5 se narra igual.</td></tr>
    </table>
    <div class="anchor-line" style="font-size:8.4pt;margin-top:3mm">
      Nunca se corta: el movimiento 5 · la verificación en plataforma · el cierre en espejo · las tres reglas.
    </div>
    ${aside('CRITERIO GENERAL', 'Si hay conflicto entre mostrar otra herramienta y hacer que los estudiantes practiquen la verificación, se elimina la herramienta. La competencia que debe sobrevivir al cambio tecnológico es el método, no el menú de productos. El menú va a cambiar dos veces antes de la Clase 3.')}

    <div class="sec" style="margin-top:5mm"><span class="sec-n">B</span><span class="sec-t">Cuando algo se rompe</span></div>
    <table class="ref">
      <tr><th style="width:44mm">Si ocurre…</th><th>Qué haces</th></tr>
      <tr><td><strong>La plataforma no carga para nadie</strong></td><td>Reparte la Ruta analógica. Tiene las mismas decisiones en el mismo orden. La clase no cambia; cambia el soporte.</td></tr>
      <tr><td><strong>Falla para algunos</strong></td><td>Ruta analógica para esos, y que transcriban después si quieren. No detengas al curso.</td></tr>
      <tr><td><strong>No hay conexión</strong></td><td>Lo ya abierto sigue funcionando: el trabajo se guarda en el propio dispositivo. Las demostraciones, con capturas.</td></tr>
      <tr><td><strong>La demo sale limpia</strong></td><td>«No se queden con la sensación de que esto siempre sale así: lo probé anoche tres veces y una me mezcló dos criterios.»</td></tr>
      <tr><td><strong>La demo sale mal</strong></td><td>Vale más que si hubiera salido bien. «¿Qué tipo de error es?» Clasifícalo con el curso en 30 segundos.</td></tr>
      <tr><td><strong>Nadie responde</strong></td><td>No repitas la pregunta más fuerte. Reformúlala como elección binaria: «¿fuentes o control?».</td></tr>
      <tr><td><strong>Un caso propio complejo</strong></td><td>«Es un caso excelente y lo quiero completo, pero en la Clase 2. Me lo anota.»</td></tr>
    </table>
    ${aside('LA VERDAD INCÓMODA', 'La única contingencia que no tiene plan B es que la demostración del movimiento 5 salga perfecta y convincente. Si el sistema produce una interpretación impecablemente anclada y perfectamente discutible, no lo arregles: eso es el bloque. Lo estabas buscando.')}

    <div class="sec" style="margin-top:5mm"><span class="sec-n">C</span><span class="sec-t">Las ocho frases ancla</span></div>
    <p class="say" style="font-size:7.6pt">Se dicen tal cual y se dejan respirar. No se parafrasean.</p>
    <table class="ref">
      ${meta.anchors.slice(0, 8).map((a, i) => `<tr><td class="mono" style="width:8mm">${i + 1}</td><td><strong>${a}</strong></td></tr>`).join('')}
    </table>

    <div class="sec" style="margin-top:5mm"><span class="sec-n">D</span><span class="sec-t">Reparto de los 90 minutos</span></div>
    <table class="ref">
      <tr><th style="width:14mm">Tramo</th><th style="width:26mm">Reloj</th><th style="width:12mm">Min</th><th>Plataforma</th></tr>
      <tr><td class="mono">B00</td><td class="mono">15:00–15:08</td><td class="mono">8</td><td class="mono">/clase-1 · 3 min</td></tr>
      <tr><td class="mono">B01</td><td class="mono">15:08–15:18</td><td class="mono">10</td><td>—</td></tr>
      <tr><td class="mono">B02</td><td class="mono">15:18–15:22</td><td class="mono">4</td><td>—</td></tr>
      <tr><td class="mono">B03</td><td class="mono">15:22–15:28</td><td class="mono">6</td><td>—</td></tr>
      <tr><td class="mono">B04</td><td class="mono">15:28–15:44</td><td class="mono">16</td><td class="mono">/prompt · 14 min</td></tr>
      <tr><td class="mono">B05</td><td class="mono">15:44–15:55</td><td class="mono">11</td><td class="mono">/auditoria · 8 min</td></tr>
      <tr><td class="mono">B06</td><td class="mono">15:55–16:03</td><td class="mono">8</td><td>—</td></tr>
      <tr><td class="mono">B07</td><td class="mono">16:03–16:12</td><td class="mono">9</td><td>—</td></tr>
      <tr><td class="mono">B08</td><td class="mono">16:12–16:22</td><td class="mono">10</td><td class="mono">/verificacion · 8 min</td></tr>
      <tr><td class="mono">B09</td><td class="mono">16:22–16:30</td><td class="mono">8</td><td class="mono">/cierre · 6 min</td></tr>
    </table>
    ${aside('EL CRONÓMETRO', 'Cada ejercicio tiene cuenta regresiva en la pantalla del alumno. Al llegar a cero no bloquea nada ni borra nada: avisa. No construimos una cárcel, construimos un reloj. Si necesitas más tiempo, lo tomas; el reloj es una sugerencia con autoridad moral, no un guardia.')}

    ${foot(logoEscuela)}
  </section>`;

  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<title>Guion docente de sala · Clase 1 · v2.2 · DIAT PUCV</title>
<style>${baseCSS}${S}</style>
</head><body>${portada}${p1}${p2}${p3}${p4}${p5}${anexo}</body></html>`;
}

function foot(logoEscuela) {
  return `<div class="footer" style="margin-top:5mm">
    <div>
      <span class="b">Guion docente de sala v2.2 · Clase 1</span><br>
      Programa DIAT · Escuela de Derecho · Pontificia Universidad Católica de Valparaíso
    </div>
    <div style="text-align:right">
      <img src="${logoEscuela}" alt="Escuela de Derecho PUCV" style="height:7mm;width:auto">
    </div>
  </div>`;
}
