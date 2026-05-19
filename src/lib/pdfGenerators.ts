// ─────────────────────────────────────────────────────────────────────────────
// Shared PDF generators — called from client components on click
// No 'use client' needed here (pure functions, no React)
// ─────────────────────────────────────────────────────────────────────────────
import type { Module } from '@/lib/types';

type EquipoMember = {
  readonly id: string;
  readonly name: string;
  readonly rol: string;
  readonly calidad: string;
  readonly initials: string;
  readonly color: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// DOSSIER PDF — Premium editorial document (13 sections)
// ─────────────────────────────────────────────────────────────────────────────
export function generateDossierPDF(
  mods: Module[],
  equipo: readonly EquipoMember[],
): void {
  const win = window.open('', '_blank');
  if (!win) return;

  const modAccent = ['#06b6d4', '#818cf8', '#a855f7'];
  const modBg = ['rgba(6,182,212,.1)', 'rgba(129,140,248,.1)', 'rgba(168,85,247,.1)'];
  const modBorder = ['rgba(6,182,212,.25)', 'rgba(129,140,248,.25)', 'rgba(168,85,247,.25)'];
  const modLabel = ['MÓDULO 01', 'MÓDULO 02', 'MÓDULO 03'];

  const modulePages = mods.map((mod, i) => `
<div class="page page-dark" style="padding:0">
  <div style="height:4px;background:linear-gradient(90deg,${modAccent[i]},${modAccent[i]}44,transparent)"></div>
  <div style="padding:44px 52px 36px">
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
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-bottom:28px">
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
      <div>
        <div class="col-label" style="color:${modAccent[i]}">Contenidos del módulo</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${mod.contents.map(c => `
          <div style="display:flex;gap:8px;align-items:flex-start;padding:8px 10px;border-radius:8px;background:${modBg[i]};border:1px solid ${modBorder[i]}">
            <span style="font-size:12px;color:#94a3b8;line-height:1.5">◦ ${c}</span>
          </div>`).join('')}
        </div>
      </div>
    </div>
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

  const equipoHTML = equipo.map(m => `
<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:10px;border:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.02)">
  <div style="width:38px;height:38px;border-radius:9px;border:1px solid rgba(6,182,212,.3);background:rgba(6,182,212,.1);display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:10px;color:#67e8f9;flex-shrink:0">${m.initials}</div>
  <div>
    <div style="font-size:12px;font-weight:700;color:#e2e8f0">${m.name}</div>
    <div style="font-size:10px;color:#64748b;margin-top:1px">${m.calidad}${m.id === 'ee-01' ? ' · Subdirector de los Talleres' : ''}</div>
  </div>
</div>`).join('');

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
    .col-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px; font-weight: 700;
      letter-spacing: .18em; text-transform: uppercase;
      color: #334155; margin-bottom: 12px;
    }
    .section-eyebrow {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px; font-weight: 700;
      letter-spacing: .2em; text-transform: uppercase;
      color: #06b6d4; margin-bottom: 12px;
    }
    .section-title {
      font-size: 30px; font-weight: 800;
      color: #f8fafc; letter-spacing: -.025em;
      line-height: 1.1; margin-bottom: 16px;
    }
    .body-text { font-size: 13px; color: #94a3b8; line-height: 1.75; }
    .pullquote {
      font-size: 18px; font-weight: 700;
      color: #e2e8f0; line-height: 1.45;
      letter-spacing: -.01em;
      border-left: 3px solid #06b6d4;
      padding-left: 20px;
    }
    .stat-card {
      padding: 22px; border-radius: 12px;
      border: 1px solid rgba(255,255,255,.08);
      background: rgba(255,255,255,.03);
    }
    .stat-number {
      font-family: 'JetBrains Mono', monospace;
      font-size: 44px; font-weight: 900;
      line-height: 1; margin-bottom: 6px;
    }
    .stat-label { font-size: 12px; color: #64748b; line-height: 1.4; }
    .stat-source {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8px; color: #1e293b;
      margin-top: 10px; letter-spacing: .08em;
    }
    table { border-collapse: collapse; width: 100%; }
    thead tr { background: rgba(6,182,212,.08); border-bottom: 1px solid rgba(6,182,212,.2); }
    thead th {
      padding: 10px 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5px; font-weight: 700;
      letter-spacing: .12em; text-transform: uppercase;
      color: #67e8f9; text-align: left;
    }
    tbody tr { border-bottom: 1px solid rgba(255,255,255,.04); }
    tbody td { padding: 10px 12px; font-size: 11px; color: #94a3b8; vertical-align: top; line-height: 1.5; }
    .td-name { font-weight: 700; color: #e2e8f0; font-family: 'JetBrains Mono', monospace; font-size: 11px; }
    .td-free-yes  { color: #6ee7b7; font-weight: 700; font-family: 'JetBrains Mono', monospace; font-size: 10px; }
    .td-free-partial { color: #fcd34d; font-weight: 600; font-family: 'JetBrains Mono', monospace; font-size: 10px; }
    .risk-card { padding: 16px 18px; border-radius: 10px; border-left: 3px solid; }
    .risk-high { border-color: #f87171; background: rgba(248,113,113,.06); }
    .risk-med  { border-color: #fbbf24; background: rgba(251,191,36,.06); }
    .risk-low  { border-color: #94a3b8; background: rgba(148,163,184,.04); }
    .risk-title { font-size: 12px; font-weight: 700; color: #e2e8f0; margin-bottom: 4px; }
    .risk-desc  { font-size: 11px; color: #64748b; line-height: 1.5; }
    .risk-badge {
      display: inline-block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8px; font-weight: 700;
      letter-spacing: .1em; padding: 2px 7px;
      border-radius: 3px; margin-bottom: 6px;
    }
    .rb-high { background: rgba(248,113,113,.15); color: #fca5a5; }
    .rb-med  { background: rgba(251,191,36,.15);  color: #fde68a; }
    .rb-low  { background: rgba(148,163,184,.12); color: #94a3b8; }
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

<!-- PAGE 1: COVER -->
<div class="page page-darker grid-overlay scan-overlay" style="padding:0;display:flex;flex-direction:column">
  <div style="position:absolute;top:-80px;left:50%;transform:translateX(-50%);width:500px;height:300px;background:radial-gradient(ellipse,rgba(6,182,212,.12),transparent 70%);pointer-events:none"></div>
  <div style="position:absolute;top:40%;right:-60px;width:280px;height:280px;background:radial-gradient(ellipse,rgba(99,102,241,.08),transparent 70%);pointer-events:none"></div>
  <div style="padding:28px 52px 0;display:flex;align-items:center;justify-content:space-between;position:relative;z-index:1">
    <div style="display:flex;align-items:center;gap:10px">
      <span style="font-family:'JetBrains Mono',monospace;font-weight:900;font-size:11px;letter-spacing:.15em;padding:5px 12px;border-radius:6px;border:1px solid rgba(6,182,212,.4);background:rgba(6,182,212,.1);color:#67e8f9">DIAT</span>
      <span style="font-family:'JetBrains Mono',monospace;font-size:9.5px;padding:5px 12px;border-radius:6px;border:1px solid rgba(129,140,248,.3);background:rgba(129,140,248,.08);color:#a5b4fc">FD · PUCV</span>
      <span style="font-family:'JetBrains Mono',monospace;font-size:9.5px;padding:5px 12px;border-radius:6px;border:1px solid rgba(168,85,247,.3);background:rgba(168,85,247,.08);color:#d8b4fe">VCM</span>
    </div>
    <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#1e293b">2026.1 · ES · DOSSIER</div>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 60px;position:relative;z-index:1">
    <div style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.3em;color:#334155;text-transform:uppercase;margin-bottom:28px">
      Programa de Formación Aplicada · Septiembre 2026
    </div>
    <h1 style="font-size:58px;font-weight:900;color:#f8fafc;letter-spacing:-.04em;line-height:1;margin-bottom:16px">
      DIAT<br><span style="color:#06b6d4">Prompting</span><br>Hub
    </h1>
    <p style="font-size:15px;font-weight:500;color:#64748b;line-height:1.6;max-width:400px;margin-bottom:36px">
      IA Jurídica Aplicada, Prompt Engineering y<br>Nuevas Competencias Digitales para el Derecho
    </p>
    <div style="max-width:440px;padding:20px 28px;border-radius:12px;border:1px solid rgba(6,182,212,.15);background:rgba(6,182,212,.04)">
      <p style="font-size:14px;font-weight:600;color:#e2e8f0;line-height:1.55;font-style:italic">
        "La próxima ventaja competitiva del abogado<br>será metodológica."
      </p>
    </div>
  </div>
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
  <div style="height:3px;background:linear-gradient(90deg,transparent,#06b6d4,#6366f1,transparent)"></div>
</div>


<!-- PAGE 2: CONTEXTO EDITORIAL -->
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
    <div style="padding:18px;border-radius:10px;border:1px solid rgba(6,182,212,.15);background:rgba(6,182,212,.05)">
      <div style="font-size:18px;margin-bottom:10px">${c.icon}</div>
      <div style="font-size:11.5px;font-weight:700;color:#e2e8f0;margin-bottom:5px">${c.label}</div>
      <div style="font-size:10.5px;color:#64748b;line-height:1.5">${c.desc}</div>
    </div>`).join('')}
  </div>
