'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, Calendar, ArrowRight } from 'lucide-react';

const MAILTO =
  'mailto:programadiat@pucv.cl' +
  '?subject=Inter%C3%A9s%20en%20taller%20de%20IA%20jur%C3%ADdica%20y%20prompting%20DIAT' +
  '&body=Hola%20Programa%20DIAT%3A%0A%0AQuisiera%20reservar%20un%20cupo%20y%20recibir%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20taller%20de%20IA%20jur%C3%ADdica%20y%20prompting%20avanzado%20que%20se%20realizar%C3%A1%20durante%20septiembre.%0A%0ANombre%3A%0ACarrera%20%2F%20profesi%C3%B3n%3A%0ACorreo%3A%0ATel%C3%A9fono%20opcional%3A%0AComentarios%3A%0A%0AMuchas%20gracias.';

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Show after 2 seconds
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  if (dismissed) return null;

  return (
    <>
      {/* Desktop: floating right side */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="hidden lg:flex fixed right-6 bottom-8 z-50 flex-col items-end gap-2"
          >
            {/* Expanded card */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="w-72 rounded-2xl border border-cyan-500/30 bg-[oklch(0.09_0.02_250)] shadow-2xl shadow-cyan-500/10 p-5 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-bold text-white leading-tight">
                        Reserva tu cupo
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        Taller IA Jurídica · Septiembre 2026
                      </div>
                    </div>
                    <button
                      onClick={() => setExpanded(false)}
                      className="text-zinc-600 hover:text-zinc-400 transition-colors ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>8 · 15 · 22 Septiembre 2026</span>
                  </div>

                  <div className="text-[11px] text-zinc-500 leading-relaxed">
                    Programa DIAT · Facultad de Derecho PUCV · 3 módulos presenciales · 6 horas · Certificación institucional
                  </div>

                  <a
                    href={MAILTO}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Enviar solicitud de cupo
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>

                  <div className="text-[9px] text-zinc-700 text-center">
                    Cupos limitados · Fechas tentativas · Septiembre 2026
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Trigger button */}
            <motion.button
              onClick={() => setExpanded(v => !v)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2.5 px-4 py-3 rounded-2xl border border-cyan-500/40 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 font-bold text-sm shadow-lg shadow-cyan-500/10 transition-colors backdrop-blur-sm"
            >
              <Mail className="w-4 h-4" />
              Reservar cupo
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </motion.button>

            {/* Dismiss */}
            <button
              onClick={() => setDismissed(true)}
              className="text-[10px] text-zinc-700 hover:text-zinc-500 transition-colors"
            >
              No gracias
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile: bottom bar */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 22, stiffness: 180 }}
            className="lg:hidden fixed bottom-[72px] left-0 right-0 z-50 px-4 pb-1"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-cyan-500/30 bg-[oklch(0.09_0.02_250/0.95)] backdrop-blur-xl px-4 py-3 shadow-2xl shadow-black/40">
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white truncate">Reserva tu cupo — Sep 2026</div>
                <div className="text-[10px] text-zinc-500 truncate">DIAT · Facultad de Derecho PUCV · Cupos limitados</div>
              </div>
              <a
                href={MAILTO}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-colors shrink-0"
              >
                <Mail className="w-3 h-3" />
                Inscribirse
              </a>
              <button
                onClick={() => setDismissed(true)}
                className="text-zinc-600 hover:text-zinc-400 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
