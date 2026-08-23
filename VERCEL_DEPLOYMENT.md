# Despliegue en Vercel

El repositorio es una aplicación Next.js de raíz única y no requiere variables de entorno, base de datos ni servicios externos para desplegarse.

## Configuración versionada

- Framework: Next.js.
- Root Directory: `.`.
- Runtime: Node.js 22.x.
- Instalación reproducible: `npm ci` desde `package-lock.json`.
- Build remoto: `npm run vercel:build`.
- Output Directory: valor automático de Next.js (`.next`); no debe sobrescribirse.

El build remoto ejecuta las pruebas de Clase 1, ESLint y el build de producción. Un fallo en cualquiera de las tres etapas impide publicar una versión defectuosa.

## Git y entornos

Vercel puede conectar `dojedacifuentes/taller-diat` directamente desde GitHub. Cada push a una rama genera un Preview Deployment. La rama de producción debe seleccionarse explícitamente en Vercel; mientras esta actualización no se integre en `main`, puede usarse `feat/taller-prompting-2026` como rama de producción o mantenerse como preview.

## Datos y seguridad

La Clase 1 guarda su estado en el navegador y genera el PDF en el cliente. No existen secretos ni APIs generativas que configurar. `vercel.json` añade cabeceras defensivas y evita que el service worker quede servido con caché obsoleta.
