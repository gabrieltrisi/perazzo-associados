import Image from 'next/image';
import Reveal from '@/components/ui/Reveal';

type Props = { content: { kicker: string; titulo: string; destaque?: string } };

export default function Problema({ content }: Props) {
  const parts = content.destaque ? content.titulo.split(content.destaque) : [content.titulo];
  return (
    <section
      data-screen-label="O problema"
      className="relative bg-gradient-to-b from-offwhite via-white to-[#F2F0E9] px-6 py-[clamp(96px,10vw,152px)] text-ink"
      style={{ marginTop: '-2.5vw', clipPath: 'polygon(0 2.5vw, 100% 0, 100% 100%, 0 100%)' }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image src="/assets/salvador-pelourinho.jpg" alt="" fill sizes="100vw" className="object-cover opacity-[.6] [filter:saturate(.5)_contrast(1.05)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-offwhite/60 via-white/55 to-cream/75" />
      </div>
      <div className="relative z-[1] mx-auto max-w-[820px] text-center">
        <Reveal>
          <div className="flex flex-col items-center gap-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-deep">{content.kicker}</span>
            <span className="block h-0.5 w-16 bg-gold" />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-8 font-serif text-[clamp(26px,3.4vw,36px)] font-medium leading-[1.35] tracking-[-0.01em] [text-wrap:pretty]">
            {parts.map((p, i) => (
              <span key={i}>
                {p}
                {i < parts.length - 1 && <span className="text-gold-dark">{content.destaque}</span>}
              </span>
            ))}
          </h2>
        </Reveal>
      </div>
    </section>
  );
}
