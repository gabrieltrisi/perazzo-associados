'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * Monograma "P" gigante em marca d'água, com parallax no scroll.
 * Colocar dentro de uma section `relative` — fica de fundo, baixa opacidade.
 */
export default function ParallaxMonogram({
  side = 'right',
}: {
  side?: 'left' | 'right';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.span
        style={{ y }}
        className={`absolute top-1/2 -translate-y-1/2 select-none font-serif text-[24rem] leading-none text-gold/[0.05] ${
          side === 'right' ? '-right-16' : '-left-16'
        }`}
      >
        P
      </motion.span>
    </div>
  );
}