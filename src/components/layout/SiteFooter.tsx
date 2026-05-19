'use client';
import Link from 'next/link';
import { Mail, ExternalLink, Shield } from 'lucide-react';
import { InstitutionalLogoRow } from '@/components/common/InstitutionalLogos';

const MAILTO =
  'mailto:programadiat@pucv.cl' +
  '?subject=Inter%C3%A9s%20en%20taller%20de%20IA%20jur%C3%ADdica%20y%20prompting%20DIAT' +
  '&body=Hola%20Programa%20DIAT%3A%0A%0AQuisiera%20reservar%20un%20cupo%20y%20recibir%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20taller%20de%20IA%20jur%C3%ADdica%20y%20prompting%20avanzado%20que%20se%20realizar%C3%A1%20durante%20septiembre.%0A%0ANombre%3A%0ACarrera%20%2F%20profesi%C3%B3n%3A%0ACorreo%3A%0ATel%C3%A9fono%20opcional%3A%0AComentarios%3A%0A%0AMuchas%20gracias.';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/modulos', label: 'Módulos' },
  { href: '/prompt-lab', label: 'Prompt Lab' },
  { href: '/flashcards', label: 'Flashcards' },
  { href: '/toolkit', label: 'Toolkit' },
  { href: '/herramientas', label: 'Herramientas' },
  { href: '/equipo', label: 'Equipo' },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-[oklch(0.075_0.015_250)] mt-8">
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10 space-y-8">

        {/* Top row: Identity + CTA */}
        <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
          {/* Identity block */}
          <div className="space-y-3 max-w-sm">
            <InstitutionalLogoRow size="sm" />
            <div>
              <div className="text-sm font-bold text-white">Programa DIAT 2026</div>
              <div className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                Programa de formación aplicada en inteligencia artificial jurídica,
                prompting avanzado y nuevas competencias digitales para el ejercicio legal.
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-zinc-600">
              <Shield className="w-3 h-3 text-zinc-700 shrink-0" />
              Facultad de Derecho · PUCV · Valparaíso, Chile
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3 shrink-0">
            <div className="text-[11px] text-zinc-500 text-center md:text-right">
              Fechas tentativas · Septiembre 2026
            </div>
            <a
              href={MAILTO}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-sm font-bold transition-all group"
            >
              <Mail className="w-4 h-4" />
              Reservar cupo
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse ml-1" />
            </a>
            <div className="flex items-center gap-1 text-[10px] text-zinc-600 justify-center md:justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/60 animate-pulse" />
              Cupos limitados · 8 · 15 · 22 Sep 2026
            </div>
          </div>
        </div>

        {/* Nav links */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-white/[0.04] pt-6">
          {navLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Institutional credits */}
        <div className="border-t border-white/[0.04] pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-[10px] text-zinc-700 uppercase tracking-widest mono font-medium">Autoridades</div>
            <div className="space-y-0.5">
              <div className="text-[11px] text-zinc-500">
                <span className="text-zinc-400 font-medium">Eduardo Aldunate Lizana</span>
                {' '}— Director, Escuela de Derecho PUCV
              </div>
              <div className="text-[11px] text-zinc-500">
                <span className="text-zinc-400 font-medium">Dr. Adolfo Silva Walbaum</span>
                {' '}— Director Programa DIAT · Director del Taller
              </div>
              <div className="text-[11px] text-zinc-600 mt-1">
                Con apoyo de Vinculación con el Medio · PUCV
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] text-zinc-700 uppercase tracking-widest mono font-medium">Plataforma</div>
            <div className="text-[11px] text-zinc-600 leading-relaxed">
              Desarrollada íntegramente con inteligencia artificial como demostración práctica
              de las capacidades del Programa DIAT. Subdirección y Coordinación Operativa.
            </div>
            <div className="inline-flex items-center gap-1 text-[10px] text-zinc-700 mt-1">
              <span className="text-[9px] mono text-zinc-800">Construida con IA generativa · 2026</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.04] pt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="text-[10px] text-zinc-700 mono">
            © 2026 Programa DIAT · Facultad de Derecho PUCV · Todos los derechos reservados
          </div>
          <div className="text-[10px] text-zinc-700 mono">
            Prompting Hub v2.0 · Construido con IA
          </div>
        </div>

      </div>
    </footer>
  );
}
