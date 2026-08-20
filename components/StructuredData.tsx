// Dados estruturados (JSON-LD, schema.org). Componentes de servidor que
// renderizam <script type="application/ld+json"> — ajudam o Google a exibir
// o negócio como escritório de advocacia e o FAQ como rich result.

import { getSiteConfig } from '@/lib/site-content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://perazzoadvogados.com.br';

export async function OrganizationJsonLd() {
  const site = await getSiteConfig();
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: site.nomeCompleto,
    url: SITE_URL,
    image: `${SITE_URL}/logo-og.webp`,
    description:
      'Escritório de advocacia em Salvador (BA) com foco em recuperação tributária e atuação em todas as áreas do Direito por meio de parcerias.',
    telephone: `+${site.contato.telefoneLink}`,
    email: site.contato.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Luís Viana Filho, 13223 — Sala 424 (Hangar Business Park)',
      addressLocality: 'Salvador',
      addressRegion: 'BA',
      postalCode: '41500-300',
      addressCountry: 'BR',
    },
    areaServed: { '@type': 'Country', name: 'Brasil' },
    founder: { '@type': 'Person', name: 'Mário Wellington Perazzo', jobTitle: 'Advogado' },
    knowsAbout: [
      'Recuperação Tributária',
      'Direito Tributário',
      'Direito Empresarial',
      'Direito Trabalhista',
      'Direito Imobiliário',
    ],
    availableLanguage: 'pt-BR',
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FaqJsonLd({ itens }: { itens: { pergunta: string; resposta: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: itens.map((it) => ({
      '@type': 'Question',
      name: it.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: it.resposta },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}