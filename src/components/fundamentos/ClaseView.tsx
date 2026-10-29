'use client';
// ─────────────────────────────────────────────────────────────────────────────
// FUNDAMENTOS · VISTA DE UNA CLASE
//
// La pantalla que el alumno sigue durante la sesión: síntesis por bloque,
// prompts con botón de copiar, enlaces que se abren en pestaña nueva y el
// protocolo de la clase como lista marcable que se recuerda en este navegador.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, CheckCircle2, ClipboardCheck, Compass, Download,
  ExternalLink, FileText, Link2, ListChecks, Target,
} from 'lucide-react';
import { CopyButton, PromptBlock } from '@/components/class1/ui';
import {
  clasesFundamentos, cursoFundamentos, type BloqueFundamentos, type ClaseFundamentos,
} from '@/data/fundamentos';

const acentos = [
  { text: 'text-cyan-400', soft: 'text-cyan-300', border: 'border-cyan-500/30', bg: 'bg-cyan-500/[0.06]', chip: 'border-cyan-500/30 bg-cyan-500/10', bar: 'from-cyan-500 to-cyan-400' },
  { text: 'text-indigo-400', soft: 'text-indigo-300', border: 'border-indigo-500/30', bg: 'bg-indigo-500/[0.06]', chip: 'border-indigo-500/30 bg-indigo-500/10', bar: 'from-indigo-500 to-indigo-400' },
  { text: 'text-purple-400', soft: 'text-purple-300', border: 'border-purple-500/30', bg: 'bg-purple-500/[0.06]', chip: 'border-purple-500/30 bg-purple-500/10', bar: 'from-purple-500 to-purple-400' },
  { text: 'text-emerald-400', soft: 'text-emerald-300', border: 'border-emerald-500/30', bg: 'bg-emerald-500/[0.06]', chip: 'border-emerald-500/30 bg-emerald-500/10', bar: 'from-emerald-500 to-emerald-400' },
] as const;

function EnlaceChip({ url, label, nota }: { url: string; label: string; nota?: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.03] px-3.5 py-2 transition-colors hover:border-cyan-500/40 hover:bg-cyan-500/[0.06]"
    >
      <Link2 className="h-3.5 w-3.5 shrink-0 text-zinc-500 group-hover:text-cyan-400" aria-hidden />
      <span className="min-w-0">
        <span className="block text-sm font-semibold leading-snug text-zinc-200 group-hover:text-white">{label}</span>
        {nota && <span className="block text-[11px] leading-snug text-zinc-500">{nota}</span>}
      </span>
      <ExternalLink className="h-3 w-3 shrink-0 text-zinc-600 group-hover:text-cyan-500" aria-hidden />
    </a>
  );
}

function Bloque({ bloque, index, acento }: { bloque: BloqueFundamentos; index: number; acento: (typeof acentos)[number] }) {
  return (
    <motion.section
      id={bloque.id}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45 }}
      className="scroll-mt-24 space-y-4 rounded-2xl border border-white/[0.09] bg-white/[0.02] p-4 sm:p-6"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className={`mono flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-sm font-bold ${acento.chip} ${acento.text}`}>
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <div className={`mono text-[10px] font-bold uppercase tracking-[0.18em] ${acento.text}`}>{bloque.minutos}</div>
          <h2 className="text-base font-bold leading-snug text-white sm:text-lg">{bloque.titulo}</h2>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-zinc-300">{bloque.sintesis}</p>

      {bloque.pasos && (
        <ol className="space-y-1.5">
          {bloque.pasos.map((p, i) => (
            <li key={p} className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-400">
              <span className={`mono mt-0.5 shrink-0 text-[11px] font-bold ${acento.text}`}>{i + 1}.</span>
              {p}
            </li>
          ))}
        </ol>
      )}

      {bloque.dato && (
        <p className={`rounded-xl border px-3.5 py-2.5 text-xs leading-relaxed ${acento.border} ${acento.bg} text-zinc-300`}>
          <span className={`mono mr-2 text-[10px] font-bold uppercase tracking-widest ${acento.text}`}>Dato</span>
          {bloque.dato}
        </p>
      )}

      {bloque.prompts?.map(p => (
        <PromptBlock
          key={p.id}
          label={p.titulo}
          text={p.texto}
          actions={<CopyButton text={p.texto} label="Copiar" variant="primary" />}
          note={p.nota}
        />
      ))}

      {bloque.enlaces && (
        <div className="flex flex-wrap gap-2">
          {bloque.enlaces.map(e => <EnlaceChip key={e.url + e.label} {...e} />)}
        </div>
      )}
    </motion.section>
  );
}

