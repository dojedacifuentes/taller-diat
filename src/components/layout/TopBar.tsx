'use client';
import { usePathname } from 'next/navigation';
import { Zap } from 'lucide-react';

const titles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Control Room', subtitle: 'Vista general del programa' },
  '/timeline': { title: 'Timeline DIAT', subtitle: 'Módulos — Septiembre 2026' },
  '/herramientas': { title: 'Biblioteca IA', subtitle: 'Herramientas para práctica jurídica' },
  '/admin': { title: 'Panel Admin', subtitle: 'Métricas y gestión del programa' },
  '/equipo': { title: 'Equipo Operativo', subtitle: 'Estructura de roles DIAT' },
  '/autoridad': { title: 'Modo Autoridades', subtitle: 'Impacto institucional y escalabilidad' },
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
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] text-cyan-400 font-medium mono">M2 ACTIVO</span>
          </div>
        </div>
      </div>
    </header>
  );
}
