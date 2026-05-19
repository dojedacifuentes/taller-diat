'use client';
import { motion } from 'framer-motion';
import { equipoEjecutor, memberAvatarColors } from '@/data/team';
import { InstitutionalLogoRow } from '@/components/common/InstitutionalLogos';
import { Shield, Layers, Code2, Users, GraduationCap } from 'lucide-react';

// ── Autoridades del programa ─────────────────────────────────────────────
const autoridades = [
  {
    name: 'Eduardo Aldunate Lizana',
    title: 'Director, Escuela de Derecho PUCV',
    subtitle: 'Autoridad institucional del Programa',
    initials: 'EAL',
    color: 'border-cyan-500/30 bg-cyan-500/8',
    avatarColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    accentText: 'text-cyan-400',
    icon: <Shield className="w-4 h-4" />,
  },
  {
    name: 'Dr. Adolfo Silva Walbaum',
    title: 'Director Programa DIAT',
    subtitle: 'Director del Taller · Responsable académico',
    initials: 'ASW',
    color: 'border-indigo-500/30 bg-indigo-500/8',
    avatarColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    accentText: 'text-indigo-400',
    icon: <Layers className="w-4 h-4" />,
  },
  {
    name: 'Diego Ojeda Cifuentes',
    title: 'Subdirector de los Talleres',
    subtitle: 'Coordinador Operativo · Desarrollo de Plataforma',
    initials: 'DO',
    color: 'border-blue-500/30 bg-blue-500/8',
    avatarColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    accentText: 'text-blue-400',
    icon: <Code2 className="w-4 h-4" />,
  },
];

// Avatar color helper
const avatarColor = (color: string) =>
  memberAvatarColors[color] ?? 'bg-zinc-700 text-zinc-300 border-zinc-600';

export default function EquipoPage() {
  return (
    <div className="px-4 lg:px-8 py-6 lg:py-8 max-w-5xl mx-auto space-y-10">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-3">
          <InstitutionalLogoRow size="sm" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-3">Equipo DIAT 2026</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Estructura institucional y equipo ejecutor del Programa DIAT · Facultad de Derecho PUCV
        </p>
      </motion.div>

      {/* ── Autoridades ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mono">
            Dirección Institucional
          </div>
          <div className="flex-1 h-px bg-white/[0.05]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {autoridades.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className={`rounded-2xl border p-5 space-y-3 ${a.color}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-bold text-sm shrink-0 mono ${a.avatarColor}`}>
                  {a.initials}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white leading-tight">{a.name}</div>
                  <div className={`text-[11px] ${a.accentText} font-semibold mt-0.5`}>{a.title}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={a.accentText}>{a.icon}</span>
                <span className={`text-[10px] leading-relaxed text-zinc-500`}>{a.subtitle}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Equipo Ejecutor ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mono">
            Equipo Ejecutor
          </div>
          <div className="flex-1 h-px bg-white/[0.05]" />
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/8">
            <Users className="w-3 h-3 text-indigo-400" />
            <span className="text-[10px] text-indigo-400 font-semibold">Integrantes Programa DIAT</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {equipoEjecutor.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.07, duration: 0.35 }}
              className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[oklch(0.09_0.017_250/0.5)] hover:border-white/15 hover:bg-white/[0.04] transition-all p-4"
            >
              <div className={`w-11 h-11 rounded-xl border flex items-center justify-center font-bold text-sm shrink-0 mono ${avatarColor(m.color)}`}>
                {m.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">{m.name}</div>
                <div className="flex flex-col gap-0.5 mt-0.5">
                  <span className="text-[11px] text-zinc-500 truncate">{m.calidad}</span>
                  {m.id === 'ee-01' && (
                    <span className="text-[10px] text-blue-400 font-medium truncate">
                      Subdirector de los Talleres
                    </span>
                  )}
                </div>
              </div>
              <div className="shrink-0">
                <GraduationCap className="w-3.5 h-3.5 text-zinc-700" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4"
        >
          <div className="text-xs text-zinc-500 leading-relaxed">
            Todos los integrantes del Equipo Ejecutor son miembros del{' '}
            <span className="text-zinc-400 font-medium">Programa DIAT</span>{' '}
            de la Facultad de Derecho PUCV, participando en calidad de egresados y estudiantes de la carrera.
          </div>
        </motion.div>
      </section>

      {/* Footer note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-4"
      >
        <p className="text-xs text-zinc-400 leading-relaxed">
          <span className="text-cyan-400 font-medium">Programa DIAT 2026.</span>{' '}
          Actividad organizada por el Programa DIAT de la Facultad de Derecho PUCV, con apoyo de Vinculación con el Medio.
          Consultas e inscripciones:{' '}
          <a href="mailto:programadiat@pucv.cl" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            programadiat@pucv.cl
          </a>
          {' '}· Fechas tentativas · Septiembre 2026.
        </p>
      </motion.div>

    </div>
  );
}
