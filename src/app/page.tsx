'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight, Zap, Layers, Rocket, Wrench, ChevronDown,
  Shield, Brain, Bot, FileText, CheckCircle2, Circle,
  Mail, Building2, GraduationCap, Scale, Cpu, Globe, Download,
} from 'lucide-react';
import { InstitutionalLogoRow } from '@/components/common/InstitutionalLogos';
import { equipoEjecutor } from '@/data/team';
import { modules } from '@/data/modules';
import { useCountdown } from '@/hooks/useCountdown';
import { generateDossierPDF } from '@/lib/pdfGenerators';

const DIAT_EMAIL = 'programadiat@pucv.cl';
const DIAT_SUBJECT = 'Interés en taller de IA jurídica y prompting DIAT';
const DIAT_BODY = `Hola Programa DIAT:\n\nQuisiera reservar un cupo y recibir más información sobre el taller de IA jurídica y prompting avanzado que se realizará durante septiembre.\n\nNombre:\nCarrera / profesión:\nCorreo:\nTeléfono (opcional):\nComentarios:\n\nMuchas gracias.`;
const MAILTO_RESERVA = `mailto:${DIAT_EMAIL}?subject=${encodeURIComponent(DIAT_SUBJECT)}&body=${encodeURIComponent(DIAT_BODY)}`;
const GMAIL_RESERVA = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(DIAT_EMAIL)}&su=${encodeURIComponent(DIAT_SUBJECT)}&body=${encodeURIComponent(DIAT_BODY)}`;

const MODULE1_DATE = '2026-09-08T09:00:00';

const reasons = [
  {
    emoji: '🗣️',
    title: 'Hablarás el idioma de las máquinas',
    desc: 'Prompting estructurado, técnicas avanzadas, control de outputs. La IA hará lo que tú quieras.',
    color: 'border-cyan-500/25 bg-cyan-500/5',
    accent: 'text-cyan-400',
  },
  {
    emoji: '⚡',
    title: 'Producirás documentos en minutos',
    desc: 'Contratos, demandas, dictámenes, memorandos. Lo que tardaba horas, en minutos con calidad profesional.',
    color: 'border-indigo-500/25 bg-indigo-500/5',
    accent: 'text-indigo-400',
  },
  {
    emoji: '🚀',
    title: 'Estarás donde va el derecho',
    desc: 'Harvey AI, Clio, Thomson Reuters AI. El ecosistema legaltech explota. Tú llegas preparado.',
    color: 'border-purple-500/25 bg-purple-500/5',
    accent: 'text-purple-400',
  },
];

const spoilers = [
  {
    mod: 'M1',
    color: 'border-cyan-500/20 bg-cyan-500/5',
    accent: 'text-cyan-400',
    items: [
      'Tu biblioteca de prompts jurídicos fundamentales',
      'Checklist de verificación post-IA que usarás siempre',
      '5 prompts construidos en vivo con casos chilenos reales',
    ],
  },
  {
    mod: 'M2',
    color: 'border-indigo-500/20 bg-indigo-500/5',
    accent: 'text-indigo-400',
    items: [
      'Expediente jurídico completo generado con IA supervisada',
      'Flujo Perplexity → NotebookLM → Claude documentado',
      'Dominio de Claude Projects para análisis de contratos',
    ],
  },
  {
    mod: 'M3',
    color: 'border-purple-500/20 bg-purple-500/5',
    accent: 'text-purple-400',
    items: [
      'Tu propio agente jurídico con system prompt de producción',
      'Tu agente jurídico con system prompt de producción listo',
      'Certificación institucional PUCV · Facultad de Derecho',
    ],
  },
];

const features = [
  { icon: Layers, href: '/modulos', label: 'Ver los 3 módulos', desc: 'La ruta completa de aprendizaje' },
  { icon: Zap, href: '/prompt-lab', label: 'LexPrompt Architect', desc: 'Constructor 7 pasos + PDF' },
  { icon: Rocket, href: '/flashcards', label: 'Aprende con flashcards', desc: '30 cartas de IA jurídica' },
  { icon: Wrench, href: '/toolkit', label: 'Toolkit multi-IA', desc: 'Flujos y guías rápidas' },
];

const promptLabPreviewSteps = [
  { num: '01', label: 'Perfil', desc: 'Estudiante, abogado, académico…', icon: '🎓' },
  { num: '02', label: 'Finalidad', desc: 'Redactar, analizar, litigar…', icon: '📝' },
  { num: '03', label: 'Área', desc: 'Civil, penal, laboral, tech…', icon: '⚖️' },
  { num: '04', label: 'Profundidad', desc: 'Rápido → Litigación avanzada', icon: '📊' },
  { num: '05', label: 'IA objetivo', desc: 'Claude, ChatGPT, Gemini…', icon: '🤖' },
  { num: '06', label: 'Formato', desc: 'Informe, checklist, tabla…', icon: '🗂️' },
  { num: '07', label: 'Protecciones', desc: 'Anti-alucin. · Ciberseg. · Fuentes', icon: '🛡️' },
];

function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-cyan-500/30 bg-cyan-500/8 flex items-center justify-center glow-cyan">
          <span className="text-2xl sm:text-3xl font-bold text-cyan-200 mono tabular-nums">
            {String(value).padStart(2, '0')}
          </span>
        </div>
        <div className="absolute inset-0 rounded-2xl border border-cyan-400/10 animate-pulse" />
      </div>
      <span className="text-[10px] text-zinc-500 uppercase tracking-widest mono">{label}</span>
    </div>
  );
}

function SpoilerCard({ mod, color, accent, items }: typeof spoilers[0]) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-xl border p-4 ${color}`}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className={`text-xs font-black mono ${accent}`}>{mod}</span>
          <span className="text-xs text-zinc-400 font-medium">
            {open ? 'Ocultar' : '¿Qué construirás?'}
          </span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-zinc-500" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-2">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </div>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}


