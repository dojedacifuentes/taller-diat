'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, Zap, Circle, Clock,
  Wrench, Target, BookOpen, FileText, Lock, Download,
} from 'lucide-react';
import { modules } from '@/data/modules';
import { equipoEjecutor } from '@/data/team';
import type { Module } from '@/lib/types';

const moduleColors = [
  {
    border: 'border-cyan-500/25',
    numBg: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400',
    accent: 'bg-cyan-500',
    accentText: 'text-cyan-400',
    timelineNode: 'border-cyan-500/50 bg-cyan-500/15',
    timelineDot: 'bg-cyan-500',
  },
  {
    border: 'border-indigo-500/25',
    numBg: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400',
    accent: 'bg-indigo-500',
    accentText: 'text-indigo-400',
    timelineNode: 'border-indigo-500/50 bg-indigo-500/15',
    timelineDot: 'bg-indigo-500',
  },
  {
    border: 'border-purple-500/25',
    numBg: 'border-purple-500/40 bg-purple-500/10 text-purple-400',
    accent: 'bg-purple-500',
    accentText: 'text-purple-400',
    timelineNode: 'border-purple-500/50 bg-purple-500/15',
    timelineDot: 'bg-purple-500',
  },
];

const timelineTypeColors: Record<string, string> = {
  theory: 'text-blue-400 border-blue-500/30 bg-blue-500/8',
  demo: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/8',
  practice: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/8',
  workshop: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/8',
  analysis: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/8',
  closing: 'text-zinc-400 border-zinc-500/30 bg-zinc-500/8',
};

const timelineTypeLabels: Record<string, string> = {
  theory: 'Teoría',
  demo: 'Demo',
  practice: 'Práctica',
  workshop: 'Taller',
  analysis: 'Análisis',
  closing: 'Cierre',
};

function TimelineBlock({ block, dotColor, isLast }: {
  block: Module['timeline'][0];
  dotColor: string;
  isLast: boolean;
}) {
  const typeColor = timelineTypeColors[block.type] ?? 'text-zinc-400 border-zinc-500/30 bg-zinc-500/8';
  const typeLabel = timelineTypeLabels[block.type] ?? block.type;
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center shrink-0">
        <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${dotColor}`} />
        {!isLast && <div className="w-px flex-1 bg-white/[0.06] mt-1 mb-0" />}
      </div>
      <div className={`pb-4 ${isLast ? '' : ''}`}>
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-[10px] mono text-zinc-600">{block.time}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${typeColor}`}>
            {typeLabel}
          </span>
        </div>
        <div className="text-xs font-semibold text-zinc-300">{block.topic}</div>
        <div className="text-[11px] text-zinc-600 mt-0.5 leading-relaxed">{block.description}</div>
      </div>
    </div>
  );
}

