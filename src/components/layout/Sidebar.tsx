'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarDays,
  Cpu,
  BarChart3,
  Users,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const nav = [
  { href: '/', icon: LayoutDashboard, label: 'Control Room' },
  { href: '/timeline', icon: CalendarDays, label: 'Timeline' },
  { href: '/herramientas', icon: Cpu, label: 'Herramientas IA' },
  { href: '/admin', icon: BarChart3, label: 'Panel Admin' },
  { href: '/equipo', icon: Users, label: 'Equipo' },
  { href: '/autoridad', icon: ShieldCheck, label: 'Autoridades' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-white/[0.06] bg-[oklch(0.08_0.016_250)] shrink-0">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
          <Zap className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <div className="text-xs font-bold tracking-widest text-cyan-400 mono uppercase">DIAT</div>
          <div className="text-[10px] text-zinc-500 leading-tight">Prompting Hub</div>
        </div>
      </div>

      <div className="px-3 py-2 border-b border-white/[0.06]">
        <div className="px-3 py-1.5">
          <div className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium">Módulo Activo</div>
          <div className="text-xs text-cyan-400 font-medium mt-0.5">Módulo 2 — En curso</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}>
              <motion.div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative ${
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
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-cyan-400' : ''}`} />
                {label}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-white/[0.06]">
        <div className="text-[10px] text-zinc-600">Facultad de Derecho</div>
        <div className="text-[10px] text-zinc-700">PUCV · Septiembre 2026</div>
      </div>
    </aside>
  );
}
