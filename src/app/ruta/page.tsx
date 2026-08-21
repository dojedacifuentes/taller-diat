'use client';
// ─────────────────────────────────────────────────────────────────────────────
// Ruta de aprendizaje. Ocho etapas, progreso local, sin cuenta y sin servidor.
// El progreso vive en localStorage: si alguien limpia el navegador lo pierde, y
// esa es la contrapartida deliberada de no pedirle datos a nadie.
// ─────────────────────────────────────────────────────────────────────────────
import Link from 'next/link';
import { Check, ArrowRight, RotateCcw } from 'lucide-react';

import { learningPath, thesis } from '@/data/pedagogy';
import { sessions } from '@/data/program';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Shell, SectionHead, Panel, accents, type AccentName } from '@/components/common/Page';

const sessionAccent: Record<number, AccentName> = { 1: 'cyan', 2: 'indigo', 3: 'purple' };

export default function RutaPage() {
  const [done, setDone] = useLocalStorage<Record<string, boolean>>('diat.path.v1', {});

  const completed = learningPath.filter(s => done[s.id]).length;
  const pct = Math.round((completed / learningPath.length) * 100);

  function toggle(id: string) {
    setDone({ ...done, [id]: !done[id] });
  }

  return (
    <div className="py-8 sm:py-12">
      <Shell>
        <header className="mb-8">
          <div className="mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 mb-2">
            Las tres sesiones, en ocho pasos
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            Ruta de aprendizaje
          </h1>
          <p className="mt-3 text-base text-zinc-400 leading-relaxed max-w-3xl">
            {thesis.headline}
          </p>
        </header>

        {/* Progresión general del taller */}
        <div className="mb-10 grid gap-2 sm:grid-cols-4">
          {thesis.progression.map((p, i) => (
            <div
              key={p.label}
              className={`rounded-xl border p-4 ${
                i === 3 ? 'border-emerald-500/30 bg-emerald-500/[0.05]' : 'border-white/[0.08]'
              }`}
            >
              <div className={`mono text-[9px] font-bold uppercase tracking-widest mb-1.5 ${i === 3 ? 'text-emerald-400' : 'text-zinc-600'}`}>
                {p.step}
              </div>
              <div className={`mono text-sm font-bold mb-2 ${i === 3 ? 'text-emerald-300' : 'text-white'}`}>
                {p.label}
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">{p.claim}</p>
            </div>
          ))}
        </div>

        {/* Progreso */}
        <Panel className="p-5 mb-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
            <span className="mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Tu progreso
            </span>
            <span className="mono text-sm text-zinc-300" aria-live="polite">
              {completed} de {learningPath.length} · {pct}%
            </span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progreso en la ruta de aprendizaje"
          >
            <div className="h-full bg-cyan-500 transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-3 text-xs text-zinc-600 leading-relaxed">
            Se guarda solo en este navegador. No hay cuenta, no hay registro y nadie más ve esto.
          </p>
        </Panel>

        {/* Etapas */}
        <ol className="space-y-2.5">
          {learningPath.map(step => {
            const a = accents[sessionAccent[step.session]];
            const isDone = Boolean(done[step.id]);
            return (
              <li key={step.id}>
                <Panel className={`p-4 ${isDone ? 'border-emerald-500/25' : ''}`}>
                  <div className="flex items-start gap-3.5">
                    <button
                      type="button"
                      onClick={() => toggle(step.id)}
                      aria-pressed={isDone}
                      aria-label={`Marcar «${step.label}» como ${isDone ? 'pendiente' : 'completado'}`}
                      className={`shrink-0 mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                        isDone
                          ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-400'
                          : 'border-white/[0.12] text-zinc-600 hover:bg-white/[0.05]'
                      }`}
                    >
                      {isDone
                        ? <Check className="w-4 h-4" aria-hidden />
                        : <span className="mono text-xs font-bold">{step.n}</span>}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className={`text-base font-semibold ${isDone ? 'text-zinc-400 line-through decoration-zinc-700' : 'text-white'}`}>
                          {step.label}
                        </h2>
                        <span className={`mono text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${a.border} ${a.bgSoft} ${a.text}`}>
                          Sesión {step.session}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-500 mt-1 leading-relaxed">{step.description}</p>
                    </div>

                    <Link
                      href={step.href}
                      className={`shrink-0 mt-0.5 inline-flex items-center gap-1.5 rounded-lg border border-white/[0.12] px-3 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/[0.05] transition`}
                    >
                      Abrir <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                    </Link>
                  </div>
                </Panel>
              </li>
            );
          })}
        </ol>

        <button
          type="button"
          onClick={() => setDone({})}
          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/[0.12] px-4 py-2.5 text-sm font-semibold text-zinc-400 hover:bg-white/[0.04] transition"
        >
          <RotateCcw className="w-4 h-4" aria-hidden /> Reiniciar progreso
        </button>

        <section className="mt-14">
          <SectionHead
            kicker="A dónde lleva" title="El cambio que persigue el taller"
            lead="No se mide en herramientas aprendidas, sino en lo que cada participante puede decir de sí al terminar."
            accent="emerald"
          />
          <Panel accent="emerald" className="p-5">
            <p className="text-base text-zinc-200 leading-relaxed">{thesis.closing}</p>
          </Panel>
        </section>

        <nav className="mt-8 flex flex-wrap gap-2.5">
          {sessions.map(s => (
            <Link
              key={s.id}
              href={`/sesiones/${s.id}`}
              className="rounded-lg border border-white/[0.1] px-3.5 py-2 text-xs font-semibold text-zinc-400 hover:bg-white/[0.04] transition"
            >
              <span className="mono">{s.displayDateShort}</span> · {s.shortTitle}
            </Link>
          ))}
        </nav>
      </Shell>
    </div>
  );
}
