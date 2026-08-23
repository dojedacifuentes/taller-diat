'use client';
// ─────────────────────────────────────────────────────────────────────────────
// MANUAL CONTEXTUAL
//
// El Manual del Estudiante no se replica aquí. Este panel resuelve la duda que
// aparece en mitad de una decisión —concepto, ejemplo, riesgo— y deja al
// estudiante volver a lo que estaba haciendo. Progressive disclosure: se abre
// solo si hace falta.
// ─────────────────────────────────────────────────────────────────────────────
import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode,
} from 'react';
import Link from 'next/link';
import { X, BookOpen } from 'lucide-react';
import { getConcept, type Concept } from '@/content/class1/concepts';
import { getBlock } from '@/content/class1/manifest';

interface ConceptCtx {
  open: (id: string) => void;
  close: () => void;
  current: string | null;
}

const Ctx = createContext<ConceptCtx | null>(null);

export function ConceptProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<string | null>(null);

  const open = useCallback((id: string) => setCurrent(id), []);
  const close = useCallback(() => setCurrent(null), []);

  useEffect(() => {
    if (!current) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setCurrent(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current]);

  const value = useMemo(() => ({ open, close, current }), [open, close, current]);
  const concept = current ? getConcept(current) : undefined;

  return (
    <Ctx.Provider value={value}>
      {children}
      {concept && <ConceptDrawer concept={concept} onClose={close} />}
    </Ctx.Provider>
  );
}

export function useConceptPanel(): ConceptCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useConceptPanel debe usarse dentro de <ConceptProvider>.');
  return ctx;
}

function ConceptDrawer({ concept, onClose }: { concept: Concept; onClose: () => void }) {
  const practice = concept.practiceBlock ? getBlock(concept.practiceBlock) : undefined;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button
        type="button"
        aria-label="Cerrar el panel de concepto"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="concept-title"
        className="relative flex h-full w-full max-w-md flex-col border-l border-white/[0.10] bg-[oklch(0.09_0.016_250)] shadow-2xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-white/[0.08] px-5 py-4">
          <div className="min-w-0">
            <div className="mono text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-400">
              Manual contextual
            </div>
            <h2 id="concept-title" className="mt-1 text-lg font-bold leading-tight text-white">
              {concept.headline}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="shrink-0 rounded-lg border border-white/[0.10] p-1.5 text-zinc-400 transition-colors hover:border-white/25 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          <section>
            <h3 className="mono mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">
              Concepto
            </h3>
            <p className="text-sm leading-relaxed text-zinc-300">{concept.explanation}</p>
          </section>

          {concept.example && (
            <section>
              <h3 className="mono mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-400">
                Ejemplo jurídico
              </h3>
              <p className="text-sm leading-relaxed text-zinc-300">{concept.example}</p>
            </section>
          )}

          {concept.risk && (
            <section className="rounded-lg border border-rose-500/25 bg-rose-500/[0.06] px-3.5 py-3">
              <h3 className="mono mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-rose-300">
                Riesgo
              </h3>
              <p className="text-sm leading-relaxed text-zinc-300">{concept.risk}</p>
            </section>
          )}
        </div>

        <footer className="flex flex-wrap items-center gap-2 border-t border-white/[0.08] px-5 py-4">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.10] bg-white/[0.03] px-2.5 py-1.5 text-[11px] text-zinc-400">
            <BookOpen className="h-3 w-3" aria-hidden />
            {concept.manualRef}
          </span>
          {practice && (
            <Link
              href={`/clase-1/${practice.id}`}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1.5 text-[11px] font-medium text-cyan-300 transition-colors hover:bg-cyan-500/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
            >
              Practicar · {practice.code}
            </Link>
          )}
          <Link
            href="/clase-1/manual"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.10] px-2.5 py-1.5 text-[11px] text-zinc-400 transition-colors hover:border-white/25 hover:text-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
          >
            Todos los conceptos
          </Link>
        </footer>
      </aside>
    </div>
  );
}

/** Enlace en línea que abre el panel del concepto. */
export function ConceptLink({ id, children }: { id: string; children: ReactNode }) {
  const { open } = useConceptPanel();
  return (
    <button
      type="button"
      onClick={() => open(id)}
      className="inline text-left font-medium text-cyan-400 underline decoration-cyan-500/40 underline-offset-2 transition-colors hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
    >
      {children}
    </button>
  );
}
