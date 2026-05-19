'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, Calendar, Copy, Check, ExternalLink } from 'lucide-react';

const EMAIL = 'programadiat@pucv.cl';
const SUBJECT = 'Interés en taller de IA jurídica y prompting DIAT';
const BODY = `Hola Programa DIAT:

Quisiera reservar un cupo y recibir más información sobre el taller de IA jurídica y prompting avanzado que se realizará durante septiembre.

Nombre:
Carrera / profesión:
Correo:
Teléfono (opcional):
Comentarios:

Muchas gracias.`;

const MAILTO =
  'mailto:' + EMAIL +
  '?subject=' + encodeURIComponent(SUBJECT) +
  '&body=' + encodeURIComponent(BODY);

const GMAIL_URL =
  'https://mail.google.com/mail/?view=cm' +
  '&to=' + encodeURIComponent(EMAIL) +
  '&su=' + encodeURIComponent(SUBJECT) +
  '&body=' + encodeURIComponent(BODY);

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2200);
    return () => clearTimeout(t);
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select & execCommand
      const el = document.createElement('textarea');
      el.value = EMAIL;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (dismissed) return null;

  return (
    <>
      {/* ── Desktop floating card (right side) ── */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            transition={{ type: 'spring', damping: 22, stiffness: 200 }}
            className="hidden lg:block fixed right-6 bottom-8 z-50 w-72"
          >
            <div className="rounded-2xl border border-cyan-500/30 bg-[oklch(0.09_0.02_250/0.97)] shadow-2xl shadow-cyan-500/10 backdrop-blur-xl overflow-hidden">
              {/* Top accent line */}
              <div className="h-0.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-transparent" />

              <div className="p-4 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="text-[10px] mono font-bold text-cyan-400 uppercase tracking-widest">
                        Cupos disponibles
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      Reserva tu lugar en DIAT 2026
                    </div>
                  </div>
                  <button
                    onClick={() => setDismissed(true)}
                    className="text-zinc-600 hover:text-zinc-400 transition-colors -mt-0.5 -mr-0.5 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                  <Calendar className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                  8 · 15 · 22 Septiembre 2026 · Fechas tentativas
                </div>

                {/* Option A: Gmail webmail (works on any PC without mail client) */}
                <a
                  href={GMAIL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-300 text-black text-sm font-bold transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Escribir correo de reserva
                </a>

                {/* Option B: native mailto (for users with Outlook/Apple Mail) */}
                <a
                  href={MAILTO}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-200 text-xs font-medium transition-all"
                >
                  <ExternalLink className="w-3 h-3" />
                  Abrir con cliente de correo
                </a>

                {/* Fallback: visible email + copy */}
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 flex-1 truncate mono select-all">
                    {EMAIL}
                  </span>
                  <button
                    onClick={copyEmail}
                    className="flex items-center gap-1 text-[10px] text-zinc-600 hover:text-cyan-400 transition-colors shrink-0"
                    title="Copiar dirección"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[9px] text-zinc-700 text-center">
                  Facultad de Derecho PUCV · Cupos limitados
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile bottom bar ── */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 22, stiffness: 180 }}
            className="lg:hidden fixed bottom-[72px] left-0 right-0 z-50 px-3 pb-1"
          >
            <div className="rounded-2xl border border-cyan-500/30 bg-[oklch(0.09_0.02_250/0.97)] backdrop-blur-xl px-4 py-3 shadow-2xl shadow-black/50 overflow-hidden">
              <div className="h-px bg-gradient-to-r from-cyan-500 via-indigo-500 to-transparent -mx-4 mb-3" />
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">Reserva tu cupo — DIAT 2026</div>
                  <div className="text-[10px] text-zinc-500 truncate">Facultad de Derecho PUCV · Cupos limitados</div>
                </div>
                <a
                  href={GMAIL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-colors shrink-0"
                >
                  <Mail className="w-3 h-3" />
                  Reservar
                </a>
                <button
                  onClick={copyEmail}
                  className="flex items-center justify-center w-8 h-8 rounded-xl border border-white/10 bg-white/[0.04] text-zinc-500 hover:text-cyan-400 transition-colors shrink-0"
                  title="Copiar email"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setDismissed(true)}
                  className="text-zinc-600 hover:text-zinc-400 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
