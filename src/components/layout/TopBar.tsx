'use client';
import { usePathname } from 'next/navigation';
import { Zap } from 'lucide-react';
import { identity, institution, schedule, registration } from '@/data/program';

const titles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: identity.shortName, subtitle: `${institution.program} · ${identity.tagline}` },
  '/modulos': { title: 'Programa del taller', subtitle: `Las 3 sesiones · ${schedule.datesShort}` },
  '/prompt-lab': { title: 'Prompt Lab', subtitle: 'Recurso complementario · Constructor de prompts jurídicos' },
  '/flashcards': { title: 'Flashcards', subtitle: 'Recurso complementario · Repaso de conceptos' },
  '/toolkit': { title: 'Toolkit', subtitle: 'Recurso complementario · Guías rápidas de herramientas' },
  '/herramientas': { title: 'Herramientas', subtitle: 'Recurso complementario · Catálogo de plataformas' },
  '/dossier': { title: 'Dossier', subtitle: `${identity.name} · ${institution.faculty}` },
};

export function TopBar() {
  const pathname = usePathname();
  const info = titles[pathname] ?? { title: institution.program, subtitle: '' };
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
            <span className="text-[11px] text-yellow-400 font-medium mono">{registration.statusLabel}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5">
            <span className="text-[11px] text-cyan-400 font-bold mono">{schedule.datesShort}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
