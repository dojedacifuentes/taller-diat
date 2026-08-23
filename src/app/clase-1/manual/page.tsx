import type { Metadata } from 'next';
import { ManualPage } from '@/components/class1/ManualPage';

export const metadata: Metadata = {
  title: 'Manual y recursos · Clase 1',
  description: 'Conceptos, banco de prompts canónicos y glosario de la Clase 1.',
};

export default function Page() {
  return <ManualPage />;
}
