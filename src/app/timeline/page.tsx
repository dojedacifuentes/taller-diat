'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, CalendarDays, Clock, Users, Target,
  BookOpen, Wrench, FileText, CheckSquare, Zap,
} from 'lucide-react';
import { modules } from '@/data/modules';
import { StatusBadge } from '@/components/common/StatusBadge';
import type { Module } from '@/lib/types';

function ModuleCard({ mod, index }: { mod: Module; index: number }) {
  const [open, setOpen] = useState(mod.status === 'active');

  const borderColor =
    mod.status === 'active' ? 'border-cyan-500/30' :
    mod.status === 'completed' ? 'border-emerald-500/20' :
    'border-white/[0.07]';

  const headerBg =
    mod.status === 'active' ? 'bg-cyan-500/5' :
    mod.status === 'completed' ? 'bg-emerald-500/4' :
    'bg-white/[0.02]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`rounded-xl border ${borderColor} overflow-hidden`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full text-left px-5 sm:px-6 py-5 ${headerBg} flex items-start gap-4 hover:bg-white/[0.03] transition-colors`}
      >
        {/* number */}
        <div className={`shrink-0 w-10 h-10 rounded-lg border flex items-center justify-center font-bold text-lg mono ${
          mod.status === 'active' ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300' :
          mod.status === 'completed' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
          'border-white/10 bg-white/[0.04] text-zinc-500'
        }`}>
          {mod.id}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <StatusBadge status={mod.status} />
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <CalendarDays className="w-3 h-3" /> {mod.date}
            </span>
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {mod.duration}
            </span>
          </div>
          <h3 className={`text-base sm:text-lg font-semibold leading-tight ${
            mod.status === 'active' ? 'text-cyan-100' :
            mod.status === 'completed' ? 'text-zinc-200' : 'text-zinc-400'
          }`}>
            {mod.title}
          </h3>
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{mod.subtitle}</p>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 mt-1"
        >
          <ChevronDown className="w-5 h-5 text-zinc-500" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-6 pt-4 border-t border-white/[0.05]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* Objetivos */}
                <div className="lg:col-span-1">
                  <SectionTitle icon={<Target className="w-3.5 h-3.5" />} label="Objetivos" />
                  <ul className="space-y-2">
                    {mod.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-zinc-400 leading-relaxed">
                        <span className="w-1 h-1 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contenidos */}
                <div className="lg:col-span-1">
                  <SectionTitle icon={<BookOpen className="w-3.5 h-3.5" />} label="Contenidos" />
                  <ul className="space-y-2">
                    {mod.contents.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-zinc-400 leading-relaxed">
                        <span className="w-1 h-1 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right column */}
                <div className="space-y-4">
                  {/* Herramientas */}
                  <div>
                    <SectionTitle icon={<Wrench className="w-3.5 h-3.5" />} label="Herramientas IA" />
                    <div className="flex flex-wrap gap-1.5">
                      {mod.tools.map((t) => (
                        <span key={t} className="px-2 py-1 rounded-md border border-cyan-500/20 bg-cyan-500/8 text-xs text-cyan-400 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actividad */}
                  <div>
                    <SectionTitle icon={<Zap className="w-3.5 h-3.5" />} label="Actividad" />
                    <p className="text-xs text-zinc-400 leading-relaxed">{mod.activity}</p>
                  </div>

                  {/* Entregable */}
                  <div>
                    <SectionTitle icon={<FileText className="w-3.5 h-3.5" />} label="Entregable" />
                    <p className="text-xs text-zinc-400 leading-relaxed">{mod.deliverable}</p>
                  </div>

                  {/* Participantes */}
                  {mod.participants > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/[0.07] bg-white/[0.02]">
                      <Users className="w-4 h-4 text-zinc-500" />
                      <span className="text-xs text-zinc-400">
                        <span className="font-semibold text-zinc-200 mono">{mod.participants}</span> participantes
                      </span>
                    </div>
                  )}

                  {/* Check actividad */}
                  {mod.status !== 'pending' && (
                    <div className="flex items-center gap-2">
                      <CheckSquare className={`w-4 h-4 ${mod.status === 'completed' ? 'text-emerald-400' : 'text-zinc-500'}`} />
                      <span className="text-xs text-zinc-500">
                        {mod.status === 'completed' ? 'Módulo completado' : 'En desarrollo'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SectionTitle({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
      <span className="text-cyan-500">{icon}</span>
      {label}
    </div>
  );
}

export default function TimelinePage() {
  return (
    <div className="px-4 lg:px-8 py-6 lg:py-8 max-w-5xl mx-auto space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white">Timeline del Programa</h2>
        <p className="text-sm text-zinc-500 mt-1">Septiembre 2026 · 3 módulos · 27 horas de formación</p>
      </div>

      {/* Timeline line + cards */}
      <div className="relative">
        <div className="absolute left-5 top-10 bottom-10 w-px bg-gradient-to-b from-cyan-500/30 via-indigo-500/20 to-transparent hidden sm:block" />
        <div className="space-y-4">
          {modules.map((mod, i) => (
            <ModuleCard key={mod.id} mod={mod} index={i} />
          ))}
        </div>
      </div>

      {/* Summary strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          { label: 'Módulos', value: '3', color: 'text-cyan-400' },
          { label: 'Horas totales', value: '27', color: 'text-indigo-400' },
          { label: 'Herramientas IA', value: '7', color: 'text-purple-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 text-center">
            <div className={`text-2xl font-bold mono ${color}`}>{value}</div>
            <div className="text-xs text-zinc-500 mt-1">{label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
