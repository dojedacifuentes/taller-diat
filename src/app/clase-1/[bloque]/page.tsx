import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BLOCK_IDS, getBlock, type BlockId } from '@/content/class1/manifest';
import { BlockRenderer } from '@/components/class1/BlockRenderer';

/** Las diez rutas de bloque se prerrenderizan: navegación instantánea en sala. */
export function generateStaticParams() {
  return BLOCK_IDS.map(bloque => ({ bloque }));
}

export const dynamicParams = false;

export async function generateMetadata(
  { params }: { params: Promise<{ bloque: string }> },
): Promise<Metadata> {
  const { bloque } = await params;
  const block = getBlock(bloque);
  if (!block) return { title: 'Clase 1' };
  return {
    title: `${block.code} · ${block.title} — Clase 1`,
    description: block.student,
  };
}

export default async function BloquePage({ params }: { params: Promise<{ bloque: string }> }) {
  const { bloque } = await params;
  const block = getBlock(bloque);
  if (!block) notFound();
  return <BlockRenderer id={block.id as BlockId} />;
}
