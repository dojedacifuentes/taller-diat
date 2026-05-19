'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap, Layers, Rocket, Wrench, CheckCircle2, Circle } from 'lucide-react';
import { useCountdown } from '@/hooks/useCountdown';
import { modules } from '@/data/modules';

const MODULE1_DATE = '2026-09-04T09:00:00';

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

const stats = [
  { value: '27', label: 'horas de formación' },
  { value: '3', label: 'módulos especializados' },
  { value: '7', label: 'plataformas IA' },
  { value: 'Sep', label: '2026 · Valparaíso' },
];

const features = [
  { icon: Layers, href: '/modulos', label: 'Ver los 3 módulos', desc: 'La ruta completa de aprendizaje' },
  { icon: Zap, href: '/prompt-lab', label: 'Construye tu prompt', desc: 'Generador + descarga PDF' },
  { icon: Rocket, href: '/flashcards', label: 'Aprende con flashcards', desc: '30 cartas de IA jurídica' },
  { icon: Wrench, href: '/toolkit', label: 'Toolkit multi-IA', desc: 'Flujos y guías rápidas' },
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
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 bg-red-500/8 text-xs text-red-400 font-semibold mono tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            Inscripciones abiertas · PUCV · Sep 2026
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            <span className="text-white">El Derecho que no</span>{' '}
            <br className="hidden sm:block" />
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, oklch(0.71 0.17 200) 0%, oklch(0.55 0.22 264) 100%)' }}
            >
              entiende IA,
            </span>{' '}
            <br className="hidden sm:block" />
            <span className="text-white">no puede defenderlo.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            27 horas. 3 módulos. 7 herramientas. Una sola pregunta:{' '}
            <span className="text-zinc-200 font-medium">¿cuándo te inscribes?</span>
          </p>
          <p className="mt-2 text-sm text-zinc-600 italic">
            (No, la IA no va a quitarte el trabajo. Un abogado que usa IA, sí.)
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
          <div className="text-xs text-zinc-600 mono">Módulo 1 · 4 de septiembre 2026 · 09:00 hrs</div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href="/modulos">
            <motion.button
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-black bg-cyan-400 hover:bg-cyan-300 transition-colors glow-cyan"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Ver el programa completo
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
          <Link href="/prompt-lab">
            <motion.button
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-zinc-300 border border-white/10 hover:border-white/20 hover:bg-white/[0.04] transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              Probar el Prompt Lab
            </motion.button>
          </Link>
        </motion.div>
      </motion.section>

      {/* ── STATS STRIP ──────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {stats.map(({ value, label }) => (
          <div key={label} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 text-center">
            <div className="text-2xl font-bold text-white mono">{value}</div>
            <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
          </div>
        ))}
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
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                mod.status === 'active' ? 'border-cyan-500/30 bg-cyan-500/6' :
                mod.status === 'completed' ? 'border-emerald-500/20 bg-emerald-500/4' :
                'border-white/[0.06] bg-white/[0.02]'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold mono text-sm shrink-0 ${
                mod.status === 'active' ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300' :
                mod.status === 'completed' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
                'border-white/10 bg-white/[0.04] text-zinc-500'
              }`}>
                {mod.id}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-white">{mod.title}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{mod.date} · {mod.duration}</div>
              </div>
              <div className="shrink-0">
                {mod.status === 'completed' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> :
                 mod.status === 'active' ? <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse block" /> :
                 <Circle className="w-5 h-5 text-zinc-600" />}
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

      {/* ── BOTTOM CTA ───────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/8 to-indigo-500/5 overflow-hidden p-8 text-center"
      >
        <div className="absolute inset-0 grid-bg-fine opacity-30" />
        <div className="relative space-y-4">
          <div className="text-2xl font-bold text-white">
            ¿Sigues leyendo?
          </div>
          <p className="text-zinc-400 text-sm max-w-md mx-auto">
            Probablemente ya estás convencido. El Programa DIAT de la Facultad de Derecho PUCV te espera en septiembre.
          </p>
          <p className="text-xs text-zinc-600 italic">
            "El futuro llega para todos. La diferencia es quién llega preparado."
          </p>
          <Link href="/modulos">
            <motion.button
              className="mt-2 flex items-center gap-2 mx-auto px-6 py-3 rounded-xl font-semibold text-sm text-black bg-cyan-400 hover:bg-cyan-300 transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Ver programa completo <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </motion.section>

    </div>
  );
}
