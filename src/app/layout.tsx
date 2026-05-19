import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { TopBar } from '@/components/layout/TopBar';
import { GridBackground } from '@/components/common/GridBackground';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DIAT Prompting Hub — Facultad de Derecho PUCV',
  description: 'Programa de Derecho, Inteligencia Artificial y Tecnología · Pontificia Universidad Católica de Valparaíso',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[oklch(0.07_0.015_250)] text-zinc-200">
        <GridBackground />
        <div className="relative flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <TopBar />
            <main className="flex-1 pb-20 lg:pb-0">
              {children}
            </main>
          </div>
        </div>
        <MobileNav />
      </body>
    </html>
  );
}
