import type { Metadata } from 'next';
import Section from '@/components/ui/Section';
import Kicker from '@/components/ui/Kicker';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import MaskReveal from '@/components/ui/MaskReveal';
import TiltCard from '@/components/ui/TiltCard';
import Magnetic from '@/components/effects/Magnetic';
import Counter from '@/components/effects/Counter';
import ParallaxMonogram from '@/components/effects/ParallaxMonogram';
import Hero3D from '@/components/three/Hero3D';
import home from '@/content/home.json';
import areas from '@/content/areas-de-atuacao.json';

export const metadata: Metadata = {
  title: 'Perazzo & Associados Advogados | Recuperação Tributária em Salvador',
  description:
    'Escritório de advocacia em Salvador (BA) especializado em recuperação tributária, com atuação também em outras áreas do Direito.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      {/* HERO com cena 3D de fundo */}
      <section className="relative overflow-hidden bg-navy">
        <Hero3D />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-navy via-navy/70 to-transparent" />
        <div className="container-px relative z-10">
          <div className="max-w-3xl py-24 sm:py-36">
            <Reveal>
              <span className="kicker">{home.hero.kicker}</span>
              <span className="gold-rule mt-3" />
            </Reveal>
            <div className="mask-wrap mt-6">
              <h1 className="mask-line text-[2rem] font-bold leading-tight text-white sm:text-h1">
                {home.hero.titulo}
              </h1>
            </div>
            <Reveal delay={0.16}>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
                {home.hero.subtitulo}
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-wrap gap-4">
                <Magnetic>
                  <Button href="/contato" variant="primary">
                    {home.hero.ctaPrimario}
                  </Button>
                </Magnetic>
                <Magnetic>
                  <Button href="/areas-de-atuacao" variant="secondary">
                    {home.hero.ctaSecundario}
                  </Button>
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* NÚMEROS — contadores animados */}
      <Section variant="navy-deep">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {home.numeros.map((n, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="text-center">
                <div className="font-serif text-4xl font-bold text-gold sm:text-5xl">
                  <Counter to={n.valor} suffix={n.sufixo} />
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.15em] text-white/60 sm:text-sm">
                  {n.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* CREDIBILIDADE — cards com tilt + spotlight */}
      <Section variant="light">
        <Reveal>
          <Kicker>{home.credibilidade.kicker}</Kicker>
        </Reveal>
        <MaskReveal>
          <h2 className="text-2xl font-bold text-navy sm:text-h2">{home.credibilidade.titulo}</h2>
        </MaskReveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {home.credibilidade.itens.map((i, idx) => (
            <Reveal key={i.titulo} delay={idx * 0.08} className="h-full">
              <TiltCard>
                <h3 className="text-h3 text-navy">{i.titulo}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{i.texto}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ÁREAS — resumo, com monograma parallax de fundo */}
      <Section variant="navy-deep" decoration={<ParallaxMonogram side="right" />}>
        <Reveal>
          <Kicker>{home.areasResumo.kicker}</Kicker>
        </Reveal>
        <MaskReveal>
          <h2 className="text-2xl font-bold sm:text-h2">{home.areasResumo.titulo}</h2>
        </MaskReveal>
        <Reveal delay={0.05}>
          <p className="mt-3 max-w-2xl text-white/70">{home.areasResumo.subtitulo}</p>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {areas.areas.map((a, idx) => (
            <Reveal key={a.titulo} delay={idx * 0.06}>
              <div className="rounded-card border border-navy-light/40 bg-navy p-6 transition-transform hover:-translate-y-1">
                <h3 className="text-h3 text-gold">{a.titulo}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/70">{a.descricao}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <div className="mt-8">
            <Magnetic>
              <Button href="/areas-de-atuacao" variant="secondary">
                Ver todas as áreas
              </Button>
            </Magnetic>
          </div>
        </Reveal>
      </Section>

      {/* CTA FINAL */}
      <Section variant="light">
        <Reveal>
          <div className="relative overflow-hidden rounded-card bg-navy px-8 py-12 text-center text-white sm:px-16">
            <h2 className="text-2xl font-bold sm:text-h2">{home.ctaFinal.titulo}</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/80">{home.ctaFinal.texto}</p>
            <div className="mt-8 flex justify-center">
              <Magnetic>
                <Button href="/contato" variant="primary">
                  Entrar em contato
                </Button>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}