'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '@/components/ui/Reveal';

type Item = { pergunta: string; resposta: string };
type Props = {
  content: { kicker: string; titulo: string; subtitulo: string; itens: Item[] };
};

export default function Faq({ content }: Props) {
  const { kicker, itens } = content;
  const [aberto, setAberto] = useState<number | null>(null);

  return (
    <section
      id="faq"
      data-screen-label="FAQ"
      className="relative overflow-hidden px-6 py-[clamp(96px,10vw,152px)]"
      style={{ marginTop: '-2.5vw', clipPath: 'polygon(0 0, 100% 2.5vw, 100% 100%, 0 100%)', background: 'linear-gradient(190deg,#0C2149 0%,#0A1E40 45%,#071530 100%)' }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image src="/assets/salvador-farol.jpg" alt="" fill sizes="100vw" className="object-cover object-[50%_30%] opacity-[.26] [filter:saturate(.5)_contrast(1.05)]" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(190deg,rgba(12,33,73,.94) 0%,rgba(10,30,64,.92) 45%,rgba(7,21,48,.96) 100%)' }} />
      </div>

      <div className="relative mx-auto max-w-[900px]">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">{kicker}</span>
            <span className="block h-0.5 w-16 bg-gold" />
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mb-10 mt-5 font-serif text-[clamp(27px,3.2vw,36px)] font-medium tracking-[-0.01em] text-white">Antes de <span className="text-gold">conversar</span></h2>
        </Reveal>

        <div>
          {itens.map((it, i) => {
            const on = aberto === i;
            const last = i === itens.length - 1;
            return (
              <div key={i} className={`border-t border-gold/20 ${last ? 'border-b' : ''}`}>
                <button onClick={() => setAberto(on ? null : i)} aria-expanded={on} className="flex w-full items-center justify-between gap-6 py-6 text-left">
                  <span className="font-serif text-[21px] font-medium text-white">{it.pergunta}</span>
                  <span aria-hidden className="flex-none text-[22px] leading-none text-gold transition-transform duration-300" style={{ transform: on ? 'rotate(45deg)' : 'none' }}>+</span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                      <p className="mb-6 max-w-[68ch] text-[16px] leading-[1.7] text-cloud [text-wrap:pretty]">{it.resposta}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
