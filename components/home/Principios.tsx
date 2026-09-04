'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '@/components/ui/Reveal';
import { LuCompass, LuEye } from 'react-icons/lu';

type Valor = { titulo: string; desc: string };
type Props = {
  content: {
    kicker: string; titulo: string; tituloDestaque?: string;
    missao: string; visao: string; valores: Valor[];
  };
};

export default function Principios({ content }: Props) {
  const { kicker, titulo, tituloDestaque, missao, visao, valores } = content;
  const tp = tituloDestaque ? titulo.split(tituloDestaque) : [titulo];
  const [sel, setSel] = useState(0);

  return (
    <section
      id="principios"
      data-screen-label="Princípios"
      className="relative overflow-hidden bg-gradient-to-b from-white via-offwhite to-cream px-6 py-[clamp(96px,10vw,152px)] text-ink"
      style={{ marginTop: '-2.5vw', clipPath: 'polygon(0 2.5vw, 100% 0, 100% 100%, 0 100%)' }}
    >
      <div className="relative mx-auto max-w-content">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-deep">{kicker}</span>
            <span className="block h-0.5 w-16 bg-gold" />
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-5 font-serif text-[clamp(27px,3.2vw,36px)] font-medium tracking-[-0.01em]">{tp[0]}<span className="text-gold-dark">{tituloDestaque}</span>{tp[1] ?? ''}</h2>
        </Reveal>

        {/* Missão / Visão */}
        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Missão — card escuro */}
          <Reveal>
            <article className="relative h-full overflow-hidden rounded-[18px] border border-gold/35 p-[clamp(28px,3vw,40px)] text-white" style={{ background: 'linear-gradient(150deg,#0A1E40 0%,#071530 100%)' }}>
              <div aria-hidden className="pointer-events-none absolute -bottom-[110px] -right-[90px] font-serif leading-[.8] text-navy-light opacity-[.16]" style={{ fontSize: '300px' }}>P</div>
              <div className="relative flex items-center gap-3.5">
                <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-gold text-navy-deep"><LuCompass className="h-[21px] w-[21px]" /></span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">Missão</span>
              </div>
              <p className="relative mt-6 font-serif text-[clamp(19px,2vw,23px)] leading-[1.5] text-white [text-wrap:pretty]">{missao}</p>
            </article>
          </Reveal>

          {/* Visão — card branco com foto */}
          <Reveal delay={0.08}>
            <article className="flex h-full flex-col overflow-hidden rounded-[18px] border border-line bg-white shadow-[0_12px_36px_rgba(10,30,64,.07)]">
              <div className="h-[190px] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/equipe.jpg" alt="Equipe do escritório Perazzo & Associados" loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: '50% 30%', filter: 'saturate(.9)' }} />
              </div>
              <div className="border-l-[3px] border-gold p-[clamp(24px,2.6vw,34px)]">
                <div className="flex items-center gap-3">
                  <span className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-gold/15 text-gold-dark"><LuEye className="h-[18px] w-[18px]" /></span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-deep">Visão</span>
                </div>
                <p className="mt-4 text-[16px] leading-[1.7] text-muted [text-wrap:pretty]">{visao}</p>
              </div>
            </article>
          </Reveal>
        </div>

        {/* Valores — pills interativos */}
        <div className="mt-[clamp(48px,5vw,72px)] border-t border-[#E1DFD6] pt-9">
          <Reveal>
            <div className="flex flex-wrap items-baseline gap-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-deep">Valores</span>
              <span className="block h-0.5 w-16 bg-gold" />
              <h3 className="font-serif text-[clamp(21px,2.2vw,26px)] font-medium">{valores.length} compromissos · toque em cada um para ler</h3>
            </div>
          </Reveal>
          <div className="mt-6 flex flex-wrap gap-3">
            {valores.map((v, i) => {
              const on = sel === i;
              return (
                <button
                  key={i}
                  onClick={() => setSel(i)}
                  aria-pressed={on}
                  className={`rounded-full border px-[22px] py-3 text-[13px] font-medium transition duration-200 ${on ? '-translate-y-0.5 border-gold bg-gold/[0.14] text-ink' : 'border-gold/55 bg-white text-ink hover:-translate-y-0.5 hover:border-gold hover:bg-gold/[0.08]'}`}
                >
                  {v.titulo}
                </button>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={sel}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-[68ch] border-l-2 border-gold pl-[18px] text-[16px] leading-[1.7] text-muted"
            >
              {valores[sel]?.desc}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
