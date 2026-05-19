'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Check, X, Rocket } from 'lucide-react';
import { flashcards, categories } from '@/data/flashcards';

const catColors: Record<string, string> = {
  'Vocabulario IA': 'border-cyan-500/35 bg-cyan-500/8 text-cyan-400',
  'Prompting Jurídico': 'border-indigo-500/35 bg-indigo-500/8 text-indigo-400',
  'Herramientas': 'border-purple-500/35 bg-purple-500/8 text-purple-400',
  'Flujos Multi-IA': 'border-emerald-500/35 bg-emerald-500/8 text-emerald-400',
};

const funMessages = [
  '¡Excelente! La IA está orgullosa de ti (aunque no tiene emociones).',
  'Eso. El futuro del derecho se aprende así.',
  '¡Correcto! Un token más hacia la maestría.',
  'Muy bien. Claude te daría un 10.',
  '¡Sí! Eso es prompting jurídico de élite.',
];

export default function FlashcardsPage() {
  const [selectedCat, setSelectedCat] = useState<string>('Todos');
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [toReview, setToReview] = useState<Set<number>>(new Set());
  const [funMsg, setFunMsg] = useState('');
  const [direction, setDirection] = useState(1);

  const filtered = selectedCat === 'Todos'
    ? flashcards
    : flashcards.filter(c => c.category === selectedCat);

  const card = filtered[index];

  const go = useCallback((dir: number) => {
    setDirection(dir);
    setFlipped(false);
    setTimeout(() => {
      setIndex(i => (i + dir + filtered.length) % filtered.length);
    }, 80);
  }, [filtered.length]);

  const markKnown = () => {
    setKnown(prev => new Set([...prev, card.id]));
    setToReview(prev => { const n = new Set(prev); n.delete(card.id); return n; });
    setFunMsg(funMessages[Math.floor(Math.random() * funMessages.length)]);
    setTimeout(() => setFunMsg(''), 3000);
    go(1);
  };

  const markReview = () => {
    setToReview(prev => new Set([...prev, card.id]));
    setKnown(prev => { const n = new Set(prev); n.delete(card.id); return n; });
    go(1);
  };

  const reset = () => {
    setKnown(new Set()); setToReview(new Set());
    setIndex(0); setFlipped(false); setFunMsg('');
  };

  useEffect(() => {
    setIndex(0); setFlipped(false);
  }, [selectedCat]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === ' ') { e.preventDefault(); setFlipped(v => !v); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  const progress = filtered.length > 0 ? (known.size / filtered.length) * 100 : 0;

  if (!card) return null;

  const catColor = catColors[card.category] ?? 'border-zinc-500/30 bg-zinc-500/8 text-zinc-400';
  const isKnown = known.has(card.id);
  const isReview = toReview.has(card.id);

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
            <Rocket className="w-5 h-5 text-purple-400" />
          </span>
          Flashcards IA
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          30 cartas para dominar el idioma de la IA. Pulsa <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] mono">espacio</kbd> para voltear, <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] mono">←→</kbd> para navegar.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              selectedCat === cat
                ? 'border-cyan-500/50 bg-cyan-500/15 text-cyan-400'
                : 'border-white/[0.07] text-zinc-500 hover:text-zinc-300 hover:border-white/15'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <span className="text-xs text-zinc-500 mono whitespace-nowrap">
          {known.size}/{filtered.length} dominadas
        </span>
        <button onClick={reset} className="text-zinc-600 hover:text-zinc-400 transition-colors">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Counter */}
      <div className="flex items-center justify-between text-xs text-zinc-600">
        <span className="mono">{index + 1} / {filtered.length}</span>
        <div className="flex gap-3">
          {known.size > 0 && <span className="text-emerald-500">✓ {known.size} dominadas</span>}
          {toReview.size > 0 && <span className="text-yellow-500">↩ {toReview.size} a repasar</span>}
        </div>
      </div>

      {/* Card */}
      <div className="relative h-64 sm:h-72 cursor-pointer" onClick={() => setFlipped(v => !v)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${card.id}-${flipped}`}
            initial={{ opacity: 0, rotateY: flipped ? -90 : 90, scale: 0.95 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            exit={{ opacity: 0, rotateY: flipped ? 90 : -90, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={`absolute inset-0 rounded-2xl border p-6 flex flex-col ${
              isKnown ? 'border-emerald-500/30 bg-emerald-500/5' :
              isReview ? 'border-yellow-500/30 bg-yellow-500/5' :
              'border-white/[0.08] bg-[oklch(0.09_0.017_250/0.8)]'
            }`}
          >
            {/* Card header */}
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${catColor}`}>
                {card.category}
              </span>
              <span className="text-[10px] text-zinc-600 mono">{flipped ? 'RESPUESTA' : 'PREGUNTA'}</span>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              {!flipped ? (
                <>
                  <div className="text-4xl mb-4">{card.emoji}</div>
                  <p className="text-lg font-bold text-white leading-tight">{card.front}</p>
                  <p className="text-xs text-zinc-600 mt-3">Pulsa para ver la respuesta</p>
                </>
              ) : (
                <>
                  <p className="text-sm text-zinc-200 leading-relaxed font-medium">{card.back}</p>
                  {card.funFact && (
                    <div className="mt-4 px-3 py-2 rounded-lg border border-cyan-500/15 bg-cyan-500/5 w-full">
                      <p className="text-[11px] text-cyan-400 leading-relaxed">💡 {card.funFact}</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Status badge */}
            {(isKnown || isReview) && (
              <div className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center ${
                isKnown ? 'bg-emerald-500/30' : 'bg-yellow-500/30'
              }`}>
                {isKnown ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="text-[10px]">↩</span>}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fun message */}
      <AnimatePresence>
        {funMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-xs text-emerald-400 font-medium"
          >
            🎉 {funMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <motion.button
          onClick={() => go(-1)}
          whileTap={{ scale: 0.9 }}
          className="w-11 h-11 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:border-white/15 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        {flipped && (
          <div className="flex items-center gap-3">
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={markReview}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-yellow-500/25 bg-yellow-500/8 text-yellow-400 text-sm font-medium hover:bg-yellow-500/15 transition-all"
            >
              <X className="w-4 h-4" /> A repasar
            </motion.button>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={markKnown}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-500/25 bg-emerald-500/8 text-emerald-400 text-sm font-medium hover:bg-emerald-500/15 transition-all"
            >
              <Check className="w-4 h-4" /> Ya lo sé
            </motion.button>
          </div>
        )}

        {!flipped && (
          <motion.button
            onClick={() => setFlipped(true)}
            className="px-5 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-400 text-sm hover:border-white/15 hover:text-zinc-200 transition-all"
          >
            Ver respuesta
          </motion.button>
        )}

        <motion.button
          onClick={() => go(1)}
          whileTap={{ scale: 0.9 }}
          className="w-11 h-11 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:border-white/15 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Completion banner */}
      {known.size === filtered.length && filtered.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/8 p-5 text-center"
        >
          <div className="text-2xl mb-2">🎓</div>
          <div className="font-bold text-emerald-400">¡Categoría dominada!</div>
          <p className="text-xs text-zinc-500 mt-1">Ya hablas el idioma de la IA. El taller de septiembre te va a encantar.</p>
          <button onClick={reset} className="mt-3 text-xs text-zinc-500 hover:text-zinc-300 transition-colors underline">
            Repasar de nuevo
          </button>
        </motion.div>
      )}
    </div>
  );
}
