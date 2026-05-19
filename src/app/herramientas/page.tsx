'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Cpu, Filter } from 'lucide-react';
import { tools, levelColors, toolColors, toolIconColors } from '@/data/tools';
import type { Tool } from '@/lib/types';

const toolIcons: Record<string, React.ReactNode> = {
  claude: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
    </svg>
  ),
};

const categories = ['Todas', 'LLM Jurídico', 'LLM General', 'LLM Multimodal', 'Investigación IA', 'Búsqueda IA', 'Automatización', 'Infraestructura'];
const levels = ['Todos', 'Básico', 'Intermedio', 'Avanzado'];

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const colors = toolColors[tool.color] ?? '';
  const iconColor = toolIconColors[tool.color] ?? 'text-zinc-400';
  const levelClass = levelColors[tool.level] ?? '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`group relative rounded-xl border bg-gradient-to-br ${colors} backdrop-blur-sm p-5 flex flex-col gap-4 transition-all duration-300 hover:shadow-lg cursor-default`}
    >
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl border border-current/20 flex items-center justify-center ${iconColor} bg-current/10`}>
          <Cpu className="w-5 h-5" />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`inline-flex px-2 py-0.5 rounded-full border text-[10px] font-medium ${levelClass}`}>
            {tool.level}
          </span>
          <span className="text-[10px] text-zinc-600 mono">M{tool.moduleId}</span>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-base font-bold text-white">{tool.name}</h3>
          <span className="text-[10px] px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-zinc-500">
            {tool.category}
          </span>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">{tool.description}</p>
      </div>

      <div className="border-t border-white/[0.07] pt-3">
        <div className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1.5 font-medium">Caso de uso jurídico</div>
        <p className="text-xs text-zinc-400 leading-relaxed">{tool.legalUseCase}</p>
      </div>

      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-auto flex items-center gap-1.5 text-xs font-medium ${iconColor} hover:opacity-70 transition-opacity`}
        onClick={(e) => e.stopPropagation()}
      >
        <ExternalLink className="w-3.5 h-3.5" />
        Abrir plataforma
      </a>
    </motion.div>
  );
}

export default function HerramientasPage() {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedLevel, setSelectedLevel] = useState('Todos');

  const filtered = tools.filter((t) => {
    const catMatch = selectedCategory === 'Todas' || t.category === selectedCategory;
    const lvlMatch = selectedLevel === 'Todos' || t.level === selectedLevel;
    return catMatch && lvlMatch;
  });

  return (
    <div className="px-4 lg:px-8 py-6 lg:py-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Biblioteca de Herramientas IA</h2>
        <p className="text-sm text-zinc-500 mt-1">Plataformas seleccionadas para la práctica jurídica con IA</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  selectedCategory === cat
                    ? 'border-cyan-500/50 bg-cyan-500/15 text-cyan-400'
                    : 'border-white/[0.07] bg-white/[0.02] text-zinc-500 hover:text-zinc-300 hover:border-white/15'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:ml-auto">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                selectedLevel === lvl
                  ? 'border-indigo-500/50 bg-indigo-500/15 text-indigo-400'
                  : 'border-white/[0.07] bg-white/[0.02] text-zinc-500 hover:text-zinc-300 hover:border-white/15'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((tool, i) => (
          <ToolCard key={tool.id} tool={tool} index={i} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-zinc-600">
            No hay herramientas con ese filtro.
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-4"
      >
        <p className="text-xs text-zinc-400 leading-relaxed">
          <span className="text-cyan-400 font-medium">Nota:</span> Todas las herramientas están disponibles en sus versiones gratuitas para los participantes del taller. Se recomienda crear cuentas antes del inicio del programa.
        </p>
      </motion.div>
    </div>
  );
}
