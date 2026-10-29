import type { Metadata } from 'next';
import { ClaseFundamentosView } from '@/components/fundamentos/ClaseView';
import { clasesFundamentos } from '@/data/fundamentos';

const clase = clasesFundamentos[0];

export const metadata: Metadata = {
  title: `Fundamentos · Clase 1 · ${clase.etiqueta}`,
  description: `${clase.titulo}. Producto: ${clase.producto}`,
};

export default function Page() {
  return <ClaseFundamentosView n={1} />;
}
