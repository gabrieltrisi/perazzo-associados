import type { Metadata } from 'next';
import { exigirAdmin } from '@/lib/admin-session';
import { prisma } from '@/lib/db';
import { marcarLeadAction, excluirLeadAction } from '@/app/admin/actions';

export const metadata: Metadata = { title: 'Leads', robots: { index: false } };

function fmt(d: Date) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(d);
}

// Monta link do WhatsApp a partir do telefone digitado (só dígitos).
function waHref(tel: string) {
  const num = (tel || '').replace(/\D/g, '');
  if (!num) return '';
  const full = num.length <= 11 ? `55${num}` : num; // adiciona DDI se veio só DDD+numero
  return `https://wa.me/${full}`;
}

export default async function LeadsPage() {
  await exigirAdmin();
  const [leads, novos] = await Promise.all([
    prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 200 }),
    prisma.lead.count({ where: { status: 'novo' } }),
  ]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Leads</h1>
          <p className="mt-1 text-muted">Contatos recebidos pelo formulário do site.</p>
        </div>
        {novos > 0 && (
          <span className="rounded-full bg-gold/15 px-3 py-1 text-sm font-semibold text-gold-dark">
            {novos} novo{novos > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {leads.length === 0 ? (
        <p className="mt-6 rounded-card border border-navy/10 bg-white p-6 text-muted">
          Nenhum lead ainda. Quando alguém enviar o formulário do site, aparece aqui.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {leads.map((l) => {
            const wa = waHref(l.telefone);
            const novo = l.status === 'novo';
            return (
              <article
                key={l.id}
                className={`rounded-card border bg-white p-5 ${novo ? 'border-gold/50' : 'border-navy/10'}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-ink">{l.nome}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${novo ? 'bg-gold/15 text-gold-dark' : 'bg-success/10 text-success'}`}>
                        {novo ? 'Novo' : 'Atendido'}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-muted">
                      <a href={`mailto:${l.email}?subject=${encodeURIComponent('Sobre seu contato — Perazzo & Associados')}`} className="hover:text-gold">
                        {l.email}
                      </a>
                      {l.telefone && <span>· {l.telefone}</span>}
                    </div>
                  </div>
                  <span className="whitespace-nowrap text-xs text-muted">{fmt(l.createdAt)}</span>
                </div>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink/85">{l.mensagem}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <a
                    href={`mailto:${l.email}?subject=${encodeURIComponent('Sobre seu contato — Perazzo & Associados')}`}
                    className="rounded-md bg-gold px-3 py-1.5 text-xs font-semibold text-navy transition-colors hover:bg-gold-deep"
                  >
                    Responder por e-mail
                  </a>
                  {wa && (
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-navy/15 px-3 py-1.5 text-xs font-semibold text-navy transition-colors hover:bg-navy/5"
                    >
                      WhatsApp
                    </a>
                  )}
                  <form action={marcarLeadAction} className="inline">
                    <input type="hidden" name="id" value={l.id} />
                    <input type="hidden" name="status" value={novo ? 'atendido' : 'novo'} />
                    <button className="rounded-md border border-navy/15 px-3 py-1.5 text-xs font-semibold text-navy transition-colors hover:bg-navy/5">
                      {novo ? 'Marcar como atendido' : 'Reabrir'}
                    </button>
                  </form>
                  <form action={excluirLeadAction} className="ml-auto inline">
                    <input type="hidden" name="id" value={l.id} />
                    <button className="rounded-md px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50">
                      Excluir
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
