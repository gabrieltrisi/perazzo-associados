import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_COOKIE, verificarToken } from './admin-auth';
import { prisma } from './db';

// Sessão do painel em Server Components/Actions. Além de verificar o JWT,
// confere no banco que o usuário existe, está ATIVO e que o tokenVersion bate
// (permite revogar sessões). Fail-closed: qualquer erro → sem acesso.
export type Admin = { id: number; email: string; name: string; role: string };

export async function getAdmin(): Promise<Admin | null> {
  const store = await cookies();
  const tok = await verificarToken(store.get(ADMIN_COOKIE)?.value);
  if (!tok) return null;
  try {
    const u = await prisma.user.findUnique({ where: { id: tok.uid } });
    if (!u || !u.active || u.tokenVersion !== tok.tv) return null;
    return { id: u.id, email: u.email, name: u.name, role: u.role };
  } catch (e) {
    console.error('[getAdmin] erro na query:', e instanceof Error ? e.message : e);
    return null;
  }
}

export async function exigirAdmin(): Promise<Admin> {
  const a = await getAdmin();
  if (!a) redirect('/admin/login');
  return a;
}

// Ações sensíveis (gestão de usuários) — só owner.
export async function exigirOwner(): Promise<Admin> {
  const a = await exigirAdmin();
  if (a.role !== 'owner') redirect('/admin?erro=permissao');
  return a;
}
