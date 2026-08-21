'use client';
// ─────────────────────────────────────────────────────────────────────────────
// Página de sesión. Una sola implementación para las tres, parametrizada por
// id, porque las tres comparten estructura: objetivo, contenidos, cronograma
// minuto a minuto, reparto 30/70, herramienta, caso, materiales y plan B.
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Wrench, AlertTriangle, ArrowRight, Download } from 'lucide-react';

import { sessions, schedule } from '@/data/program';
import { planFor, splitFor, clockRange, ownerLabels } from '@/data/sessionPlan';
import { casesBySession, caseByCode, troncalCase } from '@/data/cases';
import { promptProgression, privacyNotice } from '@/data/pedagogy';
import { canonicalFlow, flowKindMeta, translationExample, challengeFields } from '@/data/labs';
import { materialsForSession } from '@/data/materials';
import { exitTickets } from '@/data/assessment';
import type { BlockOwner } from '@/lib/types';
import { Shell, SectionHead, Panel, Tag, PrivacyNote, accents, type AccentName } from '@/components/common/Page';

const sessionAccent: Record<number, AccentName> = { 1: 'cyan', 2: 'indigo', 3: 'purple' };

const ownerAccent: Record<BlockOwner, AccentName> = {
  diego: 'cyan',
  relatores: 'emerald',
  equipos: 'amber',
};

/** Herramienta principal que acompaña cada sesión. */
const sessionTools: Record<number, { href: string; label: string; description: string }[]> = {
  1: [
    { href: '/prompt-lab', label: 'Prompt Lab', description: 'Construir el prompt capa por capa.' },
    { href: '/verificacion', label: 'Verificación', description: 'Cazador de alucinaciones y matriz.' },
  ],
  2: [
    { href: '/flujo', label: 'Constructor de flujos', description: 'Las seis casillas y el registro de validación.' },
    { href: '/prompt-lab', label: 'Prompt Lab', description: 'Afinar la instrucción de cada paso.' },
  ],
  3: [
    { href: '/match', label: 'Match Making', description: 'Ficha de desafío y temporizador de pitch.' },
    { href: '/flujo', label: 'Constructor de flujos', description: 'Recuperar el flujo de la sesión 2.' },
  ],
};

