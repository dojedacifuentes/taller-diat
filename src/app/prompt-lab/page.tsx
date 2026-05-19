'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Copy, Download, Check, ChevronRight, RotateCcw, Shield, Brain, BookOpen, FileText, Printer } from 'lucide-react';
import { roles, tasks, areas, enhancements, generatePrompt } from '@/data/promptBuilder';

type Step = 0 | 1 | 2 | 3 | 4;

export default function PromptLabPage() {
  const [step, setStep] = useState<Step>(0);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [activeEnhancements, setActiveEnhancements] = useState<string[]>(['antihallu', 'sources']);
  const [context, setContext] = useState('');
  const [copied, setCopied] = useState(false);

  const role = roles.find(r => r.id === selectedRole);
  const task = tasks.find(t => t.id === selectedTask);
  const area = areas.find(a => a.id === selectedArea);

  const canGenerate = role && task && area;
  const prompt = canGenerate ? generatePrompt(role, task, area, activeEnhancements, context) : '';

  const toggleEnhancement = (id: string) =>
    setActiveEnhancements(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([prompt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-juridico-diat-${role?.id}-${task?.id}-${area?.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head>
      <title>Prompt Jurídico DIAT</title>
      <style>
        body { font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.7;
          color: #1a1a2e; padding: 40px; max-width: 700px; margin: 0 auto; }
        h1 { font-size: 18px; border-bottom: 2px solid #06b6d4; padding-bottom: 8px; color: #0e7490; }
        pre { white-space: pre-wrap; word-wrap: break-word; background: #f8fafc;
          padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; }
        .footer { margin-top: 30px; font-size: 11px; color: #94a3b8; text-align: center; }
      </style>
    </head><body>
      <h1>⚖️ Prompt Jurídico Profesional — DIAT · PUCV 2026</h1>
      <pre>${prompt.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
      <div class="footer">Generado con DIAT Prompting Hub · Facultad de Derecho PUCV · ${new Date().toLocaleDateString('es-CL')}</div>
    </body></html>`);
    win.document.close();
    win.print();
  };

  const reset = () => {
    setStep(0); setSelectedRole(null); setSelectedTask(null);
    setSelectedArea(null); setActiveEnhancements(['antihallu', 'sources']);
    setContext('');
  };

  const enhancementIcons: Record<string, React.ReactNode> = {
    cybersec: <Shield className="w-4 h-4" />,
    antihallu: <Brain className="w-4 h-4" />,
    sources: <BookOpen className="w-4 h-4" />,
    format: <FileText className="w-4 h-4" />,
  };

  const steps = [
    { label: 'Rol', done: !!selectedRole },
    { label: 'Tarea', done: !!selectedTask },
    { label: 'Área', done: !!selectedArea },
    { label: 'Mejoras', done: true },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Zap className="w-5 h-5 text-cyan-400" />
          </span>
          Prompt Lab
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Construye tu prompt jurídico perfecto. Con capas de ciberseguridad y anti-alucinaciones incluidas.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center gap-1">
            <button
              onClick={() => setStep(i as Step)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                step === i ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' :
                s.done ? 'text-emerald-400 border border-emerald-500/20 bg-emerald-500/8' :
                'text-zinc-600 border border-white/[0.06]'
              }`}
            >
              {s.done && i !== step ? <Check className="w-3 h-3" /> : <span className="mono">{i + 1}</span>}
              {s.label}
            </button>
            {i < steps.length - 1 && <ChevronRight className="w-3 h-3 text-zinc-700" />}
          </div>
        ))}
        <button onClick={reset} className="ml-auto flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* LEFT — Builder */}
        <div className="space-y-4">

          {/* Step 0: Role */}
          <Section title="1. ¿Cuál es tu rol?" active={step === 0}>
            <div className="grid grid-cols-2 gap-2">
              {roles.map(r => (
                <OptionBtn
                  key={r.id}
                  emoji={r.emoji}
                  label={r.label}
                  selected={selectedRole === r.id}
                  onClick={() => { setSelectedRole(r.id); setStep(1); }}
                />
              ))}
            </div>
          </Section>

          {/* Step 1: Task */}
          <Section title="2. ¿Qué necesitas hacer?" active={step === 1}>
            <div className="grid grid-cols-1 gap-2">
              {tasks.map(t => (
                <OptionBtn
                  key={t.id}
                  emoji={t.emoji}
                  label={t.label}
                  selected={selectedTask === t.id}
                  onClick={() => { setSelectedTask(t.id); setStep(2); }}
                  horizontal
                />
              ))}
            </div>
          </Section>

          {/* Step 2: Area */}
          <Section title="3. ¿Qué área jurídica?" active={step === 2}>
            <div className="grid grid-cols-2 gap-2">
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
          </Section>

          {/* Step 3: Enhancements */}
          <Section title="4. Activar capas de protección" active={step === 3}>
            <div className="grid grid-cols-2 gap-2">
              {enhancements.map(e => {
                const on = activeEnhancements.includes(e.id);
                return (
                  <button
                    key={e.id}
                    onClick={() => toggleEnhancement(e.id)}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all ${
                      on ? 'border-cyan-500/35 bg-cyan-500/10 text-cyan-300' : 'border-white/[0.07] bg-white/[0.02] text-zinc-500 hover:border-white/15'
                    }`}
                  >
                    <span className={on ? 'text-cyan-400' : 'text-zinc-600'}>{enhancementIcons[e.id]}</span>
                    <div>
                      <div className="text-xs font-semibold">{e.emoji} {e.label}</div>
                      <div className="text-[10px] opacity-70 mt-0.5">{e.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Context textarea */}
            <div className="mt-3">
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium block mb-1.5">
                Contexto específico del caso (opcional)
              </label>
              <textarea
                value={context}
                onChange={e => setContext(e.target.value)}
                placeholder="Ej: contrato de arriendo de local comercial en Valparaíso, cliente es arrendador..."
                className="w-full h-24 bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-zinc-300 placeholder:text-zinc-700 resize-none focus:outline-none focus:border-cyan-500/40 transition-colors"
              />
            </div>

            {canGenerate && (
              <motion.button
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setStep(4 as Step)}
                className="w-full mt-2 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                whileTap={{ scale: 0.98 }}
              >
                <Zap className="w-4 h-4" /> Generar prompt
              </motion.button>
            )}
          </Section>
        </div>

        {/* RIGHT — Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Vista previa del prompt</span>
            {canGenerate && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] text-xs text-zinc-400 hover:text-zinc-200 hover:border-white/15 transition-all"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copiado' : 'Copiar'}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] text-xs text-zinc-400 hover:text-zinc-200 hover:border-white/15 transition-all"
                >
                  <Download className="w-3 h-3" /> TXT
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-cyan-500/25 bg-cyan-500/8 text-xs text-cyan-400 hover:bg-cyan-500/15 transition-all"
                >
                  <Printer className="w-3 h-3" /> PDF
                </button>
              </div>
            )}
          </div>

          <div className="relative rounded-2xl border border-white/[0.08] bg-[oklch(0.08_0.016_250)] min-h-[400px] overflow-hidden">
            {!canGenerate ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-8">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                  <Zap className="w-6 h-6 text-zinc-700" />
                </div>
                <p className="text-sm text-zinc-600">Completa los pasos 1-3 para generar tu prompt jurídico perfecto.</p>
                <div className="flex gap-2 flex-wrap justify-center">
                  {[selectedRole, selectedTask, selectedArea].map((v, i) => (
                    <span key={i} className={`text-xs px-2 py-1 rounded-lg border ${
                      v ? 'border-emerald-500/25 text-emerald-400 bg-emerald-500/8' :
                      'border-white/[0.06] text-zinc-700'
                    }`}>
                      {v ? '✓' : '○'} Paso {i + 1}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <AnimatePresence>
                <motion.div
                  key={prompt}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 h-full"
                >
                  <pre className="text-xs text-zinc-300 mono whitespace-pre-wrap leading-relaxed font-medium overflow-auto max-h-[560px]">
                    {prompt}
                  </pre>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {canGenerate && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-yellow-500/15 bg-yellow-500/5 p-3"
            >
              <p className="text-xs text-zinc-500 leading-relaxed">
                <span className="text-yellow-400 font-semibold">⚠️ Recuerda:</span>{' '}
                La IA es tu co-redactor. Siempre verifica jurisprudencia, artículos y fechas antes de usar el output profesionalmente.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, active, children }: { title: string; active: boolean; children: React.ReactNode }) {
  return (
    <div className={`rounded-xl border transition-all duration-200 ${
      active ? 'border-cyan-500/25 bg-[oklch(0.09_0.017_250/0.8)]' : 'border-white/[0.06] bg-[oklch(0.09_0.017_250/0.4)]'
    } p-4`}>
      <div className={`text-xs font-semibold uppercase tracking-wider mb-3 ${active ? 'text-cyan-400' : 'text-zinc-600'}`}>
        {title}
      </div>
      {children}
    </div>
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
      className={`${horizontal ? 'flex items-center gap-3 px-4 py-2.5' : 'flex flex-col items-center gap-1.5 py-3 px-2'}
        rounded-xl border text-center transition-all w-full ${
        selected
          ? 'border-cyan-500/50 bg-cyan-500/15 text-cyan-300'
          : 'border-white/[0.07] bg-white/[0.02] text-zinc-400 hover:border-white/15 hover:text-zinc-200'
      }`}
    >
      <span className={horizontal ? 'text-xl' : 'text-2xl'}>{emoji}</span>
      <span className="text-xs font-medium leading-tight">{label}</span>
      {selected && <Check className={`w-3 h-3 text-cyan-400 ${horizontal ? 'ml-auto' : 'mt-0.5'}`} />}
    </motion.button>
  );
}
