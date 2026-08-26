// ─────────────────────────────────────────────────────────────────────────────
// CLASE 1 · DURACIONES DE LOS EJERCICIOS
//
// Punto único de verdad para el cronómetro. Ningún componente escribe minutos
// a mano: se cambian aquí y la sala entera cambia con ellos. Cuando se realineen
// el PPT y el guion docente, este es el archivo que se toca.
// ─────────────────────────────────────────────────────────────────────────────

import type { StageId } from './stages';

/**
 * Duración de cada ejercicio, en segundos.
 *
 * Suman 39 de los 90 minutos de la sesión. Los 51 restantes son conducción
 * docente: el reparto está cuadrado con el Guion docente de sala v2.2 y con los
 * minutos `at` del deck. Si se cambia un número aquí, hay que cambiarlo en los
 * tres sitios — por eso el guion y el deck se generan, no se escriben a mano.
 */
export const class1ActivityDurations: Record<StageId, number> = {
  pregunta: 3 * 60,
  prompt: 14 * 60,
  auditoria: 8 * 60,
  verificacion: 8 * 60,
  cierre: 6 * 60,
};

/** Umbral de aviso: por debajo de este resto, el cronómetro avisa. */
export const COUNTDOWN_WARNING_SECONDS = 60;

/** Mensaje único al llegar a cero. No bloquea ni borra nada. */
export const COUNTDOWN_TIMEUP = 'Tiempo. Termina tu respuesta y continúa.';
