'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Copy, Download, Check, ChevronRight, RotateCcw,
  Shield, Brain, BookOpen, FileText, Printer, Bot, Code2, Layers,
} from 'lucide-react';
import {
  profiles, purposes, areas, depthLevels, targetAIs, outputFormats, enhancements,
  generatePrompt, generateSystemPrompt, generateGPTInstructions, generateClaudeProject,
  type PromptProfile, type PromptPurpose, type PromptArea,
  type DepthLevel, type TargetAI, type OutputFormat,
} from '@/data/promptBuilder';

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

const STEPS = [
  { label: 'Perfil', short: '1' },
  { label: 'Finalidad', short: '2' },
  { label: 'Área', short: '3' },
  { label: 'Profundidad', short: '4' },
  { label: 'IA', short: '5' },
  { label: 'Formato', short: '6' },
  { label: 'Protecciones', short: '7' },
];

const enhancementIcons: Record<string, React.ReactNode> = {
  cybersec: <Shield className="w-3.5 h-3.5" />,
  antihallu: <Brain className="w-3.5 h-3.5" />,
  sources: <BookOpen className="w-3.5 h-3.5" />,
  confidential: <Shield className="w-3.5 h-3.5" />,
  normVerif: <FileText className="w-3.5 h-3.5" />,
  format: <Layers className="w-3.5 h-3.5" />,
  limits: <Bot className="w-3.5 h-3.5" />,
  clarify: <Code2 className="w-3.5 h-3.5" />,
};

