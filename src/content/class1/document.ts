// ─────────────────────────────────────────────────────────────────────────────
// CLASE 1 · DOCUMENTO CONDUCTOR
//
// El Documento Maestro (Parte VII, decisión 1) deja abierta la pieza jurídica
// concreta sobre la que giran B04, B07 y B08. NO se inventa aquí.
//
// El contenido jurídico está desacoplado de la interfaz: cuando el equipo fije
// la sentencia, basta con completar este objeto —o sustituir `workingDocument`
// por otro que cumpla la misma forma— sin tocar ningún componente.
//
// Ver CLASS1_CONTENT_ISSUES.md → C1-05.
// ─────────────────────────────────────────────────────────────────────────────

export interface WorkingDocument {
  /** `false` mientras el equipo no fije la pieza. La UI se adapta sola. */
  defined: boolean;
  /** Título completo de la sentencia o del texto normativo. */
  title: string;
  /** Rol, boletín o identificador. */
  reference: string;
  court: string;
  date: string;
  /** URL pública de descarga, si existe. */
  url?: string;
  /** Materia, para encuadrar el ejercicio. */
  subject: string;
  /** Cómo se citan sus fragmentos: «Considerando N.º», «Art. N.º»… */
  locatorLabel: string;
  /** Texto que ve el estudiante cuando la pieza aún no está fijada. */
  fallbackNote: string;
}

/** Perfil exigido por el Documento Maestro (III.3) para la pieza definitiva. */
export const workingDocumentProfile = {
  extension: 'Entre 6 y 12 páginas.',
  structure: 'Considerandos o secciones numeradas: sin numeración no hay localizadores.',
  subject: 'Civil, de consumo o laboral. Evitar materias penales con hechos sensibles.',
  source: 'Pública y descargable, para que se pueda contrastar en vivo.',
  contents: 'Al menos una norma citada, una referencia jurisprudencial y una regla general con excepción.',
  privacy: 'Sin datos sensibles, aunque sea público.',
  planB:
    'Si no se fija a tiempo: un texto normativo con estructura de artículos más un informe público breve. Se pierde el ejercicio de razonamiento judicial; se conservan Prompt Lab, demostración y matriz.',
} as const;

export const workingDocument: WorkingDocument = {
  defined: false,
  title: '',
  reference: '',
  court: '',
  date: '',
  subject: '',
  locatorLabel: 'Considerando',
  fallbackNote:
    'El documento de trabajo de esta sesión lo indica el profesor al comenzar el bloque. Trabaja con la pieza que se proyecte en sala; si prefieres, puedes usar un documento propio siempre que sea público o esté anonimizado.',
};

/** Etiqueta corta para mostrar en las actividades. */
export function workingDocumentLabel(): string {
  return workingDocument.defined
    ? `${workingDocument.title} · ${workingDocument.reference}`
    : 'Documento de trabajo de la sesión';
}
