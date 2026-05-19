'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, ArrowRight, Check, AlertTriangle, Zap, Shield, Brain } from 'lucide-react';

const flows = [
  {
    id: 'basic',
    title: 'Flujo Básico de Investigación',
    subtitle: 'Para cualquier tema jurídico desde cero',
    color: 'border-cyan-500/25 bg-cyan-500/5',
    accent: 'text-cyan-400',
    steps: [
      { tool: 'Perplexity', action: 'Busca legislación y jurisprudencia actual con fuentes citadas', emoji: '🔍' },
      { tool: 'NotebookLM', action: 'Sube los documentos encontrados, crea un corpus y pregúntale', emoji: '📓' },
      { tool: 'Claude', action: 'Redacta el documento final con la información verificada', emoji: '🤖' },
    ],
    time: '30-45 min',
    replaces: '4-6 horas de investigación manual',
  },
  {
    id: 'litigios',
    title: 'Flujo Avanzado para Litigios',
    subtitle: 'Preparación completa de audiencias y recursos',
    color: 'border-indigo-500/25 bg-indigo-500/5',
    accent: 'text-indigo-400',
    steps: [
      { tool: 'Gemini', action: 'Sube el expediente PDF directamente y extrae los hechos clave', emoji: '💎' },
      { tool: 'Claude', action: 'Analiza la estrategia legal y construye el argumentario', emoji: '🤖' },
      { tool: 'ChatGPT', action: 'Genera el escrito en el formato requerido por el tribunal', emoji: '💬' },
      { tool: 'Tú', action: 'Revisas, validas y firmas. El éxito es tuyo.', emoji: '⚖️' },
    ],
    time: '60-90 min',
    replaces: 'Un día completo de trabajo',
  },
  {
    id: 'contratos',
    title: 'Flujo para Contratos',
    subtitle: 'Redacción y revisión de documentos contractuales',
    color: 'border-purple-500/25 bg-purple-500/5',
    accent: 'text-purple-400',
    steps: [
      { tool: 'Claude', action: 'Redacta el contrato con todas las cláusulas esenciales', emoji: '🤖' },
      { tool: 'ChatGPT', action: 'Identifica riesgos y cláusulas que podrían faltar', emoji: '💬' },
      { tool: 'Claude', action: 'Integra las observaciones y genera la versión final pulida', emoji: '🤖' },
    ],
    time: '20-40 min',
    replaces: '2-3 horas de redacción',
  },
];

const cybersecChecklist = [
  { item: 'Anonimizar RUT, nombres y datos del cliente antes de pegar en la IA', critical: true },
  { item: 'No usar IAs públicas para estrategia de casos de alto perfil', critical: true },
  { item: 'Verificar términos de uso de cada plataforma (retención de datos)', critical: false },
  { item: 'Usar Claude Projects con system prompt de confidencialidad', critical: false },
  { item: 'Guardar los prompts efectivos en un archivo local, no en el chat', critical: false },
  { item: 'Borrar historial de chats con información sensible cuando sea posible', critical: false },
];

const antiHalluChecklist = [
  { item: '"Si no tienes certeza, escribe [VERIFICAR]" — siempre en tu prompt', critical: true },
  { item: 'Nunca uses jurisprudencia de la IA sin buscarla en pjud.cl', critical: true },
  { item: 'Siempre pide que cite el número exacto del artículo y la ley', critical: true },
  { item: 'Usa Perplexity (no ChatGPT) cuando necesites datos factuales actuales', critical: false },
  { item: 'Itera: pide a la IA que revise su propia respuesta en busca de errores', critical: false },
  { item: 'Para doctrina: usa NotebookLM con tus libros subidos, no la memoria del LLM', critical: false },
];

const quickRef = [
  { tool: 'Claude', best: 'Documentos largos, análisis profundo, razonamiento complejo', avoid: 'Noticias de hoy, datos en tiempo real', emoji: '🤖' },
  { tool: 'ChatGPT', best: 'Borradores rápidos, brainstorming, plugins de terceros', avoid: 'Documentos de 200+ páginas (contexto limitado)', emoji: '💬' },
  { tool: 'Gemini', best: 'PDFs sin copiar, integración con Drive/Docs, presentaciones', avoid: 'Razonamiento jurídico complejo muy técnico', emoji: '💎' },
  { tool: 'NotebookLM', best: 'Investigar dentro de tus propios documentos subidos', avoid: 'Redacción creativa, preguntas fuera de tus docs', emoji: '📓' },
  { tool: 'Perplexity', best: 'Búsqueda con fuentes verificables, datos actuales', avoid: 'Redacción de documentos, análisis profundo', emoji: '🔍' },
];

