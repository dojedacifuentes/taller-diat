import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ClipboardCheck, Download } from 'lucide-react';
import { clasesFundamentos, cursoFundamentos } from '@/data/fundamentos';

export const metadata: Metadata = {
  title: 'Fundamentos de IA para estudiantes de Derecho',
  description:
    'Material del alumno del curso Fundamentos de IA para estudiantes de Derecho (Escuela de Derecho PUCV): cuatro clases con prompts para copiar, enlaces directos y protocolos.',
};

const acentos = [
  { text: 'text-cyan-400', border: 'border-cyan-500/25', bg: 'bg-cyan-500/[0.05]', chip: 'border-cyan-500/30 bg-cyan-500/10' },
  { text: 'text-indigo-400', border: 'border-indigo-500/25', bg: 'bg-indigo-500/[0.05]', chip: 'border-indigo-500/30 bg-indigo-500/10' },
  { text: 'text-purple-400', border: 'border-purple-500/25', bg: 'bg-purple-500/[0.05]', chip: 'border-purple-500/30 bg-purple-500/10' },
  { text: 'text-emerald-400', border: 'border-emerald-500/25', bg: 'bg-emerald-500/[0.05]', chip: 'border-emerald-500/30 bg-emerald-500/10' },
] as const;

export default function FundamentosIndex() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-10 lg:px-8 lg:py-14">
      <header className="space-y-5 text-center">
        <span className="mono inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/8 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-cyan-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" aria-hidden />
          {cursoFundamentos.institucion}
        </span>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
          {cursoFundamentos.nombre}
        </h1>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          {cursoFundamentos.bajada}. Este es el material del alumno: sigue cada clase en pantalla,
          copia los prompts con un botón, abre los enlaces exactos y marca el protocolo hasta llevarte el producto.
        </p>
        <p className="mono text-xs text-zinc-500">{cursoFundamentos.formato}</p>
      </header>

      <div className="space-y-3">
        {clasesFundamentos.map((c, i) => {
          const a = acentos[i];
          return (
            <Link key={c.slug} href={`/fundamentos/${c.slug}`} className="group block">
              <div className={`rounded-2xl border p-5 transition-colors group-hover:border-white/25 sm:p-6 ${a.border} ${a.bg}`}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className={`mono flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-xl font-black ${a.chip} ${a.text}`}>
                    {c.n}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className={`mono text-[10px] font-bold uppercase tracking-widest ${a.text}`}>
                      Clase {c.n} · {c.etiqueta}
                    </div>
                    <h2 className="text-base font-bold leading-snug text-white sm:text-lg">{c.titulo}</h2>
                    <p className="text-xs leading-relaxed text-zinc-400">{c.pregunta}</p>
                    <p className="flex items-start gap-2 pt-1 text-xs text-zinc-300">
                      <ClipboardCheck className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${a.text}`} aria-hidden />
                      <span><span className="text-zinc-500">Producto: </span>{c.producto}</span>
                    </p>
                  </div>
                  <ArrowRight className="hidden h-5 w-5 shrink-0 self-center text-zinc-600 transition-colors group-hover:text-cyan-400 sm:block" aria-hidden />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <section className="space-y-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-sm font-bold text-white">
          <Download className="h-4 w-4 text-cyan-400" aria-hidden /> Apuntes en Word, clase por clase
        </h2>
        <p className="text-xs leading-relaxed text-zinc-500">
          Cada clase trae su apunte descargable con los prompts, el protocolo y los enlaces, para trabajar sin conexión o imprimir.
        </p>
        <div className="flex flex-wrap gap-2">
          {clasesFundamentos.map(c => (
            <a
              key={c.word}
              href={c.word}
              download
              className="mono inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-white/[0.12] bg-white/[0.03] px-3 py-2 text-xs font-semibold text-zinc-300 transition-colors hover:border-cyan-500/40 hover:text-cyan-300"
            >
              <Download className="h-3.5 w-3.5" aria-hidden /> Clase {c.n}.docx
            </a>
          ))}
        </div>
      </section>

      <p className="rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.04] p-5 text-center text-sm font-medium leading-relaxed text-zinc-200">
        {cursoFundamentos.regla}
      </p>

      <p className="text-center text-xs leading-relaxed text-zinc-500">
        Este curso forma parte del trabajo de IA y Derecho de la Escuela:{' '}
        <a
          href="https://aldunate.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-cyan-400 underline-offset-2 hover:underline"
        >
          Diógenes Lab — Derecho, inteligencia artificial y sistemas de conocimiento
        </a>
        {' '}· informes, formación y laboratorio.
      </p>
    </div>
  );
}