function ModuleCard({ mod, index }: { mod: Module; index: number }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'overview' | 'timeline'>('overview');
  const c = moduleColors[index];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className={`rounded-2xl border ${c.border} overflow-hidden`}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="px-5 sm:px-7 py-5 flex items-start gap-5">
          {/* Module number */}
          <div className="shrink-0 flex flex-col items-center gap-1.5 mt-0.5">
            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-black text-xl mono ${c.numBg}`}>
              {mod.id}
            </div>
            <span className={`text-[9px] mono font-bold tracking-widest ${c.accentText}`}>
              {mod.displayDate}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] mono font-bold text-yellow-500 border border-yellow-500/20 bg-yellow-500/8 px-2 py-0.5 rounded-md">
                PRÓXIMAMENTE
              </span>
              <span className="text-[10px] text-zinc-600 mono px-2 py-0.5 rounded border border-zinc-700/40 bg-zinc-800/20">
                {mod.duration}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold leading-tight text-zinc-300">
              {mod.title}
            </h3>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{mod.subtitle}</p>

            {/* Tools */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {mod.tools.map(t => (
                <span key={t} className="text-[11px] px-2 py-0.5 rounded-md border border-zinc-700/40 text-zinc-600 bg-zinc-800/20 font-medium">
                  <Lock className="w-2.5 h-2.5 inline mr-1 opacity-50" />{t}
                </span>
              ))}
            </div>
          </div>

          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 mt-1">
            <ChevronDown className="w-5 h-5 text-zinc-500" />
          </motion.div>
        </div>

        {/* Progress bar */}
        <div className="mx-5 sm:mx-7 mb-1 h-0.5 rounded-full bg-white/[0.05]">
          <div className="h-full w-0 rounded-full bg-zinc-700" />
        </div>
        <div className="px-5 sm:px-7 pb-4 flex justify-between text-[10px] text-zinc-700 mono">
          <span>PROGRESO</span>
          <span>0%</span>
        </div>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden border-t border-white/[0.05]"
          >
            {/* Tab switcher */}
            <div className="flex gap-0 border-b border-white/[0.05]">
              {(['overview', 'timeline'] as const).map(t => (
                <button
                  key={t}
                  onClick={(e) => { e.stopPropagation(); setTab(t); }}
                  className={`px-5 py-3 text-xs font-semibold transition-colors capitalize ${
                    tab === t
                      ? `${c.accentText} border-b-2 border-current`
                      : 'text-zinc-600 hover:text-zinc-400 border-b-2 border-transparent'
                  }`}
                >
                  {t === 'overview' ? 'Contenido' : 'Timeline 2h'}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {tab === 'overview' ? (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-5 sm:px-7 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {/* Objetivos */}
                  <div>
                    <SLabel icon={<Target className="w-3.5 h-3.5" />} text="Objetivos" />
                    <ul className="space-y-2">
                      {mod.objectives.map((o, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-zinc-400 leading-relaxed">
                          <Circle className="w-3.5 h-3.5 text-zinc-700 mt-0.5 shrink-0" />
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Contenidos */}
                  <div>
                    <SLabel icon={<BookOpen className="w-3.5 h-3.5" />} text="Contenidos" />
                    <ul className="space-y-1.5">
                      {mod.contents.map((ct, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-zinc-400 leading-relaxed">
                          <span className="w-1 h-1 rounded-full mt-1.5 shrink-0 bg-zinc-600" />
                          {ct}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right */}
                  <div className="space-y-4">
                    <div>
                      <SLabel icon={<Wrench className="w-3.5 h-3.5" />} text="Herramientas" />
                      <div className="flex flex-wrap gap-1.5">
                        {mod.tools.map(t => (
                          <span key={t} className="px-2.5 py-1 rounded-lg border border-zinc-700/40 bg-zinc-800/20 text-xs text-zinc-500 font-medium">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <SLabel icon={<Zap className="w-3.5 h-3.5" />} text="Actividad central" />
                      <p className="text-xs text-zinc-400 leading-relaxed">{mod.activity}</p>
                    </div>
                    <div>
                      <SLabel icon={<FileText className="w-3.5 h-3.5" />} text="Entregable" />
                      <p className="text-xs text-zinc-400 leading-relaxed">{mod.deliverable}</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-5 sm:px-7 py-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className={`w-4 h-4 ${c.accentText}`} />
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Sesión de 2 horas — {mod.displayDate}
                    </span>
                  </div>
                  <div className="max-w-xl">
                    {mod.timeline.map((block, i) => (
                      <TimelineBlock
                        key={i}
                        block={block}
                        dotColor={c.timelineDot}
                        isLast={i === mod.timeline.length - 1}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SLabel({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2.5">
      <span className="text-cyan-500">{icon}</span> {text}
    </div>
  );
}

function downloadProgramPDF() {
  // Dynamic import of the shared PDF generator
  const modColors = ['#06b6d4','#818cf8','#c084fc'];
  const modBg = ['rgba(6,182,212,.08)','rgba(129,140,248,.08)','rgba(192,132,252,.08)'];
  const modBorder = ['rgba(6,182,212,.2)','rgba(129,140,248,.2)','rgba(192,132,252,.2)'];
  const date = new Date().toLocaleDateString('es-CL');
  const win = window.open('','_blank');
  if(!win) return;

  const modulesHTML = modules.map((mod,i) => `
    <div class="module" style="border-color:${modBorder[i]};background:${modBg[i]}">
      <div class="mod-header" style="border-bottom-color:${modBorder[i]}">
        <div class="mod-id" style="border-color:${modColors[i]}33;background:${modColors[i]}14;color:${modColors[i]}">${mod.id}</div>
        <div>
          <div class="mod-date" style="color:${modColors[i]}">${mod.displayDate} — ${mod.duration}</div>
          <div class="mod-title">${mod.title}</div>
          <div class="mod-sub">${mod.subtitle}</div>
        </div>
      </div>
      <div class="mod-grid">
        <div><div class="section-label">Objetivos</div>${mod.objectives.map(o=>`<div class="item">◦ ${o}</div>`).join('')}</div>
        <div><div class="section-label">Contenidos</div>${mod.contents.map(c=>`<div class="item">◦ ${c}</div>`).join('')}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;padding-top:10px;border-top:1px solid ${modBorder[i]}">
        <div><span class="footer-label">Actividad: </span><span class="footer-val">${mod.activity}</span></div>
        <div><span class="footer-label">Entregable: </span><span class="footer-val">${mod.deliverable}</span></div>
        <div><span class="footer-label">Herramientas: </span><span class="footer-val" style="color:${modColors[i]}">${mod.tools.join(' · ')}</span></div>
      </div>
    </div>
  `).join('');

  const equipoHTML = equipoEjecutor.map(m=>`
    <div class="member">
      <div class="member-init">${m.initials}</div>
      <div>
        <div class="member-name">${m.name}</div>
        <div class="member-calidad">${m.calidad}</div>
        ${m.id==='ee-01'?'<div class="member-rol">Subdirector de los Talleres</div>':''}
      </div>
    </div>
  `).join('');

  win.document.write(`<!DOCTYPE html><html lang="es"><head>
    <meta charset="utf-8">
    <title>Programa DIAT 2026 — Módulos</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@300;400;600;700;800&display=swap');
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:'Space Grotesk',sans-serif;background:#070b12;color:#cbd5e1;padding:44px 52px;max-width:860px;margin:0 auto;-webkit-print-color-adjust:exact;print-color-adjust:exact}
      body::before{content:'';position:fixed;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.04) 3px,rgba(0,0,0,.04) 6px);pointer-events:none;z-index:0}
      .wrap{position:relative;z-index:1}
      .header{border-bottom:1px solid rgba(6,182,212,.2);padding-bottom:18px;margin-bottom:24px}
      .logo-row{display:flex;align-items:center;gap:8px;margin-bottom:8px}
      .badge{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:10px;letter-spacing:.12em;padding:3px 10px;border-radius:5px;border:1px solid rgba(6,182,212,.4);background:rgba(6,182,212,.1);color:#67e8f9}
      .badge2{font-family:'JetBrains Mono',monospace;font-size:9.5px;border:1px solid rgba(129,140,248,.3);background:rgba(129,140,248,.08);color:#a5b4fc;padding:3px 10px;border-radius:5px}
      .title{font-size:24px;font-weight:800;color:#f8fafc;letter-spacing:-.02em}
      .sub{font-size:11px;color:#475569;font-family:'JetBrains Mono',monospace;margin-top:4px}
      .tagline{font-size:11px;color:#94a3b8;line-height:1.6;border-left:2px solid rgba(6,182,212,.35);padding-left:12px;margin-top:12px;max-width:560px}
      .meta{text-align:right;font-size:9.5px;font-family:'JetBrains Mono',monospace;color:#334155;line-height:1.9}
      .meta .val{color:#475569}
      .header-row{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}
      .dates-strip{display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap}
      .dc{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;padding:5px 14px;border-radius:20px}
      .dc1{border:1px solid rgba(6,182,212,.3);background:rgba(6,182,212,.08);color:#67e8f9}
      .dc2{border:1px solid rgba(129,140,248,.3);background:rgba(129,140,248,.08);color:#a5b4fc}
      .dc3{border:1px solid rgba(192,132,252,.3);background:rgba(192,132,252,.08);color:#d8b4fe}
      .dc4{border:1px solid rgba(234,179,8,.2);background:rgba(234,179,8,.05);color:#ca8a04;font-weight:400}
      .section-title{font-size:9px;font-family:'JetBrains Mono',monospace;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#334155;margin-bottom:14px;display:flex;align-items:center;gap:8px}
      .section-title::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.05)}
      .module{border:1px solid;border-radius:12px;padding:18px 22px;margin-bottom:14px}
      .mod-header{display:flex;align-items:flex-start;gap:14px;padding-bottom:12px;margin-bottom:12px;border-bottom:1px solid}
      .mod-id{font-family:'JetBrains Mono',monospace;font-weight:900;font-size:20px;min-width:44px;height:44px;border-radius:10px;border:1px solid;display:flex;align-items:center;justify-content:center;flex-shrink:0}
      .mod-date{font-size:9.5px;font-family:'JetBrains Mono',monospace;font-weight:600;margin-bottom:3px}
      .mod-title{font-size:14px;font-weight:800;color:#f1f5f9;line-height:1.2}
      .mod-sub{font-size:10.5px;color:#64748b;margin-top:3px}
      .mod-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:12px}
      .section-label{font-size:8.5px;font-family:'JetBrains Mono',monospace;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#334155;margin-bottom:8px}
      .item{font-size:10px;color:#94a3b8;margin-bottom:4px;line-height:1.55;padding-left:6px}
      .footer-label{font-size:8.5px;font-family:'JetBrains Mono',monospace;font-weight:700;color:#334155;letter-spacing:.1em;text-transform:uppercase;margin-right:6px}
      .footer-val{font-size:9.5px;color:#94a3b8}
      .aut-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:20px}
      .aut{padding:12px 14px;border-radius:10px;border:1px solid rgba(6,182,212,.15);background:rgba(6,182,212,.04)}
      .aut-name{font-size:11px;font-weight:700;color:#e2e8f0}
      .aut-title{font-size:9.5px;color:#67e8f9;font-family:'JetBrains Mono',monospace;margin-top:3px}
      .aut-sub{font-size:9px;color:#475569;margin-top:2px}
      .eq-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
      .member{display:flex;align-items:flex-start;gap:9px;padding:10px 12px;border-radius:9px;border:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.02)}
      .member-init{width:32px;height:32px;border-radius:7px;border:1px solid rgba(6,182,212,.3);background:rgba(6,182,212,.1);display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:10px;color:#67e8f9;flex-shrink:0}
      .member-name{font-size:10.5px;font-weight:700;color:#e2e8f0;line-height:1.3}
      .member-calidad{font-size:9px;color:#64748b;margin-top:2px}
      .member-rol{font-size:8.5px;color:#67e8f9;font-family:'JetBrains Mono',monospace;font-weight:600;margin-top:2px}
      .doc-footer{margin-top:24px;padding-top:14px;border-top:1px solid rgba(255,255,255,.05);display:flex;justify-content:space-between;align-items:center;font-size:9px;font-family:'JetBrains Mono',monospace;color:#1e293b}
      .glow-badge{display:inline-flex;align-items:center;gap:4px;background:rgba(6,182,212,.08);color:#0891b2;border:1px solid rgba(6,182,212,.2);border-radius:4px;padding:2px 8px;font-size:8.5px;font-weight:700}
      @media print{body{padding:28px;background:#070b12}.module{page-break-inside:avoid}}
    </style>
  </head><body><div class="wrap">
    <div class="header">
      <div class="header-row">
        <div>
          <div class="logo-row"><span class="badge">DIAT</span><span class="badge2">FD · PUCV</span></div>
          <div class="title">Programa DIAT 2026</div>
          <div class="sub">Derecho · Inteligencia Artificial · Tecnología</div>
          <div class="tagline">Programa de formación aplicada en inteligencia artificial jurídica, prompting avanzado y nuevas competencias digitales para el ejercicio legal. Facultad de Derecho · PUCV.</div>
        </div>
        <div class="meta"><div>Emitido: <span class="val">${date}</span></div><div>Estado: <span class="val">Tentativo</span></div><div style="margin-top:5px;color:#1e293b">programadiat@pucv.cl</div></div>
      </div>
    </div>
    <div class="dates-strip">
      <span class="dc dc1">● M1 · 8 Sep 2026</span>
      <span class="dc dc2">● M2 · 15 Sep 2026</span>
      <span class="dc dc3">● M3 · 22 Sep 2026</span>
      <span class="dc dc4">⚠ Fechas tentativas</span>
    </div>
    <div class="section-title">Los 3 Módulos</div>
    ${modulesHTML}
    <div class="section-title" style="margin-top:20px">Dirección Institucional</div>
    <div class="aut-grid">
      <div class="aut"><div class="aut-name">Eduardo Aldunate Lizana</div><div class="aut-title">Director · Escuela de Derecho PUCV</div><div class="aut-sub">Autoridad institucional</div></div>
      <div class="aut"><div class="aut-name">Dr. Adolfo Silva Walbaum</div><div class="aut-title">Director · Programa DIAT</div><div class="aut-sub">Director del Taller</div></div>
      <div class="aut"><div class="aut-name">Diego Ojeda Cifuentes</div><div class="aut-title">Subdirector de los Talleres</div><div class="aut-sub">Coordinador Operativo</div></div>
    </div>
    <div class="section-title">Equipo Ejecutor — Integrantes Programa DIAT</div>
    <div class="eq-grid">${equipoHTML}</div>
    <div class="doc-footer">
      <div>Programa DIAT · Facultad de Derecho PUCV · 2026</div>
      <div><span class="glow-badge">✦ Construido con IA</span></div>
    </div>
  </div></body></html>`);
  win.document.close();
  setTimeout(()=>win.print(),400);
}

export default function ModulosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
          <span className="mono text-[10px] text-zinc-600 tracking-widest uppercase">Programa DIAT · Facultad de Derecho PUCV · Fechas tentativas · Sep 2026</span>
          <button
            onClick={downloadProgramPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700/50 bg-zinc-800/20 hover:border-cyan-500/30 hover:bg-cyan-500/8 hover:text-cyan-400 text-zinc-500 text-xs font-medium transition-all"
          >
            <Download className="w-3 h-3" />
            Descargar PDF
          </button>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">LOS 3 MÓDULOS</h1>
        <p className="text-sm text-zinc-500 mt-1">
          6 horas de formación divididas en tres módulos progresivos. Cada uno produce entregables reales.
          Expande para ver contenido o el timeline de la sesión de 2 horas.{' '}
          <span className="text-zinc-600 italic">Fechas tentativas · Septiembre 2026.</span>
        </p>
      </motion.div>

      {/* Date pills */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        {modules.map((mod, i) => {
          const colors = [moduleColors[0].accentText, moduleColors[1].accentText, moduleColors[2].accentText];
          return (
            <span
              key={mod.id}
              className={`text-xs mono font-bold px-3 py-1.5 rounded-full border ${
                i === 0 ? 'border-cyan-500/25 bg-cyan-500/8' :
                i === 1 ? 'border-indigo-500/25 bg-indigo-500/8' :
                'border-purple-500/25 bg-purple-500/8'
              } ${colors[i]}`}
            >
              M{mod.id} — {mod.displayDate}
            </span>
          );
        })}
      </motion.div>

      {/* Modules */}
      <div className="space-y-5">
        {modules.map((mod, i) => (
          <ModuleCard key={mod.id} mod={mod} index={i} />
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center py-4 border-t border-white/[0.05]"
      >
        <p className="text-xs text-zinc-600">
          Los módulos son presenciales en la Facultad de Derecho PUCV, Valparaíso.{' '}
          <span className="text-zinc-500">Certificación institucional al completar los 3 módulos.</span>
          {' '}<span className="text-zinc-700 italic">Fechas tentativas · Septiembre 2026.</span>
        </p>
      </motion.div>
    </div>
  );
}
