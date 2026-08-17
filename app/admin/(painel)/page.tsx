import type { Metadata } from 'next';
import Link from 'next/link';
import { FaHome, FaAddressCard, FaQuestionCircle, FaBriefcase, FaLandmark } from 'react-icons/fa';
import { getAdmin } from '@/lib/admin-session';
import { prisma } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Painel do site',
  robots: { index: false, follow: false },
};

const secoes = [
  { href: '/admin/home', icon: <FaHome />, titulo: 'Textos da Home', texto: 'Título, subtítulos, CTAs e números.' },
  { href: '/admin/contato', icon: <FaAddressCard />, titulo: 'Contato', texto: 'Telefone, e-mail, endereço e redes.' },
  { href: '/admin/faq', icon: <FaQuestionCircle />, titulo: 'FAQ', texto: 'Perguntas e respostas frequentes.' },
  { href: '/admin/areas', icon: <FaBriefcase />, titulo: 'Áreas de atuação', texto: 'Áreas, ícones e parcerias.' },
  { href: '/admin/sobre', icon: <FaLandmark />, titulo: 'Sobre', texto: 'História, trajetória e princípios.' },
];

async function visitas() {
  try {
    const hoje = new Date().toISOString().slice(0, 10);
    const seteDias = new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10);
    const [total, doDia, semana, top] = await Promise.all([
      prisma.pageView.aggregate({ _sum: { count: true } }),
      prisma.pageView.aggregate({ _sum: { count: true }, where: { day: hoje } }),
      prisma.pageView.aggregate({ _sum: { count: true }, where: { day: { gte: seteDias } } }),
      prisma.pageView.groupBy({
        by: ['path'],
        _sum: { count: true },
        orderBy: { _sum: { count: 'desc' } },
        take: 5,
      }),
    ]);
    return {
      total: total._sum.count ?? 0,
      hoje: doDia._sum.count ?? 0,
      semana: semana._sum.count ?? 0,
      top: top.map((t) => ({ path: t.path, count: t._sum.count ?? 0 })),
    };
  } catch {
    return { total: 0, hoje: 0, semana: 0, top: [] as { path: string; count: number }[] };
  }
}

export default async function AdminDashboard() {
  const admin = await getAdmin();
  const v = await visitas();

  return (
    <>
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">Olá, {admin?.email}</h1>
      <p className="mt-2 text-muted">Gerencie o conteúdo do site. As mudanças aparecem em segundos.</p>

      {/* Resumo de visitas */}
      <section className="mt-8">
        <h2 className="text-kicker uppercase tracking-wide text-gold">Visitas</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Últimos 7 dias', valor: v.semana },
            { label: 'Hoje', valor: v.hoje },
            { label: 'Total', valor: v.total },
          ].map((m) => (
            <div key={m.label} className="rounded-card border border-navy/10 bg-white p-5 shadow-soft">
              <p className="text-3xl font-bold text-navy">{m.valor.toLocaleString('pt-BR')}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-muted">{m.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-card border border-navy/10 bg-white p-5 shadow-soft">
          <p className="text-xs uppercase tracking-wide text-muted">Páginas mais vistas</p>
          {v.top.length === 0 ? (
            <p className="mt-2 text-sm text-muted">Ainda sem dados — as visitas começam a contar agora.</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm">
              {v.top.map((t) => (
                <li key={t.path} className="flex justify-between border-b border-navy/5 py-1 last:border-0">
                  <span className="text-ink">{t.path}</span>
                  <span className="font-semibold text-navy">{t.count.toLocaleString('pt-BR')}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs text-muted">
            Contador próprio do painel. O relatório detalhado (Vercel Analytics) fica no painel da Vercel após o deploy.
          </p>
        </div>
      </section>

      {/* Editar seções */}
      <section className="mt-10">
        <h2 className="text-kicker uppercase tracking-wide text-gold">Editar conteúdo</h2>
        <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {secoes.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group rounded-card border border-navy/10 bg-white p-6 shadow-soft transition-colors hover:border-gold/50"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-gold">
                {s.icon}
              </span>
              <h3 className="mt-4 text-h3 text-navy">{s.titulo}</h3>
              <p className="mt-1 text-sm text-muted">{s.texto}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-gold">Editar →</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}