import type { Metadata } from 'next';
import Link from 'next/link';
import { FaHome, FaAddressCard, FaChartLine } from 'react-icons/fa';
import { getAdmin } from '@/lib/admin-session';

export const metadata: Metadata = {
  title: 'Painel do site',
  robots: { index: false, follow: false },
};

const secoes = [
  { href: '/admin/home', icon: <FaHome />, titulo: 'Textos da Home', texto: 'Título, subtítulos, CTAs e os números.' },
  { href: '/admin/contato', icon: <FaAddressCard />, titulo: 'Contato', texto: 'Telefone, e-mail, endereço e redes.' },
];

export default async function AdminDashboard() {
  const admin = await getAdmin();

  return (
    <>
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">Olá, {admin?.email}</h1>
      <p className="mt-2 text-muted">Gerencie o conteúdo do site. As mudanças aparecem em segundos.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {secoes.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group rounded-card border border-navy/10 bg-white p-6 shadow-soft transition-colors hover:border-gold/50"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-gold">
              {s.icon}
            </span>
            <h2 className="mt-4 text-h3 text-navy">{s.titulo}</h2>
            <p className="mt-1 text-sm text-muted">{s.texto}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-gold">Editar →</span>
          </Link>
        ))}

        {/* Visitas — resumo virá na Fase 2; painel completo na Vercel */}
        <div className="rounded-card border border-navy/10 bg-white p-6 shadow-soft">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-gold">
            <FaChartLine />
          </span>
          <h2 className="mt-4 text-h3 text-navy">Visitas</h2>
          <p className="mt-1 text-sm text-muted">
            O rastreamento (Vercel Analytics) já está ativo. O resumo aqui no painel entra na próxima
            fase; o relatório completo fica no painel da Vercel após o deploy.
          </p>
        </div>
      </div>

      <p className="mt-8 rounded-card border border-dashed border-muted/30 bg-white/60 p-4 text-xs text-muted">
        Fase 1 — Home e Contato editáveis. FAQ, Áreas, Sobre e Blog chegam nas próximas fases.
      </p>
    </>
  );
}