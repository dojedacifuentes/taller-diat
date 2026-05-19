'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, Zap, Circle, Clock,
  Wrench, Target, BookOpen, FileText, Lock,
} from 'lucide-react';
import { modules } from '@/data/modules';
import type { Module } from '@/lib/types';

const moduleColors = [
  {
    border: 'border-cyan-500/25',
    numBg: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400',
    accent: 'bg-cyan-500',
    accentText: 'text-cyan-400',
    timelineNode: 'border-cyan-500/50 bg-cyan-500/15',
    timelineDot: 'bg-cyan-500',
  },
  {
    border: 'border-indigo-500/25',
    numBg: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400',
    accent: 'bg-indigo-500',
    accentText: 'text-indigo-400',
    timelineNode: 'border-indigo-500/50 bg-indigo-500/15',
    timelineDot: 'bg-indigo-500',
  },
  {
    border: 'border-purple-500/25',
    numBg: 'border-purple-500/40 bg-purple-500/10 text-purple-400',
    accent: 'bg-purple-500',
    accentText: 'text-purple-400',
    timelineNode: 'border-purple-500/50 bg-purple-500/15',
    timelineDot: 'bg-purple-500',
  },
];

const timelineTypeColors: Record<string, string> = {
  theory: 'text-blue-400 border-blue-500/30 bg-blue-500/8',
  demo: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/8',
  practice: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/8',
  workshop: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/8',
  analysis: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/8',
  closing: 'text-zinc-400 border-zinc-500/30 bg-zinc-500/8',
};

const timelineTypeLabels: Record<string, string> = {
  theory: 'Teoría',
  demo: 'Demo',
  practice: 'Práctica',
  workshop: 'Taller',
  analysis: 'Análisis',
  closing: 'Cierre',
};

function TimelineBlock({ block, dotColor, isLast }: {
  block: Module['timeline'][0];
  dotColor: string;
  isLast: boolean;
}) {
  const typeColor = timelineTypeColors[block.type] ?? 'text-zinc-400 border-zinc-500/30 bg-zinc-500/8';
  const typeLabel = timelineTypeLabels[block.type] ?? block.type;
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center shrink-0">
        <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${dotColor}`} />
        {!isLast && <div className="w-px flex-1 bg-white/[0.06] mt-1 mb-0" />}
      </div>
      <div className={`pb-4 ${isLast ? '' : ''}`}>
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-[10px] mono text-zinc-600">{block.time}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${typeColor}`}>
            {typeLabel}
          </span>
        </div>
        <div className="text-xs font-semibold text-zinc-300">{block.topic}</div>
        <div className="text-[11px] text-zinc-600 mt-0.5 leading-relaxed">{block.description}</div>
      </div>
    </div>
  );
}

