'use client';
// ─────────────────────────────────────────────────────────────────────────────
// CRONÓMETRO DE EJERCICIO
//
// Cuenta regresiva grande y legible, también en teléfono. El instante de
// arranque vive en el estado persistido, no en el componente: un rerender, una
// navegación o una recarga no lo reinician, y al volver a la etapa el reloj
// sigue donde estaba.
//
// Al llegar a cero no se bloquea nada ni se pierde nada: aparece un aviso y el
// estudiante termina. La pedagogía no puede depender de que un temporizador se
// convierta en guardia.
//
// Accesibilidad: el estado nunca se comunica solo por color. Hay texto visible
// y un `role="timer"` con anuncio por minuto, no por segundo.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import { RotateCcw, TimerIcon } from 'lucide-react';
import type { StageId } from '@/content/class1/stages';
import { COUNTDOWN_TIMEUP, COUNTDOWN_WARNING_SECONDS } from '@/content/class1/timers';
import { useClass1 } from '@/lib/class1/store';

function format(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

export function StageTimer({ stage }: { stage: StageId }) {
  const { state, hydrated, startTimer, restartTimer } = useClass1();
  const [remaining, setRemaining] = useState<number | null>(null);
  const [confirmRestart, setConfirmRestart] = useState(false);

  const timer = state.timers[stage];

  // El cronómetro arranca al entrar en el ejercicio, una sola vez.
  useEffect(() => {
    if (hydrated) startTimer(stage);
  }, [hydrated, stage, startTimer]);

  // El resto se recalcula contra el reloj real, no contando ticks: si el móvil
  // suspende la pestaña, al volver el tiempo mostrado sigue siendo correcto.
  useEffect(() => {
    if (!timer) return;
    const started = new Date(timer.startedAt).getTime();
    const duration = timer.durationSec;
    if (Number.isNaN(started)) return;

    function tick() {
      const elapsed = (Date.now() - started) / 1000;
      setRemaining(Math.max(0, Math.round(duration - elapsed)));
    }
    tick();
    const id = window.setInterval(tick, 500);
    return () => window.clearInterval(id);
  }, [timer]);

  useEffect(() => {
    if (!confirmRestart) return;
    const id = window.setTimeout(() => setConfirmRestart(false), 4000);
    return () => window.clearTimeout(id);
  }, [confirmRestart]);

  if (!hydrated || remaining === null) {
    return <div className="h-[52px] w-full rounded-xl border border-white/[0.08] bg-white/[0.02] sm:w-44" aria-hidden />;
  }

  const done = remaining === 0;
  const warning = !done && remaining <= COUNTDOWN_WARNING_SECONDS;

  const tone = done
    ? 'border-amber-500/50 bg-amber-500/[0.10] text-amber-200'
    : warning
      ? 'border-amber-500/40 bg-amber-500/[0.07] text-amber-300'
      : 'border-white/[0.12] bg-white/[0.03] text-zinc-200';

  return (
    <div className="w-full sm:w-auto">
      <div className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 ${tone}`}>
        <TimerIcon className="h-4 w-4 shrink-0" aria-hidden />
        <span
          role="timer"
          aria-live="off"
          className="mono text-2xl font-bold leading-none tabular-nums sm:text-[1.75rem]"
        >
          {format(remaining)}
        </span>
        <span className="min-w-0 flex-1 text-[11px] leading-tight sm:max-w-[11rem]">
          {done ? COUNTDOWN_TIMEUP : warning ? 'Queda menos de un minuto.' : 'Tiempo del ejercicio'}
        </span>
        {confirmRestart ? (
          <button
            type="button"
            onClick={() => { restartTimer(stage); setConfirmRestart(false); }}
            className="mono flex min-h-11 shrink-0 items-center rounded-lg border border-amber-500/50 px-2.5 text-[10px] font-bold uppercase tracking-wider text-amber-200"
          >
            Confirmar
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmRestart(true)}
            aria-label="Reiniciar el cronómetro de este ejercicio"
            title="Reiniciar el cronómetro"
            className="flex min-h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/[0.10] text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>
      {done && (
        <p role="status" className="sr-only">
          {COUNTDOWN_TIMEUP}
        </p>
      )}
    </div>
  );
}
