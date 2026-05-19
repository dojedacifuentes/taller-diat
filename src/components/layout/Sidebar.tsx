'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Rocket, Zap, Layers, Wrench } from 'lucide-react';

const nav = [
  { href: '/', icon: Home, label: 'Inicio' },
  { href: '/modulos', icon: Layers, label: 'Módulos' },
  { href: '/prompt-lab', icon: Zap, label: 'Prompt Lab' },
  { href: '/flashcards', icon: Rocket, label: 'Flashcards' },
  { href: '/toolkit', icon: Wrench, label: 'Toolkit IA' },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex flex-col w-60 h-screen sticky top-0 border-r border-white/[0.06] bg-[oklch(0.08_0.016_250)] shrink-0">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
          <Zap className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <div className="text-xs font-bold tracking-widest text-cyan-400 mono uppercase">DIAT</div>
          <div className="text-[10px] text-zinc-500 leading-tight">Prompting Hub · PUCV</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}>
              <motion.div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative ${
                  active ? 'text-cyan-300 bg-cyan-500/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
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

      <div className="px-4 py-4 border-t border-white/[0.06] space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] text-cyan-500 font-medium mono">M2 EN CURSO</span>
        </div>
        <div className="text-[10px] text-zinc-600">Facultad de Derecho PUCV · 2026</div>
      </div>
    </aside>
  );
}
