'use client';

import Link from 'next/link';
import { useEffect } from 'react';

// Error boundary da área admin. Um conteúdo malformado no banco (ex.: shape
// antigo) não derruba mais o painel com 500 — mostra esta tela e permite tentar de novo.
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[admin error]', error?.digest ?? error?.message);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg rounded-card border border-red-200 bg-white p-8 text-center">
      <p className="text-kicker uppercase tracking-wide text-red-600">Erro no painel</p>
      <h1 className="mt-3 text-2xl font-bold text-navy">Não foi possível carregar esta tela</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Isso costuma acontecer quando o conteúdo salvo está num formato inesperado. Tente novamente;
        se persistir, avise o desenvolvedor.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button onClick={reset} className="rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-gold-deep">
          Tentar de novo
        </button>
        <Link href="/admin" className="rounded-md border border-navy/15 px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-navy/5">
          Voltar ao painel
        </Link>
      </div>
    </div>
  );
}
