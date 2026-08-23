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

- **C1-11 · Individualización guiada.** Los documentos fuente describen momentos en parejas, grupos, votación y formularios externos. `/clase-1` los traduce a un recorrido individual B00–B09, con compromiso antes del feedback, persistencia local y productos A/B/C. Esta migración es deliberada; los documentos fuente no se modifican en esta entrega.
- **C1-12 · Dependencias externas.** B05 permite elegir una herramienta externa y ofrece un puente copiar/abrir/pegar. Ninguna respuesta del modelo externo se considera verificada ni se guarda fuera del navegador.
- **C1-13 · Sin puntuación engañosa.** La cobertura DIAT se presenta como mapa de decisiones. Un componente ausente puede ser correcto si el riesgo y la tarea no lo requieren.

## TIMING_UX

- **C1-14 · B04 (10 min).** Es el bloque de mayor densidad de escritura. La progresión modelo y la rúbrica quedan bajo divulgación opcional para que el foco sea producir el encargo y justificar tres decisiones. El docente debe anunciar un corte temporal intermedio.
- **C1-15 · B05 (8 min).** Depende de la disponibilidad de una herramienta externa. El puente reduce fricción, pero debe existir demostración docente de respaldo si no hay acceso o conectividad.
- **C1-16 · B08 (15 min).** Dos afirmaciones con fuente, localizador, estado y acción constituyen el mínimo de completitud. Agregar más filas es opcional y no debe desplazar el cierre B09.
- **C1-17 · Carga global.** El ajuste es estructural, no una medición con usuarios. Antes de la sesión final se requiere ensayo cronometrado de punta a punta en móvil y notebook.
