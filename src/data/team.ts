import type { TeamMember } from '@/lib/types';

// ── Equipo Ejecutor — Integrantes del Programa DIAT ────────────────────────
export const equipoEjecutor = [
  {
    id: 'ee-01',
    name: 'Diego Ojeda Cifuentes',
    rol: 'Subdirector de los Talleres',
    calidad: 'Egresado Derecho PUCV',
    initials: 'DO',
    color: 'cyan',
  },
  {
    id: 'ee-02',
    name: 'Paola Menéndez Pastorelli',
    rol: 'Integrante',
    calidad: 'Egresada Derecho PUCV',
    initials: 'PM',
    color: 'indigo',
  },
  {
    id: 'ee-03',
    name: 'Héctor Marilao Ramírez',
    rol: 'Integrante',
    calidad: 'Egresado Derecho PUCV',
    initials: 'HM',
    color: 'blue',
  },
  {
    id: 'ee-04',
    name: 'Nareth Gaete Tapia',
    rol: 'Integrante',
    calidad: 'Estudiante Derecho PUCV',
    initials: 'NG',
    color: 'purple',
  },
  {
    id: 'ee-05',
    name: 'Constanza Martínez Astorga',
    rol: 'Integrante',
    calidad: 'Estudiante Derecho PUCV',
    initials: 'CM',
    color: 'emerald',
  },
  {
    id: 'ee-06',
    name: 'María Inés Díaz Valdés',
    rol: 'Integrante',
    calidad: 'Estudiante Derecho PUCV',
    initials: 'MD',
    color: 'teal',
  },
] as const;

// ── teamMembers legacy — kept for type compatibility with pages that import it
export const teamMembers: TeamMember[] = equipoEjecutor.map((m, i) => ({
  id: m.id,
  name: m.name,
  role: i === 0 ? 'Subdirector' : 'Integrante',
  status: 'active' as const,
  initials: m.initials,
  color: m.color,
}));

export const roleColors: Record<string, string> = {
  'Director': 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10',
  'Subdirector': 'text-indigo-400 border-indigo-400/30 bg-indigo-400/10',
  'Coordinación': 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  'Difusión': 'text-purple-400 border-purple-400/30 bg-purple-400/10',
  'Evidencias': 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  'Soporte Técnico': 'text-teal-400 border-teal-400/30 bg-teal-400/10',
  'Relator': 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  'Integrante': 'text-zinc-400 border-zinc-400/30 bg-zinc-400/10',
  'Participante': 'text-zinc-500 border-zinc-500/30 bg-zinc-500/10',
};

export const roleHierarchy: Record<string, number> = {
  'Director': 0, 'Subdirector': 1, 'Coordinación': 2,
  'Difusión': 2, 'Evidencias': 2, 'Soporte Técnico': 2,
  'Relator': 3, 'Integrante': 4, 'Participante': 5,
};

export const memberAvatarColors: Record<string, string> = {
  cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
  indigo: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40',
  blue: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  purple: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
  emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
  teal: 'bg-teal-500/20 text-teal-400 border-teal-500/40',
};
