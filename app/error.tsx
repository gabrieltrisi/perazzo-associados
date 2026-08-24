'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { LuArrowLeft, LuRotateCcw } from 'react-icons/lu';

// Error boundary global. Qualquer erro de renderização vira esta tela
// (em vez de um 500 cru). Não vaza stack trace ao usuário.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log só no servidor/console (nunca exibido ao usuário).
    console.error('[app error]', error?.digest ?? error?.message);
  }, [error]);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6 text-white" style={{ background: 'linear-gradient(170deg,#071530 0%,#0A1E40 55%,#0C2149 100%)' }}>
      <div className="relative mx-auto max-w-xl text-center">
        <div className="flex flex-col items-center gap-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">Ops</span>
          <span className="block h-0.5 w-16 bg-gold" />
        </div>
        <h1 className="mt-6 font-serif text-[clamp(26px,3.6vw,38px)] font-medium tracking-[-0.01em]">Algo deu errado ao carregar esta página</h1>
        <p className="mx-auto mt-4 max-w-md text-[16px] leading-[1.7] text-cloud">Tente novamente em instantes. Se persistir, volte ao início.</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <button onClick={reset} className="group inline-flex items-center gap-2.5 rounded-full bg-gold py-3 pl-6 pr-6 text-[15px] font-semibold text-navy-deep transition hover:bg-gold-deep">
            <LuRotateCcw className="h-4 w-4" /> Tentar de novo
          </button>
          <Link href="/" className="inline-flex items-center gap-2 border-b border-gold/45 py-2.5 text-[15px] font-semibold text-white transition hover:border-gold hover:text-gold">
            <LuArrowLeft className="h-4 w-4" /> Voltar ao início
          </Link>
        </div>
      </div>
    </section>
  );
}
