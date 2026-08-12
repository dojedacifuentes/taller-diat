'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight, ShieldCheck, Target, Users, FlaskConical, ScrollText,
} from 'lucide-react';
import { InstitutionalLogoRow } from '@/components/common/InstitutionalLogos';
import {
  identity, institution, schedule, objective, learningOutcomes,
  audience, modality, methodology, sessions, finalChallenge, evaluation,
  evaluationTotal, organization, indicators, background, sources, contact,
} from '@/data/program';

function Block({ eyebrow, title, children }: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div>
        <div className="text-[10px] mono font-bold text-cyan-600 uppercase tracking-[0.2em]">
          {eyebrow}
        </div>
        <h2 className="text-xl font-bold text-white mt-1">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}

export default function AutoridadPage() {
  return (
    <div className="px-4 lg:px-8 py-6 lg:py-8 max-w-5xl mx-auto space-y-12">

      {/* Encabezado */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/[0.06] to-indigo-500/[0.04] p-6 sm:p-8 space-y-5"
      >
        <div className="text-[10px] mono font-bold text-zinc-500 uppercase tracking-[0.2em]">
          {identity.documentLabel} · presentación institucional
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {identity.name}
          </h1>
          <p className="text-base text-zinc-300 mt-2">{identity.tagline}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/8 text-xs text-cyan-300 font-bold mono">
            {schedule.datesShort}
          </span>
          <span className="px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs text-zinc-300 mono">
            {schedule.weekdayLabel} · {schedule.time}
          </span>
          <span className="px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs text-zinc-400 mono">
            {schedule.totalDuration} en total
          </span>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">{identity.thesis}</p>
        <div className="pt-2">
          <InstitutionalLogoRow size="md" />
        </div>
      </motion.div>

      {/* Antecedentes */}
      <Block eyebrow="01" title="Antecedentes y evolución">
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
            <div className="flex flex-wrap items-center gap-2">
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
      </Block>

      {/* Objetivo */}
      <Block eyebrow="02" title={objective.label}>
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/[0.04] p-5">
          <p className="text-sm text-zinc-200 leading-relaxed">{objective.text}</p>
        </div>
        <div className="flex items-start gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-400 leading-relaxed">{identity.principle}</p>
        </div>
      </Block>

      {/* Resultados */}
      <Block eyebrow="03" title="Resultados de aprendizaje">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {learningOutcomes.map((outcome, i) => (
            <div
              key={outcome}
              className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4"
            >
              <span className="shrink-0 w-7 h-7 rounded-lg border border-cyan-500/25 bg-cyan-500/8 flex items-center justify-center text-[11px] mono font-bold text-cyan-400">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-xs text-zinc-400 leading-relaxed">{outcome}</p>
            </div>
          ))}
        </div>
      </Block>

      {/* Público y metodología */}
      <Block eyebrow="04" title="Público, formato y metodología">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-3">
            <div className="flex items-center gap-2 text-[10px] mono font-bold text-zinc-500 uppercase tracking-widest">
              <Users className="w-3.5 h-3.5 text-cyan-500" /> Público y formato
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">{audience.detail}</p>
            <div className="flex flex-wrap gap-1.5">
              {modality.items.map(m => (
                <span key={m} className="px-2.5 py-1 rounded-lg border border-white/[0.08] bg-white/[0.03] text-xs text-zinc-300">
                  {m}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-3">
            <div className="flex items-center gap-2 text-[10px] mono font-bold text-zinc-500 uppercase tracking-widest">
              <Target className="w-3.5 h-3.5 text-indigo-400" /> Metodología
            </div>
            <div className="flex h-8 rounded-lg overflow-hidden border border-white/[0.08]">
              <div
                className="bg-indigo-500/70 flex items-center justify-center text-[10px] font-bold text-white"
                style={{ width: `${methodology.ratio.contents}%` }}
              >
                {methodology.ratio.contents}%
              </div>
              <div
                className="bg-cyan-500/70 flex items-center justify-center text-[10px] font-bold text-black"
                style={{ width: `${methodology.ratio.practice}%` }}
              >
                {methodology.ratio.practice}% práctica
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">{methodology.spine}</p>
          </div>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {methodology.principles.map(p => (
            <li key={p} className="flex items-start gap-2 text-xs text-zinc-400 leading-relaxed">
              <span className="w-1 h-1 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
              {p}
            </li>
          ))}
        </ul>
      </Block>

      {/* Sesiones */}
      <Block eyebrow="05" title="Las tres sesiones">
        <div className="space-y-3">
          {sessions.map(s => (
            <div key={s.id} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[10px] mono font-bold text-cyan-400 uppercase tracking-widest">
                  {s.label}
                </span>
                <span className="text-[10px] text-zinc-600 mono">
                  {s.displayDate} · {s.time}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">{s.title}</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{s.purpose}</p>
              <p className="text-xs text-zinc-300 mt-2">
                <span className="text-zinc-500">Producto: </span>{s.product}
              </p>
            </div>
          ))}
        </div>
      </Block>

      {/* Desafío y evaluación */}
      <Block eyebrow="06" title="Desafío final y evaluación">
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-4">
          <p className="text-sm text-zinc-200 font-medium">{finalChallenge.headline}</p>
          <div className="flex flex-wrap gap-2">
            {finalChallenge.components.map(c => (
              <span key={c} className="text-xs px-2.5 py-1 rounded-lg border border-white/[0.08] bg-white/[0.03] text-zinc-300">
                {c}
              </span>
            ))}
          </div>
          <div className="pt-3 border-t border-white/[0.06] space-y-2">
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
            <div className="text-right text-xs mono font-bold text-zinc-400 pt-1">
              Total {evaluationTotal}%
            </div>
          </div>
        </div>
      </Block>

      {/* Organización e indicadores */}
      <Block eyebrow="07" title="Organización, continuidad e indicadores">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {organization.map(({ entity, role }) => (
            <div key={entity} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="text-xs font-semibold text-zinc-200 leading-snug">{entity}</div>
              <div className="text-[11px] text-zinc-500 mt-1 leading-relaxed">{role}</div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-purple-500/20 bg-purple-500/[0.04] p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-[10px] mono font-bold text-purple-400 uppercase tracking-widest">
            <FlaskConical className="w-3.5 h-3.5" /> Indicadores de resultado
          </div>
          <ul className="space-y-1.5">
            {indicators.map(ind => (
              <li key={ind} className="flex items-start gap-2 text-xs text-zinc-400 leading-relaxed">
                <span className="w-1 h-1 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                {ind}
              </li>
            ))}
          </ul>
        </div>
      </Block>

      {/* Fuentes */}
      <Block eyebrow="08" title="Fuentes públicas consultadas">
        <ol className="space-y-2.5">
          {sources.map((src, i) => (
            <li key={src.url} className="flex items-start gap-3">
              <span className="text-[10px] mono font-bold text-zinc-700 mt-0.5 shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <p className="text-xs text-zinc-400 leading-relaxed">{src.label}</p>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] mono text-cyan-600 hover:text-cyan-400 break-all transition-colors"
                >
                  {src.url}
                </a>
              </div>
            </li>
          ))}
        </ol>
      </Block>

      {/* Cierre */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 text-center space-y-3"
      >
        <p className="text-sm text-zinc-300">
          {institution.programLong} · {institution.faculty}
        </p>
        <p className="text-xs text-zinc-500">
          Contacto:{' '}
          <a href={`mailto:${contact.email}`} className="text-cyan-400 hover:text-cyan-300 transition-colors">
            {contact.email}
          </a>
        </p>
        <Link href="/dossier" className="inline-flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
          <ScrollText className="w-3.5 h-3.5" />
          Ver dossier completo
        </Link>
      </motion.div>
    </div>
  );
}
