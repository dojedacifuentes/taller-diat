'use client';
// ─────────────────────────────────────────────────────────────────────────────
// CLASE 1 · SISTEMA DE INTERFAZ DE APRENDIZAJE
//
// Piezas específicas de la experiencia guiada. Reutilizan el lenguaje visual del
// sitio (superficies oscuras, acento cian, etiquetas mono) y añaden solo lo que
// una actividad necesita: comprometerse, recibir feedback, copiar, registrar.
//
// Regla de accesibilidad transversal: ninguna decisión se comunica solo por
// color; siempre hay texto o marca visible que la acompaña.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Check, Copy, Lock, AlertTriangle, Lightbulb, Scale, ShieldCheck, PenLine } from 'lucide-react';

// ─── Callouts ────────────────────────────────────────────────────────────────

const calloutStyles = {
  idea: {
    label: 'Idea clave',
    icon: Lightbulb,
    box: 'border-cyan-500/25 bg-cyan-500/[0.06]',
    text: 'text-cyan-300',
  },
  ejemplo: {
    label: 'Ejemplo jurídico',
    icon: Scale,
    box: 'border-indigo-500/25 bg-indigo-500/[0.06]',
    text: 'text-indigo-300',
  },
  alerta: {
    label: 'Alerta',
    icon: AlertTriangle,
    box: 'border-rose-500/30 bg-rose-500/[0.07]',
    text: 'text-rose-300',
  },
  verifica: {
    label: 'Verifica',
    icon: ShieldCheck,
    box: 'border-emerald-500/25 bg-emerald-500/[0.06]',
    text: 'text-emerald-300',
  },
  aplicalo: {
    label: 'Aplícalo',
    icon: PenLine,
    box: 'border-white/[0.12] bg-white/[0.03]',
    text: 'text-zinc-300',
  },
} as const;

export type CalloutKind = keyof typeof calloutStyles;

