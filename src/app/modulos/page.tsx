'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, Zap, CheckCircle2, Circle, Clock,
  Users, Wrench, Target, BookOpen, FileText, Lock,
} from 'lucide-react';
import { modules } from '@/data/modules';
import { StatusBadge } from '@/components/common/StatusBadge';

const missionColors = [
  { border: 'border-emerald-500/30', glow: 'shadow-emerald-500/10', num: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10', accent: 'bg-emerald-500' },
  { border: 'border-cyan-500/30', glow: 'shadow-cyan-500/15', num: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10', accent: 'bg-cyan-500' },
  { border: 'border-zinc-700/60', glow: '', num: 'text-zinc-500 border-zinc-700/50 bg-zinc-800/30', accent: 'bg-zinc-600' },
];

const missionCodes = ['ALFA-01', 'BRAVO-02', 'CHARLIE-03'];
const missionLabels = ['COMPLETADA', 'ACTIVA', 'PENDIENTE'];

function ModuleCard({ mod, index }: { mod: (typeof modules)[0]; index: number }) {
  const [open, setOpen] = useState(mod.status === 'active');
  const c = missionColors[index];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className={`rounded-2xl border ${c.border} overflow-hidden shadow-lg ${c.glow}`}
    >
      {/* Mission header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full text-left"
      >
        <div className="px-5 sm:px-7 py-5 flex items-start gap-5 hover:bg-white/[0.02] transition-colors">
          {/* Mission badge */}
          <div className="shrink-0 flex flex-col items-center gap-1.5">
            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-black text-xl mono ${c.num}`}>
              {mod.id}
            </div>
            <span className={`text-[9px] mono font-bold tracking-widest ${c.num.split(' ')[0]}`}>
              {missionCodes[index]}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <StatusBadge status={mod.status} />
              <span className="text-[10px] mono text-zinc-600 px-2 py-0.5 rounded border border-zinc-700/50 bg-zinc-800/30">
                {missionLabels[index]}
              </span>
            </div>
            <h3 className={`text-lg sm:text-xl font-bold leading-tight ${
              mod.status === 'active' ? 'text-cyan-100' :
              mod.status === 'completed' ? 'text-white' : 'text-zinc-500'
            }`}>
              {mod.title}
            </h3>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{mod.subtitle}</p>

            {/* Mini stats */}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="flex items-center gap-1 text-xs text-zinc-500">
                <Clock className="w-3 h-3" /> {mod.date}
              </span>
              <span className="flex items-center gap-1 text-xs text-zinc-500">
                <Zap className="w-3 h-3" /> {mod.duration}
              </span>
              {mod.participants > 0 && (
                <span className="flex items-center gap-1 text-xs text-zinc-500">
                  <Users className="w-3 h-3" /> {mod.participants} participantes
                </span>
              )}
            </div>

            {/* Tools strip */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {mod.tools.map(t => (
                <span key={t} className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${
                  mod.status === 'pending' ? 'border-zinc-700/40 text-zinc-600 bg-zinc-800/20' :
                  'border-cyan-500/25 text-cyan-400 bg-cyan-500/8'
                }`}>
                  {mod.status === 'pending' ? <Lock className="w-2.5 h-2.5 inline mr-1" /> : null}{t}
                </span>
              ))}
            </div>
          </div>

          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 mt-1">
            <ChevronDown className="w-5 h-5 text-zinc-500" />
          </motion.div>
        </div>

        {/* Progress bar */}
        <div className="mx-5 sm:mx-7 mb-1 h-0.5 rounded-full bg-white/[0.05] overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${c.accent}`}
            initial={{ width: 0 }}
            animate={{ width: mod.status === 'completed' ? '100%' : mod.status === 'active' ? '55%' : '0%' }}
            transition={{ delay: index * 0.15 + 0.3, duration: 1.2, ease: 'easeOut' }}
          />
        </div>
        <div className="px-5 sm:px-7 pb-4 flex justify-between text-[10px] text-zinc-600 mono">
          <span>PROGRESO</span>
          <span>{mod.status === 'completed' ? '100%' : mod.status === 'active' ? '55%' : '0%'}</span>
        </div>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden border-t border-white/[0.05]"
          >
            <div className="px-5 sm:px-7 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Objetivos */}
              <div>
                <SLabel icon={<Target className="w-3.5 h-3.5" />} text="Objetivos" />
                <ul className="space-y-2">
                  {mod.objectives.map((o, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-zinc-400 leading-relaxed">
                      {mod.status === 'completed'
                        ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                        : <Circle className="w-3.5 h-3.5 text-zinc-700 mt-0.5 shrink-0" />}
                      {o}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contenidos */}
              <div>
                <SLabel icon={<BookOpen className="w-3.5 h-3.5" />} text="Contenidos" />
                <ul className="space-y-1.5">
                  {mod.contents.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-zinc-400 leading-relaxed">
                      <span className={`w-1 h-1 rounded-full mt-1.5 shrink-0 ${mod.status === 'pending' ? 'bg-zinc-600' : 'bg-indigo-500'}`} />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right */}
              <div className="space-y-4">
                <div>
                  <SLabel icon={<Wrench className="w-3.5 h-3.5" />} text="Herramientas" />
                  <div className="flex flex-wrap gap-1.5">
                    {mod.tools.map(t => (
                      <span key={t} className="px-2.5 py-1 rounded-lg border border-cyan-500/20 bg-cyan-500/8 text-xs text-cyan-400 font-medium">{t}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <SLabel icon={<Zap className="w-3.5 h-3.5" />} text="Actividad central" />
                  <p className="text-xs text-zinc-400 leading-relaxed">{mod.activity}</p>
                </div>
                <div>
                  <SLabel icon={<FileText className="w-3.5 h-3.5" />} text="Entregable" />
                  <p className="text-xs text-zinc-400 leading-relaxed">{mod.deliverable}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SLabel({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2.5">
      <span className="text-cyan-500">{icon}</span> {text}
    </div>
  );
}

export default function ModulosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="mono text-[10px] text-zinc-600 tracking-widest uppercase">Programa DIAT · PUCV · Sep 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">LAS 3 MISIONES</h1>
        <p className="text-sm text-zinc-500 mt-1">
          27 horas de formación divididas en tres módulos progresivos. Cada uno desbloquea nuevas capacidades.
        </p>
      </motion.div>

      {/* Timeline connector visual */}
      <div className="relative">
        <div className="absolute left-[2.35rem] top-12 bottom-12 w-px bg-gradient-to-b from-emerald-500/40 via-cyan-500/30 to-zinc-700/20 hidden sm:block" />
        <div className="space-y-5">
          {modules.map((mod, i) => (
            <ModuleCard key={mod.id} mod={mod} index={i} />
          ))}
        </div>
      </div>

      {/* Footer note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center py-4 border-t border-white/[0.05]"
      >
        <p className="text-xs text-zinc-600">
          Los módulos son presenciales en la Facultad de Derecho PUCV, Valparaíso.{' '}
          <span className="text-zinc-500">Certificación institucional al completar los 3 módulos.</span>
        </p>
      </motion.div>
    </div>
  );
}
