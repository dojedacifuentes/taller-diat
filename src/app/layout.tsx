import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { TopBar } from '@/components/layout/TopBar';
import { GridBackground } from '@/components/common/GridBackground';
import { FloatingCTA } from '@/components/common/FloatingCTA';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { seo, identity, institution } from '@/data/program';

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
  title: {
    default: seo.title,
    template: `%s — ${institution.program}`,
  },
  description: seo.description,
  applicationName: identity.name,
  keywords: [
    'prompting jurídico', 'inteligencia artificial y Derecho', 'verificación de fuentes',
    'trazabilidad', 'DIAT', 'PUCV', 'Derecho PUCV', 'taller 2026',
  ],
  authors: [{ name: institution.programLong }],
  creator: institution.program,
  publisher: institution.faculty,
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    siteName: identity.name,
    title: seo.title,
    description: seo.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[oklch(0.07_0.015_250)] text-zinc-200">
        <a href="#contenido" className="skip-link">Saltar al contenido</a>
        <GridBackground />
        <div className="relative flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <TopBar />
            <main id="contenido" tabIndex={-1} className="flex-1 pb-20 lg:pb-0">
              {children}
            </main>
            <SiteFooter />
          </div>
        </div>
        <MobileNav />
        <FloatingCTA />
      </body>
    </html>
  );
}
