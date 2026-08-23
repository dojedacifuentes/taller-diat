import type { Metadata } from 'next';
import { Class1Providers } from '@/components/class1/Class1Providers';
import { class1Meta } from '@/content/class1/manifest';

export const metadata: Metadata = {
  title: 'Clase 1 · Laboratorio de razonamiento jurídico asistido',
  description: `${class1Meta.title}. Experiencia individual guiada: cada estudiante formula un encargo, detecta errores jurídicos generativos, verifica con el protocolo ICJR y produce su Bitácora.`,
};

export default function Clase1Layout({ children }: { children: React.ReactNode }) {
  return <Class1Providers>{children}</Class1Providers>;
}
