'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  CheckCircle2,
  Copy,
  Layers,
  Lock,
  RotateCcw,
  Shield,
  Target,
  Zap,
} from 'lucide-react';
import {
  compatibilityGroups,
  defaultCompatibilityInput,
  evaluateCompatibility,
  type CompatibilityField,
  type CompatibilityInput,
} from '@/data/compatibility';

const EMAIL = 'programadiat@pucv.cl';

function ScoreRing({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative h-36 w-36 rounded-full p-1.5"
        style={{
          background: `conic-gradient(oklch(0.71 0.17 200) ${value * 3.6}deg, oklch(1 0 0 / 0.06) 0deg)`,
        }}
      >
        <div className="flex h-full w-full flex-col items-center justify-center rounded-full border border-white/[0.08] bg-[oklch(0.075_0.016_250)]">
          <span className="mono text-4xl font-black text-cyan-300">{value}%</span>
          <span className="mt-1 text-[10px] uppercase tracking-widest text-zinc-600">{label}</span>
        </div>
      </div>
    </div>
  );
}

function Meter({ label, value, color = 'from-cyan-500 to-indigo-400' }: { label: string; value: number; color?: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-zinc-400">{label}</span>
        <span className="mono text-xs font-bold text-zinc-500">{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
        />
      </div>
    </div>
  );
}

function ResultPanel({ input }: { input: CompatibilityInput }) {
  const result = useMemo(() => evaluateCompatibility(input), [input]);
  const [copied, setCopied] = useState(false);

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(result.summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const subject = encodeURIComponent('Resultado de compatibilidad DIAT');
  const body = encodeURIComponent(`Hola Programa DIAT:\n\nComparto mi diagnostico de compatibilidad:\n\n${result.summary}\n\nQuisiera recibir orientacion sobre cupos y ruta sugerida.\n\nNombre:\nCorreo:\nComentarios:\n`);
  const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(EMAIL)}&su=${subject}&body=${body}`;

  return (
    <aside className="lg:sticky lg:top-20 space-y-4">
      <motion.div
        layout
        className="overflow-hidden rounded-2xl border border-cyan-500/25 bg-[oklch(0.09_0.018_250/0.86)] shadow-2xl shadow-cyan-500/5 backdrop-blur-xl"
      >
        <div className="h-px bg-gradient-to-r from-cyan-500 via-indigo-500 to-transparent" />
        <div className="space-y-6 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mono text-[10px] font-bold uppercase tracking-widest text-cyan-400/70">
                Diagnostico activo
              </div>
              <h2 className="mt-1 text-xl font-black text-white">{result.fitLevel}</h2>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">{result.fitTone}</p>
            </div>
            <div className="rounded-xl border border-cyan-500/25 bg-cyan-500/10 p-2 text-cyan-300">
              <Target className="h-5 w-5" />
            </div>
          </div>

          <ScoreRing value={result.fitScore} label="compatibilidad" />

          <div className="space-y-4">
            <Meter label="Compatibilidad con el taller" value={result.fitScore} />
            <Meter label="Potencial de automatizacion" value={result.automationScore} color="from-indigo-500 to-purple-400" />
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
            <div className="mb-1 flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span className="text-sm font-bold text-zinc-100">{result.primaryModule.shortLabel}</span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-500">{result.primaryModule.focus}</p>
          </div>

          <div className="space-y-2">
            <div className="mono text-[10px] uppercase tracking-widest text-zinc-600">Ruta sugerida</div>
            {result.modules.map(module => (
              <div key={module.id} className="flex items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] mono text-[10px] font-bold text-zinc-500">
                  M{module.id}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold text-zinc-300">{module.shortLabel}</div>
                  <div className="h-1 overflow-hidden rounded-full bg-white/[0.05]">
                    <div className="h-full rounded-full bg-cyan-500/70" style={{ width: `${module.score}%` }} />
                  </div>
                </div>
                <span className="mono w-8 text-right text-[10px] text-zinc-600">{module.score}%</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="mono text-[10px] uppercase tracking-widest text-zinc-600">Herramientas sugeridas</div>
            <div className="flex flex-wrap gap-2">
              {result.tools.map(tool => (
                <span key={tool.id} className="rounded-full border border-cyan-500/15 bg-cyan-500/[0.06] px-2.5 py-1 text-[10px] font-medium text-cyan-300">
                  {tool.label} <span className="mono text-cyan-500/70">{tool.score}%</span>
                </span>
              ))}
            </div>
          </div>

          {result.riskFlags.length > 0 && (
            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/[0.04] p-3">
              <div className="mb-1 flex items-center gap-2 text-xs font-bold text-yellow-400">
                <Shield className="h-3.5 w-3.5" />
                Control recomendado
              </div>
              <p className="text-[11px] leading-relaxed text-yellow-100/60">{result.riskFlags[0]}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={copyResult}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-2.5 text-xs font-bold text-zinc-300 transition-all hover:border-cyan-500/30 hover:text-cyan-300"
            >
              <Copy className="h-3.5 w-3.5" />
              {copied ? 'Resultado copiado' : 'Copiar diagnostico'}
            </button>
            <a
              href={gmailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-black text-black transition-colors hover:bg-cyan-400"
            >
              Enviar a DIAT <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </motion.div>
    </aside>
  );
}

export default function CompatibilityPage() {
  const [input, setInput] = useState<CompatibilityInput>(defaultCompatibilityInput);
  const result = useMemo(() => evaluateCompatibility(input), [input]);

  const selectChoice = (field: CompatibilityField, value: string) => {
    setInput(current => ({ ...current, [field]: value }));
  };

  const reset = () => setInput(defaultCompatibilityInput);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 lg:px-8 lg:py-10">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/[0.08] via-white/[0.02] to-indigo-500/[0.06] p-6 sm:p-8"
      >
        <div className="absolute inset-0 grid-bg-fine opacity-25" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/[0.08] px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_12px_oklch(0.71_0.17_200)]" />
              <span className="mono text-[10px] font-bold uppercase tracking-widest text-cyan-300">
                Verificacion de compatibilidad
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                Mide tu encaje con el Taller DIAT.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
                Un diagnostico rapido para estimar compatibilidad con el programa, potencial de automatizacion
                y ruta de aprendizaje recomendada sin salir de la estetica institucional DIAT.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:w-[420px]">
            {[
              { icon: Target, label: 'Fit DIAT', value: `${result.fitScore}%` },
              { icon: BarChart3, label: 'Automatizacion', value: `${result.automationScore}%` },
              { icon: Layers, label: 'Ruta', value: result.primaryModule.shortLabel },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl border border-white/[0.07] bg-black/20 p-3">
                <Icon className="mb-2 h-4 w-4 text-cyan-400" />
                <div className="mono text-[10px] uppercase tracking-widest text-zinc-600">{label}</div>
                <div className="mt-1 truncate text-sm font-black text-zinc-100">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="mono text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                Matriz de diagnostico
              </div>
              <h2 className="mt-1 text-xl font-bold text-white">Selecciona el escenario mas cercano</h2>
            </div>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 self-start rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs font-bold text-zinc-500 transition-colors hover:text-zinc-200"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reiniciar
            </button>
          </div>

          {compatibilityGroups.map((group, groupIndex) => (
            <motion.section
              key={group.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.04, duration: 0.28 }}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5"
            >
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/[0.08] mono text-[10px] font-black text-cyan-300">
                  {group.step}
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-100">{group.title}</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-zinc-600">{group.subtitle}</p>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {group.choices.map(choice => {
                  const active = input[group.id] === choice.id;
                  return (
                    <button
                      key={choice.id}
                      onClick={() => selectChoice(group.id, choice.id)}
                      className={`group rounded-xl border p-3 text-left transition-all ${
                        active
                          ? 'border-cyan-500/40 bg-cyan-500/[0.08] shadow-[0_0_24px_oklch(0.71_0.17_200/0.08)]'
                          : 'border-white/[0.06] bg-black/10 hover:border-white/[0.14] hover:bg-white/[0.035]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className={`text-sm font-bold ${active ? 'text-cyan-200' : 'text-zinc-300 group-hover:text-white'}`}>
                            {choice.label}
                          </div>
                          <p className="mt-1 text-[11px] leading-relaxed text-zinc-600">{choice.description}</p>
                        </div>
                        <div className={`mt-0.5 rounded-full border p-1 ${active ? 'border-cyan-500/30 text-cyan-300' : 'border-white/[0.08] text-zinc-700'}`}>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.section>
          ))}

          <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
            <div className="mb-4 flex items-center gap-2">
              <Brain className="h-4 w-4 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Lectura estrategica</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <div className="mono mb-2 text-[10px] uppercase tracking-widest text-zinc-600">Por que encaja</div>
                <ul className="space-y-2">
                  {result.reasons.slice(0, 3).map(item => (
                    <li key={item} className="flex gap-2 text-xs leading-relaxed text-zinc-500">
                      <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mono mb-2 text-[10px] uppercase tracking-widest text-zinc-600">Brechas</div>
                <ul className="space-y-2">
                  {result.gaps.slice(0, 3).map(item => (
                    <li key={item} className="flex gap-2 text-xs leading-relaxed text-zinc-500">
                      <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-yellow-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mono mb-2 text-[10px] uppercase tracking-widest text-zinc-600">Siguiente paso</div>
                <ul className="space-y-2">
                  {result.nextSteps.slice(0, 3).map(item => (
                    <li key={item} className="flex gap-2 text-xs leading-relaxed text-zinc-500">
                      <Bot className="mt-0.5 h-3.5 w-3.5 shrink-0 text-purple-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.05] p-5 sm:flex-row sm:items-center">
            <div>
              <div className="mono text-[10px] font-bold uppercase tracking-widest text-cyan-400/70">
                Llevar resultado al taller
              </div>
              <p className="mt-1 text-sm text-zinc-400">
                Usa este diagnostico para entrar al Prompt Lab con una ruta mas clara.
              </p>
            </div>
            <Link
              href="/prompt-lab"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-black text-black transition-colors hover:bg-cyan-400"
            >
              Abrir Prompt Lab
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </div>

        <ResultPanel input={input} />
      </div>
    </div>
  );
}
