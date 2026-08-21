// ─────────────────────────────────────────────────────────────────────────────
// Primitivas de página compartidas por las nuevas rutas del taller.
// Reutilizan el lenguaje visual ya existente (tarjetas oscuras, acento cian,
// etiquetas mono en versalitas) en lugar de introducir un sistema nuevo.
// ─────────────────────────────────────────────────────────────────────────────
import type { ReactNode } from 'react';

export const accents = {
  cyan: {
    text: 'text-cyan-400', textSoft: 'text-cyan-300',
    border: 'border-cyan-500/25', borderStrong: 'border-cyan-500/40',
    bg: 'bg-cyan-500/10', bgSoft: 'bg-cyan-500/5', dot: 'bg-cyan-500',
    ring: 'ring-cyan-500/30',
  },
  indigo: {
    text: 'text-indigo-400', textSoft: 'text-indigo-300',
    border: 'border-indigo-500/25', borderStrong: 'border-indigo-500/40',
    bg: 'bg-indigo-500/10', bgSoft: 'bg-indigo-500/5', dot: 'bg-indigo-500',
    ring: 'ring-indigo-500/30',
  },
  purple: {
    text: 'text-purple-400', textSoft: 'text-purple-300',
    border: 'border-purple-500/25', borderStrong: 'border-purple-500/40',
    bg: 'bg-purple-500/10', bgSoft: 'bg-purple-500/5', dot: 'bg-purple-500',
    ring: 'ring-purple-500/30',
  },
  emerald: {
    text: 'text-emerald-400', textSoft: 'text-emerald-300',
    border: 'border-emerald-500/25', borderStrong: 'border-emerald-500/40',
    bg: 'bg-emerald-500/10', bgSoft: 'bg-emerald-500/5', dot: 'bg-emerald-500',
    ring: 'ring-emerald-500/30',
  },
  amber: {
    text: 'text-amber-400', textSoft: 'text-amber-300',
    border: 'border-amber-500/25', borderStrong: 'border-amber-500/40',
    bg: 'bg-amber-500/10', bgSoft: 'bg-amber-500/5', dot: 'bg-amber-500',
    ring: 'ring-amber-500/30',
  },
  rose: {
    text: 'text-rose-400', textSoft: 'text-rose-300',
    border: 'border-rose-500/25', borderStrong: 'border-rose-500/40',
    bg: 'bg-rose-500/10', bgSoft: 'bg-rose-500/5', dot: 'bg-rose-500',
    ring: 'ring-rose-500/30',
  },
  teal: {
    text: 'text-teal-400', textSoft: 'text-teal-300',
    border: 'border-teal-500/25', borderStrong: 'border-teal-500/40',
    bg: 'bg-teal-500/10', bgSoft: 'bg-teal-500/5', dot: 'bg-teal-500',
    ring: 'ring-teal-500/30',
  },
} as const;

export type AccentName = keyof typeof accents;

/** Contenedor estándar de ancho de lectura. */
export function Shell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-5xl px-4 sm:px-6 ${className}`}>{children}</div>
  );
}

/** Cabecera de sección numerada: «03 · CÓMO FUNCIONA». */
export function SectionHead({
  n, kicker, title, lead, accent = 'cyan',
}: {
  n?: string; kicker: string; title: string; lead?: string; accent?: AccentName;
}) {
  const a = accents[accent];
  return (
    <header className="mb-6">
      <div className={`mono text-[10px] font-bold uppercase tracking-[0.2em] ${a.text} mb-2`}>
        {n ? `${n} · ` : ''}{kicker}
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{title}</h2>
      {lead && <p className="mt-2.5 text-sm text-zinc-400 leading-relaxed max-w-3xl">{lead}</p>}
    </header>
  );
}

/** Tarjeta base. */
export function Panel({
  children, className = '', accent,
}: { children: ReactNode; className?: string; accent?: AccentName }) {
  const border = accent ? accents[accent].border : 'border-white/[0.08]';
  return (
    <div className={`rounded-xl border ${border} bg-[oklch(0.10_0.018_250/0.6)] ${className}`}>
      {children}
    </div>
  );
}

/** Etiqueta pequeña en mono, para metadatos. */
export function Tag({
  children, accent = 'cyan',
}: { children: ReactNode; accent?: AccentName }) {
  const a = accents[accent];
  return (
    <span className={`mono text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${a.border} ${a.bgSoft} ${a.text}`}>
      {children}
    </span>
  );
}

/** Aviso persistente de privacidad. */
export function PrivacyNote({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/25 bg-amber-500/[0.06] px-3.5 py-3">
      <span aria-hidden className="mt-0.5 text-amber-400 text-sm">⚠</span>
      <p className="text-xs text-amber-200/80 leading-relaxed">{text}</p>
    </div>
  );
}

/** Bloque de tabla con scroll propio: el body nunca se desplaza en horizontal. */
export function TableScroll({ children }: { children: ReactNode }) {
  return <div className="table-scroll rounded-xl border border-white/[0.08]">{children}</div>;
}
