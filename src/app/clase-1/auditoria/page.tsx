import type { Metadata } from 'next';
import { Auditoria } from '@/components/class1/stages/Auditoria';

export const metadata: Metadata = {
  title: 'Haz que la IA audite tu prompt · Clase 1',
  description: 'Copia el paquete de auditoría, ejecútalo en tu IA y decide qué aceptas y qué rechazas.',
};

export default function AuditoriaPage() {
  return <Auditoria />;
}
