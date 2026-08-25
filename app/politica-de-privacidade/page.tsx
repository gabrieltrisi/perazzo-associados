import type { Metadata } from 'next';
import Section from '@/components/ui/Section';
import { getSiteConfig } from '@/lib/site-content';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de Privacidade do Perazzo & Associados Advogados, em conformidade com a LGPD (Lei nº 13.709/2018).',
  alternates: { canonical: '/politica-de-privacidade' },
  robots: { index: true, follow: true },
};

export default async function PoliticaPrivacidadePage() {
  const site = await getSiteConfig();
  const email = site.contato.email;

  return (
    <Section variant="light" className="pt-[clamp(112px,13vw,152px)]">
      <article className="mx-auto max-w-3xl">
        <span className="kicker">Legal</span>
        <span className="gold-rule mt-3" />
        <h1 className="mt-6 text-[2rem] font-bold text-navy sm:text-h1">Política de Privacidade</h1>
        <p className="mt-4 text-sm text-muted">Última atualização: agosto de 2026.</p>

        <div className="mt-8 space-y-5 leading-relaxed text-ink/90">
          <p>
            Esta Política de Privacidade descreve como o <strong>{site.nomeCompleto}</strong> ({site.oab})
            trata os dados pessoais coletados por meio deste site, em conformidade com a
            Lei Geral de Proteção de Dados Pessoais — <strong>LGPD (Lei nº 13.709/2018)</strong>.
            Ao utilizar o site e enviar seus dados pelo formulário de contato, você declara estar
            ciente das práticas aqui descritas.
          </p>

          <h2 className="text-h3 text-navy">1. Controlador dos dados</h2>
          <p>
            O responsável pelo tratamento dos dados é o <strong>{site.nomeCompleto}</strong>, com endereço em{' '}
            {site.contato.endereco.join(', ')}. Contato para questões de privacidade:{' '}
            <a href={`mailto:${email}`} className="text-gold hover:underline">{email}</a>.
          </p>

          <h2 className="text-h3 text-navy">2. Dados que coletamos</h2>
          <p>Coletamos apenas os dados necessários para atender à sua solicitação:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li><strong>Dados do formulário de contato:</strong> nome, e-mail, telefone (opcional) e a mensagem enviada.</li>
            <li><strong>Dados técnicos:</strong> endereço IP e informações básicas de acesso, utilizados de forma limitada para segurança e prevenção de abuso (anti-spam) do formulário.</li>
            <li><strong>Cookies essenciais:</strong> estritamente necessários ao funcionamento do site. Não utilizamos cookies de publicidade ou rastreamento para fins de marketing.</li>
          </ul>

          <h2 className="text-h3 text-navy">3. Como usamos seus dados</h2>
          <p>Os dados são utilizados exclusivamente para:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>responder à sua mensagem e dar seguimento ao contato solicitado;</li>
            <li>garantir a segurança e o funcionamento do site (prevenção de spam e abuso);</li>
            <li>cumprir eventuais obrigações legais aplicáveis à advocacia.</li>
          </ul>
          <p><strong>Não vendemos nem compartilhamos seus dados com terceiros para fins de marketing.</strong></p>

          <h2 className="text-h3 text-navy">4. Base legal</h2>
          <p>
            O tratamento dos dados enviados pelo formulário fundamenta-se no <strong>consentimento</strong> do
            titular (art. 7º, I, da LGPD), manifestado ao enviar a mensagem. Os dados técnicos utilizados
            para segurança apoiam-se no <strong>legítimo interesse</strong> (art. 7º, IX), sempre limitado ao
            necessário e respeitados os seus direitos.
          </p>

          <h2 className="text-h3 text-navy">5. Compartilhamento e operadores</h2>
          <p>
            Para operar o site e viabilizar o contato, contamos com prestadores de serviço (operadores) que
            tratam dados estritamente sob nossas instruções, tais como serviços de hospedagem, de banco de
            dados e de envio de e-mail. Esses provedores podem processar dados em servidores localizados fora
            do Brasil, adotando salvaguardas adequadas. Não há compartilhamento com terceiros para finalidades
            próprias de marketing.
          </p>

          <h2 className="text-h3 text-navy">6. Retenção e segurança</h2>
          <p>
            Mantemos os dados apenas pelo tempo necessário ao atendimento da sua solicitação e ao cumprimento
            de obrigações legais, após o que são eliminados ou anonimizados. Adotamos medidas técnicas e
            organizacionais razoáveis (como criptografia em trânsito e controle de acesso) para proteger seus
            dados contra acessos não autorizados.
          </p>

          <h2 className="text-h3 text-navy">7. Seus direitos como titular</h2>
          <p>Nos termos do art. 18 da LGPD, você pode, a qualquer momento, solicitar:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>confirmação da existência de tratamento e acesso aos seus dados;</li>
            <li>correção de dados incompletos, inexatos ou desatualizados;</li>
            <li>anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade;</li>
            <li>portabilidade e informação sobre com quem os dados foram compartilhados;</li>
            <li>revogação do consentimento e eliminação dos dados tratados com base nele.</li>
          </ul>

          <h2 className="text-h3 text-navy">8. Encarregado (DPO) e contato</h2>
          <p>
            Para exercer seus direitos ou esclarecer dúvidas sobre esta Política, entre em contato pelo
            e-mail{' '}
            <a href={`mailto:${email}`} className="text-gold hover:underline">{email}</a>. Responderemos às
            solicitações dentro dos prazos previstos na legislação.
          </p>

          <h2 className="text-h3 text-navy">9. Alterações desta Política</h2>
          <p>
            Esta Política pode ser atualizada a qualquer tempo para refletir mudanças legais ou operacionais.
            A versão vigente estará sempre disponível nesta página, com a respectiva data de atualização.
          </p>
        </div>
      </article>
    </Section>
  );
}
