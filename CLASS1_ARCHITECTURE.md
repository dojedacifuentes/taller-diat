# Arquitectura de `/clase-1`

## Superficies

- `/clase-1`: mapa de la sesión, fases y progreso.
- `/clase-1/b00` … `/clase-1/b09`: recorrido individual guiado de 90 minutos.
- `/clase-1/mi-trabajo`: Bitácora, identidad, vista previa, PDF y preparación de entrega.
- `/clase-1/manual`: manual web y recursos descargables.

## Capas

- `src/content/class1`: fuentes editoriales estructuradas, secuencia, prompts, actividades y documento conductor.
- `src/lib/class1/state.ts`: esquema serializable y migraciones compatibles.
- `src/lib/class1/store.tsx`: estado React y persistencia local.
- `src/lib/class1/progress.ts`: criterios de completitud y preparación de entrega.
- `src/components/class1/blocks`: experiencias B00–B09.
- `src/lib/class1/bitacoraPdf.ts`: PDF generado en el navegador; no envía datos.

## Privacidad y resiliencia

El trabajo se guarda exclusivamente en `localStorage` bajo `diat.class1`. No hay backend, cuenta, API key ni telemetría propia. El service worker precarga el recorrido y ofrece tolerancia a pérdida de conexión después de la primera visita. Los enlaces a IA abren servicios externos; el estudiante decide qué texto copiar y pegar.

El esquema está versionado. Las migraciones preservan respuestas antiguas (incluida la transición de `b05.excerpt` a `b05.audit`) y completan invariantes nuevas sin borrar trabajo.

## Reglas de extensión

La secuencia temporal vive una sola vez en `manifest.ts`. Los criterios ejecutables viven en `progress.ts`; su texto humano en el manifest debe mantenerse alineado. El contenido jurídico pendiente se resuelve en `document.ts`, no dentro de componentes. Toda discrepancia editorial se registra en `CLASS1_CONTENT_ISSUES.md`.
