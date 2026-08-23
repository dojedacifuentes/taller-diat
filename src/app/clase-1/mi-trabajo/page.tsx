import type { Metadata } from 'next';
import { MiTrabajo } from '@/components/class1/MiTrabajo';

export const metadata: Metadata = {
  title: 'Mi Bitácora · Clase 1',
  description: 'Evidencia individual de la Clase 1: Producto A, auditoría, Producto B y Producto C.',
};

export default function MiTrabajoPage() {
  return <MiTrabajo />;
}
