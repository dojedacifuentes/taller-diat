'use client';
import { motion } from 'framer-motion';
import { Users, Target, CheckCircle2, Circle, ClipboardList } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { indicatorRecords, attendanceData, evaluationBreakdown } from '@/data/stats';
import { identity, schedule, sessions, methodology } from '@/data/program';

const chartTheme = {
  grid: 'rgba(255,255,255,.05)',
  axis: '#475569',
};

function isPast(isoDate: string) {
  return new Date(`${isoDate}T23:59:59-04:00`).getTime() < Date.now();
}

export default function AdminPage() {
  const evaluationChart = evaluationBreakdown.map(e => ({
    name: e.name.length > 26 ? `${e.name.slice(0, 24)}…` : e.name,
    value: e.value,
  }));

  return (
    <div className="px-4 lg:px-8 py-6 lg:py-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Seguimiento interno</h2>
        <p className="text-sm text-zinc-500 mt-1">
          {identity.name} · {schedule.datesShort} · {schedule.time}
        </p>
      </div>

      {/* Aviso de estado */}
      <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/[0.05] p-4 flex items-start gap-3">
        <ClipboardList className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-400 leading-relaxed">
          El taller aún no se ejecuta. Los indicadores están definidos pero{' '}
          <span className="text-zinc-200 font-medium">sin datos registrados</span>. Los valores se
          completan al cierre de cada sesión; no deben estimarse.
        </p>
      </div>

      {/* Indicadores oficiales */}
      <div className="space-y-3">
        <div className="text-[10px] mono font-bold text-zinc-600 uppercase tracking-widest">
          Indicadores de resultado
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {indicatorRecords.map(({ id, label, value, unit }, i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-2"
            >
              <div className="flex items-center gap-2 text-[10px] mono text-zinc-700">
                <Target className="w-3 h-3 text-cyan-600" />
                {id.toUpperCase()}
              </div>
              <div className="text-xs text-zinc-300 leading-snug">{label}</div>
              <div className="text-lg font-bold mono text-zinc-700">
                {value === null ? '—' : `${value}${unit}`}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Asistencia por sesión */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-4">
          <div className="text-[10px] mono font-bold text-zinc-600 uppercase tracking-widest">
            Asistencia por sesión
          </div>
          <div className="space-y-2">
            {attendanceData.map((a, i) => {
              const past = isPast(sessions[i].date);
              return (
                <div
                  key={a.session}
                  className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
                >
                  {past ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-zinc-700 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-zinc-300">{a.session}</div>
                    <div className="text-[11px] text-zinc-600">{a.date}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold mono text-zinc-700">
                      {a.attended === null ? '—' : a.attended}
                    </div>
                    <div className="text-[10px] text-zinc-700">asistentes</div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-zinc-600 leading-relaxed">
            {schedule.sessionCount} sesiones de {schedule.sessionDuration} ·{' '}
            {schedule.totalDuration} en total · {methodology.ratio.label}
          </p>
        </div>

        {/* Ponderación de evaluación */}
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-4">
          <div className="text-[10px] mono font-bold text-zinc-600 uppercase tracking-widest">
            Ponderación de la evaluación
          </div>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer initialDimension={{ width: 640, height: 240 }}>
              <BarChart data={evaluationChart} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid stroke={chartTheme.grid} horizontal={false} />
                <XAxis type="number" domain={[0, 30]} stroke={chartTheme.axis} fontSize={10} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke={chartTheme.axis}
                  fontSize={9}
                  width={130}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,.03)' }}
                  contentStyle={{
                    background: 'oklch(0.10 0.018 250)',
                    border: '1px solid rgba(255,255,255,.1)',
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                />
                <Bar dataKey="value" fill="#06b6d4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Productos por sesión */}
      <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-3">
        <div className="text-[10px] mono font-bold text-zinc-600 uppercase tracking-widest">
          Productos comprometidos
        </div>
        {sessions.map(s => (
          <div key={s.id} className="flex items-start gap-3 py-2 border-b border-white/[0.04] last:border-0">
            <Users className="w-4 h-4 text-zinc-700 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-zinc-300">
                {s.label} · {s.displayDate}
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">{s.product}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
