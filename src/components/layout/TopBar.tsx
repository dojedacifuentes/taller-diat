'use client';
import { usePathname } from 'next/navigation';
import { Zap } from 'lucide-react';

const titles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'DIAT 2026', subtitle: 'Programa de IA Jurídica · PUCV' },
  '/modulos': { title: 'Las 3 Misiones', subtitle: 'Septiembre 2026 · Módulos del programa' },
  '/prompt-lab': { title: 'Prompt Lab', subtitle: 'Constructor de prompts jurídicos profesionales' },
  '/flashcards': { title: 'Flashcards IA', subtitle: '30 cartas para dominar la IA' },
  '/toolkit': { title: 'Toolkit IA', subtitle: 'Guías rápidas y flujos multi-IA' },
  '/dossier': { title: 'Dossier DIAT 2026', subtitle: 'Programa editorial premium · Facultad de Derecho PUCV' },
};

export function TopBar() {
  const pathname = usePathname();
  const info = titles[pathname] ?? { title: 'DIAT', subtitle: '' };
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[oklch(0.07_0.015_250/0.8)] backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 lg:px-6 h-14">
        <div className="flex items-center gap-3">
          <div className="lg:hidden w-7 h-7 rounded-md bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white leading-tight">{info.title}</div>
            <div className="text-[11px] text-zinc-500 leading-tight hidden sm:block">{info.subtitle}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/5">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-[11px] text-yellow-400 font-medium mono">PRÓXIMAMENTE</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5">
            <span className="text-[11px] text-cyan-400 font-bold mono">8 · 15 · 22 SEP</span>
          </div>
        </div>
      </div>
    </header>
  );
}
