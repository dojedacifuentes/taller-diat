'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CalendarDays, Clock, FileText, ArrowRight } from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import type { SessionStatus } from '@/lib/types';
import {
  identity, schedule, sessions, methodology, institution,
} from '@/data/program';

/**
 * Estado derivado de la fecha real de la sesión (hora de Chile continental),
 * en lugar de un campo fijo que envejece en los datos.
 */
function statusFor(isoDate: string): SessionStatus {
  const now = Date.now();
  const start = new Date(`${isoDate}T15:00:00-04:00`).getTime();
  const end = new Date(`${isoDate}T16:30:00-04:00`).getTime();
  if (now > end) return 'completed';
  if (now >= start) return 'active';
  return 'pending';
}

const accents = [
  { ring: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300', line: 'text-cyan-400' },
  { ring: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300', line: 'text-indigo-400' },
  { ring: 'border-purple-500/30 bg-purple-500/10 text-purple-300', line: 'text-purple-400' },
];

export default function CalendarioPage() {
  return (
    <div className="px-4 lg:px-8 py-6 lg:py-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Calendario del taller</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {identity.name} · {schedule.sessionCount} sesiones de {schedule.sessionDuration} ·{' '}
          {schedule.totalDuration} en total
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-5 top-10 bottom-10 w-px bg-gradient-to-b from-cyan-500/30 via-indigo-500/20 to-transparent hidden sm:block" />
        <div className="space-y-4">
          {sessions.map((s, i) => {
            const status = statusFor(s.date);
            const a = accents[i];
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="relative rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 flex items-start gap-4"
              >
                <div className={`shrink-0 w-10 h-10 rounded-lg border flex items-center justify-center font-bold text-lg mono ${a.ring}`}>
                  {s.id}
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={status} />
                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" /> {s.displayDate} de 2026
                    </span>
                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {s.time}
                    </span>
                  </div>
                  <h2 className="text-base font-semibold text-white leading-snug">{s.title}</h2>
                  <p className="text-xs text-zinc-500 leading-relaxed">{s.purpose}</p>
                  <div className="flex items-start gap-2 pt-1">
                    <FileText className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${a.line}`} />
                    <span className="text-xs text-zinc-300">
                      <span className="text-zinc-500">Producto: </span>{s.product}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-2"
      >
        <p className="text-xs text-zinc-400 leading-relaxed">{methodology.spine}</p>
        <p className="text-xs text-zinc-600">
          Sesiones presenciales en la {institution.faculty}, {institution.city}.{' '}
          {methodology.ratio.label}.
        </p>
        <Link
          href="/modulos"
          className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors pt-1"
        >
          Ver el programa completo <ArrowRight className="w-3 h-3" />
        </Link>
      </motion.div>
    </div>
  );
}
