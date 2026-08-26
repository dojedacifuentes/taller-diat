'use client';
// ─────────────────────────────────────────────────────────────────────────────
// CLASE 1 · PIEZAS DE INTERFAZ
//
// Superficie de ejecución, no manual. Lo que hay aquí sirve para decidir rápido,
// copiar, escribir poco y seguir: botones grandes, áreas táctiles cómodas y
// ningún cuadro explicativo.
//
// Regla de accesibilidad transversal: ninguna decisión se comunica solo por
// color; siempre hay marca o texto que la acompaña.
// ─────────────────────────────────────────────────────────────────────────────
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Check, Copy, Download, Lock } from 'lucide-react';

// ─── Copiar ──────────────────────────────────────────────────────────────────

/**
 * Copia con respaldo: `navigator.clipboard` exige contexto seguro y permiso.
 * Cuando no está disponible se usa la selección oculta, que funciona en los
 * navegadores móviles antiguos que todavía aparecen en sala.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Se intenta el respaldo.
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '0';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export function CopyButton({
  text, label = 'Copiar', disabled = false, variant = 'ghost', className = '',
}: {
  text: string;
  label?: string;
  disabled?: boolean;
  variant?: 'ghost' | 'primary';
  className?: string;
}) {
  const [state, setState] = useState<'idle' | 'done' | 'failed'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const onClick = useCallback(async () => {
    const ok = await copyText(text);
    setState(ok ? 'done' : 'failed');
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), 2200);
  }, [text]);

  const base =
    variant === 'primary'
      ? 'border-cyan-500/45 bg-cyan-500/15 text-cyan-200 hover:bg-cyan-500/25'
      : 'border-white/[0.14] bg-white/[0.04] text-zinc-200 hover:border-cyan-500/40 hover:text-cyan-300';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.02] disabled:text-zinc-600 ${base} ${className}`}
    >
      {state === 'done' ? (
        <Check className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
      ) : (
        <Copy className="h-4 w-4 shrink-0" aria-hidden />
      )}
      <span>
        {state === 'done' ? 'Copiado ✓' : state === 'failed' ? 'Selecciona y copia' : label}
      </span>
    </button>
  );
}

/** Descarga un texto como archivo, sin depender de ningún servicio. */
export function downloadText(text: string, filename: string): void {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // El objeto se libera en el siguiente turno: Safari lo necesita vivo cuando
  // se dispara la descarga.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function DownloadButton({
  onClick, label = 'Descargar', disabled = false,
}: { onClick: () => void; label?: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.14] bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-zinc-200 transition-colors hover:border-cyan-500/40 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-not-allowed disabled:text-zinc-600"
    >
      <Download className="h-4 w-4 shrink-0" aria-hidden />
      {label}
    </button>
  );
}

// ─── Elecciones por botón ────────────────────────────────────────────────────

export interface ChipOption {
  id: string;
  label: string;
  hint?: string;
  badge?: string;
}

