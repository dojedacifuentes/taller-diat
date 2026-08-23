'use client';
// ─────────────────────────────────────────────────────────────────────────────
// MI TRABAJO · BITÁCORA DE RAZONAMIENTO JURÍDICO ASISTIDO
//
// Producto A, B y C no son tres entregas: son hitos de una sola evidencia de
// aprendizaje que se construye durante los 90 minutos. Esta pantalla la muestra
// completa, permite editar antes de entregar y produce el PDF.
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Download, FileText, Mail, RotateCcw } from 'lucide-react';
import {
  blameOptions, claimActions, claimStates, componentStates, diatComponents,
  epistemicStatuses, errorTypes, myths, riskLevels,
} from '@/content/class1/activities';
import { AI_TOOLS, AI_TOOL_NOTEBOOK } from '@/content/class1/prompts';
import { BLOCKS, class1Meta } from '@/content/class1/manifest';
import { useClass1 } from '@/lib/class1/store';
import { fullName } from '@/lib/class1/state';
import { bitacoraFilename, generateBitacoraPDF } from '@/lib/class1/bitacoraPdf';
import { delivery, deliveryMailto } from '@/lib/class1/delivery';
import { Callout, ResponsiveRows, TextField } from './ui';

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-white/[0.06] py-2.5 last:border-0 sm:flex sm:gap-4">
      <dt className="mono shrink-0 text-[10px] font-bold uppercase tracking-widest text-zinc-500 sm:w-44 sm:pt-0.5">
        {label}
      </dt>
      <dd className="mt-1 min-w-0 flex-1 text-sm text-zinc-300 sm:mt-0">{children}</dd>
    </div>
  );
}

function Empty({ href, what }: { href: string; what: string }) {
  return (
    <Link href={href} className="text-zinc-600 underline decoration-zinc-700 underline-offset-2 hover:text-zinc-400">
      Sin completar — ir a {what}
    </Link>
  );
}

function Block({ n, title, blockId, children }: { n: string; title: string; blockId: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`s-${n}`} className="rounded-xl border border-white/[0.10] bg-white/[0.02] p-4 sm:p-5">
      <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-white/[0.08] pb-2.5">
        <h2 id={`s-${n}`} className="flex items-baseline gap-2.5 text-base font-bold text-white">
          <span className="mono text-[11px] font-bold text-cyan-400">{n}</span>
          {title}
        </h2>
        <Link
          href={`/clase-1/${blockId}`}
          className="mono shrink-0 text-[10px] uppercase tracking-widest text-zinc-500 underline-offset-2 hover:text-cyan-400 hover:underline"
        >
          Editar
        </Link>
      </div>
      <dl>{children}</dl>
    </section>
  );
}

