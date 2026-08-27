# Handoff · Clase 1

Última actualización: 27 de agosto de 2026.
Repositorio: `dojedacifuentes/taller-diat` · rama de producción: `main`.
Todo lo descrito aquí está commiteado, pusheado y desplegado.

---

## ESTADO

### Terminado y verificado

**Impresos**

- [x] `DIAT_Clase1_Ruta_Analogica.pdf` — A4, **2 páginas exactas**. Para hacer la clase sin dispositivo. Verificado en color y en escala de grises.
- [x] `DIAT_Clase1_Ficha_Imprimible.pdf` — A4, **2 páginas exactas**. Para recordar la arquitectura de la sesión. Lleva QR generado desde el manifest.
- [x] `DIAT_C1_Guion_Docente_Sala_v2.2.pdf` — **13 páginas** (el v2.1 tenía 28). Sustituye al v2.1, que describía la plataforma de diez bloques.
- [x] Los tres se generan con `npm run build:class1-print` desde el canon. El HTML de cada uno queda junto al PDF como fuente editable.
- [x] Guardas de canon que abortan el build si cambian los 7 componentes, ICJR, los 5 estatus, las 7 señales, las 7 instrucciones de control, los 4 tipos de error o las 3 reglas.

**Plataforma**

- [x] `<Impresos />` en `/clase-1` con tres materiales: Ruta analógica (hacer), Ficha (recordar), Manual del Estudiante (estudiar después).
- [x] `<ReiniciarClase />` en la pregunta de entrada y en la entrega. **Antes no existía ninguna salida del bloqueo** y por eso parecía que el botón estaba roto.
- [x] Envío por correo con dos vías —SMTP y Resend— y vía manual automática cuando no hay ninguna configurada.
- [x] El endpoint ya no devuelve 500 ante una entrega parcial: valida la forma completa y compone dentro de un `try`.

**QA**

- [x] `npm run test:class1` → **26/26**
- [x] `npm run lint` → **0 errores** (8 warnings preexistentes)
- [x] `npm run vercel:build` → exit 0
- [x] Producción verificada: los cuatro PDF sirven con `content-type: application/pdf`.

### Falta

1. **Configurar el correo en Vercel.** Ver «ENV» más abajo. Sin esto el envío abre el cliente de correo del alumno, que funciona, pero no llega nada solo.
2. **Imprimir una copia física** de la Ruta y la Ficha antes de la sesión. Se verificó el render, no una impresora.
3. **Documento Maestro y Manual del Estudiante** siguen en v1.0 / v2.0. El Manual se revisó y **no contradice** la arquitectura nueva (ver abajo), así que no es urgente.

---

## CANON — no modificar

El contenido sustantivo se **importa** de `src/content/class1/activities.ts` y
`src/content/class1/manifest.ts`. No se escribe a mano en ningún imprimible.

| Elemento | Valor canónico | Guarda |
| --- | --- | --- |
| Componentes DIAT | Contexto · Rol · Tarea · Fuentes · Restricciones · Formato · Control | sí |
| Nomenclatura | «siete componentes» / «siete preguntas de diseño». **Nunca «capas»** | — |
| Aporte del programa | Fuentes y Control | — |
| ICJR | Identificar · Contrastar · Justificar · Registrar | sí |
| Estatus | A · B · C · D · E | sí |
| Señales de alerta | 7 | sí |
| Instrucciones de control | 7 | sí |
| Tipos de error | 4 | sí |
| Reglas finales | 3, literal del manifest | sí |
| Matriz ICJR de aula | 5 columnas · 2 afirmaciones | — |
| Reparto | 51 min conducción · 39 min plataforma · 90 total | sí |

**Contenido jurídico ficticio.** La página 2 de la Ruta usa una respuesta
simulada. La afirmación 01 cita el art. 2515 CC (real, de `solvedRow`). La 02
usa `[APELLIDO, Nombre]` y `[TÍTULO INEXISTENTE]`, subrayados y rotulados como
ficticios. **No se inventó jurisprudencia.** Mantén esa regla.

**Sobre el Manual del Estudiante v1.0.** Se auditó antes de enlazarlo: cero
referencias a `/clase-1/b0X`, a bloques B00–B09, a «Bitácora» o a
«mi-trabajo». Su único «capas» se refiere a infraestructura intermedia, no a
los componentes DIAT. Sirve tal cual.

---

## ARCHIVOS

### Generadores

```
scripts/class1/build-printables.mjs           orquestador: canon → HTML → Chrome → PDF
scripts/class1/printables/theme.mjs           sistema visual compartido
scripts/class1/printables/ruta-analogica.mjs  pieza 1 · hacer
scripts/class1/printables/ficha.mjs           pieza 2 · recordar
scripts/class1/printables/guion.mjs           guion docente v2.2
scripts/class1/printables/preview.mjs         QA visual → PNG (--gray)
```

### Plataforma

```
src/components/class1/Impresos.tsx            bloque de descargas en /clase-1
src/components/class1/ReiniciarClase.tsx      salida del bloqueo de la pregunta guía
src/components/class1/Entrega.tsx             envío, descarga y vía manual
src/app/api/clase-1/entrega/route.ts          SMTP → Resend → 503
src/lib/class1/delivery.ts                    sendSubmission, manualDelivery, fallbackMailto
```

### Descargables publicados

```
public/descargas/DIAT_Clase1_Ruta_Analogica.pdf        enlazado en /clase-1
public/descargas/DIAT_Clase1_Ficha_Imprimible.pdf      enlazado en /clase-1
public/descargas/DIAT_C1_Guion_Docente_Sala_v2.2.pdf   NO enlazado: es del profesor
public/materiales/DIAT_2026_CLASE_1_MANUAL_DEL_ESTUDIANTE_v1.0.pdf   enlazado en /clase-1
```

