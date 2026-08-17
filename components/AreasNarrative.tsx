'use client';

import { motion } from 'framer-motion';
import Button from './ui/Button';
import Kicker from './ui/Kicker';
import GoldRule from './ui/GoldRule';
import Magnetic from './effects/Magnetic';

type Area = { titulo: string; descricao: string; destaque?: boolean };

// Título fixo à esquerda (sticky) enquanto os cards de área passam e se
// revelam à direita — dá o "scroll narrativo" sem pinning frágil.
export default function AreasNarrative({
  kicker,
  titulo,
  subtitulo,
  areas,
}: {
  kicker: string;
  titulo: string;
  subtitulo: string;
  areas: Area[];
}) {
  return (
    <div className="grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
      <div className="md:sticky md:top-28 md:self-start">
        <Kicker>{kicker}</Kicker>
        <GoldRule className="mt-3" />
        <h2 className="mt-5 text-2xl font-bold sm:text-h2">{titulo}</h2>
        <p className="mt-3 max-w-md text-white/70">{subtitulo}</p>
        <div className="mt-6">
          <Magnetic>
            <Button href="/areas-de-atuacao" variant="secondary">
              Ver todas as áreas
            </Button>
          </Magnetic>
        </div>
      </div>

      <ul className="space-y-5">
        {areas.map((a, idx) => (
          <motion.li
            key={a.titulo}
            initial={{ opacity: 0, y: 44, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-card border border-navy-light/40 bg-navy p-6 transition-colors hover:border-gold/50"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-h3 text-gold">{a.titulo}</h3>
              {a.destaque && (
                <span className="shrink-0 rounded-full border border-gold/40 px-2.5 py-0.5 text-kicker uppercase tracking-wide text-gold">
                  Principal
                </span>
              )}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{a.descricao}</p>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}