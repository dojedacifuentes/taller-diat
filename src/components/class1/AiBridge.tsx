'use client';
// ─────────────────────────────────────────────────────────────────────────────
// AI BRIDGE
//
// La plataforma no integra ninguna API generativa. Prepara el texto, lo entrega
// al portapapeles y abre la herramienta del estudiante en otra pestaña. La
// separación instrucción → modelo → salida → verificación queda a la vista:
// es contenido de la clase, no una limitación técnica que haya que disimular.
// ─────────────────────────────────────────────────────────────────────────────
import { ExternalLink } from 'lucide-react';
import { AI_TOOLS, AI_TOOL_NOTEBOOK, type AiTool } from '@/content/class1/prompts';
import { CopyButton } from './ui';

export function AiBridge({
  payload,
  copyLabel = 'Copiar para llevar a la IA',
  tools = AI_TOOLS,
  selectedTool,
  onSelectTool,
  note,
}: {
  /** Texto que el estudiante llevará a su herramienta. */
  payload: string;
  copyLabel?: string;
  tools?: readonly AiTool[];
  /** Si se pasa, abrir una herramienta la registra en la Bitácora. */
  selectedTool?: string | null;
  onSelectTool?: (id: string) => void;
  note?: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.10] bg-white/[0.02] p-4">
      <div className="mono text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-300">
        Puente hacia tu herramienta
      </div>
      <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
        {note ??
          'Copia el texto, ejecútalo en tu propia cuenta y vuelve aquí con el resultado. DIAT no ejecuta el modelo por ti: esa separación es parte de lo que se enseña.'}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <CopyButton text={payload} label={copyLabel} />
        {tools.map(t => {
          const active = selectedTool === t.id;
          return (
            <a
              key={t.id}
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onSelectTool?.(t.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 ${
                active
                  ? 'border-indigo-500/50 bg-indigo-500/15 text-indigo-200'
                  : 'border-white/[0.12] bg-white/[0.04] text-zinc-300 hover:border-indigo-500/40 hover:text-indigo-300'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5" aria-hidden />
              Abrir {t.label}
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          );
        })}
      </div>

      <p className="mt-3 border-t border-white/[0.06] pt-2.5 text-[11px] text-amber-300/70 leading-relaxed">
        Recuerda la regla de aula: no subas datos personales, antecedentes de clientes ni información
        confidencial. Trabaja solo con material público o anonimizado.
      </p>
    </div>
  );
}

export { AI_TOOL_NOTEBOOK };
