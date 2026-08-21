'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Zap, Layers, ShieldCheck, Workflow, Users } from 'lucide-react';

// Solo las seis rutas que se usan dentro de la sala. El mapa completo del
// sitio vive en el pie de página, que se muestra en todas las pantallas.
const nav = [
  { href: '/', icon: Home, label: 'Inicio' },
  { href: '/modulos', icon: Layers, label: 'Sesiones' },
  { href: '/prompt-lab', icon: Zap, label: 'Lab' },
  { href: '/verificacion', icon: ShieldCheck, label: 'Verificar' },
  { href: '/flujo', icon: Workflow, label: 'Flujo' },
  { href: '/match', icon: Users, label: 'Match' },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Navegación de sala" className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.08] bg-[oklch(0.08_0.016_250/0.95)] backdrop-blur-xl">
      <div className="flex items-center">
        {nav.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className="flex-1">
              <motion.div
                className={`flex flex-col items-center gap-1 py-3 px-1 ${active ? 'text-cyan-400' : 'text-zinc-500'}`}
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
