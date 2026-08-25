'use client';

import { motion } from 'framer-motion';

type Marco = { marco: string; titulo: string; texto: string };

// Linha do tempo vertical: eixo dourado, marcos que se revelam ao rolar.
export default function Timeline({ itens }: { itens: Marco[] }) {
  return (
    <ol className="relative ml-3 border-l border-gold/30 pl-8">
      {itens.map((it, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="relative pb-10 last:pb-0"
        >
          <span className="absolute -left-[41px] top-1 grid h-5 w-5 place-items-center rounded-full border border-gold bg-offwhite">
            <span className="h-2 w-2 rounded-full bg-gold" />
          </span>
          <span className="font-serif text-sm font-semibold tracking-wide text-gold">{it.marco}</span>
          <h3 className="mt-1 text-h3 text-navy">{it.titulo}</h3>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">{it.texto}</p>
        </motion.li>
      ))}
    </ol>
  );
}