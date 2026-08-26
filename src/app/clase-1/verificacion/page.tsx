import type { Metadata } from 'next';
import { Verificacion } from '@/components/class1/stages/Verificacion';

export const metadata: Metadata = {
  title: 'Prueba y verifica · Clase 1',
  description: 'Ejecuta tu prompt y comprueba una afirmación contra su fuente.',
};

export default function VerificacionPage() {
  return <Verificacion />;
}
