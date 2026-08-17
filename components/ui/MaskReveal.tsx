'use client';

import { motion } from 'framer-motion';

/**
 * Revelação em máscara/cortina: o conteúdo sobe de trás de um recorte quando
 * entra na viewport. Usado em títulos de seção para um efeito mais sofisticado
 * que o fade simples.
 */
export default function MaskReveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div className="overflow-hidden">
      <motion.div
        className={className}
        initial={{ y: '110%' }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}