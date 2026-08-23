import type { Metadata } from 'next';
import Link from 'next/link';
import { LuArrowUpRight, LuArrowLeft } from 'react-icons/lu';

export const metadata: Metadata = {
  title: 'Página não encontrada',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section
      className="relative flex min-h-screen items-center overflow-hidden px-6 pt-[72px] text-white"
      style={{ background: 'linear-gradient(170deg,#071530 0%,#0A1E40 55%,#0C2149 100%)' }}
    >
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: 'radial-gradient(circle, rgba(199,169,111,.14) 0%, transparent 62%)' }} />
      <div className="relative mx-auto max-w-2xl text-center">
        <div className="flex flex-col items-center gap-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">Erro 404</span>
          <span className="block h-0.5 w-16 bg-gold" />
        </div>
        <div className="mt-6 font-serif text-[clamp(88px,18vw,180px)] font-medium leading-none tracking-[-0.02em] text-white/90">
          4<span className="text-gold">0</span>4
        </div>
        <h1 className="mt-2 font-serif text-[clamp(24px,3.4vw,34px)] font-medium tracking-[-0.01em]">Página não encontrada</h1>
        <p className="mx-auto mt-4 max-w-md text-[16px] leading-[1.7] text-cloud [text-wrap:pretty]">
          O endereço que você tentou acessar não existe ou foi movido. Vamos te levar de volta ao início.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link href="/" className="group inline-flex items-center gap-3 whitespace-nowrap rounded-full bg-gold py-[7px] pl-6 pr-[7px] text-[15px] font-semibold text-navy-deep transition hover:bg-gold-deep">
            <LuArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
            Voltar ao início
          </Link>
          <Link href="/#contato" className="group inline-flex items-center gap-2 border-b border-gold/45 py-3 text-[15px] font-semibold text-white transition hover:border-gold hover:text-gold">
            Falar com o escritório
            <LuArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
