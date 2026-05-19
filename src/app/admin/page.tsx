'use client';
import { motion } from 'framer-motion';
import {
  Users, TrendingUp, Target, BookOpen,
  Award, Layers, CheckCircle2, Circle,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend, RadarChart, PolarGrid,
  PolarAngleAxis, Radar,
} from 'recharts';
import { adminStats, attendanceData, progressData } from '@/data/stats';
import { modules } from '@/data/modules';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';

const widgets = [
  { label: 'Inscritos', value: adminStats.inscribed, suffix: '', icon: Users, color: 'cyan', desc: 'participantes activos' },
  { label: 'Asistencia', value: adminStats.attendanceRate, suffix: '%', icon: TrendingUp, color: 'emerald', desc: 'promedio general' },
  { label: 'Progreso', value: adminStats.progressAverage, suffix: '%', icon: Target, color: 'indigo', desc: 'avance del programa' },
  { label: 'Evidencias', value: adminStats.evidencesSubmitted, suffix: '', icon: BookOpen, color: 'purple', desc: 'enviadas al sistema' },
  { label: 'Certificados', value: adminStats.certificatesIssued, suffix: '', icon: Award, color: 'yellow', desc: 'listos para emisión' },
  { label: 'Módulos activos', value: adminStats.activeModules, suffix: '', icon: Layers, color: 'blue', desc: 'en ejecución' },
];

const colorMap: Record<string, string> = {
  cyan: 'text-cyan-400 border-cyan-400/20 bg-cyan-400/8',
  emerald: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/8',
  indigo: 'text-indigo-400 border-indigo-400/20 bg-indigo-400/8',
  purple: 'text-purple-400 border-purple-400/20 bg-purple-400/8',
  yellow: 'text-yellow-400 border-yellow-400/20 bg-yellow-400/8',
  blue: 'text-blue-400 border-blue-400/20 bg-blue-400/8',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-[oklch(0.10_0.018_250/0.95)] backdrop-blur-sm px-3 py-2 text-xs">
      <div className="text-zinc-400 mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

export default function AdminPage() {
  return (
    <div className="px-4 lg:px-8 py-6 lg:py-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Panel Administrativo</h2>
          <p className="text-sm text-zinc-500 mt-1">Dashboard ejecutivo · Programa DIAT · Sep 2026</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-medium">Datos en tiempo real</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {widgets.map(({ label, value, suffix, icon: Icon, color, desc }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
            className={`rounded-xl border p-4 ${colorMap[color]}`}
          >
            <div className="flex items-center justify-between mb-2">
              <Icon className={`w-4 h-4 ${colorMap[color].split(' ')[0]}`} />
            </div>
            <div className={`text-2xl font-bold mono ${colorMap[color].split(' ')[0]}`}>
              <AnimatedCounter value={value} suffix={suffix} />
            </div>
            <div className="text-xs font-medium text-white/80 mt-0.5">{label}</div>
            <div className="text-[10px] text-zinc-600 mt-0.5 leading-tight">{desc}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Asistencia */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45 }}
          className="rounded-xl border border-white/[0.08] bg-[oklch(0.09_0.017_250/0.6)] backdrop-blur-sm p-5"
        >
          <div className="mb-4">
            <div className="text-sm font-semibold text-white">Asistencia por Módulo</div>
            <div className="text-xs text-zinc-500">Presencial vs Online</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={attendanceData} barGap={4}>
              <CartesianGrid stroke="oklch(0.22 0.02 250 / 0.3)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="module" tick={{ fill: 'oklch(0.58 0.01 240)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'oklch(0.58 0.01 240)', fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="presencial" name="Presencial" fill="oklch(0.71 0.17 200 / 0.8)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="online" name="Online" fill="oklch(0.55 0.22 264 / 0.6)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Progreso */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.45 }}
          className="rounded-xl border border-white/[0.08] bg-[oklch(0.09_0.017_250/0.6)] backdrop-blur-sm p-5"
        >
          <div className="mb-4">
            <div className="text-sm font-semibold text-white">Progreso vs Objetivo</div>
            <div className="text-xs text-zinc-500">Por semana del programa</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={progressData}>
              <CartesianGrid stroke="oklch(0.22 0.02 250 / 0.3)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: 'oklch(0.58 0.01 240)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'oklch(0.58 0.01 240)', fontSize: 11 }} axisLine={false} tickLine={false} width={32} domain={[0, 110]} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="objetivo" name="Objetivo" stroke="oklch(0.58 0.01 240)" strokeDasharray="4 2" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="progreso" name="Progreso" stroke="oklch(0.71 0.17 200)" strokeWidth={2.5} dot={{ fill: 'oklch(0.71 0.17 200)', r: 4, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Modules status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.45 }}
        className="rounded-xl border border-white/[0.08] bg-[oklch(0.09_0.017_250/0.6)] backdrop-blur-sm p-5"
      >
        <div className="text-sm font-semibold text-white mb-4">Estado de Módulos</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className={`rounded-lg border p-4 ${
                mod.status === 'active' ? 'border-cyan-500/25 bg-cyan-500/5' :
                mod.status === 'completed' ? 'border-emerald-500/20 bg-emerald-500/5' :
                'border-white/[0.06] bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-zinc-500 mono font-medium">MÓDULO {mod.id}</span>
                {mod.status === 'completed' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : mod.status === 'active' ? (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                ) : (
                  <Circle className="w-4 h-4 text-zinc-600" />
                )}
              </div>
              <div className={`text-sm font-semibold leading-tight mb-2 ${
                mod.status === 'active' ? 'text-cyan-200' :
                mod.status === 'completed' ? 'text-zinc-200' : 'text-zinc-500'
              }`}>
                {mod.title}
              </div>
              <div className="text-xs text-zinc-600">{mod.date}</div>
              {mod.participants > 0 && (
                <div className="flex items-center gap-1.5 mt-2">
                  <Users className="w-3 h-3 text-zinc-600" />
                  <span className="text-xs text-zinc-500">{mod.participants} participantes</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
