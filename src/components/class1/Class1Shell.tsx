'use client';
// ─────────────────────────────────────────────────────────────────────────────
// SHELL DE /clase-1
//
// Superficie individual del estudiante. Convive con la superficie colectiva
// (el PPT del docente) sin duplicarla: aquí se decide, se escribe y se registra.
//
// Desktop: rail lateral con las cinco fases y sus bloques.
// Móvil: cabecera compacta + barra inferior de avance. La navegación por
// bloques se despliega bajo demanda para no comerse la pantalla.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen, ChevronLeft, ChevronRight, ClipboardList, LayoutGrid, Library,
  ListChecks, X, Check, Circle, Clock,
} from 'lucide-react';
import {
  BLOCKS, PHASES, blockClock, class1Meta, getBlock, nextBlock, phaseMeta, prevBlock,
  type BlockId, type Class1Phase,
} from '@/content/class1/manifest';
import { useClass1 } from '@/lib/class1/store';
import type { BlockStatus } from '@/lib/class1/progress';

// ─── Indicadores ─────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: BlockStatus }) {
  if (status === 'completado') {
    return (
      <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
        <Check className="h-2.5 w-2.5" aria-hidden />
        <span className="sr-only">Completado</span>
      </span>
    );
  }
  if (status === 'en-curso') {
    return (
      <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
        <Clock className="h-2.5 w-2.5" aria-hidden />
        <span className="sr-only">En curso</span>
      </span>
    );
  }
  return (
    <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-zinc-700">
      <Circle className="h-2.5 w-2.5" aria-hidden />
      <span className="sr-only">Pendiente</span>
    </span>
  );
}

function BitacoraPill({ percent }: { percent: number }) {
  return (
    <Link
      href="/clase-1/mi-trabajo"
      className="group flex items-center gap-2.5 rounded-lg border border-white/[0.10] bg-white/[0.03] px-3 py-2 transition-colors hover:border-cyan-500/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
    >
      <ClipboardList className="h-4 w-4 shrink-0 text-cyan-400" aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-medium leading-tight text-zinc-300 group-hover:text-white">
          Mi Bitácora
        </span>
        <span className="mt-1 block h-1 w-full overflow-hidden rounded-full bg-white/[0.08]">
          <span
            className="block h-full rounded-full bg-cyan-500 transition-all"
            style={{ width: `${percent}%` }}
          />
        </span>
      </span>
      <span className="mono shrink-0 text-[11px] font-bold text-cyan-400 tabular-nums">{percent}%</span>
    </Link>
  );
}

// ─── Navegación por fases ────────────────────────────────────────────────────

function PhaseNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { progress } = useClass1();

  return (
    <nav aria-label="Bloques de la Clase 1" className="space-y-4">
      {PHASES.map(phase => {
        const blocks = BLOCKS.filter(b => b.phase === phase);
        const done = blocks.every(b => progress.blocks[b.id].status === 'completado');
        return (
          <div key={phase}>
            <div className="mb-1.5 flex items-center gap-2 px-1">
              <span
                className={`mono text-[9px] font-bold uppercase tracking-[0.18em] ${
                  done ? 'text-emerald-400' : 'text-zinc-600'
                }`}
              >
                {phase}
              </span>
              {done && <Check className="h-2.5 w-2.5 text-emerald-400" aria-hidden />}
            </div>
            <ul className="space-y-0.5">
              {blocks.map(b => {
                const href = `/clase-1/${b.id}`;
                const active = pathname === href;
                const st = progress.blocks[b.id].status;
                return (
                  <li key={b.id}>
                    <Link
                      href={href}
                      onClick={onNavigate}
                      aria-current={active ? 'page' : undefined}
                      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors ${
                        active
                          ? 'bg-cyan-500/10 text-cyan-300'
                          : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
                      } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400`}
                    >
                      <StatusDot status={st} />
                      <span className="mono shrink-0 text-[10px] font-bold text-zinc-600">{b.code}</span>
                      <span className="min-w-0 flex-1 truncate">{b.title}</span>
                      {b.product && (
                        <span className="mono shrink-0 rounded border border-indigo-500/30 bg-indigo-500/10 px-1 text-[9px] font-bold text-indigo-300">
                          {b.product}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

// ─── Shell ───────────────────────────────────────────────────────────────────

export function Class1Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { progress, hydrated } = useClass1();
  const [navOpen, setNavOpen] = useState(false);

  const currentId = BLOCKS.find(b => pathname === `/clase-1/${b.id}`)?.id ?? null;
  const current = currentId ? getBlock(currentId) : undefined;

  return (
    <div className="mx-auto w-full max-w-[88rem] px-4 pb-28 pt-6 sm:px-6 lg:py-8">
      <div className="lg:flex lg:gap-8">
        {/* Rail lateral — desktop */}
        <div className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-20 space-y-4">
            <Link
              href="/clase-1"
              className="block rounded-xl border border-white/[0.10] bg-white/[0.02] px-3.5 py-3 transition-colors hover:border-cyan-500/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
            >
              <div className="mono text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                {class1Meta.code}
              </div>
              <div className="mt-1 text-[13px] font-semibold leading-snug text-white">
                Del prompt aislado al razonamiento jurídico asistido
              </div>
              <div className="mono mt-1.5 text-[10px] text-zinc-500">
                {class1Meta.dateShort} · {class1Meta.time}
              </div>
            </Link>

            {hydrated && <BitacoraPill percent={progress.percent} />}

            <PhaseNav />

            <div className="space-y-1 border-t border-white/[0.06] pt-3">
              <Link
                href="/clase-1#progreso"
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
              >
                <ListChecks className="h-3.5 w-3.5" aria-hidden />
                Mi progreso
              </Link>
              <Link
                href="/clase-1/manual"
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
              >
                <BookOpen className="h-3.5 w-3.5" aria-hidden />
                Manual
              </Link>
              <Link
                href="/clase-1/manual#recursos"
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
              >
                <Library className="h-3.5 w-3.5" aria-hidden />
                Recursos
              </Link>
            </div>
          </div>
        </div>

        {/* Columna principal */}
        <div className="min-w-0 flex-1">
          {/* Cabecera compacta — móvil */}
          <div className="mb-5 lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <Link href="/clase-1" className="min-w-0">
                <div className="mono text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                  {class1Meta.code} · {class1Meta.dateShort}
                </div>
                <div className="truncate text-sm font-semibold text-white">
                  {current ? `${current.code} · ${current.title}` : 'Del prompt aislado al razonamiento jurídico asistido'}
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setNavOpen(true)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/[0.12] bg-white/[0.04] px-2.5 py-2 text-xs text-zinc-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
                aria-haspopup="dialog"
              >
                <LayoutGrid className="h-3.5 w-3.5" aria-hidden />
                Bloques
              </button>
            </div>
            {hydrated && <div className="mt-3"><BitacoraPill percent={progress.percent} /></div>}
          </div>

          {current && (
            <header className="mb-6 border-b border-white/[0.08] pb-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className="mono rounded border border-cyan-500/30 bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-bold text-cyan-400">
                  {current.code}
                </span>
                <span className="mono text-[11px] text-zinc-500">{blockClock(current)}</span>
                <span className="mono text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600">
                  {current.phase}
                </span>
                {current.product && (
                  <span className="mono rounded border border-indigo-500/30 bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-bold text-indigo-300">
                    Producto {current.product}
                  </span>
                )}
              </div>
              <h1 className="mt-2.5 text-2xl font-bold leading-tight text-white sm:text-3xl">
                {current.title}
              </h1>
              <p className="mt-1.5 text-sm text-zinc-400">{current.subtitle}</p>
            </header>
          )}

          <div className="space-y-6">{children}</div>

          {current && <BlockFooterNav id={current.id} />}
        </div>
      </div>

      {/* Navegación por bloques — móvil */}
      {navOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Cerrar navegación"
            onClick={() => setNavOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Bloques de la Clase 1"
            className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto rounded-t-2xl border-t border-white/[0.12] bg-[oklch(0.09_0.016_250)] px-4 pb-8 pt-4"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="mono text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                Bloques
              </span>
              <button
                type="button"
                onClick={() => setNavOpen(false)}
                aria-label="Cerrar"
                className="rounded-lg border border-white/[0.10] p-1.5 text-zinc-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <PhaseNav onNavigate={() => setNavOpen(false)} />
            <div className="mt-4 space-y-1 border-t border-white/[0.06] pt-3">
              <Link
                href="/clase-1/manual"
                onClick={() => setNavOpen(false)}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2.5 text-sm text-zinc-300"
              >
                <BookOpen className="h-4 w-4" aria-hidden /> Manual y recursos
              </Link>
              <Link
                href="/clase-1/mi-trabajo"
                onClick={() => setNavOpen(false)}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2.5 text-sm text-zinc-300"
              >
                <ClipboardList className="h-4 w-4" aria-hidden /> Mi trabajo
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Cuatro accesos persistentes de trabajo — móvil */}
      <nav
        aria-label="Accesos de la Clase 1"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.12] bg-[oklch(0.075_0.016_250)]/95 px-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-12px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:hidden"
      >
        <div className="mx-auto grid max-w-lg grid-cols-4 gap-0.5">
          {[
            { href: '/clase-1/mi-trabajo', label: 'Mi Bitácora', Icon: ClipboardList },
            { href: '/clase-1#progreso', label: 'Mi progreso', Icon: ListChecks },
            { href: '/clase-1/manual', label: 'Manual', Icon: BookOpen },
            { href: '/clase-1/manual#recursos', label: 'Recursos', Icon: Library },
          ].map(({ href, label, Icon }) => (
            <Link
              key={label}
              href={href}
              className="flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1 py-1.5 text-[10px] leading-tight text-zinc-400 transition-colors hover:bg-white/[0.05] hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-cyan-400"
            >
              <Icon className="h-4 w-4" aria-hidden />
              <span className="max-w-full truncate">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

// ─── Navegación anterior / siguiente ─────────────────────────────────────────

function BlockFooterNav({ id }: { id: BlockId }) {
  const prev = prevBlock(id);
  const next = nextBlock(id);
  const { progress } = useClass1();
  const p = progress.blocks[id];

  return (
    <div className="mt-8 space-y-4 border-t border-white/[0.08] pt-5">
      {p.missing.length > 0 && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.05] px-3.5 py-3">
          <div className="mono mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-400">
            Para completar este bloque
          </div>
          <ul className="space-y-0.5 text-xs text-amber-200/70">
            {p.missing.map(m => <li key={m}>· {m}</li>)}
          </ul>
        </div>
      )}
      <div className="flex items-center justify-between gap-3">
        {prev ? (
          <Link
            href={`/clase-1/${prev.id}`}
            className="inline-flex min-w-0 items-center gap-1.5 rounded-lg border border-white/[0.10] px-3 py-2 text-xs text-zinc-400 transition-colors hover:border-white/25 hover:text-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
          >
            <ChevronLeft className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span className="truncate">{prev.code} · {prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/clase-1/${next.id}`}
            className="inline-flex min-w-0 items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs font-medium text-cyan-300 transition-colors hover:bg-cyan-500/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
          >
            <span className="truncate">{next.code} · {next.title}</span>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
          </Link>
        ) : (
          <Link
            href="/clase-1/mi-trabajo"
            className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs font-medium text-cyan-300 transition-colors hover:bg-cyan-500/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
          >
            Ir a mi Bitácora
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        )}
      </div>
    </div>
  );
}

export { PhaseNav, StatusDot, BitacoraPill, phaseMeta };
export type { Class1Phase };