</div>


<!-- PAGE 3: STATS -->
<div class="page page-mid">
  <div class="section-eyebrow">02 · Diagnóstico</div>
  <h2 class="section-title">¿Por qué este programa?</h2>
  <p class="body-text" style="max-width:580px;margin-bottom:28px">
    Los datos globales son contundentes. La adopción de IA en el sector jurídico es acelerada,
    desigual y frecuentemente acrítica. El riesgo no es la IA en sí: es la brecha entre
    quienes la usan con metodología y quienes la usan sin ella.
  </p>
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


<!-- PAGE 4: COMPETENCIAS -->
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
      { icon: '💼', title: 'LegalTech Aplicado', desc: 'Evaluación y uso de plataformas especializadas: Harvey AI, Clio, Thomson Reuters AI', color: 'rgba(129,140,248,.1)', border: 'rgba(129,140,248,.2)' },
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


<!-- MODULES (dynamic) -->
${modulePages}


<!-- PAGE: PROMPT LAB -->
<div class="page page-dark">
  <div class="section-eyebrow">07 · Herramienta</div>
  <h2 class="section-title">LexPrompt Architect</h2>
  <p class="body-text" style="max-width:560px;margin-bottom:24px">
    El DIAT Prompting Hub incluye una herramienta interactiva de construcción de prompts
    jurídicos profesionales. 7 pasos guiados, 8 capas de protección, exportación multi-formato.
    <strong style="color:#e2e8f0">Ingeniería jurídica aplicada a IA.</strong>
  </p>
  <div class="accent-rule"></div>
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
  <div>
    <div class="col-label">Capas de protección integradas</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px">
      ${['🛡️ Anti-alucinaciones','🔒 Ciberseguridad','📚 Fuentes verificables','🚫 Confidencialidad','📋 Verificación normativa','📐 Control de formato','🎯 Límite de scope','❓ Clarificación previa'].map(l => `
      <span style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:600;padding:5px 12px;border-radius:20px;border:1px solid rgba(129,140,248,.3);background:rgba(129,140,248,.08);color:#a5b4fc">${l}</span>`).join('')}
    </div>
  </div>
