# Taller DIAT 2026

Plataforma de aprendizaje del taller de prompting y razonamiento jurídico asistido.

## Clase 1

`/clase-1` es una superficie de ejecución de cinco etapas:
**pregunta → prompt → auditoría → verificación → cierre**. El estudiante decide,
construye un prompt que se pega y se ejecuta, lo hace auditar por su propia IA,
comprueba una afirmación contra su fuente y entrega. El trabajo se conserva en el
navegador; no hay cuenta, ni backend de usuarios, ni API generativa.

- Arquitectura y extensión: [`CLASS1_ARCHITECTURE.md`](./CLASS1_ARCHITECTURE.md)
- Conflictos editoriales y decisiones abiertas: [`CLASS1_CONTENT_ISSUES.md`](./CLASS1_CONTENT_ISSUES.md)
- Pruebas: `npm test` (estado, reparto y entrega + regla dura del compilador)

### Entrega por correo

La descarga funciona siempre. El envío por correo es opcional y **server-side**:
sin las variables de [`.env.example`](./.env.example) configuradas, el botón
«Enviar Clase 1» informa de que no está disponible y el estudiante entrega
descargando el archivo. Nunca se muestra un éxito falso.

| Variable | Obligatoria | Para qué |
| --- | --- | --- |
| `RESEND_API_KEY` | sí | Clave del proveedor de correo. |
| `CLASS1_SUBMISSION_FROM` | sí | Remitente de un dominio verificado. |
| `CLASS1_SUBMISSION_EMAIL` | no | Destinatario. Por defecto, el del programa. |
| `CLASS1_SUBMISSION_CC` | no | Copia. Por defecto, la del programa. |

### Artefactos de sala

El PPT se genera desde el mismo canon que la plataforma, de modo que no puedan
contradecirse: `npm run build:class1-ppt` compila, renderiza y audita las 30
diapositivas. Requiere PowerPoint y solo se ejecuta en local.

## Desarrollo

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
