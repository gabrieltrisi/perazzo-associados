'use client';

import { useRef, useState } from 'react';
import { useScroll, useTransform, useMotionValueEvent, motion } from 'framer-motion';
import Reveal from '@/components/ui/Reveal';
import { LuCalculator, LuBookOpen, LuTruck, LuGraduationCap, LuBuilding2 } from 'react-icons/lu';
import type { IconType } from 'react-icons';

const ICONS: Record<string, IconType> = { calculator: LuCalculator, book: LuBookOpen, truck: LuTruck, cap: LuGraduationCap, building: LuBuilding2 };

export type Marco = { lado: string; icone: string; titulo: string; texto: string };

const CARD = 'rounded-[14px] border border-line bg-white p-6 shadow-[0_10px_30px_rgba(10,30,64,.07)] transition duration-200 hover:-translate-y-1 hover:border-gold';

function CardContent({ m, right }: { m: Marco; right: boolean }) {
  const Icon = ICONS[m.icone] ?? LuBuilding2;
  return (
    <>
      <div className={`flex items-start gap-3 ${right ? 'flex-row-reverse' : ''}`}>
        <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full bg-gold/15 text-gold-dark"><Icon className="h-[18px] w-[18px]" /></span>
        <h3 className="min-w-0 flex-1 font-serif text-[21px] font-medium leading-[1.3]">{m.titulo}</h3>
      </div>
      <p className="mt-3 text-base leading-[1.7] text-muted">{m.texto}</p>
    </>
  );
}

function Node({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      className="block h-[13px] w-[13px] rounded-full border-2 transition-colors duration-300"
      style={{
        background: on ? '#C7A96F' : '#F7F6F2',
        borderColor: on ? '#C7A96F' : '#40537B',
        boxShadow: `0 0 0 6px rgba(247,246,242,.9)${on ? ', 0 0 0 8px rgba(199,169,111,.18)' : ''}`,
      }}
    />
  );
}

export default function Timeline({ marcos }: { marcos: Marco[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: gridRef, offset: ['start 55%', 'end 65%'] });
  const fillHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const [prog, setProg] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', setProg);
  const count = marcos.length;
  const nodeOn = (i: number) => prog >= (i + 0.5) / count;

  return (
    <>
      {/* Desktop: grid 1fr 64px 1fr, cards alternando + linha que preenche */}
      <div ref={gridRef} className="relative mt-4 hidden md:grid" style={{ gridTemplateColumns: '1fr 64px 1fr', rowGap: '40px', alignItems: 'center' }}>
        <div aria-hidden className="absolute bottom-0 top-0 w-0.5 overflow-hidden rounded" style={{ left: '50%', marginLeft: '-1px', background: 'rgba(64,83,123,.18)' }}>
          <motion.div className="absolute left-0 top-0 w-full rounded" style={{ height: fillHeight, background: 'linear-gradient(180deg,#C7A96F 0%,#AA8F5D 100%)' }} />
        </div>
        {marcos.map((m, i) => {
          const left = m.lado === 'esq';
          const card = (
            <Reveal key={`c${i}`} delay={0.05 + i * 0.05} style={{ gridColumn: left ? 1 : 3 }} className={`${CARD} ${left ? 'text-right' : ''}`}>
              <CardContent m={m} right={left} />
            </Reveal>
          );
          const node = <div key={`n${i}`} style={{ gridColumn: 2 }} className="flex justify-center"><Node on={nodeOn(i)} /></div>;
          const empty = <div key={`e${i}`} style={{ gridColumn: left ? 3 : 1 }} />;
          return left ? [card, node, empty] : [empty, node, card];
        })}
      </div>

      {/* Mobile: empilhada, linha à esquerda */}
      <div className="relative mt-10 md:hidden">
        <div aria-hidden className="absolute bottom-0 left-[13px] top-0 w-0.5 bg-navy-light/20" />
        <div className="flex flex-col gap-6">
          {marcos.map((m, i) => (
            <Reveal key={i} delay={0.04 * i} className="relative pl-10">
              <span aria-hidden className="absolute left-[13px] top-6 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-navy-light bg-offwhite shadow-[0_0_0_5px_rgba(247,246,242,.9)]" />
              <article className={CARD}>
                <CardContent m={m} right={false} />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}
