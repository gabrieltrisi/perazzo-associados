import Image from 'next/image';
import Link from 'next/link';
import { LuArrowUpRight, LuAward, LuReceiptText, LuMapPin, LuScale } from 'react-icons/lu';
import type { IconType } from 'react-icons';
import Reveal from '@/components/ui/Reveal';
import Counter from '@/components/effects/Counter';

type Indicador = { icone: string; valor: string; label: string; count?: number; suffix?: string };
type Props = {
  content: {
    eyebrow: string;
    titulo: string;
    destaque?: string;
    paragrafo1: string;
    paragrafo2: string;
    cta: string;
    indicadores: Indicador[];
  };
};

const ICONS: Record<string, IconType> = {
  award: LuAward,
  receipt: LuReceiptText,
  mappin: LuMapPin,
  scale: LuScale,
};

export default function QuemSomos({ content }: Props) {
  const c = content;
  const t = c.destaque ? c.titulo.split(c.destaque) : [c.titulo];

  return (
    <section
      id="quem-somos"
      data-screen-label="Quem é Perazzo"
      className="relative overflow-hidden bg-navy-deep px-6 pt-[clamp(72px,7vw,104px)] pb-[clamp(64px,6vw,92px)]"
    >
      {/* Fundo: foto do Dr. em evento, coberta por 2 scrims (esquerda p/ texto, topo/base) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          src="/assets/quem-e-perazzo.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[50%_22%] opacity-[.5] [filter:saturate(.42)_contrast(1.04)] md:opacity-[.3]"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(100deg, rgba(7,21,48,.97) 0%, rgba(7,21,48,.93) 42%, rgba(10,30,64,.8) 72%, rgba(10,30,64,.72) 100%)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(7,21,48,.9) 0%, transparent 22%, transparent 78%, rgba(7,21,48,.92) 100%)' }}
        />
      </div>

      <div className="relative z-[1] mx-auto max-w-content">
        <div className="grid items-center gap-[clamp(32px,5vw,80px)] [grid-template-columns:minmax(0,1fr)] min-[1150px]:[grid-template-columns:minmax(0,1.35fr)_minmax(0,1fr)]">
          {/* Coluna A — texto */}
          <div>
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="block h-0.5 w-12 bg-gold" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">{c.eyebrow}</span>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-[clamp(18px,2.4vw,26px)] font-serif text-[clamp(32px,4.4vw,54px)] font-medium leading-[1.08] tracking-[-0.02em] text-white [text-wrap:balance]">
                {t[0]}
                {c.destaque && <span className="text-gold">{c.destaque}</span>}
                {t[1] ?? ''}
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-[clamp(20px,2.4vw,28px)] max-w-[54ch] text-[clamp(16px,1.3vw,19px)] leading-[1.72] text-cloud [text-wrap:pretty]">{c.paragrafo1}</p>
            </Reveal>
            <Reveal delay={0.22}>
              <p className="mt-4 max-w-[54ch] text-[clamp(15px,1.15vw,17px)] leading-[1.72] text-slate2 [text-wrap:pretty]">{c.paragrafo2}</p>
            </Reveal>
            <Reveal delay={0.28}>
              <div className="mt-[clamp(28px,3.4vw,40px)]">
                <Link
                  href="#contato"
                  className="group inline-flex items-center gap-3 whitespace-nowrap rounded-full bg-gold py-[7px] pl-[26px] pr-[7px] text-[15px] font-semibold text-navy-deep shadow-[0_14px_40px_rgba(199,169,111,.2)] transition hover:bg-gold-deep"
                >
                  {c.cta}
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-deep text-gold transition group-hover:translate-x-0.5">
                    <LuArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Coluna B — 4 indicadores (3 colunas só entre 620–1150px; empilhado fora disso) */}
          <Reveal delay={0.18} className="grid gap-[26px] [grid-template-columns:1fr] min-[620px]:[grid-template-columns:repeat(3,minmax(0,1fr))] min-[1150px]:[grid-template-columns:1fr]">
            {c.indicadores.map((ind, i) => {
              const Icon = ICONS[ind.icone] ?? LuScale;
              return (
                <div key={i} className="flex items-center gap-3.5">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gold/10 text-gold">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <div>
                    <div className="font-sans text-[22px] font-medium tabular-nums text-white">
                      {typeof ind.count === 'number' ? <Counter to={ind.count} suffix={ind.suffix ?? ''} /> : ind.valor}
                    </div>
                    <div className="mt-[3px] text-[13px] text-slate2">{ind.label}</div>
                  </div>
                </div>
              );
            })}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
