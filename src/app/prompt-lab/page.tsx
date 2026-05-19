'use client';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Copy, Check, RotateCcw, Download,
  Zap, Shield, Brain, BookOpen, FileText, Code2, GitBranch,
} from 'lucide-react';
import {
  purposes, areas, depthLevels, targetAIs, outputFormats, enhancements,
  generatePrompt, generateCompact, generateSystemPrompt,
  generateGPTInstructions, generateClaudeProject, generatePromptPlusPlus,
  autoSelectProfile, autoSelectFormat, recommendAIModel,
  type PromptPurpose, type PromptArea, type DepthLevel,
  type TargetAI, type OutputFormat,
} from '@/data/promptBuilder';
import { generatePromptPDF } from '@/lib/pdfGenerators';
import { downloadBlob } from '@/lib/utils';

// ── Types ──────────────────────────────────────────────────────────────────────
type FlowStep =
  | 'finalidad' | 'area' | 'profundidad' | 'formato'
  | 'capas' | 'contexto' | 'recomendacion'
  | 'generating' | 'resultado';

interface FlowSel {
  finalidad:   PromptPurpose | null;
  area:        PromptArea    | null;
  profundidad: DepthLevel    | null;
  formato:     OutputFormat  | null;
  capas:       string[];
  contexto:    string;
  modelo:      TargetAI      | null;
}

type ResultTab = 'standard' | 'plus' | 'workflow';

// ── Step config ────────────────────────────────────────────────────────────────
const BREADCRUMB = [
  { key: 'finalidad',    label: 'FINALIDAD',    step: 1 },
  { key: 'area',         label: 'ÁREA',         step: 2 },
  { key: 'profundidad',  label: 'PROFUNDIDAD',  step: 3 },
  { key: 'formato',      label: 'FORMATO',      step: 4 },
  { key: 'capas',        label: 'CAPAS',        step: 5 },
  { key: 'contexto',     label: 'CONTEXTO',     step: 6 },
  { key: 'recomendacion',label: 'IA',           step: 7 },
  { key: 'generating',   label: 'GENERAR',      step: 8 },
];
const STEP_ORDER: FlowStep[] = [...BREADCRUMB.map(b => b.key as FlowStep), 'resultado'];

const GEN_PHASES = [
  'ANALYZING LEGAL CONTEXT...',
  'CALIBRATING ROL ENGINE...',
  'ACTIVATING HALLUCINATION GUARD...',
  'BUILDING PROMPT STRUCTURE...',
  'APPLYING SECURITY LAYERS...',
  'GENERATING OUTPUT FORMAT...',
  'EXPORT READY ✓',
];

// ── Accent color maps ──────────────────────────────────────────────────────────
const ACCENT_BY_STEP: Record<FlowStep, string> = {
  finalidad:    'cyan',
  area:         'indigo',
  profundidad:  'purple',
  formato:      'cyan',
  capas:        'indigo',
  contexto:     'purple',
  recomendacion:'cyan',
  generating:   'cyan',
  resultado:    'cyan',
};

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
const bgMap: Record<string, string> = {
  cyan: 'bg-cyan-500', indigo: 'bg-indigo-500', purple: 'bg-purple-500',
};
const ringMap: Record<string, string> = {
  cyan: 'text-cyan-400/60', indigo: 'text-indigo-400/60', purple: 'text-purple-400/60',
};

