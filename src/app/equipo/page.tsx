'use client';
import { motion } from 'framer-motion';
import { teamMembers, roleColors, memberAvatarColors } from '@/data/team';
import type { TeamRole } from '@/lib/types';
import { InstitutionalLogoRow } from '@/components/common/InstitutionalLogos';
import { Shield, Users, Code2 } from 'lucide-react';

// Institutional leaders displayed separately as featured cards
const institutionalLeaders = [
  {
    name: 'Eduardo Aldunate Lizana',
    title: 'Director, Escuela de Derecho PUCV',
    role: 'Autoridad institucional',
    initials: 'EAL',
    color: 'border-cyan-500/30 bg-cyan-500/8',
    avatarColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    accentText: 'text-cyan-400',
    icon: <Shield className="w-4 h-4" />,
    desc: 'Facultad de Derecho PUCV · Profesor de Derecho Constitucional',
  },
  {
    name: 'Dr. Adolfo Silva Walbaum',
    title: 'Director Programa DIAT · Director del Taller',
    role: 'Dirección del programa',
    initials: 'ASW',
    color: 'border-indigo-500/30 bg-indigo-500/8',
    avatarColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    accentText: 'text-indigo-400',
    icon: <Users className="w-4 h-4" />,
    desc: 'Responsable académico y operativo del Programa DIAT 2026',
  },
  {
    name: 'Diego Hernán Ojeda Cifuentes',
    title: 'Subdirector · Coordinador Operativo',
    role: 'Desarrollo de Plataforma',
    initials: 'DOC',
    color: 'border-blue-500/30 bg-blue-500/8',
    avatarColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    accentText: 'text-blue-400',
    icon: <Code2 className="w-4 h-4" />,
    desc: 'Coordinación operativa · Diseño y desarrollo de plataforma digital',
  },
];

const operationalRoles: TeamRole[] = [
  'Coordinación', 'Difusión', 'Evidencias', 'Soporte Técnico', 'Relator', 'Participante',
];

const statusConfig = {
  active: { label: 'Activo', dot: 'bg-emerald-400', text: 'text-emerald-400' },
  standby: { label: 'Standby', dot: 'bg-yellow-400 animate-pulse', text: 'text-yellow-400' },
  pending: { label: 'Pendiente', dot: 'bg-zinc-500', text: 'text-zinc-500' },
};

const operationalTeam = teamMembers.filter(m =>
  operationalRoles.includes(m.role as TeamRole) && m.id !== 'tm-02'
);

const grouped = operationalRoles.reduce((acc, role) => {
  const members = operationalTeam.filter((m) => m.role === role);
  if (members.length > 0) acc[role] = members;
  return acc;
}, {} as Record<string, typeof teamMembers>);

export default function EquipoPage() {
  return (
    <div className="px-4 lg:px-8 py-6 lg:py-8 max-w-5xl mx-auto space-y-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-2">
          <InstitutionalLogoRow size="sm" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white mt-3">Equipo DIAT 2026</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Estructura institucional y operativa del Programa DIAT · Facultad de Derecho PUCV
        </p>
      </motion.div>

      {/* ── Institutional leaders ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mono">
            Dirección Institucional
          </div>
          <div className="flex-1 h-px bg-white/[0.05]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {institutionalLeaders.map((leader, i) => (
            <motion.div
              key={leader.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className={`rounded-2xl border p-5 space-y-3 ${leader.color}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center font-bold text-sm shrink-0 ${leader.avatarColor}`}>
                  {leader.initials}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white leading-tight">{leader.name}</div>
                  <div className={`text-[11px] ${leader.accentText} font-medium mt-0.5 leading-tight`}>
                    {leader.title}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className={`${leader.accentText}`}>{leader.icon}</span>
                <span className={`text-[10px] font-semibold ${leader.accentText} uppercase tracking-wider`}>
                  {leader.role}
                </span>
              </div>

              <p className="text-[11px] text-zinc-500 leading-relaxed">{leader.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Operational team ── */}
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mono">
            Equipo Operativo
          </div>
          <div className="flex-1 h-px bg-white/[0.05]" />
          <span className="text-xs text-zinc-600">{operationalTeam.length} personas</span>
        </div>

        {operationalRoles.filter(r => grouped[r]).map((role, gi) => (
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + gi * 0.08, duration: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-semibold ${roleColors[role] ?? 'text-zinc-400 border-zinc-600/30 bg-zinc-800/30'}`}>
                {role}
              </div>
              <div className="flex-1 h-px bg-white/[0.04]" />
              <span className="text-xs text-zinc-700">{grouped[role].length}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {grouped[role].map((member, mi) => {
                const avatarClass = memberAvatarColors[member.color] ?? 'bg-zinc-700 text-zinc-300 border-zinc-600';
                const sc = statusConfig[member.status];
                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + gi * 0.08 + mi * 0.04, duration: 0.35 }}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[oklch(0.09_0.017_250/0.5)] hover:border-white/15 hover:bg-white/[0.04] transition-all p-3.5"
                  >
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-sm shrink-0 ${avatarClass}`}>
                      {member.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate">{member.name}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        <span className={`text-xs ${sc.text}`}>{sc.label}</span>
                        {member.moduleId && (
                          <span className="text-[10px] text-zinc-600 mono ml-1">M{member.moduleId}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="rounded-xl border border-indigo-500/15 bg-indigo-500/5 p-4"
      >
        <p className="text-xs text-zinc-400 leading-relaxed">
          <span className="text-indigo-400 font-medium">Programa DIAT 2026.</span>{' '}
          Actividad organizada por el Programa DIAT de la Facultad de Derecho PUCV,
          con apoyo de Vinculación con el Medio. Para consultas e inscripciones,
          escribir a{' '}
          <a
            href="mailto:programadiat@pucv.cl"
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            programadiat@pucv.cl
          </a>
          .
        </p>
      </motion.div>

    </div>
  );
}
