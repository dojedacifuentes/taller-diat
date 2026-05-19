'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Copy, Check, RotateCcw, Download,
  Zap, Shield, Brain, BookOpen, ArrowRight,
} from 'lucide-react';
import {
  purposes, areas, depthLevels, targetAIs, enhancements, outputFormats, profiles,
  generatePrompt,
  type PromptPurpose, type PromptArea, type DepthLevel, type TargetAI,
} from '@/data/promptBuilder';
import { generatePromptPDF } from '@/lib/pdfGenerators';

// ── Types ──────────────────────────────────────────────────────────────────────
type FlowStep = 'objetivo' | 'area' | 'profundidad' | 'modelo' | 'generating' | 'resultado';

interface FlowSel {
  objetivo: PromptPurpose | null;
  area: PromptArea | null;
  profundidad: DepthLevel | null;
  modelo: TargetAI | null;
}

// ── Auto-mappings ──────────────────────────────────────────────────────────────
const profileMap: Record<string, string> = {
  estudiar: 'estudiante', examen: 'estudiante',
  redactar: 'abogado', sentencia: 'abogado', contrato: 'abogado',
  audiencia: 'abogado', estrategia: 'abogado',
  doctrina: 'academico', comparar: 'academico', agente: 'academico',
};

function autoProfile(purpose: PromptPurpose) {
  return profiles.find(p => p.id === (profileMap[purpose.id] || 'abogado'))!;
}

function autoFormat(purpose: PromptPurpose, depth: DepthLevel) {
  if (purpose.id === 'examen')    return outputFormats.find(f => f.id === 'preguntas')!;
  if (purpose.id === 'redactar')  return outputFormats.find(f => f.id === 'minuta')!;
  if (purpose.id === 'agente')    return outputFormats.find(f => f.id === 'system_prompt')!;
  if (purpose.id === 'estrategia' || purpose.id === 'audiencia')
                                  return outputFormats.find(f => f.id === 'checklist')!;
  if (depth.id === 'academico')   return outputFormats.find(f => f.id === 'informe')!;
  return outputFormats.find(f => f.id === 'esquema')!;
}

// ── Generating phases ──────────────────────────────────────────────────────────
const GEN_PHASES = [
  'ANALYZING LEGAL CONTEXT...',
  'CALIBRATING ROL ENGINE...',
  'ACTIVATING HALLUCINATION GUARD...',
  'BUILDING PROMPT STRUCTURE...',
  'FINALIZING SECURITY LAYERS...',
  'EXPORT READY ✓',
];

// ── Step config ────────────────────────────────────────────────────────────────
const STEP_ORDER: FlowStep[] = ['objetivo', 'area', 'profundidad', 'modelo', 'generating', 'resultado'];

const BREADCRUMB = [
  { key: 'objetivo',   label: 'OBJETIVO' },
  { key: 'area',       label: 'ÁREA' },
  { key: 'profundidad',label: 'PROFUNDIDAD' },
  { key: 'modelo',     label: 'MODELO' },
  { key: 'generating', label: 'GENERAR' },
];

// ── Card component ─────────────────────────────────────────────────────────────
interface CardProps {
  emoji?: string;
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  accent?: string;
  delay?: number;
}

