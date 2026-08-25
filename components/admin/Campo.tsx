// Campo de formulário do painel (server-rendered; sem estado no cliente).
const inputCls =
  'w-full rounded-md border border-navy/15 bg-white px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold';

export default function Campo({
  name,
  label,
  defaultValue = '',
  textarea = false,
  hint,
  type = 'text',
}: {
  name: string;
  label: string;
  defaultValue?: string | number;
  textarea?: boolean;
  hint?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      {textarea ? (
        <textarea name={name} defaultValue={defaultValue} rows={3} className={inputCls} />
      ) : (
        <input name={name} type={type} defaultValue={defaultValue} className={inputCls} />
      )}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}