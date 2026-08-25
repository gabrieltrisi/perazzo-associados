// Dados estruturados (JSON-LD, schema.org). Componentes de servidor que
// renderizam <script type="application/ld+json"> — ajudam o Google a exibir
// o negócio como escritório de advocacia e o FAQ como rich result.

import { getSiteConfig } from '@/lib/site-content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://perazzoadvogados.com.br';

// Serializa com escape de "<" para JSON-LD — impede que um campo do CMS
// contendo "</script>" quebre o bloco e injete HTML/JS (stored XSS).
function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export async function OrganizationJsonLd() {
  const site = await getSiteConfig();
  // Só inclui redes realmente preenchidas (evita URLs placeholder no schema).
  const sameAs = [site.redes.instagram, site.redes.linkedin, site.redes.facebook].filter(
    (u): u is string => !!u && !u.startsWith('['),
  );
  const data = {
    '@context': 'https://schema.org',
    '@type': ['LegalService', 'Attorney'],
    '@id': `${SITE_URL}/#escritorio`,
    name: site.nomeCompleto,
    url: SITE_URL,
    image: `${SITE_URL}/logo-og.webp`,
    logo: `${SITE_URL}/logo-perazzo.png`,
    slogan: 'Visão executiva + expertise jurídica',
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
    founder: {
      '@type': 'Person',
      name: 'Mário Wellington Perazzo',
      jobTitle: 'Advogado',
      knowsAbout: ['Recuperação Tributária', 'Direito Tributário', 'Setor de energia e GLP'],
    },
    knowsAbout: [
      'Recuperação Tributária',
      'Direito Tributário',
      'PIS/COFINS',
      'Reforma Tributária (IBS/CBS)',
      'Direito Empresarial',
      'Direito Trabalhista',
      'Direito Imobiliário',
      'Direito Previdenciário',
      'Direito Cível',
    ],
    availableLanguage: 'pt-BR',
    ...(sameAs.length ? { sameAs } : {}),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(data) }}
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
      dangerouslySetInnerHTML={{ __html: jsonLd(data) }}
    />
  );
}