function Protocolo({ clase, acento }: { clase: ClaseFundamentos; acento: (typeof acentos)[number] }) {
  const clave = `fundamentos:${clase.slug}:protocolo`;
  const [marcados, setMarcados] = useState<boolean[]>(() => clase.protocolo.items.map(() => false));

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(clave);
      if (guardado) {
        const arr = JSON.parse(guardado) as boolean[];
        if (Array.isArray(arr)) setMarcados(clase.protocolo.items.map((_, i) => Boolean(arr[i])));
      }
    } catch { /* sin almacenamiento, sin memoria: la lista sigue sirviendo */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const alternar = (i: number) => {
    setMarcados(prev => {
      const sig = prev.map((v, j) => (j === i ? !v : v));
      try { localStorage.setItem(clave, JSON.stringify(sig)); } catch { /* idem */ }
      return sig;
    });
  };

  const hechos = marcados.filter(Boolean).length;
  const total = clase.protocolo.items.length;

  return (
    <section id="protocolo" className={`scroll-mt-24 space-y-4 rounded-2xl border p-4 sm:p-6 ${acento.border} ${acento.bg}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base font-bold text-white sm:text-lg">
          <ListChecks className={`h-5 w-5 ${acento.text}`} aria-hidden />
          {clase.protocolo.titulo}
        </h2>
        <span className={`mono text-xs font-bold ${acento.text}`} role="status">{hechos}/{total}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]" aria-hidden>
        <div
          className={`h-full rounded-full bg-gradient-to-r transition-[width] duration-300 ${acento.bar}`}
          style={{ width: `${total ? (hechos / total) * 100 : 0}%` }}
        />
      </div>
      <p className="text-xs leading-relaxed text-zinc-500">
        Se guarda solo en este navegador. Marca cada punto cuando lo dejes hecho de verdad, no cuando lo entiendas.
      </p>
      <ul className="space-y-2">
        {clase.protocolo.items.map((item, i) => (
          <li key={item}>
            <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border border-white/[0.08] bg-[oklch(0.08_0.016_250/0.5)] px-3.5 py-2.5 transition-colors hover:border-white/20 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-cyan-400">
              <input
                type="checkbox"
                checked={marcados[i] ?? false}
                onChange={() => alternar(i)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-cyan-400"
              />
              <span className={`text-sm leading-relaxed ${marcados[i] ? 'text-zinc-500 line-through decoration-zinc-600' : 'text-zinc-200'}`}>
                {item}
              </span>
            </label>
          </li>
        ))}
      </ul>
      {hechos === total && (
        <p className="flex items-center gap-2 text-sm font-semibold text-emerald-300" role="status">
          <CheckCircle2 className="h-4 w-4" aria-hidden /> Protocolo completo: te llevas el producto de la clase.
        </p>
      )}
    </section>
  );
}

export function ClaseFundamentosView({ n }: { n: 1 | 2 | 3 | 4 }) {
  const clase = clasesFundamentos[n - 1];
  const acento = acentos[n - 1];
  const anterior = n > 1 ? clasesFundamentos[n - 2] : null;
  const siguiente = n < 4 ? clasesFundamentos[n] : null;

  const todosLosPrompts = useMemo(
    () =>
      clase.bloques
        .flatMap(b => b.prompts ?? [])
        .map(p => `── ${p.titulo} ──\n${p.texto}`)
        .join('\n\n'),
    [clase],
  );

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 lg:px-8 lg:py-12">
      {/* ── Encabezado ── */}
      <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/fundamentos"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-cyan-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> {cursoFundamentos.nombre}
          </Link>
        </div>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`mono inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest ${acento.chip} ${acento.text}`}>
              Clase {clase.n} · {clase.etiqueta}
            </span>
            <span className="mono rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-zinc-400">
              2 horas · {cursoFundamentos.institucion}
            </span>
          </div>
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">{clase.titulo}</h1>
          <p className={`text-sm font-medium ${acento.soft}`}>{clase.pregunta}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
            <Target className={`mt-0.5 h-4 w-4 shrink-0 ${acento.text}`} aria-hidden />
            <p className="text-xs leading-relaxed text-zinc-400">
              <span className="font-semibold text-zinc-300">Objetivo: </span>{clase.objetivo}
            </p>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
            <ClipboardCheck className={`mt-0.5 h-4 w-4 shrink-0 ${acento.text}`} aria-hidden />
            <p className="text-xs leading-relaxed text-zinc-400">
              <span className="font-semibold text-zinc-300">Producto: </span>{clase.producto}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={clase.word}
            download
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-cyan-500/45 bg-cyan-500/15 px-4 py-2.5 text-sm font-semibold text-cyan-100 transition-colors hover:bg-cyan-500/25"
          >
            <Download className="h-4 w-4" aria-hidden /> Descargar en Word
          </a>
          <CopyButton text={todosLosPrompts} label="Copiar todos los prompts" />
        </div>

        {/* Mapa de bloques */}
        <nav aria-label="Bloques de la clase" className="flex flex-wrap gap-1.5">
          {clase.bloques.map((b, i) => (
            <a
              key={b.id}
              href={`#${b.id}`}
              className="mono inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 py-1.5 text-[11px] text-zinc-400 transition-colors hover:border-cyan-500/35 hover:text-cyan-300"
            >
              <span className={`font-bold ${acento.text}`}>{i + 1}</span>
              {b.titulo.length > 34 ? `${b.titulo.slice(0, 34)}…` : b.titulo}
            </a>
          ))}
          <a
            href="#protocolo"
            className="mono inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 py-1.5 text-[11px] text-zinc-400 transition-colors hover:border-cyan-500/35 hover:text-cyan-300"
          >
            <ListChecks className="h-3 w-3" aria-hidden /> Protocolo
          </a>
        </nav>
      </motion.header>

      {/* ── Bloques ── */}
      <div className="space-y-5">
        {clase.bloques.map((b, i) => <Bloque key={b.id} bloque={b} index={i} acento={acento} />)}
      </div>

      {/* ── Protocolo ── */}
      <Protocolo clase={clase} acento={acento} />

      {clase.puente && (
        <p className="flex items-start gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-sm leading-relaxed text-zinc-300">
          <Compass className={`mt-0.5 h-4 w-4 shrink-0 ${acento.text}`} aria-hidden />
          {clase.puente}
        </p>
      )}

      {/* ── Navegación entre clases ── */}
      <nav aria-label="Otras clases" className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-6">
        {anterior ? (
          <Link
            href={`/fundamentos/${anterior.slug}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-zinc-300 transition-colors hover:border-cyan-500/40 hover:text-cyan-300"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> Clase {anterior.n} · {anterior.etiqueta}
          </Link>
        ) : <span />}
        {siguiente ? (
          <Link
            href={`/fundamentos/${siguiente.slug}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-200 transition-colors hover:bg-cyan-500/20"
          >
            Clase {siguiente.n} · {siguiente.etiqueta} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300">
            <FileText className="h-4 w-4" aria-hidden /> Fin del curso: {cursoFundamentos.regla}
          </span>
        )}
      </nav>
    </div>
  );
}
