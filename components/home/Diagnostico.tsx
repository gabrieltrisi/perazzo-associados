'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LuArrowUpRight, LuSparkles } from 'react-icons/lu';
import { whatsappHref } from '@/lib/whatsapp';

type Opcao = { texto: string; peso: string };
type Pergunta = { pergunta: string; opcoes: Opcao[] };
type Props = {
  content: {
    kicker: string; titulo: string; tituloDestaque?: string; subtitulo: string; disclaimer: string;
    perguntas: Pergunta[];
    resultados: { A: string; B: string; C: string };
    cta: string;
  };
};

export default function Diagnostico({ content }: Props) {
  const { kicker, titulo, tituloDestaque, subtitulo, disclaimer, perguntas, resultados, cta } = content;
  const tp = tituloDestaque ? titulo.split(tituloDestaque) : [titulo];
  const [step, setStep] = useState(0);
  const [respostas, setRespostas] = useState<string[]>([]);
  const total = perguntas.length;
  const done = step >= total;

  function escolher(peso: string) {
    const next = [...respostas];
    next[step] = peso;
    setRespostas(next);
    setStep(step + 1);
  }
  function reiniciar() {
    setRespostas([]);
    setStep(0);
  }

  const validas = respostas.filter((p) => p && p !== '-');
  const contagem = validas.reduce<Record<string, number>>((acc, p) => ({ ...acc, [p]: (acc[p] || 0) + 1 }), {});
  const chave = (['A', 'B', 'C'] as Array<'A' | 'B' | 'C'>).sort((a, b) => (contagem[b] || 0) - (contagem[a] || 0))[0] || 'C';
  const wpp = whatsappHref('Olá! Fiz o diagnóstico no site e gostaria de conversar sobre o meu caso.');
  const progresso = Math.min(step + (done ? 0 : 1), total);

  return (
    <section
      id="diagnostico"
      data-screen-label="Diagnóstico"
      className="relative overflow-hidden px-6 py-[clamp(96px,10vw,152px)] text-ink"
      style={{ marginTop: '-2.5vw', clipPath: 'polygon(0 2.5vw, 100% 0, 100% 100%, 0 100%)', background: 'linear-gradient(180deg,#EDEBE3 0%,#F7F6F2 40%,#FFFFFF 100%)' }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image src="/assets/salvador-pelourinho.jpg" alt="" fill sizes="100vw" className="object-cover object-[50%_12%] opacity-[.26] [filter:saturate(.5)_contrast(1.05)]" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(237,235,227,.88) 0%,rgba(247,246,242,.84) 40%,rgba(255,255,255,.92) 100%)' }} />
      </div>

      <div className="relative mx-auto max-w-[820px]">
        <div className="text-center">
          <div className="flex flex-col items-center gap-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-deep">{kicker}</span>
            <span className="block h-0.5 w-16 bg-gold" />
          </div>
          <h2 className="mt-6 font-serif text-[clamp(27px,3.2vw,36px)] font-medium tracking-[-0.01em] [text-wrap:balance]">{tp[0]}<span className="text-gold-dark">{tituloDestaque}</span>{tp[1] ?? ''}</h2>
          <p className="mx-auto mt-4 max-w-[56ch] text-[clamp(17px,1.7vw,20px)] leading-[1.7] text-muted">{subtitulo}</p>
        </div>

        {/* Card do quiz (escuro) */}
        <div className="relative mt-12 overflow-hidden rounded-[18px] border border-gold/30 shadow-[0_30px_70px_rgba(10,30,64,.28)]" style={{ background: 'linear-gradient(150deg,#0A1E40 0%,#071530 100%)' }}>
          <div aria-hidden className="pointer-events-none absolute -right-[120px] -top-[120px] h-[380px] w-[380px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(199,169,111,.16) 0%, transparent 65%)' }} />
          {/* progresso */}
          <div className="h-1 bg-white/10">
            <motion.div className="h-1" style={{ background: 'linear-gradient(90deg,#AA8F5D,#C7A96F)' }} initial={false} animate={{ width: `${(Math.min(step, total) / total) * 100}%` }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} />
          </div>
          <div className="relative p-[clamp(28px,4vw,44px)] text-white">
            <div className="min-h-[248px]">
              <AnimatePresence mode="wait">
                {!done ? (
                  <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                    <div className="flex items-center gap-3.5">
                      <span className="font-sans text-[12px] tabular-nums tracking-[0.16em] text-gold">{String(step + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
                      <span className="h-px flex-1 bg-gold/20" />
                    </div>
                    <h3 className="mt-[18px] font-serif text-[clamp(22px,2.4vw,28px)] font-medium leading-[1.25]">{perguntas[step].pergunta}</h3>
                    <div className="mt-6 grid gap-3">
                      {perguntas[step].opcoes.map((o, i) => (
                        <button
                          key={i}
                          onClick={() => escolher(o.peso)}
                          className="group flex min-h-[52px] items-center justify-between gap-4 rounded-[10px] border border-gold/25 bg-white/[0.04] px-5 py-4 text-left text-[16px] text-white transition hover:translate-x-1 hover:border-gold hover:bg-gold/[0.12]"
                        >
                          {o.texto}
                          <span aria-hidden className="text-gold opacity-70 transition group-hover:opacity-100">→</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="resultado" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
                    <div className="inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-gold/[0.14] px-4 py-2">
                      <LuSparkles className="h-[14px] w-[14px] text-gold" />
                      <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">Resultado</span>
                    </div>
                    <p className="mt-5 font-serif text-[clamp(20px,2.2vw,26px)] leading-[1.45] text-white [text-wrap:pretty]">{resultados[chave]}</p>
                    <div className="mt-[30px] border-t border-gold/20 pt-6">
                      <p className="text-[13px] leading-[1.7] text-slate2">{disclaimer}</p>
                      <div className="mt-[22px] flex flex-wrap items-center gap-[18px]">
                        <Link href={wpp} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 whitespace-nowrap rounded-full bg-gold py-[7px] pl-6 pr-[7px] text-[15px] font-semibold text-navy-deep transition hover:bg-gold-deep">
                          {cta}
                          <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-navy-deep text-gold transition group-hover:translate-x-0.5"><LuArrowUpRight className="h-4 w-4" /></span>
                        </Link>
                        <button onClick={reiniciar} className="border-b border-slate2/40 pb-1 text-[14px] font-medium text-slate2 transition hover:text-gold">Refazer o diagnóstico</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {!done && <p className="mt-6 text-[12px] leading-[1.6] text-slate2">Etapa {progresso} de {total} · sem cadastro para ver o resultado.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
