'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ChevronDown, Clock, Target, BookOpen, FileText,
  Download, FlaskConical, ShieldCheck, ArrowRight,
} from 'lucide-react';
import type { Session } from '@/lib/types';
import {
  identity, institution, schedule, methodology, audience, modality,
  sessions, finalChallenge, evaluation, registration, gmailCompose,
} from '@/data/program';
import { generateProgramPDF } from '@/lib/pdfGenerators';

const sessionColors = [
  {
    border: 'border-cyan-500/25',
    numBg: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400',
    accentText: 'text-cyan-400',
    dot: 'bg-cyan-500',
    pill: 'border-cyan-500/25 bg-cyan-500/8',
  },
  {
    border: 'border-indigo-500/25',
    numBg: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400',
    accentText: 'text-indigo-400',
    dot: 'bg-indigo-500',
    pill: 'border-indigo-500/25 bg-indigo-500/8',
  },
  {
    border: 'border-purple-500/25',
    numBg: 'border-purple-500/40 bg-purple-500/10 text-purple-400',
    accentText: 'text-purple-400',
    dot: 'bg-purple-500',
    pill: 'border-purple-500/25 bg-purple-500/8',
  },
];

function SLabel({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2.5">
      <span className="text-cyan-500">{icon}</span> {text}
    </div>
  );
}

