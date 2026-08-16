import type { Metadata } from 'next';
import Section from '@/components/ui/Section';

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Termos de Uso do site do Perazzo & Associados Advogados.',
  alternates: { canonical: '/termos-de-uso' },
  robots: { index: true, follow: true },
};

export default function TermosDeUsoPage() {
  return (
    <Section variant="light">
      <article className="mx-auto max-w-3xl">
        <span className="kicker">Legal</span>
        <span className="gold-rule mt-3" />
        <h1 className="mt-6 text-[2rem] font-bold text-navy sm:text-h1">Termos de Uso</h1>

        <div className="mt-8 space-y-5 leading-relaxed text-ink/90">
          <p className="rounded border-l-4 border-gold bg-offwhite p-4 text-sm text-muted">
            <strong>[TEXTO PLACEHOLDER — SUBSTITUIR]</strong> — o conteúdo definitivo será
            fornecido/revisado pela CONTRATADA. Estrutura de referência abaixo.
          </p>

          <h2 className="text-h3 text-navy">1. Objeto</h2>
          <p>[PLACEHOLDER — este site tem caráter informativo e institucional.]</p>

          <h2 className="text-h3 text-navy">2. Uso do conteúdo</h2>
          <p>[PLACEHOLDER — o conteúdo não constitui aconselhamento jurídico para casos específicos.]</p>

          <h2 className="text-h3 text-navy">3. Propriedade intelectual</h2>
          <p>[PLACEHOLDER — marca, logo e conteúdos pertencem ao escritório.]</p>

          <h2 className="text-h3 text-navy">4. Limitação de responsabilidade</h2>
          <p>[PLACEHOLDER — texto padrão de limitação.]</p>

          <h2 className="text-h3 text-navy">5. Foro</h2>
          <p>[PLACEHOLDER — comarca de Salvador/BA.]</p>
        </div>
      </article>
    </Section>
  );
}