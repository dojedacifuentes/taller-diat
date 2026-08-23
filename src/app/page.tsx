'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight, Mail, Download, Building2, Cpu, FlaskConical,
  ShieldCheck, ScrollText, Users, Target, ClipboardCheck, GitBranch, Route, Play,
} from 'lucide-react';
import { InstitutionalLogoRow } from '@/components/common/InstitutionalLogos';
import { useCountdown } from '@/hooks/useCountdown';
import { generateDossierPDF } from '@/lib/pdfGenerators';
import {
  identity, institution, schedule, audience, modality, methodology,
  objective, learningOutcomes, sessions, finalChallenge, evaluation,
  organization, background, registration, gmailCompose,
  complementaryResources, complementaryNotice,
} from '@/data/program';
import { thesis } from '@/data/pedagogy';

const sessionAccents = [
  { border: 'border-cyan-500/25', bg: 'bg-cyan-500/5', text: 'text-cyan-400', chip: 'border-cyan-500/25 bg-cyan-500/8' },
  { border: 'border-indigo-500/25', bg: 'bg-indigo-500/5', text: 'text-indigo-400', chip: 'border-indigo-500/25 bg-indigo-500/8' },
  { border: 'border-purple-500/25', bg: 'bg-purple-500/5', text: 'text-purple-400', chip: 'border-purple-500/25 bg-purple-500/8' },
];

function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-cyan-500/30 bg-cyan-500/8 flex items-center justify-center glow-cyan">
        <span className="text-2xl sm:text-3xl font-bold text-cyan-200 mono tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] text-zinc-500 uppercase tracking-widest mono">{label}</span>
    </div>
  );
}

