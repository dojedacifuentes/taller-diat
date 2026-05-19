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
    win.document.write(`<!DOCTYPE html><html lang="es"><head>
      <meta charset="utf-8">
      <title>Prompt Jurídico DIAT · PUCV ${date}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Space+Grotesk:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Space Grotesk', sans-serif; background: #fff; color: #0f172a; padding: 48px; max-width: 780px; margin: 0 auto; }
        .header { border-bottom: 3px solid #06b6d4; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
        .header h1 { font-size: 20px; font-weight: 700; color: #0e7490; }
        .header .meta { font-size: 11px; color: #94a3b8; text-align: right; line-height: 1.6; }
        .config { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 28px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 10px; padding: 16px; }
        .config-item { font-size: 11px; color: #475569; }
        .config-item span { font-weight: 600; color: #0e7490; }
        .prompt-box { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.8; color: #1e293b; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 24px; white-space: pre-wrap; word-break: break-word; }
        .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; }
        .badge { display: inline-block; background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; border-radius: 4px; padding: 2px 8px; font-size: 10px; font-weight: 600; }
        @media print { body { padding: 32px; } }
      </style>
    </head><body>
      <div class="header">
        <div>
          <h1>⚖️ LexPrompt Architect v2.0</h1>
          <div style="font-size:13px;color:#475569;margin-top:4px;">Prompt Jurídico Profesional — DIAT · PUCV</div>
        </div>
        <div class="meta">
          Generado: ${date}<br>
          Facultad de Derecho · PUCV<br>
          Valparaíso · Chile
        </div>
      </div>
      <div class="config">
        <div class="config-item">Perfil: <span>${profile?.emoji} ${profile?.label}</span></div>
        <div class="config-item">Finalidad: <span>${purpose?.emoji} ${purpose?.label}</span></div>
        <div class="config-item">Área: <span>${area?.emoji} ${area?.label}</span></div>
        <div class="config-item">Profundidad: <span>${depth?.label}</span></div>
        <div class="config-item">IA objetivo: <span>${targetAI?.label}</span></div>
        <div class="config-item">Formato: <span>${format?.emoji} ${format?.label}</span></div>
      </div>
      <div class="prompt-box">${prompt.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
      <div class="footer">
        <div>DIAT Prompting Hub · Facultad de Derecho PUCV · 2026</div>
        <div><span class="badge">Construido con IA</span> · "Construye criterio antes de automatizar."</div>
      </div>
    </body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 300);
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