</div>


<!-- PAGE: TOOLKIT -->
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
        { name:'ChatGPT', tag:'OpenAI', best:'Borradores rápidos, GPTs personalizados, plugins de terceros', limit:'Contexto limitado, alucinaciones frecuentes en leyes', use:'Redacción inicial, brainstorming jurídico, workflows con plugins', free:'Freemium' },
        { name:'Gemini', tag:'Google', best:'PDFs adjuntos sin copiar, integración nativa con Drive, Docs y Sheets', limit:'Razonamiento jurídico muy técnico', use:'Análisis de documentos PDF, resúmenes ejecutivos con Drive', free:'Freemium' },
        { name:'NotebookLM', tag:'Google', best:'Investigar exclusivamente dentro de tus propios documentos subidos', limit:'Solo responde sobre tus fuentes, no genera libremente', use:'Síntesis de doctrina, análisis de sentencias propias', free:'Gratuito' },
        { name:'Perplexity', tag:'Perplexity AI', best:'Búsqueda con fuentes citables y verificables, datos legislativos actuales', limit:'No redacta documentos ni hace análisis profundo', use:'Búsqueda de legislación, normativa reciente, referencias', free:'Freemium' },
        { name:'Harvey AI', tag:'Harvey', best:'Asistente legal especializado: investigación, redacción y due diligence', limit:'Acceso enterprise, costo elevado', use:'Grandes estudios: revisión contractual, M&A, litigación', free:'Enterprise' },
        { name:'Thomson Reuters AI', tag:'Thomson Reuters', best:'Base de datos jurídica con IA integrada, jurisprudencia verificada', limit:'Suscripción profesional requerida', use:'Investigación legal verificada, análisis de precedentes', free:'Pago' },
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


<!-- PAGE: WORKFLOWS -->
<div class="page page-dark">
  <div class="section-eyebrow">09 · Metodología</div>
  <h2 class="section-title">Workflows Jurídicos con IA</h2>
  <p class="body-text" style="max-width:560px;margin-bottom:28px">
    La formación DIAT entrega flujos de trabajo probados que transforman tareas
    de horas en procesos de minutos, sin sacrificar rigor profesional.
  </p>
  ${[
    {
      title: 'Flujo de Investigación Jurídica', sub: 'Para cualquier área desde cero',
      time: '30–45 min', replaces: '4–6 horas de trabajo manual', color: '#06b6d4',
      steps: [
        { tool:'Perplexity', action:'Legislación y jurisprudencia actual con fuentes citadas' },
        { tool:'NotebookLM', action:'Corpus propio: sube sentencias, pregúntale directamente' },
        { tool:'Claude', action:'Síntesis final verificada y redacción del documento' },
      ],
    },
    {
      title: 'Flujo para Litigación', sub: 'Preparación de audiencias y recursos',
      time: '60–90 min', replaces: '1 día completo de preparación', color: '#818cf8',
      steps: [
        { tool:'Gemini', action:'Sube el expediente PDF y extrae hechos clave automáticamente' },
        { tool:'Claude', action:'Análisis estratégico y construcción del argumentario' },
        { tool:'ChatGPT', action:'Genera el escrito en el formato del tribunal requerido' },
      ],
    },
    {
      title: 'Flujo para Contratos', sub: 'Redacción y revisión contractual',
      time: '20–40 min', replaces: '2–3 horas de redacción', color: '#a855f7',
      steps: [
        { tool:'Claude', action:'Redacta el contrato con cláusulas esenciales del área' },
        { tool:'ChatGPT', action:'Identifica riesgos y cláusulas faltantes o ambiguas' },
        { tool:'Claude', action:'Integra observaciones y genera la versión definitiva' },
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
        ${j < wf.steps.length - 1 ? '<div style="font-size:14px;color:#1e293b;flex-shrink:0">→</div>' : ''}`).join('')}
    </div>
  </div>`).join('')}
</div>


<!-- PAGE: RISKS -->
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
      { title:'Alucinaciones y Errores Factuales', desc:'Los LLMs inventan jurisprudencia, artículos y datos con total confianza. Sin verificación sistemática, el output puede ser jurídicamente peligroso.', sev:'CRÍTICO', cls:'risk-high', bcls:'rb-high' },
      { title:'Confidencialidad Profesional', desc:'Subir datos de clientes a plataformas públicas de IA puede violar el secreto profesional y la legislación de protección de datos personales.', sev:'CRÍTICO', cls:'risk-high', bcls:'rb-high' },
      { title:'Dependencia Tecnológica', desc:'La delegación excesiva en IA puede atrofiar competencias de razonamiento jurídico fundamentales para el ejercicio profesional independiente.', sev:'ALTO', cls:'risk-med', bcls:'rb-med' },
      { title:'Sesgos en Outputs', desc:'Los modelos entrenados con datos históricos pueden reproducir sesgos jurídicos o geográficos que no corresponden al sistema legal chileno.', sev:'ALTO', cls:'risk-med', bcls:'rb-med' },
      { title:'Marco Regulatorio IA', desc:'La regulación de IA generativa está en construcción a nivel global. El abogado debe monitorear la evolución normativa que afecta su praxis profesional.', sev:'MEDIO', cls:'risk-low', bcls:'rb-low' },
      { title:'Responsabilidad Profesional', desc:'El uso de IA no transfiere responsabilidad al sistema. El abogado sigue siendo responsable de todo output que presente como propio ante clientes y tribunales.', sev:'CRÍTICO', cls:'risk-high', bcls:'rb-high' },
    ].map(r => `
    <div class="risk-card ${r.cls}">
      <span class="risk-badge ${r.bcls}">${r.sev}</span>
      <div class="risk-title">${r.title}</div>
      <div class="risk-desc">${r.desc}</div>
    </div>`).join('')}
  </div>
