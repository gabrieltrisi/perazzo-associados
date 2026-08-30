import Reveal from '@/components/ui/Reveal';

type Item = { titulo: string; texto: string };
type Foto = { img: string; legenda: string };
type Props = {
  content: {
    kicker: string; titulo: string; tituloDestaque?: string; texto: string;
    itens: Item[]; galeria: Foto[];
  };
};

export default function Autoridade({ content }: Props) {
  const { kicker, titulo, tituloDestaque, texto, itens, galeria } = content;
  const tp = tituloDestaque ? titulo.split(tituloDestaque) : [titulo];

  return (
    <section
      id="autoridade"
      data-screen-label="Autoridade"
      className="relative overflow-hidden px-6 py-[clamp(96px,10vw,152px)]"
      style={{ marginTop: '-2.5vw', clipPath: 'polygon(0 0, 100% 2.5vw, 100% 100%, 0 100%)', background: 'linear-gradient(200deg,#071530 0%,#0A1E40 45%,#0C2149 100%)' }}
    >
      <div className="relative mx-auto grid max-w-content items-start gap-12 lg:gap-[72px] lg:grid-cols-[5fr_6fr]">
        {/* Figura principal (painel) */}
        <Reveal>
          <figure className="m-0">
            <div className="aspect-[4/5] overflow-hidden rounded-[14px] border-b-2 border-gold">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/painel.jpg" alt="Dr. Perazzo em painel setorial" loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: '50% 30%', filter: 'saturate(.85)' }} />
            </div>
            <figcaption className="mt-3 text-[13px] text-navy-light">Participação em painel setorial · 2026</figcaption>
          </figure>
        </Reveal>

        {/* Texto + itens + figura debate */}
        <div>
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">{kicker}</span>
              <span className="block h-0.5 w-16 bg-gold" />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-serif text-[clamp(27px,3.2vw,36px)] font-medium tracking-[-0.01em] text-white">{tp[0]}<span className="text-gold">{tituloDestaque}</span>{tp[1] ?? ''}</h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 text-[16px] leading-[1.7] text-cloud [text-wrap:pretty]">{texto}</p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-8 grid gap-4">
              {itens.map((it, i) => (
                <div key={i} className="flex items-baseline gap-3.5">
                  <span aria-hidden className="text-[12px] text-gold">◈</span>
                  <p className="text-[16px] leading-[1.7] text-cloud"><span className="font-semibold text-white">{it.titulo}</span> — {it.texto}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <figure className="m-0 mt-10">
              <div className="aspect-[16/9] overflow-hidden rounded-xl border border-gold/22">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/debate.jpg" alt="Dr. Perazzo em debate setorial" loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: '50% 6%', filter: 'saturate(.85)' }} />
              </div>
              <figcaption className="mt-3 text-[13px] text-navy-light">Debate setorial · 2026</figcaption>
            </figure>
          </Reveal>
        </div>
      </div>

      {/* Agenda institucional — grade estática (sem corte) */}
      <div className="relative mx-auto mt-[clamp(56px,6vw,88px)] max-w-content border-t border-gold/16 pt-10">
        <Reveal>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">Agenda institucional</div>
        </Reveal>
        <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
          {galeria.map((g, i) => (
            <Reveal key={i} delay={0.05 + i * 0.06}>
              <figure className="group m-0">
                <div className="aspect-[3/4] overflow-hidden rounded-xl border border-gold/18">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.img} alt={g.legenda} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06] [filter:saturate(.82)]" />
                </div>
                <figcaption className="mt-2.5 text-[12px] text-navy-light">{g.legenda}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
