import type { AdminStats, AttendanceData, ProgressData } from '@/lib/types';

export const adminStats: AdminStats = {
  inscribed: 45,
  attendanceRate: 87,
  progressAverage: 62,
  evidencesSubmitted: 38,
  certificatesIssued: 0,
  activeModules: 2,
};

export const attendanceData: AttendanceData[] = [
  { module: 'Módulo 1', presencial: 38, online: 4 },
  { module: 'Módulo 2', presencial: 32, online: 6 },
  { module: 'Módulo 3', presencial: 0, online: 0 },
];

export const progressData: ProgressData[] = [
  { week: 'Sem 1', progreso: 100, objetivo: 100 },
  { week: 'Sem 2', progreso: 87, objetivo: 100 },
  { week: 'Sem 3', progreso: 0, objetivo: 100 },
];

export const authorityMetrics = {
  institution: 'Facultad de Derecho',
  university: 'Pontificia Universidad Católica de Valparaíso',
  program: 'Programa DIAT — Derecho, Inteligencia Artificial y Tecnología',
  year: '2026',
  continuity: '2027',
  totalParticipants: 45,
  hoursOfTraining: 27,
  modulesCount: 3,
  toolsIntegrated: 7,
  region: 'Región de Valparaíso',
  nationalImpact: 'Primer programa de formación en IA jurídica de la PUCV',
  methodology: 'Aprendizaje basado en proyectos reales + IA como co-autor académico',
  innovation: [
    'Primer taller universitario de prompting jurídico en Chile',
    'Metodología DIAT: Derecho + IA como flujo de trabajo integrado',
    'Certificación institucional con portfolio de proyectos reales',
    'Red nacional de abogados con competencias en IA',
  ],
  impactAreas: [
    { area: 'Derecho Civil', progress: 85 },
    { area: 'Derecho Laboral', progress: 72 },
    { area: 'Derecho Penal', progress: 68 },
    { area: 'Derecho Corporativo', progress: 91 },
    { area: 'Derecho Público', progress: 64 },
  ],
  scalability: [
    { label: 'Participantes 2026', value: '45', unit: 'personas' },
    { label: 'Proyección 2027', value: '120', unit: 'personas' },
    { label: 'Horas de formación', value: '27', unit: 'horas' },
    { label: 'Herramientas IA', value: '7', unit: 'plataformas' },
    { label: 'Módulos especializados', value: '3', unit: 'módulos' },
    { label: 'Cobertura regional', value: '1', unit: 'región' },
  ],
};
