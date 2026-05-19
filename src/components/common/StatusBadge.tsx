import type { ModuleStatus } from '@/lib/types';

const config: Record<ModuleStatus, { label: string; className: string; dot: string }> = {
  completed: {
    label: 'Completado',
    className: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
    dot: 'bg-emerald-400',
  },
  active: {
    label: 'En curso',
    className: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10',
    dot: 'bg-cyan-400 animate-pulse',
  },
  pending: {
    label: 'Próximamente',
    className: 'text-zinc-400 border-zinc-600/40 bg-zinc-800/40',
    dot: 'bg-zinc-500',
  },
};

export function StatusBadge({ status }: { status: ModuleStatus }) {
  const { label, className, dot } = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
