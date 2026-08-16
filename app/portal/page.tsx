import type { Metadata } from 'next';
import Button from '@/components/ui/Button';
import Magnetic from '@/components/effects/Magnetic';

// Placeholder da futura ÁREA DO CLIENTE (portal). Ainda NÃO tem login —
// esta página é pública e apenas sinaliza a funcionalidade futura.
// A proteção por autenticação já está preparada em `middleware.ts`.
export const metadata: Metadata = {
  title: 'Área do Cliente',
  robots: { index: false, follow: false },
};

export default function PortalPage() {
  return (
    <section className="flex min-h-[70vh] items-center bg-navy">
      <div className="container-px max-w-2xl">
        <p className="kicker mb-4 inline-block">Portal do Cliente</p>
        <h1 className="text-[2.2rem] font-bold text-white sm:text-5xl">Em breve</h1>
        <p className="mt-5 leading-relaxed text-white/70">
          Esta será a área restrita do cliente — acompanhamento de processos, documentos e
          comunicação com o escritório. O acesso com login será habilitado em uma próxima fase.
        </p>
        <div className="mt-8">
          <Magnetic>
            <Button href="/" variant="secondary">
              Voltar ao site
            </Button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}