import type { AttendanceData, IndicatorRecord } from '@/lib/types';
import { sessions, indicators, evaluation, schedule, methodology, background } from '@/data/program';

// ─────────────────────────────────────────────────────────────────────────────
// Seguimiento de indicadores
//
// El taller 2026 aún no se ejecuta, por lo que NO existen cifras reales de
// inscripción, asistencia ni finalización. Este archivo define los indicadores
// oficiales y deja sus valores en null hasta que la coordinación los registre.
// No completar con estimaciones.
// ─────────────────────────────────────────────────────────────────────────────

/** Indicadores oficiales de la propuesta, sin datos hasta la ejecución. */
export const indicatorRecords: IndicatorRecord[] = indicators.map((label, i) => ({
  id: `ind-${String(i + 1).padStart(2, '0')}`,
  label,
  value: null,
  unit: label.startsWith('Porcentaje') || label.startsWith('Tasa') ? '%' : '',
}));

/** Asistencia por sesión. Se completa al cierre de cada jornada. */
export const attendanceData: AttendanceData[] = sessions.map(s => ({
  session: s.label,
  date: s.displayDate,
  registered: null,
  attended: null,
}));

/** Distribución de la evaluación, reutilizada por los paneles internos. */
export const evaluationBreakdown = evaluation.map(({ weight, criterion }) => ({
  name: criterion,
  value: weight,
}));

/** Datos de contexto verificables, tomados de la propuesta académica. */
export const programFacts = {
  sessionCount: schedule.sessionCount,
  sessionDuration: schedule.sessionDuration,
  totalDuration: schedule.totalDuration,
  ratio: methodology.ratio.label,
  previousEditionParticipants: 90,
  previousEditionNote: background.previous.text,
} as const;
