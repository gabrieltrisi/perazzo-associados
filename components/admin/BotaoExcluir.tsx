'use client';

// Botão de submit com confirmação (para ações destrutivas no painel).
export default function BotaoExcluir({ children = 'Excluir' }: { children?: React.ReactNode }) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm('Excluir este artigo? Esta ação não pode ser desfeita.')) e.preventDefault();
      }}
      className="rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
    >
      {children}
    </button>
  );
}