export function SessionShell({ id }: { id: number }) {
  const session = sessions.find(s => s.id === id)!;
  const plan = planFor(id);
  const split = splitFor(plan);
  const a = accents[sessionAccent[id]];
  const accent = sessionAccent[id];
  const ticket = exitTickets.find(t => t.session === id)!;
  const sessionCases = casesBySession[id].map(caseByCode).filter(Boolean);
  const mats = materialsForSession(id);

  return (
    <div className="py-8 sm:py-12">
      <Shell>
        {/* ── Encabezado ───────────────────────────────────────────────── */}
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Tag accent={accent}>{session.label}</Tag>
            <Tag accent={accent}>{session.displayDate} de 2026</Tag>
            <Tag accent={accent}>{schedule.time}</Tag>
            <Tag accent={accent}>{schedule.sessionDuration}</Tag>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-white leading-[1.1] max-w-4xl">
            {session.title}
          </h1>

          <p className="mt-4 text-base text-zinc-400 leading-relaxed max-w-3xl">{session.purpose}</p>

          <div className={`mt-6 rounded-xl border ${a.borderStrong} ${a.bgSoft} px-5 py-4`}>
            <div className={`mono text-[10px] font-bold uppercase tracking-[0.2em] ${a.text} mb-1.5`}>
              Al terminar, deberías poder decir
            </div>
            <p className="text-lg text-white font-medium leading-snug">
              «{plan.successCriterion}»
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <a
              href="#cronograma"
              className={`inline-flex items-center gap-2 rounded-lg border ${a.borderStrong} ${a.bg} px-4 py-2.5 text-sm font-semibold ${a.textSoft} hover:brightness-125 transition`}
            >
              <Clock className="w-4 h-4" aria-hidden /> Ver el cronograma
            </a>
            {sessionTools[id].map(t => (
              <Link
                key={t.href}
                href={t.href}
                className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-white/[0.06] transition"
              >
                <Wrench className="w-4 h-4" aria-hidden /> {t.label}
              </Link>
            ))}
            <a
              href="#materiales"
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-white/[0.06] transition"
            >
              <Download className="w-4 h-4" aria-hidden /> Materiales
            </a>
          </div>
        </header>

        {/* ── Idea de la sesión ────────────────────────────────────────── */}
        <section className="mb-14">
          <div className="rounded-xl border-l-2 border-white/20 pl-5 py-1">
            <p className="text-lg sm:text-xl text-zinc-200 leading-snug font-medium">{plan.spine}</p>
          </div>
        </section>

        {/* ── Contenidos ───────────────────────────────────────────────── */}
        <section className="mb-14">
          <SectionHead
            n="01" kicker="Qué se trabaja" accent={accent}
            title="Contenidos de la sesión"
            lead={`Producto de la jornada: ${session.product.toLowerCase()}.`}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {session.contents.map((c, i) => (
              <Panel key={i} className="p-4">
                <div className={`mono text-[10px] font-bold ${a.text} mb-2`}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <p className="text-sm text-zinc-200 leading-relaxed">{c.title}</p>
                {c.items && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {c.items.map(item => (
                      <span
                        key={item}
                        className="mono text-[10px] px-2 py-0.5 rounded border border-white/[0.1] bg-white/[0.03] text-zinc-400"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </Panel>
            ))}
          </div>
        </section>

        {/* ── Bloque específico de cada sesión ─────────────────────────── */}
        <section className="mb-14">
          {id === 1 && <PromptProgressionBlock accent={accent} />}
          {id === 2 && <FlowCanvasBlock accent={accent} />}
          {id === 3 && <TranslationBlock accent={accent} />}
        </section>

        {/* ── Cronograma ───────────────────────────────────────────────── */}
        <section id="cronograma" className="mb-14 scroll-mt-20">
          <SectionHead
            n="02" kicker="Minuto a minuto" accent={accent}
            title="Cronograma de la sesión"
            lead={`${schedule.startTime} a ${schedule.endTime}. Los bloques suman exactamente ${split.total} minutos.`}
          />

          <SplitBar split={split} accent={accent} />

          <ol className="mt-6 space-y-2.5">
            {plan.blocks.map(block => {
              const oa = accents[ownerAccent[block.owner]];
              const minutes = block.to - block.from;
              return (
                <li key={block.from}>
                  <Panel className="p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-5">
                      <div className="shrink-0 sm:w-32">
                        <div className={`mono text-sm font-bold ${oa.text}`}>{clockRange(block)}</div>
                        <div className="mono text-[10px] text-zinc-600 mt-0.5">{minutes} min</div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <h3 className="text-base font-semibold text-white">{block.title}</h3>
                          <span className={`mono text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${oa.border} ${oa.bgSoft} ${oa.text}`}>
                            {ownerLabels[block.owner]}
                          </span>
                          <span className="mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded border border-white/[0.1] text-zinc-500">
                            {block.mode}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed">{block.detail}</p>
                        {(block.needs?.length || block.tool) && (
                          <div className="mt-3 flex flex-wrap items-center gap-1.5">
                            {block.needs?.map(n => (
                              <span
                                key={n}
                                className="mono text-[10px] px-2 py-0.5 rounded border border-white/[0.08] bg-white/[0.02] text-zinc-500"
                              >
                                {n}
                              </span>
                            ))}
                            {block.tool && (
                              <Link
                                href={block.tool}
                                className={`mono text-[10px] px-2 py-0.5 rounded border ${a.border} ${a.bgSoft} ${a.text} inline-flex items-center gap-1 hover:brightness-125`}
                              >
                                {block.tool} <ArrowRight className="w-2.5 h-2.5" aria-hidden />
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Panel>
                </li>
              );
            })}
          </ol>
        </section>

        {/* ── Caso ─────────────────────────────────────────────────────── */}
        <section className="mb-14">
          <SectionHead
            n="03" kicker="Sobre qué se trabaja" accent={accent}
            title="Casos de la sesión"
            lead={`El caso ${troncalCase.code} acompaña las tres jornadas. Los demás están disponibles para equipos que prefieran otra área.`}
          />
          <div className="space-y-3">
            {sessionCases.map(c => c && (
              <Panel key={c.id} accent={c.troncal ? accent : undefined} className="p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`mono text-[10px] font-bold ${c.troncal ? a.text : 'text-zinc-500'}`}>{c.code}</span>
                  <h3 className="text-base font-semibold text-white">{c.title}</h3>
                  {c.troncal && <Tag accent={accent}>Caso troncal</Tag>}
                  <span className="mono text-[10px] text-zinc-600">{c.area}</span>
                  <span className="mono text-[10px] text-zinc-600">· {c.difficulty}</span>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">{c.brief}</p>
                {c.troncal && c.arc && (
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {c.arc.map(step => (
                      <div
                        key={step.session}
                        className={`rounded-lg border p-3 ${step.session === id ? `${a.border} ${a.bgSoft}` : 'border-white/[0.07]'}`}
                      >
                        <div className={`mono text-[9px] font-bold uppercase tracking-widest mb-1 ${step.session === id ? a.text : 'text-zinc-600'}`}>
                          Sesión {step.session}{step.session === id ? ' · hoy' : ''}
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">{step.task}</p>
                      </div>
                    ))}
                  </div>
                )}
                <details className="mt-4 group">
                  <summary className="cursor-pointer text-xs mono uppercase tracking-widest text-zinc-500 hover:text-zinc-300">
                    Fuentes y errores inducidos
                  </summary>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <div>
                      <div className="mono text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                        Fuentes oficiales
                      </div>
                      <ul className="space-y-1.5">
                        {c.sources.map(s => (
                          <li key={s.url} className="text-xs text-zinc-400 leading-relaxed">
                            <a
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:underline"
                            >
                              {s.label}
                            </a>
                            {s.note && <span className="block text-zinc-600 mt-0.5">{s.note}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="mono text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                        Errores que el caso induce
                      </div>
                      <ul className="space-y-1.5">
                        {c.traps.map(t => (
                          <li key={t} className="text-xs text-zinc-400 leading-relaxed flex gap-2">
                            <span aria-hidden className="text-rose-400 shrink-0">·</span>
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </details>
              </Panel>
            ))}
          </div>
        </section>

        {/* ── Herramientas ─────────────────────────────────────────────── */}
        <section className="mb-14">
          <SectionHead
            n="04" kicker="Con qué se trabaja" accent={accent}
            title="Herramientas de la sesión"
            lead="Funcionan en el navegador, sin cuenta y sin enviar nada a ningún servidor."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {sessionTools[id].map(t => (
              <Link key={t.href} href={t.href} className="group">
                <Panel className="p-4 h-full transition hover:border-white/20">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-white">{t.label}</h3>
                    <ArrowRight className={`w-4 h-4 ${a.text} transition group-hover:translate-x-0.5`} aria-hidden />
                  </div>
                  <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">{t.description}</p>
                </Panel>
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <PrivacyNote text={privacyNotice} />
          </div>
        </section>

        {/* ── Materiales ───────────────────────────────────────────────── */}
        <section id="materiales" className="mb-14 scroll-mt-20">
          <SectionHead
            n="05" kicker="Qué llevarse" accent={accent}
            title="Materiales de la sesión"
            lead="Todos descargables. Las plantillas se generan en el navegador; las presentaciones y guiones son archivos del repositorio."
          />
          <div className="grid gap-2.5 sm:grid-cols-2">
            {mats.map(m => (
              <Link key={m.code} href="/materiales" className="group">
                <Panel className="p-3.5 h-full transition hover:border-white/20">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="mono text-[10px] font-bold text-zinc-600">{m.code}</span>
                        <h3 className="text-sm font-medium text-zinc-200 truncate">{m.title}</h3>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed line-clamp-2">{m.description}</p>
                    </div>
                    <span className="mono text-[9px] shrink-0 px-1.5 py-0.5 rounded border border-white/[0.1] text-zinc-500">
                      {m.format}
                    </span>
                  </div>
                </Panel>
              </Link>
            ))}
          </div>
          <Link
            href="/materiales"
            className={`mt-4 inline-flex items-center gap-2 text-sm font-semibold ${a.text} hover:underline`}
          >
            Ver todos los materiales <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        </section>

        {/* ── Plan B ───────────────────────────────────────────────────── */}
        <section className="mb-14">
          <SectionHead
            n="06" kicker="Si algo falla" accent="amber"
            title="Plan de contingencia"
            lead="La sesión no depende de que todo funcione. Cada escenario tiene una salida escrita de antemano."
          />
          <div className="space-y-2.5">
            {plan.contingencies.map(c => (
              <Panel key={c.when} className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden />
                  <div>
                    <h3 className="text-sm font-semibold text-amber-200/90">{c.when}</h3>
                    <p className="text-sm text-zinc-400 mt-1 leading-relaxed">{c.then}</p>
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        </section>

        {/* ── Cierre ───────────────────────────────────────────────────── */}
        <section>
          <SectionHead
            n="07" kicker="Cierre" accent={accent}
            title="Exit ticket"
            lead={`Sesión ${id} · ${ticket.when}. Tres líneas antes de salir de la sala.`}
          />
          <Panel accent={accent} className="p-5">
            <ul className="space-y-3">
              {ticket.prompts.map((p, i) => (
                <li key={p} className="flex items-start gap-3">
                  <span className={`mono text-xs font-bold ${a.text} shrink-0 mt-0.5`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm text-zinc-300 leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <nav className="mt-8 flex flex-wrap gap-2.5" aria-label="Navegación entre sesiones">
            {sessions.map(s => (
              <Link
                key={s.id}
                href={`/sesiones/${s.id}`}
                aria-current={s.id === id ? 'page' : undefined}
                className={`rounded-lg border px-3.5 py-2 text-xs font-semibold transition ${
                  s.id === id
                    ? `${accents[sessionAccent[s.id]].borderStrong} ${accents[sessionAccent[s.id]].bg} ${accents[sessionAccent[s.id]].textSoft}`
                    : 'border-white/[0.1] text-zinc-400 hover:bg-white/[0.04]'
                }`}
              >
                <span className="mono">{s.displayDateShort}</span> · {s.shortTitle}
              </Link>
            ))}
          </nav>
        </section>
      </Shell>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Barra 30/70
// ─────────────────────────────────────────────────────────────────────────────
function SplitBar({
  split, accent,
}: { split: ReturnType<typeof splitFor>; accent: AccentName }) {
  const a = accents[accent];
  return (
    <Panel className="p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <div className="mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          Reparto del tiempo
        </div>
        <div className="mono text-xs text-zinc-500">
          {split.total} minutos · objetivo 30 / 70
        </div>
      </div>

      <div className="flex h-3 w-full overflow-hidden rounded-full border border-white/[0.08]">
        <div
          className={`${a.dot} opacity-80`}
          style={{ width: `${(split.minutes.diego / split.total) * 100}%` }}
        />
        <div
          className="bg-emerald-500 opacity-80"
          style={{ width: `${(split.minutes.relatores / split.total) * 100}%` }}
        />
        <div
          className="bg-amber-500 opacity-80"
          style={{ width: `${(split.minutes.equipos / split.total) * 100}%` }}
        />
      </div>

      <dl className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <dt className="mono text-[10px] uppercase tracking-widest text-zinc-500">Diego</dt>
          <dd className={`text-lg font-bold ${a.text}`}>
            {split.diego}<span className="text-xs text-zinc-500 font-normal"> min · {split.diegoPct}%</span>
          </dd>
        </div>
        <div>
          <dt className="mono text-[10px] uppercase tracking-widest text-zinc-500">Relatoría</dt>
          <dd className="text-lg font-bold text-emerald-400">
            {split.minutes.relatores}<span className="text-xs text-zinc-500 font-normal"> min</span>
          </dd>
        </div>
        <div>
          <dt className="mono text-[10px] uppercase tracking-widest text-zinc-500">Equipos</dt>
          <dd className="text-lg font-bold text-amber-400">
            {split.minutes.equipos}<span className="text-xs text-zinc-500 font-normal"> min</span>
          </dd>
        </div>
        <div>
          <dt className="mono text-[10px] uppercase tracking-widest text-zinc-500">Facilitado</dt>
          <dd className="text-lg font-bold text-zinc-200">
            {split.facilitated}<span className="text-xs text-zinc-500 font-normal"> min · {split.facilitatedPct}%</span>
          </dd>
        </div>
      </dl>
    </Panel>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sesión 1 · progresión del prompt
// ─────────────────────────────────────────────────────────────────────────────
function PromptProgressionBlock({ accent }: { accent: AccentName }) {
  const [level, setLevel] = useState(0);
  const a = accents[accent];
  const current = promptProgression[level];

  return (
    <>
      <SectionHead
        kicker="Antes y después" accent={accent}
        title="La misma consulta, seis veces"
        lead="No existe el prompt mágico de dos mil palabras. Existe una tarea cada vez mejor especificada. Mueve el nivel y observa qué se añade."
      />

      <div className="flex flex-wrap gap-1.5 mb-4" role="tablist" aria-label="Nivel del prompt">
        {promptProgression.map((p, i) => (
          <button
            key={p.level}
            role="tab"
            aria-selected={i === level}
            onClick={() => setLevel(i)}
            className={`mono text-xs font-bold px-3 py-2 rounded-lg border transition ${
              i === level
                ? `${a.borderStrong} ${a.bg} ${a.textSoft}`
                : 'border-white/[0.1] text-zinc-500 hover:bg-white/[0.04]'
            }`}
          >
            Nivel {p.level}
          </button>
        ))}
      </div>

      <motion.div key={level} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        <Panel accent={accent} className="p-5">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`mono text-[10px] font-bold uppercase tracking-widest ${a.text}`}>
              Nivel {current.level} · {current.label}
            </span>
            {current.adds.map(x => (
              <span key={x} className="mono text-[10px] px-1.5 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/5 text-emerald-400">
                + {x}
              </span>
            ))}
          </div>

          <pre className="mono text-sm text-cyan-300 whitespace-pre-wrap leading-relaxed rounded-lg border border-white/[0.08] bg-black/40 p-4">
            {current.prompt}
          </pre>

          <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
            <span className="text-zinc-500">Qué sigue fallando: </span>{current.problem}
          </p>
        </Panel>
      </motion.div>

      <div className="mt-4">
        <Link
          href="/prompt-lab"
          className={`inline-flex items-center gap-2 text-sm font-semibold ${a.text} hover:underline`}
        >
          Construir el tuyo en el Prompt Lab <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sesión 2 · canvas del flujo
// ─────────────────────────────────────────────────────────────────────────────
function FlowCanvasBlock({ accent }: { accent: AccentName }) {
  const a = accents[accent];
  return (
    <>
      <SectionHead
        kicker="Del prompt al flujo" accent={accent}
        title="Seis casillas, ninguna opcional"
        lead="Una respuesta aislada no se puede auditar. Una secuencia de pasos, sí: cada paso tiene entrada, fuente y alguien que decide."
      />
      <div className="table-scroll pb-2">
        <div className="flex items-stretch gap-2 min-w-max">
          {canonicalFlow.map((step, i) => {
            const meta = flowKindMeta[step.kind];
            const ca = accents[meta.color as AccentName] ?? accents.cyan;
            return (
              <div key={step.kind} className="flex items-center gap-2">
                <div className={`w-44 rounded-xl border ${ca.border} ${ca.bgSoft} p-3.5`}>
                  <div className={`mono text-[9px] font-bold uppercase tracking-widest ${ca.text} mb-1.5`}>
                    {String(i + 1).padStart(2, '0')} · {meta.label}
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">{step.label}</p>
                </div>
                {i < canonicalFlow.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-zinc-700 shrink-0" aria-hidden />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <p className="mt-3 text-xs text-zinc-600">Desliza en horizontal para ver el flujo completo.</p>
      <div className="mt-4">
        <Link href="/flujo" className={`inline-flex items-center gap-2 text-sm font-semibold ${a.text} hover:underline`}>
          Construir tu flujo <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sesión 3 · traducción del problema
// ─────────────────────────────────────────────────────────────────────────────
function TranslationBlock({ accent }: { accent: AccentName }) {
  const a = accents[accent];
  return (
    <>
      <SectionHead
        kicker="El aprendizaje central" accent={accent}
        title="Cómo se traduce un problema jurídico"
        lead="Derecho no viene a programar y la contraparte técnica no viene a decidir qué es jurídicamente correcto. El aprendizaje está justo en el medio."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <Panel accent="rose" className="p-5">
          <div className="mono text-[10px] font-bold uppercase tracking-widest text-rose-400 mb-2.5">
            No sirve
          </div>
          <p className="text-base text-zinc-200 leading-snug font-medium">«{translationExample.bad}»</p>
          <p className="mt-3 text-xs text-zinc-500 leading-relaxed">{translationExample.badWhy}</p>
        </Panel>
        <Panel accent="emerald" className="p-5">
          <div className="mono text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-2.5">
            Sí sirve
          </div>
          <p className="text-base text-zinc-200 leading-snug font-medium">«{translationExample.good}»</p>
          <p className="mt-3 text-xs text-zinc-500 leading-relaxed">{translationExample.goodWhy}</p>
        </Panel>
      </div>

      <div className="mt-5">
        <div className="mono text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2.5">
          Los doce campos de la ficha
        </div>
        <div className="flex flex-wrap gap-1.5">
          {challengeFields.map(f => (
            <span
              key={f.key}
              className={`mono text-[10px] px-2 py-1 rounded border ${f.n === 12 ? `${a.border} ${a.bgSoft} ${a.text}` : 'border-white/[0.1] text-zinc-500'}`}
            >
              {String(f.n).padStart(2, '0')} {f.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <Link href="/match" className={`inline-flex items-center gap-2 text-sm font-semibold ${a.text} hover:underline`}>
          Abrir el canvas de Match Making <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      </div>
    </>
  );
}