/** Selección única. Radios reales bajo la piel: teclado y lector de pantalla. */
export function ChipRadio({
  legend, options, value, onChange, columns = 2, disabled = false,
}: {
  legend: string;
  options: readonly ChipOption[];
  value: string | null;
  onChange: (id: string) => void;
  columns?: 1 | 2 | 3;
  disabled?: boolean;
}) {
  const name = useId();
  const cols = columns === 3 ? 'sm:grid-cols-3' : columns === 2 ? 'sm:grid-cols-2' : '';
  return (
    <fieldset disabled={disabled} className="min-w-0">
      <legend className="mb-2.5 text-sm font-semibold text-zinc-100">{legend}</legend>
      <div className={`grid gap-2 ${cols}`}>
        {options.map(o => {
          const on = value === o.id;
          return (
            <label
              key={o.id}
              className={`flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-cyan-400 ${
                on
                  ? 'border-cyan-500/55 bg-cyan-500/[0.12] text-white'
                  : 'border-white/[0.10] bg-white/[0.02] text-zinc-300 hover:border-white/25'
              } ${disabled ? 'cursor-default opacity-60' : ''}`}
            >
              <input
                type="radio"
                name={name}
                value={o.id}
                checked={on}
                onChange={() => onChange(o.id)}
                className="h-4 w-4 shrink-0 accent-cyan-400"
              />
              <span className="min-w-0">
                <span className="block text-sm font-medium leading-snug">
                  {o.label}
                  {o.badge && (
                    <span className="mono ml-2 rounded border border-cyan-500/35 bg-cyan-500/10 px-1.5 py-0.5 align-middle text-[9px] font-bold uppercase tracking-wider text-cyan-300">
                      {o.badge}
                    </span>
                  )}
                </span>
                {o.hint && <span className="mt-0.5 block text-xs leading-snug text-zinc-500">{o.hint}</span>}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Selección múltiple. Botones reales con `aria-pressed`. */
export function ChipToggles({
  legend, hint, options, values, onToggle,
}: {
  legend: string;
  hint?: string;
  options: readonly ChipOption[];
  values: readonly string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="min-w-0">
      <div className="mb-1 text-sm font-semibold text-zinc-100">{legend}</div>
      {hint && <p className="mb-2.5 text-xs leading-snug text-zinc-500">{hint}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map(o => {
          const on = values.includes(o.id);
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={on}
              onClick={() => onToggle(o.id)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 ${
                on
                  ? 'border-cyan-500/55 bg-cyan-500/[0.12] text-white'
                  : 'border-white/[0.10] bg-white/[0.02] text-zinc-400 hover:border-white/25 hover:text-zinc-200'
              }`}
            >
              <span
                aria-hidden
                className={`mono flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] font-bold ${
                  on ? 'border-cyan-400/60 bg-cyan-500/25 text-cyan-200' : 'border-white/20 text-transparent'
                }`}
              >
                ✓
              </span>
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Campos ──────────────────────────────────────────────────────────────────

export function TextField({
  label, value, onChange, placeholder, type = 'text', hint, id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: 'text' | 'email';
  hint?: string;
  id?: string;
}) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <div className="min-w-0">
      <label htmlFor={fieldId} className="mb-1 block text-sm font-medium text-zinc-200">{label}</label>
      {hint && <p className="mb-1.5 text-xs leading-snug text-zinc-500">{hint}</p>}
      <input
        id={fieldId}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-11 w-full rounded-xl border border-white/[0.12] bg-[oklch(0.09_0.016_250)] px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-cyan-500/50 focus:outline-2 focus:outline-offset-0 focus:outline-cyan-500/40"
      />
    </div>
  );
}

export function Field({
  label, hint, value, onChange, placeholder, rows = 3, maxLength, mono = false, id,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  mono?: boolean;
  id?: string;
}) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <div className="min-w-0">
      <label htmlFor={fieldId} className="mb-1 block text-sm font-medium text-zinc-200">{label}</label>
      {hint && <p className="mb-1.5 text-xs leading-snug text-zinc-500">{hint}</p>}
      <textarea
        id={fieldId}
        rows={rows}
        maxLength={maxLength}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full resize-y rounded-xl border border-white/[0.12] bg-[oklch(0.09_0.016_250)] px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-cyan-500/50 focus:outline-2 focus:outline-offset-0 focus:outline-cyan-500/40 ${
          mono ? 'mono text-[12.5px] leading-relaxed' : ''
        }`}
      />
    </div>
  );
}

// ─── Prompt ──────────────────────────────────────────────────────────────────

/** Bloque de prompt: monoespaciada, sin scroll horizontal, con acciones arriba. */
export function PromptBlock({
  label, text, actions, note,
}: { label: string; text: string; actions?: ReactNode; note?: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.12]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5">
        <span className="mono text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-400">{label}</span>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      <pre className="mono max-h-[26rem] overflow-y-auto whitespace-pre-wrap break-words bg-[oklch(0.06_0.014_250)] px-3.5 py-3.5 text-[12.5px] leading-relaxed text-zinc-300">
        {text}
      </pre>
      {note && (
        <div className="border-t border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5 text-xs text-zinc-400">
          {note}
        </div>
      )}
    </div>
  );
}

// ─── Varios ──────────────────────────────────────────────────────────────────

/** Consigna de la pantalla. Una línea, nunca un párrafo. */
export function Brief({ children }: { children: ReactNode }) {
  return <p className="text-sm leading-relaxed text-zinc-400">{children}</p>;
}

export function StepHeading({ n, children }: { n: number | string; children: ReactNode }) {
  return (
    <h2 className="flex items-center gap-2.5 text-base font-semibold text-white">
      <span className="mono flex h-6 w-6 shrink-0 items-center justify-center rounded border border-cyan-500/30 bg-cyan-500/10 text-[11px] font-bold text-cyan-400">
        {n}
      </span>
      {children}
    </h2>
  );
}

export function Notice({
  tone = 'neutral', children,
}: { tone?: 'neutral' | 'warn'; children: ReactNode }) {
  const box =
    tone === 'warn'
      ? 'border-amber-500/30 bg-amber-500/[0.07] text-amber-200/90'
      : 'border-white/[0.10] bg-white/[0.02] text-zinc-400';
  return (
    <p role="status" className={`rounded-xl border px-3.5 py-2.5 text-xs leading-relaxed ${box}`}>
      {children}
    </p>
  );
}

/** Respuesta registrada: se bloquea porque es el punto de comparación. */
export function LockedNote({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5">
      <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden />
      <p className="text-xs leading-relaxed text-zinc-500">{children}</p>
    </div>
  );
}

export function PrimaryButton({
  children, onClick, disabled = false, type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-cyan-500/45 bg-cyan-500/15 px-5 py-3 text-sm font-semibold text-cyan-100 transition-colors hover:bg-cyan-500/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-zinc-600"
    >
      {children}
    </button>
  );
}

/** Contenedor de sección: separa sin decorar. */
export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-white/[0.10] bg-white/[0.02] p-4 sm:p-5 ${className}`}>
      {children}
    </section>
  );
}

/** Detalles colapsados. Cerrado por defecto: lo opcional no ocupa pantalla. */
export function Collapsible({
  summary, children, defaultOpen = false,
}: { summary: string; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group rounded-xl border border-white/[0.10] bg-white/[0.02]">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-sm font-medium text-zinc-300 transition-colors hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400">
        <span aria-hidden className="mono text-base leading-none text-cyan-400 group-open:hidden">+</span>
        <span aria-hidden className="mono hidden text-base leading-none text-cyan-400 group-open:inline">−</span>
        {summary}
      </summary>
      <div className="space-y-4 border-t border-white/[0.08] px-3.5 py-4">{children}</div>
    </details>
  );
}
