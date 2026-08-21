// ─────────────────────────────────────────────────────────────────────────────
// ROLES DE EJECUCIÓN Y MATRIZ RACI
//
// ARCHIVO DE CONFIGURACIÓN EDITABLE. Para asignar quién relata cada sesión,
// basta cambiar el campo `assigned` de `roleSlots` más abajo. Toda la
// plataforma, los guiones y las presentaciones leen desde aquí.
//
// Advertencia deliberada: NO se afirma quiénes son los dos relatores
// principales de cada sesión, porque esa decisión no consta en la propuesta
// académica ni en ningún documento del proyecto. Los espacios quedan abiertos
// y la rotación propuesta es tentativa, no una designación.
// ─────────────────────────────────────────────────────────────────────────────
import { equipoEjecutor } from '@/data/team';

/** Personas del equipo ejecutor, tal como constan en el proyecto. */
export const roster = equipoEjecutor;

/**
 * Espacios de rol por sesión. `assigned` en null significa «por definir»:
 * la interfaz lo muestra como pendiente en vez de inventar un nombre.
 * Para asignar, poner el `id` de la persona (p. ej. 'ee-04').
 */
export interface RoleSlot {
  session: number;
  slot: 'Relator/a estudiantil A' | 'Relator/a estudiantil B' | 'Facilitador/a de apoyo 1' | 'Facilitador/a de apoyo 2';
  assigned: string | null;
  duties: string;
}

export const roleSlots: RoleSlot[] = [
  { session: 1, slot: 'Relator/a estudiantil A', assigned: null, duties: 'Conduce la autopsia del mal prompt y abre el laboratorio guiado.' },
  { session: 1, slot: 'Relator/a estudiantil B', assigned: null, duties: 'Conduce el cazador de alucinaciones y la revisión entre pares.' },
  { session: 1, slot: 'Facilitador/a de apoyo 1', assigned: null, duties: 'Acompaña mesas 1 a 4 durante el laboratorio y la matriz.' },
  { session: 1, slot: 'Facilitador/a de apoyo 2', assigned: null, duties: 'Acompaña mesas 5 en adelante y controla los tiempos de bloque.' },

  { session: 2, slot: 'Relator/a estudiantil A', assigned: null, duties: 'Conduce la reconstrucción del flujo defectuoso.' },
  { session: 2, slot: 'Relator/a estudiantil B', assigned: null, duties: 'Conduce la comparación crítica y la auditoría cruzada.' },
  { session: 2, slot: 'Facilitador/a de apoyo 1', assigned: null, duties: 'Acompaña el laboratorio de flujos y resuelve bloqueos de herramienta.' },
  { session: 2, slot: 'Facilitador/a de apoyo 2', assigned: null, duties: 'Verifica que cada equipo complete el registro de validación.' },

  { session: 3, slot: 'Relator/a estudiantil A', assigned: null, duties: 'Conduce el Match Making y la formación de equipos.' },
  { session: 3, slot: 'Relator/a estudiantil B', assigned: null, duties: 'Conduce el bloque de pitch y controla el temporizador.' },
  { session: 3, slot: 'Facilitador/a de apoyo 1', assigned: null, duties: 'Acompaña mesas interdisciplinarias 1 a 3.' },
  { session: 3, slot: 'Facilitador/a de apoyo 2', assigned: null, duties: 'Acompaña mesas interdisciplinarias 4 en adelante.' },
];

export function slotsFor(session: number) {
  return roleSlots.filter(s => s.session === session);
}

export function nameFor(id: string | null): string | null {
  if (!id) return null;
  return roster.find(p => p.id === id)?.name ?? null;
}

/** Cuántos espacios de relatoría siguen sin asignar. */
export const unassignedSlots = roleSlots.filter(s => s.assigned === null).length;

// ─── Rotación propuesta (tentativa) ──────────────────────────────────────────
export const rotationProposal = [
  { session: 1, proposal: 'Relatores A + B fijos. Los otros integrantes acompañan mesas y observan para poder rotar.' },
  { session: 2, proposal: 'Rotación o continuidad según cómo haya resultado la sesión 1. Si se rota, quien relató en la sesión 1 acompaña mesas.' },
  { session: 3, proposal: 'Dos relatores principales conducen; el resto del equipo acompaña mesas interdisciplinarias, una persona por mesa cuando sea posible.' },
];

export const rotationCaveat =
  'Propuesta tentativa. La designación definitiva corresponde a la subdirección del taller y no consta en los documentos del proyecto.';

