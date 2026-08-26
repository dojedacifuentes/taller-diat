'use client';
// ─────────────────────────────────────────────────────────────────────────────
// PUENTE HACIA LA IA DEL ESTUDIANTE
//
// La plataforma no ejecuta modelos. Copia el texto y abre la herramienta que el
// estudiante elija. Esa separación —instrucción, modelo, salida, verificación—
// es contenido de la clase, no una carencia técnica que haya que disimular.
// ─────────────────────────────────────────────────────────────────────────────
import { ExternalLink } from 'lucide-react';
import { AI_TOOLS } from '@/content/class1/prompts';

export function AiBridge({
  selected, onSelect,
}: {
  selected?: string | null;
  onSelect?: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {AI_TOOLS.map(t => {
        const active = selected === t.id;
        return (
          <a
            key={t.id}
            href={t.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onSelect?.(t.id)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 ${
              active
                ? 'border-indigo-500/55 bg-indigo-500/15 text-indigo-200'
                : 'border-white/[0.12] bg-white/[0.04] text-zinc-300 hover:border-indigo-500/40 hover:text-indigo-300'
            }`}
          >
            <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {t.label}
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        );
      })}
    </div>
  );
}