function SessionCard({ session, index }: { session: Session; index: number }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'contenido' | 'secuencia'>('contenido');
  const c = sessionColors[index];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className={`rounded-2xl border ${c.border} overflow-hidden`}
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="px-5 sm:px-7 py-5 flex items-start gap-5">
          <div className="shrink-0 flex flex-col items-center gap-1.5 mt-0.5">
            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-black text-xl mono ${c.numBg}`}>
              {session.id}
            </div>
            <span className={`text-[9px] mono font-bold tracking-widest ${c.accentText}`}>
              {session.displayDateShort}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`text-[10px] mono font-bold uppercase tracking-widest ${c.accentText}`}>
                {session.label}
              </span>
              <span className="text-[10px] text-zinc-500 mono px-2 py-0.5 rounded border border-zinc-700/40 bg-zinc-800/20">
                {session.displayDate}
              </span>
              <span className="text-[10px] text-zinc-500 mono px-2 py-0.5 rounded border border-zinc-700/40 bg-zinc-800/20">
                {session.time} · {session.duration}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold leading-tight text-white">
              {session.title}
            </h3>
            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{session.purpose}</p>

            <div className="flex items-start gap-2 mt-3">
              <FileText className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${c.accentText}`} />
              <span className="text-xs text-zinc-300">
                <span className="text-zinc-500">Producto: </span>{session.product}
              </span>
            </div>
          </div>

          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 mt-1">
            <ChevronDown className="w-5 h-5 text-zinc-500" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden border-t border-white/[0.05]"
          >
            <div className="flex gap-0 border-b border-white/[0.05]">
              {(['contenido', 'secuencia'] as const).map(t => (
                <button
                  key={t}
                  onClick={(e) => { e.stopPropagation(); setTab(t); }}
                  className={`px-5 py-3 text-xs font-semibold transition-colors ${
                    tab === t
                      ? `${c.accentText} border-b-2 border-current`
                      : 'text-zinc-600 hover:text-zinc-400 border-b-2 border-transparent'
                  }`}
                >
                  {t === 'contenido' ? 'Contenidos' : 'Secuencia pedagógica'}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {tab === 'contenido' ? (
                <motion.div
                  key="contenido"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-5 sm:px-7 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  <div>
                    <SLabel icon={<BookOpen className="w-3.5 h-3.5" />} text="Contenidos" />
                    <ol className="space-y-3">
                      {session.contents.map((content, i) => (
                        <li key={content.title} className="flex items-start gap-2.5">
                          <span className="shrink-0 text-[10px] mono font-bold text-zinc-700 mt-0.5">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs text-zinc-300 leading-relaxed">{content.title}</p>
                            {content.items && (
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {content.items.map(item => (
                                  <span
                                    key={item}
                                    className={`text-[10px] px-2 py-0.5 rounded-md border text-zinc-400 ${c.pill}`}
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <SLabel icon={<Target className="w-3.5 h-3.5" />} text="Propósito" />
                      <p className="text-xs text-zinc-400 leading-relaxed">{session.purpose}</p>
                    </div>
                    <div>
                      <SLabel icon={<FlaskConical className="w-3.5 h-3.5" />} text={session.practice.label} />
                      <p className="text-xs text-zinc-400 leading-relaxed">{session.practice.description}</p>
                    </div>
                    <div>
                      <SLabel icon={<FileText className="w-3.5 h-3.5" />} text="Producto de la sesión" />
                      <p className="text-xs text-zinc-300 leading-relaxed">{session.product}</p>
                    </div>
                    {session.notes && (
                      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 space-y-1.5">
                        {session.notes.map(note => (
                          <div key={note} className="flex items-start gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                            <p className="text-[11px] text-zinc-400 leading-relaxed">{note}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="secuencia"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-5 sm:px-7 py-6"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className={`w-4 h-4 ${c.accentText}`} />
                    <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                      {session.time} · duración total {schedule.sessionMinutes} min
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600 mb-5">
                    Los bloques se presentan en orden. La propuesta no asigna minutos fijos a cada
                    actividad.
                  </p>

                  <div className="max-w-xl">
                    {methodology.stages.map((stage, i) => {
                      const isLast = i === methodology.stages.length - 1;
                      const applied = stage.label === 'Trabajo aplicado';
                      return (
                        <div key={stage.label} className="flex gap-3">
                          <div className="flex flex-col items-center shrink-0">
                            <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${c.dot}`} />
                            {!isLast && <div className="w-px flex-1 bg-white/[0.06] mt-1" />}
                          </div>
                          <div className="pb-5">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-[10px] mono text-zinc-600">
                                Bloque {String(i + 1).padStart(2, '0')}
                              </span>
                            </div>
                            <div className="text-xs font-semibold text-zinc-200">
                              {applied ? `${stage.label} — ${session.practice.label}` : stage.label}
                            </div>
                            <div className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                              {applied ? session.practice.description : stage.description}
                            </div>
                          </div>
                        </div>
                      );
                    })}
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

export default function ProgramaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
          <span className="mono text-[10px] text-zinc-600 tracking-widest uppercase">
            {institution.program} · {institution.faculty}
          </span>
          <button
            onClick={() => generateProgramPDF()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700/50 bg-zinc-800/20 hover:border-cyan-500/30 hover:bg-cyan-500/8 hover:text-cyan-400 text-zinc-500 text-xs font-medium transition-all"
          >
            <Download className="w-3 h-3" />
            Descargar programa PDF
          </button>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Programa del taller
        </h1>
        <p className="text-sm text-zinc-400 mt-2 leading-relaxed max-w-2xl">
          {identity.name} — {identity.tagline}. {schedule.sessionCount} sesiones de{' '}
          {schedule.sessionDuration} ({schedule.totalDuration} en total), {schedule.time}.{' '}
          {methodology.spine}
        </p>
      </motion.div>

      {/* Date pills */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        {sessions.map((s, i) => (
          <span
            key={s.id}
            className={`text-xs mono font-bold px-3 py-1.5 rounded-full border ${sessionColors[i].pill} ${sessionColors[i].accentText}`}
          >
            S{s.id} — {s.displayDate}
          </span>
        ))}
        <span className="text-xs mono px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-zinc-400">
          {schedule.time}
        </span>
      </motion.div>

      {/* Sessions */}
      <div className="space-y-5">
        {sessions.map((s, i) => (
          <SessionCard key={s.id} session={s} index={i} />
        ))}
      </div>

      {/* Desafío final y evaluación */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 space-y-5"
      >
        <div>
          <div className="text-[10px] mono font-bold text-cyan-600 uppercase tracking-[0.2em]">
            Desafío final
          </div>
          <h2 className="text-lg font-bold text-white mt-1.5">{finalChallenge.headline}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {finalChallenge.components.map(comp => (
            <span
              key={comp}
              className="text-xs px-2.5 py-1 rounded-lg border border-white/[0.08] bg-white/[0.03] text-zinc-300"
            >
              {comp}
            </span>
          ))}
        </div>
        <div className="pt-4 border-t border-white/[0.06] space-y-2.5">
          <div className="text-[10px] mono font-bold text-zinc-500 uppercase tracking-widest">
            Criterios de evaluación
          </div>
          {evaluation.map(({ weight, criterion }) => (
            <div key={criterion} className="flex items-center gap-3">
              <span className="w-9 shrink-0 text-right text-xs mono font-bold text-cyan-400">{weight}%</span>
              <div className="flex-1 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                  style={{ width: `${weight * 4}%` }}
                />
              </div>
              <span className="flex-[2] text-xs text-zinc-400 leading-snug">{criterion}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Público y formato */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
        className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 space-y-3"
      >
        <div className="text-[10px] mono font-bold text-zinc-500 uppercase tracking-widest">
          Público y formato
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">{audience.detail}</p>
        <div className="flex flex-wrap gap-1.5">
          {modality.items.map(m => (
            <span key={m} className="px-2.5 py-1 rounded-lg border border-white/[0.08] bg-white/[0.03] text-xs text-zinc-300">
              {m}
            </span>
          ))}
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed">
          {methodology.ratio.label}. Sesiones presenciales en la {institution.faculty}, {institution.city}.
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3 py-4 border-t border-white/[0.05]"
      >
        <a href={gmailCompose} target="_blank" rel="noopener noreferrer">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-sm font-bold transition-colors">
            {registration.ctaPrimary}
          </button>
        </a>
        <Link href="/dossier">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/[0.04] text-zinc-300 text-sm font-medium transition-all">
            Ver dossier completo <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
