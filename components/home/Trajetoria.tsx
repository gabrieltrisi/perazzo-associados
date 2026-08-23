import Image from 'next/image';
import Reveal from '@/components/ui/Reveal';
import { LuFactory, LuGavel } from 'react-icons/lu';
import Timeline, { type Marco } from './Timeline';

type Props = {
  content: {
    kicker: string; titulo: string; tituloDestaque?: string; texto: string;
    marcos: Marco[];
    hoje: { label: string; titulo: string; texto: string };
  };
};

export default function Trajetoria({ content }: Props) {
  const { kicker, titulo, tituloDestaque, texto, marcos, hoje } = content;
  const tp = tituloDestaque ? titulo.split(tituloDestaque) : [titulo];
  return (
    <section
      id="trajetoria"
      data-screen-label="Trajetória"
      className="relative overflow-hidden bg-gradient-to-b from-white via-offwhite to-cream px-6 py-[clamp(96px,10vw,152px)] text-ink"
      style={{ marginTop: '-2.5vw', clipPath: 'polygon(0 2.5vw, 100% 0, 100% 100%, 0 100%)' }}
    >
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[20%] h-[900px] w-[900px] -translate-x-1/2" style={{ background: 'radial-gradient(circle, rgba(199,169,111,.14) 0%, transparent 62%)' }} />
      <div className="relative mx-auto max-w-[1080px]">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-deep">{kicker}</span>
            <span className="block h-0.5 w-16 bg-gold" />
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-5 font-serif text-[clamp(27px,3.2vw,36px)] font-medium tracking-[-0.01em]">{tp[0]}<span className="text-gold-dark">{tituloDestaque}</span>{tp[1] ?? ''}</h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-5 max-w-[58ch] text-[clamp(17px,1.7vw,20px)] leading-[1.7] text-muted [text-wrap:pretty]">{texto}</p>
        </Reveal>

        {/* Rótulos dos dois caminhos (desktop) */}
        <div className="mt-14 hidden items-center md:grid" style={{ gridTemplateColumns: '1fr 64px 1fr' }}>
          <div className="flex items-center justify-end gap-2.5 pb-6">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink">Indústria &amp; energia</span>
            <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-ink text-offwhite"><LuFactory className="h-[15px] w-[15px]" /></span>
          </div>
          <div />
          <div className="flex items-center gap-2.5 pb-6">
            <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-gold text-navy-deep"><LuGavel className="h-[15px] w-[15px]" /></span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink">Direito</span>
          </div>
        </div>

        <Timeline marcos={marcos} />

        {/* Card "Hoje" */}
        <div className="mt-12 flex flex-col items-center">
          <span aria-hidden className="block h-[18px] w-[18px] rotate-45 bg-navy-light" />
          <Reveal delay={0.1} className="w-full">
            <article className="mx-auto mt-8 grid w-full max-w-[720px] grid-cols-1 overflow-hidden rounded-2xl border border-gold text-white sm:grid-cols-[220px_1fr]" style={{ background: 'linear-gradient(135deg,#0A1E40 0%,#071530 100%)' }}>
              <div className="relative h-56 sm:h-auto">
                <Image src="/assets/retrato-varanda.jpg" alt="Mário Wellington Perazzo" fill sizes="220px" className="object-cover object-[50%_22%] [filter:saturate(.8)]" />
              </div>
              <div className="p-8">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">{hoje.label}</div>
                <h3 className="mt-3 font-serif text-[26px] font-medium">{hoje.titulo}</h3>
                <p className="mt-3 text-base leading-[1.7] text-cloud [text-wrap:pretty]">{hoje.texto}</p>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
