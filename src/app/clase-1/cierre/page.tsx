import type { Metadata } from 'next';
import { Cierre } from '@/components/class1/stages/Cierre';

export const metadata: Metadata = {
  title: 'Cierre y entrega · Clase 1',
  description: 'Vuelve a la pregunta guía, compara tu respuesta y entrega tu Clase 1.',
};

export default function CierrePage() {
  return <Cierre />;
}
