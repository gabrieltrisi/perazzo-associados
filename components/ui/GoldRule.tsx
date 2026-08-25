'use client';

import { motion } from 'framer-motion';

// Régua dourada que "se desenha" (largura 0 → cheia) ao entrar na viewport.
export default function GoldRule({ className = '' }: { className?: string }) {
  return (
    <motion.span
      className={`block h-[2px] w-16 origin-left bg-gold ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}