'use client';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Copy, Check, RotateCcw, Download,
  Zap, Shield, Brain, BookOpen, FileText, Code2, GitBranch, Cpu,
} from 'lucide-react';
import {
  purposes, areas, depthLevels, targetAIs, outputFormats, enhancements,
  legalObjectives, audiences, cognitiveModes, riskTolerances, proceduralStages,
  jurisdictions, documentContextModes,
  generatePrompt, generateSystemPrompt, generateGPTInstructions, generateClaudeProject,
  buildIRYAML, compileForClaude, compileForGPT, compileForGemini,
  autoSelectProfile, autoSelectFormat, recommendAIModel,
  type PromptPurpose, type PromptArea, type DepthLevel,
  type TargetAI, type OutputFormat,
  type LegalObjective, type Audience, type CognitiveMode,
  type RiskTolerance, type ProceduralStage, type JurisdictionScope,
  type DocumentContextMode, type PrecisionConfig, type CompilerInput,
} from '@/data/promptBuilder';
import { generatePromptPDF } from '@/lib/pdfGenerators';
import { downloadBlob } from '@/lib/utils';

// ── Types ──────────────────────────────────────────────────────────────────────
type FlowStep =
  | 'finalidad' | 'objetivo' | 'area' | 'audiencia' | 'cognitivo' | 'procesal'
  | 'profundidad' | 'formato' | 'capas' | 'documentos' | 'contexto' | 'recomendacion'
  | 'generating' | 'resultado';

const DEFAULT_PRECISION: PrecisionConfig = {
  analytical_depth: 70,
  litigious_aggressiveness: 50,
  argumentative_creativity: 60,
  technical_density: 65,
  verification_strictness: 85,
};

interface FlowSel {
  finalidad:    PromptPurpose       | null;
  objetivo:     LegalObjective      | null;
  area:         PromptArea          | null;
  audiencia:    Audience            | null;
  cognitivo:    CognitiveMode       | null;
  riesgo:       RiskTolerance       | null;
  procesal:     ProceduralStage     | null;
  jurisdiccion: JurisdictionScope   | null;
  profundidad:  DepthLevel          | null;
  formato:      OutputFormat        | null;
  capas:        string[];
  docMode:      DocumentContextMode | null;
  contexto:     string;
  modelo:       TargetAI            | null;
  precision:    PrecisionConfig;
}

type ResultTab = 'compilado' | 'standard' | 'ir' | 'workflow';

// ── Step config ────────────────────────────────────────────────────────────────
const BREADCRUMB = [
  { key: 'finalidad',     label: 'FINALIDAD',  step: 1 },
  { key: 'objetivo',      label: 'OBJETIVO',   step: 2 },
  { key: 'area',          label: 'ÁREA',       step: 3 },
  { key: 'audiencia',     label: 'AUDIENCIA',  step: 4 },
  { key: 'cognitivo',     label: 'COGNITIVO',  step: 5 },
  { key: 'procesal',      label: 'PROCESAL',   step: 6 },
  { key: 'profundidad',   label: 'NIVEL',      step: 7 },
  { key: 'formato',       label: 'FORMATO',    step: 8 },
  { key: 'capas',         label: 'CAPAS',      step: 9 },
  { key: 'documentos',    label: 'DOCS',       step: 10 },
  { key: 'contexto',      label: 'CONTEXTO',   step: 11 },
  { key: 'recomendacion', label: 'IA',         step: 12 },
  { key: 'generating',    label: 'GENERAR',    step: 13 },
];
const STEP_ORDER: FlowStep[] = [...BREADCRUMB.map(b => b.key as FlowStep), 'resultado'];

const GEN_PHASES = [
  'INITIALIZING COGNITIVE RUNTIME...',
  'ANALYZING LEGAL CONTEXT...',
  'LOADING NORMATIVE ENGINE...',
  'APPLYING COGNITIVE MODE...',
  'CALIBRATING PRECISION DIALS...',
  'ACTIVATING SECURITY LAYERS...',
  'COMPILING FOR TARGET PLATFORM...',
  'EXPORT READY ✓',
];

// ── Accent maps ────────────────────────────────────────────────────────────────
const ACCENT_BY_STEP: Record<FlowStep, string> = {
  finalidad: 'cyan', objetivo: 'indigo', area: 'purple',
  audiencia: 'cyan', cognitivo: 'indigo', procesal: 'purple',
  profundidad: 'cyan', formato: 'indigo', capas: 'purple',
  documentos: 'cyan', contexto: 'indigo', recomendacion: 'purple',
  generating: 'cyan', resultado: 'cyan',
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
const textMap:  Record<string, string> = { cyan: 'text-cyan-400', indigo: 'text-indigo-400', purple: 'text-purple-400' };
const bgMap:    Record<string, string> = { cyan: 'bg-cyan-500', indigo: 'bg-indigo-500', purple: 'bg-purple-500' };
const ringMap:  Record<string, string> = { cyan: 'text-cyan-400/60', indigo: 'text-indigo-400/60', purple: 'text-purple-400/60' };
const borderAccent: Record<string, string> = { cyan: 'border-cyan-500/40', indigo: 'border-indigo-500/40', purple: 'border-purple-500/40' };

// ── FlowCard ───────────────────────────────────────────────────────────────────
interface CardProps {
  emoji?: string; label: string; description?: string;
  selected: boolean; onClick: () => void; accent?: string; delay?: number;
}
function FlowCard({ emoji, label, description, selected, onClick, accent = 'cyan', delay = 0 }: CardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.22 }}
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.975 }}
      onClick={onClick}
      className={`relative w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
        selected ? accentMap[accent] : `border-white/[0.07] bg-white/[0.02] ${hoverMap[accent]}`
      }`}
    >
      {selected && (
        <motion.div layoutId="selection-glow"
          className="absolute inset-0 rounded-xl pointer-events-none"
          initial={false} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        />
      )}
      <div className="flex items-start gap-3">
        {emoji && <span className="text-xl shrink-0 mt-0.5">{emoji}</span>}
        <div className="min-w-0 flex-1">
          <div className={`font-bold text-sm leading-tight ${selected ? textMap[accent] : 'text-zinc-200'}`}>{label}</div>
          {description && <div className="text-[11px] text-zinc-500 mt-1 leading-relaxed">{description}</div>}
        </div>
        {selected && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            className={`shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center ${bgMap[accent]}`}
          >
            <Check className="w-2.5 h-2.5 text-black" />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}

