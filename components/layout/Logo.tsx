'use client';

import { useState } from 'react';

/**
 * Logo oficial em /public/logo.webp (versão transparente).
 * Renderiza a imagem direto (aparece imediatamente). Se por algum motivo o
 * arquivo faltar, cai num wordmark de texto. NUNCA recriar/estilizar a logo.
 */
export default function Logo() {
  const [erro, setErro] = useState(false);

  if (erro) {
    return (
      <span className="font-serif text-lg font-bold leading-none text-white">
        Perazzo <span className="text-gold">&amp;</span> Associados
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-perazzo.png"
      alt="Perazzo & Associados Advogados"
      className="h-9 w-auto sm:h-10"
      onError={() => setErro(true)}
    />
  );
}