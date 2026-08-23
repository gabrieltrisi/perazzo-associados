import type { Metadata } from 'next';
import Link from 'next/link';
import Section from '@/components/ui/Section';
import { getSiteConfig } from '@/lib/site-content';

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Termos de Uso do site do Perazzo & Associados Advogados.',
  alternates: { canonical: '/termos-de-uso' },
  robots: { index: true, follow: true },
};

export default async function TermosDeUsoPage() {
  const site = await getSiteConfig();
  const email = site.contato.email;

  return (
    <Section variant="light" className="pt-[clamp(112px,13vw,152px)]">
      <article className="mx-auto max-w-3xl">
        <span className="kicker">Legal</span>
        <span className="gold-rule mt-3" />
        <h1 className="mt-6 text-[2rem] font-bold text-navy sm:text-h1">Termos de Uso</h1>
        <p className="mt-4 text-sm text-muted">Última atualização: agosto de 2026.</p>

        <div className="mt-8 space-y-5 leading-relaxed text-ink/90">
          <p>
            Estes Termos de Uso regulam o acesso e a utilização do site do{' '}
            <strong>{site.nomeCompleto}</strong> ({site.oab}). Ao navegar ou utilizar este site, você
            declara estar ciente e de acordo com as condições abaixo. Caso não concorde, pedimos que
            não utilize o site.
          </p>

          <h2 className="text-h3 text-navy">1. Objeto e natureza do site</h2>
          <p>
            Este site tem caráter <strong>informativo e institucional</strong>, destinado a apresentar
            o escritório, suas áreas de atuação e canais de contato. Ele não constitui plataforma de
            prestação de serviços jurídicos on-line.
          </p>

          <h2 className="text-h3 text-navy">2. Ausência de aconselhamento jurídico</h2>
          <p>
            As informações aqui disponibilizadas têm finalidade meramente informativa e{' '}
            <strong>não constituem aconselhamento ou parecer jurídico</strong> para casos específicos.
            Cada situação exige análise individualizada. O simples acesso ao site ou o envio de mensagem
            pelo formulário de contato <strong>não estabelece relação advogado-cliente</strong>, a qual
            somente se constitui após a formalização de contrato específico.
          </p>

          <h2 className="text-h3 text-navy">3. Uso do conteúdo e propriedade intelectual</h2>
          <p>
            A marca, o logotipo, os textos, o layout e os demais elementos deste site pertencem ao{' '}
            {site.nomeCompleto} ou a ele foram licenciados, sendo protegidos pela legislação aplicável.
            É permitido o acesso e a leitura para fins pessoais e informativos. A reprodução, distribuição
            ou exploração comercial, total ou parcial, sem autorização prévia e por escrito, é vedada.
          </p>

          <h2 className="text-h3 text-navy">4. Conduta do usuário</h2>
          <p>Ao utilizar o site, você se compromete a não:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>utilizá-lo para fins ilícitos, difamatórios ou que violem direitos de terceiros;</li>
            <li>tentar comprometer a segurança, a integridade ou o funcionamento do site;</li>
            <li>enviar, pelo formulário, conteúdo falso, ofensivo ou de terceiros sem autorização.</li>
          </ul>

          <h2 className="text-h3 text-navy">5. Publicidade e ética profissional</h2>
          <p>
            O conteúdo deste site observa o <strong>Código de Ética e Disciplina</strong> e as normas de
            publicidade da <strong>Ordem dos Advogados do Brasil (OAB)</strong>, em especial o
            Provimento nº 205/2021. As informações têm caráter informativo e sóbrio, sem captação indevida
            de clientela, mercantilização da profissão ou promessa de resultados.
          </p>

          <h2 className="text-h3 text-navy">6. Links e serviços de terceiros</h2>
          <p>
            O site pode conter links para páginas ou serviços de terceiros (por exemplo, WhatsApp e mapas).
            Não nos responsabilizamos pelo conteúdo, pelas práticas de privacidade ou pela disponibilidade
            desses serviços externos.
          </p>

          <h2 className="text-h3 text-navy">7. Limitação de responsabilidade</h2>
          <p>
            Empregamos esforços razoáveis para manter o site atualizado e disponível, mas não garantimos
            funcionamento ininterrupto ou isento de erros. Não nos responsabilizamos por decisões tomadas
            com base exclusivamente nas informações gerais aqui contidas, sem a devida orientação jurídica
            individualizada.
          </p>

          <h2 className="text-h3 text-navy">8. Privacidade</h2>
          <p>
            O tratamento de dados pessoais coletados no site é regido pela nossa{' '}
            <Link href="/politica-de-privacidade" className="text-gold hover:underline">
              Política de Privacidade
            </Link>
            , em conformidade com a LGPD.
          </p>

          <h2 className="text-h3 text-navy">9. Alterações</h2>
          <p>
            Estes Termos podem ser atualizados a qualquer tempo. A versão vigente estará sempre disponível
            nesta página, com a respectiva data de atualização.
          </p>

          <h2 className="text-h3 text-navy">10. Foro</h2>
          <p>
            Fica eleito o foro da <strong>Comarca de Salvador, Estado da Bahia</strong>, para dirimir
            quaisquer questões oriundas destes Termos, com renúncia a qualquer outro, por mais privilegiado
            que seja. Dúvidas podem ser encaminhadas para{' '}
            <a href={`mailto:${email}`} className="text-gold hover:underline">{email}</a>.
          </p>
        </div>
      </article>
    </Section>
  );
}
