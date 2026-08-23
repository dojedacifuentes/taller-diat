'use client';
import type { BlockId } from '@/content/class1/manifest';
import { B00 } from './blocks/B00';
import { B01 } from './blocks/B01';
import { B02 } from './blocks/B02';
import { B03 } from './blocks/B03';
import { B04 } from './blocks/B04';
import { B05 } from './blocks/B05';
import { B06 } from './blocks/B06';
import { B07 } from './blocks/B07';
import { B08 } from './blocks/B08';
import { B09 } from './blocks/B09';

const registry: Record<BlockId, () => React.JSX.Element> = {
  b00: B00, b01: B01, b02: B02, b03: B03, b04: B04,
  b05: B05, b06: B06, b07: B07, b08: B08, b09: B09,
};

export function BlockRenderer({ id }: { id: BlockId }) {
  const Component = registry[id];
  return <Component />;
}
