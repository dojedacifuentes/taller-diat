// ─────────────────────────────────────────────────────────────────────────────
// MATERIALES DE CLASE 1
//
// Tres piezas con tres funciones distintas, y por eso las tres existen:
//
//   Ruta analógica  → hacer     · las actividades sin dispositivo
//   Ficha           → recordar  · la arquitectura de la sesión
//   Manual          → estudiar  · el conocimiento consolidado, después
//
// Trabajar en papel no es una excepción que haya que justificar: es otra
// modalidad de participación. El bloque se redacta en consecuencia —«¿sin
// dispositivo?», no «si por desgracia no tienes dispositivo»— y va al final de
// la pantalla de entrada, donde no estorba a quien sí va a trabajar aquí.
//
// Las dos primeras se generan con `npm run build:class1-print` desde el mismo
// canon que esta plataforma. El Manual es un artefacto editorial aparte y vive
// en public/materiales.
// ─────────────────────────────────────────────────────────────────────────────
import { Download, PencilLine, BookMarked, GraduationCap } from 'lucide-react';

interface Impreso {
  href: string;
  icon: typeof PencilLine;
  title: string;
  what: string;
  detail: string;
}

const IMPRESOS: readonly Impreso[] = [
  {
    href: '/descargas/DIAT_Clase1_Ruta_Analogica.pdf',
    icon: PencilLine,
    title: 'Ruta analógica',
    what: 'Para hacer las actividades sin dispositivo.',
    detail:
      'Dos páginas con las mismas decisiones que esta plataforma: el encargo, las siete preguntas de diseño, tu prompt, la matriz ICJR y el cierre. Se completa a mano y se entrega al terminar.',
  },
  {
    href: '/descargas/DIAT_Clase1_Ficha_Imprimible.pdf',
    icon: BookMarked,
    title: 'Ficha de Clase 1',
    what: 'Síntesis visual para consultar, anotar y conservar.',
    detail:
      'La arquitectura de la sesión en dos páginas: los siete componentes, las siete instrucciones de control, el protocolo ICJR, los cinco estatus y las tres reglas de salida.',
  },
  {
    href: '/materiales/DIAT_2026_CLASE_1_MANUAL_DEL_ESTUDIANTE_v1.0.pdf',
    icon: GraduationCap,
    title: 'Manual del Estudiante',
    what: 'El desarrollo completo, para estudiar después.',
    detail:
      'Lo que no cabe en una sesión de noventa minutos: los conceptos con sus ejemplos, el banco de prompts canónicos, el protocolo de verificación desarrollado y el glosario. No hace falta para la clase de hoy.',
  },
];

export function Impresos() {
  return (
    <section
      aria-labelledby="impresos"
      className="rounded-xl border border-white/[0.10] bg-white/[0.02] p-4 sm:p-5"
    >
      <div className="mono text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
        Materiales
      </div>
      <h2 id="impresos" className="mt-1 text-base font-bold text-white">
        Para hacer, para recordar y para estudiar
      </h2>
      <p className="mt-1.5 max-w-2xl text-sm text-zinc-400">
        ¿Sin dispositivo? La <strong className="font-semibold text-zinc-300">Ruta analógica</strong> te
        permite hacer la clase entera con lápiz y papel. El profesor puede imprimirla antes de la
        sesión.
      </p>

      <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {IMPRESOS.map(({ href, icon: Icon, title, what, detail }) => (
          <li key={href}>
            <a
              href={href}
              download
              className="group flex h-full flex-col rounded-lg border border-white/[0.12] bg-white/[0.02] p-3.5 transition-colors hover:border-cyan-500/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
            >
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0 text-cyan-400" aria-hidden />
                <span className="text-sm font-semibold text-white">{title}</span>
              </span>
              <span className="mt-1 text-xs font-medium text-zinc-300">{what}</span>
              <span className="mt-1.5 flex-1 text-xs leading-relaxed text-zinc-500">{detail}</span>
              <span className="mono mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-cyan-400 group-hover:text-cyan-300">
                <Download className="h-3.5 w-3.5" aria-hidden />
                Descargar · PDF
                <span className="sr-only"> · {title}, 2 páginas A4</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
