'use client';
import { motion } from 'framer-motion';
import { teamMembers, roleColors, memberAvatarColors } from '@/data/team';
import type { TeamRole } from '@/lib/types';

const roleOrder: TeamRole[] = [
  'Director', 'Subdirector', 'Coordinación', 'Difusión',
  'Evidencias', 'Soporte Técnico', 'Relator', 'Participante',
];

const statusConfig = {
  active: { label: 'Activo', dot: 'bg-emerald-400', text: 'text-emerald-400' },
  standby: { label: 'Standby', dot: 'bg-yellow-400 animate-pulse', text: 'text-yellow-400' },
  pending: { label: 'Pendiente', dot: 'bg-zinc-500', text: 'text-zinc-500' },
};

const grouped = roleOrder.reduce((acc, role) => {
  const members = teamMembers.filter((m) => m.role === role);
  if (members.length > 0) acc[role] = members;
  return acc;
}, {} as Record<string, typeof teamMembers>);

export default function EquipoPage() {
  return (
    <div className="px-4 lg:px-8 py-6 lg:py-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Equipo Operativo DIAT</h2>
        <p className="text-sm text-zinc-500 mt-1">Estructura de roles y responsabilidades del programa</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Integrantes', value: teamMembers.length, color: 'text-cyan-400' },
          { label: 'Roles', value: Object.keys(grouped).length, color: 'text-indigo-400' },
          { label: 'Activos ahora', value: teamMembers.filter(m => m.status === 'active').length, color: 'text-emerald-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 text-center">
            <div className={`text-2xl font-bold mono ${color}`}>{value}</div>
            <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Hierarchical layout */}
      <div className="space-y-5">
        {roleOrder.filter(r => grouped[r]).map((role, gi) => (
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.08, duration: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-semibold ${roleColors[role] ?? 'text-zinc-400 border-zinc-600/30 bg-zinc-800/30'}`}>
                {role}
              </div>
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-xs text-zinc-600">{grouped[role].length}</span>
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
                    transition={{ delay: gi * 0.08 + mi * 0.04, duration: 0.35 }}
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="rounded-xl border border-indigo-500/15 bg-indigo-500/5 p-4"
      >
        <p className="text-xs text-zinc-400 leading-relaxed">
          <span className="text-indigo-400 font-medium">Equipo DIAT 2026.</span>{' '}
          Para comunicaciones oficiales del programa, dirigirse a la Coordinación del área correspondiente. El Directorio gestiona la relación institucional con la Facultad de Derecho PUCV.
        </p>
      </motion.div>
    </div>
  );
}
