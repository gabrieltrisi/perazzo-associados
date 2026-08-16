/**
 * Transição de entrada por página (o template re-monta a cada navegação).
 * Usa animação CSS pura (não depende de JS) — assim o conteúdo NUNCA fica
 * invisível esperando hidratação. Respeita "prefers-reduced-motion".
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}