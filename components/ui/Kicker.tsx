/**
 * Kicker (label de categoria) + linha dourada decorativa embaixo.
 * `center` centraliza o conjunto.
 */
export default function Kicker({
  children,
  center = false,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div className={`mb-5 ${center ? 'flex flex-col items-center text-center' : ''}`}>
      <span className="kicker">{children}</span>
      <span className="gold-rule mt-3" />
    </div>
  );
}