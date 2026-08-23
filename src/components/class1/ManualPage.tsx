'use client';
// Manual y recursos: conceptos, banco de prompts y glosario, sin duplicar las 36
// páginas del Manual del Estudiante.
import { useState } from 'react';
import Link from 'next/link';
import { concepts, glossary } from '@/content/class1/concepts';
import { CANONICAL_PROMPTS } from '@/content/class1/prompts';
import { class1Meta, getBlock } from '@/content/class1/manifest';
import { useConceptPanel } from './ConceptPanel';
import { PromptBlock } from './ui';

type Tab = 'conceptos' | 'prompts' | 'glosario';

const tabs: { id: Tab; label: string }[] = [
  { id: 'conceptos', label: 'Conceptos' },
  { id: 'prompts', label: 'Banco de prompts' },
  { id: 'glosario', label: 'Glosario' },
];

export function ManualPage() {
  const [tab, setTab] = useState<Tab>('conceptos');
  const { open } = useConceptPanel();

  return (
    <div className="space-y-6">
      <header>
        <div className="mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
          Clase 1 · Recursos
        </div>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Manual y recursos</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Lo mínimo para resolver una duda en mitad de una decisión. El desarrollo completo está en el
          Manual del Estudiante; aquí solo lo consultable durante la sesión.
        </p>
      </header>

      <div role="tablist" aria-label="Secciones del manual" className="flex flex-wrap gap-1.5">
        {tabs.map(t => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 ${
              tab === t.id
                ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                : 'border-white/[0.10] text-zinc-400 hover:border-white/25 hover:text-zinc-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'conceptos' && (
        <div className="grid gap-2.5 sm:grid-cols-2">
          {concepts.map(c => {
            const practice = c.practiceBlock ? getBlock(c.practiceBlock) : undefined;
            return (
              <article key={c.id} className="flex flex-col rounded-xl border border-white/[0.10] bg-white/[0.02] p-4">
                <h2 className="text-sm font-bold text-white">{c.headline}</h2>
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-zinc-400">{c.explanation}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => open(c.id)}
                    className="rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[11px] font-medium text-cyan-300 hover:bg-cyan-500/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
                  >
                    Ver concepto
                  </button>
                  {practice && (
                    <Link
                      href={`/clase-1/${practice.id}`}
                      className="rounded border border-white/[0.12] px-2 py-1 text-[11px] text-zinc-400 hover:border-white/25 hover:text-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
                    >
                      Practicar · {practice.code}
                    </Link>
                  )}
                  <span className="mono text-[10px] text-zinc-600">{c.manualRef}</span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {tab === 'prompts' && (
        <div className="space-y-5">
          <p className="text-xs text-zinc-500">
            Textos canónicos del programa: se copian sin modificar. Cualquier cambio se hace primero en
            el Documento Maestro.
          </p>
          {CANONICAL_PROMPTS.map(p => (
            <div key={p.id} className="space-y-2">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="mono text-[10px] font-bold text-cyan-400">{p.ref}</span>
                <h2 className="text-sm font-bold text-white">{p.title}</h2>
                <span className="mono rounded border border-white/[0.12] px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-zinc-500">
                  riesgo {p.risk}
                </span>
              </div>
              <PromptBlock label={p.title} text={p.text} />
              <dl className="grid gap-1.5 text-xs sm:grid-cols-2">
                <div>
                  <dt className="mono text-[9px] font-bold uppercase tracking-widest text-zinc-500">Para qué sirve</dt>
                  <dd className="text-zinc-400">{p.purpose}</dd>
                </div>
                <div>
                  <dt className="mono text-[9px] font-bold uppercase tracking-widest text-zinc-500">Cuándo usarlo</dt>
                  <dd className="text-zinc-400">{p.whenToUse}</dd>
                </div>
                {p.iteration && (
                  <div className="sm:col-span-2">
                    <dt className="mono text-[9px] font-bold uppercase tracking-widest text-zinc-500">Iteración</dt>
                    <dd className="text-zinc-400">{p.iteration}</dd>
                  </div>
                )}
                {p.warning && (
                  <div className="sm:col-span-2">
                    <dt className="mono text-[9px] font-bold uppercase tracking-widest text-amber-400">Advertencia</dt>
                    <dd className="text-zinc-400">{p.warning}</dd>
                  </div>
                )}
              </dl>
            </div>
          ))}
        </div>
      )}

      {tab === 'glosario' && (
        <dl className="space-y-2">
          {glossary.map(g => (
            <div key={g.term} className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5">
              <dt className="text-sm font-semibold text-white">{g.term}</dt>
              <dd className="mt-0.5 text-xs leading-relaxed text-zinc-400">{g.definition}</dd>
            </div>
          ))}
        </dl>
      )}

      <section aria-labelledby="anclas" className="rounded-xl border border-white/[0.10] bg-white/[0.02] p-4">
        <h2 id="anclas" className="mb-2.5 text-sm font-bold text-white">Las ocho frases ancla</h2>
        <ol className="grid gap-1 sm:grid-cols-2">
          {class1Meta.anchors.map((f, i) => (
            <li key={f} className="text-xs text-zinc-400">
              <span className="mono mr-1.5 font-bold text-cyan-400">{i + 1}</span>
              {f}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
