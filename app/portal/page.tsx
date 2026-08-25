import type { Metadata } from 'next';
import { FaFolderOpen, FaFileContract, FaRegComments } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Área do Cliente',
  robots: { index: false, follow: false },
};

// Dashboard scaffold — estrutura visual pronta; os dados virão quando o
// backend/autenticação real forem plugados.
const cards = [
  {
    icon: <FaFolderOpen size={20} />,
    titulo: 'Meus processos',
    texto: 'Acompanhe o andamento dos seus casos em tempo real.',
  },
  {
    icon: <FaFileContract size={20} />,
    titulo: 'Documentos',
    texto: 'Acesse e envie documentos com segurança.',
  },
  {
    icon: <FaRegComments size={20} />,
    titulo: 'Mensagens',
    texto: 'Fale diretamente com a equipe do escritório.',
  },
];

export default function PortalDashboard() {
  return (
    <>
      <h1 className="text-2xl font-bold text-navy sm:text-h2">Bem-vindo(a)</h1>
      <p className="mt-2 text-muted">Este é o painel inicial da área do cliente.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.titulo} className="rounded-card border border-navy/10 bg-white p-6 shadow-soft">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-gold">
              {c.icon}
            </span>
            <h2 className="mt-4 text-h3 text-navy">{c.titulo}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{c.texto}</p>
            <span className="mt-4 inline-block text-xs uppercase tracking-wide text-gold/70">
              Em breve
            </span>
          </div>
        ))}
      </div>

      <p className="mt-8 rounded-card border border-dashed border-muted/30 bg-white/60 p-4 text-xs text-muted">
        Ambiente de demonstração. A autenticação e os dados reais serão habilitados em uma próxima fase.
      </p>
    </>
  );
}