### Comandos

```bash
npm run build:class1-print                    # los tres PDF
npm run build:class1-print -- --only=guion    # uno solo, para iterar
node scripts/class1/printables/preview.mjs DIAT_Clase1_Ruta_Analogica --gray
npm run vercel:build                          # lo que corre Vercel
```

Los generadores necesitan Chrome o Edge (`CHROME_PATH` si no lo encuentra). **No
corren en Vercel** y no deben: los PDF se versionan ya generados.

---

## ENV · lo único que falta configurar

En **Vercel → Settings → Environment Variables**. Basta **una** de las dos vías.
Después hay que **volver a desplegar**: Vercel no inyecta variables en un
despliegue ya construido.

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=cuenta@pucv.cl
SMTP_PASSWORD=contraseña-de-aplicación
```

Con Gmail hace falta una **contraseña de aplicación**, no la normal. El
remitente cae por defecto en `SMTP_USER`, que es lo que el servidor acepta casi
siempre. Destinatario y copia salen del manifest si no se sobrescriben.

Comportamiento verificado en producción:

| Situación | Respuesta | Qué ve el alumno |
| --- | --- | --- |
| Sin configurar | `503 · configured:false` | Se descarga el archivo y se le abre el correo con destinatario y asunto puestos |
| Configurado y OK | `200` | «Enviado ✓» |
| Configurado y falla | `502` | «No se pudo enviar · Reintentar», con el trabajo intacto |
| Entrega malformada | `400` | Mensaje claro. Nunca 500 |

---

## DECISIONES DE DISEÑO YA TOMADAS

- **Chrome headless, no jsPDF.** Control tipográfico real, salida vectorial, fuentes incrustadas.
- **`overflow: hidden` en `.page`** de la Ruta y la Ficha: garantiza dos páginas exactas. Si añades contenido y desaparece, esa es la causa. El guion se exime: crece con la clase.
- **El build cuenta las páginas del PDF y falla si no cuadran.**
- **Los campos manuscritos nunca llevan fondo tintado.**
- **Interlínea ≥ 6,2 mm y casillas de 3,4 mm**: menos que eso no se rellena con lápiz pasta.
- **Ningún dato se comunica solo por color.** Verificado en escala de grises.
- **El guion lleva notas al conductor marcadas** (`OJO`, `PLAN B`, `HUMOR NEGRO`…) que no se leen en voz alta. Tienen carácter, pero cada una dice algo operativo.
- **El guion docente no se enlaza desde `/clase-1`**: ese bloque es para estudiantes.

---

## SIGUIENTE ACCIÓN

1. **Configura el correo** (bloque ENV) y vuelve a desplegar. Comprueba con una entrega real que llega.
2. **Imprime una copia** de la Ruta y de la Ficha en blanco y negro. Si los renglones quedan justos, sube `.line { min-height }` en `theme.mjs` y la altura de `matrixRow` en `ruta-analogica.mjs`.
3. **Ensayo cronometrado de punta a punta**, en móvil y en notebook. Los minutos viven en `src/content/class1/timers.ts`, en un solo objeto; si hay que ajustarlos, `runofshow.ts` tiene un invariante que impide que una etapa deje de caber en su tramo.
4. **Realinea el Documento Maestro** cuando haya tiempo. Es el único artefacto que sigue describiendo la arquitectura de diez bloques como si fuera la de la plataforma.

---

## ADENDA · 27 ago 2026, cierre de sesión

Tres fallos reportados como «no funciona el botón / no arranca el cronómetro».
Los tres reproducidos y corregidos. Commit final: `5b5488a` en `main` y en
`feat/taller-prompting-2026`, ambas sincronizadas.

### 1 · El botón de la pregunta guía no explicaba por qué estaba gris

Eliges una opción, se guarda bien, y el botón sigue deshabilitado: falta el
nivel de confianza, que es una segunda pregunta situada debajo de cinco
opciones largas — o sea, fuera de pantalla en un teléfono. Nada lo decía.

Arreglado en la primitiva, no en las dos pantallas: `PrimaryButton` acepta
`missing` y lo imprime debajo mientras está deshabilitado, con `role="status"`.
El grupo de confianza pasa a titularse «también hace falta para continuar».
Dos pruebas lo blindan (`ningún botón principal…`, `la confianza se anuncia…`).

### 2 · El cronómetro llegaba a 00:00 al volver a entrar

Con `localStorage` limpio arrancaba bien. El problema era volver: la marca de
arranque de una visita anterior seguía guardada y la etapa se abría en 00:00.
`esDeOtraSesion()` en `state.ts` descarta marcas anteriores a los 90 minutos de
la sesión. Recargar en mitad del ejercicio sigue conservando el cronómetro.

### 3 · El envío de correo no abría nada

Ya corregido antes: sin proveedor configurado se descarga el archivo y se abre
el cliente de correo en el acto, sin segundo clic.

### Lo que NO era un fallo

- El scroll funciona (los screenshots del panel de pruebas venían obsoletos).
- Los chips de alternativas registran el clic y persisten.
- El service worker cachea con red-primero para navegaciones: no sirve HTML viejo.

### Estado final verificado

`npm run test:class1` → **29/29** · `npm run lint` → **0 errores** · build OK.
En producción: aviso «Falta indicar qué tan seguro estás.» visible, cronómetro
en 03:00 al abrir con estado limpio, los cuatro PDF sirven con `application/pdf`.

### Único pendiente

Configurar SMTP en Vercel (bloque ENV más arriba) y volver a desplegar. Sin eso
el correo abre el cliente del alumno, que funciona; con eso envía solo.