export function Callout({
  kind, title, children,
}: { kind: CalloutKind; title?: string; children: ReactNode }) {
  const s = calloutStyles[kind];
  const Icon = s.icon;
  return (
    <div className={`rounded-xl border ${s.box} px-4 py-3.5`}>
      <div className={`flex items-center gap-1.5 mono text-[10px] font-bold uppercase tracking-[0.14em] ${s.text} mb-2`}>
        <Icon className="w-3 h-3" aria-hidden />
        {title ?? s.label}
      </div>
      <div className="text-sm text-zinc-300 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

/** Declaración a pantalla completa: FLUIDEZ ≠ VERDAD. */
export function Statement({
  children, caption, tone = 'ink',
}: { children: ReactNode; caption?: string; tone?: 'ink' | 'accent' }) {
  const box =
    tone === 'accent'
      ? 'border-cyan-500/40 bg-cyan-500/[0.08]'
      : 'border-white/[0.10] bg-[oklch(0.12_0.02_250)]';
  return (
    <div className={`rounded-xl border ${box} px-5 py-6 text-center`}>
      <p className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">{children}</p>
      {caption && <p className="mt-2.5 text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl mx-auto">{caption}</p>}
    </div>
  );
}

// ─── Copiar ──────────────────────────────────────────────────────────────────

export function CopyButton({
  text, label = 'Copiar', className = '',
}: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Sin permiso de portapapeles: selección manual como alternativa.
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch { /* nada más que hacer */ }
      document.body.removeChild(ta);
    }
    setDone(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setDone(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-white/[0.12] bg-white/[0.04] px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-cyan-500/40 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 ${className}`}
    >
      {done ? <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden /> : <Copy className="w-3.5 h-3.5" aria-hidden />}
      <span>{done ? 'Copiado' : label}</span>
    </button>
  );
}

/** Bloque de prompt copiable, en monoespaciada, con etiqueta. */
export function PromptBlock({
  label, text, footer,
}: { label: string; text: string; footer?: ReactNode }) {
  return (
    <div className="rounded-xl border border-white/[0.12] overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] bg-white/[0.03] px-3.5 py-2">
        <span className="mono text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-400">{label}</span>
        <CopyButton text={text} />
      </div>
      <pre className="mono overflow-x-auto whitespace-pre-wrap break-words bg-[oklch(0.06_0.014_250)] px-3.5 py-3.5 text-[12.5px] leading-relaxed text-zinc-300">
        {text}
      </pre>
      {footer && <div className="border-t border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5 text-xs text-zinc-400">{footer}</div>}
    </div>
  );
}

// ─── Elección accesible ──────────────────────────────────────────────────────

export interface ChoiceOption {
  id: string;
  label: string;
  hint?: string;
}

/**
 * Grupo de opciones exclusivas. Radios reales: navegable con flechas y
 * anunciable por lector de pantalla.
 */
export function ChoiceGroup({
  legend, options, value, onChange, disabled = false, columns = 1, mark,
}: {
  legend: string;
  options: readonly ChoiceOption[];
  value: string | null;
  onChange: (id: string) => void;
  disabled?: boolean;
  columns?: 1 | 2 | 3;
  /** Marca por opción tras el commit: acierto, error o neutro. */
  mark?: (id: string) => 'ok' | 'bad' | null;
}) {
  const name = useId();
  const cols = columns === 3 ? 'sm:grid-cols-3' : columns === 2 ? 'sm:grid-cols-2' : '';
  return (
    <fieldset disabled={disabled} className="min-w-0">
      <legend className="mb-2.5 text-sm font-medium text-zinc-200">{legend}</legend>
      <div className={`grid gap-2 ${cols}`}>
        {options.map(o => {
          const selected = value === o.id;
          const m = mark?.(o.id) ?? null;
          const tone =
            m === 'ok'
              ? 'border-emerald-500/50 bg-emerald-500/[0.08]'
              : m === 'bad'
                ? 'border-rose-500/50 bg-rose-500/[0.08]'
                : selected
                  ? 'border-cyan-500/50 bg-cyan-500/[0.08]'
                  : 'border-white/[0.10] bg-white/[0.02] hover:border-white/25';
          return (
            <label
              key={o.id}
              className={`flex cursor-pointer items-start gap-2.5 rounded-lg border px-3.5 py-3 transition-colors ${tone} ${disabled ? 'cursor-default' : ''} has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-cyan-400`}
            >
              <input
                type="radio"
                name={name}
                value={o.id}
                checked={selected}
                onChange={() => onChange(o.id)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-cyan-400"
              />
              <span className="min-w-0">
                <span className="block text-sm text-zinc-200 leading-snug">{o.label}</span>
                {o.hint && <span className="mt-0.5 block text-xs text-zinc-500 leading-snug">{o.hint}</span>}
                {m === 'ok' && <span className="mt-1 block mono text-[10px] font-bold uppercase tracking-widest text-emerald-400">Respuesta correcta</span>}
                {m === 'bad' && selected && <span className="mt-1 block mono text-[10px] font-bold uppercase tracking-widest text-rose-400">Tu respuesta</span>}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Casillas múltiples accesibles. */
export function CheckGroup({
  legend, options, values, onToggle, note,
}: {
  legend: string;
  options: readonly ChoiceOption[];
  values: string[];
  onToggle: (id: string) => void;
  note?: string;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-1 text-sm font-medium text-zinc-200">{legend}</legend>
      {note && <p className="mb-2.5 text-xs text-zinc-500">{note}</p>}
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map(o => {
          const on = values.includes(o.id);
          return (
            <label
              key={o.id}
              className={`flex cursor-pointer items-start gap-2.5 rounded-lg border px-3.5 py-2.5 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-cyan-400 ${
                on ? 'border-cyan-500/50 bg-cyan-500/[0.08]' : 'border-white/[0.10] bg-white/[0.02] hover:border-white/25'
              }`}
            >
              <input
                type="checkbox"
                checked={on}
                onChange={() => onToggle(o.id)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-cyan-400"
              />
              <span className="min-w-0">
                <span className="block text-sm text-zinc-200 leading-snug">{o.label}</span>
                {o.hint && <span className="mt-0.5 block text-xs text-zinc-500 leading-snug">{o.hint}</span>}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

// ─── Commit before feedback ──────────────────────────────────────────────────

/**
 * Barrera deliberada: el feedback no aparece hasta que el estudiante confirma.
 * Una vez confirmado, la respuesta queda bloqueada — comparar la intuición
 * inicial con la comprensión posterior exige que la primera no se pueda editar.
 */
export function CommitGate({
  committed, canCommit, onCommit, children, label = 'Confirmar respuesta',
  lockedNote = 'Respuesta registrada. No se puede modificar: es el punto de comparación.',
}: {
  committed: boolean;
  canCommit: boolean;
  onCommit: () => void;
  children?: ReactNode;
  label?: string;
  lockedNote?: string;
}) {
  if (committed) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2">
          <Lock className="mt-0.5 w-3.5 h-3.5 shrink-0 text-zinc-500" aria-hidden />
          <p className="text-xs text-zinc-500 leading-relaxed">{lockedNote}</p>
        </div>
        {children}
      </div>
    );
  }
  return (
    <div>
      <button
        type="button"
        onClick={onCommit}
        disabled={!canCommit}
        className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/15 px-4 py-2.5 text-sm font-semibold text-cyan-200 transition-colors hover:bg-cyan-500/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-zinc-600"
      >
        {label}
      </button>
      {!canCommit && (
        <p className="mt-2 text-xs text-zinc-600">Elige una opción para poder confirmar.</p>
      )}
    </div>
  );
}

/** Panel de feedback explicativo: respuesta, por qué y principio. */
export function Feedback({
  correct, answer, explanation, principle, manualRef, onOpenConcept,
}: {
  correct?: boolean;
  answer?: string;
  explanation: string;
  principle?: string;
  manualRef?: string;
  onOpenConcept?: () => void;
}) {
  const tone =
    correct === undefined
      ? 'border-white/[0.12] bg-white/[0.03]'
      : correct
        ? 'border-emerald-500/30 bg-emerald-500/[0.07]'
        : 'border-amber-500/30 bg-amber-500/[0.07]';
  const head =
    correct === undefined ? null : correct ? 'Correcto' : 'Revisa esto';
  return (
    <div role="status" className={`rounded-xl border ${tone} px-4 py-3.5`}>
      {head && (
        <div className={`mono text-[10px] font-bold uppercase tracking-[0.14em] mb-1.5 ${correct ? 'text-emerald-400' : 'text-amber-400'}`}>
          {head}
        </div>
      )}
      {answer && <p className="text-sm font-semibold text-white mb-1.5">{answer}</p>}
      <p className="text-sm text-zinc-300 leading-relaxed">{explanation}</p>
      {principle && (
        <p className="mt-2.5 border-t border-white/[0.08] pt-2.5 text-xs text-zinc-400">
          <span className="mono font-bold uppercase tracking-widest text-zinc-500">Principio · </span>
          {principle}
        </p>
      )}
      {manualRef && onOpenConcept && (
        <button
          type="button"
          onClick={onOpenConcept}
          className="mt-2 text-xs font-medium text-cyan-400 underline underline-offset-2 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
        >
          Ver concepto · {manualRef}
        </button>
      )}
    </div>
  );
}

// ─── Campos ──────────────────────────────────────────────────────────────────

export function Field({
  label, hint, value, onChange, placeholder, rows = 3, maxLength, id,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  id?: string;
}) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <div className="min-w-0">
      <label htmlFor={fieldId} className="mb-1 block text-sm font-medium text-zinc-200">{label}</label>
      {hint && <p className="mb-1.5 text-xs text-zinc-500 leading-snug">{hint}</p>}
      <textarea
        id={fieldId}
        rows={rows}
        maxLength={maxLength}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full resize-y rounded-lg border border-white/[0.12] bg-[oklch(0.09_0.016_250)] px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-cyan-500/50 focus:outline-2 focus:outline-offset-0 focus:outline-cyan-500/40"
      />
    </div>
  );
}

export function TextField({
  label, value, onChange, placeholder, type = 'text', id, hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'date';
  id?: string;
  hint?: string;
}) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <div className="min-w-0">
      <label htmlFor={fieldId} className="mb-1 block text-sm font-medium text-zinc-200">{label}</label>
      {hint && <p className="mb-1.5 text-xs text-zinc-500 leading-snug">{hint}</p>}
      <input
        id={fieldId}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-white/[0.12] bg-[oklch(0.09_0.016_250)] px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-cyan-500/50 focus:outline-2 focus:outline-offset-0 focus:outline-cyan-500/40"
      />
    </div>
  );
}

export function SelectField<T extends string>({
  label, value, onChange, options, placeholder = 'Selecciona…', id,
}: {
  label: string;
  value: T | null;
  onChange: (v: T | null) => void;
  options: readonly { id: T; label: string }[];
  placeholder?: string;
  id?: string;
}) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <div className="min-w-0">
      <label htmlFor={fieldId} className="mb-1 block text-xs font-medium text-zinc-400">{label}</label>
      <select
        id={fieldId}
        value={value ?? ''}
        onChange={e => onChange((e.target.value || null) as T | null)}
        className="w-full rounded-lg border border-white/[0.12] bg-[oklch(0.09_0.016_250)] px-2.5 py-2 text-sm text-zinc-200 focus:border-cyan-500/50 focus:outline-2 focus:outline-offset-0 focus:outline-cyan-500/40"
      >
        <option value="">{placeholder}</option>
        {options.map(o => (
          <option key={o.id} value={o.id}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

// ─── EVA ─────────────────────────────────────────────────────────────────────

/**
 * EVA como provocadora cognitiva, no como asistente. Aparece cuando una
 * intuición errónea merece enunciarse en voz alta antes de refutarla.
 */
export function EvaNote({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-indigo-500/25 bg-indigo-500/[0.06] px-4 py-3">
      <span
        aria-hidden
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-indigo-400/40 bg-indigo-500/20 mono text-[10px] font-bold text-indigo-300"
      >
        EVA
      </span>
      <p className="text-sm italic text-indigo-100/90 leading-relaxed">{children}</p>
    </div>
  );
}

// ─── Varios ──────────────────────────────────────────────────────────────────

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <div className="mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">{children}</div>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">{children}</div>;
}

export function StepHeading({ n, children }: { n: number | string; children: ReactNode }) {
  return (
    <h3 className="flex items-center gap-2.5 text-base font-semibold text-white">
      <span className="mono flex h-6 w-6 shrink-0 items-center justify-center rounded border border-cyan-500/30 bg-cyan-500/10 text-[11px] font-bold text-cyan-400">
        {n}
      </span>
      {children}
    </h3>
  );
}

/** Tabla que en móvil se convierte en tarjetas verticales. */
export function ResponsiveRows({
  head, rows,
}: {
  head: readonly string[];
  rows: readonly (readonly ReactNode[])[];
}) {
  return (
    <>
      <div className="hidden overflow-x-auto rounded-xl border border-white/[0.08] md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.08] bg-white/[0.03]">
              {head.map(h => (
                <th key={h} scope="col" className="px-3 py-2.5 mono text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-white/[0.05] last:border-0">
                {r.map((cell, j) => (
                  <td key={j} className="px-3 py-2.5 align-top text-zinc-300">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-2.5 md:hidden">
        {rows.map((r, i) => (
          <div key={i} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5">
            {r.map((cell, j) => (
              <div key={j} className="border-b border-white/[0.05] py-1.5 last:border-0 last:pb-0 first:pt-0">
                <div className="mono text-[9px] font-bold uppercase tracking-wider text-zinc-500">{head[j]}</div>
                <div className="mt-0.5 text-sm text-zinc-300">{cell}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
