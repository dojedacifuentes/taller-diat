'use client';
import { motion } from 'framer-motion';
import {
  Globe, Zap, TrendingUp, Users, BookOpen,
  ShieldCheck, ArrowRight, BarChart3,
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from 'recharts';
import { authorityMetrics } from '@/data/stats';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-[oklch(0.10_0.018_250/0.95)] backdrop-blur-sm px-3 py-2 text-xs">
      <div className="text-zinc-400 mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ color: p.color }} className="font-medium">{p.value}%</div>
      ))}
    </div>
  );
};

export default function AutoridadPage() {
  return (
    <div className="px-4 lg:px-8 py-6 lg:py-8 max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden border border-cyan-500/20 bg-gradient-to-br from-cyan-500/8 to-indigo-500/5"
      >
        <div className="absolute inset-0 grid-bg-fine opacity-30" />
        <div className="relative px-6 sm:px-8 py-8">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span className="text-xs text-cyan-400 uppercase tracking-widest font-medium mono">Informe para autoridades institucionales</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{authorityMetrics.program}</h2>
          <p className="text-sm text-zinc-400">{authorityMetrics.university} · {authorityMetrics.year}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full border border-cyan-500/25 bg-cyan-500/10 text-xs text-cyan-400">
              {authorityMetrics.nationalImpact}
            </span>
            <span className="px-3 py-1 rounded-full border border-indigo-500/25 bg-indigo-500/10 text-xs text-indigo-400">
              Continuidad proyectada {authorityMetrics.continuity}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Scalability metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {authorityMetrics.scalability.map(({ label, value, unit }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-xl border border-white/[0.08] bg-[oklch(0.09_0.017_250/0.6)] p-4 text-center"
          >
            <div className="text-2xl font-bold text-cyan-300 mono">
              <AnimatedCounter value={parseInt(value)} />
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">{unit}</div>
            <div className="text-xs text-zinc-400 mt-1 font-medium leading-tight">{label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Impact by area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-white/[0.08] bg-[oklch(0.09_0.017_250/0.6)] backdrop-blur-sm p-5"
        >
          <div className="mb-4">
            <div className="text-sm font-semibold text-white">Cobertura por Área Jurídica</div>
            <div className="text-xs text-zinc-500">Nivel de impacto metodológico estimado</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={authorityMetrics.impactAreas}>
              <PolarGrid stroke="oklch(0.22 0.02 250 / 0.5)" />
              <PolarAngleAxis dataKey="area" tick={{ fill: 'oklch(0.58 0.01 240)', fontSize: 10 }} />
              <Radar dataKey="progress" stroke="oklch(0.71 0.17 200)" fill="oklch(0.71 0.17 200 / 0.2)" strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Proyección */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-white/[0.08] bg-[oklch(0.09_0.017_250/0.6)] backdrop-blur-sm p-5"
        >
          <div className="mb-4">
            <div className="text-sm font-semibold text-white">Proyección de Participantes</div>
            <div className="text-xs text-zinc-500">2026 vs proyección 2027</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[
              { year: '2026', participantes: 45 },
              { year: '2027 (proy.)', participantes: 120 },
            ]}>
              <CartesianGrid stroke="oklch(0.22 0.02 250 / 0.3)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: 'oklch(0.58 0.01 240)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'oklch(0.58 0.01 240)', fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="participantes" name="Participantes" fill="oklch(0.71 0.17 200 / 0.8)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Innovation + Methodology */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl border border-white/[0.08] bg-[oklch(0.09_0.017_250/0.6)] p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-white">Innovación Metodológica</span>
          </div>
          <div className="space-y-3">
            {authorityMetrics.innovation.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <ArrowRight className="w-3.5 h-3.5 text-cyan-500 mt-0.5 shrink-0" />
                <span className="text-sm text-zinc-400 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-xl border border-white/[0.08] bg-[oklch(0.09_0.017_250/0.6)] p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-semibold text-white">Escalabilidad e Impacto</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg border border-indigo-500/15 bg-indigo-500/5">
              <Globe className="w-8 h-8 text-indigo-400 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-indigo-300">Cobertura Regional</div>
                <div className="text-xs text-zinc-400">{authorityMetrics.region} · Red jurídica regional en formación</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-purple-500/15 bg-purple-500/5">
              <BookOpen className="w-8 h-8 text-purple-400 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-purple-300">Metodología DIAT</div>
                <div className="text-xs text-zinc-400">{authorityMetrics.methodology}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-emerald-500/15 bg-emerald-500/5">
              <BarChart3 className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-emerald-300">Infraestructura Digital</div>
                <div className="text-xs text-zinc-400">
                  {authorityMetrics.toolsIntegrated} plataformas integradas · {authorityMetrics.hoursOfTraining} horas de formación certificada
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
