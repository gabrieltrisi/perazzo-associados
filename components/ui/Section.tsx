import { ReactNode } from 'react';

type Variant = 'navy' | 'navy-deep' | 'light';

const bg: Record<Variant, string> = {
  navy: 'bg-navy text-white',
  'navy-deep': 'bg-navy-deep text-white',
  light: 'bg-offwhite text-ink',
};

/**
 * Seção de página. `variant` alterna fundo escuro/claro (ritmo visual).
 * `decoration` recebe uma camada decorativa absoluta (ex.: monograma parallax)
 * renderizada atrás do conteúdo.
 */
export default function Section({
  variant = 'light',
  id,
  className = '',
  decoration,
  children,
}: {
  variant?: Variant;
  id?: string;
  className?: string;
  decoration?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`relative overflow-hidden ${bg[variant]} py-16 sm:py-20 ${className}`}
    >
      {decoration}
      <div className="container-px relative z-10">{children}</div>
    </section>
  );
}