import { cookies } from 'next/headers';

/**
 * AUTENTICAÇÃO MOCK (scaffold) — NÃO é segura para produção.
 * O cookie não é assinado nem verificado; serve apenas para demonstrar o
 * fluxo login → área protegida → logout. Quando o portal for pra valer,
 * troque por NextAuth/Auth.js ou JWT assinado e valide a sessão no servidor.
 */
export const SESSION_COOKIE = 'perazzo_session';
export const DEMO_PASSWORD = 'demo'; // senha de demonstração

export async function getSession(): Promise<{ email: string } | null> {
  const store = await cookies();
  const v = store.get(SESSION_COOKIE)?.value;
  if (!v) return null;
  try {
    return { email: decodeURIComponent(v) };
  } catch {
    return { email: 'cliente' };
  }
}