// ── StepWrapper ────────────────────────────────────────────────────────────────
interface StepWrapperProps {
  stepNum: number; accent: string; title: string;
  subtitle?: React.ReactNode; children: React.ReactNode;
}
function StepWrapper({ stepNum, accent, title, subtitle, children }: StepWrapperProps) {
  return (
    <motion.div key={title}
      initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}
      className="p-6 lg:p-10 max-w-3xl"
    >
      <div className="mb-2">
        <span className={`text-[9px] mono font-bold ${ringMap[accent]} uppercase tracking-widest`}>
          Paso {stepNum} de 12
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
  const filled = [sel.finalidad, sel.objetivo, sel.area, sel.audiencia, sel.cognitivo,
    sel.procesal, sel.profundidad, sel.modelo].filter(Boolean).length;
  const strength = filled / 8;

  const rows = [
    { key: 'FINALIDAD',  value: sel.finalidad?.label,   color: 'text-cyan-400' },
    { key: 'OBJETIVO',   value: sel.objetivo?.label,    color: 'text-indigo-400' },
    { key: 'ÁREA',       value: sel.area?.label,        color: 'text-purple-400' },
    { key: 'AUDIENCIA',  value: sel.audiencia?.label,   color: 'text-cyan-400' },
    { key: 'COGNITIVO',  value: sel.cognitivo?.label,   color: 'text-indigo-400' },
    { key: 'PROCESAL',   value: sel.procesal?.label,    color: 'text-purple-400' },
    { key: 'NIVEL',      value: sel.profundidad?.label, color: 'text-cyan-400' },
    { key: 'MODELO',     value: sel.modelo?.label,      color: 'text-indigo-400' },
  ];

  return (
    <div className="h-full flex flex-col bg-[#04060c] border-l border-white/[0.05] overflow-y-auto">
      <div className="p-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-2 mb-1">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] mono font-bold text-cyan-400 uppercase tracking-widest">Cognitive DNA</span>
        </div>
        <div className="text-[10px] text-zinc-600">Runtime v3.0 · Actualización en tiempo real</div>
      </div>

      <div className="p-4 space-y-2 border-b border-white/[0.05]">
        {rows.map(row => (
          <div key={row.key} className="flex items-center gap-2">
            <span className={`${row.color} text-[10px] shrink-0 mono w-3`}>{row.value ? '◉' : '○'}</span>
            <span className="text-[9px] mono text-zinc-600 uppercase tracking-wider w-20 shrink-0">{row.key}</span>
            <AnimatePresence mode="wait">
              {row.value ? (
                <motion.span key={row.value} initial={{ opacity: 0, x: 4 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -4 }} className="text-[10px] text-zinc-300 font-medium truncate">
                  {row.value}
                </motion.span>
              ) : (
                <span className="text-[10px] text-zinc-700">···</span>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Precision mini-display */}
      {(sel.precision.analytical_depth !== DEFAULT_PRECISION.analytical_depth ||
        sel.precision.verification_strictness !== DEFAULT_PRECISION.verification_strictness) && (
        <div className="p-4 border-b border-white/[0.05]">
          <div className="text-[9px] mono text-zinc-600 uppercase tracking-wider mb-2">Precision dials</div>
          {[
            { label: 'Análisis', v: sel.precision.analytical_depth },
            { label: 'Rigor',    v: sel.precision.verification_strictness },
          ].map(d => (
            <div key={d.label} className="flex items-center gap-2 mb-1.5">
              <span className="text-[9px] text-zinc-600 w-12">{d.label}</span>
              <div className="flex-1 h-1 rounded-full bg-white/[0.05] overflow-hidden">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                  animate={{ width: `${d.v}%` }} transition={{ duration: 0.4 }} />
              </div>
              <span className="text-[9px] mono text-cyan-500 w-6 text-right">{d.v}</span>
            </div>
          ))}
        </div>
      )}

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
          <span className="text-[9px] mono text-zinc-600 uppercase tracking-wider">Potencia cognitiva</span>
          <span className="text-[9px] mono text-cyan-500">{Math.round(strength * 100)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500"
            animate={{ width: `${strength * 100}%` }} transition={{ type: 'spring', damping: 20, stiffness: 150 }}
          />
        </div>
        <div className="text-[9px] text-zinc-600 mt-1.5">{filled}/8 parámetros configurados</div>
      </div>

      {/* Preview */}
      <div className="p-4 flex-1">
        <div className="text-[9px] mono text-zinc-600 uppercase tracking-wider mb-2">Preview</div>
        <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-3 min-h-[80px]">
          <AnimatePresence mode="wait">
            {promptPreview ? (
              <motion.p key={promptPreview.slice(0, 40)} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-[9px] mono text-zinc-500 leading-relaxed whitespace-pre-wrap break-words">
                {promptPreview.slice(0, 240)}{promptPreview.length > 240 ? '…' : ''}
              </motion.p>
            ) : (
              <p className="text-[9px] text-zinc-700">El runtime construirá el prompt aquí...</p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ── Workflow Pipeline ──────────────────────────────────────────────────────────
function WorkflowPipeline({ sel }: { sel: FlowSel }) {
  const nodes = [
    { label: 'OBJETIVO',    value: sel.objetivo?.label ?? '—',    color: 'cyan' },
    { label: 'FINALIDAD',   value: sel.finalidad?.label ?? '—',   color: 'indigo' },
    { label: 'ÁREA',        value: sel.area?.label ?? '—',        color: 'purple' },
    { label: 'COGNITIVO',   value: sel.cognitivo?.label ?? '—',   color: 'cyan' },
    { label: 'AUDIENCIA',   value: sel.audiencia?.label ?? '—',   color: 'indigo' },
    { label: 'NIVEL',       value: sel.profundidad?.label ?? '—', color: 'purple' },
    { label: 'IA OBJETIVO', value: sel.modelo?.label ?? '—',      color: 'cyan' },
    { label: 'OUTPUT',      value: sel.formato?.emoji ?? '📄',    color: 'indigo' },
  ];
  const nc: Record<string, string> = {
    cyan:   'border-cyan-500/40 bg-cyan-500/[0.06] text-cyan-400',
    indigo: 'border-indigo-500/40 bg-indigo-500/[0.06] text-indigo-400',
    purple: 'border-purple-500/40 bg-purple-500/[0.06] text-purple-400',
  };
  return (
    <div className="p-4">
      <div className="text-[9px] mono font-bold text-zinc-500 uppercase tracking-widest mb-4">
        Cognitive execution pipeline
      </div>
      <div className="hidden md:flex items-center gap-1 overflow-x-auto pb-2">
        {nodes.map((node, i) => (
          <div key={node.label} className="flex items-center gap-1 shrink-0">
            <div className={`rounded-lg border px-3 py-2 text-center min-w-[80px] ${nc[node.color]}`}>
              <div className="text-[8px] mono uppercase tracking-wider opacity-60 mb-0.5">{node.label}</div>
              <div className="text-[10px] font-bold truncate max-w-[90px]">{node.value}</div>
            </div>
            {i < nodes.length - 1 && <div className="text-zinc-700 text-xs">→</div>}
          </div>
        ))}
      </div>
      <div className="flex md:hidden flex-col gap-2">
        {nodes.map((node, i) => (
          <div key={node.label} className="flex items-center gap-3">
            <div className={`rounded-lg border px-3 py-2 flex-1 flex justify-between items-center ${nc[node.color]}`}>
              <span className="text-[9px] mono uppercase tracking-wider opacity-60">{node.label}</span>
              <span className="text-[10px] font-bold">{node.value}</span>
            </div>
            {i < nodes.length - 1 && <div className="text-zinc-700 text-xs ml-1">↓</div>}
          </div>
        ))}
      </div>
      {sel.capas.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/[0.05]">
          <div className="text-[9px] mono text-zinc-600 uppercase tracking-wider mb-2">Capas de seguridad</div>
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
      {/* Precision summary */}
      <div className="mt-4 pt-4 border-t border-white/[0.05]">
        <div className="text-[9px] mono text-zinc-600 uppercase tracking-wider mb-3">Precision dials activos</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { label: 'Profundidad analítica',  v: sel.precision.analytical_depth },
            { label: 'Agresividad litigante',  v: sel.precision.litigious_aggressiveness },
            { label: 'Creatividad argumental', v: sel.precision.argumentative_creativity },
            { label: 'Densidad técnica',       v: sel.precision.technical_density },
            { label: 'Rigor verificación',     v: sel.precision.verification_strictness },
          ].map(d => (
            <div key={d.label} className="flex items-center gap-2">
              <span className="text-[9px] text-zinc-600 w-32 shrink-0">{d.label}</span>
              <div className="flex-1 h-1 rounded-full bg-white/[0.05] overflow-hidden">
                <div className="h-full rounded-full bg-indigo-500/50" style={{ width: `${d.v}%` }} />
              </div>
              <span className="text-[9px] mono text-zinc-500 w-7 text-right">{d.v}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── AI Recommendation Step ─────────────────────────────────────────────────────
function AIRecommendStep({
  aiRecs, onSelect,
}: {
  aiRecs: import('@/data/promptBuilder').AIRecommendation[];
  onSelect: (ai: TargetAI) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const top = aiRecs[0];
  const rest = aiRecs.slice(1);

  return (
    <motion.div key="recomendacion"
      initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}
      className="p-6 lg:p-10 max-w-2xl"
    >
      <div className="mb-2">
        <span className="text-[9px] mono font-bold text-purple-400/60 uppercase tracking-widest">Paso 12 de 12</span>
      </div>
      <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">IA recomendada</h1>
      <p className="text-zinc-500 text-sm mb-8">Basado en tu objetivo, área y nivel de profundidad</p>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
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
          <div className="shrink-0 text-center">
            <div className="text-3xl font-bold mono text-cyan-400">{top.score}%</div>
            <div className="text-[9px] text-zinc-600 uppercase tracking-wider">match</div>
          </div>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden mb-4">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-400"
            initial={{ width: 0 }} animate={{ width: `${top.score}%` }}
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          />
        </div>
        {top.reasons.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {top.reasons.map(r => (
              <span key={r} className="text-[10px] px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.07] text-zinc-400">
                ✓ {r}
              </span>
            ))}
          </div>
        )}
        <button onClick={() => onSelect(top.ai)}
          className="w-full py-3 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-sm hover:bg-cyan-500/30 transition-all"
        >
          Usar {top.ai.label} — Compilar prompt →
        </button>
      </motion.div>

      {!showAll ? (
        <button onClick={() => setShowAll(true)}
          className="w-full py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-zinc-600 hover:text-zinc-400 text-xs hover:bg-white/[0.04] transition-all"
        >
          Ver otras opciones ({rest.length} IAs con % de compatibilidad)
        </button>
      ) : (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
          <div className="text-[9px] mono text-zinc-600 uppercase tracking-widest mb-3">Otras opciones</div>
          {rest.map((rec, i) => (
            <motion.button key={rec.ai.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }} onClick={() => onSelect(rec.ai)}
              className="w-full text-left p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="shrink-0 w-6 h-6 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[10px] mono text-zinc-600 font-bold">
                  {i + 2}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">{rec.ai.label}</div>
                  <div className="text-[11px] text-zinc-600 mt-0.5">{rec.ai.description}</div>
                  {rec.reasons.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {rec.reasons.map(r => (
                        <span key={r} className="text-[9px] text-zinc-700 px-1.5 py-0.5 rounded bg-white/[0.02] border border-white/[0.04]">{r}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-sm font-bold mono text-zinc-500">{rec.score}%</div>
                  <div className="w-16 h-1 rounded-full bg-white/[0.04] overflow-hidden mt-1">
                    <motion.div className="h-full rounded-full bg-zinc-600"
                      initial={{ width: 0 }} animate={{ width: `${rec.score}%` }}
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

// ── Precision Slider ───────────────────────────────────────────────────────────
function PrecisionSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] text-zinc-500">{label}</span>
        <span className="text-[10px] mono text-indigo-400 font-bold">{value}%</span>
      </div>
      <input type="range" min={0} max={100} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full cursor-pointer accent-indigo-500 bg-white/[0.06]"
      />
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function PromptLabPage() {
  const [step, setStep] = useState<FlowStep>('finalidad');
  const [sel, setSel] = useState<FlowSel>({
    finalidad: null, objetivo: null, area: null, audiencia: null,
    cognitivo: null, riesgo: null, procesal: null, jurisdiccion: null,
    profundidad: null, formato: null, capas: [], docMode: null,
    contexto: '', modelo: null, precision: DEFAULT_PRECISION,
  });
  const [genPhase, setGenPhase] = useState(-1);
  const [promptResult, setPromptResult]     = useState('');
  const [promptCompiled, setPromptCompiled] = useState('');
  const [promptIR, setPromptIR]             = useState('');
  const [copied, setCopied]                 = useState(false);
  const [downloading, setDownloading]       = useState(false);
  const [resultTab, setResultTab]           = useState<ResultTab>('compilado');
  const [showPrecision, setShowPrecision]   = useState(false);

  const selRef = useRef(sel);
  useEffect(() => { selRef.current = sel; });

  // ── Navigation ───────────────────────────────────────────────────────────────
  const goTo = useCallback((next: FlowStep) => {
    setTimeout(() => setStep(next), 260);
  }, []);

  const nextMap: Record<string, FlowStep> = {
    finalidad: 'objetivo', objetivo: 'area', area: 'audiencia',
    audiencia: 'cognitivo', cognitivo: 'procesal',
    profundidad: 'formato', formato: 'capas',
    docMode: 'contexto',
    recomendacion: 'generating', modelo: 'generating',
  };

  const selectStep = useCallback(<K extends keyof FlowSel>(key: K, value: FlowSel[K]) => {
    setSel(prev => ({ ...prev, [key]: value }));
    const next = nextMap[key];
    if (next) goTo(next);
  }, [goTo]); // eslint-disable-line react-hooks/exhaustive-deps

  const goBack = () => {
    const prevMap: Partial<Record<FlowStep, FlowStep>> = {
      objetivo: 'finalidad', area: 'objetivo', audiencia: 'area',
      cognitivo: 'audiencia', procesal: 'cognitivo', profundidad: 'procesal',
      formato: 'profundidad', capas: 'formato', documentos: 'capas',
      contexto: 'documentos', recomendacion: 'contexto',
    };
    if (prevMap[step]) setStep(prevMap[step]!);
  };

  const reset = () => {
    setSel({
      finalidad: null, objetivo: null, area: null, audiencia: null,
      cognitivo: null, riesgo: null, procesal: null, jurisdiccion: null,
      profundidad: null, formato: null, capas: [], docMode: null,
      contexto: '', modelo: null, precision: DEFAULT_PRECISION,
    });
    setGenPhase(-1); setPromptResult(''); setPromptCompiled(''); setPromptIR('');
    setStep('finalidad'); setResultTab('compilado'); setShowPrecision(false);
  };

  const toggleCapa = (id: string) => {
    setSel(prev => ({
      ...prev,
      capas: prev.capas.includes(id) ? prev.capas.filter(c => c !== id) : [...prev.capas, id],
    }));
  };

  const setPrecision = (key: keyof PrecisionConfig, value: number) => {
    setSel(prev => ({ ...prev, precision: { ...prev.precision, [key]: value } }));
  };

  // ── AI recommendations ───────────────────────────────────────────────────────
  const aiRecs = useMemo(() => {
    if (!sel.finalidad || !sel.area || !sel.profundidad) return [];
    return recommendAIModel(sel.finalidad, sel.area, sel.profundidad);
  }, [sel.finalidad, sel.area, sel.profundidad]);

  // ── Generating ───────────────────────────────────────────────────────────────
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
        const profile    = autoSelectProfile(s.finalidad!);
        const format     = s.formato ?? autoSelectFormat(s.finalidad!, s.profundidad!);
        const activeCaps = s.capas.length > 0 ? s.capas : ['antihallu', 'sources'];

        const compilerInput: CompilerInput = {
          profile, purpose: s.finalidad!, area: s.area!, depth: s.profundidad!,
          targetAI: s.modelo!, format, activeEnhancements: activeCaps, context: s.contexto,
          legalObjective:      s.objetivo!,
          audience:            s.audiencia!,
          cognitiveMode:       s.cognitivo!,
          riskTolerance:       s.riesgo ?? riskTolerances[1],
          proceduralStage:     s.procesal!,
          jurisdiction:        s.jurisdiccion ?? jurisdictions[0],
          documentContextMode: s.docMode ?? documentContextModes[1],
          precision:           s.precision,
        };

        const result = generatePrompt(
          profile, s.finalidad!, s.area!, s.profundidad!, s.modelo!,
          format, activeCaps, s.contexto,
        );
        const compiled = s.modelo?.id === 'claude' ? compileForClaude(compilerInput)
          : s.modelo?.id === 'gemini' ? compileForGemini(compilerInput)
          : compileForGPT(compilerInput);
        const ir = buildIRYAML(compilerInput);

        setPromptResult(result);
        setPromptCompiled(compiled);
        setPromptIR(ir);
        doneTimer = setTimeout(() => setStep('resultado'), 500);
      }
    }, 380);
    return () => { clearInterval(id); clearTimeout(doneTimer); };
  }, [step]);

  // ── Live preview ─────────────────────────────────────────────────────────────
  const promptPreview = useMemo(() => {
    if (!sel.finalidad) return '';
    const parts: string[] = [`FINALIDAD: ${sel.finalidad.label}`];
    if (sel.objetivo)   parts.push(`OBJETIVO: ${sel.objetivo.label}`);
    if (sel.area)       parts.push(`ÁREA: ${sel.area.label}`);
    if (sel.cognitivo)  parts.push(`MODO: ${sel.cognitivo.label}`);
    if (sel.audiencia)  parts.push(`AUDIENCIA: ${sel.audiencia.label}`);
    if (sel.profundidad) parts.push(`NIVEL: ${sel.profundidad.label}`);
    if (sel.modelo)     parts.push(`IA: ${sel.modelo.label}`);
    parts.push('', '[Cognitive Runtime v3.0]');
    return parts.join('\n');
  }, [sel]);

  // ── Copy ─────────────────────────────────────────────────────────────────────
  const copyPrompt = async () => {
    const content = resultTab === 'compilado' ? promptCompiled
      : resultTab === 'ir' ? promptIR
      : promptResult;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // ── Downloads ────────────────────────────────────────────────────────────────
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
    } finally { setDownloading(false); }
  };

  const ext = sel.modelo?.id === 'claude' ? 'xml' : 'txt';
  const downloadCompiled = () => downloadBlob(promptCompiled, `prompt-${sel.modelo?.id ?? 'compiled'}.${ext}`);
  const downloadIR       = () => downloadBlob(promptIR, 'prompt-ir-v3.yaml', 'text/yaml;charset=utf-8');
  const downloadTxt      = () => downloadBlob(promptResult, 'prompt-juridico-diat.txt');
  const downloadMd       = () => downloadBlob(`# Prompt Jurídico DIAT\n\n\`\`\`\n${promptResult}\n\`\`\`\n`, 'prompt-juridico-diat.md', 'text/markdown;charset=utf-8');
  const downloadSys      = () => sel.modelo && downloadBlob(generateSystemPrompt(promptResult, sel.modelo), 'system-prompt-diat.txt');
  const downloadGPT      = () => downloadBlob(generateGPTInstructions(promptResult), 'gpt-instructions-diat.txt');
  const downloadClaude   = () => downloadBlob(generateClaudeProject(promptResult), 'claude-project-diat.txt');

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const stepIdx     = STEP_ORDER.indexOf(step);
  const activeAccent = ACCENT_BY_STEP[step] ?? 'cyan';

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)] bg-[#04060c]">

      {/* ── Progress breadcrumb ──────────────────────────────────────────────── */}
      <div className="shrink-0 border-b border-white/[0.05] bg-[#04060c]/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 lg:px-6 h-11">
          <div className="w-20">
            {['objetivo','area','audiencia','cognitivo','procesal','profundidad','formato',
              'capas','documentos','contexto','recomendacion'].includes(step) && (
              <button onClick={goBack}
                className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />Volver
              </button>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-0.5">
            {BREADCRUMB.map((bc, bi) => {
              const done   = stepIdx > bi;
              const active = stepIdx === bi;
              return (
                <div key={bc.key} className="flex items-center gap-0.5">
                  <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md transition-all duration-300 ${
                    active ? 'bg-cyan-500/15 text-cyan-400' : done ? 'text-zinc-500' : 'text-zinc-700'
                  }`}>
                    {done && <Check className="w-2 h-2 text-emerald-500" />}
                    <span className="text-[7px] mono font-bold tracking-widest">{bc.label}</span>
                  </div>
                  {bi < BREADCRUMB.length - 1 && (
                    <div className={`w-1.5 h-px ${done ? 'bg-emerald-500/40' : 'bg-white/[0.05]'}`} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="sm:hidden text-[10px] mono text-zinc-600">
            {stepIdx < 13 ? `${stepIdx + 1}/13` : '✓'}
          </div>

          <div className="w-20 flex justify-end">
            {step === 'resultado' && (
              <button onClick={reset}
                className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /><span className="hidden sm:inline">Reiniciar</span>
              </button>
            )}
          </div>
        </div>
        <div className="sm:hidden h-0.5 bg-white/[0.04]">
          <motion.div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500"
            animate={{ width: `${Math.min(100, (stepIdx / 13) * 100)}%` }}
            transition={{ type: 'spring', damping: 25 }}
          />
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* STEP 1: FINALIDAD */}
            {step === 'finalidad' && (
              <StepWrapper stepNum={1} accent="cyan" title="¿Qué necesitas hacer?"
                subtitle="Selecciona el tipo de tarea jurídica"
              >
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {purposes.map((p, i) => (
                    <FlowCard key={p.id} emoji={p.emoji} label={p.label}
                      selected={sel.finalidad?.id === p.id}
                      onClick={() => selectStep('finalidad', p)} accent="cyan" delay={i * 0.04}
                    />
                  ))}
                </div>
              </StepWrapper>
            )}

            {/* STEP 2: OBJETIVO LEGAL */}
            {step === 'objetivo' && (
              <StepWrapper stepNum={2} accent="indigo" title="¿Cuál es el objetivo legal?"
                subtitle={<>Tarea: <span className="text-indigo-400 font-medium">{sel.finalidad?.emoji} {sel.finalidad?.label}</span> · ¿Qué quieres lograr jurídicamente?</>}
              >
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {legalObjectives.map((o, i) => (
                    <FlowCard key={o.id} emoji={o.emoji} label={o.label} description={o.description}
                      selected={sel.objetivo?.id === o.id}
                      onClick={() => selectStep('objetivo', o)} accent="indigo" delay={i * 0.04}
                    />
                  ))}
                </div>
              </StepWrapper>
            )}

            {/* STEP 3: ÁREA */}
            {step === 'area' && (
              <StepWrapper stepNum={3} accent="purple" title="¿En qué área jurídica?"
                subtitle={<><span className="text-purple-400 font-medium">{sel.objetivo?.emoji} {sel.objetivo?.label}</span> · {sel.finalidad?.label}</>}
              >
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {areas.map((a, i) => (
                    <FlowCard key={a.id} emoji={a.emoji} label={a.label}
                      selected={sel.area?.id === a.id}
                      onClick={() => selectStep('area', a)} accent="purple" delay={i * 0.04}
                    />
                  ))}
                </div>
              </StepWrapper>
            )}

            {/* STEP 4: AUDIENCIA */}
            {step === 'audiencia' && (
              <StepWrapper stepNum={4} accent="cyan" title="¿A quién va dirigido?"
                subtitle="Selecciona la audiencia — el output se calibrará automáticamente"
              >
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {audiences.map((a, i) => (
                    <FlowCard key={a.id} emoji={a.emoji} label={a.label}
                      description={a.calibration.split('.')[0]}
                      selected={sel.audiencia?.id === a.id}
                      onClick={() => selectStep('audiencia', a)} accent="cyan" delay={i * 0.04}
                    />
                  ))}
                </div>
              </StepWrapper>
            )}

            {/* STEP 5: MODO COGNITIVO */}
            {step === 'cognitivo' && (
              <StepWrapper stepNum={5} accent="indigo" title="¿Modo de razonamiento?"
                subtitle="Define el protocolo cognitivo que usará la IA"
              >
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {cognitiveModes.map((c, i) => (
                    <FlowCard key={c.id} emoji={c.emoji} label={c.label} description={c.description}
                      selected={sel.cognitivo?.id === c.id}
                      onClick={() => selectStep('cognitivo', c)} accent="indigo" delay={i * 0.04}
                    />
                  ))}
                </div>
              </StepWrapper>
            )}

            {/* STEP 6: PROCESAL + JURISDICCIÓN + RIESGO */}
            {step === 'procesal' && (
              <motion.div key="procesal"
                initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}
                className="p-6 lg:p-10 max-w-3xl"
              >
                <div className="mb-2">
                  <span className="text-[9px] mono font-bold text-purple-400/60 uppercase tracking-widest">Paso 6 de 12</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">Contexto procesal</h1>
                <p className="text-zinc-500 text-sm mb-8">Etapa del proceso, jurisdicción y tolerancia al riesgo</p>

                {/* Procedural stage */}
                <div className="mb-6">
                  <div className="text-[10px] mono font-bold text-purple-400 uppercase tracking-widest mb-3">
                    Etapa procesal
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    {proceduralStages.map((ps, i) => (
                      <motion.button key={ps.id}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => setSel(prev => ({ ...prev, procesal: ps }))}
                        className={`text-left p-3 rounded-xl border text-sm transition-all ${
                          sel.procesal?.id === ps.id
                            ? 'border-purple-500/60 bg-purple-500/[0.08] text-purple-400'
                            : 'border-white/[0.07] bg-white/[0.02] text-zinc-400 hover:border-purple-500/30 hover:bg-purple-500/[0.04]'
                        }`}
                      >
                        <div className="text-base mb-1">{ps.emoji}</div>
                        <div className="font-bold text-[11px] leading-tight">{ps.label}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Jurisdiction */}
                <div className="mb-6">
                  <div className="text-[10px] mono font-bold text-purple-400 uppercase tracking-widest mb-3">
                    Jurisdicción
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {jurisdictions.map(j => (
                      <button key={j.id}
                        onClick={() => setSel(prev => ({ ...prev, jurisdiccion: j }))}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                          sel.jurisdiccion?.id === j.id
                            ? 'border-purple-500/50 bg-purple-500/[0.12] text-purple-300'
                            : 'border-white/[0.08] bg-white/[0.02] text-zinc-500 hover:border-purple-500/30 hover:text-zinc-300'
                        }`}
                      >
                        <span>{j.emoji}</span>{j.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Risk tolerance */}
                <div className="mb-8">
                  <div className="text-[10px] mono font-bold text-purple-400 uppercase tracking-widest mb-3">
                    Tolerancia al riesgo
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {riskTolerances.map((rt, i) => (
                      <motion.button key={rt.id}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        onClick={() => setSel(prev => ({ ...prev, riesgo: rt }))}
                        className={`text-left p-3 rounded-xl border transition-all ${
                          sel.riesgo?.id === rt.id
                            ? 'border-purple-500/60 bg-purple-500/[0.08]'
                            : 'border-white/[0.07] bg-white/[0.02] hover:border-purple-500/30'
                        }`}
                      >
                        <div className="text-lg mb-1">{rt.emoji}</div>
                        <div className={`font-bold text-sm ${sel.riesgo?.id === rt.id ? 'text-purple-400' : 'text-zinc-300'}`}>{rt.label}</div>
                        <div className="text-[10px] text-zinc-600 mt-0.5">{rt.description}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => goTo('profundidad')}
                  disabled={!sel.procesal}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    sel.procesal
                      ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30'
                      : 'bg-white/[0.03] border border-white/[0.06] text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  Continuar
                </button>
              </motion.div>
            )}

            {/* STEP 7: PROFUNDIDAD */}
            {step === 'profundidad' && (
              <StepWrapper stepNum={7} accent="cyan" title="¿Qué nivel de análisis?"
                subtitle={<>{sel.objetivo?.emoji} {sel.objetivo?.label} · {sel.area?.emoji} {sel.area?.label}</>}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {depthLevels.map((d, i) => (
                    <FlowCard key={d.id} label={d.label} description={d.description}
                      selected={sel.profundidad?.id === d.id}
                      onClick={() => selectStep('profundidad', d)} accent="cyan" delay={i * 0.06}
                    />
                  ))}
                </div>
              </StepWrapper>
            )}

            {/* STEP 8: FORMATO */}
            {step === 'formato' && (
              <StepWrapper stepNum={8} accent="indigo" title="¿Formato de salida?"
                subtitle={<>Nivel: <span className="text-indigo-400 font-medium">{sel.profundidad?.label}</span> · {sel.profundidad?.description}</>}
              >
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {outputFormats.map((f, i) => (
                    <FlowCard key={f.id} emoji={f.emoji} label={f.label}
                      selected={sel.formato?.id === f.id}
                      onClick={() => selectStep('formato', f)} accent="indigo" delay={i * 0.04}
                    />
                  ))}
                </div>
              </StepWrapper>
            )}

            {/* STEP 9: CAPAS */}
            {step === 'capas' && (
              <motion.div key="capas"
                initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}
                className="p-6 lg:p-10 max-w-3xl"
              >
                <div className="mb-2">
                  <span className="text-[9px] mono font-bold text-purple-400/60 uppercase tracking-widest">Paso 9 de 12</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">Capas de seguridad</h1>
                <p className="text-zinc-500 text-sm mb-1">Protecciones cognitivas del prompt</p>
                <p className="text-zinc-700 text-xs mb-8">Anti-alucinaciones y Fuentes chilenas se recomiendan siempre · Puedes seleccionar varias</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {enhancements.map((e, i) => {
                    const on = sel.capas.includes(e.id);
                    return (
                      <motion.button key={e.id}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => toggleCapa(e.id)}
                        className={`relative w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                          on ? 'border-emerald-500/50 bg-emerald-500/[0.07]' : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg shrink-0">{e.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-bold ${on ? 'text-emerald-400' : 'text-zinc-300'}`}>{e.label}</div>
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
                  <button onClick={() => goTo('documentos')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      sel.capas.length > 0
                        ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30'
                        : 'bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:bg-white/[0.08]'
                    }`}
                  >
                    {sel.capas.length > 0 ? `Continuar con ${sel.capas.length} capa${sel.capas.length > 1 ? 's' : ''}` : 'Continuar sin capas adicionales'}
                  </button>
                  <button
                    onClick={() => { setSel(prev => ({ ...prev, capas: ['antihallu', 'sources'] })); goTo('documentos'); }}
                    className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    Usar recomendadas
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 10: CONTEXTO DOCUMENTAL */}
            {step === 'documentos' && (
              <StepWrapper stepNum={10} accent="cyan" title="¿Cómo usará la IA el documento?"
                subtitle="Define la política de grounding documental del prompt"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {documentContextModes.map((d, i) => (
                    <FlowCard key={d.id} emoji={d.emoji} label={d.label} description={d.description}
                      selected={sel.docMode?.id === d.id}
                      onClick={() => selectStep('docMode', d)} accent="cyan" delay={i * 0.06}
                    />
                  ))}
                </div>
              </StepWrapper>
            )}

            {/* STEP 11: CONTEXTO + PRECISION SLIDERS */}
            {step === 'contexto' && (
              <motion.div key="contexto"
                initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}
                className="p-6 lg:p-10 max-w-3xl"
              >
                <div className="mb-2">
                  <span className="text-[9px] mono font-bold text-indigo-400/60 uppercase tracking-widest">Paso 11 de 12</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">Contexto y precisión</h1>
                <p className="text-zinc-500 text-sm mb-1">Describe tu caso y calibra los parámetros cognitivos</p>
                <p className="text-zinc-700 text-xs mb-8">Opcional — mejora la precisión · No incluyas RUTs ni datos sensibles</p>

                <textarea value={sel.contexto}
                  onChange={e => setSel(prev => ({ ...prev, contexto: e.target.value }))}
                  placeholder="Ej: Necesito analizar un contrato de arriendo con cláusula de término anticipado potencialmente abusiva..."
                  rows={5}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] text-zinc-300 placeholder-zinc-700 text-sm p-4 resize-none focus:outline-none focus:border-indigo-500/40 transition-colors mono mb-4"
                />

                {/* Precision sliders toggle */}
                <button onClick={() => setShowPrecision(v => !v)}
                  className="flex items-center gap-2 text-xs text-zinc-600 hover:text-zinc-400 transition-colors mb-4"
                >
                  <Zap className="w-3 h-3" />
                  {showPrecision ? 'Ocultar' : 'Configurar'} precision dials (avanzado)
                  <span className="text-[9px] mono text-indigo-500/60">
                    {showPrecision ? '▲' : '▼'}
                  </span>
                </button>

                <AnimatePresence>
                  {showPrecision && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }} className="overflow-hidden"
                    >
                      <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[0.04] p-5 space-y-4 mb-4">
                        <div className="text-[9px] mono font-bold text-indigo-400 uppercase tracking-widest mb-1">
                          Precision dials — Calibración cognitiva
                        </div>
                        <PrecisionSlider label="Profundidad analítica"
                          value={sel.precision.analytical_depth}
                          onChange={v => setPrecision('analytical_depth', v)} />
                        <PrecisionSlider label="Agresividad litigante"
                          value={sel.precision.litigious_aggressiveness}
                          onChange={v => setPrecision('litigious_aggressiveness', v)} />
                        <PrecisionSlider label="Creatividad argumental"
                          value={sel.precision.argumentative_creativity}
                          onChange={v => setPrecision('argumentative_creativity', v)} />
                        <PrecisionSlider label="Densidad técnica"
                          value={sel.precision.technical_density}
                          onChange={v => setPrecision('technical_density', v)} />
                        <PrecisionSlider label="Rigor de verificación"
                          value={sel.precision.verification_strictness}
                          onChange={v => setPrecision('verification_strictness', v)} />
                        <button onClick={() => setSel(prev => ({ ...prev, precision: DEFAULT_PRECISION }))}
                          className="text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors"
                        >
                          Restaurar valores por defecto
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button onClick={() => goTo('recomendacion')}
                  className="px-6 py-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/40 text-indigo-300 text-sm font-bold hover:bg-indigo-500/25 transition-all"
                >
                  {sel.contexto.trim() ? 'Continuar con contexto' : 'Omitir este paso'}
                </button>
              </motion.div>
            )}

            {/* STEP 12: IA RECOMMENDATION */}
            {step === 'recomendacion' && aiRecs.length > 0 && (
              <AIRecommendStep aiRecs={aiRecs} onSelect={ai => selectStep('modelo', ai)} />
            )}

            {/* GENERATING */}
            {step === 'generating' && (
              <motion.div key="generating"
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3 }}
                className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-6"
              >
                <div className="max-w-lg w-full">
                  <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}
                    className="text-center mb-10"
                  >
                    <div className="inline-flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="text-[10px] mono font-bold text-cyan-400 uppercase tracking-widest">LexPrompt Cognitive Runtime v3.0</span>
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Compilando prompt cognitivo...</h2>
                    {sel.modelo && (
                      <p className="text-zinc-600 text-xs mt-2 mono">Target: {sel.modelo.label}</p>
                    )}
                  </motion.div>

                  <div className="bg-[#070b12] rounded-2xl border border-white/[0.07] p-6 font-mono space-y-3">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.05]">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                      <span className="text-[9px] text-zinc-600 ml-2">lexiprompt-runtime — compile</span>
                    </div>
                    {GEN_PHASES.map((phase, i) => (
                      <AnimatePresence key={phase}>
                        {genPhase >= i && (
                          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                            className="flex items-center gap-3"
                          >
                            {genPhase > i ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                className="w-3.5 h-3.5 border border-cyan-400 border-t-transparent rounded-full shrink-0"
                              />
                            )}
                            <span className={`text-xs ${
                              i === GEN_PHASES.length - 1 ? 'text-emerald-400 font-bold'
                                : genPhase > i ? 'text-zinc-500' : 'text-cyan-300'
                            }`}>{phase}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-2">
                    {[
                      { k: 'OBJETIVO', v: sel.objetivo?.label },
                      { k: 'MODO',     v: sel.cognitivo?.label },
                      { k: 'ÁREA',     v: sel.area?.label },
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

            {/* RESULTADO */}
            {step === 'resultado' && (
              <motion.div key="resultado"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                className="p-4 lg:p-6 grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6 min-h-full"
              >
                {/* Left: Prompt content */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[9px] mono font-bold text-emerald-400 uppercase tracking-widest">Prompt compilado</span>
                      </div>
                      <h2 className="text-xl font-bold text-white">Cognitive Runtime Output</h2>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={copyPrompt}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] text-xs text-zinc-400 hover:text-zinc-200 transition-all"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copiado' : 'Copiar'}
                      </button>
                      <button onClick={downloadTxt}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] text-xs text-zinc-400 hover:text-zinc-200 transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />TXT
                      </button>
                      <button onClick={downloadMd}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] text-xs text-zinc-400 hover:text-zinc-200 transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />MD
                      </button>
                      <button onClick={downloadPDF} disabled={downloading}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/40 hover:bg-cyan-500/25 text-cyan-300 text-xs font-bold transition-all disabled:opacity-60"
                      >
                        {downloading ? (
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                            className="w-3.5 h-3.5 border border-cyan-400 border-t-transparent rounded-full"
                          />
                        ) : <Download className="w-3.5 h-3.5" />}
                        {downloading ? 'Generando...' : 'PDF'}
                      </button>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-1 border-b border-white/[0.05]">
                    {([
                      { id: 'compilado', label: 'Compilado',  icon: <Cpu className="w-3 h-3" /> },
                      { id: 'standard',  label: 'Estándar',   icon: <FileText className="w-3 h-3" /> },
                      { id: 'ir',        label: 'IR YAML',    icon: <Code2 className="w-3 h-3" /> },
                      { id: 'workflow',  label: 'Workflow',   icon: <GitBranch className="w-3 h-3" /> },
                    ] as { id: ResultTab; label: string; icon: React.ReactNode }[]).map(tab => (
                      <button key={tab.id} onClick={() => setResultTab(tab.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-all border-b-2 -mb-px ${
                          resultTab === tab.id ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-zinc-600 hover:text-zinc-400'
                        }`}
                      >
                        {tab.icon}{tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab content */}
                  <AnimatePresence mode="wait">
                    {resultTab === 'compilado' && (
                      <motion.div key="compilado" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex-1 rounded-xl border border-cyan-500/20 bg-[#070b12] overflow-hidden"
                      >
                        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.05] bg-cyan-500/[0.04]">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-500/70" />
                            <span className="text-[9px] mono text-cyan-400">
                              prompt-{sel.modelo?.id ?? 'compiled'}.{sel.modelo?.id === 'claude' ? 'xml' : 'txt'} — model-specific compilation
                            </span>
                          </div>
                          <button onClick={downloadCompiled} className="text-[9px] mono text-cyan-500 hover:text-cyan-300 transition-colors">
                            ↓ {sel.modelo?.id === 'claude' ? 'XML' : 'TXT'}
                          </button>
                        </div>
                        <div className="p-4 overflow-x-auto">
                          <pre className="text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap font-mono">{promptCompiled}</pre>
                        </div>
                      </motion.div>
                    )}

                    {resultTab === 'standard' && (
                      <motion.div key="standard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex-1 rounded-xl border border-white/[0.06] bg-[#070b12] overflow-hidden"
                      >
                        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.05] bg-white/[0.02]">
                          <div className="w-2 h-2 rounded-full bg-red-500/50" />
                          <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                          <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                          <span className="text-[9px] mono text-zinc-600 ml-2">prompt-juridico-diat.txt</span>
                        </div>
                        <div className="p-4 overflow-x-auto">
                          <pre className="text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap font-mono">{promptResult}</pre>
                        </div>
                      </motion.div>
                    )}

                    {resultTab === 'ir' && (
                      <motion.div key="ir" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex-1 rounded-xl border border-indigo-500/20 bg-[#070b12] overflow-hidden"
                      >
                        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.05] bg-indigo-500/[0.04]">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500/70" />
                            <span className="text-[9px] mono text-indigo-400">prompt-ir-v3.yaml — intermediate representation</span>
                          </div>
                          <button onClick={downloadIR} className="text-[9px] mono text-indigo-500 hover:text-indigo-300 transition-colors">
                            ↓ YAML
                          </button>
                        </div>
                        <div className="p-4 overflow-x-auto">
                          <pre className="text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap font-mono">{promptIR}</pre>
                        </div>
                      </motion.div>
                    )}

                    {resultTab === 'workflow' && (
                      <motion.div key="workflow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
                    <div className="text-[9px] mono font-bold text-cyan-400 uppercase tracking-widest mb-3">Cognitive DNA</div>
                    <div className="space-y-2.5">
                      {[
                        { k: 'OBJETIVO',    v: sel.objetivo?.label,    icon: sel.objetivo?.emoji },
                        { k: 'FINALIDAD',   v: sel.finalidad?.label,   icon: sel.finalidad?.emoji },
                        { k: 'ÁREA',        v: sel.area?.label,        icon: sel.area?.emoji },
                        { k: 'COGNITIVO',   v: sel.cognitivo?.label,   icon: sel.cognitivo?.emoji },
                        { k: 'AUDIENCIA',   v: sel.audiencia?.label,   icon: sel.audiencia?.emoji },
                        { k: 'RIESGO',      v: sel.riesgo?.label,      icon: sel.riesgo?.emoji },
                        { k: 'PROCESAL',    v: sel.procesal?.label,    icon: sel.procesal?.emoji },
                        { k: 'MODELO',      v: sel.modelo?.label },
                      ].map(r => r.v && (
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
                    <div className="text-[9px] mono font-bold text-emerald-400 uppercase tracking-widest mb-3">Capas activas</div>
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
                    <div className="text-[9px] mono font-bold text-indigo-400 uppercase tracking-widest mb-3">Exportar para plataforma</div>
                    <div className="space-y-2">
                      {[
                        { label: 'System Prompt',    fn: downloadSys,    tip: 'Para cualquier IA' },
                        { label: 'GPT Instructions', fn: downloadGPT,    tip: 'ChatGPT custom GPT' },
                        { label: 'Claude Project',   fn: downloadClaude, tip: 'Claude Projects' },
                      ].map(ex => (
                        <button key={ex.label} onClick={ex.fn}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] transition-all group"
                        >
                          <span className="text-[10px] text-zinc-400 group-hover:text-zinc-200 transition-colors font-medium">{ex.label}</span>
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

                  <button onClick={reset}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] text-zinc-500 hover:text-zinc-300 text-xs font-medium transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />Construir nuevo prompt
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Right: DNA panel */}
        {!['generating', 'resultado'].includes(step) && (
          <div className="hidden lg:flex lg:w-72 xl:w-80 shrink-0 flex-col overflow-hidden">
            <DNAPanel sel={sel} promptPreview={promptPreview} />
          </div>
        )}
      </div>

      {!['generating', 'resultado'].includes(step) && (
        <div className="pointer-events-none fixed bottom-0 left-0 right-0 h-32 z-10"
          style={{ background: 'linear-gradient(to top, rgba(4,6,12,0.9), transparent)' }}
        />
      )}
    </div>
  );
}
