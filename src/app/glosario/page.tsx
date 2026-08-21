'use client';
// ─────────────────────────────────────────────────────────────────────────────
// Glosario vivo. Definiciones de dos o tres líneas y, siempre que ayude, un
// ejemplo jurídico inmediatamente después. Ningún término entra por ser
// técnicamente interesante: entra si el estudiante lo necesita para trabajar.
// ─────────────────────────────────────────────────────────────────────────────
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight } from 'lucide-react';

import { glossary, glossaryGroups } from '@/data/pedagogy';
import { Shell, Panel, accents, type AccentName } from '@/components/common/Page';

const groupAccent: Record<string, AccentName> = {
  Fundamentos: 'cyan',
  Prompting: 'indigo',
  Verificación: 'emerald',
  Riesgos: 'rose',
  Flujo: 'purple',
};

/** Normaliza para buscar sin depender de tildes ni mayúsculas. */
function norm(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export default function GlosarioPage() {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = norm(query.trim());
    return glossary.filter(t => {
      if (group && t.group !== group) return false;
      if (!q) return true;
      return norm(`${t.term} ${t.definition} ${t.legalExample}`).includes(q);
    });
  }, [query, group]);

  return (
    <div className="py-8 sm:py-12">
      <Shell>
        <header className="mb-8">
          <div className="mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 mb-2">
            Transversal a las tres sesiones
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">Glosario</h1>
          <p className="mt-3 text-base text-zinc-400 leading-relaxed max-w-3xl">
            {glossary.length} términos, cada uno con una definición breve y un ejemplo jurídico.
            Suficiente para trabajar con criterio, sin convertir el taller en una clase de
            informática.
          </p>
        </header>

        <div className="mb-6">
          <label htmlFor="glosario-buscar" className="sr-only">Buscar un término</label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" aria-hidden />
            <input
              id="glosario-buscar"
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar: alucinación, trazabilidad, vigencia…"
              className="w-full rounded-lg border border-white/[0.1] bg-black/30 pl-10 pr-3 py-3 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-cyan-500/40"
            />
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-1.5">
          <button
            type="button"
            aria-pressed={group === null}
            onClick={() => setGroup(null)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              group === null
                ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                : 'border-white/[0.1] text-zinc-400 hover:bg-white/[0.04]'
            }`}
          >
            Todos
          </button>
          {glossaryGroups.map(g => {
            const a = accents[groupAccent[g]];
            const active = group === g;
            return (
              <button
                key={g}
                type="button"
                aria-pressed={active}
                onClick={() => setGroup(active ? null : g)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                  active ? `${a.borderStrong} ${a.bg} ${a.text}` : 'border-white/[0.1] text-zinc-400 hover:bg-white/[0.04]'
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>

        <p className="mb-4 mono text-xs text-zinc-600" aria-live="polite">
          {results.length} {results.length === 1 ? 'término' : 'términos'}
        </p>

        {results.length === 0 ? (
          <Panel className="p-8 text-center">
            <p className="text-sm text-zinc-500">
              Ningún término coincide con «{query}». Prueba con una palabra más corta.
            </p>
          </Panel>
        ) : (
          <dl className="grid gap-3 sm:grid-cols-2">
            {results.map(t => {
              const a = accents[groupAccent[t.group]];
              return (
                <Panel key={t.term} className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <dt className="text-base font-semibold text-white">{t.term}</dt>
                    <span className={`mono text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border shrink-0 ${a.border} ${a.bgSoft} ${a.text}`}>
                      {t.group}
                    </span>
                  </div>
                  <dd>
                    <p className="text-sm text-zinc-300 leading-relaxed">{t.definition}</p>
                    <p className="mt-2.5 text-xs text-zinc-500 leading-relaxed border-l-2 border-white/10 pl-2.5">
                      {t.legalExample}
                    </p>
                  </dd>
                </Panel>
              );
            })}
          </dl>
        )}

        <nav className="mt-10 flex flex-wrap gap-4">
          <Link href="/flashcards" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:underline">
            Repasar con flashcards <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
          <Link href="/materiales" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:underline">
            Descargar el glosario en PDF <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        </nav>
      </Shell>
    </div>
  );
}
