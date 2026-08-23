'use client';
// ─────────────────────────────────────────────────────────────────────────────
// CLASE 1 · STORE
//
// Contexto único para todo /clase-1. Local-first: nada sale del navegador.
// La hidratación se hace en un efecto para no romper el render del servidor;
// `hydrated` permite mostrar un esqueleto en lugar de un estado falso.
// ─────────────────────────────────────────────────────────────────────────────
import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
  type ReactNode,
} from 'react';
import type { BlockId } from '@/content/class1/manifest';
import {
  createInitialState, loadState, saveState, clearState, type Class1State,
} from './state';
import { computeProgress, milestones, type Class1Progress, type Milestone } from './progress';

type Updater = (draft: Class1State) => Class1State;

interface Class1Context {
  state: Class1State;
  progress: Class1Progress;
  awards: Milestone[];
  hydrated: boolean;
  update: (fn: Updater) => void;
  reset: () => void;
  markVisited: (id: BlockId) => void;
}

const Ctx = createContext<Class1Context | null>(null);

export function Class1Provider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Class1State>(createInitialState);
  const [hydrated, setHydrated] = useState(false);
  const dirty = useRef(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  // Solo se escribe tras la hidratación y tras un cambio real: así una visita
  // de solo lectura nunca sobrescribe el trabajo guardado.
  useEffect(() => {
    if (!hydrated || !dirty.current) return;
    saveState(state);
  }, [state, hydrated]);

  const update = useCallback((fn: Updater) => {
    dirty.current = true;
    setState(prev => {
      const next = fn(prev);
      const now = new Date().toISOString();
      return { ...next, startedAt: next.startedAt ?? now, updatedAt: now };
    });
  }, []);

  const reset = useCallback(() => {
    dirty.current = true;
    clearState();
    setState(createInitialState());
  }, []);

  const markVisited = useCallback((id: BlockId) => {
    setState(prev => {
      if (prev.visited.includes(id)) return prev;
      dirty.current = true;
      return { ...prev, visited: [...prev.visited, id] };
    });
  }, []);

  const progress = useMemo(() => computeProgress(state), [state]);
  const awards = useMemo(() => milestones(state, progress), [state, progress]);

  const value = useMemo(
    () => ({ state, progress, awards, hydrated, update, reset, markVisited }),
    [state, progress, awards, hydrated, update, reset, markVisited],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useClass1(): Class1Context {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useClass1 debe usarse dentro de <Class1Provider>.');
  return ctx;
}

/** Marca el bloque como visitado al montar. */
export function useVisitBlock(id: BlockId) {
  const { markVisited, hydrated } = useClass1();
  useEffect(() => {
    if (hydrated) markVisited(id);
  }, [hydrated, id, markVisited]);
}
