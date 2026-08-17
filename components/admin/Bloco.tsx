// Agrupador visual (fieldset) das seções do formulário do painel.
export default function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-card border border-navy/10 bg-white p-6">
      <legend className="px-2 text-kicker uppercase tracking-wide text-gold">{titulo}</legend>
      <div className="grid gap-4">{children}</div>
    </fieldset>
  );
}