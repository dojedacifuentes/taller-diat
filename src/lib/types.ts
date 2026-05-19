export type ModuleStatus = 'pending' | 'active' | 'completed';
export type TimeBlockType = 'theory' | 'demo' | 'practice' | 'workshop' | 'analysis' | 'closing';

export interface ModuleTimeBlock {
  time: string;
  topic: string;
  type: TimeBlockType;
  description: string;
}

export interface Module {
  id: number;
  title: string;
  subtitle: string;
  date: string;
  displayDate: string;
  endDate: string;
  status: ModuleStatus;
  duration: string;
  objectives: string[];
  contents: string[];
  tools: string[];
  activity: string;
  deliverable: string;
  participants: number;
  timeline: ModuleTimeBlock[];
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  legalUseCase: string;
  level: 'Básico' | 'Intermedio' | 'Avanzado';
  moduleId: number;
  category: string;
  url: string;
  color: string;
}

export type TeamRole =
  | 'Director'
  | 'Subdirector'
  | 'Coordinación'
  | 'Difusión'
  | 'Evidencias'
  | 'Soporte Técnico'
  | 'Relator'
  | 'Participante';

export interface TeamMember {
  id: string;
  name: string;
  role: TeamRole;
  status: 'active' | 'standby' | 'pending';
  moduleId?: number;
  email?: string;
  initials: string;
  color: string;
}

export interface AdminStats {
  inscribed: number;
  attendanceRate: number;
  progressAverage: number;
  evidencesSubmitted: number;
  certificatesIssued: number;
  activeModules: number;
}

export interface AttendanceData {
  module: string;
  presencial: number;
  online: number;
}

export interface ProgressData {
  week: string;
  progreso: number;
  objetivo: number;
}
