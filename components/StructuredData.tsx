// Dados estruturados (JSON-LD, schema.org). Componentes de servidor que
// renderizam <script type="application/ld+json"> — ajudam o Google a exibir
// o negócio como escritório de advocacia e o FAQ como rich result.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://perazzoadvogados.com.br';

// TODO (cliente): preencher telefone, endereço completo e redes (sameAs).
export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: 'Perazzo & Associados Advogados',
    url: SITE_URL,
    image: `${SITE_URL}/logo-og.webp`,
    description:
      'Escritório de advocacia em Salvador (BA) com atuação em recuperação tributária e demais áreas do Direito.',
    areaServed: { '@type': 'City', name: 'Salvador' },
    knowsAbout: [
      'Recuperação Tributária',
      'Direito Tributário',
      'Direito Empresarial',
      'Direito Civil',
      'Direito Trabalhista',
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