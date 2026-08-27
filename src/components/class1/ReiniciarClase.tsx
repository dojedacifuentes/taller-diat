'use client';
// ─────────────────────────────────────────────────────────────────────────────
// REINICIAR LA CLASE 1
//
// La pregunta guía se bloquea al confirmarla: comparar la intuición inicial con
// la final exige que la primera no se pueda retocar. Pero sin una salida
// explícita ese bloqueo se convierte en un callejón —el profesor no puede
// volver a demostrar la clase, y un dispositivo compartido arrastra el trabajo
// de quien lo usó antes—, y desde fuera parece que el botón está roto.
//
// Va detrás de dos clics y dice exactamente qué se pierde.
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { useClass1 } from '@/lib/class1/store';

export function ReiniciarClase({ onReset }: { onReset?: () => void }) {
  const { reset } = useClass1();
  const [confirmar, setConfirmar] = useState(false);

  if (!confirmar) {
    return (
      <button
        type="button"
        onClick={() => setConfirmar(true)}
        className="inline-flex items-center gap-1.5 text-xs text-zinc-500 underline underline-offset-2 transition-colors hover:text-rose-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
      >
        <RotateCcw className="h-3 w-3 shrink-0" aria-hidden />
        Empezar la Clase 1 de nuevo
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-rose-500/30 bg-rose-500/[0.07] px-3.5 py-3">
      <p className="text-xs leading-relaxed text-rose-200">
        Se borrará todo tu trabajo en este navegador: las dos respuestas a la pregunta guía, tu
        prompt, la auditoría y la verificación. <strong>No se puede deshacer.</strong> Si aún no has
        descargado tu Clase 1, hazlo antes.
      </p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            reset();
            setConfirmar(false);
            onReset?.();
          }}
          className="min-h-11 rounded-xl border border-rose-500/45 bg-rose-500/15 px-4 py-2 text-xs font-semibold text-rose-100 transition-colors hover:bg-rose-500/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
        >
          Sí, borrar y empezar de nuevo
        </button>
        <button
          type="button"
          onClick={() => setConfirmar(false)}
          className="min-h-11 rounded-xl border border-white/[0.14] px-4 py-2 text-xs text-zinc-300 transition-colors hover:border-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
