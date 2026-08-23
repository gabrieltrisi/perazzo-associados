import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';

type Passo = { num: string; titulo: string; texto: string };
type Props = {
  content: { kicker: string; titulo: string; tituloDestaque?: string; texto: string; passos: Passo[]; cta: string };
};

export default function Especialidade({ content }: Props) {
  const { kicker, titulo, tituloDestaque, texto, passos, cta } = content;
  const tp = tituloDestaque ? titulo.split(tituloDestaque) : [titulo];
  return (
    <section
      id="especialidade"
      data-screen-label="Especialidade"
      className="relative px-6 py-[clamp(96px,10vw,152px)]"
      style={{ marginTop: '-2.5vw', clipPath: 'polygon(0 0, 100% 2.5vw, 100% 100%, 0 100%)', background: 'linear-gradient(170deg,#071530 0%,#0A1E40 50%,#0C2149 100%)' }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image src="/assets/salvador-baia.jpg" alt="" fill sizes="100vw" className="object-cover opacity-[.28] [filter:saturate(.5)_contrast(1.05)]" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(170deg,rgba(7,21,48,.93) 0%,rgba(10,30,64,.9) 45%,rgba(12,33,73,.94) 100%)' }} />
      </div>
      <div className="relative mx-auto max-w-content">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">{kicker}</span>
            <span className="block h-0.5 w-16 bg-gold" />
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-6 font-serif text-[clamp(27px,3.2vw,36px)] font-medium tracking-[-0.01em] text-white">
            {tp[0]}<span className="text-gold">{tituloDestaque}</span>{tp[1] ?? ''}
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-5 max-w-[62ch] text-[20px] leading-[1.7] text-cloud [text-wrap:pretty]">{texto}</p>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {passos.map((p, i) => (
            <Reveal key={i} delay={0.1 + i * 0.08}>
              <article className="group h-full rounded-[10px] border border-gold/25 p-7 transition duration-200 hover:-translate-y-1 hover:border-gold">
                <div className="font-tight text-[13px] font-medium tracking-[0.12em] text-navy-light transition group-hover:text-gold">{p.num}</div>
                <h3 className="mt-3.5 font-serif text-[21px] font-medium text-white">{p.titulo}</h3>
                <p className="mt-3 text-base leading-[1.7] text-cloud">{p.texto}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <div className="mt-10">
            <Link href="#diagnostico" className="inline-block rounded-md border border-gold px-[26px] py-3.5 text-[15px] font-semibold text-gold transition hover:bg-gold/10">{cta} →</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