function SectionHeading({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <div className="space-y-2">
      <div className="text-[10px] mono font-bold text-cyan-600 uppercase tracking-[0.2em]">{eyebrow}</div>
      <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
      {lead && <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">{lead}</p>}
    </div>
  );
}

export default function LandingPage() {
  const cd = useCountdown(schedule.countdownTarget);

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 lg:py-12 space-y-20">

      {/* ── HERO ─────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-8"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/8 text-xs text-cyan-400 font-semibold mono tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            {institution.program}
          </span>
          <span className="inline-flex items-center px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-xs text-zinc-400 font-medium mono">
            {institution.faculty}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-white">
            Taller de Prompting{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, oklch(0.71 0.17 200) 0%, oklch(0.55 0.22 264) 100%)' }}
            >
              Jurídico 3.0
            </span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            {identity.tagline}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs text-zinc-300 mono">
              {schedule.weekdayLabel} · {schedule.time}
            </span>
            <span className="px-3 py-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/8 text-xs text-cyan-300 font-bold mono">
              {schedule.datesShort}
            </span>
            <span className="px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs text-zinc-400 mono">
              {schedule.totalDuration} en total
            </span>
          </div>

          <p className="mt-6 text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Diseñar procesos jurídicos útiles, verificables, trazables y responsables
            con inteligencia artificial generativa.
          </p>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="space-y-4"
        >
          <div className="text-xs text-zinc-500 uppercase tracking-widest mono">Comienza en</div>
          <div className="flex items-end justify-center gap-3 sm:gap-4">
            <CountdownBlock value={cd.days} label="días" />
            <span className="text-zinc-600 text-3xl font-bold pb-7">:</span>
            <CountdownBlock value={cd.hours} label="horas" />
            <span className="text-zinc-600 text-3xl font-bold pb-7">:</span>
            <CountdownBlock value={cd.minutes} label="min" />
            <span className="text-zinc-600 text-3xl font-bold pb-7">:</span>
            <CountdownBlock value={cd.seconds} label="seg" />
          </div>
          <div className="text-xs text-zinc-600 mono">
            {sessions[0].label} · {sessions[0].displayDate} de 2026 · {schedule.time} · Derecho PUCV, Valparaíso
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap"
        >
          <Link href="/clase-1">
            <motion.span
              className="flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm text-black bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-[0_0_28px_rgba(52,211,153,0.2)]"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Play className="w-4 h-4 fill-current" />
              Entrar a la Clase 1
            </motion.span>
          </Link>
          <a href={gmailCompose} target="_blank" rel="noopener noreferrer">
            <motion.button
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-black bg-cyan-400 hover:bg-cyan-300 transition-colors glow-cyan"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Mail className="w-4 h-4" />
              {registration.ctaPrimary}
            </motion.button>
          </a>
          <Link href="/ruta">
            <motion.button
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-cyan-300 border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <Route className="w-4 h-4" />
              Empezar ruta
            </motion.button>
          </Link>
          <Link href="/modulos">
            <motion.button
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-cyan-300 border border-cyan-500/30 bg-cyan-500/8 hover:bg-cyan-500/15 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {registration.ctaSecondary}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Accesos secundarios */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
        >
          <Link href="/prompt-lab" className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-cyan-300 transition-colors">
            <FlaskConical className="w-3.5 h-3.5" /> Abrir Prompt Lab
          </Link>
          <Link href="/materiales" className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-cyan-300 transition-colors">
            <Download className="w-3.5 h-3.5" /> Descargar materiales
          </Link>
          <button
            type="button"
            onClick={() => generateDossierPDF()}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-cyan-300 transition-colors"
          >
            <ScrollText className="w-3.5 h-3.5" /> Dossier en PDF
          </button>
        </motion.div>
      </motion.section>

      {/* ── PROGRESIÓN DEL TALLER ────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="text-center">
          <div className="text-[10px] mono font-bold text-cyan-600 uppercase tracking-[0.2em] mb-2">
            La progresión
          </div>
          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            {thesis.headline}
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-4">
          {thesis.progression.map((p, i) => (
            <div
              key={p.label}
              className={`rounded-xl border p-4 ${
                i === 3
                  ? 'border-emerald-500/30 bg-emerald-500/[0.05]'
                  : `${sessionAccents[i].border} ${sessionAccents[i].bg}`
              }`}
            >
              <div className={`text-[9px] mono font-bold uppercase tracking-widest mb-1.5 ${i === 3 ? 'text-emerald-500' : 'text-zinc-600'}`}>
                {p.step}
              </div>
              <div className={`mono text-sm font-bold mb-2 ${i === 3 ? 'text-emerald-300' : sessionAccents[i].text}`}>
                {p.label}
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">{p.claim}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── QUÉ ES EL TALLER ─────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <SectionHeading eyebrow="01 · Qué es" title="Un taller sobre criterio, no sobre atajos" />

        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.04] p-6 sm:p-7">
          <p className="text-base text-zinc-200 leading-relaxed font-medium">
            {identity.thesis}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-2">
            <div className="flex items-center gap-2 text-[10px] mono font-bold text-zinc-500 uppercase tracking-widest">
              <Target className="w-3.5 h-3.5 text-cyan-500" /> {objective.label}
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">{objective.text}</p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-2">
            <div className="flex items-center gap-2 text-[10px] mono font-bold text-zinc-500 uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Principio de uso
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">{identity.principle}</p>
            <p className="text-xs text-zinc-500 leading-relaxed pt-1">
              Se trabaja exclusivamente con casos simulados, anonimizados o expresamente autorizados.
            </p>
          </div>
        </div>
      </motion.section>

      {/* ── RESULTADOS DE APRENDIZAJE ────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <SectionHeading
          eyebrow="02 · Qué aprenderé"
          title="Resultados de aprendizaje"
          lead="Al terminar las tres sesiones, cada participante debería ser capaz de lo siguiente."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {learningOutcomes.map((outcome, i) => (
            <motion.div
              key={outcome}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4"
            >
              <span className="shrink-0 w-7 h-7 rounded-lg border border-cyan-500/25 bg-cyan-500/8 flex items-center justify-center text-[11px] mono font-bold text-cyan-400">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-xs text-zinc-400 leading-relaxed">{outcome}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── LAS 3 SESIONES ───────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <SectionHeading
            eyebrow="03 · Cómo funciona"
            title="Las 3 sesiones"
            lead={methodology.spine}
          />
          <Link href="/modulos" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors shrink-0">
            Programa completo <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-3">
          {sessions.map((s, i) => {
            const a = sessionAccents[i];
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border ${a.border} ${a.bg} p-5 sm:p-6`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="shrink-0 flex sm:flex-col items-center gap-3 sm:gap-1.5">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-black text-xl mono ${a.chip} ${a.text}`}>
                      {s.id}
                    </div>
                    <span className={`text-[10px] mono font-bold tracking-widest ${a.text}`}>
                      {s.displayDateShort}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] mono font-bold uppercase tracking-widest ${a.text}`}>
                        {s.label}
                      </span>
                      <span className="text-[10px] text-zinc-600 mono">
                        {s.displayDate} · {s.time}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug">{s.title}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">{s.purpose}</p>
                    <div className="flex items-start gap-2 pt-1">
                      <ClipboardCheck className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${a.text}`} />
                      <span className="text-xs text-zinc-300">
                        <span className="text-zinc-500">Producto: </span>{s.product}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
                      {s.id === 1 && (
                        <Link
                          href="/clase-1"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-300 transition-colors hover:bg-emerald-500/20"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          Abrir Clase 1 interactiva
                        </Link>
                      )}
                      <Link
                        href={`/sesiones/${s.id}`}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold ${a.text} hover:underline`}
                      >
                        Cronograma, caso y materiales de la sesión
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* ── DESAFÍO FINAL ────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <SectionHeading
          eyebrow="04 · Qué construiré"
          title="Desafío final"
          lead={finalChallenge.headline}
        />
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 space-y-5">
          <div className="flex items-center gap-2 text-[10px] mono font-bold text-zinc-500 uppercase tracking-widest">
            <GitBranch className="w-3.5 h-3.5 text-indigo-400" /> El entregable debe incluir
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {finalChallenge.components.map((c, i) => (
              <div
                key={c}
                className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
              >
                <span className="text-[10px] mono text-zinc-700">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-xs text-zinc-300">{c}</span>
              </div>
            ))}
          </div>

          {/* Evaluación */}
          <div className="pt-4 border-t border-white/[0.06] space-y-3">
            <div className="text-[10px] mono font-bold text-zinc-500 uppercase tracking-widest">
              Criterios de evaluación
            </div>
            <div className="space-y-2">
              {evaluation.map(({ weight, criterion }) => (
                <div key={criterion} className="flex items-center gap-3">
                  <span className="w-10 shrink-0 text-right text-xs mono font-bold text-cyan-400">{weight}%</span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${weight * 4}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                    />
                  </div>
                  <span className="flex-[2] text-xs text-zinc-400 leading-snug">{criterion}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── METODOLOGÍA ──────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <SectionHeading
          eyebrow="05 · Metodología"
          title={methodology.ratio.label}
          lead="Cada jornada combina cuatro momentos. No hay clases magistrales de 90 minutos."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {methodology.stages.map((stage, i) => (
            <motion.div
              key={stage.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-2"
            >
              <div className="text-[10px] mono text-zinc-700">{String(i + 1).padStart(2, '0')}</div>
              <div className="text-sm font-semibold text-zinc-200">{stage.label}</div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">{stage.description}</p>
            </motion.div>
          ))}
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {methodology.principles.map(p => (
            <li key={p} className="flex items-start gap-2 text-xs text-zinc-400 leading-relaxed">
              <span className="w-1 h-1 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
              {p}
            </li>
          ))}
        </ul>
      </motion.section>

      {/* ── PÚBLICO Y FORMATO ────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <SectionHeading eyebrow="06 · A quién está dirigido" title="Público y formato" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/[0.04] p-5 space-y-2">
            <div className="flex items-center gap-2 text-[10px] mono font-bold text-cyan-600 uppercase tracking-widest">
              <Users className="w-3.5 h-3.5" /> Público
            </div>
            <p className="text-sm font-semibold text-zinc-200 leading-snug">{audience.headline}</p>
            <p className="text-xs text-zinc-500 leading-relaxed">{audience.detail}</p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-3">
            <div className="text-[10px] mono font-bold text-zinc-500 uppercase tracking-widest">Formato</div>
            <div className="flex flex-wrap gap-1.5">
              {modality.items.map(m => (
                <span key={m} className="px-2.5 py-1 rounded-lg border border-white/[0.08] bg-white/[0.03] text-xs text-zinc-300">
                  {m}
                </span>
              ))}
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              {schedule.sessionCount} sesiones de {schedule.sessionDuration} · {schedule.totalDuration} en total ·{' '}
              {institution.city}
            </p>
          </div>
        </div>
      </motion.section>

      {/* ── ANTECEDENTES Y EVOLUCIÓN ─────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <SectionHeading eyebrow="07 · Antecedentes" title="De dónde viene esta versión" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-2">
            <div className="text-[10px] mono font-bold text-zinc-500 uppercase tracking-widest">
              {background.previous.title}
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">{background.previous.text}</p>
            <p className="text-xs text-zinc-500 leading-relaxed">{background.previous.scope}</p>
          </div>
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[0.04] p-5 space-y-3">
            <div className="text-[10px] mono font-bold text-indigo-400 uppercase tracking-widest">
              {background.evolution.title}
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">{background.evolution.text}</p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {background.evolution.steps.map((step, i) => (
                <span key={step} className="flex items-center gap-2">
                  <span className="text-xs text-zinc-200 font-medium">{step}</span>
                  {i < background.evolution.steps.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-zinc-700" />
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── ORGANIZACIÓN ─────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 sm:p-8 space-y-6"
      >
        <div className="text-center space-y-1">
          <div className="text-[10px] text-zinc-600 uppercase tracking-widest mono font-medium">
            Organización y continuidad
          </div>
          <h2 className="text-lg font-bold text-white">Actividad organizada por</h2>
        </div>
        <div className="flex justify-center">
          <InstitutionalLogoRow size="md" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {organization.map(({ entity, role }) => (
            <div key={entity} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="text-xs font-semibold text-zinc-200 leading-snug">{entity}</div>
              <div className="text-[11px] text-zinc-500 mt-1 leading-relaxed">{role}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/[0.06]">
          {[
            { icon: <Building2 className="w-4 h-4" />, label: institution.faculty, sub: institution.university, color: 'text-cyan-400' },
            { icon: <Cpu className="w-4 h-4" />, label: institution.program, sub: institution.discipline, color: 'text-indigo-400' },
            { icon: <FlaskConical className="w-4 h-4" />, label: 'LMIL PUCV', sub: 'Continuidad de proyectos · Innova Day 2026', color: 'text-purple-400' },
          ].map(({ icon, label, sub, color }) => (
            <div key={label} className="text-center space-y-1 pt-4">
              <div className={`flex justify-center mb-1 ${color}`}>{icon}</div>
              <div className={`text-sm font-semibold ${color}`}>{label}</div>
              <div className="text-[11px] text-zinc-600 leading-relaxed">{sub}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── RECURSOS COMPLEMENTARIOS ─────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-5"
      >
        <SectionHeading
          eyebrow="Plataforma"
          title="Recursos complementarios"
          lead={complementaryNotice}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {complementaryResources.map(({ href, label, description }) => (
            <Link key={href} href={href}>
              <motion.div
                className="group flex items-center gap-4 p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-cyan-500/25 hover:bg-cyan-500/5 transition-all"
                whileHover={{ y: -2 }}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-zinc-200 group-hover:text-white transition-colors">{label}</div>
                  <div className="text-xs text-zinc-600">{description}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-cyan-500 transition-colors shrink-0" />
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* ── CTA FINAL ────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/8 to-indigo-500/5 overflow-hidden p-8 text-center"
      >
        <div className="absolute inset-0 grid-bg-fine opacity-30" />
        <div className="relative space-y-4">
          <div className="text-2xl font-bold text-white">{identity.name}</div>
          <p className="text-zinc-300 text-sm max-w-md mx-auto">{identity.tagline}</p>
          <p className="text-[11px] text-zinc-500 mono">
            {schedule.datesLong} · {schedule.time} · {registration.note}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-2">
            <a href={gmailCompose} target="_blank" rel="noopener noreferrer">
              <motion.button
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-black bg-cyan-400 hover:bg-cyan-300 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Mail className="w-4 h-4" />
                {registration.ctaPrimary}
              </motion.button>
            </a>
            <Link href="/dossier">
              <motion.button
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-zinc-300 border border-white/10 hover:border-white/20 hover:bg-white/[0.04] transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <ScrollText className="w-4 h-4" />
                Ver dossier
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.section>

    </div>
  );
}
