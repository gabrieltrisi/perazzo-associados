'use client';

import { useState, useEffect, Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LuShieldCheck, LuArrowUpRight, LuFactory, LuBriefcase, LuScale } from 'react-icons/lu';
import type { IconType } from 'react-icons';

type Passo = { icone: string; titulo: string };
type Stat = { valor: string; label: string };
type HeroContent = {
  badge: string;
  titulo1: string;
  titulo2: string;
  titulo2Destaque: string;
  subtitulo: string;
  ctaPrimario: string;
  ctaSecundario: string;
  perfil?: { nome: string; cargo: string; descricao: string; nota: string };
  passos?: Passo[];
  stats?: Stat[];
};

const PASSO_ICONS: Record<string, IconType> = {
  factory: LuFactory,
  briefcase: LuBriefcase,
  scale: LuScale,
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.15 + i * 0.09, ease: [0.16, 1, 0.3, 1] as const } }),
};

export default function Hero({ content }: { content: HeroContent }) {
  const c = content;
  const passos = c.passos ?? [];
  // destaque em dourado no titulo2 (ex.: "negócio")
  const t2 = c.titulo2Destaque ? (c.titulo2 ?? '').split(c.titulo2Destaque) : [c.titulo2 ?? ''];

  // Parallax 3D em camadas: cada camada (cena, Dr., texto) segue o mouse com uma
  // profundidade diferente → sensação de 3D. Só desktop, respeita "reduzir movimento".
  // Jornada (Linha de producao -> Cadeira de CEO -> Direito): os circulos acendem
  // um a um e a linha dourada preenche entre eles. Tempos identicos ao playHero()
  // do artefato: passo em 1080/1800/2520ms, preenchimento 70ms depois de cada passo.
  // O ULTIMO passo ja nasce aceso (e o destino), so pulsa quando a sequencia chega nele.
  const ultimo = Math.max(0, passos.length - 1);
  const [aceso, setAceso] = useState<boolean[]>(() => passos.map((_, i) => i === ultimo));
  const [preenchido, setPreenchido] = useState<boolean[]>(() => passos.map(() => false));
  const [pulso, setPulso] = useState<number | null>(null);
  useEffect(() => {
    if (passos.length === 0) return;
    const marcar = (arr: boolean[], i: number) => arr.map((v, k) => (k === i ? true : v));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setAceso(passos.map(() => true));
      setPreenchido(passos.map(() => true));
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    passos.forEach((_, i) => {
      const tPasso = 1080 + i * 720;
      timers.push(setTimeout(() => {
        setAceso((p) => marcar(p, i));
        setPulso(i);
        timers.push(setTimeout(() => setPulso((atual) => (atual === i ? null : atual)), 460));
      }, tPasso));
      if (i < passos.length - 1) {
        timers.push(setTimeout(() => setPreenchido((p) => marcar(p, i)), tPasso + 70));
      }
    });
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passos.length]);

  const [par, setPar] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() =>
        setPar({ x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 }),
      );
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="top" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-navy px-6 pt-32 md:pt-[120px]">
      {/* Camada 1 (fundo, profundidade distante) — a cena: cidade, martelo, livros */}
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          transform: `scale(1.06) translate(${par.x * -7}px, ${par.y * -5}px)`,
          transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <Image
          src="/assets/hero-bg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_56%] opacity-[0.62] md:object-[78%_62%] md:opacity-90"
        />
      </div>

      {/* Scrim de legibilidade — escurece a esquerda pro texto e a base */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            // handoff: a diagonal 96deg so existe no desktop; no mobile ela e SUBSTITUIDA
            // por um scrim vertical mais pesado. A camada vertical vale nos dois.
            'linear-gradient(180deg, rgba(7,21,48,.86) 0%, transparent 26%, transparent 62%, rgba(7,21,48,.95) 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] hidden md:block"
        style={{
          background:
            'linear-gradient(96deg, rgba(7,21,48,.94) 0%, rgba(7,21,48,.8) 34%, rgba(10,30,64,.42) 62%, rgba(10,30,64,.3) 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] md:hidden"
        style={{
          background:
            'linear-gradient(180deg, rgba(7,21,48,.6) 0%, rgba(7,21,48,.72) 46%, rgba(7,21,48,.94) 100%)',
        }}
      />

      {/* Camada 2 (meio, profundidade próxima) — o Dr. Perazzo (só desktop) */}
      <div
        aria-hidden
        className="pointer-events-none relative z-[1] mx-auto h-[clamp(150px,32vh,320px)] w-[min(340px,74vw)] md:absolute md:bottom-0 md:right-[1%] md:mx-0 md:h-full md:w-[min(780px,50vw)]"
        style={{
          WebkitMaskImage: 'linear-gradient(180deg,#000 0%,#000 82%,transparent 99%)',
          maskImage: 'linear-gradient(180deg,#000 0%,#000 82%,transparent 99%)',
          transform: `translate(${par.x * 16}px, ${par.y * 9}px)`,
          transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <Image
          src="/assets/perazzo-hero.png"
          alt="Mário Wellington Perazzo, advogado"
          fill
          priority
          sizes="(max-width: 768px) 340px, 620px"
          className="object-contain object-bottom [filter:drop-shadow(0_28px_64px_rgba(0,0,0,.55))_saturate(.96)]"
        />
      </div>

      {/* Camada 3 (frente) — o conteúdo */}
      <div
        className="relative z-[2] mx-auto w-full max-w-content"
        style={{
          transform: `translate(${par.x * -4}px, ${par.y * -3}px)`,
          transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div className="mx-auto max-w-[560px] text-center md:mx-0 md:text-left">
          <motion.div initial="hidden" animate="show" custom={0} variants={fadeUp} className="mb-7 inline-flex items-center gap-3 rounded-full border border-gold/30 bg-navy-deep/50 py-2 pl-2.5 pr-4 backdrop-blur-sm">
            <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-gold/15 text-gold"><LuShieldCheck className="h-[13px] w-[13px]" /></span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">{c.badge}</span>
          </motion.div>

          <h1 className="font-serif text-[clamp(34px,4.6vw,62px)] font-medium leading-[1.05] tracking-[-0.02em] text-white">
            <motion.span initial="hidden" animate="show" custom={1} variants={fadeUp} className="block">{c.titulo1}</motion.span>
            <motion.span initial="hidden" animate="show" custom={2} variants={fadeUp} className="block">
              {t2[0]}<span className="text-gold">{c.titulo2Destaque}</span>{t2[1] ?? ''}
            </motion.span>
          </h1>

          <motion.p initial="hidden" animate="show" custom={3} variants={fadeUp} className="mx-auto mt-6 max-w-[86vw] text-[15px] leading-[1.7] text-cloud sm:max-w-[440px] sm:text-[17px] md:mx-0">{c.subtitulo}</motion.p>

          {/* Os 3 passos da trajetória (Linha de produção → Cadeira de CEO → Direito) */}
          {passos.length > 0 && (
            <motion.div initial="hidden" animate="show" custom={4} variants={fadeUp} className="mx-auto mt-9 flex w-full max-w-[400px] items-start md:mx-0 md:max-w-[460px]">
              {passos.map((p, i) => {
                const Icon = PASSO_ICONS[p.icone] ?? LuScale;
                const on = aceso[i];
                return (
                  <Fragment key={i}>
                    <div className="flex w-[84px] flex-none flex-col items-center text-center">
                      <span
                        className={`flex h-[46px] w-[46px] items-center justify-center rounded-full border text-gold transition-all duration-300 ${
                          on ? 'border-gold bg-gold/15' : 'border-gold/40 bg-navy-deep/40'
                        } ${pulso === i ? 'scale-110' : 'scale-100'}`}
                      >
                        <Icon className="h-[21px] w-[21px]" />
                      </span>
                      <span
                        className={`mt-2.5 whitespace-pre-line text-[13px] leading-[1.35] transition-colors duration-300 ${
                          on ? 'text-gold' : 'text-cloud'
                        }`}
                      >
                        {p.titulo}
                      </span>
                    </div>
                    {i < passos.length - 1 && (
                      <span aria-hidden className="relative mt-[22px] block h-px flex-1 overflow-hidden bg-gold/25">
                        <span
                          className="absolute left-0 top-0 h-px bg-gold"
                          style={{
                            width: preenchido[i] ? '100%' : '0%',
                            transition: 'width 700ms cubic-bezier(.16,1,.3,1)',
                          }}
                        />
                      </span>
                    )}
                  </Fragment>
                );
              })}
            </motion.div>
          )}

          <motion.div initial="hidden" animate="show" custom={5} variants={fadeUp} className="mt-10">
            <Link href="#contato" className="group inline-flex items-center gap-3 whitespace-nowrap rounded-full bg-gold py-[9px] pl-7 pr-[9px] text-[15px] font-semibold text-navy-deep transition hover:bg-gold-deep">
              {c.ctaPrimario}
              <span className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-navy-deep text-gold transition group-hover:translate-x-0.5"><LuArrowUpRight className="h-4 w-4" /></span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
