import type { Metadata } from 'next';
import { Class1Providers } from '@/components/class1/Class1Providers';
import { class1Meta } from '@/content/class1/manifest';

export const metadata: Metadata = {
  title: 'Clase 1 · Laboratorio de razonamiento jurídico asistido',
  description: `${class1Meta.title}. Superficie de ejecución: construye un prompt, hazlo auditar, ejecútalo, comprueba una afirmación y entrega tu trabajo.`,
};

export default function Clase1Layout({ children }: { children: React.ReactNode }) {
  return <Class1Providers>{children}</Class1Providers>;
}