</div>


<!-- PAGE: OUTCOMES -->
<div class="page page-dark">
  <div class="section-eyebrow">11 · Resultados</div>
  <h2 class="section-title">Lo que el participante<br>podrá hacer al terminar</h2>
  <div class="accent-rule" style="margin-bottom:28px"></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:28px">
    ${[
      { out:'Construir prompts jurídicos avanzados con 7 capas de estructura y protección', icon:'⚡' },
      { out:'Diseñar workflows multi-IA para producción documental verificable', icon:'🔄' },
      { out:'Usar IA con criterio profesional: supervisión, verificación y trazabilidad', icon:'🧠' },
      { out:'Analizar documentos extensos con Claude: contratos, expedientes, sentencias', icon:'📄' },
      { out:'Proteger la confidencialidad del cliente en entornos de IA generativa', icon:'🛡️' },
      { out:'Crear agentes jurídicos personalizados con system prompts de producción', icon:'🤖' },
      { out:'Comprender el marco regulatorio de IA y su impacto en responsabilidad profesional', icon:'⚖️' },
      { out:'Evaluar el ecosistema legaltech global y aplicar criterio de adopción profesional', icon:'💼' },
    ].map(o => `
    <div style="display:flex;align-items:flex-start;gap:12px;padding:14px 16px;border-radius:10px;border:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.02)">
      <div style="font-size:18px;flex-shrink:0">${o.icon}</div>
      <p style="font-size:12px;color:#94a3b8;line-height:1.5">${o.out}</p>
    </div>`).join('')}
  </div>
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


<!-- PAGE: REGISTRATION + TEAM -->
<div class="page page-darker grid-overlay">
  <div style="height:2px;background:linear-gradient(90deg,#06b6d4,#6366f144,transparent);margin:-44px -52px 40px;width:calc(100% + 104px)"></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px">
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
        <p style="font-size:10.5px;color:#ca8a04;line-height:1.5">⚠ Fechas tentativas sujetas a ajustes institucionales.</p>
      </div>
    </div>
    <div>
      <div class="section-eyebrow">13 · Equipo</div>
      <h2 style="font-size:24px;font-weight:800;color:#f8fafc;letter-spacing:-.02em;margin-bottom:16px;line-height:1.2">
        Dirección institucional<br>y equipo ejecutor
      </h2>
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
      <div class="col-label">Integrantes Programa DIAT</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
        ${equipo.map(m => `
        <div style="padding:8px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.05);background:rgba(255,255,255,.02)">
          <div style="font-size:11px;font-weight:600;color:#cbd5e1">${m.name}</div>
          <div style="font-size:9px;color:#475569;margin-top:1px">${m.calidad}</div>
        </div>`).join('')}
      </div>
    </div>
  </div>
</div>


