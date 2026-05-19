'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Download, ArrowLeft, FileText, Layers, Zap,
  Shield, Users, Globe, Target, BookOpen, ChevronRight,
} from 'lucide-react';
import { modules } from '@/data/modules';
import { equipoEjecutor } from '@/data/team';

// ─────────────────────────────────────────────────────────────────────────────
// PDF GENERATOR
// ─────────────────────────────────────────────────────────────────────────────
function generateDossierPDF(
  mods: typeof modules,
  equipo: typeof equipoEjecutor,
) {
  const win = window.open('', '_blank');
  if (!win) return;

  const modAccent   = ['#06b6d4', '#818cf8', '#a855f7'];
  const modBg       = ['rgba(6,182,212,.1)', 'rgba(129,140,248,.1)', 'rgba(168,85,247,.1)'];
  const modBorder   = ['rgba(6,182,212,.25)', 'rgba(129,140,248,.25)', 'rgba(168,85,247,.25)'];
  const modLabel    = ['MÓDULO 01', 'MÓDULO 02', 'MÓDULO 03'];

  /* ── Module pages HTML ── */
  const modulePages = mods.map((mod, i) => `
<div class="page page-dark" style="padding:0">
  <!-- accent bar top -->
  <div style="height:4px;background:linear-gradient(90deg,${modAccent[i]},${modAccent[i]}44,transparent)"></div>
  <div style="padding:44px 52px 36px">
    <!-- header row -->
    <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:32px">
      <div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.2em;color:${modAccent[i]};margin-bottom:8px">${modLabel[i]} · ${mod.displayDate} · ${mod.duration.toUpperCase()}</div>
        <h2 style="font-size:28px;font-weight:800;color:#f8fafc;line-height:1.1;letter-spacing:-.02em;margin-bottom:8px">${mod.title}</h2>
        <p style="font-size:13px;color:#64748b;font-style:italic">${mod.subtitle}</p>
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div style="font-family:'JetBrains Mono',monospace;font-size:32px;font-weight:900;color:${modAccent[i]};opacity:.15;line-height:1">0${mod.id}</div>
      </div>
    </div>

    <!-- two-column layout -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-bottom:28px">
      <!-- left: objectives -->
      <div>
        <div class="col-label" style="color:${modAccent[i]}">Objetivos de aprendizaje</div>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${mod.objectives.map((o, j) => `
          <div style="display:flex;gap:12px;align-items:flex-start">
            <div style="font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:700;color:${modAccent[i]};margin-top:3px;flex-shrink:0">0${j + 1}</div>
            <p style="font-size:12px;color:#94a3b8;line-height:1.6">${o}</p>
          </div>`).join('')}
        </div>
      </div>
      <!-- right: contents -->
      <div>
        <div class="col-label" style="color:${modAccent[i]}">Contenidos del módulo</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${mod.contents.map(c => `
          <div style="display:flex;gap-8px;align-items:flex-start;padding:8px 10px;border-radius:8px;background:${modBg[i]};border:1px solid ${modBorder[i]}">
            <span style="font-size:12px;color:#94a3b8;line-height:1.5">◦ ${c}</span>
          </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- bottom strip -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;padding-top:20px;border-top:1px solid rgba(255,255,255,.06)">
      <div style="padding:16px;border-radius:10px;background:${modBg[i]};border:1px solid ${modBorder[i]}">
        <div class="col-label" style="color:${modAccent[i]};margin-bottom:8px">Actividad central</div>
        <p style="font-size:11px;color:#94a3b8;line-height:1.6">${mod.activity}</p>
      </div>
      <div style="padding:16px;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.07)">
        <div class="col-label" style="margin-bottom:8px">Entregable</div>
        <p style="font-size:11px;color:#94a3b8;line-height:1.6">${mod.deliverable}</p>
      </div>
      <div style="padding:16px;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.07)">
        <div class="col-label" style="margin-bottom:10px">Herramientas</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${mod.tools.map(t => `<span style="font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:700;padding:3px 10px;border-radius:4px;border:1px solid ${modBorder[i]};background:${modBg[i]};color:${modAccent[i]}">${t}</span>`).join('')}
        </div>
      </div>
    </div>

    <!-- timeline -->
    <div style="margin-top:24px">
      <div class="col-label" style="margin-bottom:12px">Timeline de la sesión</div>
      <div style="display:flex;gap:0;position:relative">
        <div style="position:absolute;top:14px;left:0;right:0;height:1px;background:rgba(255,255,255,.06)"></div>
        ${mod.timeline.map((block, j) => `
        <div style="flex:1;position:relative;padding:0 4px">
          <div style="width:8px;height:8px;border-radius:50%;background:${modAccent[i]};margin:0 auto 8px;opacity:${j === 0 ? '1' : '.5'}"></div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:8px;font-weight:600;color:${modAccent[i]};text-align:center;margin-bottom:4px">${block.time}</div>
          <div style="font-size:9px;font-weight:600;color:#cbd5e1;text-align:center;line-height:1.4">${block.topic}</div>
        </div>`).join('')}
      </div>
    </div>
  </div>
</div>`).join('');

  /* ── Equipo ejecutor rows ── */
  const equipoHTML = equipo.map(m => `
<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:10px;border:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.02)">
  <div style="width:38px;height:38px;border-radius:9px;border:1px solid rgba(6,182,212,.3);background:rgba(6,182,212,.1);display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:10px;color:#67e8f9;flex-shrink:0">${m.initials}</div>
  <div>
    <div style="font-size:12px;font-weight:700;color:#e2e8f0">${m.name}</div>
    <div style="font-size:10px;color:#64748b;margin-top:1px">${m.calidad}${m.id === 'ee-01' ? ' · Subdirector de los Talleres' : ''}</div>
  </div>
</div>`).join('');

  /* ── Full HTML document ── */
  win.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>DIAT Prompting Hub — Dossier 2026</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@300;400;500;600;700;800;900&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    @page { size: A4 portrait; margin: 0; }
    html { font-size: 14px; }
    body {
      font-family: 'Space Grotesk', system-ui, sans-serif;
      background: #080c14;
      color: #cbd5e1;
      width: 210mm;
      margin: 0 auto;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* pages */
    .page {
      width: 210mm;
      min-height: 297mm;
      page-break-after: always;
      position: relative;
      overflow: hidden;
      padding: 44px 52px;
    }
    .page:last-child { page-break-after: auto; }
    .page-dark { background: #070b12; color: #cbd5e1; }
    .page-darker { background: #04060c; color: #cbd5e1; }
    .page-mid { background: #0a0f1c; color: #cbd5e1; }

    /* grid overlays */
    .grid-overlay::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
      background-size: 32px 32px;
      pointer-events: none;
    }
    .scan-overlay::after {
      content: '';
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.05) 3px,rgba(0,0,0,.05) 6px);
      pointer-events: none;
    }

    /* typography helpers */
    .col-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: .18em;
      text-transform: uppercase;
      color: #334155;
      margin-bottom: 12px;
    }
    .section-eyebrow {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: .2em;
      text-transform: uppercase;
      color: #06b6d4;
      margin-bottom: 12px;
    }
    .section-title {
      font-size: 30px;
      font-weight: 800;
      color: #f8fafc;
      letter-spacing: -.025em;
      line-height: 1.1;
      margin-bottom: 16px;
    }
    .body-text {
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.75;
    }
    .pullquote {
      font-size: 18px;
      font-weight: 700;
      color: #e2e8f0;
      line-height: 1.45;
      letter-spacing: -.01em;
      border-left: 3px solid #06b6d4;
      padding-left: 20px;
    }

    /* cards */
    .stat-card {
      padding: 22px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,.08);
      background: rgba(255,255,255,.03);
    }
    .stat-number {
      font-family: 'JetBrains Mono', monospace;
      font-size: 44px;
      font-weight: 900;
      line-height: 1;
      margin-bottom: 6px;
    }
    .stat-label {
      font-size: 12px;
      color: #64748b;
      line-height: 1.4;
    }
    .stat-source {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8px;
      color: #1e293b;
      margin-top: 10px;
      letter-spacing: .08em;
    }

    /* competency card */
    .comp-card {
      padding: 18px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,.07);
      background: rgba(255,255,255,.02);
    }
    .comp-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      margin-bottom: 10px;
    }
    .comp-title {
      font-size: 12px;
      font-weight: 700;
      color: #e2e8f0;
      margin-bottom: 4px;
    }
    .comp-desc {
      font-size: 10.5px;
      color: #64748b;
      line-height: 1.5;
    }

    /* table */
    table { border-collapse: collapse; width: 100%; }
    thead tr { background: rgba(6,182,212,.08); border-bottom: 1px solid rgba(6,182,212,.2); }
    thead th {
      padding: 10px 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5px;
      font-weight: 700;
      letter-spacing: .12em;
      text-transform: uppercase;
      color: #67e8f9;
      text-align: left;
    }
    tbody tr { border-bottom: 1px solid rgba(255,255,255,.04); }
    tbody tr:hover { background: rgba(255,255,255,.02); }
    tbody td {
      padding: 10px 12px;
      font-size: 11px;
      color: #94a3b8;
      vertical-align: top;
      line-height: 1.5;
    }
    .td-name {
      font-weight: 700;
      color: #e2e8f0;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
    }
    .td-free-yes { color: #6ee7b7; font-weight: 700; font-family: 'JetBrains Mono', monospace; font-size: 10px; }
    .td-free-partial { color: #fcd34d; font-weight: 600; font-family: 'JetBrains Mono', monospace; font-size: 10px; }

    /* risks */
    .risk-card {
      padding: 16px 18px;
      border-radius: 10px;
      border-left: 3px solid;
    }
    .risk-high { border-color: #f87171; background: rgba(248,113,113,.06); }
    .risk-med  { border-color: #fbbf24; background: rgba(251,191,36,.06);  }
    .risk-low  { border-color: #94a3b8; background: rgba(148,163,184,.04); }
    .risk-title { font-size: 12px; font-weight: 700; color: #e2e8f0; margin-bottom: 4px; }
    .risk-desc  { font-size: 11px; color: #64748b; line-height: 1.5; }
    .risk-badge {
      display: inline-block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8px;
      font-weight: 700;
      letter-spacing: .1em;
      padding: 2px 7px;
      border-radius: 3px;
      margin-bottom: 6px;
    }
    .rb-high { background: rgba(248,113,113,.15); color: #fca5a5; }
    .rb-med  { background: rgba(251,191,36,.15);  color: #fde68a; }
    .rb-low  { background: rgba(148,163,184,.12); color: #94a3b8; }

    /* workflow */
    .flow-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      flex: 1;
    }
    .flow-node {
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid rgba(6,182,212,.25);
      background: rgba(6,182,212,.08);
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 700;
      color: #67e8f9;
      text-align: center;
      width: 100%;
    }
    .flow-desc { font-size: 9.5px; color: #475569; text-align: center; line-height: 1.4; }
    .flow-arrow { font-size: 14px; color: #1e3a4c; margin: 0 4px; align-self: center; }

    /* divider */
    .accent-rule {
      height: 1px;
      background: linear-gradient(90deg, #06b6d4, #6366f188, transparent);
      margin: 24px 0;
    }

    @media print {
      body { background: #070b12; }
      .page { page-break-after: always; }
    }
  </style>
</head>
<body>

<!-- ══════════════════════════════════════════════════ -->
<!-- PAGE 1: COVER                                      -->
<!-- ══════════════════════════════════════════════════ -->
<div class="page page-darker grid-overlay scan-overlay" style="padding:0;display:flex;flex-direction:column">
  <!-- top glow -->
  <div style="position:absolute;top:-80px;left:50%;transform:translateX(-50%);width:500px;height:300px;background:radial-gradient(ellipse,rgba(6,182,212,.12),transparent 70%);pointer-events:none"></div>
  <!-- right glow -->
  <div style="position:absolute;top:40%;right:-60px;width:280px;height:280px;background:radial-gradient(ellipse,rgba(99,102,241,.08),transparent 70%);pointer-events:none"></div>

  <!-- top bar -->
  <div style="padding:28px 52px 0;display:flex;align-items:center;justify-content:space-between;position:relative;z-index:1">
    <div style="display:flex;align-items:center;gap:10px">
      <span style="font-family:'JetBrains Mono',monospace;font-weight:900;font-size:11px;letter-spacing:.15em;padding:5px 12px;border-radius:6px;border:1px solid rgba(6,182,212,.4);background:rgba(6,182,212,.1);color:#67e8f9">DIAT</span>
      <span style="font-family:'JetBrains Mono',monospace;font-size:9.5px;padding:5px 12px;border-radius:6px;border:1px solid rgba(129,140,248,.3);background:rgba(129,140,248,.08);color:#a5b4fc">FD · PUCV</span>
      <span style="font-family:'JetBrains Mono',monospace;font-size:9.5px;padding:5px 12px;border-radius:6px;border:1px solid rgba(168,85,247,.3);background:rgba(168,85,247,.08);color:#d8b4fe">VCM</span>
    </div>
    <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#1e293b">2026.1 · ES · DOSSIER</div>
  </div>

  <!-- center content -->
  <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 60px;position:relative;z-index:1">
    <!-- program label -->
    <div style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.3em;color:#334155;text-transform:uppercase;margin-bottom:28px">
      Programa de Formación Aplicada · Septiembre 2026
    </div>

    <!-- main title -->
    <h1 style="font-size:58px;font-weight:900;color:#f8fafc;letter-spacing:-.04em;line-height:1;margin-bottom:16px">
      DIAT<br>
      <span style="color:#06b6d4">Prompting</span><br>
      Hub
    </h1>

    <!-- subtitle -->
    <p style="font-size:15px;font-weight:500;color:#64748b;line-height:1.6;max-width:400px;margin-bottom:36px">
      IA Jurídica Aplicada, Prompt Engineering y<br>
      Nuevas Competencias Digitales para el Derecho
    </p>

    <!-- quote -->
    <div style="max-width:440px;padding:20px 28px;border-radius:12px;border:1px solid rgba(6,182,212,.15);background:rgba(6,182,212,.04)">
      <p style="font-size:14px;font-weight:600;color:#e2e8f0;line-height:1.55;font-style:italic">
        "La próxima ventaja competitiva del abogado<br>será metodológica."
      </p>
    </div>
  </div>

  <!-- bottom bar -->
  <div style="padding:0 52px 28px;display:flex;align-items:center;justify-content:space-between;position:relative;z-index:1">
    <div>
      <div style="font-size:11px;font-weight:600;color:#475569">Facultad de Derecho</div>
      <div style="font-size:11px;color:#334155">Pontificia Universidad Católica de Valparaíso</div>
    </div>
    <div style="text-align:right">
      <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#334155">Septiembre 2026</div>
      <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#1e293b">Fechas tentativas</div>
    </div>
  </div>

  <!-- bottom accent line -->
  <div style="height:3px;background:linear-gradient(90deg,transparent,#06b6d4,#6366f1,transparent)"></div>
</div>


<!-- ══════════════════════════════════════════════════ -->
<!-- PAGE 2: CONTEXTO EDITORIAL                         -->
<!-- ══════════════════════════════════════════════════ -->
<div class="page page-dark">
  <div class="section-eyebrow">01 · Contexto</div>
  <h2 class="section-title">El Derecho en la Era<br>de la Inteligencia Artificial</h2>
  <div class="accent-rule"></div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:36px;margin-bottom:28px">
    <div>
      <p class="body-text" style="margin-bottom:16px">
        La inteligencia artificial generativa no es una tendencia emergente en el sector jurídico:
        es una transformación estructural que ya está ocurriendo. Los modelos de lenguaje de
        gran escala (LLMs) como Claude, GPT-4 y Gemini están redefiniendo la forma en que
        se redactan contratos, se analiza jurisprudencia y se construyen argumentarios legales.
      </p>
      <p class="body-text">
        El ejercicio profesional del derecho enfrenta hoy una bifurcación histórica.
        Por un lado, abogados que integran estas herramientas con criterio metodológico,
        supervisión crítica y competencias digitales avanzadas. Por otro, profesionales
        que las ignoran, delegando ventaja competitiva a quienes sí las dominan.
      </p>
    </div>
    <div>
      <div class="pullquote" style="margin-bottom:20px">
        "No se trata de automatizar el derecho.<br>Se trata de amplificar el criterio jurídico."
      </div>
      <p class="body-text">
        El <strong style="color:#e2e8f0">Programa DIAT</strong> de la Facultad de Derecho PUCV
        nace con una convicción: la adopción responsable de IA en el derecho exige formación
        rigurosa, pensamiento crítico y comprensión profunda de los flujos de trabajo.
        No basta con saber usar ChatGPT. Se necesita entender cómo construir prompts,
        diseñar workflows verificables y proteger la confidencialidad profesional.
      </p>
    </div>
  </div>

  <div style="padding:20px 24px;border-radius:12px;border:1px solid rgba(6,182,212,.15);background:rgba(6,182,212,.05);margin-bottom:20px">
    <p class="body-text">
      <strong style="color:#67e8f9">Prompt Engineering Jurídico</strong> es la disciplina que permite
      comunicarse efectivamente con modelos de IA para obtener outputs que cumplan los estándares
      del ejercicio legal: precisión normativa, verificabilidad de fuentes, confidencialidad de datos
      y ausencia de alucinaciones. El DIAT Prompting Hub es la primera plataforma de formación
      en esta disciplina desarrollada específicamente para el contexto jurídico chileno.
    </p>
  </div>

  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
    ${[
      { icon: '⚖️', label: 'Razonamiento jurídico asistido', desc: 'IA como co-redactor supervisado con criterio profesional' },
      { icon: '🔍', label: 'Investigación verificable', desc: 'Síntesis de jurisprudencia y doctrina con fuentes trazables' },
      { icon: '🛡️', label: 'Ciberseguridad profesional', desc: 'Protocolos para proteger datos de clientes en entornos IA' },
    ].map(c => `
    <div class="comp-card">
      <div class="comp-icon" style="background:rgba(6,182,212,.1);border:1px solid rgba(6,182,212,.2)">${c.icon}</div>
      <div class="comp-title">${c.label}</div>
      <div class="comp-desc">${c.desc}</div>
    </div>`).join('')}
  </div>
</div>


<!-- ══════════════════════════════════════════════════ -->
<!-- PAGE 3: STATS / ¿POR QUÉ?                         -->
<!-- ══════════════════════════════════════════════════ -->
<div class="page page-mid">
  <div class="section-eyebrow">02 · Diagnóstico</div>
  <h2 class="section-title">¿Por qué este programa?</h2>
  <p class="body-text" style="max-width:580px;margin-bottom:28px">
    Los datos globales son contundentes. La adopción de IA en el sector jurídico es acelerada,
    desigual y frecuentemente acrítica. El riesgo no es la IA en sí: es la brecha entre
    quienes la usan con metodología y quienes la usan sin ella.
  </p>

  <!-- stat cards -->
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:28px">
    ${[
      { num: '69%', color: '#06b6d4', label: 'de abogados considera la IA transformativa en su área', src: 'Thomson Reuters · Future of Professionals 2024' },
      { num: '23%', color: '#818cf8', label: 'de tareas legales son automatizables con IA generativa', src: 'McKinsey Global Institute 2023' },
      { num: '4h', color: '#a855f7', label: 'promedio semanal ahorradas con uso adecuado de IA', src: 'State of Legal Tech 2024' },
      { num: '$1.2B', color: '#10b981', label: 'de inversión global en legaltech en 2023', src: 'Stanford AI Index 2024' },
    ].map(s => `
    <div class="stat-card">
      <div class="stat-number" style="color:${s.color}">${s.num}</div>
      <div class="stat-label">${s.label}</div>
      <div class="stat-source">${s.src}</div>
    </div>`).join('')}
  </div>

  <div class="accent-rule"></div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:28px">
    <div>
      <p class="body-text" style="margin-bottom:16px">
        Según el <strong style="color:#e2e8f0">WEF Future of Jobs Report 2023</strong>,
        los roles jurídicos están entre los más afectados por la automatización parcial,
        especialmente en tareas de investigación, redacción y revisión documental.
        No obstante, la demanda por abogados con capacidades tecnológicas avanzadas
        se proyecta un <strong style="color:#06b6d4">34% al alza</strong> para 2027.
      </p>
      <p class="body-text">
        El <strong style="color:#e2e8f0">Stanford AI Index 2024</strong> reporta que las
        industrias con mayor adopción de herramientas de IA generativa incluyen servicios
        legales, finanzas y consultoría. Chile no es la excepción: grandes estudios
        jurídicos ya han incorporado asistentes de IA en flujos internos.
      </p>
    </div>
    <div>
      <!-- adoption bar chart visual -->
      <div>
        <div class="col-label" style="margin-bottom:14px">Adopción de IA en sectores jurídicos</div>
        ${[
          { label: 'Grandes estudios (20+ abogados)', pct: 71 },
          { label: 'Estudios medianos', pct: 48 },
          { label: 'Abogados independientes', pct: 29 },
          { label: 'Sector público jurídico', pct: 18 },
        ].map(b => `
        <div style="margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;margin-bottom:5px">
            <span style="font-size:11px;color:#94a3b8">${b.label}</span>
            <span style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:#06b6d4">${b.pct}%</span>
          </div>
          <div style="height:4px;border-radius:2px;background:rgba(255,255,255,.06);overflow:hidden">
            <div style="height:100%;width:${b.pct}%;background:linear-gradient(90deg,#06b6d4,#6366f1);border-radius:2px"></div>
          </div>
        </div>`).join('')}
        <div style="font-family:'JetBrains Mono',monospace;font-size:8px;color:#1e293b;margin-top:10px">Fuente: LexisNexis Legal Tech Report 2024 · Datos aproximados</div>
      </div>
    </div>
  </div>
</div>


<!-- ══════════════════════════════════════════════════ -->
<!-- PAGE 4: NUEVAS COMPETENCIAS                        -->
<!-- ══════════════════════════════════════════════════ -->
<div class="page page-dark">
  <div class="section-eyebrow">03 · Competencias</div>
  <h2 class="section-title">Nuevas Competencias<br>del Abogado Digital</h2>
  <p class="body-text" style="max-width:560px;margin-bottom:28px">
    El DIAT Prompting Hub entrena un conjunto específico de competencias que el mercado
    jurídico demanda y que los planes de estudio tradicionales aún no contemplan.
  </p>

  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
    ${[
      { icon: '⚡', title: 'Prompt Engineering Jurídico', desc: 'Construcción de prompts estructurados, verificables y optimizados para cada modelo de IA', color: 'rgba(6,182,212,.1)', border: 'rgba(6,182,212,.2)' },
      { icon: '🧠', title: 'Verificación de Outputs IA', desc: 'Protocolos sistemáticos para detectar alucinaciones y validar respuestas ante el estándar profesional', color: 'rgba(129,140,248,.1)', border: 'rgba(129,140,248,.2)' },
      { icon: '🔄', title: 'Diseño de Workflows Legales', desc: 'Arquitectura de flujos multi-IA para producción de documentos jurídicos de alto nivel', color: 'rgba(168,85,247,.1)', border: 'rgba(168,85,247,.2)' },
      { icon: '🛡️', title: 'Ciberseguridad Jurídica', desc: 'Anonimización de datos, manejo de información sensible y evaluación de riesgos en plataformas IA', color: 'rgba(16,185,129,.1)', border: 'rgba(16,185,129,.2)' },
      { icon: '⚖️', title: 'Gobernanza IA', desc: 'Marco regulatorio aplicable, responsabilidad profesional y ética en el uso de IA para el derecho', color: 'rgba(234,179,8,.1)', border: 'rgba(234,179,8,.2)' },
      { icon: '🤖', title: 'Diseño de Agentes Jurídicos', desc: 'System prompts de producción, Claude Projects y GPTs especializados para tareas legales', color: 'rgba(6,182,212,.1)', border: 'rgba(6,182,212,.2)' },
      { icon: '💻', title: 'LegalTech Aplicado', desc: 'Evaluación y uso de plataformas especializadas: Harvey AI, Clio, Thomson Reuters AI', color: 'rgba(129,140,248,.1)', border: 'rgba(129,140,248,.2)' },
      { icon: '📊', title: 'Automatización Profesional', desc: 'Identificación de tareas automatizables y diseño de soluciones IA para el ejercicio cotidiano', color: 'rgba(168,85,247,.1)', border: 'rgba(168,85,247,.2)' },
      { icon: '🔎', title: 'Research Jurídico Verificable', desc: 'Investigación con IA que cita fuentes trazables: pjud.cl, bcn.cl, jurisprudencia real', color: 'rgba(16,185,129,.1)', border: 'rgba(16,185,129,.2)' },
    ].map(c => `
    <div style="padding:16px;border-radius:10px;border:1px solid ${c.border};background:${c.color}">
      <div style="font-size:18px;margin-bottom:8px">${c.icon}</div>
      <div style="font-size:11.5px;font-weight:700;color:#e2e8f0;margin-bottom:5px;line-height:1.3">${c.title}</div>
      <div style="font-size:10px;color:#64748b;line-height:1.5">${c.desc}</div>
    </div>`).join('')}
  </div>
</div>


<!-- MODULES ── dynamic ──────────────────────────────── -->
${modulePages}


<!-- ══════════════════════════════════════════════════ -->
<!-- PAGE: PROMPT LAB                                   -->
<!-- ══════════════════════════════════════════════════ -->
<div class="page page-dark">
  <div class="section-eyebrow">07 · Herramienta</div>
  <h2 class="section-title">LexPrompt Architect</h2>
  <p class="body-text" style="max-width:560px;margin-bottom:24px">
    El DIAT Prompting Hub incluye una herramienta interactiva de construcción de prompts
    jurídicos profesionales. 7 pasos guiados, 8 capas de protección, exportación multi-formato.
    <strong style="color:#e2e8f0">Ingeniería jurídica aplicada a IA.</strong>
  </p>
  <div class="accent-rule"></div>

  <!-- 7 steps grid -->
  <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-bottom:28px">
    ${[
      { n:'01', label:'Perfil', icon:'🎓', desc:'Estudiante · Abogado · Académico' },
      { n:'02', label:'Finalidad', icon:'📝', desc:'Redactar · Analizar · Litigar' },
      { n:'03', label:'Área', icon:'⚖️', desc:'Civil · Penal · Laboral · Tech' },
      { n:'04', label:'Profundidad', icon:'📊', desc:'Rápido → Litigación avanzada' },
      { n:'05', label:'IA Objetivo', icon:'🤖', desc:'Claude · ChatGPT · Gemini' },
      { n:'06', label:'Formato', icon:'🗂️', desc:'Informe · Checklist · Tabla' },
      { n:'07', label:'Protecciones', icon:'🛡️', desc:'Anti-alucinaciones · Ciberseg' },
    ].map(s => `
    <div style="padding:12px 10px;border-radius:10px;border:1px solid rgba(6,182,212,.2);background:rgba(6,182,212,.06);text-align:center">
      <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#334155;margin-bottom:6px">${s.n}</div>
      <div style="font-size:16px;margin-bottom:6px">${s.icon}</div>
      <div style="font-size:10.5px;font-weight:700;color:#e2e8f0;margin-bottom:3px">${s.label}</div>
      <div style="font-size:9px;color:#475569;line-height:1.4">${s.desc}</div>
    </div>`).join('')}
  </div>

  <!-- export formats -->
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:24px">
    ${[
      { fmt:'PDF Dark', desc:'Documento técnico con branding institucional', icon:'📄' },
      { fmt:'TXT / MD', desc:'Texto plano para uso directo en plataformas', icon:'📋' },
      { fmt:'System Prompt', desc:'Exportar como instrucción de sistema para Claude/GPT', icon:'🤖' },
      { fmt:'Claude Project', desc:'Config lista para Claude Projects', icon:'⚡' },
    ].map(f => `
    <div style="padding:14px;border-radius:10px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.02)">
      <div style="font-size:18px;margin-bottom:8px">${f.icon}</div>
      <div style="font-size:11px;font-weight:700;color:#e2e8f0;margin-bottom:4px">${f.fmt}</div>
      <div style="font-size:10px;color:#64748b;line-height:1.4">${f.desc}</div>
    </div>`).join('')}
  </div>

  <!-- protection layers -->
  <div>
    <div class="col-label">Capas de protección integradas</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px">
      ${['🛡️ Anti-alucinaciones', '🔒 Ciberseguridad', '📚 Fuentes verificables', '🚫 Confidencialidad', '📋 Verificación normativa', '📐 Control de formato', '🎯 Límite de scope', '❓ Clarificación previa'].map(l => `
      <span style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:600;padding:5px 12px;border-radius:20px;border:1px solid rgba(129,140,248,.3);background:rgba(129,140,248,.08);color:#a5b4fc">${l}</span>`).join('')}
    </div>
  </div>
</div>


<!-- ══════════════════════════════════════════════════ -->
<!-- PAGE: TOOLKIT                                      -->
<!-- ══════════════════════════════════════════════════ -->
<div class="page page-mid" style="padding:40px 40px">
  <div class="section-eyebrow">08 · Herramientas</div>
  <h2 class="section-title" style="font-size:26px">Toolkit IA Jurídica</h2>
  <p class="body-text" style="margin-bottom:20px">Comparativa de las plataformas del programa.</p>

  <table>
    <thead>
      <tr>
        <th style="width:90px">Plataforma</th>
        <th>Mejor para</th>
        <th>Limitación clave</th>
        <th>Uso jurídico principal</th>
        <th style="width:70px">Acceso</th>
      </tr>
    </thead>
    <tbody>
      ${[
        { name:'Claude', tag:'Anthropic', best:'Documentos extensos, análisis legal profundo, razonamiento complejo con 200k tokens', limit:'Sin búsqueda web en tiempo real', use:'Contratos, análisis de expedientes, redacción de recursos', free:'Freemium' },
        { name:'ChatGPT', tag:'OpenAI', best:'Borradores rápidos, GPTs personalizados, plugins de terceros e integración con Zapier', limit:'Contexto limitado, alucinaciones frecuentes en leyes', use:'Redacción inicial, brainstorming jurídico, workflows con plugins', free:'Freemium' },
        { name:'Gemini', tag:'Google', best:'PDFs adjuntos sin copiar, integración nativa con Drive, Docs y Sheets', limit:'Razonamiento jurídico muy técnico', use:'Análisis de documentos PDF, resúmenes ejecutivos con Drive', free:'Freemium' },
        { name:'NotebookLM', tag:'Google', best:'Investigar exclusivamente dentro de tus propios documentos subidos', limit:'Solo responde sobre tus fuentes, no genera libremente', use:'Síntesis de doctrina, análisis de sentencias propias', free:'Gratuito' },
        { name:'Perplexity', tag:'Perplexity AI', best:'Búsqueda con fuentes citables y verificables, datos legislativos actuales', limit:'No redacta documentos ni hace análisis profundo', use:'Búsqueda de legislación, normativa reciente, referencias', free:'Freemium' },
        { name:'GitHub', tag:'Microsoft', best:'Control de versiones de código y repositorios de herramientas legaltech', limit:'Requiere conocimientos técnicos básicos', use:'Gestión de proyectos legaltech, código colaborativo', free:'Freemium' },
        { name:'Vercel', tag:'Vercel Inc.', best:'Deploy instantáneo de prototipos web y herramientas legaltech', limit:'Configuración técnica necesaria para proyectos complejos', use:'Publicación de apps jurídicas, dashboards y asistentes', free:'Freemium' },
      ].map(t => `
      <tr>
        <td><div class="td-name">${t.name}</div><div style="font-size:9px;color:#334155;font-family:'JetBrains Mono',monospace;margin-top:2px">${t.tag}</div></td>
        <td>${t.best}</td>
        <td>${t.limit}</td>
        <td>${t.use}</td>
        <td><span class="${t.free === 'Gratuito' ? 'td-free-yes' : 'td-free-partial'}">${t.free}</span></td>
      </tr>`).join('')}
    </tbody>
  </table>
</div>


<!-- ══════════════════════════════════════════════════ -->
<!-- PAGE: WORKFLOWS                                    -->
<!-- ══════════════════════════════════════════════════ -->
<div class="page page-dark">
  <div class="section-eyebrow">09 · Metodología</div>
  <h2 class="section-title">Workflows Jurídicos con IA</h2>
  <p class="body-text" style="max-width:560px;margin-bottom:28px">
    La formación DIAT entrega flujos de trabajo probados que transforman tareas
    de horas en procesos de minutos, sin sacrificar rigor profesional.
  </p>

  <!-- 3 workflows -->
  ${[
    {
      title: 'Flujo de Investigación Jurídica',
      sub: 'Para cualquier área desde cero',
      time: '30–45 min',
      replaces: '4–6 horas de trabajo manual',
      color: '#06b6d4',
      steps: [
        { tool: 'Perplexity', action: 'Legislación y jurisprudencia actual con fuentes citadas' },
        { tool: 'NotebookLM', action: 'Corpus propio: sube sentencias, pregúntale directamente' },
        { tool: 'Claude', action: 'Síntesis final verificada y redacción del documento' },
      ],
    },
    {
      title: 'Flujo para Litigación',
      sub: 'Preparación de audiencias y recursos',
      time: '60–90 min',
      replaces: '1 día completo de preparación',
      color: '#818cf8',
      steps: [
        { tool: 'Gemini', action: 'Sube el expediente PDF y extrae hechos clave automáticamente' },
        { tool: 'Claude', action: 'Análisis estratégico y construcción del argumentario' },
        { tool: 'ChatGPT', action: 'Genera el escrito en el formato del tribunal requerido' },
      ],
    },
    {
      title: 'Flujo para Contratos',
      sub: 'Redacción y revisión contractual',
      time: '20–40 min',
      replaces: '2–3 horas de redacción',
      color: '#a855f7',
      steps: [
        { tool: 'Claude', action: 'Redacta el contrato con cláusulas esenciales del área' },
        { tool: 'ChatGPT', action: 'Identifica riesgos y cláusulas faltantes o ambiguas' },
        { tool: 'Claude', action: 'Integra observaciones y genera la versión definitiva' },
      ],
    },
  ].map(wf => `
  <div style="margin-bottom:20px;padding:18px 22px;border-radius:12px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.02)">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
      <div>
        <div style="font-size:13px;font-weight:700;color:${wf.color};margin-bottom:3px">${wf.title}</div>
        <div style="font-size:11px;color:#475569">${wf.sub}</div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:#94a3b8">⏱ ${wf.time}</div>
        <div style="font-size:9.5px;color:#334155">Reemplaza: ${wf.replaces}</div>
      </div>
    </div>
    <div style="display:flex;align-items:center;gap:4px">
      ${wf.steps.map((s, j) => `
        <div style="flex:1;padding:10px 12px;border-radius:8px;border:1px solid ${wf.color}33;background:${wf.color}0a">
          <div style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;color:${wf.color};margin-bottom:4px">${s.tool}</div>
          <div style="font-size:10px;color:#64748b;line-height:1.4">${s.action}</div>
        </div>
        ${j < wf.steps.length - 1 ? `<div style="font-size:14px;color:#1e293b;flex-shrink:0">→</div>` : ''}`).join('')}
    </div>
  </div>`).join('')}
</div>


<!-- ══════════════════════════════════════════════════ -->
<!-- PAGE: RISKS                                        -->
<!-- ══════════════════════════════════════════════════ -->
<div class="page page-mid">
  <div class="section-eyebrow">10 · Rigor Académico</div>
  <h2 class="section-title">Riesgos y Desafíos<br>del Uso de IA en el Derecho</h2>
  <p class="body-text" style="max-width:560px;margin-bottom:28px">
    Una formación responsable exige transparencia sobre los límites y riesgos reales.
    El DIAT Prompting Hub los integra como contenido formativo central.
  </p>
  <div class="accent-rule"></div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
    ${[
      { title: 'Alucinaciones y Errores Factuales', desc: 'Los LLMs inventan jurisprudencia, artículos y datos con total confianza. Sin verificación sistemática, el output puede ser jurídicamente peligroso.', sev: 'CRÍTICO', cls: 'risk-high', bcls: 'rb-high' },
      { title: 'Confidencialidad Profesional', desc: 'Subir datos de clientes a plataformas públicas de IA puede violar el secreto profesional y la legislación de protección de datos personales.', sev: 'CRÍTICO', cls: 'risk-high', bcls: 'rb-high' },
      { title: 'Dependencia Tecnológica', desc: 'La delegación excesiva en IA puede atrofiar competencias de razonamiento jurídico fundamentales para el ejercicio profesional independiente.', sev: 'ALTO', cls: 'risk-med', bcls: 'rb-med' },
      { title: 'Sesgos en Outputs', desc: 'Los modelos entrenados con datos históricos pueden reproducir sesgos jurídicos o geográficos que no corresponden al sistema legal chileno.', sev: 'ALTO', cls: 'risk-med', bcls: 'rb-med' },
      { title: 'Marco Regulatorio IA', desc: 'La regulación de IA generativa está en construcción a nivel global. El abogado debe monitorear la evolución normativa que afecta su praxis profesional.', sev: 'MEDIO', cls: 'risk-low', bcls: 'rb-low' },
      { title: 'Responsabilidad Profesional', desc: 'El uso de IA no transfiere responsabilidad al sistema. El abogado sigue siendo responsable de todo output que presente como propio ante clientes y tribunales.', sev: 'CRÍTICO', cls: 'risk-high', bcls: 'rb-high' },
    ].map(r => `
    <div class="risk-card ${r.cls}">
      <span class="risk-badge ${r.bcls}">${r.sev}</span>
      <div class="risk-title">${r.title}</div>
      <div class="risk-desc">${r.desc}</div>
    </div>`).join('')}
  </div>
</div>


<!-- ══════════════════════════════════════════════════ -->
<!-- PAGE: OUTCOMES                                     -->
<!-- ══════════════════════════════════════════════════ -->
<div class="page page-dark">
  <div class="section-eyebrow">11 · Resultados</div>
  <h2 class="section-title">Lo que el participante<br>podrá hacer al terminar</h2>
  <div class="accent-rule" style="margin-bottom:28px"></div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:28px">
    ${[
      { out: 'Construir prompts jurídicos avanzados con 7 capas de estructura y protección', icon: '⚡' },
      { out: 'Diseñar workflows multi-IA para producción documental verificable', icon: '🔄' },
      { out: 'Usar IA con criterio profesional: supervisión, verificación y trazabilidad', icon: '🧠' },
      { out: 'Analizar documentos extensos con Claude: contratos, expedientes, sentencias', icon: '📄' },
      { out: 'Proteger la confidencialidad del cliente en entornos de IA generativa', icon: '🛡️' },
      { out: 'Crear agentes jurídicos personalizados con system prompts de producción', icon: '🤖' },
      { out: 'Comprender el marco regulatorio de IA y su impacto en responsabilidad profesional', icon: '⚖️' },
      { out: 'Diseñar propuestas de soluciones legaltech orientadas a problemas jurídicos concretos', icon: '💻' },
    ].map(o => `
    <div style="display:flex;align-items:flex-start;gap:12px;padding:14px 16px;border-radius:10px;border:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.02)">
      <div style="font-size:18px;flex-shrink:0">${o.icon}</div>
      <p style="font-size:12px;color:#94a3b8;line-height:1.5">${o.out}</p>
    </div>`).join('')}
  </div>

  <!-- certification note -->
  <div style="padding:20px 24px;border-radius:12px;border:1px solid rgba(6,182,212,.2);background:rgba(6,182,212,.06)">
    <div style="display:flex;align-items:center;gap:12px">
      <div style="font-size:28px;flex-shrink:0">🎓</div>
      <div>
        <div style="font-size:13px;font-weight:700;color:#67e8f9;margin-bottom:4px">Certificación Institucional PUCV</div>
        <p style="font-size:11.5px;color:#94a3b8;line-height:1.6">
          Los participantes que completen los 3 módulos presenciales reciben certificación
          institucional emitida por la Facultad de Derecho de la Pontificia Universidad
          Católica de Valparaíso, con apoyo de Vinculación con el Medio.
        </p>
      </div>
    </div>
  </div>
</div>


<!-- ══════════════════════════════════════════════════ -->
<!-- PAGE: REGISTRATION + TEAM                          -->
<!-- ══════════════════════════════════════════════════ -->
<div class="page page-darker grid-overlay">
  <!-- top accent -->
  <div style="height:2px;background:linear-gradient(90deg,#06b6d4,#6366f144,transparent);margin:-44px -52px 40px;width:calc(100% + 104px)"></div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px">
    <!-- left: inscripcion -->
    <div>
      <div class="section-eyebrow">12 · Inscripción</div>
      <h2 style="font-size:24px;font-weight:800;color:#f8fafc;letter-spacing:-.02em;margin-bottom:16px;line-height:1.2">
        Reserva de cupos<br>e información
      </h2>
      <p class="body-text" style="margin-bottom:20px">
        Los cupos son limitados. El programa está dirigido a estudiantes de derecho,
        egresados, abogados en ejercicio y académicos de la Facultad.
      </p>

      <div style="padding:20px;border-radius:12px;border:1px solid rgba(6,182,212,.25);background:rgba(6,182,212,.06);margin-bottom:16px">
        <div class="col-label" style="margin-bottom:8px">Contacto oficial</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;color:#67e8f9">programadiat@pucv.cl</div>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px">
        ${['● Módulo 1 · 8 Septiembre 2026','● Módulo 2 · 15 Septiembre 2026','● Módulo 3 · 22 Septiembre 2026'].map((d, i) => `
        <div style="display:flex;align-items:center;gap:10px;font-size:12px;color:#94a3b8">
          <div style="width:8px;height:8px;border-radius:50%;background:${modAccent[i]};flex-shrink:0"></div>
          ${d}
        </div>`).join('')}
      </div>

      <div style="padding:12px 16px;border-radius:8px;border:1px solid rgba(234,179,8,.2);background:rgba(234,179,8,.05)">
        <p style="font-size:10.5px;color:#ca8a04;line-height:1.5">
          ⚠ Fechas tentativas sujetas a ajustes institucionales.
          Confirmar asistencia con anticipación.
        </p>
      </div>
    </div>

    <!-- right: team -->
    <div>
      <div class="section-eyebrow">13 · Equipo</div>
      <h2 style="font-size:24px;font-weight:800;color:#f8fafc;letter-spacing:-.02em;margin-bottom:16px;line-height:1.2">
        Dirección institucional<br>y equipo ejecutor
      </h2>

      <!-- authorities -->
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
        ${[
          { name:'Eduardo Aldunate Lizana', title:'Director · Escuela de Derecho PUCV', color:'#67e8f9' },
          { name:'Dr. Adolfo Silva Walbaum', title:'Director · Programa DIAT · Director del Taller', color:'#a5b4fc' },
          { name:'Diego Ojeda Cifuentes', title:'Subdirector de los Talleres · Coordinador Operativo', color:'#7dd3fc' },
        ].map(a => `
        <div style="padding:12px 14px;border-radius:9px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.02)">
          <div style="font-size:12px;font-weight:700;color:#e2e8f0">${a.name}</div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:9.5px;color:${a.color};margin-top:2px">${a.title}</div>
        </div>`).join('')}
      </div>

      <!-- equipo ejecutor -->
      <div class="col-label">Integrantes Programa DIAT</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
        ${equipoEjecutor.map(m => `
        <div style="padding:8px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.05);background:rgba(255,255,255,.02)">
          <div style="font-size:11px;font-weight:600;color:#cbd5e1">${m.name}</div>
          <div style="font-size:9px;color:#475569;margin-top:1px">${m.calidad}</div>
        </div>`).join('')}
      </div>
    </div>
  </div>
</div>


<!-- ══════════════════════════════════════════════════ -->
<!-- PAGE: BACK COVER                                   -->
<!-- ══════════════════════════════════════════════════ -->
<div class="page page-darker grid-overlay scan-overlay" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
  <!-- glow -->
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:400px;height:400px;background:radial-gradient(ellipse,rgba(6,182,212,.08),transparent 70%);pointer-events:none"></div>

  <div style="position:relative;z-index:1;space-y-6">
    <!-- DIAT large -->
    <div style="font-family:'JetBrains Mono',monospace;font-size:72px;font-weight:900;color:rgba(6,182,212,.15);letter-spacing:.1em;line-height:1;margin-bottom:20px">DIAT</div>

    <div style="margin-bottom:24px">
      <div style="font-size:16px;font-weight:800;color:#f8fafc;margin-bottom:6px">Programa DIAT 2026</div>
      <div style="font-size:12px;color:#475569">IA Jurídica Aplicada · Facultad de Derecho PUCV</div>
    </div>

    <div style="font-size:13px;font-style:italic;color:#334155;max-width:360px;margin:0 auto 28px">
      "Construye criterio antes de automatizar."
    </div>

    <!-- institutional -->
    <div style="display:flex;justify-content:center;gap:12px;margin-bottom:20px">
      <span style="font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:700;padding:4px 10px;border-radius:5px;border:1px solid rgba(6,182,212,.3);background:rgba(6,182,212,.08);color:#67e8f9">DIAT</span>
      <span style="font-family:'JetBrains Mono',monospace;font-size:9px;padding:4px 10px;border-radius:5px;border:1px solid rgba(129,140,248,.3);background:rgba(129,140,248,.08);color:#a5b4fc">FD · PUCV</span>
      <span style="font-family:'JetBrains Mono',monospace;font-size:9px;padding:4px 10px;border-radius:5px;border:1px solid rgba(168,85,247,.3);background:rgba(168,85,247,.08);color:#d8b4fe">VCM</span>
    </div>

    <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#1e293b">
      programadiat@pucv.cl · Septiembre 2026 · Valparaíso, Chile
    </div>
  </div>

  <!-- bottom line -->
  <div style="position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,#06b6d4,#6366f1,transparent)"></div>
</div>

</body>
</html>`);

  win.document.close();
  setTimeout(() => win.print(), 800);
}


// ─────────────────────────────────────────────────────────────────────────────
// PREVIEW PAGE
// ─────────────────────────────────────────────────────────────────────────────
const sections = [
  { num: '01', title: 'Contexto Editorial', desc: 'El derecho en la era de la IA generativa', icon: <BookOpen className="w-4 h-4" /> },
  { num: '02', title: 'Diagnóstico & Estadísticas', desc: 'Datos WEF · Thomson Reuters · McKinsey · Stanford', icon: <Target className="w-4 h-4" /> },
  { num: '03', title: 'Nuevas Competencias', desc: '9 competencias del abogado digital', icon: <Zap className="w-4 h-4" /> },
  { num: '04–06', title: 'Los 3 Módulos', desc: 'Blueprint completo · Timeline · Herramientas', icon: <Layers className="w-4 h-4" /> },
  { num: '07', title: 'LexPrompt Architect', desc: '7 pasos · 8 capas de protección · Multi-export', icon: <FileText className="w-4 h-4" /> },
  { num: '08', title: 'Toolkit IA Jurídica', desc: 'Tabla comparativa · 7 plataformas', icon: <Globe className="w-4 h-4" /> },
  { num: '09', title: 'Workflows Jurídicos', desc: '3 flujos multi-IA probados', icon: <ChevronRight className="w-4 h-4" /> },
  { num: '10', title: 'Riesgos & Desafíos', desc: 'Alucinaciones · Confidencialidad · Responsabilidad', icon: <Shield className="w-4 h-4" /> },
  { num: '11–13', title: 'Resultados · Equipo · CTA', desc: 'Certificación · Autoridades · Inscripción', icon: <Users className="w-4 h-4" /> },
];

export default function DossierPage() {
  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-white/[0.06] bg-[oklch(0.07_0.015_250/0.9)] backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors text-xs">
              <ArrowLeft className="w-3.5 h-3.5" />
              Volver
            </Link>
            <div className="w-px h-4 bg-white/[0.08]" />
            <span className="text-sm font-semibold text-white">Dossier DIAT 2026</span>
            <span className="hidden sm:inline text-[10px] mono text-zinc-600 px-2 py-0.5 border border-zinc-700/40 rounded-full">
              Documento editorial premium
            </span>
          </div>
          <motion.button
            onClick={() => generateDossierPDF(modules, equipoEjecutor)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Generar Dossier PDF
          </motion.button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10 space-y-10">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[oklch(0.08_0.025_220)] to-[oklch(0.07_0.02_260)] overflow-hidden p-8 sm:p-12"
        >
          {/* grid bg */}
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
          {/* glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-64 bg-cyan-500/8 blur-3xl rounded-full pointer-events-none" />

          <div className="relative">
            {/* badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              {[
                { label: 'DIAT', color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400' },
                { label: 'FD · PUCV', color: 'border-indigo-500/30 bg-indigo-500/8 text-indigo-400' },
                { label: 'VCM', color: 'border-purple-500/30 bg-purple-500/8 text-purple-400' },
              ].map(b => (
                <span key={b.label} className={`text-[10px] mono font-bold px-3 py-1 rounded-full border ${b.color}`}>
                  {b.label}
                </span>
              ))}
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none mb-3">
              DIAT Prompting Hub
              <br />
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg,#06b6d4,#6366f1)' }}
              >
                Dossier 2026
              </span>
            </h1>
            <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed mb-6">
              IA Jurídica Aplicada, Prompt Engineering y Nuevas Competencias Digitales para el Derecho.
              {' '}<span className="text-zinc-200 font-medium">Documento editorial premium</span>{' '}
              para difusión académica, LinkedIn, correo institucional y respaldo institucional.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <motion.button
                onClick={() => generateDossierPDF(modules, equipoEjecutor)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                Generar y abrir Dossier PDF
              </motion.button>
              <div className="text-xs text-zinc-600 mono">
                ~13 páginas · A4 · Cyberpunk dark
              </div>
            </div>
          </div>
        </motion.div>

        {/* Specs strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { val: '13', label: 'secciones editoriales' },
            { val: 'A4', label: 'vertical · print-ready' },
            { val: 'Dark', label: 'cyberpunk minimalista' },
            { val: 'ES', label: 'Español · Chile' },
          ].map(({ val, label }) => (
            <div key={label} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 text-center">
              <div className="text-xl font-bold mono text-cyan-400">{val}</div>
              <div className="text-xs text-zinc-600 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Contents table */}
        <div className="space-y-3">
          <div className="text-[10px] mono font-bold text-zinc-600 uppercase tracking-widest">
            Contenido del documento
          </div>
          <div className="space-y-1.5">
            {sections.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-cyan-500/20 hover:bg-cyan-500/5 transition-all group"
              >
                <div className="w-14 h-8 flex items-center justify-center shrink-0">
                  <span className="text-[10px] mono font-bold text-zinc-700 group-hover:text-cyan-600 transition-colors">{s.num}</span>
                </div>
                <div className="w-px h-6 bg-white/[0.05] shrink-0" />
                <div className="text-zinc-500 group-hover:text-cyan-500 transition-colors shrink-0">
                  {s.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors">{s.title}</div>
                  <div className="text-xs text-zinc-600">{s.desc}</div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-cyan-500 transition-colors shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Usage note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl border border-indigo-500/15 bg-indigo-500/5 p-4"
        >
          <p className="text-xs text-zinc-400 leading-relaxed">
            <span className="text-indigo-400 font-semibold">Instrucciones:</span>{' '}
            Haz clic en "Generar Dossier PDF". Se abrirá una nueva ventana con el documento completo.
            Usa <kbd className="px-1.5 py-0.5 rounded bg-white/[0.07] border border-white/[0.1] text-zinc-400 text-[10px]">Ctrl+P</kbd> (o el diálogo de impresión)
            → "Guardar como PDF" para descargarlo. Optimizado para A4, móvil y LinkedIn.
            Requiere conexión a internet para cargar las tipografías.
          </p>
        </motion.div>

      </div>
    </div>
  );
}
