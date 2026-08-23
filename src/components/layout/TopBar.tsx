'use client';
import { usePathname } from 'next/navigation';
import { Zap } from 'lucide-react';
import { identity, institution, schedule, registration } from '@/data/program';

const titles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: identity.shortName, subtitle: `${institution.program} · ${identity.tagline}` },
  '/modulos': { title: 'Programa del taller', subtitle: `Las 3 sesiones · ${schedule.datesShort}` },
  '/sesiones/1': { title: 'Sesión 1 · Razonamiento asistido', subtitle: `Jueves 27 de agosto · ${schedule.time}` },
  '/sesiones/2': { title: 'Sesión 2 · Laboratorio jurídico', subtitle: `Jueves 3 de septiembre · ${schedule.time}` },
  '/sesiones/3': { title: 'Sesión 3 · Match Making', subtitle: `Jueves 10 de septiembre · ${schedule.time}` },
  '/verificacion': { title: 'Verificación', subtitle: 'Sesión 1 · Cazador de alucinaciones y matriz' },
  '/flujo': { title: 'Flujo', subtitle: 'Sesión 2 · Constructor de flujos y registro de validación' },
  '/match': { title: 'Match Making', subtitle: 'Sesión 3 · Ficha de desafío, pitch y rúbrica' },
  '/ruta': { title: 'Ruta de aprendizaje', subtitle: 'Las tres sesiones en ocho pasos' },
  '/materiales': { title: 'Materiales', subtitle: 'Plantillas, casos, presentaciones y guiones' },
  '/glosario': { title: 'Glosario', subtitle: 'Vocabulario mínimo de IA aplicada al Derecho' },
  '/prompt-lab': { title: 'Prompt Lab', subtitle: 'Recurso complementario · Constructor de prompts jurídicos' },
  '/flashcards': { title: 'Flashcards', subtitle: 'Recurso complementario · Repaso de conceptos' },
  '/toolkit': { title: 'Toolkit', subtitle: 'Recurso complementario · Guías rápidas de herramientas' },
  '/herramientas': { title: 'Herramientas', subtitle: 'Recurso complementario · Catálogo de plataformas' },
  '/dossier': { title: 'Dossier', subtitle: `${identity.name} · ${institution.faculty}` },
};

export function TopBar() {
  const pathname = usePathname();
  const info = pathname.startsWith('/clase-1')
    ? { title: 'Clase 1 · Razonamiento jurídico asistido', subtitle: 'Trabajo individual guiado · 27 de agosto de 2026' }
    : titles[pathname] ?? { title: institution.program, subtitle: '' };
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
