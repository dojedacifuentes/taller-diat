// ─────────────────────────────────────────────────────────────────────────────
// Resolutor mínimo para ejecutar los módulos de `src/content/class1/*.ts` con
// Node sin transpilar.
//
// Node exige extensión explícita en los especificadores ESM; el proyecto usa la
// convención de Next.js (`from './manifest'`). Este hook prueba `.ts` y `.tsx`
// antes de rendirse, de modo que el generador del PPTX pueda importar el canon
// TAL CUAL lo consume la plataforma, sin copiarlo ni compilarlo.
//
// Se usa junto a `--experimental-strip-types`, que elimina las anotaciones de
// tipo en memoria. Los tres módulos que importamos son datos con anotaciones:
// no usan enum, decoradores ni namespaces, así que el borrado es suficiente.
// ─────────────────────────────────────────────────────────────────────────────

import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/** Raíz del proyecto, para resolver el alias `@/` de tsconfig. */
const SRC_URL = new URL('../../src/', import.meta.url).href;

const HOOK = `
const SRC_URL = ${JSON.stringify(SRC_URL)};

export async function resolve(specifier, context, nextResolve) {
  // Alias \`@/…\` de tsconfig. Node no lee tsconfig, así que se traduce aquí.
  if (specifier.startsWith('@/')) {
    specifier = SRC_URL + specifier.slice(2);
    context = { ...context, parentURL: SRC_URL };
  }
  // Los .json que el proyecto importa a la manera de TypeScript
  // (\`import x from './a.json'\`, sin atributo) necesitan que se lo añadamos:
  // tsconfig usa resolveJsonModule, pero Node ESM exige el atributo explícito.
  if (specifier.endsWith('.json')) {
    return nextResolve(specifier, { ...context, importAttributes: { type: 'json' } });
  }
  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    const relative =
      specifier.startsWith('.') || specifier.startsWith('/') || specifier.startsWith('file:');
    if (!relative) throw err;
    for (const ext of ['.ts', '.tsx', '/index.ts']) {
      try {
        return await nextResolve(specifier + ext, context);
      } catch {}
    }
    throw err;
  }
}

export async function load(url, context, nextLoad) {
  if (url.endsWith('.json')) {
    return nextLoad(url, { ...context, importAttributes: { type: 'json' } });
  }
  return nextLoad(url, context);
}
`;

register(`data:text/javascript,${encodeURIComponent(HOOK)}`, pathToFileURL('./'));

// Silencia el aviso de "module type not specified": los .ts del proyecto son ESM.
process.removeAllListeners('warning');
process.on('warning', (w) => {
  if (w.name === 'ExperimentalWarning') return;
  if (String(w.message).includes('MODULE_TYPELESS_PACKAGE_JSON')) return;
  if (String(w.message).includes("Module type of file")) return;
  console.warn(w.message);
});

export { existsSync, fileURLToPath };
