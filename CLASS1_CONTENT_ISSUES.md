# Clase 1 · registro de contenido y decisiones

Este archivo separa los conflictos editoriales de los defectos de software. No deben “resolverse” inventando contenido en la interfaz.

## Jerarquía de fuentes

1. `CLASE_1_DIAT_DOCUMENTO_MAESTRO_v2.0 (2).docx` — fuente canónica.
2. `CLASE_1_GUION.DOCENTE.pdf` — ejecución docente.
3. `DIAT_2026_CLASE_1_MANUAL_DEL_ESTUDIANTE_v1.0.docx` — apoyo del estudiante.
4. `Clase 1 DIAT - Del prompt aislado al razonamiento jurídico asistido.pptx` — superficie de proyección.
5. `DIAT_2026_CLASE_1_MANUAL_CONTROL_DE_CALIDAD_v1.0.docx` — observaciones de revisión.

## CONTENT_CONFLICT

- **C1-01 · TDLCC-547-2026.** El Documento Maestro indica sanción de 1 UTM; el PPT dice “amonestación con copia”. La plataforma conserva 1 UTM conforme a la fuente canónica. Pendiente homogeneizar PPT.
- **C1-02 · Advertencia de Google.** La redacción oficial difiere entre Documento Maestro y PPT. La plataforma conserva la versión del Documento Maestro. Pendiente homogeneizar PPT.
- **C1-03 · Reglas finales 1 y 3.** El PPT diverge del Documento Maestro y del Guion Docente. La plataforma sigue Maestro/Guion. Pendiente homogeneizar PPT.
- **C1-04 · Bibliografía ficticia.** El PPT utiliza el nombre de una persona real; el manual lo sustituye por un marcador. La versión definitiva debe usar una autoría inequívocamente ficticia.
- **C1-08 · Erratas del PPT.** Diapositiva 9: “Instraer”. Diapositiva 4: falta la nota relativa al Tribunal Constitucional. Corregir en la siguiente edición.
- **C1-09 · Extensión del manual.** La versión revisada tiene 36 páginas y el objetivo editorial es 20–30. El Manual de Control de Calidad contiene una propuesta de compresión.

## OPEN_DECISION

- **C1-05 · Documento conductor.** No está definida la sentencia o pieza jurídica común para B04, B07 y B08. El perfil requerido y el plan B están codificados en `src/content/class1/document.ts`. Hasta decidirlo, la interfaz admite la pieza proyectada por el profesor o un documento público/anonimizado del estudiante.
- **C1-06 · Definiciones de ejecución.** Falta decidir: contenido previo de apertura, herramienta conversacional principal, posición institucional sobre colegiación voluntaria y uso de resolución completa de la Corte Suprema versus comunicado de prensa.
- **C1-07 · Continuidad.** Falta cerrar el contenido de la Clase 2 y la relación explícita con los productos de esta clase.
- **C1-10 · Evaluación.** La plataforma deliberadamente no asigna puntajes: registra decisiones, trazabilidad y completitud. Si se requiere calificación institucional, debe definirse antes de incorporarla.

## PEDAGOGICAL_MIGRATION

- **C1-11 · De manual interactivo a superficie de ejecución.** La plataforma dejó de recorrer diez bloques y pasó a cinco etapas: pregunta, prompt, auditoría, verificación y cierre. Los ejercicios que solo pedían leer y responder —modelo/producto, cinco mitos, diagnóstico DIAT, clasificación de errores, decisiones sobre la demostración— volvieron a la conducción docente. Los documentos fuente (Documento Maestro, Manual del Estudiante) conservan la estructura B00–B09 y no se modifican aquí; el canon sigue vivo en `manifest.ts` para el deck y el guion.
- **C1-12 · Dependencias externas.** La auditoría y la verificación se ejecutan en la herramienta del estudiante. El botón copia el paquete completo —metaprompt más su prompt real, con delimitadores— para que pegar baste. Ninguna respuesta del modelo externo se considera verificada ni se guarda fuera del navegador.
- **C1-13 · Sin puntuación engañosa.** El prompt no se puntúa. No hay porcentaje de calidad ni «prompt perfecto»: hay decisiones tomadas y decisiones pendientes. Un componente ausente puede ser correcto si la tarea no lo requiere; por eso Rol vive en «Agregar extras».
- **C1-18 · Clasificación epistémica A–E.** Se explica en el PPT y permanece como material avanzado, pero la plataforma dejó de pedirla: en una sesión introductoria el objetivo es que el estudiante ejecute el procedimiento de verificación, no que memorice cinco códigos.

## TIMING_UX

- **C1-14 · Prompt Lab (14 min de plataforma).** Es el corazón de la clase y absorbió el diagnóstico que antes era un ejercicio aparte. El estudiante decide con botones y escribe poco; el docente circula y no explica. Corte temporal intermedio anunciado por el docente.
- **C1-15 · Auditoría (8 min de plataforma).** Depende de que el estudiante tenga acceso a una IA. El paquete copiable reduce la fricción, pero debe existir demostración docente de respaldo si no hay acceso o conectividad.
- **C1-16 · Verificación (8 min de plataforma).** Una afirmación con fuente, localizador y acción es el mínimo de completitud; la segunda es opcional. Una fila honesta produce más aprendizaje que dos a medias, y nunca desplaza el cierre.
- **C1-17 · Carga global.** El reparto es 51 minutos de conducción y 39 de plataforma, cuadrado en `runofshow.ts` con un invariante que impide que las etapas no quepan en su tramo. Antes de la sesión se requiere ensayo cronometrado de punta a punta en móvil y notebook.
- **C1-19 · Cronómetro.** Cuenta regresiva por ejercicio, persistente ante recarga y navegación. Al llegar a `00:00` no bloquea ni borra: avisa. Las duraciones viven en `timers.ts`, en un solo objeto, para poder ajustarlas tras el ensayo.