// ── FlowCard component ─────────────────────────────────────────────────────────
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
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.22 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.975 }}
      onClick={onClick}
      className={`
        relative w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer
        ${selected ? accentMap[accent] : `border-white/[0.07] bg-white/[0.02] ${hoverMap[accent]}`}
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
        {emoji && <span className="text-xl shrink-0 mt-0.5">{emoji}</span>}
        <div className="min-w-0 flex-1">
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
            className={`shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center ${bgMap[accent]}`}
          >
            <Check className="w-2.5 h-2.5 text-black" />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}

// ── Step wrapper with standard header ─────────────────────────────────────────
interface StepWrapperProps {
  stepNum: number;
  accent: string;
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}
function StepWrapper({ stepNum, accent, title, subtitle, children }: StepWrapperProps) {
  return (
    <motion.div
      key={title}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.22 }}
      className="p-6 lg:p-10 max-w-3xl"
    >
      <div className="mb-2">
        <span className={`text-[9px] mono font-bold ${ringMap[accent]} uppercase tracking-widest`}>
          Paso {stepNum} de 7
        </span>
      </div>
      <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">{title}</h1>
      {subtitle && <p className="text-zinc-500 text-sm mb-8">{subtitle}</p>}
      {children}
    </motion.div>
  );
}

// ── DNA Panel ──────────────────────────────────────────────────────────────────
function DNAPanel({ sel, promptPreview }: { sel: FlowSel; promptPreview: string }) {
  const filled = [sel.finalidad, sel.area, sel.profundidad, sel.formato, sel.modelo].filter(Boolean).length
    + (sel.capas.length > 0 ? 1 : 0);
  const strength = filled / 6;

  const rows = [
    { key: 'FINALIDAD',   value: sel.finalidad?.label,   icon: '◎', color: 'text-cyan-400' },
    { key: 'ÁREA',        value: sel.area?.label,        icon: '◉', color: 'text-indigo-400' },
    { key: 'PROFUNDIDAD', value: sel.profundidad?.label, icon: '◈', color: 'text-purple-400' },
    { key: 'FORMATO',     value: sel.formato?.label,     icon: '◆', color: 'text-cyan-400' },
    { key: 'CAPAS',       value: sel.capas.length > 0 ? `${sel.capas.length} activas` : null, icon: '◇', color: 'text-indigo-400' },
    { key: 'MODELO',      value: sel.modelo?.label,      icon: '◉', color: 'text-purple-400' },
  ];

  return (
    <div className="h-full flex flex-col bg-[#04060c] border-l border-white/[0.05] overflow-y-auto">
      <div className="p-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] mono font-bold text-cyan-400 uppercase tracking-widest">Prompt DNA</span>
        </div>
        <div className="text-[10px] text-zinc-600">Actualización en tiempo real</div>
      </div>

      {/* DNA rows */}
      <div className="p-4 space-y-2 border-b border-white/[0.05]">
        {rows.map(row => (
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
            { icon: <Brain className="w-2.5 h-2.5" />, label: 'Anti-alucinaciones', on: sel.capas.includes('antihallu') || sel.capas.length === 0 },
            { icon: <BookOpen className="w-2.5 h-2.5" />, label: 'Fuentes chilenas', on: sel.capas.includes('sources') || sel.capas.length === 0 },
            { icon: <Shield className="w-2.5 h-2.5" />, label: 'Seguridad jurídica', on: sel.capas.length > 0 },
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
        <div className="text-[9px] text-zinc-600 mt-1.5">{filled}/6 capas configuradas</div>
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

// ── Workflow visualization ─────────────────────────────────────────────────────
function WorkflowPipeline({ sel }: { sel: FlowSel }) {
  const nodes = [
    { label: 'PERFIL',      value: sel.finalidad ? autoSelectProfile(sel.finalidad).label : '—', color: 'cyan' },
    { label: 'FINALIDAD',   value: sel.finalidad?.label ?? '—',   color: 'cyan' },
    { label: 'ÁREA',        value: sel.area?.label ?? '—',         color: 'indigo' },
    { label: 'PROFUNDIDAD', value: sel.profundidad?.label ?? '—',  color: 'purple' },
    { label: 'FORMATO',     value: sel.formato?.label ?? '—',      color: 'cyan' },
    { label: 'IA OBJETIVO', value: sel.modelo?.label ?? '—',       color: 'indigo' },
    { label: 'OUTPUT',      value: sel.formato?.emoji ?? '📄',     color: 'purple' },
  ];

  const nodeColor: Record<string, string> = {
    cyan:   'border-cyan-500/40 bg-cyan-500/[0.06] text-cyan-400',
    indigo: 'border-indigo-500/40 bg-indigo-500/[0.06] text-indigo-400',
    purple: 'border-purple-500/40 bg-purple-500/[0.06] text-purple-400',
  };

  return (
    <div className="p-4">
      <div className="text-[9px] mono font-bold text-zinc-500 uppercase tracking-widest mb-4">
        Pipeline de construcción del prompt
      </div>
      {/* Desktop: horizontal */}
      <div className="hidden md:flex items-center gap-1 overflow-x-auto pb-2">
        {nodes.map((node, i) => (
          <div key={node.label} className="flex items-center gap-1 shrink-0">
            <div className={`rounded-lg border px-3 py-2 text-center min-w-[80px] ${nodeColor[node.color]}`}>
              <div className="text-[8px] mono uppercase tracking-wider opacity-60 mb-0.5">{node.label}</div>
              <div className="text-[10px] font-bold truncate max-w-[90px]">{node.value}</div>
            </div>
            {i < nodes.length - 1 && (
              <div className="text-zinc-700 text-xs">→</div>
            )}
          </div>
        ))}
      </div>
      {/* Mobile: vertical */}
      <div className="flex md:hidden flex-col gap-2">
        {nodes.map((node, i) => (
          <div key={node.label} className="flex items-center gap-3">
            <div className={`rounded-lg border px-3 py-2 flex-1 flex justify-between items-center ${nodeColor[node.color]}`}>
              <span className="text-[9px] mono uppercase tracking-wider opacity-60">{node.label}</span>
              <span className="text-[10px] font-bold">{node.value}</span>
            </div>
            {i < nodes.length - 1 && (
              <div className="text-zinc-700 text-xs ml-1">↓</div>
            )}
          </div>
        ))}
      </div>

      {/* Security layers in pipeline */}
      {sel.capas.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/[0.05]">
          <div className="text-[9px] mono text-zinc-600 uppercase tracking-wider mb-2">Capas de seguridad aplicadas</div>
          <div className="flex flex-wrap gap-2">
            {sel.capas.map(id => {
              const enh = enhancements.find(e => e.id === id);
              if (!enh) return null;
              return (
                <span key={id} className="text-[9px] mono px-2 py-1 rounded-md bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400">
                  {enh.emoji} {enh.label}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── AI Recommendation Step ────────────────────────────────────────────────────
function AIRecommendStep({
  aiRecs,
  onSelect,
}: {
  aiRecs: import('@/data/promptBuilder').AIRecommendation[];
  onSelect: (ai: TargetAI) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const top = aiRecs[0];
  const rest = aiRecs.slice(1);

  return (
    <motion.div
      key="recomendacion"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.22 }}
      className="p-6 lg:p-10 max-w-2xl"
    >
      <div className="mb-2">
        <span className="text-[9px] mono font-bold text-cyan-400/60 uppercase tracking-widest">
          Paso 7 de 7
        </span>
      </div>
      <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
        IA recomendada
      </h1>
      <p className="text-zinc-500 text-sm mb-8">
        Basado en tu objetivo, área y nivel de profundidad
      </p>

      {/* Top recommendation — prominent */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl border border-cyan-500/30 bg-cyan-500/[0.05] p-6 mb-4"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl font-bold text-white">{top.ai.label}</span>
              <span className="text-[8px] mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold">
                MEJOR OPCIÓN
              </span>
            </div>
            <p className="text-sm text-zinc-400">{top.ai.description}</p>
          </div>
          {/* Score ring */}
          <div className="shrink-0 text-center">
            <div className="text-3xl font-bold mono text-cyan-400">{top.score}%</div>
            <div className="text-[9px] text-zinc-600 uppercase tracking-wider">match</div>
          </div>
        </div>

        {/* Score bar */}
        <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden mb-4">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-400"
            initial={{ width: 0 }}
            animate={{ width: `${top.score}%` }}
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          />
        </div>

        {/* Reasons */}
        {top.reasons.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {top.reasons.map(r => (
              <span key={r} className="text-[10px] px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.07] text-zinc-400">
                ✓ {r}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={() => onSelect(top.ai)}
          className="w-full py-3 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-sm hover:bg-cyan-500/30 transition-all"
        >
          Usar {top.ai.label} — Generar prompt →
        </button>
      </motion.div>

      {/* Toggle to see all options */}
      {!showAll ? (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-zinc-600 hover:text-zinc-400 text-xs hover:bg-white/[0.04] transition-all"
        >
          Ver otras opciones ({rest.length} IAs con su % de compatibilidad)
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-2"
        >
          <div className="text-[9px] mono text-zinc-600 uppercase tracking-widest mb-3">
            Otras opciones
          </div>
          {rest.map((rec, i) => (
            <motion.button
              key={rec.ai.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => onSelect(rec.ai)}
              className="w-full text-left p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="shrink-0 w-6 h-6 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[10px] mono text-zinc-600 font-bold">
                  {i + 2}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">
                    {rec.ai.label}
                  </div>
                  <div className="text-[11px] text-zinc-600 mt-0.5">{rec.ai.description}</div>
                  {rec.reasons.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {rec.reasons.map(r => (
                        <span key={r} className="text-[9px] text-zinc-700 px-1.5 py-0.5 rounded bg-white/[0.02] border border-white/[0.04]">
                          {r}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-sm font-bold mono text-zinc-500">{rec.score}%</div>
                  <div className="w-16 h-1 rounded-full bg-white/[0.04] overflow-hidden mt-1">
                    <motion.div
                      className="h-full rounded-full bg-zinc-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${rec.score}%` }}
                      transition={{ delay: i * 0.06 + 0.1, duration: 0.4 }}
                    />
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function PromptLabPage() {
  const [step, setStep] = useState<FlowStep>('finalidad');
  const [sel, setSel] = useState<FlowSel>({
    finalidad: null, area: null, profundidad: null, formato: null,
    capas: [], contexto: '', modelo: null,
  });
  const [genPhase, setGenPhase] = useState(-1);
  const [promptResult, setPromptResult] = useState('');
  const [promptPlus, setPromptPlus] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [resultTab, setResultTab] = useState<ResultTab>('standard');

  // Ref so the generating interval can read the latest sel without stale closure
  const selRef = useRef(sel);
  useEffect(() => { selRef.current = sel; });

  // ── Navigation ───────────────────────────────────────────────────────────────
  const goTo = useCallback((next: FlowStep) => {
    setTimeout(() => setStep(next), 260);
  }, []);

  const nextMap: Record<string, FlowStep> = {
    finalidad: 'area', area: 'profundidad', profundidad: 'formato',
    formato: 'capas', capas: 'contexto', contexto: 'recomendacion',
    recomendacion: 'generating', modelo: 'generating',
  };

  const selectStep = useCallback(<K extends keyof FlowSel>(key: K, value: FlowSel[K]) => {
    setSel(prev => ({ ...prev, [key]: value }));
    const next = nextMap[key];
    if (next) goTo(next);
  }, [goTo]); // eslint-disable-line react-hooks/exhaustive-deps

  const goBack = () => {
    const prevMap: Partial<Record<FlowStep, FlowStep>> = {
      area: 'finalidad', profundidad: 'area', formato: 'profundidad',
      capas: 'formato', contexto: 'capas', recomendacion: 'contexto',
    };
    if (prevMap[step]) setStep(prevMap[step]!);
  };

  const reset = () => {
    setSel({ finalidad: null, area: null, profundidad: null, formato: null, capas: [], contexto: '', modelo: null });
    setGenPhase(-1);
    setPromptResult('');
    setPromptPlus('');
    setStep('finalidad');
    setResultTab('standard');
  };

  // ── Toggle enhancement cap ────────────────────────────────────────────────────
  const toggleCapa = (id: string) => {
    setSel(prev => ({
      ...prev,
      capas: prev.capas.includes(id)
        ? prev.capas.filter(c => c !== id)
        : [...prev.capas, id],
    }));
  };

  // ── AI recommendations (memoized) ────────────────────────────────────────────
  const aiRecs = useMemo(() => {
    if (!sel.finalidad || !sel.area || !sel.profundidad) return [];
    return recommendAIModel(sel.finalidad, sel.area, sel.profundidad);
  }, [sel.finalidad, sel.area, sel.profundidad]);

  // ── Generating animation ─────────────────────────────────────────────────────
  useEffect(() => {
    if (step !== 'generating') return;
    setGenPhase(0);
    let phase = 0;
    let doneTimer: ReturnType<typeof setTimeout>;
    const id = setInterval(() => {
      phase++;
      setGenPhase(phase);
      if (phase >= GEN_PHASES.length - 1) {
        clearInterval(id);
        const s = selRef.current;
        const profile   = autoSelectProfile(s.finalidad!);
        const format    = s.formato ?? autoSelectFormat(s.finalidad!, s.profundidad!);
        const activeCaps = s.capas.length > 0 ? s.capas : ['antihallu', 'sources'];
        const result    = generatePrompt(
          profile, s.finalidad!, s.area!, s.profundidad!, s.modelo!,
          format, activeCaps, s.contexto,
        );
        const plus = generatePromptPlusPlus(
          profile, s.finalidad!, s.area!, s.profundidad!, s.modelo!,
          format, activeCaps, s.contexto,
        );
        setPromptResult(result);
        setPromptPlus(plus);
        doneTimer = setTimeout(() => setStep('resultado'), 500);
      }
    }, 380);
    return () => { clearInterval(id); clearTimeout(doneTimer); };
  }, [step]);

  // ── Live preview ─────────────────────────────────────────────────────────────
  const promptPreview = useMemo(() => {
    if (!sel.finalidad) return '';
    const parts: string[] = [`ROL: ${sel.finalidad.label}`];
    if (sel.area)        parts.push(`ÁREA: ${sel.area.label}`);
    if (sel.profundidad) parts.push(`NIVEL: ${sel.profundidad.label}`);
    if (sel.formato)     parts.push(`FORMATO: ${sel.formato.label}`);
    if (sel.capas.length) parts.push(`CAPAS: ${sel.capas.length} activas`);
    if (sel.modelo)      parts.push(`IA: ${sel.modelo.label}`);
    parts.push('', 'Actúa como asistente jurídico experto...');
    if (sel.area) parts.push(`Especializado en ${sel.area.label}...`);
    return parts.join('\n');
  }, [sel]);

  // ── Copy ─────────────────────────────────────────────────────────────────────
  const copyPrompt = async () => {
    await navigator.clipboard.writeText(
      resultTab === 'plus' ? promptPlus : promptResult
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // ── Download PDF ─────────────────────────────────────────────────────────────
  const downloadPDF = async () => {
    if (!sel.finalidad || !sel.area || !sel.profundidad || !sel.modelo) return;
    setDownloading(true);
    try {
      await generatePromptPDF({
        objetivo:    sel.finalidad.label,
        area:        sel.area.label,
        profundidad: `${sel.profundidad.label} — ${sel.profundidad.description}`,
        modelo:      sel.modelo.label,
        promptText:  promptResult,
        modelTip:    sel.modelo.optimizationTip,
      });
    } finally {
      setDownloading(false);
    }
  };

  // ── Other exports ─────────────────────────────────────────────────────────────
  const downloadTxt   = () => downloadBlob(promptResult, 'prompt-juridico-diat.txt');
  const downloadMd    = () => downloadBlob(`# Prompt Jurídico DIAT\n\n\`\`\`\n${promptResult}\n\`\`\`\n`, 'prompt-juridico-diat.md', 'text/markdown;charset=utf-8');
  const downloadPlus  = () => downloadBlob(promptPlus, 'prompt-plus-diat.yaml', 'text/yaml;charset=utf-8');
  const downloadSys   = () => sel.modelo && downloadBlob(generateSystemPrompt(promptResult, sel.modelo), 'system-prompt-diat.txt');
  const downloadGPT   = () => downloadBlob(generateGPTInstructions(promptResult), 'gpt-instructions-diat.txt');
  const downloadClaude = () => downloadBlob(generateClaudeProject(promptResult), 'claude-project-diat.txt');

  // ── Breadcrumb index ─────────────────────────────────────────────────────────
  const stepIdx = STEP_ORDER.indexOf(step);
  const activeAccent = ACCENT_BY_STEP[step] ?? 'cyan';

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)] bg-[#04060c]">

      {/* ── Progress breadcrumb ──────────────────────────────────────────────── */}
      <div className="shrink-0 border-b border-white/[0.05] bg-[#04060c]/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 lg:px-6 h-11">
          {/* Back */}
          <div className="w-20">
            {['area','profundidad','formato','capas','contexto','recomendacion'].includes(step) && (
              <button
                onClick={goBack}
                className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Volver
              </button>
            )}
          </div>

          {/* Steps — hidden on very small screens */}
          <div className="hidden sm:flex items-center gap-0.5">
            {BREADCRUMB.map((bc, bi) => {
              const done   = stepIdx > bi;
              const active = stepIdx === bi;
              return (
                <div key={bc.key} className="flex items-center gap-0.5">
                  <div className={`
                    flex items-center gap-1 px-1.5 py-0.5 rounded-md transition-all duration-300
                    ${active ? 'bg-cyan-500/15 text-cyan-400' : ''}
                    ${done ? 'text-zinc-500' : ''}
                    ${!active && !done ? 'text-zinc-700' : ''}
                  `}>
                    {done && <Check className="w-2 h-2 text-emerald-500" />}
                    <span className="text-[8px] mono font-bold tracking-widest">{bc.label}</span>
                  </div>
                  {bi < BREADCRUMB.length - 1 && (
                    <div className={`w-2 h-px ${done ? 'bg-emerald-500/40' : 'bg-white/[0.05]'}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile: step indicator */}
          <div className="sm:hidden text-[10px] mono text-zinc-600">
            {stepIdx < 8 ? `${stepIdx + 1}/8` : '✓'}
          </div>

          {/* Reset */}
          <div className="w-20 flex justify-end">
            {step === 'resultado' && (
              <button
                onClick={reset}
                className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reiniciar</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile bottom progress bar */}
        <div className="sm:hidden h-0.5 bg-white/[0.04]">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500"
            animate={{ width: `${Math.min(100, (stepIdx / 8) * 100)}%` }}
            transition={{ type: 'spring', damping: 25 }}
          />
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: question + cards */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* ── STEP 1: FINALIDAD ──────────────────────────────────────────── */}
            {step === 'finalidad' && (
              <StepWrapper stepNum={1} accent="cyan" title="¿Qué necesitas hacer?"
                subtitle="Selecciona el objetivo de tu prompt jurídico"
              >
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {purposes.map((p, i) => (
                    <FlowCard key={p.id} emoji={p.emoji} label={p.label}
                      selected={sel.finalidad?.id === p.id}
                      onClick={() => selectStep('finalidad', p)}
                      accent="cyan" delay={i * 0.04}
                    />
                  ))}
                </div>
              </StepWrapper>
            )}

            {/* ── STEP 2: ÁREA ───────────────────────────────────────────────── */}
            {step === 'area' && (
              <StepWrapper stepNum={2} accent="indigo" title="¿En qué área jurídica?"
                subtitle={<>Objetivo: <span className="text-indigo-400 font-medium">{sel.finalidad?.emoji} {sel.finalidad?.label}</span></>}
              >
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {areas.map((a, i) => (
                    <FlowCard key={a.id} emoji={a.emoji} label={a.label}
                      selected={sel.area?.id === a.id}
                      onClick={() => selectStep('area', a)}
                      accent="indigo" delay={i * 0.04}
                    />
                  ))}
                </div>
              </StepWrapper>
            )}

            {/* ── STEP 3: PROFUNDIDAD ────────────────────────────────────────── */}
            {step === 'profundidad' && (
              <StepWrapper stepNum={3} accent="purple" title="¿Qué nivel necesitas?"
                subtitle={<>{sel.finalidad?.emoji} {sel.finalidad?.label} · {sel.area?.emoji} {sel.area?.label}</>}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {depthLevels.map((d, i) => (
                    <FlowCard key={d.id} label={d.label} description={d.description}
                      selected={sel.profundidad?.id === d.id}
                      onClick={() => selectStep('profundidad', d)}
                      accent="purple" delay={i * 0.06}
                    />
                  ))}
                </div>
              </StepWrapper>
            )}

            {/* ── STEP 4: FORMATO ────────────────────────────────────────────── */}
            {step === 'formato' && (
              <StepWrapper stepNum={4} accent="cyan" title="¿Qué formato de salida?"
                subtitle={<>Nivel: <span className="text-cyan-400 font-medium">{sel.profundidad?.label}</span> · {sel.profundidad?.description}</>}
              >
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {outputFormats.map((f, i) => (
                    <FlowCard key={f.id} emoji={f.emoji} label={f.label}
                      selected={sel.formato?.id === f.id}
                      onClick={() => selectStep('formato', f)}
                      accent="cyan" delay={i * 0.04}
                    />
                  ))}
                </div>
              </StepWrapper>
            )}

            {/* ── STEP 5: CAPAS DE SEGURIDAD ─────────────────────────────────── */}
            {step === 'capas' && (
              <motion.div
                key="capas"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
                className="p-6 lg:p-10 max-w-3xl"
              >
                <div className="mb-2">
                  <span className="text-[9px] mono font-bold text-indigo-400/60 uppercase tracking-widest">
                    Paso 5 de 7
                  </span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
                  Capas de seguridad
                </h1>
                <p className="text-zinc-500 text-sm mb-1">Selecciona las protecciones que necesitas</p>
                <p className="text-zinc-700 text-xs mb-8">
                  Anti-alucinaciones y Fuentes chilenas se recomiendan siempre · Puedes seleccionar varias
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {enhancements.map((e, i) => {
                    const on = sel.capas.includes(e.id);
                    return (
                      <motion.button
                        key={e.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => toggleCapa(e.id)}
                        className={`
                          relative w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer
                          ${on
                            ? 'border-emerald-500/50 bg-emerald-500/[0.07]'
                            : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12]'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg shrink-0">{e.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-bold ${on ? 'text-emerald-400' : 'text-zinc-300'}`}>
                              {e.label}
                            </div>
                            <div className="text-[11px] text-zinc-600 mt-0.5">{e.description}</div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                            on ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-700'
                          }`}>
                            {on && <Check className="w-2.5 h-2.5 text-black" />}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => goTo('contexto')}
                    className={`
                      px-6 py-2.5 rounded-xl text-sm font-bold transition-all
                      ${sel.capas.length > 0
                        ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30'
                        : 'bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:bg-white/[0.08]'
                      }
                    `}
                  >
                    {sel.capas.length > 0 ? `Continuar con ${sel.capas.length} capa${sel.capas.length > 1 ? 's' : ''}` : 'Continuar sin capas adicionales'}
                  </button>
                  <button
                    onClick={() => {
                      setSel(prev => ({ ...prev, capas: ['antihallu', 'sources'] }));
                      goTo('contexto');
                    }}
                    className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    Usar recomendadas
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 6: CONTEXTO ───────────────────────────────────────────── */}
            {step === 'contexto' && (
              <motion.div
                key="contexto"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
                className="p-6 lg:p-10 max-w-3xl"
              >
                <div className="mb-2">
                  <span className="text-[9px] mono font-bold text-purple-400/60 uppercase tracking-widest">
                    Paso 6 de 7
                  </span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
                  Contexto específico
                </h1>
                <p className="text-zinc-500 text-sm mb-1">Describe brevemente tu caso o consulta</p>
                <p className="text-zinc-700 text-xs mb-8">
                  Opcional — mejora la precisión del prompt · No incluyas RUTs, nombres ni datos sensibles
                </p>

                <textarea
                  value={sel.contexto}
                  onChange={e => setSel(prev => ({ ...prev, contexto: e.target.value }))}
                  placeholder="Ej: Necesito analizar un contrato de arriendo residencial con una cláusula de arriendo anticipado potencialmente abusiva..."
                  rows={6}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] text-zinc-300 placeholder-zinc-700 text-sm p-4 resize-none focus:outline-none focus:border-purple-500/40 transition-colors mono"
                />

                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => goTo('recomendacion')}
                    className="px-6 py-2.5 rounded-xl bg-purple-500/15 border border-purple-500/40 text-purple-300 text-sm font-bold hover:bg-purple-500/25 transition-all"
                  >
                    {sel.contexto.trim() ? 'Continuar con contexto' : 'Omitir este paso'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 7: AI RECOMMENDATION ──────────────────────────────────── */}
            {step === 'recomendacion' && aiRecs.length > 0 && (
              <AIRecommendStep
                aiRecs={aiRecs}
                onSelect={(ai) => selectStep('modelo', ai)}
              />
            )}

            {/* ── STEP 8: GENERATING ─────────────────────────────────────────── */}
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
                              i === GEN_PHASES.length - 1 ? 'text-emerald-400 font-bold'
                                : genPhase > i ? 'text-zinc-500'
                                : 'text-cyan-300'
                            }`}>{phase}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-2">
                    {[
                      { k: 'FINALIDAD', v: sel.finalidad?.label },
                      { k: 'ÁREA',      v: sel.area?.label },
                      { k: 'NIVEL',     v: sel.profundidad?.label },
                      { k: 'MODELO',    v: sel.modelo?.label },
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

            {/* ── STEP 9: RESULTADO ──────────────────────────────────────────── */}
            {step === 'resultado' && (
              <motion.div
                key="resultado"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 lg:p-6 grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6 min-h-full"
              >
                {/* Left: Prompt content */}
                <div className="flex flex-col gap-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[9px] mono font-bold text-emerald-400 uppercase tracking-widest">
                          Prompt generado
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-white">Tu Prompt Jurídico</h2>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 flex-wrap">
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
                        <Download className="w-3.5 h-3.5" />TXT
                      </button>
                      <button
                        onClick={downloadMd}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] text-xs text-zinc-400 hover:text-zinc-200 transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />MD
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
                        {downloading ? 'Generando...' : 'PDF'}
                      </button>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-1 border-b border-white/[0.05] pb-0">
                    {([
                      { id: 'standard', label: 'Estándar',    icon: <FileText className="w-3 h-3" /> },
                      { id: 'plus',     label: 'Prompt++',    icon: <Code2 className="w-3 h-3" /> },
                      { id: 'workflow', label: 'Workflow',    icon: <GitBranch className="w-3 h-3" /> },
                    ] as { id: ResultTab; label: string; icon: React.ReactNode }[]).map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setResultTab(tab.id)}
                        className={`
                          flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-all border-b-2 -mb-px
                          ${resultTab === tab.id
                            ? 'border-cyan-500 text-cyan-400'
                            : 'border-transparent text-zinc-600 hover:text-zinc-400'
                          }
                        `}
                      >
                        {tab.icon}{tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab content */}
                  <AnimatePresence mode="wait">
                    {resultTab === 'standard' && (
                      <motion.div
                        key="standard"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 rounded-xl border border-white/[0.06] bg-[#070b12] overflow-hidden"
                      >
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
                      </motion.div>
                    )}

                    {resultTab === 'plus' && (
                      <motion.div
                        key="plus"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 rounded-xl border border-indigo-500/20 bg-[#070b12] overflow-hidden"
                      >
                        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.05] bg-indigo-500/[0.04]">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500/70" />
                            <span className="text-[9px] mono text-indigo-400 ml-1">prompt-plus.yaml — structured machine-readable</span>
                          </div>
                          <button onClick={downloadPlus} className="text-[9px] mono text-indigo-500 hover:text-indigo-300 transition-colors">
                            ↓ YAML
                          </button>
                        </div>
                        <div className="p-4 overflow-x-auto">
                          <pre className="text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap font-mono">
                            {promptPlus}
                          </pre>
                        </div>
                      </motion.div>
                    )}

                    {resultTab === 'workflow' && (
                      <motion.div
                        key="workflow"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 rounded-xl border border-white/[0.06] bg-[#070b12] overflow-hidden"
                      >
                        <WorkflowPipeline sel={sel} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Right: DNA + exports */}
                <div className="flex flex-col gap-4">
                  {/* DNA summary */}
                  <div className="rounded-xl border border-white/[0.06] bg-[#070b12] p-4">
                    <div className="text-[9px] mono font-bold text-cyan-400 uppercase tracking-widest mb-3">
                      Prompt DNA
                    </div>
                    <div className="space-y-2.5">
                      {[
                        { k: 'FINALIDAD',    v: sel.finalidad?.label,    icon: sel.finalidad?.emoji },
                        { k: 'ÁREA',         v: sel.area?.label,         icon: sel.area?.emoji },
                        { k: 'PROFUNDIDAD',  v: sel.profundidad?.label },
                        { k: 'FORMATO',      v: sel.formato?.label,      icon: sel.formato?.emoji },
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
                    {(sel.capas.length > 0 ? sel.capas : ['antihallu', 'sources']).map(id => {
                      const e = enhancements.find(x => x.id === id);
                      if (!e) return null;
                      return (
                        <div key={id} className="flex items-center gap-2 py-1.5 border-b border-white/[0.04] last:border-0">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="text-[10px] text-zinc-400">{e.emoji} {e.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Platform exports */}
                  <div className="rounded-xl border border-white/[0.06] bg-[#070b12] p-4">
                    <div className="text-[9px] mono font-bold text-indigo-400 uppercase tracking-widest mb-3">
                      Exportar para plataforma
                    </div>
                    <div className="space-y-2">
                      {[
                        { label: 'System Prompt',     fn: downloadSys,    tip: 'Para cualquier IA' },
                        { label: 'GPT Instructions',  fn: downloadGPT,    tip: 'ChatGPT custom GPT' },
                        { label: 'Claude Project',    fn: downloadClaude, tip: 'Claude Projects' },
                      ].map(ex => (
                        <button
                          key={ex.label}
                          onClick={ex.fn}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] transition-all group"
                        >
                          <span className="text-[10px] text-zinc-400 group-hover:text-zinc-200 transition-colors font-medium">
                            {ex.label}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] text-zinc-700">{ex.tip}</span>
                            <Download className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                          </div>
                        </button>
                      ))}
                    </div>
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

        {/* Right: DNA panel — hidden on small screens and in generating/resultado */}
        {!['generating', 'resultado'].includes(step) && (
          <div className="hidden lg:flex lg:w-72 xl:w-80 shrink-0 flex-col overflow-hidden">
            <DNAPanel sel={sel} promptPreview={promptPreview} />
          </div>
        )}

      </div>

      {/* ── Bottom ambient glow ────────────────────────────────────────────────── */}
      {!['generating', 'resultado'].includes(step) && (
        <div
          className="pointer-events-none fixed bottom-0 left-0 right-0 h-32 z-10"
          style={{ background: 'linear-gradient(to top, rgba(4,6,12,0.9), transparent)' }}
        />
      )}
    </div>
  );
}