export function MiTrabajo() {
  const { state, progress, awards, hydrated, update, reset } = useClass1();
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const a = state.productA;
  const name = fullName(state.student);

  async function onGenerate() {
    setError(null);
    setGenerating(true);
    try {
      await generateBitacoraPDF(state, progress);
      setGenerated(true);
    } catch {
      setError('No se pudo generar el PDF. Vuelve a intentarlo; si persiste, revisa que el navegador permita descargas.');
    } finally {
      setGenerating(false);
    }
  }

  if (!hydrated) {
    return <div className="h-64 animate-pulse rounded-xl border border-white/[0.08] bg-white/[0.02]" />;
  }

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <header className="rounded-xl border border-cyan-500/25 bg-cyan-500/[0.05] p-5">
        <div className="mono text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">
          Clase 1 · Evidencia individual
        </div>
        <h1 className="mt-1.5 text-2xl font-bold leading-tight text-white sm:text-3xl">
          Bitácora de Razonamiento Jurídico Asistido
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Producto A, B y C no son tres entregas separadas: son hitos de esta única evidencia, que se
          construyó a lo largo de los 90 minutos.
        </p>

        <div className="mt-4 flex items-center gap-3">
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
            <span
              className="block h-full rounded-full bg-cyan-500 transition-all"
              style={{ width: `${progress.percent}%` }}
            />
          </span>
          <span className="mono shrink-0 text-sm font-bold text-cyan-400 tabular-nums">{progress.percent}%</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {([['A', progress.productA], ['B', progress.productB], ['C', progress.productC]] as const).map(([k, ok]) => (
            <span
              key={k}
              className={`mono rounded border px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${
                ok
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                  : 'border-white/[0.12] bg-white/[0.03] text-zinc-500'
              }`}
            >
              Producto {k} · {ok ? 'completo' : 'pendiente'}
            </span>
          ))}
        </div>
      </header>

      {/* Identificación */}
      <section aria-labelledby="ident" className="rounded-xl border border-white/[0.10] bg-white/[0.02] p-4 sm:p-5">
        <h2 id="ident" className="mb-3 text-base font-bold text-white">Identificación</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <TextField
            label="Nombre"
            value={state.student.firstName}
            onChange={v => update(d => ({ ...d, student: { ...d.student, firstName: v } }))}
          />
          <TextField
            label="Apellido"
            value={state.student.lastName}
            onChange={v => update(d => ({ ...d, student: { ...d.student, lastName: v } }))}
          />
          <TextField
            label="Correo"
            type="email"
            value={state.student.email}
            onChange={v => update(d => ({ ...d, student: { ...d.student, email: v } }))}
          />
        </div>
        <p className="mt-2.5 text-xs text-zinc-500">
          Estos datos solo se guardan en este navegador y se usan para el PDF y el correo de entrega.
          Fecha de la sesión: {class1Meta.date}.
        </p>
      </section>

      {/* Contenido */}
      <Block n="02" title="Diagnóstico inicial" blockId="b00">
        <Row label="Respuesta">
          {state.b00.committed
            ? blameOptions.find(o => o.id === state.b00.blame)?.label
            : <Empty href="/clase-1/b00" what="B00" />}
        </Row>
        <Row label="Confianza">{state.b00.confidence ?? '—'}</Row>
      </Block>

      <Block n="03" title="Cinco mitos" blockId="b02">
        {myths.some(m => state.b02.committed[m.id]) ? (
          <ResponsiveRows
            head={['Afirmación', 'Tu respuesta', 'Respuesta']}
            rows={myths
              .filter(m => state.b02.committed[m.id])
              .map(m => [
                m.statement,
                <span
                  key="r"
                  className={state.b02.answers[m.id] === m.answer ? 'text-emerald-400' : 'text-amber-400'}
                >
                  {state.b02.answers[m.id]}
                </span>,
                m.answer,
              ])}
          />
        ) : (
          <Row label="Estado"><Empty href="/clase-1/b02" what="B02" /></Row>
        )}
      </Block>

      <Block n="04" title="Diagnóstico DIAT" blockId="b03">
        <Row label="Componentes">
          {Object.keys(state.b03.states).length ? (
            <ul className="space-y-0.5">
              {diatComponents.map(c => {
                const st = state.b03.states[c.id];
                if (!st) return null;
                return (
                  <li key={c.id} className="text-xs">
                    <span className="mono uppercase tracking-wider text-zinc-400">{c.label}</span>
                    {' · '}
                    {componentStates.find(s => s.id === st)?.label}
                  </li>
                );
              })}
            </ul>
          ) : (
            <Empty href="/clase-1/b03" what="B03" />
          )}
        </Row>
        <Row label="Decisión implícita">
          {state.b03.implicitDecisions || <Empty href="/clase-1/b03" what="B03" />}
        </Row>
      </Block>

      <Block n="05" title="Producto A · prompt jurídico estructurado" blockId="b04">
        <Row label="Tarea">{a.task || <Empty href="/clase-1/b04" what="B04" />}</Row>
        <Row label="Nivel de riesgo">{riskLevels.find(r => r.id === a.risk)?.label ?? '—'}</Row>
        <Row label="No delego">{a.notDelegating || '—'}</Row>
        <Row label="Componentes">
          {a.components.length
            ? a.components.map(id => diatComponents.find(c => c.id === id)?.label).join(' · ')
            : '—'}
        </Row>
        <Row label="Prompt">
          {a.prompt ? (
            <pre className="mono overflow-x-auto whitespace-pre-wrap break-words rounded-lg border border-white/[0.08] bg-[oklch(0.06_0.014_250)] p-3 text-xs text-zinc-300">
              {a.prompt}
            </pre>
          ) : (
            <Empty href="/clase-1/b04" what="B04" />
          )}
        </Row>
        <Row label="Decisiones justificadas">
          {a.decisions.some(d => d.trim()) ? (
            <ol className="space-y-1.5">
              {a.decisions.map((d, i) =>
                d.trim() ? (
                  <li key={i} className="text-xs">
                    <span className="text-zinc-200">{d}</span>
                    {a.reasons[i]?.trim() && <span className="text-zinc-500"> — {a.reasons[i]}</span>}
                  </li>
                ) : null,
              )}
            </ol>
          ) : (
            '—'
          )}
        </Row>
      </Block>

      <Block n="06" title="Auditoría del propio prompt" blockId="b05">
        <Row label="Herramienta">
          {[...AI_TOOLS, AI_TOOL_NOTEBOOK].find(t => t.id === state.b05.tool)?.label ?? '—'}
        </Row>
        <Row label="Sugerencia aceptada">
          {state.b05.accepted || <Empty href="/clase-1/b05" what="B05" />}
          {state.b05.acceptedWhy && <p className="mt-1 text-xs text-zinc-500">{state.b05.acceptedWhy}</p>}
        </Row>
        <Row label="Sugerencia rechazada">
          {state.b05.rejected || <Empty href="/clase-1/b05" what="B05" />}
          {state.b05.rejectedWhy && <p className="mt-1 text-xs text-zinc-500">{state.b05.rejectedWhy}</p>}
        </Row>
      </Block>

      <Block n="07" title="Error Lab" blockId="b06">
        <Row label="Fuente real ≠ conclusión">
          {state.b06.revealCommitted
            ? `Respuesta registrada · confianza declarada: ${state.b06.revealConfidence ?? '—'}`
            : <Empty href="/clase-1/b06" what="B06" />}
        </Row>
        <Row label="Clasificaciones">
          {Object.keys(state.b06.cases).length
            ? Object.entries(state.b06.cases)
                .filter(([id]) => state.b06.committed[id])
                .map(([id, t]) => {
                  const def = errorTypes.find(x => x.id === t);
                  return `${id.toUpperCase()}: tipo ${def?.n ?? '?'}`;
                })
                .join(' · ') || '—'
            : '—'}
        </Row>
        {state.b06.takeaway && <Row label="Qué me llevo">{state.b06.takeaway}</Row>}
      </Block>

      <Block n="08" title="Grounding" blockId="b07">
        <Row label="Decisiones">
          {Object.keys(state.b07.committed).length
            ? `${Object.values(state.b07.committed).filter(Boolean).length} de 2 registradas`
            : <Empty href="/clase-1/b07" what="B07" />}
        </Row>
        {state.b07.note && <Row label="Nota">{state.b07.note}</Row>}
      </Block>

      <Block n="09" title="Producto B · matriz ICJR" blockId="b08">
        {state.b08.claims.some(c => c.claim.trim()) ? (
          <ResponsiveRows
            head={['Afirmación', 'Estatus', 'Fuente', 'Localizador', 'Estado → Acción']}
            rows={state.b08.claims
              .filter(c => c.claim.trim())
              .map(c => [
                c.claim,
                c.status ? `${c.status} · ${epistemicStatuses.find(e => e.id === c.status)?.label}` : '—',
                c.source || '—',
                c.locator || '—',
                [claimStates.find(s => s.id === c.state)?.label, claimActions.find(x => x.id === c.action)?.label]
                  .filter(Boolean)
                  .join(' → ') || '—',
              ])}
          />
        ) : (
          <Row label="Estado"><Empty href="/clase-1/b08" what="B08" /></Row>
        )}
        {state.b08.notes && <Row label="Registro">{state.b08.notes}</Row>}
      </Block>

      <Block n="10" title="Producto C · desplazamiento conceptual" blockId="b09">
        <Row label="Antes / ahora">
          {state.b09.committed ? (
            <span>
              {blameOptions.find(o => o.id === state.b00.blame)?.label ?? '—'}
              <span className="mx-2 text-zinc-600">→</span>
              <span className="text-white">{blameOptions.find(o => o.id === state.b09.blame)?.label ?? '—'}</span>
            </span>
          ) : (
            <Empty href="/clase-1/b09" what="B09" />
          )}
        </Row>
        <Row label="Antes pensaba">{state.b09.before || '—'}</Row>
        <Row label="Ahora agregaría">{state.b09.after || '—'}</Row>
        {state.b09.doubt && <Row label="Duda pendiente">{state.b09.doubt}</Row>}
      </Block>

      {/* Hitos */}
      <section aria-labelledby="hitos" className="rounded-xl border border-white/[0.10] bg-white/[0.02] p-4 sm:p-5">
        <h2 id="hitos" className="mb-3 text-base font-bold text-white">Hitos alcanzados</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {awards.map(m => (
            <li
              key={m.id}
              className={`rounded-lg border px-3 py-2.5 ${
                m.earned ? 'border-cyan-500/30 bg-cyan-500/[0.06]' : 'border-white/[0.08] bg-white/[0.01]'
              }`}
            >
              <div className={`text-sm font-semibold ${m.earned ? 'text-cyan-300' : 'text-zinc-600'}`}>
                {m.label} {m.earned && <span className="mono text-[10px] text-emerald-400">· logrado</span>}
              </div>
              <p className={`mt-0.5 text-xs ${m.earned ? 'text-zinc-400' : 'text-zinc-700'}`}>{m.description}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Entrega */}
      <section aria-labelledby="entrega" className="space-y-4 rounded-xl border border-cyan-500/30 bg-cyan-500/[0.05] p-4 sm:p-5">
        <h2 id="entrega" className="text-lg font-bold text-white">
          {progress.readyToDeliver ? 'Tu Bitácora está lista' : 'Preparar entrega'}
        </h2>

        {!progress.readyToDeliver && (
          <Callout kind="alerta">
            <p>
              Faltan hitos por completar. Puedes generar el PDF igualmente —quedará constancia de lo
              que sí hiciste—, pero conviene revisar primero:
            </p>
            <ul className="space-y-0.5 text-xs">
              {BLOCKS.filter(b => progress.blocks[b.id].missing.length > 0).map(b => (
                <li key={b.id}>
                  <Link href={`/clase-1/${b.id}`} className="underline underline-offset-2">
                    {b.code} · {b.title}
                  </Link>
                  {' — '}
                  {progress.blocks[b.id].missing.join(' ')}
                </li>
              ))}
            </ul>
          </Callout>
        )}

        <ol className="space-y-3">
          <li className="rounded-lg border border-white/[0.10] bg-white/[0.02] p-3.5">
            <div className="mono mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Paso 1 · Generar y descargar
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onGenerate}
                disabled={generating}
                className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/15 px-4 py-2.5 text-sm font-semibold text-cyan-200 transition-colors hover:bg-cyan-500/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:opacity-60"
              >
                {generating ? <FileText className="h-4 w-4 animate-pulse" aria-hidden /> : <Download className="h-4 w-4" aria-hidden />}
                {generating ? 'Generando…' : 'Generar y descargar PDF'}
              </button>
              <span className="mono text-[11px] text-zinc-500">{bitacoraFilename(state)}</span>
            </div>
            {!name && (
              <p className="mt-2 text-xs text-amber-300/80">
                Completa tu nombre arriba para que el archivo y el correo salgan identificados.
              </p>
            )}
            {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}
            {generated && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-300">
                PDF generado correctamente. Búscalo en tu carpeta de descargas.
              </p>
            )}
          </li>

          <li className={`rounded-lg border p-3.5 ${generated ? 'border-white/[0.10] bg-white/[0.02]' : 'border-white/[0.06] bg-white/[0.01]'}`}>
            <div className="mono mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Paso 2 · Abrir el correo preparado
            </div>
            <a
              href={deliveryMailto(state)}
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.14] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-cyan-500/40 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
            >
              <Mail className="h-4 w-4" aria-hidden />
              Abrir correo preparado
            </a>
            <dl className="mt-3 space-y-1 text-xs text-zinc-500">
              <div><span className="mono uppercase tracking-widest">Para</span> · {delivery.to}</div>
              <div><span className="mono uppercase tracking-widest">CC</span> · {delivery.cc}</div>
            </dl>
            <p className="mt-3 flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/[0.06] px-3 py-2 text-xs text-amber-200/80">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>
                <strong>Adjunta el PDF que acabas de generar</strong> y envía el correo. El navegador no
                puede adjuntarlo por ti: un enlace <span className="mono">mailto:</span> no admite
                archivos adjuntos.
              </span>
            </p>
          </li>
        </ol>
      </section>

      {/* Reinicio */}
      <section aria-labelledby="reinicio" className="rounded-xl border border-white/[0.08] p-4">
        <h2 id="reinicio" className="text-sm font-semibold text-zinc-300">Reiniciar Clase 1</h2>
        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="mt-2 inline-flex items-center gap-1.5 text-xs text-zinc-500 underline underline-offset-2 hover:text-rose-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
          >
            <RotateCcw className="h-3 w-3" aria-hidden />
            Borrar todo mi progreso
          </button>
        ) : (
          <div className="mt-2 rounded-lg border border-rose-500/30 bg-rose-500/[0.07] p-3">
            <p className="text-xs text-rose-200">
              Se borrará todo tu trabajo de la Clase 1 en este navegador: respuestas, Producto A,
              matriz ICJR y Producto C. <strong>No se puede deshacer.</strong> Si aún no has
              descargado el PDF, hazlo antes.
            </p>
            <div className="mt-2.5 flex gap-2">
              <button
                type="button"
                onClick={() => { reset(); setConfirmReset(false); setGenerated(false); }}
                className="rounded-lg border border-rose-500/40 bg-rose-500/15 px-3 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-500/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
              >
                Sí, borrar todo
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="rounded-lg border border-white/[0.14] px-3 py-1.5 text-xs text-zinc-300 hover:border-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
