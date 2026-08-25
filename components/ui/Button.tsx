import Link from 'next/link';

type Variant = 'primary' | 'secondary' | 'ghost';

const base =
  'group/btn relative inline-flex items-center justify-center overflow-hidden rounded-md px-6 py-3 font-sans text-sm font-semibold tracking-wide';

// primary: dourado sólido (com brilho no hover) · secondary: contorno com
// preenchimento dourado deslizante · ghost: texto dourado.
const shell: Record<Variant, string> = {
  primary: 'bg-gold text-navy',
  secondary: 'border border-gold text-gold transition-colors duration-300 hover:text-navy',
  ghost: 'text-gold transition-colors hover:text-gold-deep',
};

export default function Button({
  href,
  variant = 'primary',
  className = '',
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={`${base} ${shell[variant]} ${className}`}>
      {/* Preenchimento dourado que desliza da esquerda (secondary). */}
      {variant === 'secondary' && (
        <span
          aria-hidden
          className="absolute inset-0 origin-left scale-x-0 bg-gold transition-transform duration-300 ease-out group-hover/btn:scale-x-100 motion-reduce:transition-none"
        />
      )}
      {/* Brilho que varre a superfície (primary) — decorativo, some em reduce-motion. */}
      {variant === 'primary' && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover/btn:translate-x-full motion-reduce:hidden"
        />
      )}
      <span className="relative z-10">{children}</span>
    </Link>
  );
}