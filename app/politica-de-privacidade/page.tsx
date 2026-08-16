import type { Metadata } from 'next';
import Section from '@/components/ui/Section';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de Privacidade do Perazzo & Associados Advogados, em conformidade com a LGPD.',
  alternates: { canonical: '/politica-de-privacidade' },
  robots: { index: true, follow: true },
};

export default function PoliticaPrivacidadePage() {
  return (
    <Section variant="light">
      <article className="mx-auto max-w-3xl">
        <span className="kicker">Legal</span>
        <span className="gold-rule mt-3" />
        <h1 className="mt-6 text-[2rem] font-bold text-navy sm:text-h1">Política de Privacidade</h1>

        <div className="mt-8 space-y-5 leading-relaxed text-ink/90">
          <p className="rounded border-l-4 border-gold bg-offwhite p-4 text-sm text-muted">
            <strong>[TEXTO PLACEHOLDER — SUBSTITUIR]</strong> — o conteúdo definitivo desta
            política será fornecido/revisado pela CONTRATADA. O texto abaixo é apenas uma
            estrutura de referência conforme a LGPD.
          </p>

          <h2 className="text-h3 text-navy">1. Dados que coletamos</h2>
          <p>[PLACEHOLDER — descrever quais dados são coletados no formulário de contato: nome, e-mail, telefone, mensagem.]</p>

          <h2 className="text-h3 text-navy">2. Como usamos seus dados</h2>
          <p>[PLACEHOLDER — finalidade: responder à solicitação de contato. Não compartilhamos com terceiros para fins de marketing.]</p>

          <h2 className="text-h3 text-navy">3. Base legal e consentimento</h2>
          <p>[PLACEHOLDER — o envio do formulário depende de consentimento explícito do titular.]</p>

          <h2 className="text-h3 text-navy">4. Seus direitos</h2>
          <p>[PLACEHOLDER — direitos do titular conforme a LGPD: acesso, correção, exclusão.]</p>

          <h2 className="text-h3 text-navy">5. Contato do encarregado (DPO)</h2>
          <p>[PLACEHOLDER — canal para solicitações relativas a dados pessoais.]</p>
        </div>
      </article>
    </Section>
  );
}