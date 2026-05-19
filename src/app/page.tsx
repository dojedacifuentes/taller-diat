'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight, Zap, Layers, Rocket, Wrench, ChevronDown,
  Shield, Brain, Bot, FileText, CheckCircle2, Circle,
  Mail, Building2, GraduationCap, Scale, Cpu, Globe, Download,
} from 'lucide-react';
import { InstitutionalLogoRow } from '@/components/common/InstitutionalLogos';
import { equipoEjecutor } from '@/data/team';

const MAILTO_RESERVA =
  'mailto:programadiat@pucv.cl' +
  '?subject=Inter%C3%A9s%20en%20taller%20de%20IA%20jur%C3%ADdica%20y%20prompting%20DIAT' +
  '&body=Hola%20Programa%20DIAT%3A%0A%0AQuisiera%20reservar%20un%20cupo%20y%20recibir%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20taller%20de%20IA%20jur%C3%ADdica%20y%20prompting%20avanzado%20que%20se%20realizar%C3%A1%20durante%20septiembre.%0A%0ANombre%3A%0ACarrera%20%2F%20profesi%C3%B3n%3A%0ACorreo%3A%0ATel%C3%A9fono%20opcional%3A%0AComentarios%3A%0A%0AMuchas%20gracias.';
import { useCountdown } from '@/hooks/useCountdown';
import { modules } from '@/data/modules';

const MODULE1_DATE = '2026-09-08T09:00:00';

const reasons = [
  {
    emoji: '🗣️',
    title: 'Hablarás el idioma de las máquinas',
    desc: 'Prompting estructurado, técnicas avanzadas, control de outputs. La IA hará lo que tú quieras.',
    color: 'border-cyan-500/25 bg-cyan-500/5',
    accent: 'text-cyan-400',
  },
  {
    emoji: '⚡',
    title: 'Producirás documentos en minutos',
    desc: 'Contratos, demandas, dictámenes, memorandos. Lo que tardaba horas, en minutos con calidad profesional.',
    color: 'border-indigo-500/25 bg-indigo-500/5',
    accent: 'text-indigo-400',
  },
  {
    emoji: '🚀',
    title: 'Estarás donde va el derecho',
    desc: 'Harvey AI, Clio, Thomson Reuters AI. El ecosistema legaltech explota. Tú llegas preparado.',
    color: 'border-purple-500/25 bg-purple-500/5',
    accent: 'text-purple-400',
  },
];

const spoilers = [
  {
    mod: 'M1',
    color: 'border-cyan-500/20 bg-cyan-500/5',
    accent: 'text-cyan-400',
    items: [
      'Tu biblioteca de prompts jurídicos fundamentales',
      'Checklist de verificación post-IA que usarás siempre',
      '5 prompts construidos en vivo con casos chilenos reales',
    ],
  },
  {
    mod: 'M2',
    color: 'border-indigo-500/20 bg-indigo-500/5',
    accent: 'text-indigo-400',
    items: [
      'Expediente jurídico completo generado con IA supervisada',
      'Flujo Perplexity → NotebookLM → Claude documentado',
      'Dominio de Claude Projects para análisis de contratos',
    ],
  },
  {
    mod: 'M3',
    color: 'border-purple-500/20 bg-purple-500/5',
    accent: 'text-purple-400',
    items: [
      'Tu propio agente jurídico con system prompt de producción',
      'Prototipo legaltech deployado en Vercel',
      'Certificación institucional PUCV · Facultad de Derecho',
    ],
  },
];

const features = [
  { icon: Layers, href: '/modulos', label: 'Ver los 3 módulos', desc: 'La ruta completa de aprendizaje' },
  { icon: Zap, href: '/prompt-lab', label: 'LexPrompt Architect', desc: 'Constructor 7 pasos + PDF' },
  { icon: Rocket, href: '/flashcards', label: 'Aprende con flashcards', desc: '30 cartas de IA jurídica' },
  { icon: Wrench, href: '/toolkit', label: 'Toolkit multi-IA', desc: 'Flujos y guías rápidas' },
];

