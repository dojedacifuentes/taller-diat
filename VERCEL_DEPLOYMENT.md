# Despliegue en Vercel

El repositorio es una aplicación Next.js de raíz única y no requiere base de datos ni servicios externos para desplegarse. Las únicas variables de entorno son opcionales y habilitan el envío de la entrega por correo; sin ellas la Clase 1 funciona y el estudiante entrega descargando su archivo.

## Configuración versionada

- Framework: Next.js.
- Root Directory: `.`.
- Runtime: Node.js 22.x.
- Instalación reproducible: `npm ci` desde `package-lock.json`.
- Build remoto: `npm run vercel:build`.
- Output Directory: valor automático de Next.js (`.next`); no debe sobrescribirse.

El build remoto ejecuta las pruebas de Clase 1, la comprobación del compilador de prompts, ESLint y el build de producción. Un fallo en cualquiera de las cuatro etapas impide publicar una versión defectuosa.

## Variables de entorno

Todas son server-side: ninguna lleva el prefijo `NEXT_PUBLIC_`. Se configuran en *Project Settings → Environment Variables* y están documentadas en `.env.example`.

| Variable | Obligatoria | Efecto si falta |
| --- | --- | --- |
| `RESEND_API_KEY` | para el envío | El botón «Enviar Clase 1» responde que el envío no está configurado. |
| `CLASS1_SUBMISSION_FROM` | para el envío | Igual que la anterior. |
| `CLASS1_SUBMISSION_EMAIL` | no | Se usa el destinatario del programa definido en el manifest. |
| `CLASS1_SUBMISSION_CC` | no | Se usa la copia del programa. |

La entrega no depende del correo: la descarga del documento funciona siempre y, si el envío falla, el trabajo del estudiante queda intacto y se puede reintentar.

## Git y entornos

Vercel puede conectar `dojedacifuentes/taller-diat` directamente desde GitHub. Cada push a una rama genera un Preview Deployment. La rama de producción debe seleccionarse explícitamente en Vercel; mientras esta actualización no se integre en `main`, puede usarse `feat/taller-prompting-2026` como rama de producción o mantenerse como preview.

## Datos y seguridad

La Clase 1 guarda su estado en el navegador y genera el PDF en el cliente. No existen secretos ni APIs generativas que configurar. `vercel.json` añade cabeceras defensivas y evita que el service worker quede servido con caché obsoleta.