export default function LandingPage() {
  const cd = useCountdown(MODULE1_DATE);

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 lg:py-12 space-y-16">

      {/* ── HERO ─────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-8"
      >
        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/8 text-xs text-cyan-400 font-semibold mono tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Programa DIAT · Facultad de Derecho PUCV
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/20 bg-yellow-500/5 text-xs text-yellow-400 font-medium mono">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            Septiembre 2026 · Fechas tentativas
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            <span className="text-white">Entrena las habilidades</span>{' '}
            <br className="hidden sm:block" />
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, oklch(0.71 0.17 200) 0%, oklch(0.55 0.22 264) 100%)' }}
            >
              jurídicas
            </span>{' '}
            <span className="text-white">que la IA exige.</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Programa de formación aplicada en inteligencia artificial jurídica,
            prompting avanzado y nuevas competencias digitales para el ejercicio legal.
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            6 horas · 3 módulos · 7 plataformas IA · Certificación institucional PUCV
          </p>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="space-y-4"
        >
          <div className="text-xs text-zinc-500 uppercase tracking-widest mono">
            Comienza en
          </div>
          <div className="flex items-end justify-center gap-3 sm:gap-4">
            <CountdownBlock value={cd.days} label="días" />
            <span className="text-zinc-600 text-3xl font-bold pb-7">:</span>
            <CountdownBlock value={cd.hours} label="horas" />
            <span className="text-zinc-600 text-3xl font-bold pb-7">:</span>
            <CountdownBlock value={cd.minutes} label="min" />
            <span className="text-zinc-600 text-3xl font-bold pb-7">:</span>
            <CountdownBlock value={cd.seconds} label="seg" />
          </div>
          <div className="text-xs text-zinc-600 mono">Módulo 1 · 8 de septiembre 2026 · PUCV Derecho · Valparaíso · <span className="text-yellow-600">Fechas tentativas</span></div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap"
        >
          <a href={GMAIL_RESERVA} target="_blank" rel="noopener noreferrer">
            <motion.button
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-black bg-cyan-400 hover:bg-cyan-300 transition-colors glow-cyan"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Mail className="w-4 h-4" />
              Reservar cupo
              <span className="w-1.5 h-1.5 rounded-full bg-black/30 animate-pulse" />
            </motion.button>
          </a>
          <Link href="/prompt-lab">
            <motion.button
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-cyan-300 border border-cyan-500/30 bg-cyan-500/8 hover:bg-cyan-500/15 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <Zap className="w-4 h-4" />
              Abrir Prompt Lab
            </motion.button>
          </Link>
          <Link href="/modulos">
            <motion.button
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-zinc-300 border border-white/10 hover:border-white/20 hover:bg-white/[0.04] transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              Ver módulos
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
          <motion.button
            onClick={() => generateDossierPDF(modules, equipoEjecutor)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm text-cyan-300 border border-cyan-500/25 bg-cyan-500/8 hover:border-cyan-500/40 hover:bg-cyan-500/15 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <Download className="w-4 h-4" />
            Descargar Dossier PDF
          </motion.button>
        </motion.div>
      </motion.section>

      {/* ── PROMPT LAB HERO ──────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[oklch(0.08_0.02_200/0.9)] to-[oklch(0.08_0.015_250/0.8)] overflow-hidden p-6 sm:p-8"
      >
        <div className="absolute inset-0 grid-bg-fine opacity-20" />
        <div className="relative">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left */}
            <div className="flex-1 space-y-5">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-cyan-400" />
                </span>
                <div>
                  <div className="text-xs text-cyan-500 font-bold uppercase tracking-widest mono">Feature principal</div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">LexPrompt Architect</h2>
                </div>
              </div>

              <p className="text-sm text-zinc-400 leading-relaxed">
                El generador de prompts jurídicos más completo en español. 7 pasos, 8 capas de protección
                (ciberseguridad, anti-alucinaciones, fuentes chilenas verificadas).
                <span className="text-zinc-200"> Descarga tu prompt en PDF, TXT o cópialo directo a Claude, ChatGPT o Gemini.</span>
              </p>

              <div className="flex flex-wrap gap-2">
                {[
                  { icon: <Shield className="w-3 h-3" />, label: 'Anti-alucinaciones', color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/8' },
                  { icon: <Brain className="w-3 h-3" />, label: 'Fuentes chilenas', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/8' },
                  { icon: <FileText className="w-3 h-3" />, label: 'Export PDF/TXT/MD', color: 'text-purple-400 border-purple-500/20 bg-purple-500/8' },
                  { icon: <Bot className="w-3 h-3" />, label: 'Claude · GPT · Gemini', color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/8' },
                ].map(b => (
                  <span key={b.label} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${b.color}`}>
                    {b.icon} {b.label}
                  </span>
                ))}
              </div>

              <Link href="/prompt-lab">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm transition-colors glow-cyan"
                >
                  <Zap className="w-4 h-4" /> Construir mi prompt ahora
                </motion.button>
              </Link>
            </div>

            {/* Right — step preview */}
            <div className="flex-1 max-w-xs mx-auto lg:mx-0">
              <div className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium mb-3">
                Árbol de decisión — 7 pasos
              </div>
              <div className="space-y-1.5">
                {promptLabPreviewSteps.map((s, i) => (
                  <motion.div
                    key={s.num}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg border border-white/[0.06] bg-white/[0.02]"
                  >
                    <span className="text-[10px] mono text-zinc-700 w-5 shrink-0">{s.num}</span>
                    <span className="text-base shrink-0">{s.icon}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-zinc-300">{s.label}</div>
                      <div className="text-[10px] text-zinc-600 truncate">{s.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── STATS STRIP ──────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          { value: '6', label: 'horas de formación' },
          { value: '3', label: 'módulos especializados' },
          { value: '7', label: 'plataformas IA' },
          { value: 'Sep', label: '2026 · Valparaíso' },
        ].map(({ value, label }) => (
          <div key={label} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 text-center">
            <div className="text-2xl font-bold text-white mono">{value}</div>
            <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
          </div>
        ))}
      </motion.section>

      {/* ── LO QUE CONSTRUIRÁS ───────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-5"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Lo que construirás</h2>
          <p className="text-sm text-zinc-500 mt-1">
            Cada módulo termina con algo real y tuyo. Expande para ver el spoiler.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {spoilers.map(s => (
            <SpoilerCard key={s.mod} {...s} />
          ))}
        </div>
      </motion.section>

      {/* ── WHY ATTEND ───────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-5"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">¿Por qué DIAT?</h2>
          <p className="text-sm text-zinc-500 mt-1">Porque el futuro del derecho se construye ahora, no "cuando haya tiempo".</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {reasons.map(({ emoji, title, desc, color, accent }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-xl border p-5 ${color}`}
            >
              <div className="text-3xl mb-3">{emoji}</div>
              <h3 className={`font-semibold text-sm mb-2 ${accent}`}>{title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── MODULES PREVIEW ──────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Los 3 módulos</h2>
          <Link href="/modulos" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors">
            Ver detalle <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-3">
          {modules.map((mod, i) => (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]"
            >
              <div className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center font-bold mono text-sm shrink-0 text-zinc-500">
                {mod.id}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-zinc-300">{mod.title}</div>
                <div className="text-xs text-zinc-600 mt-0.5">{mod.displayDate} · {mod.duration}</div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <span className="text-[10px] mono text-yellow-500 border border-yellow-500/20 bg-yellow-500/8 px-2 py-0.5 rounded-md">
                  PRÓXIMAMENTE
                </span>
                <Circle className="w-4 h-4 text-zinc-600" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── FEATURES GRID ────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-5"
      >
        <h2 className="text-2xl font-bold text-white text-center">Explora la plataforma</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map(({ icon: Icon, href, label, desc }) => (
            <Link key={href} href={href}>
              <motion.div
                className="group flex items-center gap-4 p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-cyan-500/25 hover:bg-cyan-500/5 transition-all"
                whileHover={{ y: -2 }}
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.07] group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 flex items-center justify-center transition-all shrink-0">
                  <Icon className="w-5 h-5 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-zinc-200 group-hover:text-white transition-colors">{label}</div>
                  <div className="text-xs text-zinc-600">{desc}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-cyan-500 ml-auto transition-colors" />
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* ── APPS LEGALES CON IA ──────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-5"
      >
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-white">El ecosistema legaltech</h2>
          <p className="text-sm text-zinc-500">
            Categorías reales del mercado. En M3 aprenderás a evaluar y usar estas herramientas con criterio profesional.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { icon: <Scale className="w-5 h-5" />, title: 'Asistente de litigios', desc: 'Análisis de expedientes, argumentarios automáticos', color: 'border-cyan-500/20 bg-cyan-500/5', accent: 'text-cyan-400' },
            { icon: <FileText className="w-5 h-5" />, title: 'Generador de contratos', desc: 'Redacción y revisión de documentos contractuales', color: 'border-indigo-500/20 bg-indigo-500/5', accent: 'text-indigo-400' },
            { icon: <Brain className="w-5 h-5" />, title: 'Investigador jurídico', desc: 'Síntesis de jurisprudencia y doctrina con fuentes', color: 'border-purple-500/20 bg-purple-500/5', accent: 'text-purple-400' },
            { icon: <Shield className="w-5 h-5" />, title: 'Auditor de compliance', desc: 'Revisión normativa automatizada para empresas', color: 'border-emerald-500/20 bg-emerald-500/5', accent: 'text-emerald-400' },
            { icon: <GraduationCap className="w-5 h-5" />, title: 'Tutor legal IA', desc: 'Formación y preparación para exámenes de derecho', color: 'border-yellow-500/20 bg-yellow-500/5', accent: 'text-yellow-400' },
            { icon: <Globe className="w-5 h-5" />, title: 'Chatbot jurídico', desc: 'Orientación legal ciudadana de primer nivel', color: 'border-orange-500/20 bg-orange-500/5', accent: 'text-orange-400' },
          ].map(({ icon, title, desc, color, accent }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-xl border p-4 space-y-2 ${color}`}
            >
              <div className={accent}>{icon}</div>
              <div className={`text-sm font-semibold ${accent}`}>{title}</div>
              <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center">
          <span className="text-xs text-zinc-600 italic">
            Septiembre 2026 · Facultad de Derecho PUCV · Fechas tentativas
          </span>
        </div>
      </motion.section>

      {/* ── INSTITUTIONAL BACKING ────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 sm:p-8 space-y-5"
      >
        <div className="text-center space-y-1">
          <div className="text-[10px] text-zinc-600 uppercase tracking-widest mono font-medium">Respaldo institucional</div>
          <h2 className="text-lg font-bold text-white">Actividad organizada por</h2>
        </div>
        <div className="flex justify-center">
          <InstitutionalLogoRow size="md" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {[
            {
              icon: <Building2 className="w-4 h-4" />,
              label: 'Facultad de Derecho',
              sub: 'Pontificia Universidad Católica de Valparaíso',
              color: 'text-cyan-400',
            },
            {
              icon: <Cpu className="w-4 h-4" />,
              label: 'Programa DIAT',
              sub: 'Derecho, IA y Tecnología · Formación aplicada',
              color: 'text-indigo-400',
            },
            {
              icon: <Globe className="w-4 h-4" />,
              label: 'Vinculación con el Medio',
              sub: 'PUCV · Transferencia de conocimiento a la sociedad',
              color: 'text-purple-400',
            },
          ].map(({ icon, label, sub, color }) => (
            <div key={label} className="text-center space-y-1">
              <div className={`flex justify-center mb-1 ${color}`}>{icon}</div>
              <div className={`text-sm font-semibold ${color}`}>{label}</div>
              <div className="text-[11px] text-zinc-600 leading-relaxed">{sub}</div>
            </div>
          ))}
        </div>
        <div className="text-center pt-2">
          <p className="text-xs text-zinc-600">
            Director del Taller:{' '}
            <span className="text-zinc-400 font-medium">Dr. Adolfo Silva Walbaum</span>
            {' '}· Bajo la dirección de la Escuela de Derecho PUCV
          </p>
        </div>
      </motion.section>

      {/* ── BOTTOM CTA ───────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/8 to-indigo-500/5 overflow-hidden p-8 text-center"
      >
        <div className="absolute inset-0 grid-bg-fine opacity-30" />
        <div className="relative space-y-4">
          <div className="text-2xl font-bold text-white">Tu cupo en el Programa DIAT 2026</div>
          <p className="text-zinc-400 text-sm max-w-md mx-auto">
            Programa DIAT · Facultad de Derecho PUCV. Formación práctica en IA jurídica con certificación institucional.
          </p>
          <p className="text-xs text-zinc-600 italic">
            "El futuro llega para todos. La diferencia es quién llega preparado."
          </p>
          <p className="text-[11px] text-zinc-600 mono">
            8 · 15 · 22 Septiembre 2026 · Fechas tentativas · Cupos limitados
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-2">
            <a href={GMAIL_RESERVA} target="_blank" rel="noopener noreferrer">
              <motion.button
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-black bg-cyan-400 hover:bg-cyan-300 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Mail className="w-4 h-4" />
                Reservar cupo ahora
              </motion.button>
            </a>
            <Link href="/modulos">
              <motion.button
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-zinc-300 border border-white/10 hover:border-white/20 hover:bg-white/[0.04] transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Ver programa completo <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.section>

    </div>
  );
}
