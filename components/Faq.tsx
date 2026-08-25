'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

type Item = { pergunta: string; resposta: string };

// Accordion acessível: <button> com aria-expanded/aria-controls e painel role="region".
export default function Faq({ itens }: { itens: Item[] }) {
  const [aberto, setAberto] = useState<number | null>(0);

  return (
    <div className="divide-y divide-navy/10 overflow-hidden rounded-card border border-navy/10 bg-white">
      {itens.map((it, i) => {
        const isOpen = aberto === i;
        return (
          <div key={i}>
            <h3>
              <button
                type="button"
                id={`faq-btn-${i}`}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                onClick={() => setAberto(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-offwhite/60"
              >
                <span className="font-serif text-lg text-navy">{it.pergunta}</span>
                <FiChevronDown
                  aria-hidden
                  className={`shrink-0 text-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  size={20}
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="panel"
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted">{it.resposta}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}