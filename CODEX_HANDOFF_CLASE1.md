# Handoff · Clase 1 · Impresos

Última actualización: 27 de agosto de 2026, sesión de Claude Code.
Repositorio: `dojedacifuentes/taller-diat` · rama de trabajo y producción: `main`.

---

## ESTADO

### Qué se pidió

Crear una **ruta analógica de participación** para estudiantes que lleguen sin
computador ni teléfono, como pieza física deliberada y no como versión pobre de
la plataforma. Después, una segunda pieza de **contenido e identidad**. Integrar
ambas como descargables en `/clase-1` y verificar coherencia con el canon.

### Terminado

- [x] `DIAT_Clase1_Ruta_Analogica.pdf` — A4, **2 páginas exactas**, verificado visualmente en color y en escala de grises.
- [x] `DIAT_Clase1_Ficha_Imprimible.pdf` — A4, **2 páginas exactas**, verificado visualmente.
- [x] Fuente de generación versionada (`scripts/class1/printables/`), más el HTML de cada pieza junto al PDF como fuente editable.
- [x] Guardas de canon que abortan el build si alguien altera los 7 componentes, ICJR, los 5 estatus, las 7 señales, las 7 instrucciones de control, los 4 tipos de error o las 3 reglas.
- [x] Integración en `/clase-1` mediante `<Impresos />`, con ruta `/descargas/…`.
- [x] Prueba automatizada que verifica existencia, cabecera `%PDF-`, 2 páginas, fuente HTML y enlace real desde la clase.
- [x] QR de la ficha generado desde `CLASS_ORIGIN + CLASS_ROOT` del manifest — no es una URL escrita a mano.
- [x] `npm run test:class1` → 25/25. `npm run lint` → 0 errores. `next build` → OK.

### Parcialmente terminado

Nada. Las dos piezas están cerradas y verificadas.

### Falta

1. **Commit y push no realizados en esta sesión.** El árbol de trabajo tiene los cambios; ver «SIGUIENTE ACCIÓN».
2. **Prueba de impresión física real.** Se verificó el render, no una impresora de verdad. Conviene tirar una copia antes de la sesión.
3. **Guion docente v2.2.** Sigue pendiente de una sesión anterior: el PPT ya está alineado con la reforma de la plataforma (601 comprobaciones, 0 fallos), el guion de sala v2.1 no. No lo toca esta entrega.

---

## CANON — no modificar

Todo el contenido sustantivo se **importa** de `src/content/class1/activities.ts`
y `src/content/class1/manifest.ts`. No se escribe a mano en los imprimibles. Si
una formulación cambia allí, cambia en el papel al siguiente build.

| Elemento | Valor canónico | Guarda |
| --- | --- | --- |
| Componentes DIAT | Contexto · Rol · Tarea · Fuentes · Restricciones · Formato · Control | sí |
| Nomenclatura | «siete componentes» / «siete preguntas de diseño». **Nunca «capas»** | — |
| Aporte del programa | Fuentes y Control (`signature: true`) | — |
| ICJR | Identificar · Contrastar · Justificar · Registrar, en ese orden | sí |
| Estatus | A · B · C · D · E con sus etiquetas exactas | sí |
| Señales de alerta | 7 | sí |
| Instrucciones de control | 7 | sí |
| Tipos de error | 4 | sí |
| Reglas finales | 3, formulación literal del manifest | sí |
| Matriz ICJR de aula | **5 columnas · 2 afirmaciones** (no la versión profesional de 8) | — |
| Modalidad | trabajo individual guiado + puesta en común | — |

**Contenido jurídico ficticio.** La página 2 de la Ruta usa una respuesta
simulada con tres afirmaciones. La 01 cita el art. 2515 CC (real y correcto,
tomado de `solvedRow`). La 02 usa el marcador canónico `[APELLIDO, Nombre]` y
`[TÍTULO INEXISTENTE]`, subrayados en carmesí y rotulados como ficticios. **No
se inventó jurisprudencia ni se atribuyó obra inexistente a persona real.** Si
tocas ese bloque, mantén esa regla.

---

## ARCHIVOS

### Creados

```
scripts/class1/build-printables.mjs              orquestador: canon → HTML → Chrome → PDF
scripts/class1/printables/theme.mjs              sistema visual compartido (paleta, casillas, renglones)
scripts/class1/printables/ruta-analogica.mjs     pieza 1 · hacer
scripts/class1/printables/ficha.mjs              pieza 2 · recordar
scripts/class1/printables/preview.mjs            QA visual → PNG (--gray para blanco y negro)
src/components/class1/Impresos.tsx               bloque de descarga en /clase-1
public/descargas/DIAT_Clase1_Ruta_Analogica.pdf  ENTREGABLE
public/descargas/DIAT_Clase1_Ruta_Analogica.html fuente editable
public/descargas/DIAT_Clase1_Ficha_Imprimible.pdf  ENTREGABLE
public/descargas/DIAT_Clase1_Ficha_Imprimible.html fuente editable
CODEX_HANDOFF_CLASE1.md                          este archivo
```

