'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import { LuReceiptText, LuBuilding2, LuUsers, LuHouse, LuScale, LuShieldCheck, LuNetwork, LuArrowUpRight, LuArrowLeft, LuArrowRight } from 'react-icons/lu';
import type { IconType } from 'react-icons';

const ICONS: Record<string, IconType> = {
  tax: LuReceiptText, company: LuBuilding2, labor: LuUsers, realestate: LuHouse, civel: LuScale, previdenciario: LuShieldCheck,
};

type Area = { icone: string; titulo: string; destaque?: boolean; descricao: string };
type Props = {
  content: {
    hero: { kicker: string; titulo: string; subtitulo: string };
    areas: Area[];
    parcerias: { titulo: string; texto: string };
  };
};

const GAP = 26;

export default function Areas({ content }: Props) {
  const { hero, areas, parcerias } = content;
  const base = areas.length;
  // 3x para loop infinito (originais + 2 clones), como no artefato.
  const cards = [...areas, ...areas, ...areas];

  const vpRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const offset = useRef(0);
  const paused = useRef(false);
  const dragging = useRef(false);

  useEffect(() => {
    const vp = vpRef.current;
    const track = trackRef.current;
    if (!vp || !track) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cardW = () => (cardRefs.current[0] ? cardRefs.current[0]!.offsetWidth + GAP : 346);
    const loopW = () => cardW() * base;

    const apply = () => {
      const L = loopW();
      if (L > 0) { while (offset.current < 0) offset.current += L; while (offset.current >= L) offset.current -= L; }
      track.style.transform = `translateX(${-offset.current}px)`;
      const centerX = vp.clientWidth / 2;
      const flat = reduced || window.innerWidth < 900;
      let best = 0, bestD = 1e9;
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const cx = card.offsetLeft - offset.current + card.offsetWidth / 2;
        const d = (cx - centerX) / Math.max(1, vp.clientWidth);
        const ad = Math.abs(d);
        if (ad < bestD) { bestD = ad; best = i; }
        card.style.transform = flat ? 'none' : `perspective(1500px) rotateY(${-d * 24}deg) scale(${1 - Math.min(0.16, ad * 0.4)}) translateZ(${-ad * 140}px)`;
        card.style.opacity = String(Math.max(0.5, 1 - ad * 0.95));
      });
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const on = i === best;
        card.style.zIndex = on ? '3' : '1';
        card.style.boxShadow = on ? '0 34px 70px rgba(0,0,0,.45)' : 'none';
        card.style.borderColor = on ? '#C7A96F' : (card.dataset.principal ? '#C7A96F' : 'rgba(199,169,111,.2)');
      });
      dotRefs.current.forEach((dot, i) => {
        if (!dot) return;
        const on = i === (best % base);
        dot.style.background = on ? '#C7A96F' : '#40537B';
        dot.style.width = on ? '20px' : '6px';
      });
    };

    let raf = 0;
    const tick = () => {
      if (!paused.current && !dragging.current && !reduced) { offset.current += 0.35; apply(); }
      raf = requestAnimationFrame(tick);
    };

    const onEnter = () => { paused.current = true; };
    const onLeave = () => { paused.current = false; };
    let startX = 0, startOffset = 0;
    const onDown = (e: PointerEvent) => { dragging.current = true; startX = e.clientX; startOffset = offset.current; track.style.cursor = 'grabbing'; track.setPointerCapture(e.pointerId); };
    const onMove = (e: PointerEvent) => { if (!dragging.current) return; offset.current = startOffset - (e.clientX - startX); apply(); };
    const onUp = () => { dragging.current = false; track.style.cursor = 'grab'; };
    const onResize = () => apply();

    vp.addEventListener('mouseenter', onEnter);
    vp.addEventListener('mouseleave', onLeave);
    vp.addEventListener('focusin', onEnter);
    track.addEventListener('pointerdown', onDown);
    track.addEventListener('pointermove', onMove);
    track.addEventListener('pointerup', onUp);
    track.addEventListener('pointercancel', onUp);
    window.addEventListener('resize', onResize);

    apply();
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      vp.removeEventListener('mouseenter', onEnter);
      vp.removeEventListener('mouseleave', onLeave);
      vp.removeEventListener('focusin', onEnter);
      track.removeEventListener('pointerdown', onDown);
      track.removeEventListener('pointermove', onMove);
      track.removeEventListener('pointerup', onUp);
      track.removeEventListener('pointercancel', onUp);
      window.removeEventListener('resize', onResize);
    };
  }, [base]);

  const step = (dir: number) => {
    const w = cardRefs.current[0] ? cardRefs.current[0]!.offsetWidth + GAP : 346;
    offset.current += dir * w;
  };
  const goTo = (i: number) => {
    const vp = vpRef.current;
    const w = cardRefs.current[0] ? cardRefs.current[0]!.offsetWidth + GAP : 346;
    if (vp) offset.current = i * w - (vp.clientWidth - w + GAP) / 2;
  };

  return (
    <section
      id="areas"
      data-screen-label="Áreas"
      className="relative overflow-hidden px-6 pb-[clamp(72px,8vw,120px)] pt-[clamp(96px,10vw,152px)]"
      style={{ marginTop: '-2.5vw', clipPath: 'polygon(0 0, 100% 2.5vw, 100% 100%, 0 100%)', background: 'linear-gradient(160deg,#0A1E40 0%,#0C2149 40%,#071530 100%)' }}
    >
      <div className="relative mx-auto max-w-content">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">{hero.kicker}</span>
                <span className="block h-0.5 w-16 bg-gold" />
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-5 font-serif text-[clamp(27px,3.2vw,36px)] font-medium tracking-[-0.01em] text-white">Cobertura completa, <span className="text-gold">sem generalismo</span></h2>
            </Reveal>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => step(-1)} aria-label="Área anterior" className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-gold/40 text-gold transition hover:bg-gold/15"><LuArrowLeft className="h-[18px] w-[18px]" /></button>
            <button type="button" onClick={() => step(1)} aria-label="Próxima área" className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-gold/40 text-gold transition hover:bg-gold/15"><LuArrowRight className="h-[18px] w-[18px]" /></button>
          </div>
        </div>
        <Reveal delay={0.12}>
          <p className="mt-5 max-w-[62ch] text-[clamp(17px,1.7vw,20px)] leading-[1.7] text-cloud [text-wrap:pretty]">{hero.subtitulo}</p>
        </Reveal>

        {/* Viewport do coverflow */}
        <div ref={vpRef} className="relative mt-10 overflow-hidden" style={{ perspective: '1500px' }}>
          <div ref={trackRef} className="flex cursor-grab items-stretch py-[46px] [will-change:transform] [transform-style:preserve-3d]" style={{ gap: `${GAP}px` }}>
            {cards.map((a, i) => {
              const Icon = ICONS[a.icone] ?? LuBuilding2;
              const isClone = i >= base;
              return (
                <article
                  key={i}
                  ref={(el) => { cardRefs.current[i] = el; }}
                  aria-hidden={isClone || undefined}
                  data-principal={a.destaque ? '1' : undefined}
                  className="w-[300px] flex-none rounded-2xl p-[30px] transition-[transform,border-color,box-shadow] duration-[420ms] ease-[cubic-bezier(.16,1,.3,1)] sm:w-[320px] [transform-style:preserve-3d]"
                  style={{
                    border: `1px solid ${a.destaque ? '#C7A96F' : 'rgba(199,169,111,.2)'}`,
                    background: a.destaque ? 'linear-gradient(150deg,#16294B 0%,#0C1D3C 100%)' : 'rgba(255,255,255,.035)',
                  }}
                >
                  {a.destaque && <span className="mb-4 inline-block rounded-[3px] border border-gold/50 px-2 py-1 font-tight text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">Principal</span>}
                  <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-gold/[0.12] text-gold"><Icon className="h-[23px] w-[23px]" /></span>
                  <h3 className="mt-[22px] font-serif text-[22px] font-medium text-white">{a.titulo}</h3>
                  <p className="mt-3 text-[15px] leading-[1.7] text-cloud">{a.descricao}</p>
                </article>
              );
            })}
          </div>
          {/* Fades das bordas */}
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-[90px]" style={{ background: 'linear-gradient(90deg,#0A1E40 0%,transparent 100%)' }} />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-[90px]" style={{ background: 'linear-gradient(270deg,#071530 0%,transparent 100%)' }} />
        </div>

        {/* Dots + nota */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            {areas.map((_, i) => (
              <button key={i} type="button" ref={(el) => { dotRefs.current[i] = el; }} onClick={() => goTo(i)} aria-label={`Ir para a área ${i + 1}`} className="h-[6px] w-[6px] rounded-full transition-all duration-300" style={{ background: '#40537B' }} />
            ))}
          </div>
          <p className="max-w-[60ch] text-[12px] leading-[1.7] text-navy-light">Atuação em áreas complementares por meio de escritórios e profissionais associados, conforme a natureza de cada demanda.</p>
        </div>

        {/* Parcerias */}
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-gold/25 bg-navy-deep/50 p-8 sm:flex-row sm:items-center">
            <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-gold/15 text-gold"><LuNetwork className="h-6 w-6" /></span>
            <div className="flex-1">
              <h3 className="font-serif text-xl font-medium text-white">{parcerias.titulo}</h3>
              <p className="mt-2 text-[15px] leading-[1.7] text-cloud [text-wrap:pretty]">{parcerias.texto}</p>
            </div>
            <Link href="#contato" className="group inline-flex flex-none items-center gap-2.5 whitespace-nowrap rounded-full border border-gold px-5 py-3 text-sm font-semibold text-gold transition hover:bg-gold/10">
              Falar com o escritório
              <LuArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
