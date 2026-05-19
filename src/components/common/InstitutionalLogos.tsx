import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { w: 28, h: 28, text: 'text-[10px]', pad: 'px-2 py-1' },
  md: { w: 40, h: 40, text: 'text-xs', pad: 'px-3 py-1.5' },
  lg: { w: 56, h: 56, text: 'text-sm', pad: 'px-4 py-2' },
};

function LogoPlaceholder({ label, abbrev, size = 'md', color }: {
  label: string;
  abbrev: string;
  size?: 'sm' | 'md' | 'lg';
  color: string;
}) {
  const s = sizeMap[size];
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg border ${color} ${s.pad}`}
      title={label}
    >
      <span className={`font-black mono tracking-tight ${s.text}`}>{abbrev}</span>
    </div>
  );
}

export function DiATLogo({ size = 'md', className = '' }: LogoProps) {
  return (
    <div className={`relative inline-flex ${className}`}>
      <Image
        src="/logos/diat.png"
        alt="Programa DIAT"
        width={sizeMap[size].w}
        height={sizeMap[size].h}
        className="object-contain"
        onError={() => {}}
      />
    </div>
  );
}

export function FacultadDerechoLogo({ size = 'md', className = '' }: LogoProps) {
  return (
    <div className={`relative inline-flex ${className}`}>
      <Image
        src="/logos/facultad-derecho.png"
        alt="Facultad de Derecho PUCV"
        width={sizeMap[size].w * 2}
        height={sizeMap[size].h}
        className="object-contain"
        onError={() => {}}
      />
    </div>
  );
}

export function VCMLogo({ size = 'md', className = '' }: LogoProps) {
  return (
    <div className={`relative inline-flex ${className}`}>
      <Image
        src="/logos/vcm.png"
        alt="Vinculación con el Medio PUCV"
        width={sizeMap[size].w * 2}
        height={sizeMap[size].h}
        className="object-contain"
        onError={() => {}}
      />
    </div>
  );
}

/** Full institutional logo row with text fallbacks when images aren't loaded */
export function InstitutionalLogoRow({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <LogoPlaceholder
        abbrev="DIAT"
        label="Programa DIAT"
        size={size}
        color="border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
      />
      <div className="w-px h-5 bg-white/[0.1]" />
      <LogoPlaceholder
        abbrev="FD·PUCV"
        label="Facultad de Derecho PUCV"
        size={size}
        color="border-indigo-500/30 bg-indigo-500/10 text-indigo-400"
      />
      <div className="w-px h-5 bg-white/[0.1]" />
      <LogoPlaceholder
        abbrev="VCM"
        label="Vinculación con el Medio"
        size={size}
        color="border-purple-500/30 bg-purple-500/10 text-purple-400"
      />
    </div>
  );
}

/** Compact single badge for use in headers / cards */
export function InstitutionalBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] mono font-bold text-zinc-500 border border-zinc-700/40 bg-zinc-800/20 px-2.5 py-1 rounded-full">
      <span className="text-cyan-500">DIAT</span>
      <span className="text-zinc-700">·</span>
      <span>Facultad de Derecho PUCV</span>
    </span>
  );
}
