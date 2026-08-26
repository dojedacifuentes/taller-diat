# ─────────────────────────────────────────────────────────────────────────────
# build-docs.ps1 — guiones de expositor (DOCX + PDF) y manual del participante.
#
#   powershell -ExecutionPolicy Bypass -File scripts/build-docs.ps1
#
# Todo el contenido se lee de src/data/*.ts y de materials/. Nada se escribe a
# mano aquí salvo el andamiaje editorial: encabezados, preguntas frecuentes y
# las instrucciones de montaje de sala.
# ─────────────────────────────────────────────────────────────────────────────
param([string]$OutDir = "public/materiales")

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'lib-tsjson.ps1')
. (Join-Path $PSScriptRoot 'lib-doc.ps1')

$root = Split-Path $PSScriptRoot -Parent
$D = Join-Path $root 'src/data'
$out = Join-Path $root $OutDir

# ─── Datos ───────────────────────────────────────────────────────────────────
$identity   = Import-TsData "$D/program.ts" 'identity'
$institution= Import-TsData "$D/program.ts" 'institution'
$schedule   = Import-TsData "$D/program.ts" 'schedule'
# El literal `sessions` reutiliza valores de `schedule`; se resuelven antes de
# importarlo para no tener que evaluar TypeScript.
$Global:TS_RESOLVE = @{
  'schedule.time'            = $schedule.time
  'schedule.sessionDuration' = $schedule.sessionDuration
}
$sessions   = Import-TsData "$D/program.ts" 'sessions'
$objective  = Import-TsData "$D/program.ts" 'objective'
$outcomes   = Import-TsData "$D/program.ts" 'learningOutcomes'
$glossary   = Import-TsData "$D/pedagogy.ts" 'glossary'
$layers     = Import-TsData "$D/pedagogy.ts" 'promptLayers'
$progression= Import-TsData "$D/pedagogy.ts" 'promptProgression'
$protocol   = Import-TsData "$D/pedagogy.ts" 'verificationProtocol'
$privacy    = Import-TsData "$D/pedagogy.ts" 'privacyPractices'
$answerTypes= Import-TsData "$D/pedagogy.ts" 'answerTypes'
$path       = Import-TsData "$D/pedagogy.ts" 'learningPath'
$rubric     = Import-TsData "$D/assessment.ts" 'rubric'
$peer       = Import-TsData "$D/assessment.ts" 'peerChecklist'
$tickets    = Import-TsData "$D/assessment.ts" 'exitTickets'
$fields     = Import-TsData "$D/labs.ts" 'challengeFields'
$vfields    = Import-TsData "$D/labs.ts" 'validationFields'
$mcols      = Import-TsData "$D/labs.ts" 'matrixColumns'
$flow       = Import-TsData "$D/labs.ts" 'canonicalFlow'
$hunt       = Import-TsData "$D/labs.ts" 'huntClaims'
$cases      = Import-TsData "$D/cases.ts" 'cases'
$raci       = Import-TsData "$D/roles.ts" 'raci'
$slots      = Import-TsData "$D/roles.ts" 'roleSlots'

$flowMeta = @{
  entrada='Entrada'; tarea='Tarea'; ia='IA'; fuente='Fuente'
  control='Control humano'; salida='Salida'; registro='Registro'
}