<!-- PAGE: BACK COVER -->
<div class="page page-darker grid-overlay scan-overlay" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:400px;height:400px;background:radial-gradient(ellipse,rgba(6,182,212,.08),transparent 70%);pointer-events:none"></div>
  <div style="position:relative;z-index:1">
    <div style="font-family:'JetBrains Mono',monospace;font-size:72px;font-weight:900;color:rgba(6,182,212,.15);letter-spacing:.1em;line-height:1;margin-bottom:20px">DIAT</div>
    <div style="margin-bottom:24px">
      <div style="font-size:16px;font-weight:800;color:#f8fafc;margin-bottom:6px">Programa DIAT 2026</div>
      <div style="font-size:12px;color:#475569">IA Jurídica Aplicada · Facultad de Derecho PUCV</div>
    </div>
    <div style="font-size:13px;font-style:italic;color:#334155;max-width:360px;margin:0 auto 28px">
      "Construye criterio antes de automatizar."
    </div>
    <div style="display:flex;justify-content:center;gap:12px;margin-bottom:20px">
      <span style="font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:700;padding:4px 10px;border-radius:5px;border:1px solid rgba(6,182,212,.3);background:rgba(6,182,212,.08);color:#67e8f9">DIAT</span>
      <span style="font-family:'JetBrains Mono',monospace;font-size:9px;padding:4px 10px;border-radius:5px;border:1px solid rgba(129,140,248,.3);background:rgba(129,140,248,.08);color:#a5b4fc">FD · PUCV</span>
      <span style="font-family:'JetBrains Mono',monospace;font-size:9px;padding:4px 10px;border-radius:5px;border:1px solid rgba(168,85,247,.3);background:rgba(168,85,247,.08);color:#d8b4fe">VCM</span>
    </div>
    <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#1e293b">
      programadiat@pucv.cl · Septiembre 2026 · Valparaíso, Chile
    </div>
  </div>
  <div style="position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,#06b6d4,#6366f1,transparent)"></div>
</div>

