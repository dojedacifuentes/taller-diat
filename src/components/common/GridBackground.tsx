'use client';
import { motion } from 'framer-motion';

export function GridBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.71 0.17 200 / 0.07) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 100% 80%, oklch(0.55 0.22 264 / 0.05) 0%, transparent 60%)',
        }}
      />
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, oklch(0.71 0.17 200 / 0.4) 50%, transparent 100%)',
        }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