export default function ToolkitPage() {
  const [activeFlow, setActiveFlow] = useState('basic');
  const [checkedCyber, setCheckedCyber] = useState<Set<number>>(new Set());
  const [checkedHallu, setCheckedHallu] = useState<Set<number>>(new Set());

  const flow = flows.find(f => f.id === activeFlow)!;

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <Wrench className="w-5 h-5 text-emerald-400" />
          </span>
          Toolkit Multi-IA
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Flujos reales, checklists de seguridad y referencia rápida. Lacónico. Útil. Sin rodeos.
        </p>
      </div>

      {/* Flujos */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" /> Flujos Multi-IA
        </h2>

        {/* Flow selector */}
        <div className="flex flex-wrap gap-2">
          {flows.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFlow(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                activeFlow === f.id
                  ? 'border-cyan-500/50 bg-cyan-500/15 text-cyan-400'
                  : 'border-white/[0.07] text-zinc-500 hover:text-zinc-300 hover:border-white/15'
              }`}
            >
              {f.title.split(' ')[1] || f.title}
            </button>
          ))}
        </div>

        <motion.div
          key={activeFlow}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border p-5 sm:p-6 ${flow.color}`}
        >
          <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
            <div>
              <h3 className={`font-bold text-base ${flow.accent}`}>{flow.title}</h3>
              <p className="text-xs text-zinc-500 mt-0.5">{flow.subtitle}</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-xs text-zinc-400 mono font-medium">⏱ {flow.time}</span>
              <span className="text-[10px] text-zinc-600">Reemplaza: {flow.replaces}</span>
            </div>
          </div>

          <div className="space-y-3">
            {flow.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-lg">
                    {step.emoji}
                  </div>
                  {i < flow.steps.length - 1 && (
                    <div className="w-px h-4 bg-white/[0.08] mt-1" />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <span className={`text-xs font-bold ${flow.accent}`}>{step.tool}</span>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{step.action}</p>
                </div>
                {i < flow.steps.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-700 mt-2.5 shrink-0 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Checklists */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Ciberseguridad */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
            <Shield className="w-4 h-4 text-yellow-400" /> Ciberseguridad Jurídica
          </h2>
          <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.09_0.017_250/0.5)] divide-y divide-white/[0.04]">
            {cybersecChecklist.map((item, i) => {
              const checked = checkedCyber.has(i);
              return (
                <button
                  key={i}
                  onClick={() => setCheckedCyber(prev => {
                    const n = new Set(prev);
                    checked ? n.delete(i) : n.add(i);
                    return n;
                  })}
                  className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className={`w-4 h-4 rounded border mt-0.5 shrink-0 flex items-center justify-center transition-all ${
                    checked ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600 bg-transparent'
                  }`}>
                    {checked && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-xs leading-relaxed ${checked ? 'text-zinc-600 line-through' : 'text-zinc-400'}`}>
                      {item.item}
                    </span>
                    {item.critical && !checked && (
                      <span className="ml-2 text-[10px] text-red-400 font-semibold">CRÍTICO</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="text-xs text-zinc-600 text-right mono">
            {checkedCyber.size}/{cybersecChecklist.length} completados
          </div>
        </section>

        {/* Anti-alucinaciones */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
            <Brain className="w-4 h-4 text-indigo-400" /> Anti-Alucinaciones
          </h2>
          <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.09_0.017_250/0.5)] divide-y divide-white/[0.04]">
            {antiHalluChecklist.map((item, i) => {
              const checked = checkedHallu.has(i);
              return (
                <button
                  key={i}
                  onClick={() => setCheckedHallu(prev => {
                    const n = new Set(prev);
                    checked ? n.delete(i) : n.add(i);
                    return n;
                  })}
                  className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className={`w-4 h-4 rounded border mt-0.5 shrink-0 flex items-center justify-center transition-all ${
                    checked ? 'bg-indigo-500 border-indigo-500' : 'border-zinc-600 bg-transparent'
                  }`}>
                    {checked && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-xs leading-relaxed ${checked ? 'text-zinc-600 line-through' : 'text-zinc-400'}`}>
                      {item.item}
                    </span>
                    {item.critical && !checked && (
                      <span className="ml-2 text-[10px] text-red-400 font-semibold">CRÍTICO</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="text-xs text-zinc-600 text-right mono">
            {checkedHallu.size}/{antiHalluChecklist.length} completados
          </div>
        </section>
      </div>

      {/* Quick reference */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
          <Zap className="w-4 h-4 text-purple-400" /> Referencia Rápida — ¿Cuándo uso cada IA?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickRef.map((ref, i) => (
            <motion.div
              key={ref.tool}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-xl border border-white/[0.07] bg-[oklch(0.09_0.017_250/0.5)] p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{ref.emoji}</span>
                <span className="font-bold text-sm text-white">{ref.tool}</span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider mb-1">✓ Úsalo para</div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{ref.best}</p>
                </div>
                <div>
                  <div className="text-[10px] text-red-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-2.5 h-2.5" /> Evita para
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">{ref.avoid}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Golden rule */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/6 to-indigo-500/4 p-6 text-center"
      >
        <div className="text-2xl mb-2">⚖️</div>
        <h3 className="font-bold text-white mb-2">La Regla de Oro</h3>
        <p className="text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
          La IA es tu <span className="text-cyan-400 font-semibold">co-redactor</span>, no tu abogado.
          TÚ eres el responsable profesional del output final.
          Usa la IA para ir <span className="text-cyan-400 font-semibold">10x más rápido</span>
          — no para eliminar tu criterio jurídico.
        </p>
        <p className="text-xs text-zinc-600 mt-3 italic">"El derecho exige exactitud. La IA amplifica tu capacidad de alcanzarla."</p>
      </motion.div>
    </div>
  );
}