const promptLabPreviewSteps = [
  { num: '01', label: 'Perfil', desc: 'Estudiante, abogado, académico…', icon: '🎓' },
  { num: '02', label: 'Finalidad', desc: 'Redactar, analizar, litigar…', icon: '📝' },
  { num: '03', label: 'Área', desc: 'Civil, penal, laboral, tech…', icon: '⚖️' },
  { num: '04', label: 'Profundidad', desc: 'Rápido → Litigación avanzada', icon: '📊' },
  { num: '05', label: 'IA objetivo', desc: 'Claude, ChatGPT, Gemini…', icon: '🤖' },
  { num: '06', label: 'Formato', desc: 'Informe, checklist, tabla…', icon: '🗂️' },
  { num: '07', label: 'Protecciones', desc: 'Anti-alucin. · Ciberseg. · Fuentes', icon: '🛡️' },
];

function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-cyan-500/30 bg-cyan-500/8 flex items-center justify-center glow-cyan">
          <span className="text-2xl sm:text-3xl font-bold text-cyan-200 mono tabular-nums">
            {String(value).padStart(2, '0')}
          </span>
        </div>
        <div className="absolute inset-0 rounded-2xl border border-cyan-400/10 animate-pulse" />
      </div>
      <span className="text-[10px] text-zinc-500 uppercase tracking-widest mono">{label}</span>
    </div>
  );
}

