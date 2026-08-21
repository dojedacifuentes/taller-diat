'use client';
// ─────────────────────────────────────────────────────────────────────────────
// Materiales del taller.
//
// Dos formas de descarga conviven y la tarjeta lo dice explícitamente:
//   · Archivo del repositorio  → enlace directo a /materiales/…
//   · Generado en el navegador → botón que produce el PDF con jsPDF
//
// Ninguna tarjeta puede quedar con enlace vacío, «#» ni «próximamente».
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import Link from 'next/link';
import { Download, Loader2, FileText, ArrowRight } from 'lucide-react';

import { materials, materialFilters, filterMaterials, type MaterialFilter } from '@/data/materials';
import { materialGenerators } from '@/lib/materialPdfs';
import { privacyNotice } from '@/data/pedagogy';
import type { Material } from '@/lib/types';
import { Shell, SectionHead, Panel, PrivacyNote, accents, type AccentName } from '@/components/common/Page';

const sessionAccent: Record<number, AccentName> = {
  0: 'emerald', 1: 'cyan', 2: 'indigo', 3: 'purple',
};

const formatLabel: Record<string, string> = {
  PDF: 'PDF', PPTX: 'PowerPoint', DOCX: 'Word', MD: 'Markdown',
};

export default function MaterialesPage() {
  const [filter, setFilter] = useState<MaterialFilter>('todos');
  const [busy, setBusy] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);

  const shown = filterMaterials(filter);

  async function generate(m: Material) {
    if (!m.generator) return;
    const fn = materialGenerators[m.generator];
    if (!fn) return;
    setBusy(m.code);
    setFailed(null);
    try {
      await fn();
    } catch {
      setFailed(m.code);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="py-8 sm:py-12">
      <Shell>
        <header className="mb-8">
          <div className="mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 mb-2">
            {materials.length} recursos
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            Materiales del taller
          </h1>
          <p className="mt-3 text-base text-zinc-400 leading-relaxed max-w-3xl">
            Plantillas, casos, presentaciones y guiones. Las plantillas se generan en este
            navegador al hacer clic; las presentaciones y guiones son archivos del repositorio.
          </p>
        </header>

        <div className="mb-8 flex flex-wrap gap-1.5" role="group" aria-label="Filtrar materiales">
          {materialFilters.map(f => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-lg border px-3.5 py-2 text-xs font-semibold transition ${
                filter === f.id
                  ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                  : 'border-white/[0.1] text-zinc-400 hover:bg-white/[0.04]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <p className="mb-4 mono text-xs text-zinc-600" aria-live="polite">
          {shown.length} {shown.length === 1 ? 'recurso' : 'recursos'}
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {shown.map(m => {
            const a = accents[sessionAccent[m.session]];
            const isBusy = busy === m.code;
            const didFail = failed === m.code;
            return (
              <Panel key={m.code} className="flex flex-col p-4">
                <div className="flex items-start gap-3 mb-2">
                  <span className={`mono text-[10px] font-bold shrink-0 mt-1 ${a.text}`}>{m.code}</span>
                  <h2 className="text-sm font-semibold text-white leading-snug flex-1">{m.title}</h2>
                </div>

                <p className="text-xs text-zinc-500 leading-relaxed flex-1">{m.description}</p>

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className={`mono text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${a.border} ${a.bgSoft} ${a.text}`}>
                    {m.session === 0 ? 'Transversal' : `Sesión ${m.session}`}
                  </span>
                  <span className="mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded border border-white/[0.1] text-zinc-500">
                    {m.kind}
                  </span>
                  <span className="mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded border border-white/[0.1] text-zinc-500">
                    {formatLabel[m.format] ?? m.format}
                  </span>
                  {m.size && (
                    <span className="mono text-[9px] text-zinc-600">{m.size}</span>
                  )}
                </div>

                <div className="mt-3.5">
                  {m.href ? (
                    <a
                      href={m.href}
                      download
                      className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/[0.07] transition"
                    >
                      <Download className="w-3.5 h-3.5" aria-hidden />
                      Descargar {formatLabel[m.format] ?? m.format}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => generate(m)}
                      disabled={isBusy}
                      className={`inline-flex items-center gap-2 rounded-lg border ${a.borderStrong} ${a.bg} px-3.5 py-2 text-xs font-semibold ${a.textSoft} hover:brightness-125 transition disabled:opacity-60`}
                    >
                      {isBusy
                        ? <><Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden /> Generando…</>
                        : <><FileText className="w-3.5 h-3.5" aria-hidden /> Generar PDF</>}
                    </button>
                  )}
                  {didFail && (
                    <p className="mt-2 text-[11px] text-rose-300" role="alert">
                      No se pudo generar el PDF en este navegador. Vuelve a intentarlo o usa otro
                      navegador; el contenido también está en esta web.
                    </p>
                  )}
                </div>
              </Panel>
            );
          })}
        </div>

        <section className="mt-14">
          <SectionHead
            kicker="Cómo se regeneran" title="Los archivos del repositorio"
            lead="Las presentaciones, guiones y el manual se construyen con scripts versionados junto al proyecto."
          />
          <Panel className="p-5">
            <p className="text-sm text-zinc-400 leading-relaxed">
              Desde la raíz del repositorio, con PowerShell:
            </p>
            <pre className="mono text-xs text-cyan-300 mt-3 rounded-lg border border-white/[0.08] bg-black/40 p-3.5 table-scroll">
{`powershell -ExecutionPolicy Bypass -File scripts/build-all.ps1`}
            </pre>
            <p className="mt-3 text-xs text-zinc-600 leading-relaxed">
              El script escribe OOXML y PDF directamente, sin depender de Node, LibreOffice ni
              Office instalado. El detalle está en docs/TALLER_2026_CHANGELOG.md.
            </p>
          </Panel>
        </section>

        <div className="mt-10">
          <PrivacyNote text={privacyNotice} />
        </div>

        <nav className="mt-8 flex flex-wrap gap-4">
          <Link href="/modulos" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:underline">
            Programa del taller <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
          <Link href="/ruta" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:underline">
            Ruta de aprendizaje <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        </nav>
      </Shell>
    </div>
  );
}
