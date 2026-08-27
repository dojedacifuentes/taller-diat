'use client';
// ─────────────────────────────────────────────────────────────────────────────
// ENTREGA DE LA CLASE 1
//
// Un solo objeto alimenta la vista, la descarga y el correo. El botón de envío
// no dice «Enviado» hasta que el servidor lo confirma, y si el correo falla el
// trabajo sigue intacto: se descarga y se reintenta.
// ─────────────────────────────────────────────────────────────────────────────
import { useMemo, useState } from 'react';
import { Check, Mail, RotateCcw } from 'lucide-react';
import { useClass1 } from '@/lib/class1/store';
import {
  buildClass1Submission, renderSubmissionMarkdown, submissionFilename,
} from '@/lib/class1/submission';
import {
  downloadSubmission, fallbackMailto, manualDelivery, sendSubmission, type SendStatus,
  SUBMISSION_SUBJECT, delivery,
} from '@/lib/class1/delivery';
import { generateClass1PDF } from '@/lib/class1/bitacoraPdf';
import { DownloadButton, Notice, Panel, TextField } from './ui';
import { ReiniciarClase } from './ReiniciarClase';

export function Entrega() {
  const { state, progress, update, hydrated } = useClass1();
  const [status, setStatus] = useState<SendStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const submission = useMemo(() => buildClass1Submission(state), [state]);
  const name = state.identity.name.trim();
  const filename = submissionFilename(submission);

  async function onSend() {
    setStatus('sending');
    setError(null);
    const result = await sendSubmission(submission);
    if (result.ok) {
      setStatus('sent');
      update(s => ({ ...s, submission: { ...s.submission, sentAt: new Date().toISOString() } }));
      return;
    }
    // Que el servidor no tenga correo configurado no es un error del estudiante
    // ni algo que se arregle reintentando: se le ofrece la vía manual, que
    // siempre funciona.
    setStatus(result.configured ? 'error' : 'manual');
    setError(result.message);
  }

  function onManual() {
    const file = manualDelivery(submission);
    setDownloaded(file);
    update(s => ({ ...s, submission: { ...s.submission, downloadedAt: new Date().toISOString() } }));
  }

  function onDownload() {
    const file = downloadSubmission(submission);
    setDownloaded(file);
    update(s => ({ ...s, submission: { ...s.submission, downloadedAt: new Date().toISOString() } }));
  }

  async function onDownloadPdf() {
    setPdfError(null);
    try {
      await generateClass1PDF(submission);
    } catch {
      setPdfError('No se pudo generar el PDF. Descarga el archivo .md, que contiene lo mismo.');
    }
  }

  if (!hydrated) {
    return <div className="h-64 animate-pulse rounded-2xl border border-white/[0.08] bg-white/[0.02]" />;
  }

  return (
    <Panel className="border-cyan-500/30 bg-cyan-500/[0.05]">
      <h2 className="text-lg font-bold text-white">Entrega</h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <TextField
          label="Nombre o identificador"
          value={state.identity.name}
          onChange={v => update(s => ({ ...s, identity: { ...s.identity, name: v } }))}
          placeholder="Ana Pérez"
        />
        <TextField
          label="Correo (opcional)"
          type="email"
          value={state.identity.email}
          onChange={v => update(s => ({ ...s, identity: { ...s.identity, email: v } }))}
          placeholder="ana.perez@pucv.cl"
        />
      </div>

      {!progress.readyToDeliver && (
        <div className="mt-4">
          <Notice tone="warn">
            Puedes entregar igualmente: quedará constancia de lo que sí hiciste.
          </Notice>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <DownloadButton onClick={onDownload} label="Descargar mi Clase 1" />
        <DownloadButton onClick={onDownloadPdf} label="Descargar en PDF" />

        {status === 'sent' ? (
          <span className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-emerald-500/45 bg-emerald-500/15 px-4 py-2.5 text-sm font-semibold text-emerald-200">
            <Check className="h-4 w-4 shrink-0" aria-hidden />
            Enviado ✓
          </span>
        ) : (
          <button
            type="button"
            onClick={onSend}
            disabled={status === 'sending' || !name}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-cyan-500/45 bg-cyan-500/15 px-4 py-2.5 text-sm font-semibold text-cyan-100 transition-colors hover:bg-cyan-500/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-zinc-600"
          >
            {status === 'error' ? (
              <RotateCcw className="h-4 w-4 shrink-0" aria-hidden />
            ) : (
              <Mail className="h-4 w-4 shrink-0" aria-hidden />
            )}
            {status === 'sending'
              ? 'Enviando…'
              : status === 'error'
                ? 'No se pudo enviar · Reintentar'
                : 'Enviar Clase 1'}
          </button>
        )}
      </div>

      {!name && (
        <p className="mt-3 text-xs text-amber-300/80">
          Escribe tu nombre o identificador para poder enviar.
        </p>
      )}

      {downloaded && (
        <p role="status" className="mt-3 text-xs text-emerald-300">
          Descargado como {downloaded}.
        </p>
      )}
      {pdfError && <p className="mt-3 text-xs text-rose-300">{pdfError}</p>}

      {status === 'manual' && (
        <div className="mt-4 space-y-3 rounded-xl border border-amber-500/30 bg-amber-500/[0.07] px-3.5 py-3">
          <p className="text-xs leading-relaxed text-amber-100">
            El envío automático no está disponible en este servidor. Entrega en un paso: descargamos
            tu archivo y abrimos tu correo con el destinatario y el asunto ya puestos. Solo tienes
            que adjuntar el archivo descargado y enviar.
          </p>
          <button
            type="button"
            onClick={onManual}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-amber-400/50 bg-amber-400/15 px-4 py-2.5 text-sm font-semibold text-amber-100 transition-colors hover:bg-amber-400/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
          >
            <Mail className="h-4 w-4 shrink-0" aria-hidden />
            Descargar y abrir mi correo
          </button>
          <p className="text-[11px] leading-relaxed text-amber-200/70">
            Destinatario: {delivery.to} · Asunto: «{SUBMISSION_SUBJECT}»
          </p>
        </div>
      )}

      {status === 'error' && error && (
        <div className="mt-4 space-y-2 rounded-xl border border-rose-500/30 bg-rose-500/[0.07] px-3.5 py-3">
          <p className="text-xs leading-relaxed text-rose-200">{error}</p>
          <p className="text-xs leading-relaxed text-rose-200/80">
            Tu trabajo sigue guardado. Puedes reintentar, o descargar el archivo y{' '}
            <a href={fallbackMailto(submission)} className="underline underline-offset-2">
              enviarlo desde tu correo
            </a>
            .
          </p>
        </div>
      )}

      {/* Reinicio. Ver ReiniciarClase: sin esta salida la clase queda en un
          callejón, porque la pregunta guía se bloquea al confirmarla. */}
      <div className="mt-5 border-t border-white/[0.08] pt-4">
        <ReiniciarClase
          onReset={() => {
            setStatus('idle');
            setError(null);
            setDownloaded(null);
          }}
        />
      </div>

      <details className="mt-5 rounded-xl border border-white/[0.10] bg-[oklch(0.06_0.014_250)]">
        <summary className="mono min-h-11 cursor-pointer list-none px-3.5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-400">
          Ver lo que voy a entregar · {filename}
        </summary>
        <pre className="mono max-h-[32rem] overflow-y-auto whitespace-pre-wrap break-words border-t border-white/[0.08] px-3.5 py-3.5 text-[12px] leading-relaxed text-zinc-400">
          {renderSubmissionMarkdown(submission)}
        </pre>
      </details>
    </Panel>
  );
}