function SpoilerCard({ mod, color, accent, items }: typeof spoilers[0]) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-xl border p-4 ${color}`}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className={`text-xs font-black mono ${accent}`}>{mod}</span>
          <span className="text-xs text-zinc-400 font-medium">
            {open ? 'Ocultar' : '¿Qué construirás?'}
          </span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-zinc-500" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-2">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </div>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function handleProgramPDF(mods: typeof modules, equipo: typeof equipoEjecutor) {
  const win = window.open('', '_blank');
  if (!win) return;
  const date = new Date().toLocaleDateString('es-CL');

  const modColors = ['#06b6d4', '#818cf8', '#c084fc'];
  const modBg = ['rgba(6,182,212,.08)', 'rgba(129,140,248,.08)', 'rgba(192,132,252,.08)'];
  const modBorder = ['rgba(6,182,212,.2)', 'rgba(129,140,248,.2)', 'rgba(192,132,252,.2)'];

  const modulesHTML = mods.map((mod, i) => `
    <div class="module" style="border-color:${modBorder[i]};background:${modBg[i]}">
      <div class="mod-header" style="border-bottom-color:${modBorder[i]}">
        <div class="mod-id" style="border-color:${modColors[i]}33;background:${modColors[i]}14;color:${modColors[i]}">${mod.id}</div>
        <div>
          <div class="mod-date" style="color:${modColors[i]}">${mod.displayDate} — Módulo ${mod.id} · ${mod.duration}</div>
          <div class="mod-title">${mod.title}</div>
          <div class="mod-sub">${mod.subtitle}</div>
        </div>
      </div>
      <div class="mod-grid">
        <div>
          <div class="section-label">Objetivos</div>
          ${mod.objectives.map(o => `<div class="item">◦ ${o}</div>`).join('')}
        </div>
        <div>
          <div class="section-label">Contenidos</div>
          ${mod.contents.map(c => `<div class="item">◦ ${c}</div>`).join('')}
        </div>
      </div>
      <div class="mod-footer">
        <div><span class="footer-label">Actividad</span><span class="footer-val">${mod.activity}</span></div>
        <div><span class="footer-label">Entregable</span><span class="footer-val">${mod.deliverable}</span></div>
        <div><span class="footer-label">Herramientas</span><span class="footer-val" style="color:${modColors[i]}">${mod.tools.join(' · ')}</span></div>
      </div>
    </div>
  `).join('');

  const equipoHTML = equipo.map(m => `
    <div class="member">
      <div class="member-init" style="border-color:rgba(6,182,212,.3);background:rgba(6,182,212,.1);color:#67e8f9">${m.initials}</div>
      <div>
        <div class="member-name">${m.name}</div>
        <div class="member-calidad">${m.calidad}</div>
        ${m.id === 'ee-01' ? '<div class="member-rol">Subdirector de los Talleres</div>' : ''}
      </div>
    </div>
  `).join('');

  win.document.write(`<!DOCTYPE html><html lang="es"><head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Programa DIAT 2026 — Facultad de Derecho PUCV</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@300;400;600;700;800&display=swap');
      *{box-sizing:border-box;margin:0;padding:0}
      html,body{min-height:100%}
      body{
        font-family:'Space Grotesk',sans-serif;
        background:#070b12;color:#cbd5e1;
        padding:48px 56px;max-width:860px;margin:0 auto;
        -webkit-print-color-adjust:exact;print-color-adjust:exact;
      }
      body::before{
        content:'';position:fixed;inset:0;
        background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.04) 3px,rgba(0,0,0,.04) 6px);
        pointer-events:none;z-index:0;
      }
      .wrap{position:relative;z-index:1}

      /* ── HEADER ── */
      .header{
        border-bottom:1px solid rgba(6,182,212,.2);
        padding-bottom:20px;margin-bottom:28px;
      }
      .header-top{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:14px}
      .logo-row{display:flex;align-items:center;gap:8px;margin-bottom:8px}
      .badge{
        font-family:'JetBrains Mono',monospace;font-weight:700;font-size:10px;
        letter-spacing:.12em;padding:3px 10px;border-radius:5px;
        border:1px solid rgba(6,182,212,.4);background:rgba(6,182,212,.1);color:#67e8f9;
      }
      .badge-inst{
        font-family:'JetBrains Mono',monospace;font-size:9.5px;
        border:1px solid rgba(129,140,248,.3);background:rgba(129,140,248,.08);
        color:#a5b4fc;padding:3px 10px;border-radius:5px;
      }
      .badge-vcm{
        font-family:'JetBrains Mono',monospace;font-size:9.5px;
        border:1px solid rgba(192,132,252,.3);background:rgba(192,132,252,.08);
        color:#d8b4fe;padding:3px 10px;border-radius:5px;
      }
      .program-title{font-size:26px;font-weight:800;color:#f8fafc;letter-spacing:-.02em;line-height:1.1}
      .program-sub{font-size:12px;color:#64748b;font-family:'JetBrains Mono',monospace;margin-top:4px}
      .tagline{
        font-size:11.5px;color:#94a3b8;line-height:1.65;
        border-left:2px solid rgba(6,182,212,.4);padding-left:12px;
        margin-top:12px;max-width:580px;
      }
      .meta-right{text-align:right;font-size:9.5px;font-family:'JetBrains Mono',monospace;color:#334155;line-height:1.9}
      .meta-right .val{color:#475569}

      /* ── DATES STRIP ── */
      .dates-strip{
        display:flex;gap:8px;margin-bottom:28px;flex-wrap:wrap;
      }
      .date-chip{
        font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;
        padding:5px 14px;border-radius:20px;
        display:inline-flex;align-items:center;gap:6px;
      }
      .dc-1{border:1px solid rgba(6,182,212,.3);background:rgba(6,182,212,.08);color:#67e8f9}
      .dc-2{border:1px solid rgba(129,140,248,.3);background:rgba(129,140,248,.08);color:#a5b4fc}
      .dc-3{border:1px solid rgba(192,132,252,.3);background:rgba(192,132,252,.08);color:#d8b4fe}
      .dc-note{border:1px solid rgba(234,179,8,.2);background:rgba(234,179,8,.05);color:#ca8a04;font-weight:400}

      /* ── SECTION TITLES ── */
      .section-title{
        font-size:9px;font-family:'JetBrains Mono',monospace;font-weight:700;
        letter-spacing:.2em;text-transform:uppercase;color:#334155;
        margin-bottom:14px;
        display:flex;align-items:center;gap:8px;
      }
      .section-title::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.05)}

      /* ── MODULES ── */
      .module{
        border:1px solid;border-radius:12px;
        padding:18px 22px;margin-bottom:16px;
      }
      .mod-header{
        display:flex;align-items:flex-start;gap:14px;
        padding-bottom:14px;margin-bottom:14px;border-bottom:1px solid;
      }
      .mod-id{
        font-family:'JetBrains Mono',monospace;font-weight:900;font-size:20px;
        min-width:44px;height:44px;border-radius:10px;border:1px solid;
        display:flex;align-items:center;justify-content:center;shrink:0;
      }
      .mod-date{font-size:9.5px;font-family:'JetBrains Mono',monospace;font-weight:600;margin-bottom:3px}
      .mod-title{font-size:15px;font-weight:800;color:#f1f5f9;line-height:1.2}
      .mod-sub{font-size:10.5px;color:#64748b;margin-top:3px}
      .mod-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:14px}
      .section-label{font-size:8.5px;font-family:'JetBrains Mono',monospace;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#334155;margin-bottom:8px}
      .item{font-size:10.5px;color:#94a3b8;margin-bottom:5px;line-height:1.55;padding-left:8px}
      .mod-footer{display:flex;flex-direction:column;gap:6px}
      .footer-label{font-size:8.5px;font-family:'JetBrains Mono',monospace;font-weight:700;color:#334155;letter-spacing:.1em;text-transform:uppercase;margin-right:8px}
      .footer-val{font-size:10px;color:#94a3b8}

      /* ── EQUIPO ── */
      .equipo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:10px}
      .member{
        display:flex;align-items:flex-start;gap:10px;
        padding:12px 14px;border-radius:10px;
        border:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.02);
      }
      .member-init{
        width:36px;height:36px;border-radius:8px;border:1px solid;
        display:flex;align-items:center;justify-content:center;
        font-family:'JetBrains Mono',monospace;font-weight:700;font-size:10px;
        shrink:0;flex-shrink:0;
      }
      .member-name{font-size:11px;font-weight:700;color:#e2e8f0;line-height:1.3}
      .member-calidad{font-size:9.5px;color:#64748b;margin-top:2px}
      .member-rol{font-size:9px;color:#67e8f9;font-family:'JetBrains Mono',monospace;font-weight:600;margin-top:2px}

      /* ── AUTORIDADES ── */
      .autoridades{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:20px}
      .aut-card{
        padding:12px 14px;border-radius:10px;
        border:1px solid rgba(6,182,212,.15);background:rgba(6,182,212,.04);
      }
      .aut-name{font-size:11px;font-weight:700;color:#e2e8f0;line-height:1.3}
      .aut-title{font-size:9.5px;color:#67e8f9;font-family:'JetBrains Mono',monospace;margin-top:3px}
      .aut-sub{font-size:9px;color:#475569;margin-top:2px}

      /* ── FOOTER ── */
      .doc-footer{
        margin-top:28px;padding-top:16px;
        border-top:1px solid rgba(255,255,255,.05);
        display:flex;justify-content:space-between;align-items:center;
        font-size:9px;font-family:'JetBrains Mono',monospace;color:#1e293b;
      }
      .doc-footer .right{display:flex;align-items:center;gap:8px}
      .glow-badge{
        display:inline-flex;align-items:center;gap:4px;
        background:rgba(6,182,212,.08);color:#0891b2;
        border:1px solid rgba(6,182,212,.2);
        border-radius:4px;padding:2px 8px;font-size:8.5px;font-weight:700;
      }
      @media print{
        body{padding:32px;background:#070b12}
        .wrap{page-break-inside:avoid}
        .module{page-break-inside:avoid}
      }
    </style>
  </head><body>
  <div class="wrap">

    <div class="header">
      <div class="header-top">
        <div>
          <div class="logo-row">
            <span class="badge">DIAT</span>
            <span class="badge-inst">FD · PUCV</span>
            <span class="badge-vcm">VCM</span>
          </div>
          <div class="program-title">Programa DIAT 2026</div>
          <div class="program-sub">Derecho · Inteligencia Artificial · Tecnología</div>
          <div class="tagline">
            Programa de formación aplicada en inteligencia artificial jurídica, prompting avanzado
            y nuevas competencias digitales para el ejercicio legal.
            Facultad de Derecho · Pontificia Universidad Católica de Valparaíso.
          </div>
        </div>
        <div class="meta-right">
          <div>Emitido: <span class="val">${date}</span></div>
          <div>Versión: <span class="val">2026.1</span></div>
          <div>Estado: <span class="val">Tentativo</span></div>
          <div style="margin-top:6px;color:#1e293b">programadiat@pucv.cl</div>
        </div>
      </div>
    </div>

    <div class="dates-strip">
      <span class="date-chip dc-1">● Módulo 1 · 8 Sep 2026</span>
      <span class="date-chip dc-2">● Módulo 2 · 15 Sep 2026</span>
      <span class="date-chip dc-3">● Módulo 3 · 22 Sep 2026</span>
      <span class="date-chip dc-note">⚠ Fechas tentativas</span>
    </div>

    <div class="section-title">Estructura del Programa</div>
    ${modulesHTML}

    <div class="section-title" style="margin-top:24px">Dirección Institucional</div>
    <div class="autoridades">
      <div class="aut-card">
        <div class="aut-name">Eduardo Aldunate Lizana</div>
        <div class="aut-title">Director · Escuela de Derecho PUCV</div>
        <div class="aut-sub">Autoridad institucional del Programa</div>
      </div>
      <div class="aut-card">
        <div class="aut-name">Dr. Adolfo Silva Walbaum</div>
        <div class="aut-title">Director · Programa DIAT</div>
        <div class="aut-sub">Director del Taller · Responsable académico</div>
      </div>
      <div class="aut-card">
        <div class="aut-name">Diego Ojeda Cifuentes</div>
        <div class="aut-title">Subdirector de los Talleres</div>
        <div class="aut-sub">Coordinador Operativo · Plataforma</div>
      </div>
    </div>

    <div class="section-title">Equipo Ejecutor — Integrantes Programa DIAT</div>
    <div class="equipo-grid">
      ${equipoHTML}
    </div>

    <div class="doc-footer">
      <div>Programa DIAT · Facultad de Derecho PUCV · Valparaíso, Chile · 2026</div>
      <div class="right">
        <span class="glow-badge">✦ Construido con IA</span>
        <span>Con apoyo de Vinculación con el Medio</span>
      </div>
    </div>

  </div>
  </body></html>`);
  win.document.close();
  setTimeout(() => win.print(), 500);
}

export default function LandingPage() {
  const cd = useCountdown(MODULE1_DATE);

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 lg:py-12 space-y-16">

      {/* ── HERO ─────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-8"
      >
        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/8 text-xs text-cyan-400 font-semibold mono tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Programa DIAT · Facultad de Derecho PUCV
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/20 bg-yellow-500/5 text-xs text-yellow-400 font-medium mono">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            Septiembre 2026 · Fechas tentativas
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            <span className="text-white">Entrena las habilidades</span>{' '}
            <br className="hidden sm:block" />
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, oklch(0.71 0.17 200) 0%, oklch(0.55 0.22 264) 100%)' }}
            >
              jurídicas
            </span>{' '}
            <span className="text-white">que la IA exige.</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Programa de formación aplicada en inteligencia artificial jurídica,
            prompting avanzado y nuevas competencias digitales para el ejercicio legal.
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            6 horas · 3 módulos · 7 plataformas IA · Certificación institucional PUCV
          </p>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="space-y-4"
        >
          <div className="text-xs text-zinc-500 uppercase tracking-widest mono">
            Comienza en
          </div>
          <div className="flex items-end justify-center gap-3 sm:gap-4">
            <CountdownBlock value={cd.days} label="días" />
            <span className="text-zinc-600 text-3xl font-bold pb-7">:</span>
            <CountdownBlock value={cd.hours} label="horas" />
            <span className="text-zinc-600 text-3xl font-bold pb-7">:</span>
            <CountdownBlock value={cd.minutes} label="min" />
            <span className="text-zinc-600 text-3xl font-bold pb-7">:</span>
            <CountdownBlock value={cd.seconds} label="seg" />
          </div>
          <div className="text-xs text-zinc-600 mono">Módulo 1 · 8 de septiembre 2026 · PUCV Derecho · Valparaíso · <span className="text-yellow-600">Fechas tentativas</span></div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap"
        >
          <a href={MAILTO_RESERVA}>
            <motion.button
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-black bg-cyan-400 hover:bg-cyan-300 transition-colors glow-cyan"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Mail className="w-4 h-4" />
              Reservar cupo
              <span className="w-1.5 h-1.5 rounded-full bg-black/30 animate-pulse" />
            </motion.button>
          </a>
          <Link href="/prompt-lab">
            <motion.button
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-cyan-300 border border-cyan-500/30 bg-cyan-500/8 hover:bg-cyan-500/15 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <Zap className="w-4 h-4" />
              Abrir Prompt Lab
            </motion.button>
          </Link>
          <Link href="/modulos">
            <motion.button
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-zinc-300 border border-white/10 hover:border-white/20 hover:bg-white/[0.04] transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              Ver módulos
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
          <motion.button
            onClick={() => handleProgramPDF(modules, equipoEjecutor)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm text-zinc-400 border border-zinc-700/50 bg-zinc-800/20 hover:border-zinc-600/60 hover:text-zinc-200 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <Download className="w-4 h-4" />
            Descargar programa PDF
          </motion.button>
        </motion.div>
      </motion.section>

      {/* ── PROMPT LAB HERO ──────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[oklch(0.08_0.02_200/0.9)] to-[oklch(0.08_0.015_250/0.8)] overflow-hidden p-6 sm:p-8"
      >
        <div className="absolute inset-0 grid-bg-fine opacity-20" />
        <div className="relative">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left */}
            <div className="flex-1 space-y-5">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-cyan-400" />
                </span>
                <div>
                  <div className="text-xs text-cyan-500 font-bold uppercase tracking-widest mono">Feature principal</div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">LexPrompt Architect</h2>
                </div>
              </div>

              <p className="text-sm text-zinc-400 leading-relaxed">
                El generador de prompts jurídicos más completo en español. 7 pasos, 8 capas de protección
                (ciberseguridad, anti-alucinaciones, fuentes chilenas verificadas).
                <span className="text-zinc-200"> Descarga tu prompt en PDF, TXT o cópialo directo a Claude, ChatGPT o Gemini.</span>
              </p>

              <div className="flex flex-wrap gap-2">
                {[
                  { icon: <Shield className="w-3 h-3" />, label: 'Anti-alucinaciones', color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/8' },
                  { icon: <Brain className="w-3 h-3" />, label: 'Fuentes chilenas', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/8' },
                  { icon: <FileText className="w-3 h-3" />, label: 'Export PDF/TXT/MD', color: 'text-purple-400 border-purple-500/20 bg-purple-500/8' },
                  { icon: <Bot className="w-3 h-3" />, label: 'Claude · GPT · Gemini', color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/8' },
                ].map(b => (
                  <span key={b.label} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${b.color}`}>
                    {b.icon} {b.label}
                  </span>
                ))}
              </div>

              <Link href="/prompt-lab">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm transition-colors glow-cyan"
                >
                  <Zap className="w-4 h-4" /> Construir mi prompt ahora
                </motion.button>
              </Link>
            </div>

            {/* Right — step preview */}
            <div className="flex-1 max-w-xs mx-auto lg:mx-0">
              <div className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium mb-3">
                Árbol de decisión — 7 pasos
              </div>
              <div className="space-y-1.5">
                {promptLabPreviewSteps.map((s, i) => (
                  <motion.div
                    key={s.num}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg border border-white/[0.06] bg-white/[0.02]"
                  >
                    <span className="text-[10px] mono text-zinc-700 w-5 shrink-0">{s.num}</span>
                    <span className="text-base shrink-0">{s.icon}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-zinc-300">{s.label}</div>
                      <div className="text-[10px] text-zinc-600 truncate">{s.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── STATS STRIP ──────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          { value: '6', label: 'horas de formación' },
          { value: '3', label: 'módulos especializados' },
          { value: '7', label: 'plataformas IA' },
          { value: 'Sep', label: '2026 · Valparaíso' },
        ].map(({ value, label }) => (
          <div key={label} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 text-center">
            <div className="text-2xl font-bold text-white mono">{value}</div>
            <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
          </div>
        ))}
      </motion.section>

      {/* ── LO QUE CONSTRUIRÁS ───────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-5"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Lo que construirás</h2>
          <p className="text-sm text-zinc-500 mt-1">
            Cada módulo termina con algo real y tuyo. Expande para ver el spoiler.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {spoilers.map(s => (
            <SpoilerCard key={s.mod} {...s} />
          ))}
        </div>
      </motion.section>

      {/* ── WHY ATTEND ───────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-5"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">¿Por qué DIAT?</h2>
          <p className="text-sm text-zinc-500 mt-1">Porque el futuro del derecho se construye ahora, no "cuando haya tiempo".</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {reasons.map(({ emoji, title, desc, color, accent }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-xl border p-5 ${color}`}
            >
              <div className="text-3xl mb-3">{emoji}</div>
              <h3 className={`font-semibold text-sm mb-2 ${accent}`}>{title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── MODULES PREVIEW ──────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Los 3 módulos</h2>
          <Link href="/modulos" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors">
            Ver detalle <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-3">
          {modules.map((mod, i) => (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]"
            >
              <div className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center font-bold mono text-sm shrink-0 text-zinc-500">
                {mod.id}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-zinc-300">{mod.title}</div>
                <div className="text-xs text-zinc-600 mt-0.5">{mod.displayDate} · {mod.duration}</div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <span className="text-[10px] mono text-yellow-500 border border-yellow-500/20 bg-yellow-500/8 px-2 py-0.5 rounded-md">
                  PRÓXIMAMENTE
                </span>
                <Circle className="w-4 h-4 text-zinc-600" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── FEATURES GRID ────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-5"
      >
        <h2 className="text-2xl font-bold text-white text-center">Explora la plataforma</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map(({ icon: Icon, href, label, desc }) => (
            <Link key={href} href={href}>
              <motion.div
                className="group flex items-center gap-4 p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-cyan-500/25 hover:bg-cyan-500/5 transition-all"
                whileHover={{ y: -2 }}
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.07] group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 flex items-center justify-center transition-all shrink-0">
                  <Icon className="w-5 h-5 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-zinc-200 group-hover:text-white transition-colors">{label}</div>
                  <div className="text-xs text-zinc-600">{desc}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-cyan-500 ml-auto transition-colors" />
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* ── APPS LEGALES CON IA ──────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-5"
      >
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-white">Apps legales con IA</h2>
          <p className="text-sm text-zinc-500">
            En M3 construirás tu primer prototipo legaltech. Estas son las categorías reales del mercado.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { icon: <Scale className="w-5 h-5" />, title: 'Asistente de litigios', desc: 'Análisis de expedientes, argumentarios automáticos', color: 'border-cyan-500/20 bg-cyan-500/5', accent: 'text-cyan-400' },
            { icon: <FileText className="w-5 h-5" />, title: 'Generador de contratos', desc: 'Redacción y revisión de documentos contractuales', color: 'border-indigo-500/20 bg-indigo-500/5', accent: 'text-indigo-400' },
            { icon: <Brain className="w-5 h-5" />, title: 'Investigador jurídico', desc: 'Síntesis de jurisprudencia y doctrina con fuentes', color: 'border-purple-500/20 bg-purple-500/5', accent: 'text-purple-400' },
            { icon: <Shield className="w-5 h-5" />, title: 'Auditor de compliance', desc: 'Revisión normativa automatizada para empresas', color: 'border-emerald-500/20 bg-emerald-500/5', accent: 'text-emerald-400' },
            { icon: <GraduationCap className="w-5 h-5" />, title: 'Tutor legal IA', desc: 'Formación y preparación para exámenes de derecho', color: 'border-yellow-500/20 bg-yellow-500/5', accent: 'text-yellow-400' },
            { icon: <Globe className="w-5 h-5" />, title: 'Chatbot jurídico', desc: 'Orientación legal ciudadana de primer nivel', color: 'border-orange-500/20 bg-orange-500/5', accent: 'text-orange-400' },
          ].map(({ icon, title, desc, color, accent }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-xl border p-4 space-y-2 ${color}`}
            >
              <div className={accent}>{icon}</div>
              <div className={`text-sm font-semibold ${accent}`}>{title}</div>
              <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center">
          <span className="text-xs text-zinc-600 italic">
            Construido con Claude + Vercel · Deploy en vivo al final del Módulo 3 · Fechas tentativas Sep 2026
          </span>
        </div>
      </motion.section>

      {/* ── INSTITUTIONAL BACKING ────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 sm:p-8 space-y-5"
      >
        <div className="text-center space-y-1">
          <div className="text-[10px] text-zinc-600 uppercase tracking-widest mono font-medium">Respaldo institucional</div>
          <h2 className="text-lg font-bold text-white">Actividad organizada por</h2>
        </div>
        <div className="flex justify-center">
          <InstitutionalLogoRow size="md" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {[
            {
              icon: <Building2 className="w-4 h-4" />,
              label: 'Facultad de Derecho',
              sub: 'Pontificia Universidad Católica de Valparaíso',
              color: 'text-cyan-400',
            },
            {
              icon: <Cpu className="w-4 h-4" />,
              label: 'Programa DIAT',
              sub: 'Derecho, IA y Tecnología · Formación aplicada',
              color: 'text-indigo-400',
            },
            {
              icon: <Globe className="w-4 h-4" />,
              label: 'Vinculación con el Medio',
              sub: 'PUCV · Transferencia de conocimiento a la sociedad',
              color: 'text-purple-400',
            },
          ].map(({ icon, label, sub, color }) => (
            <div key={label} className="text-center space-y-1">
              <div className={`flex justify-center mb-1 ${color}`}>{icon}</div>
              <div className={`text-sm font-semibold ${color}`}>{label}</div>
              <div className="text-[11px] text-zinc-600 leading-relaxed">{sub}</div>
            </div>
          ))}
        </div>
        <div className="text-center pt-2">
          <p className="text-xs text-zinc-600">
            Director del Taller:{' '}
            <span className="text-zinc-400 font-medium">Dr. Adolfo Silva Walbaum</span>
            {' '}· Bajo la dirección de la Escuela de Derecho PUCV
          </p>
        </div>
      </motion.section>

      {/* ── BOTTOM CTA ───────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/8 to-indigo-500/5 overflow-hidden p-8 text-center"
      >
        <div className="absolute inset-0 grid-bg-fine opacity-30" />
        <div className="relative space-y-4">
          <div className="text-2xl font-bold text-white">Tu cupo en el Programa DIAT 2026</div>
          <p className="text-zinc-400 text-sm max-w-md mx-auto">
            Programa DIAT · Facultad de Derecho PUCV. Formación práctica en IA jurídica con certificación institucional.
          </p>
          <p className="text-xs text-zinc-600 italic">
            "El futuro llega para todos. La diferencia es quién llega preparado."
          </p>
          <p className="text-[11px] text-zinc-600 mono">
            8 · 15 · 22 Septiembre 2026 · Fechas tentativas · Cupos limitados
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-2">
            <a href={MAILTO_RESERVA}>
              <motion.button
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-black bg-cyan-400 hover:bg-cyan-300 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Mail className="w-4 h-4" />
                Reservar cupo ahora
              </motion.button>
            </a>
            <Link href="/modulos">
              <motion.button
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-zinc-300 border border-white/10 hover:border-white/20 hover:bg-white/[0.04] transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Ver programa completo <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.section>

    </div>
  );
}