function FlowCard({ emoji, label, description, selected, onClick, accent = 'cyan', delay = 0 }: CardProps) {
  const accentMap: Record<string, string> = {
    cyan:   'border-cyan-500/60 bg-cyan-500/[0.08] shadow-[0_0_20px_rgba(6,182,212,0.12)]',
    indigo: 'border-indigo-500/60 bg-indigo-500/[0.08] shadow-[0_0_20px_rgba(129,140,248,0.12)]',
    purple: 'border-purple-500/60 bg-purple-500/[0.08] shadow-[0_0_20px_rgba(168,85,247,0.12)]',
  };
  const hoverMap: Record<string, string> = {
    cyan:   'hover:border-cyan-500/30 hover:bg-cyan-500/[0.04]',
    indigo: 'hover:border-indigo-500/30 hover:bg-indigo-500/[0.04]',
    purple: 'hover:border-purple-500/30 hover:bg-purple-500/[0.04]',
  };
  const textMap: Record<string, string> = {
    cyan: 'text-cyan-400', indigo: 'text-indigo-400', purple: 'text-purple-400',
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.22 }}
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.975 }}
      onClick={onClick}
      className={`
        relative w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer
        ${selected
          ? accentMap[accent]
          : `border-white/[0.07] bg-white/[0.02] ${hoverMap[accent]}`
        }
      `}
    >
      {selected && (
        <motion.div
          layoutId="selection-glow"
          className="absolute inset-0 rounded-xl pointer-events-none"
          initial={false}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        />
      )}
      <div className="flex items-start gap-3">
        {emoji && (
          <span className="text-xl shrink-0 mt-0.5">{emoji}</span>
        )}
        <div className="min-w-0">
          <div className={`font-bold text-sm leading-tight ${selected ? textMap[accent] : 'text-zinc-200'}`}>
            {label}
          </div>
          {description && (
            <div className="text-[11px] text-zinc-500 mt-1 leading-relaxed">{description}</div>
          )}
        </div>
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
              accent === 'cyan' ? 'bg-cyan-500' : accent === 'indigo' ? 'bg-indigo-500' : 'bg-purple-500'
            }`}
          >
            <Check className="w-2.5 h-2.5 text-black" />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}

// ── DNA Panel ──────────────────────────────────────────────────────────────────
function DNAPanel({ sel, promptPreview }: { sel: FlowSel; promptPreview: string }) {
  const completedCount = Object.values(sel).filter(Boolean).length;
  const strength = completedCount / 4;

  const rows = [
    { key: 'OBJETIVO',    value: sel.objetivo?.label,    icon: '◎', color: 'text-cyan-400' },
    { key: 'ÁREA',        value: sel.area?.label,        icon: '◉', color: 'text-indigo-400' },
    { key: 'PROFUNDIDAD', value: sel.profundidad?.label, icon: '◈', color: 'text-purple-400' },
    { key: 'MODELO',      value: sel.modelo?.label,      icon: '◆', color: 'text-cyan-400' },
  ];

  return (
    <div className="h-full flex flex-col bg-[#04060c] border-l border-white/[0.05] overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] mono font-bold text-cyan-400 uppercase tracking-widest">
            Prompt DNA
          </span>
        </div>
        <div className="text-[10px] text-zinc-600">Actualización en tiempo real</div>
      </div>

      {/* DNA rows */}
      <div className="p-4 space-y-2 border-b border-white/[0.05]">
        {rows.map((row, i) => (
          <div key={row.key} className="flex items-center gap-2">
            <span className={`${row.color} text-[10px] shrink-0 mono w-3`}>{row.value ? row.icon : '○'}</span>
            <span className="text-[9px] mono text-zinc-600 uppercase tracking-wider w-20 shrink-0">{row.key}</span>
            <AnimatePresence mode="wait">
              {row.value ? (
                <motion.span
                  key={row.value}
                  initial={{ opacity: 0, x: 4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -4 }}
                  className="text-[10px] text-zinc-300 font-medium truncate"
                >
                  {row.value}
                </motion.span>
              ) : (
                <span className="text-[10px] text-zinc-700">···</span>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Security layers */}
      <div className="p-4 border-b border-white/[0.05]">
        <div className="text-[9px] mono text-zinc-600 uppercase tracking-wider mb-2">Capas activas</div>
        <div className="space-y-1.5">
          {[
            { icon: <Brain className="w-2.5 h-2.5" />, label: 'Anti-alucinaciones', on: true },
            { icon: <BookOpen className="w-2.5 h-2.5" />, label: 'Fuentes chilenas', on: true },
            { icon: <Shield className="w-2.5 h-2.5" />, label: 'Seguridad jurídica', on: !!sel.objetivo },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className={l.on ? 'text-emerald-400' : 'text-zinc-700'}>{l.icon}</span>
              <span className={`text-[9px] ${l.on ? 'text-zinc-400' : 'text-zinc-700'}`}>{l.label}</span>
              {l.on && <span className="text-[8px] text-emerald-500 ml-auto">ON</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Strength meter */}
      <div className="p-4 border-b border-white/[0.05]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[9px] mono text-zinc-600 uppercase tracking-wider">Potencia</span>
          <span className="text-[9px] mono text-cyan-500">{Math.round(strength * 100)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500"
            animate={{ width: `${strength * 100}%` }}
            transition={{ type: 'spring', damping: 20, stiffness: 150 }}
          />
        </div>
        <div className="text-[9px] text-zinc-600 mt-1.5">{completedCount}/4 capas</div>
      </div>

      {/* Preview */}
      <div className="p-4 flex-1">
        <div className="text-[9px] mono text-zinc-600 uppercase tracking-wider mb-2">Preview</div>
        <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-3 min-h-[80px]">
          <AnimatePresence mode="wait">
            {promptPreview ? (
              <motion.p
                key={promptPreview.slice(0, 40)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[9px] mono text-zinc-500 leading-relaxed whitespace-pre-wrap break-words"
              >
                {promptPreview.slice(0, 240)}{promptPreview.length > 240 ? '…' : ''}
              </motion.p>
            ) : (
              <p className="text-[9px] text-zinc-700">El prompt se construirá aquí...</p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function PromptLabPage() {
  const [step, setStep] = useState<FlowStep>('objetivo');
  const [sel, setSel] = useState<FlowSel>({ objetivo: null, area: null, profundidad: null, modelo: null });
  const [genPhase, setGenPhase] = useState(-1);
  const [promptResult, setPromptResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // ── Step navigation ──────────────────────────────────────────────────────────
  const goTo = useCallback((next: FlowStep) => {
    setTimeout(() => setStep(next), 260);
  }, []);

  const select = useCallback(<K extends keyof FlowSel>(key: K, value: FlowSel[K]) => {
    setSel(prev => ({ ...prev, [key]: value }));
    const nextMap: Record<string, FlowStep> = {
      objetivo: 'area', area: 'profundidad', profundidad: 'modelo', modelo: 'generating',
    };
    if (nextMap[key]) goTo(nextMap[key] as FlowStep);
  }, [goTo]);

  const goBack = () => {
    const prev: Partial<Record<FlowStep, FlowStep>> = {
      area: 'objetivo', profundidad: 'area', modelo: 'profundidad',
    };
    if (prev[step]) setStep(prev[step]!);
  };

  const reset = () => {
    setSel({ objetivo: null, area: null, profundidad: null, modelo: null });
    setGenPhase(-1);
    setPromptResult('');
    setStep('objetivo');
  };

  // ── Generating animation ─────────────────────────────────────────────────────
  useEffect(() => {
    if (step !== 'generating') return;
    setGenPhase(0);
    let phase = 0;
    const id = setInterval(() => {
      phase++;
      setGenPhase(phase);
      if (phase >= GEN_PHASES.length - 1) {
        clearInterval(id);
        // Build prompt
        const profile = autoProfile(sel.objetivo!);
        const format  = autoFormat(sel.objetivo!, sel.profundidad!);
        const result  = generatePrompt(
          profile, sel.objetivo!, sel.area!, sel.profundidad!, sel.modelo!,
          format, ['antihallu', 'sources'], '',
        );
        setPromptResult(result);
        setTimeout(() => setStep('resultado'), 500);
      }
    }, 400);
    return () => clearInterval(id);
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Live preview ─────────────────────────────────────────────────────────────
  const buildPreview = () => {
    if (!sel.objetivo) return '';
    const parts: string[] = [];
    parts.push(`ROL DETECTADO: ${sel.objetivo.label}`);
    if (sel.area)       parts.push(`ÁREA: ${sel.area.label}`);
    if (sel.profundidad)parts.push(`NIVEL: ${sel.profundidad.label} — ${sel.profundidad.description}`);
    if (sel.modelo)     parts.push(`IA: ${sel.modelo.label}`);
    parts.push('');
    parts.push('Actúa como asistente jurídico experto...');
    if (sel.area) parts.push(`Especializado en ${sel.area.label}...`);
    if (sel.profundidad) parts.push(`Profundidad: ${sel.profundidad.description}...`);
    return parts.join('\n');
  };

  // ── Copy ─────────────────────────────────────────────────────────────────────
  const copyPrompt = async () => {
    await navigator.clipboard.writeText(promptResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // ── Download PDF ─────────────────────────────────────────────────────────────
  const downloadPDF = async () => {
    if (!sel.objetivo || !sel.area || !sel.profundidad || !sel.modelo) return;
    setDownloading(true);
    await generatePromptPDF({
      objetivo: sel.objetivo.label,
      area: sel.area.label,
      profundidad: `${sel.profundidad.label} — ${sel.profundidad.description}`,
      modelo: sel.modelo.label,
      promptText: promptResult,
      modelTip: sel.modelo.optimizationTip,
    });
    setTimeout(() => setDownloading(false), 1200);
  };

  // ── Download TXT ─────────────────────────────────────────────────────────────
  const downloadTxt = () => {
    const blob = new Blob([promptResult], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'prompt-juridico-diat.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  // ── Breadcrumb index ─────────────────────────────────────────────────────────
  const stepIdx = STEP_ORDER.indexOf(step);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)] bg-[#04060c]">

      {/* ── Progress breadcrumb ─────────────────────────────────────────────── */}
      <div className="shrink-0 border-b border-white/[0.05] bg-[#04060c]/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 lg:px-6 h-11">
          {/* Back button */}
          <div className="w-24">
            {['area', 'profundidad', 'modelo'].includes(step) && (
              <button
                onClick={goBack}
                className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Volver
              </button>
            )}
          </div>

          {/* Steps */}
          <div className="flex items-center gap-1">
            {BREADCRUMB.map((bc, bi) => {
              const done = stepIdx > bi;
              const active = stepIdx === bi;
              return (
                <div key={bc.key} className="flex items-center gap-1">
                  <div className={`
                    flex items-center gap-1 px-2 py-0.5 rounded-md transition-all duration-300
                    ${active  ? 'bg-cyan-500/15 text-cyan-400' : ''}
                    ${done    ? 'text-zinc-500' : ''}
                    ${!active && !done ? 'text-zinc-700' : ''}
                  `}>
                    {done && <Check className="w-2.5 h-2.5 text-emerald-500" />}
                    <span className="text-[9px] mono font-bold tracking-widest">{bc.label}</span>
                  </div>
                  {bi < BREADCRUMB.length - 1 && (
                    <div className={`w-3 h-px ${done ? 'bg-emerald-500/40' : 'bg-white/[0.05]'}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Reset */}
          <div className="w-24 flex justify-end">
            {step === 'resultado' && (
              <button
                onClick={reset}
                className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reiniciar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: question + cards */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* ── STEP: OBJETIVO ─────────────────────────────────────────────── */}
            {step === 'objetivo' && (
              <motion.div
                key="objetivo"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
                className="p-6 lg:p-10 max-w-3xl"
              >
                <div className="mb-2">
                  <span className="text-[9px] mono font-bold text-cyan-400/60 uppercase tracking-widest">
                    Paso 1 de 4
                  </span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
                  ¿Qué necesitas hacer?
                </h1>
                <p className="text-zinc-500 text-sm mb-8">Selecciona el objetivo de tu prompt jurídico</p>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {purposes.map((p, i) => (
                    <FlowCard
                      key={p.id}
                      emoji={p.emoji}
                      label={p.label}
                      selected={sel.objetivo?.id === p.id}
                      onClick={() => select('objetivo', p)}
                      accent="cyan"
                      delay={i * 0.04}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── STEP: ÁREA ─────────────────────────────────────────────────── */}
            {step === 'area' && (
              <motion.div
                key="area"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
                className="p-6 lg:p-10 max-w-3xl"
              >
                <div className="mb-2">
                  <span className="text-[9px] mono font-bold text-indigo-400/60 uppercase tracking-widest">
                    Paso 2 de 4
                  </span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
                  ¿En qué área jurídica?
                </h1>
                <p className="text-zinc-500 text-sm mb-8">
                  Objetivo:{' '}
                  <span className="text-indigo-400 font-medium">{sel.objetivo?.emoji} {sel.objetivo?.label}</span>
                </p>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {areas.map((a, i) => (
                    <FlowCard
                      key={a.id}
                      emoji={a.emoji}
                      label={a.label}
                      selected={sel.area?.id === a.id}
                      onClick={() => select('area', a)}
                      accent="indigo"
                      delay={i * 0.04}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── STEP: PROFUNDIDAD ──────────────────────────────────────────── */}
            {step === 'profundidad' && (
              <motion.div
                key="profundidad"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
                className="p-6 lg:p-10 max-w-3xl"
              >
                <div className="mb-2">
                  <span className="text-[9px] mono font-bold text-purple-400/60 uppercase tracking-widest">
                    Paso 3 de 4
                  </span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
                  ¿Qué nivel necesitas?
                </h1>
                <p className="text-zinc-500 text-sm mb-8">
                  {sel.objetivo?.emoji} {sel.objetivo?.label} · {sel.area?.emoji} {sel.area?.label}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {depthLevels.map((d, i) => (
                    <FlowCard
                      key={d.id}
                      label={d.label}
                      description={d.description}
                      selected={sel.profundidad?.id === d.id}
                      onClick={() => select('profundidad', d)}
                      accent="purple"
                      delay={i * 0.06}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── STEP: MODELO ───────────────────────────────────────────────── */}
            {step === 'modelo' && (
              <motion.div
                key="modelo"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
                className="p-6 lg:p-10 max-w-3xl"
              >
                <div className="mb-2">
                  <span className="text-[9px] mono font-bold text-cyan-400/60 uppercase tracking-widest">
                    Paso 4 de 4
                  </span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
                  ¿Qué IA usarás?
                </h1>
                <p className="text-zinc-500 text-sm mb-8">
                  Nivel: <span className="text-cyan-400 font-medium">{sel.profundidad?.label}</span>
                  {' · '}{sel.profundidad?.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {targetAIs.map((ai, i) => (
                    <FlowCard
                      key={ai.id}
                      label={ai.label}
                      description={ai.description}
                      selected={sel.modelo?.id === ai.id}
                      onClick={() => select('modelo', ai)}
                      accent="cyan"
                      delay={i * 0.06}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── STEP: GENERATING ───────────────────────────────────────────── */}
            {step === 'generating' && (
              <motion.div
                key="generating"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-6"
              >
                <div className="max-w-lg w-full">
                  {/* Animated header */}
                  <motion.div
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-center mb-10"
                  >
                    <div className="inline-flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="text-[10px] mono font-bold text-cyan-400 uppercase tracking-widest">
                        LexPrompt Architect v2.0
                      </span>
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Building your prompt...</h2>
                  </motion.div>

                  {/* Terminal phases */}
                  <div className="bg-[#070b12] rounded-2xl border border-white/[0.07] p-6 font-mono space-y-3">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.05]">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                      <span className="text-[9px] text-zinc-600 ml-2">lexiprompt — build</span>
                    </div>

                    {GEN_PHASES.map((phase, i) => (
                      <AnimatePresence key={phase}>
                        {genPhase >= i && (
                          <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-3"
                          >
                            {genPhase > i ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                className="w-3.5 h-3.5 border border-cyan-400 border-t-transparent rounded-full shrink-0"
                              />
                            )}
                            <span className={`text-xs ${
                              i === GEN_PHASES.length - 1
                                ? 'text-emerald-400 font-bold'
                                : genPhase > i
                                  ? 'text-zinc-500'
                                  : 'text-cyan-300'
                            }`}>
                              {phase}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    ))}
                  </div>

                  {/* Config summary */}
                  <div className="mt-6 grid grid-cols-2 gap-2">
                    {[
                      { k: 'OBJETIVO', v: sel.objetivo?.label },
                      { k: 'ÁREA',     v: sel.area?.label },
                      { k: 'NIVEL',    v: sel.profundidad?.label },
                      { k: 'MODELO',   v: sel.modelo?.label },
                    ].map(r => (
                      <div key={r.k} className="bg-white/[0.02] rounded-lg p-2.5 border border-white/[0.04]">
                        <div className="text-[8px] mono text-zinc-600 uppercase tracking-wider">{r.k}</div>
                        <div className="text-[10px] text-zinc-300 font-medium mt-0.5 truncate">{r.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP: RESULTADO ────────────────────────────────────────────── */}
            {step === 'resultado' && (
              <motion.div
                key="resultado"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 lg:p-6 grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6 min-h-full"
              >
                {/* Left: Prompt */}
                <div className="flex flex-col gap-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[9px] mono font-bold text-emerald-400 uppercase tracking-widest">
                          Prompt generado
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-white">Tu Prompt Jurídico</h2>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                      <button
                        onClick={copyPrompt}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] text-xs text-zinc-400 hover:text-zinc-200 transition-all"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copiado' : 'Copiar'}
                      </button>
                      <button
                        onClick={downloadTxt}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] text-xs text-zinc-400 hover:text-zinc-200 transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        TXT
                      </button>
                      <button
                        onClick={downloadPDF}
                        disabled={downloading}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/40 hover:bg-cyan-500/25 text-cyan-300 text-xs font-bold transition-all disabled:opacity-60"
                      >
                        {downloading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                            className="w-3.5 h-3.5 border border-cyan-400 border-t-transparent rounded-full"
                          />
                        ) : (
                          <Download className="w-3.5 h-3.5" />
                        )}
                        {downloading ? 'Generando PDF...' : 'Descargar PDF'}
                      </button>
                    </div>
                  </div>

                  {/* Prompt text */}
                  <div className="flex-1 rounded-xl border border-white/[0.06] bg-[#070b12] overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.05] bg-white/[0.02]">
                      <div className="w-2 h-2 rounded-full bg-red-500/50" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                      <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                      <span className="text-[9px] mono text-zinc-600 ml-2">prompt-juridico.txt</span>
                    </div>
                    <div className="p-4 overflow-x-auto">
                      <pre className="text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap font-mono">
                        {promptResult}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Right: Actions + DNA summary */}
                <div className="flex flex-col gap-4">
                  {/* Config summary */}
                  <div className="rounded-xl border border-white/[0.06] bg-[#070b12] p-4">
                    <div className="text-[9px] mono font-bold text-cyan-400 uppercase tracking-widest mb-3">
                      Prompt DNA
                    </div>
                    <div className="space-y-2.5">
                      {[
                        { k: 'OBJETIVO',     v: sel.objetivo?.label,    icon: sel.objetivo?.emoji },
                        { k: 'ÁREA',         v: sel.area?.label,        icon: sel.area?.emoji },
                        { k: 'PROFUNDIDAD',  v: sel.profundidad?.label },
                        { k: 'MODELO',       v: sel.modelo?.label },
                      ].map(r => (
                        <div key={r.k}>
                          <div className="text-[8px] mono text-zinc-600 uppercase tracking-wider">{r.k}</div>
                          <div className="text-[11px] text-zinc-300 font-medium mt-0.5">
                            {r.icon && <span className="mr-1">{r.icon}</span>}{r.v}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security layers */}
                  <div className="rounded-xl border border-white/[0.06] bg-[#070b12] p-4">
                    <div className="text-[9px] mono font-bold text-emerald-400 uppercase tracking-widest mb-3">
                      Capas activas
                    </div>
                    {['Anti-alucinaciones', 'Fuentes jurídicas chilenas'].map(l => (
                      <div key={l} className="flex items-center gap-2 py-1.5 border-b border-white/[0.04] last:border-0">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="text-[10px] text-zinc-400">{l}</span>
                      </div>
                    ))}
                  </div>

                  {/* Optimization tip */}
                  {sel.modelo?.optimizationTip && (
                    <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[0.04] p-4">
                      <div className="text-[9px] mono font-bold text-indigo-400 uppercase tracking-widest mb-2">
                        Tip para {sel.modelo.label}
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-relaxed">
                        {sel.modelo.optimizationTip.slice(0, 220)}...
                      </p>
                    </div>
                  )}

                  {/* New prompt */}
                  <button
                    onClick={reset}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] text-zinc-500 hover:text-zinc-300 text-xs font-medium transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Construir nuevo prompt
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Right: DNA panel (hidden on mobile, hidden in generating/resultado) */}
        {!['generating', 'resultado'].includes(step) && (
          <div className="hidden lg:flex lg:w-72 xl:w-80 shrink-0 flex-col overflow-hidden">
            <DNAPanel sel={sel} promptPreview={buildPreview()} />
          </div>
        )}

      </div>

      {/* ── Bottom glow ─────────────────────────────────────────────────────── */}
      {step !== 'generating' && step !== 'resultado' && (
        <div
          className="pointer-events-none fixed bottom-0 left-0 right-0 h-32 z-10"
          style={{
            background: 'linear-gradient(to top, rgba(4,6,12,0.9), transparent)',
          }}
        />
      )}
    </div>
  );
}
