// ─────────────────────────────────────────────────────────────────────────────
// CATÁLOGO DE MATERIALES
//
// Dos formas de entrega conviven, y la distinción es deliberada:
//
//   · `href` con ruta  → el archivo existe en /public/materiales. Son las
//     presentaciones (PPTX y PDF), los guiones y el manual, generados por los
//     scripts de scripts/ y versionados en el repositorio.
//   · `href: null` + `generator` → el PDF se produce en el navegador con jsPDF
//     al hacer clic, con la misma identidad visual del dossier. Es el mecanismo
//     que ya usaba la plataforma y evita duplicar contenido en dos lugares.
//
// Ningún material puede quedar con href '#', vacío o «próximamente».
// ─────────────────────────────────────────────────────────────────────────────
import type { Material } from '@/lib/types';

const DIR = '/materiales';

export const materials: Material[] = [
  // ── Plantillas y fichas de trabajo (generadas en el navegador) ────────────
  {
    code: '01',
    title: 'Estructura del prompt jurídico DIAT',
    description:
      'Las siete capas —contexto, rol, tarea, fuentes, restricciones, formato y control— con la pregunta que responde cada una y un ejemplo por capa.',
    session: 1, kind: 'Plantilla', format: 'PDF',
    href: null, generator: 'estructuraPrompt',
  },
  {
    code: '02',
    title: 'Matriz de verificación',
    description:
      'Plantilla imprimible de seis columnas: afirmación, fuente indicada por la IA, fuente real, coincidencia, nivel de confianza y corrección.',
    session: 1, kind: 'Plantilla', format: 'PDF',
    href: null, generator: 'matrizVerificacion',
  },
  {
    code: '03',
    title: 'Checklist anti-alucinaciones',
    description:
      'Los cinco estados de una afirmación, el protocolo identificar–contrastar–justificar–registrar y las señales de alarma más frecuentes.',
    session: 1, kind: 'Guía', format: 'PDF',
    href: null, generator: 'checklistAlucinaciones',
  },
  {
    code: '04',
    title: 'Canvas del flujo jurídico',
    description:
      'Las seis casillas del flujo —entrada, IA, fuente, control humano, salida y registro— en formato de trabajo para completar en mesa.',
    session: 2, kind: 'Plantilla', format: 'PDF',
    href: null, generator: 'canvasFlujo',
  },
  {
    code: '05',
    title: 'Registro de validación',
    description:
      'Bitácora de diez campos para documentar cada paso del flujo: qué se hizo, con qué herramienta, contra qué fuente, qué falló y quién decidió.',
    session: 2, kind: 'Plantilla', format: 'PDF',
    href: null, generator: 'registroValidacion',
  },
  {
    code: '06',
    title: 'Ficha de desafío · Match Making',
    description:
      'Los doce campos de la ficha, con la pregunta que responde cada uno y un ejemplo completo. Incluye el campo de límites explícitos.',
    session: 3, kind: 'Plantilla', format: 'PDF',
    href: null, generator: 'fichaDesafio',
  },
  {
    code: '07',
    title: 'Rúbrica de evaluación y pitch',
    description:
      'Los seis criterios oficiales con sus porcentajes, traducidos a cuatro niveles con descriptores observables, y la estructura del pitch de 4 minutos.',
    session: 3, kind: 'Rúbrica', format: 'PDF',
    href: null, generator: 'rubrica',
  },
  {
    code: '08',
    title: 'Glosario de IA jurídica',
    description:
      'Treinta y tres términos agrupados en fundamentos, prompting, verificación, riesgos y flujo. Cada uno con definición breve y ejemplo jurídico.',
    session: 0, kind: 'Guía', format: 'PDF',
    href: null, generator: 'glosario',
  },
  {
    code: '09',
    title: 'Caso guiado · Sesión 1',
    description:
      'Caso troncal CT-01 completo: enunciado, fuentes oficiales verificadas, errores inducidos y respuesta precalculada para trabajar sin internet.',
    session: 1, kind: 'Caso', format: 'PDF',
    href: null, generator: 'casoSesion1',
  },
  {
    code: '10',
    title: 'Caso de laboratorio · Sesión 2',
    description:
      'El caso troncal convertido en flujo, el ejercicio del flujo defectuoso y dos respuestas precalculadas para la comparación crítica.',
    session: 2, kind: 'Caso', format: 'PDF',
    href: null, generator: 'casoSesion2',
  },
  {
    code: '11',
    title: 'Guía de Match Making',
    description:
      'Cómo traducir un problema jurídico a otra disciplina, formación de equipos, reglas de mesa y los tres formatos de pitch según número de equipos.',
    session: 3, kind: 'Guía', format: 'PDF',
    href: null, generator: 'guiaMatchMaking',
  },
  {
    code: '12',
    title: 'Kit rápido de prompting DIAT',
    description:
      'Una hoja para llevar: las siete capas, los cinco estados de verificación, las seis casillas del flujo y las reglas de privacidad.',
    session: 0, kind: 'Guía', format: 'PDF',
    href: null, generator: 'kitRapido',
  },

  // ── Manual del participante ───────────────────────────────────────────────
  {
    code: 'M',
    title: 'Manual del participante',
    description:
      'El taller completo en un documento: vocabulario, capacidades y límites de la IA, estructura DIAT, verificación, flujo, Match Making, rúbrica y reglas de privacidad.',
    session: 0, kind: 'Manual', format: 'PDF',
    href: `${DIR}/Manual_Taller_Prompting_Juridico_3_DIAT_2026.pdf`,
  },

  // ── Presentaciones ────────────────────────────────────────────────────────
  {
    code: 'P1',
    title: 'Presentación · Sesión 1',
    description:
      'Del prompt aislado al razonamiento jurídico asistido. Incluye notas del presentador con responsable y duración por diapositiva.',
    session: 1, kind: 'Presentación', format: 'PPTX',
    href: `${DIR}/Sesion_1_Prompting_Juridico_DIAT_2026.pptx`,
  },
  {
    code: 'P1P',
    title: 'Presentación · Sesión 1 (PDF)',
    description: 'Versión PDF de la sesión 1, para proyectar sin PowerPoint o para el plan de contingencia sin internet.',
    session: 1, kind: 'Presentación', format: 'PDF',
    href: `${DIR}/Sesion_1_Prompting_Juridico_DIAT_2026.pdf`,
  },
  {
    code: 'P2',
    title: 'Presentación · Sesión 2',
    description:
      'Laboratorio jurídico: del prompt al flujo verificable. Incluye notas del presentador con responsable y duración por diapositiva.',
    session: 2, kind: 'Presentación', format: 'PPTX',
    href: `${DIR}/Sesion_2_Flujo_Verificable_DIAT_2026.pptx`,
  },
  {
    code: 'P2P',
    title: 'Presentación · Sesión 2 (PDF)',
    description: 'Versión PDF de la sesión 2, para proyectar sin PowerPoint o para el plan de contingencia sin internet.',
    session: 2, kind: 'Presentación', format: 'PDF',
    href: `${DIR}/Sesion_2_Flujo_Verificable_DIAT_2026.pdf`,
  },
  {
    code: 'P3',
    title: 'Presentación · Sesión 3',
    description:
      'Match Making: Derecho conversa con otras disciplinas. Incluye notas del presentador con responsable y duración por diapositiva.',
    session: 3, kind: 'Presentación', format: 'PPTX',
    href: `${DIR}/Sesion_3_Match_Making_DIAT_2026.pptx`,
  },
  {
    code: 'P3P',
    title: 'Presentación · Sesión 3 (PDF)',
    description: 'Versión PDF de la sesión 3, para proyectar sin PowerPoint o para el plan de contingencia sin internet.',
    session: 3, kind: 'Presentación', format: 'PDF',
    href: `${DIR}/Sesion_3_Match_Making_DIAT_2026.pdf`,
  },

  // ── Guiones de expositor ──────────────────────────────────────────────────
  {
    code: 'G1',
    title: 'Guion de expositor · Sesión 1',
    description:
      'Cronograma minuto a minuto, responsable por bloque, frases de transición, preguntas al grupo, errores frecuentes y plan B.',
    session: 1, kind: 'Guía', format: 'DOCX',
    href: `${DIR}/Guion_Sesion_1.docx`,
  },
  {
    code: 'G1P',
    title: 'Guion de expositor · Sesión 1 (PDF)',
    description: 'Versión PDF del guion de la sesión 1, lista para imprimir y llevar a la sala.',
    session: 1, kind: 'Guía', format: 'PDF',
    href: `${DIR}/Guion_Sesion_1.pdf`,
  },
  {
    code: 'G2',
    title: 'Guion de expositor · Sesión 2',
    description:
      'Cronograma minuto a minuto, responsable por bloque, frases de transición, preguntas al grupo, errores frecuentes y plan B.',
    session: 2, kind: 'Guía', format: 'DOCX',
    href: `${DIR}/Guion_Sesion_2.docx`,
  },
  {
    code: 'G2P',
    title: 'Guion de expositor · Sesión 2 (PDF)',
    description: 'Versión PDF del guion de la sesión 2, lista para imprimir y llevar a la sala.',
    session: 2, kind: 'Guía', format: 'PDF',
    href: `${DIR}/Guion_Sesion_2.pdf`,
  },
  {
    code: 'G3',
    title: 'Guion de expositor · Sesión 3',
    description:
      'Cronograma minuto a minuto, responsable por bloque, formatos de pitch según número de equipos, contingencias y plan B.',
    session: 3, kind: 'Guía', format: 'DOCX',
    href: `${DIR}/Guion_Sesion_3.docx`,
  },
  {
    code: 'G3P',
    title: 'Guion de expositor · Sesión 3 (PDF)',
    description: 'Versión PDF del guion de la sesión 3, lista para imprimir y llevar a la sala.',
    session: 3, kind: 'Guía', format: 'PDF',
    href: `${DIR}/Guion_Sesion_3.pdf`,
  },
];

/** Filtros de la sección «Materiales del taller». */
export const materialFilters = [
  { id: 'todos', label: 'Todos' },
  { id: 's1', label: 'Sesión 1' },
  { id: 's2', label: 'Sesión 2' },
  { id: 's3', label: 'Sesión 3' },
  { id: 'plantillas', label: 'Plantillas' },
  { id: 'presentaciones', label: 'Presentaciones' },
] as const;

export type MaterialFilter = (typeof materialFilters)[number]['id'];

export function filterMaterials(filter: MaterialFilter): Material[] {
  switch (filter) {
    case 's1': return materials.filter(m => m.session === 1);
    case 's2': return materials.filter(m => m.session === 2);
    case 's3': return materials.filter(m => m.session === 3);
    case 'plantillas': return materials.filter(m => m.kind === 'Plantilla' || m.kind === 'Rúbrica');
    case 'presentaciones': return materials.filter(m => m.kind === 'Presentación');
    default: return materials;
  }
}

export function materialsForSession(session: number): Material[] {
  return materials.filter(m => m.session === session || m.session === 0);
}

/** Los doce descargables numerados, en orden, para la vista de sesión. */
export const numberedMaterials = materials.filter(m => /^\d{2}$/.test(m.code));
