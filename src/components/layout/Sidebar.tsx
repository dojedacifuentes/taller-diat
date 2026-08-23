'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home, Rocket, Zap, Layers, Wrench, BookOpen, ShieldCheck, Workflow,
  Users, Route, Download, Library,
  type LucideIcon,
} from 'lucide-react';
import { identity, institution, schedule, registration, sessions } from '@/data/program';

/** Programa oficial del taller. */
const programNav = [
  { href: '/', icon: Home, label: 'Inicio' },
  { href: '/modulos', icon: Layers, label: 'Las 3 sesiones' },
  ...sessions.map(s => ({
    href: `/sesiones/${s.id}`,
    icon: Layers,
    label: `${s.displayDateShort} · ${s.shortTitle}`,
    nested: true,
  })),
  { href: '/dossier', icon: BookOpen, label: 'Dossier' },
];

/** Herramientas que se usan dentro de la sala. */
const toolNav = [
  { href: '/prompt-lab', icon: Zap, label: 'Prompt Lab' },
  { href: '/verificacion', icon: ShieldCheck, label: 'Verificación' },
  { href: '/flujo', icon: Workflow, label: 'Flujo' },
  { href: '/match', icon: Users, label: 'Match Making' },
];

/** Recursos de apoyo, dentro y fuera de la sala. */
const resourceNav = [
  { href: '/ruta', icon: Route, label: 'Ruta de aprendizaje' },
  { href: '/materiales', icon: Download, label: 'Materiales' },
  { href: '/glosario', icon: Library, label: 'Glosario' },
  { href: '/flashcards', icon: Rocket, label: 'Flashcards' },
  { href: '/toolkit', icon: Wrench, label: 'Toolkit' },
];

interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
  nested?: boolean;
}

function NavGroup({ title, items, pathname }: { title: string; items: NavItem[]; pathname: string }) {
  return (
    <>
      <div className="px-3 pt-5 pb-1.5 text-[9px] mono font-bold text-zinc-700 uppercase tracking-[0.18em] first:pt-0">
        {title}
      </div>
      {items.map(({ href, icon: Icon, label, nested }) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href} aria-current={active ? 'page' : undefined}>
            <motion.div
              className={`flex items-center gap-3 rounded-lg text-sm font-medium transition-colors relative ${
                nested ? 'pl-8 pr-3 py-2 text-[13px]' : 'px-3 py-2.5'
              } ${
                active
                  ? 'text-cyan-300 bg-cyan-500/10'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
              whileHover={{ x: 2 }}
              transition={{ duration: 0.15 }}
            >
              {active && (
                <motion.div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-cyan-400 rounded-full"
                  layoutId="sidebar-indicator"
                />
              )}
              {!nested && <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-cyan-400' : ''}`} />}
              <span className="truncate">{label}</span>
            </motion.div>
          </Link>
        );
      })}
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  if (pathname.startsWith('/clase-1')) return null;
  return (
    <aside
      className="hidden lg:flex flex-col w-60 h-screen sticky top-0 border-r border-white/[0.06] bg-[oklch(0.08_0.016_250)] shrink-0"
      aria-label="Navegación principal"
    >
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
          <Zap className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <div className="text-xs font-bold tracking-widest text-cyan-400 mono uppercase">DIAT</div>
          <div className="text-[10px] text-zinc-500 leading-tight">{identity.shortName}</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <NavGroup title="Programa oficial" items={programNav} pathname={pathname} />
        <NavGroup title="Herramientas de sala" items={toolNav} pathname={pathname} />
        <NavGroup title="Recursos" items={resourceNav} pathname={pathname} />
      </nav>

      <div className="px-4 py-4 border-t border-white/[0.06] space-y-2">
        <div className="text-[10px] text-zinc-700 uppercase tracking-widest mono font-medium">
          {institution.program}
        </div>
        <div className="text-[10px] text-zinc-600 leading-snug">
          {institution.faculty}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="mono text-[11px] font-bold text-cyan-400">{schedule.datesShort}</span>
        </div>
        <div className="text-[10px] text-zinc-600 mono">{schedule.time}</div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
          <span className="text-[10px] text-yellow-500 font-medium mono">{registration.statusLabel}</span>
        </div>
      </div>
    </aside>
  );
}
