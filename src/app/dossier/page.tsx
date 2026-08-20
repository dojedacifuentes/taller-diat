'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Download, ArrowLeft, ChevronRight } from 'lucide-react';
import {
  identity, institution, schedule, registration, contact,
} from '@/data/program';
import {
  generateDossierPDF, DOSSIER_SECTIONS, DOSSIER_PAGE_COUNT,
} from '@/lib/pdfGenerators';

export default function DossierPage() {
  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-white/[0.06] bg-[oklch(0.07_0.015_250/0.9)] backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors text-xs shrink-0">
              <ArrowLeft className="w-3.5 h-3.5" />
              Volver
            </Link>
            <div className="w-px h-4 bg-white/[0.08] shrink-0" />
            <span className="text-sm font-semibold text-white truncate">Dossier</span>
            <span className="hidden sm:inline text-[10px] mono text-zinc-600 px-2 py-0.5 border border-zinc-700/40 rounded-full shrink-0">
              {identity.documentLabel}
            </span>
          </div>
          <motion.button
            onClick={() => generateDossierPDF()}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-colors shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            Generar PDF
          </motion.button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10 space-y-10">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[oklch(0.08_0.025_220)] to-[oklch(0.07_0.02_260)] overflow-hidden p-8 sm:p-12"
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-64 bg-cyan-500/8 blur-3xl rounded-full pointer-events-none" />

          <div className="relative">
            <div className="flex flex-wrap gap-2 mb-5">
              {[
                { label: 'DIAT PUCV', color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400' },
                { label: 'DERECHO PUCV', color: 'border-indigo-500/30 bg-indigo-500/8 text-indigo-400' },
                { label: identity.documentLabel.toUpperCase(), color: 'border-purple-500/30 bg-purple-500/8 text-purple-400' },
              ].map(b => (
                <span key={b.label} className={`text-[10px] mono font-bold px-3 py-1 rounded-full border ${b.color}`}>
                  {b.label}
                </span>
              ))}
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none mb-3">
              Taller de Prompting
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg,#06b6d4,#6366f1)' }}
              >
                Jurídico 3.0
              </span>
            </h1>
            <p className="text-base text-zinc-300 mb-2">{identity.tagline}</p>
            <p className="text-sm text-zinc-500 max-w-2xl leading-relaxed mb-6">
              {schedule.weekdayLabel} · {schedule.time} · {schedule.datesLong}.{' '}
              {institution.programLong}, {institution.faculty}.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <motion.button
                onClick={() => generateDossierPDF()}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                Descargar dossier PDF
              </motion.button>
              <div className="text-xs text-zinc-600 mono">
                {DOSSIER_PAGE_COUNT} páginas A4 · portada + {DOSSIER_SECTIONS.length} secciones
              </div>
            </div>
          </div>
        </motion.div>

        {/* Specs strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { val: String(DOSSIER_SECTIONS.length), label: 'secciones editoriales' },
            { val: String(DOSSIER_PAGE_COUNT), label: 'páginas A4' },
            { val: '3', label: 'sesiones documentadas' },
            { val: 'ES', label: 'Español · Chile' },
          ].map(({ val, label }) => (
            <div key={label} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 text-center">
              <div className="text-xl font-bold mono text-cyan-400">{val}</div>
              <div className="text-xs text-zinc-600 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Contents table */}
        <div className="space-y-3">
          <div className="text-[10px] mono font-bold text-zinc-600 uppercase tracking-widest">
            Contenido del documento
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-4 p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <div className="w-14 flex items-center justify-center shrink-0">
                <span className="text-[10px] mono font-bold text-zinc-700">—</span>
              </div>
              <div className="w-px h-6 bg-white/[0.05] shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-zinc-300">Portada</div>
                <div className="text-xs text-zinc-600">
                  Identidad, fechas, horario y adscripción institucional
                </div>
              </div>
            </div>

            {DOSSIER_SECTIONS.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-cyan-500/20 hover:bg-cyan-500/5 transition-all group"
              >
                <div className="w-14 flex items-center justify-center shrink-0">
                  <span className="text-[10px] mono font-bold text-zinc-700 group-hover:text-cyan-600 transition-colors">
                    {s.num}
                  </span>
                </div>
                <div className="w-px h-6 bg-white/[0.05] shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors">
                    {s.title}
                  </div>
                  <div className="text-xs text-zinc-600">{s.desc}</div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-cyan-500 transition-colors shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Usage note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl border border-indigo-500/15 bg-indigo-500/5 p-4"
        >
          <p className="text-xs text-zinc-400 leading-relaxed">
            <span className="text-indigo-400 font-semibold">Uso:</span>{' '}
            el botón genera y descarga el PDF directamente ({DOSSIER_PAGE_COUNT} páginas A4, formato
            vertical). Está pensado para difusión académica, correo institucional y respaldo ante
            unidades de la Universidad. Consultas e inscripción:{' '}
            <a href={`mailto:${contact.email}`} className="text-cyan-400 hover:text-cyan-300 transition-colors">
              {contact.email}
            </a>
            . {registration.note}.
          </p>
        </motion.div>

      </div>
    </div>
  );
}