function ModuleCard({ mod, index }: { mod: Module; index: number }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'overview' | 'timeline'>('overview');
  const c = moduleColors[index];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className={`rounded-2xl border ${c.border} overflow-hidden`}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="px-5 sm:px-7 py-5 flex items-start gap-5">
          {/* Module number */}
          <div className="shrink-0 flex flex-col items-center gap-1.5 mt-0.5">
            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-black text-xl mono ${c.numBg}`}>
              {mod.id}
            </div>
            <span className={`text-[9px] mono font-bold tracking-widest ${c.accentText}`}>
              {mod.displayDate}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] mono font-bold text-yellow-500 border border-yellow-500/20 bg-yellow-500/8 px-2 py-0.5 rounded-md">
                PRÓXIMAMENTE
              </span>
              <span className="text-[10px] text-zinc-600 mono px-2 py-0.5 rounded border border-zinc-700/40 bg-zinc-800/20">
                {mod.duration}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold leading-tight text-zinc-300">
              {mod.title}
            </h3>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{mod.subtitle}</p>

            {/* Tools */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {mod.tools.map(t => (
                <span key={t} className="text-[11px] px-2 py-0.5 rounded-md border border-zinc-700/40 text-zinc-600 bg-zinc-800/20 font-medium">
                  <Lock className="w-2.5 h-2.5 inline mr-1 opacity-50" />{t}
                </span>
              ))}
            </div>
          </div>

          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 mt-1">
            <ChevronDown className="w-5 h-5 text-zinc-500" />
          </motion.div>
        </div>

        {/* Progress bar */}
        <div className="mx-5 sm:mx-7 mb-1 h-0.5 rounded-full bg-white/[0.05]">
          <div className="h-full w-0 rounded-full bg-zinc-700" />
        </div>
        <div className="px-5 sm:px-7 pb-4 flex justify-between text-[10px] text-zinc-700 mono">
          <span>PROGRESO</span>
          <span>0%</span>
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
            {/* Tab switcher */}
            <div className="flex gap-0 border-b border-white/[0.05]">
              {(['overview', 'timeline'] as const).map(t => (
                <button
                  key={t}
                  onClick={(e) => { e.stopPropagation(); setTab(t); }}
                  className={`px-5 py-3 text-xs font-semibold transition-colors capitalize ${
                    tab === t
                      ? `${c.accentText} border-b-2 border-current`
                      : 'text-zinc-600 hover:text-zinc-400 border-b-2 border-transparent'
                  }`}
                >
                  {t === 'overview' ? 'Contenido' : 'Timeline 2h'}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {tab === 'overview' ? (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-5 sm:px-7 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {/* Objetivos */}
                  <div>
                    <SLabel icon={<Target className="w-3.5 h-3.5" />} text="Objetivos" />
                    <ul className="space-y-2">
                      {mod.objectives.map((o, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-zinc-400 leading-relaxed">
                          <Circle className="w-3.5 h-3.5 text-zinc-700 mt-0.5 shrink-0" />
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Contenidos */}
                  <div>
                    <SLabel icon={<BookOpen className="w-3.5 h-3.5" />} text="Contenidos" />
                    <ul className="space-y-1.5">
                      {mod.contents.map((ct, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-zinc-400 leading-relaxed">
                          <span className="w-1 h-1 rounded-full mt-1.5 shrink-0 bg-zinc-600" />
                          {ct}
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
                          <span key={t} className="px-2.5 py-1 rounded-lg border border-zinc-700/40 bg-zinc-800/20 text-xs text-zinc-500 font-medium">{t}</span>
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
                </motion.div>
              ) : (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-5 sm:px-7 py-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className={`w-4 h-4 ${c.accentText}`} />
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Sesión de 2 horas — {mod.displayDate}
                    </span>
                  </div>
                  <div className="max-w-xl">
                    {mod.timeline.map((block, i) => (
                      <TimelineBlock
                        key={i}
                        block={block}
                        dotColor={c.timelineDot}
                        isLast={i === mod.timeline.length - 1}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
          <span className="mono text-[10px] text-zinc-600 tracking-widest uppercase">Programa DIAT · Facultad de Derecho PUCV · Fechas tentativas · Sep 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">LOS 3 MÓDULOS</h1>
        <p className="text-sm text-zinc-500 mt-1">
          6 horas de formación divididas en tres módulos progresivos. Cada uno produce entregables reales.
          Expande para ver contenido o el timeline de la sesión de 2 horas.{' '}
          <span className="text-zinc-600 italic">Fechas tentativas · Septiembre 2026.</span>
        </p>
      </motion.div>

      {/* Date pills */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        {modules.map((mod, i) => {
          const colors = [moduleColors[0].accentText, moduleColors[1].accentText, moduleColors[2].accentText];
          return (
            <span
              key={mod.id}
              className={`text-xs mono font-bold px-3 py-1.5 rounded-full border ${
                i === 0 ? 'border-cyan-500/25 bg-cyan-500/8' :
                i === 1 ? 'border-indigo-500/25 bg-indigo-500/8' :
                'border-purple-500/25 bg-purple-500/8'
              } ${colors[i]}`}
            >
              M{mod.id} — {mod.displayDate}
            </span>
          );
        })}
      </motion.div>

      {/* Modules */}
      <div className="space-y-5">
        {modules.map((mod, i) => (
          <ModuleCard key={mod.id} mod={mod} index={i} />
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center py-4 border-t border-white/[0.05]"
      >
        <p className="text-xs text-zinc-600">
          Los módulos son presenciales en la Facultad de Derecho PUCV, Valparaíso.{' '}
          <span className="text-zinc-500">Certificación institucional al completar los 3 módulos.</span>
          {' '}<span className="text-zinc-700 italic">Fechas tentativas · Septiembre 2026.</span>
        </p>
      </motion.div>
    </div>
  );
}