</body>
</html>`);

  win.document.close();
  setTimeout(() => win.print(), 900);
}


// ─────────────────────────────────────────────────────────────────────────────
// GUÍA DE USOS JURÍDICOS PDF
// ─────────────────────────────────────────────────────────────────────────────
export function generateGuiaJuridicaPDF(): void {
  const win = window.open('', '_blank');
  if (!win) return;
  const date = new Date().toLocaleDateString('es-CL');

  win.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Guía de Usos Jurídicos con IA — DIAT 2026</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@300;400;600;700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    @page { size: A4 portrait; margin: 0; }
    body {
      font-family: 'Space Grotesk', sans-serif;
      background: #07090f;
      color: #cbd5e1;
      width: 210mm;
      margin: 0 auto;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      width: 210mm; min-height: 297mm;
      page-break-after: always;
      position: relative; overflow: hidden;
      padding: 44px 52px;
    }
    .page:last-child { page-break-after: auto; }
    .p-dark  { background: #070b12; }
    .p-mid   { background: #09101a; }
    .p-cover { background: #04060c; }
    .grid::before {
      content: ''; position: absolute; inset: 0;
      background-image: linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px);
      background-size: 28px 28px; pointer-events: none;
    }
    .scan::after {
      content: ''; position: absolute; inset: 0;
      background: repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.04) 2px,rgba(0,0,0,.04) 4px);
      pointer-events: none;
    }
    .eyebrow { font-family:'JetBrains Mono',monospace; font-size:9.5px; font-weight:700; letter-spacing:.2em; text-transform:uppercase; color:#06b6d4; margin-bottom:10px; }
    .h1 { font-size:32px; font-weight:800; color:#f8fafc; letter-spacing:-.02em; line-height:1.1; margin-bottom:14px; }
    .h2 { font-size:22px; font-weight:800; color:#f8fafc; letter-spacing:-.02em; line-height:1.1; margin-bottom:12px; }
    .body { font-size:12.5px; color:#94a3b8; line-height:1.75; }
    .rule { height:1px; background:linear-gradient(90deg,#06b6d4,#6366f188,transparent); margin:20px 0; }
    .label { font-family:'JetBrains Mono',monospace; font-size:8.5px; font-weight:700; letter-spacing:.15em; text-transform:uppercase; color:#334155; margin-bottom:10px; }
    .chip {
      font-family:'JetBrains Mono',monospace; font-size:9.5px; font-weight:700;
      padding:3px 10px; border-radius:5px;
    }
    .prompt-box {
      font-family:'JetBrains Mono',monospace; font-size:10.5px; line-height:1.75;
      color:#cbd5e1; background:rgba(6,182,212,.04);
      border:1px solid rgba(6,182,212,.15); border-left:3px solid #06b6d4;
      border-radius:0 10px 10px 0; padding:16px 18px;
      white-space:pre-wrap; word-break:break-word;
      margin-bottom:10px;
    }
    .tool-header {
      display:flex; align-items:center; gap:12px;
      padding:14px 16px; border-radius:10px;
      margin-bottom:14px;
    }
    .tool-icon { font-size:22px; flex-shrink:0; }
    .tool-name { font-size:15px; font-weight:800; color:#f8fafc; }
    .tool-tag  { font-family:'JetBrains Mono',monospace; font-size:9px; color:#475569; margin-top:2px; }
    .checklist-item {
      display:flex; align-items:flex-start; gap:10px;
      padding:10px 14px; border-radius:8px;
      border:1px solid rgba(255,255,255,.05);
      background:rgba(255,255,255,.02);
      margin-bottom:7px;
    }
    .check-icon { font-size:12px; flex-shrink:0; margin-top:1px; }
    .check-text { font-size:11px; color:#94a3b8; line-height:1.5; }
    .check-crit { color:#f87171; font-size:9px; font-family:'JetBrains Mono',monospace; font-weight:700; margin-top:2px; }
    table { border-collapse:collapse; width:100%; }
    thead tr { background:rgba(6,182,212,.08); border-bottom:1px solid rgba(6,182,212,.2); }
    thead th { padding:9px 12px; font-family:'JetBrains Mono',monospace; font-size:8px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:#67e8f9; text-align:left; }
    tbody tr { border-bottom:1px solid rgba(255,255,255,.04); }
    tbody td { padding:9px 12px; font-size:11px; color:#94a3b8; vertical-align:top; line-height:1.4; }
    .td-bold { font-weight:700; color:#e2e8f0; font-family:'JetBrains Mono',monospace; }
    .td-cyan { color:#67e8f9; font-weight:700; font-family:'JetBrains Mono',monospace; font-size:10px; }
  </style>
</head>
<body>

<!-- COVER -->
<div class="page p-cover grid scan" style="padding:0;display:flex;flex-direction:column">
  <div style="position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:480px;height:280px;background:radial-gradient(ellipse,rgba(6,182,212,.1),transparent 70%);pointer-events:none"></div>
  <div style="padding:26px 52px 0;display:flex;align-items:center;justify-content:space-between;position:relative;z-index:1">
    <div style="display:flex;gap:8px">
      <span class="chip" style="border:1px solid rgba(6,182,212,.4);background:rgba(6,182,212,.1);color:#67e8f9">DIAT</span>
      <span class="chip" style="border:1px solid rgba(129,140,248,.3);background:rgba(129,140,248,.08);color:#a5b4fc">FD · PUCV</span>
    </div>
    <span style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#1e293b">${date}</span>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 60px;position:relative;z-index:1">
    <div style="font-family:'JetBrains Mono',monospace;font-size:9.5px;font-weight:700;letter-spacing:.28em;color:#334155;text-transform:uppercase;margin-bottom:22px">Guía de referencia profesional</div>
    <h1 style="font-size:46px;font-weight:900;color:#f8fafc;letter-spacing:-.04em;line-height:1;margin-bottom:14px">
      Usos Jurídicos<br><span style="color:#06b6d4">con IA</span>
    </h1>
    <p style="font-size:14px;color:#64748b;line-height:1.6;max-width:380px;margin-bottom:30px">
      Prompts recomendados, funciones esenciales y flujos multi-IA para el ejercicio profesional del derecho
    </p>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:380px;width:100%">
      ${[['5','herramientas IA'],['15+','prompts listos'],['3','flujos jurídicos']].map(([v,l]) => `
      <div style="padding:12px;border-radius:9px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.03);text-align:center">
        <div style="font-family:'JetBrains Mono',monospace;font-size:20px;font-weight:900;color:#06b6d4;line-height:1">${v}</div>
        <div style="font-size:9.5px;color:#475569;margin-top:3px">${l}</div>
      </div>`).join('')}
    </div>
  </div>
  <div style="padding:0 52px 26px;display:flex;justify-content:space-between;align-items:center;position:relative;z-index:1">
    <div style="font-size:11px;color:#334155">Facultad de Derecho · PUCV · Valparaíso</div>
    <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#1e293b">Septiembre 2026 · Fechas tentativas</div>
  </div>
  <div style="height:3px;background:linear-gradient(90deg,transparent,#06b6d4,#6366f1,transparent)"></div>
</div>


<!-- PAGE 2: HERRAMIENTAS + PROMPTS (Claude & ChatGPT) -->
<div class="page p-dark">
  <div class="eyebrow">01 · Plataformas y Prompts</div>
  <div class="h1" style="font-size:26px">Prompts recomendados por herramienta</div>
  <div class="rule"></div>

  <!-- Claude -->
  <div class="tool-header" style="background:rgba(234,88,12,.06);border:1px solid rgba(234,88,12,.2)">
    <span class="tool-icon">🤖</span>
    <div>
      <div class="tool-name">Claude <span style="font-size:10px;color:#f97316;font-family:'JetBrains Mono',monospace">Anthropic</span></div>
      <div class="tool-tag">Análisis profundo · 200k tokens · Documentos extensos · Razonamiento complejo</div>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px">
    ${[
      { caso:'Análisis de contrato', prompt:'Actúa como abogado especialista en derecho contractual chileno. Analiza el siguiente contrato e identifica: (1) cláusulas de riesgo, (2) obligaciones principales de cada parte, (3) vacíos o ambigüedades y (4) sugerencias de mejora. Cita el artículo específico del CC cuando aplique. [PEGAR CONTRATO]' },
      { caso:'Síntesis de expediente', prompt:'Eres un abogado litigante con experiencia en [área]. Lee el siguiente expediente judicial y genera: (1) resumen de hechos relevantes, (2) pretensiones de cada parte, (3) estado procesal actual y (4) identificación de los puntos de derecho controvertidos. Si algo no está claro, escribe [VERIFICAR]. [PEGAR EXPEDIENTE]' },
    ].map(p => `
    <div>
      <div class="label">${p.caso}</div>
      <div class="prompt-box" style="font-size:9.5px">${p.prompt}</div>
    </div>`).join('')}
  </div>

  <!-- ChatGPT -->
  <div class="tool-header" style="background:rgba(16,185,129,.06);border:1px solid rgba(16,185,129,.2)">
    <span class="tool-icon">💬</span>
    <div>
      <div class="tool-name">ChatGPT <span style="font-size:10px;color:#10b981;font-family:'JetBrains Mono',monospace">OpenAI</span></div>
      <div class="tool-tag">GPTs personalizados · Borradores rápidos · Brainstorming · Plugins</div>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
    ${[
      { caso:'Redacción de escrito', prompt:'Redacta un escrito de [tipo: demanda/recurso/memo] para el Juzgado de [tipo] de [ciudad]. Partes: [demandante] c/ [demandado]. Materia: [describe el conflicto en 2 líneas]. Estilo: formal, preciso, sin adornos. Incluye petición concreta al final. Si necesitas más información, pregunta antes de redactar.' },
      { caso:'Revisión de argumentos', prompt:'Analiza los siguientes argumentos jurídicos desde la perspectiva del abogado contrario. Identifica las 3 debilidades principales y sugiere cómo reforzarlos. Sé directo y específico. [PEGAR ARGUMENTOS]' },
    ].map(p => `
    <div>
      <div class="label">${p.caso}</div>
      <div class="prompt-box" style="font-size:9.5px">${p.prompt}</div>
    </div>`).join('')}
  </div>
</div>


<!-- PAGE 3: GEMINI, NOTEBOOKLM, PERPLEXITY -->
<div class="page p-mid">
  <div class="eyebrow">02 · Más herramientas</div>

  <!-- Gemini -->
  <div class="tool-header" style="background:rgba(59,130,246,.06);border:1px solid rgba(59,130,246,.2);margin-bottom:10px">
    <span class="tool-icon">💎</span>
    <div>
      <div class="tool-name">Gemini <span style="font-size:10px;color:#3b82f6;font-family:'JetBrains Mono',monospace">Google</span></div>
      <div class="tool-tag">PDFs adjuntos sin copiar · Google Drive/Docs · Multimodal</div>
    </div>
  </div>
  <div class="prompt-box" style="font-size:9.5px;margin-bottom:14px">Adjunta el PDF del contrato/sentencia directamente. Luego escribe: "Eres asistente jurídico. Analiza este documento y extrae: (1) partes involucradas, (2) objeto principal, (3) plazos críticos y (4) cláusulas de penalización o sanción. Responde solo con lo que está en el documento. Si hay ambigüedad, indícalo."</div>

  <!-- NotebookLM -->
  <div class="tool-header" style="background:rgba(99,102,241,.06);border:1px solid rgba(99,102,241,.2);margin-bottom:10px">
    <span class="tool-icon">📓</span>
    <div>
      <div class="tool-name">NotebookLM <span style="font-size:10px;color:#6366f1;font-family:'JetBrains Mono',monospace">Google</span></div>
      <div class="tool-tag">Solo responde sobre documentos subidos · Investigación verificable</div>
    </div>
  </div>
  <div class="prompt-box" style="font-size:9.5px;margin-bottom:14px">Sube tus sentencias, artículos de doctrina o normativa. Luego usa: "Basándote exclusivamente en los documentos subidos, ¿qué criterios han usado los tribunales para resolver [tema específico]? Cita el documento y el párrafo exacto donde encuentres cada criterio."</div>

  <!-- Perplexity -->
  <div class="tool-header" style="background:rgba(6,182,212,.06);border:1px solid rgba(6,182,212,.2);margin-bottom:10px">
    <span class="tool-icon">🔍</span>
    <div>
      <div class="tool-name">Perplexity <span style="font-size:10px;color:#06b6d4;font-family:'JetBrains Mono',monospace">Perplexity AI</span></div>
      <div class="tool-tag">Fuentes citables · Datos actuales · Legislación vigente</div>
    </div>
  </div>
  <div class="prompt-box" style="font-size:9.5px;margin-bottom:18px">¿Cuál es la normativa vigente en Chile sobre [tema jurídico específico]? Incluye número de ley, artículo específico y fecha de última modificación. Prioriza fuentes de bcn.cl, pjud.cl y diariooficial.cl. Indica si hay proyectos de ley en tramitación.</div>

  <div class="rule"></div>
  <div class="h2" style="font-size:16px;margin-bottom:14px">Tabla comparativa: ¿Cuándo usar cada IA?</div>
  <table>
    <thead><tr>
      <th>Herramienta</th>
      <th>Ideal para</th>
      <th>Evitar cuando</th>
      <th>Fortaleza jurídica</th>
    </tr></thead>
    <tbody>
      ${[
        ['🤖 Claude','Análisis profundo, documentos 50+ pág.','Necesitas datos actuales del día','Razonamiento legal complejo'],
        ['💬 ChatGPT','Borradores rápidos, GPTs personalizados','Precisión normativa crítica','Brainstorming y estructuración'],
        ['💎 Gemini','PDFs adjuntos, integración Google','Argumentación técnica muy compleja','Extracción de datos de documentos'],
        ['📓 NotebookLM','Investigar dentro de tus propios docs','Preguntas fuera de tus fuentes','Síntesis verificable con fuentes'],
        ['🔍 Perplexity','Legislación y normas actuales','Redacción extensa o análisis','Búsqueda con citas verificables'],
      ].map(([t,i,e,f]) => `
      <tr>
        <td class="td-bold">${t}</td>
        <td>${i}</td>
        <td style="color:#64748b">${e}</td>
        <td class="td-cyan">${f}</td>
      </tr>`).join('')}
    </tbody>
  </table>
</div>


<!-- PAGE 4: WORKFLOWS + SEGURIDAD -->
<div class="page p-dark">
  <div class="eyebrow">03 · Flujos y Seguridad</div>
  <div class="h1" style="font-size:24px;margin-bottom:20px">Flujos probados y protocolos de seguridad</div>

  ${[
    { title:'Investigación jurídica completa', color:'#06b6d4', time:'30–45 min', steps:[
      {t:'Perplexity',a:'Busca legislación vigente y jurisprudencia reciente con fuentes citadas'},
      {t:'NotebookLM',a:'Sube los documentos encontrados y analiza tu propio corpus de sentencias'},
      {t:'Claude',a:'Sintetiza, redacta el memo o informe final con verificación de fuentes'},
    ]},
    { title:'Preparación de audiencia', color:'#818cf8', time:'60–90 min', steps:[
      {t:'Gemini',a:'Adjunta el expediente PDF y extrae cronología de hechos y pretensiones'},
      {t:'Claude',a:'Construye el argumentario estratégico y anticipa argumentos contrarios'},
      {t:'ChatGPT',a:'Redacta el escrito en el formato requerido por el tribunal'},
    ]},
    { title:'Redacción de contrato', color:'#a855f7', time:'20–40 min', steps:[
      {t:'Claude',a:'Redacta el contrato con todas las cláusulas esenciales del área'},
      {t:'ChatGPT',a:'Identifica riesgos, cláusulas ambiguas y vacíos en el texto'},
      {t:'Claude',a:'Integra observaciones y genera la versión definitiva pulida'},
    ]},
  ].map(wf => `
  <div style="margin-bottom:14px;padding:14px 16px;border-radius:10px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.02)">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <div style="font-size:12px;font-weight:700;color:${wf.color}">${wf.title}</div>
      <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#475569">⏱ ${wf.time}</span>
    </div>
    <div style="display:flex;align-items:center;gap:6px">
      ${wf.steps.map((s, j) => `
      <div style="flex:1;padding:8px 10px;border-radius:7px;border:1px solid ${wf.color}2a;background:${wf.color}08">
        <div style="font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:700;color:${wf.color};margin-bottom:3px">${s.t}</div>
        <div style="font-size:9.5px;color:#64748b;line-height:1.4">${s.a}</div>
      </div>
      ${j < wf.steps.length-1 ? `<div style="font-size:12px;color:#1e293b;flex-shrink:0">→</div>` : ''}`).join('')}
    </div>
  </div>`).join('')}

  <div class="rule"></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
    <div>
      <div class="label" style="color:#f87171;border-bottom:1px solid rgba(248,113,113,.2);padding-bottom:6px;margin-bottom:10px">⚠ Seguridad — CRÍTICO</div>
      ${[
        'Anonimiza RUT, nombres y datos del cliente ANTES de pegar en la IA',
        'No uses IAs públicas para casos de alto perfil o con datos sensibles',
        'Nunca copies estrategia de litigación en ChatGPT o Gemini sin anonimizar',
        'Verifica los términos de uso de cada plataforma (retención de datos)',
      ].map(i => `
      <div class="checklist-item">
        <span class="check-icon">🔴</span>
        <span class="check-text">${i}</span>
      </div>`).join('')}
    </div>
    <div>
      <div class="label" style="color:#fbbf24;border-bottom:1px solid rgba(251,191,36,.2);padding-bottom:6px;margin-bottom:10px">🧠 Anti-alucinaciones</div>
      ${[
        '"Si no tienes certeza, escribe [VERIFICAR]" — en todos tus prompts',
        'Nunca uses jurisprudencia de IA sin verificarla en pjud.cl',
        'Siempre pide número de artículo exacto y nombre de ley',
        'Para doctrina: usa NotebookLM con tus libros, no la memoria del LLM',
      ].map(i => `
      <div class="checklist-item">
        <span class="check-icon">🟡</span>
        <span class="check-text">${i}</span>
      </div>`).join('')}
    </div>
  </div>
</div>


<!-- PAGE 5: BACK -->
<div class="page p-cover grid scan" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:350px;height:350px;background:radial-gradient(ellipse,rgba(6,182,212,.07),transparent 70%);pointer-events:none"></div>
  <div style="position:relative;z-index:1">
    <div style="font-family:'JetBrains Mono',monospace;font-size:56px;font-weight:900;color:rgba(6,182,212,.12);letter-spacing:.1em;line-height:1;margin-bottom:18px">DIAT</div>
    <div style="font-size:15px;font-weight:800;color:#f8fafc;margin-bottom:6px">Guía de Usos Jurídicos con IA</div>
    <div style="font-size:11px;color:#334155;margin-bottom:20px">Programa DIAT 2026 · Facultad de Derecho PUCV</div>
    <div style="font-size:12px;font-style:italic;color:#1e293b;margin-bottom:24px">"La IA amplifica tu criterio. Tú sigues siendo el abogado."</div>
    <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#1e293b">programadiat@pucv.cl · Septiembre 2026 · Valparaíso, Chile</div>
  </div>
  <div style="position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,#06b6d4,#6366f1,transparent)"></div>
</div>

</body></html>`);

  win.document.close();
  setTimeout(() => win.print(), 800);
}
