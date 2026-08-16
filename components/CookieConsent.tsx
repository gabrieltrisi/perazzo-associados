'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const KEY = 'perazzo-cookie-consent';

/**
 * Banner de consentimento de cookies (LGPD). Aparece só na 1ª visita
 * (a escolha fica salva no localStorage). Hoje o site usa apenas cookies
 * essenciais; se no futuro entrar analytics, é só condicioná-lo ao 'accepted'.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisible(true);
    } catch {
      /* localStorage indisponível — não mostra */
    }
  }, []);

  function decidir(valor: 'accepted' | 'rejected') {
    try {
      localStorage.setItem(KEY, valor);
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[110] p-4 sm:p-6" role="dialog" aria-label="Aviso de cookies">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-card border border-gold/30 bg-navy-deep/95 p-5 shadow-soft-lg backdrop-blur-sm sm:flex-row sm:items-center sm:gap-6">
        <p className="flex-1 text-sm leading-relaxed text-white/80">
          Utilizamos cookies essenciais para o funcionamento do site, em conformidade com a{' '}
          <strong className="font-semibold text-white">Lei Geral de Proteção de Dados (LGPD)</strong>.
          Ao continuar navegando, você concorda com a nossa{' '}
          <Link href="/politica-de-privacidade" className="text-gold underline underline-offset-2">
            Política de Privacidade
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => decidir('rejected')}
            className="rounded-md border border-white/25 px-5 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:border-white/50 hover:text-white"
          >
            Rejeitar
          </button>
          <button
            type="button"
            onClick={() => decidir('accepted')}
            className="rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-gold-deep"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}