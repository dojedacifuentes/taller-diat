'use client';
// ─────────────────────────────────────────────────────────────────────────────
// RESILIENCIA EN SALA
//
// Registra un service worker conservador mientras el estudiante está en
// /clase-1. Estrategia deliberadamente modesta: red primero para navegaciones,
// caché como respaldo; caché primero solo para los estáticos inmutables de
// Next.js. No precachea rutas ni intenta ser una PWA instalable: el objetivo es
// que una caída de wifi a mitad de clase no interrumpa una actividad ya abierta.
//
// Si el navegador no soporta service workers, no pasa nada: todo el trabajo vive
// en localStorage y las actividades son client-side.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineReady() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
    // El registro se pospone hasta que la página esté ociosa: no compite con el
    // primer render, que en clase presencial es lo que se nota.
    const id = window.setTimeout(() => {
      navigator.serviceWorker.register('/clase1-sw.js').catch(() => {
        // Sin service worker la experiencia sigue funcionando con red.
      });
    }, 2000);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    function on() { setOffline(false); }
    function off() { setOffline(true); }
    setOffline(typeof navigator !== 'undefined' && navigator.onLine === false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 lg:bottom-4"
    >
      <div className="flex items-center gap-2 rounded-full border border-amber-500/40 bg-[oklch(0.12_0.02_250)] px-3.5 py-2 shadow-lg">
        <WifiOff className="h-3.5 w-3.5 text-amber-400" aria-hidden />
        <span className="text-xs text-amber-200">
          Sin conexión. Tu trabajo se sigue guardando en este dispositivo.
        </span>
      </div>
    </div>
  );
}
