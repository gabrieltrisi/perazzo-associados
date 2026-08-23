'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LuShieldCheck, LuArrowUpRight, LuAward, LuReceiptText, LuMapPin, LuScale } from 'react-icons/lu';
import Hero3D from '@/components/three/Hero3D';

type Stat = { valor: string; label: string };
type HeroContent = {
  badge: string;
  titulo1: string;
  titulo2: string;
  titulo2Destaque: string;
  subtitulo: string;
  ctaPrimario: string;
  ctaSecundario: string;
  perfil: { nome: string; cargo: string; descricao: string; nota: string };
  stats: Stat[];
};

const STAT_ICONS = [LuAward, LuReceiptText, LuMapPin, LuScale];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.15 + i * 0.09, ease: [0.16, 1, 0.3, 1] as const } }),
};

export default function Hero({ content }: { content: HeroContent }) {
  const c = content;
  const perfil = c.perfil ?? { nome: '', cargo: '', descricao: '', nota: '' };
  const stats = c.stats ?? [];
  // destaque em dourado no titulo2 (ex.: "ao tribunal.")
  const t2 = c.titulo2Destaque
    ? (c.titulo2 ?? '').split(c.titulo2Destaque)
    : [c.titulo2 ?? ''];

  return (
    <section id="top" className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-navy px-6 pt-36 md:pt-[148px]">
      {/* Animação 3D de fundo (WebGL, client-only, respeita reduced-motion) */}
      <Hero3D />

      {/* Scrim de legibilidade — escurece esquerda/base pro texto, deixa o 3D aparecer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(58% 50% at 26% 72%, rgba(7,21,48,.72) 0%, transparent 72%), radial-gradient(40% 34% at 74% 26%, rgba(199,169,111,.08) 0%, transparent 72%), linear-gradient(180deg, rgba(10,30,64,.28) 0%, rgba(7,21,48,.82) 100%)',
        }}
      />

      {/* Balança decorativa (CSS puro) */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[44%] hidden h-[440px] w-[760px] -translate-x-1/2 -translate-y-1/2 text-steel opacity-[.17] md:block animate-[pzFloat_16s_ease-in-out_infinite_alternate]">
        <div className="absolute left-[calc(50%-7px)] top-0 h-3.5 w-3.5 rounded-full border-2 border-current" />
        <div className="absolute left-[calc(50%-1px)] top-3.5 h-[300px] w-0.5 bg-current" />
        <div className="absolute left-[calc(50%-300px)] top-[66px] h-0.5 w-[600px] bg-current" />
        <div className="absolute left-[calc(50%-390px)] top-[134px] h-[86px] w-[180px] rounded-b-full border-2 border-t-0 border-current" />
        <div className="absolute left-[calc(50%+210px)] top-[134px] h-[86px] w-[180px] rounded-b-full border-2 border-t-0 border-current" />
        <div className="absolute left-[calc(50%-60px)] top-[306px] h-0.5 w-[120px] bg-current" />
        <div className="absolute left-[calc(50%-90px)] top-[316px] h-0.5 w-[180px] bg-current" />
      </div>

      {/* Foto do Dr. Perazzo */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 z-[1] h-[86%] w-[min(540px,44vw)] -translate-x-1/2"
        style={{ WebkitMaskImage: 'linear-gradient(180deg,#000 0%,#000 74%,transparent 98%)', maskImage: 'linear-gradient(180deg,#000 0%,#000 74%,transparent 98%)' }}
      >
        <Image src="/assets/perazzo-hero.png" alt="Mário Wellington Perazzo, advogado" fill priority sizes="540px" className="object-contain object-bottom [filter:drop-shadow(0_24px_60px_rgba(0,0,0,.5))_saturate(.92)]" />
      </div>

      {/* Grid principal */}
      <div className="relative z-[2] mx-auto grid w-full max-w-content grid-cols-1 items-center gap-8 pb-10 lg:grid-cols-[minmax(0,430px)_1fr_minmax(0,330px)]">
        <div>
          <motion.div initial="hidden" animate="show" custom={0} variants={fadeUp} className="mb-6 inline-flex items-center gap-3 rounded-full border border-gold/30 bg-navy-deep/50 py-2 pl-2.5 pr-4 backdrop-blur-sm">
            <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-gold/15 text-gold"><LuShieldCheck className="h-[13px] w-[13px]" /></span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">{c.badge}</span>
          </motion.div>

          <h1 className="font-serif text-[clamp(38px,5.2vw,60px)] font-medium leading-[1.06] tracking-[-0.02em] text-white">
            <motion.span initial="hidden" animate="show" custom={1} variants={fadeUp} className="block">{c.titulo1}</motion.span>
            <motion.span initial="hidden" animate="show" custom={2} variants={fadeUp} className="block">
              {t2[0]}<span className="text-gold">{c.titulo2Destaque}</span>{t2[1] ?? ''}
            </motion.span>
          </h1>

          <motion.p initial="hidden" animate="show" custom={3} variants={fadeUp} className="mt-6 text-[17px] leading-[1.7] text-cloud">{c.subtitulo}</motion.p>

          <motion.div initial="hidden" animate="show" custom={4} variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="#contato" className="group inline-flex items-center gap-3 whitespace-nowrap rounded-full bg-gold py-[7px] pl-6 pr-[7px] text-[15px] font-semibold text-navy-deep transition hover:bg-gold-deep">
              {c.ctaPrimario}
              <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-navy-deep text-gold transition group-hover:translate-x-0.5"><LuArrowUpRight className="h-4 w-4" /></span>
            </Link>
            <Link href="#areas" className="border-b border-gold/45 py-3.5 text-[15px] font-semibold text-white transition hover:border-gold hover:text-gold">{c.ctaSecundario} →</Link>
          </motion.div>
        </div>

        <div aria-hidden className="hidden lg:block" />

        {/* Card de perfil */}
        <motion.div initial="hidden" animate="show" custom={5} variants={fadeUp} className="grid justify-items-end gap-5">
          <div className="w-full rounded-xl border border-gold/25 bg-navy-deep/60 p-[22px] shadow-[0_12px_40px_rgba(0,0,0,.28)] backdrop-blur-md">
            <div className="flex items-center gap-3">
              <Image src="/assets/retrato-perfil.jpg" alt={perfil.nome} width={44} height={44} className="h-11 w-11 rounded-full border border-gold/40 object-cover object-[50%_28%]" />
              <div>
                <div className="text-sm font-semibold text-white">{perfil.nome}</div>
                <div className="mt-0.5 text-[11px] uppercase tracking-[0.1em] text-gold">{perfil.cargo}</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-[1.65] text-cloud">{perfil.descricao}</p>
            <div className="mt-4 flex items-center gap-2.5 border-t border-gold/20 pt-3.5">
              <span className="text-[11px] text-gold">◆</span>
              <span className="text-xs text-slate2">{perfil.nota}</span>
            </div>
          </div>
          <Link href="#diagnostico" className="inline-flex items-center gap-3 whitespace-nowrap rounded-full border border-gold/70 bg-navy-deep/60 py-[7px] pl-[22px] pr-[7px] text-sm font-semibold text-gold backdrop-blur-sm transition hover:bg-gold/15">
            Iniciar meu diagnóstico
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/15"><LuArrowUpRight className="h-[15px] w-[15px]" /></span>
          </Link>
        </motion.div>
      </div>

      {/* Faixa de mini-stats */}
      <motion.div initial="hidden" animate="show" custom={6} variants={fadeUp} className="relative z-[2] mx-auto grid w-full max-w-content grid-cols-2 gap-7 border-t border-gold/20 py-7 pb-[clamp(64px,7vw,104px)] md:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = STAT_ICONS[i] ?? LuScale;
          return (
            <div key={i} className="flex items-center gap-3.5">
              <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full bg-gold/10 text-gold"><Icon className="h-[18px] w-[18px]" /></span>
              <div>
                <div className="font-tight text-[22px] font-medium tabular-nums text-white">{s.valor}</div>
                <div className="mt-0.5 text-[13px] text-slate2">{s.label}</div>
              </div>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