// ─── Responsabilidades funcionales ───────────────────────────────────────────
export const functionalRoles = [
  {
    id: 'ee-01',
    area: 'Dirección académica y relatoría principal',
    duties: [
      'Aprobar el enfoque y definir los estándares del taller.',
      'Exponer el marco conceptual y realizar las demostraciones clave.',
      'Explicar límites, verificación y responsabilidad profesional.',
      'Supervisar a los relatores estudiantiles.',
      'Resolver contingencias académicas en sala.',
      'Abrir y cerrar el arco de las tres sesiones.',
      'Revisión final del material.',
    ],
  },
  {
    id: 'ee-02',
    area: 'Coordinación pedagógica y experiencia de participantes',
    duties: [
      'Revisar que las instrucciones de cada actividad se entiendan sin explicación adicional.',
      'Mantener los checklists y el control de materiales.',
      'Apoyo de sala y seguimiento de actividades.',
      'Registro de dudas frecuentes para ajustar la sesión siguiente.',
    ],
  },
  {
    id: 'ee-03',
    area: 'Coordinación operativa y soporte de laboratorio',
    duties: [
      'Soporte técnico y navegación por la plataforma durante la sesión.',
      'Contingencia de proyección e internet.',
      'Preparación de materiales impresos y de respaldo.',
      'Control de tiempos de bloque.',
    ],
  },
];

export const functionalRolesNote =
  'Distribución funcional propuesta para la ejecución. No constituye designación de cargos institucionales ni atribuye grados académicos.';

// ─── Matriz RACI ─────────────────────────────────────────────────────────────
export interface RaciRow {
  task: string;
  responsible: string;
  support: string;
  validator: string;
  moment: string;
  material: string;
}

export const raci: RaciRow[] = [
  {
    task: 'Aprobación del enfoque y del material final',
    responsible: 'Diego · Subdirección',
    support: 'Coordinación pedagógica',
    validator: 'Diego · Subdirección',
    moment: 'Antes de la sesión 1',
    material: 'Guiones, presentaciones, descargables',
  },
  {
    task: 'Impresión y preparación de materiales',
    responsible: 'Coordinación operativa',
    support: 'Coordinación pedagógica',
    validator: 'Diego · Subdirección',
    moment: 'Día previo a cada sesión',
    material: 'Fichas 01–07, casos, exit tickets',
  },
  {
    task: 'Prueba de sala, proyección e internet',
    responsible: 'Coordinación operativa',
    support: 'Facilitación',
    validator: 'Coordinación operativa',
    moment: '30 minutos antes de cada sesión',
    material: 'Proyector, plataforma, outputs precalculados',
  },
  {
    task: 'Microdiagnóstico de entrada',
    responsible: 'Diego · Subdirección',
    support: 'Coordinación pedagógica',
    validator: 'Coordinación pedagógica',
    moment: 'Sesión 1 · minutos 0–5',
    material: 'Microdiagnóstico',
  },
  {
    task: 'Marco conceptual y demostraciones',
    responsible: 'Diego · Subdirección',
    support: 'Coordinación operativa',
    validator: 'Diego · Subdirección',
    moment: 'Primer tercio de cada sesión',
    material: 'Presentación de la sesión',
  },
  {
    task: 'Conducción de actividades y laboratorios',
    responsible: 'Relatoría estudiantil A y B',
    support: 'Facilitación de apoyo',
    validator: 'Diego · Subdirección',
    moment: 'Bloque facilitado de cada sesión',
    material: 'Fichas de la sesión, plataforma',
  },
  {
    task: 'Acompañamiento de mesas',
    responsible: 'Facilitación de apoyo',
    support: 'Relatoría estudiantil',
    validator: 'Coordinación pedagógica',
    moment: 'Durante los laboratorios',
    material: 'Casos y checklists',
  },
  {
    task: 'Control de tiempos de bloque',
    responsible: 'Coordinación operativa',
    support: 'Relatoría estudiantil',
    validator: 'Diego · Subdirección',
    moment: 'Toda la sesión',
    material: 'Run of show impreso',
  },
  {
    task: 'Recolección de exit tickets',
    responsible: 'Coordinación pedagógica',
    support: 'Facilitación de apoyo',
    validator: 'Coordinación pedagógica',
    moment: 'Cierre de cada sesión',
    material: 'Exit tickets',
  },
  {
    task: 'Coordinación de invitados de otras disciplinas',
    responsible: 'Coordinación pedagógica',
    support: 'Diego · Subdirección',
    validator: 'Diego · Subdirección',
    moment: 'Semana previa a la sesión 3',
    material: 'Invitación y ficha de desafío',
  },
  {
    task: 'Conducción del bloque de pitch',
    responsible: 'Relatoría estudiantil B',
    support: 'Coordinación operativa',
    validator: 'Diego · Subdirección',
    moment: 'Sesión 3 · minutos 63–87',
    material: 'Pitch timer, rúbrica 07',
  },
  {
    task: 'Instrumento de salida y cierre de indicadores',
    responsible: 'Coordinación pedagógica',
    support: 'Facilitación de apoyo',
    validator: 'Diego · Subdirección',
    moment: 'Cierre de la sesión 3',
    material: 'Instrumento de salida',
  },
];
