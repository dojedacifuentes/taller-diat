# Arquitectura de `/clase-1`

La plataforma de Clase 1 dejó de ser un manual interactivo de diez bloques y pasó
a ser una **superficie de ejecución** de cinco etapas. La teoría vive en el PPT y
en la conducción docente; aquí el estudiante decide, construye, copia, ejecuta
fuera, audita, comprueba y entrega.

## Superficies

| Ruta | Etapa | Qué hace el estudiante |
| --- | --- | --- |
| `/clase-1` | Pregunta | Lee el caso mínimo, responde «¿quién falló?» y confirma. |
| `/clase-1/prompt` | Prompt | Construye su encargo con botones y pega su propio material. |
| `/clase-1/auditoria` | Auditoría | Copia metaprompt + su prompt, lo audita en su IA y decide. |
| `/clase-1/verificacion` | Verificación | Ejecuta su prompt y comprueba una afirmación contra su fuente. |
| `/clase-1/cierre` | Cierre | Vuelve a la pregunta, compara, reflexiona y entrega. |

Las rutas de la arquitectura anterior (`/clase-1/b00`…`b09`, `/clase-1/manual`,
`/clase-1/mi-trabajo`) redirigen desde `next.config.ts`: los QR y enlaces ya
impresos siguen llevando a la etapa equivalente en lugar de morir en un 404.

## Capas

- `src/content/class1/stages.ts`: las cinco etapas. Fuente única de la secuencia visible.
- `src/content/class1/timers.ts`: duración de cada ejercicio. Un solo sitio para cambiar minutos.
- `src/content/class1/runofshow.ts`: reparto de los 90 minutos. Lo consumen el deck y el guion.
- `src/content/class1/lab.ts`: catálogo de decisiones del Prompt Lab **y el compilador**.
- `src/content/class1/manifest.ts`: canon B00–B09. Sigue alimentando el deck y el guion; no aparece en ninguna pantalla del estudiante.
- `src/lib/class1/state.ts`: esquema serializable y migración desde la arquitectura de bloques.
- `src/lib/class1/store.tsx`: store externo con `useSyncExternalStore` y persistencia local.
- `src/lib/class1/progress.ts`: qué falta en cada etapa, en lenguaje del estudiante.
- `src/lib/class1/submission.ts`: `buildClass1Submission()`, el objeto único de entrega.
- `src/components/class1/stages`: una pantalla por etapa.
- `src/app/api/clase-1/entrega`: envío por correo, server-side.

## La regla dura: lo que se copia, se ejecuta

El compilador de `lab.ts` produce un prompt que se pega en ChatGPT, Claude o
Gemini y arranca la tarea. No exporta marcadores (`[PEGAR AQUÍ]`), incorpora el
material del estudiante entre delimitadores dentro del propio prompt y, si falta
un dato imprescindible, **no exporta**: dice qué falta y nada más.

Cuando el prompt depende de algo externo —un documento adjunto, fuentes ya
puestas en la conversación— lo advierte en la interfaz y lo dice dentro del
prompt. No se finge autosuficiencia.

## Entrega

`buildClass1Submission(state)` produce el trabajo completo, y ese único objeto
alimenta los tres canales: la vista previa, la descarga (`.md` y PDF) y el
correo. Ninguno puede entregar una versión distinta del mismo trabajo.

El envío es server-side: la clave del proveedor no llega al navegador y el botón
solo dice «Enviado ✓» cuando el servidor confirma. Si el correo falla, el trabajo
sigue intacto, la descarga sigue disponible y se puede reintentar. Ver
`.env.example`.

## Privacidad y resiliencia

El trabajo se guarda en `localStorage` bajo `diat.class1`. Sin cuenta, sin
telemetría propia y sin API generativa: la plataforma compila instrucciones, no
sustituye a la herramienta que el estudiante elija. El service worker da
tolerancia a una caída de wifi después de la primera visita.

El esquema está versionado. La migración v1 → v2 rescata lo que el estudiante ya
había hecho con la arquitectura de bloques (respuesta inicial, prompt, auditoría,
verificación, cierre) en lugar de descartarlo.

## Reglas de extensión

Los minutos viven una sola vez en `timers.ts` y `runofshow.ts`, y un invariante
comprueba que el manifest canónico no se separe de ellos. Los criterios
ejecutables viven en `progress.ts`. El contenido jurídico pendiente se resuelve
en `document.ts`, no dentro de componentes. Toda discrepancia editorial se
registra en `CLASS1_CONTENT_ISSUES.md`.

## Pruebas

- `npm run test:class1` — estado, reparto, progreso y documento de entrega.
- `npm run test:class1:compiler` — la regla dura del compilador y la migración.
- `npm run audit:class1-ppt` — coherencia del deck con el canon y con estas rutas.

Las dos primeras corren en el build remoto de Vercel: si una falla, no se publica.
