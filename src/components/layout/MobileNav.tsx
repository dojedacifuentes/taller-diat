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
} from 'lucide-react';

const nav = [
  { href: '/', icon: LayoutDashboard, label: 'Inicio' },
  { href: '/timeline', icon: CalendarDays, label: 'Timeline' },
  { href: '/herramientas', icon: Cpu, label: 'Herramientas' },
  { href: '/admin', icon: BarChart3, label: 'Admin' },
  { href: '/equipo', icon: Users, label: 'Equipo' },
  { href: '/autoridad', icon: ShieldCheck, label: 'Autoridad' },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.08] bg-[oklch(0.08_0.016_250/0.95)] backdrop-blur-xl">
      <div className="flex items-center">
        {nav.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className="flex-1">
              <motion.div
                className={`flex flex-col items-center gap-1 py-3 px-1 ${
                  active ? 'text-cyan-400' : 'text-zinc-500'
                }`}
                whileTap={{ scale: 0.9 }}
              >
                <div className="relative">
                  {active && (
                    <motion.div
                      className="absolute inset-0 -m-1 rounded-md bg-cyan-500/15"
                      layoutId="mobile-nav-bg"
                    />
                  )}
                  <Icon className="w-5 h-5 relative z-10" />
                </div>
                <span className="text-[9px] font-medium leading-none">{label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
