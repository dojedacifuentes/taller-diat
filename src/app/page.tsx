'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  CalendarDays, Cpu, BarChart3, Users, ShieldCheck,
  ArrowRight, CheckCircle2, Circle, Clock, Zap,
  BookOpen, Target, TrendingUp,
} from 'lucide-react';
import { useCountdown } from '@/hooks/useCountdown';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';
import { modules } from '@/data/modules';
import { adminStats } from '@/data/stats';

const NEXT_MODULE_DATE = '2026-09-18T09:00:00';

const quickLinks = [
  { href: '/timeline', icon: CalendarDays, label: 'Ver Timeline', desc: 'Módulos Sep. 2026' },
  { href: '/herramientas', icon: Cpu, label: 'Herramientas IA', desc: '7 plataformas' },
  { href: '/admin', icon: BarChart3, label: 'Panel Admin', desc: 'Métricas en vivo' },
  { href: '/equipo', icon: Users, label: 'Equipo', desc: '10 integrantes' },
  { href: '/autoridad', icon: ShieldCheck, label: 'Autoridades', desc: 'Impacto institucional' },
];

const kpis = [
  { label: 'Inscritos', value: adminStats.inscribed, suffix: '', icon: Users, color: 'cyan' },
  { label: 'Asistencia', value: adminStats.attendanceRate, suffix: '%', icon: TrendingUp, color: 'emerald' },
  { label: 'Progreso', value: adminStats.progressAverage, suffix: '%', icon: Target, color: 'indigo' },
  { label: 'Evidencias', value: adminStats.evidencesSubmitted, suffix: '', icon: BookOpen, color: 'purple' },
];

const colorMap: Record<string, { text: string; bg: string; border: string }> = {
  cyan: { text: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20' },
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  indigo: { text: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/20' },
  purple: { text: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
};

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-cyan-500/20 bg-cyan-500/5 flex items-center justify-center">
        <span className="text-2xl sm:text-3xl font-bold text-cyan-300 mono tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default function HomePage() {
  const countdown = useCountdown(NEXT_MODULE_DATE);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
  } as const;
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  } as const;

  return (
    <div className="px-4 lg:px-8 py-6 lg:py-8 space-y-6 max-w-6xl mx-auto">

      {/* HERO */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[oklch(0.09_0.017_250/0.7)] backdrop-blur-sm"
      >
        <div className="absolute inset-0 grid-bg-fine opacity-40" />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 80% at 50% -10%, oklch(0.71 0.17 200 / 0.08) 0%, transparent 70%)' }}
        />
        <div className="relative px-6 sm:px-8 lg:px-12 py-10 lg:py-14">
          <motion.div variants={item} className="flex items-center gap-2 mb-5">
            <div className="w-1 h-5 rounded-full bg-cyan-400" />
            <span className="text-xs text-zinc-400 uppercase tracking-widest mono">
              Pontificia Universidad Católica de Valparaíso · Facultad de Derecho
            </span>
          </motion.div>
          <motion.div variants={item}>
            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                DIAT
              </h1>
              <span
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, oklch(0.71 0.17 200) 0%, oklch(0.55 0.22 264) 100%)' }}
              >
                Prompting Hub
              </span>
            </div>
          </motion.div>
          <motion.p variants={item} className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
            Programa de{' '}
            <span className="text-zinc-200 font-medium">Derecho, Inteligencia Artificial y Tecnología</span>.
            Taller universitario de IA jurídica y prompting avanzado para estudiantes y profesionales del derecho.
          </motion.p>
          <motion.div variants={item} className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/8 text-xs text-cyan-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Módulo 2 — En curso
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs text-zinc-400">
              <CalendarDays className="w-3 h-3" />
              Septiembre 2026
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs text-zinc-400">
              <Zap className="w-3 h-3" />
              27 horas · 3 módulos
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* KPI ROW */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {kpis.map(({ label, value, suffix, icon: Icon, color }) => {
          const c = colorMap[color];
          return (
            <motion.div
              key={label}
              variants={item}
              className={`rounded-xl border ${c.border} ${c.bg} p-4 backdrop-blur-sm`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-zinc-500 font-medium">{label}</span>
                <Icon className={`w-4 h-4 ${c.text}`} />
              </div>
              <div className={`text-3xl font-bold ${c.text} mono`}>
                <AnimatedCounter value={value} suffix={suffix} />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* COUNTDOWN + MODULES */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="lg:col-span-2 rounded-xl border border-white/[0.08] bg-[oklch(0.09_0.017_250/0.6)] backdrop-blur-sm p-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Próximo módulo</span>
          </div>
          <div className="text-sm font-semibold text-white mb-5">Módulo 3 · 18 Sep 2026</div>
          {countdown.isExpired ? (
            <div className="text-cyan-400 font-semibold">¡En curso ahora!</div>
          ) : (
            <div className="flex items-end gap-2">
              <CountdownUnit value={countdown.days} label="días" />
              <span className="text-zinc-600 text-2xl font-bold pb-5">:</span>
              <CountdownUnit value={countdown.hours} label="hrs" />
              <span className="text-zinc-600 text-2xl font-bold pb-5">:</span>
              <CountdownUnit value={countdown.minutes} label="min" />
              <span className="text-zinc-600 text-2xl font-bold pb-5">:</span>
              <CountdownUnit value={countdown.seconds} label="seg" />
            </div>
          )}
          <div className="mt-5 pt-4 border-t border-white/[0.06]">
            <div className="text-xs text-zinc-500 mb-2">Progreso general del programa</div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                  initial={{ width: 0 }}
                  animate={{ width: '62%' }}
                  transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
                />
              </div>
              <span className="text-xs text-zinc-400 mono font-medium">62%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-3 rounded-xl border border-white/[0.08] bg-[oklch(0.09_0.017_250/0.6)] backdrop-blur-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-white">Módulos del Programa</span>
            <Link href="/timeline" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors">
              Ver timeline <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {modules.map((mod) => (
              <div
                key={mod.id}
                className={`flex items-start gap-4 p-3 rounded-lg border transition-colors ${
                  mod.status === 'active'
                    ? 'border-cyan-500/25 bg-cyan-500/5'
                    : mod.status === 'completed'
                    ? 'border-emerald-500/15 bg-emerald-500/3'
                    : 'border-white/[0.05] bg-white/[0.02]'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {mod.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : mod.status === 'active' ? (
                    <div className="w-5 h-5 rounded-full border-2 border-cyan-400 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    </div>
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-zinc-500 mono">M{mod.id}</span>
                    <span className={`text-sm font-medium ${
                      mod.status === 'active' ? 'text-cyan-300' :
                      mod.status === 'completed' ? 'text-zinc-200' : 'text-zinc-500'
                    }`}>
                      {mod.title}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-600 mt-0.5">{mod.date}</div>
                </div>
                {mod.status !== 'pending' && (
                  <div className="text-xs text-zinc-500 mono shrink-0">{mod.participants} p.</div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* QUICK LINKS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Acceso rápido</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickLinks.map(({ href, icon: Icon, label, desc }) => (
            <Link key={href} href={href}>
              <motion.div
                className="group rounded-xl border border-white/[0.06] bg-[oklch(0.09_0.017_250/0.5)] hover:border-cyan-500/25 hover:bg-cyan-500/5 transition-all duration-200 p-4 flex flex-col gap-3"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
              >
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] group-hover:border-cyan-500/30 group-hover:bg-cyan-500/8 flex items-center justify-center transition-all">
                  <Icon className="w-4 h-4 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
                </div>
                <div>
                  <div className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">{label}</div>
                  <div className="text-xs text-zinc-600">{desc}</div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
