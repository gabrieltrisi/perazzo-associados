'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/** Linha dourada fina no topo mostrando o progresso de leitura da página. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25, mass: 0.2 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[120] h-[3px] origin-left bg-gradient-to-r from-gold to-gold-deep"
    />
  );
}