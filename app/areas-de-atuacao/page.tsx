import type { Metadata } from 'next';
import type { IconType } from 'react-icons';
import { FaFileInvoiceDollar, FaBuilding, FaBalanceScale, FaUserTie } from 'react-icons/fa';
import Section from '@/components/ui/Section';
import Kicker from '@/components/ui/Kicker';
import Reveal from '@/components/ui/Reveal';
import GoldRule from '@/components/ui/GoldRule';
import TiltCard from '@/components/ui/TiltCard';
import ParallaxMonogram from '@/components/effects/ParallaxMonogram';
import areas from '@/content/areas-de-atuacao.json';

export const metadata: Metadata = {
  title: 'Áreas de Atuação',
  description:
    'Recuperação tributária como especialidade principal, com atuação em outras áreas do Direito por meio de parcerias.',
  alternates: { canonical: '/areas-de-atuacao' },
};

const ICONS: Record<string, IconType> = {
  tax: FaFileInvoiceDollar,
  company: FaBuilding,
  civil: FaBalanceScale,
  labor: FaUserTie,
};

export default function AreasPage() {
  return (
    <>
      <Section variant="navy">
        <Reveal>
          <div className="max-w-2xl py-6">
            <span className="kicker">{areas.hero.kicker}</span>
            <GoldRule className="mt-3" />
            <h1 className="mt-6 text-[2rem] font-bold sm:text-h1">{areas.hero.titulo}</h1>
            <p className="mt-4 text-white/80">{areas.hero.subtitulo}</p>
          </div>
        </Reveal>
      </Section>

      <Section variant="light">
        <div className="grid gap-6 md:grid-cols-2">
          {areas.areas.map((a, idx) => {
            const Icon = ICONS[a.icone] ?? FaBalanceScale;
            return (
              <Reveal key={a.titulo} delay={idx * 0.08} className="h-full">
                <TiltCard>
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy text-gold">
                      <Icon size={20} />
                    </span>
                    <div>
                      <h3 className="text-h3 text-navy">
                        {a.titulo}
                        {a.destaque && (
                          <span className="ml-2 align-middle text-kicker uppercase tracking-wide text-gold">
                            Principal
                          </span>
                        )}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{a.descricao}</p>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section variant="navy-deep" decoration={<ParallaxMonogram side="right" />}>
        <Reveal>
          <div className="max-w-2xl">
            <Kicker>{areas.parcerias.titulo}</Kicker>
            <p className="leading-relaxed text-white/80">{areas.parcerias.texto}</p>
          </div>
        </Reveal>
      </Section>
    </>
  );
}