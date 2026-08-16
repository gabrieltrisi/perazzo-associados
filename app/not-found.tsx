import type { Metadata } from 'next';
import Button from '@/components/ui/Button';
import Magnetic from '@/components/effects/Magnetic';

export const metadata: Metadata = {
  title: 'Página não encontrada',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center bg-navy">
      <div className="container-px text-center">
        <p className="kicker mb-4 inline-block">Erro 404</p>
        <h1 className="text-[2.5rem] font-bold leading-tight text-white sm:text-6xl">
          Página não encontrada
        </h1>
        <p className="mx-auto mt-5 max-w-md text-white/70">
          O endereço que você tentou acessar não existe ou foi movido. Vamos te levar de volta ao
          início.
        </p>
        <div className="mt-8 flex justify-center">
          <Magnetic>
            <Button href="/" variant="primary">
              Voltar ao início
            </Button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}