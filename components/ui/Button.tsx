import Link from 'next/link';

type Variant = 'primary' | 'secondary' | 'ghost';

// primary: dourado sólido · secondary: contorno dourado · ghost: texto dourado.
const styles: Record<Variant, string> = {
  primary: 'bg-gold text-navy hover:bg-gold-deep',
  secondary: 'border border-gold text-gold hover:bg-gold hover:text-navy',
  ghost: 'text-gold hover:text-gold-deep',
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
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-md px-6 py-3 font-sans text-sm font-semibold tracking-wide transition-colors ${styles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}