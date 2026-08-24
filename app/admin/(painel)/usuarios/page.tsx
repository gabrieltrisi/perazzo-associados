import type { Metadata } from 'next';
import { exigirOwner } from '@/lib/admin-session';
import { listarUsuarios } from '@/lib/users';
import { prisma } from '@/lib/db';
import { criarUsuarioAction, alternarAtivoAction, redefinirSenhaAction } from '@/app/admin/actions';

export const metadata: Metadata = { title: 'Usuários', robots: { index: false } };

const input =
  'w-full rounded-md border border-navy/15 bg-white px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold';

function fmt(d: Date) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(d);
}

const MSG: Record<string, string> = {
  salvo: '✓ Alteração salva.',
  dados: 'Dados inválidos (verifique e-mail e senha com no mínimo 8 caracteres).',
  existe: 'Já existe um usuário com esse e-mail.',
  self: 'Você não pode desativar a própria conta.',
};

export default async function UsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ salvo?: string; erro?: string }>;
}) {
  await exigirOwner();
  const sp = await searchParams;
  const [usuarios, auditoria] = await Promise.all([
    listarUsuarios(),
    prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 25 }),
  ]);
  const aviso = sp.salvo ? MSG.salvo : sp.erro ? MSG[sp.erro] : '';
  const ok = !!sp.salvo;

  return (
    <>
      <h1 className="text-2xl font-bold text-navy">Usuários</h1>
      <p className="mt-1 text-muted">Contas da equipe que podem acessar o painel.</p>

      {aviso && (
        <p className={`mt-4 rounded border px-4 py-2 text-sm ${ok ? 'border-success/30 bg-success/10 text-success' : 'border-red-200 bg-red-50 text-red-700'}`}>
          {aviso}
        </p>
      )}

      {/* Criar usuário */}
      <form action={criarUsuarioAction} className="mt-6 rounded-card border border-navy/10 bg-white p-6">
        <h2 className="text-sm font-semibold text-navy">Adicionar usuário</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block"><span className="mb-1 block text-xs font-medium text-ink">Nome</span><input name="name" className={input} /></label>
          <label className="block"><span className="mb-1 block text-xs font-medium text-ink">E-mail</span><input name="email" type="email" required className={input} /></label>
          <label className="block"><span className="mb-1 block text-xs font-medium text-ink">Senha (mín. 8)</span><input name="senha" type="text" required minLength={8} className={input} /></label>
          <label className="block"><span className="mb-1 block text-xs font-medium text-ink">Papel</span>
            <select name="role" className={input} defaultValue="editor">
              <option value="editor">Editor (edita conteúdo)</option>
              <option value="owner">Dono (gerencia usuários)</option>
            </select>
          </label>
        </div>
        <button type="submit" className="mt-4 rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-gold-deep">
          Criar usuário
        </button>
      </form>

      {/* Lista de usuários */}
      <div className="mt-6 overflow-x-auto rounded-card border border-navy/10 bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-navy/10 text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Usuário</th>
              <th className="px-4 py-3">Papel</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-b border-navy/5 last:border-0">
                <td className="px-4 py-3">
                  <div className="font-medium text-ink">{u.name || '—'}</div>
                  <div className="text-xs text-muted">{u.email}</div>
                </td>
                <td className="px-4 py-3">{u.role === 'owner' ? 'Dono' : 'Editor'}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${u.active ? 'bg-success/10 text-success' : 'bg-red-50 text-red-700'}`}>
                    {u.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <form action={alternarAtivoAction}>
                      <input type="hidden" name="id" value={u.id} />
                      <input type="hidden" name="ativar" value={u.active ? '0' : '1'} />
                      <button className="rounded border border-navy/15 px-2.5 py-1 text-xs text-navy transition-colors hover:bg-navy/5">
                        {u.active ? 'Desativar' : 'Reativar'}
                      </button>
                    </form>
                    <form action={redefinirSenhaAction} className="flex items-center gap-1">
                      <input type="hidden" name="id" value={u.id} />
                      <input name="senha" type="text" placeholder="nova senha" minLength={8} className="w-28 rounded border border-navy/15 px-2 py-1 text-xs" />
                      <button className="rounded border border-navy/15 px-2.5 py-1 text-xs text-navy transition-colors hover:bg-navy/5">
                        Trocar senha
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Audit log */}
      <h2 className="mt-10 text-lg font-bold text-navy">Registro de atividades</h2>
      <p className="mt-1 text-sm text-muted">Últimas 25 ações no painel.</p>
      <div className="mt-4 overflow-x-auto rounded-card border border-navy/10 bg-white">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="border-b border-navy/10 text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Quando</th>
              <th className="px-4 py-3">Quem</th>
              <th className="px-4 py-3">Ação</th>
              <th className="px-4 py-3">Detalhe</th>
            </tr>
          </thead>
          <tbody>
            {auditoria.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-4 text-muted">Sem registros ainda.</td></tr>
            ) : (
              auditoria.map((a) => (
                <tr key={a.id} className="border-b border-navy/5 last:border-0">
                  <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted">{fmt(a.createdAt)}</td>
                  <td className="px-4 py-2.5 text-xs">{a.userEmail || '—'}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-navy">{a.action}</td>
                  <td className="px-4 py-2.5 text-xs text-muted">{a.detail}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
