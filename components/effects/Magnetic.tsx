'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Envolve um elemento (ex.: botão) e o faz "seguir" levemente o cursor
 * quando o mouse passa por cima — efeito magnético premium.
 */
export default function Magnetic({
  children,
  className = '',
  strength = 0.35,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const xRaw = useMotionValue(0);
  const yRaw = useMotionValue(0);
  const x = useSpring(xRaw, { stiffness: 200, damping: 15, mass: 0.3 });
  const y = useSpring(yRaw, { stiffness: 200, damping: 15, mass: 0.3 });

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    xRaw.set((e.clientX - (r.left + r.width / 2)) * strength);
    yRaw.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function onLeave() {
    xRaw.set(0);
    yRaw.set(0);
  }

  return (
    <motion.span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x, y }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.span>
  );
}