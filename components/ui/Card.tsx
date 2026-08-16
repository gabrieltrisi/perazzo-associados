/**
 * Card genérico: fundo branco, cantos arredondados (10px), sombra SUAVE.
 * Hover eleva a sombra sutilmente — nunca sombra dura nem troca de cor agressiva.
 */
export default function Card({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-card bg-white p-6 text-ink shadow-soft transition-shadow hover:shadow-soft-lg sm:p-8 ${className}`}
    >
      {children}
    </div>
  );
}