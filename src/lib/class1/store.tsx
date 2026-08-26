'use client';
// ─────────────────────────────────────────────────────────────────────────────
// CLASE 1 · STORE
//
// Local-first: nada sale del navegador hasta que el estudiante pulsa «Enviar».
//
// El estado vive en un store externo mínimo al que React se suscribe con
// `useSyncExternalStore`. Esto resuelve tres cosas de golpe:
//
//   · la hidratación no necesita un efecto que haga setState y provoque un
//     render en cascada al entrar en cada etapa;
//   · el trabajo sobrevive a que el proveedor se vuelva a montar al navegar
//     entre etapas, porque el estado no cuelga de un componente;
//   · la escritura en localStorage ocurre en la propia acción del estudiante,
//     que es cuando realmente hay algo que guardar.
// ─────────────────────────────────────────────────────────────────────────────
import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { class1ActivityDurations } from '@/content/class1/timers';
import type { StageId } from '@/content/class1/stages';
import {
  createInitialState, loadState, saveState, clearState, type Class1State,
} from './state';
import { computeProgress, type Class1Progress } from './progress';

type Updater = (draft: Class1State) => Class1State;

// ─── Store externo ───────────────────────────────────────────────────────────

/** Instantánea del servidor: estable entre renders, como exige React. */
const SERVER_SNAPSHOT: Class1State = createInitialState();

let snapshot: Class1State | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): Class1State {
  // La lectura del disco ocurre una sola vez, en el primer render de cliente.
  if (!snapshot) snapshot = loadState();
  return snapshot;
}

function getServerSnapshot(): Class1State {
  return SERVER_SNAPSHOT;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit() {
  for (const listener of listeners) listener();
}

function apply(fn: Updater): void {
  const now = new Date().toISOString();
  const next = fn(getSnapshot());
  snapshot = { ...next, startedAt: next.startedAt ?? now, updatedAt: now };
  saveState(snapshot);
  emit();
}

// El indicador de hidratación no necesita estado: es `false` en el servidor y
// `true` en cuanto React toma el control en el cliente.
const NOOP_UNSUBSCRIBE = () => {};
function subscribeNever(): () => void {
  return NOOP_UNSUBSCRIBE;
}

// ─── Contexto ────────────────────────────────────────────────────────────────

interface Class1Context {
  state: Class1State;
  progress: Class1Progress;
  hydrated: boolean;
  update: (fn: Updater) => void;
  reset: () => void;
  /** Arranca el cronómetro de la etapa si aún no corría. Idempotente. */
  startTimer: (id: StageId) => void;
  /** Reinicia el cronómetro de la etapa. Solo a petición explícita. */
  restartTimer: (id: StageId) => void;
}

const Ctx = createContext<Class1Context | null>(null);

export function Class1Provider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(subscribeNever, () => true, () => false);

  const update = useCallback((fn: Updater) => apply(fn), []);

  const reset = useCallback(() => {
    clearState();
    snapshot = createInitialState();
    emit();
  }, []);

  // El cronómetro no se reinicia por un rerender ni por volver a la etapa: si
  // ya hay marca de arranque, esta llamada no hace nada.
  const startTimer = useCallback((id: StageId) => {
    if (getSnapshot().timers[id]) return;
    apply(prev => ({
      ...prev,
      timers: {
        ...prev.timers,
        [id]: { startedAt: new Date().toISOString(), durationSec: class1ActivityDurations[id] },
      },
    }));
  }, []);

  const restartTimer = useCallback((id: StageId) => {
    apply(prev => ({
      ...prev,
      timers: {
        ...prev.timers,
        [id]: { startedAt: new Date().toISOString(), durationSec: class1ActivityDurations[id] },
      },
    }));
  }, []);

  const progress = useMemo(() => computeProgress(state), [state]);

  const value = useMemo(
    () => ({ state, progress, hydrated, update, reset, startTimer, restartTimer }),
    [state, progress, hydrated, update, reset, startTimer, restartTimer],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useClass1(): Class1Context {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useClass1 debe usarse dentro de <Class1Provider>.');
  return ctx;
}
