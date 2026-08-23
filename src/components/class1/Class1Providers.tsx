'use client';
import type { ReactNode } from 'react';
import { Class1Provider } from '@/lib/class1/store';
import { ConceptProvider } from './ConceptPanel';
import { Class1Shell } from './Class1Shell';
import { OfflineReady } from './OfflineReady';

export function Class1Providers({ children }: { children: ReactNode }) {
  return (
    <Class1Provider>
      <ConceptProvider>
        <Class1Shell>{children}</Class1Shell>
        <OfflineReady />
      </ConceptProvider>
    </Class1Provider>
  );
}
