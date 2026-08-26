import type { Metadata } from 'next';
import { PromptLab } from '@/components/class1/stages/PromptLab';

export const metadata: Metadata = {
  title: 'Construye tu prompt · Clase 1',
  description: 'Toma decisiones con botones y obtén un prompt que se pega y se ejecuta.',
};

export default function PromptPage() {
  return <PromptLab />;
}
