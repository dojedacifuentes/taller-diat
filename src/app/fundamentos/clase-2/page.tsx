import type { Metadata } from 'next';
import { ClaseFundamentosView } from '@/components/fundamentos/ClaseView';
import { clasesFundamentos } from '@/data/fundamentos';

const clase = clasesFundamentos[1];

export const metadata: Metadata = {
  title: `Fundamentos · Clase 2 · ${clase.etiqueta}`,
  description: `${clase.titulo}. Producto: ${clase.producto}`,
};

export default function Page() {
  return <ClaseFundamentosView n={2} />;
}
