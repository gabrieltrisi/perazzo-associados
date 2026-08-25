'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LuCookie } from 'react-icons/lu';

// Versão do consentimento. Ao mudar a política/design, incremente para que o
// banner reapareça para todos os visitantes (nova decisão informada).
const KEY = 'perazzo-cookie-consent-2026';

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

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-[110] p-4 sm:p-6"
          role="dialog"
          aria-label="Aviso de cookies"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl border border-gold/30 bg-navy-deep/95 p-5 shadow-[0_20px_60px_rgba(0,0,0,.4)] backdrop-blur-md sm:flex-row sm:items-center sm:gap-6">
            <span className="hidden h-11 w-11 flex-none items-center justify-center rounded-full bg-gold/15 text-gold sm:flex">
              <LuCookie className="h-[22px] w-[22px]" />
            </span>
            <p className="flex-1 font-sans text-sm leading-relaxed text-cloud">
              Utilizamos cookies essenciais para o funcionamento do site, em conformidade com a{' '}
              <strong className="font-semibold text-white">Lei Geral de Proteção de Dados (LGPD)</strong>.
              Ao continuar navegando, você concorda com a nossa{' '}
              <Link href="/politica-de-privacidade" className="text-gold underline underline-offset-2 hover:text-gold-deep">
                Política de Privacidade
              </Link>
              .
            </p>
            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                onClick={() => decidir('rejected')}
                className="rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:border-white/50 hover:text-white"
              >
                Rejeitar
              </button>
              <button
                type="button"
                onClick={() => decidir('accepted')}
                className="rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-navy-deep transition-colors hover:bg-gold-deep"
              >
                Aceitar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