export default function PromptLabPage() {
  const [step, setStep] = useState<Step>(0);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedDepth, setSelectedDepth] = useState<string | null>(null);
  const [selectedAI, setSelectedAI] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [activeEnhancements, setActiveEnhancements] = useState<string[]>(['antihallu', 'sources']);
  const [context, setContext] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const profile = profiles.find(p => p.id === selectedProfile) as PromptProfile | undefined;
  const purpose = purposes.find(p => p.id === selectedPurpose) as PromptPurpose | undefined;
  const area = areas.find(a => a.id === selectedArea) as PromptArea | undefined;
  const depth = depthLevels.find(d => d.id === selectedDepth) as DepthLevel | undefined;
  const targetAI = targetAIs.find(a => a.id === selectedAI) as TargetAI | undefined;
  const format = outputFormats.find(f => f.id === selectedFormat) as OutputFormat | undefined;

  const canGenerate = !!(profile && purpose && area && depth && targetAI && format);
  const prompt = canGenerate
    ? generatePrompt(profile!, purpose!, area!, depth!, targetAI!, format!, activeEnhancements, context)
    : '';

  const completedSteps = [
    !!selectedProfile, !!selectedPurpose, !!selectedArea,
    !!selectedDepth, !!selectedAI, !!selectedFormat, true,
  ];

  const toggleEnhancement = (id: string) =>
    setActiveEnhancements(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );

  const copyText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadAs = (content: string, ext: string, label: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-juridico-diat-${label}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePDF = () => {
    if (!canGenerate) return;
    const win = window.open('', '_blank');
    if (!win) return;
    const date = new Date().toLocaleDateString('es-CL');
    const enhList = activeEnhancements.map(id => {
      const e = enhancements.find(x => x.id === id);
      return e ? `<span class="enh-chip">${e.emoji} ${e.label}</span>` : '';
    }).join('');

    win.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>LexPrompt — DIAT · PUCV ${date}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@300;400;600;700;800&display=swap');
    /* ── CRITICAL: page setup ── */
    @page { size: A4 portrait; margin: 0; }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    /* ── Force dark background at every level ── */
    html {
      background: #070b12;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      font-family: 'Space Grotesk', system-ui, sans-serif;
      background: #070b12;
      color: #cbd5e1;
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      padding: 48px 56px 52px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      position: relative;
    }
    /* scan-line texture */
    body::before {
      content: '';
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent, transparent 2px,
        rgba(0,0,0,.05) 2px, rgba(0,0,0,.05) 4px
      );
      pointer-events: none;
      z-index: 0;
    }
    /* subtle grid */
    body::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(6,182,212,.015) 1px, transparent 1px),
        linear-gradient(90deg, rgba(6,182,212,.015) 1px, transparent 1px);
      background-size: 32px 32px;
      pointer-events: none;
      z-index: 0;
    }
    .wrap { position: relative; z-index: 1; }

    /* top accent line */
    .accent-top {
      height: 3px;
      background: linear-gradient(90deg, transparent, #06b6d4, #6366f1, transparent);
      margin: -48px -56px 40px;
      width: calc(100% + 112px);
    }

    /* header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
      padding-bottom: 22px;
      margin-bottom: 24px;
      border-bottom: 1px solid rgba(6,182,212,.2);
    }
    .logo-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
    .badge-diat {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 900; font-size: 11px;
      letter-spacing: .15em; padding: 4px 11px;
      border-radius: 6px;
      border: 1px solid rgba(6,182,212,.45);
      background: rgba(6,182,212,.12);
      color: #67e8f9;
    }
    .badge-inst {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9.5px; padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid rgba(129,140,248,.3);
      background: rgba(129,140,248,.08);
      color: #a5b4fc;
    }
    .h1 { font-size: 24px; font-weight: 800; color: #f8fafc; letter-spacing: -.02em; line-height: 1.15; }
    .sub { font-size: 11px; color: #475569; margin-top: 4px; font-family: 'JetBrains Mono', monospace; }
    .meta { text-align: right; font-size: 10px; color: #334155; font-family: 'JetBrains Mono', monospace; line-height: 1.9; }
    .meta .val { color: #64748b; }

    /* config grid */
    .config {
      display: grid; grid-template-columns: 1fr 1fr; gap: 7px;
      margin-bottom: 20px;
      background: rgba(255,255,255,.025);
      border: 1px solid rgba(255,255,255,.07);
      border-radius: 12px; padding: 16px 20px;
    }
    .config-item { font-size: 10.5px; color: #475569; line-height: 1.6; }
    .config-item span { font-weight: 700; color: #67e8f9; font-family: 'JetBrains Mono', monospace; }

    /* enhancements */
    .enhs { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px; }
    .enh-chip {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9.5px; font-weight: 600;
      padding: 4px 10px; border-radius: 20px;
      border: 1px solid rgba(129,140,248,.3);
      background: rgba(129,140,248,.08);
      color: #a5b4fc;
    }

    /* section label */
    .section-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5px; font-weight: 700;
      letter-spacing: .18em; text-transform: uppercase;
      color: #334155; margin-bottom: 10px;
      display: flex; align-items: center; gap: 8px;
    }
    .section-label::after { content: ''; flex: 1; height: 1px; background: rgba(6,182,212,.12); }

    /* prompt box */
    .prompt-box {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11.5px; line-height: 1.9;
      color: #e2e8f0;
      background: rgba(6,182,212,.04);
      border: 1px solid rgba(6,182,212,.2);
      border-left: 3px solid #06b6d4;
      border-radius: 0 12px 12px 0;
      padding: 24px 26px;
      white-space: pre-wrap;
      word-break: break-word;
    }

    /* system prompts section */
    .sp-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
      margin-top: 22px;
    }
    .sp-card {
      padding: 14px 16px; border-radius: 10px;
      border: 1px solid rgba(255,255,255,.07);
      background: rgba(255,255,255,.02);
    }
    .sp-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5px; font-weight: 700;
      letter-spacing: .12em; text-transform: uppercase;
      margin-bottom: 8px;
    }
    .sp-box {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px; line-height: 1.7;
      color: #64748b;
      white-space: pre-wrap; word-break: break-word;
    }

    /* footer */
    .footer {
      margin-top: 32px; padding-top: 16px;
      border-top: 1px solid rgba(255,255,255,.06);
      display: flex; justify-content: space-between; align-items: center;
      font-size: 9px; font-family: 'JetBrains Mono', monospace; color: #1e293b;
    }
    .footer-badge {
      display: inline-flex; align-items: center; gap: 4px;
      background: rgba(6,182,212,.08); color: #0891b2;
      border: 1px solid rgba(6,182,212,.2);
      border-radius: 4px; padding: 3px 9px;
      font-size: 8.5px; font-weight: 700;
    }

    @media print {
      html, body { background: #070b12 !important; }
      .prompt-box { border-left-color: #06b6d4 !important; }
    }
  </style>
</head>
<body>
<div class="wrap">
  <div class="accent-top"></div>

  <div class="header">
    <div>
      <div class="logo-row">
        <span class="badge-diat">DIAT</span>
        <span class="badge-inst">FD · PUCV</span>
      </div>
      <h1 class="h1">⚖️ LexPrompt Architect</h1>
      <div class="sub">Prompt Jurídico Profesional · Generado con IA · v2.1</div>
    </div>
    <div class="meta">
      <div>Generado: <span class="val">${date}</span></div>
      <div>Plataforma: <span class="val">DIAT Prompting Hub</span></div>
      <div>Facultad de Derecho · PUCV</div>
      <div>Valparaíso · Chile</div>
    </div>
  </div>

  <div class="section-label">Configuración del prompt</div>
  <div class="config">
    <div class="config-item">Perfil: <span>${profile?.emoji ?? ''} ${profile?.label ?? '—'}</span></div>
    <div class="config-item">Finalidad: <span>${purpose?.emoji ?? ''} ${purpose?.label ?? '—'}</span></div>
    <div class="config-item">Área jurídica: <span>${area?.emoji ?? ''} ${area?.label ?? '—'}</span></div>
    <div class="config-item">Profundidad: <span>${depth?.label ?? '—'}</span></div>
    <div class="config-item">IA objetivo: <span>${targetAI?.label ?? '—'}</span></div>
    <div class="config-item">Formato de salida: <span>${format?.emoji ?? ''} ${format?.label ?? '—'}</span></div>
  </div>

  ${enhList ? `<div class="section-label" style="margin-bottom:10px">Capas de protección activas</div><div class="enhs">${enhList}</div>` : ''}

  <div class="section-label">Prompt generado</div>
  <div class="prompt-box">${prompt.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>

  <div class="footer">
    <div>DIAT Prompting Hub · Facultad de Derecho PUCV · ${new Date().getFullYear()} · Septiembre 2026</div>
    <div style="display:flex;align-items:center;gap:8px">
      <span class="footer-badge">✦ IA Jurídica Aplicada</span>
      <span>"Construye criterio antes de automatizar."</span>
    </div>
  </div>
</div>
</body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 800);
  };

  const reset = () => {
    setStep(0);
    setSelectedProfile(null); setSelectedPurpose(null); setSelectedArea(null);
    setSelectedDepth(null); setSelectedAI(null); setSelectedFormat(null);
    setActiveEnhancements(['antihallu', 'sources']);
    setContext('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400" />
            </span>
            LexPrompt Architect
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            7 pasos. Prompt jurídico profesional con capas de ciberseguridad y anti-alucinaciones.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="px-2.5 py-1 rounded-full border border-cyan-500/25 bg-cyan-500/8 text-cyan-400 font-semibold">
            LexPrompt v2.0
          </span>
          <span className="px-2.5 py-1 rounded-full border border-purple-500/25 bg-purple-500/8 text-purple-400 font-semibold">
            DIAT · PUCV
          </span>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {STEPS.map((s, i) => (
          <div key={s.label} className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setStep(i as Step)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                step === i
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : completedSteps[i]
                  ? 'text-emerald-400 border border-emerald-500/20 bg-emerald-500/8'
                  : 'text-zinc-600 border border-white/[0.06] hover:text-zinc-400'
              }`}
            >
              {completedSteps[i] && i !== step ? (
                <Check className="w-3 h-3" />
              ) : (
                <span className="mono w-3 text-center">{i + 1}</span>
              )}
              {s.label}
            </button>
            {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-zinc-700 shrink-0" />}
          </div>
        ))}
        <button
          onClick={reset}
          className="ml-auto flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors shrink-0 pl-2"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* LEFT — Builder */}
        <div className="space-y-3">

          {/* Step 0: Profile */}
          <WizardSection
            num={1}
            title="¿Cuál es tu perfil?"
            active={step === 0}
            done={!!selectedProfile}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {profiles.map(p => (
                <OptionBtn
                  key={p.id}
                  emoji={p.emoji}
                  label={p.label}
                  selected={selectedProfile === p.id}
                  onClick={() => { setSelectedProfile(p.id); setStep(1); }}
                />
              ))}
            </div>
          </WizardSection>

          {/* Step 1: Purpose */}
          <WizardSection
            num={2}
            title="¿Cuál es tu finalidad jurídica?"
            active={step === 1}
            done={!!selectedPurpose}
          >
            <div className="grid grid-cols-1 gap-1.5">
              {purposes.map(p => (
                <OptionBtn
                  key={p.id}
                  emoji={p.emoji}
                  label={p.label}
                  selected={selectedPurpose === p.id}
                  onClick={() => { setSelectedPurpose(p.id); setStep(2); }}
                  horizontal
                />
              ))}
            </div>
          </WizardSection>

          {/* Step 2: Area */}
          <WizardSection
            num={3}
            title="¿Qué área jurídica?"
            active={step === 2}
            done={!!selectedArea}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {areas.map(a => (
                <OptionBtn
                  key={a.id}
                  emoji={a.emoji}
                  label={a.label}
                  selected={selectedArea === a.id}
                  onClick={() => { setSelectedArea(a.id); setStep(3); }}
                />
              ))}
            </div>
          </WizardSection>

          {/* Step 3: Depth */}
          <WizardSection
            num={4}
            title="¿Nivel de profundidad?"
            active={step === 3}
            done={!!selectedDepth}
          >
            <div className="grid grid-cols-2 gap-2">
              {depthLevels.map(d => (
                <motion.button
                  key={d.id}
                  onClick={() => { setSelectedDepth(d.id); setStep(4); }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex flex-col gap-0.5 p-3 rounded-xl border text-left transition-all ${
                    selectedDepth === d.id
                      ? 'border-cyan-500/50 bg-cyan-500/15'
                      : 'border-white/[0.07] bg-white/[0.02] hover:border-white/15'
                  }`}
                >
                  <span className={`text-xs font-bold ${selectedDepth === d.id ? 'text-cyan-300' : 'text-zinc-300'}`}>
                    {d.label}
                  </span>
                  <span className="text-[10px] text-zinc-600">{d.description}</span>
                  {selectedDepth === d.id && <Check className="w-3 h-3 text-cyan-400 mt-0.5" />}
                </motion.button>
              ))}
            </div>
          </WizardSection>

          {/* Step 4: Target AI */}
          <WizardSection
            num={5}
            title="¿A qué IA va dirigido?"
            active={step === 4}
            done={!!selectedAI}
          >
            <div className="grid grid-cols-1 gap-2">
              {targetAIs.map(ai => (
                <motion.button
                  key={ai.id}
                  onClick={() => { setSelectedAI(ai.id); setStep(5); }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    selectedAI === ai.id
                      ? 'border-cyan-500/50 bg-cyan-500/15'
                      : 'border-white/[0.07] bg-white/[0.02] hover:border-white/15'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-bold ${selectedAI === ai.id ? 'text-cyan-300' : 'text-zinc-300'}`}>
                      {ai.label}
                    </div>
                    <div className="text-[10px] text-zinc-600 truncate">{ai.description}</div>
                  </div>
                  {selectedAI === ai.id && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                </motion.button>
              ))}
            </div>
          </WizardSection>

          {/* Step 5: Format */}
          <WizardSection
            num={6}
            title="¿Formato de salida?"
            active={step === 5}
            done={!!selectedFormat}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {outputFormats.map(f => (
                <OptionBtn
                  key={f.id}
                  emoji={f.emoji}
                  label={f.label}
                  selected={selectedFormat === f.id}
                  onClick={() => { setSelectedFormat(f.id); setStep(6); }}
                />
              ))}
            </div>
          </WizardSection>

          {/* Step 6: Protections */}
          <WizardSection
            num={7}
            title="Capas de protección"
            active={step === 6}
            done
          >
            <div className="grid grid-cols-2 gap-2">
              {enhancements.map(e => {
                const on = activeEnhancements.includes(e.id);
                return (
                  <button
                    key={e.id}
                    onClick={() => toggleEnhancement(e.id)}
                    className={`flex items-start gap-2 p-2.5 rounded-xl border text-left transition-all ${
                      on
                        ? 'border-cyan-500/35 bg-cyan-500/10'
                        : 'border-white/[0.07] bg-white/[0.02] hover:border-white/15'
                    }`}
                  >
                    <span className={`mt-0.5 shrink-0 ${on ? 'text-cyan-400' : 'text-zinc-600'}`}>
                      {enhancementIcons[e.id]}
                    </span>
                    <div className="min-w-0">
                      <div className={`text-xs font-semibold leading-tight ${on ? 'text-cyan-300' : 'text-zinc-400'}`}>
                        {e.emoji} {e.label}
                      </div>
                      <div className="text-[10px] text-zinc-600 mt-0.5 leading-tight">{e.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-3">
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium block mb-1.5">
                Contexto del caso (opcional)
              </label>
              <textarea
                value={context}
                onChange={e => setContext(e.target.value)}
                placeholder="Ej: contrato de arriendo local comercial Valparaíso, cliente arrendador quiere cláusula de término anticipado..."
                className="w-full h-20 bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-zinc-300 placeholder:text-zinc-700 resize-none focus:outline-none focus:border-cyan-500/40 transition-colors"
              />
            </div>

            {canGenerate && (
              <motion.button
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setStep(7 as Step)}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-black font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <Zap className="w-4 h-4" /> Generar prompt profesional
              </motion.button>
            )}
          </WizardSection>
        </div>

        {/* RIGHT — Preview */}
        <div className="space-y-3 xl:sticky xl:top-6 xl:self-start">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Vista previa del prompt
            </span>
            {canGenerate && (
              <div className="flex items-center gap-1 flex-wrap">
                <ExportBtn
                  icon={<Copy className="w-3 h-3" />}
                  label={copied === 'copy' ? 'Copiado' : 'Copiar'}
                  active={copied === 'copy'}
                  onClick={() => copyText(prompt, 'copy')}
                />
                <ExportBtn
                  icon={<Download className="w-3 h-3" />}
                  label="TXT"
                  onClick={() => downloadAs(prompt, 'txt', `${profile?.id}-${area?.id}`)}
                />
                <ExportBtn
                  icon={<Download className="w-3 h-3" />}
                  label="MD"
                  onClick={() => downloadAs(`# Prompt Jurídico DIAT\n\n\`\`\`\n${prompt}\n\`\`\`\n`, 'md', `${profile?.id}-${area?.id}`)}
                />
                <ExportBtn
                  icon={<Printer className="w-3 h-3" />}
                  label="PDF"
                  onClick={handlePDF}
                  accent
                />
              </div>
            )}
          </div>

          {/* Prompt preview */}
          <div className="relative rounded-2xl border border-white/[0.08] bg-[oklch(0.08_0.016_250)] min-h-[360px] overflow-hidden">
            {!canGenerate ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center p-8">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                  <Zap className="w-7 h-7 text-zinc-700" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500 font-medium">Completa los 7 pasos</p>
                  <p className="text-xs text-zinc-700 mt-1">Tu prompt jurídico profesional aparecerá aquí.</p>
                </div>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {[selectedProfile, selectedPurpose, selectedArea, selectedDepth, selectedAI, selectedFormat].map((v, i) => (
                    <span key={i} className={`text-[10px] px-2 py-0.5 rounded-md border mono ${
                      v
                        ? 'border-emerald-500/25 text-emerald-400 bg-emerald-500/8'
                        : 'border-white/[0.06] text-zinc-700'
                    }`}>
                      {v ? '✓' : '○'} {STEPS[i].label}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${prompt.length}-${activeEnhancements.join('')}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="p-4"
                >
                  <pre className="text-[11px] text-zinc-300 mono whitespace-pre-wrap leading-relaxed overflow-auto max-h-[520px]">
                    {prompt}
                  </pre>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Advanced export buttons */}
          {canGenerate && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <div className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium">
                Exportar variantes
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                <VariantBtn
                  icon={<Bot className="w-3.5 h-3.5" />}
                  label="System Prompt"
                  desc={`Optimizado para ${targetAI?.label}`}
                  color="indigo"
                  onClick={() => copyText(generateSystemPrompt(prompt, targetAI!), 'system')}
                  copied={copied === 'system'}
                />
                <VariantBtn
                  icon={<Code2 className="w-3.5 h-3.5" />}
                  label="GPT Personalizado"
                  desc="Instructions listas para ChatGPT"
                  color="emerald"
                  onClick={() => copyText(generateGPTInstructions(prompt), 'gpt')}
                  copied={copied === 'gpt'}
                />
                <VariantBtn
                  icon={<Layers className="w-3.5 h-3.5" />}
                  label="Claude Project"
                  desc="System prompt para Claude Projects"
                  color="purple"
                  onClick={() => copyText(generateClaudeProject(prompt), 'claude')}
                  copied={copied === 'claude'}
                />
              </div>
            </motion.div>
          )}

          {/* AI optimization tip */}
          {canGenerate && targetAI && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-3"
            >
              <div className="text-[10px] text-cyan-500 font-semibold uppercase tracking-wider mb-1.5">
                💡 Tip para {targetAI.label}
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                {targetAI.optimizationTip}
              </p>
            </motion.div>
          )}

          {canGenerate && (
            <div className="rounded-xl border border-yellow-500/15 bg-yellow-500/5 p-3">
              <p className="text-xs text-zinc-500 leading-relaxed">
                <span className="text-yellow-400 font-semibold">⚠️ Recuerda:</span>{' '}
                La IA es tu co-redactor. Verifica jurisprudencia en pjud.cl y artículos en bcn.cl antes de uso profesional.
                La responsabilidad final es tuya.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WizardSection({
  num, title, active, done, children,
}: {
  num: number; title: string; active: boolean; done: boolean; children: React.ReactNode;
}) {
  return (
    <motion.div
      animate={{ opacity: active ? 1 : 0.7 }}
      className={`rounded-xl border transition-all duration-200 p-4 ${
        active
          ? 'border-cyan-500/25 bg-[oklch(0.09_0.017_250/0.9)]'
          : done
          ? 'border-emerald-500/15 bg-[oklch(0.09_0.017_250/0.4)]'
          : 'border-white/[0.06] bg-[oklch(0.09_0.017_250/0.3)]'
      }`}
    >
      <div className={`text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2 ${
        active ? 'text-cyan-400' : done ? 'text-emerald-500' : 'text-zinc-600'
      }`}>
        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] border ${
          active ? 'border-cyan-500/50 bg-cyan-500/20 text-cyan-400' :
          done ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400' :
          'border-zinc-700 text-zinc-600'
        }`}>
          {done && !active ? '✓' : num}
        </span>
        {title}
      </div>
      {children}
    </motion.div>
  );
}

function OptionBtn({
  emoji, label, selected, onClick, horizontal = false,
}: {
  emoji: string; label: string; selected: boolean; onClick: () => void; horizontal?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`${
        horizontal
          ? 'flex items-center gap-3 px-4 py-2.5 text-left'
          : 'flex flex-col items-center gap-1 py-3 px-2 text-center'
      } rounded-xl border transition-all w-full ${
        selected
          ? 'border-cyan-500/50 bg-cyan-500/15'
          : 'border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.03]'
      }`}
    >
      <span className={horizontal ? 'text-xl shrink-0' : 'text-2xl'}>{emoji}</span>
      <span className={`text-xs font-medium leading-tight flex-1 ${selected ? 'text-cyan-300' : 'text-zinc-400'}`}>
        {label}
      </span>
      {selected && <Check className={`w-3 h-3 text-cyan-400 shrink-0 ${horizontal ? '' : 'mt-0.5'}`} />}
    </motion.button>
  );
}

function ExportBtn({
  icon, label, onClick, active = false, accent = false,
}: {
  icon: React.ReactNode; label: string; onClick: () => void; active?: boolean; accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs transition-all ${
        active
          ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400'
          : accent
          ? 'border-cyan-500/35 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
          : 'border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-zinc-200 hover:border-white/15'
      }`}
    >
      {active ? <Check className="w-3 h-3" /> : icon}
      {label}
    </button>
  );
}

function VariantBtn({
  icon, label, desc, color, onClick, copied,
}: {
  icon: React.ReactNode; label: string; desc: string; color: string; onClick: () => void; copied: boolean;
}) {
  const colors: Record<string, string> = {
    indigo: 'border-indigo-500/25 bg-indigo-500/8 text-indigo-400 hover:bg-indigo-500/15',
    emerald: 'border-emerald-500/25 bg-emerald-500/8 text-emerald-400 hover:bg-emerald-500/15',
    purple: 'border-purple-500/25 bg-purple-500/8 text-purple-400 hover:bg-purple-500/15',
  };
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all ${colors[color]}`}
    >
      <span className="shrink-0">{copied ? <Check className="w-3.5 h-3.5" /> : icon}</span>
      <div className="flex-1 text-left min-w-0">
        <div className="text-xs font-semibold">{copied ? '¡Copiado!' : label}</div>
        <div className="text-[10px] opacity-60 truncate">{desc}</div>
      </div>
      <Copy className="w-3 h-3 opacity-40 shrink-0" />
    </button>
  );
}
