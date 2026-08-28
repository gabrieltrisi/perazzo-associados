import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import QuemSomos from '@/components/home/QuemSomos';
import Problema from '@/components/home/Problema';
import Especialidade from '@/components/home/Especialidade';
import Trajetoria from '@/components/home/Trajetoria';
import Areas from '@/components/home/Areas';
import Diagnostico from '@/components/home/Diagnostico';
import Autoridade from '@/components/home/Autoridade';
import Principios from '@/components/home/Principios';
import Faq from '@/components/home/Faq';
import Contato from '@/components/home/Contato';
import { FaqJsonLd } from '@/components/StructuredData';
import { getHome, getAreas, getFaq, getSiteConfig } from '@/lib/site-content';

export const metadata: Metadata = {
  title: 'Perazzo & Associados Advogados | Recuperação Tributária em Salvador',
  description:
    'Escritório de advocacia em Salvador (BA) especializado em recuperação tributária, com atuação também em outras áreas do Direito.',
  alternates: { canonical: '/' },
};

export default async function HomePage() {
  const [home, areas, faq, site] = await Promise.all([getHome(), getAreas(), getFaq(), getSiteConfig()]);
  return (
    <>
      <Hero content={home.hero} />
      <QuemSomos content={home.quemSomos} />
      <Problema content={home.problema} />
      <Especialidade content={home.especialidade} />
      <Trajetoria content={home.trajetoria} />
      <Areas content={areas} />
      <Diagnostico content={home.diagnostico} />
      <Autoridade content={home.autoridade} />
      <Principios content={home.principios} />
      <Faq content={faq} />
      <Contato content={home.contato} site={site} />
      <FaqJsonLd itens={faq.itens} />
    </>
  );
}
