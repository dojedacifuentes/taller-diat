'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Download, ArrowLeft, FileText, Layers, Zap,
  Shield, Users, Globe, Target, BookOpen, ChevronRight,
} from 'lucide-react';
import { modules } from '@/data/modules';
import { equipoEjecutor } from '@/data/team';
import { generateDossierPDF } from '@/lib/pdfGenerators';

// ─────────────────────────────────────────────────────────────────────────────
// PREVIEW PAGE
// ─────────────────────────────────────────────────────────────────────────────
const sections = [
  { num: '01', title: 'Contexto Editorial', desc: 'El derecho en la era de la IA generativa', icon: <BookOpen className="w-4 h-4" /> },
  { num: '02', title: 'Diagnóstico & Estadísticas', desc: 'Datos WEF · Thomson Reuters · McKinsey · Stanford', icon: <Target className="w-4 h-4" /> },
  { num: '03', title: 'Nuevas Competencias', desc: '9 competencias del abogado digital', icon: <Zap className="w-4 h-4" /> },
  { num: '04–06', title: 'Los 3 Módulos', desc: 'Blueprint completo · Timeline · Herramientas', icon: <Layers className="w-4 h-4" /> },
  { num: '07', title: 'LexPrompt Architect', desc: '7 pasos · 8 capas de protección · Multi-export', icon: <FileText className="w-4 h-4" /> },
  { num: '08', title: 'Toolkit IA Jurídica', desc: 'Tabla comparativa · 5 plataformas + legaltech', icon: <Globe className="w-4 h-4" /> },
  { num: '09', title: 'Workflows Jurídicos', desc: '3 flujos multi-IA probados', icon: <ChevronRight className="w-4 h-4" /> },
  { num: '10', title: 'Riesgos & Desafíos', desc: 'Alucinaciones · Confidencialidad · Responsabilidad', icon: <Shield className="w-4 h-4" /> },
  { num: '11–13', title: 'Resultados · Equipo · CTA', desc: 'Certificación · Autoridades · Inscripción', icon: <Users className="w-4 h-4" /> },
];

export default function DossierPage() {
  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-white/[0.06] bg-[oklch(0.07_0.015_250/0.9)] backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors text-xs">
              <ArrowLeft className="w-3.5 h-3.5" />
              Volver
            </Link>
            <div className="w-px h-4 bg-white/[0.08]" />
            <span className="text-sm font-semibold text-white">Dossier DIAT 2026</span>
            <span className="hidden sm:inline text-[10px] mono text-zinc-600 px-2 py-0.5 border border-zinc-700/40 rounded-full">
              Documento editorial premium
            </span>
          </div>
          <motion.button
            onClick={() => generateDossierPDF(modules, equipoEjecutor)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Generar Dossier PDF
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
          {/* grid bg */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
          {/* glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-64 bg-cyan-500/8 blur-3xl rounded-full pointer-events-none" />

          <div className="relative">
            {/* badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              {[
                { label: 'DIAT', color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400' },
                { label: 'FD · PUCV', color: 'border-indigo-500/30 bg-indigo-500/8 text-indigo-400' },
                { label: 'VCM', color: 'border-purple-500/30 bg-purple-500/8 text-purple-400' },
              ].map(b => (
                <span key={b.label} className={`text-[10px] mono font-bold px-3 py-1 rounded-full border ${b.color}`}>
                  {b.label}
                </span>
              ))}
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none mb-3">
              DIAT Prompting Hub
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg,#06b6d4,#6366f1)' }}
              >
                Dossier 2026
              </span>
            </h1>
            <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed mb-6">
              IA Jurídica Aplicada, Prompt Engineering y Nuevas Competencias Digitales para el Derecho.{' '}
              <span className="text-zinc-200 font-medium">Documento editorial premium</span>{' '}
              para difusión académica, LinkedIn, correo institucional y respaldo institucional.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <motion.button
                onClick={() => generateDossierPDF(modules, equipoEjecutor)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                Generar y abrir Dossier PDF
              </motion.button>
              <div className="text-xs text-zinc-600 mono">
                ~13 páginas · A4 · Cyberpunk dark
              </div>
            </div>
          </div>
        </motion.div>

        {/* Specs strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { val: '13', label: 'secciones editoriales' },
            { val: 'A4', label: 'vertical · print-ready' },
            { val: 'Dark', label: 'cyberpunk minimalista' },
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
            {sections.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-cyan-500/20 hover:bg-cyan-500/5 transition-all group"
              >
                <div className="w-14 h-8 flex items-center justify-center shrink-0">
                  <span className="text-[10px] mono font-bold text-zinc-700 group-hover:text-cyan-600 transition-colors">{s.num}</span>
                </div>
                <div className="w-px h-6 bg-white/[0.05] shrink-0" />
                <div className="text-zinc-500 group-hover:text-cyan-500 transition-colors shrink-0">
                  {s.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors">{s.title}</div>
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
            <span className="text-indigo-400 font-semibold">Instrucciones:</span>{' '}
            Haz clic en &ldquo;Generar Dossier PDF&rdquo;. Se abrirá una nueva ventana con el documento completo.
            Usa{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.07] border border-white/[0.1] text-zinc-400 text-[10px]">Ctrl+P</kbd>{' '}
            → &ldquo;Guardar como PDF&rdquo; para descargarlo. Activa{' '}
            <strong className="text-zinc-300">Gráficos de fondo</strong>{' '}
            para que salgan los fondos oscuros. Optimizado para A4, móvil y LinkedIn.
          </p>
        </motion.div>

      </div>
    </div>
  );
}