### Modificados

```
src/components/class1/stages/Pregunta.tsx        monta <Impresos /> al final de la etapa de entrada
tests/class1.test.mjs                            + prueba «las dos piezas imprimibles…»
package.json                                     + script build:class1-print
```

### Comandos

```bash
npm run build:class1-print              # regenera ambos PDF
npm run build:class1-print -- --only=ruta   # solo una pieza, para iterar
node scripts/class1/printables/preview.mjs DIAT_Clase1_Ruta_Analogica         # PNG de QA
node scripts/class1/printables/preview.mjs DIAT_Clase1_Ruta_Analogica --gray  # QA en blanco y negro
```

El orquestador necesita Chrome o Edge. Los busca solo; si no aparece, define
`CHROME_PATH`. **No corre en el build remoto de Vercel** y no debe: los PDF se
versionan ya generados.

---

## DECISIONES DE DISEÑO YA TOMADAS

- **Chrome headless, no jsPDF.** Control tipográfico real, salida vectorial, fuentes incrustadas y el mismo motor que compone la web.
- **`overflow: hidden` en `.page`.** Garantiza dos páginas exactas: lo que no cabe, no entra. Si añades contenido y desaparece, esa es la causa.
- **El build cuenta las páginas del PDF y falla si no son 2.** No se confía en que salgan bien.
- **Los campos manuscritos nunca llevan fondo tintado.** `.card` es contenido impreso; `.field` y `.writebox` son zonas de escritura y van en blanco.
- **Interlínea de 6,2 mm mínimo** y casillas de 3,4 mm: menos que eso no se rellena con lápiz pasta.
- **Ningún dato se comunica solo por color.** Verificado en escala de grises.
- **`.body` con `space-between`** reparte el aire sobrante entre secciones en vez de acumularlo al pie.

---

## VALIDACIÓN

| Comprobación | Resultado |
| --- | --- |
| `npm run test:class1` | **25/25** |
| `npm run lint` | **0 errores**, 8 warnings preexistentes |
| `next build` | compila; `/clase-1` y las 4 etapas se prerenderizan |
| `npm run vercel:build` | exit 0 |
| Ruta analógica · páginas | **2** |
| Ficha imprimible · páginas | **2** |
| Revisión visual color | ambas piezas, ambas páginas |
| Revisión visual escala de grises | Ruta p2 · jerarquía y casillas íntegras |
| QR | apunta a `https://taller-diat.vercel.app/clase-1`, que responde 200 |
| Canon | guardas en verde |

### Problemas conocidos

- La ficha reparte el aire con `space-between`; en la página 2 los huecos entre secciones quedan generosos. Es legible y editorial, pero si se prefiere más compacto, añadir contenido canónico antes que reducir cuerpos de letra.
- El HTML junto al PDF pesa ~230–375 KB porque lleva los logos en base64. Es deliberado: la fuente tiene que abrir sin dependencias.

---

## SIGUIENTE ACCIÓN

Empieza por la 1.

1. **Commit y push.** El árbol tiene todo listo y verificado.
   ```bash
   git add -A
   git commit -m "feat(clase-1): ruta analógica y ficha imprimible"
   git push origin HEAD:refs/heads/main
   ```
   Vercel despliega desde `main`. Espera al despliegue y comprueba:
   ```bash
   curl -s -o /dev/null -w "%{http_code}\n" https://taller-diat.vercel.app/descargas/DIAT_Clase1_Ruta_Analogica.pdf
   ```
   Debe devolver `200`. Repite con `DIAT_Clase1_Ficha_Imprimible.pdf`.

2. **Imprime una copia física de cada pieza** en una impresora común, en blanco y negro. Comprueba que los renglones de «Mi versión 1» y las celdas de la Matriz ICJR admiten letra manuscrita real. Si no, sube `.line { min-height }` en `scripts/class1/printables/theme.mjs` y la altura de `matrixRow` en `ruta-analogica.mjs`.

3. **Guion docente v2.2** (pendiente de la sesión anterior). El PPT y la plataforma ya usan el reparto nuevo —51 min de conducción, 39 de plataforma, definido en `src/content/class1/runofshow.ts`—; el guion de sala v2.1 todavía describe el reparto viejo y manda al estudiante a rutas `/clase-1/b0X` que hoy redirigen. Fuente: `CLASE 1_ACTUALIZADA/DIAT_C1_GUION_DOCENTE_SALA_v2.1.docx`. Estrategia recomendada: generar el DOCX reutilizando todas las partes OOXML del v2.1 salvo `word/document.xml`.

4. **Menciona los impresos en el guion** cuando lo regeneres: el profesor debe saber que existen y llevarlos impresos. Va en «Antes de entrar a la sala».
