import type { Metadata } from 'next';
import { SessionShell } from '@/components/session/SessionShell';
import { sessions, schedule } from '@/data/program';

const session = sessions[2 - 1];

export const metadata: Metadata = {
  title: `${session.label} · ${session.shortTitle}`,
  description: `${session.title}. ${session.displayDate} de 2026, ${schedule.time}. Producto: ${session.product}.`,
};

export default function Page() {
  return <SessionShell id={2} />;
}