$ros = Get-Content (Join-Path $root 'materials/runOfShow.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$decks = @{}
foreach ($f in (Get-ChildItem (Join-Path $root 'materials/decks') -Filter '*.json' | Sort-Object Name)) {
  $deck = Get-Content $f.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
  $id = [int]([regex]::Match($f.Name, '(\d)').Groups[1].Value)
  $decks[$id] = $deck
}

$ownerLabel = @{ diego='Diego · Subdirección'; relatores='Relatoría estudiantil'; equipos='Equipos + facilitación' }

function ClockAt([int]$m) {
  $t = 15 * 60 + $m
  return ('{0:D2}:{1:D2}' -f [int][math]::Floor($t / 60), [int]($t % 60))
}

$META = @{
  Author = $institution.programLong
  Subject = "$($identity.name) — $($identity.tagline)"
  Keywords = 'prompting jurídico, verificación, trazabilidad, DIAT, PUCV, 2026'
}

# ─── Preguntas frecuentes por sesión ─────────────────────────────────────────
$faq = @{
  1 = @(
    @{ q='«¿Entonces no puedo usar IA para estudiar?»'; a='Sí puedes. La sesión no prohíbe nada: enseña a distinguir qué parte de una respuesta puedes usar tal cual y qué parte tienes que comprobar antes.' },
    @{ q='«¿Cuál herramienta es la mejor?»'; a='No hay respuesta estable a esa pregunta: los productos cambian cada pocos meses. Lo que sí se transfiere entre herramientas es el método: especificar la tarea, acotar las fuentes y verificar el resultado.' },
    @{ q='«¿No es más rápido preguntarle directamente?»'; a='Sí, y por eso el error también llega más rápido. Comparar el tiempo de escribir el prompt con el tiempo de deshacer una cita falsa en un escrito.' },
    @{ q='«Le pedí que no inventara y aun así inventó.»'; a='Ocurre. La capa de restricciones reduce mucho las citas falsas, no las elimina. Por eso el producto de la sesión es la matriz, no el prompt.' },
    @{ q='«¿Y si la fuente que me da existe pero dice otra cosa?»'; a='Ese es el caso más peligroso, porque supera una comprobación superficial. Se marca como falsa: la fuente no sostiene la afirmación.' },
    @{ q='«¿Puedo subir el contrato de mi práctica?»'; a='No. En el taller se trabaja solo con casos ficticios. Para tu práctica, anonimiza primero y consulta la política de tu lugar de trabajo.' }
  )
  2 = @(
    @{ q='«¿No es mucho trabajo para una consulta simple?»'; a='Para una consulta simple, sí. El flujo se justifica cuando la tarea se repite o cuando el resultado sale de tu escritorio. Ese es el criterio.' },
    @{ q='«¿Quién es el control humano si trabajo solo?»'; a='Tú, en un momento distinto y con un criterio escrito de antemano. Un control es una decisión con criterio, no una relectura rápida.' },
    @{ q='«¿Tengo que registrar todo?»'; a='Todo lo que necesitarías para explicar el resultado a alguien que no estuvo. En la práctica: herramienta, fecha, fuente, error y corrección.' },
    @{ q='«¿Cuál de las dos respuestas es la correcta?»'; a='Probablemente ninguna de las dos entera. La pregunta del ejercicio no es cuál acierta, sino cuál permite comprobar dónde se equivocó.' },
    @{ q='«Mi flujo tiene un solo paso de IA. ¿Está mal?»'; a='No. Un flujo bueno usa la IA donde aporta y no donde estorba. Lo que no puede faltar es la fuente, el control y el registro.' }
  )
  3 = @(
    @{ q='«No sé nada de tecnología, ¿qué aporto?»'; a='El problema, a quién afecta, qué fuente es autorizada y qué decisión no puede delegarse. Sin eso no hay nada que construir.' },
    @{ q='«¿Tenemos que programar algo?»'; a='No. El producto es una ficha de desafío y un pitch. No se evalúa ningún prototipo funcional.' },
    @{ q='«¿Y si nuestra idea ya existe?»'; a='Mejor: se puede describir con más precisión qué haría distinto la suya, y por qué eso importa jurídicamente.' },
    @{ q='«¿Qué ponemos en “lo que NO debe hacer”?»'; a='Las decisiones que, si las tomara la herramienta, ustedes no podrían defender ante nadie. Suele ser concluir, comunicar o comprometer.' },
    @{ q='«¿Cuatro minutos son suficientes?»'; a='Lo son si el equipo eligió qué es importante. Si no alcanzan, el problema casi nunca es el reloj.' }
  )
}

$setup = @(
  'Llegar 30 minutos antes. Probar proyección, sonido y conexión con el equipo de la sala, no con el propio.',
  'Abrir taller-diat.vercel.app en el navegador de proyección y dejar la sesión correspondiente cargada.',
  'Tener a mano los outputs precalculados impresos: si la herramienta de IA falla, la sesión continúa sin cambios.',
  'Repartir en las mesas las fichas de la sesión antes de que entre el grupo.',
  'Acordar con la coordinación operativa quién avisa los tiempos de bloque y con qué señal.',
  'Comprobar que nadie del equipo va a pegar datos reales en la demostración.'
)

# ─────────────────────────────────────────────────────────────────────────────
# GUION DE SESIÓN
# ─────────────────────────────────────────────────────────────────────────────
function Build-Guion([int]$id) {
  $s = $sessions[$id - 1]
  $plan = $ros | Where-Object { $_.sessionId -eq $id }
  $deck = $decks[$id]
  $ticket = $tickets | Where-Object { $_.session -eq $id }

  $b = New-Object System.Collections.Generic.List[object]
  function A($x) { $b.Add($x) | Out-Null }

  A (DocTitle "Guion de expositor · Sesión $id")
  A (DocSubtitle $s.title)
  A (DocMeta "$($s.displayDate) de 2026 · $($schedule.time) · $($schedule.sessionDuration)")
  A (DocMeta "$($institution.programLong) · $($institution.faculty)")
  A (DocRule)

  A (DocH1 'Objetivo de la sesión')
  A (DocP $s.purpose)
  A (DocCallout 'Al terminar, el estudiante debería poder decir' $plan.successCriterion)
  A (DocCallout 'Idea que atraviesa la sesión' $plan.spine)
  A (DocKV 'Producto' $s.product)

  A (DocH1 'Antes de empezar')
  $i = 1
  foreach ($x in $setup) { A (DocNum $i $x); $i++ }

  A (DocH1 'Reparto del tiempo')
  $mD = 0; $mR = 0; $mE = 0
  foreach ($blk in $plan.blocks) {
    $m = $blk.to - $blk.from
    if ($blk.owner -eq 'diego') { $mD += $m } elseif ($blk.owner -eq 'relatores') { $mR += $m } else { $mE += $m }
  }
  $total = $mD + $mR + $mE
  A (DocTable @('Responsable','Minutos','Porcentaje') @(
    @('Diego · Subdirección', "$mD", ('{0:N1} %' -f ($mD / $total * 100))),
    @('Relatoría estudiantil', "$mR", ('{0:N1} %' -f ($mR / $total * 100))),
    @('Equipos + facilitación', "$mE", ('{0:N1} %' -f ($mE / $total * 100))),
    @('Total', "$total", '100,0 %')
  ) @(40, 20, 20))
  A (DocP "Bloque conducido por la relatoría estudiantil y el trabajo de equipos: $($mR + $mE) minutos, un $('{0:N1}' -f (($mR + $mE) / $total * 100)) % de la sesión.")

  A (DocH1 'Mapa de la sesión')
  $rows = @()
  foreach ($blk in $plan.blocks) {
    $rows += ,@(
      ("$(ClockAt $blk.from)–$(ClockAt $blk.to)"),
      "$($blk.to - $blk.from) min",
      $blk.title,
      $ownerLabel[$blk.owner],
      $blk.mode
    )
  }
  A (DocTable @('Hora','Dur.','Bloque','Responsable','Modalidad') $rows @(18, 10, 34, 22, 16))

  A (DocBreak)
  A (DocH1 'Bloque a bloque')
  foreach ($blk in $plan.blocks) {
    A (DocH2 "$(ClockAt $blk.from)–$(ClockAt $blk.to) · $($blk.title)")
    A (DocKV 'Responsable' $ownerLabel[$blk.owner])
    A (DocKV 'Duración' "$($blk.to - $blk.from) minutos")
    A (DocKV 'Modalidad' $blk.mode)
    A (DocP $blk.detail)
    if ($blk.needs -and $blk.needs.Count -gt 0) {
      A (DocKV 'Materiales' ($blk.needs -join ' · '))
    }
    if ($blk.tool) { A (DocKV 'En pantalla' "taller-diat.vercel.app$($blk.tool)") }
  }

  A (DocBreak)
  A (DocH1 'Diapositiva a diapositiva')
  A (DocLead 'Cada diapositiva con sus notas: quién habla, qué explicar, qué preguntar y con qué frase se pasa a la siguiente. No están escritas para leerse palabra por palabra.')
  $n = 1
  foreach ($sl in $deck.slides) {
    $t = if ($sl.title) { $sl.title } else { '(sin título)' }
    $k = if ($sl.kicker) { $sl.kicker } else { '' }
    A (DocH3 ("{0:D2} · {1}" -f $n, $t))
    if ($k) { A (DocMeta $k) }
    if ($sl.notes) {
      foreach ($line in ($sl.notes -split "`n")) {
        if ($line.Trim() -ne '') { A (DocP $line) }
      }
    }
    $n++
  }

  A (DocBreak)
  A (DocH1 'Preguntas que suelen aparecer')
  foreach ($f in $faq[$id]) {
    A (DocH3 $f.q)
    A (DocP $f.a)
  }

  A (DocH1 'Plan B')
  A (DocLead 'La sesión no depende de que todo funcione. Cada escenario tiene una salida escrita de antemano.')
  foreach ($c in $plan.contingencies) {
    A (DocCallout $c.when $c.then)
  }

  A (DocH1 'Después de la sesión')
  A (DocBullet 'Recoger los exit tickets y anotar las dudas que se repitieron.')
  A (DocBullet 'Registrar cuántos equipos completaron el producto de la jornada.')
  A (DocBullet 'Dejar por escrito qué bloque se pasó de tiempo y por cuánto, para ajustar la sesión siguiente.')
  if ($id -lt 3) {
    A (DocBullet "Recordar a los equipos qué traer a la sesión $($id + 1).")
  }

  A (DocH1 'Exit ticket de la sesión')
  A (DocMeta $ticket.when)
  $i = 1
  foreach ($p in $ticket.prompts) { A (DocNum $i $p); $i++ }

  A (DocH1 'Espacios de relatoría')
  A (DocLead 'La designación definitiva corresponde a la subdirección. Estos espacios se completan a mano antes de la sesión.')
  $rows = @()
  foreach ($sl in ($slots | Where-Object { $_.session -eq $id })) {
    $who = if ($sl.assigned) { $sl.assigned } else { '________________________' }
    $rows += ,@($sl.slot, $who, $sl.duties)
  }
  A (DocTable @('Rol','Persona','Responsabilidades') $rows @(24, 24, 52))

  $meta = $META.Clone()
  $meta.Title = "Guion de expositor · Sesión $id — $($identity.name)"
  Save-Docx  $b $meta (Join-Path $out "Guion_Sesion_$id.docx")
  Save-DocPdf $b $meta (Join-Path $out "Guion_Sesion_$id.pdf")
}

# ─────────────────────────────────────────────────────────────────────────────
# MANUAL DEL PARTICIPANTE
# ─────────────────────────────────────────────────────────────────────────────
function Build-Manual {
  $b = New-Object System.Collections.Generic.List[object]
  function A($x) { $b.Add($x) | Out-Null }

  A (DocTitle 'Manual del participante')
  A (DocSubtitle "$($identity.name) · $($identity.tagline)")
  A (DocMeta "$($schedule.datesLong) · $($schedule.time)")
  A (DocMeta "$($institution.programLong) · $($institution.faculty)")
  A (DocRule)

  A (DocH1 'Contenido')
  A (DocTable @('#','Sección','Cuándo se usa') @(
    @('01','Bienvenida','Antes de empezar'),
    @('02','Cómo usar este manual','Antes de empezar'),
    @('03','Mapa de las tres sesiones','Antes de empezar'),
    @('04','Vocabulario esencial','Consulta permanente'),
    @('05','IA generativa en cinco minutos','Sesión 1'),
    @('06','Qué puede hacer bien','Sesión 1'),
    @('07','Qué no garantiza','Sesión 1'),
    @('08','La estructura DIAT del prompt jurídico','Sesión 1'),
    @('09','Antes y después','Sesión 1'),
    @('10','Verificar','Sesión 1'),
    @('11','La matriz de verificación','Sesión 1'),
    @('12','Del prompt al flujo','Sesión 2'),
    @('13','El registro de validación','Sesión 2'),
    @('14','Match Making','Sesión 3'),
    @('15','La ficha de desafío','Sesión 3'),
    @('16','Cómo se evalúa','Sesión 3'),
    @('17','Recursos de la plataforma','Consulta permanente'),
    @('18','Reglas de privacidad','Consulta permanente'),
    @('19','Checklist final','Antes de entregar')
  ) @(8, 56, 36))
  A (DocBreak)

  A (DocH1 '01 · Bienvenida')
  A (DocLead $identity.thesis)
  A (DocP $objective.text)
  A (DocCallout 'Principio de uso' $identity.principle)

  A (DocH1 '02 · Cómo usar este manual')
  A (DocP 'No hace falta haber leído nada antes. El manual se puede seguir de principio a fin o abrir por la sección que se necesite en la sala.')
  A (DocBullet 'Las secciones 03 a 07 se leen antes de la sesión 1, y bastan quince minutos.')
  A (DocBullet 'Las secciones 08 a 11 son las que se usan en la sesión 1, con la matriz de verificación.')
  A (DocBullet 'Las secciones 12 y 13 acompañan la sesión 2.')
  A (DocBullet 'Las secciones 14 a 16 acompañan la sesión 3.')
  A (DocBullet 'Las secciones 17 a 19 sirven durante y después del taller.')

  A (DocH1 '03 · Mapa de las tres sesiones')
  $rows = @()
  foreach ($s in $sessions) {
    $rows += ,@("$($s.displayDateShort)", $s.title, $s.product)
  }
  A (DocTable @('Fecha','Sesión','Producto') $rows @(14, 48, 38))
  A (DocH2 'Qué deberías poder decir al final de cada sesión')
  foreach ($p in $ros) {
    A (DocKV "Sesión $($p.sessionId)" $p.successCriterion)
  }

  A (DocH1 '04 · Vocabulario esencial')
  A (DocLead 'Treinta y tres términos, cada uno con una definición breve y un ejemplo jurídico. Ninguno entra por ser técnicamente interesante: entran los que sirven para trabajar.')
  $groups = @('Fundamentos','Prompting','Verificación','Riesgos','Flujo')
  foreach ($g in $groups) {
    A (DocH2 $g)
    foreach ($t in ($glossary | Where-Object { $_.group -eq $g })) {
      A (DocH3 $t.term)
      A (DocP $t.definition)
      A (DocP "Ejemplo: $($t.legalExample)")
    }
  }

  A (DocBreak)
  A (DocH1 '05 · IA generativa en cinco minutos')
  A (DocP 'Un sistema capaz de producir resultados a partir de patrones aprendidos en datos. Un modelo de lenguaje genera texto de forma probabilística, condicionado por el contexto que recibe.')
  A (DocP 'Eso es todo lo técnico que hace falta para este taller. No hará falta saber qué es un transformer, un embedding ni una red neuronal.')
  A (DocQuote 'La fluidez es una propiedad del lenguaje generado. La corrección jurídica exige verificación externa.')

  A (DocH1 '06 · Qué puede hacer bien')
  A (DocBullet 'Ordenar hechos dispersos en una cronología.')
  A (DocBullet 'Proponer qué preguntas jurídicas contiene un problema.')
  A (DocBullet 'Reformular un texto para otro destinatario.')
  A (DocBullet 'Producir un primer borrador que una persona corrige.')
  A (DocBullet 'Comparar dos textos y señalar diferencias.')
  A (DocBullet 'Explicar un concepto en términos más simples.')

  A (DocH1 '07 · Qué no garantiza')
  A (DocP 'Que una respuesta llegue bien escrita no implica ninguna de estas seis cosas:')
  foreach ($x in @('Verdad','Vigencia jurídica','Fuente real','Interpretación correcta','Intención','Responsabilidad')) {
    A (DocBullet $x)
  }
  A (DocH2 'Tres tipos de respuesta')
  $rows = @()
  foreach ($a in $answerTypes) { $rows += ,@($a.kind, $a.definition, $a.test) }
  A (DocTable @('Tipo','Qué es','Cómo se comprueba') $rows @(20, 42, 38))

  A (DocBreak)
  A (DocH1 '08 · La estructura DIAT del prompt jurídico')
  A (DocLead 'Siete capas. Cinco obligatorias, el rol opcional, y el control como la capa que convierte una respuesta en material de trabajo revisable.')
  foreach ($l in $layers) {
    A (DocH2 "$($l.name)")
    A (DocKV 'Responde a' $l.question)
    A (DocP $l.why)
    A (DocCode @($l.example))
  }

  A (DocH1 '09 · Antes y después')
  A (DocLead 'No existe el prompt mágico de dos mil palabras. Existe una tarea cada vez mejor especificada.')
  foreach ($p in $progression) {
    A (DocH3 "Nivel $($p.level) · $($p.label)")
    A (DocCode @($p.prompt))
    A (DocP "Qué sigue fallando: $($p.problem)")
  }

  A (DocBreak)
  A (DocH1 '10 · Verificar')
  A (DocQuote 'No verificar el estilo. Verificar las afirmaciones.')
  foreach ($p in $protocol) {
    A (DocH3 $p.step)
    A (DocP $p.action)
    A (DocKV 'Trampa frecuente' $p.trap)
  }
  A (DocH2 'Los cinco estados de una afirmación')
  A (DocTable @('Estado','Cuándo se usa') @(
    @('Verificada','La encontré en la fuente oficial y dice lo que la respuesta afirma.'),
    @('Falsa','La busqué en la fuente y no existe, o la fuente dice otra cosa.'),
    @('Dudosa','Podría ser correcta, pero está enunciada de forma demasiado categórica.'),
    @('Sin fuente','Puede que sea cierta, pero no se indica de dónde sale y no la localicé.'),
    @('Inferencia','No está en la fuente: el modelo la dedujo y la presenta como si fuera un dato.')
  ) @(22, 78))

  A (DocH1 '11 · La matriz de verificación')
  A (DocP 'Una fila por afirmación. La columna «fuente real» es la que decide.')
  $rows = @()
  foreach ($c in $mcols) { $rows += ,@($c.label, $c.hint) }
  A (DocTable @('Columna','Qué se anota') $rows @(28, 72))
  A (DocH2 'Revisión entre pares')
  $i = 1
  foreach ($q in $peer) { A (DocNum $i $q); $i++ }

  A (DocBreak)
  A (DocH1 '12 · Del prompt al flujo')
  A (DocQuote 'No se trata de preguntarle todo a la IA de una vez. Se trata de organizar el trabajo en pasos que puedan revisarse.')
  A (DocP 'Seis casillas, ninguna opcional. Un flujo sin fuente y sin control humano no es un flujo: es una respuesta larga partida en trozos.')
  $rows = @()
  $n = 1
  foreach ($f in $flow) {
    $rows += ,@(("{0:D2} · {1}" -f $n, $flowMeta[$f.kind]), $f.label)
    $n++
  }
  A (DocTable @('Casilla','Ejemplo sobre el caso troncal') $rows @(28, 72))

  A (DocH1 '13 · El registro de validación')
  A (DocP 'El registro es el producto de la sesión 2: sin él, el resultado no se puede explicar a nadie más.')
  $rows = @()
  foreach ($f in $vfields) { $rows += ,@($f.label, $f.hint, $f.example) }
  A (DocTable @('Campo','Qué se anota','Ejemplo') $rows @(20, 40, 40))

  A (DocBreak)
  A (DocH1 '14 · Match Making')
  A (DocP 'Los estudiantes de Derecho no vienen a convertirse en ingenieros y los de otras disciplinas no vienen a sustituir el criterio jurídico. El aprendizaje está en la traducción entre ambos.')
  A (DocH2 'La frase que no permite construir nada')
  A (DocQuote 'Quiero una IA que revise contratos.')
  A (DocH2 'La misma idea, ya especificada')
  A (DocQuote 'Necesitamos detectar determinadas cláusulas, mostrar el texto relevante, contrastarlo con fuentes autorizadas, indicar el nivel de incertidumbre y derivar la decisión final a revisión humana.')

  A (DocH1 '15 · La ficha de desafío')
  $rows = @()
  foreach ($f in $fields) { $rows += ,@(("{0:D2}" -f $f.n), $f.label, $f.question) }
  A (DocTable @('#','Campo','Pregunta que responde') $rows @(6, 30, 64))
  A (DocCallout 'El campo 12 no es opcional' 'Si «lo que NO debe hacer» está vacío, la ficha no está terminada. Es el campo que impide prometer más de lo que se puede sostener.')

  A (DocH1 '16 · Cómo se evalúa')
  foreach ($r in $rubric) {
    A (DocH3 "$($r.weight) % · $($r.criterion)")
    foreach ($lv in $r.levels) {
      A (DocKV $lv.level $lv.descriptor)
    }
  }

  A (DocBreak)
  A (DocH1 '17 · Recursos de la plataforma')
  $rows = @()
  foreach ($p in $path) { $rows += ,@("{0:D2}" -f $p.n, $p.label, $p.description, "taller-diat.vercel.app$($p.href)") }
  A (DocTable @('#','Etapa','Qué se hace','Dónde') $rows @(6, 20, 44, 30))

  A (DocH1 '18 · Reglas de privacidad')
  A (DocQuote 'No pegar información confidencial en herramientas públicas de IA.')
  $rows = @()
  foreach ($p in $privacy) { $rows += ,@($p.do, $p.dont) }
  A (DocTable @('Sí','No') $rows @(50, 50))
  A (DocP 'En el taller se trabaja exclusivamente con casos simulados, anonimizados o expresamente autorizados.')

  A (DocH1 '19 · Checklist final')
  A (DocLead 'Antes de entregar el desafío final, comprobar que se puede mostrar cada una de estas cosas.')
  $checks = @(
    'El problema, enunciado en una frase con hechos y jurisdicción.',
    'La persona usuaria y qué necesita conseguir.',
    'La secuencia de instrucciones que se usó, con sus siete capas.',
    'El flujo, con sus seis casillas y al menos dos controles humanos.',
    'Las fuentes utilizadas, con versión y fecha de consulta.',
    'Al menos un error detectado y cómo se descubrió.',
    'Los riesgos identificados y quién los notaría.',
    'La decisión humana en cada punto de control.',
    'Lo que la solución NO debe hacer.',
    'El criterio de éxito, formulado de modo que pueda comprobarse.'
  )
  $i = 1
  foreach ($c in $checks) { A (DocNum $i $c); $i++ }

  A (DocBreak)
  A (DocH1 'Anexo A · Qué ocurre en cada sesión')
  A (DocLead 'El detalle minuto a minuto, para saber qué esperar y en qué momento se produce cada entregable. Las horas son las del reloj de la sala.')
  foreach ($p in $ros) {
    $s = $sessions[$p.sessionId - 1]
    A (DocH2 "Sesión $($p.sessionId) · $($s.displayDate)")
    $rows = @()
    foreach ($blk in $p.blocks) {
      $rows += ,@(("$(ClockAt $blk.from)–$(ClockAt $blk.to)"), $blk.title, $blk.mode)
    }
    A (DocTable @('Hora','Qué se hace','Modalidad') $rows @(18, 62, 20))
    $t = $tickets | Where-Object { $_.session -eq $p.sessionId }
    A (DocH3 'Exit ticket')
    $i = 1
    foreach ($q in $t.prompts) { A (DocNum $i $q); $i++ }
  }

  A (DocBreak)
  A (DocH1 'Anexo B · Casos del taller')
  A (DocLead 'Todos ficticios. Ninguno contiene datos personales reales, causas reales ni información confidencial. Las fuentes son públicas y su vigencia se comprobó al preparar el material.')
  foreach ($c in $cases) {
    A (DocH2 "$($c.code) · $($c.title)")
    $tr = if ($c.troncal) { ' · caso troncal' } else { '' }
    A (DocMeta "$($c.area) · dificultad $($c.difficulty)$tr")
    A (DocP $c.brief)
    A (DocKV 'Qué se busca aprender' $c.objective)
    A (DocH3 'Errores que el caso induce')
    foreach ($t in $c.traps) { A (DocBullet $t) }
    A (DocH3 'Fuentes oficiales')
    foreach ($s in $c.sources) {
      A (DocBullet $s.label)
      A (DocCode @($s.url))
    }
  }

  $meta = $META.Clone()
  $meta.Title = "Manual del participante — $($identity.name)"
  Save-DocPdf $b $meta (Join-Path $out 'Manual_Taller_Prompting_Juridico_3_DIAT_2026.pdf')
}

# ─── Entrada ─────────────────────────────────────────────────────────────────
Write-Host 'Generando guiones y manual...'
foreach ($id in 1, 2, 3) { Build-Guion $id }
Build-Manual
Write-Host 'Listo.'
