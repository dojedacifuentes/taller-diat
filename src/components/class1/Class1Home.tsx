'use client';
// Portada de /clase-1: encuadre, mapa de fases y punto de entrada.
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import { BLOCKS, PHASES, blockClock, class1Meta, phaseMeta } from '@/content/class1/manifest';
import { useClass1 } from '@/lib/class1/store';
import { StatusDot } from './Class1Shell';
import { Callout } from './ui';

export function Class1Home() {
  const { progress, hydrated, state } = useClass1();
  const started = hydrated && state.startedAt !== null;

  return (
    <div className="space-y-8">
      <header>
        <div className="mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
          Taller de IA y Prompting Jurídico · {class1Meta.date}
        </div>
        <h1 className="mt-2 text-3xl font-bold leading-tight text-white sm:text-4xl">
          {class1Meta.title}
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-zinc-400">
          Durante los próximos 90 minutos vas a formular un encargo, diagnosticar qué decisiones
          delegas, detectar cómo puede fallar una respuesta plausible y verificar antes de asumirla
          como propia. El profesor conduce; esta pantalla es donde tú decides, produces y registras.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href={`/clase-1/${hydrated ? progress.nextBlock : 'b00'}`}
            className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/15 px-5 py-3 text-sm font-semibold text-cyan-200 transition-colors hover:bg-cyan-500/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
          >
            <Play className="h-4 w-4" aria-hidden />
            {started ? 'Continuar donde quedé' : 'Comenzar por B00'}
          </Link>
          {hydrated && started && (
            <span className="mono text-xs text-zinc-500">
              Bitácora {progress.percent}% · {progress.completedBlocks}/{progress.totalBlocks} bloques
            </span>
          )}
        </div>
      </header>

      <Callout kind="idea" title="Idea fuerza de la sesión">
        <p className="text-base font-semibold text-white">{class1Meta.idea}</p>
        <p className="text-zinc-400">{class1Meta.thesis}</p>
      </Callout>

      <section aria-labelledby="flujo">
        <h2 id="flujo" className="mb-3 text-lg font-bold text-white">
          El flujo que sustituye a «prompt → respuesta»
        </h2>
        <ol className="flex flex-wrap items-center gap-1.5">
          {class1Meta.flow.map((step, i) => (
            <li key={step} className="flex items-center gap-1.5">
              <span
                className={`mono rounded border px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
                  i === class1Meta.flow.length - 1
                    ? 'border-cyan-500/45 bg-cyan-500/15 text-cyan-300'
                    : 'border-white/[0.12] bg-white/[0.03] text-zinc-400'
                }`}
              >
                {step}
              </span>
              {i < class1Meta.flow.length - 1 && <span aria-hidden className="text-zinc-700">→</span>}
            </li>
          ))}
        </ol>
      </section>

      <section id="progreso" aria-labelledby="mapa" className="scroll-mt-20 space-y-4">
        <h2 id="mapa" className="text-lg font-bold text-white">Mi progreso · mapa de la clase</h2>
        {PHASES.map(phase => {
          const blocks = BLOCKS.filter(b => b.phase === phase);
          const meta = phaseMeta[phase];
          return (
            <div key={phase} className="rounded-xl border border-white/[0.10] bg-white/[0.02] p-4">
              <div className="mono text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                {phase}
              </div>
              <p className="mt-1 text-sm italic text-zinc-400">{meta.question}</p>
              <p className="mt-1 text-xs text-zinc-500">{meta.idea}</p>
              <ul className="mt-3 space-y-1">
                {blocks.map(b => (
                  <li key={b.id}>
                    <Link
                      href={`/clase-1/${b.id}`}
                      className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
                    >
                      {hydrated ? <StatusDot status={progress.blocks[b.id].status} /> : <span className="h-4 w-4" />}
                      <span className="mono shrink-0 text-[10px] font-bold text-zinc-600">{b.code}</span>
                      <span className="mono hidden shrink-0 text-[10px] text-zinc-600 sm:inline">{blockClock(b)}</span>
                      <span className="min-w-0 flex-1 truncate">{b.title}</span>
                      {b.product && (
                        <span className="mono shrink-0 rounded border border-indigo-500/30 bg-indigo-500/10 px-1 text-[9px] font-bold text-indigo-300">
                          {b.product}
                        </span>
                      )}
                      <ArrowRight className="h-3 w-3 shrink-0 text-zinc-700" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      <section aria-labelledby="resultados">
        <h2 id="resultados" className="mb-3 text-lg font-bold text-white">Resultados de aprendizaje</h2>
        <ol className="space-y-2">
          {class1Meta.outcomes.map((o, i) => (
            <li key={i} className="flex items-start gap-3 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5">
              <span className="mono mt-0.5 shrink-0 text-[11px] font-bold text-cyan-400">{i + 1}</span>
              <span className="text-sm text-zinc-300">{o}</span>
            </li>
          ))}
        </ol>
      </section>

      <Callout kind="alerta" title="Regla de aula">
        <p>{class1Meta.classroomRule}</p>
      </Callout>

      <p className="text-xs text-zinc-600">
        Tu trabajo se guarda solo en este navegador. No necesitas crear una cuenta y nada se envía a
        ningún servidor hasta que tú decidas entregar tu Bitácora por correo.
      </p>
    </div>
  );
}
