import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dossier DIAT 2026 — Programa Editorial',
  description: 'IA Jurídica Aplicada, Prompt Engineering y Nuevas Competencias Digitales para el Derecho',
};

export default function DossierLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[oklch(0.07_0.015_250)] text-zinc-200">
      {children}
    </div>
  );
}
