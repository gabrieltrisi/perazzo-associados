import type { Metadata } from 'next';
import Section from '@/components/ui/Section';
import Kicker from '@/components/ui/Kicker';
import Reveal from '@/components/ui/Reveal';
import GoldRule from '@/components/ui/GoldRule';
import Timeline from '@/components/Timeline';
import ParallaxMonogram from '@/components/effects/ParallaxMonogram';
import sobre from '@/content/sobre.json';

export const metadata: Metadata = {
  title: 'Sobre o Escritório',
  description:
    'Conheça o Perazzo & Associados Advogados: história, missão, visão, valores e princípios éticos.',
  alternates: { canonical: '/sobre' },
};

export default function SobrePage() {
  return (
    <>
      <Section variant="navy">
        <Reveal>
          <div className="py-6">
            <span className="kicker">{sobre.hero.kicker}</span>
            <GoldRule className="mt-3" />
            <h1 className="mt-6 text-[2rem] font-bold sm:text-h1">{sobre.hero.titulo}</h1>
          </div>
        </Reveal>
      </Section>

      <Section variant="light">
        <Reveal>
          <Kicker>{sobre.historia.titulo}</Kicker>
        </Reveal>
        <div className="max-w-3xl space-y-4 text-base leading-relaxed text-ink/90">
          {sobre.historia.paragrafos.map((p, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <p>{p}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section variant="light">
        <Reveal>
          <Kicker>{sobre.linhaDoTempo.titulo}</Kicker>
        </Reveal>
        <div className="mt-8">
          <Timeline itens={sobre.linhaDoTempo.marcos} />
        </div>
      </Section>

      <Section variant="navy-deep" decoration={<ParallaxMonogram side="left" />}>
        <div className="grid gap-6 md:grid-cols-3">
          {sobre.missaoVisaoValores.map((b, idx) => (
            <Reveal key={b.titulo} delay={idx * 0.08}>
              <div className="rounded-card border border-navy-light/40 bg-navy p-6 transition-transform hover:-translate-y-1">
                <h3 className="text-h3 text-gold">{b.titulo}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/75">{b.texto}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section variant="light">
        <Reveal>
          <Kicker>{sobre.principios.titulo}</Kicker>
        </Reveal>
        <Reveal delay={0.06}>
          <ul className="max-w-2xl space-y-3">
            {sobre.principios.itens.map((p, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span className="text-ink/90">{p}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>
    </>
  );
}